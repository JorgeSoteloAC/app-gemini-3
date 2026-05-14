import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : null);
    });
  }, []);

  useEffect(() => {
    if (!userId) {
      setCart([]);
      return;
    }

    const path = `users/${userId}/cart`;
    const q = query(collection(db, path));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CartItem));
      setCart(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [userId]);

  const addToCart = async (product: Product) => {
    if (!userId) {
      alert("Please sign in to add items to your cart.");
      return;
    }

    const path = `users/${userId}/cart`;
    const existingItem = cart.find(item => item.productId === product.id);
    try {
      if (existingItem) {
        await updateDoc(doc(db, path, existingItem.id), {
          quantity: existingItem.quantity + 1
        });
      } else {
        await addDoc(collection(db, path), {
          productId: product.id,
          quantity: 1,
          addedAt: new Date().toISOString(),
          product: {
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category
          }
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!userId) return;
    const path = `users/${userId}/cart`;
    try {
      await deleteDoc(doc(db, path, itemId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!userId || quantity < 1) return;
    const path = `users/${userId}/cart`;
    try {
      await updateDoc(doc(db, path, itemId), { quantity });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
