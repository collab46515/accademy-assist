import React from 'react';
import { AITimetableGenerator } from "@/components/ai-timetable/AITimetableGenerator";

export const AITimetablePage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <AITimetableGenerator />
    </div>
  );
};