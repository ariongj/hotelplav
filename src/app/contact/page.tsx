import type { Metadata } from "next";
import { Suspense } from "react";

import { ContactEnquiry } from "@/components/contact/ContactEnquiry";
import { ContactForm, ContactFormFromUrl } from "@/components/contact/ContactForm";
import { ContactIntro } from "@/components/contact/ContactIntro";
import { ContactLocation } from "@/components/contact/ContactLocation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reservations, occasions or a question about the mountain — call, email or write to Brezovica Hotel & SPA in the Sharr Mountains. A person answers, around the clock.",
};

export default function ContactPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Reserve your stay", href: "/#book" }} />
      <main>
        <ContactIntro />
        <ContactEnquiry>
          {/* The pre-fill comes from the query string, so the page is prerendered
              with the empty form and the filled one takes over in the browser. */}
          <Suspense fallback={<ContactForm />}>
            <ContactFormFromUrl />
          </Suspense>
        </ContactEnquiry>
        <ContactLocation />
      </main>
      <SiteFooter />
    </>
  );
}
