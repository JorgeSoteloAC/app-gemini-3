/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F5F5F5] font-sans text-[#141414]">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
        <footer className="border-t border-[#141414]/10 py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <h2 className="font-mono text-sm font-bold tracking-tighter uppercase mb-4">ElectroStream</h2>
              <p className="text-xs text-[#141414]/60 max-w-xs">
                Premium electronics for the modern professional. Precision engineered for high performance and reliability.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase opacity-50">Support</span>
                <a href="#" className="text-xs hover:underline">Help Center</a>
                <a href="#" className="text-xs hover:underline">Shipping</a>
                <a href="#" className="text-xs hover:underline">Returns</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase opacity-50">Company</span>
                <a href="#" className="text-xs hover:underline">About</a>
                <a href="#" className="text-xs hover:underline">Careers</a>
                <a href="#" className="text-xs hover:underline">Contact</a>
              </div>
            </div>
            <div className="text-[10px] font-mono opacity-50 uppercase">
              © 2026 ELECTROSTREAM CORP.
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

