// User Approval Page (Khusus Pemimpin Lembaga / Admin)
const UserApproval = ({
  users,
  onApproveUser,
  onRejectUser,
  currentUser
}) => {
  const [filterStatus, setFilterStatus] = React.useState('Pending Approval');
  const [searchQuery, setSearchQuery] = React.useState('');
const filteredUsers = users.filter(u => {
    const matchesStatus = filterStatus === 'ALL' || u.status === filterStatus;
    const matchesSearch = 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.nik.includes(searchQuery) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = users.filter(u => u.status === 'Pending Approval').length;
  const approvedCount = users.filter(u => u.status === 'Approved').length;
  const rejectedCount = users.filter(u => u.status === 'Rejected').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-indigo-200 border border-indigo-400/30">
            <LucideIcon name="shield-check" className="w-4 h-4" />
            <span>Portal Otorisasi Pemimpin Lembaga</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Persetujuan Akun Pengguna Baru (Approval)</h1>
          <p className="text-xs text-indigo-200/80 max-w-2xl">
            Sesuai standar akuntabilitas internal panti asuhan, setiap pengajuan pendaftaran akun Pengurus Harian dan Pemimpin Lembaga wajib melalui verifikasi NIK dan otorisasi dari Pemimpin Lembaga sebelum dapat mengakses data keuangan.
          </p>
        </div>

        {/* Counter Widget */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center space-x-4">
          <div className="text-center px-2">
            <div className="text-2xl font-black text-amber-400">{pendingCount}</div>
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Menunggu</div>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div className="text-center px-2">
            <div className="text-2xl font-black text-emerald-400">{approvedCount}</div>
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Disetujui</div>
          </div>
        </div>
      </div>

      {/* Filter Controls & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setFilterStatus('Pending Approval')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              filterStatus === 'Pending Approval'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LucideIcon name="clock" className="w-3.5 h-3.5" />
            <span>Pending Approval ({pendingCount})</span>
          </button>

          <button
            onClick={() => setFilterStatus('Approved')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              filterStatus === 'Approved'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LucideIcon name="check-circle-2" className="w-3.5 h-3.5" />
            <span>Disetujui ({approvedCount})</span>
          </button>

          <button
            onClick={() => setFilterStatus('Rejected')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              filterStatus === 'Rejected'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LucideIcon name="x-circle" className="w-3.5 h-3.5" />
            <span>Ditolak ({rejectedCount})</span>
          </button>

          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterStatus === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Semua Data ({users.length})</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-64">
          <LucideIcon name="search" className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari NIK, Nama, Username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Identitas Pengguna</th>
                <th className="py-3.5 px-4">Kontak & Alamat</th>
                <th className="py-3.5 px-4">Peran Yang Diajukan</th>
                <th className="py-3.5 px-4">Tgl Registrasi</th>
                <th className="py-3.5 px-4">Status Akun</th>
                <th className="py-3.5 px-4 text-right">Aksi Persetujuan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    <LucideIcon name="inbox" className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold">Tidak ada pengajuan akun dalam kategori ini.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{user.fullName}</div>
                      <div className="text-slate-500 text-[11px] font-mono">NIK: {user.nik}</div>
                      <div className="text-slate-400 text-[10px]">Username: <span className="font-bold text-slate-600">@{user.username}</span></div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center space-x-1">
                        <LucideIcon name="phone" className="w-3 h-3 text-slate-400" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{user.address || '-'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        user.role === 'Pengurus Harian'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-indigo-50 text-indigo-800 border-indigo-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(user.registeredAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-3.5 px-4">
                      {user.status === 'Pending Approval' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 font-bold text-[11px]">
                          <LucideIcon name="clock" className="w-3 h-3 text-amber-600 animate-spin" />
                          <span>Pending Approval</span>
                        </span>
                      )}

                      {user.status === 'Approved' && (
                        <div>
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-[11px]">
                            <LucideIcon name="check-circle-2" className="w-3 h-3 text-emerald-600" />
                            <span>Disetujui</span>
                          </span>
                          {user.approvedBy && (
                            <div className="text-[10px] text-slate-400 mt-0.5">Oleh: {user.approvedBy}</div>
                          )}
                        </div>
                      )}

                      {user.status === 'Rejected' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-300 font-bold text-[11px]">
                          <LucideIcon name="x-circle" className="w-3 h-3 text-rose-600" />
                          <span>Ditolak</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {user.status === 'Pending Approval' ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onApproveUser(user.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1 transition-all"
                          >
                            <LucideIcon name="check" className="w-3.5 h-3.5" />
                            <span>Setujui</span>
                          </button>

                          <button
                            onClick={() => onRejectUser(user.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all"
                          >
                            <LucideIcon name="x" className="w-3.5 h-3.5" />
                            <span>Tolak</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Tindakan Selesai</span>
                      )}
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

window.UserApproval = UserApproval;
