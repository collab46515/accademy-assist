import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="borrowing">Borrowing</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="digital">Digital</TabsTrigger>
          <TabsTrigger value="fines">Fines</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <LibraryDashboard />
        </TabsContent>

        <TabsContent value="catalog">
          <BookCatalog />
        </TabsContent>

        <TabsContent value="borrowing">
          <BorrowingReturns />
        </TabsContent>

        <TabsContent value="reservations">
          <BookReservations />
        </TabsContent>

        <TabsContent value="digital">
          <DigitalResources />
        </TabsContent>

        <TabsContent value="fines">
          <LibraryFines />
        </TabsContent>

        <TabsContent value="reports">
          <LibraryReports />
        </TabsContent>

        <TabsContent value="search">
          <BookSearch />
        </TabsContent>
      </Tabs>
    </div>
  );
}