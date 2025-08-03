import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HRSidebar } from "@/components/hr/HRSidebar";

export function HRLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <HRSidebar />
        <main className="flex-1 flex flex-col">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex h-14 items-center px-4 gap-4">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">Human Resources Management</h1>
            </div>
          </header>
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}