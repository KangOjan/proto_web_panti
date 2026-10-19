// SIMK-Panti: compact public donation form with authoritative Midtrans payment flow.
// Manual transfer UI is deliberately non-submittable until an approved account
// and a backend proof-upload/verification endpoint are available.
const PublicDonation = ({
  campaigns = [],
  campaignLoading = false,
  campaignError = null,
  donationContext = null,
  onSubmitPublicDonation,
  resolveAllocationCategory,
  onNavigateHome,
}) => {
  const generalCampaignId = '__general__';
  const [selectedCampaignId, setSelectedCampaignId] = React.useState(
    donationContext?.campaignId != null
      ? String(donationContext.campaignId)
      : generalCampaignId
  );
  const [donorName, setDonorName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [amount, setAmount] = React.useState('100000');
  const [note, setNote] = React.useState('');
  const [publishMessage, setPublishMessage] = React.useState(false);
  const [isAnonymous, setIsAnonymous] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState('midtrans');
  const [proofFile, setProofFile] = React.useState(null);
  const [proofPreview, setProofPreview] = React.useState(null);

  const [submitting, setSubmitting] = React.useState(false);
  const [submissionError, setSubmissionError] = React.useState(null);
  const [createdDonation, setCreatedDonation] = React.useState(null);
  const [paymentSession, setPaymentSession] = React.useState(null);
  const [snapOpening, setSnapOpening] = React.useState(false);
  const [snapMessage, setSnapMessage] = React.useState(null);
  const [statusChecking, setStatusChecking] = React.useState(false);
  const confirmationRunRef = React.useRef(0);

  const presetAmounts = [50000, 100000, 500000, 1000000];
  const terminalStatuses = ['paid', 'failed', 'expired', 'cancelled'];
  const formLocked = submitting || Boolean(createdDonation || paymentSession);
  const paymentStatus = paymentSession?.status || null;
  const paymentIsPaid = paymentStatus === 'paid';
  const paymentIsTerminal = terminalStatuses.includes(paymentStatus);

  const campaignOptions = React.useMemo(() => [
    { id: generalCampaignId, title: 'Donasi Umum', category: 'Lainnya' },
    ...((Array.isArray(campaigns) ? campaigns : []).filter((campaign) => {
      if (!campaign || campaign.id == null || campaign.status !== 'active') return false;
      if (!campaign.deadline) return true;
      const deadline = new Date(campaign.deadline).getTime();
      return Number.isFinite(deadline) && deadline >= Date.now();
    })),
  ], [campaigns]);

  // Jangan diam-diam mengalihkan campaign yang tidak valid ke Donasi Umum.
  // Donatur harus memilih tujuan lain jika campaign tidak tersedia.
  const selectedCampaign = campaignOptions.find(
    (campaign) => String(campaign.id) === selectedCampaignId
  ) || null;
  const isSpecificCampaign = selectedCampaign != null && selectedCampaign.id !== generalCampaignId;

  React.useEffect(() => {
    setSelectedCampaignId(
      donationContext?.campaignId != null
        ? String(donationContext.campaignId)
        : generalCampaignId
    );
  }, [donationContext?.campaignId]);

  React.useEffect(() => () => {
    confirmationRunRef.current += 1;
  }, []);

  const restartForm = () => {
    confirmationRunRef.current += 1;
    setCreatedDonation(null);
    setPaymentSession(null);
    setSubmissionError(null);
    setSnapMessage(null);
    setStatusChecking(false);
    setSnapOpening(false);
    setSubmitting(false);
    setProofFile(null);
    setProofPreview(null);
  };

  const resolveCategory = () => {
    // Mapping sementara untuk kompatibilitas API donasi saat ini.
    // Server harus memvalidasi / menentukan ulang alokasi dari campaign_id.
    if (!isSpecificCampaign) return 'lainnya';
    if (typeof resolveAllocationCategory === 'function') {
      return resolveAllocationCategory(selectedCampaign.category || '');
    }
    return 'lainnya';
  };

  const refreshPaymentStatus = async (paymentPublicId) => {
    const response = await PaymentApi.getStatus(paymentPublicId);
    const updatedPayment = response?.data;
    if (!updatedPayment?.public_id) {
      throw new Error('Respons status pembayaran tidak lengkap.');
    }
    setPaymentSession((previous) => ({
      ...previous,
      ...updatedPayment,
      snap_token: previous?.snap_token || updatedPayment.snap_token || null,
      snap_redirect_url: previous?.snap_redirect_url || updatedPayment.snap_redirect_url || null,
    }));
    return updatedPayment;
  };

  const confirmPaymentStatus = async (
    paymentPublicId,
    { maxAttempts = 4, intervalMs = 1500 } = {}
  ) => {
    const runId = confirmationRunRef.current + 1;
    confirmationRunRef.current = runId;
    setStatusChecking(true);
    let updatedPayment = null;
    try {
      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        if (confirmationRunRef.current !== runId) return updatedPayment;
        updatedPayment = await refreshPaymentStatus(paymentPublicId);
        if (terminalStatuses.includes(updatedPayment.status)) {
          if (updatedPayment.status === 'paid') {
            setSubmissionError(null);
            setSnapMessage('Pembayaran telah dikonfirmasi lunas oleh backend.');
          } else {
            setSnapMessage(`Status final dari backend: ${updatedPayment.status}.`);
          }
          return updatedPayment;
        }
        if (attempt < maxAttempts) {
          await new Promise((resolve) => window.setTimeout(resolve, intervalMs));
        }
      }
      if (confirmationRunRef.current === runId) {
        setSnapMessage(
          'Status backend masih pending. Pembayaran belum dianggap lunas. ' +
          'Silakan perbarui status beberapa saat lagi.'
        );
      }
      return updatedPayment;
    } catch (error) {
      console.error('Payment status refresh failed:', error);
      if (confirmationRunRef.current === runId) {
        setSubmissionError(
          error?.message || 'Gagal memeriksa status. Silakan coba kembali.'
        );
      }
      return null;
    } finally {
      if (confirmationRunRef.current === runId) setStatusChecking(false);
    }
  };

  const openSnap = async (payment) => {
    if (!payment?.snap_token || !payment?.public_id) {
      setSubmissionError('Token atau ID pembayaran Midtrans tidak tersedia.');
      return;
    }
    try {
      setSnapOpening(true);
      setSubmissionError(null);
      await MidtransSnap.pay(payment.snap_token, {
        onSuccess: async () => {
          setSnapMessage('Pembayaran diproses Midtrans; menunggu verifikasi backend.');
          await confirmPaymentStatus(payment.public_id, { maxAttempts: 6 });
        },
        onPending: async () => {
          setSnapMessage('Instruksi pembayaran dibuat. Menunggu status dari backend.');
          await confirmPaymentStatus(payment.public_id, { maxAttempts: 3 });
        },
        onError: async () => {
          setSubmissionError('Midtrans melaporkan kendala. Memeriksa status backend.');
          await confirmPaymentStatus(payment.public_id, { maxAttempts: 2 });
        },
        onClose: () => {
          setSnapMessage('Popup ditutup. Anda dapat membuka kembali sesi pembayaran.');
        },
      });
    } catch (error) {
      console.error('Failed to open Midtrans Snap:', error);
      setSubmissionError(error?.message || 'Gagal membuka Midtrans Snap.');
    } finally {
      setSnapOpening(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting || paymentSession) return;
    setSubmissionError(null);
    setSnapMessage(null);

    if (paymentMethod !== 'midtrans') {
      setSubmissionError(
        'Transfer manual belum dapat dikirim: rekening resmi dan endpoint unggah ' +
        'bukti pembayaran belum diverifikasi/diintegrasikan.'
      );
      return;
    }
    if (typeof onSubmitPublicDonation !== 'function') {
      setSubmissionError('Integrasi donasi backend belum tersedia.');
      return;
    }
    if (!selectedCampaign) {
      setSubmissionError('Tujuan donasi tidak tersedia. Silakan pilih program yang valid.');
      return;
    }

    const normalizedAmount = Number(amount);
    if (!Number.isSafeInteger(normalizedAmount) || normalizedAmount < 10000) {
      setSubmissionError('Nominal donasi minimal Rp10.000 dalam bilangan bulat.');
      return;
    }
    if (!isAnonymous && !donorName.trim()) {
      setSubmissionError('Isi nama donatur atau aktifkan pilihan Hamba Allah.');
      return;
    }

    const donationData = {
      donorName: isAnonymous ? 'Hamba Allah' : donorName.trim(),
      isAnonymous,
      campaignId:
        isSpecificCampaign ? selectedCampaign.id : null,
      campaignTitle: selectedCampaign.title,
      category: resolveCategory(),
      amount: normalizedAmount,
      phone: phone.trim(),
      email: email.trim(),
      note: note.trim(),
      publishMessage: publishMessage && Boolean(note.trim()),
    };

    setSubmitting(true);
    confirmationRunRef.current += 1;
    try {
      // Existing donation is intentionally reused if session creation previously failed.
      const result = await onSubmitPublicDonation(donationData, createdDonation);
      if (result?.donation?.public_id) setCreatedDonation(result.donation);
      if (!result?.success || !result?.payment?.public_id) {
        setSubmissionError(result?.message || 'Gagal membuat sesi pembayaran.');
        return;
      }
      setPaymentSession(result.payment);
      await openSnap(result.payment);
    } catch (error) {
      console.error('Public donation submission failed:', error);
      setSubmissionError(error?.message || 'Tidak dapat menyiapkan pembayaran.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProofChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setSubmissionError('Bukti harus JPG/PNG dengan ukuran maksimal 5 MB.');
      setProofFile(null);
      setProofPreview(null);
      event.target.value = '';
      return;
    }
    setSubmissionError(null);
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = () => setProofPreview(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm ' +
    'text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ' +
    'disabled:bg-slate-100 disabled:text-slate-500';
  const fieldLabel = 'mb-1.5 block text-[11px] font-bold text-slate-700';
  const sectionHeading = 'mb-3 text-xs font-extrabold uppercase tracking-wide text-slate-800';

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 animate-fade-in sm:px-6">
      <header className="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 px-5 py-5 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <span className="inline-flex items-center rounded-full bg-emerald-400/20 px-3 py-1 text-[11px] font-bold text-emerald-100">
            Portal Donasi Publik · Tanpa Login
          </span>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
            Salurkan Donasi &amp; Kebaikan
          </h1>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-emerald-100/90">
            Pilih program, isi nominal donasi, lalu selesaikan pembayaran melalui Midtrans.
            Status lunas ditentukan oleh konfirmasi backend.
          </p>
        </div>
        <div className="shrink-0 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-emerald-100">Pembayaran Online</div>
          <div className="mt-1 text-sm font-extrabold">Midtrans</div>
          <div className="text-[10px] text-emerald-100">Metode mengikuti konfigurasi sistem</div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        {submissionError && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800">
            {submissionError}
          </div>
        )}

        <section>
          <h2 className={sectionHeading}>1. Tujuan &amp; Nominal Donasi</h2>
          <div>
            <label htmlFor="donation-program" className={fieldLabel}>Tujuan Donasi *</label>
            <select
              id="donation-program"
              value={selectedCampaign ? String(selectedCampaign.id) : ''}
              onChange={(event) => setSelectedCampaignId(event.target.value)}
              disabled={formLocked}
              className={inputClass}
              required
            >
              {!selectedCampaign && (
                <option value="" disabled>Campaign tidak tersedia, pilih tujuan lain</option>
              )}
              {campaignOptions.map((program) => (
                <option key={String(program.id)} value={String(program.id)}>
                  {program.title}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-slate-500">
              {campaignLoading
                ? 'Memuat campaign aktif dari database...'
                : campaignError
                  ? `Gagal memuat campaign: ${campaignError}. Donasi Umum tetap tersedia.`
                  : campaignOptions.length === 1
                    ? 'Belum ada campaign aktif yang tersedia. Donasi Umum tetap tersedia.'
                    : 'Kategori alokasi ditentukan otomatis dari tujuan donasi yang dipilih.'}
            </p>
          </div>
          <div className="mt-3">
            <label htmlFor="donation-amount" className={fieldLabel}>Nominal Donasi (Rp) *</label>
            <input
              id="donation-amount"
              type="number"
              inputMode="numeric"
              min="10000"
              step="1"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              disabled={formLocked}
              className={inputClass + ' font-bold'}
            />
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  disabled={formLocked}
                  onClick={() => setAmount(String(preset))}
                  className={`rounded-lg border px-2 py-2 text-[11px] font-bold transition disabled:opacity-50 ${
                    Number(amount) === preset
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Rp {Number(preset).toLocaleString('id-ID')}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 pt-4">
          <h2 className={sectionHeading}>2. Data Donatur &amp; Doa</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="donation-donor-name" className={fieldLabel}>Nama Donatur *</label>
              <input
                id="donation-donor-name"
                type="text"
                placeholder={isAnonymous ? 'Hamba Allah' : 'Nama donatur'}
                required={!isAnonymous}
                value={isAnonymous ? 'Hamba Allah' : donorName}
                onChange={(event) => setDonorName(event.target.value)}
                disabled={formLocked || isAnonymous}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="donation-phone" className={fieldLabel}>WhatsApp (opsional)</label>
              <input
                id="donation-phone"
                type="tel"
                placeholder="08xx-xxxx-xxxx"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                disabled={formLocked}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="donation-email" className={fieldLabel}>Email (opsional)</label>
              <input
                id="donation-email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={formLocked}
                className={inputClass}
              />
            </div>
          </div>
          <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(event) => setIsAnonymous(event.target.checked)}
              disabled={formLocked}
              className="mt-0.5 h-4 w-4 accent-emerald-600"
            />
            <span>
              <strong>Sembunyikan nama saya</strong> (tampilkan sebagai “Hamba Allah” di publik).
              Jika tidak dicentang, nama dapat ditampilkan pada daftar donatur publik.
            </span>
          </label>
          <div className="mt-3">
            <label htmlFor="donation-note" className={fieldLabel}>Doa / Harapan (opsional)</label>
            <textarea
              id="donation-note"
              rows="2"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              disabled={formLocked}
              placeholder="Tuliskan doa atau pesan kebaikan..."
              className={inputClass}
            />
          </div>
          <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs text-slate-700">
            <input type="checkbox" checked={publishMessage}
              onChange={(event) => setPublishMessage(event.target.checked)}
              disabled={formLocked} className="mt-0.5 h-4 w-4 accent-emerald-600" />
            <span><strong>Saya setuju doa/harapan saya dipublikasikan</strong> pada halaman program setelah donasi terverifikasi. Jika tidak dicentang, pesan tidak ditampilkan secara publik. Identitas tetap mengikuti pilihan sembunyikan nama.</span>
          </label>
        </section>

        <section className="border-t border-slate-100 pt-4">
          <h2 className={sectionHeading}>3. Metode Pembayaran</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              disabled={formLocked}
              onClick={() => { setPaymentMethod('midtrans'); setSubmissionError(null); }}
              className={`rounded-xl border px-4 py-3 text-left text-xs font-bold ${
                paymentMethod === 'midtrans'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              <span className="block">Midtrans Online</span>
              <span className="mt-1 block font-normal opacity-80">QRIS, virtual account, dan metode lain di Snap</span>
            </button>
            <button
              type="button"
              disabled={formLocked}
              onClick={() => { setPaymentMethod('manual'); setSubmissionError(null); }}
              className={`rounded-xl border px-4 py-3 text-left text-xs font-bold ${
                paymentMethod === 'manual'
                  ? 'border-amber-400 bg-amber-50 text-amber-950'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              <span className="block">Transfer Manual</span>
              <span className="mt-1 block font-normal opacity-80">Upload bukti · integrasi belum tersedia</span>
            </button>
          </div>

          {paymentMethod === 'midtrans' ? (
            <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-xs text-slate-700">
              <div className="font-extrabold text-emerald-900">Pembayaran aman melalui Midtrans</div>
              <p className="mt-1 leading-relaxed">
                Metode pembayaran dipilih pada popup Midtrans. Sukses pada popup tidak otomatis
                berarti lunas; status akhir mengikuti backend.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="text-xs font-bold text-amber-950">
                Transfer manual belum dibuka. Informasi rekening resmi menunggu verifikasi lembaga,
                dan endpoint unggah bukti belum dihubungkan.
              </div>
              <div>
                <label htmlFor="donation-proof" className={fieldLabel}>Preview Bukti Transfer (JPG / PNG, maks. 5 MB)</label>
                <input
                  id="donation-proof"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleProofChange}
                  disabled={formLocked}
                  className="block w-full rounded-lg border border-dashed border-slate-300 bg-white p-2 text-xs text-slate-700"
                />
                {proofFile && (
                  <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-700">
                    <span className="min-w-0 truncate">{proofFile.name}</span>
                    <button
                      type="button"
                      onClick={() => { setProofFile(null); setProofPreview(null); const input = document.getElementById('donation-proof'); if (input) input.value = ''; }}
                      className="shrink-0 font-bold text-rose-700 hover:underline"
                    >Hapus</button>
                  </div>
                )}
                {proofPreview && <img src={proofPreview} alt="Preview bukti transfer" className="mt-2 max-h-44 rounded-lg border border-slate-200 object-contain" />}
              </div>
              <p className="text-[11px] text-amber-800">File hanya ditampilkan di browser dan belum dikirim ke server.</p>
            </div>
          )}
        </section>

        {createdDonation && !paymentSession && paymentMethod === 'midtrans' && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            Donasi sudah tercatat ({createdDonation.public_id}), tetapi sesi pembayaran belum berhasil dibuat.
            Gunakan tombol di bawah untuk mencoba lagi tanpa membuat donasi ganda.
          </div>
        )}

        {paymentSession && (
          <section className={`rounded-xl border p-4 text-xs ${
            paymentIsPaid
              ? 'border-emerald-200 bg-emerald-50'
              : paymentIsTerminal
                ? 'border-rose-200 bg-rose-50'
                : 'border-blue-200 bg-blue-50'
          }`}>
            <h3 className="text-sm font-extrabold text-slate-900">
              {paymentIsPaid ? 'Pembayaran terkonfirmasi' :
                paymentIsTerminal ? 'Sesi pembayaran selesai' : 'Sesi pembayaran berhasil dibuat'}
            </h3>
            <dl className="mt-2 space-y-1 break-all text-slate-700">
              <div>Donation ID: <strong>{createdDonation?.public_id || '-'}</strong></div>
              <div>Payment ID: <strong>{paymentSession.public_id}</strong></div>
              {paymentSession.order_id && <div>Order ID: <strong>{paymentSession.order_id}</strong></div>}
              <div>Status backend: <strong className="uppercase">{paymentStatus || 'pending'}</strong></div>
            </dl>
            {statusChecking && <div className="mt-2 text-blue-800">Memeriksa status backend...</div>}
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {!paymentIsTerminal && (
                <button
                  type="button"
                  disabled={snapOpening || statusChecking}
                  onClick={() => openSnap(paymentSession)}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 font-bold text-white disabled:opacity-50"
                >
                  {snapOpening ? 'Membuka Midtrans...' : 'Buka Pembayaran Midtrans'}
                </button>
              )}
              <button
                type="button"
                disabled={statusChecking}
                onClick={() => confirmPaymentStatus(paymentSession.public_id, { maxAttempts: 3 })}
                className="rounded-xl border border-blue-200 bg-white px-4 py-2.5 font-bold text-blue-800 disabled:opacity-50"
              >
                {statusChecking ? 'Memeriksa...' : 'Perbarui Status'}
              </button>
            </div>
            {paymentIsPaid && (
              <p className="mt-2 font-semibold text-emerald-800">
                Status lunas sudah tercatat di backend. Bukti resmi mengikuti mekanisme penerbitan sistem.
              </p>
            )}
          </section>
        )}

        {snapMessage && (
          <div role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs font-semibold text-blue-900">
            {snapMessage}
          </div>
        )}

        {paymentMethod === 'midtrans' && !paymentSession && (
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-extrabold text-white shadow-md hover:from-emerald-700 hover:to-teal-700 disabled:cursor-wait disabled:opacity-50"
          >
            {submitting
              ? 'Menyiapkan sesi pembayaran...'
              : createdDonation
                ? 'Coba Lagi Sesi Pembayaran Midtrans'
                : 'Buat Sesi Pembayaran Midtrans'}
          </button>
        )}
        {paymentMethod === 'manual' && (
          <button type="button" disabled className="w-full cursor-not-allowed rounded-xl bg-slate-200 px-4 py-3 text-sm font-extrabold text-slate-500">
            Konfirmasi Transfer Manual Belum Tersedia
          </button>
        )}
        {paymentSession && paymentIsTerminal && (
          <button type="button" onClick={restartForm} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50">
            Buat Donasi Baru
          </button>
        )}
        {onNavigateHome && (
          <div className="text-center">
            <button type="button" onClick={onNavigateHome} className="text-xs font-semibold text-slate-500 hover:text-emerald-700">
              Kembali ke Beranda
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

window.PublicDonation = PublicDonation;
