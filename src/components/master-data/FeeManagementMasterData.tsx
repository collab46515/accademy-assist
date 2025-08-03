import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Database, Plus, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const MASTER_FEE_HEADS = [
  {
    name: 'Tuition Fee',
    description: 'Main academic tuition fees',
    category: 'Tuition',
    default_amount: 1500,
    currency: 'GBP',
    is_mandatory: true,
    is_recurring: true,
    recurrence_frequency: 'termly',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Registration Fee',
    description: 'One-time registration fee for new students',
    category: 'Registration',
    default_amount: 250,
    currency: 'GBP',
    is_mandatory: true,
    is_recurring: false,
    recurrence_frequency: '',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Transport Fee',
    description: 'School transport services',
    category: 'Transport',
    default_amount: 150,
    currency: 'GBP',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'termly',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Meals Fee',
    description: 'School lunch and meal services',
    category: 'Meals',
    default_amount: 200,
    currency: 'GBP',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'termly',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Examination Fee',
    description: 'External and internal examination fees',
    category: 'Examination',
    default_amount: 100,
    currency: 'GBP',
    is_mandatory: true,
    is_recurring: false,
    recurrence_frequency: '',
    applicable_classes: ['Year 10', 'Year 11', 'Year 12', 'Year 13'],
    applicable_genders: []
  },
  {
    name: 'ICT Fee',
    description: 'Information and Communication Technology resources',
    category: 'ICT',
    default_amount: 75,
    currency: 'GBP',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'annually',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Laboratory Fee',
    description: 'Science laboratory usage and materials',
    category: 'Laboratory',
    default_amount: 120,
    currency: 'GBP',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'termly',
    applicable_classes: ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'],
    applicable_genders: []
  },
  {
    name: 'Library Fee',
    description: 'Library resources and book replacement',
    category: 'Library',
    default_amount: 30,
    currency: 'GBP',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'annually',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Sports Fee',
    description: 'Sports equipment and activities',
    category: 'Sports',
    default_amount: 80,
    currency: 'GBP',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'termly',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Music Lessons',
    description: 'Individual music lessons and instrument hire',
    category: 'Music Lessons',
    default_amount: 200,
    currency: 'GBP',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'termly',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Boarding Fee',
    description: 'Accommodation and boarding services',
    category: 'Boarding',
    default_amount: 2500,
    currency: 'GBP',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'termly',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Uniform Fee',
    description: 'School uniform and PE kit',
    category: 'Uniform',
    default_amount: 150,
    currency: 'GBP',
    is_mandatory: true,
    is_recurring: false,
    recurrence_frequency: '',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Activity Fee',
    description: 'Extracurricular activities and clubs',
    category: 'Activity Fees',
    default_amount: 60,
    currency: 'GBP',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'termly',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Excursion Fee',
    description: 'Educational trips and excursions',
    category: 'Excursions',
    default_amount: 100,
    currency: 'GBP',
    is_mandatory: false,
    is_recurring: false,
    recurrence_frequency: '',
    applicable_classes: [],
    applicable_genders: []
  }
];

export const FeeManagementMasterData = () => {
  const [existingFeeHeads, setExistingFeeHeads] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchExistingFeeHeads();
  }, []);

  const fetchExistingFeeHeads = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('fee_heads')
        .select('name');

      if (error) throw error;
      
      setExistingFeeHeads(data?.map((head: any) => head.name) || []);
    } catch (error) {
      console.error('Error fetching fee heads:', error);
      setExistingFeeHeads([]);
    } finally {
      setLoading(false);
    }
  };

  const installMasterData = async () => {
    setInstalling(true);
    try {
      const newFeeHeads = MASTER_FEE_HEADS.filter(
        head => !existingFeeHeads.includes(head.name)
      );

      if (newFeeHeads.length === 0) {
        toast({
          title: "Already Installed",
          description: "All master fee heads are already installed",
        });
        return;
      }

      const { error } = await (supabase as any)
        .from('fee_heads')
        .insert(newFeeHeads);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Installed ${newFeeHeads.length} master fee heads successfully`,
      });

      fetchExistingFeeHeads();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to install master data",
        variant: "destructive",
      });
    } finally {
      setInstalling(false);
    }
  };

  const installIndividualFeeHead = async (feeHead: typeof MASTER_FEE_HEADS[0]) => {
    try {
      const { error } = await (supabase as any)
        .from('fee_heads')
        .insert([feeHead]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Installed "${feeHead.name}" successfully`,
      });

      fetchExistingFeeHeads();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to install "${feeHead.name}"`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading fee heads master data...</div>;
  }

  const availableFeeHeads = MASTER_FEE_HEADS.filter(
    head => !existingFeeHeads.includes(head.name)
  );

  const installedFeeHeads = MASTER_FEE_HEADS.filter(
    head => existingFeeHeads.includes(head.name)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Fee Management Master Data
          </h3>
          <p className="text-muted-foreground">Install standard fee heads for British schools</p>
        </div>
        {availableFeeHeads.length > 0 && (
          <Button onClick={installMasterData} disabled={installing}>
            <Database className="h-4 w-4 mr-2" />
            Install All ({availableFeeHeads.length})
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              Installed Fee Heads ({installedFeeHeads.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {installedFeeHeads.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No fee heads installed yet
              </p>
            ) : (
              <div className="space-y-3">
                {installedFeeHeads.map((feeHead, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <div>
                      <div className="font-medium">{feeHead.name}</div>
                      <div className="text-sm text-muted-foreground">{feeHead.description}</div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary">{feeHead.category}</Badge>
                        {feeHead.is_mandatory && (
                          <Badge variant="default">Mandatory</Badge>
                        )}
                        {feeHead.is_recurring && (
                          <Badge variant="outline">{feeHead.recurrence_frequency}</Badge>
                        )}
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertCircle className="h-5 w-5" />
              Available Fee Heads ({availableFeeHeads.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availableFeeHeads.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 mx-auto text-success mb-2" />
                <p className="text-success font-medium">All master data installed!</p>
                <p className="text-muted-foreground text-sm">
                  You can now create custom fee heads or fee structures
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableFeeHeads.map((feeHead, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{feeHead.name}</div>
                      <div className="text-sm text-muted-foreground">{feeHead.description}</div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary">{feeHead.category}</Badge>
                        <Badge variant="outline">
                          {feeHead.currency} {feeHead.default_amount}
                        </Badge>
                        {feeHead.is_mandatory && (
                          <Badge variant="default">Mandatory</Badge>
                        )}
                        {feeHead.is_recurring && (
                          <Badge variant="outline">{feeHead.recurrence_frequency}</Badge>
                        )}
                      </div>
                      {feeHead.applicable_classes.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Classes: {feeHead.applicable_classes.join(', ')}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => installIndividualFeeHead(feeHead)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Install
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee Management Master Data Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{MASTER_FEE_HEADS.length}</div>
              <div className="text-sm text-muted-foreground">Total Master Fee Heads</div>
            </div>
            <div className="p-4 bg-success/10 rounded-lg">
              <div className="text-2xl font-bold text-success">{installedFeeHeads.length}</div>
              <div className="text-sm text-muted-foreground">Already Installed</div>
            </div>
            <div className="p-4 bg-warning/10 rounded-lg">
              <div className="text-2xl font-bold text-warning">{availableFeeHeads.length}</div>
              <div className="text-sm text-muted-foreground">Available to Install</div>
            </div>
          </div>

          <Separator />

          <div className="text-sm text-muted-foreground">
            <h4 className="font-medium mb-2">What's included in Fee Management Master Data:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Core academic fees (Tuition, Registration, Examination)</li>
              <li>Service fees (Transport, Meals, Boarding)</li>
              <li>Activity fees (Sports, Music, Excursions)</li>
              <li>Resource fees (ICT, Laboratory, Library)</li>
              <li>Mandatory and optional fee classifications</li>
              <li>Recurring and one-time payment structures</li>
              <li>Class-specific fee applications</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};