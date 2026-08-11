// Transparency Report & Photo Gallery Component (Public)
const TransparencyReport = ({ financeData, galleryData }) => {
  const [activeGalleryTab, setActiveGalleryTab] = React.useState('semua');
  const [selectedPhoto, setSelectedPhoto] = React.useState(null);

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const filteredGallery = galleryData.filter(item => {
    if (activeGalleryTab === 'semua') return true;
    return item.category.toLowerCase() === activeGalleryTab.toLowerCase();
  });

  return (
    <div id="transparansi" className="space-y-16 py-16 bg-slate-50 border-t border-slate-200/80">
      
      {/* SECTION A: Laporan Transparansi Keuangan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <i data-lucide="shield-check" className="w-4 h-4 text-emerald-600"></i>
            <span>Prinsip Transparansi Akuntabel</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ringkasan Transparansi Keuangan
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Seluruh pemasukan donasi dan pengeluaran operasional panti asuhan diaudit dan dipublikasikan secara rutin setiap bulan.
          </p>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Donasi Masuk (Bulan Ini)</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <i data-lucide="arrow-down-left" className="w-5 h-5"></i>
              </div>
            </div>
            <div className="text-2xl font-extrabold text-emerald-700">
              {formatRupiah(financeData.monthlyIncome)}
            </div>
            <p className="text-xs text-slate-500">100% tersalurkan untuk anak asuh</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-orange-200 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Pengeluaran Operasional</span>
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                <i data-lucide="arrow-up-right" className="w-5 h-5"></i>
              </div>
            </div>
            <div className="text-2xl font-extrabold text-orange-600">
              {formatRupiah(financeData.monthlyExpense)}
            </div>
            <p className="text-xs text-slate-500">Pendidikan, Konsumsi, Kesehatan, Daya</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-teal-200 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Saldo Kas Cadangan</span>
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <i data-lucide="wallet" className="w-5 h-5"></i>
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-800">
              {formatRupiah(financeData.balance)}
            </div>
            <p className="text-xs text-slate-500">Cadangan operasional 2 bulan ke depan</p>
          </div>

        </div>

        {/* Recent Transactions List (Public Summary) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <i data-lucide="list" className="w-4 h-4 text-emerald-600"></i>
              <span>Catatan Transaksi Terakhir (Dipublikasi)</span>
            </h3>
            <span className="text-xs text-slate-500">Status Update Realtime</span>
          </div>

          <div className="divide-y divide-slate-100">
            {financeData.transactions.slice(0, 5).map((trx) => (
              <div key={trx.id} className="py-3 flex justify-between items-center text-xs sm:text-sm">
                <div>
                  <div className="font-bold text-slate-800">{trx.description}</div>
                  <div className="text-slate-500 text-xs">{trx.date} • {trx.category}</div>
                </div>
                <div className={`font-mono font-bold ${trx.type === 'pemasukan' ? 'text-emerald-700' : 'text-slate-600'}`}>
                  {trx.type === 'pemasukan' ? '+' : '-'} {formatRupiah(trx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* SECTION B: Galeri Kegiatan Terbaru */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-8">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
            <i data-lucide="camera" className="w-3.5 h-3.5 text-teal-600"></i>
            <span>Dokumentasi Panti</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Galeri Kegiatan & Momen Bahagia
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Potret senyum anak-anak asuh dalam berbagai kegiatan pendidikan, keagamaan, seni, dan kunjungan para sahabat dermawan.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center space-x-2">
          {['semua', 'pendidikan', 'baksos', 'kesenian'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveGalleryTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeGalleryTab === tab
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredGallery.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors"></div>
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold shadow">
                  {photo.category}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <div className="text-xs text-emerald-700 font-semibold">{photo.date}</div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {photo.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {photo.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Lightbox Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4 p-6 relative animate-fade-in">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              <i data-lucide="x" className="w-5 h-5"></i>
            </button>

            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.title}
              className="w-full h-80 object-cover rounded-2xl"
            />

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                {selectedPhoto.category}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">{selectedPhoto.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{selectedPhoto.description}</p>
              <span className="text-xs text-slate-400 block mt-3">{selectedPhoto.date}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

window.TransparencyReport = TransparencyReport;
