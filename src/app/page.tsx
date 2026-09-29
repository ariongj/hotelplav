import type { Metadata } from "next";

import { BookingResults } from "@/components/home/BookingResults";
import { intro } from "@/components/home/content";
import { HomeBookingProvider } from "@/components/home/HomeBooking";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeStickyBar } from "@/components/home/HomeStickyBar";
import {
  Duo,
  FinalCta,
  GallerySection,
  Intro,
  Location,
  Reviews,
  Seasons,
  Stay,
  TourBand,
} from "@/components/home/sections";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { site } from "@/config/site";
import { lowestFromRate } from "@/lib/booking/rooms";
import { euro } from "@/lib/format";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const hotelJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: site.name,
  description: site.description,
  url: site.url,
  image: intro.image.src,
  telephone: site.phone.display,
  email: site.email.stay,
  priceRange: `From ${euro(lowestFromRate)} per night`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.line1,
    addressLocality: site.address.locality,
    addressCountry: site.address.countryCode,
  },
  amenityFeature: ["Spa", "Finnish sauna", "Restaurant", "Bar", "Lake access", "Parking", "EV charging"].map(
    (name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    }),
  ),
};

export default function HomePage() {
  return (
    <HomeBookingProvider>
      <SiteNav cta={{ label: "Book", href: "#book" }} menuCta={{ label: "Check availability", href: "#book" }} />
      <main id="top">
        <HomeHero />
        <BookingResults />
        <Intro />
        <Stay />
        <Seasons />
        <Duo />
        <TourBand />
        <GallerySection />
        <Reviews />
        <Location />
        <FinalCta />
      </main>
      {/* No social row until the profiles exist (site.social links are still "#"). */}
      <SiteFooter isHome />
      <HomeStickyBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd).replace(/</g, "\\u003c") }}
      />
    </HomeBookingProvider>
  );
}
