import { FooterContentManager } from "@/components/admin/FooterContentManager";
import { PageHeader } from "@/components/layout/PageHeader";

export default function FooterCMSPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Footer Content Management"
        description="Manage your website footer content and company information"
      />
      
      <div className="container mx-auto px-4 py-8">
        <FooterContentManager />
      </div>
    </div>
  );
}