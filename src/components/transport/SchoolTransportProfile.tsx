import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Building2, MapPin, Phone, Mail, User, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTransportData } from '@/hooks/useTransportData';
import { toast } from 'sonner';

interface SchoolProfile {
  id: string;
  name: string;
  address?: string;
  contact_phone?: string;
  contact_email?: string;
  principal_name?: string;
  // Transport-specific fields
  transport_admin_name?: string;
  transport_admin_phone?: string;
  transport_admin_email?: string;
  school_head_name?: string;
  school_head_phone?: string;
  school_head_email?: string;
  gps_latitude?: number;
  gps_longitude?: number;
  geofence_radius_meters?: number;
  branch_name?: string;
  branch_principal_name?: string;
  branch_principal_phone?: string;
  branch_principal_email?: string;
}

export const SchoolTransportProfile = () => {
  const { userSchoolId } = useTransportData();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<SchoolProfile | null>(null);

  useEffect(() => {
    if (userSchoolId) {
      fetchSchoolProfile();
    }
  }, [userSchoolId]);

  const fetchSchoolProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('id', userSchoolId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching school profile:', err);
      toast.error('Failed to load school profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !userSchoolId) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('schools')
        .update({
          transport_admin_name: profile.transport_admin_name,
          transport_admin_phone: profile.transport_admin_phone,
          transport_admin_email: profile.transport_admin_email,
          school_head_name: profile.school_head_name,
          school_head_phone: profile.school_head_phone,
          school_head_email: profile.school_head_email,
          gps_latitude: profile.gps_latitude,
          gps_longitude: profile.gps_longitude,
          geofence_radius_meters: profile.geofence_radius_meters,
          branch_name: profile.branch_name,
          branch_principal_name: profile.branch_principal_name,
          branch_principal_phone: profile.branch_principal_phone,
          branch_principal_email: profile.branch_principal_email,
        })
        .eq('id', userSchoolId);

      if (error) throw error;
      toast.success('School transport profile updated successfully');
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof SchoolProfile, value: string | number | null) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No school profile found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* School Profile (Tenant Level) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            School Profile (Tenant Level)
          </CardTitle>
          <CardDescription>
            Main school information and transport administration contacts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>School Name</Label>
              <Input value={profile.name} disabled className="bg-muted" />
            </div>
            <div>
              <Label>Office Address</Label>
              <Input value={profile.address || ''} disabled className="bg-muted" />
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Head Transport Admin
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="transport_admin_name">Name</Label>
                <Input
                  id="transport_admin_name"
                  value={profile.transport_admin_name || ''}
                  onChange={(e) => updateField('transport_admin_name', e.target.value)}
                  placeholder="Transport Admin Name"
                />
              </div>
              <div>
                <Label htmlFor="transport_admin_phone">Phone</Label>
                <Input
                  id="transport_admin_phone"
                  value={profile.transport_admin_phone || ''}
                  onChange={(e) => updateField('transport_admin_phone', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <Label htmlFor="transport_admin_email">Email</Label>
                <Input
                  id="transport_admin_email"
                  type="email"
                  value={profile.transport_admin_email || ''}
                  onChange={(e) => updateField('transport_admin_email', e.target.value)}
                  placeholder="transport@school.edu"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              School Head (Director / CEO / Founder)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="school_head_name">Name</Label>
                <Input
                  id="school_head_name"
                  value={profile.school_head_name || ''}
                  onChange={(e) => updateField('school_head_name', e.target.value)}
                  placeholder="School Head Name"
                />
              </div>
              <div>
                <Label htmlFor="school_head_phone">Phone</Label>
                <Input
                  id="school_head_phone"
                  value={profile.school_head_phone || ''}
                  onChange={(e) => updateField('school_head_phone', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <Label htmlFor="school_head_email">Email</Label>
                <Input
                  id="school_head_email"
                  type="email"
                  value={profile.school_head_email || ''}
                  onChange={(e) => updateField('school_head_email', e.target.value)}
                  placeholder="head@school.edu"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branch Profile (Operational Level) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Branch Profile (Operational Level)
          </CardTitle>
          <CardDescription>
            Branch-level contacts and location settings for transport operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="branch_name">Branch Name</Label>
              <Input
                id="branch_name"
                value={profile.branch_name || ''}
                onChange={(e) => updateField('branch_name', e.target.value)}
                placeholder="Main Campus / Branch Identifier"
              />
            </div>
            <div>
              <Label>Branch Address</Label>
              <Input value={profile.address || ''} disabled className="bg-muted" />
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              GPS Coordinates & Geofencing
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="gps_latitude">Latitude</Label>
                <Input
                  id="gps_latitude"
                  type="number"
                  step="0.00000001"
                  value={profile.gps_latitude || ''}
                  onChange={(e) => updateField('gps_latitude', parseFloat(e.target.value) || null)}
                  placeholder="12.9716"
                />
              </div>
              <div>
                <Label htmlFor="gps_longitude">Longitude</Label>
                <Input
                  id="gps_longitude"
                  type="number"
                  step="0.00000001"
                  value={profile.gps_longitude || ''}
                  onChange={(e) => updateField('gps_longitude', parseFloat(e.target.value) || null)}
                  placeholder="77.5946"
                />
              </div>
              <div>
                <Label htmlFor="geofence_radius_meters">Geofence Radius (meters)</Label>
                <Input
                  id="geofence_radius_meters"
                  type="number"
                  min="10"
                  max="1000"
                  value={profile.geofence_radius_meters || 100}
                  onChange={(e) => updateField('geofence_radius_meters', parseInt(e.target.value) || 100)}
                  placeholder="100"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Distance for "School Zone" arrival detection
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Branch Principal
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="branch_principal_name">Name</Label>
                <Input
                  id="branch_principal_name"
                  value={profile.branch_principal_name || ''}
                  onChange={(e) => updateField('branch_principal_name', e.target.value)}
                  placeholder="Branch Principal Name"
                />
              </div>
              <div>
                <Label htmlFor="branch_principal_phone">Phone</Label>
                <Input
                  id="branch_principal_phone"
                  value={profile.branch_principal_phone || ''}
                  onChange={(e) => updateField('branch_principal_phone', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <Label htmlFor="branch_principal_email">Email</Label>
                <Input
                  id="branch_principal_email"
                  type="email"
                  value={profile.branch_principal_email || ''}
                  onChange={(e) => updateField('branch_principal_email', e.target.value)}
                  placeholder="principal@school.edu"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
