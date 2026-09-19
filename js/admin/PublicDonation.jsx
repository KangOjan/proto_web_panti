// Public Donation Portal Component (User Umum - Tanpa Login)
const PublicDonation = ({
  onSubmitPublicDonation,
  donationContext = null,
}) => {
  const initialCategory =
    donationContext
      ?.allocationCategory ||
    'Konsumsi';

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

  // Payment Method:
  // 'bank' | 'qris'
  const [
    paymentMethod,
    setPaymentMethod,
  ] = React.useState(
    'qris'
  );

  const [
    selectedBank,
    setSelectedBank,
  ] = React.useState(
    'BSI'
  );

  // Verification & State
  const [
    isVerifying,
    setIsVerifying,
  ] = React.useState(false);

  const [
    copiedBank,
    setCopiedBank,
  ] = React.useState(false);

  React.useEffect(
    () => {
      setCategory(
        donationContext
          ?.allocationCategory ||
        'Konsumsi'
      );
    },
    [
      donationContext,
    ]
  );
// Preset Amounts (Exactly 4 items: Rp 50.000, Rp 100.000, Rp 500.000, Rp 1.000.000)
  const presetAmounts = [50000, 100000, 500000, 1000000];

  const banks = {
    'BSI': { name: 'Bank Syariah Indonesia (BSI)', no: '7192-0045-88', holder: 'Yayasan Panti Asuhan Kasih Bunda' },
    'Mandiri': { name: 'Bank Mandiri', no: '127-00-098234-1', holder: 'Yayasan Panti Asuhan Kasih Bunda' },
    'BCA': { name: 'Bank BCA', no: '882-019-4451', holder: 'Yayasan Panti Asuhan Kasih Bunda' }
  };

  const handleCopyAccount = (accountNo) => {
    navigator.clipboard.writeText(accountNo);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 3000);
  };

  const handleProcessDonation = (e) => {
    e.preventDefault();
    if (!donorName || !amount || amount <= 0) {
      alert("Mohon isi Nama Donatur dan Nominal Donasi dengan benar.");
      return;
    }

    setIsVerifying(true);

    // Simulate real-time payment gateway verification delay (1.8s)
    setTimeout(() => {
      setIsVerifying(false);

      const donationData = {
        donorName,

        amount:
          parseFloat(
            amount
          ),

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

        phone,
        email,
        note,

        paymentMethod:
          paymentMethod === 'qris'
            ? 'Scan QRIS Dinamis'
            : `Transfer Bank (${selectedBank})`,

        bankDetail:
          paymentMethod === 'bank'
            ? banks[selectedBank]
            : null,
      };

      onSubmitPublicDonation(donationData);
    }, 1800);
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
                  )
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-bold bg-white text-emerald-950 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
              >
                <option value="Konsumsi">Pemenuhan Konsumsi & Gizi Harian</option>
                <option value="SPP/Pendidikan">Beasiswa SPP & Seragam Sekolah</option>
                <option value="Operasional">Operasional & Fasilitas Asrama</option>
                <option value="Donasi Rutin">Donasi Rutin Operasional Anak</option>
                <option value="Infak/Zakat">Infak / Zakat Maal</option>
                <option value="Lainnya">Donasi Insidental / Sedekah Umum</option>
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
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
              />
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 font-medium leading-relaxed">
                📌 Nomor WhatsApp akan dicantumkan pada Kuitansi Digital Resmi sebagai sarana konfirmasi penerimaan kas.
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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-medium leading-relaxed resize-y"
            ></textarea>
          </div>

        </div>

        {/* Section 2: Pilih Metode Pembayaran (QRIS Dinamis vs Transfer Bank) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">2</span>
            <span>Pilihan Metode Pembayaran Donasi</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('qris')}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                paymentMethod === 'qris'
                  ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900">Scan QRIS Dinamis</span>
                <LucideIcon name="qr-code" className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-medium">
                Otomatis menyesuaikan nominal donasi (GoPay, OVO, Dana, ShopeePay, BCA Mobile, BSI Mobile).
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('bank')}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                paymentMethod === 'bank'
                  ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900">Transfer Bank</span>
                <LucideIcon name="building" className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-medium">
                Transfer langsung ke rekening resmi panti asuhan (BSI, Mandiri, BCA).
              </p>
            </button>
          </div>

          {/* DISPLAY METHOD 1: SCAN QRIS DINAMIS */}
          {paymentMethod === 'qris' && (
            <div className="bg-slate-900 text-white rounded-3xl p-6 text-center space-y-4 animate-fade-in border border-slate-800">
              <div className="flex items-center justify-center space-x-2 text-xs font-bold text-amber-400">
                <LucideIcon name="sparkles" className="w-4 h-4" />
                <span>Kode QRIS Dinamis Diterbitkan</span>
              </div>

              {/* Dynamic QR Code Canvas Simulation */}
              <div className="bg-white p-4 rounded-2xl inline-block shadow-2xl mx-auto border-4 border-emerald-500">
                <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100">
                  {/* Outer QR frame */}
                  <rect x="5" y="5" width="90" height="90" fill="none" stroke="#0f172a" strokeWidth="3" rx="4" />
                  {/* Position squares */}
                  <rect x="10" y="10" width="22" height="22" fill="#0f172a" />
                  <rect x="14" y="14" width="14" height="14" fill="#ffffff" />
                  <rect x="18" y="18" width="6" height="6" fill="#0f172a" />

                  <rect x="68" y="10" width="22" height="22" fill="#0f172a" />
                  <rect x="72" y="14" width="14" height="14" fill="#ffffff" />
                  <rect x="76" y="18" width="6" height="6" fill="#0f172a" />

                  <rect x="10" y="68" width="22" height="22" fill="#0f172a" />
                  <rect x="14" y="72" width="14" height="14" fill="#ffffff" />
                  <rect x="18" y="76" width="6" height="6" fill="#0f172a" />

                  {/* QR Data Matrix simulation */}
                  <rect x="38" y="12" width="6" height="6" fill="#10b981" />
                  <rect x="48" y="18" width="6" height="6" fill="#0f172a" />
                  <rect x="38" y="28" width="6" height="6" fill="#0f172a" />

                  <rect x="12" y="38" width="6" height="6" fill="#0f172a" />
                  <rect x="22" y="44" width="6" height="6" fill="#10b981" />
                  <rect x="34" y="38" width="16" height="16" fill="#0f172a" />
                  <rect x="56" y="38" width="6" height="6" fill="#10b981" />
                  <rect x="68" y="38" width="18" height="6" fill="#0f172a" />

                  <rect x="38" y="60" width="6" height="6" fill="#0f172a" />
                  <rect x="48" y="68" width="16" height="16" fill="#10b981" />
                  <rect x="68" y="68" width="18" height="18" fill="#0f172a" />
                </svg>

                <div className="mt-2 text-center">
                  <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">NAMA PANTI / PENERIMA</div>
                  <div className="text-xs font-black text-slate-900">PANTI ASUHAN KASIH BUNDA</div>
                  <div className="text-xs font-black text-emerald-600 mt-0.5">
                    Nominal: Rp {amount ? parseFloat(amount).toLocaleString('id-ID') : '0'}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300">
                Scan menggunakan aplikasi m-Banking atau E-Wallet Anda (Gopay, ShopeePay, OVO, Dana, LinkAja, BCA, BSI).
              </p>
            </div>
          )}

          {/* DISPLAY METHOD 2: TRANSFER BANK */}
          {paymentMethod === 'bank' && (
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 animate-fade-in">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-600">Pilih Rekening Bank Tujuan:</span>
                <div className="flex items-center space-x-1.5">
                  {Object.keys(banks).map(bKey => (
                    <button
                      key={bKey}
                      type="button"
                      onClick={() => setSelectedBank(bKey)}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all border ${
                        selectedBank === bKey
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {bKey}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{banks[selectedBank].name}</div>
                  <div className="text-2xl font-black text-slate-900 font-mono tracking-wider mt-0.5">
                    {banks[selectedBank].no}
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">
                    a.n. <span className="font-bold text-slate-800">{banks[selectedBank].holder}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyAccount(banks[selectedBank].no)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                    copiedBank
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <LucideIcon name={copiedBank ? "check" : "copy"} className="w-4 h-4" />
                  <span>{copiedBank ? "Nomor Rekening Tersalin!" : "Salin Rekening"}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* VERIFICATION & SUBMIT BUTTON */}
        <div className="pt-4 border-t border-slate-100">
          {isVerifying ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-center space-y-2 animate-fade-in">
              <div className="flex items-center justify-center space-x-2">
                <LucideIcon name="loader-2" className="w-5 h-5 text-amber-600 animate-spin" />
                <span className="font-extrabold text-sm">Verifikasi Pembayaran Real-Time Sedang Berlangsung...</span>
              </div>
              <p className="text-xs text-amber-800">
                Sistem sedang mencatat donasi ke Dashboard Keuangan & menerbitkan Kuitansi Digital Terverifikasi.
              </p>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <LucideIcon name="check-circle-2" className="w-5 h-5" />
              <span>Konfirmasi & Verifikasi Pembayaran Donasi</span>
            </button>
          )}
        </div>

      </form>

    </div>
  );
};

window.PublicDonation = PublicDonation;
