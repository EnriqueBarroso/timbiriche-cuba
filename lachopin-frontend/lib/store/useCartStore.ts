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
  businessId: string | null;
  
  // Acciones
  addItem: (item: Omit<CartItem, 'quantity'>, newBusinessId: string) => void;
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
      businessId: null,

      addItem: (item, newBusinessId) => set((state) => {
        // Si el cliente intenta pedir de otro restaurante, vaciamos el carrito anterior
        if (state.businessId && state.businessId !== newBusinessId) {
           return { items: [{ ...item, quantity: 1 }], businessId: newBusinessId };
        }

        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            businessId: newBusinessId,
          };
        }
        return { items: [...state.items, { ...item, quantity: 1 }], businessId: newBusinessId };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
        // Si el carrito se queda vacío, limpiamos el businessId
        businessId: state.items.length === 1 ? null : state.businessId 
      })),

      updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          return {
            items: state.items.filter((i) => i.id !== id),
            businessId: state.items.length === 1 ? null : state.businessId
          };
        }
        return {
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        };
      }),

      clearCart: () => set({ items: [], businessId: null }),

      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      
      getTotalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'lachopin-eats-cart', // Nombre en el localStorage
    }
  )
);