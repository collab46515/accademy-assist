import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  School, 
  Upload, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Palette,
  Shield,
  Settings,
  Save,
  Eye,
  EyeOff,
  Building,
  Users,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from '@/hooks/useRBAC';

interface SchoolInfo {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo_url?: string;
  principal_name: string;
  establishment_type: string;
  status: string;
  founded_year?: number;
  motto?: string;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  academic_year_start?: string;
  academic_year_end?: string;
  total_students?: number;
  total_staff?: number;
}

interface SchoolSettings {
  attendance_settings: {
    auto_mark_absent_after_minutes: number;
    require_parent_approval: boolean;
    send_daily_reports: boolean;
  };
  communication_settings: {
    enable_sms: boolean;
    enable_email: boolean;
    enable_push_notifications: boolean;
    default_language: string;
  };
  security_settings: {
    password_policy: {
      min_length: number;
      require_uppercase: boolean;
      require_numbers: boolean;
      require_symbols: boolean;
    };
    session_timeout_minutes: number;
    two_factor_required: boolean;
  };
  academic_settings: {
    grading_system: string;
    pass_marks: number;
    academic_terms: number;
    working_days: string[];
  };
}

// First School Creator Component for Super Admins
function FirstSchoolCreator() {
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateSchool = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);

    const formData = new FormData(e.currentTarget);
    const schoolData = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      website: formData.get('website') as string,
      principal_name: formData.get('principal_name') as string,
      establishment_type: formData.get('establishment_type') as string,
    };

    try {
      const { error } = await supabase
        .from('schools')
        .insert([schoolData]);

      if (error) throw error;

      toast({
        title: "School Created",
        description: "First school created successfully. You can now access school settings.",
      });

      // Refresh the page to load the new school
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create school",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <form onSubmit={handleCreateSchool} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">School Name</Label>
          <Input id="name" name="name" required placeholder="e.g., St. Mary's Primary School" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">School Code</Label>
          <Input id="code" name="code" required placeholder="e.g., SMPS001" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" name="address" required placeholder="Full school address" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required placeholder="+91 11 xxxx xxxx" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="admin@school.edu" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" placeholder="https://www.school.edu" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="principal_name">Principal Name</Label>
          <Input id="principal_name" name="principal_name" placeholder="Dr. John Smith" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="establishment_type">Establishment Type</Label>
        <select name="establishment_type" id="establishment_type" className="w-full p-2 border border-border rounded-md" required>
          <option value="primary">Primary School</option>
          <option value="secondary">Secondary School</option>
          <option value="combined">Combined School</option>
          <option value="college">College</option>
        </select>
      </div>

      <Button type="submit" className="w-full" disabled={creating}>
        {creating && <span className="animate-spin mr-2">⏳</span>}
        Create First School
      </Button>
    </form>
  );
}

export function SchoolSettingsManager() {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentSchool, isSchoolAdmin, isSuperAdmin, schools } = useRBAC();

  // All hooks must be called before any conditional returns
  useEffect(() => {
    if (currentSchool) {
      fetchSchoolData();
    }
  }, [currentSchool]);

  // Show school creation for super admins when no schools exist
  if (isSuperAdmin() && (!schools || schools.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Create First School
            </CardTitle>
            <CardDescription>
              As a Super Admin, you need to create the first school before accessing school settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <School className="h-4 w-4" />
              <AlertDescription>
                No schools exist in the system yet. Create your first school to get started.
              </AlertDescription>
            </Alert>
            <FirstSchoolCreator />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check admin access
  if (!isSuperAdmin() && !isSchoolAdmin()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Access denied. Only administrators can access School Settings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const fetchSchoolData = async () => {
    if (!currentSchool) return;
    
    try {
      setLoading(true);
      
      // Fetch school basic info
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('*')
        .eq('id', currentSchool.id)
        .single();

      if (schoolError) throw schoolError;

      const schoolDataExtended = schoolData as any; // Type assertion for dynamic fields

      setSchoolInfo({
        id: schoolData.id,
        name: schoolData.name,
        code: schoolData.code,
        address: schoolData.address || '',
        phone: schoolData.contact_phone || '',
        email: schoolData.contact_email || '',
        website: schoolDataExtended.website || '',
        logo_url: schoolDataExtended.logo_url || '',
        principal_name: schoolDataExtended.principal_name || '',
        establishment_type: schoolDataExtended.establishment_type || 'secondary',
        status: schoolDataExtended.status || 'active',
        motto: schoolDataExtended.motto || '',
        founded_year: schoolDataExtended.founded_year || new Date().getFullYear(),
        academic_year_start: schoolDataExtended.academic_year_start || `${new Date().getFullYear()}-09-01`,
        academic_year_end: schoolDataExtended.academic_year_end || `${new Date().getFullYear() + 1}-08-31`,
        total_students: schoolDataExtended.total_students || 0,
        total_staff: schoolDataExtended.total_staff || 0,
        colors: schoolDataExtended.colors || { primary: '#3B82F6', secondary: '#10B981', accent: '#8B5CF6' }
      });

      // Fetch or create default settings
      const defaultSettings: SchoolSettings = {
        attendance_settings: {
          auto_mark_absent_after_minutes: 30,
          require_parent_approval: true,
          send_daily_reports: true
        },
        communication_settings: {
          enable_sms: true,
          enable_email: true,
          enable_push_notifications: true,
          default_language: 'en'
        },
        security_settings: {
          password_policy: {
            min_length: 8,
            require_uppercase: true,
            require_numbers: true,
            require_symbols: false
          },
          session_timeout_minutes: 480,
          two_factor_required: false
        },
        academic_settings: {
          grading_system: 'percentage',
          pass_marks: 40,
          academic_terms: 3,
          working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
      };

      setSchoolSettings(defaultSettings);
    } catch (error) {
      console.error('Error fetching school data:', error);
      toast({
        title: "Error",
        description: "Failed to load school information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile || !currentSchool) return null;

    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${currentSchool.id}/logo.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('school-assets')
        .upload(fileName, logoFile, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('school-assets')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return null;
    }
  };

  const saveSchoolInfo = async () => {
    if (!schoolInfo || !currentSchool) return;

    try {
      setSaving(true);

      let logoUrl = schoolInfo.logo_url;
      if (logoFile) {
        logoUrl = await uploadLogo();
      }

      const { error } = await supabase
        .from('schools')
        .update({
          name: schoolInfo.name,
          code: schoolInfo.code,
          address: schoolInfo.address,
          contact_phone: schoolInfo.phone,
          contact_email: schoolInfo.email,
          website: schoolInfo.website,
          logo_url: logoUrl,
          principal_name: schoolInfo.principal_name,
          establishment_type: schoolInfo.establishment_type,
          motto: schoolInfo.motto,
          founded_year: schoolInfo.founded_year,
          colors: schoolInfo.colors,
          academic_year_start: schoolInfo.academic_year_start,
          academic_year_end: schoolInfo.academic_year_end,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentSchool.id);

      if (error) throw error;

      toast({
        title: "Success", 
        description: logoFile ? "School information and logo updated successfully. Page will refresh to show changes." : "School information updated successfully",
      });

      // Update local state
      if (logoFile) {
        setSchoolInfo(prev => ({ ...prev, logo_url: logoUrl || prev.logo_url }));
        setLogoFile(null);
        setLogoPreview(null);
      }

      // Refresh the data
      await fetchSchoolData();
      
      // Reload page if logo was updated to ensure all components show new logo
      if (logoFile) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Error saving school info:', error);
      toast({
        title: "Error",
        description: "Failed to save school information",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    if (!schoolSettings || !currentSchool) return;

    try {
      setSaving(true);

      // Save settings to a separate table or JSON field
      // For now, we'll use the school's metadata field
      const { error } = await supabase
        .from('schools')
        .update({
          settings: schoolSettings as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentSchool.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "School settings updated successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save school settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-muted rounded animate-pulse"></div>
          <div className="h-64 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!schoolInfo || !schoolSettings) {
    return (
      <Alert>
        <AlertDescription>
          Unable to load school information. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">School Management</h2>
          <p className="text-muted-foreground">Configure school information and system settings</p>
        </div>
        <Badge variant="outline" className="gap-2">
          <School className="h-4 w-4" />
          {schoolInfo.establishment_type}
        </Badge>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">School Info</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>Essential school details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="school-name">School Name</Label>
                    <Input
                      id="school-name"
                      value={schoolInfo.name}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, name: e.target.value })}
                      placeholder="School Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="school-code">School Code</Label>
                    <Input
                      id="school-code"
                      value={schoolInfo.code}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, code: e.target.value })}
                      placeholder="SCH001"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={schoolInfo.address}
                    onChange={(e) => setSchoolInfo({ ...schoolInfo, address: e.target.value })}
                    placeholder="School address"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={schoolInfo.phone}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, phone: e.target.value })}
                      placeholder="+91 11 xxxx xxxx"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={schoolInfo.email}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, email: e.target.value })}
                      placeholder="admin@school.edu"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={schoolInfo.website}
                    onChange={(e) => setSchoolInfo({ ...schoolInfo, website: e.target.value })}
                    placeholder="https://www.school.edu"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Leadership & Identity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Leadership & Identity
                </CardTitle>
                <CardDescription>School leadership and institutional identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="principal">Principal Name</Label>
                  <Input
                    id="principal"
                    value={schoolInfo.principal_name}
                    onChange={(e) => setSchoolInfo({ ...schoolInfo, principal_name: e.target.value })}
                    placeholder="Principal Name"
                  />
                </div>

                <div>
                  <Label htmlFor="motto">School Motto</Label>
                  <Input
                    id="motto"
                    value={schoolInfo.motto}
                    onChange={(e) => setSchoolInfo({ ...schoolInfo, motto: e.target.value })}
                    placeholder="Excellence in Education"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="founded">Founded Year</Label>
                    <Input
                      id="founded"
                      type="number"
                      value={schoolInfo.founded_year}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, founded_year: parseInt(e.target.value) })}
                      placeholder="1995"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Establishment Type</Label>
                    <Input
                      id="type"
                      value={schoolInfo.establishment_type}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, establishment_type: e.target.value })}
                      placeholder="Secondary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="students">Total Students</Label>
                    <Input
                      id="students"
                      type="number"
                      value={schoolInfo.total_students}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, total_students: parseInt(e.target.value) })}
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="staff">Total Staff</Label>
                    <Input
                      id="staff"
                      type="number"
                      value={schoolInfo.total_staff}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, total_staff: parseInt(e.target.value) })}
                      placeholder="50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                if (confirm('Are you sure you want to reset all settings to default values?')) {
                  console.log('Reset settings functionality to be implemented');
                }
              }}
            >
              Reset to Defaults
            </Button>
            <Button onClick={saveSchoolInfo} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save School Information'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  School Logo
                </CardTitle>
                <CardDescription>Upload and manage school branding assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    {logoPreview || schoolInfo.logo_url ? (
                      <div className="space-y-4">
                        <img 
                          src={logoPreview || schoolInfo.logo_url} 
                          alt="School Logo"
                          className="mx-auto h-24 w-24 object-contain"
                        />
                        <p className="text-sm text-muted-foreground">Current logo</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No logo uploaded</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended: PNG or SVG format, 200x200px minimum
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Color Scheme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Scheme
                </CardTitle>
                <CardDescription>Define school brand colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={schoolInfo.colors?.primary}
                        onChange={(e) => setSchoolInfo({
                          ...schoolInfo,
                          colors: { ...schoolInfo.colors!, primary: e.target.value }
                        })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={schoolInfo.colors?.primary}
                        onChange={(e) => setSchoolInfo({
                          ...schoolInfo,
                          colors: { ...schoolInfo.colors!, primary: e.target.value }
                        })}
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={schoolInfo.colors?.secondary}
                        onChange={(e) => setSchoolInfo({
                          ...schoolInfo,
                          colors: { ...schoolInfo.colors!, secondary: e.target.value }
                        })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={schoolInfo.colors?.secondary}
                        onChange={(e) => setSchoolInfo({
                          ...schoolInfo,
                          colors: { ...schoolInfo.colors!, secondary: e.target.value }
                        })}
                        placeholder="#10B981"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="accent-color"
                        type="color"
                        value={schoolInfo.colors?.accent}
                        onChange={(e) => setSchoolInfo({
                          ...schoolInfo,
                          colors: { ...schoolInfo.colors!, accent: e.target.value }
                        })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={schoolInfo.colors?.accent}
                        onChange={(e) => setSchoolInfo({
                          ...schoolInfo,
                          colors: { ...schoolInfo.colors!, accent: e.target.value }
                        })}
                        placeholder="#8B5CF6"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">Color Preview</p>
                    <div className="flex gap-2">
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: schoolInfo.colors?.primary }}
                      ></div>
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: schoolInfo.colors?.secondary }}
                      ></div>
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: schoolInfo.colors?.accent }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Configuration
              </CardTitle>
              <CardDescription>Configure academic year and grading system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="grading-system">Grading System</Label>
                    <select 
                      id="grading-system"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={schoolSettings.academic_settings.grading_system}
                      onChange={(e) => setSchoolSettings({
                        ...schoolSettings,
                        academic_settings: {
                          ...schoolSettings.academic_settings,
                          grading_system: e.target.value
                        }
                      })}
                    >
                      <option value="percentage">Percentage (0-100%)</option>
                      <option value="letter">Letter Grades (A-F)</option>
                      <option value="points">Points (1-10)</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="pass-marks">Pass Marks (%)</Label>
                    <Input
                      id="pass-marks"
                      type="number"
                      value={schoolSettings.academic_settings.pass_marks}
                      onChange={(e) => setSchoolSettings({
                        ...schoolSettings,
                        academic_settings: {
                          ...schoolSettings.academic_settings,
                          pass_marks: parseInt(e.target.value)
                        }
                      })}
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="academic-terms">Academic Terms per Year</Label>
                    <Input
                      id="academic-terms"
                      type="number"
                      value={schoolSettings.academic_settings.academic_terms}
                      onChange={(e) => setSchoolSettings({
                        ...schoolSettings,
                        academic_settings: {
                          ...schoolSettings.academic_settings,
                          academic_terms: parseInt(e.target.value)
                        }
                      })}
                      min="1"
                      max="4"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="year-start">Academic Year Start</Label>
                    <Input
                      id="year-start"
                      type="date"
                      value={schoolInfo.academic_year_start}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, academic_year_start: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="year-end">Academic Year End</Label>
                    <Input
                      id="year-end"
                      type="date"
                      value={schoolInfo.academic_year_end}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, academic_year_end: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Working Days</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Switch
                            id={day}
                            checked={schoolSettings.academic_settings.working_days.includes(day)}
                            onCheckedChange={(checked) => {
                              const workingDays = checked
                                ? [...schoolSettings.academic_settings.working_days, day]
                                : schoolSettings.academic_settings.working_days.filter(d => d !== day);
                              
                              setSchoolSettings({
                                ...schoolSettings,
                                academic_settings: {
                                  ...schoolSettings.academic_settings,
                                  working_days: workingDays
                                }
                              });
                            }}
                          />
                          <Label htmlFor={day} className="text-sm">{day}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure system security parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Password Policy</Label>
                  <div className="space-y-3 mt-2">
                    <div>
                      <Label htmlFor="min-length" className="text-sm">Minimum Length</Label>
                      <Input
                        id="min-length"
                        type="number"
                        value={schoolSettings.security_settings.password_policy.min_length}
                        onChange={(e) => setSchoolSettings({
                          ...schoolSettings,
                          security_settings: {
                            ...schoolSettings.security_settings,
                            password_policy: {
                              ...schoolSettings.security_settings.password_policy,
                              min_length: parseInt(e.target.value)
                            }
                          }
                        })}
                        min="6"
                        max="20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      {[
                        { key: 'require_uppercase', label: 'Require Uppercase Letters' },
                        { key: 'require_numbers', label: 'Require Numbers' },
                        { key: 'require_symbols', label: 'Require Symbols' }
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Switch
                            id={key}
                            checked={schoolSettings.security_settings.password_policy[key as keyof typeof schoolSettings.security_settings.password_policy] as boolean}
                            onCheckedChange={(checked) => setSchoolSettings({
                              ...schoolSettings,
                              security_settings: {
                                ...schoolSettings.security_settings,
                                password_policy: {
                                  ...schoolSettings.security_settings.password_policy,
                                  [key]: checked
                                }
                              }
                            })}
                          />
                          <Label htmlFor={key} className="text-sm">{label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={schoolSettings.security_settings.session_timeout_minutes}
                    onChange={(e) => setSchoolSettings({
                      ...schoolSettings,
                      security_settings: {
                        ...schoolSettings.security_settings,
                        session_timeout_minutes: parseInt(e.target.value)
                      }
                    })}
                    min="30"
                    max="1440"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="two-factor"
                    checked={schoolSettings.security_settings.two_factor_required}
                    onCheckedChange={(checked) => setSchoolSettings({
                      ...schoolSettings,
                      security_settings: {
                        ...schoolSettings.security_settings,
                        two_factor_required: checked
                      }
                    })}
                  />
                  <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                </div>
              </CardContent>
            </Card>

            {/* Communication Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Communication Settings
                </CardTitle>
                <CardDescription>Configure communication preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { key: 'enable_sms', label: 'Enable SMS Notifications' },
                    { key: 'enable_email', label: 'Enable Email Notifications' },
                    { key: 'enable_push_notifications', label: 'Enable Push Notifications' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Switch
                        id={key}
                        checked={schoolSettings.communication_settings[key as keyof typeof schoolSettings.communication_settings] as boolean}
                        onCheckedChange={(checked) => setSchoolSettings({
                          ...schoolSettings,
                          communication_settings: {
                            ...schoolSettings.communication_settings,
                            [key]: checked
                          }
                        })}
                      />
                      <Label htmlFor={key}>{label}</Label>
                    </div>
                  ))}
                </div>

                <div>
                  <Label htmlFor="default-language">Default Language</Label>
                  <select 
                    id="default-language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={schoolSettings.communication_settings.default_language}
                    onChange={(e) => setSchoolSettings({
                      ...schoolSettings,
                      communication_settings: {
                        ...schoolSettings.communication_settings,
                        default_language: e.target.value
                      }
                    })}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                if (confirm('Are you sure you want to reset all system settings to default values? This action cannot be undone.')) {
                  const defaultSettings: SchoolSettings = {
                    attendance_settings: {
                      auto_mark_absent_after_minutes: 30,
                      require_parent_approval: true,
                      send_daily_reports: true
                    },
                    communication_settings: {
                      enable_sms: true,
                      enable_email: true,
                      enable_push_notifications: true,
                      default_language: 'en'
                    },
                    security_settings: {
                      password_policy: {
                        min_length: 8,
                        require_uppercase: true,
                        require_numbers: true,
                        require_symbols: false
                      },
                      session_timeout_minutes: 480,
                      two_factor_required: false
                    },
                    academic_settings: {
                      grading_system: 'percentage',
                      pass_marks: 40,
                      academic_terms: 3,
                      working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
                    }
                  };
                  setSchoolSettings(defaultSettings);
                  toast({
                    title: "Settings Reset",
                    description: "All system settings have been reset to default values. Don't forget to save.",
                  });
                }
              }}
            >
              Reset to Defaults
            </Button>
            <Button onClick={saveSettings} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}