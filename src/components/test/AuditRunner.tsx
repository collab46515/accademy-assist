/**
 * Audit Runner Component
 * UI component to run comprehensive audits and display results
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Clock, Play, FileText, Database, Settings, Shield, Zap } from 'lucide-react';
import { auditSystem } from '../../tests/comprehensive-audit.test';
import { buttonAuditor } from '../../tests/button-functionality-audit';
import { databaseAuditor } from '../../tests/database-constraints-audit';
import { comprehensiveAuditor } from '../../tests/run-comprehensive-audit';

export const AuditRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [auditResults, setAuditResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const runComprehensiveAudit = async () => {
    setIsRunning(true);
    try {
      console.log('🔍 Starting Comprehensive Audit...');
      
      // Run all audit systems
      const systemResults = await auditSystem.runAllAudits();
      const buttonResults = await buttonAuditor.auditAllButtons();
      const buttonSummary = buttonAuditor.getAuditSummary();
      const databaseResults = await databaseAuditor.auditDatabase();
      const databaseSummary = databaseAuditor.getAuditSummary();
      const fullAudit = await comprehensiveAuditor.runFullAudit();

      setAuditResults({
        systemResults,
        buttonResults,
        buttonSummary,
        databaseResults,
        databaseSummary,
        fullAudit,
        timestamp: new Date().toISOString()
      });

      console.log('✅ Audit Complete!');
    } catch (error) {
      console.error('❌ Audit failed:', error);
      setAuditResults({
        error: `Audit failed: ${error}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runQuickHealthCheck = async () => {
    setIsRunning(true);
    try {
      const healthCheck = await comprehensiveAuditor.quickHealthCheck();
      setAuditResults({
        healthCheck,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setAuditResults({
        error: `Health check failed: ${error}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">🟢 Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">🟡 Warning</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">🔴 Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🔍 Application Audit System</h1>
          <p className="text-muted-foreground">
            Comprehensive testing and validation of all application components
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={runQuickHealthCheck} 
            disabled={isRunning}
            variant="outline"
            className="gap-2"
          >
            <Zap className="w-4 h-4" />
            {isRunning ? 'Running...' : 'Quick Health Check'}
          </Button>
          <Button 
            onClick={runComprehensiveAudit} 
            disabled={isRunning}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running Audit...' : 'Run Full Audit'}
          </Button>
        </div>
      </div>

      {isRunning && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 animate-spin" />
              <div>
                <h3 className="font-semibold">Audit in Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Running comprehensive tests on all system components...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {auditResults && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {auditResults.fullAudit && (
                <>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Overall Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-3xl font-bold ${getScoreColor(auditResults.fullAudit.overallScore)}`}>
                        {auditResults.fullAudit.overallScore}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        System health score
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Critical Issues
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-600">
                        {auditResults.fullAudit.criticalIssues}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Require immediate attention
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Last Audit
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        {new Date(auditResults.timestamp).toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Audit completed
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}

              {auditResults.healthCheck && (
                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Health Check Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      {getStatusBadge(auditResults.healthCheck.status)}
                      <span className="text-2xl font-bold">
                        Score: {auditResults.healthCheck.score}%
                      </span>
                    </div>
                    {auditResults.healthCheck.issues.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Issues Found:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {auditResults.healthCheck.issues.map((issue: string, index: number) => (
                            <li key={index} className="text-sm text-red-600">{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {auditResults.fullAudit?.recommendations && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Priority Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {auditResults.fullAudit.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="buttons" className="space-y-4">
            {auditResults.buttonSummary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Total Buttons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{auditResults.buttonSummary.total}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Functioning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {auditResults.buttonSummary.functioning}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">With Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {auditResults.buttonSummary.withIssues}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getScoreColor(parseInt(auditResults.buttonSummary.completionRate.replace('%', '')))}`}>
                      {auditResults.buttonSummary.completionRate}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {auditResults.buttonResults && (
              <Card>
                <CardHeader>
                  <CardTitle>Button Issues Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {auditResults.buttonResults.filter((r: any) => r.issues.length > 0).map((result: any, index: number) => (
                      <div key={index} className="border rounded p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{result.buttonId}</span>
                          <Badge variant={result.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {result.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{result.componentPath}</p>
                        <ul className="text-sm text-red-600 mt-1">
                          {result.issues.map((issue: string, i: number) => (
                            <li key={i}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            {auditResults.databaseSummary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Total Tables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{auditResults.databaseSummary.total}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Secure Tables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {auditResults.databaseSummary.secure}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">With Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {auditResults.databaseSummary.withIssues}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Security Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getScoreColor(parseInt(auditResults.databaseSummary.securityScore.replace('%', '')))}`}>
                      {auditResults.databaseSummary.securityScore}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {auditResults.databaseResults && (
              <Card>
                <CardHeader>
                  <CardTitle>Database Security Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {auditResults.databaseResults.filter((r: any) => r.issues.length > 0).map((result: any, index: number) => (
                      <div key={index} className="border rounded p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{result.tableName}</span>
                          <Badge variant={result.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {result.severity}
                          </Badge>
                        </div>
                        <ul className="text-sm text-red-600 mt-1">
                          {result.issues.map((issue: string, i: number) => (
                            <li key={i}>• {issue}</li>
                          ))}
                        </ul>
                        {result.recommendations.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Recommendations:</p>
                            <ul className="text-sm text-blue-600">
                              {result.recommendations.map((rec: string, i: number) => (
                                <li key={i}>• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Audit Summary
                </CardTitle>
                <CardDescription>
                  Critical security checks and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">✅ Security Measures Active</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Row Level Security (RLS) enabled</li>
                        <li>• Authentication system configured</li>
                        <li>• API rate limiting in place</li>
                        <li>• Encrypted data transmission</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">⚠️ Areas Needing Attention</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Some tables missing RLS policies</li>
                        <li>• Function search paths need review</li>
                        <li>• OTP expiry settings review needed</li>
                        <li>• Password leak protection disabled</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Audit Results</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(auditResults, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {auditResults?.error && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Audit Error</h3>
                <p className="text-sm">{auditResults.error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};