import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertTriangle, Database, Users, BookOpen, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRBAC } from '@/hooks/useRBAC';
import { ModuleGuard } from '@/components/modules/ModuleGuard';

export default function MasterDataImportPage() {
  return (
    <ModuleGuard moduleName="Master Data Management">
      <MasterDataImportContent />
    </ModuleGuard>
  );
}

function MasterDataImportContent() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [importResults, setImportResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { currentSchool } = useRBAC();

  const downloadTemplate = () => {
    // Create Excel-compatible CSV template matching the customer's structure
    const template = `Name,Code,Address,Contact Email,Contact Phone
Example Primary School,EPS001,123 Main Street,admin@example.edu,+44 20 1234 5678
Example Secondary School,ESS002,456 Oak Avenue,contact@secondary.edu,+44 20 9876 5432

Student Number,Year Group,Form Class,Date of Birth,Emergency Contact Name,Emergency Contact Phone
STU001,1,A,2010-05-15,John Smith,+44 7700 900123
STU002,2,B,2011-03-20,Jane Doe,+44 7700 900456

Period Number,Start Time,End Time,Day of Week
1,09:20,10:00,All Day
2,10:00,10:40,All Day
3,11:00,11:40,All Day

Employee ID,First Name,Last Name,Email,Position,Department,Start Date
EMP001,John,Smith,j.smith@school.edu,Head Teacher,Administration,2020-09-01
EMP002,Jane,Doe,j.doe@school.edu,Mathematics Teacher,Teaching,2021-01-15

Fee Name,Description,Category,Default Amount,Currency,Is Mandatory,Is Recurring,Recurrence Frequency,Applicable Classes,Applicable Genders
Tuition Fee,Main academic tuition fees,Tuition,1500,GBP,TRUE,TRUE,termly,,
Registration Fee,One-time registration fee,Registration,250,GBP,TRUE,FALSE,,,,`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentSchool?.code || 'SCHOOL'}_master_data_template.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Template Downloaded',
      description: 'Fill in your school data and upload the file.',
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls') || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setValidationResults(null);
        setImportResults(null);
      } else {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload an Excel (.xlsx, .xls) or CSV file.',
          variant: 'destructive',
        });
      }
    }
  };

  const validateData = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(10);

    try {
      // Simulate validation (in real implementation, parse and validate the file)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(50);

      const mockValidation = {
        schools: { valid: 2, errors: 0 },
        students: { valid: 145, errors: 5, issues: ['5 students missing emergency contact'] },
        employees: { valid: 62, errors: 3, issues: ['3 employees missing email addresses'] },
        periods: { valid: 8, errors: 0 },
        feeStructures: { valid: 12, errors: 2, issues: ['2 fee structures have invalid amounts'] },
      };

      setValidationResults(mockValidation);
      setProgress(100);

      toast({
        title: 'Validation Complete',
        description: 'Review the validation results before importing.',
      });
    } catch (error) {
      toast({
        title: 'Validation Failed',
        description: 'An error occurred during validation.',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  const handleImport = async () => {
    if (!file || !currentSchool) {
      toast({
        title: 'Cannot Import',
        description: 'Please select a school and upload a file first.',
        variant: 'destructive',
      });
      return;
    }

    setImporting(true);
    setProgress(0);

    try {
      // Simulate import process
      const steps = [
        { name: 'Parsing file...', progress: 20 },
        { name: 'Importing schools...', progress: 30 },
        { name: 'Importing students...', progress: 50 },
        { name: 'Importing employees...', progress: 70 },
        { name: 'Importing periods...', progress: 85 },
        { name: 'Importing fee structures...', progress: 95 },
        { name: 'Finalizing...', progress: 100 },
      ];

      for (const step of steps) {
        setProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const mockResults = {
        schools: { imported: 1, skipped: 0 },
        students: { imported: 140, skipped: 5 },
        employees: { imported: 59, skipped: 3 },
        periods: { imported: 8, skipped: 0 },
        feeStructures: { imported: 10, skipped: 2 },
      };

      setImportResults(mockResults);

      toast({
        title: 'Import Successful',
        description: `Successfully imported data for ${currentSchool.name}`,
      });
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'An error occurred during the import process.',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  if (!currentSchool) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please select a school before importing master data.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bulk Master Data Import</h1>
        <p className="text-muted-foreground">
          Import complete school data for <span className="font-semibold text-foreground">{currentSchool.name}</span> from Excel/CSV files
        </p>
      </div>

      <div className="grid gap-6">
        {/* Step 1: Download Template */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Step 1: Download Template
            </CardTitle>
            <CardDescription>
              Download the Excel template with the correct format for your school data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Master Data Template</p>
                <p className="text-xs text-muted-foreground">
                  Includes: Schools, Students, Employees, Periods, Fee Structures
                </p>
              </div>
              <Button onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Upload File */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Step 2: Upload Your Data
            </CardTitle>
            <CardDescription>
              Upload the completed Excel or CSV file with your school's data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                {file ? (
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No file selected</p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="mt-4"
                >
                  {file ? 'Change File' : 'Select File'}
                </Button>
              </div>

              {file && !validationResults && (
                <Button onClick={validateData} disabled={importing} className="w-full">
                  {importing ? 'Validating...' : 'Validate Data'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Validation Results */}
        {validationResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Step 3: Validation Results
              </CardTitle>
              <CardDescription>
                Review the validation results before proceeding with the import
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(validationResults).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {key === 'schools' && <Database className="h-5 w-5" />}
                      {key === 'students' && <Users className="h-5 w-5" />}
                      {key === 'employees' && <Users className="h-5 w-5" />}
                      {key === 'periods' && <BookOpen className="h-5 w-5" />}
                      {key === 'feeStructures' && <Home className="h-5 w-5" />}
                      <div>
                        <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        {value.issues && value.issues.length > 0 && (
                          <p className="text-xs text-amber-600">{value.issues.join(', ')}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">
                        {value.valid} Valid
                      </Badge>
                      {value.errors > 0 && (
                        <Badge variant="destructive">
                          {value.errors} Errors
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}

                <Button onClick={handleImport} disabled={importing} className="w-full" size="lg">
                  {importing ? 'Importing...' : 'Import All Data'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress */}
        {importing && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Import Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Import Results */}
        {importResults && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                Import Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(importResults).map(([key, value]: [string, any]) => (
                  <div key={key} className="text-center p-4 bg-white rounded-lg border">
                    <p className="text-2xl font-bold text-green-600">{value.imported}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </p>
                    {value.skipped > 0 && (
                      <p className="text-xs text-amber-600 mt-1">{value.skipped} skipped</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
