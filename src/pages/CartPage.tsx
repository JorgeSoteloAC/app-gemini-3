import { useCart } from '../hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CartPage() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="p-8 bg-[#141414]/5 rounded-full">
          <ShoppingBag size={48} className="opacity-20" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold uppercase tracking-tight">System Empty</h2>
          <p className="text-xs font-mono opacity-50 uppercase tracking-widest">No active modules found in buffer</p>
        </div>
        <Link to="/">
          <button className="bg-[#141414] text-[#E4E3E0] px-8 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 transition-transform">
            Initialize Catalog
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="border-b border-[#141414]/10 pb-4">
        <h1 className="text-4xl font-bold tracking-tighter uppercase">System_Cart</h1>
        <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Active queue for processing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-6 p-6 bg-white border border-[#141414]/5 rounded-sm group relative"
              >
                <div className="w-24 h-24 bg-[#141414]/5 rounded-sm flex items-center justify-center p-2">
                  <img 
                    src={item.product?.imageUrl} 
                    alt={item.product?.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold uppercase text-sm tracking-tight">{item.product?.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#141414]/30 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-4 bg-[#141414]/5 px-3 py-1 rounded-sm">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="opacity-50 hover:opacity-100"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-mono text-xs w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="opacity-50 hover:opacity-100"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-mono text-sm font-bold">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary Side */}
        <div className="space-y-6">
          <div className="bg-[#141414] text-[#E4E3E0] p-8 rounded-sm space-y-8 sticky top-24">
            <h2 className="font-mono text-[10px] uppercase font-bold tracking-[0.3em] opacity-50 border-b border-white/10 pb-4">
              PROCEED_TO_CHECKOUT
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between font-mono text-[10px] uppercase opacity-60">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-mono text-[10px] uppercase opacity-60">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-mono text-[10px] uppercase opacity-60">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-4">
                <span className="uppercase tracking-tighter">Total</span>
                <span className="font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full bg-[#E4E3E0] text-[#141414] py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 group hover:bg-white transition-colors">
              Initialize Order <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-[8px] font-mono opacity-30 text-center uppercase tracking-widest leading-relaxed">
              By initializing, you agree to our <br /> protocols and privacy standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
