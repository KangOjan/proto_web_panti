// Admin Campaign Management Component
// SIMK-Panti - Pengelolaan Program / Campaign Donasi

const CampaignManagement = ({
  campaigns = (window.INITIAL_SIMK_DATA?.campaigns || []),
  onSaveCampaign = null,
  onDeleteCampaign = null,
  onAddCampaignUpdate = null,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
  const [editingCampaign, setEditingCampaign] = React.useState(null);
  const [selectedCampaignForUpdate, setSelectedCampaignForUpdate] = React.useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState(null);

  // Form Campaign State
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('Konsumsi');
  const [targetAmount, setTargetAmount] = React.useState(20000000);
  const [collectedAmount, setCollectedAmount] = React.useState(0);
  const [deadline, setDeadline] = React.useState('2026-10-31');
  const [status, setStatus] = React.useState('Aktif');
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60');
  const [bankAccount, setBankAccount] = React.useState('Bank Syariah Indonesia (BSI) - 7123-4567-89 a.n. YPI Kasih Bunda');

  // Form Update State
  const [updateTitle, setUpdateTitle] = React.useState('');
  const [updateContent, setUpdateContent] = React.useState('');

  const categories = ['Konsumsi', 'Pendidikan', 'Fasilitas', 'Kesehatan', 'Operasional', 'Lainnya'];
  const statuses = ['Draft', 'Aktif', 'Target Tercapai', 'Ditutup', 'Dibatalkan'];

  const handleOpenAddModal = () => {
    setEditingCampaign(null);
    setTitle('');
    setCategory('Konsumsi');
    setTargetAmount(20000000);
    setCollectedAmount(0);
    setDeadline('2026-10-31');
    setStatus('Aktif');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60');
    setBankAccount('Bank Syariah Indonesia (BSI) - 7123-4567-89 a.n. YPI Kasih Bunda');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (camp) => {
    setEditingCampaign(camp);
    setTitle(camp.title || '');
    setCategory(camp.category || 'Konsumsi');
    setTargetAmount(camp.targetAmount || 0);
    setCollectedAmount(camp.collectedAmount || 0);
    setDeadline(camp.deadline || '2026-10-31');
    setStatus(camp.status || 'Aktif');
    setDescription(camp.description || '');
    setImage(camp.image || '');
    setBankAccount(camp.bankAccount || '');
    setIsModalOpen(true);
  };

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Mohon isi Judul dan Deskripsi Campaign.');
      return;
    }

    const payload = {
      id: editingCampaign ? editingCampaign.id : `CMP-${Math.floor(Math.random() * 899 + 100)}`,
      title,
      category,
      targetAmount: Number(targetAmount),
      collectedAmount: Number(collectedAmount),
      deadline,
      status: Number(collectedAmount) >= Number(targetAmount) ? 'Target Tercapai' : status,
      description,
      image,
      bankAccount,
      updates: editingCampaign?.updates || [],
      createdAt: editingCampaign?.createdAt || new Date().toISOString()
    };

    if (onSaveCampaign) {
      onSaveCampaign(payload);
    }
    setIsModalOpen(false);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!updateTitle.trim() || !updateContent.trim()) {
      alert('Mohon isi Judul Update dan Content Penyaluran.');
      return;
    }

    const updatePayload = {
      id: `UPD-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      title: updateTitle,
      content: updateContent
    };

    if (onAddCampaignUpdate && selectedCampaignForUpdate) {
      onAddCampaignUpdate(selectedCampaignForUpdate.id, updatePayload);
    }

    setIsUpdateModalOpen(false);
    setUpdateTitle('');
    setUpdateContent('');
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Aktif':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Target Tercapai':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Draft':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Ditutup':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Dibatalkan':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Pengelolaan & Publikasi Program Donasi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
            Manajemen Campaign Donasi
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mt-1 leading-relaxed">
            Buat campaign baru, atur target dana, tenggat waktu, status operasional, serta publikasikan laporan perkembangan penyaluran donasi secara berkala.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs shadow-lg flex items-center space-x-2 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>Buat Campaign Baru</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((camp) => {
          const collected = camp.collectedAmount || 0;
          const target = camp.targetAmount || 1;
          const pct = Math.min(Math.round((collected / target) * 100), 100);

          return (
            <div
              key={camp.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  <img
                    src={camp.image}
                    alt={camp.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border shadow-xs ${getStatusBadge(camp.status)}`}>
                      {camp.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span className="uppercase text-[10px] tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {camp.category}
                    </span>
                    <span>Tenggat: {camp.deadline || '-'}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-2">
                    {camp.title}
                  </h3>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-700">Rp {collected.toLocaleString('id-ID')}</span>
                      <span className="text-slate-400">Target: Rp {target.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Updates count */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <History className="w-3.5 h-3.5" />
                      <span>{camp.updates ? camp.updates.length : 0} Laporan Update</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCampaignForUpdate(camp);
                        setIsUpdateModalOpen(true);
                      }}
                      className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center space-x-1 text-[11px]"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Tambah Update</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(camp)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Apakah Anda yakin ingin menghapus campaign "${camp.title}"?`)) {
                      if (onDeleteCampaign) onDeleteCampaign(camp.id);
                    }
                  }}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs border border-rose-200"
                  title="Hapus Campaign"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL ADD / EDIT CAMPAIGN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingCampaign ? 'Edit Program Campaign' : 'Buat Program Campaign Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Judul Program *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Paket Pangan & Gizi Anak Asuh..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Kategori *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Status Operasional *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Target Dana (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="100000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tenggat Waktu *</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              {editingCampaign && (
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Dana Terkumpul Sementara (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={collectedAmount}
                    onChange={(e) => setCollectedAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-emerald-700"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Deskripsi Lengkap *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Rincian tujuan program, sasaran bantuan, dan dampak bagi anak asuh..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">URL Gambar Banner</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Rekening Tujuan Donasi</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md"
                >
                  Simpan Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADD UPDATE */}
      {isUpdateModalOpen && selectedCampaignForUpdate && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Publikasi Update Penyaluran</h3>
              <button
                type="button"
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Program: <b>{selectedCampaignForUpdate.title}</b>
            </p>

            <form onSubmit={handleUpdateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Judul Berita Update *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembelian Bahan Makanan Tahap 1 Selesai..."
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Rincian Penyaluran & Dokumentasi *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tuliskan perkembangan penyaluran dana donasi kepada anak asuh..."
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md"
                >
                  Publikasikan Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

window.CampaignManagement = CampaignManagement;
