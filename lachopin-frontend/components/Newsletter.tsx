"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="bg-card rounded-2xl p-8 md:p-12 mb-16 md:mb-20 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Suscríbete a nuestro boletín y no te pierdas ninguna novedad
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Recibe las últimas ofertas y productos nuevos directamente en tu email
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email"
              className="flex-1 bg-background border border-border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button type="submit" variant="default">
              Suscribirse
            </Button>
          </form>
        </div>

        <div className="hidden md:block relative aspect-[4/3] rounded-xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80"
            alt="LaChopin Marketplace"
            fill
            sizes="50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
