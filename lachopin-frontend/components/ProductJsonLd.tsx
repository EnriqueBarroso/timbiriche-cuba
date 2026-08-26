// components/ProductJsonLd.tsx

interface ProductJsonLdProps {
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  url: string;
  businessName: string;
  isSold: boolean;
}

export default function ProductJsonLd({
  name,
  description,
  price,
  currency,
  imageUrl,
  url,
  businessName,
  isSold,
}: ProductJsonLdProps) {
  // Mapear monedas locales a USD para schema.org (CUP y MLC no son reconocidas)
  const schemaCurrency = ["USD", "EUR"].includes(currency) ? currency : "USD";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description.slice(0, 500),
    image: imageUrl,
    url,
    brand: {
      "@type": "Organization",
      name: "LaChopin",
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: schemaCurrency,
      availability: isSold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      // "seller" es el término del vocabulario schema.org (no renombrar aunque
      // internamente ya no hablemos de "sellers" sino de "businesses").
      seller: {
        "@type": "Person",
        name: businessName,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}