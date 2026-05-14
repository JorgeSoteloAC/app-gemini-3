import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

export function Navbar() {
  const { user, signIn, logOut } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="border-b border-[#141414] bg-[#E4E3E0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-[#141414] text-[#E4E3E0] p-1.5 rounded-sm">
                <Search size={16} />
              </div>
              <span className="font-mono text-sm font-bold tracking-tighter uppercase">ElectroStream</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-[10px] font-mono uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Catalog</Link>
              <Link to="/" className="text-[10px] font-mono uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Categories</Link>
              <Link to="/" className="text-[10px] font-mono uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Support</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden sm:block">
              <input 
                type="text" 
                placeholder="SEARCH_CATALOG" 
                className="bg-transparent border border-[#141414]/20 rounded-sm px-3 py-1 text-[10px] font-mono focus:outline-none focus:border-[#141414] transition-colors w-40 sm:w-60"
              />
              <Search size={12} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-30" />
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono hidden lg:block opacity-60">{user.displayName}</span>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logOut}
                    className="p-2 hover:bg-[#141414]/5 rounded-sm transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </motion.button>
                </div>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={signIn}
                  className="p-2 hover:bg-[#141414]/5 rounded-sm transition-colors"
                  title="Sign In"
                >
                  <User size={18} />
                </motion.button>
              )}
              
              <Link to="/cart">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-[#141414]/5 rounded-sm transition-colors relative"
                >
                  <ShoppingCart size={18} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#141414] text-[#E4E3E0] text-[8px] font-mono px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[16px]">
                      {cart.reduce((s, i) => s + i.quantity, 0)}
                    </span>
                  )}
                </motion.button>
              </Link>
              
              <button className="md:hidden p-2 hover:bg-[#141414]/5 rounded-sm">
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

