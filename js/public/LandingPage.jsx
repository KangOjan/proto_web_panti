// Modern Public Landing Page Component (Beranda Utama)
const LandingPage = ({
  organizationProfile = null,
  priorityPrograms = [],
  campaignLoading = false,
  campaignError = null,
  articles = [],
  faqs = [],
  onNavigateToDonation,
  onNavigateToProfile,
  onNavigateToCampaign,
  onNavigateToArticle,
  onNavigateToFaq,
}) => {
  const currentProfile = organizationProfile || {};
  const heroImageUrl = CmsApi.normalizeMediaUrl(currentProfile.heroImageUrl || currentProfile.hero_image_url);

  const profile = {
    name: currentProfile.name || 'Panti Asuhan LKSA Taman Harapan Muhammadiyah',
    tagline: String(currentProfile.tagline || 'Pengasuhan, Pembinaan, dan Pendidikan Anak')
      .replace(/Transaparansi/gi, 'Transparansi'),
    history: currentProfile.history || '',
    missions: Array.isArray(currentProfile.missions) ? currentProfile.missions : [],
    foundedYear: currentProfile.foundedYear || null,
    facilities: Array.isArray(currentProfile.facilities) ? currentProfile.facilities : [],
    contactInfo: currentProfile.contactInfo || {},
  };

  // Campaign publik berasal dari API. Tidak ada fallback ke mock campaign.
  // Filter deadline merupakan pengaman UI, validasi server tetap wajib.
  const activeCampaigns = (Array.isArray(priorityPrograms) ? priorityPrograms : [])
    .filter((campaign) => {
      if (campaign?.status !== 'active') return false;
      if (!campaign.deadline) return true;
      const deadline = new Date(campaign.deadline).getTime();
      return Number.isFinite(deadline) && deadline >= Date.now();
    });

  const [displayArticles, setDisplayArticles] = React.useState([]);
  const [displayFaqs, setDisplayFaqs] = React.useState([]);
  const [cmsLoadError, setCmsLoadError] = React.useState('');
  const [openFaqId, setOpenFaqId] = React.useState(null);
  React.useEffect(() => {
    let live = true;
    Promise.all([CmsApi.getPublicArticles(), CmsApi.getPublicFaqs()])
      .then(([articleResponse, faqResponse]) => {
        if (!live) return;
        setDisplayArticles(Array.isArray(articleResponse?.data) ? articleResponse.data.map(CmsApi.normalizeArticle) : []);
        setDisplayFaqs(Array.isArray(faqResponse?.data) ? faqResponse.data.map(CmsApi.normalizeFaq) : []);
      })
      .catch(error => {
        if (live) {
          setDisplayArticles([]); setDisplayFaqs([]);
          setCmsLoadError(error?.message || 'Konten CMS belum dapat dimuat.');
        }
      });
    return () => { live = false; };
  }, []);

  // Semua angka berikut berasal dari response profil atau campaign, bukan mock data.
  const dormitoryCount = profile.facilities.filter((facility) => /asrama/i.test(facility?.name || '')).length;
  const impactStats = [
    { label: 'Tahun Awal Pengabdian', value: profile.foundedYear ? String(profile.foundedYear) : '—', desc: 'Menemani tumbuh kembang generasi', icon: window.CalendarDays },
    { label: 'Asrama Pengasuhan', value: dormitoryCount ? String(dormitoryCount) : '—', desc: 'Lingkungan pengasuhan yang hangat', icon: window.Building2 },
    { label: 'Program Kebaikan', value: String(activeCampaigns.length), desc: 'Peluang berbagi untuk anak asuh', icon: window.Heart },
    { label: 'Fokus Pembinaan', value: profile.missions.length ? String(profile.missions.length) : '—', desc: 'Arah pengabdian dan pendidikan', icon: window.Sparkles },
  ];

  // Gambar konten berasal dari URL/path pada JSON API. Bukan dari assets/images.
  // Berkas fisiknya tetap disimpan sebagai file di Laravel public storage.
  const cmsImageUrl = (raw) => CmsApi.normalizeMediaUrl(raw) || '';

  const trustPillars = [
    { title: 'Pengasuhan Penuh Kepedulian', desc: 'Lingkungan yang mendorong anak tumbuh dengan perhatian, nilai, dan rasa kebersamaan.', icon: window.Heart, badge: 'Kepedulian' },
    { title: 'Pendidikan dan Keterampilan', desc: 'Menguatkan semangat belajar serta kemandirian untuk bekal masa depan anak.', icon: window.BookOpen, badge: 'Pembinaan' },
    { title: 'Kesehatan dan Kesejahteraan', desc: 'Mendukung kebutuhan keseharian serta lingkungan pengasuhan yang sehat.', icon: window.ShieldCheck, badge: 'Kesejahteraan' },
    { title: 'Donasi yang Bertanggung Jawab', desc: 'Donatur dapat memilih program dan mengikuti informasi donasi yang tersedia.', icon: window.Receipt, badge: 'Kepercayaan' },
  ];

  // Sebelumnya hardcoded: Hamba Allah Rp500.000, Hendra Rp1.000.000, Ratna Rp250.000.
  // Sekarang doa dibaca dari endpoint PUBLIK per campaign; API bertanggung jawab menyaring
  // hanya doa dengan persetujuan publikasi dan mengaburkan identitas donatur.
  const campaignSlugKey = activeCampaigns
    .map((c) => c.slug).filter(Boolean).slice(0, 6).join('|');
  const [recentDonorWishes, setRecentDonorWishes] = React.useState([]);
  const [wishesLoading, setWishesLoading] = React.useState(false);
  const [wishesError, setWishesError] = React.useState(false);
  React.useEffect(() => {
    const slugs = campaignSlugKey.split('|').filter(Boolean);
    let cancelled = false;
    setWishesLoading(true);
    setWishesError(false);
    const request = window.apiRequest;
    if (typeof request !== 'function') {
      setWishesLoading(false);
      setWishesError(true);
      return undefined;
    }
    Promise.allSettled([
      ...slugs.map((slug) => request(`/campaigns/${encodeURIComponent(slug)}/prayers`, { auth: false })),
      request('/donations/general/prayers', { auth: false }),
    ]).then((results) => {
      if (cancelled) return;
      const items = [];
      results.forEach((result, idx) => {
        if (result.status !== 'fulfilled') return;
        const payload = result.value;
        const data = payload?.data;
        const prayers = Array.isArray(data) ? data
          : Array.isArray(data?.items) ? data.items
          : Array.isArray(data?.prayers) ? data.prayers
          : Array.isArray(payload?.prayers) ? payload.prayers : [];
        prayers.forEach((item, j) => {
          const message = String(item?.public_message || item?.donor_message ||
            item?.message || item?.prayer || '').trim();
          if (!message) return;
          const name = String(item?.display_name || item?.donor_name ||
            item?.donorName || 'Hamba Allah').trim();
          const sourceCampaign = activeCampaigns.find((c) => c.slug === slugs[idx]);
          const rawDate = item?.date || item?.published_at || item?.created_at || item?.verified_at;
          items.push({
            id: `${idx === slugs.length ? 'general' : slugs[idx]}:${String(item?.public_id || item?.id || j)}`,
            name: name || 'Hamba Allah',
            message,
            program: sourceCampaign?.title || 'Donasi Umum',
            timestamp: rawDate && Number.isFinite(Date.parse(rawDate)) ? Date.parse(rawDate) : 0,
            isDemo: /\[DEMO\]/i.test(message) || /\[DEMO\]/i.test(name),
          });
        });
      });
      items.sort((a, b) => b.timestamp - a.timestamp);
      const unique = Array.from(new Map(items.map((item) => [item.id, item])).values());
      setRecentDonorWishes(unique.slice(0, 3));
      setWishesError(results.every((result) => result.status === 'rejected'));
      setWishesLoading(false);
    });
    return () => { cancelled = true; };
  }, [campaignSlugKey]);

  return (
    <div className="animate-fade-in pb-0">
      {/* 1. FULL-WIDTH HERO SECTION */}
      <section className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden pt-12 pb-28 sm:pt-16 sm:pb-36 lg:pt-20 lg:pb-40 border-b border-slate-800">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/15 px-4 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold shadow-inner tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <window.Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>LKSA Taman Harapan Muhammadiyah · Bandung</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.1]">
                Menebar Kasih, Membina Generasi{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                  Mandiri & Berakhlak Mulia
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {profile.name} berkomitmen memberikan pengasuhan, pembinaan, pendidikan,
                dan pendampingan bagi anak-anak melalui program sosial dan kegiatan pemberdayaan.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                <window.Link
                  href="/donasi"
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigateToDonation?.();
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 text-sm flex items-center justify-center space-x-2.5 transition-all transform hover:-translate-y-0.5"
                >
                  <window.Heart className="w-4.5 h-4.5 fill-slate-950" />
                  <span>Donasi Sekarang (Bebas Login)</span>
                </window.Link>

                <window.Link
                  href="/profil"
                  onClick={() => onNavigateToProfile && onNavigateToProfile()}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 backdrop-blur-md border border-white/15 transition-all"
                >
                  <window.Building2 className="w-4 h-4 text-emerald-300" />
                  <span>Profil, Legalitas & Lokasi</span>
                </window.Link>
              </div>

              <div className="pt-5 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs text-slate-400 font-medium border-t border-slate-800/60">
                {['Pengasuhan yang hangat', 'Pendidikan yang mendampingi', 'Kesempatan berbagi kebaikan'].map((item) => (
                  <div key={item} className="flex items-center space-x-1.5">
                    <window.CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 group">
                {heroImageUrl ? (
                  <img src={heroImageUrl} alt="Ilustrasi anak-anak belajar bersama" className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-500 ease-out motion-reduce:transform-none motion-reduce:transition-none" loading="eager" fetchPriority="high" />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center p-8 text-center text-sm text-slate-200">Gambar kegiatan pembinaan belum tersedia</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-xl rounded-xl p-3 shadow-2xl border border-white/15 flex items-center space-x-3 text-white">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 flex-shrink-0">
                    <window.Newspaper className="w-4 h-4" />
                  </div>
                  <div className="text-xs min-w-0">
                    <div className="font-bold text-white truncate">Belajar, Berkembang, Berdaya</div>
                    <div className="text-[11px] text-emerald-300/80 font-medium truncate">Ilustrasi visual, bukan foto anak asuh LKSA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IMPACT STATS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20 mb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {impactStats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-200/60 border border-slate-100 hover:-translate-y-1 transition-all duration-300 space-y-2.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {stat.value}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-700">{stat.label}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{stat.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. 4 PILLARS OF TRUST */}
      <section className="bg-slate-50/70 border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-3.5 py-1 rounded-full text-xs font-bold">
              <window.ShieldCheck className="w-3.5 h-3.5" />
              <span>Transparansi & Akuntabilitas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Mengapa Berdonasi di Panti Asuhan Taman Harapan Muhammadiyah?
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Setiap dukungan berarti bagi pendidikan, pengasuhan, kesehatan, dan kesempatan tumbuh anak-anak. Pilih program yang paling dekat dengan kepedulian Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trustPillars.map((pillar, idx) => {
              const PillarIcon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:border-emerald-200 hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <PillarIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-600">
                    <window.CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{pillar.badge}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. CAMPAIGN DONASI PRIORITAS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
                <window.Layers className="w-3.5 h-3.5" />
                <span>Program Donasi Pilihan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Campaign Kebutuhan Anak Panti
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-lg">
                Pilih program kebutuhan mendesak yang ingin Anda dukung secara langsung.
              </p>
            </div>

            <window.Link
              href="/donasi"
              onClick={(event) => {
                event.preventDefault();
                onNavigateToDonation?.();
              }}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors shrink-0"
            >
              <span>Salurkan Donasi Umum</span>
              <window.ArrowRight className="w-3.5 h-3.5" />
            </window.Link>
          </div>

          {campaignLoading && (
            <p role="status" className="rounded-xl bg-white p-5 text-sm text-slate-600 border border-slate-200">
              Memuat program donasi...
            </p>
          )}
          {campaignError && !campaignLoading && (
            <p role="alert" className="rounded-xl bg-rose-50 p-5 text-sm text-rose-800 border border-rose-200">
              Program belum dapat dimuat: {campaignError}
            </p>
          )}
          {!campaignLoading && !campaignError && activeCampaigns.length === 0 && (
            <p className="rounded-xl bg-white p-5 text-sm text-slate-600 border border-slate-200">
              Program donasi belum tersedia saat ini. Donasi umum tetap dapat dipilih.
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!campaignLoading && !campaignError && activeCampaigns.map((camp) => {
              const hasCollectedAmount = Number.isFinite(camp.collectedAmount);
              const percent = hasCollectedAmount && camp.targetAmount > 0
                ? Math.min(100, Math.round((camp.collectedAmount / camp.targetAmount) * 100))
                : null;

              return (
                <div
                  key={camp.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col group"
                >
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    {cmsImageUrl(camp.headerImageUrl) ? (
                      <img
                        src={cmsImageUrl(camp.headerImageUrl)}
                        alt={camp.title}
                        className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500 ease-out motion-reduce:transform-none motion-reduce:transition-none"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-slate-100 text-xs font-medium text-slate-500">
                        Gambar program belum tersedia
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                      <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                        {camp.category}
                      </span>
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                        camp.status === 'Target Tercapai'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {camp.status === 'active' ? 'Aktif' : camp.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {camp.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {camp.description}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {hasCollectedAmount ? (
                        <>
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-emerald-600 font-mono text-[13px]">
                              Rp {camp.collectedAmount.toLocaleString('id-ID')}
                            </span>
                            <span className="text-slate-400 font-mono">{percent}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-slate-500">Informasi dana terkumpul belum tersedia.</p>
                      )}
                      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 font-medium">
                        <span>Target: Rp {(camp.targetAmount || 0).toLocaleString('id-ID')}</span>
                        {Number.isFinite(camp.donorCount) && (
                          <span>{camp.donorCount.toLocaleString('id-ID')} Donatur</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-4 flex items-center justify-between border-t border-slate-100">
                    <window.Link
                      href={`/campaign/${camp.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        onNavigateToCampaign?.(camp.id);
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors flex items-center space-x-1"
                    >
                      <span>Detail Program</span>
                      <window.ChevronRight className="w-3.5 h-3.5" />
                    </window.Link>

                    <window.Link
                      href={`/donasi?campaign=${camp.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        onNavigateToDonation?.({
                          campaignId: camp.id,
                          campaignTitle: camp.title,
                          campaignSlug: camp.slug,
                          campaignCategory: camp.category,
                        });
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-sm flex items-center space-x-1.5 transition-all"
                    >
                      <window.Heart className="w-3.5 h-3.5 fill-white" />
                      <span>Donasi Sekarang</span>
                    </window.Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SOCIAL PROOF: DOA DONATUR */}
      <section className="bg-slate-50/70 border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
                <window.MessageCircle className="w-3.5 h-3.5" />
                <span>Doa & Solidaritas Kebaikan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Doa Donatur & Orang Baik</h2>
            </div>
            <span className="text-xs font-medium text-slate-400 hidden sm:inline">
              Doa dan harapan dari para donatur
            </span>
          </div>

          {wishesLoading && <p role="status" className="text-xs text-slate-500">Memuat doa donatur...</p>}
          {wishesError && <p role="alert" className="text-xs text-amber-800">Doa donatur belum dapat dimuat saat ini.</p>}
          {!wishesLoading && !wishesError && recentDonorWishes.length === 0 && (
            <p className="text-xs text-slate-500">Belum ada doa donatur yang dipublikasikan.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentDonorWishes.map((wish) => (
              <div key={wish.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {wish.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{wish.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{wish.timestamp ? new Date(wish.timestamp).toLocaleDateString('id-ID') : 'Doa terpublikasi'}</div>
                  </div>
                  {wish.isDemo && <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded">DEMO</span>}
                </div>
                <div className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  {wish.program}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  “{wish.message}”
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEWS & ARTICLES PREVIEW */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
                <window.Newspaper className="w-3.5 h-3.5" />
                <span>Kabar & Transparansi Kegiatan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Artikel & Berita Panti</h2>
                {cmsLoadError && <p role="alert" className="text-[11px] text-rose-700 mt-1">{cmsLoadError}</p>}
            </div>

            <window.Link
              href="/berita"
              onClick={() => onNavigateToArticle && onNavigateToArticle(null)}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 transition-colors shrink-0"
            >
              <span>Lihat Semua</span>
              <window.ArrowRight className="w-3.5 h-3.5" />
            </window.Link>
          </div>

          {displayArticles.length === 0 && <p className="text-sm text-slate-500">Belum ada artikel resmi yang dipublikasikan.</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayArticles.slice(0, 2).map((art) => (
              <window.Link
                key={art.id}
                href={`/berita/${art.slug || art.id}`}
                onClick={() => onNavigateToArticle && onNavigateToArticle(art.slug || art.id)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col sm:flex-row group"
              >
                <div className="sm:w-44 h-40 sm:h-auto relative overflow-hidden bg-slate-100 flex-shrink-0">
                  {cmsImageUrl(art.image) ? <img src={cmsImageUrl(art.image)} alt={art.title} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500 ease-out motion-reduce:transform-none motion-reduce:transition-none" /> : <div className="h-full flex items-center justify-center text-xs text-slate-400">Belum ada foto</div>}
                  {art.category && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                      {art.category}
                    </span>
                  )}
                </div>
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-center">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium">
                    <window.CalendarDays className="w-3 h-3" />
                    <span>{art.date}</span>
                    <span>•</span>
                    <span>{art.author}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                  <span className="text-xs font-semibold text-emerald-600 inline-flex items-center space-x-1 pt-1">
                    <span>Baca Selengkapnya</span>
                    <window.ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </window.Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ QUICK PREVIEW */}
      <section className="bg-slate-50/70 border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 bg-slate-200 text-slate-700 px-3.5 py-1 rounded-full text-xs font-bold">
              <window.HelpCircle className="w-3.5 h-3.5" />
              <span>Pusat Bantuan & Tanya Jawab</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>

            <p className="text-sm text-slate-500 leading-relaxed">
              Jawaban ringkas seputar penyaluran donasi, verifikasi kuitansi, transparansi, dan tata cara kunjungan panti asuhan.
            </p>
          </div>

          {displayFaqs.length === 0 && <p className="text-center text-sm text-slate-500">Belum ada FAQ resmi yang dipublikasikan.</p>}
          <div className="max-w-4xl mx-auto space-y-3.5">
            {displayFaqs.slice(0, 4).map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                    isOpen
                      ? 'bg-white border-emerald-300 shadow-md ring-1 ring-emerald-500/20'
                      : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-emerald-700 transition-colors"
                  >
                    <span className="leading-snug">{faq.question}</span>
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isOpen
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isOpen ? <window.Minus className="w-4 h-4" /> : <window.Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/40 animate-fade-in">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <window.Link
              href="/faq"
              onClick={() => onNavigateToFaq && onNavigateToFaq()}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:border-emerald-300 shadow-xs transition-all"
            >
              <span>Lihat Seluruh Tanya Jawab (FAQ Lengkap)</span>
              <window.ArrowRight className="w-3.5 h-3.5" />
            </window.Link>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 p-8 sm:p-12 lg:p-16 text-white shadow-xl text-center space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/8 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight relative z-10">
              Bersama Nyalakan Harapan Masa Depan Anak Yatim Dhuafa
            </h2>
            <p className="text-sm text-emerald-200/80 max-w-xl mx-auto leading-relaxed relative z-10">
              Dukung pengasuhan dan pendidikan anak melalui program-program kebaikan yang tersedia.
            </p>
            <div className="pt-2 relative z-10">
              <window.Link
                href="/donasi"
                onClick={(event) => {
                    event.preventDefault();
                    onNavigateToDonation?.();
                  }}
                className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 text-sm transition-all transform hover:-translate-y-0.5"
              >
                <window.Heart className="w-4.5 h-4.5 fill-slate-950" />
                <span>Salurkan Kebaikan Sekarang</span>
              </window.Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

window.LandingPage = LandingPage;
