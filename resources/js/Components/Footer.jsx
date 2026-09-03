import React from 'react';
import { Link } from '@inertiajs/react';
import {
  Building2,
  Heart,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  MessageCircle
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs no-print mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Legal */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Panti Kasih Bunda</h3>
                <span className="text-[10px] text-emerald-400 font-bold">Lembaga Kesejahteraan Sosial (LKS)</span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Membina dan mengasuh 45 anak yatim piatu & dhuafa menjadi generasi mandiri, berakhlak mulia, dan berdaya saing.
            </p>

            <div className="text-[11px] text-slate-400 space-y-0.5 border-t border-slate-800 pt-2 font-mono">
              <div>Kemenkumham: AHU-0012847.AH.01.04</div>
              <div>Izin Dinsos: 503/412/LKS-DINSOS/2023</div>
            </div>
          </div>

          {/* Column 2: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Navigasi Utama</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Beranda Utama</Link></li>
              <li><Link href="/profil" className="hover:text-emerald-400 transition-colors">Profil & Struktur Pengurus</Link></li>
              <li><Link href="/berita" className="hover:text-emerald-400 transition-colors">Kabar & Artikel Kegiatan</Link></li>
              <li><Link href="/faq" className="hover:text-emerald-400 transition-colors">Pusat Bantuan & FAQ</Link></li>
              <li><Link href="/donasi" className="text-emerald-400 font-bold hover:underline">Salurkan Donasi Online</Link></li>
            </ul>
          </div>

          {/* Column 3: Rekening Resmi Yayasan */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Rekening Resmi Donasi</h4>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-2">
              <div className="text-xs font-bold text-slate-200">Bank Syariah Indonesia (BSI)</div>
              <div className="font-mono text-base font-black text-emerald-400">7123-4567-89</div>
              <div className="text-[10px] text-slate-400">a.n. Yayasan Kasih Bunda Indonesia</div>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              Bebas biaya admin antar bank syariah & QRIS
            </p>
          </div>

          {/* Column 4: Kontak & Kunjungan */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Sekretariat & Kunjungan</h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Jl. Merdeka Kasih Bunda No. 45, Kebayoran Baru, Jakarta Selatan</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>(021) 7829-1029</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp: 0812-3456-7890</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Panti Asuhan Kasih Bunda. Seluruh hak cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Sistem Transparansi & Akuntabilitas Donasi Publik</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
