import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join-room' | 'leave-room' | 'chat-message' | 'hand-raise' | 'mute-toggle';
  roomId: string;
  userId: string;
  userName?: string;
  data?: any;
}

// Store active connections per room
const rooms = new Map<string, Set<WebSocket>>();
const userConnections = new Map<WebSocket, { roomId: string; userId: string; userName: string }>();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = () => {
    console.log("WebSocket connection opened for video conferencing");
  };

  socket.onmessage = (event) => {
    try {
      const message: SignalingMessage = JSON.parse(event.data);
      console.log("Received signaling message:", message.type, "for room:", message.roomId);

      switch (message.type) {
        case 'join-room':
          handleJoinRoom(socket, message);
          break;
        case 'leave-room':
          handleLeaveRoom(socket, message);
          break;
        case 'offer':
        case 'answer':
        case 'ice-candidate':
          handleWebRTCSignaling(socket, message);
          break;
        case 'chat-message':
          handleChatMessage(socket, message);
          break;
        case 'hand-raise':
          handleHandRaise(socket, message);
          break;
        case 'mute-toggle':
          handleMuteToggle(socket, message);
          break;
      }
    } catch (error) {
      console.error("Error handling signaling message:", error);
    }
  };

  socket.onclose = () => {
    handleSocketClose(socket);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    handleSocketClose(socket);
  };

  return response;
});

function handleJoinRoom(socket: WebSocket, message: SignalingMessage) {
  const { roomId, userId, userName } = message;
  
  // Add to room
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId)!.add(socket);
  
  // Store user info
  userConnections.set(socket, { roomId, userId, userName: userName || 'Anonymous' });
  
  // Notify others in room about new participant
  broadcastToRoom(roomId, {
    type: 'participant-joined',
    userId,
    userName,
    data: { participantCount: rooms.get(roomId)!.size }
  }, socket);
  
  // Send current participants to new user
  const participants = Array.from(rooms.get(roomId)!).map(ws => {
    const userInfo = userConnections.get(ws);
    return userInfo ? { userId: userInfo.userId, userName: userInfo.userName } : null;
  }).filter(Boolean);
  
  socket.send(JSON.stringify({
    type: 'room-joined',
    participants,
    roomId
  }));
}

function handleLeaveRoom(socket: WebSocket, message: SignalingMessage) {
  handleSocketClose(socket);
}

function handleWebRTCSignaling(socket: WebSocket, message: SignalingMessage) {
  const userInfo = userConnections.get(socket);
  if (!userInfo) return;
  
  // Broadcast WebRTC signaling to all other participants in the room
  broadcastToRoom(userInfo.roomId, {
    ...message,
    fromUserId: userInfo.userId,
    fromUserName: userInfo.userName
  }, socket);
}

function handleChatMessage(socket: WebSocket, message: SignalingMessage) {
  const userInfo = userConnections.get(socket);
  if (!userInfo) return;
  
  // Broadcast chat message to all participants in room
  broadcastToRoom(userInfo.roomId, {
    type: 'chat-message',
    userId: userInfo.userId,
    userName: userInfo.userName,
    data: {
      message: message.data.message,
      timestamp: new Date().toISOString()
    }
  });
}

function handleHandRaise(socket: WebSocket, message: SignalingMessage) {
  const userInfo = userConnections.get(socket);
  if (!userInfo) return;
  
  broadcastToRoom(userInfo.roomId, {
    type: 'hand-raise',
    userId: userInfo.userId,
    userName: userInfo.userName,
    data: { raised: message.data.raised }
  });
}

function handleMuteToggle(socket: WebSocket, message: SignalingMessage) {
  const userInfo = userConnections.get(socket);
  if (!userInfo) return;
  
  broadcastToRoom(userInfo.roomId, {
    type: 'participant-muted',
    userId: userInfo.userId,
    data: { muted: message.data.muted }
  });
}

function handleSocketClose(socket: WebSocket) {
  const userInfo = userConnections.get(socket);
  if (userInfo) {
    const { roomId, userId, userName } = userInfo;
    
    // Remove from room
    const room = rooms.get(roomId);
    if (room) {
      room.delete(socket);
      if (room.size === 0) {
        rooms.delete(roomId);
      } else {
        // Notify others about participant leaving
        broadcastToRoom(roomId, {
          type: 'participant-left',
          userId,
          userName,
          data: { participantCount: room.size }
        });
      }
    }
    
    userConnections.delete(socket);
  }
}

function broadcastToRoom(roomId: string, message: any, excludeSocket?: WebSocket) {
  const room = rooms.get(roomId);
  if (!room) return;
  
  const messageStr = JSON.stringify(message);
  room.forEach((ws) => {
    if (ws !== excludeSocket && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(messageStr);
      } catch (error) {
        console.error("Error sending message to socket:", error);
        room.delete(ws);
      }
    }
  });
}