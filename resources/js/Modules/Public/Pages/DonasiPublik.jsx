import React, { useState, useEffect } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import { INITIAL_SIMK_DATA } from '../../../Data/mockData';
import {
  Heart,
  CreditCard,
  QrCode,
  Upload,
  CheckCircle2,
  Lock,
  Send,
  AlertCircle,
  Copy,
  Check,
  Building2,
  Sparkles,
  ShieldCheck,
  Layers
} from 'lucide-react';

export default function DonasiPublik(props) {
  const simk = useSimk();
  const campaigns = (props.campaigns && props.campaigns.length > 0) ? props.campaigns : (simk?.campaigns || []);
  const onSubmitDonation = props.onSubmitDonation || simk?.handleAddOnlineDonationSubmit;
  const onOpenReceiptModal = props.onOpenReceiptModal || simk?.handlePrintTransactionReceipt;

  const availableCampaigns = React.useMemo(() => {
    if (campaigns && campaigns.length > 0) return campaigns;
    return INITIAL_SIMK_DATA.campaigns;
  }, [campaigns]);

  // Include general donation option
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

  // Query param auto-selection or default to first campaign
  const [selectedCampaignId, setSelectedCampaignId] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cId = params.get('campaign');
      if (cId && allProgramOptions.some(c => c.id === cId)) {
        return cId;
      }
    }
    return allProgramOptions[0]?.id || 'CMP-GENERAL';
  });

  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('100000');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentTab, setPaymentTab] = useState('transfer'); // transfer | qris
  const [selectedBank, setSelectedBank] = useState('bsi');
  const [copiedBank, setCopiedBank] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedDonation, setSubmittedDonation] = useState(null);

  // Sync URL query params if user navigates with ?campaign=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cId = params.get('campaign');
    if (cId && allProgramOptions.some(c => c.id === cId)) {
      setSelectedCampaignId(cId);
    }
  }, [window.location.search]);

  const selectedCampaign = allProgramOptions.find(c => c.id === selectedCampaignId) || allProgramOptions[0];

  const presetImpactAmounts = [
    { value: 25000, label: 'Rp 25.000', impact: 'Paket Sarapan Gizi 1 Hari' },
    { value: 50000, label: 'Rp 50.000', impact: 'Perlengkapan Belajar & Buku' },
    { value: 100000, label: 'Rp 100.000', impact: 'Susu & Vitamin 1 Bulan' },
    { value: 250000, label: 'Rp 250.000', impact: 'Beasiswa SPP Bulanan' },
    { value: 500000, label: 'Rp 500.000', impact: 'Kebutuhan Hidup Penuh' }
  ];

  const bankAccounts = {
    bsi: { name: 'Bank Syariah Indonesia (BSI)', number: '7123456789', holder: 'YPI Kasih Bunda' },
    mandiri: { name: 'Bank Mandiri', number: '1270009876543', holder: 'YPI Kasih Bunda' },
    bca: { name: 'Bank Central Asia (BCA)', number: '8020112233', holder: 'YPI Kasih Bunda' }
  };

  const handleCopyBankNumber = (num) => {
    navigator.clipboard.writeText(num);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) < 10000) {
      alert("Mohon masukkan nominal donasi minimal Rp 10.000.");
      return;
    }

    const newDonation = {
      id: `DON-${Date.now().toString().slice(-6)}`,
      donorName: isAnonymous ? 'Hamba Allah (Anonim)' : (donorName.trim() || 'Donatur Dermawan'),
      email,
      phone,
      amount: Number(amount),
      campaignId: selectedCampaign.id,
      campaignTitle: selectedCampaign.title,
      message,
      isAnonymous,
      paymentMethod: paymentTab === 'qris' ? 'QRIS Standar Nasional' : `Transfer Bank ${bankAccounts[selectedBank].name}`,
      proofImage: proofPreview || 'https://placehold.co/600x800/10b981/ffffff?text=Bukti+Transfer+Donasi',
      status: 'Pending',
      type: 'online',
      kind: 'uang',
      createdAt: new Date().toISOString()
    };

    // Save to localStorage directly if callback not bound
    try {
      const existing = localStorage.getItem('simk_donations');
      const parsed = existing ? JSON.parse(existing) : INITIAL_SIMK_DATA.donations;
      localStorage.setItem('simk_donations', JSON.stringify([newDonation, ...parsed]));
    } catch (err) {
      console.error(err);
    }

    if (onSubmitDonation) {
      onSubmitDonation(newDonation);
    }

    setSubmittedDonation(newDonation);
    setIsSubmitted(true);
  };

  return (
    <MainLayout currentRoute="donasi">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl text-center space-y-3 relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-4 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-black mx-auto">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Formulir Donasi Online • Bebas Login</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Salurkan Kebaikan Anda Hari Ini
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
            Setiap rupiah amanah Anda akan tercatat secara transparan dan diverifikasi langsung untuk pemenuhan kebutuhan anak-anak panti.
          </p>
        </div>

        {/* POST-DONATION SUCCESS STATE */}
        {isSubmitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-1">
              <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black mb-1">
                Status: PENDING VERIFIKASI PENGURUS
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Alhamdulillah, Donasi Berhasil Dikirim!
              </h2>
              <p className="text-xs text-slate-500">
                ID Transaksi: <span className="font-mono font-bold text-slate-900">{submittedDonation?.id}</span>
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 text-left leading-relaxed space-y-3 max-w-xl mx-auto">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Nama Donatur:</span>
                <span className="font-bold text-slate-900">{submittedDonation?.donorName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Program Tujuan:</span>
                <span className="font-bold text-slate-900 truncate max-w-xs">{submittedDonation?.campaignTitle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Nominal Disalurkan:</span>
                <span className="font-black text-emerald-700 font-mono text-sm">Rp {submittedDonation?.amount?.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Metode Pembayaran:</span>
                <span className="font-semibold text-slate-900">{submittedDonation?.paymentMethod}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onOpenReceiptModal && onOpenReceiptModal(submittedDonation)}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-xs shadow-md flex items-center justify-center space-x-2 transition-all"
              >
                <span>Cetak / Unduh Draf Kuitansi Resmi</span>
              </button>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setAmount('100000');
                  setProofFile(null);
                  setProofPreview(null);
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold rounded-2xl text-xs transition-all"
              >
                Kirim Donasi Lainnya
              </button>
            </div>
          </div>
        ) : (
          
          /* MAIN DONATION FORM */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 space-y-8">
            
            {/* STEP 1: PILIH PROGRAM TUJUAN (RADIO BUTTON CARDS) */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
                <span>Pilih Program Kebutuhan Panti *</span>
              </div>

              {/* Radio Button Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {allProgramOptions.map((c) => {
                  const isSelected = selectedCampaignId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCampaignId(c.id)}
                      className={`p-4 rounded-2xl text-left border transition-all flex items-start space-x-3.5 ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black text-slate-900 leading-snug">{c.title}</div>
                        <div className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center justify-between">
                          <span>Kategori: <b className="text-emerald-700 font-bold">{c.category || 'Umum'}</b></span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: NOMINAL DONASI & DAMPAK NYATA */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">2</span>
                <span>Pilih Nominal Donasi Berdampak *</span>
              </div>

              {/* Preset Impact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {presetImpactAmounts.map((preset) => {
                  const isSelected = Number(amount) === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setAmount(preset.value.toString())}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md transform -translate-y-0.5'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="font-mono text-sm font-black">{preset.label}</div>
                      <div className={`text-[11px] font-medium mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {preset.impact}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Input */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Nominal Custom (Minimal Rp 10.000):</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 font-mono font-black text-slate-400">Rp</span>
                  <input
                    type="number"
                    required
                    min="10000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Contoh: 150000"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-lg font-black text-emerald-700 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* STEP 3: IDENTITAS DONATUR */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">3</span>
                  <span>Data Donatur & Doa</span>
                </div>

                <label className="inline-flex items-center space-x-2 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-slate-700">Donasi Sebagai Anonim (Hamba Allah)</span>
                </label>
              </div>

              {!isAnonymous && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Donatur *</label>
                  <input
                    type="text"
                    required={!isAnonymous}
                    placeholder="Nama lengkap Anda..."
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-semibold"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email (Untuk Pengiriman Nota Resmi)</label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    placeholder="0812XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pesan / Doa & Harapan Kebaikan</label>
                <textarea
                  rows="2"
                  placeholder="Tuliskan doa atau harapan untuk anak-anak panti asuhan..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                ></textarea>
              </div>
            </div>

            {/* STEP 4: METODE PEMBAYARAN & UNGGAH BUKTI TRANSFER */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">4</span>
                <span>Metode Pembayaran & Unggah Bukti *</span>
              </div>

              {/* Payment Tab Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPaymentTab('transfer')}
                  className={`py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all ${
                    paymentTab === 'transfer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Transfer Bank Resmi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentTab('qris')}
                  className={`py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all ${
                    paymentTab === 'qris' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>Scan QRIS Instan</span>
                </button>
              </div>

              {/* TAB 1: TRANSFER BANK */}
              {paymentTab === 'transfer' && (
                <div className="space-y-3 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center space-x-2">
                    {Object.keys(bankAccounts).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedBank(key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border uppercase ${
                          selectedBank === key
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500 font-semibold">{bankAccounts[selectedBank].name}</div>
                      <div className="font-mono text-lg font-black text-slate-900 mt-0.5">
                        {bankAccounts[selectedBank].number}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-bold">
                        a.n. {bankAccounts[selectedBank].holder}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyBankNumber(bankAccounts[selectedBank].number)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                        copiedBank
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {copiedBank ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedBank ? 'Tersalin' : 'Salin Rekening'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: QRIS INSTAN */}
              {paymentTab === 'qris' && (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                  <div className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020101021126580014ID.GO.QRIS.WWW011893600911002233445502150000000000000005204581253033605802ID5914YPI%20KASIH%20BUNDA6013JAKARTA%20SELATAN6304A1B2"
                      alt="QRIS Panti Kasih Bunda"
                      className="w-44 h-44 mx-auto rounded-lg"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">QRIS STANDAR NASIONAL • YPI KASIH BUNDA</div>
                    <div className="text-[11px] text-slate-500">Mendukung BCA Mobile, Livin, GoPay, OVO, Dana, BSI Mobile, ShopeePay</div>
                  </div>
                </div>
              )}

              {/* File Upload Box */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Unggah Foto Bukti Transfer *</label>
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50/50 transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProofChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {proofPreview ? (
                    <div className="space-y-2">
                      <img src={proofPreview} alt="Preview Bukti" className="max-h-40 mx-auto rounded-xl shadow-md border" />
                      <p className="text-xs font-black text-emerald-700">Foto Bukti Transfer Siap Dikirim</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProofFile(null);
                          setProofPreview(null);
                        }}
                        className="text-[11px] text-rose-600 underline font-semibold"
                      >
                        Ganti Foto
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-slate-400" />
                      <p className="text-xs font-bold text-slate-700">Klik atau seret foto bukti transfer di sini</p>
                      <p className="text-[11px] text-slate-400">Format: JPG, PNG, WEBP (Maks 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECURITY & TRUST BADGE */}
            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center space-x-2 text-xs text-emerald-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Transaksi Anda aman, terlindungi, dan akan diverifikasi langsung oleh Pengurus Harian Panti.</span>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/30 text-sm flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Donasi & Tunggu Verifikasi</span>
            </button>
          </form>
        )}

      </div>
    </MainLayout>
  );
}
