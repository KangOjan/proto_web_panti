// Footer publik, seluruh identitas ditarik dari CMS, bukan teks contoh.
const Footer = ({ onNavigateTab, organizationProfile = null }) => {
  const profile = organizationProfile || {};
  const contact = profile.contactInfo || {};
  const legalities = Array.isArray(profile.legalities) ? profile.legalities.filter((x) => x && x.number && x.verified === true) : [];
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
            <h3 className="font-extrabold text-white text-base">{profile.name || 'Informasi Lembaga'}</h3>
            {profile.tagline && <p className="text-emerald-400 font-semibold">{profile.tagline}</p>}
            {profile.history && <p className="text-slate-400 leading-relaxed line-clamp-4">{profile.history}</p>}
            {legalities.length > 0 && <div className="border-t border-slate-700 pt-3 space-y-1">
              {legalities.map((item, i) => <div key={i}>{item.type}: {item.number}</div>)}
            </div>}
          </div>
          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider mb-4">Navigasi Utama</h4>
            <div className="flex flex-col items-start gap-2">
              {links.map(([label, tab, href]) => <button key={tab} type="button"
                onClick={() => handleNav(tab, href)} className="hover:text-emerald-400 text-left">{label}</button>)}
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-extrabold text-white uppercase tracking-wider">Kontak Resmi Lembaga</h4>
            {contact.address && <p>Alamat: {contact.address}</p>}
            {contact.phone && <p>Telepon: {contact.phone}</p>}
            {contact.whatsapp && <p>WhatsApp: {contact.whatsapp}</p>}
            {contact.email && <p>Email: {contact.email}</p>}
            {!(contact.address || contact.phone || contact.whatsapp || contact.email) && <p className="text-slate-400">Kontak resmi belum dilengkapi pengurus melalui CMS.</p>}
            <p className="text-[11px] text-slate-400 leading-relaxed">Pembayaran donasi online diproses melalui layanan yang terintegrasi dengan sistem. Nomor rekening tidak ditampilkan sampai diverifikasi dan dikelola sebagai data resmi.</p>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-9 pt-6 flex flex-wrap items-center justify-between gap-3 text-slate-400">
          <span>© {new Date().getFullYear()} {profile.name || 'Lembaga'}</span>
          <span>Informasi publik mengikuti data yang dikelola melalui Pan Asuhan LKSA Taman Harapan Muhammadiyah.</span>
        </div>
      </div>
    </footer>
  );
};
window.Footer = Footer;
