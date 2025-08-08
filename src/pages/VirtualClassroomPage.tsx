import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { VirtualClassroomManager } from "@/components/communication/VirtualClassroomManager";
import { EnhancedVideoConference } from "@/components/communication/EnhancedVideoConference";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/hooks/useAuth";

function MeetingRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  
  if (!user || !id) return <div>Loading...</div>;
  
  return (
    <EnhancedVideoConference
      roomId={id}
      userId={user.id}
      userName={user.email || 'Anonymous'}
      isHost={true} // This should be determined based on meeting ownership
    />
  );
}

export default function VirtualClassroomPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Virtual Classrooms" 
        description="AI-powered video conferencing with interactive features"
      />
      
      <Routes>
        <Route path="/" element={<Navigate to="/virtual-classroom/dashboard" replace />} />
        <Route path="/dashboard" element={<VirtualClassroomManager />} />
        <Route path="/meeting/:id" element={<MeetingRoom />} />
      </Routes>
    </div>
  );
}