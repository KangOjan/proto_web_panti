// User Approval Page (Khusus Pemimpin Lembaga / Admin)
const UserApproval = ({
  users = [],
  summary = null,
  loading = false,
  error = null,
  actionUserId = null,
  onReload,
  onApproveUser,
  onRejectUser,
  currentUser
}) => {
  const [
    filterStatus,
    setFilterStatus,
  ] = React.useState(
    'Pending Approval'
  );

  const [
    searchQuery,
    setSearchQuery,
  ] = React.useState('');

  const normalizedSearch =
    searchQuery
      .trim()
      .toLowerCase();

  const filteredUsers =
    users.filter(
      (user) => {
        const matchesStatus =
          filterStatus ===
            'ALL' ||
          user.status ===
            filterStatus;

        const matchesSearch =
          !normalizedSearch ||
          String(
            user.fullName ||
            ''
          )
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          String(
            user.nik ||
            ''
          )
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          String(
            user.username ||
            ''
          )
            .toLowerCase()
            .includes(
              normalizedSearch
            );

        return (
          matchesStatus &&
          matchesSearch
        );
      }
    );

  const pendingCount =
    Number(
      summary?.pending ??
      users.filter(
        (user) =>
          user.status ===
          'Pending Approval'
      ).length
    );

  const approvedCount =
    Number(
      summary?.approved ??
      users.filter(
        (user) =>
          user.status ===
          'Approved'
      ).length
    );

  const rejectedCount =
    Number(
      summary?.rejected ??
      users.filter(
        (user) =>
          user.status ===
          'Rejected'
      ).length
    );

  const totalCount =
    Number(
      summary?.total ??
      users.length
    );

  const formatDate = (
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

    return date.toLocaleDateString(
      'id-ID',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  /*
   * Frontend guard hanya untuk UX.
   * Authorization authority tetap backend.
   */
  if (
    currentUser?.role !==
    'pemimpin_lembaga'
  ) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="bg-white rounded-3xl border border-rose-200 shadow-sm p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4">
            <LucideIcon
              name="shield-alert"
              className="w-7 h-7"
            />
          </div>

          <h1 className="text-xl font-extrabold text-slate-900">
            Akses Tidak Diizinkan
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Halaman persetujuan akun hanya dapat diakses oleh Pemimpin Lembaga.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-indigo-200 border border-indigo-400/30">
            <LucideIcon
              name="shield-check"
              className="w-4 h-4"
            />

            <span>
              Portal Otorisasi Pemimpin Lembaga
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">
            Persetujuan Akun Pengguna Baru (Approval)
          </h1>

          <p className="text-xs text-indigo-200/80 max-w-2xl">
            Sesuai standar akuntabilitas internal panti asuhan, setiap pengajuan pendaftaran akun Pengurus Harian dan Pemimpin Lembaga wajib melalui verifikasi NIK dan otorisasi dari Pemimpin Lembaga sebelum dapat mengakses data keuangan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center space-x-4">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-amber-400">
                {pendingCount}
              </div>

              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                Menunggu
              </div>
            </div>

            <div className="h-8 w-px bg-white/20"></div>

            <div className="text-center px-2">
              <div className="text-2xl font-black text-emerald-400">
                {approvedCount}
              </div>

              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                Disetujui
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onReload?.()
            }
            disabled={
              loading
            }
            className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 transition-all"
            title="Muat ulang data"
          >
            <LucideIcon
              name="refresh-cw"
              className={`w-4 h-4 ${
                loading
                  ? 'animate-spin'
                  : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Backend Error */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <LucideIcon
              name="alert-circle"
              className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5"
            />

            <div>
              <div className="text-sm font-bold">
                Data persetujuan gagal dimuat
              </div>

              <div className="text-xs mt-0.5">
                {error}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onReload?.()
            }
            disabled={
              loading
            }
            className="px-3 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white text-xs font-bold transition-all"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Filter Controls & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button
            type="button"
            onClick={() =>
              setFilterStatus(
                'Pending Approval'
              )
            }
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              filterStatus ===
              'Pending Approval'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LucideIcon
              name="clock"
              className="w-3.5 h-3.5"
            />

            <span>
              Pending Approval ({pendingCount})
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setFilterStatus(
                'Approved'
              )
            }
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              filterStatus ===
              'Approved'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LucideIcon
              name="check-circle-2"
              className="w-3.5 h-3.5"
            />

            <span>
              Disetujui ({approvedCount})
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setFilterStatus(
                'Rejected'
              )
            }
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              filterStatus ===
              'Rejected'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LucideIcon
              name="x-circle"
              className="w-3.5 h-3.5"
            />

            <span>
              Ditolak ({rejectedCount})
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setFilterStatus(
                'ALL'
              )
            }
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterStatus ===
              'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>
              Semua Data ({totalCount})
            </span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <LucideIcon
            name="search"
            className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
          />

          <input
            type="text"
            placeholder="Cari NIK, Nama, Username..."
            value={
              searchQuery
            }
            onChange={(
              event
            ) =>
              setSearchQuery(
                event.target.value
              )
            }
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading &&
        users.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-16 text-center">
            <LucideIcon
              name="loader-circle"
              className="w-8 h-8 mx-auto text-indigo-600 animate-spin"
            />

            <p className="text-sm font-semibold text-slate-600 mt-3">
              Memuat data persetujuan akun...
            </p>
          </div>
        )}

      {/* Users Table */}
      {!(
        loading &&
        users.length === 0
      ) && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">
                    Identitas Pengguna
                  </th>

                  <th className="py-3.5 px-4">
                    Kontak & Alamat
                  </th>

                  <th className="py-3.5 px-4">
                    Peran Yang Diajukan
                  </th>

                  <th className="py-3.5 px-4">
                    Tgl Registrasi
                  </th>

                  <th className="py-3.5 px-4">
                    Status Akun
                  </th>

                  <th className="py-3.5 px-4 text-right">
                    Aksi Persetujuan
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredUsers.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-12 text-slate-400"
                    >
                      <LucideIcon
                        name="inbox"
                        className="w-10 h-10 mx-auto mb-2 text-slate-300"
                      />

                      <p className="font-semibold">
                        Tidak ada pengajuan akun dalam kategori ini.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(
                    (user) => {
                      const isProcessing =
                        actionUserId ===
                        user.id;

                      return (
                        <tr
                          key={
                            user.id
                          }
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 text-sm">
                              {user.fullName}
                            </div>

                            <div className="text-slate-500 text-[11px] font-mono">
                              NIK: {user.nik || '-'}
                            </div>

                            <div className="text-slate-400 text-[10px]">
                              Username:{' '}
                              <span className="font-bold text-slate-600">
                                @{user.username}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-600">
                            <div className="flex items-center space-x-1">
                              <LucideIcon
                                name="mail"
                                className="w-3 h-3 text-slate-400"
                              />

                              <span>
                                {user.email || '-'}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1 mt-0.5">
                              <LucideIcon
                                name="phone"
                                className="w-3 h-3 text-slate-400"
                              />

                              <span>
                                {user.phone || '-'}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                              {user.address || '-'}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                user.roleCode ===
                                  'pengurus_harian'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-indigo-50 text-indigo-800 border-indigo-300'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                            {formatDate(
                              user.registeredAt
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {user.status ===
                              'Pending Approval' && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 font-bold text-[11px]">
                                <LucideIcon
                                  name="clock"
                                  className="w-3 h-3 text-amber-600"
                                />

                                <span>
                                  Pending Approval
                                </span>
                              </span>
                            )}

                            {user.status ===
                              'Approved' && (
                              <div>
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-[11px]">
                                  <LucideIcon
                                    name="check-circle-2"
                                    className="w-3 h-3 text-emerald-600"
                                  />

                                  <span>
                                    Disetujui
                                  </span>
                                </span>

                                {user.approvedBy && (
                                  <div className="text-[10px] text-slate-400 mt-0.5">
                                    Oleh: {user.approvedBy}
                                  </div>
                                )}
                              </div>
                            )}

                            {user.status ===
                              'Rejected' && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-300 font-bold text-[11px]">
                                <LucideIcon
                                  name="x-circle"
                                  className="w-3 h-3 text-rose-600"
                                />

                                <span>
                                  Ditolak
                                </span>
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            {user.status ===
                            'Pending Approval' ? (
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onApproveUser?.(
                                      user.id
                                    )
                                  }
                                  disabled={
                                    isProcessing
                                  }
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1 transition-all"
                                >
                                  <LucideIcon
                                    name={
                                      isProcessing
                                        ? 'loader-circle'
                                        : 'check'
                                    }
                                    className={`w-3.5 h-3.5 ${
                                      isProcessing
                                        ? 'animate-spin'
                                        : ''
                                    }`}
                                  />

                                  <span>
                                    {isProcessing
                                      ? 'Memproses...'
                                      : 'Setujui'}
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    onRejectUser?.(
                                      user.id
                                    )
                                  }
                                  disabled={
                                    isProcessing
                                  }
                                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all"
                                >
                                  <LucideIcon
                                    name="x"
                                    className="w-3.5 h-3.5"
                                  />

                                  <span>
                                    Tolak
                                  </span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px] italic">
                                Tindakan Selesai
                              </span>
                            )}
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
      )}
    </div>
  );
};

window.UserApproval =
  UserApproval;
