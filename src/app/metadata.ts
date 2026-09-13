export function removeStaticMetadata() {
  // Call before mounting React, which owns these tags during client navigation.
  document.head
    .querySelectorAll(
      'title, meta[name="description"], meta[name="theme-color"], meta[name="robots"], ' +
        'meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"], ' +
        'link[rel="alternate"][hreflang], link[rel="icon"], script[type="application/ld+json"]',
    )
    .forEach((tag) => tag.remove());
}
