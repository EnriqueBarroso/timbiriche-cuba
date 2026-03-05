import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  sellerId: string | null;
  
  // Acciones
  addItem: (item: Omit<CartItem, 'quantity'>, newSellerId: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      sellerId: null,

      addItem: (item, newSellerId) => set((state) => {
        // Si el cliente intenta pedir de otro restaurante, vaciamos el carrito anterior
        if (state.sellerId && state.sellerId !== newSellerId) {
           return { items: [{ ...item, quantity: 1 }], sellerId: newSellerId };
        }

        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            sellerId: newSellerId,
          };
        }
        return { items: [...state.items, { ...item, quantity: 1 }], sellerId: newSellerId };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
        // Si el carrito se queda vacío, limpiamos el sellerId
        sellerId: state.items.length === 1 ? null : state.sellerId 
      })),

      updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          return {
            items: state.items.filter((i) => i.id !== id),
            sellerId: state.items.length === 1 ? null : state.sellerId
          };
        }
        return {
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        };
      }),

      clearCart: () => set({ items: [], sellerId: null }),

      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      
      getTotalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'lachopin-eats-cart', // Nombre en el localStorage
    }
  )
);