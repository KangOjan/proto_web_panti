// Peta Leaflet menampilkan perkiraan area Nilem dan tautan Google Maps resmi dari pengguna.
// Titik GPS pin yang pasti perlu diverifikasi LKSA sebelum dipakai sebagai koordinat permanen.
const SIMK_loadLeaflet = () => {
  if (window.L) return Promise.resolve(window.L);
  if (window.__simkLeafletPromise) return window.__simkLeafletPromise;

  window.__simkLeafletPromise = new Promise((resolve, reject) => {
    if (!document.getElementById('simk-leaflet-css')) {
      const css = document.createElement('link');
      css.id = 'simk-leaflet-css';
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);
    }
    const js = document.createElement('script');
    js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    js.async = true;
    js.onload = () => window.L ? resolve(window.L) : reject(new Error('Leaflet tidak tersedia'));
    js.onerror = () => reject(new Error('Gagal mengunduh Leaflet'));
    document.head.appendChild(js);
  }).catch((err) => {
    window.__simkLeafletPromise = null;
    throw err;
  });

  return window.__simkLeafletPromise;
};

const SIMKPantiMap = ({ mapsUrl }) => {
  const ref = React.useRef(null);
  const [status, setStatus] = React.useState('');
  // Pusat tampilan Google Maps pada screenshot yang diberikan pengguna.
  // Ini BUKAN koordinat GPS pin resmi; hingga divalidasi LKSA, tandai sebagai perkiraan.
  const approximateNilemCenter = [-6.9358338, 107.6176701];

  React.useEffect(() => {
    if (!ref.current) return undefined;
    let stopped = false;
    let map = null;
    let resizeId = null;

    const init = async () => {
      try {
        setStatus('Menyiapkan peta lokasi...');
        const L = await SIMK_loadLeaflet();
        if (stopped || !ref.current) return;
        map = L.map(ref.current, { scrollWheelZoom: false }).setView(approximateNilemCenter, 17);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);
        // Marker ini perkiraan area Jl. Nilem, bukan klaim koordinat presisi panti.
        L.marker(approximateNilemCenter, { title: 'Perkiraan area Jl. Nilem No. 9' })
          .addTo(map)
          .bindPopup('Perkiraan area Jl. Nilem No. 9, bukan titik GPS terverifikasi. Buka Google Maps untuk petunjuk arah yang akurat.');
        resizeId = window.setTimeout(() => { if (!stopped && map) map.invalidateSize(); }, 0);
        setStatus('Pin menunjukkan perkiraan area Jl. Nilem No. 9 (asrama putri), bukan titik GPS yang telah diverifikasi. Gunakan Google Maps untuk navigasi.');
      } catch (error) {
        if (!stopped) setStatus('Peta Leaflet belum dapat ditampilkan. Gunakan tautan Google Maps di bawah.');
      }
    };
    init();
    return () => {
      stopped = true;
      if (resizeId != null) window.clearTimeout(resizeId);
      if (map) map.remove();
    };
  }, []);

  return (
    <div className="space-y-3">
      <div ref={ref} className="w-full h-[300px] rounded-2xl border border-slate-200 overflow-hidden z-0" role="region" aria-label="Peta perkiraan area Jalan Nilem No. 9, LKSA Taman Harapan Muhammadiyah" />
      {status && <p role="status" className="text-[11px] leading-relaxed text-slate-500">{status}</p>}
      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
        <a
          href={mapsUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-white transition hover:bg-emerald-800"
        >
          <window.MapPin className="h-4 w-4" /> Buka Titik LKSA di Google Maps
        </a>
      </div>
    </div>
  );
};


// Profil lembaga publik: hanya menampilkan data yang tercatat pada API Laravel.
// Pengunjung tidak dapat mengubah data melalui komponen ini.
const OrganizationProfile = ({
  organizationProfile = null,
  organizationProfileLoading = false,
  organizationProfileError = null,
  onNavigateToDonation,
}) => {
  const currentProfile = organizationProfile || {};
  const isLocalPreview = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  // The backend returns URL/path metadata; images remain files on the public disk.
  // Never use static frontend pictures as substitutes for missing CMS uploads.
  const publicImageUrl = (raw) => {
    const value = String(raw || '').trim();
    if (/^https?:\/\//i.test(value)) return value;
    if (/^\/storage\/[a-z0-9/_\-.%]+$/i.test(value)) return value;
    if (/^storage\/[a-z0-9/_\-.%]+$/i.test(value)) return `/${value}`;
    if (/^organization-profiles\/members\/[a-z0-9/_\-.%]+$/i.test(value)) return `/storage/${value}`;
    return '';
  };

  // Jangan menjadikan penanda simulasi sebagai informasi resmi lembaga.
  const isDemo = (value) => /\[\s*DEMO\s*\]|\(\s*DEMO\s*\)|^\s*contoh\b/i.test(String(value || ''));
  const officialText = (value) => {
    const text = String(value ?? '').trim();
    return text && !isDemo(text) ? text : '';
  };

  const profile = {
    name: officialText(currentProfile.name),
    tagline: officialText(currentProfile.tagline),
    foundedYear: currentProfile.foundedYear || null,
    founder: officialText(currentProfile.founder),
    history: officialText(currentProfile.history),
    vision: officialText(currentProfile.vision),
    missions: Array.isArray(currentProfile.missions)
      ? currentProfile.missions.map(officialText).filter(Boolean)
      : [],
    legalities: Array.isArray(currentProfile.legalities)
      ? currentProfile.legalities.filter((item) =>
          item?.verified === true && officialText(item?.type) && officialText(item?.number))
      : [],
    achievements: Array.isArray(currentProfile.achievements)
      ? currentProfile.achievements.filter((item) => {
          const title = String(item?.title || '').trim();
          return title && (isLocalPreview || (!isDemo(title) && !isDemo(item?.by)));
        })
      : [],
    facilities: Array.isArray(currentProfile.facilities)
      ? currentProfile.facilities.filter((item) =>
          officialText(item?.name) && !isDemo(item?.desc || item?.description))
      : [],
    contactInfo: currentProfile.contactInfo || {},
  };

  // Keep the level from CMS and sort numerically. Demo names stay local-only.
  const organizationStructure = Array.isArray(currentProfile.organizationStructure)
    ? currentProfile.organizationStructure
        .map((group) => ({
          level: Number.isFinite(Number(group?.level)) ? Number(group.level) : 99,
          role: String(group?.role || '').trim(),
          members: Array.isArray(group?.members)
            ? group.members.filter((member) => {
                const name = String(member?.name || '').trim();
                return name && !/nama pengurus belum diisi/i.test(name) &&
                  (isLocalPreview || (!isDemo(name) && !isDemo(member?.position)));
              })
            : [],
        }))
        .filter((group) => group.role && group.members.length > 0 &&
          (isLocalPreview || !isDemo(group.role)))
        .sort((a, b) => a.level - b.level)
    : [];

  const achievementsByYear = Object.entries(profile.achievements.reduce((groups, item) => {
    const year = String(item?.year || 'Tahun tidak dicantumkan').trim();
    (groups[year] ||= []).push(item);
    return groups;
  }, {})).sort((a, b) => (Number(b[0]) || 0) - (Number(a[0]) || 0));

  const contactInfo = profile.contactInfo;
  const visitingHours = officialText(contactInfo.visitingHours || contactInfo.visiting_hours);
  // Use a CMS-maintained Google Maps link when it points to an approved Maps host.
  // A verified user-supplied LKSA link remains the fallback until CMS is updated.
  const mapsUrl = (() => {
    const configured = String(contactInfo.gmapsUrl || contactInfo.gmaps_url || '').trim();
    try {
      const url = new URL(configured);
      if (url.protocol === 'https:' &&
          ['maps.app.goo.gl', 'www.google.com', 'google.com', 'maps.google.com'].includes(url.hostname)) {
        return url.href;
      }
    } catch (_) {
      // Ignore an empty or invalid CMS link.
    }
    return 'https://maps.app.goo.gl/pVQXbmLrQdncHoxV9';
  })();
  const whatsappInput = String(contactInfo.whatsapp || '').replace(/\D/g, '');
  const whatsappNumber = whatsappInput.startsWith('0')
    ? `62${whatsappInput.slice(1)}` : whatsappInput;
  const hasWhatsApp = /^62\d{8,13}$/.test(whatsappNumber);
  const handleOpenWhatsApp = () => {
    if (!hasWhatsApp) return;
    window.open(`https://wa.me/${whatsappNumber}`, '_blank', 'noopener,noreferrer');
  };

  if (organizationProfileLoading && !organizationProfile) {
    return <div className="max-w-5xl mx-auto p-8 text-sm text-slate-600" role="status">Memuat profil lembaga...</div>;
  }

  if (organizationProfileError && !organizationProfile) {
    return <div className="max-w-5xl mx-auto p-8 text-sm text-rose-700" role="alert">Profil lembaga belum dapat dimuat. Silakan coba kembali.</div>;
  }

  if (!profile.name) {
    return <div className="max-w-5xl mx-auto p-8 text-sm text-slate-600" role="status">Informasi profil lembaga belum dipublikasikan.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-10">
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-black">
            <window.Building2 className="w-4 h-4 text-emerald-400" />
            <span>Profil Lembaga & Transparansi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{profile.name}</h1>
          {profile.tagline && <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">{profile.tagline}</p>}
        </div>
        {profile.foundedYear && (
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center min-w-[170px]">
            <div className="text-[10px] uppercase tracking-wider text-amber-300 font-black">Tahun Berdiri</div>
            <div className="text-3xl font-black text-white mt-0.5">{profile.foundedYear}</div>
          </div>
        )}
      </div>

      {profile.history && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <window.BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Sejarah Singkat Lembaga</h2>
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{profile.history}</p>
        </section>
      )}

      {(profile.vision || profile.missions.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profile.vision && (
            <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center"><window.Sparkles className="w-6 h-6" /></div>
                <h2 className="text-xl font-extrabold text-slate-900">Visi Utama Lembaga</h2>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-5 rounded-2xl border border-slate-100 italic whitespace-pre-line">{profile.vision}</p>
            </section>
          )}
          {profile.missions.length > 0 && (
            <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center"><window.Heart className="w-6 h-6" /></div>
                <h2 className="text-xl font-extrabold text-slate-900">Misi Pengabdian</h2>
              </div>
              <ol className="space-y-2.5 text-xs text-slate-700 font-medium">
                {profile.missions.map((mission, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                    <span className="leading-relaxed">{mission}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      )}

      {organizationStructure.length > 0 && (
        <section className="space-y-8" aria-labelledby="org-heading">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">Tim Pengasuhan</p>
            <h2 id="org-heading" className="text-2xl sm:text-3xl font-black text-slate-900">Struktur Kepengurusan Lembaga</h2>
            <p className="text-sm text-slate-500">Bersama mendampingi pendidikan, pengasuhan, dan tumbuh kembang anak.</p>
          </div>
          {organizationStructure.map((group, gIdx) => (
            <div key={`${group.level}-${gIdx}`} className="space-y-5">
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-10 sm:w-24 bg-emerald-200" />
                <div className="text-center">
                  {group.level !== 99 && <p className="text-[11px] font-semibold text-slate-500">Tingkat {group.level}</p>}
                  <h3 className="text-sm uppercase tracking-wide font-extrabold text-emerald-800">{group.role}</h3>
                </div>
                <span className="h-px w-10 sm:w-24 bg-emerald-200" />
              </div>
              <div className="flex flex-wrap justify-center gap-5">
                {group.members.map((member, idx) => {
                  const photo = publicImageUrl(member?.photoUrl || member?.photo_url || member?.photo);
                  return (
                    <article key={`${member.name}-${idx}`} className="w-full sm:w-80 max-w-sm bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-28 h-28 bg-emerald-50 text-emerald-700 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 border border-emerald-100">
                        {photo ? <img src={photo} alt={`Foto ${member.name}`} loading="lazy" draggable={false} onContextMenu={(event) => event.preventDefault()} className="w-full h-full object-cover object-top" /> : <window.User className="w-9 h-9" />}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-slate-900">{member.name}</h4>
                        {member.position && <p className="font-bold text-xs text-emerald-700">{member.position}</p>}
                        {(member.desc || member.description) && <p className="text-xs text-slate-500 leading-relaxed">{String(member.desc || member.description)}</p>}
                        {(isDemo(member.name) || isDemo(group.role)) && <span className="inline-block mt-2 px-2.5 py-1 text-[10px] rounded-lg font-extrabold bg-amber-50 text-amber-800">DATA CONTOH / DEMO</span>}
                      </div>
                    </article>
                  );
                })}
              </div>
              {gIdx < organizationStructure.length - 1 && <div aria-hidden="true" className="flex justify-center text-emerald-400"><window.ChevronDown className="w-5 h-5" /></div>}
            </div>
          ))}
        </section>
      )}

      {profile.facilities.length > 0 && (
        <section className="space-y-6" aria-labelledby="facility-heading">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 id="facility-heading" className="text-2xl sm:text-3xl font-black text-slate-900">Fasilitas & Bidang Pembinaan</h2>
            <p className="text-sm text-slate-500">Ruang dan layanan yang mendukung keseharian anak asuh.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            {profile.facilities.map((facility, idx) => (
              <article key={`${facility.name}-${idx}`} className="w-full sm:w-80 max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><window.BookOpen className="h-6 w-6" /></div>
                <h3 className="text-sm font-extrabold text-slate-900">{facility.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{officialText(facility.desc || facility.description)}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {achievementsByYear.length > 0 && (
        <section className="space-y-7" aria-labelledby="achievement-heading">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">Perjalanan Pengabdian</p>
            <h2 id="achievement-heading" className="text-2xl sm:text-3xl font-black text-slate-900">Jejak Pengabdian & Prestasi</h2>
            <p className="text-sm text-slate-500">Kegiatan dan capaian yang dicatat pengelola lembaga.</p>
          </div>
          {achievementsByYear.map(([year, items]) => (
            <div key={year} className="space-y-4">
              <div className="text-center"><span className="inline-block rounded-full px-5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-100 text-sm font-extrabold">{year}</span></div>
              <div className="flex flex-wrap justify-center gap-5">
                {items.map((item, idx) => (
                  <article key={`${year}-${idx}`} className="w-full sm:w-80 max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm space-y-3">
                    <div className="mx-auto w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center"><window.Award className="w-6 h-6" /></div>
                    <h3 className="text-sm font-extrabold text-slate-900">{item.title}</h3>
                    {item.by && <p className="text-xs text-slate-500">{item.by}</p>}
                    {(isDemo(item.title) || isDemo(item.by)) && <span className="inline-block rounded-lg bg-amber-50 text-amber-800 text-[10px] font-extrabold px-2.5 py-1">DATA CONTOH / DEMO</span>}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Data anak tidak ditampilkan tanpa landasan persetujuan dan kebutuhan publikasi yang jelas. */}
      {profile.legalities.length > 0 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
          <div className="flex items-center justify-center gap-3 text-center"><window.ShieldCheck className="w-7 h-7 text-emerald-600" /><h2 className="text-xl font-black text-slate-900">Dokumen Legalitas Lembaga</h2></div>
          <div className="flex flex-wrap justify-center gap-4">
            {profile.legalities.map((item, idx) => (
              <div key={idx} className="w-full sm:w-72 max-w-sm p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-center">
                <p className="text-xs font-black text-slate-800">{item.type}</p>
                <p className="text-xs font-mono text-emerald-700 break-all">{item.number}</p>
                {item.date && <p className="text-xs text-slate-500">{item.date}</p>}
                <p className="text-[11px] font-semibold text-emerald-700">Terverifikasi oleh pengurus</p>
                {item.documentUrl ? (
                  <a href={item.documentUrl} target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                    aria-label={`Lihat PDF legalitas ${item.type} di tab baru`}>
                    <span aria-hidden="true" className="text-[10px]">PDF</span> Lihat Dokumen
                  </a>
                ) : <p className="pt-2 text-[11px] text-slate-500">Dokumen PDF belum dipublikasikan</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Location and visiting information are managed in CMS and displayed on the public Profile page. */}
      <section id="lokasi-panti" aria-labelledby="visit-heading" className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Lokasi Lembaga</p>
          <h2 id="visit-heading" className="text-xl sm:text-2xl font-black text-slate-900">Informasi Lokasi & Kunjungan</h2>
          <p className="text-sm text-slate-500">Informasi kunjungan yang dikelola oleh pengurus lembaga.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-9 items-start">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <window.MapPin className="h-5 w-5 shrink-0 text-emerald-700" />
                <div className="space-y-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900">Alamat Lembaga</h3>
                  <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                    {officialText(contactInfo.address) || 'Alamat belum dipublikasikan oleh pengurus.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <window.CalendarDays className="h-5 w-5 shrink-0 text-emerald-700" />
                <div className="space-y-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900">Jam Kunjungan</h3>
                  <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                    {visitingHours || 'Jam kunjungan belum dipublikasikan oleh pengurus.'}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-500">Hubungi pengurus terlebih dahulu untuk konfirmasi sebelum datang.</p>
                </div>
              </div>
            </div>

            {hasWhatsApp && (
              <button type="button" onClick={handleOpenWhatsApp} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800">
                <window.MessageCircle className="h-4 w-4" /> Konfirmasi Kunjungan via WhatsApp
              </button>
            )}
          </div>

          <SIMKPantiMap mapsUrl={mapsUrl} />
        </div>
      </section>
    </div>
  );
};

window.OrganizationProfile = OrganizationProfile;
