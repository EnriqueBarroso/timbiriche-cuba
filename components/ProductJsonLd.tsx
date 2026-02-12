// components/ProductJsonLd.tsx

interface ProductJsonLdProps {
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  url: string;
  sellerName: string;
  isSold: boolean;
}

export default function ProductJsonLd({
  name,
  description,
  price,
  currency,
  imageUrl,
  url,
  sellerName,
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
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: schemaCurrency,
      availability: isSold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      seller: {
        "@type": "Person",
        name: sellerName,
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