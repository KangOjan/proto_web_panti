// Financial Dashboard
// Authoritative source:
// GET /api/v1/pengurus/financial-dashboard?year=YYYY

const FinancialDashboard = ({
  currentUser,
  onNavigateTab,
}) => {
  const chartPieRef =
    React.useRef(null);

  const chartBarRef =
    React.useRef(null);

  const pieInstance =
    React.useRef(null);

  const barInstance =
    React.useRef(null);

  const requestSequence =
    React.useRef(0);

  const currentYear =
    new Date()
      .getFullYear();

  const [
    selectedYear,
    setSelectedYear,
  ] =
    React.useState(
      currentYear
    );

  const [
    dashboard,
    setDashboard,
  ] =
    React.useState(null);

  const [
    loading,
    setLoading,
  ] =
    React.useState(true);

  const [
    error,
    setError,
  ] =
    React.useState(null);

  /*
   * Internal dashboard endpoint
   * currently belongs to Pengurus Harian.
   */
  const canAccessDashboard =
    currentUser?.role ===
    'pengurus_harian';

  const destroyCharts = () => {
    if (
      pieInstance.current
    ) {
      pieInstance
        .current
        .destroy();

      pieInstance.current =
        null;
    }

    if (
      barInstance.current
    ) {
      barInstance
        .current
        .destroy();

      barInstance.current =
        null;
    }
  };

  const loadDashboard =
    React.useCallback(
      async (
        year
      ) => {
        if (
          !canAccessDashboard
        ) {
          setDashboard(
            null
          );

          setLoading(
            false
          );

          setError(
            null
          );

          destroyCharts();

          return;
        }

        const requestId =
          requestSequence
            .current + 1;

        requestSequence.current =
          requestId;

        try {
          destroyCharts();

          setLoading(
            true
          );

          setError(
            null
          );

          const response =
            await FinancialApi
              .getDashboard(
                year
              );

          /*
           * Ignore stale response
           * when year changes quickly.
           */
          if (
            requestSequence
              .current !==
            requestId
          ) {
            return;
          }

          if (
            !response?.data
          ) {
            throw new Error(
              'Server tidak mengembalikan data dashboard keuangan.'
            );
          }

          setDashboard(
            response.data
          );
        } catch (
          requestError
        ) {
          if (
            requestSequence
              .current !==
            requestId
          ) {
            return;
          }

          console.error(
            'Failed to load financial dashboard:',
            requestError
          );

          setDashboard(
            null
          );

          setError(
            requestError
              ?.message ||
            'Dashboard keuangan gagal dimuat.'
          );
        } finally {
          if (
            requestSequence
              .current ===
            requestId
          ) {
            setLoading(
              false
            );
          }
        }
      },
      [
        canAccessDashboard,
      ]
    );

  React.useEffect(
    () => {
      loadDashboard(
        selectedYear
      );
    },
    [
      selectedYear,
      loadDashboard,
    ]
  );

  React.useEffect(
    () => {
      return () => {
        requestSequence
          .current += 1;

        destroyCharts();
      };
    },
    []
  );

  const formatRupiah = (
    value
  ) =>
    Number(
      value ||
      0
    ).toLocaleString(
      'id-ID'
    );

  const formatCompactRupiah = (
    value
  ) => {
    const amount =
      Number(
        value ||
        0
      );

    if (
      Math.abs(
        amount
      ) >=
      1000000000
    ) {
      return (
        'Rp ' +
        (
          amount /
          1000000000
        ).toLocaleString(
          'id-ID',
          {
            maximumFractionDigits:
              1,
          }
        ) +
        ' M'
      );
    }

    if (
      Math.abs(
        amount
      ) >=
      1000000
    ) {
      return (
        'Rp ' +
        (
          amount /
          1000000
        ).toLocaleString(
          'id-ID',
          {
            maximumFractionDigits:
              1,
          }
        ) +
        ' Jt'
      );
    }

    if (
      Math.abs(
        amount
      ) >=
      1000
    ) {
      return (
        'Rp ' +
        (
          amount /
          1000
        ).toLocaleString(
          'id-ID',
          {
            maximumFractionDigits:
              0,
          }
        ) +
        ' Rb'
      );
    }

    return `Rp ${formatRupiah(
      amount
    )}`;
  };

  const summary =
    dashboard?.summary ||
    {
      total_income: 0,
      total_expense: 0,
      net_cash_flow: 0,
    };

  const totalIncome =
    Number(
      summary
        .total_income ||
      0
    );

  const totalExpense =
    Number(
      summary
        .total_expense ||
      0
    );

  const netCashFlow =
    Number(
      summary
        .net_cash_flow ||
      0
    );

  const incomeByCategory =
    Array.isArray(
      dashboard
        ?.income_by_category
    )
      ? dashboard
          .income_by_category
      : [];

  const expenseByCategory =
    Array.isArray(
      dashboard
        ?.expense_by_category
    )
      ? dashboard
          .expense_by_category
      : [];

  const monthlyTrend =
    Array.isArray(
      dashboard
        ?.monthly_trend
    )
      ? dashboard
          .monthly_trend
      : [];

  const hasExpenseData =
    expenseByCategory
      .some(
        (item) =>
          Number(
            item.total ||
            0
          ) >
          0
      );

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  const yearOptions =
    Array.from(
      {
        length: 11,
      },
      (
        _,
        index
      ) =>
        currentYear -
        index
    );

  /*
   * Chart.js lifecycle.
   *
   * Charts only use aggregation
   * returned by backend.
   */
  React.useEffect(
    () => {
      destroyCharts();

      if (
        loading ||
        error ||
        !dashboard ||
        !window.Chart
      ) {
        return undefined;
      }

      /*
       * Monthly income / expense chart.
       */
      if (
        chartBarRef
          .current
      ) {
        const barContext =
          chartBarRef
            .current
            .getContext(
              '2d'
            );

        barInstance.current =
          new window.Chart(
            barContext,
            {
              type:
                'bar',

              data: {
                labels:
                  monthlyTrend
                    .map(
                      (
                        item
                      ) => {
                        const monthNumber =
                          Number(
                            item.month_number
                          );

                        return `${
                          monthNames[
                            monthNumber -
                            1
                          ] ||
                          item.month
                        } ${String(
                          selectedYear
                        ).slice(
                          -2
                        )}`;
                      }
                    ),

                datasets: [
                  {
                    label:
                      'Pemasukan',

                    data:
                      monthlyTrend
                        .map(
                          (
                            item
                          ) =>
                            Number(
                              item.income ||
                              0
                            )
                        ),

                    backgroundColor:
                      '#10b981',

                    borderRadius:
                      8,
                  },

                  {
                    label:
                      'Pengeluaran',

                    data:
                      monthlyTrend
                        .map(
                          (
                            item
                          ) =>
                            Number(
                              item.expense ||
                              0
                            )
                        ),

                    backgroundColor:
                      '#f43f5e',

                    borderRadius:
                      8,
                  },
                ],
              },

              options: {
                responsive:
                  true,

                maintainAspectRatio:
                  false,

                plugins: {
                  legend: {
                    position:
                      'top',

                    labels: {
                      font: {
                        family:
                          'Plus Jakarta Sans',

                        size:
                          11,

                        weight:
                          'bold',
                      },
                    },
                  },

                  tooltip: {
                    callbacks: {
                      label:
                        function (
                          context
                        ) {
                          return ` ${
                            context
                              .dataset
                              .label
                          }: Rp ${Number(
                            context.raw ||
                            0
                          ).toLocaleString(
                            'id-ID'
                          )}`;
                        },
                    },
                  },
                },

                scales: {
                  y: {
                    beginAtZero:
                      true,

                    ticks: {
                      callback:
                        function (
                          value
                        ) {
                          return formatCompactRupiah(
                            value
                          );
                        },

                      font: {
                        family:
                          'Plus Jakarta Sans',

                        size:
                          10,
                      },
                    },
                  },

                  x: {
                    ticks: {
                      font: {
                        family:
                          'Plus Jakarta Sans',

                        size:
                          10,

                        weight:
                          'bold',
                      },
                    },
                  },
                },
              },
            }
          );
      }

      /*
       * Expense category donut.
       */
      if (
        chartPieRef
          .current &&
        hasExpenseData
      ) {
        const pieContext =
          chartPieRef
            .current
            .getContext(
              '2d'
            );

        pieInstance.current =
          new window.Chart(
            pieContext,
            {
              type:
                'doughnut',

              data: {
                labels:
                  expenseByCategory
                    .map(
                      (
                        item
                      ) =>
                        item
                          ?.category
                          ?.label ||
                        item
                          ?.category
                          ?.value ||
                        'Lainnya'
                    ),

                datasets: [
                  {
                    data:
                      expenseByCategory
                        .map(
                          (
                            item
                          ) =>
                            Number(
                              item.total ||
                              0
                            )
                        ),

                    backgroundColor: [
                      '#0d9488',
                      '#6366f1',
                      '#f59e0b',
                      '#ec4899',
                      '#64748b',
                      '#14b8a6',
                      '#8b5cf6',
                    ],

                    borderWidth:
                      2,

                    borderColor:
                      '#ffffff',
                  },
                ],
              },

              options: {
                responsive:
                  true,

                maintainAspectRatio:
                  false,

                plugins: {
                  legend: {
                    position:
                      'bottom',

                    labels: {
                      font: {
                        family:
                          'Plus Jakarta Sans',

                        size:
                          11,

                        weight:
                          'bold',
                      },

                      padding:
                        14,
                    },
                  },

                  tooltip: {
                    callbacks: {
                      label:
                        function (
                          context
                        ) {
                          const value =
                            Number(
                              context.raw ||
                              0
                            );

                          return ` Rp ${value.toLocaleString(
                            'id-ID'
                          )}`;
                        },
                    },
                  },
                },

                cutout:
                  '70%',
              },
            }
          );
      }

      return () => {
        destroyCharts();
      };
    },
    [
      dashboard,
      loading,
      error,
      selectedYear,
    ]
  );

  /*
   * Backend endpoint belum diberikan
   * ke role Pemimpin Lembaga pada fase ini.
   */
  if (
    !canAccessDashboard
  ) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <LucideIcon
              name="shield-alert"
              className="w-6 h-6"
            />
          </div>

          <h2 className="text-lg font-extrabold text-slate-900 mt-4">
            Dashboard Keuangan Internal
          </h2>

          <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            Endpoint dashboard internal saat ini tersedia untuk Pengurus Harian. Dukungan read-only untuk Pemimpin Lembaga akan ditambahkan pada fase role terkait.
          </p>
        </div>
      </div>
    );
  }

  if (
    loading
  ) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">
          <LucideIcon
            name="loader-circle"
            className="w-9 h-9 mx-auto text-emerald-600 animate-spin"
          />

          <h2 className="text-base font-extrabold text-slate-900 mt-4">
            Memuat Dashboard Keuangan
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Mengambil agregasi tahun {selectedYear} dari backend SIMK-Panti.
          </p>
        </div>
      </div>
    );
  }

  if (
    error
  ) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <LucideIcon
              name="circle-alert"
              className="w-6 h-6"
            />
          </div>

          <h2 className="text-lg font-extrabold text-slate-900 mt-4">
            Dashboard gagal dimuat
          </h2>

          <p className="text-sm text-rose-700 mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              loadDashboard(
                selectedYear
              )
            }
            className="mt-5 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <LucideIcon
              name="refresh-cw"
              className="w-4 h-4"
            />

            <span>
              Coba Lagi
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">

        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-300 border border-emerald-500/30">
            <LucideIcon
              name="chart-no-axes-combined"
              className="w-3.5 h-3.5"
            />

            <span>
              Financial Ledger Analytics
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight mt-2">
            Dashboard Keuangan
          </h1>

          <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl">
            Agregasi pemasukan, pengeluaran, dan arus kas bersih berdasarkan transaksi yang tercatat pada ledger SIMK-Panti.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">

          {/* Year selector */}
          <div className="bg-white/10 border border-white/15 rounded-2xl px-3 py-2 flex items-center gap-2">
            <LucideIcon
              name="calendar-days"
              className="w-4 h-4 text-emerald-300"
            />

            <label className="text-xs font-bold text-emerald-100">
              Tahun
            </label>

            <select
              value={
                selectedYear
              }
              onChange={(
                event
              ) =>
                setSelectedYear(
                  Number(
                    event.target
                      .value
                  )
                )
              }
              className="bg-slate-900/70 text-white border border-white/20 rounded-lg px-2 py-1 text-xs font-bold focus:outline-none"
            >
              {yearOptions.map(
                (
                  year
                ) => (
                  <option
                    key={
                      year
                    }
                    value={
                      year
                    }
                    className="text-slate-900 bg-white"
                  >
                    {year}
                  </option>
                )
              )}
            </select>
          </div>

          <button
            type="button"
            onClick={() =>
              onNavigateTab(
                'transactions'
              )
            }
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl shadow-lg text-xs flex items-center justify-center space-x-2 transition-all whitespace-nowrap"
          >
            <LucideIcon
              name="plus"
              className="w-4 h-4"
            />

            <span>
              Kelola & Catat Transaksi
            </span>
          </button>
        </div>
      </div>

      {/* Period */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          Periode laporan:{' '}
          <span className="font-bold text-slate-800">
            {dashboard
              ?.period
              ?.from ||
              `${selectedYear}-01-01`}
          </span>{' '}
          sampai{' '}
          <span className="font-bold text-slate-800">
            {dashboard
              ?.period
              ?.to ||
              `${selectedYear}-12-31`}
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            loadDashboard(
              selectedYear
            )
          }
          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5"
        >
          <LucideIcon
            name="refresh-cw"
            className="w-3.5 h-3.5"
          />

          Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Net Cash Flow */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Arus Kas Bersih {selectedYear}
            </span>

            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              <LucideIcon
                name="wallet"
                className="w-6 h-6"
              />
            </div>
          </div>

          <div
            className={`text-3xl font-black tracking-tight ${
              netCashFlow >=
              0
                ? 'text-emerald-700'
                : 'text-rose-700'
            }`}
          >
            Rp{' '}
            {formatRupiah(
              netCashFlow
            )}
          </div>

          <div
            className={`mt-3 flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl w-fit ${
              netCashFlow >=
              0
                ? 'text-emerald-700 bg-emerald-50'
                : 'text-rose-700 bg-rose-50'
            }`}
          >
            <LucideIcon
              name={
                netCashFlow >=
                0
                  ? 'trending-up'
                  : 'trending-down'
              }
              className="w-3.5 h-3.5"
            />

            <span>
              {netCashFlow >=
              0
                ? 'Surplus periode'
                : 'Defisit periode'}
            </span>
          </div>

          <p className="text-[10px] text-slate-400 mt-3">
            Bukan saldo kas aktual. Nilai ini adalah pemasukan dikurangi pengeluaran pada periode terpilih.
          </p>
        </div>

        {/* Income */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Total Pemasukan {selectedYear}
            </span>

            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <LucideIcon
                name="arrow-down-left"
                className="w-6 h-6"
              />
            </div>
          </div>

          <div className="text-3xl font-black text-emerald-600 tracking-tight">
            Rp{' '}
            {formatRupiah(
              totalIncome
            )}
          </div>

          <div className="mt-3 text-xs text-slate-500 font-medium">
            Berdasarkan seluruh pemasukan ledger pada tahun terpilih.
          </div>
        </div>

        {/* Expense */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Total Pengeluaran {selectedYear}
            </span>

            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <LucideIcon
                name="arrow-up-right"
                className="w-6 h-6"
              />
            </div>
          </div>

          <div className="text-3xl font-black text-rose-600 tracking-tight">
            Rp{' '}
            {formatRupiah(
              totalExpense
            )}
          </div>

          <div className="mt-3 text-xs text-slate-500 font-medium">
            Berdasarkan seluruh pengeluaran ledger pada tahun terpilih.
          </div>
        </div>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Monthly */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Tren Pemasukan vs Pengeluaran Bulanan
              </h2>

              <p className="text-xs text-slate-500">
                Januari–Desember {selectedYear}
              </p>
            </div>

            <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
              12 Bulan
            </span>
          </div>

          <div className="h-72 relative">
            <canvas
              ref={
                chartBarRef
              }
            />
          </div>
        </div>

        {/* Expense donut */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Proporsi Pengeluaran
              </h2>

              <p className="text-xs text-slate-500">
                Berdasarkan kategori pengeluaran
              </p>
            </div>

            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
              Kategori
            </span>
          </div>

          <div className="h-72 relative">
            {hasExpenseData ? (
              <canvas
                ref={
                  chartPieRef
                }
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                <LucideIcon
                  name="chart-pie"
                  className="w-9 h-9 text-slate-300"
                />

                <p className="text-xs font-bold text-slate-500 mt-3">
                  Belum ada pengeluaran
                </p>

                <p className="text-[11px] mt-1">
                  Tidak ada data kategori pengeluaran pada {selectedYear}.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Income Categories */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Rincian Sumber Pemasukan Dana
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Agregasi kategori pemasukan langsung dari financial ledger.
            </p>
          </div>

          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {incomeByCategory
              .reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  Number(
                    item.transaction_count ||
                    0
                  ),
                0
              )}{' '}
            transaksi
          </span>
        </div>

        {incomeByCategory
          .length ===
        0 ? (
          <div className="py-8 text-center text-slate-400">
            <LucideIcon
              name="inbox"
              className="w-8 h-8 mx-auto text-slate-300"
            />

            <p className="text-xs mt-2">
              Belum ada pemasukan pada tahun {selectedYear}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {incomeByCategory.map(
              (
                item
              ) => {
                const amount =
                  Number(
                    item.total ||
                    0
                  );

                const percentage =
                  totalIncome >
                  0
                    ? Math.round(
                        (
                          amount /
                          totalIncome
                        ) *
                        100
                      )
                    : 0;

                return (
                  <div
                    key={
                      item
                        ?.category
                        ?.value ||
                      item
                        ?.category
                        ?.label
                    }
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="text-xs font-bold text-slate-500">
                      {item
                        ?.category
                        ?.label ||
                        item
                          ?.category
                          ?.value ||
                        'Kategori'}
                    </div>

                    <div className="text-lg font-black text-emerald-700 mt-1">
                      Rp{' '}
                      {formatRupiah(
                        amount
                      )}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                      {percentage}% dari total pemasukan
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1">
                      {Number(
                        item.transaction_count ||
                        0
                      )}{' '}
                      transaksi
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* Expense Categories */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Rincian Pengeluaran per Kategori
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Jumlah dan proporsi pengeluaran pada periode terpilih.
            </p>
          </div>
        </div>

        {expenseByCategory
          .length ===
        0 ? (
          <div className="py-8 text-center text-slate-400">
            <LucideIcon
              name="inbox"
              className="w-8 h-8 mx-auto text-slate-300"
            />

            <p className="text-xs mt-2">
              Belum ada pengeluaran pada tahun {selectedYear}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {expenseByCategory.map(
              (
                item
              ) => {
                const amount =
                  Number(
                    item.total ||
                    0
                  );

                const percentage =
                  totalExpense >
                  0
                    ? Math.round(
                        (
                          amount /
                          totalExpense
                        ) *
                        100
                      )
                    : 0;

                return (
                  <div
                    key={
                      item
                        ?.category
                        ?.value ||
                      item
                        ?.category
                        ?.label
                    }
                    className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100"
                  >
                    <div className="text-xs font-bold text-slate-600">
                      {item
                        ?.category
                        ?.label ||
                        item
                          ?.category
                          ?.value ||
                        'Kategori'}
                    </div>

                    <div className="text-lg font-black text-rose-700 mt-1">
                      Rp{' '}
                      {formatRupiah(
                        amount
                      )}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                      {percentage}% dari total pengeluaran
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1">
                      {Number(
                        item.transaction_count ||
                        0
                      )}{' '}
                      transaksi
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

    </div>
  );
};

window.FinancialDashboard =
  FinancialDashboard;