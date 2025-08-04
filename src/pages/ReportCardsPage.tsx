import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Download, Send, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReportCardGenerator } from '@/components/reports/ReportCardGenerator';
import { ReportCardsList } from '@/components/reports/ReportCardsList';

export default function ReportCardsPage() {
  const { toast } = useToast();
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [generatorMode, setGeneratorMode] = useState<'individual' | 'bulk'>('individual');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null);

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
    setSelectedStatCard(cardType);
  };

  const getStatCardDetails = (cardType: string) => {
    switch (cardType) {
      case "Draft Reports":
        return {
          title: "Draft Reports Breakdown",
          data: [
            { label: "Year 7", value: 4, description: "Pending completion" },
            { label: "Year 8", value: 3, description: "Awaiting review" },
            { label: "Year 9", value: 2, description: "In progress" },
            { label: "Year 10", value: 2, description: "Ready for approval" },
            { label: "Year 11", value: 1, description: "Final checks" }
          ]
        };
      
      case "Published Reports":
        return {
          title: "Published Reports by Year Group",
          data: [
            { label: "Year 7", value: 12, description: "All published successfully" },
            { label: "Year 8", value: 10, description: "Sent to parents" },
            { label: "Year 9", value: 8, description: "Available for download" },
            { label: "Year 10", value: 9, description: "Published this week" },
            { label: "Year 11", value: 6, description: "Final reports sent" }
          ]
        };
        
      case "Total Students":
        return {
          title: "Students by Year Group",
          data: [
            { label: "Year 7", value: 35, description: "New intake" },
            { label: "Year 8", value: 32, description: "Second year" },
            { label: "Year 9", value: 28, description: "Key Stage 3" },
            { label: "Year 10", value: 30, description: "GCSE preparation" },
            { label: "Year 11", value: 25, description: "Final year" }
          ]
        };
        
      case "Downloads":
        return {
          title: "Download Activity",
          data: [
            { label: "Parent Portal", value: 45, description: "Direct downloads" },
            { label: "Email Links", value: 32, description: "Via email attachments" },
            { label: "Mobile App", value: 8, description: "Mobile downloads" },
            { label: "Admin Downloads", value: 4, description: "Staff access" }
          ]
        };
        
      default:
        return { title: "", data: [] };
    }
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
      
      {/* Statistics Detail Dialog */}
      <Dialog open={!!selectedStatCard} onOpenChange={(open) => !open && setSelectedStatCard(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedStatCard && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedStatCard} Details</DialogTitle>
                <DialogDescription>
                  Detailed breakdown and statistics
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <h4 className="font-semibold">{getStatCardDetails(selectedStatCard).title}</h4>
                <div className="space-y-3">
                  {getStatCardDetails(selectedStatCard).data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-lg font-bold text-primary">{item.value}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-primary">
                      {getStatCardDetails(selectedStatCard).data.reduce((sum, item) => sum + item.value, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
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