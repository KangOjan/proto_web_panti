// Footer Component
const Footer = ({ onOpenDonationModal, setActiveRole }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <LucideIcon name="heart-handshake" className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white">PantiAsih Kasih Bunda</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Lembaga Kesejahteraan Sosial Anak (LKSA) yang berdedikasi mengasuh, mendidik, dan memberdayakan anak-anak yatim, piatu, dan duafa dengan transparansi penuh.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <LucideIcon name="facebook" className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <LucideIcon name="instagram" className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <LucideIcon name="youtube" className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Kontak & Alamat */}
          <div className="space-y-4">
            <h4 className="text-white text-base font-semibold border-b border-slate-800 pb-2">Kontak & Alamat</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start space-x-3">
                <LucideIcon name="map-pin" className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Jl. Kasih Bunda No. 45, Coblong, Kota Bandung, Jawa Barat 40135</span>
              </li>
              <li className="flex items-center space-x-3">
                <LucideIcon name="phone" className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>(022) 250-8899 / 0812-8877-6655</span>
              </li>
              <li className="flex items-center space-x-3">
                <LucideIcon name="mail" className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>info@pantiasih-kasihbunda.or.id</span>
              </li>
              <li className="flex items-center space-x-3">
                <LucideIcon name="clock" className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Buka Kunjungan: Setiap Hari 08:00 - 17:00 WIB</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Rekening Donasi Resmi */}
          <div className="space-y-4">
            <h4 className="text-white text-base font-semibold border-b border-slate-800 pb-2">Rekening Donasi Resmi</h4>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <div className="text-xs text-emerald-400 font-semibold">Bank BCA</div>
                <div className="font-mono text-base text-white tracking-wide">8830-1234-56</div>
                <div className="text-xs text-slate-400">a.n Yayasan Kasih Bunda PantiAsih</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <div className="text-xs text-emerald-400 font-semibold">Bank Mandiri</div>
                <div className="font-mono text-base text-white tracking-wide">1310-0099-8877</div>
                <div className="text-xs text-slate-400">a.n Yayasan Kasih Bunda PantiAsih</div>
              </div>
            </div>
          </div>

          {/* Col 4: Quick Action & Transparency */}
          <div className="space-y-4">
            <h4 className="text-white text-base font-semibold border-b border-slate-800 pb-2">Aksi Kebaikan</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Setiap donasi Anda disalurkan 100% transparan untuk kesehatan, pendidikan, dan masa depan anak asuh.
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={onOpenDonationModal}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-900/40"
              >
                Salurkan Donasi
              </button>
              <button
                onClick={() => setActiveRole('admin')}
                className="w-full py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <LucideIcon name="lock" className="w-3.5 h-3.5" />
                <span>Portal Pengurus Admin</span>
              </button>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} Yayasan PantiAsih Kasih Bunda. All rights reserved.
          </div>
          <div className="flex space-x-6 text-slate-400">
            <a href="#" className="hover:text-emerald-400">Kebijakan Privasi</a>
            <a href="#" className="hover:text-emerald-400">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-emerald-400">Laporan Publik</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

window.Footer = Footer;
