import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, tool } from "ai";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

export const maxDuration = 30;

async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    const body = await req.json();
    const rawMessages = body.messages || [];
    let messages = Array.isArray(rawMessages) ? rawMessages : [];

    if (body.text) {
      messages.push({ role: "user", content: body.text });
    }

    if (!businessId) {
      return new Response("Business ID is required", { status: 400 });
    }

    if (messages.length === 0) {
      return new Response("No messages provided", { status: 400 });
    }

    const supabase = await getSupabaseClient();

    const { data: business, error: bizError } = await supabase
      .from("business")
      .select("name")
      .eq("id", businessId)
      .single();

    if (bizError || !business) {
      return new Response("Business not found", { status: 404 });
    }

    const { data: services } = await supabase
      .from("services")
      .select("id, name, duration_minutes, price")
      .eq("business_id", businessId)
      .eq("is_active", true);

    const { data: schedule } = await supabase
      .from("business_schedules")
      .select("day_of_week, is_open, start_time, end_time")
      .eq("business_id", businessId);

    const { data: holidays } = await supabase
      .from("business_holidays")
      .select("date")
      .eq("business_id", businessId);

    const holidayDates = new Set(holidays?.map((h) => h.date) || []);

    const today = new Date();
    const openDays = schedule?.filter((s) => s.is_open) || [];

    const getLocalDateString = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const todayStr = getLocalDateString(today);
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const currentTimeStr = `${hours}:${minutes}`;

    const upcomingDates: string[] = [];
    for (let i = 0; i <= 14 && upcomingDates.length < 5; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const dateStr = getLocalDateString(d);

      if (holidayDates.has(dateStr)) {
        continue;
      }

      const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
      if (openDays.some((s) => s.day_of_week === dayName)) {
        upcomingDates.push(dateStr);
      }
    }

    // Query booked/disabled slots for upcoming open dates
    const { data: slots } = await supabase
      .from("appointment_slots")
      .select("date, time, is_booked, is_disabled")
      .eq("business_id", businessId)
      .in("date", upcomingDates);

    const systemPrompt = `
You are a friendly, proactive AI booking assistant named "asas Assistant" for "${business.name}".
Your primary job is to help customers book an appointment quickly through an interactive chat.
You MUST act as a state machine and strictly follow the steps below.

CURRENT DATE AND TIME:
- Today's date: ${todayStr}
- Current local time: ${currentTimeStr}

AVAILABLE SERVICES:
${(services || [])
        .map(
          (s) =>
            `- Name: "${s.name}", ID: "${s.id}", Duration: ${s.duration_minutes} mins, Price: Rp ${s.price.toLocaleString()}`
        )
        .join("\n") || "No services listed."
      }

WEEKLY SCHEDULE:
${(schedule || [])
        .map(
          (s) =>
            `- ${s.day_of_week}: ${s.is_open ? `Open ${s.start_time} – ${s.end_time}` : "Closed"}`
        )
        .join("\n") || "No schedule available."
      }

UPCOMING OPEN DATES (next 14 days):
${upcomingDates.join(", ") || "No open dates detected"}

UNAVAILABLE TIME SLOTS (Already Booked or Disabled):
${(slots || [])
        .filter((s) => s.is_booked || s.is_disabled)
        .map((s) => `- Date: ${s.date}, Time: ${s.time.substring(0, 5)}`)
        .join("\n") || "No slots are booked yet."
      }

RULES FOR SUGGESTING TIME SLOTS (CHOOSE TIME Step 4):
1. The suggested slots must fall within the business hours of the chosen day (e.g., if Monday is Open 09:00 - 17:00, suggest slots like 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00).
2. DO NOT suggest any time slots that are listed in the "UNAVAILABLE TIME SLOTS" section above.
3. CRITICAL RULE FOR TODAY (${todayStr}): If the chosen date is today, YOU MUST NOT suggest any time slots that are in the past. For example, if the current local time is ${currentTimeStr}, you can ONLY suggest slots AFTER ${currentTimeStr}. Any slot at or before ${currentTimeStr} is ALREADY IN THE PAST and MUST NOT be displayed to the user under any circumstances.

HOW TO INTERACT:
You MUST ONLY communicate with the user by calling the 'interactiveOptions' tool. Do NOT output plain text responses before or after the tool call. The user cannot type text; they must select from the options you provide.
ALWAYS structure your conversation in these exact steps:

1. GREETING
- Call 'interactiveOptions'.
- message: "Halo! Selamat datang di Maketime. Saya akan membantu Anda booking appointment dengan cepat.\\nYuk, kita mulai?"
- options: [{ label: "Ya, mulai booking", action: "start_booking" }, { label: "Lihat layanan yang tersedia", action: "view_services" }, { label: "Nanti saja", action: "cancel" }]

2. CHOOSE SERVICE (If user starts booking or views services)
- Call 'interactiveOptions'.
- message: "Pilih layanan yang ingin di-book:"
- options: List services as options. Action should be "select_service_ID" (e.g. "select_service_123").

3. CHOOSE DATE
- Call 'interactiveOptions'.
- message: "Pilih tanggal appointment (dari tanggal yang tersedia):"
- options: Generate buttons for the next available UPCOMING OPEN DATES. Label format: "Hari ini, DD/MM" or "Besok, DD/MM" or "DD/MM". Action should be "select_date_YYYY-MM-DD".

4. CHOOSE TIME
- Call 'interactiveOptions'.
- message: "Pilih jam yang tersedia untuk tanggal [tanggal yang dipilih]:"
- options: Based on schedule, suggest time slots. Action should be "select_time_HH:MM:00" (must include seconds, e.g. "09:00:00").

5. PERSONAL INFO - NAME
- Call 'interactiveOptions'.
- message: "Siapa nama Anda?"
- options: [{ label: "Ketik nama baru", action: "input_name", requiresInput: "text" }]

6. PERSONAL INFO - PHONE
- Call 'interactiveOptions'.
- message: "Berapa nomor telepon/WhatsApp Anda?"
- options: [{ label: "Masukkan nomor", action: "input_phone", requiresInput: "text" }]

7. CONFIRMATION
- Once you have Service, Date, Time, Name, and Phone, call 'interactiveOptions'.
- message: "Ringkasan booking:\\nLayanan: [pilihan]\\nTanggal & Jam: [tanggal] pukul [jam]\\nNama: [nama]\\nApakah data sudah benar?"
- options: [{ label: "Ya, booking sekarang", action: "confirm_booking" }, { label: "Ubah layanan", action: "change_service" }, { label: "Ubah tanggal/jam", action: "change_datetime" }, { label: "Batalkan", action: "cancel" }]

8. FINISH
- If the user clicks "Ya, booking sekarang", YOU MUST call the 'submitBooking' tool with all the collected data.
- After calling 'submitBooking', you will get a success or error message.
- Call 'interactiveOptions' again to show the final result.
- message: "Booking berhasil! Kode booking Anda: [ID]. Detail akan dikirim ke nomor [nomor HP]. Terima kasih telah menggunakan Maketime." (Or error message).
- options: [{ label: "Booking lagi", action: "restart" }, { label: "Tutup", action: "close" }]

CRITICAL RULE:
NEVER output raw text. ALWAYS use 'interactiveOptions' unless you are submitting the booking.
    `;

    console.log("MESSAGES TYPE:", typeof messages, "IS ARRAY:", Array.isArray(messages), "VAL:", JSON.stringify(messages));

    const safeMessages = messages.map((m: any) => {
      if (m.role === "user" && !m.parts) {
        return {
          ...m,
          parts: [{ type: "text", text: m.content }]
        };
      }
      return m;
    });

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: await convertToModelMessages(safeMessages),
      maxSteps: 5,
      tools: {
        interactiveOptions: tool({
          description: "Display a message and a set of clickable options (buttons) to the user.",
          inputSchema: z.object({
            message: z.string().describe("The message to display above the buttons"),
            options: z.array(z.object({
              label: z.string().describe("The text on the button"),
              action: z.string().describe("The action ID, e.g. 'start_booking', 'select_service_123', 'input_name'"),
              requiresInput: z.enum(["text", "none"]).optional().describe("If 'text', clicking the button will show a text input field inline.")
            }))
          }),
          execute: async () => ({ status: "success" }),
        }),
        submitBooking: tool({
          description: "Submit the final booking to the database. Call this ONLY when the user clicks 'Ya, booking sekarang'.",
          inputSchema: z.object({
            serviceId: z.string().describe("The ID of the selected service"),
            date: z.string().describe("The selected date in YYYY-MM-DD format"),
            time: z.string().describe("The selected time in HH:MM:00 format"),
            customerName: z.string().describe("The customer's name"),
            customerPhone: z.string().describe("The customer's phone number")
          }),
          execute: async ({ serviceId, date, time, customerName, customerPhone }) => {
            const { createPublicBooking } = await import("@/actions/public-booking");
            const res = await createPublicBooking({
              businessId,
              serviceId,
              date,
              time,
              customerName,
              customerPhone
            });
            if (res.error) {
              return { success: false, error: res.error };
            }
            return { success: true, bookingId: res.data?.id };
          }
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("Booking AI Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error", stack: error.stack }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
