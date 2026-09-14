// Public Organization Profile & Organizational Structure Component (Profil Panti & Struktur Organisasi)
const OrganizationProfile = ({
  onNavigateToDonation
}) => {
  const profile = window.INITIAL_SIMK_DATA?.orphanageProfile || {};
  const structure = window.INITIAL_SIMK_DATA?.organizationStructure || [];
return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold shadow-inner">
            <LucideIcon name="building-2" className="w-4 h-4 text-emerald-400" />
            <span>Profil Lembaga & Struktur Kepengurusan</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {profile.name || 'Panti Asuhan Kasih Bunda'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            {profile.tagline || 'Menebar Kasih, Membina Generasi Berakhlak Mulia & Mandiri'} — Berdiri sejak tahun {profile.foundedYear || '2012'} di bawah naungan yayasan resmi berbadan hukum.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[160px] z-10">
          <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-extrabold">Status Lembaga</div>
          <div className="text-sm font-black text-white mt-1">Terakreditasi & Terverifikasi</div>
          <div className="text-[10px] text-emerald-200 mt-0.5">Kemenkumham & Dinsos RI</div>
        </div>

        {/* Decorative Background Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* SEKSI VISI, MISI & NILAI UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visi */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center font-bold">
              <LucideIcon name="compass" className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Visi Utama Lembaga</h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium">
              "{profile.vision}"
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-center">
            <div className="bg-white/10 p-3 rounded-2xl">
              <div className="text-lg font-black text-white">180+</div>
              <div className="text-[10px] text-emerald-200">Alumni Mandiri</div>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl">
              <div className="text-lg font-black text-white">45</div>
              <div className="text-[10px] text-emerald-200">Anak Asuh Aktif</div>
            </div>
          </div>
        </div>

        {/* Misi */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <LucideIcon name="target" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Misi Pelayanan & Pembinaan</h3>
              <p className="text-xs text-slate-500">5 pilar komitmen yayasan dalam membina anak asuh</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {profile.missions?.map((m, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {m}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SEKSI STRUKTUR ORGANISASI (HIERARKI BAGAN KEPENGURUSAN) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-indigo-800 uppercase tracking-wider bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
            Tata Kelola & Akuntabilitas
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Struktur Organisasi Kepengurusan Panti
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dikelola oleh pengurus amanah, berdedikasi, dan profesional yang mengedepankan akuntabilitas tata pamong serta kepatuhan laporan keuangan nirlaba.
          </p>
        </div>

        {/* Level 1: Dewan Pembina */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Level 1 — Dewan Pembina Yayasan</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {structure[0]?.members?.map((mem, i) => (
              <div key={i} className="p-5 bg-gradient-to-r from-amber-50/70 to-slate-50 rounded-2xl border border-amber-200/80 flex items-center space-x-4 shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
                  {mem.photo}
                </div>
                <div>
                  <div className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider">{mem.position}</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{mem.name}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{mem.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level 2: Pimpinan Yayasan / Pemimpin Lembaga */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Level 2 — Pimpinan Lembaga (Ketua Yayasan)</h3>
          </div>
          <div className="max-w-xl mx-auto">
            {structure[1]?.members?.map((mem, i) => (
              <div key={i} className="p-6 bg-gradient-to-r from-indigo-50 to-slate-50 rounded-2xl border-2 border-indigo-200 flex items-center space-x-4 shadow-sm text-left">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
                  {mem.photo}
                </div>
                <div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-indigo-600 text-white uppercase tracking-wider">
                    {mem.roleCode || 'Pemimpin Lembaga'}
                  </span>
                  <div className="text-base font-black text-slate-900 mt-1">{mem.name}</div>
                  <div className="text-xs font-bold text-indigo-900">{mem.position}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{mem.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level 3: Pengurus Harian */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Level 3 — Pengurus Harian (Manajemen Operasional)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {structure[2]?.members?.map((mem, i) => (
              <div key={i} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 flex flex-col justify-between space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl flex-shrink-0">
                    {mem.photo}
                  </div>
                  <div>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-600 text-white uppercase">
                      Pengurus Harian
                    </span>
                    <div className="text-xs font-black text-slate-900 mt-0.5">{mem.name}</div>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-emerald-800">{mem.position}</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">{mem.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level 4: Divisi Pengasuhan & Pembinaan Anak */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Level 4 — Divisi Pengasuhan & Pembinaan Anak</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {structure[3]?.members?.map((mem, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-2xl flex-shrink-0">
                    {mem.photo}
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">{mem.name}</div>
                    <div className="text-[11px] font-bold text-teal-800 mt-0.5">{mem.position}</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {mem.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SEKSI LEGALITAS & PERIZINAN RESMI */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <LucideIcon name="file-check-2" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Legalitas & Dokumen Perizinan Resmi</h3>
            <p className="text-xs text-slate-500">Kepatuhan izin hukum yayasan untuk transparansi kepada publik & donatur</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.legalities?.map((leg, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  ✓ {leg.type}
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">{leg.date}</span>
              </div>
              <div className="text-xs font-black text-slate-900 font-mono tracking-tight break-all">
                {leg.number}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEKSI LOKASI & KONTAK PANTI */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
              Kunjungan & Silaturahmi
            </span>
            <h3 className="text-2xl font-black">Informasi Lokasi & Kontak Resmi</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kami menyambut hangat para donatur, relawan, dan instansi yang ingin bersilaturahmi atau mengadakan kegiatan sosial bersama anak-anak asuh panti.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start space-x-3">
                <LucideIcon name="map-pin" className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-200 font-medium">{profile.contactInfo?.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <LucideIcon name="phone" className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-200 font-medium">WhatsApp / Telp: {profile.contactInfo?.whatsapp} ({profile.contactInfo?.phone})</span>
              </div>
              <div className="flex items-center space-x-3">
                <LucideIcon name="clock" className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="text-slate-300 font-medium">{profile.contactInfo?.visitingHours}</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigateToDonation('Konsumsi')}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all"
              >
                Salurkan Donasi Online
              </button>
              <a
                href={`https://wa.me/6281234567890?text=Halo%20Pengurus%20Panti%20Asuhan%20Kasih%20Bunda,%20saya%20ingin%20bersilaturahmi`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 transition-all flex items-center space-x-1.5"
              >
                <LucideIcon name="message-circle" className="w-4 h-4 text-emerald-400" />
                <span>Hubungi via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Interactive Simulated Google Maps Card */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-3 text-center">
            <div className="h-44 bg-slate-800 rounded-xl overflow-hidden relative flex items-center justify-center border border-white/10">
              {/* Map Graphic Illustration */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="relative z-10 text-center space-y-2 p-4">
                <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <LucideIcon name="map-pin" className="w-5 h-5" />
                </div>
                <div className="text-xs font-black text-white">Gedung Panti Asuhan Kasih Bunda</div>
                <div className="text-[10px] text-slate-300">Kebayoran, Jakarta Selatan</div>
              </div>
            </div>
            <div className="text-[11px] text-emerald-300 font-bold">
              📍 Akses mudah, berjarak 500m dari stasiun/halte terdekat
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

window.OrganizationProfile = OrganizationProfile;
