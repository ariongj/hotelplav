"use client";

import type { ReactNode } from "react";

import { CHOOSE_TREATMENT_EVENT } from "./content";

type BookLinkProps = {
  /** Pre-selects this treatment in the #book form. */
  treatment: string;
  className?: string;
  children: ReactNode;
};

/**
 * Jumps to the treatment request card with a treatment already chosen.
 * Without JavaScript it is a plain #book link.
 */
export function BookLink({ treatment, className, children }: BookLinkProps) {
  return (
    <a
      href="#book"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(CHOOSE_TREATMENT_EVENT, { detail: treatment }))}
    >
      {children}
    </a>
  );
}
