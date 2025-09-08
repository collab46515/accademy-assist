import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Send, Eye, Download, Calendar, 
  DollarSign, Clock, MapPin, Users 
} from 'lucide-react';

export function OfferLetterForm() {
  const [formData, setFormData] = useState({
    candidateName: '',
    position: '',
    startDate: '',
    baseSalary: '',
    currency: 'INR',
    employmentType: 'full-time',
    probationPeriod: '6',
    workingHours: '37.5',
    vacationDays: '25',
    noticePeriod: '4',
    reportingTo: '',
    workLocation: '',
    benefits: [] as string[],
    additionalTerms: ''
  });

  const benefitOptions = [
    'Health Insurance',
    'Dental Coverage',
    'Pension Scheme',
    'Life Insurance',
    'Flexible Working',
    'Professional Development Budget',
    'Gym Membership',
    'Cycle to Work Scheme',
    'Employee Assistance Program',
    'Season Ticket Loan'
  ];

  const offerTemplates = [
    {
      id: 'teacher',
      name: 'Teaching Position',
      description: 'Standard template for teaching roles',
      benefits: ['Health Insurance', 'Pension Scheme', 'Professional Development Budget']
    },
    {
      id: 'admin',
      name: 'Administrative Role',
      description: 'Template for administrative positions',
      benefits: ['Health Insurance', 'Pension Scheme', 'Flexible Working']
    },
    {
      id: 'support',
      name: 'Support Staff',
      description: 'Template for support staff roles',
      benefits: ['Health Insurance', 'Pension Scheme']
    }
  ];

  const handleBenefitChange = (benefit: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      benefits: checked
        ? [...prev.benefits, benefit]
        : prev.benefits.filter(b => b !== benefit)
    }));
  };

  const generateOfferLetter = () => {
    // Mock offer letter generation
    console.log('Generating offer letter with data:', formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Offer Letter Generator</h2>
          <p className="text-muted-foreground">
            Create and send job offers to candidates
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Generate & Send
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details for the job offer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="candidateName">Candidate Name</Label>
                  <Input
                    id="candidateName"
                    value={formData.candidateName}
                    onChange={(e) => setFormData(prev => ({...prev, candidateName: e.target.value}))}
                    placeholder="Enter candidate name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position Title</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({...prev, position: e.target.value}))}
                    placeholder="e.g. Senior Mathematics Teacher"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({...prev, startDate: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportingTo">Reports To</Label>
                  <Input
                    id="reportingTo"
                    value={formData.reportingTo}
                    onChange={(e) => setFormData(prev => ({...prev, reportingTo: e.target.value}))}
                    placeholder="e.g. Head of Mathematics"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Compensation & Benefits
              </CardTitle>
              <CardDescription>Salary and compensation details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="baseSalary">Annual Base Salary</Label>
                  <Input
                    id="baseSalary"
                    type="number"
                    value={formData.baseSalary}
                    onChange={(e) => setFormData(prev => ({...prev, baseSalary: e.target.value}))}
                    placeholder="45000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({...prev, currency: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select value={formData.employmentType} onValueChange={(value) => setFormData(prev => ({...prev, employmentType: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingHours">Working Hours/Week</Label>
                  <Input
                    id="workingHours"
                    value={formData.workingHours}
                    onChange={(e) => setFormData(prev => ({...prev, workingHours: e.target.value}))}
                    placeholder="37.5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Terms & Conditions
              </CardTitle>
              <CardDescription>Employment terms and conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="probationPeriod">Probation Period (months)</Label>
                  <Input
                    id="probationPeriod"
                    type="number"
                    value={formData.probationPeriod}
                    onChange={(e) => setFormData(prev => ({...prev, probationPeriod: e.target.value}))}
                    placeholder="6"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vacationDays">Annual Leave (days)</Label>
                  <Input
                    id="vacationDays"
                    type="number"
                    value={formData.vacationDays}
                    onChange={(e) => setFormData(prev => ({...prev, vacationDays: e.target.value}))}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noticePeriod">Notice Period (weeks)</Label>
                  <Input
                    id="noticePeriod"
                    type="number"
                    value={formData.noticePeriod}
                    onChange={(e) => setFormData(prev => ({...prev, noticePeriod: e.target.value}))}
                    placeholder="4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workLocation">Work Location</Label>
                <Input
                  id="workLocation"
                  value={formData.workLocation}
                  onChange={(e) => setFormData(prev => ({...prev, workLocation: e.target.value}))}
                  placeholder="e.g. School Campus, Remote, Hybrid"
                />
              </div>

              <div className="space-y-3">
                <Label>Benefits Package</Label>
                <div className="grid grid-cols-2 gap-3">
                  {benefitOptions.map((benefit) => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <Checkbox
                        id={benefit}
                        checked={formData.benefits.includes(benefit)}
                        onCheckedChange={(checked) => handleBenefitChange(benefit, checked as boolean)}
                      />
                      <Label htmlFor={benefit} className="text-sm">{benefit}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalTerms">Additional Terms</Label>
                <Textarea
                  id="additionalTerms"
                  value={formData.additionalTerms}
                  onChange={(e) => setFormData(prev => ({...prev, additionalTerms: e.target.value}))}
                  placeholder="Any additional terms or conditions..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Templates</CardTitle>
              <CardDescription>Use pre-configured templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {offerTemplates.map((template) => (
                <div key={template.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.benefits.slice(0, 2).map((benefit) => (
                      <Badge key={benefit} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                    {template.benefits.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.benefits.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={generateOfferLetter}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Offer Letter
              </Button>
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Preview Document
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Offer Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Position:</span>
                <span>{formData.position || 'Not set'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Salary:</span>
                <span>{formData.baseSalary ? `${formData.currency} ${formData.baseSalary}` : 'Not set'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Start Date:</span>
                <span>{formData.startDate || 'Not set'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Benefits:</span>
                <span>{formData.benefits.length} selected</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}