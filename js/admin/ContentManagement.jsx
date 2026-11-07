// Admin Content Management Component (CMS)
// SIMK-Panti - Sistem Manajemen Konten: Profil Panti, Artikel & Berita, FAQ

const ContentManagement = ({
  currentUser = null,
  onProfileUpdated = null,
  showToast = null,
}) => {
  const [activeTab, setActiveTab] = React.useState('profile'); // profile | articles | faqs

  // Persisted CMS state: never fall back to INITIAL_SIMK_DATA.
  const [managedArticles, setManagedArticles] = React.useState([]);
  const [managedFaqs, setManagedFaqs] = React.useState([]);
  const [cmsLoading, setCmsLoading] = React.useState(true);
  const [cmsBusy, setCmsBusy] = React.useState(false);
  const [cmsError, setCmsError] = React.useState('');
  const [cmsSuccess, setCmsSuccess] = React.useState('');
  const [isArticleModalOpen, setIsArticleModalOpen] = React.useState(false);
  const [editingArticle, setEditingArticle] = React.useState(null);
  const [articleTitle, setArticleTitle] = React.useState('');
  const [articleExcerpt, setArticleExcerpt] = React.useState('');
  const [articleContent, setArticleContent] = React.useState('');
  const [articleStatus, setArticleStatus] = React.useState('draft');
  const [articleCover, setArticleCover] = React.useState(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = React.useState(false);
  const [editingFaq, setEditingFaq] = React.useState(null);
  const [faqQuestion, setFaqQuestion] = React.useState('');
  const [faqAnswer, setFaqAnswer] = React.useState('');
  const [faqCategory, setFaqCategory] = React.useState('Umum');
  const [faqOrder, setFaqOrder] = React.useState(0);
  const [faqPublished, setFaqPublished] = React.useState(false);
  const [articleCoverPreview, setArticleCoverPreview] = React.useState('');

  React.useEffect(() => {
    if (!articleCover) {
      setArticleCoverPreview('');
      return;
    }
    const url = URL.createObjectURL(articleCover);
    setArticleCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [articleCover]);

  // Dialogs live in document.body, outside any transformed/scrolling admin layout.
  React.useEffect(() => {
    if (!isArticleModalOpen && !isFaqModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key !== 'Escape' || cmsBusy) return;
      setIsArticleModalOpen(false);
      setIsFaqModalOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isArticleModalOpen, isFaqModalOpen, cmsBusy]);


  const loadCmsContent = React.useCallback(async () => {
    setCmsLoading(true);
    setCmsError('');
    try {
      // A failed FAQ request should not hide previously loaded articles (or vice versa).
      const [articleResult, faqResult] = await Promise.allSettled([
        CmsApi.getManagedArticles(), CmsApi.getManagedFaqs(),
      ]);
      const problems = [];
      if (articleResult.status === 'fulfilled' && Array.isArray(articleResult.value?.data)) {
        setManagedArticles(articleResult.value.data.map(CmsApi.normalizeArticle));
      } else {
        problems.push(`Artikel: ${articleResult.reason?.message || 'respons tidak valid'}`);
      }
      if (faqResult.status === 'fulfilled' && Array.isArray(faqResult.value?.data)) {
        setManagedFaqs(faqResult.value.data.map(CmsApi.normalizeFaq));
      } else {
        problems.push(`FAQ: ${faqResult.reason?.message || 'respons tidak valid'}`);
      }
      if (problems.length) setCmsError(`Sebagian data CMS gagal dimuat. ${problems.join('; ')}. Coba Muat Ulang.`);
    } catch (error) {
      setCmsError(error?.message || 'Gagal memuat CMS dari Laravel.');
    } finally { setCmsLoading(false); }
  }, []);
  React.useEffect(() => { loadCmsContent(); }, [loadCmsContent]);

  const openArticleEditor = (article = null) => {
    setCmsError(''); setCmsSuccess(''); setEditingArticle(article);
    setArticleTitle(article?.title || '');
    setArticleExcerpt(article?.excerpt || '');
    setArticleContent(article?.content || '');
    setArticleStatus(article?.status || 'draft');
    setArticleCover(null); setIsArticleModalOpen(true);
  };
  const openFaqEditor = (faq = null) => {
    setCmsError(''); setCmsSuccess(''); setEditingFaq(faq);
    setFaqQuestion(faq?.question || ''); setFaqAnswer(faq?.answer || '');
    setFaqCategory(faq?.category || 'Umum'); setFaqOrder(faq?.sortOrder || 0);
    setFaqPublished(faq?.isPublished === true); setIsFaqModalOpen(true);
  };

  const handleAddArticleSubmit = async (e) => {
    e.preventDefault();
    if (cmsBusy) return;
    setCmsBusy(true); setCmsError(''); setCmsSuccess('');
    try {
      const payload = {
        title: articleTitle.trim(), excerpt: articleExcerpt.trim(),
        content: articleContent.trim(), status: articleStatus,
      };
      const response = editingArticle
        ? await CmsApi.updateArticle(editingArticle.id, payload)
        : await CmsApi.createArticle(payload);
      if (!response?.success || !response?.data?.id) throw new Error('Artikel tidak tersimpan.');
      let uploadError = '';
      if (articleCover) {
        try { await CmsApi.uploadArticleCover(response.data.id, articleCover); }
        catch (error) { uploadError = error?.message || 'Upload sampul gagal.'; }
      }
      await loadCmsContent();
      setIsArticleModalOpen(false);
      setCmsSuccess(uploadError
        ? `Artikel tersimpan di MySQL, tetapi foto belum berhasil: ${uploadError}. Pilih Edit untuk mengunggah ulang.`
        : 'Artikel tersimpan di MySQL.');
    } catch (error) { setCmsError(error?.message || 'Penyimpanan artikel gagal.'); }
    finally { setCmsBusy(false); }
  };
  const handleDeleteArticleRecord = async (article) => {
    if (!window.confirm(`Hapus artikel "${article.title}" secara permanen?`)) return;
    setCmsBusy(true); setCmsError('');
    try {
      const response = await CmsApi.deleteArticle(article.id);
      if (!response?.success) throw new Error('Artikel belum terhapus.');
      await loadCmsContent(); setCmsSuccess('Artikel dihapus.');
    } catch (error) { setCmsError(error?.message || 'Penghapusan artikel gagal.'); }
    finally { setCmsBusy(false); }
  };
  const handleAddFaqSubmit = async (e) => {
    e.preventDefault();
    if (cmsBusy) return;
    setCmsBusy(true); setCmsError(''); setCmsSuccess('');
    try {
      const payload = {
        question: faqQuestion.trim(), answer: faqAnswer.trim(),
        category: faqCategory, sort_order: Number(faqOrder) || 0,
        is_published: faqPublished,
      };
      const response = editingFaq
        ? await CmsApi.updateFaq(editingFaq.id, payload)
        : await CmsApi.createFaq(payload);
      if (!response?.success) throw new Error('FAQ tidak tersimpan.');
      await loadCmsContent(); setIsFaqModalOpen(false);
      setCmsSuccess('FAQ tersimpan di MySQL.');
    } catch (error) { setCmsError(error?.message || 'Penyimpanan FAQ gagal.'); }
    finally { setCmsBusy(false); }
  };
  const handleDeleteFaqRecord = async (faq) => {
    if (!window.confirm(`Hapus FAQ "${faq.question}" secara permanen?`)) return;
    setCmsBusy(true); setCmsError('');
    try {
      const response = await CmsApi.deleteFaq(faq.id);
      if (!response?.success) throw new Error('FAQ belum terhapus.');
      await loadCmsContent(); setCmsSuccess('FAQ dihapus.');
    } catch (error) { setCmsError(error?.message || 'Penghapusan FAQ gagal.'); }
    finally { setCmsBusy(false); }
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

      {cmsError && <div role="alert" className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-sm text-rose-700">{cmsError}</div>}
      {cmsSuccess && <div role="status" className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-700">{cmsSuccess}</div>}

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
          <span>Profil Lembaga</span>
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

      {/* TAB 1: PROFIL LEMBAGA — editor resmi yang juga memakai API Laravel. */}
      {activeTab === 'profile' && (
        <section aria-label="Kelola Profil Lembaga">
          <OrganizationProfileManagement
            currentUser={currentUser}
            onProfileUpdated={onProfileUpdated}
            showToast={showToast}
          />
        </section>
      )}

      {/* TAB 2: ARTICLES */}
      {activeTab === 'articles' && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div><h3 className="font-extrabold text-slate-900">Artikel & Berita</h3>
              <p className="text-xs text-slate-500">Draft tidak ditampilkan di website publik. Terbit: {managedArticles.filter((article) => article.status === 'published').length} dari {managedArticles.length}.</p></div>
            <button type="button" onClick={() => openArticleEditor()} className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white">Tulis Artikel Baru</button>
          </div>
          <button type="button" onClick={loadCmsContent} className="text-xs font-bold text-emerald-700">Muat Ulang dari Database</button>
          {cmsLoading ? <p className="text-sm text-slate-500">Memuat artikel...</p> : managedArticles.length === 0 ?
            <p className="text-sm text-slate-500">Belum ada artikel CMS.</p> :
            <div className="divide-y divide-slate-100">{managedArticles.map(art => (
              <div key={art.id} className="py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0"><h4 className="font-bold text-sm text-slate-900">{art.title}</h4>
                  <p className="text-xs text-slate-500">{art.status === 'published' ? 'Terbit' : 'Draft'} · {art.date || 'Belum terbit'} · {art.author || 'Pengurus'}</p></div>
                <div className="flex gap-2">
                  <button type="button" disabled={cmsBusy} onClick={() => openArticleEditor(art)} className="border border-slate-200 rounded-lg text-xs px-3 py-2 font-bold">Edit</button>
                  <button type="button" disabled={cmsBusy} onClick={() => handleDeleteArticleRecord(art)} className="border border-rose-200 text-rose-700 rounded-lg text-xs px-3 py-2 font-bold">Hapus</button>
                </div>
              </div>
            ))}</div>}
        </section>
      )}

      {/* TAB 3: FAQ */}
      {activeTab === 'faqs' && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div><h3 className="font-extrabold text-slate-900">Daftar Tanya Jawab (FAQ)</h3>
              <p className="text-xs text-slate-500">Hanya FAQ berstatus publik yang muncul untuk donatur. Publik: {managedFaqs.filter((faq) => faq.isPublished).length} dari {managedFaqs.length}.</p></div>
            <button type="button" onClick={() => openFaqEditor()} className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white">Tambah FAQ</button>
          </div>
          {cmsLoading ? <p className="text-sm text-slate-500">Memuat FAQ...</p> : managedFaqs.length === 0 ?
            <p className="text-sm text-slate-500">Belum ada FAQ CMS.</p> :
            <div className="divide-y divide-slate-100">{managedFaqs.map(faq => (
              <div key={faq.id} className="py-4 flex flex-wrap gap-3 items-start justify-between">
                <div className="min-w-0 flex-1"><h4 className="font-bold text-sm text-slate-900">{faq.question}</h4>
                  <p className="text-xs text-slate-600 mt-1 whitespace-pre-line">{faq.answer}</p>
                  <p className="text-xs text-slate-400 mt-2">{faq.category} · Urutan {faq.sortOrder} · {faq.isPublished ? 'Publik' : 'Belum dipublikasikan'}</p></div>
                <div className="flex gap-2">
                  <button type="button" disabled={cmsBusy} onClick={() => openFaqEditor(faq)} className="border border-slate-200 rounded-lg text-xs px-3 py-2 font-bold">Edit</button>
                  <button type="button" disabled={cmsBusy} onClick={() => handleDeleteFaqRecord(faq)} className="border border-rose-200 text-rose-700 rounded-lg text-xs px-3 py-2 font-bold">Hapus</button>
                </div>
              </div>
            ))}</div>}
        </section>
      )}

      {isArticleModalOpen && ReactDOM.createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-3 py-4 sm:p-6"
          style={{ zIndex: 100000, position: 'fixed' }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !cmsBusy) setIsArticleModalOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cms-article-dialog-title"
            className="flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            style={{ maxHeight: 'min(90dvh, 860px)' }}
          >
            <form onSubmit={handleAddArticleSubmit} className="flex min-h-0 flex-col">
              <header className="flex flex-none items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-7">
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">CMS · Artikel & Berita</div>
                  <h2 id="cms-article-dialog-title" className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                    {editingArticle ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">Konten disimpan melalui Laravel dan MySQL.</p>
                </div>
                <button
                  type="button" aria-label="Tutup editor artikel" disabled={cmsBusy}
                  onClick={() => setIsArticleModalOpen(false)}
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                >×</button>
              </header>

              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
                  <label className="block text-xs font-bold text-slate-700">
                    Judul Artikel <span className="text-rose-600">*</span>
                    <input autoFocus required minLength="3" maxLength="200" value={articleTitle}
                      disabled={cmsBusy} onChange={(e) => setArticleTitle(e.target.value)}
                      placeholder="Contoh: Informasi program kegiatan"
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50" />
                  </label>
                  <label className="block text-xs font-bold text-slate-700">
                    Status Publikasi
                    <select value={articleStatus} disabled={cmsBusy} onChange={(e) => setArticleStatus(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                      <option value="draft">Draft</option>
                      <option value="published">Terbit</option>
                    </select>
                  </label>
                </div>

                <label className="block text-xs font-bold text-slate-700">
                  Ringkasan <span className="font-normal text-slate-400">(opsional)</span>
                  <textarea rows="2" maxLength="1000" value={articleExcerpt} disabled={cmsBusy}
                    onChange={(e) => setArticleExcerpt(e.target.value)}
                    placeholder="Ringkasan singkat yang tampil di daftar artikel..."
                    className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50" />
                </label>

                <label className="block text-xs font-bold text-slate-700">
                  Isi Artikel <span className="text-rose-600">*</span>
                  <textarea required minLength="10" rows="6" value={articleContent} disabled={cmsBusy}
                    onChange={(e) => setArticleContent(e.target.value)}
                    placeholder="Tulis isi artikel atau berita secara lengkap..."
                    className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm font-normal leading-6 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50" />
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
                  <label className="block rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs font-bold text-slate-700">
                    Foto Sampul <span className="font-normal text-slate-500">(opsional)</span>
                    <span className="mt-1 block text-[11px] font-normal text-slate-500">JPG, PNG, WebP · maksimal 3 MB. Foto baru diunggah setelah artikel tersimpan.</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" disabled={cmsBusy}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file && file.size > 3 * 1024 * 1024) {
                          setCmsError('Ukuran sampul maksimal 3 MB.');
                          e.target.value = '';
                          setArticleCover(null);
                          return;
                        }
                        setCmsError('');
                        setArticleCover(file);
                      }}
                      className="mt-3 block w-full cursor-pointer text-xs font-normal text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-3 file:py-2 file:font-bold file:text-emerald-800" />
                  </label>
                  <div className="flex min-h-[126px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    {(articleCoverPreview || editingArticle?.image) ? (
                      <img src={articleCoverPreview || editingArticle.image} alt="Pratinjau foto sampul" className="h-32 w-full object-cover" />
                    ) : (
                      <div className="px-4 text-center text-xs text-slate-400">Belum ada foto sampul</div>
                    )}
                  </div>
                </div>
                {cmsError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{cmsError}</div>}
              </div>

              <footer className="flex flex-none flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
                <p className="hidden text-xs text-slate-500 sm:block">{articleStatus === 'draft' ? 'Draft tidak terlihat oleh publik.' : 'Artikel terbit akan terlihat pada halaman publik.'}</p>
                <div className="ml-auto flex items-center gap-2">
                  <button type="button" disabled={cmsBusy} onClick={() => setIsArticleModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Batal</button>
                  <button type="submit" disabled={cmsBusy} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50">
                    {cmsBusy ? 'Menyimpan...' : 'Simpan ke Database'}
                  </button>
                </div>
              </footer>
            </form>
          </section>
        </div>,
        document.body
      )}

      {isFaqModalOpen && ReactDOM.createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-3 py-4 sm:p-6"
          style={{ zIndex: 100000, position: 'fixed' }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !cmsBusy) setIsFaqModalOpen(false);
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="cms-faq-dialog-title"
            className="flex w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            style={{ maxHeight: 'min(90dvh, 760px)' }}>
            <form onSubmit={handleAddFaqSubmit} className="flex min-h-0 flex-col">
              <header className="flex flex-none items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-7">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">CMS · Tanya Jawab</div>
                  <h2 id="cms-faq-dialog-title" className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                    {editingFaq ? 'Edit FAQ' : 'Tambah FAQ'}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">Pertanyaan yang dipublikasikan akan tampil di website.</p>
                </div>
                <button type="button" aria-label="Tutup editor FAQ" disabled={cmsBusy}
                  onClick={() => setIsFaqModalOpen(false)}
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600 hover:bg-slate-200 disabled:opacity-50">×</button>
              </header>

              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7">
                <label className="block text-xs font-bold text-slate-700">Pertanyaan <span className="text-rose-600">*</span>
                  <input autoFocus required minLength="5" maxLength="1000" value={faqQuestion} disabled={cmsBusy}
                    onChange={(e) => setFaqQuestion(e.target.value)} placeholder="Contoh: Bagaimana cara berdonasi?"
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                </label>
                <label className="block text-xs font-bold text-slate-700">Jawaban <span className="text-rose-600">*</span>
                  <textarea required minLength="3" rows="5" value={faqAnswer} disabled={cmsBusy}
                    onChange={(e) => setFaqAnswer(e.target.value)} placeholder="Tulis jawaban yang jelas dan mudah dipahami..."
                    className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm font-normal leading-6 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-bold text-slate-700">Kategori
                    <select value={faqCategory} disabled={cmsBusy} onChange={(e) => setFaqCategory(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500">
                      {['Umum','Donasi','Kunjungan','Transparansi'].map((category) => <option key={category} value={category}>{category}</option>)}
                    </select>
                  </label>
                  <label className="block text-xs font-bold text-slate-700">Urutan
                    <input type="number" min="0" max="65535" value={faqOrder} disabled={cmsBusy}
                      onChange={(e) => setFaqOrder(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500" />
                    <span className="mt-1 block text-[11px] font-normal text-slate-500">Angka kecil tampil lebih dahulu.</span>
                  </label>
                </div>
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <input type="checkbox" checked={faqPublished} disabled={cmsBusy} onChange={(e) => setFaqPublished(e.target.checked)}
                    className="h-4 w-4 accent-emerald-600" />
                  <span className="text-xs text-slate-700"><strong className="block text-sm text-slate-900">Publikasikan FAQ</strong>
                    FAQ yang belum dipublikasikan hanya muncul pada CMS pengurus.
                  </span>
                </label>
                {cmsError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{cmsError}</div>}
              </div>

              <footer className="flex flex-none items-center justify-end gap-2 border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
                <button type="button" disabled={cmsBusy} onClick={() => setIsFaqModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Batal</button>
                <button type="submit" disabled={cmsBusy} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50">
                  {cmsBusy ? 'Menyimpan...' : 'Simpan ke Database'}
                </button>
              </footer>
            </form>
          </section>
        </div>,
        document.body
      )}
    </div>
  );
};

window.ContentManagement = ContentManagement;
