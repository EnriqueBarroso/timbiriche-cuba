import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Empezando la siembra de datos...')

  // 1. Limpiar datos existentes (opcional pero recomendado)
  await prisma.productImage.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.product.deleteMany()
  await prisma.seller.deleteMany()

  // 2. Crear un Vendedor de prueba
  const seller = await prisma.seller.create({
    data: {
      storeName: "Timbiriche de Prueba",
      email: "admin@timbiriche.com", // Pon aquí tu email de Clerk si quieres que te pertenezcan
      phoneNumber: "52345678",
      isVerified: true,
      avatar: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
    }
  })

  // 3. Crear Productos de prueba
  const products = [
    {
      title: "Combo de Alimentos Familiar",
      description: "Incluye aceite, arroz, frijoles y carne de cerdo. Entrega a domicilio.",
      price: 4500, // En centavos si usas esa lógica, o valor real
      currency: "USD",
      category: "food",
      images: {
        create: [{ url: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500" }]
      }
    },
    {
      title: "iPhone 13 Pro Max 256GB",
      description: "Como nuevo, batería al 95%. Con cargador original.",
      price: 750,
      currency: "USD",
      category: "tech",
      images: {
        create: [{ url: "https://images.unsplash.com/photo-1639491115802-9242b936af5a?q=80&w=500" }]
      }
    },
    {
      title: "Piezas de Lada 2107",
      description: "Kit de embrague y pastillas de freno nuevas.",
      price: 120,
      currency: "USD",
      category: "parts",
      images: {
        create: [{ url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=500" }]
      }
    }
  ]

  for (const p of products) {
    await prisma.product.create({
      data: {
        ...p,
        sellerId: seller.id
      }
    })
  }

  console.log('✅ Semilla completada con éxito.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })