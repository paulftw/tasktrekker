#!/usr/bin/env node

/**
 * Large seed for TaskTrekker — wipes everything, restores the E2E fixtures
 * from seed.js verbatim, then populates a demo database for Vizor, a
 * (fictional) startup building an AI heads-up helmet for electric
 * streetracer motorbikes. ~90 issues, comments, and ten epics that
 * explicitly ask to be broken down into smaller tasks.
 *
 * Run: node supabase/seed-large.js
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

// --- Users ---------------------------------------------------------------
// Alice/Bob/Charlie come first so filter.spec.ts's "Assigned to me"
// heuristic (picks the first user) still resolves to Alice.
const USERS = [
  { name: "Alice Johnson" },
  { name: "Bob Smith" },
  { name: "Charlie Brown" },
  // Vizor team
  { name: "Yuliia Kravchenko" },   // Co-founder, CEO
  { name: "Solomiya Hnatyuk" },    // Lead ML / Perception
  { name: "Ostap Bondarenko" },    // Senior Firmware
  { name: "Mateus Oliveira" },     // Head of HUD UX (Brazil)
  { name: "Aoife Donnelly" },      // Computer Vision (Ireland)
  { name: "Kwame Asante" },        // Embedded Systems (Ghana)
  { name: "Priya Iyer" },          // Product Manager (India)
  { name: "Lars Eriksen" },        // Industrial Design (Denmark)
];

// --- Labels --------------------------------------------------------------
const LABELS = [
  // E2E fixtures
  { name: "bug", color: "ff6b6b" },
  { name: "feature", color: "4ecdc4" },
  { name: "docs", color: "95e1d3" },
  { name: "urgent", color: "f38181" },
  // Vizor
  { name: "epic", color: "7c3aed" },
  { name: "frontend", color: "3b82f6" },
  { name: "firmware", color: "ea580c" },
  { name: "ml", color: "10b981" },
  { name: "hardware", color: "92400e" },
  { name: "design", color: "ec4899" },
  { name: "safety", color: "dc2626" },
  { name: "needs-spec", color: "eab308" },
];

const BREAK_DOWN =
  "\n\n---\n**This is an epic. Break it down into smaller tasks before anyone starts work.**";

// --- Issues --------------------------------------------------------------
// Each issue: { title, description, status, priority, assignee (name|null),
//               labels: string[], comments: [{author, body}] }
const ISSUES = [
  // === E2E fixtures (preserved verbatim from seed.js) ====================
  {
    title: "Fix login redirect",
    description: "Users are not redirected to dashboard after login",
    status: "in_progress",
    priority: "high",
    assignee: "Alice Johnson",
    labels: ["bug", "urgent"],
    comments: [
      { author: "Bob Smith", body: "This is blocking the release. Let's prioritize it." },
      { author: "Alice Johnson", body: "I've identified the issue in the auth service. Working on a fix." },
    ],
  },
  {
    title: "Add dark mode",
    description: "Implement dark theme toggle in settings",
    status: "backlog",
    priority: "low",
    assignee: "Bob Smith",
    labels: ["feature"],
    comments: [],
  },
  {
    title: "GraphQL schema documentation",
    description: "Document pg_graphql conventions and Relay integration",
    status: "todo",
    priority: "medium",
    assignee: "Alice Johnson",
    labels: ["docs"],
    comments: [
      { author: "Charlie Brown", body: "Can we include examples of common patterns?" },
    ],
  },
  {
    title: "Optimize issue list queries",
    description: "Reduce N+1 queries on issue detail page",
    status: "backlog",
    priority: "medium",
    assignee: null,
    labels: ["feature"],
    comments: [],
  },
  {
    title: "Database migration tooling",
    description: "Set up Supabase migrations for CI/CD",
    status: "done",
    priority: "high",
    assignee: "Charlie Brown",
    labels: [],
    comments: [],
  },

  // === Vizor epics =======================================================
  {
    title: "EPIC: HUD Optics & Render Pipeline",
    description:
      "The visor is the product. We need a 60fps projection stack that stays readable from full sunlight to pitch-black tunnel, with zero perceptible lag when the rider turns their head.\n\nScope: projection calibration, render engine, font/glyph system, color pipeline, motion prediction, calibration profiles per helmet size." +
      BREAK_DOWN,
    status: "in_progress",
    priority: "urgent",
    assignee: "Mateus Oliveira",
    labels: ["epic", "frontend", "design"],
    comments: [
      { author: "Yuliia Kravchenko", body: "This is the demo centerpiece for the Series A. Mateus — let's have a v1 we can film on a closed track by end of May." },
      { author: "Mateus Oliveira", body: "Breakdown coming Friday. Kwame needs to see the optics budget before we lock the shell." },
    ],
  },
  {
    title: "EPIC: Perception & Computer Vision",
    description:
      "Rear-facing blind spot detection and forward-threat classification running on-device on the Qualcomm QCS6490. Must cope with rain, night, tunnel exits, and neighbouring bikes splitting lanes.\n\nEnd-to-end latency target (rear camera → HUD threat glyph) is 80ms." +
      BREAK_DOWN,
    status: "in_progress",
    priority: "urgent",
    assignee: "Solomiya Hnatyuk",
    labels: ["epic", "ml", "safety"],
    comments: [
      { author: "Solomiya Hnatyuk", body: "Splitting this into dataset, model, runtime, and latency tracks. Aoife owns the runtime thread." },
    ],
  },
  {
    title: "EPIC: Voice Assistant & Audio",
    description:
      "Hands-stay-on-bars control surface. Wake word, intent parser, bone-conduction audio, and the wind-noise suppression model that makes any of it possible above 120 km/h." +
      BREAK_DOWN,
    status: "todo",
    priority: "high",
    assignee: "Aoife Donnelly",
    labels: ["epic", "ml", "firmware"],
    comments: [],
  },
  {
    title: "EPIC: Companion Mobile App",
    description:
      "iOS + Android companion for ride history, ride replay, OTA triggers, biometric consent, and the post-crash debrief wizard." +
      BREAK_DOWN,
    status: "todo",
    priority: "high",
    assignee: "Priya Iyer",
    labels: ["epic", "frontend"],
    comments: [
      { author: "Priya Iyer", body: "Scoping for a public TestFlight by July. Lars — need final industrial renders for the onboarding carousel." },
    ],
  },
  {
    title: "EPIC: Bike Telemetry Integration",
    description:
      "Read battery SoC, motor temperature, regen state, and speed from supported electric bikes. Ship adapters for Zero SR/F, Energica Ego, Damon HyperSport, plus a generic ISO 15765-2 fallback." +
      BREAK_DOWN,
    status: "backlog",
    priority: "medium",
    assignee: "Ostap Bondarenko",
    labels: ["epic", "firmware", "hardware"],
    comments: [],
  },
  {
    title: "EPIC: Crash Detection & SOS",
    description:
      "If the rider goes down, we detect it, warn them, and call for help if they don't cancel. This epic covers IMU fusion, false-positive reduction (wheelies, stoppies, speed bumps), the countdown UI, and regional EMS integration." +
      BREAK_DOWN,
    status: "backlog",
    priority: "urgent",
    assignee: "Ostap Bondarenko",
    labels: ["epic", "safety", "firmware"],
    comments: [
      { author: "Yuliia Kravchenko", body: "Legal wants the SOS flow reviewed before any public demo. Please loop in counsel when this starts." },
    ],
  },
  {
    title: "EPIC: Battery & Thermal Management",
    description:
      "8 hours active use at 25°C, graceful throttling above 45°C, safe cold-start at -10°C, and a charging spec that doesn't require us to ship a proprietary brick." +
      BREAK_DOWN,
    status: "backlog",
    priority: "high",
    assignee: "Kwame Asante",
    labels: ["epic", "hardware", "firmware"],
    comments: [],
  },
  {
    title: "EPIC: Industrial Design & Certification",
    description:
      "Weight <1.4kg, balanced CoG, Snell M2020 path, ECE 22.06, FCC Part 15, CE RED. The stuff that actually turns a prototype into a product you can sell." +
      BREAK_DOWN,
    status: "backlog",
    priority: "high",
    assignee: "Lars Eriksen",
    labels: ["epic", "hardware", "design"],
    comments: [
      { author: "Lars Eriksen", body: "Snell is the critical path. Every other cert schedule hangs off their slot availability — I'll sketch the Gantt this week." },
    ],
  },
  {
    title: "EPIC: OTA & Device Management",
    description:
      "Delta firmware updates over LTE, A/B partitions, automatic rollback, staged fleet rollouts, and an internal dashboard so we don't brick customers." +
      BREAK_DOWN,
    status: "backlog",
    priority: "medium",
    assignee: "Ostap Bondarenko",
    labels: ["epic", "firmware"],
    comments: [],
  },
  {
    title: "EPIC: Data, ML Ops & Backend",
    description:
      "Ride data ingest, on-helmet anonymization before upload, labeling pipeline for blind-spot clips, crash-telemetry cold storage, and a model registry for staged A/B serving." +
      BREAK_DOWN,
    status: "backlog",
    priority: "medium",
    assignee: "Solomiya Hnatyuk",
    labels: ["epic", "ml"],
    comments: [],
  },

  // === HUD Optics children ==============================================
  {
    title: "Calibrate visor projection angles for S/M/L shells",
    description: "Three shell sizes, three nose-bridge offsets. Build a jig that measures the projection angle and outputs a calibration blob the render engine loads at boot.",
    status: "in_progress", priority: "high", assignee: "Mateus Oliveira",
    labels: ["frontend", "hardware"],
    comments: [
      { author: "Lars Eriksen", body: "The M shell's foam compresses ~1.2mm over the first 20 hours. Want me to bake that into the cal profile or handle it in software?" },
      { author: "Mateus Oliveira", body: "Software side for now — cheaper to iterate. We can revisit when the shell is locked." },
    ],
  },
  {
    title: "Render glyphs at 60fps within a 4ms CPU budget",
    description: "SDF font atlas + cached geometry for the fixed-position glyph set. Anything dynamic (speed digits, battery bar) gets a separate hot path.",
    status: "in_progress", priority: "high", assignee: "Mateus Oliveira",
    labels: ["frontend"],
    comments: [
      { author: "Mateus Oliveira", body: "We're at 2.8ms on the QCS6490 dev board with 120 glyphs on screen. Plenty of headroom." },
    ],
  },
  {
    title: "Sunlight HDR mode — visor luminance model",
    description: "At 100k lux we need ~6000 nits effective visor brightness to beat ambient. Design the duty-cycling approach and file the thermal impact with Kwame.",
    status: "todo", priority: "high", assignee: "Mateus Oliveira",
    labels: ["frontend", "hardware"],
    comments: [],
  },
  {
    title: "Low-light rendering: suppress blue channel below 5 lux",
    description: "Preserve the rider's scotopic adaptation. Warm-shift the palette and drop blue primaries when the ambient sensor reports dark. Needs-spec.",
    status: "backlog", priority: "medium", assignee: "Mateus Oliveira",
    labels: ["frontend", "needs-spec"],
    comments: [],
  },
  {
    title: "Motion prediction to compensate 20ms render lag",
    description: "Use head IMU to project 20ms forward so HUD glyphs feel anchored to the world, not the helmet. Kalman filter + simple clamp.",
    status: "todo", priority: "medium", assignee: "Aoife Donnelly",
    labels: ["frontend", "ml"],
    comments: [],
  },
  {
    title: "HUD layout editor in companion app",
    description: "Drag-and-drop widget placement, save/sync to helmet over BLE. Ship with three curated presets: Commuter, Track, Touring.",
    status: "backlog", priority: "low", assignee: "Priya Iyer",
    labels: ["frontend", "design"],
    comments: [],
  },
  {
    title: "Polarization test rig for wet visor conditions",
    description: "Water sheets on the visor polarize reflections. Build a spray rig we can repro in the lab so we're not chasing track-day ghosts.",
    status: "todo", priority: "medium", assignee: "Lars Eriksen",
    labels: ["hardware"],
    comments: [],
  },
  {
    title: "Color calibration per user (deuteranopia-friendly palette)",
    description: "~8% of our target male demographic has some red/green color vision deficiency. Alternate palette + preview flow in the onboarding.",
    status: "backlog", priority: "low", assignee: "Mateus Oliveira",
    labels: ["frontend", "design"],
    comments: [
      { author: "Priya Iyer", body: "Love this. File it under 'things competitors won't copy for two years.'" },
    ],
  },

  // === Perception children ==============================================
  {
    title: "Rear blind spot detector v1: dataset",
    description: "~40k labeled frames across day/night/rain/tunnel. Pull from the Barcelona and Lisbon camera rigs. Anonymize plates before the labeling vendor sees them.",
    status: "in_progress", priority: "high", assignee: "Solomiya Hnatyuk",
    labels: ["ml"],
    comments: [
      { author: "Solomiya Hnatyuk", body: "27k labeled so far. The rain subset is the bottleneck — only ~900 usable clips." },
      { author: "Aoife Donnelly", body: "I can pull from last October's Dublin ride bank. Heavy weather for days." },
    ],
  },
  {
    title: "Rear blind spot detector v1: model training",
    description: "Start from YOLOv8-n, distill to fit the NPU's 4MB weight budget. Target >95% recall on closing vehicles within 40m.",
    status: "in_progress", priority: "high", assignee: "Solomiya Hnatyuk",
    labels: ["ml"],
    comments: [],
  },
  {
    title: "Port YOLOv8-n to Qualcomm QCS6490 NPU",
    description: "QNN SDK conversion, INT8 quantization, runtime benchmark. Preserve mAP within 2 points of the float baseline.",
    status: "in_progress", priority: "high", assignee: "Aoife Donnelly",
    labels: ["ml", "firmware"],
    comments: [
      { author: "Aoife Donnelly", body: "Quant post-training is killing one of the small-object heads. Probably need QAT. Bumping a day." },
    ],
  },
  {
    title: "Sensor fusion: front camera + rear camera + IMU",
    description: "One unified world model. When the front detects a hazard that then leaves frame, the rear should inherit the track without a gap.",
    status: "todo", priority: "high", assignee: "Aoife Donnelly",
    labels: ["ml"],
    comments: [],
  },
  {
    title: "Approaching-vehicle classifier (car/truck/bike/other)",
    description: "Different warnings for different threat classes. A truck closing at 40km/h delta gets louder treatment than a scooter at 5.",
    status: "todo", priority: "medium", assignee: "Solomiya Hnatyuk",
    labels: ["ml"],
    comments: [],
  },
  {
    title: "Night mode pipeline with NIR illuminator sync",
    description: "850nm illuminator, rolling-shutter-safe exposure, global gain mapping. Sync pulses to camera frames, not ambient.",
    status: "backlog", priority: "medium", assignee: "Aoife Donnelly",
    labels: ["ml", "hardware"],
    comments: [],
  },
  {
    title: "Lane-marker detection in heavy rain",
    description: "The baseline model falls off a cliff above 5mm/h rainfall. Temporal smoothing + per-pixel confidence weighting should recover most of it.",
    status: "backlog", priority: "medium", assignee: "Solomiya Hnatyuk",
    labels: ["ml"],
    comments: [],
  },
  {
    title: "Cam-to-HUD latency budget: 80ms for rear threats",
    description: "Instrument every stage: ISP → inference → fusion → renderer → photon. Publish a weekly tracking number.",
    status: "in_progress", priority: "high", assignee: "Aoife Donnelly",
    labels: ["ml", "firmware"],
    comments: [
      { author: "Aoife Donnelly", body: "Currently at 112ms worst-case. The biggest win is moving the fusion step onto the NPU instead of the A78." },
    ],
  },

  // === Voice children ====================================================
  {
    title: "'Vizor' wake word training set",
    description: "Multi-accent, in-helmet, wind-masked audio. ~5k positive and ~50k negative utterances. Record on-bike and in an anechoic chamber both.",
    status: "todo", priority: "high", assignee: "Aoife Donnelly",
    labels: ["ml"],
    comments: [],
  },
  {
    title: "Wind noise suppression model at 150 km/h",
    description: "RNNoise wasn't trained for this regime. Train a replacement on real streetracer audio, push to the audio DSP.",
    status: "todo", priority: "high", assignee: "Solomiya Hnatyuk",
    labels: ["ml", "firmware"],
    comments: [
      { author: "Ostap Bondarenko", body: "If you can keep it under 30% of DSP cycles I can keep the rest for haptic generation." },
    ],
  },
  {
    title: "Bone-conduction mic array placement study",
    description: "Two, three, or four transducers? Measure SNR vs weight vs comfort on five head shapes. Winner goes into the shell design.",
    status: "backlog", priority: "medium", assignee: "Lars Eriksen",
    labels: ["hardware"],
    comments: [],
  },
  {
    title: "Offline command parser for safety-critical intents",
    description: "'Call SOS', 'Cancel SOS', 'Mute music', 'Read message' — these must work with zero connectivity. Ship a hand-written FSM, not the LLM path.",
    status: "todo", priority: "urgent", assignee: "Aoife Donnelly",
    labels: ["firmware", "safety"],
    comments: [],
  },
  {
    title: "LLM fallback for fuzzy intent matching",
    description: "Any intent not in the offline FSM goes to a small on-device model (~300M params). Falls back to cloud if battery >30% and signal is good.",
    status: "backlog", priority: "medium", assignee: "Solomiya Hnatyuk",
    labels: ["ml"],
    comments: [],
  },
  {
    title: "Bike-state intent chain: 'How's my battery?'",
    description: "Read Zero/Energica telemetry, respond with plain-language range estimate accounting for current load and remaining elevation.",
    status: "backlog", priority: "low", assignee: "Ostap Bondarenko",
    labels: ["firmware"],
    comments: [],
  },
  {
    title: "Voice latency budget: <400ms end-to-end",
    description: "Wake word → intent → response audio in under 400ms for the offline path. Otherwise riders ask twice and the demo dies.",
    status: "backlog", priority: "high", assignee: "Aoife Donnelly",
    labels: ["firmware"],
    comments: [],
  },

  // === Companion Mobile App children ====================================
  {
    title: "iOS app skeleton (SwiftUI)",
    description: "Tabs: Rides, Helmet, Settings. Auth via Apple Sign-in. Scaffold the BLE manager behind a protocol so we can mock it in previews.",
    status: "todo", priority: "high", assignee: "Priya Iyer",
    labels: ["frontend"],
    comments: [],
  },
  {
    title: "Android app skeleton (Jetpack Compose)",
    description: "Parity with iOS on the Rides + Helmet tabs. Settings can lag a sprint if we need to.",
    status: "todo", priority: "high", assignee: "Priya Iyer",
    labels: ["frontend"],
    comments: [],
  },
  {
    title: "Ride history list with map overlay",
    description: "Route polyline, peak speed pill, lean-angle heatmap toggle. Tap a ride to open replay.",
    status: "backlog", priority: "medium", assignee: "Mateus Oliveira",
    labels: ["frontend", "design"],
    comments: [],
  },
  {
    title: "Ride replay: scrub through HUD state",
    description: "Show what the rider saw on the HUD at any point in the ride, plus speed/lean/heart rate. This is the sharable social moment.",
    status: "backlog", priority: "medium", assignee: "Mateus Oliveira",
    labels: ["frontend", "design"],
    comments: [
      { author: "Yuliia Kravchenko", body: "Make sure export-to-video is in v1. Every rider who sees their own replay becomes a marketer." },
    ],
  },
  {
    title: "OTA trigger flow from mobile",
    description: "User taps Update, app streams the delta over BLE to the helmet, helmet verifies, swaps partition, reboots. UI shows progress + success state with changelog.",
    status: "backlog", priority: "high", assignee: "Ostap Bondarenko",
    labels: ["frontend", "firmware"],
    comments: [],
  },
  {
    title: "Biometric-sharing consent screen",
    description: "GDPR-clean. Explicit opt-in for heart rate, location, and crash telemetry uploads. Legal is drafting copy.",
    status: "todo", priority: "high", assignee: "Priya Iyer",
    labels: ["frontend", "safety"],
    comments: [],
  },
  {
    title: "Post-crash debrief wizard",
    description: "After a confirmed crash: 'Are you okay? Do you want to review what happened?' Guides the rider through replay + a simple form we can use for claims support.",
    status: "backlog", priority: "high", assignee: "Priya Iyer",
    labels: ["frontend", "safety", "design"],
    comments: [],
  },
  {
    title: "Apple Health + Google Fit sync",
    description: "Ride metadata + heart rate data. Opt-in, never by default. Tag workouts as 'Cycling' since 'Motorcycle Ride' isn't in the standard taxonomy.",
    status: "backlog", priority: "low", assignee: "Priya Iyer",
    labels: ["frontend"],
    comments: [],
  },

  // === Bike Telemetry children ==========================================
  {
    title: "Zero SR/F CAN bus adapter",
    description: "Spec dump is in the shared drive. Proprietary PIDs for battery SoC, motor temp, regen current. Bench with the loaned Zero unit.",
    status: "in_progress", priority: "medium", assignee: "Ostap Bondarenko",
    labels: ["firmware"],
    comments: [
      { author: "Ostap Bondarenko", body: "Zero's CAN is simpler than I expected. SoC and motor temp working end-to-end; regen current is the tricky one." },
    ],
  },
  {
    title: "Energica ESS-G2 telemetry",
    description: "ESS-G2 uses a custom UDS dialect. Talk to their dev relations before reverse-engineering anything legally hairy.",
    status: "todo", priority: "medium", assignee: "Ostap Bondarenko",
    labels: ["firmware"],
    comments: [],
  },
  {
    title: "Damon HyperSport HyperDrive protocol",
    description: "Damon is open to a partnership. Priya owns the convo; Ostap writes the adapter once we have the spec.",
    status: "backlog", priority: "low", assignee: "Priya Iyer",
    labels: ["firmware"],
    comments: [],
  },
  {
    title: "Generic ISO 15765-2 fallback adapter",
    description: "For bikes we don't have a hand-rolled adapter for. Shows speed, throttle position, and battery if the bike exposes standard PIDs; otherwise gracefully degrades.",
    status: "backlog", priority: "low", assignee: "Ostap Bondarenko",
    labels: ["firmware"],
    comments: [],
  },
  {
    title: "Battery SoC curve rendering on HUD",
    description: "Not just a percentage — a curve that forecasts remaining range based on the next 2km of elevation and current draw.",
    status: "backlog", priority: "medium", assignee: "Mateus Oliveira",
    labels: ["frontend"],
    comments: [],
  },
  {
    title: "Motor temperature warning thresholds per bike",
    description: "Each bike has different safe operating temps. Ship a per-bike config map with warning and critical thresholds + cool-down suggestion.",
    status: "backlog", priority: "medium", assignee: "Kwame Asante",
    labels: ["firmware"],
    comments: [],
  },

  // === Crash Detection children =========================================
  {
    title: "IMU threshold tuning — current model false-triggers on wheelies",
    description: "11° rear lift in 200ms looks like a crash to the current classifier. Add the rotation vector + sustained-throttle context.",
    status: "in_progress", priority: "urgent", assignee: "Ostap Bondarenko",
    labels: ["firmware", "safety", "bug"],
    comments: [
      { author: "Ostap Bondarenko", body: "Confirmed: 3 out of 4 staged wheelies on the closed track triggered SOS countdown. Working on a two-stage gate." },
      { author: "Yuliia Kravchenko", body: "This is a demo blocker. Please make it your priority this week." },
    ],
  },
  {
    title: "15-second countdown UI before SOS sends",
    description: "Large center HUD glyph + audible tone every second. Rider can cancel with a voice command or by pressing the chin-pad button.",
    status: "todo", priority: "urgent", assignee: "Mateus Oliveira",
    labels: ["frontend", "safety"],
    comments: [],
  },
  {
    title: "Regional EMS auto-call integration",
    description: "EU 112, US 911, UK 999, IN 112, BR 192. Partner with a 24/7 call center that speaks to local dispatch on our behalf.",
    status: "backlog", priority: "high", assignee: "Priya Iyer",
    labels: ["safety"],
    comments: [
      { author: "Priya Iyer", body: "GlobalSOS gave us a quote. Yuliia — need your sign-off on per-activation costs." },
    ],
  },
  {
    title: "HeartAware abnormal pulse tie-in",
    description: "If HR stays >180bpm for >60s while the bike is moving, flag for a voice check-in. Not a crash signal — a wellness nudge.",
    status: "backlog", priority: "low", assignee: "Solomiya Hnatyuk",
    labels: ["ml", "safety"],
    comments: [],
  },
  {
    title: "Apple satellite SOS bridge for dead zones",
    description: "Investigate MFi-adjacent hooks. If the paired phone has satellite SOS and cellular is dead, fall through to it.",
    status: "backlog", priority: "medium", assignee: "Priya Iyer",
    labels: ["safety", "needs-spec"],
    comments: [],
  },
  {
    title: "Silent SOS dismiss via helmet chin-tap",
    description: "Rider can tap the chin pad 3x to dismiss without voice (useful after a low-speed tip in a quiet parking lot when you don't want to yell).",
    status: "backlog", priority: "medium", assignee: "Kwame Asante",
    labels: ["hardware", "firmware"],
    comments: [],
  },

  // === Battery / Thermal children =======================================
  {
    title: "8-hour active use battery target",
    description: "Target is a full commuter day plus a weekend ride without recharge. Current prototype holds ~5.5h with HUD + rear cam on.",
    status: "backlog", priority: "high", assignee: "Kwame Asante",
    labels: ["hardware"],
    comments: [],
  },
  {
    title: "Thermal throttle policy (NPU + display)",
    description: "Above 45°C junction, step the NPU clock down before touching display brightness. Display legibility is the safety-critical path.",
    status: "todo", priority: "high", assignee: "Kwame Asante",
    labels: ["firmware", "hardware", "safety"],
    comments: [],
  },
  {
    title: "Passive vs active cooling comparison",
    description: "At <1.4kg we probably can't afford a fan. Run the thermal sims for a graphite-sheet + vapor-chamber passive stack.",
    status: "backlog", priority: "medium", assignee: "Lars Eriksen",
    labels: ["hardware"],
    comments: [],
  },
  {
    title: "Cold-start at -10°C reliability",
    description: "Finnish test track in February. Battery chemistry and OLED driver both complain. Need a warm-up sequence before user-visible boot.",
    status: "backlog", priority: "medium", assignee: "Ostap Bondarenko",
    labels: ["firmware", "hardware"],
    comments: [],
  },
  {
    title: "USB-C PD charger spec",
    description: "45W PD, standard cable, no proprietary brick. The customer already has this cable — let's not make them buy another one.",
    status: "todo", priority: "low", assignee: "Kwame Asante",
    labels: ["hardware"],
    comments: [],
  },

  // === Industrial Design / Cert children ===============================
  {
    title: "Weight distribution study — <1.4kg target",
    description: "Measure moment of inertia around the neck axis on five head shapes. Current prototype is front-heavy by ~60g equivalent.",
    status: "in_progress", priority: "high", assignee: "Lars Eriksen",
    labels: ["hardware", "design"],
    comments: [],
  },
  {
    title: "Snell M2020 certification path",
    description: "Book a slot at the Sacramento lab, budget for two rounds of testing, plan shell revisions around the schedule.",
    status: "todo", priority: "urgent", assignee: "Lars Eriksen",
    labels: ["hardware", "safety"],
    comments: [
      { author: "Lars Eriksen", body: "Earliest slot is August. If we miss it, we slip to November. Need final shell geometry by July 1." },
    ],
  },
  {
    title: "ECE 22.06 dynamic test plan",
    description: "Rotational impact tests for Europe. We already planned for linear; 22.06 adds oblique impact which means another fixture revision.",
    status: "backlog", priority: "high", assignee: "Lars Eriksen",
    labels: ["hardware", "safety"],
    comments: [],
  },
  {
    title: "FCC Part 15 pre-compliance scan",
    description: "Book the chamber in Santa Clara. 2.4GHz + 5GHz + LTE + NFC all active. Expect surprises at the first attempt — budget two revisions.",
    status: "backlog", priority: "medium", assignee: "Kwame Asante",
    labels: ["hardware"],
    comments: [],
  },
  {
    title: "CE RED compliance checklist",
    description: "Radio Equipment Directive covers all the wireless. Cross-reference with FCC plan so we don't pay for overlapping tests.",
    status: "backlog", priority: "medium", assignee: "Kwame Asante",
    labels: ["hardware", "docs"],
    comments: [],
  },
  {
    title: "Visor tint legality matrix (EU/US/APAC)",
    description: "Different countries cap visor light transmittance at different values. Ship a region-locked tint setting in the companion app.",
    status: "backlog", priority: "low", assignee: "Priya Iyer",
    labels: ["docs", "safety"],
    comments: [],
  },
  {
    title: "Drop test fixture: DIY vs outsource",
    description: "Outsourcing lets us move faster but costs ~€40k/year. DIY is €12k build + engineering time. Lars has the spreadsheet.",
    status: "backlog", priority: "low", assignee: "Lars Eriksen",
    labels: ["hardware"],
    comments: [],
  },

  // === OTA children =====================================================
  {
    title: "Delta firmware updates over LTE",
    description: "bsdiff-based binary deltas, gzip, signed with our root key. Full image is the fallback when deltas diverge.",
    status: "backlog", priority: "high", assignee: "Ostap Bondarenko",
    labels: ["firmware"],
    comments: [],
  },
  {
    title: "A/B partition scheme",
    description: "Two bootable partitions, atomic swap, one-way downgrade prevention. Standard playbook — implement it cleanly the first time.",
    status: "backlog", priority: "high", assignee: "Ostap Bondarenko",
    labels: ["firmware"],
    comments: [],
  },
  {
    title: "Automatic rollback on boot failure",
    description: "Watchdog + boot counter. If the new partition fails to come up cleanly 3 times, swap back. Send a crash report home when connectivity returns.",
    status: "backlog", priority: "high", assignee: "Ostap Bondarenko",
    labels: ["firmware", "safety"],
    comments: [],
  },
  {
    title: "Fleet dashboard MVP",
    description: "Internal tool. Firmware version distribution, crash rate, active device count. Grafana + a thin BE is fine for v1.",
    status: "backlog", priority: "low", assignee: "Kwame Asante",
    labels: ["frontend"],
    comments: [],
  },
  {
    title: "Staged rollout policy: 1% → 10% → 100%",
    description: "Hold each step for 48h unless crash rate spikes. Manual override for Yuliia and Ostap.",
    status: "backlog", priority: "medium", assignee: "Ostap Bondarenko",
    labels: ["firmware"],
    comments: [],
  },

  // === Data / ML Ops / Backend children =================================
  {
    title: "Ride data ingest pipeline",
    description: "Helmets upload to an S3 bucket via pre-signed URLs. A worker de-duplicates, transcodes video, writes metadata rows. Retention: 30 days opt-out, 1 year opt-in.",
    status: "backlog", priority: "medium", assignee: "Solomiya Hnatyuk",
    labels: ["ml"],
    comments: [],
  },
  {
    title: "On-helmet anonymization before upload",
    description: "Blur plates and faces at the source. Cheaper at the edge, better for privacy, and eliminates a whole class of data-breach risk.",
    status: "backlog", priority: "high", assignee: "Aoife Donnelly",
    labels: ["ml", "safety"],
    comments: [],
  },
  {
    title: "Labeling pipeline for blind-spot clips",
    description: "Vendor UI + audit workflow + disagreement resolution. Target <5% inter-annotator disagreement on 'is a vehicle closing'.",
    status: "backlog", priority: "medium", assignee: "Solomiya Hnatyuk",
    labels: ["ml"],
    comments: [],
  },
  {
    title: "Crash telemetry cold storage",
    description: "Crashes are rare and legally sensitive. Write-once, immutable, regionally pinned bucket with a 7-year retention per legal's recommendation.",
    status: "backlog", priority: "medium", assignee: "Ostap Bondarenko",
    labels: ["safety"],
    comments: [],
  },
  {
    title: "Model registry + A/B serving",
    description: "Stage new perception models to 5% of the fleet first. Monitor false-positive rate and mean latency before promoting.",
    status: "backlog", priority: "medium", assignee: "Solomiya Hnatyuk",
    labels: ["ml"],
    comments: [],
  },

  // === Bugs =============================================================
  {
    title: "HUD flicker at 4600rpm on Energica Ego+",
    description: "A specific resonance couples into the display driver's power rail. Reproducible on two Ego+ units, not on the Zero SR/F. Probably a filtering issue on the 3.3V rail.",
    status: "in_progress", priority: "high", assignee: "Kwame Asante",
    labels: ["bug", "firmware", "hardware"],
    comments: [
      { author: "Kwame Asante", body: "Confirmed with a scope: ~40mV ripple at 4.6kHz. An LC filter should kill it. Spinning a quick board rev." },
      { author: "Ostap Bondarenko", body: "If it's a ripple issue, maybe software can mask the worst of it by forcing a frame skip at that rpm. Hack for the demo if the rev is late." },
    ],
  },
  {
    title: "Rear camera blackout when pack temp >60°C",
    description: "ISP thermal throttle kicks in and drops frames completely instead of degrading quality. Needs a graceful degradation path.",
    status: "todo", priority: "high", assignee: "Aoife Donnelly",
    labels: ["bug", "firmware"],
    comments: [],
  },
  {
    title: "Voice misrecognizes 'cancel SOS' ~30% of the time",
    description: "The wind-noise suppression is too aggressive on the sibilants. Retrain on the updated dataset once the wind model ships.",
    status: "todo", priority: "urgent", assignee: "Aoife Donnelly",
    labels: ["bug", "ml", "safety"],
    comments: [
      { author: "Yuliia Kravchenko", body: "Safety-critical word. This cannot ship at 70% accuracy. Escalate if you need help." },
    ],
  },
  {
    title: "Android companion disconnects at highway speed",
    description: "BLE drops on a subset of Samsung devices when Wi-Fi roams. Reproducible on S23. Likely a coexistence tuning problem.",
    status: "todo", priority: "medium", assignee: "Priya Iyer",
    labels: ["bug", "frontend"],
    comments: [],
  },
  {
    title: "Wake word triggers on Daft Punk chorus",
    description: "'Harder, Better, Faster, Stronger' — something in the vocoder rhythm reads as 'Vizor' to the model. Needs a hard-negative batch.",
    status: "todo", priority: "low", assignee: "Aoife Donnelly",
    labels: ["bug", "ml"],
    comments: [
      { author: "Aoife Donnelly", body: "This is the best bug report I've ever filed." },
      { author: "Mateus Oliveira", body: "Keep it. I want the regression test to literally be Discovery.flac." },
    ],
  },
  {
    title: "Cancelled: LED chin-strap indicator",
    description: "Cute but doesn't earn its weight or BoM cost. Pivoted to the haptic-only indicator.",
    status: "cancelled", priority: "low", assignee: "Lars Eriksen",
    labels: ["hardware", "design"],
    comments: [],
  },

  // === Standalone / ops ================================================
  {
    title: "Hire senior FPGA engineer",
    description: "We're hitting the ceiling on NPU + off-the-shelf DSP for the latency budget. Need someone who can bring up a Lattice ECP5 or similar.",
    status: "todo", priority: "medium", assignee: "Yuliia Kravchenko",
    labels: [],
    comments: [
      { author: "Yuliia Kravchenko", body: "Job description draft in the shared drive. Looking at candidates in Lisbon, Kyiv, and remote EU." },
    ],
  },
  {
    title: "Series A deck — first draft",
    description: "Market size, product defensibility, milestones, ask. Target $12M at a $55M pre. Filling in placeholder numbers this week.",
    status: "in_progress", priority: "high", assignee: "Yuliia Kravchenko",
    labels: ["docs"],
    comments: [
      { author: "Priya Iyer", body: "Happy to review the product slides before Tuesday." },
    ],
  },
  {
    title: "Pirelli NDA for rain-compound test day",
    description: "They offered us a wet-track slot in exchange for a perception dataset contribution. NDA in legal review.",
    status: "todo", priority: "medium", assignee: "Yuliia Kravchenko",
    labels: ["docs"],
    comments: [],
  },
  {
    title: "Office move to Lisbon — lease signing",
    description: "450m² in Marvila, 12-month term with extension option. Sign by April 30 or we lose the rate.",
    status: "in_progress", priority: "high", assignee: "Yuliia Kravchenko",
    labels: ["urgent"],
    comments: [
      { author: "Yuliia Kravchenko", body: "Final walkthrough on Thursday. Lars — want to come and look at the workshop space?" },
      { author: "Lars Eriksen", body: "On it. I'll bring the ventilation requirements." },
    ],
  },
  {
    title: "Investor update — April 2026",
    description: "Monthly email to angels and the convertible-note holders. Cover: perception milestones, hiring, runway, upcoming Series A.",
    status: "todo", priority: "medium", assignee: "Yuliia Kravchenko",
    labels: ["docs"],
    comments: [],
  },
  {
    title: "vizor.moto domain cutover",
    description: "We finally bought the .moto. Point DNS, update marketing, set up redirects from vizorhelmets.com.",
    status: "todo", priority: "low", assignee: "Priya Iyer",
    labels: [],
    comments: [],
  },
  {
    title: "Pitch deck dry run with Solomiya",
    description: "Solo has presented perception work to this kind of audience before. Book 90 minutes.",
    status: "todo", priority: "low", assignee: "Yuliia Kravchenko",
    labels: [],
    comments: [],
  },
  {
    title: "Onboarding doc for new firmware hires",
    description: "Toolchain setup, board bring-up, how to flash without bricking. Should take a new engineer from zero to 'hello LED blink' in a day.",
    status: "backlog", priority: "low", assignee: "Ostap Bondarenko",
    labels: ["docs"],
    comments: [],
  },
  {
    title: "Annual hardware roadmap",
    description: "Vizor One (this year), Vizor Lite (commuter, next year), Vizor Pro (track, year after). One slide each, no more.",
    status: "backlog", priority: "medium", assignee: "Yuliia Kravchenko",
    labels: ["docs"],
    comments: [],
  },
  {
    title: "Partnership call with Damon Motorcycles",
    description: "They want deeper HyperDrive integration in exchange for co-marketing. Priya leads; Yuliia joins for the commercial bits.",
    status: "todo", priority: "medium", assignee: "Priya Iyer",
    labels: [],
    comments: [],
  },
  {
    title: "Pack team offsite — Porto, June 14",
    description: "Two-day offsite: Friday product brainstorm, Saturday go-karting. Yes, go-karting. We make motorcycle products; rivalry is healthy.",
    status: "backlog", priority: "low", assignee: "Priya Iyer",
    labels: [],
    comments: [
      { author: "Mateus Oliveira", body: "Finally an excuse to be in Porto on the company dime." },
      { author: "Ostap Bondarenko", body: "I will destroy all of you on the track. You have been warned." },
    ],
  },
  {
    title: "Document the Ukrainian public holidays in the team calendar",
    description: "Yuliia, Solomiya, and Ostap all want Den Konstytutsii off. Make sure the calendar reflects it so we don't schedule all-hands that day.",
    status: "done", priority: "low", assignee: "Priya Iyer",
    labels: ["docs"],
    comments: [],
  },
];

async function seed() {
  console.log("🌱 Seeding TaskTrekker (large demo: Vizor)...");

  try {
    for (const table of ["issue_labels", "comments", "issues", "labels", "users"]) {
      const col = table === "issue_labels" || table === "comments" ? "issue_id" : "id";
      const { error } = await supabase.from(table).delete().not(col, "is", null);
      if (error) throw new Error(`Failed to clear ${table}: ${error.message}`);
    }
    console.log("✓ Cleared existing data");

    const { data: users, error: usersError } = await supabase.from("users").insert(USERS).select();
    if (usersError) throw usersError;
    console.log(`✓ Created ${users.length} users`);

    const userIdByName = new Map(users.map((u) => [u.name, u.id]));

    const { data: labels, error: labelsError } = await supabase.from("labels").insert(LABELS).select();
    if (labelsError) throw labelsError;
    console.log(`✓ Created ${labels.length} labels`);

    const labelIdByName = new Map(labels.map((l) => [l.name, l.id]));

    const issueRows = ISSUES.map((issue) => ({
      title: issue.title,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      assignee_id: issue.assignee ? userIdByName.get(issue.assignee) : null,
    }));

    const { data: insertedIssues, error: issuesError } = await supabase
      .from("issues")
      .insert(issueRows)
      .select();
    if (issuesError) throw issuesError;
    console.log(`✓ Created ${insertedIssues.length} issues`);

    // Pair the inserted rows back to their specs. Supabase preserves input
    // order in RETURNING, but titles are unique here so we match by title
    // defensively.
    const issueIdByTitle = new Map(insertedIssues.map((i) => [i.title, i.id]));

    const commentRows = [];
    const issueLabelRows = [];
    for (const issue of ISSUES) {
      const issueId = issueIdByTitle.get(issue.title);
      for (const comment of issue.comments) {
        commentRows.push({
          issue_id: issueId,
          author_id: userIdByName.get(comment.author),
          body: comment.body,
        });
      }
      for (const labelName of issue.labels) {
        issueLabelRows.push({
          issue_id: issueId,
          label_id: labelIdByName.get(labelName),
        });
      }
    }

    if (commentRows.length) {
      const { error: commentsError } = await supabase.from("comments").insert(commentRows);
      if (commentsError) throw commentsError;
      console.log(`✓ Created ${commentRows.length} comments`);
    }

    if (issueLabelRows.length) {
      const { error: issueLabelsError } = await supabase.from("issue_labels").insert(issueLabelRows);
      if (issueLabelsError) throw issueLabelsError;
      console.log(`✓ Created ${issueLabelRows.length} issue-label associations`);
    }

    console.log("\n✅ Seed complete!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
