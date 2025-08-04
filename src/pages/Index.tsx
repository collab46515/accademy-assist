import React from 'react';
import { Button } from '@/components/ui/button';
import { School } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto p-8">
        <School className="h-16 w-16 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">School Management System</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to the comprehensive school management platform
        </p>
        <div className="space-y-4">
          <Button size="lg" asChild className="w-full">
            <Link to="/auth">Sign In to Continue</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;