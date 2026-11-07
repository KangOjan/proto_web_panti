// SIMK-Panti: compact public donation form with authoritative Midtrans payment flow.
// Manual transfer UI is deliberately non-submittable until an approved account
// and a backend proof-upload/verification endpoint are available.
const PublicDonation = ({
  campaigns = [],
  campaignLoading = false,
  campaignError = null,
  donationContext = null,
  onSubmitPublicDonation,
  onSubmitManualDonation,
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
  const [amount, setAmount] = React.useState('10000');
  const [note, setNote] = React.useState('');
  const [publishMessage, setPublishMessage] = React.useState(false);
  const [isAnonymous, setIsAnonymous] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState('midtrans');
  const [proofFile, setProofFile] = React.useState(null);
  const [proofPreview, setProofPreview] = React.useState(null);
  // Stable across HTTP retries; renewed only when the donor starts a new form.
  const [manualSubmissionToken, setManualSubmissionToken] = React.useState(() => window.crypto.randomUUID());
  const [manualConfig, setManualConfig] = React.useState(null);
  const [manualConfigLoading, setManualConfigLoading] = React.useState(true);
  const manualReady = manualConfig?.enabled === true;

  const [submitting, setSubmitting] = React.useState(false);
  const [submissionError, setSubmissionError] = React.useState(null);
  const [donorFieldErrors, setDonorFieldErrors] = React.useState({});
  const clearFieldError = (field) => setDonorFieldErrors((previous) => ({ ...previous, [field]: null }));
  const inlineError = (field) => donorFieldErrors[field] ? (
    <p id={`donation-${field}-error`} role="alert" className="mt-1.5 flex items-start gap-1.5 rounded-lg bg-rose-50 px-2.5 py-2 text-[11px] leading-relaxed text-rose-700">
      <span aria-hidden="true" className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-rose-100 font-bold">!</span>
      <span>{donorFieldErrors[field]}</span>
    </p>
  ) : null;
  const [createdDonation, setCreatedDonation] = React.useState(null);
  const [paymentSession, setPaymentSession] = React.useState(null);
  const [snapOpening, setSnapOpening] = React.useState(false);
  const [snapMessage, setSnapMessage] = React.useState(null);
  const [statusChecking, setStatusChecking] = React.useState(false);
  const confirmationRunRef = React.useRef(0);

  React.useEffect(() => {
    let active = true;
    DonationApi.getManualTransferConfig()
      .then((response) => { if (active) setManualConfig(response?.data || null); })
      .catch(() => { if (active) setManualConfig(null); })
      .finally(() => { if (active) setManualConfigLoading(false); });
    return () => { active = false; };
  }, []);

  const presetAmounts = [10000, 50000, 100000, 500000];
  const paymentStatusLabels = {
    initiating: 'Sedang disiapkan', pending: 'Menunggu pembayaran', captured: 'Menunggu konfirmasi', processing: 'Menunggu konfirmasi',
    paid: 'Donasi berhasil', failed: 'Pembayaran gagal', expired: 'Waktu pembayaran habis', cancelled: 'Pembayaran dibatalkan',
  };
  const paymentStatusLabel = (status) => paymentStatusLabels[status] || 'Sedang Diperiksa';
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
    setManualSubmissionToken(window.crypto.randomUUID());
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
            setSnapMessage('Terima kasih. Pembayaran donasi Anda telah terkonfirmasi.');
          } else {
            setSnapMessage(`Status pembayaran: ${paymentStatusLabel(updatedPayment.status)}.`);
          }
          return updatedPayment;
        }
        if (attempt < maxAttempts) {
          await new Promise((resolve) => window.setTimeout(resolve, intervalMs));
        }
      }
      if (confirmationRunRef.current === runId) {
        setSnapMessage(
          'Kami belum menerima konfirmasi pembayaran. Jika Anda sudah membayar, ' +
          'silakan cek status kembali beberapa saat lagi.'
        );
      }
      return updatedPayment;
    } catch (error) {
      console.error('Payment status refresh failed:', error);
      if (confirmationRunRef.current === runId) {
        setSubmissionError(
          'Status pembayaran belum dapat diperiksa. Silakan coba kembali beberapa saat lagi.'
        );
      }
      return null;
    } finally {
      if (confirmationRunRef.current === runId) setStatusChecking(false);
    }
  };

  const openSnap = async (payment) => {
    if (!payment?.snap_token || !payment?.public_id) {
      setSubmissionError('Pembayaran belum dapat dilanjutkan. Silakan coba kembali atau hubungi pengurus.');
      return;
    }
    try {
      setSnapOpening(true);
      setSubmissionError(null);
      await MidtransSnap.pay(payment.snap_token, {
        onSuccess: async () => {
          setSnapMessage('Pembayaran sedang kami periksa. Silakan cek status sampai donasi terkonfirmasi.');
          await confirmPaymentStatus(payment.public_id, { maxAttempts: 6 });
        },
        onPending: async () => {
          setSnapMessage('Silakan ikuti petunjuk pembayaran yang diberikan. Donasi masih menunggu pembayaran atau konfirmasi.');
          await confirmPaymentStatus(payment.public_id, { maxAttempts: 3 });
        },
        onError: async () => {
          setSubmissionError('Pembayaran mengalami kendala. Silakan cek status atau coba kembali.');
          await confirmPaymentStatus(payment.public_id, { maxAttempts: 2 });
        },
        onClose: () => {
          setSnapMessage('Halaman pembayaran ditutup. Jika belum membayar, pilih Lanjutkan Pembayaran.');
        },
      });
    } catch (error) {
      console.error('Failed to open Midtrans Snap:', error);
      setSubmissionError('Halaman pembayaran belum dapat dibuka. Silakan coba kembali.');
    } finally {
      setSnapOpening(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting || paymentSession) return;
    setSubmissionError(null);
    setSnapMessage(null);

    if (paymentMethod === 'manual' && !manualReady) {
      setSubmissionError('Transfer manual belum dibuka oleh lembaga.');
      return;
    }
    if (paymentMethod === 'manual' && !proofFile) {
      setSubmissionError('Pilih bukti transfer JPG/PNG maksimal 5 MB.');
      return;
    }
    if (paymentMethod === 'manual' && typeof onSubmitManualDonation !== 'function') {
      setSubmissionError('Integrasi unggah bukti belum tersedia.');
      return;
    }
    if (paymentMethod === 'midtrans' && typeof onSubmitPublicDonation !== 'function') {
      setSubmissionError('Pembayaran online sedang tidak tersedia. Silakan coba beberapa saat lagi.');
      return;
    }
    if (!selectedCampaign) {
      setSubmissionError('Tujuan donasi tidak tersedia. Silakan pilih program yang valid.');
      return;
    }

    const normalizedAmount = Number(amount);
    const errors = {};
    if (!/^\d+$/.test(String(amount).trim()) || !Number.isSafeInteger(normalizedAmount) || normalizedAmount < 10000) {
      errors.amount = 'Masukkan nominal donasi berupa angka bulat, minimal Rp10.000.';
    }
    if (!isAnonymous && !donorName.trim()) {
      errors.donorName = 'Isi nama donatur atau centang pilihan Sembunyikan nama saya.';
    }
    const validName = /^[\p{L}][\p{L}\p{M} .,'’\-]*$/u;
    const validWhatsApp = /^(?:\+62|62|0)8[0-9]{8,11}$/;
    const validGmail = /^[A-Za-z0-9._%+-]+@gmail\.com$/i;
    if (!isAnonymous && (!validName.test(donorName.trim()) || donorName.trim().length > 150)) {
      errors.donorName = 'Gunakan nama dengan huruf, spasi, dan tanda baca nama yang wajar. Angka atau simbol tidak diperbolehkan.';
    }
    if (phone.trim() && !validWhatsApp.test(phone.trim())) {
      errors.phone = 'Gunakan nomor WhatsApp Indonesia, contohnya 081234567890 atau +6281234567890.';
    }
    if (email.trim() && (!validGmail.test(email.trim()) || email.trim().length > 150)) {
      errors.email = 'Email bersifat opsional. Jika diisi, gunakan alamat @gmail.com yang valid.';
    }
    setDonorFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSubmissionError(null);
      const first = Object.keys(errors)[0];
      const inputs = { amount: 'donation-amount', donorName: 'donation-donor-name', phone: 'donation-phone', email: 'donation-email' };
      document.getElementById(inputs[first])?.focus();
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
      if (paymentMethod === 'manual') {
        const result = await onSubmitManualDonation({ ...donationData, proofFile, submissionToken: manualSubmissionToken });
        if (!result?.success || !result?.donation?.public_id) {
          setSubmissionError(result?.message || 'Bukti gagal dikirim ke server.');
          return;
        }
        setCreatedDonation(result.donation);
        return;
      }
      // Existing donation is intentionally reused if session creation previously failed.
      const result = await onSubmitPublicDonation(donationData, createdDonation);
      if (result?.donation?.public_id) setCreatedDonation(result.donation);
      if (!result?.success || !result?.payment?.public_id) {
        if (result?.errors && typeof result.errors === 'object') {
          const mapped = {};
          const fields = { donor_name: 'donorName', phone: 'phone', email: 'email', amount: 'amount' };
          for (const [key, field] of Object.entries(fields)) {
            if (result.errors[key]) {
              mapped[field] = {
                donorName: 'Periksa nama donatur. Nama tidak boleh mengandung angka atau simbol.',
                phone: 'Periksa nomor WhatsApp. Contoh: 081234567890.',
                email: 'Jika email diisi, gunakan alamat @gmail.com yang valid.',
                amount: 'Periksa nominal donasi, minimal Rp10.000.',
              }[field];
            }
          }
          if (Object.keys(mapped).length) {
            setDonorFieldErrors(mapped);
            setSubmissionError(null);
            return;
          }
        }
        setSubmissionError(result?.message === 'Validation failed.'
          ? 'Ada data yang belum sesuai. Periksa kembali formulir.'
          : result?.message || 'Pembayaran belum dapat disiapkan. Silakan coba kembali.');
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
            Bantu Anak Asuh · Tanpa Login
          </span>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
            Salurkan Donasi &amp; Kebaikan
          </h1>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-emerald-100/90">
            Pilih tujuan dan jumlah donasi Anda. Setelah itu, ikuti langkah pembayaran yang tersedia.
            Tidak perlu membuat akun untuk berdonasi.
          </p>
        </div>
        <div className="shrink-0 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-emerald-100">Donasi Lebih Mudah</div>
          <div className="mt-1 text-sm font-extrabold">Pilih Cara Bayar</div>
          <div className="text-[10px] text-emerald-100">Pembayaran melalui layanan tepercaya</div>
        </div>
      </header>

      <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
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
                ? 'Menampilkan program donasi yang tersedia...'
                : campaignError
                  ? 'Program khusus belum dapat ditampilkan. Anda masih bisa memilih Donasi Umum.'
                  : campaignOptions.length === 1
                    ? 'Saat ini tersedia Donasi Umum.'
                    : 'Pilih program yang ingin Anda bantu, atau gunakan Donasi Umum.'}
            </p>
          </div>
          <div className="mt-3">
            <label htmlFor="donation-amount" className={fieldLabel}>Nominal Donasi (Rp) *</label>
            <input
              id="donation-amount"
              type="text"
              inputMode="numeric"
              maxLength="15"
              required
              value={amount}
              onChange={(event) => { setAmount(event.target.value); clearFieldError('amount'); }}
              disabled={formLocked}
              aria-invalid={Boolean(donorFieldErrors.amount)}
              aria-describedby={donorFieldErrors.amount ? 'donation-amount-error' : undefined}
              className={inputClass + ' font-bold' + (donorFieldErrors.amount ? ' border-rose-400 bg-rose-50/30' : '')}
            />
            {inlineError('amount')}
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  disabled={formLocked}
                  onClick={() => { setAmount(String(preset)); clearFieldError('amount'); }}
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
                onChange={(event) => { setDonorName(event.target.value); setDonorFieldErrors((old) => ({ ...old, donorName: null })); } }
                disabled={formLocked || isAnonymous}
                aria-invalid={Boolean(donorFieldErrors.donorName)}
                aria-describedby={donorFieldErrors.donorName ? 'donation-donorName-error' : undefined}
                className={inputClass + (donorFieldErrors.donorName ? ' border-rose-400 bg-rose-50/30' : '')}
              />
              {inlineError('donorName')}
            </div>
            <div>
              <label htmlFor="donation-phone" className={fieldLabel}>WhatsApp (opsional)</label>
              <input
                id="donation-phone"
                type="tel"
                placeholder="08xx-xxxx-xxxx"
                value={phone}
                onChange={(event) => { setPhone(event.target.value); setDonorFieldErrors((old) => ({ ...old, phone: null })); } }
                disabled={formLocked}
                aria-invalid={Boolean(donorFieldErrors.phone)}
                aria-describedby={donorFieldErrors.phone ? 'donation-phone-error' : undefined}
                className={inputClass + (donorFieldErrors.phone ? ' border-rose-400 bg-rose-50/30' : '')}
              />
              {inlineError('phone')}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="donation-email" className={fieldLabel}>Email (opsional)</label>
              <input
                id="donation-email"
                type="text"
                inputMode="email"
                autoComplete="email"
                placeholder="nama@gmail.com"
                value={email}
                onChange={(event) => { setEmail(event.target.value); setDonorFieldErrors((old) => ({ ...old, email: null })); } }
                disabled={formLocked}
                aria-invalid={Boolean(donorFieldErrors.email)}
                aria-describedby={donorFieldErrors.email ? 'donation-email-error' : undefined}
                className={inputClass + (donorFieldErrors.email ? ' border-rose-400 bg-rose-50/30' : '')}
              />
              {inlineError('email')}
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
          <h2 className={sectionHeading}>3. Pilih Cara Pembayaran</h2>
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
              <span className="block">Bayar Online</span>
              <span className="mt-1 block font-normal opacity-80">QRIS, transfer bank, dan pilihan lain yang tersedia</span>
            </button>
            <button
              type="button"
              disabled={formLocked || !manualReady}
              onClick={() => { setPaymentMethod('manual'); setSubmissionError(null); }}
              className={`rounded-xl border px-4 py-3 text-left text-xs font-bold ${
                paymentMethod === 'manual'
                  ? 'border-amber-400 bg-amber-50 text-amber-950'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <span className="block">Transfer ke Rekening Panti</span>
              <span className="mt-1 block font-normal opacity-80">{manualReady ? 'Transfer langsung, lalu kirim bukti pembayaran' : 'Belum tersedia untuk saat ini'}</span>
            </button>
          </div>

          {paymentMethod === 'midtrans' ? (
            <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-xs text-slate-700">
              <div className="font-extrabold text-emerald-900">Langkah pembayaran online</div>
              <p className="mt-1 leading-relaxed">
                Tekan <strong>Lanjut ke Pembayaran</strong>, lalu pilih cara bayar dan ikuti petunjuk yang muncul.
                Donasi akan dinyatakan berhasil setelah pembayaran terkonfirmasi.
              </p>
              <p className="mt-2 text-[11px] text-emerald-800">Pembayaran diproses melalui Midtrans.</p>
            </div>
          ) : (
            <div className="mt-3 space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="text-xs font-bold text-amber-950">
                {manualReady
                  ? 'Transfer ke rekening resmi LKSA di bawah ini. Setelah transfer, unggah bukti pembayaran agar pengurus dapat memeriksanya.'
                  : manualConfigLoading
                    ? 'Memeriksa ketersediaan transfer bank...'
                    : 'Transfer ke rekening panti belum tersedia. Silakan pilih Bayar Online.'}
              </div>
              {manualReady && (
                <div className="rounded-xl border border-amber-200 bg-white p-3 text-xs text-slate-700">
                  <div className="font-bold">{manualConfig.bank_name}</div>
                  <div className="mt-1 font-mono text-base font-bold">{manualConfig.account_number}</div>
                  <div className="mt-1">a.n. {manualConfig.account_holder}</div>
                </div>
              )}
              <div>
                <label htmlFor="donation-proof" className={fieldLabel}>Unggah Bukti Transfer (JPG/PNG, maksimal 5 MB)</label>
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
              <p className="text-[11px] text-amber-800">{manualReady
                ? 'Bukti hanya digunakan untuk memeriksa pembayaran Anda.'
                : 'Foto bukti belum dikirim.'}</p>
            </div>
          )}
        </section>

        {createdDonation && !paymentSession && paymentMethod === 'midtrans' && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            Permintaan donasi Anda sudah tersimpan, tetapi halaman pembayaran belum berhasil dibuka.
            Tekan <strong>Coba Buka Pembayaran</strong> untuk melanjutkan tanpa mengisi formulir ulang.
          </div>
        )}

        {paymentSession && (
          <section role="status" aria-live="polite" className={`rounded-xl border p-4 text-sm ${
            paymentIsPaid
              ? 'border-emerald-200 bg-emerald-50'
              : paymentIsTerminal
                ? 'border-rose-200 bg-rose-50'
                : 'border-blue-200 bg-blue-50'
          }`}>
            <h3 className="text-base font-extrabold text-slate-900">
              {paymentIsPaid ? 'Terima kasih, donasi Anda berhasil!' :
                paymentIsTerminal ? 'Pembayaran belum berhasil' : 'Langkah berikutnya: selesaikan pembayaran'}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-700">
              {paymentIsPaid
                ? 'Pembayaran Anda sudah terkonfirmasi. Terima kasih telah membantu anak-anak asuh.'
                : paymentIsTerminal
                  ? 'Anda dapat memulai donasi kembali jika ingin mencoba pembayaran yang lain.'
                  : 'Jika belum membayar, tekan Lanjutkan Pembayaran. Jika sudah membayar, tekan Cek Status Donasi untuk melihat konfirmasinya.'}
            </p>
            <p className="mt-3 text-xs font-semibold text-slate-800">
              Status donasi: <strong>{paymentStatusLabel(paymentStatus || 'pending')}</strong>
            </p>
            <details className="mt-3 rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-700">
              <summary className="cursor-pointer font-semibold text-slate-700">Lihat nomor referensi donasi</summary>
              <dl className="mt-2 space-y-1 break-all">
                <div>Nomor donasi: <strong>{createdDonation?.public_id || '-'}</strong></div>
                <div>Nomor pembayaran: <strong>{paymentSession.public_id}</strong></div>
                {paymentSession.order_id && <div>Referensi pembayaran: <strong>{paymentSession.order_id}</strong></div>}
              </dl>
              <p className="mt-2 text-slate-500">Simpan nomor ini jika memerlukan bantuan pengurus.</p>
            </details>
            {statusChecking && <p className="mt-2 text-xs font-semibold text-blue-800">Memeriksa konfirmasi pembayaran...</p>}
            {!paymentIsTerminal && (
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={snapOpening || statusChecking}
                  onClick={() => openSnap(paymentSession)}
                  className="rounded-xl bg-emerald-700 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {snapOpening ? 'Membuka halaman pembayaran...' : 'Lanjutkan Pembayaran'}
                </button>
                <button
                  type="button"
                  disabled={statusChecking}
                  onClick={() => confirmPaymentStatus(paymentSession.public_id, { maxAttempts: 3 })}
                  className="rounded-xl border border-blue-200 bg-white px-4 py-3 text-xs font-bold text-blue-800 disabled:opacity-50"
                >
                  {statusChecking ? 'Sedang memeriksa...' : 'Cek Status Donasi'}
                </button>
              </div>
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
              ? 'Menyiapkan pembayaran...'
              : createdDonation
                ? 'Coba Buka Pembayaran'
                : 'Lanjut ke Pembayaran'}
          </button>
        )}
        {paymentMethod === 'manual' && !createdDonation && (
          <button type="submit" disabled={!manualReady || submitting} className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
            {submitting ? 'Mengirim bukti transfer...' : manualReady ? 'Kirim Bukti Transfer' : 'Transfer Bank Belum Tersedia'}
          </button>
        )}
        {paymentMethod === 'manual' && createdDonation && (
          <div role="status" className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950">
            <p className="font-bold">Bukti transfer berhasil dikirim.</p>
            <p>Terima kasih. Pengurus akan memeriksa pembayaran Anda sebelum donasi dinyatakan selesai.</p>
            <details className="rounded-lg border border-amber-200 bg-white/70 p-2">
              <summary className="cursor-pointer font-semibold">Lihat nomor referensi donasi</summary>
              <p className="mt-2 break-all">Nomor donasi: <strong>{createdDonation.public_id}</strong></p>
            </details>
            <button type="button" onClick={restartForm} className="rounded-lg border border-amber-300 bg-white px-3 py-2 font-bold">Buat Donasi Baru</button>
          </div>
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
