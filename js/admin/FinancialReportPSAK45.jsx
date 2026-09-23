// Financial Activity Report
// Authoritative source:
// GET /api/v1/pengurus/financial-transactions
//
// Compatibility note:
// The filename/component name is retained to avoid
// breaking the existing application wiring.
//
// This screen is an operational financial summary.
// It does NOT claim audited PSAK / ISAK compliance
// and does NOT calculate an opening cash balance.

const FinancialReportPSAK45 = ({
  currentUser,
}) => {
  const currentDate =
    new Date();

  const currentYear =
    currentDate
      .getFullYear();

  const currentMonth =
    String(
      currentDate
        .getMonth() + 1
    ).padStart(
      2,
      '0'
    );

  const [
    periodType,
    setPeriodType,
  ] =
    React.useState(
      'monthly'
    );

  const [
    selectedMonth,
    setSelectedMonth,
  ] =
    React.useState(
      `${currentYear}-${currentMonth}`
    );

  const [
    selectedYear,
    setSelectedYear,
  ] =
    React.useState(
      String(
        currentYear
      )
    );

  const [
    transactions,
    setTransactions,
  ] =
    React.useState([]);

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

  const requestSequence =
    React.useRef(0);

  const canAccessReport =
    currentUser?.role ===
    'pengurus_harian';

  const padNumber = (
    value
  ) =>
    String(
      value
    ).padStart(
      2,
      '0'
    );

  const getMonthRange = (
    yearMonth
  ) => {
    const [
      year,
      month,
    ] =
      yearMonth
        .split('-')
        .map(Number);

    const lastDay =
      new Date(
        year,
        month,
        0
      ).getDate();

    return {
      from:
        `${year}-${padNumber(
          month
        )}-01`,

      to:
        `${year}-${padNumber(
          month
        )}-${padNumber(
          lastDay
        )}`,
    };
  };

  const getYearRange = (
    year
  ) => ({
    from:
      `${year}-01-01`,

    to:
      `${year}-12-31`,
  });

  const getSelectedRange =
    React.useCallback(
      () => {
        if (
          periodType ===
          'monthly'
        ) {
          return getMonthRange(
            selectedMonth
          );
        }

        return getYearRange(
          selectedYear
        );
      },
      [
        periodType,
        selectedMonth,
        selectedYear,
      ]
    );

  /*
   * Fetch every page so the report
   * is not accidentally calculated
   * from only the first API page.
   */
  const fetchAllTransactions =
    React.useCallback(
      async (
        range
      ) => {
        let page = 1;

        let lastPage = 1;

        const collected =
          [];

        do {
          const response =
            await FinancialApi
              .getTransactions({
                page,

                from:
                  range.from,

                to:
                  range.to,
              });

          const items =
            Array.isArray(
              response
                ?.data
                ?.items
            )
              ? response
                  .data
                  .items
              : [];

          items.forEach(
            (
              transaction
            ) => {
              collected.push(
                FinancialApi
                  .normalizeTransaction(
                    transaction
                  )
              );
            }
          );

          lastPage =
            Number(
              response
                ?.data
                ?.pagination
                ?.last_page ||
              1
            );

          page += 1;

          /*
           * Defensive guard.
           *
           * Prevent infinite loops
           * if a malformed pagination
           * response is returned.
           */
          if (
            page >
            10000
          ) {
            throw new Error(
              'Pagination laporan tidak valid.'
            );
          }
        } while (
          page <=
          lastPage
        );

        return collected;
      },
      []
    );

  const loadReport =
    React.useCallback(
      async () => {
        if (
          !canAccessReport
        ) {
          setTransactions(
            []
          );

          setLoading(
            false
          );

          setError(
            null
          );

          return;
        }

        const requestId =
          requestSequence
            .current + 1;

        requestSequence.current =
          requestId;

        try {
          setLoading(
            true
          );

          setError(
            null
          );

          const range =
            getSelectedRange();

          const data =
            await fetchAllTransactions(
              range
            );

          if (
            requestSequence
              .current !==
            requestId
          ) {
            return;
          }

          setTransactions(
            data
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
            'Failed to load financial report:',
            requestError
          );

          setTransactions(
            []
          );

          setError(
            requestError
              ?.message ||
            'Laporan keuangan gagal dimuat.'
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
        canAccessReport,
        getSelectedRange,
        fetchAllTransactions,
      ]
    );

  React.useEffect(
    () => {
      loadReport();
    },
    [
      loadReport,
    ]
  );

  React.useEffect(
    () => {
      return () => {
        requestSequence
          .current += 1;
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

  const incomeTransactions =
    transactions.filter(
      (
        transaction
      ) =>
        transaction.type ===
        'pemasukan'
    );

  const expenseTransactions =
    transactions.filter(
      (
        transaction
      ) =>
        transaction.type ===
        'pengeluaran'
    );

  const totalIncome =
    incomeTransactions.reduce(
      (
        total,
        transaction
      ) =>
        total +
        Number(
          transaction.amount ||
          0
        ),
      0
    );

  const totalExpense =
    expenseTransactions.reduce(
      (
        total,
        transaction
      ) =>
        total +
        Number(
          transaction.amount ||
          0
        ),
      0
    );

  const netCashFlow =
    totalIncome -
    totalExpense;

  /*
   * Group dynamically.
   *
   * Do not assume only four
   * income categories or five
   * expense categories.
   */
  const groupByCategory = (
    items
  ) => {
    const grouped =
      new Map();

    items.forEach(
      (
        transaction
      ) => {
        const label =
          transaction
            .category ||
          'Lainnya';

        const existing =
          grouped.get(
            label
          ) || {
            category:
              label,

            amount:
              0,

            count:
              0,
          };

        existing.amount +=
          Number(
            transaction.amount ||
            0
          );

        existing.count +=
          1;

        grouped.set(
          label,
          existing
        );
      }
    );

    return Array.from(
      grouped.values()
    ).sort(
      (
        first,
        second
      ) =>
        second.amount -
        first.amount
    );
  };

  const incomeCategories =
    groupByCategory(
      incomeTransactions
    );

  const expenseCategories =
    groupByCategory(
      expenseTransactions
    );

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const selectedMonthNumber =
    Number(
      selectedMonth
        .split('-')[1]
    );

  const selectedMonthYear =
    selectedMonth
      .split('-')[0];

  const periodLabel =
    periodType ===
    'monthly'
      ? `${
          monthNames[
            selectedMonthNumber -
            1
          ]
        } ${selectedMonthYear}`
      : `Tahun ${selectedYear}`;

  const selectedRange =
    getSelectedRange();

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

  const monthOptions =
    monthNames.map(
      (
        monthName,
        index
      ) => ({
        value:
          `${selectedYear}-${padNumber(
            index + 1
          )}`,

        label:
          `${monthName} ${selectedYear}`,
      })
    );

  const handlePeriodTypeChange =
    (
      newType
    ) => {
      setPeriodType(
        newType
      );

      if (
        newType ===
        'monthly'
      ) {
        const month =
          selectedMonth
            .split('-')[1] ||
          '01';

        setSelectedMonth(
          `${selectedYear}-${month}`
        );
      }
    };

  const handleYearChange =
    (
      year
    ) => {
      setSelectedYear(
        year
      );

      const month =
        selectedMonth
          .split('-')[1] ||
        '01';

      setSelectedMonth(
        `${year}-${month}`
      );
    };

  const handleTriggerPrint =
    () => {
      window.print();
    };

  if (
    !canAccessReport
  ) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <LucideIcon
              name="shield-alert"
              className="w-6 h-6"
            />
          </div>

          <h2 className="text-lg font-extrabold text-slate-900 mt-4">
            Laporan Keuangan Internal
          </h2>

          <p className="text-sm text-slate-600 mt-2">
            Laporan internal saat ini hanya tersedia untuk Pengurus Harian.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in space-y-6">

      {/* Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 no-print flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-300">
              Financial Ledger Report
            </span>

            <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-200">
              Ringkasan Operasional
            </span>
          </div>

          <h1 className="text-xl font-extrabold text-slate-900 mt-2">
            Cetak Laporan Aktivitas Keuangan
          </h1>

          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Laporan dibuat dari transaksi financial ledger SIMK-Panti. Dokumen ini tidak menyatakan audit atau kepatuhan PSAK/ISAK secara otomatis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          {/* Period Type */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() =>
                handlePeriodTypeChange(
                  'monthly'
                )
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodType ===
                'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              Bulanan
            </button>

            <button
              type="button"
              onClick={() =>
                handlePeriodTypeChange(
                  'yearly'
                )
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodType ===
                'yearly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              Tahunan
            </button>
          </div>

          {/* Year */}
          <select
            value={
              selectedYear
            }
            onChange={(
              event
            ) =>
              handleYearChange(
                event.target
                  .value
              )
            }
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
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
                >
                  Tahun {year}
                </option>
              )
            )}
          </select>

          {/* Month */}
          {periodType ===
            'monthly' && (
            <select
              value={
                selectedMonth
              }
              onChange={(
                event
              ) =>
                setSelectedMonth(
                  event.target
                    .value
                )
              }
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
            >
              {monthOptions.map(
                (
                  option
                ) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                )
              )}
            </select>
          )}

          <button
            type="button"
            disabled={
              loading
            }
            onClick={
              loadReport
            }
            className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center space-x-2 disabled:opacity-50"
          >
            <LucideIcon
              name={
                loading
                  ? 'loader-circle'
                  : 'refresh-cw'
              }
              className={`w-4 h-4 ${
                loading
                  ? 'animate-spin'
                  : ''
              }`}
            />

            <span>
              Refresh
            </span>
          </button>

          <button
            type="button"
            disabled={
              loading ||
              Boolean(
                error
              )
            }
            onClick={
              handleTriggerPrint
            }
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md text-xs flex items-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LucideIcon
              name="printer"
              className="w-4 h-4 text-emerald-400"
            />

            <span>
              Cetak PDF
            </span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center no-print">
          <LucideIcon
            name="loader-circle"
            className="w-8 h-8 mx-auto text-emerald-600 animate-spin"
          />

          <p className="text-xs font-bold text-slate-600 mt-3">
            Memuat seluruh transaksi periode {periodLabel}...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 no-print">
          <div className="flex items-start gap-3">
            <LucideIcon
              name="circle-alert"
              className="w-5 h-5 text-rose-600 shrink-0"
            />

            <div>
              <div className="text-xs font-extrabold text-rose-800">
                Laporan gagal dimuat
              </div>

              <div className="text-xs text-rose-700 mt-1">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading &&
        !error && (
        <>
          {/* Printable Report */}
          <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200 printable-area text-slate-900 space-y-6">

            {/* Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <h2 className="text-xl font-black uppercase tracking-wider text-slate-900">
                SIMK-PANTI ASUHAN KASIH BUNDA
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Ringkasan Aktivitas Keuangan Berdasarkan Financial Ledger
              </p>

              <h3 className="text-base font-extrabold text-emerald-800 uppercase tracking-tight mt-3">
                LAPORAN AKTIVITAS KEUANGAN
              </h3>

              <p className="text-xs font-semibold text-slate-500">
                PERIODE: {periodLabel}
              </p>

              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                {selectedRange.from}
                {' '}
                s.d.
                {' '}
                {selectedRange.to}
              </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                <div className="text-[10px] uppercase font-bold text-emerald-700">
                  Total Pemasukan
                </div>

                <div className="text-sm font-black text-emerald-800 mt-1">
                  Rp{' '}
                  {formatRupiah(
                    totalIncome
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-rose-50 border border-rose-100 p-3">
                <div className="text-[10px] uppercase font-bold text-rose-700">
                  Total Pengeluaran
                </div>

                <div className="text-sm font-black text-rose-800 mt-1">
                  Rp{' '}
                  {formatRupiah(
                    totalExpense
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-slate-100 border border-slate-200 p-3">
                <div className="text-[10px] uppercase font-bold text-slate-600">
                  Arus Kas Bersih
                </div>

                <div
                  className={`text-sm font-black mt-1 ${
                    netCashFlow >=
                    0
                      ? 'text-emerald-800'
                      : 'text-rose-800'
                  }`}
                >
                  Rp{' '}
                  {formatRupiah(
                    netCashFlow
                  )}
                </div>
              </div>
            </div>

            {/* Income */}
            <div>
              <div className="bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-slate-800 uppercase tracking-wider border-l-4 border-emerald-600 mb-2">
                I. PEMASUKAN
              </div>

              <table className="w-full text-xs border-collapse">
                <tbody>
                  {incomeCategories
                    .length ===
                  0 ? (
                    <tr>
                      <td className="py-3 pl-4 text-slate-400">
                        Tidak ada pemasukan pada periode ini.
                      </td>

                      <td className="py-3 text-right font-semibold">
                        Rp 0
                      </td>
                    </tr>
                  ) : (
                    incomeCategories.map(
                      (
                        item,
                        index
                      ) => (
                        <tr
                          key={
                            item.category
                          }
                          className="border-b border-slate-100"
                        >
                          <td className="py-2 pl-4 text-slate-700">
                            {index + 1}.{' '}
                            {
                              item.category
                            }

                            <span className="text-[9px] text-slate-400 ml-2">
                              ({item.count}{' '}
                              transaksi)
                            </span>
                          </td>

                          <td className="py-2 text-right font-semibold">
                            Rp{' '}
                            {formatRupiah(
                              item.amount
                            )}
                          </td>
                        </tr>
                      )
                    )
                  )}

                  <tr className="font-extrabold bg-emerald-50 text-emerald-950">
                    <td className="py-2.5 pl-4">
                      TOTAL PEMASUKAN (A)
                    </td>

                    <td className="py-2.5 text-right text-sm">
                      Rp{' '}
                      {formatRupiah(
                        totalIncome
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Expense */}
            <div>
              <div className="bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-slate-800 uppercase tracking-wider border-l-4 border-rose-600 mb-2">
                II. PENGELUARAN
              </div>

              <table className="w-full text-xs border-collapse">
                <tbody>
                  {expenseCategories
                    .length ===
                  0 ? (
                    <tr>
                      <td className="py-3 pl-4 text-slate-400">
                        Tidak ada pengeluaran pada periode ini.
                      </td>

                      <td className="py-3 text-right font-semibold">
                        Rp 0
                      </td>
                    </tr>
                  ) : (
                    expenseCategories.map(
                      (
                        item,
                        index
                      ) => (
                        <tr
                          key={
                            item.category
                          }
                          className="border-b border-slate-100"
                        >
                          <td className="py-2 pl-4 text-slate-700">
                            {index + 1}.{' '}
                            {
                              item.category
                            }

                            <span className="text-[9px] text-slate-400 ml-2">
                              ({item.count}{' '}
                              transaksi)
                            </span>
                          </td>

                          <td className="py-2 text-right font-semibold">
                            Rp{' '}
                            {formatRupiah(
                              item.amount
                            )}
                          </td>
                        </tr>
                      )
                    )
                  )}

                  <tr className="font-extrabold bg-rose-50 text-rose-950">
                    <td className="py-2.5 pl-4">
                      TOTAL PENGELUARAN (B)
                    </td>

                    <td className="py-2.5 text-right text-sm">
                      Rp{' '}
                      {formatRupiah(
                        totalExpense
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Net */}
            <div className="border border-slate-300 rounded-2xl p-4 bg-slate-50">
              <div className="flex justify-between gap-4 text-sm font-extrabold text-slate-900">
                <span>
                  ARUS KAS BERSIH PERIODE (A - B)
                </span>

                <span
                  className={
                    netCashFlow >=
                    0
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }
                >
                  Rp{' '}
                  {formatRupiah(
                    netCashFlow
                  )}
                </span>
              </div>

              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                Nilai ini merupakan selisih pemasukan dan pengeluaran pada periode yang dipilih. Nilai ini bukan saldo kas/bank aktual karena sistem belum memiliki saldo awal authoritative.
              </p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-8 text-xs pt-4">

              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">
                  Disiapkan Oleh
                </div>

                <div className="font-extrabold text-slate-900 mt-1">
                  {currentUser
                    ?.name ||
                    currentUser
                      ?.username ||
                    'Pengurus Harian'}
                </div>

                <div className="text-[10px] text-slate-500">
                  Pengurus Harian
                </div>
              </div>

              <div className="text-right">
                <div className="text-slate-400 text-[10px] uppercase font-bold">
                  Jumlah Record
                </div>

                <div className="font-extrabold text-slate-900 mt-1">
                  {transactions
                    .length
                    .toLocaleString(
                      'id-ID'
                    )}{' '}
                  transaksi
                </div>

                <div className="text-[10px] text-slate-500">
                  Financial ledger
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-[9px] text-slate-400 text-center border-t border-slate-200 pt-3 font-mono leading-relaxed">
              Dokumen dibuat oleh SIMK-Panti pada{' '}
              {new Date()
                .toLocaleString(
                  'id-ID'
                )}
              . Data bersumber dari financial ledger internal pada periode yang dipilih.
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 no-print flex items-start gap-3">
            <LucideIcon
              name="triangle-alert"
              className="w-5 h-5 text-amber-700 shrink-0 mt-0.5"
            />

            <div>
              <div className="text-xs font-extrabold text-amber-900">
                Batas Interpretasi Laporan
              </div>

              <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                Laporan ini merupakan ringkasan operasional dari financial ledger. Sistem belum menyimpan saldo awal kas/bank, rekonsiliasi rekening, atau bukti audit yang diperlukan untuk menyatakan laporan ini sebagai laporan keuangan terverifikasi sesuai standar akuntansi tertentu.
              </p>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

window.FinancialReportPSAK45 =
  FinancialReportPSAK45;