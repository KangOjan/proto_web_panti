// Wishlist Kebutuhan Mendesak Component (Public)
const WishlistSection = ({ wishlistData, onOpenDonationModal }) => {
  // Only show published wishlist items on public page!
  const publishedWishlist = wishlistData.filter(item => item.isPublished);

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <section id="wishlist" className="py-16 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Title Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>Wishlist Kebutuhan Mendesak Panti</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Penuhi Kebutuhan Spesifik Anak-Anak
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Anda dapat memilih barang atau fasilitas tertentu yang saat ini paling dibutuhkan panti asuhan. Progres penggalangan diperbarui secara transparan.
          </p>
        </div>

        {/* Wishlist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedWishlist.map((item) => {
            const percentage = Math.min(100, Math.round((item.currentAmount / item.targetAmount) * 100));
            const isCompleted = item.currentAmount >= item.targetAmount;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  
                  {/* Top Badge & Category */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {item.category}
                    </span>

                    {item.urgent && !isCompleted && (
                      <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-extrabold flex items-center space-x-1">
                        <i data-lucide="alert-circle" className="w-3.5 h-3.5 text-red-600"></i>
                        <span>Mendesak</span>
                      </span>
                    )}

                    {isCompleted && (
                      <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-[11px] font-extrabold flex items-center space-x-1">
                        <i data-lucide="check-circle-2" className="w-3.5 h-3.5 text-teal-600"></i>
                        <span>Terpenuhi</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed min-h-[40px]">
                    {item.description}
                  </p>

                  {/* Progress Bar & Amounts */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                      <span>Terkumpul:</span>
                      <span className="text-emerald-700">
                        {item.unit === 'Rp' ? formatRupiah(item.currentAmount) : `${item.currentAmount} ${item.unit}`}
                      </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-teal-500 to-emerald-600'
                            : 'bg-gradient-to-r from-orange-500 to-amber-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>Target: {item.unit === 'Rp' ? formatRupiah(item.targetAmount) : `${item.targetAmount} ${item.unit}`}</span>
                      <span className="font-bold text-slate-800">{percentage}%</span>
                    </div>
                  </div>

                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <button
                    onClick={() => onOpenDonationModal(item)}
                    disabled={isCompleted}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                      isCompleted
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md hover:shadow-lg hover:from-orange-600 hover:to-amber-600'
                    }`}
                  >
                    <i data-lucide={isCompleted ? "check-circle" : "heart"} className="w-4 h-4"></i>
                    <span>{isCompleted ? "Kebutuhan Terpenuhi" : "Penuhi Kebutuhan Ini"}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

window.WishlistSection = WishlistSection;
