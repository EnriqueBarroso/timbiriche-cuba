"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface CategoryCardProps {
  name: string;
  href: string;
  image: string;
}

export function CategoryCard({ name, href, image }: CategoryCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl aspect-[16/10] bg-muted"
    >
      {imgError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-base font-medium text-foreground">{name}</span>
        </div>
      ) : (
        <>
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </>
      )}

      <Badge className="absolute top-3 right-3">Ver ahora</Badge>

      {!imgError && (
        <span className="absolute bottom-0 left-0 p-4 md:p-6 text-lg md:text-xl font-semibold text-white drop-shadow">
          {name}
        </span>
      )}
    </Link>
  );
}
