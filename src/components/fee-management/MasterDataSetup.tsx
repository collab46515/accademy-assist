import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Database, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const MasterDataSetup = () => {
  return (
    <div className="space-y-6">
      <Alert>
        <CreditCard className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            Fee management master data has been moved to the centralized Master Data page for better organization.
          </span>
          <Link to="/admin/master-data">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Go to Master Data
            </Button>
          </Link>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Fee Management Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            To set up fee management master data including standard fee heads for British schools, 
            please visit the centralized Master Data Management page.
          </p>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">What you can do in Master Data:</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Install 14 predefined British school fee heads</li>
              <li>Manage all school master data in one place</li>
              <li>Bulk import/export data</li>
              <li>Centralized data management across all modules</li>
            </ul>
          </div>

          <div className="flex justify-center pt-4">
            <Link to="/admin/master-data">
              <Button>
                <Database className="h-4 w-4 mr-2" />
                Access Master Data Management
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};