// Organization Profile & Legalities Component (Profil Panti)
const OrganizationProfile = ({
  organizationProfile = null,
  organizationProfileLoading = false,
  organizationProfileError = null,
  onNavigateToDonation,
}) => {
  // Ilustrasi hanya di localhost untuk keperluan pengembangan/screenshot.
  // Saat dijalankan di VPS, bidang yang kosong tidak diisi informasi fiktif.
  const enableDemo = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
  const currentProfile = organizationProfile || {};
  const profile = {
    name: currentProfile.name || (enableDemo ? 'Informasi Panti (DEMO)' : 'Profil lembaga belum diisi'),
    tagline: currentProfile.tagline || (enableDemo ? 'Contoh tampilan profil untuk pengembangan SIMK-Panti.' : ''),
    foundedYear: currentProfile.foundedYear ?? null,
    founder: currentProfile.founder || '',
    history: currentProfile.history || (enableDemo ? 'Contoh narasi sejarah: informasi perjalanan lembaga dapat ditampilkan di bagian ini setelah dikonfirmasi pengurus.' : ''),
    vision: currentProfile.vision || (enableDemo ? 'Contoh visi: meningkatkan kualitas layanan pendidikan, kesehatan, dan pendampingan anak asuh.' : ''),
    missions: Array.isArray(currentProfile.missions) && currentProfile.missions.length
      ? currentProfile.missions : (enableDemo ? [
          'Contoh misi: mengembangkan kegiatan bimbingan belajar yang terjadwal.',
          'Contoh misi: mendukung kesehatan dan gizi anak asuh.',
          'Contoh misi: memperluas pembinaan keterampilan dan karakter.',
        ] : []),
    legalities: Array.isArray(currentProfile.legalities)
      ? currentProfile.legalities.filter((item) => item?.verified === true && item?.number)
      : [],
    facilities: Array.isArray(currentProfile.facilities) ? currentProfile.facilities : [],
    contactInfo: currentProfile.contactInfo || {},
  };

  const profileIsDemo = enableDemo && !organizationProfile?.name;
  const visionIsDemo = enableDemo && !currentProfile.vision;
  const historyIsDemo = enableDemo && !currentProfile.history;
  const missionIsDemo = enableDemo && (!Array.isArray(currentProfile.missions) || !currentProfile.missions.length);
  const orgIsDemo = enableDemo && (!Array.isArray(currentProfile.organizationStructure) || !currentProfile.organizationStructure.length);
  const orgStructure = !orgIsDemo ? (Array.isArray(currentProfile.organizationStructure) ? currentProfile.organizationStructure : []) : [
    { role: 'Tim Pengelola (DEMO)', members: [
      { name: 'Nama pengurus belum diisi', position: 'Koordinator Pengasuhan', desc: 'Contoh posisi untuk penyusunan struktur lembaga.' },
      { name: 'Nama pengurus belum diisi', position: 'Koordinator Pendidikan', desc: 'Contoh posisi untuk kegiatan pendidikan.' },
      { name: 'Nama pengurus belum diisi', position: 'Koordinator Administrasi', desc: 'Contoh posisi untuk pengelolaan operasional.' },
    ] },
  ];
  const facilityIsDemo = enableDemo && (!Array.isArray(currentProfile.facilities) || !currentProfile.facilities.length);
  const shownFacilities = !facilityIsDemo ? (Array.isArray(currentProfile.facilities) ? currentProfile.facilities : []) : [
    { name: 'Pendampingan Belajar', desc: 'Contoh layanan pendidikan dan bimbingan belajar.' },
    { name: 'Pembinaan Keterampilan', desc: 'Contoh kegiatan pengembangan keterampilan anak.' },
    { name: 'Layanan Kesehatan', desc: 'Contoh program pemantauan kesehatan dan gizi.' },
  ];
  // Profil anak tidak dipublikasikan tanpa model persetujuan yang terverifikasi.
  const childrenList = [];

  const whatsappNumber = String(profile.contactInfo.whatsapp || '').replace(/\D/g, '').replace(/^0/, '62');
  const handleOpenWhatsApp = () => {
    if (!whatsappNumber) return;
    window.open(`https://wa.me/${whatsappNumber}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-12">
      {/* DEMO hanya mengisi bidang kosong pada tampilan. Tidak masuk database. */}
      {(profileIsDemo || orgIsDemo || facilityIsDemo || visionIsDemo || missionIsDemo || historyIsDemo) && (
        <div role="note" className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-xs font-semibold text-amber-900">
          Mode pratinjau: bagian bertanda DEMO berisi data ilustrasi, bukan informasi resmi lembaga.
          Identitas dan konten yang sudah ada di CMS tetap digunakan.
        </div>
      )}
      {/* Header Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-black">
            <window.Building2 className="w-4 h-4 text-emerald-400" />
            <span>Profil Lembaga & Transparansi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{profile.name}</h1>
          <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">{profile.tagline}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center min-w-[170px] shadow-lg">
          <div className="text-[10px] uppercase tracking-wider text-amber-300 font-black">Dedikasi Pengabdian</div>
          <div className="text-3xl font-black text-white mt-0.5">{profile.foundedYear || '—'}</div>
          <div className="text-[11px] text-emerald-200 font-bold mt-1">Tahun berdiri berdasarkan CMS</div>
        </div>
      </div>

      {/* Narasi sejarah dari CMS, dengan contoh berlabel jika belum ada. */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <window.BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Sejarah Singkat Lembaga</h2>
          {historyIsDemo && <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-black text-amber-800">CONTOH (DEMO)</span>}
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{profile.history || 'Sejarah lembaga belum dipublikasikan melalui CMS.'}</p>
      </section>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <window.Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Visi Utama Lembaga</h2>
              <p className="text-xs text-slate-400">Komitmen arah jangka panjang</p>
            </div>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-5 rounded-2xl border border-slate-100 italic">
            {profile.vision || 'Visi lembaga belum dipublikasikan melalui CMS.'}
            {visionIsDemo && <span className="ml-2 text-amber-700 text-[10px] font-black">(DEMO)</span>}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <window.Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Misi Pengabdian</h2>
              <p className="text-xs text-slate-400">Langkah nyata pembinaan anak asuh</p>
            </div>
          </div>
          {missionIsDemo && <div className="text-[10px] font-black text-amber-700">CONTOH MISI, BELUM DIISI MELALUI CMS</div>}
          <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
            {profile.missions.length === 0 && <li>Misi lembaga belum dipublikasikan melalui CMS.</li>}
            {profile.missions.map((m, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* STRUKTUR ORGANISASI & PENGURUS LEMBAGA */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 px-3.5 py-1 rounded-full text-emerald-800 text-xs font-black">
            <window.UserCheck className="w-4 h-4" />
            <span>Struktur Organisasi & Pengurus</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Struktur Kepengurusan Lembaga
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Dewan pembina, pimpinan yayasan, dan tim pengasuh profesional yang mendampingi tumbuh kembang anak-anak asuh setiap hari.
          </p>
        </div>

        <div className="space-y-8">
          {orgIsDemo && <p className="text-xs font-bold text-amber-700">Struktur ilustrasi (DEMO), nama dan jabatan resmi belum dipublikasikan.</p>}
          {orgStructure.length === 0 && <p className="text-sm text-slate-500">Struktur kepengurusan belum dipublikasikan.</p>}
          {orgStructure.map((group, gIdx) => (
            <div key={gIdx} className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="h-px flex-1 bg-slate-200"></span>
                <span className="text-xs font-extrabold uppercase tracking-wider px-4 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-xs">
                  {group.role}
                </span>
                <span className="h-px flex-1 bg-slate-200"></span>
              </div>

              <div
                className={`grid gap-5 ${
                  group.members.length === 1
                    ? 'grid-cols-1 max-w-md mx-auto'
                    : group.members.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {group.members.map((member, mIdx) => (
                  <div
                    key={mIdx}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-200 transition-all flex items-start space-x-4 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl flex-shrink-0 border border-emerald-100 shadow-xs group-hover:scale-105 transition-transform">
                      {member.photo ? (String(member.photo).startsWith('/') || String(member.photo).startsWith('http') ? <img src={member.photo} alt="" className="w-full h-full object-cover rounded-2xl" /> : member.photo) : <window.User className="w-7 h-7" />}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{member.name}</h4>
                      <div className="text-xs font-bold text-emerald-700">{member.position}</div>
                      <p className="text-xs text-slate-500 leading-relaxed font-normal pt-0.5">{member.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bidang pembinaan: contoh hanya digunakan ketika data fasilitas CMS kosong. */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-black text-slate-900">Layanan & Bidang Pembinaan</h2>
          {facilityIsDemo && <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-black text-amber-800">DATA ILUSTRASI (DEMO)</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {!shownFacilities.length && <p className="col-span-full text-sm text-slate-500">Informasi layanan belum dipublikasikan melalui CMS.</p>}
          {shownFacilities.map((facility, index) => (
            <div key={`${facility.name}-${index}`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><window.BookOpen className="w-5 h-5" /></div>
              <h3 className="text-sm font-extrabold text-slate-900">{facility.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{facility.desc || 'Rincian kegiatan belum ditambahkan melalui CMS.'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROFIL ANAK ASUHAN */}
      <div className="space-y-6 bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1 rounded-full text-emerald-300 text-xs font-black border border-emerald-400/30">
            <window.Users className="w-4 h-4" />
            <span>Profil Anak Asuhan (Privasi Terlindungi)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Mengenal Potensi & Impian Anak Asuh</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Profil ditampilkan secara terbatas (inisial nama, jenjang pendidikan, & cita-cita) sesuai kaidah perlindungan privasi anak dan pemenuhan hak tumbuh kembang mereka.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {childrenList.length === 0 && <p className="text-sm text-slate-300 col-span-full">Profil anak tidak ditampilkan demi privasi sampai mekanisme persetujuan tersedia.</p>}
          {childrenList.map((child) => (
            <div key={child.id} className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 hover:border-emerald-500/50 transition-all space-y-3 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-2xl shadow-inner">
                  {child.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">{child.initialName}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {child.gender} • {child.age} Thn
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs border-t border-slate-700/60 pt-3">
                <div className="text-slate-400">Pendidikan: <span className="font-bold text-slate-200">{child.education}</span></div>
                <div className="text-slate-400">Cita-cita: <span className="font-black text-amber-400">{child.dream}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEGALITAS & SERTIFIKAT RESMI */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <window.ShieldCheck className="w-7 h-7 text-emerald-600" />
          <div>
            <h3 className="text-lg font-black text-slate-900">Legalitas & Akreditasi Lembaga Resmi</h3>
            <p className="text-xs text-slate-500">Tercatat secara sah dan berkekuatan hukum di Republik Indonesia</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {profile.legalities.length === 0 && (
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Dokumen pendirian', 'Izin operasional', 'Akreditasi lembaga'].map((type) => (
                <div key={type} className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  <p className="text-xs font-extrabold text-slate-800">{type}</p>
                  <p className="mt-2 text-[11px] text-slate-500">{enableDemo ? 'Belum ada dokumen terverifikasi di CMS (DEMO tata letak).' : 'Dokumen belum tersedia/terverifikasi di CMS.'}</p>
                </div>
              ))}
            </div>
          )}
          {profile.legalities.map((leg, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="text-xs font-black text-slate-800">{leg.type}</div>
              <div className="text-xs font-mono text-emerald-700 font-bold break-all">{leg.number}</div>
              <div className="text-[10px] text-slate-400 font-semibold">{leg.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* LOKASI, JAM KUNJUNGAN & KONTAK CEPAT */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-900">Ingin Mengunjungi Panti / Silaturahmi Langsung?</h3>
          <p className="text-xs text-slate-600 max-w-xl">
            Kami menyambut hangat kunjungan donatur, relawan, dan silaturahmi masyarakat.
            <br />
            <b>Alamat:</b> {profile.contactInfo.address || 'Alamat resmi belum dilengkapi di CMS.'}
            <br />
            <b>Jam Kunjungan:</b> {profile.contactInfo.visitingHours || 'Hubungi pengurus untuk informasi kunjungan.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenWhatsApp}
          disabled={!whatsappNumber}
          className="px-6 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg text-xs flex items-center space-x-2 flex-shrink-0 transition-all"
        >
          <window.MessageCircle className="w-4 h-4" />
          <span>Konfirmasi Kunjungan via WhatsApp</span>
        </button>
      </div>
    </div>
  );
};

window.OrganizationProfile = OrganizationProfile;
