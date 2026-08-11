// Real-Time Financial Dashboard with Dynamic Chart.js Visualizations
const FinancialDashboard = ({
  transactions,
  currentUser,
  onNavigateTab
}) => {
  const chartPieRef = React.useRef(null);
  const chartBarRef = React.useRef(null);
  const pieInstance = React.useRef(null);
  const barInstance = React.useRef(null);

  // Compute real-time financial metrics
  const totalIncome = transactions
    .filter(t => t.type === 'pemasukan')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'pengeluaran')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  // Compute income by category
  const incomeCategories = ['Donasi Rutin', 'Infak/Zakat', 'Bantuan Pemerintah/APBD', 'Lainnya'];
  const incomeByCategory = incomeCategories.map(cat => 
    transactions
      .filter(t => t.type === 'pemasukan' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // Compute expense by category
  const expenseCategories = ['Operasional', 'SPP/Pendidikan', 'Konsumsi', 'Kesehatan', 'Lainnya'];
  const expenseByCategory = expenseCategories.map(cat => 
    transactions
      .filter(t => t.type === 'pengeluaran' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // Compute monthly trend (Jan - Jul 2026)
  const months = ['01', '02', '03', '04', '05', '06', '07'];
  const monthLabels = ['Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'Mei 26', 'Jun 26', 'Jul 26'];
  
  const monthlyIncome = months.map(m => 
    transactions
      .filter(t => t.type === 'pemasukan' && t.date.startsWith(`2026-${m}`))
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const monthlyExpense = months.map(m => 
    transactions
      .filter(t => t.type === 'pengeluaran' && t.date.startsWith(`2026-${m}`))
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // Initialize or update Chart.js instances
  React.useEffect(() => {
    if (window.Chart && chartPieRef.current && chartBarRef.current) {
      
      // Destroy previous chart instances if re-rendering
      if (pieInstance.current) pieInstance.current.destroy();
      if (barInstance.current) barInstance.current.destroy();

      // Render Donut Chart (Allocation)
      const pieCtx = chartPieRef.current.getContext('2d');
      pieInstance.current = new window.Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: ['Operasional', 'SPP/Pendidikan', 'Konsumsi', 'Kesehatan', 'Pengeluaran Lain'],
          datasets: [{
            data: expenseByCategory,
            backgroundColor: [
              '#0d9488', // Teal
              '#6366f1', // Indigo
              '#f59e0b', // Amber
              '#ec4899', // Pink
              '#64748b'  // Slate
            ],
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
                font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
                padding: 14
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const val = context.raw || 0;
                  return ` Rp ${val.toLocaleString('id-ID')}`;
                }
              }
            }
          },
          cutout: '70%'
        }
      });

      // Render Bar/Line Chart (Monthly Trend)
      const barCtx = chartBarRef.current.getContext('2d');
      barInstance.current = new window.Chart(barCtx, {
        type: 'bar',
        data: {
          labels: monthLabels,
          datasets: [
            {
              label: 'Pemasukan',
              data: monthlyIncome,
              backgroundColor: '#10b981',
              borderRadius: 8
            },
            {
              label: 'Pengeluaran',
              data: monthlyExpense,
              backgroundColor: '#f43f5e',
              borderRadius: 8
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
                font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return ` ${context.dataset.label}: Rp ${(context.raw || 0).toLocaleString('id-ID')}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'Rp ' + (value / 1000000) + ' Jt';
                },
                font: { family: 'Plus Jakarta Sans', size: 10 }
              }
            },
            x: {
              ticks: {
                font: { family: 'Plus Jakarta Sans', size: 10, weight: 'bold' }
              }
            }
          }
        }
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }, [transactions]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-300 border border-emerald-500/30">
            <i data-lucide="sparkles" className="w-3.5 h-3.5"></i>
            <span>Real-time Financial Analytics</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-2">Dashboard Keuangan Real-Time</h1>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl">
            Ikhtisar posisi kas, grafik distribusi sumber dana, serta tren pengeluaran operasional panti asuhan secara dinamis dan transparan.
          </p>
        </div>

        {currentUser?.role === 'Pengurus Harian' && (
          <button
            onClick={() => onNavigateTab('transactions')}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl shadow-lg text-xs flex items-center space-x-2 transition-all whitespace-nowrap"
          >
            <i data-lucide="plus" className="w-4 h-4"></i>
            <span>Kelola & Catat Transaksi</span>
          </button>
        )}
      </div>

      {/* METRICS CARDS (3 Key Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Saldo Saat Ini */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Saldo Saat Ini (Kas & Bank)</span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <i data-lucide="wallet" className="w-6 h-6"></i>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            Rp {currentBalance.toLocaleString('id-ID')}
          </div>
          <div className="mt-3 flex items-center space-x-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-xl w-fit">
            <i data-lucide="check-circle" className="w-3.5 h-3.5"></i>
            <span>Status Kas Positif (Surplus)</span>
          </div>
        </div>

        {/* Card 2: Total Pemasukan */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Pemasukan Akumulasi</span>
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <i data-lucide="arrow-down-left" className="w-6 h-6"></i>
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 tracking-tight">
            Rp {totalIncome.toLocaleString('id-ID')}
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">
            Dari Donasi, Infak/Zakat, & Hibah APBD
          </div>
        </div>

        {/* Card 3: Total Pengeluaran */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Pengeluaran Akumulasi</span>
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <i data-lucide="arrow-up-right" className="w-6 h-6"></i>
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600 tracking-tight">
            Rp {totalExpense.toLocaleString('id-ID')}
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">
            Untuk Operasional, SPP, Konsumsi & Kesehatan
          </div>
        </div>

      </div>

      {/* VISUALIZATION CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Bar Chart - Tren Bulanan (8 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Tren Pemasukan vs Pengeluaran Bulanan</h2>
              <p className="text-xs text-slate-500">Perbandingan pemasukan & pengeluaran (Januari - Juli 2026)</p>
            </div>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
              Grafik Batang
            </span>
          </div>
          <div className="h-72 relative">
            <canvas ref={chartBarRef}></canvas>
          </div>
        </div>

        {/* Chart 2: Donut Chart - Proporsi Pengeluaran (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Proporsi Peruntukan Biaya</h2>
              <p className="text-xs text-slate-500">Alokasi pengeluaran berdasarkan kategori</p>
            </div>
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
              Donut Chart
            </span>
          </div>
          <div className="h-72 relative">
            <canvas ref={chartPieRef}></canvas>
          </div>
        </div>

      </div>

      {/* Rincian Pemasukan per Kategori Table Summary */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-sm font-extrabold text-slate-900 mb-3">Rincian Sumber Pemasukan Dana</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {incomeCategories.map((cat, idx) => (
            <div key={cat} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-bold text-slate-500">{cat}</div>
              <div className="text-lg font-black text-emerald-700 mt-1">
                Rp {incomeByCategory[idx].toLocaleString('id-ID')}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                {totalIncome > 0 ? Math.round((incomeByCategory[idx] / totalIncome) * 100) : 0}% dari total pemasukan
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

window.FinancialDashboard = FinancialDashboard;
