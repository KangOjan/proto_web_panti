// Child Management Component (Admin)
const ChildManagement = ({ childrenData, onOpenAddChildModal, onUpdateChild }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('semua');
  const [selectedChild, setSelectedChild] = React.useState(null);
  const [modalTab, setModalTab] = React.useState('medical'); // 'medical' | 'report' | 'achievements'

  const filteredChildren = childrenData.filter(child => {
    const matchesSearch = child.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          child.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          child.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'semua' || child.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manajemen Data Anak Asuh</h2>
          <p className="text-xs text-slate-500">Pendataan status berkas, rekam medis kesehatan, nilai rapor, dan wali.</p>
        </div>

        <button
          onClick={onOpenAddChildModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-2 shrink-0"
        >
          <i data-lucide="user-plus" className="w-4 h-4"></i>
          <span>Tambah Anak Asuh Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i data-lucide="search" className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
          <input
            type="text"
            placeholder="Cari berdasarkan nama anak, kode ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500"
        >
          <option value="semua">Semua Status (Yatim/Piatu/Duafa)</option>
          <option value="yatim">Yatim</option>
          <option value="piatu">Piatu</option>
          <option value="yatim piatu">Yatim Piatu</option>
          <option value="duafa">Duafa</option>
        </select>
      </div>

      {/* Children Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse custom-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th>ID & Nama Anak</th>
                <th>Usia & Pendidikan</th>
                <th>Status</th>
                <th>Berkas NIK</th>
                <th>Wali / Penanggung Jawab</th>
                <th>Orang Tua Asuh</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChildren.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-500 text-xs">
                    Tidak ada data anak asuh yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredChildren.map(child => (
                  <tr key={child.id} className="hover:bg-slate-50/80 transition-colors">
                    <td>
                      <div className="font-bold text-slate-900">{child.fullName}</div>
                      <div className="text-[11px] font-mono text-emerald-700">{child.id}</div>
                    </td>
                    <td>
                      <div className="font-semibold text-slate-800">{child.education}</div>
                      <div className="text-[11px] text-slate-500">{child.age} Tahun</div>
                    </td>
                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        child.status === 'Yatim Piatu' ? 'badge-red' : child.status === 'Yatim' ? 'badge-amber' : 'badge-emerald'
                      }`}>
                        {child.status}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        child.nikStatus === 'Lengkap' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {child.nikStatus}
                      </span>
                    </td>
                    <td className="text-xs text-slate-700">
                      {child.guardian}
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        child.fosterStatus === 'Ada Orang Tua Asuh' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {child.fosterStatus}
                      </span>
                    </td>
                    <td className="text-right space-x-1">
                      <button
                        onClick={() => setSelectedChild(child)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold transition-colors"
                      >
                        Detail & Rapor
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Anak (Rekam Medis, Rapor, Prestasi) */}
      {selectedChild && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4 p-6 relative animate-fade-in max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl">
                  {selectedChild.firstName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedChild.fullName}</h3>
                  <p className="text-xs text-slate-500">
                    ID: {selectedChild.id} • {selectedChild.education} ({selectedChild.age} Th) • Status: {selectedChild.status}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedChild(null)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <i data-lucide="x" className="w-5 h-5"></i>
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex space-x-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setModalTab('medical')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  modalTab === 'medical' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <i data-lucide="activity" className="w-4 h-4"></i>
                <span>Rekam Medis Kesehatan</span>
              </button>

              <button
                onClick={() => setModalTab('report')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  modalTab === 'report' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <i data-lucide="book-open" className="w-4 h-4"></i>
                <span>Nilai Rapor Sekolah</span>
              </button>

              <button
                onClick={() => setModalTab('achievements')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  modalTab === 'achievements' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <i data-lucide="award" className="w-4 h-4"></i>
                <span>Prestasi & Bakat</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              
              {/* TAB 1: Rekam Medis */}
              {modalTab === 'medical' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Catatan Kesehatan & Pemeriksaan Rutin</span>
                    <span className="text-emerald-700">Dokter Penanggung Jawab: dr. Amanda</span>
                  </div>

                  {selectedChild.medicalHistory.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl text-center">
                      Belum ada catatan riwayat sakit berat. Anak dalam kondisi sehat.
                    </p>
                  ) : (
                    selectedChild.medicalHistory.map((med, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>{med.diagnosis}</span>
                          <span className="text-slate-500">{med.date}</span>
                        </div>
                        <p className="text-slate-600">Tindakan: {med.treatment}</p>
                        <span className="text-[11px] text-emerald-700 font-semibold">Pemeriksa: {med.doctor}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: Rapor Sekolah */}
              {modalTab === 'report' && (
                <div className="space-y-3">
                  {selectedChild.schoolReport.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl text-center">
                      Belum ada data rapor sekolah tercatat.
                    </p>
                  ) : (
                    selectedChild.schoolReport.map((rep, i) => (
                      <div key={i} className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800 text-sm">{rep.semester}</span>
                          <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-mono font-bold text-xs">
                            Rata-Rata GPA: {rep.gpa}
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-700">Mata Pelajaran Unggulan:</strong> {rep.topSubjects.join(', ')}
                        </div>
                        <p className="text-slate-600 italic">"{rep.teacherNotes}"</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: Prestasi */}
              {modalTab === 'achievements' && (
                <div className="space-y-3">
                  {selectedChild.achievements.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl text-center">
                      Belum ada sertifikat perlombaan tercatat.
                    </p>
                  ) : (
                    selectedChild.achievements.map((ach, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-900">{ach.title}</div>
                          <div className="text-slate-500">Tingkat {ach.level} • Tahun {ach.year}</div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 font-bold">
                          Medali {ach.medal}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedChild(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
              >
                Tutup Modal
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

window.ChildManagement = ChildManagement;
