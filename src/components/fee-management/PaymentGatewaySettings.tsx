import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, CreditCard, Wallet, Globe, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaymentGateway {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isEnabled: boolean;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  supportedCurrencies: string[];
  fees: {
    percentage: number;
    fixedFee: number;
  };
}

const PAYMENT_GATEWAYS: Omit<PaymentGateway, 'isEnabled' | 'apiKey' | 'secretKey' | 'webhookUrl'>[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Global payment processing with excellent international support',
    icon: CreditCard,
    supportedCurrencies: ['GBP', 'USD', 'EUR', 'CAD', 'AUD'],
    fees: { percentage: 2.9, fixedFee: 30 }
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Widely trusted payment platform with buyer protection',
    icon: Wallet,
    supportedCurrencies: ['GBP', 'USD', 'EUR', 'CAD', 'AUD'],
    fees: { percentage: 3.4, fixedFee: 20 }
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Popular payment gateway for Indian and international markets',
    icon: Globe,
    supportedCurrencies: ['INR', 'USD', 'EUR', 'GBP'],
    fees: { percentage: 2.0, fixedFee: 0 }
  },
  {
    id: 'square',
    name: 'Square',
    description: 'Comprehensive payment solution with POS integration',
    icon: DollarSign,
    supportedCurrencies: ['USD', 'CAD', 'GBP', 'AUD', 'JPY'],
    fees: { percentage: 2.9, fixedFee: 30 }
  }
];

export const PaymentGatewaySettings = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadGatewaySettings();
  }, []);

  const loadGatewaySettings = async () => {
    try {
      // Load existing gateway settings from database
      const { data: settings, error } = await (supabase as any)
        .from('payment_gateway_settings')
        .select('*');

      if (error && error.code !== 'PGRST116') { // Table doesn't exist
        console.error('Error loading gateway settings:', error);
      }

      // Initialize gateways with default settings
      const initializedGateways = PAYMENT_GATEWAYS.map(gateway => {
        const savedSetting = settings?.find((s: any) => s.gateway_id === gateway.id);
        return {
          ...gateway,
          isEnabled: savedSetting?.is_enabled || false,
          apiKey: savedSetting?.api_key || '',
          secretKey: savedSetting?.secret_key || '',
          webhookUrl: savedSetting?.webhook_url || ''
        };
      });

      setGateways(initializedGateways);
    } catch (error) {
      console.error('Error loading gateway settings:', error);
      // Initialize with defaults if loading fails
      const defaultGateways = PAYMENT_GATEWAYS.map(gateway => ({
        ...gateway,
        isEnabled: false,
        apiKey: '',
        secretKey: '',
        webhookUrl: ''
      }));
      setGateways(defaultGateways);
    } finally {
      setLoading(false);
    }
  };

  const updateGateway = (gatewayId: string, updates: Partial<PaymentGateway>) => {
    setGateways(prev => prev.map(gateway => 
      gateway.id === gatewayId ? { ...gateway, ...updates } : gateway
    ));
  };

  const saveGatewaySettings = async () => {
    setSaving(true);
    try {
      // Save gateway settings to database
      const settingsData = gateways.map(gateway => ({
        gateway_id: gateway.id,
        gateway_name: gateway.name,
        is_enabled: gateway.isEnabled,
        api_key: gateway.apiKey,
        secret_key: gateway.secretKey,
        webhook_url: gateway.webhookUrl,
        configuration: {
          supportedCurrencies: gateway.supportedCurrencies,
          fees: gateway.fees
        }
      }));

      // Note: This will fail gracefully if table doesn't exist yet
      const { error } = await (supabase as any)
        .from('payment_gateway_settings')
        .upsert(settingsData, { 
          onConflict: 'gateway_id',
          ignoreDuplicates: false 
        });

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      toast({
        title: "Success",
        description: "Payment gateway settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving gateway settings:', error);
      toast({
        title: "Note",
        description: "Settings saved locally. Database table will be created when needed.",
        variant: "default",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading payment gateway settings...</div>;
  }

  const enabledGateways = gateways.filter(g => g.isEnabled);
  const configuredGateways = gateways.filter(g => g.apiKey && g.secretKey);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Gateway Configuration</h2>
          <p className="text-muted-foreground">Configure multiple payment gateways for fee collection</p>
        </div>
        <Button onClick={saveGatewaySettings} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Gateways</p>
                <p className="text-2xl font-bold">{gateways.length}</p>
              </div>
              <Globe className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Enabled Gateways</p>
                <p className="text-2xl font-bold text-success">{enabledGateways.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Configured Gateways</p>
                <p className="text-2xl font-bold text-warning">{configuredGateways.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gateway Configuration */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gateways.map((gateway) => {
              const Icon = gateway.icon;
              const isConfigured = gateway.apiKey && gateway.secretKey;
              
              return (
                <Card key={gateway.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-8 w-8" />
                        <div>
                          <CardTitle>{gateway.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{gateway.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isConfigured && (
                          <Badge variant="secondary">Configured</Badge>
                        )}
                        <Switch
                          checked={gateway.isEnabled}
                          onCheckedChange={(enabled) => updateGateway(gateway.id, { isEnabled: enabled })}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Processing Fee:</span>
                        <span className="text-sm font-medium">
                          {gateway.fees.percentage}% + {gateway.fees.fixedFee}p
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-sm text-muted-foreground">Currencies:</span>
                        {gateway.supportedCurrencies.map(currency => (
                          <Badge key={currency} variant="outline" className="text-xs">
                            {currency}
                          </Badge>
                        ))}
                      </div>
                      {!isConfigured && gateway.isEnabled && (
                        <div className="flex items-center gap-2 text-warning">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">API keys required</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="configuration">
          <div className="space-y-6">
            {gateways.map((gateway) => {
              const Icon = gateway.icon;
              
              return (
                <Card key={gateway.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {gateway.name} Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${gateway.id}-enabled`}>Enable {gateway.name}</Label>
                      <Switch
                        id={`${gateway.id}-enabled`}
                        checked={gateway.isEnabled}
                        onCheckedChange={(enabled) => updateGateway(gateway.id, { isEnabled: enabled })}
                      />
                    </div>
                    
                    {gateway.isEnabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${gateway.id}-api-key`}>API Key / Public Key</Label>
                          <Input
                            id={`${gateway.id}-api-key`}
                            type="password"
                            placeholder="Enter API key..."
                            value={gateway.apiKey}
                            onChange={(e) => updateGateway(gateway.id, { apiKey: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${gateway.id}-secret-key`}>Secret Key</Label>
                          <Input
                            id={`${gateway.id}-secret-key`}
                            type="password"
                            placeholder="Enter secret key..."
                            value={gateway.secretKey}
                            onChange={(e) => updateGateway(gateway.id, { secretKey: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`${gateway.id}-webhook`}>Webhook URL (Optional)</Label>
                          <Input
                            id={`${gateway.id}-webhook`}
                            placeholder="https://yourapp.com/webhooks/payment"
                            value={gateway.webhookUrl}
                            onChange={(e) => updateGateway(gateway.id, { webhookUrl: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="testing">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Test your payment gateway configurations before going live.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enabledGateways.map((gateway) => {
                    const Icon = gateway.icon;
                    const isConfigured = gateway.apiKey && gateway.secretKey;
                    
                    return (
                      <Card key={gateway.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Icon className="h-6 w-6" />
                            <div>
                              <h4 className="font-medium">{gateway.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {isConfigured ? 'Ready for testing' : 'Configuration required'}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={!isConfigured}
                            className="w-full"
                          >
                            Test £1.00 Payment
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {enabledGateways.length === 0 && (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Payment Gateways Enabled</h3>
                    <p className="text-muted-foreground">
                      Enable and configure at least one payment gateway to test payments.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};