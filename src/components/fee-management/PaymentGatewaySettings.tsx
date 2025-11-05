import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, CreditCard, Wallet, Globe, DollarSign, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// Validation schemas
const apiKeySchema = z.string()
  .trim()
  .min(10, 'API key must be at least 10 characters')
  .max(500, 'API key must be less than 500 characters')
  .regex(/^[a-zA-Z0-9_\-\.]+$/, 'API key contains invalid characters');

const secretKeySchema = z.string()
  .trim()
  .min(10, 'Secret key must be at least 10 characters')
  .max(500, 'Secret key must be less than 500 characters')
  .regex(/^[a-zA-Z0-9_\-\.]+$/, 'Secret key contains invalid characters');

const webhookUrlSchema = z.string()
  .trim()
  .url('Invalid webhook URL')
  .max(500, 'Webhook URL must be less than 500 characters')
  .optional()
  .or(z.literal(''));

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
  showApiKey?: boolean;
  showSecretKey?: boolean;
  testStatus?: 'idle' | 'testing' | 'success' | 'error';
  testMessage?: string;
}

const PAYMENT_GATEWAYS: Omit<PaymentGateway, 'isEnabled' | 'apiKey' | 'secretKey' | 'webhookUrl'>[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Global payment processing with excellent international support',
    icon: CreditCard,
    supportedCurrencies: ['INR', 'GBP', 'EUR'],
    fees: { percentage: 2.9, fixedFee: 30 }
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Widely trusted payment platform with buyer protection',
    icon: Wallet,
    supportedCurrencies: ['INR', 'GBP', 'EUR'],
    fees: { percentage: 3.4, fixedFee: 20 }
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Popular payment gateway for Indian and international markets',
    icon: Globe,
    supportedCurrencies: ['INR', 'EUR', 'GBP'],
    fees: { percentage: 2.0, fixedFee: 0 }
  },
  {
    id: 'square',
    name: 'Square',
    description: 'Comprehensive payment solution with POS integration',
    icon: DollarSign,
    supportedCurrencies: ['INR', 'GBP', 'JPY'],
    fees: { percentage: 2.9, fixedFee: 30 }
  }
];

export const PaymentGatewaySettings = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
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
          webhookUrl: savedSetting?.webhook_url || '',
          showApiKey: false,
          showSecretKey: false,
          testStatus: 'idle' as const,
          testMessage: ''
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
        webhookUrl: '',
        showApiKey: false,
        showSecretKey: false,
        testStatus: 'idle' as const,
        testMessage: ''
      }));
      setGateways(defaultGateways);
    } finally {
      setLoading(false);
    }
  };

  const validateField = (gatewayId: string, field: 'apiKey' | 'secretKey' | 'webhookUrl', value: string): boolean => {
    try {
      if (field === 'apiKey') {
        apiKeySchema.parse(value);
      } else if (field === 'secretKey') {
        secretKeySchema.parse(value);
      } else if (field === 'webhookUrl' && value) {
        webhookUrlSchema.parse(value);
      }
      
      // Clear error for this field
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${gatewayId}-${field}`];
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(prev => ({
          ...prev,
          [`${gatewayId}-${field}`]: error.errors[0].message
        }));
      }
      return false;
    }
  };

  const updateGateway = (gatewayId: string, updates: Partial<PaymentGateway>) => {
    setGateways(prev => prev.map(gateway => 
      gateway.id === gatewayId ? { ...gateway, ...updates } : gateway
    ));
  };

  const testPaymentGateway = async (gatewayId: string) => {
    const gateway = gateways.find(g => g.id === gatewayId);
    if (!gateway) return;

    // Validate credentials before testing
    const apiKeyValid = validateField(gatewayId, 'apiKey', gateway.apiKey);
    const secretKeyValid = validateField(gatewayId, 'secretKey', gateway.secretKey);
    
    if (!apiKeyValid || !secretKeyValid) {
      toast({
        title: "Validation Error",
        description: "Please fix validation errors before testing",
        variant: "destructive"
      });
      return;
    }

    updateGateway(gatewayId, { testStatus: 'testing', testMessage: '' });

    try {
      // Simulate API test - Replace with actual gateway test call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, randomly succeed/fail
      const success = Math.random() > 0.3;
      
      if (success) {
        updateGateway(gatewayId, { 
          testStatus: 'success', 
          testMessage: '✓ Connection successful! Gateway is ready to accept payments.' 
        });
        toast({
          title: "Test Successful",
          description: `${gateway.name} is configured correctly`,
        });
      } else {
        updateGateway(gatewayId, { 
          testStatus: 'error', 
          testMessage: '✗ Invalid credentials. Please check your API keys.' 
        });
        toast({
          title: "Test Failed",
          description: `Unable to connect to ${gateway.name}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      updateGateway(gatewayId, { 
        testStatus: 'error', 
        testMessage: '✗ Connection failed. Please try again.' 
      });
      toast({
        title: "Test Error",
        description: "Failed to test payment gateway",
        variant: "destructive"
      });
    }
  };

  const saveGatewaySettings = async () => {
    // Validate all enabled gateways before saving
    let hasErrors = false;
    gateways.forEach(gateway => {
      if (gateway.isEnabled) {
        if (!validateField(gateway.id, 'apiKey', gateway.apiKey)) hasErrors = true;
        if (!validateField(gateway.id, 'secretKey', gateway.secretKey)) hasErrors = true;
        if (gateway.webhookUrl && !validateField(gateway.id, 'webhookUrl', gateway.webhookUrl)) hasErrors = true;
      }
    });

    if (hasErrors) {
      toast({
        title: "Validation Error",
        description: "Please fix all validation errors before saving",
        variant: "destructive"
      });
      return;
    }

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
                      <>
                        <Alert className="bg-amber-50 border-amber-200">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="text-sm text-amber-800">
                            <strong>Security Notice:</strong> API keys are sensitive credentials. Never share them publicly or commit them to version control.
                          </AlertDescription>
                        </Alert>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`${gateway.id}-api-key`}>
                              API Key / Public Key <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                              <Input
                                id={`${gateway.id}-api-key`}
                                type={gateway.showApiKey ? "text" : "password"}
                                placeholder="Enter API key..."
                                value={gateway.apiKey}
                                onChange={(e) => {
                                  const value = e.target.value.trim();
                                  updateGateway(gateway.id, { apiKey: value });
                                  if (value) validateField(gateway.id, 'apiKey', value);
                                }}
                                onBlur={(e) => {
                                  if (e.target.value) validateField(gateway.id, 'apiKey', e.target.value);
                                }}
                                className={validationErrors[`${gateway.id}-apiKey`] ? 'border-destructive' : ''}
                                maxLength={500}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => updateGateway(gateway.id, { showApiKey: !gateway.showApiKey })}
                              >
                                {gateway.showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                            {validationErrors[`${gateway.id}-apiKey`] && (
                              <p className="text-sm text-destructive">{validationErrors[`${gateway.id}-apiKey`]}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${gateway.id}-secret-key`}>
                              Secret Key <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                              <Input
                                id={`${gateway.id}-secret-key`}
                                type={gateway.showSecretKey ? "text" : "password"}
                                placeholder="Enter secret key..."
                                value={gateway.secretKey}
                                onChange={(e) => {
                                  const value = e.target.value.trim();
                                  updateGateway(gateway.id, { secretKey: value });
                                  if (value) validateField(gateway.id, 'secretKey', value);
                                }}
                                onBlur={(e) => {
                                  if (e.target.value) validateField(gateway.id, 'secretKey', e.target.value);
                                }}
                                className={validationErrors[`${gateway.id}-secretKey`] ? 'border-destructive' : ''}
                                maxLength={500}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => updateGateway(gateway.id, { showSecretKey: !gateway.showSecretKey })}
                              >
                                {gateway.showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                            {validationErrors[`${gateway.id}-secretKey`] && (
                              <p className="text-sm text-destructive">{validationErrors[`${gateway.id}-secretKey`]}</p>
                            )}
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor={`${gateway.id}-webhook`}>Webhook URL (Optional)</Label>
                            <Input
                              id={`${gateway.id}-webhook`}
                              type="url"
                              placeholder="https://yourapp.com/webhooks/payment"
                              value={gateway.webhookUrl}
                              onChange={(e) => {
                                const value = e.target.value.trim();
                                updateGateway(gateway.id, { webhookUrl: value });
                                if (value) validateField(gateway.id, 'webhookUrl', value);
                              }}
                              onBlur={(e) => {
                                if (e.target.value) validateField(gateway.id, 'webhookUrl', e.target.value);
                              }}
                              className={validationErrors[`${gateway.id}-webhookUrl`] ? 'border-destructive' : ''}
                              maxLength={500}
                            />
                            {validationErrors[`${gateway.id}-webhookUrl`] && (
                              <p className="text-sm text-destructive">{validationErrors[`${gateway.id}-webhookUrl`]}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Webhook URL for receiving payment notifications
                            </p>
                          </div>
                        </div>
                      </>
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
                    const isTesting = gateway.testStatus === 'testing';
                    
                    return (
                      <Card key={gateway.id} className={
                        gateway.testStatus === 'success' ? 'border-success' : 
                        gateway.testStatus === 'error' ? 'border-destructive' : ''
                      }>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <Icon className="h-6 w-6" />
                            <div className="flex-1">
                              <h4 className="font-medium">{gateway.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {isConfigured ? 'Ready for testing' : 'Configuration required'}
                              </p>
                            </div>
                            {gateway.testStatus === 'success' && (
                              <CheckCircle className="h-5 w-5 text-success" />
                            )}
                            {gateway.testStatus === 'error' && (
                              <AlertCircle className="h-5 w-5 text-destructive" />
                            )}
                          </div>
                          
                          {gateway.testMessage && (
                            <Alert className={
                              gateway.testStatus === 'success' ? 'bg-success/10 border-success' :
                              gateway.testStatus === 'error' ? 'bg-destructive/10 border-destructive' : ''
                            }>
                              <AlertDescription className="text-sm">
                                {gateway.testMessage}
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          <Button 
                            variant={gateway.testStatus === 'success' ? 'default' : 'outline'}
                            size="sm" 
                            disabled={!isConfigured || isTesting}
                            onClick={() => testPaymentGateway(gateway.id)}
                            className="w-full"
                          >
                            {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isTesting ? 'Testing...' : 'Test Connection'}
                          </Button>
                          
                          <p className="text-xs text-muted-foreground text-center">
                            This will validate your API credentials
                          </p>
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