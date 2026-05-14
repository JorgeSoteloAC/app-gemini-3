import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowLeft, Shield, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../hooks/useCart';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      const path = `products/${id}`;
      try {
        const docRef = doc(db, 'products', id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setProduct({ id: snapshot.id, ...snapshot.data() } as Product);
        } else {
          // Fallback to mock logic if not found in DB
          setProduct(MOCK_PRODUCTS.find(p => p.id === id) || null);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
        console.error("Error fetching product:", error);
        setProduct(MOCK_PRODUCTS.find(p => p.id === id) || null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-mono uppercase text-xs">Initializing System...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center font-mono uppercase text-xs">Device Not Found</div>;

  return (
    <div className="space-y-12">
      <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-mono uppercase opacity-50 hover:opacity-100 transition-opacity">
        <ArrowLeft size={12} /> Return to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-12 rounded-sm border border-[#141414]/5 aspect-square flex items-center justify-center overflow-hidden"
        >
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-contain hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <span className="font-mono text-[10px] uppercase tracking-widest bg-[#141414] text-[#E4E3E0] px-2 py-0.5">
              Ref: {product.id.slice(0, 8)}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase leading-tight">
              {product.name}
            </h1>
            <p className="text-2xl font-mono">${product.price.toFixed(2)}</p>
          </div>

          <div className="prose prose-sm text-[#141414]/70 max-w-none">
            <p className="font-mono text-xs leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="pt-6 border-t border-[#141414]/10 space-y-6">
            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-[#141414] text-[#E4E3E0] py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#141414]/90 transition-colors flex items-center justify-center gap-3"
            >
              <ShoppingCart size={16} /> Add to System
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={16} className="opacity-40" />
                <span className="text-[9px] font-mono uppercase opacity-60">Global Transit</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield size={16} className="opacity-40" />
                <span className="text-[9px] font-mono uppercase opacity-60">Secure Protocol</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw size={16} className="opacity-40" />
                <span className="text-[9px] font-mono uppercase opacity-60">30D Reversal</span>
              </div>
            </div>
          </div>

          {/* Technical Specs Overlay */}
          <div className="bg-[#141414]/5 p-6 rounded-sm space-y-4 border border-[#141414]/5">
            <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest opacity-40">System_Specs</h3>
            <div className="grid grid-cols-2 gap-y-3">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono uppercase opacity-40">Frequency</span>
                <span className="text-xs font-mono">4.2 GHz Turbo</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono uppercase opacity-40">Latency</span>
                <span className="text-xs font-mono">0.4ms</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono uppercase opacity-40">Material</span>
                <span className="text-xs font-mono">Liquid Ceramic</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono uppercase opacity-40">Core Count</span>
                <span className="text-xs font-mono">16_CORES</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Neural Engine M4X',
    price: 1299.00,
    category: 'processors',
    imageUrl: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=800&auto=format&fit=crop&q=60',
    description: 'The Neural Engine M4X is a high-performance heterogeneous computing platform designed for AI and machine learning workloads. Featuring a custom-developed systolic array architecture, it delivers unmatched TOPS-per-watt efficiency for real-time inference at the edge.'
  },
  {
    id: '2',
    name: 'Quantum X-Link Laptop',
    price: 2499.00,
    category: 'laptops',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60',
    description: 'The Quantum X-Link is built for users who demand extreme performance without compromise. Housed in a precision-milled aerospace-grade aluminum chassis, it features an advanced liquid-metal cooling system that allows the unlocked components to run at maximum thermal capacity.'
  },
  // ... more can be added if needed, but HomePage has them too
];
