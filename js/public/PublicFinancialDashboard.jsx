// SIMK-Panti: dashboard donasi publik berbasis Laravel API.
// Sumber resmi: GET /api/v1/financial-transparency?year=YYYY
// Tidak menggunakan mockup frontend maupun transaksi ledger internal.
const PublicFinancialDashboard = () => {
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [filterCategory, setFilterCategory] = React.useState('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [apiData, setApiData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const chartRef = React.useRef(null);
  const chartInstanceRef = React.useRef(null);

  React.useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      setApiData(null);

      try {
        if (typeof window.FinancialApi?.getPublicTransparency !== 'function') {
          throw new Error('FinancialApi belum dimuat. Periksa urutan script di index.html.');
        }

        const response = await window.FinancialApi.getPublicTransparency(selectedYear);
        const data = response?.data;

        if (response?.success !== true || !data?.summary ||
            !Array.isArray(data.donations_by_allocation) ||
            !Array.isArray(data.recent_donations)) {
          throw new Error('Format data transparansi dari backend tidak sesuai.');
        }

        if (active) setApiData(data);
      } catch (e) {
        if (active) setError(e?.message || 'Tidak dapat memuat data donasi.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => { active = false; };
  }, [selectedYear, refreshKey]);

  // Rekap tahunan harus berasal dari summary API, BUKAN dijumlahkan
  // dari recent_donations yang hanya memuat sejumlah donasi terbaru.
  const totalDonations = Number(apiData?.summary?.total_donations || 0);
  const donationCount = Number(apiData?.summary?.donation_count || 0);
  const averageDonation = Number(apiData?.summary?.average_donation || 0);

  const allocations = React.useMemo(() => {
    return (apiData?.donations_by_allocation || []).map((entry) => ({
      value: String(entry.allocation_category?.value || 'lainnya'),
      label: String(entry.allocation_category?.label || 'Lainnya'),
      amount: Number(entry.total_donations || 0),
    }));
  }, [apiData]);

  // Respons recent_donations berbeda format dari financial_transactions.
  // Jangan gunakan FinancialApi.normalizeTransaction() untuk payload ini.
  const recentDonations = React.useMemo(() => {
    return (apiData?.recent_donations || []).map((donation) => ({
      id: donation.public_id,
      date: String(donation.verified_date || ''),
      donorName: String(donation.donor_name || 'Hamba Allah'),
      categoryValue: String(donation.allocation_category?.value || 'lainnya'),
      category: String(donation.allocation_category?.label || 'Lainnya'),
      amount: Number(donation.amount || 0),
      campaign: String(donation.campaign?.title || 'Donasi Umum'),
    }));
  }, [apiData]);

  const categories = React.useMemo(() => {
    const options = new Map();
    allocations.forEach((a) => options.set(a.value, a.label));
    recentDonations.forEach((d) => options.set(d.categoryValue, d.category));
    return Array.from(options, ([value, label]) => ({ value, label }));
  }, [allocations, recentDonations]);

  // Pencarian dan rentang tanggal hanya menyaring tabel donasi terbaru,
  // bukan mengubah total dan grafik rekap tahunan.
  const filteredDonations = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return recentDonations.filter((donation) => {
      const matchesCategory = filterCategory === 'ALL' ||
        donation.categoryValue === filterCategory;
      const matchesSearch = !query || [
        donation.donorName, donation.category, donation.campaign,
        String(donation.amount),
      ].some((text) => String(text).toLowerCase().includes(query));
      const matchesFrom = !startDate || donation.date >= startDate;
      const matchesTo = !endDate || donation.date <= endDate;
      return matchesCategory && matchesSearch && matchesFrom && matchesTo;
    });
  }, [recentDonations, filterCategory, searchQuery, startDate, endDate]);

  React.useEffect(() => {
    if (loading || !apiData || !chartRef.current || !window.Chart) return;
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const withAmounts = allocations.filter((a) => a.amount > 0);
    const hasData = withAmounts.length > 0;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new window.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: hasData ? withAmounts.map((a) => a.label) : ['Belum ada donasi'],
        datasets: [{
          data: hasData ? withAmounts.map((a) => a.amount) : [1],
          backgroundColor: hasData
            ? ['#10b981', '#14b8a6', '#0ea5e9', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6']
            : ['#e2e8f0'],
          borderWidth: 2,
          borderColor: '#ffffff',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 15, font: { size: 11 } },
          },
          tooltip: { enabled: hasData },
        },
        cutout: '65%',
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [apiData, allocations, loading]);

  const rupiah = (amount) => `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;
  const yearOptions = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  const resetFilters = () => {
    setFilterCategory('ALL');
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-black">
            <window.Globe className="w-4 h-4 text-emerald-400" />
            <span>Portal Transparansi Donasi Publik</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Transparansi Keuangan Terbuka</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            Ringkasan donasi yang telah diverifikasi oleh sistem pada tahun {selectedYear}.
            Data ini tidak mencakup pengeluaran atau seluruh buku kas internal.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center min-w-[190px] shadow-lg">
          <div className="text-[10px] uppercase tracking-wider text-amber-300 font-extrabold">Total Donasi Terverifikasi</div>
          <div className="text-2xl font-black text-white mt-1 font-mono">
            {apiData ? rupiah(totalDonations) : '...'}
          </div>
          <div className="text-[11px] text-emerald-200 font-medium">Tahun {selectedYear}</div>
        </div>
      </div>

      {isLocal && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900" role="note">
          Mode development: database dapat berisi data simulasi hasil seeder. Angka ini bukan laporan resmi lembaga.
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="financial-year" className="block text-xs font-bold text-slate-600 mb-1">Tahun laporan</label>
          <select
            id="financial-year"
            value={selectedYear}
            onChange={(e) => { setSelectedYear(Number(e.target.value)); resetFilters(); }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800"
          >
            {yearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
        <button
          type="button"
          onClick={() => setRefreshKey((key) => key + 1)}
          disabled={loading}
          className="rounded-xl border border-emerald-300 bg-white px-4 py-2 text-xs font-bold text-emerald-800 disabled:opacity-50"
        >
          Muat Ulang
        </button>
      </div>

      {loading && <div role="status" className="rounded-2xl bg-white border border-slate-200 p-6 text-sm text-slate-600">Memuat data donasi dari database...</div>}
      {error && !loading && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          Gagal memuat laporan: {error}. Periksa API Laravel lalu klik Muat Ulang.
        </div>
      )}

      {apiData && !loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><window.ArrowDownLeft className="w-5 h-5" /></div>
              <div className="text-2xl font-black text-slate-900 font-mono">{rupiah(totalDonations)}</div>
              <div className="text-xs font-bold text-slate-600">Total Donasi Terverifikasi</div>
              <p className="text-[11px] text-slate-400">Seluruh donasi terverifikasi tahun {selectedYear}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center"><window.HeartHandshake className="w-5 h-5" /></div>
              <div className="text-2xl font-black text-slate-900 font-mono">{donationCount} Donasi</div>
              <div className="text-xs font-bold text-slate-600">Jumlah Donasi Terverifikasi</div>
              <p className="text-[11px] text-slate-400">Jumlah transaksi, bukan jumlah donatur unik</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><window.Calculator className="w-5 h-5" /></div>
              <div className="text-2xl font-black text-slate-900 font-mono">{rupiah(averageDonation)}</div>
              <div className="text-xs font-bold text-slate-600">Rata-rata Nominal Donasi</div>
              <p className="text-[11px] text-slate-400">Berdasarkan ringkasan backend</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <window.PieChart className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-slate-900">Distribusi Donasi per Kategori</h3>
              </div>
              <div className="h-64 relative">
                {window.Chart ? <canvas ref={chartRef}></canvas> : <p className="text-xs text-slate-500">Grafik tidak tersedia. Periksa Chart.js.</p>}
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <window.SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">Filter Daftar Donasi Terbaru</h3>
                </div>
                {(filterCategory !== 'ALL' || searchQuery || startDate || endDate) && (
                  <button type="button" onClick={resetFilters} className="text-[11px] text-emerald-600 hover:underline font-bold">Reset Filter</button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label htmlFor="public-donor-search" className="block text-[11px] font-bold text-slate-600 mb-1">Cari Donatur / Program</label>
                  <input id="public-donor-search" type="text" placeholder="Nama / program..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-2 rounded-xl border border-slate-200 text-xs" />
                </div>
                <div>
                  <label htmlFor="public-donor-category" className="block text-[11px] font-bold text-slate-600 mb-1">Kategori Donasi</label>
                  <select id="public-donor-category" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold">
                    <option value="ALL">Semua Kategori</option>
                    {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="public-donor-start" className="block text-[11px] font-bold text-slate-600 mb-1">Dari Tanggal</label>
                  <input id="public-donor-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs" />
                </div>
                <div>
                  <label htmlFor="public-donor-end" className="block text-[11px] font-bold text-slate-600 mb-1">Sampai Tanggal</label>
                  <input id="public-donor-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500">Filter hanya berlaku pada daftar donasi terbaru, bukan ringkasan tahunan atau grafik.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <window.ListChecks className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-slate-900">Riwayat Donasi Terverifikasi Terbaru</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">{filteredDonations.length} Data Ditampilkan</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-6">Tanggal Verifikasi</th>
                    <th className="py-3.5 px-6">Donatur</th>
                    <th className="py-3.5 px-6">Kategori</th>
                    <th className="py-3.5 px-6">Nominal</th>
                    <th className="py-3.5 px-6">Program</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredDonations.length === 0 ? (
                    <tr><td colSpan="5" className="py-12 text-center text-slate-400">Tidak ada donasi terbaru yang sesuai filter.</td></tr>
                  ) : filteredDonations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6 font-mono text-slate-500 whitespace-nowrap">{donation.date || '-'}</td>
                      <td className="py-3.5 px-6 font-bold text-slate-900">{donation.donorName}</td>
                      <td className="py-3.5 px-6"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">{donation.category}</span></td>
                      <td className="py-3.5 px-6 font-mono font-bold text-emerald-700 whitespace-nowrap">{rupiah(donation.amount)}</td>
                      <td className="py-3.5 px-6 text-slate-500">{donation.campaign}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="px-6 py-3 text-[11px] text-slate-500 border-t border-slate-100">
              Daftar ini hanya memuat donasi terbaru yang dipublikasikan oleh API. Kuitansi pribadi tidak tersedia di halaman publik.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

window.PublicFinancialDashboard = PublicFinancialDashboard;
