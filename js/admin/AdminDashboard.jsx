// Admin Dashboard Summary Component
const AdminDashboard = ({
  stats,
  financeData,
  inventoryData,
  visitsData,
  childrenData,
  onOpenAddChildModal,
  onOpenAddTrxModal,
  setActiveTab
}) => {

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Count low stock items
  const lowStockItems = inventoryData.filter(item => item.stock <= item.minStock);
  const pendingVisits = visitsData.filter(v => v.status === 'Pending');

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold">Selamat Datang, Pengurus PantiAsih</h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Ringkasan statistik operasional, logistik, dan kunjungan panti hari ini.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onOpenAddChildModal}
            className="px-3.5 py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow hover:bg-emerald-50 transition-colors flex items-center space-x-1.5"
          >
            <i data-lucide="user-plus" className="w-4 h-4 text-emerald-600"></i>
            <span>+ Anak Asuh</span>
          </button>

          <button
            onClick={onOpenAddTrxModal}
            className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow transition-colors flex items-center space-x-1.5"
          >
            <i data-lucide="plus-circle" className="w-4 h-4"></i>
            <span>+ Transaksi Kas</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: Total Anak Asuh */}
        <div
          onClick={() => setActiveTab('children')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase">
            <span>Total Anak Asuh</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <i data-lucide="users" className="w-4 h-4"></i>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{childrenData.length}</div>
          <div className="text-xs text-slate-500">SD: 3 • SMP: 2 • SMA: 1</div>
        </div>

        {/* Stat 2: Donasi Bulan Ini */}
        <div
          onClick={() => setActiveTab('finance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase">
            <span>Donasi Bulan Ini</span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <i data-lucide="wallet" className="w-4 h-4"></i>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {formatRupiah(financeData.monthlyIncome)}
          </div>
          <div className="text-xs text-emerald-600 font-semibold">Pengeluaran: {formatRupiah(financeData.monthlyExpense)}</div>
        </div>

        {/* Stat 3: Alert Stok Menipis */}
        <div
          onClick={() => setActiveTab('inventory')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase">
            <span>Stok Logistik Menipis</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <i data-lucide="alert-triangle" className="w-4 h-4"></i>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600">{lowStockItems.length} Item</div>
          <div className="text-xs text-amber-700 font-semibold">Perlu pengisian ulang segera</div>
        </div>

        {/* Stat 4: Kunjungan Minggu Ini */}
        <div
          onClick={() => setActiveTab('visits')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase">
            <span>Pending Kunjungan</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <i data-lucide="calendar-clock" className="w-4 h-4"></i>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-blue-600">{pendingVisits.length} Request</div>
          <div className="text-xs text-slate-500">Membutuhkan persetujuan pengurus</div>
        </div>

      </div>

      {/* Two Column Grid for Inventory Alert & Pending Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Low Stock Alert Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <i data-lucide="package-warning" className="w-4 h-4 text-amber-600"></i>
              <span>Peringatan Stok Logistik Menipis</span>
            </h3>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              Lihat Semua &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Semua stok inventaris dalam batas aman.</p>
            ) : (
              lowStockItems.map(item => (
                <div key={item.id} className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-800">{item.name}</div>
                    <div className="text-slate-500">{item.category} • Min: {item.minStock} {item.unit}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 font-extrabold">
                    Sisa: {item.stock} {item.unit}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Visits List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <i data-lucide="clock" className="w-4 h-4 text-blue-600"></i>
              <span>Pengajuan Kunjungan Baru</span>
            </h3>
            <button
              onClick={() => setActiveTab('visits')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              Kelola Kalender &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {pendingVisits.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Tidak ada pengajuan kunjungan pending.</p>
            ) : (
              pendingVisits.map(visit => (
                <div key={visit.id} className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-800">{visit.requesterName}</div>
                    <div className="text-slate-500">{visit.date} ({visit.timeSlot}) • {visit.visitorCount} orang</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('visits')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px]"
                  >
                    Tinjau
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

window.AdminDashboard = AdminDashboard;
