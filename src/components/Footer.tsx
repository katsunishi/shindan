const footerLinks = [
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Accessibility", href: "#" }
];

const socialItems = [
  { label: "Save", short: "S" },
  { label: "Facebook", short: "f" },
  { label: "Instagram", short: "I" },
  { label: "X", short: "X" },
  { label: "QR", short: "Q" }
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__copy">
          <p className="site-footer__copyright">
            ©2011-2026 NERIS Analytics Limited
          </p>
          <nav className="site-footer__links" aria-label="Footer">
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <p className="site-footer__note">
            Our content is available in multiple languages through both human and
            AI-assisted translation. While we strive for accuracy, the English
            version remains the official text.
          </p>
        </div>
        <div className="site-footer__icons" aria-label="Social links">
          {socialItems.map((item) => (
            <a
              key={item.label}
              className="site-footer__icon"
              href="#"
              aria-label={item.label}
            >
              <span>{item.short}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
