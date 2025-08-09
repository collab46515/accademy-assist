import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { VirtualClassroomManager } from "@/components/communication/VirtualClassroomManager";
import { EducationalVirtualClassroom } from "@/components/communication/EducationalVirtualClassroom";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/hooks/useAuth";

function MeetingRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  
  if (!user || !id) return <div>Loading...</div>;
  
  return (
    <EducationalVirtualClassroom
      roomId={id}
      userId={user.id}
      userName={user.email?.split('@')[0] || 'Student'}
      userRole="teacher" // This should be determined based on user permissions
      lessonTitle="Mathematics - Algebra Basics"
    />
  );
}

export default function VirtualClassroomPage() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/virtual-classroom/dashboard" replace />} />
        <Route path="/dashboard" element={
          <div className="space-y-6">
            <PageHeader 
              title="Virtual Classrooms" 
              description="Educational virtual classrooms with engagement tools"
            />
            <VirtualClassroomManager />
          </div>
        } />
        <Route path="/meeting/:id" element={<MeetingRoom />} />
      </Routes>
    </div>
  );
}