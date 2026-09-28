import type { Metadata } from "next";

import { ChefsTasting } from "@/components/dining/ChefsTasting";
import { DiningHero } from "@/components/dining/DiningHero";
import { DiningHours } from "@/components/dining/DiningHours";
import { DiningStatement } from "@/components/dining/DiningStatement";
import { DiningStickyBar } from "@/components/dining/DiningStickyBar";
import { PrivateDining } from "@/components/dining/PrivateDining";
import { TableReservation } from "@/components/dining/TableReservation";
import { Venues } from "@/components/dining/Venues";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";

export const metadata: Metadata = {
  title: "Dining",
  description:
    "Three venues beneath the Sharr Mountains — Gjethja's seasonal chef's menu, the all-day Opera Lounge and the Magnet Night Club. Reserve a table online.",
};

export default function DiningPage() {
  return (
    <>
      <SiteNav
        cta={{ label: "Reserve", href: "#reserve" }}
        menuCta={{ label: "Reserve a table", href: "#reserve" }}
      />
      <main>
        <DiningHero />
        <TableReservation />
        <DiningStatement />
        <Venues />
        <ChefsTasting />
        <DiningHours />
        <PrivateDining />
      </main>
      <SiteFooter email="dine" social divider />
      <DiningStickyBar />
    </>
  );
}
