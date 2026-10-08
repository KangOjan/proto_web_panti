// Public Financial Dashboard Component (Dashboard Transparansi Keuangan Publik)
const PublicFinancialDashboard = ({
  transactions = [],
  onPrintTransactionReceipt,
}) => {
  const [filterCategory, setFilterCategory] = React.useState('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [apiData, setApiData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const chartRef = React.useRef(null);
  const chartInstanceRef = React.useRef(null);

  // Fetch real transparency data if available from backend
  React.useEffect(() => {
    let active = true;
    const fetchTransparency = async () => {
      try {
        setLoading(true);
        if (window.FinancialApi?.getPublicTransparency) {
          const res = await window.FinancialApi.getPublicTransparency();
          if (active && res?.data) {
            setApiData(res.data);
          }
        }
      } catch (e) {
        console.warn('Using local transactions for public transparency:', e);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchTransparency();
    return () => { active = false; };
  }, []);

  const baseTransactions = React.useMemo(() => {
    if (transactions && transactions.length > 0) return transactions;
    if (apiData?.recent_transactions) {
      return apiData.recent_transactions.map(t => window.FinancialApi?.normalizeTransaction(t) || t);
    }
    return window.INITIAL_SIMK_DATA?.transactions || [];
  }, [transactions, apiData]);

  const categories = [
    'Konsumsi', 'SPP/Pendidikan', 'Operasional', 'Infak/Zakat', 'Donasi Rutin', 'Lainnya'
  ];

  const filteredTransactions = React.useMemo(() => {
    return baseTransactions.filter(trx => {
      const matchesType = trx.type === 'pemasukan';
      const matchesCategory = filterCategory === 'ALL' || trx.category === filterCategory;

      const donorOrParty = trx.donorName || trx.description || '';
      const matchesSearch =
        donorOrParty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(trx.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(trx.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(trx.amount || '').includes(searchQuery);

      let matchesDate = true;
      if (startDate && trx.date) matchesDate = matchesDate && trx.date >= startDate;
      if (endDate && trx.date) matchesDate = matchesDate && trx.date <= endDate;

      return matchesType && matchesCategory && matchesSearch && matchesDate;
    });
  }, [baseTransactions, filterCategory, searchQuery, startDate, endDate]);

  const totalIncome = React.useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'pemasukan')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [filteredTransactions]);

  const totalDonorsCount = filteredTransactions.length;
  const averageDonation = totalDonorsCount > 0 ? Math.round(totalIncome / totalDonorsCount) : 0;

  const incomeByCategory = React.useMemo(() => {
    const categoryTotals = {};
    filteredTransactions
      .filter(t => t.type === 'pemasukan')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + (Number(t.amount) || 0);
      });
    return categoryTotals;
  }, [filteredTransactions]);

  // Chart Rendering
  React.useEffect(() => {
    if (chartRef.current && window.Chart) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const labels = Object.keys(incomeByCategory);
      const dataValues = Object.values(incomeByCategory);

      const ctx = chartRef.current.getContext('2d');
      chartInstanceRef.current = new window.Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels.length > 0 ? labels : ['Belum Ada Donasi'],
          datasets: [{
            data: dataValues.length > 0 ? dataValues : [1],
            backgroundColor: labels.length > 0 ? [
              '#10b981', '#14b8a6', '#0ea5e9', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'
            ] : ['#e2e8f0'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                padding: 15,
                font: { size: 11, family: '"Plus Jakarta Sans", sans-serif' }
              }
            }
          },
          cutout: '65%'
        }
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [incomeByCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Header Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-black">
            <window.Globe className="w-4 h-4 text-emerald-400" />
            <span>Portal Akuntabilitas Publik • Standar PSAK 45 / ISAK 35</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Transparansi Keuangan Terbuka
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            Wujud komitmen amanah Panti Asuhan Kasih Bunda kepada seluruh donatur dan masyarakat. Seluruh dana donasi yang masuk diverifikasi dan dilaporkan secara real-time.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center min-w-[170px] shadow-lg">
          <div className="text-[10px] uppercase tracking-wider text-amber-300 font-extrabold">Total Donasi Terhimpun</div>
          <div className="text-2xl font-black text-white mt-1 font-mono">
            Rp {totalIncome.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-200 font-medium">Buku Kas Terverifikasi</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <window.ArrowDownLeft className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            Rp {totalIncome.toLocaleString('id-ID')}
          </div>
          <div className="text-xs font-bold text-slate-600">Total Pemasukan Donasi</div>
          <p className="text-[11px] text-slate-400">Tercatat dalam periode yang dipilih</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <window.HeartHandshake className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {totalDonorsCount} Transaksi
          </div>
          <div className="text-xs font-bold text-slate-600">Jumlah Penyaluran Masuk</div>
          <p className="text-[11px] text-slate-400">Donasi rutin, infak, dan zakat</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <window.Calculator className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            Rp {averageDonation.toLocaleString('id-ID')}
          </div>
          <div className="text-xs font-bold text-slate-600">Rata-rata Nominal Donasi</div>
          <p className="text-[11px] text-slate-400">Per transaksi donatur terverifikasi</p>
        </div>
      </div>

      {/* Visual Chart & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <window.PieChart className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Distribusi Pemasukan per Kategori</h3>
          </div>
          <div className="h-64 relative">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <window.SlidersHorizontal className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Filter Transparansi Donasi</h3>
            </div>
            {(filterCategory !== 'ALL' || searchQuery || startDate || endDate) && (
              <button
                type="button"
                onClick={() => {
                  setFilterCategory('ALL');
                  setSearchQuery('');
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-[11px] text-emerald-600 hover:underline font-bold"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Cari Donatur / Deskripsi</label>
              <div className="relative">
                <window.Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ketik nama / keterangan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Kategori Donasi</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Dari Tanggal</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Sampai Tanggal</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Log Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <window.ListChecks className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Riwayat Catatan Penerimaan Donasi</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">{filteredTransactions.length} Data Ditampilkan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Tanggal</th>
                <th className="py-3.5 px-6">Donatur / Sumber</th>
                <th className="py-3.5 px-6">Kategori</th>
                <th className="py-3.5 px-6">Nominal (Rp)</th>
                <th className="py-3.5 px-6">Keterangan</th>
                <th className="py-3.5 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Tidak ada transaksi donasi yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-slate-500 whitespace-nowrap">
                      {trx.date ? trx.date.substring(0, 10) : '-'}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      {trx.donorName || trx.description || 'Hamba Allah'}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {trx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-mono font-bold text-emerald-700 whitespace-nowrap">
                      Rp {Number(trx.amount || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-6 max-w-xs truncate text-slate-500">
                      {trx.description || trx.paymentMethod || '-'}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => onPrintTransactionReceipt && onPrintTransactionReceipt(trx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Lihat / Cetak Kuitansi"
                      >
                        <window.Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

window.PublicFinancialDashboard = PublicFinancialDashboard;