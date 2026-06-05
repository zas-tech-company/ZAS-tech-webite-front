/**
 * Shared SEO constants — keep in sync with seo/site.json
 */
(function (global) {
  const SITE_URL = "https://zas-tech.krd";
  const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/logo.JPG`;

  global.ZAS_SEO = {
    siteUrl: SITE_URL,
    defaultOgImage: DEFAULT_OG_IMAGE,
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ZAS Tech",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description:
        "ZAS Tech provides software development, mobile applications, AI solutions, websites, ERP systems and IT consulting services.",
      email: "info@zas-tech.krd",
      telephone: "+9647501514519",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IQ",
      },
      sameAs: [
        "https://www.facebook.com/share/1CprYSZifP/?mibextid=wwXIfr",
        "https://www.instagram.com/zas__.tech?igsh=MWtpenBnaG4xMHQ1aQ==",
      ],
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
