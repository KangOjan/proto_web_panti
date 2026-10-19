// Admin Dashboard Component
// SIMK-Panti - Portal Pengelola & Analitik Donasi Panti

// SIMK-Panti Dashboard Pengelola.
// Tata letak asli dipertahankan, angka keuangan berasal dari API Laravel.
const AdminDashboard = ({
  currentUser = null,
  onNavigateTab = null,
  financialTransactionRefreshKey = 0,
}) => {
  const chartBarRef = React.useRef(null);
  const chartPieRef = React.useRef(null);
  const barInstance = React.useRef(null);
  const pieInstance = React.useRef(null);

  const currentYear = new Date().getFullYear();
  const emptyFilters = () => ({ year: String(currentYear), from: '', to: '', type: '', category: '', q: '' });
  const [filters, setFilters] = React.useState(emptyFilters);
  const [searchDraft, setSearchDraft] = React.useState('');
  const [refreshTick, setRefreshTick] = React.useState(0);
  const [financeSnapshot, setFinanceSnapshot] = React.useState(null);
  const [financeError, setFinanceError] = React.useState('');
  const [financeLoading, setFinanceLoading] = React.useState(true);
  const [publicStats, setPublicStats] = React.useState(null);
  const [campaignRows, setCampaignRows] = React.useState([]);
  const [campaignsLoaded, setCampaignsLoaded] = React.useState(false);
  const [pendingDonations, setPendingDonations] = React.useState([]);
  const [pendingError, setPendingError] = React.useState('');
  const [lastUpdated, setLastUpdated] = React.useState(null);
  const [distributionType, setDistributionType] = React.useState('income');

  const money = (num) => num == null ? 'Belum tersedia' : `Rp ${Number(num).toLocaleString('id-ID')}`;
  const updateFilter = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }));
  const filterKey = JSON.stringify(filters);
  const categoryOptions = [
    ['', 'Semua kategori'],
    ['donation_routine', 'Donasi Rutin'], ['infak_zakat', 'Infak / Zakat'],
    ['government_grant', 'Bantuan Pemerintah'], ['other_income', 'Pemasukan Lain'],
    ['consumption', 'Konsumsi'], ['education', 'Pendidikan'],
    ['operational', 'Operasional'], ['health', 'Kesehatan'], ['other_expense', 'Pengeluaran Lain'],
  ];

  React.useEffect(() => {
    let cancelled = false;
    const reload = async () => {
      setFinanceLoading(true);
      // API publik hanya untuk ringkasan donasi terverifikasi dan daftar campaign.
      // Jangan menggunakan window.INITIAL_SIMK_DATA sebagai fallback nominal.
      const tasks = [
        Promise.resolve().then(() => FinancialApi.getDashboard(filters)),
        Promise.resolve().then(() => FinancialApi.getPublicTransparency(Number(filters.year))),
        Promise.resolve().then(() => CampaignApi.getPublicCampaigns()),
        Promise.resolve().then(() => apiRequest('/pengurus/donations')),
      ];
      const [finance, publicData, campaignData, pendingData] = await Promise.allSettled(tasks);
      if (cancelled) return;

      if (finance.status === 'fulfilled') {
        setFinanceSnapshot(finance.value?.data || null);
        setFinanceError('');
      } else {
        setFinanceSnapshot(null);
        const err = finance.reason;
        setFinanceError(err?.status === 401 || err?.status === 403
          ? 'Data buku kas memerlukan login Laravel sebagai Pengurus Harian. Mode Evaluator hanya mengganti tampilan peran.'
          : err?.message || 'Gagal mengambil grafik buku kas dari server.');
      }
      setFinanceLoading(false);
      if (publicData.status === 'fulfilled') setPublicStats(publicData.value?.data || null);
      if (campaignData.status === 'fulfilled') {
        setCampaignsLoaded(true);
        const rows = campaignData.value?.data;
        setCampaignRows(Array.isArray(rows) ? rows.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category?.name || 'Program',
          status: item.status,
          targetAmount: Number(item.target_amount || 0),
          collectedAmount: item.collected_amount == null ? null : Number(item.collected_amount),
        })) : []);
      }
      if (pendingData.status === 'fulfilled') {
        const rows = pendingData.value?.data?.items;
        const pendingRows = Array.isArray(rows) ? rows.filter((d) => {
          const status = d.status?.value || d.status;
          const source = d.source?.value || d.source;
          return String(status).toLowerCase() === 'pending' && String(source).toLowerCase() !== 'offline';
        }).map((d) => ({
          id: d.id || d.public_id,
          donorName: d.donor_name || d.donor?.name || 'Hamba Allah',
          campaignTitle: d.campaign?.title || 'Donasi Umum',
          amount: Number(d.amount || 0),
        })) : [];
        setPendingDonations(pendingRows);
        setPendingError('');
      } else {
        setPendingDonations([]);
        setPendingError('Antrean verifikasi memerlukan login Pengurus Harian.');
      }
      setLastUpdated(new Date());
    };
    reload();
    const timer = window.setInterval(reload, 30000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [filterKey, refreshTick, financialTransactionRefreshKey]);

  // Ringkasan dari API publik: keseluruhan donasi verified dalam tahun terpilih.
  const donationSummary = publicStats?.summary || {};
  const totalDonationsManaged = publicStats ? Number(donationSummary.total_donations || 0) : null;
  const totalVerifiedCount = publicStats ? Number(donationSummary.donation_count || 0) : null;
  const avgDonation = publicStats ? Number(donationSummary.average_donation || 0) : null;
  const activeCampaignsCount = campaignRows.filter((c) => c.status === 'active').length;

  const monthly = Array.isArray(financeSnapshot?.monthly_trend) ? financeSnapshot.monthly_trend : [];
  const monthLabels = monthly.map((row) => {
    const ym = String(row.month || '');
    const parsed = /^\d{4}-\d{2}$/.test(ym) ? new Date(`${ym}-01T12:00:00`) : null;
    return parsed && !Number.isNaN(parsed.getTime())
      ? parsed.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
      : ym;
  });
  const monthlyIncome = monthly.map((m) => Number(m.income || 0));
  const monthlyExpense = monthly.map((m) => Number(m.expense || 0));

  // Alokasi menurut kategori buku kas (filter dan jenis transaksi aktif).
  const breakdown = distributionType === 'income'
    ? financeSnapshot?.income_by_category : financeSnapshot?.expense_by_category;
  const distributionRows = (Array.isArray(breakdown) ? breakdown : [])
    .filter((r) => Number(r.total || 0) > 0);
  const categories = distributionRows.map((r) => r.category?.label || r.category?.value || 'Lainnya');
  const categoryAmounts = distributionRows.map((r) => Number(r.total || 0));
  const chartKey = JSON.stringify({ monthly, categories, categoryAmounts, distributionType });

  // Render Charts
  React.useEffect(() => {
    if (!window.Chart) return;

    if (chartBarRef.current) {
      if (barInstance.current) barInstance.current.destroy();

      const ctx = chartBarRef.current.getContext('2d');
      barInstance.current = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: monthLabels,
          datasets: [
            {
              label: 'Pemasukan Donasi & Kas',
              data: monthlyIncome,
              backgroundColor: '#10b981',
              borderRadius: 8,
              barPercentage: 0.6,
              categoryPercentage: 0.7
            },
            {
              label: 'Pengeluaran Operasional',
              data: monthlyExpense,
              backgroundColor: '#f43f5e',
              borderRadius: 8,
              barPercentage: 0.6,
              categoryPercentage: 0.7
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { size: 11, weight: 'bold', family: "'Plus Jakarta Sans', sans-serif" }
              }
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: Rp ${ctx.raw.toLocaleString('id-ID')}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `Rp ${(value / 1000000).toFixed(0)} Jt`,
                font: { size: 10 }
              },
              grid: { color: '#f1f5f9' }
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 10 } }
            }
          }
        }
      });
    }

    if (chartPieRef.current) {
      if (pieInstance.current) pieInstance.current.destroy();

      const ctx = chartPieRef.current.getContext('2d');
      pieInstance.current = new window.Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categories,
          datasets: [
            {
              data: categoryAmounts,
              backgroundColor: ['#10b981', '#0ea5e9', '#f59e0b', '#ec4899', '#8b5cf6'],
              borderWidth: 3,
              borderColor: '#ffffff',
              hoverOffset: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,
                padding: 12,
                font: { size: 10, weight: 'bold', family: "'Plus Jakarta Sans', sans-serif" }
              }
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.label}: Rp ${ctx.raw.toLocaleString('id-ID')}`
              }
            }
          }
        }
      });
    }

    return () => {
      if (barInstance.current) barInstance.current.destroy();
      if (pieInstance.current) pieInstance.current.destroy();
    };
  }, [chartKey]);

  const navigateTo = (route) => {
    if (onNavigateTab) {
      onNavigateTab(route);
    } else if (window.navigateToRoute) {
      window.navigateToRoute(route);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-black">
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Portal Pengelola & Analitik Donasi Panti</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
            Dashboard Transparansi & Verifikasi Donasi
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mt-1 leading-relaxed">
            Selamat datang, <b>{currentUser?.fullName || 'Pengurus Harian'}</b>. Pantau visualisasi penerimaan donasi, kelola program prioritas, serta verifikasi bukti transfer donatur.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setRefreshTick((prev) => prev + 1)}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs border border-white/20 shadow-sm flex items-center space-x-2 transition-all"
          >
            <BarChart3 className="w-4 h-4 text-emerald-300" />
            <span>Muat Ulang Data</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('/admin/verifikasi-donasi')}
            className="px-4 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs shadow-lg flex items-center space-x-2 transition-all"
          >
            <Clock className="w-4 h-4 text-slate-950" />
            <span>Verifikasi Donasi ({pendingError ? '-' : pendingDonations.length})</span>
          </button>
        </div>
      </div>

      {/* Filter tambahan. Semua bagian desain dashboard asli tetap ditampilkan. */}
      <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4" aria-label="Filter Transaksi dan Grafik">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-extrabold text-slate-900">Filter Transaksi dan Grafik</h2>
          <button type="button" className="text-xs font-bold text-emerald-700 hover:underline" onClick={() => { setFilters(emptyFilters()); setSearchDraft(''); }}>Reset Filter</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <label className="text-xs font-bold text-slate-600">Tahun
            <select value={filters.year} onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value, from: '', to: '' }))} className="block mt-1 w-full border border-slate-200 px-3 py-2.5 rounded-xl text-sm">
              {Array.from({ length: 7 }, (_, i) => currentYear - i).map((y) => <option key={y} value={String(y)}>{y}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-slate-600">Dari Tanggal
            <input type="date" value={filters.from} min={`${filters.year}-01-01`} max={`${filters.year}-12-31`} onChange={(e) => updateFilter('from', e.target.value)} className="block mt-1 w-full border border-slate-200 px-3 py-2.5 rounded-xl text-sm" />
          </label>
          <label className="text-xs font-bold text-slate-600">Sampai Tanggal
            <input type="date" value={filters.to} min={filters.from || `${filters.year}-01-01`} max={`${filters.year}-12-31`} onChange={(e) => updateFilter('to', e.target.value)} className="block mt-1 w-full border border-slate-200 px-3 py-2.5 rounded-xl text-sm" />
          </label>
          <label className="text-xs font-bold text-slate-600">Jenis Transaksi
            <select value={filters.type} onChange={(e) => updateFilter('type', e.target.value)} className="block mt-1 w-full border border-slate-200 px-3 py-2.5 rounded-xl text-sm">
              <option value="">Semua jenis</option><option value="income">Pemasukan</option><option value="expense">Pengeluaran</option>
            </select>
          </label>
          <label className="text-xs font-bold text-slate-600">Kategori
            <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)} className="block mt-1 w-full border border-slate-200 px-3 py-2.5 rounded-xl text-sm">
              {categoryOptions.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
            </select>
          </label>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); updateFilter('q', searchDraft.trim()); }} className="flex flex-wrap gap-2">
          <input aria-label="Cari transaksi" placeholder="Cari kode, nama, atau keterangan transaksi..." value={searchDraft} onChange={(e) => setSearchDraft(e.target.value)} className="flex-1 min-w-52 border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
          <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-extrabold">Cari</button>
        </form>
        <p className="text-[11px] text-slate-500">Grafik dan kategori menggunakan filter di atas. Ringkasan donasi, program aktif, dan antrean verifikasi memiliki cakupan tersendiri. Pembaruan setiap 30 detik.{lastUpdated ? ` Terakhir: ${lastUpdated.toLocaleTimeString('id-ID')}` : ''}</p>
      </section>
      {financeError && <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">{financeError}</div>}

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Donasi Terkelola</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {money(totalDonationsManaged)}
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-emerald-600 font-bold">
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              {totalVerifiedCount == null ? '-' : totalVerifiedCount} Transaksi
            </span>
            <span>Donasi terverifikasi sesuai tahun</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Program / Campaign Aktif</span>
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{campaignsLoaded ? activeCampaignsCount : '-'} Program</div>
          <p className="text-[11px] text-slate-400 font-medium">Dari total {campaignsLoaded ? campaignRows.length : '-'} program pada API</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rata-Rata per Donasi</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-900">
            {money(avgDonation)}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Rata-rata dari donasi verified tahun terpilih</p>
        </div>

        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Antrean Verifikasi</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-900">{pendingError ? '-' : pendingDonations.length} Donasi</div>
          <p className="text-[11px] text-amber-700 font-bold">Menunggu konfirmasi bukti transfer (halaman pertama)</p>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-[11px] font-extrabold uppercase text-emerald-700 tracking-wider">
                <BarChart3 className="w-4 h-4" />
                <span>Tren Keuangan Bulanan</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                Pemasukan vs Pengeluaran Buku Kas
              </h3>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-bold self-start sm:self-auto">
              {filters.year} · Sesuai filter
            </span>
          </div>

          <div className="h-72 w-full pt-2 relative">
            <canvas ref={chartBarRef}></canvas>
            {!financeLoading && (financeError || !monthly.length || monthly.every((m) => !Number(m.income || 0) && !Number(m.expense || 0))) &&
              <p className="absolute inset-0 flex items-center justify-center text-center text-sm text-slate-400 bg-white/90 px-5">{financeError ? 'Login diperlukan untuk melihat grafik.' : 'Belum ada pemasukan atau pengeluaran sesuai filter.'}</p>}
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-extrabold uppercase text-teal-700 tracking-wider">
              <PieChart className="w-4 h-4" />
              <span>Distribusi Alokasi Dana</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              Proporsi Kategori Transaksi
            </h3>
          </div>

          <label className="text-xs font-bold text-slate-600">Distribusi
            <select value={distributionType} onChange={(e) => setDistributionType(e.target.value)} className="ml-2 rounded-lg border border-slate-200 px-2 py-1 text-xs">
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </label>
          <div className="h-64 w-full relative flex items-center justify-center">
            <canvas ref={chartPieRef}></canvas>
            {!financeLoading && (financeError || !distributionRows.length) &&
              <p className="absolute inset-0 flex items-center justify-center text-center text-sm text-slate-400 bg-white/90 px-5">{financeError ? 'Login diperlukan untuk melihat grafik.' : 'Tidak ada transaksi untuk kategori ini.'}</p>}
          </div>

          <p className="text-[11px] text-slate-400 text-center font-medium pt-1">
            Agregasi kategori buku kas dari database sesuai filter. Tidak memakai nilai buatan.
          </p>
        </div>
      </div>

      {/* PROGRESS CAPAIAN TARGET PROGRAM PRIORITAS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-extrabold uppercase text-emerald-700 tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Capaian Dana Program</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              Progres Capaian Target Program Prioritas
            </h3>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('/pengelola/campaign')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 self-start sm:self-auto"
          >
            <span>Kelola Seluruh Program</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaignRows.filter((c) => c.status === 'active').slice(0, 3).map((camp) => {
            const collected = camp.collectedAmount;
            const target = camp.targetAmount || 0;
            const pct = collected == null || target <= 0 ? null : Math.min(Math.round((collected / target) * 100), 100);

            return (
              <div
                key={camp.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3 hover:border-emerald-200 hover:shadow-xs transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {camp.category || 'Prioritas'}
                  </span>
                  <span className="text-xs font-black text-emerald-700">{pct == null ? '-' : `${pct}%`}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {camp.title}
                </h4>

                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct == null ? '-' : `${pct}%`}` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Terkumpul:</span>
                    <span className="font-bold text-slate-800">{money(collected)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">Target:</span>
                    <span className="font-bold text-slate-600">{money(target)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Verification Table Snippet */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Antrean Verifikasi Donasi Online (Pending)</h3>
            <p className="text-xs text-slate-500">Periksa bukti transfer dan setujui donasi untuk meng-update progress campaign</p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('/admin/verifikasi-donasi')}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center space-x-1"
          >
            <span>Kelola Semua Donasi</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Donatur</th>
                <th className="py-3 px-4">Campaign Tujuan</th>
                <th className="py-3 px-4">Nominal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {pendingDonations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-1 text-emerald-500" />
                    <p className="font-semibold text-xs">{pendingError || 'Tidak ada donasi online pending pada halaman data yang dimuat.'}</p>
                  </td>
                </tr>
              ) : (
                pendingDonations.slice(0, 5).map((don) => (
                  <tr key={don.id}>
                    <td className="py-3 px-4 font-bold text-slate-900">{don.donorName}</td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-xs">{don.campaignTitle}</td>
                    <td className="py-3 px-4 font-black text-emerald-700">Rp {don.amount.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        Pending
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigateTo('/admin/verifikasi-donasi')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                      >
                        Periksa Bukti
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

window.AdminDashboard = AdminDashboard;
