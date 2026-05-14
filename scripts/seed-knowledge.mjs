// Seed the global knowledge_base table with default platform content.
// Run with: npm run seed:knowledge
// Pass --clear to wipe existing entries first.
//
// Reads env from .env via the `node --env-file=.env` flag (Node 20.6+).
// Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GOOGLE_GENERATIVE_AI_API_KEY

import { createClient } from "@supabase/supabase-js";
import { google } from "@ai-sdk/google";
import { embed } from "ai";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
  process.exit(1);
}
if (!GOOGLE_API_KEY) {
  console.error("Missing GOOGLE_GENERATIVE_AI_API_KEY in env.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const entries = [
  // ── Platform overview ──────────────────────────────────────────────
  {
    title: "About the platform",
    content:
      "This is an online appointment and booking platform for service businesses such as barbershops, salons, clinics, spas, and consultants. Business owners can publish a public booking page, list their services, set their hours, and accept appointments without phone calls or DMs.",
  },
  {
    title: "How the platform works",
    content:
      "A business owner signs up, sets up their business profile (name, description, address, category), adds the services they offer, configures their weekly opening hours and any closed days, then shares their public booking link with customers. Customers visit that link, pick a service and a time slot, and confirm the booking with just their name and phone number.",
  },

  // ── Customer-facing booking FAQs ──────────────────────────────────
  {
    title: "How to book an appointment",
    content:
      "On the business's public booking page: 1) Browse the available services and pick one. 2) Select a date and an available time slot. 3) Enter your name and phone number, plus any notes for the business. 4) Confirm the booking. You will see a confirmation on the page once it is recorded.",
  },
  {
    title: "Do I need an account to book?",
    content:
      "No, customers do not need to create an account or sign in to book an appointment. The booking page only asks for your name and phone number so the business can contact you about your appointment.",
  },
  {
    title: "How to cancel or reschedule a booking",
    content:
      "Customers do not have a self-service portal to cancel or reschedule. Please contact the business directly using the phone number or contact details shown on their booking page. The business can update or cancel your booking from their dashboard.",
  },
  {
    title: "How will I be notified about my booking?",
    content:
      "After you submit a booking, it appears immediately in the business's dashboard. The business will typically contact you using the phone number you provided to confirm details. There are currently no automated SMS or email confirmations sent from the platform itself.",
  },
  {
    title: "What if no time slots are available?",
    content:
      "Available slots depend on the business's opening hours and any closed days they have set. If you do not see a slot you want, try selecting a different date, or contact the business directly to ask about availability.",
  },
  {
    title: "How are services priced and paid?",
    content:
      "Service prices are set by each business and shown on their booking page. Payment for the service is handled directly with the business (in person, by transfer, or whatever method they accept). The booking platform itself does not process payments for individual appointments.",
  },

  // ── Business owner FAQs ───────────────────────────────────────────
  {
    title: "How to sign up as a business",
    content:
      "Visit the homepage and click Sign Up. After creating your account, you can set up your business profile from the admin dashboard: business name, slug (used in your public booking URL), description, address, and category. Once your business is set to public, your booking link becomes live.",
  },
  {
    title: "How to add or edit services",
    content:
      "From the admin dashboard, open the Services section. Each service has a name, duration in minutes, and price. You can mark services active or inactive. Inactive services do not appear on your public booking page.",
  },
  {
    title: "How to set business hours and closed days",
    content:
      "From the admin dashboard, open the Schedule section. Set your opening and closing times for each day of the week, and toggle days closed if you do not operate that day. You can also add specific closed dates (holidays, time off, internal events) which block bookings on those dates.",
  },
  {
    title: "How to toggle the public booking page on or off",
    content:
      "Each business has a public toggle. When enabled, your booking page is live and customers can book. When disabled, the public link returns a closed state and no new bookings can be made. You can toggle this from the business settings in the admin dashboard.",
  },
  {
    title: "How to view and manage bookings",
    content:
      "All bookings made through your public page appear in the admin dashboard. Each booking shows the customer name, phone, selected service, date and time, status (pending, confirmed, completed, cancelled), and any notes. You can update a booking's status as you process it.",
  },

  // ── Pricing & plans ───────────────────────────────────────────────
  {
    title: "Pricing plans overview",
    content:
      "There are three plans: Starter (free), Medium ($10/month), and Business ($19/month). Yearly billing receives a 10% discount on each plan.",
  },
  {
    title: "Starter plan details",
    content:
      "Starter is free and includes: public booking link with on/off toggle, date and time selection, up to 10 bookings per month, up to 5 services, appointment settings, and up to 5 closed days per month. It is suitable for testing the platform or running a small side business.",
  },
  {
    title: "Medium plan details",
    content:
      "Medium costs $10/month (or $108/year with the 10% yearly discount) and includes everything in Starter plus: 100–200 bookings per month, 10–15 services, flexible closed days, and a basic dashboard with booking statistics.",
  },
  {
    title: "Business plan details",
    content:
      "Business costs $19/month (or $205/year with the 10% yearly discount) and includes everything in Medium plus: unlimited bookings, unlimited services, and the basic statistics dashboard. Best for established businesses with high booking volume.",
  },
  {
    title: "How to upgrade or change plans",
    content:
      "Signed-in business owners can manage their plan from the Billing page in the admin dashboard. From there you can upgrade to Medium or Business, switch between monthly and yearly billing, or downgrade. New plans take effect immediately upon successful payment.",
  },
  {
    title: "Yearly billing discount",
    content:
      "Choosing yearly billing instead of monthly applies a 10% discount on the annual total for any paid plan. The Starter plan is free regardless of billing cycle.",
  },

  // ── AI assistant & misc ────────────────────────────────────────────
  {
    title: "About the AI assistant",
    content:
      "The chat widget in the bottom-right corner is an AI assistant that answers questions about the platform and about each business on its public booking page. It uses the business's own knowledge entries plus this global knowledge base. If the assistant is not sure about something, it will recommend contacting the business directly.",
  },
  {
    title: "Customer data and privacy",
    content:
      "Customer names and phone numbers submitted with a booking are stored against the booking and visible to the business owner who received the booking. The platform does not share customer contact data between businesses.",
  },
  {
    title: "Supported business types",
    content:
      "The platform is built for any business that takes time-slot appointments. Common categories include barbershops, salons, beauty and nail studios, spas, massage, clinics, dental, therapy, tutoring, and personal consultants. Categories are configurable when setting up a business.",
  },
];

const args = process.argv.slice(2);
const shouldClear = args.includes("--clear");

async function main() {
  console.log(`Target Supabase: ${SUPABASE_URL}`);

  if (shouldClear) {
    console.log("Clearing existing knowledge_base entries...");
    const { error } = await supabase
      .from("knowledge_base")
      .delete()
      .not("id", "is", null);
    if (error) {
      console.error("Failed to clear:", error.message);
      process.exit(1);
    }
    console.log("Cleared.");
  }

  console.log(`Seeding ${entries.length} entries with Gemini embeddings...`);

  let inserted = 0;
  let failed = 0;

  for (const entry of entries) {
    try {
      const { embedding } = await embed({
        model: google.embedding("gemini-embedding-001"),
        value: entry.content,
        providerOptions: {
          google: { outputDimensionality: 768 },
        },
      });

      const { error } = await supabase.from("knowledge_base").insert({
        content: entry.content,
        embedding,
        metadata: { title: entry.title, source: "seed" },
      });

      if (error) {
        console.error(`  ✗ ${entry.title} — ${error.message}`);
        failed++;
      } else {
        console.log(`  ✓ ${entry.title}`);
        inserted++;
      }
    } catch (e) {
      console.error(`  ✗ ${entry.title} — ${e.message ?? e}`);
      failed++;
    }
  }

  console.log(`\nDone. Inserted: ${inserted}, Failed: ${failed}.`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error("Seeder crashed:", e);
  process.exit(1);
});
