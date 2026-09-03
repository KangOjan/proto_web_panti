import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  Building2,
  Home,
  Heart,
  Newspaper,
  HelpCircle,
  Menu,
  X,
  UserCheck,
  ShieldCheck,
  Globe
} from 'lucide-react';

export default function Navbar({
  currentUser,
  currentRoute,
  onSwitchUserRole,
  evaluatorMode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle Mode Evaluator via .env (VITE_EVALUATOR_MODE=true|false)
  const isEvaluatorEnabled = evaluatorMode !== undefined
    ? Boolean(evaluatorMode)
    : (import.meta.env.VITE_EVALUATOR_MODE !== 'false');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
      {/* Top Evaluator Bar (Controlled via .env VITE_EVALUATOR_MODE) */}
      {isEvaluatorEnabled && (
        <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 simulasi-banner">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
              Mode Evaluator
            </span>
            <span className="hidden sm:inline text-slate-300">
              Simulasi Role Pengguna
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => onSwitchUserRole(null)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                !currentUser
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Publik (Beranda)</span>
            </button>

            <button
              onClick={() => onSwitchUserRole('Pengurus Harian')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                currentUser?.role === 'Pengurus Harian'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Pengurus Harian</span>
            </button>

            <button
              onClick={() => onSwitchUserRole('Pemimpin Lembaga')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                currentUser?.role === 'Pemimpin Lembaga'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pemimpin Lembaga</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar Header - Symmetrical Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name (Left Aligned) */}
          <Link href="/" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">Panti Kasih Bunda</span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Portal Transparansi & Donasi Panti Asuhan
              </p>
            </div>
          </Link>

          {/* Public Nav Links Desktop (Right Aligned & Symmetrical with Logo) */}
          <nav className="hidden lg:flex items-center space-x-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                currentRoute === 'home' ? 'bg-slate-100 text-emerald-700 font-extrabold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Beranda</span>
            </Link>

            <Link
              href="/profil"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                currentRoute === 'profil' ? 'bg-slate-100 text-emerald-700 font-extrabold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Profil</span>
            </Link>

            <Link
              href="/berita"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                currentRoute === 'berita' ? 'bg-slate-100 text-emerald-700 font-extrabold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Berita</span>
            </Link>

            <Link
              href="/faq"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                currentRoute === 'faq' ? 'bg-slate-100 text-emerald-700 font-extrabold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>FAQ</span>
            </Link>

            <Link
              href="/donasi"
              className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all flex items-center space-x-1.5 border shadow-sm ${
                currentRoute === 'donasi'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-100" />
              <span>Donasi Online</span>
            </Link>
          </nav>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 animate-fade-in">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-xs font-bold text-slate-700">Beranda</Link>
          <Link href="/profil" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-xs font-bold text-slate-700">Profil</Link>
          <Link href="/berita" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-xs font-bold text-slate-700">Berita</Link>
          <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-xs font-bold text-slate-700">FAQ</Link>
          <Link href="/donasi" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-xs font-bold text-emerald-700 font-extrabold">Donasi Online</Link>
        </div>
      )}
    </header>
  );
}
