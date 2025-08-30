import { useState, useEffect } from "react";
import { GraduationCap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FooterContent {
  companyName: string;
  description: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  links: {
    category: string;
    items: { label: string; url: string }[];
  }[];
  copyright: string;
}

const defaultFooterContent: FooterContent = {
  companyName: "Doxa Technology Solutions",
  description: "Comprehensive school management system for academic operations, student services, and administration. Transforming education through innovative technology solutions.",
  address: {
    street: "St Anns Hill Road",
    city: "Chertsey",
    postalCode: "KT16 9NN",
    country: "United Kingdom"
  },
  contact: {
    email: "support@pappaya.co.uk",
    phone: "+44 (0) 1932 123 456",
    website: "www.pappaya.co.uk"
  },
  links: [
    {
      category: "Product",
      items: [
        { label: "All Modules", url: "/modules" },
        { label: "AI Timetable", url: "/ai-timetable" },
        { label: "Student Management", url: "/students" },
        { label: "Fee Management", url: "/fees" }
      ]
    },
    {
      category: "Support",
      items: [
        { label: "Workflows", url: "/workflows" },
        { label: "Help Center", url: "/help" },
        { label: "Contact Support", url: "/support" }
      ]
    },
    {
      category: "Company",
      items: [
        { label: "About Us", url: "/about" },
        { label: "Privacy Policy", url: "/privacy" },
        { label: "Terms of Service", url: "/terms" },
        { label: "Cookie Policy", url: "/cookies" }
      ]
    }
  ],
  copyright: `© ${new Date().getFullYear()} Pappaya (Pappaya Global Limited). All rights reserved.`
};

export function EnhancedFooter() {
  const [content, setContent] = useState<FooterContent>(defaultFooterContent);

  useEffect(() => {
    // Load saved content from localStorage
    const saved = localStorage.getItem('footerContent');
    if (saved) {
      try {
        setContent(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved footer content:', error);
        setContent(defaultFooterContent);
      }
    }
  }, []);


  return (
    <footer className="bg-muted/30 border-t">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-5 md:grid-cols-3">
          {/* Company Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/lovable-uploads/5908f914-4b1a-4234-abb8-009537c792ee.png" alt="DOXA Logo" className="h-4 w-4" />
                <div>
                  <h3 className="text-xl font-bold">{content.companyName}</h3>
                  <p className="text-sm text-muted-foreground">School Management System</p>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                {content.description}
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <div>{content.address.street}</div>
                  <div>{content.address.city}, {content.address.postalCode}</div>
                  <div>{content.address.country}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Navigation Links */}
          {content.links.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-semibold text-foreground">{section.category}</h4>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a
                      href={item.url}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Separator />
      
      {/* Bottom Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            {content.copyright}
          </p>
          
          <div className="flex items-center gap-6">
            <p className="text-xs text-muted-foreground">
              Powered by Pappaya Global Limited
            </p>
            <div className="flex gap-4 text-xs">
              <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
              <a href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}