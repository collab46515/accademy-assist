import React from 'react';
import { AITimetableGenerator } from "@/components/ai-timetable/AITimetableGenerator";

export const AITimetablePage = () => {
  console.log('AITimetablePage rendering...');
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-4 p-4 bg-primary/10 rounded-lg">
        <p className="text-primary font-semibold">AI Timetable Page Loading...</p>
      </div>
      <AITimetableGenerator />
    </div>
  );
};