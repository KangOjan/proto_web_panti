// Footer publik, seluruh identitas ditarik dari CMS, bukan teks contoh.
const Footer = ({ onNavigateTab, organizationProfile = null }) => {
  const profile = organizationProfile || {};
  const contact = profile.contactInfo || {};
  // Typo normalization for presentation only; correct the original value in CMS as well.
  const tagline = String(profile.tagline || 'Transparansi dan Pelayanan Anak')
    .replace(/Transaparansi/gi, 'Transparansi');
  const address = String(contact.address || '');
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Panti Asuhan Taman Harapan Muhammadiyah, Jl. Nilem No. 9, Bandung');
  const safeEmail = String(contact.email || '').trim();
  const safePhone = String(contact.phone || '').replace(/[^\d+]/g, '');
  const safeWhatsApp = String(contact.whatsapp || '').replace(/\D/g, '').replace(/^0/, '62');
  const handleNav = (tab, href) => {
    if (onNavigateTab) onNavigateTab(href);
    else if (window.navigateToRoute) window.navigateToRoute(href);
  };
  const links = [
    ['Beranda Utama', 'beranda', '/'], ['Profil Lembaga', 'profil', '/profil'],
    ['Program Donasi', 'donasi', '/donasi'], ['Transparansi Keuangan', 'keuangan-publik', '/keuangan-publik'],
    ['Berita Kegiatan', 'berita', '/berita'], ['FAQ', 'faq', '/faq'],
  ];
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs no-print mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <a href="/profil" aria-label="Profil LKSA Taman Harapan Muhammadiyah" className="shrink-0 rounded-xl bg-white p-1.5 shadow-sm">
                <img
                  src="/storage/site/logo-panti.png"
                  alt="Logo LKSA Taman Harapan Muhammadiyah"
                  className="h-14 w-14 object-contain"
                  loading="lazy"
                />
              </a>
              <div className="min-w-0 space-y-1">
                <h3 className="font-extrabold text-white text-base leading-snug">
                  {profile.name || 'LKSA Taman Harapan Muhammadiyah'}
                </h3>
                <p className="text-emerald-400 font-semibold">{tagline}</p>
              </div>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Informasi program, pengasuhan, dan kegiatan lembaga tersedia melalui halaman profil.
            </p>
            <a href="/profil" className="inline-flex text-emerald-300 hover:text-emerald-200 font-semibold">
              Kenali Lembaga &rarr;
            </a>
          </div>
          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider mb-4">Navigasi Utama</h4>
            <div className="flex flex-col items-start gap-2">
              {links.map(([label, tab, href]) => <button key={tab} type="button"
                onClick={() => handleNav(tab, href)} className="hover:text-emerald-400 text-left">{label}</button>)}
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-extrabold text-white uppercase tracking-wider">Kontak Lembaga</h4>
            {address && <p className="leading-relaxed">{address}</p>}
            {safePhone && <p>Telepon: <a className="hover:text-emerald-300" href={`tel:${safePhone}`}>{contact.phone}</a></p>}
            {safeWhatsApp && <p>WhatsApp: <a className="hover:text-emerald-300" href={`https://wa.me/${safeWhatsApp}`} target="_blank" rel="noopener noreferrer">{contact.whatsapp}</a></p>}
            {safeEmail && <p>Email: <a className="hover:text-emerald-300 break-all" href={`mailto:${safeEmail}`}>{safeEmail}</a></p>}
            <a className="inline-flex text-emerald-300 hover:text-emerald-200 font-semibold" href={mapsUrl} target="_blank" rel="noopener noreferrer">
              Lihat lokasi di peta &rarr;
            </a>
          </div>
        </div>
        {/* Identitas pembina berbeda dari sponsor atau endorsement komersial. */}
        <div className="mt-9 border-t border-slate-700 pt-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1 max-w-xl">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-emerald-300">Pembinaan & Dukungan Kelembagaan</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              LKSA Taman Harapan Muhammadiyah merupakan amal usaha Muhammadiyah dalam lingkungan
              Pimpinan Cabang Muhammadiyah (PCM) Lengkong, Kota Bandung.
            </p>
          </div>
          <a
            href="https://pcmlengkong.or.id/lksa-taman-harapan-muhammadiyah/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-lg transition-shadow"
            aria-label="Informasi resmi PCM Lengkong mengenai LKSA Taman Harapan Muhammadiyah"
          >
            <img
              src="/storage/site/pcm-lengkong.png"
              alt="Pimpinan Cabang Muhammadiyah Lengkong Kota Bandung"
              className="h-14 w-auto max-w-[240px] object-contain"
              loading="lazy"
            />
          </a>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-6 flex flex-wrap items-center justify-between gap-3 text-slate-400">
          <span>© {new Date().getFullYear()} {profile.name || 'Lembaga'}</span>
          <span>SIMK-Panti &middot; Informasi dari CMS lembaga</span>
        </div>
      </div>
    </footer>
  );
};
window.Footer = Footer;
