import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OfferLetterForm } from './OfferLetterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, User, FileText, CheckCircle, Clock } from 'lucide-react';

export function OffersManager() {
  // Mock offers data
  const offers = [
    {
      id: '1',
      candidateName: 'Sarah Johnson',
      position: 'Senior Mathematics Teacher',
      salary: '£45,000',
      offerDate: '2024-01-20',
      expiryDate: '2024-01-27',
      status: 'sent',
      responseDate: null
    },
    {
      id: '2',
      candidateName: 'Michael Brown',
      position: 'History Teacher',
      salary: '£42,000',
      offerDate: '2024-01-18',
      expiryDate: '2024-01-25',
      status: 'accepted',
      responseDate: '2024-01-22'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'sent': return 'bg-blue-100 text-blue-700';
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'declined': return 'bg-red-100 text-red-700';
      case 'expired': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Offers Management</h2>
          <p className="text-muted-foreground">
            Create and manage job offers
          </p>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Offers</TabsTrigger>
          <TabsTrigger value="create">Create Offer</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map((offer) => (
              <Card key={offer.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{offer.candidateName}</CardTitle>
                      <CardDescription>{offer.position}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(offer.status)}>
                      {getStatusIcon(offer.status)}
                      <span className="ml-1">{offer.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{offer.salary} per annum</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Offered: {offer.offerDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Expires: {offer.expiryDate}</span>
                  </div>
                  {offer.responseDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Responded: {offer.responseDate}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-3">
                    <Button variant="outline" size="sm">
                      View Offer
                    </Button>
                    <Button variant="outline" size="sm">
                      Send Reminder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create">
          <OfferLetterForm />
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Offer Letter Templates</CardTitle>
              <CardDescription>Pre-configured templates for different roles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Template management interface coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}