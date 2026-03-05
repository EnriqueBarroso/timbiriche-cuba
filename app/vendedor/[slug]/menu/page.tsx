import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MenuInteractive from "@/components/MenuInteractive";

interface MenuPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EatsMenuPage({ params }: MenuPageProps) {
  const { slug } = await params;

  // 1. Buscamos al restaurante y sus platos
  const seller = await prisma.seller.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        include: { images: true }
      },
    },
  });

  if (!seller) notFound();

  // 2. Agrupamos los platos por categoría desde el servidor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedProducts = seller.products.reduce((acc: any, product: any) => {
    const category = product.category || "Otros"; 
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  const categories = Object.keys(groupedProducts);

  // 3. Renderizamos el componente cliente con todo el diseño
  return (
    <MenuInteractive 
      seller={seller} 
      groupedProducts={groupedProducts} 
      categories={categories} 
      slug={slug} 
    />
  );
}