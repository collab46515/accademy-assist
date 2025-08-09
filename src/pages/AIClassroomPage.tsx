import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { AIClassroomDashboard } from "@/components/ai-classroom/AIClassroomDashboard";
import { AIClassroomSession } from "@/components/ai-classroom/AIClassroomSession";
import { useAuth } from "@/hooks/useAuth";

function AIClassroomRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  
  if (!user || !id) return <div>Loading...</div>;
  
  // Special demo configuration
  const isDemoSession = id === 'demo-session-1';
  
  if (isDemoSession) {
    return (
      <AIClassroomSession
        roomId={id}
        userId={user.id}
        userName="Demo Teacher"
        userRole="teacher"
        lessonTitle="🚀 AI Classroom Demo - Interactive Mathematics"
        isDemoMode={true}
      />
    );
  }
  
  return (
    <AIClassroomSession
      roomId={id}
      userId={user.id}
      userName={user.email?.split('@')[0] || 'Student'}
      userRole="teacher" // This should be determined based on user permissions
      lessonTitle="AI-Enhanced Mathematics - Algebra Fundamentals"
    />
  );
}

export default function AIClassroomPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Routes>
        <Route path="/" element={<Navigate to="/ai-classroom/dashboard" replace />} />
        <Route path="/dashboard" element={
          <div className="space-y-6">
            <PageHeader 
              title="AI Classroom Suite" 
              description="Revolutionary AI-powered teaching and learning environment"
            />
            <AIClassroomDashboard />
          </div>
        } />
        <Route path="/session/:id" element={<AIClassroomRoom />} />
      </Routes>
    </div>
  );
}