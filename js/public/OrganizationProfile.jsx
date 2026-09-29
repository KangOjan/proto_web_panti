// Public Organization Profile & Organizational Structure Component
const OrganizationProfile = ({
  onNavigateToDonation,
  organizationProfile = null,
  organizationProfileLoading = false,
  organizationProfileError = null
}) => {
  if (organizationProfileLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
          <div className="w-10 h-10 mx-auto rounded-full border-4 border-slate-200 border-t-emerald-600 animate-spin"></div>

          <p className="mt-4 text-sm font-bold text-slate-700">
            Memuat profil lembaga...
          </p>
        </div>
      </div>
    );
  }

  if (!organizationProfile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center">
            <LucideIcon
              name="building-2"
              className="w-6 h-6"
            />
          </div>

          <h2 className="text-xl font-black text-slate-900">
            Profil lembaga belum tersedia
          </h2>

          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            {organizationProfileError ||
              'Pengurus belum mempublikasikan informasi profil lembaga.'}
          </p>
        </div>
      </div>
    );
  }

  const profile =
    organizationProfile;

  const missions =
    Array.isArray(
      profile.missions
    )
      ? profile.missions.filter(Boolean)
      : [];

  const legalities =
    Array.isArray(
      profile.legalities
    )
      ? profile.legalities
      : [];

  const structure =
    Array.isArray(
      profile.organizationStructure
    )
      ? profile.organizationStructure
      : [];

  const contactInfo =
    profile.contactInfo || {};

  const hasContact =
    Boolean(
      contactInfo.address ||
      contactInfo.phone ||
      contactInfo.whatsapp ||
      contactInfo.email ||
      contactInfo.visitingHours ||
      contactInfo.gmapsUrl
    );

  const hasNarrative =
    Boolean(
      profile.history ||
      profile.vision ||
      missions.length > 0
    );

  const hasDetailedContent =
    Boolean(
      profile.tagline ||
      profile.foundedYear ||
      profile.founder ||
      hasNarrative ||
      legalities.length > 0 ||
      structure.length > 0 ||
      hasContact
    );

  const whatsappDigits =
    String(
      contactInfo.whatsapp || ''
    )
      .replace(
        /\D/g,
        ''
      )
      .replace(
        /^0/,
        '62'
      );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">

      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <LucideIcon
              name="building-2"
              className="w-4 h-4"
            />

            <span>
              Profil Lembaga
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {profile.name ||
              'Nama lembaga belum diisi'}
          </h1>

          {profile.tagline && (
            <p className="text-sm text-emerald-100 leading-relaxed">
              {profile.tagline}
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {profile.foundedYear && (
              <span className="text-xs font-bold bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl">
                Berdiri {profile.foundedYear}
              </span>
            )}

            {profile.founder && (
              <span className="text-xs font-bold bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl">
                Pendiri: {profile.founder}
              </span>
            )}
          </div>
        </div>

        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {!hasDetailedContent && (
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
          <LucideIcon
            name="info"
            className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5"
          />

          <div>
            <h2 className="text-sm font-extrabold text-amber-900">
              Profil lembaga sudah dibuat
            </h2>

            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              Saat ini baru nama lembaga yang tersedia. Pengurus dapat melengkapi sejarah, visi, misi, legalitas, kontak, dan struktur organisasi melalui menu Kelola Profil.
            </p>
          </div>
        </section>
      )}

      {/* History, Vision, Missions */}
      {hasNarrative && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {(profile.history ||
            profile.vision) && (
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              {profile.history && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <LucideIcon
                      name="book-open"
                      className="w-5 h-5 text-emerald-700"
                    />

                    <h2 className="text-lg font-extrabold text-slate-900">
                      Sejarah Lembaga
                    </h2>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {profile.history}
                  </p>
                </div>
              )}

              {profile.vision && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                  <div className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-2">
                    Visi
                  </div>

                  <p className="text-sm text-emerald-950 leading-relaxed">
                    {profile.vision}
                  </p>
                </div>
              )}
            </div>
          )}

          {missions.length > 0 && (
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <LucideIcon
                  name="target"
                  className="w-5 h-5 text-emerald-700"
                />

                <h2 className="text-lg font-extrabold text-slate-900">
                  Misi Pelayanan
                </h2>
              </div>

              <div className="space-y-3">
                {missions.map(
                  (
                    mission,
                    index
                  ) => (
                    <div
                      key={`${mission}-${index}`}
                      className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl"
                    >
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>

                      <p className="text-sm text-slate-700 leading-relaxed">
                        {mission}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Organization Structure */}
      {structure.length > 0 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-7">
          <div>
            <div className="flex items-center gap-2">
              <LucideIcon
                name="network"
                className="w-5 h-5 text-indigo-700"
              />

              <h2 className="text-xl font-extrabold text-slate-900">
                Struktur Organisasi Kepengurusan
              </h2>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Struktur pengelola lembaga yang dipublikasikan oleh pengurus.
            </p>
          </div>

          <div className="space-y-6">
            {structure.map(
              (
                group,
                groupIndex
              ) => {
                const members =
                  Array.isArray(
                    group.members
                  )
                    ? group.members
                    : [];

                return (
                  <div
                    key={`${group.level ?? groupIndex}-${group.role || groupIndex}`}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>

                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                        {group.level
                          ? `Level ${group.level} — `
                          : ''}
                        {group.role ||
                          'Kelompok Pengurus'}
                      </h3>
                    </div>

                    {members.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {members.map(
                          (
                            member,
                            memberIndex
                          ) => (
                            <article
                              key={`${member.name || 'member'}-${memberIndex}`}
                              className="p-4 bg-slate-50 border border-slate-200 rounded-2xl"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  {member.photo ? (
                                    <span className="text-xl">
                                      {member.photo}
                                    </span>
                                  ) : (
                                    <LucideIcon
                                      name="user"
                                      className="w-5 h-5"
                                    />
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <div className="font-extrabold text-slate-900 text-sm">
                                    {member.name ||
                                      'Nama belum diisi'}
                                  </div>

                                  {member.position && (
                                    <div className="text-xs font-bold text-emerald-800 mt-0.5">
                                      {member.position}
                                    </div>
                                  )}

                                  {member.roleCode && (
                                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                                      {member.roleCode}
                                    </div>
                                  )}

                                  {member.desc && (
                                    <p className="text-xs text-slate-500 leading-relaxed mt-2">
                                      {member.desc}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </article>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">
                        Belum ada anggota yang dipublikasikan pada bagian ini.
                      </p>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </section>
      )}

      {/* Legalities */}
      {legalities.length > 0 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <LucideIcon
              name="file-check"
              className="w-5 h-5 text-emerald-700"
            />

            <h2 className="text-xl font-extrabold text-slate-900">
              Legalitas & Perizinan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {legalities.map(
              (
                legality,
                index
              ) => (
                <article
                  key={`${legality.type || 'legalitas'}-${index}`}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-extrabold text-slate-900">
                      {legality.type ||
                        'Dokumen Legalitas'}
                    </span>

                    {legality.verified && (
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg">
                        Terverifikasi
                      </span>
                    )}
                  </div>

                  {legality.number && (
                    <div className="text-xs font-mono text-slate-600 break-all">
                      {legality.number}
                    </div>
                  )}

                  {legality.date && (
                    <div className="text-[11px] text-slate-400">
                      {legality.date}
                    </div>
                  )}
                </article>
              )
            )}
          </div>
        </section>
      )}

      {/* Contact */}
      {hasContact && (
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 mb-3">
                <LucideIcon
                  name="map-pin"
                  className="w-5 h-5 text-emerald-400"
                />

                <h2 className="text-xl font-extrabold">
                  Kontak & Kunjungan
                </h2>
              </div>

              <div className="space-y-3 text-sm text-slate-200">
                {contactInfo.address && (
                  <div>
                    {contactInfo.address}
                  </div>
                )}

                {(contactInfo.whatsapp ||
                  contactInfo.phone) && (
                  <div>
                    {contactInfo.whatsapp &&
                      `WhatsApp: ${contactInfo.whatsapp}`}
                    {contactInfo.whatsapp &&
                      contactInfo.phone &&
                      ' • '}
                    {contactInfo.phone &&
                      `Telepon: ${contactInfo.phone}`}
                  </div>
                )}

                {contactInfo.email && (
                  <div>
                    Email: {contactInfo.email}
                  </div>
                )}

                {contactInfo.visitingHours && (
                  <div>
                    Jam kunjungan: {contactInfo.visitingHours}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-5">
                {whatsappDigits && (
                  <a
                    href={`https://wa.me/${whatsappDigits}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold"
                  >
                    Hubungi via WhatsApp
                  </a>
                )}

                {contactInfo.gmapsUrl && (
                  <a
                    href={contactInfo.gmapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-extrabold"
                  >
                    Buka Lokasi
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-8 text-white text-center shadow-xl">
        <h2 className="text-2xl font-extrabold">
          Ingin Mendukung Program Panti?
        </h2>

        <p className="text-sm text-emerald-100 mt-2 max-w-xl mx-auto">
          Donasi dilakukan melalui alur pembayaran resmi SIMK-Panti dan diverifikasi oleh backend.
        </p>

        <button
          type="button"
          onClick={
            () =>
              onNavigateToDonation(
                'Konsumsi'
              )
          }
          className="mt-5 px-7 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-sm"
        >
          Donasi Sekarang
        </button>
      </section>
    </div>
  );
};

window.OrganizationProfile =
  OrganizationProfile;
