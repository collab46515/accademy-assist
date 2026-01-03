import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  Plus,
  Search,
  UserCheck,
  Phone,
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Shield,
  FileText,
  Upload,
  Briefcase
} from 'lucide-react';
import { useTransportData, type Driver } from '@/hooks/useTransportData';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { DriverDocumentUploader } from './DriverDocumentUploader';

const driverFormSchema = z.object({
  employee_id: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  license_number: z.string().optional(),
  license_expiry: z.date().optional(),
  license_type: z.array(z.string()).default([]),
  hire_date: z.date().optional(),
  birth_date: z.date().optional(),
  address: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  status: z.string().default('active'),
  dbs_check_date: z.date().optional(),
  dbs_expiry: z.date().optional(),
  first_aid_cert_date: z.date().optional(),
  first_aid_expiry: z.date().optional(),
  notes: z.string().optional(),
  // KYC fields
  aadhar_number: z.string().optional(),
  photo_url: z.string().optional(),
  blood_group: z.string().optional(),
  gender: z.string().optional(),
  // Background check
  background_check_status: z.string().optional(),
  background_check_date: z.date().optional(),
  police_verification_status: z.string().optional(),
  // Medical fitness
  medical_fitness_date: z.date().optional(),
  medical_fitness_expiry: z.date().optional(),
  // Driver-specific qualifications
  psv_badge_number: z.string().optional(),
  psv_badge_expiry: z.date().optional(),
  hmv_permit_number: z.string().optional(),
  hmv_permit_expiry: z.date().optional(),
  // Employment
  employee_type: z.string().optional(),
  // Document URLs (excluding photo_url which is already defined above)
  aadhar_document_url: z.string().optional(),
  background_check_document_url: z.string().optional(),
  medical_certificate_url: z.string().optional(),
  license_document_url: z.string().optional(),
  psv_badge_document_url: z.string().optional(),
  hmv_permit_document_url: z.string().optional(),
});

type DriverFormData = z.infer<typeof driverFormSchema>;

export const DriversManager = () => {
  const { drivers, loading, addDriver, updateDriver, deleteDriver, userSchoolId } = useTransportData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const form = useForm<DriverFormData>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      employee_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      license_number: '',
      license_type: ['B'],
      status: 'active',
      license_expiry: new Date(),
      hire_date: new Date(),
    }
  });

  const filteredDrivers = drivers.filter(driver =>
    driver.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.includes(searchTerm)
  );

  const formatDateSafely = (date: Date | undefined) => {
    if (!date || isNaN(date.getTime())) return undefined;
    return format(date, 'yyyy-MM-dd');
  };

  const handleSubmit = async (data: DriverFormData) => {
    if (!userSchoolId) {
      toast.error('No school association found. Please contact administrator.');
      return;
    }

    try {
      const driverData: Omit<Driver, "id" | "created_at" | "updated_at"> = {
        employee_id: data.employee_id || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || null,
        phone: data.phone || '',
        license_number: data.license_number || '',
        license_expiry: data.license_expiry ? format(data.license_expiry, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        license_type: data.license_type || ['B'],
        hire_date: data.hire_date ? format(data.hire_date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        birth_date: data.birth_date ? format(data.birth_date, 'yyyy-MM-dd') : null,
        address: data.address || null,
        emergency_contact_name: data.emergency_contact_name || null,
        emergency_contact_phone: data.emergency_contact_phone || null,
        status: data.status || 'active',
        dbs_check_date: data.dbs_check_date ? format(data.dbs_check_date, 'yyyy-MM-dd') : null,
        dbs_expiry: data.dbs_expiry ? format(data.dbs_expiry, 'yyyy-MM-dd') : null,
        first_aid_cert_date: data.first_aid_cert_date ? format(data.first_aid_cert_date, 'yyyy-MM-dd') : null,
        first_aid_expiry: data.first_aid_expiry ? format(data.first_aid_expiry, 'yyyy-MM-dd') : null,
        notes: data.notes || null,
        school_id: userSchoolId,
        // KYC fields
        aadhar_number: data.aadhar_number || null,
        photo_url: data.photo_url || null,
        blood_group: data.blood_group || null,
        gender: data.gender || null,
        // Background check
        background_check_status: data.background_check_status || null,
        background_check_date: data.background_check_date ? format(data.background_check_date, 'yyyy-MM-dd') : null,
        police_verification_status: data.police_verification_status || null,
        // Medical fitness
        medical_fitness_date: data.medical_fitness_date ? format(data.medical_fitness_date, 'yyyy-MM-dd') : null,
        medical_fitness_expiry: data.medical_fitness_expiry ? format(data.medical_fitness_expiry, 'yyyy-MM-dd') : null,
        // Driver qualifications
        psv_badge_number: data.psv_badge_number || null,
        psv_badge_expiry: data.psv_badge_expiry ? format(data.psv_badge_expiry, 'yyyy-MM-dd') : null,
        hmv_permit_number: data.hmv_permit_number || null,
        hmv_permit_expiry: data.hmv_permit_expiry ? format(data.hmv_permit_expiry, 'yyyy-MM-dd') : null,
        employee_type: data.employee_type || null,
        // Document URLs
        aadhar_document_url: data.aadhar_document_url || null,
        background_check_document_url: data.background_check_document_url || null,
        medical_certificate_url: data.medical_certificate_url || null,
        license_document_url: data.license_document_url || null,
        psv_badge_document_url: data.psv_badge_document_url || null,
        hmv_permit_document_url: data.hmv_permit_document_url || null,
      };

      if (editingDriver) {
        await updateDriver(editingDriver.id, driverData);
      } else {
        await addDriver(driverData);
      }

      setIsFormOpen(false);
      setEditingDriver(null);
      form.reset();
    } catch (error) {
      console.error('Failed to save driver:', error);
    }
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    form.reset({
      employee_id: driver.employee_id,
      first_name: driver.first_name,
      last_name: driver.last_name,
      email: driver.email || '',
      phone: driver.phone,
      license_number: driver.license_number,
      license_expiry: new Date(driver.license_expiry),
      license_type: driver.license_type,
      hire_date: new Date(driver.hire_date),
      birth_date: driver.birth_date ? new Date(driver.birth_date) : undefined,
      address: driver.address || '',
      emergency_contact_name: driver.emergency_contact_name || '',
      emergency_contact_phone: driver.emergency_contact_phone || '',
      status: driver.status,
      dbs_check_date: driver.dbs_check_date ? new Date(driver.dbs_check_date) : undefined,
      dbs_expiry: driver.dbs_expiry ? new Date(driver.dbs_expiry) : undefined,
      first_aid_cert_date: driver.first_aid_cert_date ? new Date(driver.first_aid_cert_date) : undefined,
      first_aid_expiry: driver.first_aid_expiry ? new Date(driver.first_aid_expiry) : undefined,
      notes: driver.notes || '',
      // KYC fields
      aadhar_number: driver.aadhar_number || '',
      photo_url: driver.photo_url || '',
      blood_group: driver.blood_group || '',
      gender: driver.gender || '',
      // Background check
      background_check_status: driver.background_check_status || '',
      background_check_date: driver.background_check_date ? new Date(driver.background_check_date) : undefined,
      police_verification_status: driver.police_verification_status || '',
      // Medical fitness
      medical_fitness_date: driver.medical_fitness_date ? new Date(driver.medical_fitness_date) : undefined,
      medical_fitness_expiry: driver.medical_fitness_expiry ? new Date(driver.medical_fitness_expiry) : undefined,
      // Driver qualifications
      psv_badge_number: driver.psv_badge_number || '',
      psv_badge_expiry: driver.psv_badge_expiry ? new Date(driver.psv_badge_expiry) : undefined,
      hmv_permit_number: driver.hmv_permit_number || '',
      hmv_permit_expiry: driver.hmv_permit_expiry ? new Date(driver.hmv_permit_expiry) : undefined,
      employee_type: driver.employee_type || '',
      // Document URLs
      aadhar_document_url: driver.aadhar_document_url || '',
      background_check_document_url: driver.background_check_document_url || '',
      medical_certificate_url: driver.medical_certificate_url || '',
      license_document_url: driver.license_document_url || '',
      psv_badge_document_url: driver.psv_badge_document_url || '',
      hmv_permit_document_url: driver.hmv_permit_document_url || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDriver(id);
    } catch (error) {
      console.error('Failed to delete driver:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysDifference = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDifference <= 30;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Drivers Management</h2>
          <p className="text-muted-foreground">Manage driver information, licenses, and certifications</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingDriver(null); form.reset(); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</DialogTitle>
              <DialogDescription>
                Enter the driver's information and certification details.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <FormField
                      control={form.control}
                      name="employee_id"
                      render={({ field }) => (
                         <FormItem>
                           <FormLabel>Employee ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="EMP001" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                           <FormItem>
                             <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                           <FormItem>
                             <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                         <FormItem>
                           <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* License & Certification */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">License & Certification</h3>
                    <FormField
                      control={form.control}
                      name="license_number"
                      render={({ field }) => (
                         <FormItem>
                           <FormLabel>License Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                       control={form.control}
                       name="license_expiry"
                       render={({ field }) => (
                         <FormItem className="flex flex-col">
                           <FormLabel>License Expiry</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                         <FormItem>
                           <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                       control={form.control}
                       name="hire_date"
                       render={({ field }) => (
                         <FormItem className="flex flex-col">
                           <FormLabel>Hire Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="emergency_contact_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergency_contact_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* KYC Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">KYC Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="aadhar_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aadhar Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="XXXX XXXX XXXX" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="blood_group"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Group</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="employee_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="driver">Driver</SelectItem>
                              <SelectItem value="attender">Attender</SelectItem>
                              <SelectItem value="both">Driver & Attender</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Background Check & Verification */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Background Check & Verification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="background_check_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Background Check Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="cleared">Cleared</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="police_verification_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Police Verification Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="verified">Verified</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Medical Fitness */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Medical Fitness</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="medical_fitness_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Medical Fitness Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="medical_fitness_expiry"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Medical Fitness Expiry</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Driver Qualifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Driver Qualifications (Driver Only)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="psv_badge_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PSV Badge Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Badge number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="psv_badge_expiry"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>PSV Badge Expiry</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hmv_permit_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heavy Vehicle Permit Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="HMV permit number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hmv_permit_expiry"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>HMV Permit Validity</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Document Uploads */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Document Uploads
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Photo Upload */}
                    <div className="space-y-2">
                      <Label>Recent Photo</Label>
                      <DriverDocumentUploader
                        driverId={editingDriver?.id}
                        documentType="photo"
                        documentLabel="Photo"
                        currentUrl={form.watch('photo_url')}
                        onUploadComplete={(url) => form.setValue('photo_url', url)}
                        onRemove={() => form.setValue('photo_url', '')}
                        schoolId={userSchoolId || ''}
                      />
                    </div>

                    {/* Aadhar Document */}
                    <div className="space-y-2">
                      <Label>Aadhar Document</Label>
                      <DriverDocumentUploader
                        driverId={editingDriver?.id}
                        documentType="aadhar"
                        documentLabel="Aadhar"
                        currentUrl={form.watch('aadhar_document_url')}
                        onUploadComplete={(url) => form.setValue('aadhar_document_url', url)}
                        onRemove={() => form.setValue('aadhar_document_url', '')}
                        schoolId={userSchoolId || ''}
                      />
                    </div>

                    {/* Background Check Report */}
                    <div className="space-y-2">
                      <Label>Background Check Report</Label>
                      <DriverDocumentUploader
                        driverId={editingDriver?.id}
                        documentType="background_check"
                        documentLabel="Background Check"
                        currentUrl={form.watch('background_check_document_url')}
                        onUploadComplete={(url) => form.setValue('background_check_document_url', url)}
                        onRemove={() => form.setValue('background_check_document_url', '')}
                        schoolId={userSchoolId || ''}
                      />
                    </div>

                    {/* Medical Certificate */}
                    <div className="space-y-2">
                      <Label>Medical Fitness Certificate</Label>
                      <DriverDocumentUploader
                        driverId={editingDriver?.id}
                        documentType="medical_certificate"
                        documentLabel="Medical Certificate"
                        currentUrl={form.watch('medical_certificate_url')}
                        onUploadComplete={(url) => form.setValue('medical_certificate_url', url)}
                        onRemove={() => form.setValue('medical_certificate_url', '')}
                        schoolId={userSchoolId || ''}
                      />
                    </div>

                    {/* Driving License */}
                    <div className="space-y-2">
                      <Label>Driving License Document</Label>
                      <DriverDocumentUploader
                        driverId={editingDriver?.id}
                        documentType="license"
                        documentLabel="Driving License"
                        currentUrl={form.watch('license_document_url')}
                        onUploadComplete={(url) => form.setValue('license_document_url', url)}
                        onRemove={() => form.setValue('license_document_url', '')}
                        schoolId={userSchoolId || ''}
                      />
                    </div>

                    {/* PSV Badge */}
                    <div className="space-y-2">
                      <Label>PSV Badge Document</Label>
                      <DriverDocumentUploader
                        driverId={editingDriver?.id}
                        documentType="psv_badge"
                        documentLabel="PSV Badge"
                        currentUrl={form.watch('psv_badge_document_url')}
                        onUploadComplete={(url) => form.setValue('psv_badge_document_url', url)}
                        onRemove={() => form.setValue('psv_badge_document_url', '')}
                        schoolId={userSchoolId || ''}
                      />
                    </div>

                    {/* HMV Permit */}
                    <div className="space-y-2">
                      <Label>Heavy Vehicle Permit Document</Label>
                      <DriverDocumentUploader
                        driverId={editingDriver?.id}
                        documentType="hmv_permit"
                        documentLabel="HMV Permit"
                        currentUrl={form.watch('hmv_permit_document_url')}
                        onUploadComplete={(url) => form.setValue('hmv_permit_document_url', url)}
                        onRemove={() => form.setValue('hmv_permit_document_url', '')}
                        schoolId={userSchoolId || ''}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingDriver ? 'Update Driver' : 'Add Driver'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Drivers List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDrivers.map((driver) => (
          <Card key={driver.id} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg">
                  {driver.first_name} {driver.last_name}
                </CardTitle>
                <CardDescription>ID: {driver.employee_id}</CardDescription>
              </div>
              <div className="flex items-center space-x-1">
                <Badge className={getStatusColor(driver.status)}>
                  {driver.status}
                </Badge>
                {isLicenseExpiringSoon(driver.license_expiry) && (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="text-xs">
                  {driver.employee_type === 'driver' ? 'Driver' : 
                   driver.employee_type === 'assistant' ? 'Assistant' : 
                   driver.employee_type === 'both' ? 'Driver & Assistant' : 'Driver'}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{driver.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>License: {driver.license_number}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>Expires: {new Date(driver.license_expiry).toLocaleDateString()}</span>
                {isLicenseExpiringSoon(driver.license_expiry) && (
                  <Badge variant="destructive" className="text-xs">
                    Expiring Soon
                  </Badge>
                )}
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedDriver(driver);
                    setIsDetailOpen(true);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(driver)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Driver</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {driver.first_name} {driver.last_name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(driver.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No drivers found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? 'No drivers match your search criteria.' : 'Get started by adding your first driver.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Driver
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Driver Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDriver?.first_name} {selectedDriver?.last_name}
            </DialogTitle>
            <DialogDescription>
              Driver details and certification information
            </DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Employee ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedDriver.employee_id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedDriver.status)}>
                    {selectedDriver.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-muted-foreground">{selectedDriver.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedDriver.email || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">License Number</Label>
                  <p className="text-sm text-muted-foreground">{selectedDriver.license_number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">License Expiry</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedDriver.license_expiry).toLocaleDateString()}
                    {isLicenseExpiringSoon(selectedDriver.license_expiry) && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        Expiring Soon
                      </Badge>
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Hire Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedDriver.hire_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Emergency Contact</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedDriver.emergency_contact_name || 'Not provided'}
                    {selectedDriver.emergency_contact_phone && (
                      <span className="block">{selectedDriver.emergency_contact_phone}</span>
                    )}
                  </p>
                </div>
              </div>
              {selectedDriver.address && (
                <div>
                  <Label className="text-sm font-medium">Address</Label>
                  <p className="text-sm text-muted-foreground">{selectedDriver.address}</p>
                </div>
              )}
              {selectedDriver.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground">{selectedDriver.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};