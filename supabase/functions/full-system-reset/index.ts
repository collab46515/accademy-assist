import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResetResult {
  success: boolean;
  message: string;
  database_reset?: any;
  storage_reset?: {
    buckets_emptied: string[];
    files_deleted: number;
  };
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const result: ResetResult = {
      success: false,
      message: 'Reset initiated'
    };

    // Step 1: Reset database - truncate all public tables, preserve Auth users
    console.log('Starting database reset...');
    const { data: dbResult, error: dbError } = await supabaseAdmin
      .rpc('reset_public_data_preserve_auth');

    if (dbError) {
      console.error('Database reset error:', dbError);
      result.error = `Database reset failed: ${dbError.message}`;
      return new Response(JSON.stringify(result), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    result.database_reset = dbResult;
    console.log('Database reset completed:', dbResult);

    // Step 2: Empty all Storage buckets
    console.log('Starting storage cleanup...');
    const buckets = ['application-documents', 'submissions', 'school-assets', 'lesson-attachments'];
    const bucketsEmptied: string[] = [];
    let totalFilesDeleted = 0;

    for (const bucketName of buckets) {
      try {
        // List all files in the bucket
        const { data: files, error: listError } = await supabaseAdmin.storage
          .from(bucketName)
          .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

        if (listError) {
          console.warn(`Warning: Could not list files in bucket ${bucketName}:`, listError);
          continue;
        }

        if (files && files.length > 0) {
          // Delete all files in the bucket
          const filePaths = files.map(file => file.name);
          const { error: deleteError } = await supabaseAdmin.storage
            .from(bucketName)
            .remove(filePaths);

          if (deleteError) {
            console.warn(`Warning: Could not delete files in bucket ${bucketName}:`, deleteError);
          } else {
            bucketsEmptied.push(bucketName);
            totalFilesDeleted += files.length;
            console.log(`Emptied bucket ${bucketName}: ${files.length} files deleted`);
          }
        } else {
          bucketsEmptied.push(bucketName);
          console.log(`Bucket ${bucketName} was already empty`);
        }
      } catch (error) {
        console.warn(`Warning: Error processing bucket ${bucketName}:`, error);
      }
    }

    result.storage_reset = {
      buckets_emptied: bucketsEmptied,
      files_deleted: totalFilesDeleted
    };

    result.success = true;
    result.message = `System reset completed! Database: ${dbResult.tables_count} tables truncated, ${dbResult.sequences_reset.length} sequences reset. Storage: ${totalFilesDeleted} files deleted from ${bucketsEmptied.length} buckets. Auth users preserved.`;

    console.log('Full system reset completed successfully');

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Unexpected error during reset:', error);
    
    const result: ResetResult = {
      success: false,
      message: 'Reset failed due to unexpected error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    return new Response(JSON.stringify(result), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});