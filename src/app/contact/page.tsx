import type { Metadata } from "next";
import { Suspense } from "react";

import { ContactEnquiry } from "@/components/contact/ContactEnquiry";
import { ContactForm, ContactFormFromUrl } from "@/components/contact/ContactForm";
import { ContactLocation } from "@/components/contact/ContactLocation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { PageHero } from "@/components/ui/PageHero";
import { site } from "@/config/site";
import ui from "@/styles/ui.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: `Reservations, celebrations or a question about the lake — call, email or write to ${site.name} on Lake Plav in Plav, Montenegro. The front desk answers 24 hours a day, and we reply to every message within one working day.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Book your stay", href: "/#book" }} />
      <main>
        <PageHero
          kicker="Contact"
          size="compact"
          overlap
          title={
            <>
              Talk to a person, <em>not a machine</em>
            </>
          }
          intro="Call any time — the front desk answers 24 hours a day. Write, and we reply within one working day."
          actions={
            <>
              <a href="#write" className={ui.btnGold}>
                Write to us
              </a>
              <a href={site.phone.href} className={ui.btnOutlineLight}>
                Call {site.phone.display}
              </a>
            </>
          }
        />
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
