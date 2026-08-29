// Public Landing Page Component (Beranda Utama with Comprehensive General Orphanage Information & Dynamic Priority Programs)
const LandingPage = ({
  onNavigateToDonation,
  onNavigateToLogin,
  onNavigateToProfile,
  priorityPrograms = window.INITIAL_SIMK_DATA?.priorityPrograms || []
}) => {
  const profile = window.INITIAL_SIMK_DATA?.orphanageProfile || {};

  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  // Filter active priority programs
  const activePrograms = priorityPrograms.filter(p => p.isActive !== false);

  const getIconElement = (iconName) => {
    switch (iconName) {
      case 'utensils':
        return <i data-lucide="utensils" className="w-6 h-6"></i>;
      case 'graduation-cap':
        return <i data-lucide="graduation-cap" className="w-6 h-6"></i>;
      case 'home':
        return <i data-lucide="home" className="w-6 h-6"></i>;
      case 'heart-pulse':
      case 'heart':
        return <i data-lucide="heart" className="w-6 h-6"></i>;
      case 'book-open':
        return <i data-lucide="book-open" className="w-6 h-6"></i>;
      case 'laptop':
        return <i data-lucide="laptop" className="w-6 h-6"></i>;
      default:
        return <i data-lucide="sparkles" className="w-6 h-6"></i>;
    }
  };

  const getBadgeClass = (color) => {
    switch (color) {
      case 'amber':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'emerald':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'teal':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'rose':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-16 pb-16 animate-fade-in">
      
      {/* 1. HERO SECTION */}
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
                onClick={onNavigateToProfile}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 text-sm flex items-center space-x-2 transition-all"
              >
                <i data-lucide="building-2" className="w-5 h-5 text-emerald-300"></i>
                <span>Profil & Struktur Organisasi</span>
              </button>

              <button
                onClick={onNavigateToLogin}
                className="px-5 py-3.5 text-xs text-slate-300 hover:text-white font-semibold flex items-center space-x-1.5 transition-all"
              >
                <i data-lucide="log-in" className="w-4 h-4"></i>
                <span>Portal Pengurus</span>
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
                  <div className="text-sm font-bold text-white">Donasi Bebas Tanpa Login</div>
                  <div className="text-xs text-slate-300">Scan QRIS Dinamis & Transfer Bank dengan Kuitansi Digital Instan</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. STATS & IMPACT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 space-y-1">
            <div className="text-3xl font-black text-emerald-600">100%</div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Transparansi Donasi</div>
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
            <div className="text-xs text-slate-500">Terbit Otomatis & Sah</div>
          </div>
        </div>
      </section>

      {/* 3. SEKSI SEJARAH, VISI & MISI PANTI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <i data-lucide="book-marked" className="w-3.5 h-3.5"></i>
              <span>Sejarah & Latar Belakang</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Lebih Dari Satu Dekade Mengabdi Untuk Kemandirian Anak Yatim
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {profile.history}
            </p>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <span className="font-extrabold text-emerald-900 block uppercase tracking-wider text-[11px]">Visi Lembaga:</span>
              <p className="italic">"{profile.vision}"</p>
            </div>
            <div>
              <button
                onClick={onNavigateToProfile}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-2"
              >
                <span>Lihat Struktur Kepengurusan Lengkap →</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <i data-lucide="target" className="w-4 h-4 text-emerald-600"></i>
              <span>Pilar Misi Pelayanan</span>
            </h3>
            <div className="space-y-2.5 text-xs">
              {profile.missions?.slice(0, 4).map((m, i) => (
                <div key={i} className="flex items-start space-x-2 text-slate-700">
                  <i data-lucide="check-circle" className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"></i>
                  <span className="leading-relaxed">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC PROGRAM DONASI HIGHLIGHT (INTEGRATED WITH PENGURUS HARIAN CRUD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Program Prioritas Panti
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Program Kebutuhan Operasional & Pembinaan Anak
          </h2>
          <p className="text-xs text-slate-500">
            Bantuan Anda disalurkan secara langsung dan akuntabel sesuai dengan program prioritas pilihan Anda.
          </p>
        </div>

        {/* Dynamic Cards Grid Rendered from priorityPrograms Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activePrograms.length === 0 ? (
            <div className="col-span-3 text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400">
              <p className="text-sm font-bold">Belum ada program prioritas aktif yang ditampilkan.</p>
            </div>
          ) : (
            activePrograms.map((prog) => {
              const percent = prog.targetAmount > 0 
                ? Math.min(100, Math.round(((prog.collectedAmount || 0) / prog.targetAmount) * 100))
                : 0;

              return (
                <div 
                  key={prog.id} 
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                        prog.badgeColor === 'amber' ? 'bg-amber-100 text-amber-700' :
                        prog.badgeColor === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                        prog.badgeColor === 'indigo' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-teal-100 text-teal-700'
                      }`}>
                        {getIconElement(prog.icon)}
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${getBadgeClass(prog.badgeColor)}`}>
                        {prog.category}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">{prog.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {prog.description}
                    </p>

                    {/* Progress Bar & Funding Status */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-600">Terkumpul: <b className="text-emerald-700">Rp {(prog.collectedAmount || 0).toLocaleString('id-ID')}</b></span>
                        <span className="text-slate-800">{percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] text-slate-400 text-right font-mono">
                        Target: Rp {(prog.targetAmount || 0).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateToDonation(prog.category)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-emerald-700 hover:shadow-lg text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
                  >
                    <span>Donasi {prog.category} →</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* [COMMENTED: Kartu Statis Lama Dikomentari Sesuai Permintaan Mitra Agar Digantikan Render Dinamis]
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 flex flex-col justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Pemenuhan Konsumsi & Gizi Harian</h3>
            <button onClick={() => onNavigateToDonation('Konsumsi')}>Donasi Konsumsi →</button>
          </div>
          ...
        </div>
        */}
      </section>

      {/* 5. SEKSI FASILITAS PANTI ASUHAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-teal-800 uppercase tracking-wider bg-teal-100 px-3 py-1 rounded-full border border-teal-300">
            Fasilitas Asrama
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sarana & Prasarana Penunjang Tumbuh Kembang Anak
          </h2>
          <p className="text-xs text-slate-500">
            Fasilitas layak, aman, dan higienis untuk mendukung aktivitas ibadah, belajar, dan istirahat anak asuh.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.facilities?.map((f, i) => (
            <div key={i} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-emerald-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                {getIconElement(f.icon)}
              </div>
              <h3 className="text-sm font-black text-slate-900">{f.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SEKSI PRESTASI ANAK ASUH & LEGALITAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Prestasi */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <i data-lucide="trophy" className="w-5 h-5 text-amber-500"></i>
            <h3 className="text-base font-extrabold text-slate-900">Prestasi Anak Asuh Panti</h3>
          </div>
          <div className="space-y-3">
            {profile.achievements?.map((ach, i) => (
              <div key={i} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3">
                <span className="px-2 py-1 bg-amber-100 text-amber-900 rounded-lg text-[10px] font-black font-mono">
                  {ach.year}
                </span>
                <div>
                  <div className="text-xs font-black text-slate-900">{ach.title}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{ach.by}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legalitas Ringkas */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <i data-lucide="shield-check" className="w-5 h-5 text-emerald-600"></i>
            <h3 className="text-base font-extrabold text-slate-900">Legalitas & Akreditasi Lembaga</h3>
          </div>
          <div className="space-y-2.5">
            {profile.legalities?.slice(0, 4).map((leg, i) => (
              <div key={i} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{leg.type}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{leg.number}</div>
                </div>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {leg.date}
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 7. SEKSI LOKASI & KONTAK PANTI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
                Kunjungan & Informasi
              </span>
              <h3 className="text-2xl font-black">Lokasi & Kontak Panti Asuhan</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Panti Asuhan Kasih Bunda berlokasi strategis di Jakarta Selatan dan selalu terbuka bagi silaturahmi para dermawan, instansi, maupun relawan.
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start space-x-3">
                  <i data-lucide="map-pin" className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5"></i>
                  <span className="text-slate-200">{profile.contactInfo?.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i data-lucide="phone" className="w-4 h-4 text-emerald-400 flex-shrink-0"></i>
                  <span className="text-slate-200">WhatsApp: {profile.contactInfo?.whatsapp}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i data-lucide="mail" className="w-4 h-4 text-emerald-400 flex-shrink-0"></i>
                  <span className="text-slate-200">Email: {profile.contactInfo?.email}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigateToDonation('Konsumsi')}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all"
                >
                  Salurkan Donasi Online
                </button>
                <a
                  href={`https://wa.me/6281234567890?text=Halo%20Pengurus%20Panti%20Asuhan%20Kasih%20Bunda`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 transition-all flex items-center space-x-1.5"
                >
                  <i data-lucide="message-circle" className="w-4 h-4 text-emerald-400"></i>
                  <span>Hubungi via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Google Maps Simulation Widget */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-3 text-center">
              <div className="h-40 bg-slate-800 rounded-xl overflow-hidden relative flex items-center justify-center border border-white/10">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="relative z-10 text-center space-y-1 p-3">
                  <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <i data-lucide="map-pin" className="w-4 h-4"></i>
                  </div>
                  <div className="text-xs font-black text-white">{profile.name}</div>
                  <div className="text-[10px] text-slate-300">Jakarta Selatan</div>
                </div>
              </div>
              <div className="text-[11px] text-emerald-300 font-bold">
                ⏰ Jam Kunjungan: 08.00 - 17.00 WIB
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FOOTER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl text-center space-y-4">
          <h2 className="text-2xl font-extrabold">Siap Berkontribusi Bersama Kami?</h2>
          <p className="text-xs text-emerald-100 max-w-xl mx-auto">
            Proses donasi mudah, cepat, dan transparan. Tanpa perlu login, pilih metode Scan QRIS Dinamis atau Transfer Bank, dan dapatkan Kuitansi Digital Resmi seketika.
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
