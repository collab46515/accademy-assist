import { Routes, Route, Navigate } from "react-router-dom";
import { VirtualClassroomManager } from "@/components/communication/VirtualClassroomManager";
import { VideoConferenceInterface } from "@/components/communication/VideoConferenceInterface";
import { PageHeader } from "@/components/layout/PageHeader";

export default function VirtualClassroomPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Virtual Classrooms" 
        description="Built-in virtual classrooms and parent-teacher meetings"
      />
      
      <Routes>
        <Route path="/" element={<Navigate to="/virtual-classroom/dashboard" replace />} />
        <Route path="/dashboard" element={<VirtualClassroomManager />} />
        <Route path="/meeting/:id" element={<VideoConferenceInterface />} />
      </Routes>
    </div>
  );
}