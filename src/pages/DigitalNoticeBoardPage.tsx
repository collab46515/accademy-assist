import { Routes, Route, Navigate } from "react-router-dom";
import { DigitalNoticeBoard } from "@/components/communication/DigitalNoticeBoard";
import { AnnouncementsManager } from "@/components/communication/AnnouncementsManager";
import { PageHeader } from "@/components/layout/PageHeader";

export default function DigitalNoticeBoardPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Digital Notice Board" 
        description="School-wide announcements with read receipts and priority levels"
      />
      
      <Routes>
        <Route path="/" element={<Navigate to="/notice-board/view" replace />} />
        <Route path="/view" element={<DigitalNoticeBoard />} />
        <Route path="/manage" element={<AnnouncementsManager />} />
      </Routes>
    </div>
  );
}