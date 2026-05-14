import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowRight, Cpu, Laptop, Smartphone, Speaker } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

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
        
        if (snapshot.empty && user) {
          console.log("Seeding products...");
          for (const p of MOCK_PRODUCTS) {
            const { id, ...rest } = p;
            await addDoc(collection(db, path), {
              ...rest,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
          // Fetch again after seeding
          const retrySnapshot = await getDocs(q);
          const data = retrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
          setProducts(data);
        } else {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
          setProducts(data);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
        console.error("Error with products:", error);
        // Fallback to mock data on ANY error so the UI still works
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

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#141414] text-[#E4E3E0] p-8 md:p-16 rounded-sm">
        <div className="relative z-10 max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-50">Precision Electronics // v2.6</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.9] mt-2">
              Next Generation <br /> Performance
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-sm max-w-md font-mono"
          >
            Engineered for high-intensity workflows. Industrial grade hardware for the modern creative professional.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <button className="bg-[#E4E3E0] text-[#141414] px-6 py-3 font-mono text-xs font-bold uppercase flex items-center gap-2 hover:bg-white transition-colors group">
              Explore Catalog <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute right-[-10%] top-[-10%] w-[60%] h-[120%] opacity-10 pointer-events-none">
          <div className="w-full h-full border-[1px] border-white/20 rounded-full animate-pulse" />
          <div className="absolute inset-20 border-[1px] border-white/10 rounded-full" />
        </div>
      </section>

      {/* Category Bar */}
      <section className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-sm font-mono text-[10px] uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeCategory === cat.id 
                ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                : 'border-[#141414]/10 hover:border-[#141414]'
            }`}
          >
            <cat.icon size={12} />
            {cat.name}
          </button>
        ))}
      </section>

      {/* Product Grid */}
      <section>
        <div className="flex justify-between items-end mb-8 border-b border-[#141414]/10 pb-4">
          <div>
            <h2 className="font-mono text-xs uppercase opacity-50 tracking-widest">Active List</h2>
            <p className="text-xl font-bold tracking-tight uppercase">Hardware Catalog</p>
          </div>
          <div className="text-[10px] font-mono opacity-50">
            TOTAL_ITEMS: {filteredProducts.length}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#141414]/10 border border-[#141414]/10">
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-[#F5F5F5] h-[400px] animate-pulse" />
            ))
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#F5F5F5] group relative overflow-hidden flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="flex-1 p-6 space-y-4">
        <div className="aspect-square bg-white p-4 relative overflow-hidden rounded-sm border border-[#141414]/5">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#141414] text-[#E4E3E0] text-[8px] font-mono tracking-widest uppercase">
            {product.category}
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-bold text-sm tracking-tight group-hover:underline uppercase underline-offset-4 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex justify-between items-baseline">
            <span className="font-mono text-xs">${product.price.toFixed(2)}</span>
            <span className="font-mono text-[10px] opacity-40 uppercase">In Stock</span>
          </div>
        </div>
      </Link>
      
      <div className="p-4 pt-0">
        <button className="w-full bg-[#141414]/5 hover:bg-[#141414] hover:text-[#E4E3E0] border border-transparent hover:border-[#141414] py-2 font-mono text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
          <ShoppingCart size={12} /> Add to System
        </button>
      </div>
    </motion.div>
  );
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Neural Engine M4X',
    price: 1299.00,
    category: 'processors',
    imageUrl: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=800&auto=format&fit=crop&q=60',
    description: 'Ultra-low latency inference engine for real-time edge computing.'
  },
  {
    id: '2',
    name: 'Quantum X-Link Laptop',
    price: 2499.00,
    category: 'laptops',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60',
    description: 'Precision milled aluminum body with liquid flow cooling system.'
  },
  {
    id: '3',
    name: 'OmniFocus Pro Display',
    price: 899.00,
    category: 'audio',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60',
    description: '4K panel with 100% Adobe RGB coverage and 500 nits brightness.'
  },
  {
    id: '4',
    name: 'Vector One Mobile',
    price: 999.00,
    category: 'mobile',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60',
    description: 'Titanium chassis with custom-built OS for maximum privacy.'
  },
  {
    id: '5',
    name: 'Pulse Zero Audio',
    price: 349.00,
    category: 'audio',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
    description: 'Studio-grade monitor headphones with zero-latency wireless tech.'
  },
  {
    id: '6',
    name: 'Aero Mesh Router',
    price: 199.00,
    category: 'mobile',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60',
    description: 'Multi-node gigabit mesh system with hardware-level encryption.'
  },
];
