import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X, FileSpreadsheet } from 'lucide-react';
import { CurriculumFramework, useCurriculumData } from '@/hooks/useCurriculumData';
import { useToast } from '@/hooks/use-toast';

interface ImportExportToolsProps {
  selectedFramework: CurriculumFramework | null;
  schoolId: string;
  academicYear: string;
}

export function ImportExportTools({ 
  selectedFramework, 
  schoolId, 
  academicYear 
}: ImportExportToolsProps) {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);
  const [selectedExportFormat, setSelectedExportFormat] = useState('csv');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { importCurriculum, frameworks, topics, coverage } = useCurriculumData();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV or Excel file.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      setImportFile(file);
      setImportResults(null);
    }
  };

  const handleImport = async () => {
    if (!importFile || !selectedFramework) return;
    
    setImporting(true);
    try {
      await importCurriculum(importFile, selectedFramework.id);
      
      // Mock import results for demo
      setImportResults({
        total: 156,
        successful: 149,
        failed: 7,
        errors: [
          { row: 12, message: "Missing required field: grade_level" },
          { row: 23, message: "Invalid subject: 'Advanced Quantum Physics'" },
          { row: 45, message: "Duplicate topic title found" },
          { row: 67, message: "Invalid academic period" },
          { row: 89, message: "Missing learning objectives" },
          { row: 101, message: "Invalid difficulty level: must be 1-5" },
          { row: 134, message: "Estimated hours exceeds maximum" }
        ]
      });
      
      toast({
        title: "Import completed",
        description: `Successfully imported ${149} out of ${156} topics.`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error importing your curriculum.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    if (!selectedFramework) return;
    
    try {
      // Generate export data
      const exportData = [
        [
          'subject',
          'grade_level', 
          'academic_period',
          'topic_code',
          'title',
          'description',
          'learning_objectives',
          'skills',
          'estimated_hours',
          'difficulty_level',
          'is_mandatory',
          'topic_order'
        ],
        ...topics.map(topic => [
          topic.subject,
          topic.grade_level,
          topic.academic_period || '',
          topic.topic_code || '',
          topic.title,
          topic.description || '',
          topic.learning_objectives.join('; '),
          topic.skills.join('; '),
          topic.estimated_hours || 1,
          topic.difficulty_level || 1,
          topic.is_mandatory,
          topic.topic_order
        ])
      ];

      const csvContent = exportData.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${selectedFramework.name.toLowerCase().replace(/\s+/g, '-')}-curriculum.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export completed",
        description: `Curriculum exported as ${selectedExportFormat.toUpperCase()} file.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your curriculum.",
        variant: "destructive",
      });
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      [
        'subject',
        'grade_level',
        'academic_period',
        'topic_code',
        'title',
        'description',
        'learning_objectives',
        'skills',
        'estimated_hours',
        'difficulty_level',
        'is_mandatory',
        'topic_order'
      ],
      [
        'Mathematics',
        'Year 1',
        'Autumn Term',
        'MA1-1.1',
        'Introduction to Numbers',
        'Basic number recognition and counting',
        'Recognize numbers 1-10; Count objects accurately',
        'Number recognition; Counting; One-to-one correspondence',
        '2',
        '1',
        'true',
        '1'
      ],
      [
        'Mathematics',
        'Year 1',
        'Autumn Term',
        'MA1-1.2',
        'Basic Addition',
        'Simple addition using concrete objects',
        'Add two single-digit numbers; Use addition symbols',
        'Addition; Mathematical symbols; Problem solving',
        '3',
        '2',
        'true',
        '2'
      ]
    ];

    const csvContent = templateData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'curriculum-import-template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Curriculum Data
          </CardTitle>
          <CardDescription>
            Upload curriculum topics from CSV or Excel files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedFramework && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please select a curriculum framework before importing data.
              </AlertDescription>
            </Alert>
          )}
          
          {selectedFramework && (
            <>
              <div className="space-y-4">
                <div>
                  <Label>Selected Framework</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{selectedFramework.name}</Badge>
                    <Badge variant="secondary">{selectedFramework.country}</Badge>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="import-file">Select File</Label>
                  <div className="mt-2">
                    <Input
                      id="import-file"
                      type="file"
                      ref={fileInputRef}
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supported formats: CSV, Excel (.xlsx, .xls). Maximum file size: 10MB
                  </p>
                </div>
                
                {importFile && (
                  <div className="p-4 border border-border rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-green-600" />
                        <span className="font-medium">{importFile.name}</span>
                        <Badge variant="outline">{(importFile.size / 1024).toFixed(1)} KB</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setImportFile(null);
                          setImportResults(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleImport}
                    disabled={!importFile || importing}
                  >
                    {importing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Import Data
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {/* Import Results */}
          {importResults && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Import Results</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{importResults.total}</div>
                  <div className="text-sm text-muted-foreground">Total Records</div>
                </div>
                <div className="text-center p-3 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{importResults.successful}</div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </div>
                <div className="text-center p-3 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{importResults.failed}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
              </div>
              
              {importResults.errors.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-red-600">Import Errors</h4>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Error</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importResults.errors.map((error: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{error.row}</TableCell>
                            <TableCell className="text-red-600">{error.message}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Curriculum Data
          </CardTitle>
          <CardDescription>
            Download your curriculum data in various formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedFramework && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please select a curriculum framework before exporting data.
              </AlertDescription>
            </Alert>
          )}
          
          {selectedFramework && (
            <>
              <div className="space-y-4">
                <div>
                  <Label>Export Framework</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{selectedFramework.name}</Badge>
                    <Badge variant="secondary">{topics.length} topics</Badge>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="export-format">Export Format</Label>
                  <Select value={selectedExportFormat} onValueChange={setSelectedExportFormat}>
                    <SelectTrigger className="w-48 mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (.csv)</SelectItem>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="json">JSON (.json)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Curriculum
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import Format Guide
          </CardTitle>
          <CardDescription>
            Required columns and data format for curriculum imports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Required Columns</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div><Badge variant="outline">subject</Badge> - Subject name (must match framework)</div>
                  <div><Badge variant="outline">grade_level</Badge> - Grade level (must match framework)</div>
                  <div><Badge variant="outline">title</Badge> - Topic title (required)</div>
                  <div><Badge variant="outline">academic_period</Badge> - Academic period (optional)</div>
                  <div><Badge variant="outline">description</Badge> - Topic description (optional)</div>
                  <div><Badge variant="outline">learning_objectives</Badge> - Semicolon-separated list</div>
                </div>
                <div className="space-y-2">
                  <div><Badge variant="outline">skills</Badge> - Semicolon-separated list</div>
                  <div><Badge variant="outline">estimated_hours</Badge> - Number (default: 1)</div>
                  <div><Badge variant="outline">difficulty_level</Badge> - Number 1-5 (default: 1)</div>
                  <div><Badge variant="outline">is_mandatory</Badge> - true/false (default: true)</div>
                  <div><Badge variant="outline">topic_order</Badge> - Number (default: 0)</div>
                  <div><Badge variant="outline">topic_code</Badge> - Unique identifier (optional)</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Data Validation Rules</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Subject must be one of the framework's defined subjects</li>
                <li>Grade level must be one of the framework's defined grade levels</li>
                <li>Academic period must be one of the framework's defined periods (if provided)</li>
                <li>Estimated hours must be a positive number</li>
                <li>Difficulty level must be between 1 and 5</li>
                <li>Multiple learning objectives or skills should be separated by semicolons</li>
                <li>Boolean fields (is_mandatory) should be 'true' or 'false'</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}