import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowRight, Cpu, Laptop, Smartphone, Speaker } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

import { MOCK_PRODUCTS } from '../constants/products';

const CATEGORIES = [
  { id: 'all', name: 'ALL_PRODUCTS', icon: SearchIcon },
  { id: 'processors', name: 'PROCESSORS', icon: Cpu },
  { id: 'laptops', name: 'LAPTOPS', icon: Laptop },
  { id: 'mobile', name: 'MOBILE', icon: Smartphone },
  { id: 'audio', name: 'AUDIO', icon: Speaker },
];

function SearchIcon(props: any) {
  return <ShoppingCart {...props} size={14} className="opacity-50" />;
}

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    async function fetchAndSeed() {
      const path = 'products';
      try {
        const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(12));
        const snapshot = await getDocs(q);
        
        if (user) {
          const namesInDb = new Set(snapshot.docs.map(doc => doc.data().name));
          let seededAny = false;

          for (const p of MOCK_PRODUCTS) {
            if (!namesInDb.has(p.name)) {
              console.log(`Seeding product: ${p.name}`);
              const { id, ...rest } = p;
              await addDoc(collection(db, path), {
                ...rest,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });
              seededAny = true;
            }
          }

          if (seededAny) {
            const retrySnapshot = await getDocs(q);
            const data = retrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
            setProducts(data);
          } else if (!snapshot.empty) {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
            setProducts(data);
          }
        } else if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
          setProducts(data);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
        console.error("Error with products:", error);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    fetchAndSeed();
  }, [user]);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const featuredProduct = products[0] || MOCK_PRODUCTS[0];

  return (
    <div className="space-y-12">
      {/* 01 // SYSTEM_SPOTLIGHT */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-[#141414] border border-[#141414] rounded-sm overflow-hidden">
        <div className="lg:col-span-7 bg-[#E4E3E0] p-8 md:p-16 flex flex-col justify-between min-h-[500px]">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#141414]/50 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> SYSTEM_SPOTLIGHT // v2.6.0
              </span>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.85] mt-4">
                {featuredProduct.name}
              </h1>
            </motion.div>
            <p className="font-mono text-xs max-w-md opacity-60 leading-relaxed uppercase">
              {featuredProduct.description}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 mt-8">
            <Link to={`/product/${featuredProduct.id}`}>
              <button className="bg-[#141414] text-[#E4E3E0] px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors flex items-center gap-3">
                Initialize_Module <ArrowRight size={14} />
              </button>
            </Link>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] uppercase opacity-40">MSRP_VAL</span>
              <span className="font-mono font-bold">${featuredProduct.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-5 bg-white flex items-center justify-center p-12 relative">
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            src={featuredProduct.imageUrl} 
            alt={featuredProduct.name}
            className="w-full h-full object-contain relative z-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[80%] h-[80%] border border-[#141414]/5 rounded-sm rotate-45" />
            <div className="absolute w-full h-[1px] bg-[#141414]/10 top-1/2 -translate-y-1/2" />
            <div className="absolute h-full w-[1px] bg-[#141414]/10 left-1/2 -translate-x-1/2" />
          </div>
        </div>
      </section>

      {/* 02 // HARDWARE_MONITORING */}
      <section className="bg-[#141414] text-[#E4E3E0] p-4 rounded-sm flex flex-wrap justify-between items-center gap-8 border-b-4 border-red-500">
        <div className="flex items-center gap-12 overflow-x-auto no-scrollbar">
          <div className="flex flex-col min-w-max">
            <span className="font-mono text-[8px] uppercase tracking-widest opacity-40">Network_Core</span>
            <span className="font-mono text-[10px] text-green-400">STATUS.SYNCHRONIZED</span>
          </div>
          <div className="flex flex-col min-w-max">
            <span className="font-mono text-[8px] uppercase tracking-widest opacity-40">Active_Units</span>
            <span className="font-mono text-[10px]">{products.length}_LOADED</span>
          </div>
          <div className="flex flex-col min-w-max">
            <span className="font-mono text-[8px] uppercase tracking-widest opacity-40">Encryption</span>
            <span className="font-mono text-[10px]">AES_256_ACTIVE</span>
          </div>
          <div className="flex flex-col min-w-max">
            <span className="font-mono text-[8px] uppercase tracking-widest opacity-40">Server_Time</span>
            <span className="font-mono text-[10px]">{new Date().toLocaleTimeString([], { hour12: false })}</span>
          </div>
        </div>
        <div className="hidden md:flex gap-1">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className={`w-3 h-1 ${i < 6 ? 'bg-green-500' : 'bg-[#E4E3E0]/10'}`} />
          ))}
        </div>
      </section>

      {/* 03 // BENTO_CATALOG */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#141414] pb-4">
          <div>
            <h3 className="font-mono text-[10px] uppercase font-bold tracking-[0.5em] opacity-30">Hardware_Registry</h3>
            <p className="text-2xl font-bold uppercase tracking-tighter">System Inventory</p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-1.5 border rounded-sm font-mono text-[9px] uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeCategory === cat.id 
                    ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                    : 'border-[#141414]/10 hover:border-[#141414]'
                }`}
              >
                <cat.icon size={10} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]">
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-[#141414]/5 rounded-sm animate-pulse" />
            ))
          ) : (
            filteredProducts.map((product, index) => {
              // Create a bento effect by making some items larger
              const isLarge = index === 1 || index === 6;
              const isWide = index === 4;
              
              return (
                <div 
                  key={product.id} 
                  className={`
                    ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}
                    ${isWide ? 'md:col-span-2' : ''}
                  `}
                >
                  <ProductCard product={product} variant={isLarge ? 'large' : isWide ? 'wide' : 'base'} />
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, variant = 'base' }: { product: Product, variant?: 'base' | 'large' | 'wide' }) {
  const { addToCart } = useCart();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="bg-white group relative overflow-hidden flex flex-col h-full border border-[#141414]/5 rounded-sm hover:border-[#141414] transition-colors"
    >
      <Link to={`/product/${product.id}`} className="flex-1 p-6 flex flex-col">
        <div className={`relative flex items-center justify-center ${variant === 'large' ? 'flex-1' : 'h-40'}`}>
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-[#141414] text-white p-2 rounded-full">
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col gap-1">
          <div className="flex justify-between items-start gap-4">
            <h3 className={`font-bold uppercase tracking-tighter leading-tight ${variant === 'large' ? 'text-2xl' : 'text-sm'}`}>
              {product.name}
            </h3>
            <span className="font-mono text-xs whitespace-nowrap">${product.price.toFixed(2)}</span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest opacity-40">CAT_{product.category}</span>
          
          {variant === 'large' && (
            <p className="mt-4 text-xs font-mono opacity-50 uppercase line-clamp-3">
              {product.description}
            </p>
          )}
        </div>
      </Link>
      
      <div className="p-4 border-t border-[#141414]/5 bg-[#F5F5F5]">
        <button 
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="w-full flex items-center justify-center gap-2 font-mono text-[9px] uppercase font-bold tracking-[0.2em] py-2 hover:bg-[#141414] hover:text-white transition-colors"
        >
          <ShoppingCart size={12} /> Add_to_Buffer
        </button>
      </div>
      
      {/* Decorative Corner */}
      <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-[#141414]/10" />
        <div className="absolute top-0 left-0 w-[1px] h-full bg-[#141414]/10" />
      </div>
    </motion.div>
  );
}



