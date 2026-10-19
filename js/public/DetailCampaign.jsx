// Campaign Detail Component (Detail Program Kebutuhan Anak Panti)
const DetailCampaign = ({
  campaignId,
  campaigns = [],
  onNavigateToDonation,
  onNavigateBack,
}) => {
  const [activeTab, setActiveTab] = React.useState('description'); // description | updates | prayers
  const [isLinkCopied, setIsLinkCopied] = React.useState(false);
  const [campaignUpdates, setCampaignUpdates] = React.useState([]);
  const [publishedPrayers, setPublishedPrayers] = React.useState([]);
  const [contentLoading, setContentLoading] = React.useState(true);
  const [contentError, setContentError] = React.useState(null);


  // Hanya gunakan campaign yang dikirim dari API, bukan data contoh global.
  const availableCampaigns = Array.isArray(campaigns) ? campaigns : [];
  const campaign = availableCampaigns.find(
    c => String(c.id) === String(campaignId)
  ) || null;

  // Jangan menampilkan progres 0 seolah-olah sudah diverifikasi.
  // Backend harus mengirim verifiedCollectedAmount dari donasi verified.
  const collectedAmount = campaign?.verifiedCollectedAmount != null &&
    Number.isFinite(Number(campaign.verifiedCollectedAmount))
    ? Number(campaign.verifiedCollectedAmount)
    : null;
  const targetAmount = Number(campaign?.targetAmount || 0);
  const percentage = collectedAmount != null && targetAmount > 0
    ? Math.min(100, Math.round(collectedAmount / targetAmount * 100))
    : null;

  React.useEffect(() => {
    let current = true;
    const slug = campaign?.slug;
    setCampaignUpdates([]);
    setPublishedPrayers([]);
    setContentError(null);
    if (!slug) {
      setContentLoading(false);
      return () => { current = false; };
    }
    setContentLoading(true);
    Promise.allSettled([
      CampaignApi.getPublicUpdates(slug),
      CampaignApi.getPublicPrayers(slug),
    ]).then(([updatesResponse, prayersResponse]) => {
      if (!current) return;
      if (updatesResponse.status === 'fulfilled' && Array.isArray(updatesResponse.value?.data)) {
        setCampaignUpdates(updatesResponse.value.data);
      }
      if (prayersResponse.status === 'fulfilled' && Array.isArray(prayersResponse.value?.data)) {
        setPublishedPrayers(prayersResponse.value.data);
      }
      if (updatesResponse.status !== 'fulfilled' || prayersResponse.status !== 'fulfilled') {
        setContentError('Sebagian informasi belum dapat dimuat dari server.');
      }
      setContentLoading(false);
    });
    return () => { current = false; };
  }, [campaign?.slug]);

  const formatContentDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '-' : new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta'
    }).format(date);
  };

  const formatDeadline = (value) => {
    if (!value) return 'Belum ditentukan';
    // Laravel dapat mengirim tanggal saja atau ISO UTC (termasuk mikrodetik).
    const text = String(value).trim();
    const date = /^\d{4}-\d{2}-\d{2}$/.test(text)
      ? new Date(`${text}T00:00:00+07:00`)
      : new Date(text);
    if (Number.isNaN(date.getTime())) return 'Belum ditentukan';
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta'
    }).format(date);
  };

  const handleShareWhatsApp = () => {
    const text = `Mari bersama bantu program: ${campaign.title} di Panti Asuhan LKSA Taman Harapan Muhammadiyah. Salurkan donasi Anda secara transparan. Info lengkap: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2500);
  };

  if (!campaign) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-sm text-slate-600">
        Program belum tersedia. Silakan kembali ke daftar campaign.
        <button type="button" onClick={() => onNavigateBack?.()}
          className="ml-3 font-bold text-emerald-700 hover:underline">
          Kembali
        </button>
      </div>
    );
  }

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
          {(campaign.headerImageUrl || campaign.image) ? (
            <img src={campaign.headerImageUrl || campaign.image}
              alt={campaign.title} className="w-full h-full object-cover min-h-[300px]" />
          ) : (
            <div className="min-h-[300px] h-full flex items-center justify-center text-sm text-white/80">
              Foto program belum tersedia
            </div>
          )}
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
                  {collectedAmount == null ? 'Belum tersedia' : `Rp ${collectedAmount.toLocaleString('id-ID')}`}
                </span>
              </div>

              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                  style={{ width: `${percentage ?? 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
                <span>Target: Rp {(campaign.targetAmount || 0).toLocaleString('id-ID')}</span>
                <span className="font-bold text-slate-800">{percentage == null ? "-" : `${percentage}%`}</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2.5">
                <window.Users className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">{campaign.verifiedDonationCount == null ? 'Belum tersedia' : `${Number(campaign.verifiedDonationCount).toLocaleString('id-ID')} Donasi`}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Terverifikasi</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2.5">
                <window.Calendar className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">{formatDeadline(campaign.deadline)}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Batas Waktu</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigateToDonation?.({
                campaignId: campaign.id,
                campaignTitle: campaign.title,
                campaignSlug: campaign.slug,
                campaignCategory: campaign.category,
              })}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-600/20 text-xs flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <window.Heart className="w-4 h-4 fill-white" />
              <span>Salurkan Donasi untuk Program Ini</span>
            </button>

            {/* Rekening contoh tidak ditampilkan. Pembayaran via alur Midtrans. */}
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
              {campaignUpdates.length}
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
            {contentLoading && <p className="text-xs text-slate-500">Memuat perkembangan...</p>}
            {contentError && <p role="alert" className="text-xs text-rose-600">{contentError}</p>}
            {(campaignUpdates.length > 0) ? (
              campaignUpdates.map((upd) => (
                <div key={upd.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span className="font-mono text-emerald-700 font-bold">{formatContentDate(upd.published_at)}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">
                      Kabar Program
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">{upd.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{upd.content}</p>
                  {upd.image_url && <img src={upd.image_url} alt={upd.title} className="mt-2 max-h-72 w-full rounded-lg object-cover" />}
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
            {contentLoading && <p className="col-span-full text-center text-xs text-slate-500">Memuat doa donatur...</p>}
            {contentError && <p role="alert" className="col-span-full text-center text-xs text-rose-600">{contentError}</p>}
            {publishedPrayers.map((prayer) => (
              <article key={prayer.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-xs text-slate-900">{prayer.display_name}</strong>
                  <span className="text-[11px] text-slate-400">{formatContentDate(prayer.date)}</span>
                </div>
                <p className="text-xs italic text-slate-600 whitespace-pre-line">{prayer.message}</p>
              </article>
            ))}
            {publishedPrayers.length === 0 ? (
              <p className="col-span-full text-center py-10 text-xs text-slate-500">
                Belum ada doa yang disetujui untuk ditampilkan.
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

window.DetailCampaign = DetailCampaign;
