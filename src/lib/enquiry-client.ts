"use client";

export type EnquiryType = "newsletter" | "contact" | "event" | "table" | "spa" | "stay-hold" | "viewing";

export type EnquiryResponse = { ok: true } | { ok: false; error: string };

/** Accepts an email address or a phone number (6+ digits). */
export function isEmailOrPhone(value: string): boolean {
  const v = value.trim();
  if (v.includes("@")) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  return /^[+\d\s().-]+$/.test(v) && v.replace(/\D/g, "").length >= 6;
}

/** Send a form to /api/enquiry. Never throws — failures come back as { ok: false }. */
export async function submitEnquiry(
  type: EnquiryType,
  fields: Record<string, string | number | boolean | null | undefined>,
): Promise<EnquiryResponse> {
  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, fields, page: window.location.pathname }),
    });
    const data = (await res.json()) as EnquiryResponse;
    return data;
  } catch {
    return { ok: false, error: "We couldn't send that just now — please call or email us directly." };
  }
}
