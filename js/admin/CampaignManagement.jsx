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

const simkTodayJakarta = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const value = (key) => parts.find((part) => part.type === key)?.value || '';
  return `${value('year')}-${value('month')}-${value('day')}`;
};

const simkCampaignImage = (campaign) =>
  campaign?.headerImageUrl || campaign?.header_image_url || campaign?.image || null;

const SimkCampaignCover = ({ campaign }) => {
  const src = window.CmsApi?.normalizeMediaUrl(simkCampaignImage(campaign)) || null;
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => { setFailed(false); }, [src]);
  return (
    <div className="aspect-video relative overflow-hidden bg-slate-100 group">
      {src && !failed ? (
        <img src={src} alt={campaign.title || 'Foto program donasi'}
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500 ease-out motion-reduce:transform-none motion-reduce:transition-none"
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
  campaignLoading = false,
  campaignError = null,
  onSaveCampaign = null,
  onDeleteCampaign = null,
  onAddCampaignUpdate = null,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [campaignFilter, setCampaignFilter] = React.useState('current');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
  const [editingCampaign, setEditingCampaign] = React.useState(null);
  const [selectedCampaignForUpdate, setSelectedCampaignForUpdate] = React.useState(null);

  // Form Campaign State
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('Konsumsi');
  const [targetAmount, setTargetAmount] = React.useState('');
  const [deadline, setDeadline] = React.useState('');
  const [status, setStatus] = React.useState('draft');
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState('');
  const [imageFile, setImageFile] = React.useState(null);
  const [imageFilePreview, setImageFilePreview] = React.useState('');
  React.useEffect(() => {
    if (!imageFile) { setImageFilePreview(''); return; }
    const preview = URL.createObjectURL(imageFile);
    setImageFilePreview(preview);
    return () => URL.revokeObjectURL(preview);
  }, [imageFile]);
  const [saveError, setSaveError] = React.useState(null);
  const [saveFieldErrors, setSaveFieldErrors] = React.useState({});
  const clearSaveFieldError = (field) => setSaveFieldErrors((previous) => ({ ...previous, [field]: null }));
  const campaignInlineError = (field) => saveFieldErrors[field] ? (
    <p role="alert" className="mt-1.5 flex items-start gap-1.5 rounded-lg bg-rose-50 px-2.5 py-2 text-[11px] leading-relaxed text-rose-700">
      <span aria-hidden="true" className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-rose-100 font-bold">!</span>
      <span>{saveFieldErrors[field]}</span>
    </p>
  ) : null;
  const [saving, setSaving] = React.useState(false);
  const campaignTitleInputRef = React.useRef(null);

  // Portal modal avoids clipping by transformed/scrolling dashboard containers.
  React.useEffect(() => {
    if (!isModalOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!saving) campaignTitleInputRef.current?.focus();
    const onEscape = (event) => {
      if (event.key === 'Escape' && !saving) setIsModalOpen(false);
    };
    document.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onEscape);
    };
  }, [isModalOpen, saving]);

  const [imagePreviewError, setImagePreviewError] = React.useState(false);
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
  // Campaign nonaktif/ditutup tetap berada di database untuk audit, tetapi
  // tidak memenuhi daftar utama yang digunakan pengurus sehari-hari.
  const campaignBuckets = React.useMemo(() => {
    const list = Array.isArray(campaigns) ? campaigns : [];
    const normalizedStatus = (camp) => String(camp?.status || '').toLowerCase();
    return {
      current: list.filter((camp) => !['inactive', 'closed'].includes(normalizedStatus(camp))),
      active: list.filter((camp) => normalizedStatus(camp) === 'active'),
      draft: list.filter((camp) => normalizedStatus(camp) === 'draft'),
      archive: list.filter((camp) => ['inactive', 'closed'].includes(normalizedStatus(camp))),
    };
  }, [campaigns]);
  const campaignTabs = [
    { key: 'current', label: 'Daftar Utama' },
    { key: 'active', label: 'Aktif' },
    { key: 'draft', label: 'Draft' },
    { key: 'archive', label: 'Arsip' },
  ];
  const visibleCampaigns = campaignBuckets[campaignFilter] || [];

  const handleOpenAddModal = () => {
    setEditingCampaign(null);
    setTitle('');
    setCategory('Konsumsi');
    setCategoryId(categories[0]?.id ? String(categories[0].id) : '');
    setTargetAmount('');
    setDeadline('');
    setStatus('draft');
    setDescription('');
    setImage('');
    setImageFile(null);
    setSaveError(null);
    setSaveFieldErrors({});
    setImagePreviewError(false);
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
    setImageFile(null);
    setSaveError(null);
    setSaveFieldErrors({});
    setImagePreviewError(false);
    setIsModalOpen(true);
  };

  const handleSaveSubmit = async (event) => {
    event.preventDefault();
    if (!onSaveCampaign) { setSaveError('API penyimpanan campaign belum tersedia.'); return; }
    const selectedCategory = categories.find((item) => String(item.id) === String(categoryId));
    const errors = {};
    if (!title.trim()) errors.title = 'Judul program wajib diisi.';
    else if (title.trim().length > 200) errors.title = 'Judul maksimal 200 karakter.';
    if (!selectedCategory) errors.category = 'Pilih kategori program.';
    if (!description.trim()) errors.description = 'Deskripsi lengkap program wajib diisi.';
    if (!/^\d+$/.test(String(targetAmount).trim()) || !Number.isSafeInteger(Number(targetAmount)) || Number(targetAmount) < 100000) {
      errors.target = 'Masukkan nominal bulat minimal Rp100.000, tanpa titik atau koma.';
    }
    if (!deadline) errors.deadline = 'Tentukan tanggal tenggat program.';
    else if (deadline < simkTodayJakarta()) errors.deadline = 'Tanggal tenggat sudah lewat. Pilih hari ini atau tanggal berikutnya.';
    if (!editingCampaign && !imageFile) errors.image = 'Unggah banner program terlebih dahulu.';
    if (imageFile && (!['image/jpeg', 'image/png', 'image/webp'].includes(imageFile.type) || imageFile.size > 4 * 1024 * 1024)) {
      errors.image = 'Gunakan gambar JPG, PNG, atau WebP maksimal 4 MB.';
    }
    setSaveFieldErrors(errors);
    if (Object.keys(errors).length) {
      setSaveError(null);
      const fields = { title: 'campaign-title', category: 'campaign-category', description: 'campaign-desc', target: 'campaign-target', deadline: 'campaign-deadline', image: 'campaign-image' };
      document.getElementById(fields[Object.keys(errors)[0]])?.focus();
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

    };
    setSaving(true);
    setSaveError(null);
    try {
      if (imageFile) {
        const uploaded = await CampaignApi.uploadBanner(imageFile);
        const path = uploaded?.data?.image_url;
        if (!path || !/^\/storage\/campaigns\/[a-z0-9._/-]+$/i.test(path)) {
          throw new Error('Backend tidak mengembalikan path banner yang valid.');
        }
        payload.header_image_url = new URL(path, window.location.origin).href;
      }
      const result = await onSaveCampaign(payload);
      if (result === false || result?.success === false) {
        throw new Error(result?.message || 'Penyimpanan campaign gagal. Periksa notifikasi dari server.');
      }
      setIsModalOpen(false);
      setCampaignFilter('current');
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

      {campaignError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">Gagal memuat daftar campaign pengurus: {campaignError}</div>}
      {campaignLoading && <p role="status" className="text-sm text-slate-600">Memuat seluruh campaign dari CMS...</p>}
      {!campaignLoading && !campaignError && campaigns.length === 0 &&
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Belum ada campaign tersimpan dalam CMS.</p>}

      <section aria-label="Filter daftar campaign" className="space-y-3">
        <div role="tablist" aria-label="Status campaign" className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3">
          {campaignTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={campaignFilter === tab.key}
              onClick={() => setCampaignFilter(tab.key)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 ${
                campaignFilter === tab.key
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label} <span className="ml-1 opacity-80">({campaignBuckets[tab.key].length})</span>
            </button>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-slate-600">
          {campaignFilter === 'archive'
            ? 'Program nonaktif dan ditutup tetap tersimpan sebagai arsip. Pilih Edit bila perlu mengaktifkannya kembali.'
            : 'Program yang dinonaktifkan tidak tampil di daftar utama atau pada halaman donasi publik. Lihat tab Arsip untuk riwayatnya.'}
        </p>
        {!campaignLoading && !campaignError && campaigns.length > 0 && visibleCampaigns.length === 0 && (
          <p role="status" className="rounded-xl border border-slate-200 bg-white px-5 py-6 text-sm text-slate-600">
            Tidak ada campaign pada kategori ini.
          </p>
        )}
      </section>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCampaigns.map((camp) => {
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

                {!['inactive', 'closed'].includes(String(camp.status || '').toLowerCase()) ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Nonaktifkan program "${camp.title}"? Program akan dipindahkan ke Arsip dan tidak ditampilkan kepada donatur. Riwayatnya tetap tersimpan.`)) {
                        if (onDeleteCampaign) onDeleteCampaign(camp.id);
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100"
                    title="Nonaktifkan dan pindahkan ke Arsip"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Arsipkan</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-medium text-slate-500">Tersimpan di Arsip</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL ADD / EDIT CAMPAIGN - only presentation and client validation changed. */}
      {isModalOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-[3px] flex items-center justify-center px-3 py-4 sm:px-6 sm:py-8" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setIsModalOpen(false); }}>
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-[700px] w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="campaign-modal-heading">
            <div className="shrink-0 px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100 bg-white flex justify-between items-start gap-4">
              <div>
                <p className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700">Pengelolaan Program Donasi</p>
                <h3 id="campaign-modal-heading" className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                  {editingCampaign ? 'Edit Campaign' : 'Buat Campaign Baru'}
                </h3>
                <p className="mt-1 text-xs text-slate-500">Lengkapi informasi program. Pilih Draft agar belum tampil sebagai campaign aktif.</p>
              </div>
              <button type="button" onClick={() => !saving && setIsModalOpen(false)} disabled={saving}
                aria-label="Tutup form campaign" className="rounded-xl px-3 py-2 hover:bg-slate-200 text-slate-600 font-bold disabled:opacity-50">✕</button>
            </div>

            <form id="campaign-form" onSubmit={handleSaveSubmit} noValidate className="flex flex-col min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-7 py-5 space-y-4 text-xs">
                <section className="space-y-3" aria-label="Identitas campaign">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="w-7 h-7 bg-emerald-50 text-emerald-700 rounded-lg grid place-items-center font-black text-xs">1</span>
                    <h4 className="font-extrabold text-slate-900">Informasi Program</h4>
                  </div>
                  <div>
                    <label htmlFor="campaign-title" className="block font-bold text-slate-700 mb-1.5">Judul Program <span className="text-rose-600">*</span></label>
                    <input id="campaign-title" ref={campaignTitleInputRef} type="text" required maxLength="200"
                      placeholder="Contoh: Bantuan Pendidikan Anak Asuh" value={title} onChange={(e) => { setTitle(e.target.value); clearSaveFieldError('title'); }}
                      aria-invalid={Boolean(saveFieldErrors.title)}
                      className={`w-full px-4 py-2.5 rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 ${saveFieldErrors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'}`} />
                    {campaignInlineError('title')}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="campaign-category" className="block font-bold text-slate-700 mb-1.5">Kategori <span className="text-rose-600">*</span></label>
                      <select id="campaign-category" value={categoryId} required
                        onChange={(e) => {
                          setCategoryId(e.target.value);
                          clearSaveFieldError('category');
                          setCategory(categories.find((item) => String(item.id) === e.target.value)?.name || '');
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400">
                        <option value="">Pilih kategori...</option>
                        {categories.map((cat) => <option key={cat.id} value={String(cat.id)}>{cat.name}</option>)}
                      </select>
                      {campaignInlineError('category')}
                      {!categories.length && <p className="text-xs text-amber-700 mt-1.5">Kategori belum tersedia. Periksa koneksi API kategori campaign.</p>}
                    </div>
                    <div>
                      <label htmlFor="campaign-status" className="block font-bold text-slate-700 mb-1.5">Status Operasional <span className="text-rose-600">*</span></label>
                      <select id="campaign-status" required value={status} onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400">
                        {statuses.map((st) => <option key={st.value} value={st.value}>{st.name}</option>)}
                      </select>
                    </div>
                  </div>
                  {status === 'active' && <p className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-900">Status <b>Aktif</b> akan membuat campaign tersedia pada halaman publik setelah disimpan.</p>}
                  <div>
                    <label htmlFor="campaign-desc" className="block font-bold text-slate-700 mb-1.5">Deskripsi Lengkap <span className="text-rose-600">*</span></label>
                    <textarea id="campaign-desc" rows="3" required placeholder="Tujuan, kebutuhan, penerima manfaat, dan rencana penyaluran dana..."
                      value={description} onChange={(e) => { setDescription(e.target.value); clearSaveFieldError('description'); }}
                      aria-invalid={Boolean(saveFieldErrors.description)}
                      className={`w-full px-4 py-2.5 rounded-xl border font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-400 ${saveFieldErrors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'}`} />
                    {campaignInlineError('description')}
                  </div>
                </section>

                <section className="space-y-3" aria-label="Dana dan tenggat">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="w-7 h-7 bg-emerald-50 text-emerald-700 rounded-lg grid place-items-center font-black text-xs">2</span>
                    <h4 className="font-extrabold text-slate-900">Target & Tenggat</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="campaign-target" className="block font-bold text-slate-700 mb-1.5">Target Dana (Rp) <span className="text-rose-600">*</span></label>
                      <input id="campaign-target" type="text" inputMode="numeric" maxLength="15" required placeholder="Contoh: 20000000"
                        value={targetAmount} onChange={(e) => { setTargetAmount(e.target.value); clearSaveFieldError('target'); }}
                        aria-invalid={Boolean(saveFieldErrors.target)}
                        className={`w-full px-4 py-2.5 rounded-xl border font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${saveFieldErrors.target ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'}`} />
                      {campaignInlineError('target')}
                      {Number(targetAmount) >= 100000 && <p className="text-xs text-emerald-700 mt-1">Rp {Number(targetAmount).toLocaleString('id-ID')}</p>}
                    </div>
                    <div>
                      <label htmlFor="campaign-deadline" className="block font-bold text-slate-700 mb-1.5">Tenggat Waktu <span className="text-rose-600">*</span></label>
                      <input id="campaign-deadline" type="date" required value={deadline} aria-invalid={Boolean(saveError && deadline && deadline < simkTodayJakarta())}
                        onChange={(e) => { setDeadline(e.target.value); setSaveError(null); clearSaveFieldError('deadline'); }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                      {campaignInlineError('deadline')}
                      <p className="text-xs text-slate-500 mt-1">Pilih tanggal hari ini atau tanggal mendatang sesuai periode resmi program.</p>
                    </div>
                  </div>
                </section>

                <section className="space-y-3" aria-label="Gambar banner">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="w-7 h-7 bg-emerald-50 text-emerald-700 rounded-lg grid place-items-center font-black text-xs">3</span>
                    <h4 className="font-extrabold text-slate-900">Gambar Banner</h4>
                  </div>
                  <div>
                    <label htmlFor="campaign-image" className="block font-bold text-slate-700 mb-1.5">Upload Banner {editingCampaign ? '(opsional jika tidak diganti)' : '*'} </label>
                    <input id="campaign-image" type="file" accept="image/jpeg,image/png,image/webp"
                      required={!editingCampaign} onChange={(e) => { setImageFile(e.target.files?.[0] || null); setImagePreviewError(false); clearSaveFieldError('image'); }}
                      className="block w-full rounded-xl border border-slate-300 p-3 text-sm" />
                    {campaignInlineError('image')}
                    <p className="text-xs text-slate-500 mt-1.5">JPG, PNG, atau WebP; maksimal 4 MB. Gambar disimpan di Laravel Storage.</p>
                  </div>
                  {(imageFilePreview || image.trim()) && (
                    <div className="border border-slate-200 rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs font-bold text-slate-600 mb-2">Pratinjau Banner</p>
                      <img src={imageFilePreview || window.CmsApi?.normalizeMediaUrl(image) || ''}
                        alt="Pratinjau banner campaign" className="w-full max-h-44 object-contain rounded-xl bg-white"
                        onError={(e) => { e.currentTarget.style.display = 'none'; setImagePreviewError(true); }} />
                      {imagePreviewError && <p className="text-xs text-rose-700">Gambar lama tidak dapat diakses. Silakan unggah yang baru.</p>}
                    </div>
                  )}
                </section>
                {saveError && <p role="alert" className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">{saveError}</p>}
              </div>
              <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-3.5 border-t border-slate-100 bg-slate-50">
                <span className="text-xs text-slate-500">* Wajib diisi</span>
                <div className="flex items-center gap-2 ml-auto">
                  <button type="button" disabled={saving} onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold disabled:opacity-50">Batal</button>
                  <button type="submit" disabled={saving || categories.length === 0}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold shadow-sm disabled:opacity-50">
                    {saving ? 'Menyimpan...' : editingCampaign ? 'Simpan Perubahan' : 'Buat Campaign'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
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
