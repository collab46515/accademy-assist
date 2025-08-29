import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, Phone, MapPin, Globe, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  companyName: "Doxa Technology Solutions",
  description: "Comprehensive school management system for academic operations, student services, and administration. Transforming education through innovative technology solutions.",
  address: {
    street: "St Anns Hill Road",
    city: "Chertsey",
    postalCode: "KT16 9NN",
    country: "United Kingdom"
  },
  contact: {
    email: "support@doxa.co.uk",
    phone: "+44 (0) 1932 123 456",
    website: "www.doxa.co.uk"
  },
  socialLinks: {
    linkedin: "https://linkedin.com/company/doxa",
    twitter: "https://twitter.com/doxa",
    facebook: "https://facebook.com/doxa"
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
  copyright: `© ${new Date().getFullYear()} Doxa Technology Solutions. All rights reserved.`
};

export function FooterContentManager() {
  const [content, setContent] = useState<FooterContent>(defaultFooterContent);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved content from localStorage
    const saved = localStorage.getItem('footerContent');
    if (saved) {
      try {
        setContent(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved footer content:', error);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('footerContent', JSON.stringify(content));
    setHasChanges(false);
    toast({
      title: "Footer Content Updated",
      description: "Changes have been saved successfully.",
    });
  };

  const handleReset = () => {
    setContent(defaultFooterContent);
    setHasChanges(true);
    toast({
      title: "Content Reset",
      description: "Footer content has been reset to default values.",
    });
  };

  const updateContent = (path: string, value: any) => {
    setContent(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let current: any = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Footer Content Management</h2>
          <p className="text-muted-foreground">
            Manage your website footer content, company information, and links.
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Badge variant="outline" className="text-warning border-warning/20">
              Unsaved Changes
            </Badge>
          )}
          <Button variant="outline" onClick={handleReset} size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company">Company Info</TabsTrigger>
          <TabsTrigger value="contact">Contact Details</TabsTrigger>
          <TabsTrigger value="links">Navigation Links</TabsTrigger>
          <TabsTrigger value="legal">Legal & Copyright</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Basic company details and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={content.companyName}
                  onChange={(e) => updateContent('companyName', e.target.value)}
                  placeholder="Academy Assist"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={content.description}
                  onChange={(e) => updateContent('description', e.target.value)}
                  placeholder="Company description..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={content.address.street}
                    onChange={(e) => updateContent('address.street', e.target.value)}
                    placeholder="St Anns Hill Road"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={content.address.city}
                    onChange={(e) => updateContent('address.city', e.target.value)}
                    placeholder="Chertsey"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={content.address.postalCode}
                    onChange={(e) => updateContent('address.postalCode', e.target.value)}
                    placeholder="KT16 9NN"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={content.address.country}
                    onChange={(e) => updateContent('address.country', e.target.value)}
                    placeholder="United Kingdom"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={content.contact.email}
                    onChange={(e) => updateContent('contact.email', e.target.value)}
                    placeholder="support@academyassist.co.uk"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={content.contact.phone}
                    onChange={(e) => updateContent('contact.phone', e.target.value)}
                    placeholder="+44 (0) 1932 123 456"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={content.contact.website}
                    onChange={(e) => updateContent('contact.website', e.target.value)}
                    placeholder="www.academyassist.co.uk"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Links</CardTitle>
              <CardDescription>
                Manage footer navigation sections and links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {content.links.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        value={section.category}
                        onChange={(e) => updateContent(`links.${sectionIndex}.category`, e.target.value)}
                        placeholder="Section name"
                        className="w-48"
                      />
                    </div>
                    
                    <div className="grid gap-2 ml-4">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-2">
                          <Input
                            value={item.label}
                            onChange={(e) => {
                              const newItems = [...section.items];
                              newItems[itemIndex] = { ...item, label: e.target.value };
                              updateContent(`links.${sectionIndex}.items`, newItems);
                            }}
                            placeholder="Link label"
                            className="flex-1"
                          />
                          <Input
                            value={item.url}
                            onChange={(e) => {
                              const newItems = [...section.items];
                              newItems[itemIndex] = { ...item, url: e.target.value };
                              updateContent(`links.${sectionIndex}.items`, newItems);
                            }}
                            placeholder="URL"
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {sectionIndex < content.links.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Copyright & Legal</CardTitle>
              <CardDescription>
                Copyright notice and legal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="copyright">Copyright Notice</Label>
                <Textarea
                  id="copyright"
                  value={content.copyright}
                  onChange={(e) => updateContent('copyright', e.target.value)}
                  placeholder="Copyright notice..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}