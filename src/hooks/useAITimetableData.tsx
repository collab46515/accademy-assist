import { useState } from 'react';

export interface AITimetableStats {
  totalPeriods: number;
  totalSubjects: number;
  totalTeachers: number;
  totalRooms: number;
  totalClasses: number;
  utilizationRate: number;
  constraintsSatisfied: number;
  totalConstraints: number;
}

export function useAITimetableData() {
  const [loading, setLoading] = useState(false);

  // Mock stats for now - will be populated when database is available
  const stats: AITimetableStats = {
    totalPeriods: 0,
    totalSubjects: 0,
    totalTeachers: 0,
    totalRooms: 0,
    totalClasses: 0,
    utilizationRate: 0,
    constraintsSatisfied: 0,
    totalConstraints: 0
  };

  return {
    loading,
    stats,
    isDataComplete: () => false,
    getCompletionPercentage: () => 0
  };
}