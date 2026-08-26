/**
 * Demo seed for local / staging UNGANE.
 *
 * Requires `.env` with:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SECRET_KEY
 *
 * Optional:
 * - SEED_OWNER_EMAIL (default demo@ungane.local)
 * - SEED_OWNER_PASSWORD (default DemoPass123!)
 * - SEED_BUSINESS_NAME (default Spa Lumière Demo)
 *
 * Usage: pnpm db:seed
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile() {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
const email = process.env.SEED_OWNER_EMAIL ?? "demo@ungane.local";
const password = process.env.SEED_OWNER_PASSWORD ?? "DemoPass123!";
const businessName = process.env.SEED_BUSINESS_NAME ?? "Spa Lumière Demo";

if (!url || !secret) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env",
  );
  process.exit(1);
}

const admin = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function ensureOwner() {
  const list = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (list.error) throw list.error;
  const existing = list.data.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
  if (existing) return existing.id;

  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: "Demo Owner" },
  });
  if (created.error || !created.data.user) throw created.error;
  return created.data.user.id;
}

async function ensureBusiness(ownerId) {
  const { data: memberships, error: membershipError } = await admin
    .from("business_memberships")
    .select("business_id")
    .eq("user_id", ownerId)
    .eq("status", "active")
    .limit(1);

  if (membershipError) throw membershipError;
  if (memberships?.[0]?.business_id) return memberships[0].business_id;

  const { data: business, error: businessError } = await admin
    .from("businesses")
    .insert({
      name: businessName,
      industry: "Beauté",
      country: "CD",
      city: "Kinshasa",
      phone: "+243800000000",
      email,
    })
    .select("id")
    .single();

  if (businessError || !business) throw businessError;

  const { error: linkError } = await admin.from("business_memberships").insert({
    user_id: ownerId,
    business_id: business.id,
    role: "business_owner",
    status: "active",
  });
  if (linkError) throw linkError;

  return business.id;
}

async function ensureWhatsApp(businessId) {
  const { data, error } = await admin
    .from("whatsapp_accounts")
    .upsert(
      {
        business_id: businessId,
        phone_number: "+243899999999",
        provider: "stub",
        status: "connected",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "business_id" },
    )
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

async function ensureCustomers(businessId) {
  const demoCustomers = [
    {
      phone_number: "+243800000001",
      first_name: "Marie",
      last_name: "Kabila",
      tags: ["VIP", "Nouveau"],
      marketing_opt_in: true,
    },
    {
      phone_number: "+243800000002",
      first_name: "Jean",
      last_name: "Mwamba",
      tags: ["Nouveau"],
      marketing_opt_in: true,
    },
    {
      phone_number: "+243800000003",
      first_name: "Amina",
      last_name: "Okito",
      tags: ["Inactif"],
      marketing_opt_in: false,
    },
  ];

  const ids = [];
  for (const customer of demoCustomers) {
    const { data, error } = await admin
      .from("customers")
      .upsert(
        {
          business_id: businessId,
          ...customer,
          last_interaction_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "business_id,phone_number" },
      )
      .select("id, phone_number")
      .single();
    if (error) throw error;
    ids.push(data);
  }
  return ids;
}

async function ensureConversation(businessId, customer) {
  const { data: existing } = await admin
    .from("conversations")
    .select("id")
    .eq("business_id", businessId)
    .eq("customer_id", customer.id)
    .maybeSingle();

  if (existing) return existing.id;

  const now = new Date().toISOString();
  const { data: conversation, error } = await admin
    .from("conversations")
    .insert({
      business_id: businessId,
      customer_id: customer.id,
      status: "open",
      started_at: now,
      last_message_at: now,
    })
    .select("id")
    .single();
  if (error) throw error;

  const messages = [
    {
      direction: "INBOUND",
      content: "Bonjour, je voudrais un RDV",
      status: "RECEIVED",
    },
    {
      direction: "OUTBOUND",
      content: "Bonjour ! Quel service souhaitez-vous ?",
      status: "SENT",
    },
  ];

  for (const message of messages) {
    const { error: messageError } = await admin.from("messages").insert({
      conversation_id: conversation.id,
      business_id: businessId,
      type: "text",
      ...message,
    });
    if (messageError) throw messageError;
  }

  return conversation.id;
}

async function ensureFlows(businessId) {
  for (const flowType of ["booking", "feedback", "reminder"]) {
    const { error } = await admin.from("flow_settings").upsert(
      {
        business_id: businessId,
        flow_type: flowType,
        enabled: flowType === "booking",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "business_id,flow_type" },
    );
    if (error) throw error;
  }
}

async function main() {
  console.log("Seeding UNGANE demo data…");
  const ownerId = await ensureOwner();
  console.log(`Owner: ${email} (${ownerId})`);

  const businessId = await ensureBusiness(ownerId);
  console.log(`Business: ${businessName} (${businessId})`);

  await ensureWhatsApp(businessId);
  const customers = await ensureCustomers(businessId);
  console.log(`Customers: ${customers.length}`);

  for (const customer of customers.slice(0, 2)) {
    await ensureConversation(businessId, customer);
  }
  await ensureFlows(businessId);

  console.log("Done.");
  console.log(`Login with ${email} / ${password}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
