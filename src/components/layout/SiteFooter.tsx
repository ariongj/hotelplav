import Link from "next/link";

import { exploreNav, site } from "@/config/site";
import { cx } from "@/lib/cx";

import { NewsletterForm } from "./NewsletterForm";
import styles from "./SiteFooter.module.css";

type FooterAside =
  | { kind: "newsletter" }
  | { kind: "text"; title: string; text: string; link?: { label: string; href: string } }
  | { kind: "list"; title: string; items: readonly string[] };

type SiteFooterProps = {
  /** Which desk's address to show. */
  email?: keyof typeof site.email;
  /** Fourth column. Defaults to the newsletter sign-up. */
  aside?: FooterAside;
  /** Social links under the brand statement. */
  social?: boolean;
  /** Hairline + tighter top padding, for pages whose last section is dark. */
  divider?: boolean;
  /** Home renders the wordmark as text (it is already the home page). */
  isHome?: boolean;
};

export function SiteFooter({
  email = "stay",
  aside = { kind: "newsletter" },
  social = false,
  divider = false,
  isHome = false,
}: SiteFooterProps) {
  const address = site.email[email];

  return (
    <footer id="contact" className={cx(styles.footer, divider && styles.divider)}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          {isHome ? (
            <div className={styles.wordmark}>{site.wordmark}</div>
          ) : (
            <Link href="/" className={styles.wordmark}>
              {site.wordmark}
            </Link>
          )}
          <p className={cx(styles.tagline, social && styles.taglineSpaced)}>{site.tagline}</p>
          {social && (
            <div className={styles.social}>
              {site.social.map((item) => (
                <a key={item.short} href={item.href} className={styles.socialLink} aria-label={item.label}>
                  {item.short}
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className={styles.heading}>Explore</div>
          <div className={styles.list}>
            {exploreNav.map((item) => (
              <Link key={item.href} href={item.href} className={styles.listLink}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className={styles.heading}>Contact</div>
          <address className={styles.contact}>
            <span>
              {site.address.line1}
              <br />
              {site.address.locality}, {site.address.country}
            </span>
            <a href={site.phone.href} className={styles.listLink}>
              {site.phone.display}
            </a>
            <a href={`mailto:${address}`} className={styles.listLink}>
              {address}
            </a>
          </address>
        </div>

        <div>
          {aside.kind === "newsletter" && (
            <>
              <div className={styles.heading}>Newsletter</div>
              <p className={styles.note}>Quiet notes from the mountains, a few times a year.</p>
              <NewsletterForm />
            </>
          )}
          {aside.kind === "text" && (
            <>
              <div className={styles.heading}>{aside.title}</div>
              <p className={styles.note}>{aside.text}</p>
              {aside.link && (
                <Link href={aside.link.href} className={styles.asideLink}>
                  {aside.link.label}
                </Link>
              )}
            </>
          )}
          {aside.kind === "list" && (
            <>
              <div className={styles.heading}>{aside.title}</div>
              <div className={styles.contact}>
                {aside.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.bottom}>
        <span>
          &copy; {site.copyrightYear} {site.name}. All rights reserved.
        </span>
        <div className={styles.legal}>
          {site.legal.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
