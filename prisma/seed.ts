// prisma/seed.ts
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Empezando la siembra de datos...')

  // 1. Crear un Usuario Vendedor
  const vendedor = await prisma.user.upsert({
    where: { email: 'vendedor@cuba.test' },
    update: {},
    create: {
      email: 'vendedor@cuba.test',
      fullName: 'Yusnaby Pérez',
      role: 'SELLER',
      sellerProfile: {
        create: {
          storeName: 'Dulces Caseros La Habana',
          description: 'Los mejores cakes y dulces finos de Marianao.',
          phoneNumber: '+5355555555',
          isVerified: true,
          walletBalance: 0,
        }
      }
    },
  })

  console.log(`👤 Vendedor creado: ${vendedor.fullName}`)

  // 2. Buscar el perfil del vendedor para asignarle productos
  const perfilVendedor = await prisma.sellerProfile.findUnique({
    where: { userId: vendedor.id }
  })

  if (!perfilVendedor) throw new Error("No se encontró perfil de vendedor")

  // 3. Crear Productos de prueba
  const producto1 = await prisma.product.create({
    data: {
      sellerId: perfilVendedor.id,
      title: 'Cake de Chocolate (10 personas)',
      description: 'Delicioso cake con cobertura de chocolate fundido. Entrega en 24h.',
      price: 1500, // $15.00 USD (Recuerda: guardamos centavos)
      category: 'Comida',
      stock: 5,
      images: {
        create: {
          url: 'https://placehold.co/600x400/3e2723/FFF?text=Cake+Chocolate',
          isMain: true
        }
      }
    }
  })

  const producto2 = await prisma.product.create({
    data: {
      sellerId: perfilVendedor.id,
      title: 'Split de Aire Acondicionado (Instalación)',
      description: 'Mano de obra para instalar split 1T. Incluye materiales básicos.',
      price: 4000, // $40.00 USD
      category: 'Servicios',
      stock: 10,
      images: {
        create: {
          url: 'https://placehold.co/600x400/0288d1/FFF?text=Aire+Acondicionado',
          isMain: true
        }
      }
    }
  })

  console.log(`📦 Productos creados: ${producto1.title}, ${producto2.title}`)
  console.log('✅ Siembra completada.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })