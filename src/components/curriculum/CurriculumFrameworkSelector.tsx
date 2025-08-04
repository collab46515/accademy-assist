import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Copy, Download, Upload } from 'lucide-react';
import { CurriculumFramework, useCurriculumData } from '@/hooks/useCurriculumData';

interface CurriculumFrameworkSelectorProps {
  selectedFramework?: CurriculumFramework;
  onSelectFramework: (framework: CurriculumFramework) => void;
  schoolId: string;
  academicYear: string;
}

export function CurriculumFrameworkSelector({
  selectedFramework,
  onSelectFramework,
  schoolId,
  academicYear
}: CurriculumFrameworkSelectorProps) {
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const { frameworks, adoptFramework, createCustomFramework } = useCurriculumData();

  const templates = frameworks.filter(f => f.is_template);
  const schoolFrameworks = frameworks.filter(f => !f.is_template && f.school_id === schoolId);

  const handleAdoptFramework = async (frameworkId: string) => {
    try {
      const framework = frameworks.find(f => f.id === frameworkId);
      if (framework) {
        await adoptFramework(schoolId, frameworkId, academicYear);
        onSelectFramework(framework);
      }
    } catch (error) {
      console.error('Error adopting framework:', error);
    }
  };

  const handleCreateCustom = async () => {
    if (!selectedTemplate || !customName) return;

    try {
      const customFramework = await createCustomFramework(selectedTemplate, schoolId, {
        name: customName,
        description: customDescription
      });
      
      await adoptFramework(schoolId, customFramework.id, academicYear);
      onSelectFramework(customFramework);
      setShowCustomDialog(false);
      setCustomName('');
      setCustomDescription('');
      setSelectedTemplate('');
    } catch (error) {
      console.error('Error creating custom framework:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Curriculum Framework</h2>
          <p className="text-muted-foreground">
            Choose or create a curriculum framework for your school
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Create Custom
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Custom Curriculum</DialogTitle>
                <DialogDescription>
                  Start with a template and customize it for your school
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template">Base Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} ({template.country})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="name">Custom Name</Label>
                  <Input
                    id="name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g., Our School Curriculum"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Describe your custom curriculum"
                  />
                </div>
                
                <Button 
                  onClick={handleCreateCustom} 
                  disabled={!selectedTemplate || !customName}
                  className="w-full"
                >
                  Create Custom Curriculum
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {selectedFramework && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {selectedFramework.name}
                  <Badge variant={selectedFramework.is_template ? "secondary" : "default"}>
                    {selectedFramework.is_template ? "Template" : "Custom"}
                  </Badge>
                </CardTitle>
                <CardDescription>{selectedFramework.description}</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Grade Levels</p>
                <div className="flex flex-wrap gap-1">
                  {selectedFramework.grade_levels.map((level) => (
                    <Badge key={level} variant="outline" className="text-xs">
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Academic Periods</p>
                <div className="flex flex-wrap gap-1">
                  {selectedFramework.academic_periods.map((period) => (
                    <Badge key={period} variant="outline" className="text-xs">
                      {period}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Subjects</p>
                <div className="flex flex-wrap gap-1">
                  {selectedFramework.subjects.slice(0, 3).map((subject) => (
                    <Badge key={subject} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                  {selectedFramework.subjects.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{selectedFramework.subjects.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Template Frameworks */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Templates</h3>
          {templates.map((framework) => (
            <Card 
              key={framework.id} 
              className={`cursor-pointer transition-colors hover:bg-accent ${
                selectedFramework?.id === framework.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSelectFramework(framework)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  {framework.name}
                  <Badge variant="secondary" className="text-xs">Template</Badge>
                </CardTitle>
                <CardDescription className="text-sm">
                  {framework.country} • {framework.subjects.length} subjects
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {framework.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* School Custom Frameworks */}
        {schoolFrameworks.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Custom Curricula</h3>
            {schoolFrameworks.map((framework) => (
              <Card 
                key={framework.id} 
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  selectedFramework?.id === framework.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onSelectFramework(framework)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    {framework.name}
                    <Badge variant="default" className="text-xs">Custom</Badge>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {framework.subjects.length} subjects • {framework.grade_levels.length} levels
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {framework.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}