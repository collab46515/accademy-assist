import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, Mail, Lock, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AuthSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await signIn(email, password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else {
          setError(error.message);
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });
        // No need to navigate manually - the Index component will handle the redirect
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const demoCredentials = [
    { role: "School Admin", email: "admin@demoschool.edu", password: "demo123456" },
    { role: "Teacher", email: "teacher@demoschool.edu", password: "demo123456" },
    { role: "HOD", email: "hod@demoschool.edu", password: "demo123456" },
  ];

  return (
    <section className="py-24 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-primary border-primary/20">
              Get Started Today
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold">
              Access Your
              <span className="text-primary block">School Management System</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sign in to your existing account to start managing your educational institution.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 items-start">
            {/* Authentication Form */}
            <Card className="shadow-xl border-0">
              <CardHeader className="space-y-4 text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <GraduationCap className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Welcome to EduFlow Pro</CardTitle>
                  <CardDescription className="text-base">
                    Sign in to access your school management dashboard
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold">Sign In to Your Account</h3>
                    <p className="text-muted-foreground">Use the demo credentials below to test the system</p>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}


                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@school.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>

            {/* Demo Credentials & Features */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Try Demo Accounts
                  </CardTitle>
                  <CardDescription>
                    Experience different user roles with our demo accounts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {demoCredentials.map((demo, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{demo.role}</Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setEmail(demo.email);
                            setPassword(demo.password);
                          }}
                        >
                          Use Credentials
                        </Button>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="text-muted-foreground">Email: {demo.email}</div>
                        <div className="text-muted-foreground">Password: {demo.password}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What You Get</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Complete school management suite",
                    "12+ integrated modules",
                    "Real-time analytics and reports", 
                    "Mobile-responsive design",
                    "24/7 customer support",
                    "Regular updates and new features"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}