// Visit Management Component (Admin Calendar & Approvals)
const VisitManagement = ({ visitsData, onUpdateVisitStatus }) => {
  const [statusFilter, setStatusFilter] = React.useState('semua');
  const [selectedRejectVisit, setSelectedRejectVisit] = React.useState(null);
  const [rejectReason, setRejectReason] = React.useState('');

  const filteredVisits = visitsData.filter(v => {
    if (statusFilter === 'semua') return true;
    return v.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const handleConfirmReject = () => {
    if (!selectedRejectVisit) return;
    onUpdateVisitStatus(selectedRejectVisit.id, 'Ditolak', rejectReason || 'Jadwal penuh / bentrok dengan agenda internal.');
    setSelectedRejectVisit(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Status Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manajemen Jadwal Kunjungan & Baksos</h2>
          <p className="text-xs text-slate-500">
            Setujui (Approve) atau Tolak (Reject) pengajuan kunjungan masyarakat untuk mencegah bentrok jadwal.
          </p>
        </div>

        <div className="flex space-x-2">
          {['semua', 'pending', 'disetujui', 'ditolak'].map(filter => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                statusFilter === filter
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Visit Requests List */}
      <div className="space-y-4">
        {filteredVisits.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            Tidak ada data kunjungan dengan status "{statusFilter}".
          </div>
        ) : (
          filteredVisits.map(visit => (
            <div
              key={visit.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              
              {/* Visit Details */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    visit.status === 'Disetujui'
                      ? 'bg-emerald-100 text-emerald-800'
                      : visit.status === 'Ditolak'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {visit.status}
                  </span>

                  <span className="text-xs font-mono font-bold text-slate-400">{visit.id}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {visit.requesterName} ({visit.organization || 'Perseorangan'})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-600">
                  <div>
                    <strong className="text-slate-700">Tanggal:</strong> {visit.date} ({visit.timeSlot})
                  </div>
                  <div>
                    <strong className="text-slate-700">Rombongan:</strong> {visit.visitorCount} Orang
                  </div>
                  <div>
                    <strong className="text-slate-700">Kontak HP:</strong> {visit.phone}
                  </div>
                  <div>
                    <strong className="text-slate-700">Email:</strong> {visit.email || '-'}
                  </div>
                </div>

                <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700">
                  <strong>Maksud & Tujuan:</strong> {visit.purpose}
                </div>

                {visit.notes && (
                  <div className="text-[11px] text-slate-500 italic">
                    Catatan Pengurus: {visit.notes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 w-full md:w-auto shrink-0">
                {visit.status !== 'Disetujui' && (
                  <button
                    onClick={() => onUpdateVisitStatus(visit.id, 'Disetujui', 'Jadwal disetujui oleh pengurus panti.')}
                    className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <LucideIcon name="check-circle" className="w-4 h-4" />
                    <span>Setujui (Approve)</span>
                  </button>
                )}

                {visit.status !== 'Ditolak' && (
                  <button
                    onClick={() => setSelectedRejectVisit(visit)}
                    className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <LucideIcon name="x-circle" className="w-4 h-4" />
                    <span>Tolak Kunjungan</span>
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Reject Modal Reason */}
      {selectedRejectVisit && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900">Konfirmasi Penolakan Jadwal</h3>
            <p className="text-xs text-slate-600">
              Anda menolak pengajuan kunjungan dari <strong>{selectedRejectVisit.requesterName}</strong> untuk tanggal {selectedRejectVisit.date}.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alasan Penolakan (Opsional)</label>
              <textarea
                rows="3"
                placeholder="Contoh: Maaf, pada tanggal tersebut panti asuhan sedang ada renovasi gedung..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setSelectedRejectVisit(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow"
              >
                Tolak Kunjungan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

window.VisitManagement = VisitManagement;
