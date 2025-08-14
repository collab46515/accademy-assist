import React from 'react';
import { TestEnrollmentProcessor } from '@/components/admissions/TestEnrollmentProcessor';

const EnrollmentTestPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">🔧 Enrollment Debug Test</h1>
        <p className="text-muted-foreground">
          This page helps debug the foreign key constraint error in the enrollment process
        </p>
      </div>

      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-800 mb-4">Debug Test Component</h2>
        <p className="text-red-700 mb-6">
          Click the button below to run the enrollment test. Open your browser console (F12) 
          to see detailed logs about where the foreign key error occurs.
        </p>
        
        <TestEnrollmentProcessor />
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded">
          <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside text-yellow-700 space-y-1">
            <li>Open browser console (Press F12, then click Console tab)</li>
            <li>Click "Run Direct Enrollment Test" button above</li>
            <li>Watch the console for detailed logs</li>
            <li>Copy any error messages and share them</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentTestPage;