// lib/categories.ts
import { 
  Utensils, 
  Car, 
  Armchair, 
  Bike, 
  Smartphone, 
  Shirt,
  LayoutGrid,
  Sparkles,
  Building2
} from "lucide-react";

export const CATEGORIES = [
  {
    id: "all",
    label: "Todo",
    shortLabel: "Todo",
    icon: LayoutGrid,
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80",
    description: "Explora todo nuestro catálogo.",
    subcategories: []
  },
  {
    id: "food",
    label: "Combos y Alimentos",
    shortLabel: "Alimentos",
    icon: Utensils,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    description: "Cakes, carnes, combos familiares y agro.",
    subcategories: ["Combos Mixtos", "Cárnicos", "Agro", "Dulces"]
  },
  {
    id: "parts",
    label: "Piezas y Accesorios",
    shortLabel: "Piezas",
    icon: Car,
    image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80",
    description: "Repuestos para motos, autos y bicicletas.",
    subcategories: ["Motos y Motorinas", "Autos", "Bicicletas", "Neumáticos"]
  },
  {
    id: "home",
    label: "Hogar y Decoración",
    shortLabel: "Hogar",
    icon: Armchair,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    description: "Splits, freezers, muebles y decoración.",
    subcategories: ["Electrodomésticos", "Muebles", "Cocina", "Climatización"]
  },
  {
    id: "logistics",
    label: "Mensajería",
    shortLabel: "Mensajería",
    icon: Bike,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    description: "Servicios de entrega y mudanzas rápidas.",
    subcategories: ["Envíos Habana", "Interprovincial", "Mudanzas"]
  },
  {
    id: "tech",
    label: "Tecnología",
    shortLabel: "Tech",
    icon: Smartphone,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    description: "Celulares, laptops y accesorios.",
    subcategories: ["Celulares", "Laptops", "Accesorios", "Audio"]
  },
  {
    id: "fashion",
    label: "Ropa y Moda",
    shortLabel: "Moda",
    icon: Shirt,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
    description: "Ropa para mujer, hombre y niños.",
    subcategories: ["Mujer", "Hombre", "Niños", "Zapatos"]
  },
  {
    id: "wholesale",
    label: "🏢 Venta Mayorista",
    shortLabel: "Mayorista",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
    description: "Lotes, contenedores y precios por volumen para negocios.",
    subcategories: []
  },
] as const;