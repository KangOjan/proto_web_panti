// Admin Offline Donation Component
// SIMK-Panti - Pencatatan Donasi Langsung (Offline: Uang Tunai & Barang)

const simkValidOfflineDonorName = (value) =>
  String(value || '').trim().length <= 150 &&
  /^(?=(?:.*\p{L}){2,})[\p{L}\p{M}]+(?:[ .,'\u2019-]+[\p{L}\p{M}]+)*\.?$/u.test(String(value || '').trim());

const OfflineDonation = ({
  campaigns = [],
  onAddOfflineDonation = null,
  onVerifyOfflineDonation = null,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  // Data displayed in this table always originates from the Laravel API.
  const [serverPage, setServerPage] = React.useState(1);
  const [serverItems, setServerItems] = React.useState([]);
  const [serverPagination, setServerPagination] = React.useState({
    current_page: 1, last_page: 1, total: 0,
  });
  const [reloadKey, setReloadKey] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [listError, setListError] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [verifyingId, setVerifyingId] = React.useState(null);
  const [formError, setFormError] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState({});
  const inlineError = (field) => fieldErrors[field] ? (
    <p role="alert" className="mt-1.5 flex items-start gap-1.5 rounded-lg bg-rose-50 px-2.5 py-2 text-[11px] leading-relaxed text-rose-700">
      <span aria-hidden="true" className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-rose-100 font-bold">!</span>
      <span>{fieldErrors[field]}</span>
    </p>
  ) : null;
  const clearFieldError = (field) => setFieldErrors((old) => ({ ...old, [field]: null }));
  const donorInputRef = React.useRef(null);


  // Render the dialog into <body>: avoids clipping by transformed/scrolling
  // admin page containers and prevents large blank gutters around the modal.
  React.useEffect(() => {
    if (!isModalOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    donorInputRef.current?.focus();
    const onEscape = (event) => {
      if (event.key === 'Escape' && !isSaving) setIsModalOpen(false);
    };
    document.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', onEscape);
    };
  }, [isModalOpen, isSaving]);

  React.useEffect(() => {
    let active = true;
    setIsLoading(true);
    setListError(null);
    DonationApi.getManagedDonations(serverPage)
      .then((response) => {
        if (!response?.success || !Array.isArray(response?.data?.items)) {
          throw new Error('Daftar donasi dari Laravel tidak valid.');
        }
        if (!active) return;
        setServerItems(response.data.items);
        setServerPagination(response.data.pagination || {
          current_page: serverPage, last_page: serverPage, total: 0,
        });
      })
      .catch((error) => {
        if (!active) return;
        setServerItems([]);
        setListError(error?.message || 'Gagal memuat daftar donasi offline.');
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [serverPage, reloadKey]);

  const enumValue = (value) => {
    if (value && typeof value === 'object') return String(value.value ?? '').toLowerCase();
    return String(value ?? '').toLowerCase();
  };

  const normalizeDonation = (raw) => {
    const status = enumValue(raw.status);
    return {
      id: raw.public_id || raw.id,
      publicId: raw.public_id || null,
      type: enumValue(raw.source),
      isManualTransfer: raw.is_manual_transfer === true || raw.is_manual_transfer === 1 || raw.is_manual_transfer === '1',
      status: status === 'verified' ? 'Terverifikasi'
        : status === 'pending' ? 'Pending'
        : status === 'cancelled' ? 'Dibatalkan' : (status || '-'),
      donorName: raw.donor_name || raw.donorName || 'Hamba Allah',
      campaignTitle: raw.campaign?.title || raw.campaign_title || 'Donasi Umum',
      amount: Number(raw.amount || 0),
      message: raw.note || '',
      kind: 'uang', // Backend's monetary donation endpoint excludes in-kind stock.
      createdAt: raw.created_at || null,
    };
  };


  const [donorName, setDonorName] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [campaignId, setCampaignId] = React.useState('');
  const [message, setMessage] = React.useState('');

  // The endpoint paginates all donations (online + offline). We filter only
  // this page, and allow navigation to other server pages without fake totals.
  const offlineDonations = serverItems
    .map(normalizeDonation)
    .filter((donation) => donation.type === 'offline' && !donation.isManualTransfer);

  const filteredOffline = offlineDonations.filter((d) =>
    [d.donorName, d.message, d.campaignTitle, d.id]
      .some((field) => String(field || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleVerifyOffline = async (donation) => {
    if (!donation?.publicId || donation.status !== 'Pending' || verifyingId) return;
    if (typeof onVerifyOfflineDonation !== 'function') {
      setListError('Tombol verifikasi belum terhubung ke callback Laravel. Periksa prop onVerifyOfflineDonation di app.jsx.');
      return;
    }
    setListError(null);
    if (!window.confirm(`Verifikasi donasi ${donation.publicId} senilai Rp ${donation.amount.toLocaleString('id-ID')}? Tindakan ini mencatat penerimaan resmi ke Buku Kas.`)) return;
    setVerifyingId(donation.publicId);
    try {
      const verified = await onVerifyOfflineDonation(donation.publicId);
      if (verified) {
        setReloadKey((key) => key + 1);
      } else {
        setListError('Verifikasi belum berhasil. Periksa notifikasi serta respons PATCH pada Network.');
      }
    } catch (error) {
      setListError(error?.message || 'Verifikasi donasi gagal.');
    } finally {
      setVerifyingId(null);
    }
  };

  const openDonationModal = () => {
    setFormError('');
    setFieldErrors({});
    setIsModalOpen(true);
  };
  const closeDonationModal = () => {
    if (!isSaving) setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (isSaving || !onAddOfflineDonation) return;
    const errors = {};
    if (!donorName.trim()) errors.donor = 'Isi nama donatur atau instansi.';
    else if (!simkValidOfflineDonorName(donorName)) errors.donor = 'Gunakan huruf dan tanda baca nama yang wajar, tanpa angka atau simbol.';
    const amountNumber = Number(amount);
    if (!/^\d+$/.test(String(amount).trim()) || !Number.isSafeInteger(amountNumber) || amountNumber < 10000) {
      errors.amount = 'Masukkan angka bulat minimal Rp10.000.';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      document.getElementById(Object.keys(errors)[0] === 'donor' ? 'offline-donor' : 'offline-amount')?.focus();
      return;
    }

    setIsSaving(true);
    try {
      const saved = await onAddOfflineDonation({
        donorName: donorName.trim(),
        kind: 'uang',
        amount: amountNumber,
        campaignId: campaignId || null,
        message: message.trim(),
      });
      if (!saved) { setFormError('Donasi belum berhasil disimpan. Periksa pesan kesalahan dan coba kembali.'); return; }
      setIsModalOpen(false);
      setDonorName('');
      setAmount('');
      setMessage('');
      setServerPage(1);
      setReloadKey((key) => key + 1);
    } catch (error) {
      setFormError(error?.message || 'Donasi gagal disimpan. Coba kembali.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Heart className="w-4 h-4 text-emerald-400" />
            <span>Penerimaan Bantuan Langsung</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
            Pencatatan Donasi Langsung (Offline)
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mt-1 leading-relaxed">
            Catat donasi uang melalui Laravel. Status awal Pending; hanya donasi yang telah diverifikasi masuk Buku Kas. Donasi barang memerlukan modul inventaris terpisah.
          </p>
        </div>

        <button
          type="button"
          onClick={openDonationModal}
          className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs shadow-lg flex items-center space-x-2 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>Catat Donasi Offline Baru</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs font-bold text-slate-500">
          Donasi offline pada halaman ini: <b className="text-slate-900">{offlineDonations.length}</b> · Total semua sumber di API: {serverPagination.total}
        </div>

        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari nama donatur, rincian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 relative"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">TANGGAL & KODE</th>
                <th className="py-3.5 px-4">NAMA DONATUR</th>
                <th className="py-3.5 px-4">BENTUK DONASI</th>
                <th className="py-3.5 px-4">CAMPAIGN TUJUAN</th>
                <th className="py-3.5 px-4">NOMINAL / RINCIAN BARANG</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="sticky right-0 z-10 bg-slate-50 py-3.5 px-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {isLoading || filteredOffline.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    <Heart className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold">{isLoading ? 'Memuat data dari Laravel...' : listError ? 'Data belum dapat dimuat.' : 'Tidak ada donasi offline pada halaman ini.'}</p>
                  </td>
                </tr>
              ) : (
                filteredOffline.map((don) => (
                  <tr key={don.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono text-xs font-bold text-slate-900">{don.id}</div>
                      <div className="text-[10px] text-slate-400">
                        {don.createdAt ? new Date(don.createdAt).toLocaleDateString('id-ID') : '-'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {don.donorName}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        don.kind === 'barang'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {don.kind === 'barang' ? <Package className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
                        <span className="capitalize">{don.kind}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-semibold truncate max-w-xs">{don.campaignTitle}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {don.kind === 'uang' ? (
                        <div className="font-black text-emerald-700 text-sm">
                          Rp {don.amount.toLocaleString('id-ID')}
                        </div>
                      ) : (
                        <div className="font-bold text-slate-800">
                          Bantuan barang belum didukung
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${don.status === 'Terverifikasi' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {don.status}
                      </span>
                    </td>
                    <td className="sticky right-0 z-10 bg-white py-3.5 px-4 text-right whitespace-nowrap">
                      {don.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => handleVerifyOffline(don)}
                          disabled={!don.publicId || Boolean(verifyingId)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold disabled:opacity-50 hover:bg-emerald-800"
                        >
                          {verifyingId === don.publicId ? 'Memverifikasi...' : 'Verifikasi ke Buku Kas'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {listError && (
        <div role="alert" className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-800">
          {listError} <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="underline font-bold ml-2">Coba lagi</button>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 text-xs font-bold text-slate-600">
        <button type="button" disabled={isLoading || serverPage <= 1} onClick={() => setServerPage((p) => Math.max(1, p - 1))} className="px-4 py-2 rounded-xl border disabled:opacity-40">Sebelumnya</button>
        <span>Halaman {serverPagination.current_page} / {serverPagination.last_page}</span>
        <button type="button" disabled={isLoading || serverPage >= Number(serverPagination.last_page || 1)} onClick={() => setServerPage((p) => p + 1)} className="px-4 py-2 rounded-xl border disabled:opacity-40">Berikutnya</button>
      </div>

      {/* Popup rendered at document.body to avoid transform/overflow clipping. */}
      {isModalOpen && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-[3px] px-3 py-4 sm:px-6 sm:py-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDonationModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="offline-donation-title"
            className="flex w-full max-w-[640px] max-h-[92vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl"
          >
            {/* Fixed modal header */}
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-7 sm:py-5">
              <div className="min-w-0">
                <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700">
                  <Heart className="h-3.5 w-3.5" /> Penerimaan Donasi Langsung
                </div>
                <h2 id="offline-donation-title" className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                  Catat Donasi Offline
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Donasi uang dicatat sebagai pending sampai diverifikasi pengurus.
                </p>
              </div>
              <button
                type="button"
                onClick={closeDonationModal}
                disabled={isSaving}
                aria-label="Tutup formulir donasi"
                className="shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
              >
                <span aria-hidden="true" className="text-xl leading-none">×</span>
              </button>
            </header>

            <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
              {/* Only this body scrolls on small displays. */}
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 text-xs sm:px-7 sm:py-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="offline-donor" className="mb-1.5 block font-extrabold uppercase tracking-wide text-slate-700">
                      Nama Donatur / Instansi <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="offline-donor" ref={donorInputRef} required type="text" maxLength="150"
                      placeholder="Nama donatur atau Hamba Allah"
                      value={donorName} onChange={(event) => { setDonorName(event.target.value); clearFieldError('donor'); }}
                      aria-describedby="offline-donor-hint"
                      aria-invalid={Boolean(fieldErrors.donor)}
                      disabled={isSaving}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                    />
                    {inlineError('donor')}
                    <p id="offline-donor-hint" className="mt-1 text-[11px] text-slate-500">
                      Gunakan nama asli atau nama instansi, tanpa angka dan simbol.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="offline-amount" className="mb-1.5 block font-extrabold uppercase tracking-wide text-slate-700">
                      Nominal Donasi (Rp) <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center font-extrabold text-slate-500">Rp</span>
                      <input
                        id="offline-amount" type="text" inputMode="numeric" maxLength="15" required
                        placeholder="10000" value={amount}
                        onChange={(event) => { setAmount(event.target.value); clearFieldError('amount'); }} disabled={isSaving}
                        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 font-black text-emerald-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                      />
                    </div>
                    {inlineError('amount')}
                  </div>
                </div>

                <div>
                  <label htmlFor="offline-campaign" className="mb-1.5 block font-extrabold uppercase tracking-wide text-slate-700">
                    Alokasi Donasi
                  </label>
                  <select
                    id="offline-campaign" value={campaignId} disabled={isSaving}
                    onChange={(event) => setCampaignId(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                  >
                    <option value="">Donasi Umum (tanpa campaign)</option>
                    {campaigns.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="offline-message" className="mb-1.5 block font-extrabold uppercase tracking-wide text-slate-700">
                    Catatan / Doa Donatur <span className="font-medium normal-case text-slate-400">(opsional)</span>
                  </label>
                  <textarea
                    id="offline-message" rows="2" maxLength="2000"
                    placeholder="Catatan penerimaan atau doa donatur..."
                    value={message} disabled={isSaving}
                    onChange={(event) => setMessage(event.target.value)}
                    className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                  />
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-amber-900">
                  <span aria-hidden="true" className="text-base">ⓘ</span>
                  <p className="leading-relaxed">
                    Tanggal otomatis dari server. Hanya donasi uang yang didukung. Donasi <strong>belum masuk Buku Kas</strong> sampai tombol <strong>Verifikasi ke Buku Kas</strong> ditekan pada tabel.
                  </p>
                </div>

                {formError && (
                  <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 font-semibold text-rose-700">
                    {formError}
                  </p>
                )}
              </div>

              {/* Fixed action bar keeps the primary action always visible. */}
              <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-5 py-3.5 sm:px-7">
                <button
                  type="button" onClick={closeDonationModal} disabled={isSaving}
                  className="rounded-xl px-4 py-2.5 font-extrabold text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit" disabled={isSaving}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? 'Menyimpan…' : 'Simpan Donasi Offline'}
                </button>
              </footer>
            </form>
          </section>
        </div>,
        document.body
      )}
    </div>
  );
};

window.OfflineDonation = OfflineDonation;
