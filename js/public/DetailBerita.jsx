// Public Detail Article Component
// SIMK-Panti - Detail Berita & Artikel Kegiatan

const DetailBerita = ({
  articleSlug = null,
  articles = [],
  onNavigateBack = null,
}) => {
  const [article, setArticle] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState('');
  React.useEffect(() => {
    let live = true;
    setLoading(true); setLoadError(''); setArticle(null);
    if (!articleSlug) { setLoading(false); setLoadError('Artikel tidak ditemukan.'); return; }
    CmsApi.getPublicArticle(articleSlug)
      .then(response => { if (live) setArticle(response?.data ? CmsApi.normalizeArticle(response.data) : null); })
      .catch(error => { if (live) setLoadError(error?.message || 'Artikel tidak ditemukan.'); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [articleSlug]);

  React.useEffect(() => {
    if (article) simkUpdateSeo('detail-berita', {
      title: article.title,
      description: (article.excerpt || article.content || '').slice(0, 155),
      image: article.image, article: true, date: article.published_at,
    });
  }, [article]);

  const handleBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    } else if (window.navigateToRoute) {
      window.navigateToRoute('/berita');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Daftar Berita</span>
      </button>

      {loading && <p className="text-sm text-slate-500">Memuat artikel...</p>}
      {loadError && <p role="alert" className="text-sm text-rose-700">{loadError}</p>}
      {article &&       <article className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-6">
        <div className="space-y-3 border-b border-slate-100 pb-6">
          <div className="flex items-center space-x-3 text-xs text-slate-400 font-semibold">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.date}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <User className="w-3.5 h-3.5" />
              <span>{article.author}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {article.title}
          </h1>
        </div>

        {article.image && <div className="simk-protected-media rounded-2xl overflow-hidden aspect-video bg-slate-100 shadow-inner"><img src={article.image} alt={article.title} draggable={false} onContextMenu={(event) => event.preventDefault()} className="w-full h-full object-cover" /></div>}

        <div className="prose prose-emerald max-w-none text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {article.content}
        </div>
      </article>}
    </div>
  );
};

window.DetailBerita = DetailBerita;
