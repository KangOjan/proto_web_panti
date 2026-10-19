// Admin Content Management Component (CMS)
// SIMK-Panti - Sistem Manajemen Konten: Profil Panti, Artikel & Berita, FAQ

const ContentManagement = ({
  orphanageProfile = (window.INITIAL_SIMK_DATA?.orphanageProfile || {}),
  articles = (window.INITIAL_SIMK_DATA?.articles || []),
  faqs = (window.INITIAL_SIMK_DATA?.faqs || []),
  onSaveProfile = null,
  onSaveArticle = null,
  onDeleteArticle = null,
  onSaveFaq = null,
  onDeleteFaq = null,
}) => {
  const [activeTab, setActiveTab] = React.useState('profile'); // profile | vision | articles | faqs

  // State Profile Edit
  const [name, setName] = React.useState(orphanageProfile?.name || 'Panti Asuhan LKSA Taman Harapan Muhammadiyah ');
  const [tagline, setTagline] = React.useState(orphanageProfile?.tagline || 'Menebar Kasih, Membina Generasi Berakhlak Mulia & Mandiri');
  const [history, setHistory] = React.useState(orphanageProfile?.history || '');
  const [vision, setVision] = React.useState(orphanageProfile?.vision || '');
  const [missions, setMissions] = React.useState(Array.isArray(orphanageProfile?.missions) ? orphanageProfile.missions : []);
  const [address, setAddress] = React.useState(orphanageProfile?.contactInfo?.address || '');
  const [phone, setPhone] = React.useState(orphanageProfile?.contactInfo?.phone || '');
  const [whatsapp, setWhatsapp] = React.useState(orphanageProfile?.contactInfo?.whatsapp || '');
  const [email, setEmail] = React.useState(orphanageProfile?.contactInfo?.email || '');
  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [savingProfile, setSavingProfile] = React.useState(false);

  // Article Modal State
  const [isArticleModalOpen, setIsArticleModalOpen] = React.useState(false);
  const [articleTitle, setArticleTitle] = React.useState('');
  const [articleContent, setArticleContent] = React.useState('');
  const [articleImage, setArticleImage] = React.useState('');
  const [articleUploadName, setArticleUploadName] = React.useState('');

  // FAQ Modal State
  const [isFaqModalOpen, setIsFaqModalOpen] = React.useState(false);
  const [faqQuestion, setFaqQuestion] = React.useState('');
  const [faqAnswer, setFaqAnswer] = React.useState('');

  // Synchronize when orphanageProfile prop changes
  React.useEffect(() => {
    if (orphanageProfile && Object.keys(orphanageProfile).length > 0) {
      setName(orphanageProfile.name || '');
      setTagline(orphanageProfile.tagline || '');
      setHistory(orphanageProfile.history || '');
      setVision(orphanageProfile.vision || '');
      setMissions(Array.isArray(orphanageProfile.missions) ? orphanageProfile.missions : []);
      setAddress(orphanageProfile.contactInfo?.address || '');
      setPhone(orphanageProfile.contactInfo?.phone || '');
      setWhatsapp(orphanageProfile.contactInfo?.whatsapp || '');
      setEmail(orphanageProfile.contactInfo?.email || '');
    }
  }, [orphanageProfile]);

  const handleSaveProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setSavedSuccess(false);
    try {
      const updatedProfile = {
        ...orphanageProfile, name, tagline, history, vision,
        missions: missions.map((m) => m.trim()).filter(Boolean),
        contactInfo: {
          ...(orphanageProfile?.contactInfo || {}), address, phone, whatsapp, email
        }
      };
      const saved = onSaveProfile ? await onSaveProfile(updatedProfile) : false;
      if (saved) setSavedSuccess(true);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddArticleSubmit = (e) => {
    e.preventDefault();
    if (!articleTitle.trim() || !articleContent.trim()) return;

    const payload = {
      id: `ART-${Date.now().toString().slice(-4)}`,
      title: articleTitle,
      slug: articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: articleContent.substring(0, 120) + '...',
      content: articleContent,
      image: articleImage,
      date: new Date().toISOString().split('T')[0],
      author: 'Pengurus Harian'
    };

    if (onSaveArticle) onSaveArticle(payload);
    setIsArticleModalOpen(false);
    setArticleTitle('');
    setArticleContent('');
  };

  const handleAddFaqSubmit = (e) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    const payload = {
      id: `FAQ-${Date.now().toString().slice(-4)}`,
      question: faqQuestion,
      answer: faqAnswer,
      category: 'Umum'
    };

    if (onSaveFaq) onSaveFaq(payload);
    setIsFaqModalOpen(false);
    setFaqQuestion('');
    setFaqAnswer('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Manajemen Konten & Informasi Publik</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
            Sistem Manajemen Konten (CMS)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Kelola informasi profil panti, kontak sekretariat, artikel berita kegiatan, serta daftar pertanyaan umum (FAQ) yang tampil pada website publik.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center space-x-2 transition-all ${
            activeTab === 'profile'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Info & Kontak Panti</span>
        </button>

        <button type="button" onClick={() => setActiveTab('vision')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${activeTab === 'vision' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
          <span>Visi & Misi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center space-x-2 transition-all ${
            activeTab === 'articles'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Artikel & Berita</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center space-x-2 transition-all ${
            activeTab === 'faqs'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Daftar Tanya Jawab (FAQ)</span>
        </button>
      </div>

      {/* TAB 1: PROFILE & CONTACTS */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfileSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 font-bold animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Informasi Panti berhasil diperbarui dan diselaraskan ke database!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Panti Asuhan *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tagline / Motto *</label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sejarah Singkat Panti *</label>
            <textarea
              rows="3"
              required
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
            ></textarea>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Perubahan Kontak & Alamat Resmi</h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">No. Telepon Kantor</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">No. WhatsApp Resmi</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Alamat Lengkap Panti</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-md text-xs flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Informasi Panti</span>
          </button>
        </form>
      )}

      {/* VISI & MISI: fields already exist in OrganizationProfile database */}
      {activeTab === 'vision' && (
        <form onSubmit={handleSaveProfileSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Visi dan Misi Lembaga</h3>
            <p className="text-sm text-slate-500 mt-1">Data akan ditampilkan di halaman profil publik setelah tersimpan di MySQL.</p>
          </div>
          {savedSuccess && <p role="status" className="rounded-xl p-3 bg-emerald-50 text-emerald-700 text-sm">Visi dan misi berhasil disimpan.</p>}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Visi lembaga</label>
            <textarea rows="5" value={vision} onChange={(e) => setVision(e.target.value)}
              placeholder="Tuliskan arah dan cita-cita lembaga..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm leading-relaxed" />
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Daftar misi</label>
              <button type="button" disabled={missions.length >= 20}
                onClick={() => setMissions((prev) => [...prev, ''])}
                className="px-4 py-2 text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl">+ Tambah misi</button>
            </div>
            {missions.map((mission, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-sm text-slate-500 pt-3 w-6">{index + 1}.</span>
                <textarea rows="2" maxLength={2000} value={mission}
                  onChange={(e) => setMissions((prev) => prev.map((value, i) => i === index ? e.target.value : value))}
                  className="flex-1 rounded-xl border border-slate-300 p-3 text-sm"
                  aria-label={`Misi ${index + 1}`} />
                <button type="button" aria-label={`Hapus misi ${index + 1}`}
                  onClick={() => setMissions((prev) => prev.filter((_, i) => i !== index))}
                  className="px-3 py-2.5 border border-rose-200 text-rose-700 rounded-xl text-sm">Hapus</button>
              </div>
            ))}
            {missions.length === 0 && <p className="text-sm text-slate-500">Belum ada misi. Pilih Tambah misi.</p>}
          </div>
          <button type="submit" disabled={savingProfile} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm">
            {savingProfile ? 'Menyimpan...' : 'Simpan Visi & Misi ke Database'}
          </button>
        </form>
      )}

      {/* TAB 2: ARTICLES */}
      {activeTab === 'articles' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Kelola Artikel & Berita Panti</h3>
              <p className="text-xs text-slate-500">Tambah atau hapus artikel kegiatan panti</p>
            </div>
            <button
              type="button"
              onClick={() => setIsArticleModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tulis Artikel Baru</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {articles.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada artikel yang ditambahkan.</p>
            ) : (
              articles.map((art) => (
                <div key={art.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{art.title}</h4>
                    <p className="text-xs text-slate-400">{art.date} • Oleh {art.author}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Hapus artikel "${art.title}"?`)) {
                        if (onDeleteArticle) onDeleteArticle(art.id);
                      }
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200"
                    title="Hapus Artikel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: FAQS */}
      {activeTab === 'faqs' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Kelola FAQ Publik</h3>
              <p className="text-xs text-slate-500">Tambah atau hapus item pertanyaan umum</p>
            </div>
            <button
              type="button"
              onClick={() => setIsFaqModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah FAQ Baru</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 space-y-3">
            {faqs.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada data FAQ.</p>
            ) : (
              faqs.map((faq) => (
                <div key={faq.id} className="pt-3 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{faq.question}</h4>
                    <p className="text-xs text-slate-600 mt-1">{faq.answer}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Hapus pertanyaan "${faq.question}"?`)) {
                        if (onDeleteFaq) onDeleteFaq(faq.id);
                      }
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 flex-shrink-0"
                    title="Hapus FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL ARTICLE */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">Tulis Artikel Baru</h3>
            <form onSubmit={handleAddArticleSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Judul Artikel..."
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border font-bold"
              />
              <textarea
                rows="9"
                required
                placeholder="Tuliskan laporan kegiatan dengan lengkap..."
                value={articleContent}
                onChange={(e) => setArticleContent(e.target.value)}
                className="w-full p-2.5 rounded-xl border font-medium"
              ></textarea>
              <div className="rounded-xl border border-dashed border-slate-300 p-4 space-y-2">
                <label className="block text-sm font-bold text-slate-800">Foto sampul (pratinjau lokal)</label>
                <input type="file" accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
                      alert('Hanya JPG/PNG/WebP maksimal 5 MB.');
                      e.target.value = '';
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => { setArticleImage(String(reader.result || '')); setArticleUploadName(file.name); };
                    reader.readAsDataURL(file);
                  }} className="block w-full text-xs" />
                {articleImage && <img src={articleImage} alt="Pratinjau foto artikel" className="h-40 max-w-full object-cover rounded-lg" />}
                {articleUploadName && <p className="text-xs text-slate-500">{articleUploadName}</p>}
                <p className="text-xs text-amber-700">Belum ada API untuk menyimpan foto dan artikel. Simpan hanya membuat pratinjau lokal.</p>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Simpan Artikel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FAQ */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">Tambah FAQ Baru</h3>
            <form onSubmit={handleAddFaqSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Pertanyaan..."
                value={faqQuestion}
                onChange={(e) => setFaqQuestion(e.target.value)}
                className="w-full p-2.5 rounded-xl border font-bold"
              />
              <textarea
                rows="6"
                required
                placeholder="Jawaban..."
                value={faqAnswer}
                onChange={(e) => setFaqAnswer(e.target.value)}
                className="w-full p-2.5 rounded-xl border font-medium"
              ></textarea>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Simpan FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

window.ContentManagement = ContentManagement;
