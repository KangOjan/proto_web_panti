// Financial Transaction Management
// Backend source: /api/v1/pengurus/financial-transactions

const TransactionManagement = ({
  transactions,
  currentUser,
  transactionLoading = false,
  transactionError = null,
  transactionPagination = null,
  transactionRefreshKey = 0,
  onLoadTransactions,
  onOpenAddModal,
  onOpenEditModal,
  onConfirmDeleteTrx,
  onPrintTransactionReceipt,
}) => {
  const [
    filterType,
    setFilterType,
  ] =
    React.useState(
      'ALL'
    );

  const [
    filterCategory,
    setFilterCategory,
  ] =
    React.useState(
      'ALL'
    );

  const [
    searchQuery,
    setSearchQuery,
  ] =
    React.useState('');

  const [
    startDate,
    setStartDate,
  ] =
    React.useState('');

  const [
    endDate,
    setEndDate,
  ] =
    React.useState('');

  const [
    page,
    setPage,
  ] =
    React.useState(1);

  const categoryOptions = [
    {
      value:
        'donation_routine',
      label:
        'Donasi Rutin',
      types: [
        'income',
      ],
    },
    {
      value:
        'infak_zakat',
      label:
        'Infak/Zakat',
      types: [
        'income',
      ],
    },
    {
      value:
        'government_grant',
      label:
        'Bantuan Pemerintah/APBD',
      types: [
        'income',
      ],
    },
    {
      value:
        'other_income',
      label:
        'Pemasukan Lainnya',
      types: [
        'income',
      ],
    },
    {
      value:
        'consumption',
      label:
        'Konsumsi',
      types: [
        'income',
        'expense',
      ],
    },
    {
      value:
        'education',
      label:
        'SPP/Pendidikan',
      types: [
        'income',
        'expense',
      ],
    },
    {
      value:
        'operational',
      label:
        'Operasional',
      types: [
        'income',
        'expense',
      ],
    },
    {
      value:
        'health',
      label:
        'Kesehatan',
      types: [
        'expense',
      ],
    },
    {
      value:
        'other_expense',
      label:
        'Pengeluaran Lainnya',
      types: [
        'expense',
      ],
    },
  ];

  const isEditableRole =
    currentUser?.role ===
    'pengurus_harian';

  const invalidDateRange =
    Boolean(
      startDate &&
      endDate &&
      endDate <
        startDate
    );

  const visibleCategories =
    categoryOptions.filter(
      (category) => {
        if (
          filterType ===
          'ALL'
        ) {
          return true;
        }

        return category.types
          .includes(
            filterType
          );
      }
    );

  React.useEffect(
    () => {
      if (
        filterCategory ===
        'ALL'
      ) {
        return;
      }

      const category =
        categoryOptions.find(
          (item) =>
            item.value ===
            filterCategory
        );

      if (
        !category
      ) {
        setFilterCategory(
          'ALL'
        );

        return;
      }

      if (
        filterType !==
          'ALL' &&
        !category.types.includes(
          filterType
        )
      ) {
        setFilterCategory(
          'ALL'
        );
      }
    },
    [
      filterType,
    ]
  );

  React.useEffect(
    () => {
      if (
        !onLoadTransactions ||
        !isEditableRole ||
        invalidDateRange
      ) {
        return undefined;
      }

      const timer =
        window.setTimeout(
          () => {
            onLoadTransactions({
              page,
              per_page: 20,

              type:
                filterType ===
                'ALL'
                  ? undefined
                  : filterType,

              category:
                filterCategory ===
                'ALL'
                  ? undefined
                  : filterCategory,

              q:
                searchQuery
                  .trim() ||
                undefined,

              from:
                startDate ||
                undefined,

              to:
                endDate ||
                undefined,
            });
          },
          300
        );

      return () => {
        window.clearTimeout(
          timer
        );
      };
    },
    [
      page,
      filterType,
      filterCategory,
      searchQuery,
      startDate,
      endDate,
      isEditableRole,
      invalidDateRange,
      onLoadTransactions,
      transactionRefreshKey,
    ]
  );

  React.useEffect(
    () => {
      const lastPage =
        transactionPagination
          ?.last_page ||
        1;

      if (
        page > lastPage
      ) {
        setPage(
          lastPage
        );
      }
    },
    [
      page,
      transactionPagination,
    ]
  );

  const handleTypeChange =
    (type) => {
      setFilterType(
        type
      );

      setPage(1);
    };

  const handleCategoryChange =
    (category) => {
      setFilterCategory(
        category
      );

      setPage(1);
    };

  const handleSearchChange =
    (value) => {
      setSearchQuery(
        value
      );

      setPage(1);
    };

  const handleStartDateChange =
    (value) => {
      setStartDate(
        value
      );

      setPage(1);
    };

  const handleEndDateChange =
    (value) => {
      setEndDate(
        value
      );

      setPage(1);
    };

  /*
   * Summary ini hanya menghitung
   * transaksi pada halaman yang
   * sedang ditampilkan.
   *
   * Summary tahunan authoritative
   * berada pada financial-dashboard.
   */
  const totalIncome =
    transactions
      .filter(
        (transaction) =>
          transaction.type ===
          'pemasukan'
      )
      .reduce(
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
    transactions
      .filter(
        (transaction) =>
          transaction.type ===
          'pengeluaran'
      )
      .reduce(
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

  const pagination =
    transactionPagination ||
    {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0,
    };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              {isEditableRole
                ? 'Hak Akses CRUD Lengkap'
                : 'Akses Keuangan Terbatas'}
            </span>

            <span className="text-xs text-slate-400 font-mono">
              Buku Kas Utama
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Pencatatan Transaksi Keuangan Panti
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            Data transaksi pada halaman ini berasal langsung dari backend SIMK-Panti.
          </p>
        </div>

        {isEditableRole && (
          <button
            type="button"
            onClick={
              onOpenAddModal
            }
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-md shadow-emerald-600/20 text-xs flex items-center space-x-2 transition-all"
          >
            <LucideIcon
              name="plus-circle"
              className="w-4 h-4"
            />

            <span>
              Catat Transaksi Baru
            </span>
          </button>
        )}
      </div>

      {!isEditableRole && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800">
          Endpoint transaksi internal saat ini hanya tersedia untuk role Pengurus Harian. Dukungan read-only Pemimpin Lembaga akan diaktifkan pada fase role terkait.
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Pemasukan Halaman Ini
            </div>

            <div className="text-xl font-black text-emerald-700 mt-1">
              Rp{' '}
              {totalIncome.toLocaleString(
                'id-ID'
              )}
            </div>
          </div>

          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <LucideIcon
              name="trending-up"
              className="w-5 h-5"
            />
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              Pengeluaran Halaman Ini
            </div>

            <div className="text-xl font-black text-rose-700 mt-1">
              Rp{' '}
              {totalExpense.toLocaleString(
                'id-ID'
              )}
            </div>
          </div>

          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center">
            <LucideIcon
              name="trending-down"
              className="w-5 h-5"
            />
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Arus Bersih Halaman Ini
            </div>

            <div
              className={`text-xl font-black mt-1 ${
                totalIncome -
                  totalExpense >=
                0
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              Rp{' '}
              {(
                totalIncome -
                totalExpense
              ).toLocaleString(
                'id-ID'
              )}
            </div>
          </div>

          <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center">
            <LucideIcon
              name="wallet"
              className="w-5 h-5"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() =>
                handleTypeChange(
                  'ALL'
                )
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType ===
                'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Jenis
            </button>

            <button
              type="button"
              onClick={() =>
                handleTypeChange(
                  'income'
                )
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                filterType ===
                'income'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <LucideIcon
                name="arrow-down-left"
                className="w-3.5 h-3.5"
              />

              <span>
                Pemasukan
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleTypeChange(
                  'expense'
                )
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                filterType ===
                'expense'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <LucideIcon
                name="arrow-up-right"
                className="w-3.5 h-3.5"
              />

              <span>
                Pengeluaran
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">
              Kategori:
            </span>

            <select
              value={
                filterCategory
              }
              onChange={(event) =>
                handleCategoryChange(
                  event.target
                    .value
                )
              }
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="ALL">
                Semua Kategori
              </option>

              {visibleCategories.map(
                (category) => (
                  <option
                    key={
                      category.value
                    }
                    value={
                      category.value
                    }
                  >
                    {
                      category.label
                    }
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Dari Tanggal
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(
                event
              ) =>
                handleStartDateChange(
                  event.target
                    .value
                )
              }
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Sampai Tanggal
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(
                event
              ) =>
                handleEndDateChange(
                  event.target
                    .value
                )
              }
              className={`w-full px-3 py-1.5 rounded-xl border text-xs font-medium ${
                invalidDateRange
                  ? 'border-rose-400'
                  : 'border-slate-300'
              }`}
            />

            {invalidDateRange && (
              <p className="text-[10px] text-rose-600 mt-1">
                Tanggal akhir tidak boleh lebih awal dari tanggal mulai.
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Cari Transaksi
            </label>

            <div className="relative">
              <LucideIcon
                name="search"
                className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5"
              />

              <input
                type="text"
                placeholder="Kode, pihak, keterangan..."
                value={
                  searchQuery
                }
                onChange={(
                  event
                ) =>
                  handleSearchChange(
                    event.target
                      .value
                  )
                }
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {transactionError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-rose-800">
              Data transaksi gagal dimuat
            </div>

            <div className="text-xs text-rose-700 mt-1">
              {transactionError}
            </div>
          </div>

          {isEditableRole && (
            <button
              type="button"
              onClick={() =>
                onLoadTransactions?.({
                  page,
                  per_page: 20,
                })
              }
              className="text-xs font-bold text-rose-700 hover:text-rose-900"
            >
              Coba Lagi
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">
                  Tanggal & Kode
                </th>

                <th className="py-3.5 px-4">
                  Jenis & Kategori
                </th>

                <th className="py-3.5 px-4">
                  Pihak & Keterangan
                </th>

                <th className="py-3.5 px-4">
                  Nominal
                </th>

                <th className="py-3.5 px-4">
                  Sumber / Petugas
                </th>

                <th className="py-3.5 px-4 text-right">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {transactionLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-12 text-slate-400"
                  >
                    <LucideIcon
                      name="loader-circle"
                      className="w-8 h-8 mx-auto mb-2 animate-spin"
                    />

                    <p className="font-semibold">
                      Memuat transaksi...
                    </p>
                  </td>
                </tr>
              ) : transactions.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-12 text-slate-400"
                  >
                    <LucideIcon
                      name="file-x"
                      className="w-10 h-10 mx-auto mb-2 text-slate-300"
                    />

                    <p className="font-semibold">
                      Tidak ada transaksi yang sesuai.
                    </p>
                  </td>
                </tr>
              ) : (
                transactions.map(
                  (transaction) => (
                    <tr
                      key={
                        transaction.id
                      }
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">
                          {
                            transaction.date
                          }
                        </div>

                        <div className="text-[10px] font-mono text-slate-400">
                          {
                            transaction.id
                          }
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            transaction.type ===
                            'pemasukan'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          <LucideIcon
                            name={
                              transaction.type ===
                              'pemasukan'
                                ? 'arrow-down-left'
                                : 'arrow-up-right'
                            }
                            className="w-3 h-3"
                          />

                          <span>
                            {transaction.type ===
                            'pemasukan'
                              ? 'Pemasukan'
                              : 'Pengeluaran'}
                          </span>
                        </span>

                        <div className="text-[11px] font-semibold text-slate-600 mt-1">
                          {
                            transaction.category
                          }
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">
                          {transaction.donorName ||
                            '-'}
                        </div>

                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {transaction.description ||
                            '-'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div
                          className={`font-black text-sm ${
                            transaction.type ===
                            'pemasukan'
                              ? 'text-emerald-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {transaction.type ===
                          'pemasukan'
                            ? '+ '
                            : '- '}

                          Rp{' '}
                          {Number(
                            transaction.amount ||
                              0
                          ).toLocaleString(
                            'id-ID'
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-slate-700 font-medium">
                          {
                            transaction.createdBy
                          }
                        </div>

                        <div className="flex items-center gap-1 mt-1">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              transaction.source ===
                              'donation'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {
                              transaction.sourceLabel
                            }
                          </span>

                          {!transaction.editable && (
                            <span
                              title="Transaksi sistem tidak dapat diedit manual"
                              className="text-slate-400"
                            >
                              <LucideIcon
                                name="lock-keyhole"
                                className="w-3 h-3"
                              />
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              onPrintTransactionReceipt(
                                transaction
                              )
                            }
                            className="p-1.5 text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-100 rounded-lg transition-all border border-slate-200"
                            title="Cetak Kuitansi"
                          >
                            <LucideIcon
                              name="printer"
                              className="w-4 h-4"
                            />
                          </button>

                          {isEditableRole &&
                            transaction.editable && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onOpenEditModal(
                                      transaction
                                    )
                                  }
                                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                                  title="Edit Transaksi"
                                >
                                  <LucideIcon
                                    name="pencil"
                                    className="w-4 h-4"
                                  />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    onConfirmDeleteTrx(
                                      transaction
                                    )
                                  }
                                  className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                                  title="Hapus Transaksi"
                                >
                                  <LucideIcon
                                    name="trash-2"
                                    className="w-4 h-4"
                                  />
                                </button>
                              </>
                            )}
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        {!transactionLoading &&
          pagination.total >
            0 && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500">
                Total{' '}
                <span className="font-bold text-slate-700">
                  {
                    pagination.total
                  }
                </span>{' '}
                transaksi
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={
                    pagination.current_page <=
                    1
                  }
                  onClick={() =>
                    setPage(
                      Math.max(
                        1,
                        page - 1
                      )
                    )
                  }
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>

                <span className="text-xs text-slate-600">
                  Halaman{' '}
                  <b>
                    {
                      pagination.current_page
                    }
                  </b>{' '}
                  dari{' '}
                  <b>
                    {
                      pagination.last_page
                    }
                  </b>
                </span>

                <button
                  type="button"
                  disabled={
                    pagination.current_page >=
                    pagination.last_page
                  }
                  onClick={() =>
                    setPage(
                      Math.min(
                        pagination.last_page,
                        page + 1
                      )
                    )
                  }
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

window.TransactionManagement =
  TransactionManagement;