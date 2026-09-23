// Public Financial Dashboard
// Authoritative public source:
// GET /api/v1/financial-transparency?year=YYYY
//
// Security boundary:
// - Only verified donations are returned by backend.
// - Donor identity is already privacy-safe.
// - No phone, email, note, payment, gateway,
//   internal ledger, creator, or verifier data.

const PublicFinancialDashboard = () => {
  const categoryChartRef =
    React.useRef(null);

  const monthlyChartRef =
    React.useRef(null);

  const categoryChartInstance =
    React.useRef(null);

  const monthlyChartInstance =
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
    transparency,
    setTransparency,
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

  const destroyCharts =
    () => {
      if (
        categoryChartInstance
          .current
      ) {
        categoryChartInstance
          .current
          .destroy();

        categoryChartInstance.current =
          null;
      }

      if (
        monthlyChartInstance
          .current
      ) {
        monthlyChartInstance
          .current
          .destroy();

        monthlyChartInstance.current =
          null;
      }
    };

  const loadTransparency =
    React.useCallback(
      async (
        year
      ) => {
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
              .getPublicTransparency(
                year
              );

          /*
           * Ignore stale response
           * if user changes year quickly.
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
              'Server tidak mengembalikan data transparansi donasi.'
            );
          }

          setTransparency(
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
            'Failed to load public financial transparency:',
            requestError
          );

          setTransparency(
            null
          );

          setError(
            requestError
              ?.message ||
            'Data transparansi donasi gagal dimuat.'
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
      []
    );

  React.useEffect(
    () => {
      loadTransparency(
        selectedYear
      );
    },
    [
      selectedYear,
      loadTransparency,
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

  const formatRupiah =
    (
      value
    ) =>
      Number(
        value ||
        0
      ).toLocaleString(
        'id-ID'
      );

  const formatCompactRupiah =
    (
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
    transparency?.summary ||
    {
      total_donations: 0,
      donation_count: 0,
      average_donation: 0,
    };

  const totalDonations =
    Number(
      summary
        .total_donations ||
      0
    );

  const donationCount =
    Number(
      summary
        .donation_count ||
      0
    );

  const averageDonation =
    Number(
      summary
        .average_donation ||
      0
    );

  const donationsByAllocation =
    Array.isArray(
      transparency
        ?.donations_by_allocation
    )
      ? transparency
          .donations_by_allocation
      : [];

  const monthlyTrend =
    Array.isArray(
      transparency
        ?.monthly_trend
    )
      ? transparency
          .monthly_trend
      : [];

  const recentDonations =
    Array.isArray(
      transparency
        ?.recent_donations
    )
      ? transparency
          .recent_donations
      : [];

  const hasAllocationData =
    donationsByAllocation
      .some(
        (
          item
        ) =>
          Number(
            item.total_donations ||
            0
          ) >
          0
      );

  const hasMonthlyData =
    monthlyTrend
      .some(
        (
          item
        ) =>
          Number(
            item.total_donations ||
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
   * All chart data comes from
   * backend public transparency
   * aggregation.
   */
  React.useEffect(
    () => {
      destroyCharts();

      if (
        loading ||
        error ||
        !transparency ||
        !window.Chart
      ) {
        return undefined;
      }

      /*
       * Donation allocation chart.
       */
      if (
        categoryChartRef
          .current &&
        hasAllocationData
      ) {
        const context =
          categoryChartRef
            .current
            .getContext(
              '2d'
            );

        categoryChartInstance.current =
          new window.Chart(
            context,
            {
              type:
                'doughnut',

              data: {
                labels:
                  donationsByAllocation
                    .map(
                      (
                        item
                      ) =>
                        item
                          ?.allocation_category
                          ?.label ||
                        item
                          ?.allocation_category
                          ?.value ||
                        'Lainnya'
                    ),

                datasets: [
                  {
                    data:
                      donationsByAllocation
                        .map(
                          (
                            item
                          ) =>
                            Number(
                              item.total_donations ||
                              0
                            )
                        ),

                    backgroundColor: [
                      '#10b981',
                      '#14b8a6',
                      '#0ea5e9',
                      '#6366f1',
                      '#f59e0b',
                      '#ec4899',
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

                cutout:
                  '68%',

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
                        12,
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
              },
            }
          );
      }

      /*
       * Monthly verified donation chart.
       */
      if (
        monthlyChartRef
          .current
      ) {
        const context =
          monthlyChartRef
            .current
            .getContext(
              '2d'
            );

        monthlyChartInstance.current =
          new window.Chart(
            context,
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

                        return (
                          monthNames[
                            monthNumber -
                            1
                          ] ||
                          item.month
                        );
                      }
                    ),

                datasets: [
                  {
                    label:
                      'Donasi Terverifikasi',

                    data:
                      monthlyTrend
                        .map(
                          (
                            item
                          ) =>
                            Number(
                              item.total_donations ||
                              0
                            )
                        ),

                    backgroundColor:
                      '#10b981',

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
                          return ` Rp ${Number(
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

      return () => {
        destroyCharts();
      };
    },
    [
      transparency,
      loading,
      error,
      selectedYear,
    ]
  );

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
            Memuat Transparansi Donasi
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Mengambil donasi terverifikasi tahun {selectedYear}.
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
            Data transparansi gagal dimuat
          </h2>

          <p className="text-sm text-rose-700 mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              loadTransparency(
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
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold shadow-inner">
            <LucideIcon
              name="globe"
              className="w-4 h-4 text-emerald-400"
            />

            <span>
              Portal Transparansi Publik
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-3">
            Transparansi Donasi Terverifikasi
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
            Menampilkan ringkasan donasi yang telah diverifikasi oleh SIMK-Panti beserta kategori alokasi dan identitas donatur sesuai izin publikasi.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 min-w-[190px]">
            <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-extrabold">
              Total Donasi Terverifikasi
            </div>

            <div className="text-xl font-black text-white mt-1">
              Rp{' '}
              {formatRupiah(
                totalDonations
              )}
            </div>
          </div>

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
              className="ml-auto bg-slate-900/70 text-white border border-white/20 rounded-lg px-2 py-1 text-xs font-bold focus:outline-none"
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
        </div>
      </div>

      {/* Period + Privacy */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">

        <div className="text-xs text-slate-500">
          Periode:{' '}
          <span className="font-bold text-slate-800">
            {transparency
              ?.period
              ?.from ||
              `${selectedYear}-01-01`}
          </span>{' '}
          sampai{' '}
          <span className="font-bold text-slate-800">
            {transparency
              ?.period
              ?.to ||
              `${selectedYear}-12-31`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 flex items-center gap-2">
            <LucideIcon
              name="shield-check"
              className="w-4 h-4"
            />

            <span>
              Identitas privat otomatis ditampilkan sebagai <b>Hamba Allah</b>.
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              loadTransparency(
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
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Total */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
              Total Donasi
            </div>

            <div className="text-2xl font-black text-emerald-700 mt-1">
              Rp{' '}
              {formatRupiah(
                totalDonations
              )}
            </div>

            <p className="text-[11px] text-emerald-600 mt-1 font-medium">
              Donasi terverifikasi pada {selectedYear}
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <LucideIcon
              name="hand-heart"
              className="w-6 h-6"
            />
          </div>
        </div>

        {/* Count */}
        <div className="bg-teal-50 border border-teal-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs font-extrabold text-teal-800 uppercase tracking-wider">
              Jumlah Donasi
            </div>

            <div className="text-2xl font-black text-teal-700 mt-1">
              {donationCount.toLocaleString(
                'id-ID'
              )}{' '}
              Transaksi
            </div>

            <p className="text-[11px] text-teal-600 mt-1 font-medium">
              Hanya donasi berstatus terverifikasi
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
            <LucideIcon
              name="badge-check"
              className="w-6 h-6"
            />
          </div>
        </div>

        {/* Average */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 flex items-center justify-between shadow-sm border border-slate-800">
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Rata-Rata Donasi
            </div>

            <div className="text-2xl font-black text-amber-400 mt-1">
              Rp{' '}
              {formatRupiah(
                averageDonation
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Rata-rata nominal per transaksi
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center">
            <LucideIcon
              name="calculator"
              className="w-6 h-6"
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Monthly */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Donasi Terverifikasi per Bulan
              </h3>

              <p className="text-xs text-slate-500">
                Januari–Desember {selectedYear}
              </p>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              12 Bulan
            </span>
          </div>

          <div className="h-72 relative">
            <canvas
              ref={
                monthlyChartRef
              }
            />

            {!hasMonthlyData && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 rounded-xl px-4 py-2 text-xs text-slate-400 font-semibold">
                  Belum ada donasi pada {selectedYear}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Allocation Donut */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Alokasi Donasi
              </h3>

              <p className="text-xs text-slate-500">
                Proporsi donasi berdasarkan kategori alokasi
              </p>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-1 bg-teal-100 text-teal-800 rounded-full">
              Kategori
            </span>
          </div>

          <div className="h-72 relative">
            {hasAllocationData ? (
              <canvas
                ref={
                  categoryChartRef
                }
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                <LucideIcon
                  name="pie-chart"
                  className="w-9 h-9 text-slate-300"
                />

                <p className="text-xs font-bold text-slate-500 mt-3">
                  Belum ada alokasi donasi
                </p>

                <p className="text-[11px] mt-1">
                  Belum ada donasi terverifikasi pada tahun {selectedYear}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Allocation Breakdown */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Rincian per Kategori Alokasi Dana
            </h3>

            <p className="text-xs text-slate-500">
              Akumulasi nominal dan jumlah donasi pada masing-masing kategori.
            </p>
          </div>

          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 rounded-lg px-2.5 py-1">
            {donationsByAllocation
              .length}{' '}
            kategori
          </span>
        </div>

        {donationsByAllocation
          .length ===
        0 ? (
          <div className="text-center py-10 text-slate-400">
            <LucideIcon
              name="pie-chart"
              className="w-8 h-8 mx-auto mb-2 text-slate-300"
            />

            <p className="text-xs font-semibold">
              Belum ada donasi terverifikasi pada tahun {selectedYear}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {donationsByAllocation
              .map(
                (
                  item
                ) => {
                  const amount =
                    Number(
                      item.total_donations ||
                      0
                    );

                  const count =
                    Number(
                      item.donation_count ||
                      0
                    );

                  const percentage =
                    totalDonations >
                    0
                      ? Math.round(
                          (
                            amount /
                            totalDonations
                          ) *
                          100
                        )
                      : 0;

                  const label =
                    item
                      ?.allocation_category
                      ?.label ||
                    item
                      ?.allocation_category
                      ?.value ||
                    'Kategori';

                  return (
                    <div
                      key={
                        item
                          ?.allocation_category
                          ?.value ||
                        label
                      }
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-slate-800">
                            {
                              label
                            }
                          </div>

                          <div className="text-[10px] text-slate-400 mt-1">
                            {count.toLocaleString(
                              'id-ID'
                            )}{' '}
                            transaksi
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-black text-emerald-700">
                            Rp{' '}
                            {formatRupiah(
                              amount
                            )}
                          </div>

                          <div className="text-[10px] font-bold text-slate-400">
                            {
                              percentage
                            }%
                          </div>
                        </div>
                      </div>

                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{
                            width:
                              `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
          </div>
        )}
      </div>

      {/* Recent Verified Donations */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

        <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <LucideIcon
                name="list-checks"
                className="w-4 h-4 text-emerald-600"
              />

              <span>
                Donasi Terverifikasi Terbaru
              </span>
            </h3>

            <p className="text-[11px] text-slate-500 mt-1">
              Maksimal 10 donasi terbaru pada tahun terpilih.
            </p>
          </div>

          <div className="text-[10px] text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-1.5">
            <LucideIcon
              name="shield-check"
              className="w-3.5 h-3.5 text-emerald-600"
            />

            <span>
              Identitas mengikuti izin publikasi donatur
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">
                  Tanggal & Kode
                </th>

                <th className="py-3.5 px-4">
                  Kategori Alokasi
                </th>

                <th className="py-3.5 px-4">
                  Donatur
                </th>

                <th className="py-3.5 px-4">
                  Program
                </th>

                <th className="py-3.5 px-4 text-right">
                  Nominal Donasi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs font-medium">

              {recentDonations
                .length ===
              0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-12 text-slate-400"
                  >
                    <LucideIcon
                      name="file-search"
                      className="w-10 h-10 mx-auto mb-2 text-slate-300"
                    />

                    <p className="font-semibold">
                      Belum ada donasi terverifikasi pada tahun {selectedYear}.
                    </p>
                  </td>
                </tr>
              ) : (
                recentDonations
                  .map(
                    (
                      donation
                    ) => {
                      const categoryLabel =
                        donation
                          ?.allocation_category
                          ?.label ||
                        donation
                          ?.allocation_category
                          ?.value ||
                        '-';

                      const donorName =
                        donation
                          .donor_name ||
                        'Hamba Allah';

                      const campaign =
                        donation
                          .campaign;

                      return (
                        <tr
                          key={
                            donation
                              .public_id
                          }
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-bold text-slate-900">
                              {donation
                                .verified_date ||
                                '-'}
                            </div>

                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                              {
                                donation
                                  .public_id
                              }
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {
                                categoryLabel
                              }
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />

                              <span>
                                {
                                  donorName
                                }
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {campaign ? (
                              <div>
                                <div className="font-semibold text-slate-800">
                                  {
                                    campaign
                                      .title
                                  }
                                </div>

                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  {
                                    campaign
                                      .slug
                                  }
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400">
                                Donasi umum
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-right">
                            <div className="font-black text-sm text-emerald-700">
                              Rp{' '}
                              {formatRupiah(
                                donation
                                  .amount
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Public data boundary */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0">
          <LucideIcon
            name="shield-check"
            className="w-5 h-5"
          />
        </div>

        <div>
          <div className="text-xs font-extrabold text-slate-800">
            Perlindungan Data Donatur
          </div>

          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Portal publik hanya menampilkan informasi donasi yang telah diverifikasi dan diizinkan untuk dipublikasikan. Nomor telepon, email, catatan internal, informasi pembayaran, data gateway, petugas internal, dan financial ledger tidak ditampilkan pada halaman ini.
          </p>
        </div>
      </div>

    </div>
  );
};

window.PublicFinancialDashboard =
  PublicFinancialDashboard;