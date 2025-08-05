import { Routes, Route, Navigate } from "react-router-dom";
import { LibraryDashboard } from "@/components/library/LibraryDashboard";
import { BookCatalog } from "@/components/library/BookCatalog";
import { BorrowingReturns } from "@/components/library/BorrowingReturns";
import { BookReservations } from "@/components/library/BookReservations";
import { DigitalResources } from "@/components/library/DigitalResources";
import { LibraryFines } from "@/components/library/LibraryFines";
import { LibraryReports } from "@/components/library/LibraryReports";
import { BookSearch } from "@/components/library/BookSearch";
import { PageHeader } from "@/components/layout/PageHeader";

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Library Management" 
        description="Manage books, digital resources, and library operations"
      />
      
      <Routes>
        <Route path="/" element={<Navigate to="/library/dashboard" replace />} />
        <Route path="/dashboard" element={<LibraryDashboard />} />
        <Route path="/catalog" element={<BookCatalog />} />
        <Route path="/borrowing" element={<BorrowingReturns />} />
        <Route path="/reservations" element={<BookReservations />} />
        <Route path="/digital" element={<DigitalResources />} />
        <Route path="/fines" element={<LibraryFines />} />
        <Route path="/reports" element={<LibraryReports />} />
        <Route path="/search" element={<BookSearch />} />
      </Routes>
    </div>
  );
}