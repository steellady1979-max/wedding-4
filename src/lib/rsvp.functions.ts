import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GOOGLE_SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbycH6idL5QqdW_cXJX7rZzPz1yaZbsggjPW0clx36FVisoeX5XwknsRy7T0mPMAG2arhg/exec";

const rsvpInput = z.object({
  name: z.string().trim().min(2, "სახელი აუცილებელია").max(80),
  attending: z.enum(["yes", "no"]),
  // Honeypot: real guests never see or fill this in, spam bots do.
  company: z.string().max(0).optional(),
});

const wishInput = z.object({
  name: z.string().trim().min(2, "სახელი აუცილებელია").max(80),
  wish: z.string().trim().min(2, "სურვილი აუცილებელია").max(500),
  company: z.string().max(0).optional(),
});

type SheetSubmission =
  | { type: "rsvp"; name: string; attending: "yes" | "no" }
  | { type: "wish"; name: string; wish: string };

async function submitToSheet(submission: SheetSubmission) {
  const secret = process.env["GOOGLE_SHEETS_WEBHOOK_SECRET"];

  if (!secret) {
    console.error("Google Sheets connection is not configured");
    throw new Error("პასუხის შენახვა დროებით ვერ ხერხდება");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...submission, secret }),
    });

    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
      error?: string;
    } | null;

    if (!response.ok || result?.ok !== true) {
      console.error(
        `Google Sheets webhook failed [${response.status}]: ${result?.error ?? "invalid response"}`,
      );
      throw new Error("პასუხის შენახვა დროებით ვერ ხერხდება");
    }
  } finally {
    clearTimeout(timeout);
  }
}

export const submitRsvp = createServerFn({ method: "POST" })
  .validator((data) => rsvpInput.parse(data))
  .handler(async ({ data }) => {
    if (data.company) return { saved: false } as const;
    await submitToSheet({
      type: "rsvp",
      name: data.name,
      attending: data.attending,
    });
    return { saved: true } as const;
  });

export const submitWish = createServerFn({ method: "POST" })
  .validator((data) => wishInput.parse(data))
  .handler(async ({ data }) => {
    if (data.company) return { saved: false } as const;
    await submitToSheet({ type: "wish", name: data.name, wish: data.wish });
    return { saved: true } as const;
  });
