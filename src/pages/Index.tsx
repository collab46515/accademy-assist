import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoginRedirectHandler } from "@/components/auth/LoginRedirectHandler";
import { useAuth } from "@/hooks/useAuth";
import LandingPage from "./LandingPage";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Listen for auth changes for non-authenticated users
    if (!user) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          // User just logged in, LoginRedirectHandler will handle the redirect
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [navigate, user]);

  // Show redirect handler for authenticated users, landing page for others
  return (
    <>
      {user && <LoginRedirectHandler />}
      <LandingPage />
    </>
  );
}