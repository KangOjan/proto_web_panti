// Program Management Component (CRUD Program Prioritas Panti - Khusus Pengurus Harian)
const ProgramManagement = ({
  priorityPrograms,
  onSaveProgram,
  onDeleteProgram,
  currentUser
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProg, setEditingProg] = React.useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState(null);

  // Form State
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('Konsumsi');
  const [targetAmount, setTargetAmount] = React.useState(20000000);
  const [collectedAmount, setCollectedAmount] = React.useState(0);
  const [description, setDescription] = React.useState('');
  const [icon, setIcon] = React.useState('utensils');
  const [badgeColor, setBadgeColor] = React.useState('emerald');
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  const categories = [
    'Konsumsi', 'SPP/Pendidikan', 'Operasional', 'Kesehatan', 'Infak/Zakat', 'Donasi Rutin', 'Lainnya'
  ];

  const iconOptions = [
    { value: 'utensils', label: 'Konsumsi / Dapur (Piring & Sendok)' },
    { value: 'graduation-cap', label: 'Pendidikan / SPP (Toga Wisuda)' },
    { value: 'home', label: 'Asrama / Operasional (Gedung)' },
    { value: 'heart', label: 'Kesehatan & Kasih (Hati)' },
    { value: 'book-open', label: 'Buku / Perpustakaan (Buku Terbuka)' },
    { value: 'laptop', label: 'Teknologi / Komputer (Laptop)' },
    { value: 'award', label: 'Prestasi / Bakat (Piala)' }
  ];

  const colorOptions = [
    { value: 'emerald', label: 'Hijau Emerald', bg: 'bg-emerald-500' },
    { value: 'teal', label: 'Biru Teal', bg: 'bg-teal-500' },
    { value: 'amber', label: 'Kuning Amber', bg: 'bg-amber-500' },
    { value: 'indigo', label: 'Ungu Indigo', bg: 'bg-indigo-500' },
    { value: 'rose', label: 'Merah Rose', bg: 'bg-rose-500' }
  ];

  const handleOpenAddModal = () => {
    setEditingProg(null);
    setTitle('');
    setCategory('Konsumsi');
    setTargetAmount(15000000);
    setCollectedAmount(0);
    setDescription('');
    setIcon('utensils');
    setBadgeColor('emerald');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prog) => {
    setEditingProg(prog);
    setTitle(prog.title || '');
    setCategory(prog.category || 'Konsumsi');
    setTargetAmount(prog.targetAmount || 0);
    setCollectedAmount(prog.collectedAmount || 0);
    setDescription(prog.description || '');
    setIcon(prog.icon || 'utensils');
    setBadgeColor(prog.badgeColor || 'emerald');
    setIsActive(prog.isActive !== false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Mohon lengkapi Judul dan Deskripsi Program Prioritas.");
      return;
    }

    const programPayload = {
      id: editingProg ? editingProg.id : `PROG-${Math.floor(Math.random() * 899 + 100)}`,
      title,
      category,
      targetAmount: Number(targetAmount),
      collectedAmount: Number(collectedAmount),
      description,
      icon,
      badgeColor,
      isActive,
      updatedAt: new Date().toISOString()
    };

    onSaveProgram(programPayload);
    setIsModalOpen(false);
  };

  // Summary Metrics
  const totalPrograms = priorityPrograms.length;
  const activeCount = priorityPrograms.filter(p => p.isActive !== false).length;
  const totalTarget = priorityPrograms.reduce((sum, p) => sum + (p.targetAmount || 0), 0);
  const totalCollected = priorityPrograms.reduce((sum, p) => sum + (p.collectedAmount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <i data-lucide="layers" className="w-4 h-4 text-emerald-400"></i>
            <span>Ruang Kerja: Pengurus Harian</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
            Manajemen Program Prioritas Panti
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mt-1 leading-relaxed">
            Kelola daftar program prioritas panti asuhan. Program yang berstatus <b>Aktif</b> akan secara otomatis tampil sebagai kartu donasi interaktif pada halaman <b>Beranda</b> publik.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-amber-400/20 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
        >
          <i data-lucide="plus-circle" className="w-4 h-4 text-slate-950"></i>
          <span>Tambah Program Prioritas</span>
        </button>
      </div>

      {/* Program Stats Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-extrabold text-slate-500 uppercase">Total Program</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalPrograms} Program</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Tercatat di sistem</div>
        </div>

        <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-200 shadow-xs">
          <div className="text-xs font-extrabold text-emerald-800 uppercase">Program Aktif (Beranda)</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{activeCount} Program</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Tayang di halaman publik</div>
        </div>

        <div className="bg-teal-50 p-5 rounded-3xl border border-teal-200 shadow-xs">
          <div className="text-xs font-extrabold text-teal-800 uppercase">Total Target Dana</div>
          <div className="text-xl font-black text-teal-700 mt-1">Rp {totalTarget.toLocaleString('id-ID')}</div>
          <div className="text-[11px] text-teal-600 mt-0.5">Kebutuhan operasional anak</div>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xs">
          <div className="text-xs font-extrabold text-amber-400 uppercase">Total Terhimpun</div>
          <div className="text-xl font-black text-white mt-1">Rp {totalCollected.toLocaleString('id-ID')}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Donasi masuk terverifikasi</div>
        </div>
      </div>

      {/* Program List Table / Card View */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Daftar Program Prioritas Panti</h3>
            <p className="text-xs text-slate-500">Gunakan tombol Aksi untuk mengubah detail atau menonaktifkan tayangan program</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {priorityPrograms.length} Program Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">PROGRAM & KATEGORI</th>
                <th className="py-3.5 px-4">DESKRIPSI KEBUTUHAN</th>
                <th className="py-3.5 px-4">TARGET DANA (RP)</th>
                <th className="py-3.5 px-4">TERHIMPUN (RP)</th>
                <th className="py-3.5 px-4">PROGRES</th>
                <th className="py-3.5 px-4">STATUS BERANDA</th>
                <th className="py-3.5 px-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {priorityPrograms.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    <i data-lucide="layers" className="w-10 h-10 mx-auto mb-2 text-slate-300"></i>
                    <p className="font-semibold">Belum ada data program prioritas. Klik "Tambah Program Prioritas" untuk membuat.</p>
                  </td>
                </tr>
              ) : (
                priorityPrograms.map((prog) => {
                  const percent = prog.targetAmount > 0 
                    ? Math.min(100, Math.round(((prog.collectedAmount || 0) / prog.targetAmount) * 100))
                    : 0;

                  return (
                    <tr key={prog.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-black text-slate-900 text-xs">{prog.title}</div>
                        <div className="flex items-center space-x-1.5 mt-1">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {prog.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{prog.id}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-600 text-xs max-w-xs line-clamp-2 leading-relaxed">
                          {prog.description}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900">
                        Rp {(prog.targetAmount || 0).toLocaleString('id-ID')}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-black text-emerald-700">
                        Rp {(prog.collectedAmount || 0).toLocaleString('id-ID')}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div 
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <span className="text-[11px] font-extrabold text-slate-700">{percent}%</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {prog.isActive !== false ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Tayang di Beranda</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
                            <span>Diarsipkan</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenEditModal(prog)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg transition-all border border-slate-200"
                            title="Edit Program"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                            </svg>
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(prog.id)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition-all border border-slate-200"
                            title="Hapus Program"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PROGRAM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in no-print overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <i data-lucide="x" className="w-5 h-5"></i>
            </button>

            <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <i data-lucide="layers" className="w-5 h-5"></i>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {editingProg ? "Edit Program Prioritas" : "Tambah Program Prioritas Baru"}
                </h3>
                <p className="text-xs text-slate-500">
                  Program ini akan ditampilkan pada beranda website untuk memudahkan donatur menyalurkan bantuan.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Program Prioritas *
                </label>
                <input
                  type="text"
                  required
                  placeholder="cth: Pengadaan Seragam & Perlengkapan Sekolah"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kategori Alokasi Donasi *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-bold bg-white text-slate-900"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Ikon Program
                  </label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-semibold bg-white text-slate-900"
                  >
                    {iconOptions.map(ico => (
                      <option key={ico.value} value={ico.value}>{ico.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Dana (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min="100000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-black text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Dana Terkumpul Saat Ini (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={collectedAmount}
                    onChange={(e) => setCollectedAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-black text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi Kebutuhan & Peruntukkan Program *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Rincian kebutuhan pengadaan dan manfaat bagi anak-anak panti..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-medium leading-relaxed"
                ></textarea>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Status Tayang di Beranda</div>
                  <div className="text-[11px] text-slate-500">Jika aktif, program ini akan langsung muncul di halaman beranda publik</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center space-x-2"
                >
                  <i data-lucide="check" className="w-4 h-4"></i>
                  <span>{editingProg ? "Simpan Perubahan" : "Tambah Program"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in no-print">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <i data-lucide="alert-triangle" className="w-6 h-6"></i>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Hapus Program Prioritas?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Program ini tidak akan ditampilkan lagi pada halaman beranda publik.
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-1/2 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteProgram(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="w-1/2 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

window.ProgramManagement = ProgramManagement;
