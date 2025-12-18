import { Routes, Route, Navigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModuleGuard } from "@/components/modules/ModuleGuard";

// New Library Components
import { LibraryDashboardNew } from "@/components/library/new/LibraryDashboardNew";
import { BookCatalogNew } from "@/components/library/new/BookCatalogNew";
import { CirculationNew } from "@/components/library/new/CirculationNew";
import { LibraryMembersNew } from "@/components/library/new/LibraryMembersNew";
import { LibrarySettingsNew } from "@/components/library/new/LibrarySettingsNew";
import { LibraryRacks } from "@/components/library/new/LibraryRacks";
import { LibraryFinesNew } from "@/components/library/new/LibraryFinesNew";
import { LibraryPurchases } from "@/components/library/new/LibraryPurchases";
import { LibraryDonations } from "@/components/library/new/LibraryDonations";
import { LibraryWithdrawals } from "@/components/library/new/LibraryWithdrawals";
import { LibraryStockVerification } from "@/components/library/new/LibraryStockVerification";
import { LibraryReportsNew } from "@/components/library/new/LibraryReportsNew";

export default function LibraryPage() {
  return (
    <ModuleGuard moduleName="Library Management">
      <div className="space-y-6">
        <PageHeader 
          title="Library Management" 
          description="Complete library management with accession tracking, circulation, and compliance registers"
        />
        
        <Routes>
          <Route path="/" element={<Navigate to="/library/dashboard" replace />} />
          <Route path="/dashboard" element={<LibraryDashboardNew />} />
          <Route path="/catalog" element={<BookCatalogNew />} />
          <Route path="/circulation" element={<CirculationNew />} />
          <Route path="/members" element={<LibraryMembersNew />} />
          <Route path="/fines" element={<LibraryFinesNew />} />
          <Route path="/racks" element={<LibraryRacks />} />
          <Route path="/purchases" element={<LibraryPurchases />} />
          <Route path="/donations" element={<LibraryDonations />} />
          <Route path="/withdrawals" element={<LibraryWithdrawals />} />
          <Route path="/stock-verification" element={<LibraryStockVerification />} />
          <Route path="/reports" element={<LibraryReportsNew />} />
          <Route path="/settings" element={<LibrarySettingsNew />} />
        </Routes>
      </div>
    </ModuleGuard>
  );
}
