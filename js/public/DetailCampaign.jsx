// Campaign Detail Component (Detail Program Kebutuhan Anak Panti)
const DetailCampaign = ({
  campaignId,
  campaigns = [],
  onNavigateToDonation,
  onNavigateBack,
}) => {
  const [activeTab, setActiveTab] = React.useState('description'); // description | updates | prayers
  const [isCopied, setIsCopied] = React.useState(false);
  const [isLinkCopied, setIsLinkCopied] = React.useState(false);

  const availableCampaigns = (campaigns && campaigns.length > 0)
    ? campaigns
    : (window.INITIAL_SIMK_DATA?.campaigns || []);

  const campaign = availableCampaigns.find(c => String(c.id) === String(campaignId)) || availableCampaigns[0] || {
    id: 'CMP-001',
    title: 'Pemenuhan Konsumsi & Gizi Harian Anak Panti',
    category: 'Konsumsi',
    targetAmount: 20000000,
    collectedAmount: 14200000,
    deadline: '2026-10-31',
    status: 'Aktif',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60',
    description: 'Program ini ditujukan untuk menjamin ketersediaan makanan bergizi seimbang (beras premium, sayur-mayur, telur, ayam/ikan, susu segar, dan buah) bagi 45 anak asuh di Panti Asuhan Kasih Bunda.\n\nGizi yang tercukupi adalah hak dasar setiap anak untuk tumbuh kembang yang optimal dan mendukung konsentrasi belajar mereka di sekolah.\n\nRincian Alokasi Dana:\n• Belanja beras 500kg & sembako pokok: Rp 8.000.000\n• Lauk pauk bergizi & protein hewani harian: Rp 7.500.000\n• Susu & suplemen vitamin harian: Rp 4.500.000',
    bankAccount: '7123-4567-89',
    bankName: 'Bank Syariah Indonesia (BSI)',
    accountHolder: 'Yayasan Kasih Bunda Indonesia',
    donorCount: 74,
    updates: [
      {
        id: 'UPD-101',
        date: '2026-08-15',
        title: 'Penyaluran Tahap I: Pengadaan Sembako Bulan Agustus',
        content: 'Alhamdulillah, dana terhimpun sebesar Rp 10.000.000 telah disalurkan untuk belanja 500kg beras, minyak goreng, telur, dan lauk-pauk segar. Terima kasih para donatur dermawan.'
      }
    ]
  };

  const percentage = campaign.targetAmount > 0
    ? Math.min(100, Math.round(((campaign.collectedAmount || 0) / campaign.targetAmount) * 100))
    : 0;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(campaign.bankAccount || '7123-4567-89');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `Mari bersama bantu program: ${campaign.title} di Panti Asuhan Kasih Bunda. Salurkan donasi Anda secara transparan. Info lengkap: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2500);
  };

  const samplePrayers = [
    { name: 'Bpk. Ahmad Fauzi', nominal: 'Rp 200.000', message: 'Semoga anak-anak panti selalu sehat, ceria, dan berkah studinya.', time: '3 jam lalu' },
    { name: 'Hamba Allah', nominal: 'Rp 500.000', message: 'Bismillah, semoga menjadi amal jariyah dan bermanfaat luas.', time: '8 jam lalu' },
    { name: 'Keluarga Ibu Sarah', nominal: 'Rp 350.000', message: 'Titip doa untuk kelancaran hajat keluarga kami. Terus semangat adik-adik.', time: '1 hari lalu' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Navigation & Share bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigateBack ? onNavigateBack() : (window.navigateToRoute && window.navigateToRoute('/donasi'))}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <window.ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Campaign</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5 transition-all"
          >
            <window.Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Bagikan</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5 transition-all"
          >
            {isLinkCopied ? (
              <window.Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <window.Copy className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{isLinkCopied ? 'Tersalin' : 'Salin Tautan'}</span>
          </button>
        </div>
      </div>

      {/* Main Campaign Hero Card */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-7 aspect-video lg:aspect-auto relative overflow-hidden bg-slate-900">
          <img
            src={campaign.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60'}
            alt={campaign.title}
            className="w-full h-full object-cover min-h-[300px]"
          />
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-white text-xs font-extrabold rounded-full">
              {campaign.category}
            </span>
            <span className={`px-3 py-1 text-xs font-extrabold rounded-full border ${
              campaign.status === 'Target Tercapai'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {campaign.status}
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {campaign.title}
            </h1>

            {/* Financial Progress */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-500 font-medium">Terkumpul</span>
                <span className="text-xl font-black text-emerald-600 font-mono">
                  Rp {(campaign.collectedAmount || 0).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
                <span>Target: Rp {(campaign.targetAmount || 0).toLocaleString('id-ID')}</span>
                <span className="font-bold text-slate-800">{percentage}%</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2.5">
                <window.Users className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">{campaign.donorCount || 40}+ Donatur</div>
                  <div className="text-[10px] text-slate-400 font-medium">Tergabung</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2.5">
                <window.Calendar className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">{campaign.deadline || '31 Okt 2026'}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Batas Waktu</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigateToDonation && onNavigateToDonation(campaign.id)}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-600/20 text-xs flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <window.Heart className="w-4 h-4 fill-white" />
              <span>Salurkan Donasi untuk Program Ini</span>
            </button>

            <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-100/80 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-500 font-semibold">Rekening Khusus Program:</div>
                <div className="font-mono font-bold text-emerald-800">
                  {campaign.bankAccount || '7123-4567-89 (BSI)'}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyAccount}
                className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg border border-emerald-200 transition-colors"
              >
                {isCopied ? 'Tersalin!' : 'Salin'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Detail: Deskripsi, Perkembangan, Doa Donatur */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('description')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'description'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Rincian Kebutuhan & Program
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('updates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'updates'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Kabar Perkembangan</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {campaign.updates?.length || 1}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prayers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'prayers'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Doa Donatur
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'description' && (
          <div className="prose prose-emerald max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-4">
            <p>{campaign.description}</p>
          </div>
        )}

        {/* Tab 2: Updates */}
        {activeTab === 'updates' && (
          <div className="space-y-4">
            {(campaign.updates && campaign.updates.length > 0) ? (
              campaign.updates.map((upd, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span className="font-mono text-emerald-700 font-bold">{upd.date}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">
                      Penyaluran Resmi
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">{upd.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{upd.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Belum ada update perkembangan untuk program ini.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Prayers */}
        {activeTab === 'prayers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {samplePrayers.map((pray, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{pray.name}</span>
                  <span className="text-[10px] text-slate-400">{pray.time}</span>
                </div>
                <div className="font-mono font-bold text-emerald-700">{pray.nominal}</div>
                <p className="text-slate-600 italic">"{pray.message}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

window.DetailCampaign = DetailCampaign;
