#!/usr/bin/env node

/**
 * Seed script for TaskTrekker
 * Populates Supabase with test data
 * Run: node supabase/seed.js
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🌱 Seeding TaskTrekker database...");

  try {
    // Create users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .insert([
        { name: "Alice Johnson", avatar_url: null },
        { name: "Bob Smith", avatar_url: null },
        { name: "Charlie Brown", avatar_url: null },
      ])
      .select();

    if (usersError) throw usersError;
    console.log(`✓ Created ${users.length} users`);

    // Create labels
    const { data: labels, error: labelsError } = await supabase
      .from("labels")
      .insert([
        { name: "bug", color: "#ff6b6b" },
        { name: "feature", color: "#4ecdc4" },
        { name: "docs", color: "#95e1d3" },
        { name: "urgent", color: "#f38181" },
      ])
      .select();

    if (labelsError) throw labelsError;
    console.log(`✓ Created ${labels.length} labels`);

    // Create issues
    const { data: issues, error: issuesError } = await supabase
      .from("issues")
      .insert([
        {
          title: "Fix login redirect",
          description: "Users are not redirected to dashboard after login",
          status: "in_progress",
          priority: "high",
          assignee_id: users[0].id,
        },
        {
          title: "Add dark mode",
          description: "Implement dark theme toggle in settings",
          status: "backlog",
          priority: "low",
          assignee_id: users[1].id,
        },
        {
          title: "GraphQL schema documentation",
          description: "Document pg_graphql conventions and Relay integration",
          status: "todo",
          priority: "medium",
          assignee_id: users[0].id,
        },
        {
          title: "Optimize issue list queries",
          description: "Reduce N+1 queries on issue detail page",
          status: "backlog",
          priority: "medium",
          assignee_id: null,
        },
        {
          title: "Database migration tooling",
          description: "Set up Supabase migrations for CI/CD",
          status: "done",
          priority: "high",
          assignee_id: users[2].id,
        },
      ])
      .select();

    if (issuesError) throw issuesError;
    console.log(`✓ Created ${issues.length} issues`);

    // Create comments
    const { data: comments, error: commentsError } = await supabase
      .from("comments")
      .insert([
        {
          issue_id: issues[0].id,
          body: "This is blocking the release. Let's prioritize it.",
          author_id: users[1].id,
        },
        {
          issue_id: issues[0].id,
          body: "I've identified the issue in the auth service. Working on a fix.",
          author_id: users[0].id,
        },
        {
          issue_id: issues[2].id,
          body: "Can we include examples of common patterns?",
          author_id: users[2].id,
        },
      ])
      .select();

    if (commentsError) throw commentsError;
    console.log(`✓ Created ${comments.length} comments`);

    // Create issue-label associations
    const { error: issueLabelsError } = await supabase
      .from("issue_labels")
      .insert([
        { issue_id: issues[0].id, label_id: labels[0].id }, // bug
        { issue_id: issues[0].id, label_id: labels[3].id }, // urgent
        { issue_id: issues[1].id, label_id: labels[1].id }, // feature
        { issue_id: issues[2].id, label_id: labels[2].id }, // docs
        { issue_id: issues[3].id, label_id: labels[1].id }, // feature
      ]);

    if (issueLabelsError) throw issueLabelsError;
    console.log(`✓ Created issue-label associations`);

    console.log("\n✅ Seed complete!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
