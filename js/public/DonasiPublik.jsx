// Public Donation Portal Component (Formulir Donasi Online Publik)
const DonasiPublik = ({
  campaigns = [],
  donationContext = null,
  onSubmitPublicDonation,
  onOpenReceiptModal,
  onNavigateHome,
}) => {
  const availableCampaigns = React.useMemo(() => {
    if (campaigns && campaigns.length > 0) return campaigns;
    return window.INITIAL_SIMK_DATA?.campaigns || [];
  }, [campaigns]);

  const allProgramOptions = [
    {
      id: 'CMP-GENERAL',
      title: 'Donasi Umum (Operasional & Kebutuhan Mendesak Panti)',
      category: 'Umum',
      targetAmount: 50000000,
      collectedAmount: 34500000,
      description: 'Penyaluran fleksibel untuk pemenuhan kebutuhan darurat anak, listrik, air, dan operasional harian.'
    },
    ...availableCampaigns
  ];

  const initialCampaignId = donationContext?.campaignId || 'CMP-GENERAL';
  const [selectedCampaignId, setSelectedCampaignId] = React.useState(initialCampaignId);

  const [donorName, setDonorName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [amount, setAmount] = React.useState('100000');
  const [message, setMessage] = React.useState('');
  const [isAnonymous, setIsAnonymous] = React.useState(false);
  const [paymentTab, setPaymentTab] = React.useState('transfer'); // transfer | qris
  const [selectedBank, setSelectedBank] = React.useState('bsi');
  const [copiedBank, setCopiedBank] = React.useState(false);
  const [proofFile, setProofFile] = React.useState(null);
  const [proofPreview, setProofPreview] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [submittedDonation, setSubmittedDonation] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const presetAmounts = ['25000', '50000', '100000', '250000', '500000', '1000000'];

  const bankAccounts = {
    bsi: { name: 'Bank Syariah Indonesia (BSI)', no: '7123-4567-89', holder: 'Yayasan Kasih Bunda Indonesia' },
    mandiri: { name: 'Bank Mandiri', no: '123-00-0987654-3', holder: 'Yayasan Kasih Bunda' },
    bca: { name: 'Bank Central Asia (BCA)', no: '883-0918-271', holder: 'Kasih Bunda Yayasan' }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount < 10000) {
      setErrorMessage('Nominal donasi minimal Rp 10.000.');
      return;
    }

    if (!donorName.trim() && !isAnonymous) {
      setErrorMessage('Mohon isi nama donatur atau pilih centang Sembunyikan Nama (Hamba Allah).');
      return;
    }

    setIsSubmitting(true);

    const selectedProg = allProgramOptions.find(p => p.id === selectedCampaignId);
    const finalDonorName = isAnonymous ? 'Hamba Allah' : donorName.trim();

    const donationData = {
      campaignId: selectedCampaignId === 'CMP-GENERAL' ? null : selectedCampaignId,
      campaignTitle: selectedProg ? selectedProg.title : 'Donasi Umum',
      category: selectedProg?.category ? selectedProg.category.toLowerCase() : 'umum',
      donorName: finalDonorName,
      email: email.trim() || null,
      phone: phone.trim() || null,
      amount: numericAmount,
      note: message.trim() || null,
      message: message.trim() || null,
      isAnonymous,
      proofImage: proofPreview,
      paymentMethod: paymentTab === 'transfer' ? `Transfer Bank (${selectedBank.toUpperCase()})` : 'QRIS Dinamis',
      type: 'online',
      status: 'Pending',
    };

    try {
      if (onSubmitPublicDonation) {
        const result = await onSubmitPublicDonation(donationData);
        if (result && result.donation) {
          donationData.id = result.donation.public_id || result.donation.id;
        }
      }

      if (!donationData.id) {
        donationData.id = `DON-${Date.now().toString().slice(-6)}`;
      }

      setSubmittedDonation(donationData);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit donation:', err);
      setErrorMessage(err?.message || 'Gagal mengirim donasi. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenReceipt = () => {
    if (onOpenReceiptModal && submittedDonation) {
      onOpenReceiptModal({
        id: submittedDonation.id,
        receiptNo: submittedDonation.id,
        donorName: submittedDonation.donorName,
        amount: submittedDonation.amount,
        category: submittedDonation.campaignTitle,
        date: new Date().toISOString(),
        paymentMethod: submittedDonation.paymentMethod,
        type: 'pemasukan',
        description: `Donasi Online: ${submittedDonation.campaignTitle}`,
        createdBy: 'Sistem Donasi Online'
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-black">
            <window.Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>Portal Donasi Bebas Login • 100% Transparan</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Salurkan Donasi & Kebaikan
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
            Bantu pemenuhan gizi, pendidikan, dan fasilitas 45 anak asuh di Panti Asuhan Kasih Bunda. Setiap rupiah dicatat transparan dan diterbitkan kuitansi digital resmi.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center min-w-[180px] shadow-lg">
          <div className="text-[10px] uppercase tracking-wider text-amber-300 font-extrabold">Akreditasi & Legalitas</div>
          <div className="text-lg font-black text-white mt-1">LKS Resmi Dinsos</div>
          <div className="text-[11px] text-emerald-200 font-medium">Bebas Biaya Admin</div>
        </div>
      </div>

      {isSubmitted ? (
        /* SUCCESS CONFIRMATION VIEW */
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-100 text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
            <window.CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-black text-slate-900">
              Alhamdulillah, Donasi Berhasil Dikirim!
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Terima kasih atas kebaikan Anda. Bukti transfer donasi Anda telah masuk ke sistem antrean verifikasi pengurus panti.
            </p>
          </div>

          {/* Donation Summary Card */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-w-lg mx-auto text-left text-xs space-y-2.5">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">ID Referensi Donasi</span>
              <span className="font-mono font-bold text-slate-900">{submittedDonation?.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Nama Donatur</span>
              <span className="font-bold text-slate-900">{submittedDonation?.donorName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Nominal Donasi</span>
              <span className="font-black text-emerald-700 text-sm">
                Rp {Number(submittedDonation?.amount || 0).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Alokasi Program</span>
              <span className="font-semibold text-slate-800">{submittedDonation?.campaignTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Status</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Pending Verifikasi Pengurus
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleOpenReceipt}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-all"
            >
              <window.Receipt className="w-4 h-4 text-emerald-400" />
              <span>Lihat Kuitansi / Bukti Donasi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setSubmittedDonation(null);
                setProofPreview(null);
                if (onNavigateHome) onNavigateHome();
                else if (window.navigateToRoute) window.navigateToRoute('/');
              }}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      ) : (
        /* DONATION SUBMISSION FORM */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2.5">
              <window.AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Pilih Program Donasi */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              1. Pilih Program Kebutuhan / Campaign
            </label>
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              {allProgramOptions.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.title} {prog.category ? `(${prog.category})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Section 2: Nominal Donasi */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              2. Pilih atau Masukkan Nominal Donasi (Rp)
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    amount === preset
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Rp {Number(preset).toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            <div className="relative pt-1">
              <span className="absolute inset-y-0 left-0 pl-4 pt-1 flex items-center text-xs font-extrabold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                min="10000"
                step="5000"
                placeholder="Nominal lainnya (min. Rp 10.000)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm font-black focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Section 3: Data Donatur */}
          <div className="space-y-4">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              3. Data Donatur & Doa Kebaikan
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Nama Donatur / Pengirim *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  disabled={isAnonymous}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Nomor WhatsApp (Opsional, untuk kuitansi)
                </label>
                <input
                  type="tel"
                  placeholder="0812-xxxx-xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Alamat Email (Opsional)
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="anonymousCheckbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="anonymousCheckbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Sembunyikan nama saya (Tampilkan sebagai "Hamba Allah" di publik)
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Pesan / Doa untuk Anak Asuh (Opsional)
              </label>
              <textarea
                rows="2"
                placeholder="Tuliskan doa atau harapan baik untuk adik-adik panti..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>
          </div>

          {/* Section 4: Metode Pembayaran */}
          <div className="space-y-4">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              4. Rekening Tujuan Transfer & Pembayaran
            </label>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setPaymentTab('transfer')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 border ${
                  paymentTab === 'transfer'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <window.CreditCard className="w-4 h-4" />
                <span>Transfer Bank Resmi</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('qris')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 border ${
                  paymentTab === 'qris'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <window.QrCode className="w-4 h-4" />
                <span>Scan QRIS Dinamis</span>
              </button>
            </div>

            {paymentTab === 'transfer' ? (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2">
                  {Object.keys(bankAccounts).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedBank(key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                        selectedBank === key
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {key.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs text-slate-500 font-semibold">{bankAccounts[selectedBank].name}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg font-black text-emerald-700">
                      {bankAccounts[selectedBank].no}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankAccounts[selectedBank].no)}
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center space-x-1"
                    >
                      {copiedBank ? <window.Check className="w-3.5 h-3.5" /> : <window.Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBank ? 'Tersalin' : 'Salin Nomor'}</span>
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    a.n. <b className="text-slate-700">{bankAccounts[selectedBank].holder}</b>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020101021226670014ID.LINKAJA.WWW0118936009180000000000021500000000000000000303UMI51440014ID.CO.QRIS.WWW0215ID10200210000000303UMI5204549953033605802ID5918PANTI+KASIH+BUNDA6007JAKARTA61051218062070703A0163045E62"
                    alt="QRIS Panti Kasih Bunda"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs font-bold text-slate-800">
                  Scan QRIS via Livin, BCA Mobile, GoPay, OVO, Dana, ShopeePay
                </div>
                <p className="text-[11px] text-slate-500">NMID: ID1020021000000 • Terakreditasi Asosiasi Pembayaran Indonesia</p>
              </div>
            )}
          </div>

          {/* Section 5: Unggah Bukti Transfer */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              5. Unggah Bukti Transfer / Resi Pembayaran
            </label>

            <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-6 text-center bg-slate-50/50 transition-colors">
              {proofPreview ? (
                <div className="space-y-3">
                  <img
                    src={proofPreview}
                    alt="Preview Bukti"
                    className="max-h-48 mx-auto rounded-xl shadow-md border border-slate-200 object-contain"
                  />
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-xs font-bold text-emerald-700">✓ Bukti Transfer Siap Dikirim</span>
                    <button
                      type="button"
                      onClick={() => {
                        setProofFile(null);
                        setProofPreview(null);
                      }}
                      className="text-xs text-rose-600 hover:underline font-bold"
                    >
                      Hapus & Ganti
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <window.Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-xs font-bold text-slate-700">
                    Klik untuk memilih foto bukti transfer (JPG / PNG)
                  </div>
                  <p className="text-[10px] text-slate-400">Maksimal ukuran file 5 MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileUploadInput"
                  />
                  <label
                    htmlFor="fileUploadInput"
                    className="inline-block mt-1 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer shadow-xs"
                  >
                    Pilih File Gambar
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/25 text-sm flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <window.Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Mengirim Data Donasi...' : 'Kirim Konfirmasi Donasi Sekarang'}</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2 font-medium">
              Data Anda terlindungi & digunakan semata-mata untuk verifikasi amanah donasi.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

window.DonasiPublik = DonasiPublik;
window.PublicDonation = DonasiPublik;
