// SIMK-Panti: pengurus-only manual transfer review (Midtrans never verified here).
const DonationVerification = ({
  donations = [],
  loading = false,
  error = null,
  onReload = null,
  currentPage = 1,
  lastPage = 1,
  onPageChange = null,
  onApproveDonation = null,
  onRejectDonation = null,
}) => {
  const [filterStatus, setFilterStatus] = React.useState('Pending');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selected, setSelected] = React.useState(null);
  const [proofUrl, setProofUrl] = React.useState(null);
  const [proofError, setProofError] = React.useState(null);
  const [proofLoading, setProofLoading] = React.useState(false);
  const [bankConfirmed, setBankConfirmed] = React.useState(false);
  const [reasonCode, setReasonCode] = React.useState('no_funds_received');
  const [processing, setProcessing] = React.useState(false);
  const proofUrlRef = React.useRef(null);
  const proofRunRef = React.useRef(0);

  React.useEffect(() => () => {
    proofRunRef.current += 1;
    if (proofUrlRef.current) URL.revokeObjectURL(proofUrlRef.current);
  }, []);

  const closeInspect = () => {
    proofRunRef.current += 1;
    if (proofUrlRef.current) URL.revokeObjectURL(proofUrlRef.current);
    proofUrlRef.current = null;
    setProofUrl(null);
    setSelected(null);
    setProofError(null);
    setBankConfirmed(false);
  };

  const inspect = async (item) => {
    if (proofUrlRef.current) URL.revokeObjectURL(proofUrlRef.current);
    proofUrlRef.current = null;
    const runId = ++proofRunRef.current;
    setSelected(item);
    setProofUrl(null);
    setProofError(null);
    setBankConfirmed(false);
    setReasonCode('no_funds_received');
    setProofLoading(true);
    try {
      const blob = await DonationApi.getManualTransferProof(item.id);
      if (runId !== proofRunRef.current) return;
      const url = URL.createObjectURL(blob);
      proofUrlRef.current = url;
      setProofUrl(url);
    } catch (err) {
      if (runId === proofRunRef.current) {
        setProofError(err?.message || 'Bukti tidak dapat dimuat.');
      }
    } finally {
      if (runId === proofRunRef.current) setProofLoading(false);
    }
  };

  const runAction = async (kind) => {
    if (processing || !selected) return;
    setProcessing(true);
    try {
      const success = kind === 'verify'
        ? await onApproveDonation?.(selected.id)
        : await onRejectDonation?.(selected.id, reasonCode);
      if (success === true) closeInspect();
    } finally {
      setProcessing(false);
    }
  };

  const records = (Array.isArray(donations) ? donations : [])
    .filter((item) => item.type === 'manual_transfer');
  const pendingCount = records.filter((item) => item.status === 'Pending').length;
  const approvedCount = records.filter((item) => item.status === 'Terverifikasi').length;
  const rejectedCount = records.filter((item) => item.status === 'Ditolak').length;
  const visible = records.filter((item) => {
    if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;
    const q = searchQuery.trim().toLowerCase();
    return !q || [item.id, item.donorName, item.campaignTitle]
      .some((value) => String(value || '').toLowerCase().includes(q));
  });

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6">
      <header className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 p-6 text-white shadow-lg">
        <div className="text-xs font-bold text-emerald-200">REVIEW TRANSFER MANUAL</div>
        <h1 className="mt-2 text-2xl font-extrabold">Verifikasi Bukti Transfer Donasi</h1>
        <p className="mt-2 max-w-3xl text-xs text-emerald-100">
          Pemeriksaan ini khusus transfer manual. Cocokkan dana masuk pada mutasi rekening resmi,
          bukan hanya gambar bukti. Pembayaran Midtrans tetap diverifikasi otomatis oleh backend.
        </p>
        <p className="mt-3 text-sm font-bold">Antrean pending halaman ini: {pendingCount}</p>
      </header>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            ['Pending', `Pending (${pendingCount})`],
            ['Terverifikasi', `Terverifikasi (${approvedCount})`],
            ['Ditolak', `Ditolak (${rejectedCount})`],
            ['ALL', `Semua (${records.length})`],
          ].map(([status, label]) => (
            <button key={status} type="button" onClick={() => setFilterStatus(status)}
              className={`rounded-lg px-3 py-2 text-xs font-bold ${filterStatus === status ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID, donatur, campaign" aria-label="Cari donasi"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:w-56" />
          <button type="button" onClick={onReload} disabled={loading}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold disabled:opacity-50">Muat Ulang</button>
        </div>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">{error}</div>}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[750px] text-left text-xs">
          <thead className="bg-slate-50 font-bold uppercase text-slate-600">
            <tr>
              {['ID / Tanggal', 'Donatur', 'Program', 'Nominal', 'Bukti', 'Status', 'Aksi'].map((col) => <th key={col} className="px-4 py-3">{col}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="7" className="p-8 text-center text-slate-500">Memuat donasi dari Laravel...</td></tr>
            ) : visible.length === 0 ? (
              <tr><td colSpan="7" className="p-8 text-center text-slate-500">Tidak ada transfer manual yang sesuai filter pada halaman ini.</td></tr>
            ) : visible.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3"><div className="font-mono font-bold">{item.id}</div><div className="mt-1 text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '-'}</div></td>
                <td className="px-4 py-3"><strong>{item.donorName}</strong><div className="text-slate-500">{item.email || item.phone || '-'}</div></td>
                <td className="px-4 py-3">{item.campaignTitle}</td>
                <td className="px-4 py-3 font-bold">Rp {item.amount.toLocaleString('id-ID')}</td>
                <td className="px-4 py-3">{item.hasProof ? 'Tersimpan privat' : 'Tidak tersedia'}</td>
                <td className="px-4 py-3 font-bold">{item.status}</td>
                <td className="px-4 py-3"><button type="button" onClick={() => inspect(item)}
                  className="rounded-lg bg-emerald-700 px-3 py-2 font-bold text-white">Lihat Bukti</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lastPage > 1 && (
        <div className="flex items-center justify-end gap-3 text-xs">
          <button type="button" disabled={loading || currentPage <= 1}
            onClick={() => onPageChange?.(currentPage - 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Sebelumnya</button>
          <span>Halaman {currentPage} / {lastPage}</span>
          <button type="button" disabled={loading || currentPage >= lastPage}
            onClick={() => onPageChange?.(currentPage + 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Berikutnya</button>
        </div>
      )}

      {selected && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/70 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="review-proof-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="review-proof-title" className="text-lg font-extrabold">Review Bukti Transfer</h2>
                <p className="mt-1 text-xs text-slate-500">{selected.donorName} · Rp {selected.amount.toLocaleString('id-ID')}</p>
              </div>
              <button type="button" onClick={closeInspect} disabled={processing}
                className="rounded-lg border px-3 py-1 text-sm">Tutup</button>
            </div>
            <div className="mt-4 flex min-h-48 items-center justify-center rounded-xl border bg-slate-50 p-3">
              {proofLoading ? <span className="text-xs">Memuat bukti privat...</span>
                : proofError ? <span role="alert" className="text-xs text-rose-700">{proofError}</span>
                : proofUrl ? <img src={proofUrl} alt="Bukti transfer privat" className="max-h-80 object-contain" />
                : <span className="text-xs">Bukti tidak tersedia.</span>}
            </div>
            {selected.status === 'Pending' && (
              <div className="mt-4 space-y-3">
                <label className="flex items-start gap-2 text-xs font-semibold text-slate-800">
                  <input type="checkbox" checked={bankConfirmed}
                    onChange={(e) => setBankConfirmed(e.target.checked)} className="mt-0.5" />
                  <span>Saya sudah memeriksa mutasi rekening resmi dan mengonfirmasi dana benar-benar diterima.</span>
                </label>
                <button type="button" disabled={!bankConfirmed || processing || !proofUrl}
                  onClick={() => runAction('verify')}
                  className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-xs font-bold text-white disabled:opacity-40">
                  {processing ? 'Memproses...' : 'Verifikasi dan Catat ke Buku Kas'}
                </button>
                <div className="border-t pt-3">
                  <label htmlFor="rejection-reason" className="block text-xs font-bold">Alasan penolakan</label>
                  <select id="rejection-reason" value={reasonCode} onChange={(e) => setReasonCode(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs">
                    <option value="no_funds_received">Dana tidak diterima</option>
                    <option value="invalid_proof">Bukti tidak valid</option>
                    <option value="duplicate">Pengajuan duplikat</option>
                    <option value="other">Alasan lain</option>
                  </select>
                  <button type="button" disabled={processing} onClick={() => runAction('reject')}
                    className="mt-2 w-full rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-800 disabled:opacity-40">Tolak Pengajuan</button>
                </div>
              </div>
            )}
          </section>
        </div>, document.body
      )}
    </div>
  );
};

window.DonationVerification = DonationVerification;
