// Hero Section Component
const HeroSection = ({ onOpenDonationModal, onScrollToVisit }) => {
  return (
    <section id="beranda" className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-teal-50/30 to-white py-16 md:py-24">
      
      {/* Decorative background blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-emerald-200/30 via-teal-100/20 to-orange-100/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Lembaga Kesejahteraan Sosial Anak Terakreditasi A</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Menyambung Kebaikan, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                Membangun Masa Depan Anak
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              PantiAsih Kasih Bunda mengasuh 48 anak yatim, piatu, dan duafa dengan penuh perhatian, pendidikan berkualitas, dan jaminan gizi yang layak. Mari hadir memberikan senyuman dan asa bagi mereka.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                onClick={onOpenDonationModal}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-base shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:from-orange-600 hover:to-amber-600 transform hover:-translate-y-1 transition-all flex items-center justify-center space-x-3"
              >
                <LucideIcon name="heart" className="w-5 h-5 fill-white" />
                <span>Donasi Sekarang</span>
              </button>

              <button
                onClick={onScrollToVisit}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-emerald-800 border-2 border-emerald-600/30 font-bold text-base hover:bg-emerald-50 hover:border-emerald-600 transform hover:-translate-y-1 transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <LucideIcon name="calendar-plus" className="w-5 h-5 text-emerald-600" />
                <span>Jadwalkan Kunjungan</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="text-xl font-bold text-slate-800">100% Transparan</div>
                <div className="text-xs text-slate-500">Laporan Keuangan Terbuka</div>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">Resmi & Legal</div>
                <div className="text-xs text-slate-500">Izin Dinsos No. 460/2024</div>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">Kunjungan Terbuka</div>
                <div className="text-xs text-slate-500">Ramah Komunitas</div>
              </div>
            </div>

          </div>

          {/* Right Image Banner Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Banner Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="assets/images/hero.png"
                  alt="Anak-anak PantiAsih Kasih Bunda"
                  className="w-full h-96 object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl glass-card text-slate-900 border border-white/40">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <LucideIcon name="smile" className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Senyum Kebersamaan</div>
                      <div className="text-sm font-bold text-slate-800">48 Anak Asuh Ceria Bersekolah</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Highlight Card */}
              <div className="absolute -top-6 -left-6 hidden sm:flex items-center space-x-3 p-4 rounded-2xl bg-white shadow-xl border border-slate-100 text-slate-800 animate-pulse-glow">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <LucideIcon name="award" className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">128+ Alumni Mandiri</div>
                  <div className="text-xs text-slate-500">Bekerja & Kuliah</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

window.HeroSection = HeroSection;
