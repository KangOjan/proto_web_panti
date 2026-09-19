// Public Donation Portal Component (User Umum - Tanpa Login)
const PublicDonation = ({
  onSubmitPublicDonation,
  donationContext = null,
}) => {
  const initialCategory =
    donationContext
      ?.allocationCategory ||
    'konsumsi';

  const [
    donorName,
    setDonorName,
  ] = React.useState('');

  const [
    amount,
    setAmount,
  ] = React.useState(
    100000
  );

  const [
    category,
    setCategory,
  ] = React.useState(
    initialCategory
  );

  const [
    phone,
    setPhone,
  ] = React.useState('');

  const [
    email,
    setEmail,
  ] = React.useState('');

  const [
    note,
    setNote,
  ] = React.useState('');

  /*
  |--------------------------------------------------------------------------
  | Submission State
  |--------------------------------------------------------------------------
  */

  const [
    isVerifying,
    setIsVerifying,
  ] = React.useState(false);

  const [
    submissionError,
    setSubmissionError,
  ] = React.useState(null);

  const [
    createdDonation,
    setCreatedDonation,
  ] = React.useState(null);

  const [
    paymentSession,
    setPaymentSession,
  ] = React.useState(null);

  React.useEffect(
    () => {
      setCategory(
        donationContext
          ?.allocationCategory ||
        'konsumsi'
      );

      setSubmissionError(
        null
      );

      setCreatedDonation(
        null
      );

      setPaymentSession(
        null
      );
    },
    [
      donationContext,
    ]
  );

  // Preset Amounts
  const presetAmounts = [
    50000,
    100000,
    500000,
    1000000,
  ];

  const formLocked =
    Boolean(
      createdDonation
    );

  const handleProcessDonation =
    async (event) => {
      event.preventDefault();

      if (
        isVerifying ||
        paymentSession
      ) {
        return;
      }

      const normalizedName =
        donorName.trim();

      const normalizedAmount =
        Number(amount);

      if (
        normalizedName === '' ||
        !Number.isInteger(
          normalizedAmount
        ) ||
        normalizedAmount <
          10000
      ) {
        setSubmissionError(
          'Mohon isi nama donatur dan nominal donasi minimal Rp10.000 dalam bilangan bulat.'
        );

        return;
      }

      setIsVerifying(
        true
      );

      setSubmissionError(
        null
      );

      const donationData = {
        donorName:
          normalizedName,

        amount:
          normalizedAmount,

        category,

        campaignId:
          donationContext
            ?.campaignId ??
          null,

        campaignTitle:
          donationContext
            ?.campaignTitle ||
          null,

        campaignSlug:
          donationContext
            ?.campaignSlug ||
          null,

        phone:
          phone.trim(),

        email:
          email.trim(),

        note:
          note.trim(),
      };

      try {
        const result =
          await onSubmitPublicDonation(
            donationData,
            createdDonation
          );

        if (result?.donation) {
          setCreatedDonation(
            result.donation
          );
        }

        if (!result?.success) {
          setSubmissionError(
            result?.message ||
            'Sesi pembayaran gagal dibuat. Silakan coba lagi.'
          );

          return;
        }

        setPaymentSession(
          result.payment
        );
      } catch (error) {
        console.error(
          'Public donation form submission failed:',
          error
        );

        setSubmissionError(
          error?.message ||
          'Terjadi kesalahan saat menyiapkan pembayaran.'
        );
      } finally {
        setIsVerifying(
          false
        );
      }
    };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in space-y-8">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
            <LucideIcon name="heart" className="w-3.5 h-3.5 fill-slate-950" />
            <span>Portal Donatur Publik (Tanpa Login)</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-2">Salurkan Donasi & Infak Terbaik Anda</h1>
          <p className="text-xs text-emerald-100/90 max-w-xl mt-1">
            Donasi Anda akan tercatat secara real-time di Dashboard Keuangan & Digital Audit Trail Panti Asuhan Kasih Bunda. Terbit Kuitansi Resmi bertanda-tangan digital secara otomatis.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center min-w-[140px]">
          <div className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold">Verifikasi</div>
          <div className="text-xs font-extrabold text-white mt-0.5">Otomatis & Real-Time</div>
        </div>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleProcessDonation} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">


        {donationContext?.campaignId && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <LucideIcon
                  name="heart-handshake"
                  className="h-5 w-5"
                />
              </div>

              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  Donasi untuk Program
                </div>

                <div className="mt-0.5 text-sm font-extrabold text-slate-900">
                  {
                    donationContext
                      .campaignTitle
                  }
                </div>

                <div className="mt-1 text-xs text-slate-600">
                  Alokasi donasi mengikuti kategori program ini.
                </div>
              </div>
            </div>
          </div>
        )}

{/* Section 1: Data Donatur & Nominal (Re-designed Layout) */}
        <div className="space-y-5">
          <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">1</span>
            <span>Identitas Donatur & Nominal Donasi</span>
          </h3>

          {/* Row 1: Nama Donatur (Left) & Kategori Alokasi Dana (Right) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Lengkap Donatur *
              </label>
              <input
                type="text"
                required
                placeholder="cth: Hidayat Pratama / Hamba Allah"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                disabled={formLocked || isVerifying}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kategori Alokasi Dana *
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                disabled={
                  Boolean(
                    donationContext
                      ?.campaignId
                  ) ||
                  formLocked ||
                  isVerifying
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-bold bg-white text-emerald-950 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
              >
                <option value="konsumsi">
                  Pemenuhan Konsumsi & Gizi Harian
                </option>
                <option value="spp_pendidikan">
                  Beasiswa SPP & Seragam Sekolah
                </option>
                <option value="operasional">
                  Operasional & Fasilitas Asrama
                </option>
                <option value="donasi_rutin">
                  Donasi Rutin Operasional Anak
                </option>
                <option value="infak_zakat">
                  Infak / Zakat Maal
                </option>
                <option value="lainnya">
                  Donasi Insidental / Sedekah Umum
                </option>
              </select>
            </div>
          </div>

          {/* Row 2: Nominal Donasi (Left, 50%) & No HP/WhatsApp (Right, 50%) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">

            {/* Left Column: Nominal Donasi with 4 Preset Buttons (2 per row grid) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nominal Donasi (Rp) *
              </label>

              {/* Quick Presets Grid (2 items per row x 2 rows = 4 items) */}
              <div className="grid grid-cols-2 gap-2">
                {presetAmounts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p)}
                    disabled={formLocked || isVerifying}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all border text-center ${
                      amount === p
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Rp {p.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>

              {/* Custom Amount Input Field */}
              <div className="relative pt-1">
                <span className="absolute left-4 top-3.5 font-black text-slate-400 text-sm">Rp</span>
                <input
                  type="number"
                  required
                  min="10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={formLocked || isVerifying}
                  step="1"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-base font-black text-slate-900"
                />
              </div>
            </div>

            {/* Right Column: No HP / WhatsApp */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                No. HP / WhatsApp (Untuk Kuitansi Digital)
              </label>
              <input
                type="text"
                placeholder="cth: 0812XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={formLocked || isVerifying}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
              />
              <input
                type="email"
                placeholder="Email (opsional)"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                disabled={
                  formLocked ||
                  isVerifying
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-semibold disabled:bg-slate-100"
              />

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 font-medium leading-relaxed">
                📌 Nomor WhatsApp dan email dapat digunakan sebagai data kontak pada bukti donasi.
              </div>
            </div>

          </div>

          {/* Row 3: Doa & Harapan (FULL WIDTH MULTI-LINE TEXTAREA) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Doa & Harapan (Opsional)
            </label>
            <textarea
              rows="3"
              placeholder="Tuliskan doa, niat, atau harapan Anda untuk anak-anak panti asuhan..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={formLocked || isVerifying}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-medium leading-relaxed resize-y"
            ></textarea>
          </div>

        </div>

        {/* Section 2: Midtrans Payment Session */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">
              2
            </span>
            <span>Pembayaran Aman via Midtrans</span>
          </h3>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <LucideIcon
                  name="shield-check"
                  className="h-5 w-5"
                />
              </div>

              <div className="space-y-1">
                <div className="text-sm font-extrabold text-slate-900">
                  Metode pembayaran dipilih di halaman aman Midtrans
                </div>

                <p className="text-xs leading-relaxed text-slate-600">
                  Backend akan membuat sesi pembayaran berdasarkan nominal donasi. Status lunas hanya ditentukan dari webhook atau sinkronisasi server, bukan dari tampilan browser.
                </p>
              </div>
            </div>
          </div>

          {createdDonation && !paymentSession && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
              <div className="font-extrabold">
                Donasi sudah tercatat, tetapi sesi pembayaran belum berhasil dibuat.
              </div>

              <div className="mt-1">
                Klik tombol di bawah untuk mencoba ulang pembuatan sesi pembayaran tanpa membuat donasi baru.
              </div>
            </div>
          )}

          {paymentSession && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <LucideIcon
                  name="check-circle-2"
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700"
                />

                <div className="min-w-0 space-y-1">
                  <div className="text-sm font-extrabold text-emerald-950">
                    Sesi pembayaran berhasil dibuat
                  </div>

                  <div className="break-all text-[11px] text-emerald-900">
                    Donation ID: {createdDonation?.public_id || '-'}
                  </div>

                  <div className="break-all text-[11px] text-emerald-900">
                    Payment ID: {paymentSession?.public_id || '-'}
                  </div>

                  {paymentSession?.order_id && (
                    <div className="break-all text-[11px] text-emerald-900">
                      Order ID: {paymentSession.order_id}
                    </div>
                  )}

                  <div className="text-[11px] font-bold text-emerald-800">
                    Status: {paymentSession?.status || 'pending'}
                  </div>

                  <div className="pt-1 text-[11px] text-emerald-800">
                    Tahap berikutnya akan membuka Snap Midtrans. Status ini belum berarti donasi telah dibayar.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SUBMISSION STATUS & BUTTON */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          {submissionError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900">
              <div className="flex items-start gap-2">
                <LucideIcon
                  name="alert-circle"
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-700"
                />

                <span className="font-bold">
                  {submissionError}
                </span>
              </div>
            </div>
          )}

          {isVerifying ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-center space-y-2 animate-fade-in">
              <div className="flex items-center justify-center space-x-2">
                <LucideIcon
                  name="loader-2"
                  className="w-5 h-5 text-amber-600 animate-spin"
                />

                <span className="font-extrabold text-sm">
                  Menyiapkan donasi dan sesi pembayaran...
                </span>
              </div>

              <p className="text-xs text-amber-800">
                Jangan tutup halaman sampai proses selesai.
              </p>
            </div>
          ) : (
            <button
              type="submit"
              disabled={Boolean(paymentSession)}
              className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center space-x-2 transition-all ${
                paymentSession
                  ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/20 transform hover:-translate-y-0.5'
              }`}
            >
              <LucideIcon
                name={
                  paymentSession
                    ? 'check-circle-2'
                    : 'credit-card'
                }
                className="w-5 h-5"
              />

              <span>
                {paymentSession
                  ? 'Sesi Pembayaran Siap'
                  : createdDonation
                  ? 'Coba Lagi Sesi Pembayaran'
                  : 'Buat Sesi Pembayaran Midtrans'}
              </span>
            </button>
          )}
        </div>

      </form>

    </div>
  );
};

window.PublicDonation = PublicDonation;
