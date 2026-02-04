// scripts/fix-currency.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixCurrency() {
  // 1. Obtener todos los productos
  const products = await prisma.product.findMany();

  for (const product of products) {
    // 2. Extraer currency de la descripción si existe
    const match = product.description.match(/^\[([A-Z]{3})\]\s*/);
    
    if (match) {
      const currency = match[1]; // USD, EUR, CUP, MLC
      const cleanDescription = product.description.replace(/^\[([A-Z]{3})\]\s*/, '');
      
      // 3. Actualizar producto
      await prisma.product.update({
        where: { id: product.id },
        data: {
          currency: currency,
          description: cleanDescription,
        },
      });
      
      console.log(`✅ Fixed product ${product.id}: ${currency}`);
    } else {
      // Si no tiene currency en descripción, asume USD
      await prisma.product.update({
        where: { id: product.id },
        data: {
          currency: 'USD',
        },
      });
      
      console.log(`✅ Set default USD for product ${product.id}`);
    }
  }
  
  console.log('🎉 All products fixed!');
  await prisma.$disconnect();
}

fixCurrency();