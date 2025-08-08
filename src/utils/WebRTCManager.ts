import { supabase } from '@/integrations/supabase/client';

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: 'host' | 'participant' | 'teacher' | 'student';
  isMuted: boolean;
  hasVideo: boolean;
  isHandRaised: boolean;
  isScreenSharing?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'system';
}

export class WebRTCManager {
  private ws: WebSocket | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private roomId: string = '';
  private userId: string = '';
  private userName: string = '';
  private isHost: boolean = false;
  
  // Callbacks
  public onParticipantJoined?: (participant: Participant) => void;
  public onParticipantLeft?: (participantId: string) => void;
  public onChatMessage?: (message: ChatMessage) => void;
  public onHandRaise?: (participantId: string, raised: boolean) => void;
  public onParticipantMuted?: (participantId: string, muted: boolean) => void;
  public onRemoteStream?: (participantId: string, stream: MediaStream) => void;
  public onConnectionStateChange?: (state: 'connecting' | 'connected' | 'disconnected' | 'error') => void;

  private iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ];

  async initializeConnection(roomId: string, userId: string, userName: string, isHost: boolean = false) {
    this.roomId = roomId;
    this.userId = userId;
    this.userName = userName;
    this.isHost = isHost;

    try {
      // Get project ID for WebSocket URL - using a direct approach
      const projectId = window.location.hostname.includes('lovableproject.com') 
        ? '043e5de6-0e75-40f4-bd46-c34c0ce43ff7'
        : 'localhost:54321';
      const wsUrl = projectId === 'localhost:54321' 
        ? `ws://localhost:54321/functions/v1/video-conference-signaling`
        : `wss://${projectId}.functions.supabase.co/functions/v1/video-conference-signaling`;
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.onConnectionStateChange?.('connected');
        this.joinRoom();
      };

      this.ws.onmessage = (event) => {
        this.handleSignalingMessage(JSON.parse(event.data));
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.onConnectionStateChange?.('disconnected');
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.onConnectionStateChange?.('error');
      };

      // Initialize local media
      await this.initializeLocalMedia();

    } catch (error) {
      console.error('Failed to initialize WebRTC connection:', error);
      this.onConnectionStateChange?.('error');
      throw error;
    }
  }

  private async initializeLocalMedia() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      console.log('Local media stream initialized');
    } catch (error) {
      console.error('Failed to get local media:', error);
      throw error;
    }
  }

  private joinRoom() {
    if (!this.ws) return;
    
    this.ws.send(JSON.stringify({
      type: 'join-room',
      roomId: this.roomId,
      userId: this.userId,
      userName: this.userName
    }));
  }

  private async handleSignalingMessage(message: any) {
    console.log('Received signaling message:', message.type);

    switch (message.type) {
      case 'room-joined':
        console.log('Joined room with participants:', message.participants);
        break;
        
      case 'participant-joined':
        this.onParticipantJoined?.({
          id: message.userId,
          name: message.userName,
          role: 'participant',
          isMuted: false,
          hasVideo: true,
          isHandRaised: false
        });
        await this.createPeerConnection(message.userId);
        break;
        
      case 'participant-left':
        this.onParticipantLeft?.(message.userId);
        this.removePeerConnection(message.userId);
        break;
        
      case 'offer':
        await this.handleOffer(message);
        break;
        
      case 'answer':
        await this.handleAnswer(message);
        break;
        
      case 'ice-candidate':
        await this.handleIceCandidate(message);
        break;
        
      case 'chat-message':
        this.onChatMessage?.({
          id: Date.now().toString(),
          sender: message.userId,
          senderName: message.userName,
          message: message.data.message,
          timestamp: message.data.timestamp,
          type: 'text'
        });
        break;
        
      case 'hand-raise':
        this.onHandRaise?.(message.userId, message.data.raised);
        break;
        
      case 'participant-muted':
        this.onParticipantMuted?.(message.userId, message.data.muted);
        break;
    }
  }

  private async createPeerConnection(participantId: string) {
    const pc = new RTCPeerConnection({ iceServers: this.iceServers });
    
    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log('Received remote stream from:', participantId);
      this.onRemoteStream?.(participantId, event.streams[0]);
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && this.ws) {
        this.ws.send(JSON.stringify({
          type: 'ice-candidate',
          roomId: this.roomId,
          userId: this.userId,
          data: event.candidate
        }));
      }
    };

    this.peerConnections.set(participantId, pc);

    // Create and send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    if (this.ws) {
      this.ws.send(JSON.stringify({
        type: 'offer',
        roomId: this.roomId,
        userId: this.userId,
        data: offer
      }));
    }
  }

  private async handleOffer(message: any) {
    const pc = new RTCPeerConnection({ iceServers: this.iceServers });
    
    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log('Received remote stream from:', message.fromUserId);
      this.onRemoteStream?.(message.fromUserId, event.streams[0]);
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && this.ws) {
        this.ws.send(JSON.stringify({
          type: 'ice-candidate',
          roomId: this.roomId,
          userId: this.userId,
          data: event.candidate
        }));
      }
    };

    this.peerConnections.set(message.fromUserId, pc);

    await pc.setRemoteDescription(message.data);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    if (this.ws) {
      this.ws.send(JSON.stringify({
        type: 'answer',
        roomId: this.roomId,
        userId: this.userId,
        data: answer
      }));
    }
  }

  private async handleAnswer(message: any) {
    const pc = this.peerConnections.get(message.fromUserId);
    if (pc) {
      await pc.setRemoteDescription(message.data);
    }
  }

  private async handleIceCandidate(message: any) {
    const pc = this.peerConnections.get(message.fromUserId);
    if (pc) {
      await pc.addIceCandidate(message.data);
    }
  }

  private removePeerConnection(participantId: string) {
    const pc = this.peerConnections.get(participantId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(participantId);
    }
  }

  // Public methods
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  sendChatMessage(message: string) {
    if (this.ws) {
      this.ws.send(JSON.stringify({
        type: 'chat-message',
        roomId: this.roomId,
        userId: this.userId,
        data: { message }
      }));
    }
  }

  toggleHand(raised: boolean) {
    if (this.ws) {
      this.ws.send(JSON.stringify({
        type: 'hand-raise',
        roomId: this.roomId,
        userId: this.userId,
        data: { raised }
      }));
    }
  }

  toggleMute(muted: boolean) {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !muted;
      }
    }

    if (this.ws) {
      this.ws.send(JSON.stringify({
        type: 'mute-toggle',
        roomId: this.roomId,
        userId: this.userId,
        data: { muted }
      }));
    }
  }

  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = enabled;
      }
    }
  }

  async startScreenShare(): Promise<MediaStream | null> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      // Replace video track in all peer connections
      const videoTrack = screenStream.getVideoTracks()[0];
      this.peerConnections.forEach(async (pc) => {
        const sender = pc.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
      });

      return screenStream;
    } catch (error) {
      console.error('Failed to start screen sharing:', error);
      return null;
    }
  }

  async stopScreenShare() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      
      // Replace screen share track back to camera
      this.peerConnections.forEach(async (pc) => {
        const sender = pc.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender && videoTrack) {
          await sender.replaceTrack(videoTrack);
        }
      });
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.send(JSON.stringify({
        type: 'leave-room',
        roomId: this.roomId,
        userId: this.userId
      }));
      this.ws.close();
    }

    // Close all peer connections
    this.peerConnections.forEach(pc => pc.close());
    this.peerConnections.clear();

    // Stop local media
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }
}