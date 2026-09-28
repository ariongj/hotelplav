import type { Metadata } from "next";

import { BookingPanel } from "@/components/home/BookingPanel";
import { heroImages } from "@/components/home/content";
import { HomeBookingProvider } from "@/components/home/HomeBooking";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeStickyBar } from "@/components/home/HomeStickyBar";
import {
  DiningTeaser,
  EventsTeaser,
  FinalCta,
  GallerySection,
  Location,
  Offers,
  Reviews,
  RoomsTeaser,
  SpaTeaser,
  Statement,
  TourTeaser,
  TrustStrip,
} from "@/components/home/sections";
import sections from "@/components/home/sections.module.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { site } from "@/config/site";
import { lowestBaseRate } from "@/lib/booking/rooms";
import { euro } from "@/lib/format";

export const metadata: Metadata = {
  alternates: { canonical: `${site.url}/` },
};

const hotelJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: site.name,
  description: site.description,
  url: site.url,
  image: heroImages.exterior.src,
  telephone: site.phone.display,
  email: site.email.stay,
  priceRange: `From ${euro(lowestBaseRate)} per night`,
  starRating: { "@type": "Rating", ratingValue: "5" },
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.line1,
    addressLocality: site.address.locality,
    addressCountry: site.address.countryCode,
  },
  amenityFeature: ["Thermal spa", "Finnish sauna", "Restaurant", "Bar", "Valet parking", "EV charging"].map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
};

export default function HomePage() {
  return (
    <HomeBookingProvider>
      <SiteNav cta={{ label: "Book", href: "#book" }} menuCta={{ label: "Reserve your stay", href: "#book" }} />
      <main id="top">
        <HomeHero />
        <section id="book" className={sections.book}>
          <BookingPanel />
        </section>
        <TrustStrip />
        <Statement />
        <RoomsTeaser />
        <DiningTeaser />
        <SpaTeaser />
        <TourTeaser />
        <EventsTeaser />
        <GallerySection />
        <Offers />
        <Reviews />
        <Location />
        <FinalCta />
      </main>
      <SiteFooter isHome social />
      <HomeStickyBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd).replace(/</g, "\\u003c") }}
      />
    </HomeBookingProvider>
  );
}
