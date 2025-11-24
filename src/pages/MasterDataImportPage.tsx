import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertTriangle, Database, Users, BookOpen, Home, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRBAC } from '@/hooks/useRBAC';
import { ModuleGuard } from '@/components/modules/ModuleGuard';
import { generateBulkImportTemplate, parseBulkImportCSV, processBulkImport } from '@/utils/bulkImportHelpers';

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
    const template = generateBulkImportTemplate(currentSchool?.code || 'SCHOOL');
    
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentSchool?.code || 'SCHOOL'}_bulk_student_import_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Template Downloaded',
      description: 'Comprehensive template with 5 example students downloaded. Fill in your data and upload.',
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
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvContent = e.target?.result as string;
        const rows = parseBulkImportCSV(csvContent);
        
        setProgress(50);
        
        // Validate data
        const validation = {
          students: { 
            valid: rows.filter(r => r.student_number && r.first_name && r.last_name && r.date_of_birth).length,
            errors: rows.filter(r => !r.student_number || !r.first_name || !r.last_name || !r.date_of_birth).length,
            issues: [] as string[]
          },
          parents: { 
            valid: rows.filter(r => r.parent1_email).length,
            errors: rows.filter(r => !r.parent1_email).length,
            issues: rows.filter(r => !r.parent1_email).length > 0 ? [`${rows.filter(r => !r.parent1_email).length} students missing parent email`] : []
          },
          fees: { 
            valid: rows.filter(r => r.fee_structure_name).length,
            errors: rows.filter(r => !r.fee_structure_name).length,
            issues: rows.filter(r => !r.fee_structure_name).length > 0 ? [`${rows.filter(r => !r.fee_structure_name).length} students without fee assignment`] : []
          },
        };

        setValidationResults(validation);
        setProgress(100);

        toast({
          title: 'Validation Complete',
          description: `Found ${rows.length} students to import. Review validation results.`,
        });
      };
      
      reader.readAsText(file);
    } catch (error: any) {
      toast({
        title: 'Validation Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  const handleImport = async () => {
    if (!file || !currentSchool?.id) {
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
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvContent = e.target?.result as string;
        const rows = parseBulkImportCSV(csvContent);
        
        const results = await processBulkImport(
          rows, 
          currentSchool.id,
          (progress, message) => {
            setProgress(progress);
            console.log(message);
          }
        );

        setImportResults({
          students: { imported: results.successful, skipped: results.failed },
          parents: { imported: results.createdParents.length, skipped: 0 },
          fees: { imported: results.assignedFees.length, skipped: 0 },
          errors: results.errors
        });

        if (results.successful > 0) {
          toast({
            title: 'Import Successful',
            description: `Successfully imported ${results.successful} students with parents and fees for ${currentSchool.name}`,
          });
        }
        
        if (results.failed > 0) {
          toast({
            title: 'Import Completed with Errors',
            description: `${results.successful} succeeded, ${results.failed} failed. Check results below.`,
            variant: 'destructive',
          });
        }
      };
      
      reader.readAsText(file);
    } catch (error: any) {
      toast({
        title: 'Import Failed',
        description: error.message,
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
              Download the comprehensive CSV template with example data for students, parents, and fee assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Bulk Student Import Template</p>
                <p className="text-xs text-muted-foreground">
                  Includes: Student Details, Parent Information (both parents), Emergency Contacts, Medical Info, Fee Assignments
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    <UserPlus className="h-3 w-3 mr-1" />
                    50+ Fields
                  </Badge>
                  <Badge variant="outline" className="text-xs">5 Examples</Badge>
                </div>
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
              Upload the completed CSV file with student, parent, and fee data
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
                      {key === 'students' && <Users className="h-5 w-5 text-blue-500" />}
                      {key === 'parents' && <UserPlus className="h-5 w-5 text-green-500" />}
                      {key === 'fees' && <Home className="h-5 w-5 text-purple-500" />}
                      <div>
                        <p className="font-medium capitalize">{key}</p>
                        {value.issues && value.issues.length > 0 && (
                          <p className="text-xs text-amber-600">{value.issues.join(', ')}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="bg-green-50">
                        {value.valid} Valid
                      </Badge>
                      {value.errors > 0 && (
                        <Badge variant="destructive">
                          {value.errors} Issues
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(importResults).map(([key, value]: [string, any]) => {
                    if (key === 'errors') return null;
                    return (
                      <div key={key} className="text-center p-4 bg-white rounded-lg border">
                        <p className="text-2xl font-bold text-green-600">{value.imported}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {key}
                        </p>
                        {value.skipped > 0 && (
                          <p className="text-xs text-amber-600 mt-1">{value.skipped} failed</p>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {importResults.errors && importResults.errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-semibold mb-2">Import Errors:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        {importResults.errors.slice(0, 5).map((error: string, i: number) => (
                          <li key={i}>{error}</li>
                        ))}
                        {importResults.errors.length > 5 && (
                          <li>... and {importResults.errors.length - 5} more errors</li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
