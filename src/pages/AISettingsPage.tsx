import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Key, 
  Brain, 
  Shield, 
  BarChart3,
  AlertCircle,
  CheckCircle,
  Zap,
  Database
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AgentBillTest } from '@/components/ai/AgentBillTest';

export const AISettingsPage = () => {
  const { toast } = useToast();
  const [apiKeyConnected, setApiKeyConnected] = useState(false);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "AI configuration has been updated successfully",
    });
  };

  const handleConnectAPI = () => {
    // This would open the secret form for API key
    toast({
      title: "API Connection",
      description: "Please configure your API key through the secure form",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center space-x-3">
          <Settings className="h-8 w-8 text-primary" />
          <span>AI Settings & Configuration</span>
        </h1>
        <p className="text-muted-foreground">Configure AI models, API keys, and generation preferences for all AI features</p>
      </div>

      {/* Agent Bill Integration Test */}
      <div className="mb-8">
        <AgentBillTest />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Secure API key management for AI services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-warning/10 border border-warning rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <h4 className="font-medium">AI API Configuration Required</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  AI features require API keys to be configured. Keys are securely stored using Supabase Edge Functions.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm">AI</span>
                      </div>
                      <div>
                        <p className="font-medium">OpenAI GPT-4</p>
                        <p className="text-sm text-muted-foreground">Recommended for lesson planning</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {apiKeyConnected ? (
                        <Badge className="bg-success text-success-foreground">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not Connected</Badge>
                      )}
                      <Button size="sm" variant="outline" onClick={handleConnectAPI}>
                        Configure
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">C</span>
                      </div>
                      <div>
                        <p className="font-medium">Anthropic Claude</p>
                        <p className="text-sm text-muted-foreground">Great for detailed explanations</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Optional</Badge>
                      <Button size="sm" variant="outline" disabled>
                        Configure
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">G</span>
                      </div>
                      <div>
                        <p className="font-medium">Google Gemini</p>
                        <p className="text-sm text-muted-foreground">Cost-effective option</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Optional</Badge>
                      <Button size="sm" variant="outline" disabled>
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Generation Settings
              </CardTitle>
              <CardDescription>
                Configure default settings for AI content generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>AI Model Temperature</Label>
                  <Select defaultValue="balanced">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="creative">Creative (0.9)</SelectItem>
                      <SelectItem value="balanced">Balanced (0.7)</SelectItem>
                      <SelectItem value="focused">Focused (0.3)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">Higher values = more creative, lower = more focused</p>
                </div>
                <div>
                  <Label>Response Length</Label>
                  <Select defaultValue="detailed">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">Concise</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Default Lesson Duration</Label>
                  <Select defaultValue="60">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Assignment Complexity</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="complex">Complex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Default Features</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="includeExtension" defaultChecked />
                    <Label htmlFor="includeExtension">Extension activities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="senSupport" defaultChecked />
                    <Label htmlFor="senSupport">SEN support strategies</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="autoReview" />
                    <Label htmlFor="autoReview">AI self-review</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="saveTemplates" defaultChecked />
                    <Label htmlFor="saveTemplates">Save as templates</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
              <CardDescription>
                Data protection and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="dataEncryption" defaultChecked disabled />
                  <Label htmlFor="dataEncryption">Data encryption enabled</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="auditLogging" defaultChecked disabled />
                  <Label htmlFor="auditLogging">Audit logging enabled</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="dataRetention" defaultChecked />
                  <Label htmlFor="dataRetention">Automatic data retention (30 days)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="anonymizeData" />
                  <Label htmlFor="anonymizeData">Anonymize student data in AI requests</Label>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <CheckCircle className="h-4 w-4 inline mr-1" />
                  All API keys are securely stored using Supabase encryption
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Usage Stats & Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Lesson Plans Generated</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Assignments Created</span>
                  <span className="font-medium">17</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Comments Generated</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">API Calls This Month</span>
                  <span className="font-medium">1,247</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Cost Optimization</p>
                <p className="text-xs text-muted-foreground">
                  Estimated monthly cost: <span className="font-medium">₹1,950</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: "35%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground">35% of budget used</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                Export All Generated Content
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Run Security Audit
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Model Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">OpenAI GPT-4</span>
                <Badge className="bg-success text-success-foreground">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Response Time</span>
                <span className="text-sm font-medium">1.2s avg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="text-sm font-medium">99.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};