#!/usr/bin/env node

/**
 * Fetches the pg_graphql introspection schema from Supabase and writes
 * schema.graphql for the Relay compiler.
 *
 * No schema patching is needed -- relay-compiler's schemaConfig.nodeInterfaceIdField
 * handles the nodeId/id convention difference. This script just converts
 * introspection JSON to SDL.
 *
 * Run: node scripts/fetch-schema.js
 */

import fs from "fs";
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
}

const response = await fetch(`${supabaseUrl}/graphql/v1`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    apikey: supabaseKey,
  },
  body: JSON.stringify({ query: getIntrospectionQuery() }),
});

const { data, errors } = await response.json();

if (errors) {
  console.error("Introspection errors:", errors);
  process.exit(1);
}

const schema = buildClientSchema(data);
const sdl = printSchema(schema);

fs.writeFileSync("schema.graphql", sdl);
console.log("✓ schema.graphql written");
