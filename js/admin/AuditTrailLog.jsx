// Backend-backed Audit Trail component for SIMK-Panti.

const AUDIT_ACTION_OPTIONS = [
  {
    value: 'ALL',
    label: 'Semua Tindakan',
  },
  {
    value: 'created',
    label: 'Dibuat',
  },
  {
    value: 'updated',
    label: 'Diubah',
  },
  {
    value: 'deleted',
    label: 'Dihapus',
  },
  {
    value: 'verified',
    label: 'Diverifikasi',
  },
  {
    value: 'approved',
    label: 'Disetujui',
  },
  {
    value: 'rejected',
    label: 'Ditolak',
  },
  {
    value: 'status_changed',
    label: 'Perubahan Status',
  },
  {
    value: 'logged_in',
    label: 'Login',
  },
  {
    value: 'logged_out',
    label: 'Logout',
  },
];

const AUDIT_SUBJECT_OPTIONS = [
  {
    value: 'ALL',
    label: 'Semua Objek',
  },
  {
    value: 'campaign',
    label: 'Program Prioritas',
  },
  {
    value: 'donation',
    label: 'Donasi',
  },
  {
    value: 'financial_transaction',
    label: 'Transaksi Keuangan',
  },
  {
    value: 'payment_transaction',
    label: 'Pembayaran',
  },
];

const AUDIT_ACTION_LABELS = {
  created: 'Dibuat',
  updated: 'Diubah',
  deleted: 'Dihapus',
  verified: 'Diverifikasi',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  status_changed: 'Perubahan Status',
  logged_in: 'Login',
  logged_out: 'Logout',
};

const AUDIT_SUBJECT_LABELS = {
  campaign: 'Program Prioritas',
  donation: 'Donasi',
  financial_transaction:
    'Transaksi Keuangan',
  payment_transaction:
    'Pembayaran',
  user: 'Pengguna',
};

const AUDIT_FIELD_LABELS = {
  status: 'Status',
  title: 'Judul',
  amount: 'Nominal',
  target_amount: 'Target',
  category: 'Kategori',
  type: 'Jenis',
  transaction_date:
    'Tanggal Transaksi',
  payment_method:
    'Metode Pembayaran',
  payment_channel:
    'Channel Pembayaran',
  published_at:
    'Waktu Publikasi',
};

const resolveActionValue = (
  log
) => {
  return (
    log?.action?.value ||
    log?.action ||
    ''
  );
};

const resolveActionLabel = (
  log
) => {
  const value =
    resolveActionValue(
      log
    );

  return (
    log?.action?.label ||
    AUDIT_ACTION_LABELS[
      value
    ] ||
    value ||
    '-'
  );
};

const resolveSubjectLabel = (
  subjectType
) => {
  if (!subjectType) {
    return '-';
  }

  return (
    AUDIT_SUBJECT_LABELS[
      subjectType
    ] ||
    subjectType
      .split('_')
      .map(
        (part) =>
          part.charAt(0)
            .toUpperCase() +
          part.slice(1)
      )
      .join(' ')
  );
};

const resolveRoleLabel = (
  role
) => {
  if (
    role ===
    'pengurus_harian'
  ) {
    return 'Pengurus Harian';
  }

  if (
    role ===
    'pemimpin_lembaga'
  ) {
    return 'Pemimpin Lembaga';
  }

  return role || 'System Event';
};

const formatAuditDate = (
  value
) => {
  if (!value) {
    return '-';
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '-';
  }

  return `${date.toLocaleString(
    'id-ID',
    {
      timeZone:
        'Asia/Jakarta',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }
  )} WIB`;
};

const formatAuditValue = (
  field,
  value
) => {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '—';
  }

  if (
    field === 'amount' ||
    field ===
      'target_amount'
  ) {
    const numericValue =
      Number(value);

    if (
      Number.isFinite(
        numericValue
      )
    ) {
      return new Intl.NumberFormat(
        'id-ID',
        {
          style:
            'currency',
          currency:
            'IDR',
          maximumFractionDigits:
            0,
        }
      ).format(
        numericValue
      );
    }
  }

  if (
    typeof value ===
    'object'
  ) {
    return '[data]';
  }

  return String(value);
};

const getAuditChangeRows = (
  log
) => {
  const oldValues =
    log?.changes?.old ||
    {};

  const newValues =
    log?.changes?.new ||
    {};

  const keys =
    Array.from(
      new Set([
        ...Object.keys(
          oldValues
        ),
        ...Object.keys(
          newValues
        ),
      ])
    );

  return keys
    .filter(
      (key) =>
        JSON.stringify(
          oldValues[key]
        ) !==
        JSON.stringify(
          newValues[key]
        )
    )
    .map(
      (key) => ({
        field:
          key,

        label:
          AUDIT_FIELD_LABELS[
            key
          ] ||
          key
            .split('_')
            .map(
              (part) =>
                part.charAt(0)
                  .toUpperCase() +
                part.slice(1)
            )
            .join(' '),

        oldValue:
          formatAuditValue(
            key,
            oldValues[
              key
            ]
          ),

        newValue:
          formatAuditValue(
            key,
            newValues[
              key
            ]
          ),
      })
    );
};

const AuditTrailLog = () => {
  const [
    logs,
    setLogs,
  ] = React.useState([]);

  const [
    loading,
    setLoading,
  ] = React.useState(true);

  const [
    error,
    setError,
  ] = React.useState(null);

  const [
    searchInput,
    setSearchInput,
  ] = React.useState('');

  const [
    searchQuery,
    setSearchQuery,
  ] = React.useState('');

  const [
    filterAction,
    setFilterAction,
  ] = React.useState(
    'ALL'
  );

  const [
    filterSubject,
    setFilterSubject,
  ] = React.useState(
    'ALL'
  );

  const [
    page,
    setPage,
  ] = React.useState(1);

  const [
    refreshKey,
    setRefreshKey,
  ] = React.useState(0);

  const [
    pagination,
    setPagination,
  ] = React.useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  React.useEffect(
    () => {
      const timeout =
        window.setTimeout(
          () => {
            setSearchQuery(
              searchInput
                .trim()
            );

            setPage(1);
          },
          350
        );

      return () => {
        window.clearTimeout(
          timeout
        );
      };
    },
    [
      searchInput,
    ]
  );

  React.useEffect(
    () => {
      let cancelled =
        false;

      const loadAuditLogs =
        async () => {
          setLoading(true);
          setError(null);

          try {
            const response =
              await AuditApi
                .getLogs({
                  action:
                    filterAction,

                  subject_type:
                    filterSubject,

                  search:
                    searchQuery,

                  page,

                  per_page:
                    20,
                });

            if (
              cancelled
            ) {
              return;
            }

            const data =
              response?.data ||
              {};

            const items =
              Array.isArray(
                data.items
              )
                ? data.items
                : [];

            const responsePagination =
              data.pagination ||
              {};

            setLogs(
              items
            );

            setPagination({
              current_page:
                Number(
                  responsePagination
                    .current_page ||
                  page
                ),

              last_page:
                Number(
                  responsePagination
                    .last_page ||
                  1
                ),

              per_page:
                Number(
                  responsePagination
                    .per_page ||
                  20
                ),

              total:
                Number(
                  responsePagination
                    .total ||
                  0
                ),
            });
          } catch (
            requestError
          ) {
            if (
              cancelled
            ) {
              return;
            }

            setLogs([]);

            setError(
              requestError
                ?.message ||
              'Gagal memuat audit log.'
            );
          } finally {
            if (
              !cancelled
            ) {
              setLoading(
                false
              );
            }
          }
        };

      loadAuditLogs();

      return () => {
        cancelled =
          true;
      };
    },
    [
      filterAction,
      filterSubject,
      searchQuery,
      page,
      refreshKey,
    ]
  );

  const handleActionChange =
    (event) => {
      setFilterAction(
        event.target.value
      );

      setPage(1);
    };

  const handleSubjectChange =
    (event) => {
      setFilterSubject(
        event.target.value
      );

      setPage(1);
    };

  const getActionBadge =
    (action) => {
      if (
        action ===
        'created'
      ) {
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      }

      if (
        action ===
        'updated'
      ) {
        return 'bg-blue-100 text-blue-800 border-blue-300';
      }

      if (
        action ===
        'deleted'
      ) {
        return 'bg-rose-100 text-rose-800 border-rose-300';
      }

      if (
        action ===
        'verified'
      ) {
        return 'bg-teal-100 text-teal-800 border-teal-300';
      }

      if (
        action ===
        'approved'
      ) {
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      }

      if (
        action ===
        'rejected'
      ) {
        return 'bg-amber-100 text-amber-800 border-amber-300';
      }

      if (
        action ===
        'status_changed'
      ) {
        return 'bg-violet-100 text-violet-800 border-violet-300';
      }

      return 'bg-slate-100 text-slate-800 border-slate-300';
    };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">

      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 border border-emerald-500/30">
            <LucideIcon
              name="history"
              className="w-4 h-4 text-emerald-400"
            />

            <span>
              Riwayat Aktivitas & Akuntabilitas
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight mt-2">
            Audit Trail Aktivitas
          </h1>

          <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
            Rekaman aktivitas penting yang dicatat oleh backend untuk membantu penelusuran perubahan dan akuntabilitas operasional.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setRefreshKey(
                (value) =>
                  value + 1
              )
            }
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-700 disabled:opacity-50"
          >
            <LucideIcon
              name="refresh-cw"
              className={`w-4 h-4 ${
                loading
                  ? 'animate-spin'
                  : ''
              }`}
            />

            Muat Ulang
          </button>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-right min-w-[120px]">
            <div className="text-2xl font-black text-emerald-400">
              {
                pagination
                  .total
              }
            </div>

            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Rekaman
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-[180px_210px_1fr] gap-3">
        <select
          value={
            filterAction
          }
          onChange={
            handleActionChange
          }
          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-slate-900"
        >
          {
            AUDIT_ACTION_OPTIONS
              .map(
                (option) => (
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
              )
          }
        </select>

        <select
          value={
            filterSubject
          }
          onChange={
            handleSubjectChange
          }
          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-slate-900"
        >
          {
            AUDIT_SUBJECT_OPTIONS
              .map(
                (option) => (
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
              )
          }
        </select>

        <div className="relative">
          <LucideIcon
            name="search"
            className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
          />

          <input
            type="text"
            placeholder="Cari nama, username, ID objek, atau rincian..."
            value={
              searchInput
            }
            onChange={
              (event) =>
                setSearchInput(
                  event.target
                    .value
                )
            }
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {
        error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 flex items-start gap-3">
            <LucideIcon
              name="circle-alert"
              className="w-5 h-5 text-rose-600 mt-0.5"
            />

            <div>
              <div className="text-sm font-bold text-rose-800">
                Audit log tidak dapat dimuat
              </div>

              <div className="text-xs text-rose-700 mt-0.5">
                {error}
              </div>
            </div>
          </div>
        )
      }

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">
                  Waktu Kejadian
                </th>

                <th className="py-3.5 px-4">
                  Aktor
                </th>

                <th className="py-3.5 px-4">
                  Tindakan
                </th>

                <th className="py-3.5 px-4">
                  Objek & Rincian
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {
                loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-14 text-slate-400"
                    >
                      <LucideIcon
                        name="loader-circle"
                        className="w-8 h-8 mx-auto mb-2 animate-spin text-slate-300"
                      />

                      <p className="font-semibold">
                        Memuat audit log...
                      </p>
                    </td>
                  </tr>
                ) : logs.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-12 text-slate-400"
                    >
                      <LucideIcon
                        name="history"
                        className="w-10 h-10 mx-auto mb-2 text-slate-300"
                      />

                      <p className="font-semibold">
                        Tidak ada audit log yang ditemukan.
                      </p>
                    </td>
                  </tr>
                ) : (
                  logs.map(
                    (log) => {
                      const action =
                        resolveActionValue(
                          log
                        );

                      const actor =
                        log.actor ||
                        null;

                      const subject =
                        log.subject ||
                        {};

                      const changes =
                        getAuditChangeRows(
                          log
                        );

                      return (
                        <tr
                          key={
                            log.public_id
                          }
                          className="hover:bg-slate-50/80 transition-colors align-top"
                        >
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-mono text-xs font-bold text-slate-900">
                              {
                                formatAuditDate(
                                  log.occurred_at
                                )
                              }
                            </div>

                            <div className="text-[10px] text-slate-400 font-mono mt-1">
                              {
                                log.public_id
                              }
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">
                              {
                                actor?.name ||
                                'Sistem Otomatis'
                              }
                            </div>

                            <div className="text-[10px] text-slate-500 font-mono">
                              {
                                actor?.username
                                  ? `@${actor.username}`
                                  : 'Tanpa pengguna langsung'
                              }
                            </div>

                            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                              {
                                resolveRoleLabel(
                                  actor?.role
                                )
                              }
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${getActionBadge(
                                action
                              )}`}
                            >
                              {
                                resolveActionLabel(
                                  log
                                )
                              }
                            </span>
                          </td>

                          <td className="py-3.5 px-4 min-w-[340px]">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span className="font-bold text-slate-800">
                                {
                                  resolveSubjectLabel(
                                    subject.type
                                  )
                                }
                              </span>

                              {
                                subject.public_id && (
                                  <span className="font-mono text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                                    {
                                      subject.public_id
                                    }
                                  </span>
                                )
                              }
                            </div>

                            <div className="text-slate-700 leading-relaxed max-w-2xl">
                              {
                                log.description ||
                                'Aktivitas tercatat tanpa keterangan tambahan.'
                              }
                            </div>

                            {
                              changes.length >
                                0 && (
                                <div className="mt-2 space-y-1">
                                  {
                                    changes
                                      .slice(
                                        0,
                                        3
                                      )
                                      .map(
                                        (
                                          change
                                        ) => (
                                          <div
                                            key={
                                              change.field
                                            }
                                            className="text-[10px] text-slate-500"
                                          >
                                            <span className="font-bold text-slate-600">
                                              {
                                                change.label
                                              }
                                              :
                                            </span>{' '}
                                            <span className="font-mono">
                                              {
                                                change.oldValue
                                              }
                                            </span>{' '}
                                            →
                                            {' '}
                                            <span className="font-mono text-slate-700">
                                              {
                                                change.newValue
                                              }
                                            </span>
                                          </div>
                                        )
                                      )
                                  }

                                  {
                                    changes.length >
                                      3 && (
                                      <div className="text-[10px] font-semibold text-slate-400">
                                        +
                                        {
                                          changes.length -
                                          3
                                        }{' '}
                                        perubahan lainnya
                                      </div>
                                    )
                                  }
                                </div>
                              )
                            }
                          </td>
                        </tr>
                      );
                    }
                  )
                )
              }
            </tbody>
          </table>
        </div>

        {
          !loading &&
          !error &&
          pagination.total >
            0 && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] font-medium text-slate-500">
                Halaman{' '}
                <span className="font-bold text-slate-700">
                  {
                    pagination
                      .current_page
                  }
                </span>{' '}
                dari{' '}
                <span className="font-bold text-slate-700">
                  {
                    pagination
                      .last_page
                  }
                </span>
                {' · '}
                {
                  pagination
                    .total
                }{' '}
                rekaman
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={
                    pagination
                      .current_page <=
                    1
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.max(
                          1,
                          current -
                            1
                        )
                    )
                  }
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>

                <button
                  type="button"
                  disabled={
                    pagination
                      .current_page >=
                    pagination
                      .last_page
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.min(
                          pagination
                            .last_page,
                          current +
                            1
                        )
                    )
                  }
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

window.AuditTrailLog =
  AuditTrailLog;