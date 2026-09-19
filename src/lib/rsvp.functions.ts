import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SPREADSHEET_ID = "1eg0svt0-gNpwbq9WkNjdIU2PNK6JRO8Tzd8M1DYsVCs";
const SHEET_TAB = "1ფურცელი";
const GATEWAY_BASE = "https://connector-gateway.lovable.dev/google_sheets/v4";

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

async function appendRow(row: string[]) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_SHEETS_API_KEY"];

  if (!apiKey || !connectionKey) {
    console.error("Google Sheets connection is not configured");
    throw new Error("პასუხის შენახვა დროებით ვერ ხერხდება");
  }

  const range = encodeURI(`${SHEET_TAB}!A:D`);
  const response = await fetch(
    `${GATEWAY_BASE}/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-Connection-Api-Key": connectionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    console.error(`Google Sheets append failed [${response.status}]: ${body}`);
    throw new Error("პასუხის შენახვა დროებით ვერ ხერხდება");
  }
}

export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((data) => rsvpInput.parse(data))
  .handler(async ({ data }) => {
    if (data.company) return { saved: false } as const;
    await appendRow([
      new Date().toISOString(),
      data.name,
      data.attending === "yes" ? "დავესწრები" : "ვერ დავესწრები",
      "",
    ]);
    return { saved: true } as const;
  });

export const submitWish = createServerFn({ method: "POST" })
  .inputValidator((data) => wishInput.parse(data))
  .handler(async ({ data }) => {
    if (data.company) return { saved: false } as const;
    await appendRow([new Date().toISOString(), data.name, "", data.wish]);
    return { saved: true } as const;
  });
