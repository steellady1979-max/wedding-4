import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SPREADSHEET_ID = "1vUDvUPVeRLrjtdtdOBHR2wIOjUD-Krv8qzfuggK3zd0";
const SHEET_TAB = "სტუმრები";
const GATEWAY_BASE = "https://connector-gateway.lovable.dev/google_sheets/v4";

const rsvpInput = z.object({
  name: z.string().trim().min(2, "სახელი აუცილებელია").max(80),
  attending: z.enum(["yes", "no"]),
  // Honeypot: real guests never see or fill this in, spam bots do.
  company: z.string().max(0).optional(),
});

export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((data) => rsvpInput.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    const connectionKey = process.env["GOOGLE_SHEETS_API_KEY"];

    if (!apiKey || !connectionKey) {
      console.error("RSVP save skipped: Google Sheets connection is not configured");
      throw new Error("პასუხის შენახვა დროებით ვერ ხერხდება");
    }

    // A filled honeypot means a bot — pretend success, write nothing.
    if (data.company) return { saved: false } as const;

    const row = [
      new Date().toISOString(),
      data.name,
      data.attending === "yes" ? "დავესწრები" : "ვერ დავესწრები",
    ];

    // encodeURI keeps "!" and ":" intact (the API rejects an encoded colon)
    // while safely escaping the Georgian sheet name.
    const range = encodeURI(`${SHEET_TAB}!A:C`);
    const url =
      `${GATEWAY_BASE}/spreadsheets/${SPREADSHEET_ID}/values/${range}` +
      `:append?valueInputOption=USER_ENTERED`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-Connection-Api-Key": connectionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`RSVP append failed [${response.status}]: ${body}`);
      throw new Error("პასუხის შენახვა დროებით ვერ ხერხდება");
    }

    return { saved: true } as const;
  });
