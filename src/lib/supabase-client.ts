"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser-side singleton used by realtime subscriptions. The Relay environment
// has its own fetch path for GraphQL — this client exists only for the
// realtime websocket. Memoized per tab so all hooks share one socket.

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return client;
}
