// lib/categories.ts
import { 
  Utensils, 
  Car, 
  Armchair, 
  Bike, 
  Smartphone, 
  Shirt, 
  LayoutGrid,
  Sparkles
} from "lucide-react";

export const CATEGORIES = [
  { 
    id: "all", 
    label: "Todo", 
    shortLabel: "Todo",
    icon: LayoutGrid,
    description: "Explora todo nuestro catálogo.",
    subcategories: []
  },
  { 
    id: "food", 
    label: "Combos y Alimentos", 
    shortLabel: "Alimentos",
    icon: Utensils,
    description: "Cakes, carnes, combos familiares y agro.",
    subcategories: ["Combos Mixtos", "Cárnicos", "Agro", "Dulces"]
  },
  { 
    id: "parts", 
    label: "Piezas y Accesorios", 
    shortLabel: "Piezas",
    icon: Car,
    description: "Repuestos para motos, autos y bicicletas.",
    subcategories: ["Motos y Motorinas", "Autos", "Bicicletas", "Neumáticos"]
  },
  { 
    id: "home", 
    label: "Hogar y Decoración", 
    shortLabel: "Hogar",
    icon: Armchair,
    description: "Splits, freezers, muebles y decoración.",
    subcategories: ["Electrodomésticos", "Muebles", "Cocina", "Climatización"]
  },
  { 
    id: "logistics", 
    label: "Mensajería", 
    shortLabel: "Mensajería",
    icon: Bike,
    description: "Servicios de entrega y mudanzas rápidas.",
    subcategories: ["Envíos Habana", "Interprovincial", "Mudanzas"]
  },
  { 
    id: "tech", 
    label: "Tecnología", 
    shortLabel: "Tech",
    icon: Smartphone,
    description: "Celulares, laptops y accesorios.",
    subcategories: ["Celulares", "Laptops", "Accesorios", "Audio"]
  },
  { 
    id: "fashion", 
    label: "Ropa y Moda", 
    shortLabel: "Moda",
    icon: Shirt,
    description: "Ropa para mujer, hombre y niños.",
    subcategories: ["Mujer", "Hombre", "Niños", "Zapatos"]
  },
] as const;