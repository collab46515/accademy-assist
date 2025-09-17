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
  FileText
} from 'lucide-react';
import { useTransportData, type Driver } from '@/hooks/useTransportData';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
});

type DriverFormData = z.infer<typeof driverFormSchema>;

export const DriversManager = () => {
  const { drivers, loading, addDriver, updateDriver, deleteDriver } = useTransportData();
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
        school_id: user?.user_metadata?.school_id || '',
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