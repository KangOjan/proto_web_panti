// Public Landing Page Component (Halaman Beranda Utama with Priority Program Navigation)
const LandingPage = ({
  onNavigateToDonation,
  onNavigateToLogin
}) => {
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  return (
    <div className="space-y-12 pb-12 animate-fade-in">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-3xl shadow-xl">
        
        {/* Background Decorative Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold shadow-inner">
              <i data-lucide="shield-check" className="w-4 h-4 text-emerald-400"></i>
              <span>Sistem Informasi Keuangan Berbasis Akuntabilitas PSAK 45</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Mewujudkan Masa Depan Cerah Bagi <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">45 Anak Asuh</span> Panti
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-medium">
              Selamat datang di portal resmi Panti Asuhan Kasih Bunda. Kami berkomitmen menyajikan transparansi pengelolaan dana donasi, bantuan operasional, dan laporan keuangan nirlaba yang terverifikasi secara akuntabel.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigateToDonation('Konsumsi')}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-500/20 text-sm flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <i data-lucide="heart" className="w-5 h-5 fill-slate-950"></i>
                <span>Donasi Publik Sekarang</span>
              </button>

              <button
                onClick={onNavigateToLogin}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 text-sm flex items-center space-x-2 transition-all"
              >
                <i data-lucide="log-in" className="w-5 h-5"></i>
                <span>Masuk Ke Portal Pengurus</span>
              </button>
            </div>
          </div>

          {/* Hero Feature Cards Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                <i data-lucide="users" className="w-5 h-5"></i>
              </div>
              <div className="text-2xl font-black text-white">45 Anak</div>
              <div className="text-xs text-slate-300">Anak asuh jenjang SD, SMP, & SMA</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                <i data-lucide="award" className="w-5 h-5"></i>
              </div>
              <div className="text-2xl font-black text-white">PSAK 45</div>
              <div className="text-xs text-slate-300">Standar laporan keuangan nirlaba</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 space-y-2 sm:col-span-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                  <i data-lucide="qr-code" className="w-5 h-5"></i>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Donasi Tanpa Login</div>
                  <div className="text-xs text-slate-300">Scan QRIS Dinamis & Transfer Bank dengan Kuitansi Digital Instant</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STATS & IMPACT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 space-y-1">
            <div className="text-3xl font-black text-emerald-600">100%</div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Transparansi Dana</div>
            <div className="text-xs text-slate-500">Tercatat di Digital Audit Trail</div>
          </div>

          <div className="p-4 space-y-1 border-t sm:border-t-0 sm:border-l border-slate-100">
            <div className="text-3xl font-black text-teal-600">45 Anak</div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Penerima Manfaat</div>
            <div className="text-xs text-slate-500">Asrama, Makanan & Pendidikan</div>
          </div>

          <div className="p-4 space-y-1 border-t sm:border-t-0 sm:border-l border-slate-100">
            <div className="text-3xl font-black text-indigo-600">12 Sekolah</div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Mitra Pendidikan</div>
            <div className="text-xs text-slate-500">Beasiswa SPP & Seragam</div>
          </div>

          <div className="p-4 space-y-1 border-t sm:border-t-0 sm:border-l border-slate-100">
            <div className="text-3xl font-black text-amber-600">Real-Time</div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Kuitansi Digital</div>
            <div className="text-xs text-slate-500">Stempel Verifikasi & Signatures</div>
          </div>
        </div>
      </section>

      {/* PROGRAM DONASI HIGHLIGHT WITH DIRECT CATEGORY PASSING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Program Prioritas Panti
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Program Kebutuhan Operasional Anak</h2>
          <p className="text-xs text-slate-500">Bantuan Anda langsung disalurkan untuk pemenuhan gizi, sekolah, dan operasional asrama.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Program 1: Konsumsi */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <i data-lucide="utensils" className="w-6 h-6"></i>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Pemenuhan Konsumsi & Gizi Harian</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pengadaan beras, lauk pauk, susu, dan suplemen pertumbuhan untuk 45 anak asuh setiap hari.
              </p>
            </div>
            <button
              onClick={() => onNavigateToDonation('Konsumsi')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
            >
              <span>Donasi Konsumsi →</span>
            </button>
          </div>

          {/* Program 2: Pendidikan */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <i data-lucide="graduation-cap" className="w-6 h-6"></i>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Beasiswa SPP & Seragam Sekolah</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dukungan biaya SPP bulanan, buku pelajaran, dan perlengkapan sekolah anak-anak jenjang SD hingga SMA.
              </p>
            </div>
            <button
              onClick={() => onNavigateToDonation('SPP/Pendidikan')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
            >
              <span>Donasi Pendidikan →</span>
            </button>
          </div>

          {/* Program 3: Operasional */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <i data-lucide="home" className="w-6 h-6"></i>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Operasional & Fasilitas Asrama</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Biaya tagihan listrik PLN, air PDAM, perawatan kamar tidur, serta kebersihan gedung panti asuhan.
              </p>
            </div>
            <button
              onClick={() => onNavigateToDonation('Operasional')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
            >
              <span>Donasi Operasional →</span>
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl text-center space-y-4">
          <h2 className="text-2xl font-extrabold">Siap Berkontribusi Tanpa Ribet?</h2>
          <p className="text-xs text-emerald-100 max-w-xl mx-auto">
            Proses donasi hanya membutuhkan waktu kurang dari 1 menit. Tanpa perlu login, pilih metode Scan QRIS atau Transfer Bank, dan dapatkan Kuitansi Digital Resmi seketika.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigateToDonation('Konsumsi')}
              className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-sm shadow-lg transition-all"
            >
              Mulai Donasi Publik Sekarang
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

window.LandingPage = LandingPage;
