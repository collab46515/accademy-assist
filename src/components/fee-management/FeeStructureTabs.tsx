import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Trash2,
  Download
} from "lucide-react";
import { FeeStructureBuilder } from './FeeStructureBuilder';
import { useFeeData } from '@/hooks/useFeeData';

// No mock data - using real database data only

export const FeeStructureTabs = () => {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-25');
  const [selectedTerm, setSelectedTerm] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { feeStructures, loading } = useFeeData();

  // Helper function to normalize structure data
  const normalizeStructure = (structure: any) => ({
    id: structure.id,
    name: structure.name,
    term: structure.term,
    status: structure.status || 'draft',
    academic_year: structure.academic_year || structure.academicYear,
    total_amount: structure.total_amount || structure.totalAmount || 0,
    fee_heads: structure.fee_heads || [],
    feeHeadCount: structure.feeHeadCount || (structure.fee_heads?.length) || 0,
    studentsAssigned: structure.studentsAssigned || 0,
    updated_at: structure.updated_at || structure.lastModified || new Date().toISOString()
  });

  // Always use real database data - no more mock fallback
  const dataToUse = feeStructures.map(normalizeStructure);
  
  const filteredStructures = dataToUse.filter(structure => {
    const name = structure.name || '';
    const term = structure.term || '';
    const status = structure.status || 'draft';
    const academicYear = structure.academic_year || '';
    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTerm = selectedTerm === 'all' || term === selectedTerm;
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    const matchesYear = academicYear === selectedAcademicYear;
    
    return matchesSearch && matchesTerm && matchesStatus && matchesYear;
  });

  // Debug logging
  console.log('📊 FeeStructureTabs Debug Info:');
  console.log('- Raw feeStructures from DB:', feeStructures);
  console.log('- Loading state:', loading);
  console.log('- Normalized data:', dataToUse);
  console.log('- Filter criteria:', { selectedAcademicYear, selectedTerm, statusFilter, searchQuery });
  console.log('- Final filtered structures:', filteredStructures);
  console.log('- Component is rendering with', filteredStructures.length, 'structures');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Calculate overview stats
  const totalStructures = filteredStructures.length;
  const activeStructures = filteredStructures.filter(s => s.status === 'active').length;
  const totalStudentsAssigned = 0; // TODO: Add student assignment tracking
  const totalRevenue = 0; // TODO: Calculate from assignments

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Fee Structures</h2>
          <p className="text-muted-foreground">Manage and monitor fee structures across your school</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Fee Structure
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview & Management</TabsTrigger>
          <TabsTrigger value="builder">Fee Structure Builder</TabsTrigger>
          <TabsTrigger value="templates">Templates & Presets</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Structures</p>
                    <p className="text-2xl font-bold text-foreground">{totalStructures}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Active Structures</p>
                    <p className="text-2xl font-bold text-foreground">{activeStructures}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Students Assigned</p>
                    <p className="text-2xl font-bold text-foreground">{totalStudentsAssigned.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
                    <p className="text-2xl font-bold text-foreground">{selectedAcademicYear}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search structures..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Academic Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-25">2024-25</SelectItem>
                    <SelectItem value="2023-24">2023-24</SelectItem>
                    <SelectItem value="2022-23">2022-23</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Terms</SelectItem>
                    <SelectItem value="Autumn">Autumn</SelectItem>
                    <SelectItem value="Spring">Spring</SelectItem>
                    <SelectItem value="Summer">Summer</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Fee Structures Table */}
          <Card>
            <CardHeader>
              <CardTitle>Fee Structures ({filteredStructures.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStructures.map((structure) => (
                  <div key={structure.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                       <div className="space-y-1">
                        <p className="font-medium text-foreground">{structure.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {structure.academic_year} • {structure.term || 'N/A'}
                        </p>
                       </div>
                       
                       <div className="text-center">
                        <p className="font-semibold text-foreground">
                          £{structure.total_amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {structure.feeHeadCount} fee heads
                        </p>
                       </div>
                       
                       <div className="text-center">
                        <p className="font-semibold text-foreground">
                          {structure.studentsAssigned}
                        </p>
                        <p className="text-xs text-muted-foreground">students assigned</p>
                       </div>
                       
                       <div className="flex justify-center">
                        <Badge className={getStatusColor(structure.status)}>
                          {structure.status}
                        </Badge>
                       </div>
                       
                       <div className="text-center text-sm text-muted-foreground">
                        <p>Modified: {new Date(structure.updated_at).toLocaleDateString()}</p>
                       </div>
                      
                       <div className="flex items-center gap-2 justify-end">
                         <Button variant="ghost" size="sm" onClick={() => {
                           console.log('FeeStructureTabs: View button clicked');
                           alert('View button clicked');
                         }}>
                           <Eye className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="sm" onClick={() => {
                           console.log('FeeStructureTabs: Edit button clicked');
                           alert('Edit button clicked');
                         }}>
                           <Edit className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="sm" onClick={() => {
                           console.log('FeeStructureTabs: Copy button clicked');
                           alert('Copy button clicked');
                         }}>
                           <Copy className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => {
                           console.log('FeeStructureTabs: Delete button clicked');
                           alert('Delete button clicked');
                         }}>
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Loading fee structures...</p>
                  </div>
                )}
                
                {!loading && filteredStructures.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No fee structures found matching your filters.</p>
                    <p className="text-sm mt-2">Create your first fee structure to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <FeeStructureBuilder />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fee Structure Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Fee structure templates will be available here.</p>
                <p className="text-sm">Create reusable templates for common fee structures.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};