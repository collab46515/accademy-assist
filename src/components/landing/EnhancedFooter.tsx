import { useState, useEffect } from "react";
import { GraduationCap, Mail, Phone, MapPin, ExternalLink, Linkedin, Twitter, Facebook } from "lucide-react";
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
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  links: {
    category: string;
    items: { label: string; url: string }[];
  }[];
  copyright: string;
}

const defaultFooterContent: FooterContent = {
  companyName: "Pappaya Academy",
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
  socialLinks: {
    linkedin: "https://linkedin.com/company/pappaya",
    twitter: "https://twitter.com/pappaya",
    facebook: "https://facebook.com/pappaya"
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
        { label: "User Guides", url: "/guides" },
        { label: "Video Tutorials", url: "/tutorials" },
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

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  return (
    <footer className="bg-muted/30 border-t">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-5 md:grid-cols-3">
          {/* Company Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/lovable-uploads/0a977b5c-549a-4597-a296-a9e51592864a.png" alt="Pappaya Academy Logo" className="h-8 w-8" />
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
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a 
                  href={`mailto:${content.contact.email}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {content.contact.email}
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a 
                  href={`tel:${content.contact.phone.replace(/\s/g, '')}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {content.contact.phone}
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {Object.entries(content.socialLinks).map(([platform, url]) => (
                url && (
                  <Button
                    key={platform}
                    variant="outline"
                    size="sm"
                    asChild
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={`Follow us on ${platform}`}
                    >
                      {getSocialIcon(platform)}
                    </a>
                  </Button>
                )
              ))}
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