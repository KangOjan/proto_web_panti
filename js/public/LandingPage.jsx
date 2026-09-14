// Public Landing Page Component (Beranda Utama - Menampilkan Program Prioritas Panti Langsung di Area Atas Hero)
const LandingPage = ({
  onNavigateToDonation,
  onNavigateToLogin,
  onNavigateToProfile,
  priorityPrograms = window.INITIAL_SIMK_DATA?.priorityPrograms || []
}) => {
  const profile = window.INITIAL_SIMK_DATA?.orphanageProfile || {};
  // Filter active priority programs
  const activePrograms = priorityPrograms.filter(
    (program) => program.status === 'active'
  );

  const getCategoryPresentation = (categoryName = '') => {
    const category = categoryName.toLowerCase();

    if (category.includes('konsumsi')) {
      return {
        icon: 'utensils',
        badge:
          'bg-amber-100 text-amber-800 border-amber-300',
        iconClass:
          'bg-amber-100 text-amber-700',
      };
    }

    if (
      category.includes('pendidikan') ||
      category.includes('spp') ||
      category.includes('sekolah') ||
      category.includes('perlengkapan')
    ) {
      return {
        icon: 'graduation-cap',
        badge:
          'bg-emerald-100 text-emerald-800 border-emerald-300',
        iconClass:
          'bg-emerald-100 text-emerald-700',
      };
    }

    if (
      category.includes('operasional') ||
      category.includes('asrama')
    ) {
      return {
        icon: 'home',
        badge:
          'bg-teal-100 text-teal-800 border-teal-300',
        iconClass:
          'bg-teal-100 text-teal-700',
      };
    }

    if (category.includes('kesehatan')) {
      return {
        icon: 'heart',
        badge:
          'bg-rose-100 text-rose-800 border-rose-300',
        iconClass:
          'bg-rose-100 text-rose-700',
      };
    }

    return {
      icon: 'heart-handshake',
      badge:
        'bg-indigo-100 text-indigo-800 border-indigo-300',
      iconClass:
        'bg-indigo-100 text-indigo-700',
    };
  };

  const getIconElement = (iconName) => {
    switch (iconName) {
      case 'utensils':
        return <LucideIcon name="utensils" className="w-6 h-6" />;
      case 'graduation-cap':
        return <LucideIcon name="graduation-cap" className="w-6 h-6" />;
      case 'home':
        return <LucideIcon name="home" className="w-6 h-6" />;
      case 'heart-pulse':
      case 'heart':
        return <LucideIcon name="heart" className="w-6 h-6" />;
      case 'book-open':
        return <LucideIcon name="book-open" className="w-6 h-6" />;
      case 'laptop':
        return <LucideIcon name="laptop" className="w-6 h-6" />;
      case 'heart-handshake':
        return <LucideIcon name="heart-handshake" className="w-6 h-6" />
      default:
        return <LucideIcon name="sparkles" className="w-6 h-6" />;
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
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (BACKGROUND HIJAU DI BAWAH MENU BERANDA):                */}
      {/*    LANGSUNG MENYUGUHKAN PROGRAM PRIORITAS PANTI & KEBUTUHAN OPERASIONAL   */}
      {/* ========================================================================= */}
      <section className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-3xl shadow-xl space-y-10">
        
        {/* Background Decorative Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* 1.1 Header Banner Utama: Program Prioritas Panti */}
        <div className="max-w-7xl mx-auto space-y-4 relative z-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold shadow-inner">
              <LucideIcon name="layers" className="w-4 h-4 text-emerald-400" />
              <span>Program Prioritas Panti Asuhan Kasih Bunda</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Program Kebutuhan Operasional & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Pembinaan 45 Anak Asuh</span>
            </h1>

            <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-medium">
              Bantuan dan donasi Anda langsung dialokasikan untuk pemenuhan gizi makan harian, beasiswa sekolah, serta operasional fasilitas asrama dengan laporan keuangan nirlaba transparan berbasis PSAK 45.
            </p>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 flex-shrink-0">
            <button
              onClick={() => onNavigateToDonation('Konsumsi')}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/20 text-sm flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <LucideIcon name="heart" className="w-5 h-5 fill-slate-950" />
              <span>Donasi Cepat (Bebas Login)</span>
            </button>

            <button
              onClick={onNavigateToProfile}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 text-xs sm:text-sm flex items-center space-x-2 transition-all"
            >
              <LucideIcon name="building-2" className="w-4 h-4 text-emerald-300" />
              <span>Profil & Struktur Panti</span>
            </button>
          </div>
        </div>

        {/* 1.2 KARTU PROGRAM PRIORITAS PANTI (LANGSUNG TAMPIL DI AREA ATAS) */}
        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-emerald-300">
              <LucideIcon name="heart-handshake" className="w-4 h-4 text-emerald-400" />
              <span>Pilihan Program Bantuan Kebutuhan Anak</span>
            </div>
            <span className="text-[11px] text-slate-300 font-medium">Klik tombol donasi pada program yang ingin Anda bantu</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activePrograms.length === 0 ? (
              <div className="col-span-3 text-center py-10 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 text-slate-300">
                <p className="text-sm font-bold">Belum ada program prioritas aktif yang ditampilkan.</p>
              </div>
            ) : (
              activePrograms.map((prog) => {
                const presentation =
                  getCategoryPresentation(prog.category);

                const percent =
                  prog.targetAmount > 0
                    ? Math.min(
                        100,
                        Math.round(
                          ((prog.collectedAmount || 0) /
                            prog.targetAmount) *
                            100
                        )
                      )
                    : 0;

                return (
                  <div 
                    key={prog.id} 
                    className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4 flex flex-col justify-between hover:scale-[1.01] transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${presentation.iconClass}`}
                        >
                          {getIconElement(presentation.icon)}
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${presentation.badge}`}
                        >
                          {prog.category}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 leading-snug">{prog.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {prog.description}
                      </p>

                      {/* Progress Bar & Funding Status */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-600">Terkumpul: <b className="text-emerald-700">Rp {(prog.collectedAmount || 0).toLocaleString('id-ID')}</b></span>
                          <span className="text-slate-800 font-extrabold">{percent}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
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
                      className="w-full py-3 bg-slate-900 hover:bg-emerald-700 hover:shadow-lg text-white rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-1"
                    >
                      <span>Donasi {prog.category} Sekarang →</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 1.3 INFOGRAFIS JUMLAH & DEMOGRAFI ANAK ASUH */}
        <div className="max-w-7xl mx-auto space-y-4 relative z-10 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-emerald-300">
            <LucideIcon name="bar-chart-3" className="w-4 h-4 text-emerald-400" />
            <span>Infografis Anak Asuh & Kebutuhan Harian</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Total Anak Asuh</span>
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                  <LucideIcon name="users" className="w-5 h-5" />
                </span>
              </div>
              <div className="text-3xl font-black text-white">45 Anak</div>
              <div className="text-[11px] text-emerald-200 font-medium">👦 24 Putra • 👧 21 Putri Asrama</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Jenjang Sekolah</span>
                <span className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
                  <LucideIcon name="graduation-cap" className="w-5 h-5" />
                </span>
              </div>
              <div className="text-3xl font-black text-white">100% Sekolah</div>
              <div className="text-[11px] text-teal-200 font-medium">SD (15) • SMP (18) • SMA (12)</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Pemenuhan Konsumsi</span>
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                  <LucideIcon name="utensils" className="w-5 h-5" />
                </span>
              </div>
              <div className="text-3xl font-black text-white">135 Porsi/Hari</div>
              <div className="text-[11px] text-amber-200 font-medium">Menu Sehat 3x Sehari + Susu & Buah</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Akuntabilitas Donasi</span>
                <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                  <LucideIcon name="file-check" className="w-5 h-5" />
                </span>
              </div>
              <div className="text-3xl font-black text-white">PSAK 45</div>
              <div className="text-[11px] text-indigo-200 font-medium">Kuitansi Digital Instan & Transparan</div>
            </div>
          </div>
        </div>

        {/* 1.4 HASIL PENGGUNAAN DONASI (DOKUMENTASI FOTO KEGIATAN NYATA) */}
        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-emerald-300">
              <LucideIcon name="image" className="w-4 h-4 text-emerald-400" />
              <span>Hasil Penyaluran Donasi & Aktivitas Nyata Anak Asuh</span>
            </div>
            <span className="text-[11px] text-slate-300 font-medium">Dokumentasi Terverifikasi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-400/50 transition-all flex flex-col justify-between">
              <div className="h-32 bg-slate-800/80 relative flex items-center justify-center p-4 text-center overflow-hidden">
                <div className="relative z-10 space-y-1">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto text-xl">
                    🍲
                  </div>
                  <div className="text-xs font-black text-white">Gizi Harian & Makan Sehat</div>
                </div>
              </div>
              <div className="p-3 space-y-1 bg-slate-900/60">
                <div className="text-[11px] font-bold text-emerald-300">Alokasi Dana Konsumsi</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Penyediaan beras, lauk segar, telur, susu pertumbuhan 45 anak asuh setiap hari.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-400/50 transition-all flex flex-col justify-between">
              <div className="h-32 bg-slate-800/80 relative flex items-center justify-center p-4 text-center overflow-hidden">
                <div className="relative z-10 space-y-1">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center mx-auto text-xl">
                    💻
                  </div>
                  <div className="text-xs font-black text-white">Lab Komputer & Coding</div>
                </div>
              </div>
              <div className="p-3 space-y-1 bg-slate-900/60">
                <div className="text-[11px] font-bold text-teal-300">Alokasi Dana Pendidikan</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Pelatihan ketrampilan digital, bimbingan tugas sekolah, dan 15 unit PC internet.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-400/50 transition-all flex flex-col justify-between">
              <div className="h-32 bg-slate-800/80 relative flex items-center justify-center p-4 text-center overflow-hidden">
                <div className="relative z-10 space-y-1">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mx-auto text-xl">
                    📖
                  </div>
                  <div className="text-xs font-black text-white">Halaqah Tahfidz Qur'an</div>
                </div>
              </div>
              <div className="p-3 space-y-1 bg-slate-900/60">
                <div className="text-[11px] font-bold text-indigo-300">Pembinaan Akhlak & Adab</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Bimbingan tahsin & setoran hafalan Al-Qur'an harian bersama ustadz asrama.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-400/50 transition-all flex flex-col justify-between">
              <div className="h-32 bg-slate-800/80 relative flex items-center justify-center p-4 text-center overflow-hidden">
                <div className="relative z-10 space-y-1">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center mx-auto text-xl">
                    🩺
                  </div>
                  <div className="text-xs font-black text-white">Cek Kesehatan & Sanitasi</div>
                </div>
              </div>
              <div className="p-3 space-y-1 bg-slate-900/60">
                <div className="text-[11px] font-bold text-rose-300">Alokasi Dana Kesehatan</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Pemeriksaan dokter relawan, suplemen, serta sanitasi kamar tidur asrama.
                </p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. SEKSI SEJARAH, LATAR BELAKANG, VISI & MISI PANTI                      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <LucideIcon name="book-marked" className="w-3.5 h-3.5" />
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
              <LucideIcon name="target" className="w-4 h-4 text-emerald-600" />
              <span>Pilar Misi Pelayanan Yayasan</span>
            </h3>
            <div className="space-y-2.5 text-xs">
              {profile.missions?.slice(0, 5).map((m, i) => (
                <div key={i} className="flex items-start space-x-2 text-slate-700">
                  <LucideIcon name="check-circle" className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SEKSI FASILITAS ASRAMA & SARANA PENUNJANG                             */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 4. SEKSI PRESTASI ANAK ASUH PANTI & LEGALITAS / AKREDITASI LEMBAGA        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Prestasi */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <LucideIcon name="trophy" className="w-5 h-5 text-amber-500" />
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
            <LucideIcon name="shield-check" className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-900">Legalitas & Akreditasi Lembaga</h3>
          </div>
          <div className="space-y-2.5">
            {profile.legalities?.slice(0, 5).map((leg, i) => (
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

      {/* ========================================================================= */}
      {/* 5. SEKSI LOKASI & KONTAK PANTI                                           */}
      {/* ========================================================================= */}
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
                  <LucideIcon name="map-pin" className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-200">{profile.contactInfo?.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <LucideIcon name="phone" className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-200">WhatsApp: {profile.contactInfo?.whatsapp}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <LucideIcon name="mail" className="w-4 h-4 text-emerald-400 flex-shrink-0" />
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
                  <LucideIcon name="message-circle" className="w-4 h-4 text-emerald-400" />
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
                    <LucideIcon name="map-pin" className="w-4 h-4" />
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

      {/* ========================================================================= */}
      {/* 6. FOOTER CTA DONASI                                                      */}
      {/* ========================================================================= */}
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
