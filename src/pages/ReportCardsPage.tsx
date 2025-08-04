import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Send, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReportCardGenerator } from '@/components/reports/ReportCardGenerator';
import { ReportCardsList } from '@/components/reports/ReportCardsList';

export default function ReportCardsPage() {
  const { toast } = useToast();
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [generatorMode, setGeneratorMode] = useState<'individual' | 'bulk'>('individual');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGenerateIndividual = () => {
    setGeneratorMode('individual');
    setGeneratorOpen(true);
  };

  const handleBulkGenerate = () => {
    setGeneratorMode('bulk');
    setGeneratorOpen(true);
  };

  const handleGenerationComplete = () => {
    // Refresh the reports list when a new report is generated
    setRefreshKey(prev => prev + 1);
  };

  const handleCardClick = (cardType: string) => {
    toast({
      title: `${cardType} Details`,
      description: `Viewing ${cardType.toLowerCase()} details - feature coming soon!`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader 
        title="Report Cards" 
        description="Generate and manage student report cards"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick("Draft Reports")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Pending completion
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick("Published Reports")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Reports</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              Sent to parents
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick("Total Students")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150</div>
            <p className="text-xs text-muted-foreground">
              Across all years
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick("Downloads")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              This term
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Report Cards</CardTitle>
            <CardDescription>
              Create report cards for students based on their academic performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button className="w-full" size="lg" onClick={handleGenerateIndividual}>
                <FileText className="mr-2 h-4 w-4" />
                Generate Individual Report
              </Button>
              <Button variant="outline" className="w-full" size="lg" onClick={handleBulkGenerate}>
                <Users className="mr-2 h-4 w-4" />
                Bulk Generate Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest report card activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Year 7 reports published</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 bg-blue-500 rounded-full" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Comment bank updated</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 bg-orange-500 rounded-full" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">15 reports generated</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ReportCardsList key={refreshKey} />
      
      <ReportCardGenerator 
        open={generatorOpen}
        onOpenChange={setGeneratorOpen}
        mode={generatorMode}
        onGenerationComplete={handleGenerationComplete}
      />
    </div>
  );
}