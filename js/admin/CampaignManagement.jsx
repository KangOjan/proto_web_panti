// Admin Campaign Management Component
// SIMK-Panti - Pengelolaan Program / Campaign Donasi

// Data gambar dan tanggal berasal dari API Laravel. Tidak memakai URL foto fiktif.
const simkFormatCampaignDate = (value) => {
  if (!value) return 'Belum ditetapkan';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Tanggal tidak valid';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta',
  }).format(date);
};

const simkCampaignDateInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value || '';
  return `${part('year')}-${part('month')}-${part('day')}`;
};

const simkCampaignImage = (campaign) =>
  campaign?.headerImageUrl || campaign?.header_image_url || campaign?.image || null;

const SimkCampaignCover = ({ campaign }) => {
  const src = simkCampaignImage(campaign);
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => { setFailed(false); }, [src]);
  return (
    <div className="aspect-video relative overflow-hidden bg-slate-100">
      {src && !failed ? (
        <img src={src} alt={campaign.title || 'Foto program donasi'}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-5 text-center text-slate-500">
          <span className="text-xs font-semibold">Foto program belum tersedia</span>
          <span className="text-[11px]">Tambahkan gambar pada data campaign.</span>
        </div>
      )}
    </div>
  );
};

const CampaignManagement = ({
  campaigns = [],
  onSaveCampaign = null,
  onDeleteCampaign = null,
  onAddCampaignUpdate = null,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
  const [editingCampaign, setEditingCampaign] = React.useState(null);
  const [selectedCampaignForUpdate, setSelectedCampaignForUpdate] = React.useState(null);

  // Form Campaign State
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('Konsumsi');
  const [targetAmount, setTargetAmount] = React.useState(20000000);
  const [deadline, setDeadline] = React.useState('2026-10-31');
  const [status, setStatus] = React.useState('Aktif');
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState('');
  const [saveError, setSaveError] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState('');
  const [dbCategories, setDbCategories] = React.useState([]);

  // Form Update State
  const [updateTitle, setUpdateTitle] = React.useState('');
  const [updateContent, setUpdateContent] = React.useState('');
  const [updateStatus, setUpdateStatus] = React.useState('published');
  const [editingUpdateId, setEditingUpdateId] = React.useState(null);
  const [existingUpdates, setExistingUpdates] = React.useState([]);
  const [updatesLoading, setUpdatesLoading] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    if (!window.CampaignApi || typeof CampaignApi.getCategories !== 'function') return;
    CampaignApi.getCategories()
      .then((response) => { if (active && Array.isArray(response?.data)) setDbCategories(response.data); })
      .catch((error) => console.warn('Gagal memuat kategori campaign:', error));
    return () => { active = false; };
  }, []);
  const categories = dbCategories.length ? dbCategories : Array.from(
    new Map(campaigns.filter((camp) => camp.categoryId != null)
      .map((camp) => [String(camp.categoryId), { id: camp.categoryId, name: camp.category }])).values()
  );
  const statuses = [
    { value: 'draft', name: 'Draft' },
    { value: 'active', name: 'Aktif' },
    { value: 'closed', name: 'Ditutup' },
    { value: 'inactive', name: 'Tidak aktif' },
  ];

  const handleOpenAddModal = () => {
    setEditingCampaign(null);
    setTitle('');
    setCategory('Konsumsi');
    setCategoryId(categories[0]?.id ? String(categories[0].id) : '');
    setTargetAmount(20000000);
    setDeadline('2026-10-31');
    setStatus('active');
    setDescription('');
    setImage('');
    setSaveError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (camp) => {
    setEditingCampaign(camp);
    setTitle(camp.title || '');
    setCategory(camp.category || 'Konsumsi');
    setCategoryId(String(camp.categoryId ?? ''));
    setTargetAmount(camp.targetAmount || 0);
    setDeadline(simkCampaignDateInput(camp.deadline));
    setStatus(camp.status || 'active');
    setDescription(camp.description || '');
    setImage(simkCampaignImage(camp) || '');
    setSaveError(null);
    setIsModalOpen(true);
  };

  const handleSaveSubmit = async (event) => {
    event.preventDefault();
    if (!onSaveCampaign) { setSaveError('API penyimpanan campaign belum tersedia.'); return; }
    const selectedCategory = categories.find((item) => String(item.id) === String(categoryId));
    if (!selectedCategory || !title.trim() || !description.trim() || !deadline) {
      setSaveError('Lengkapi kategori, judul, deskripsi, dan tenggat terlebih dahulu.');
      return;
    }
    // Backend membatasi URL gambar ke HTTP(S). Aset lokal yang sudah tersimpan
    // melalui seeder tidak perlu dikirim ulang ketika menyunting detail lain.
    const absoluteImage = /^https?:\/\//i.test(image.trim());
    if (!editingCampaign && !absoluteImage) {
      setSaveError('Untuk campaign baru, gunakan URL gambar HTTPS. Upload gambar lokal membutuhkan endpoint upload backend.');
      return;
    }
    const payload = {
      ...(editingCampaign ? { id: editingCampaign.id } : {}),
      category_id: Number(selectedCategory.id),
      title: title.trim(),
      target_amount: Number(targetAmount),
      deadline,
      status,
      description: description.trim(),
      ...(absoluteImage ? { header_image_url: image.trim() } : {}),
    };
    setSaving(true);
    setSaveError(null);
    try {
      const result = await onSaveCampaign(payload);
      if (result === false || result?.success === false) {
        throw new Error('Penyimpanan campaign gagal. Periksa notifikasi dari server.');
      }
      setIsModalOpen(false);
    } catch (error) {
      setSaveError(error?.message || 'Gagal menyimpan campaign.');
    } finally {
      setSaving(false);
    }
  };

  const [updateSubmitting, setUpdateSubmitting] = React.useState(false);
  const [updateError, setUpdateError] = React.useState(null);

  const openUpdateModal = async (campaign) => {
    setSelectedCampaignForUpdate(campaign);
    setEditingUpdateId(null);
    setUpdateTitle('');
    setUpdateContent('');
    setUpdateStatus('published');
    setUpdateError(null);
    setExistingUpdates([]);
    setIsUpdateModalOpen(true);
    setUpdatesLoading(true);
    try {
      const response = await CampaignApi.getPengurusUpdates(campaign.id);
      if (!Array.isArray(response?.data)) throw new Error('Respons daftar laporan tidak valid.');
      setExistingUpdates(response.data);
    } catch (error) {
      setUpdateError(error?.message || 'Gagal memuat laporan sebelumnya.');
    } finally {
      setUpdatesLoading(false);
    }
  };

  const handleDeleteUpdate = async (report) => {
    if (!selectedCampaignForUpdate || !window.confirm('Hapus kabar perkembangan ini?')) return;
    setUpdateError(null);
    try {
      await CampaignApi.deletePengurusUpdate(selectedCampaignForUpdate.id, report.id);
      setExistingUpdates((current) => current.filter((item) => item.id !== report.id));
      if (editingUpdateId === report.id) {
        setEditingUpdateId(null);
        setUpdateTitle('');
        setUpdateContent('');
      }
    } catch (error) {
      setUpdateError(error?.message || 'Gagal menghapus laporan.');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!updateTitle.trim() || !updateContent.trim() || !selectedCampaignForUpdate) return;
    if (!onAddCampaignUpdate && !editingUpdateId) {
      setUpdateError('API untuk menyimpan perkembangan belum tersedia.');
      return;
    }
    setUpdateSubmitting(true);
    setUpdateError(null);
    try {
      if (editingUpdateId) {
        await CampaignApi.editPengurusUpdate(selectedCampaignForUpdate.id, editingUpdateId, {
          title: updateTitle.trim(),
          content: updateContent.trim(),
          status: updateStatus,
        });
      } else {
        await onAddCampaignUpdate(selectedCampaignForUpdate.id, {
          title: updateTitle.trim(),
          content: updateContent.trim(),
          status: updateStatus,
        });
      }
      const response = await CampaignApi.getPengurusUpdates(selectedCampaignForUpdate.id);
      setExistingUpdates(Array.isArray(response?.data) ? response.data : []);
      setEditingUpdateId(null);
      setUpdateTitle('');
      setUpdateContent('');
      setUpdateStatus('published');
    } catch (error) {
      setUpdateError(error?.message || 'Gagal menyimpan laporan perkembangan.');
    } finally {
      setUpdateSubmitting(false);
    }
  };

  const getStatusBadge = (st) => ({
    active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    draft: 'bg-amber-100 text-amber-800 border-amber-200',
    closed: 'bg-slate-100 text-slate-800 border-slate-200',
    inactive: 'bg-rose-50 text-rose-700 border-rose-200',
  }[String(st || '').toLowerCase()] || 'bg-slate-100 text-slate-800 border-slate-200');
  const getStatusLabel = (st) => ({
    active: 'Aktif', draft: 'Draft', closed: 'Ditutup', inactive: 'Tidak aktif',
  }[String(st || '').toLowerCase()] || st || 'Tidak diketahui');

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
          const collected = camp.verifiedCollectedAmount ?? camp.collectedAmount;
          const target = Number(camp.targetAmount) || 0;
          const pct = collected == null || target <= 0 ? 0
            : Math.min(Math.max(Math.round((Number(collected) / target) * 100), 0), 100);

          return (
            <div
              key={camp.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="relative">
                  <SimkCampaignCover campaign={camp} />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border shadow-xs ${getStatusBadge(camp.status)}`}>
                      {getStatusLabel(camp.status)}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-xs text-slate-500 font-semibold">
                    <span className="uppercase text-[10px] tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {camp.category}
                    </span>
                    <span className="text-right shrink-0 text-[11px]">Tenggat: {simkFormatCampaignDate(camp.deadline)}</span>
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
                      <span className="font-bold text-emerald-700">{collected == null ? 'Dana belum tersedia' : `Rp ${Number(collected).toLocaleString('id-ID')}`}</span>
                      <span className="text-slate-400">Target: Rp {target.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Updates count */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <History className="w-3.5 h-3.5" />
                      <span>Laporan Perkembangan</span>
                    </span>
                    <button
                      type="button"
onClick={() => openUpdateModal(camp)}
                      className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center space-x-1 text-[11px]"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Kelola Kabar</span>
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
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      setCategory(categories.find((item) => String(item.id) === e.target.value)?.name || '');
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                  >
                    <option value="" disabled>Pilih kategori...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
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
                      <option key={st.value} value={st.value}>{st.name}</option>
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
                <p className="mb-1 text-[11px] text-slate-500">Foto yang sudah tersimpan akan tetap tampil. Gambar baru menggunakan URL HTTPS.</p>
                <input
                  type="text"
                  placeholder="https://... (URL gambar baru)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              {saveError && <p role="alert" className="text-xs text-rose-700">{saveError}</p>}
              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit" disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Campaign'}
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
              <h3 className="text-base font-extrabold text-slate-900">Kelola Kabar Perkembangan</h3>
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

            <div className="max-h-36 overflow-y-auto space-y-2">
              {updatesLoading && <p className="text-xs text-slate-500">Memuat laporan...</p>}
              {existingUpdates.map((report) => (
                <div key={report.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 p-2 text-xs">
                  <span className="min-w-0 truncate">{report.title} <span className="text-slate-500">({report.status === 'published' ? 'Publik' : 'Draft'})</span></span>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" className="text-emerald-700 font-bold" onClick={() => {
                      setEditingUpdateId(report.id);
                      setUpdateTitle(report.title);
                      setUpdateContent(report.content);
                      setUpdateStatus(report.status);
                    }}>Edit</button>
                    <button type="button" className="text-rose-700 font-bold" onClick={() => handleDeleteUpdate(report)}>Hapus</button>
                  </div>
                </div>
              ))}
            </div>
            {updateError && <p role="alert" className="mb-3 text-xs text-rose-700">{updateError}</p>}
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

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Status publikasi</label>
                <select value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300">
                  <option value="draft">Simpan Draft</option>
                  <option value="published">Publikasikan</option>
                </select>
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
