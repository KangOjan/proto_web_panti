// Main React Application Component
// SIMK-Panti

// Metadata updates on client-side navigation. Static index.html remains the fallback
// for crawlers that do not execute JS; true per-article SEO needs server rendering.
const SIMK_SEO_PAGES = Object.freeze({
  beranda: ['LKSA Taman Harapan Muhammadiyah Bandung', 'Informasi resmi lembaga, kegiatan, dan dukungan untuk anak asuh.'],
  profil: ['Profil Lembaga', 'Profil, legalitas, kepengurusan, dan kontak LKSA Taman Harapan Muhammadiyah.'],
  'public-donation': ['Donasi', 'Salurkan donasi untuk kegiatan dan program LKSA Taman Harapan Muhammadiyah.'],
  'public-dashboard': ['Transparansi Keuangan', 'Informasi transparansi pengelolaan dan donasi lembaga.'],
  berita: ['Artikel dan Berita', 'Berita dan informasi kegiatan LKSA Taman Harapan Muhammadiyah.'],
  faq: ['Pertanyaan Umum', 'Jawaban pertanyaan umum tentang donasi, program, dan kunjungan lembaga.'],
});
const simkSetMeta = (selector, attribute, value) => {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
};
const simkUpdateSeo = (tab, options = {}) => {
  const base = 'LKSA Taman Harapan Muhammadiyah';
  const page = SIMK_SEO_PAGES[tab];
  const noIndex = !page && tab !== 'detail-berita' && tab !== 'detail-campaign';
  const title = options.title || (page ? page[0] : base);
  const description = options.description || (page ? page[1] : 'Informasi resmi lembaga.');
  const pathname = window.location.pathname;
  const canonical = `https://tamanharapanmu.com${pathname === '/beranda' ? '/' : pathname}`;
  document.title = `${title} | SIMK-Panti`;
  simkSetMeta('meta[name="description"]', 'content', description);
  simkSetMeta('meta[name="robots"]', 'content', noIndex ? 'noindex,nofollow' : 'index,follow');
  simkSetMeta('meta[property="og:title"]', 'content', title);
  simkSetMeta('meta[property="og:description"]', 'content', description);
  simkSetMeta('meta[property="og:url"]', 'content', canonical);
  simkSetMeta('meta[property="og:type"]', 'content', options.article ? 'article' : 'website');
  if (options.image) {
    const image = new URL(options.image, window.location.origin).href;
    simkSetMeta('meta[property="og:image"]', 'content', image);
    simkSetMeta('meta[name="twitter:image"]', 'content', image);
  }
  simkSetMeta('meta[name="twitter:title"]', 'content', title);
  simkSetMeta('meta[name="twitter:description"]', 'content', description);
  const node = document.getElementById('simk-page-jsonld');
  if (node) {
    const pageSchema = options.article ? {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: title, description, mainEntityOfPage: canonical,
      ...(options.image ? { image: new URL(options.image, window.location.origin).href } : {}),
      publisher: { '@type': 'NGO', name: base },
      ...(options.date ? { datePublished: options.date } : {}),
    } : options.campaign ? {
      '@context': 'https://schema.org', '@type': 'WebPage',
      name: title, description, url: canonical,
    } : null;
    node.textContent = pageSchema ? JSON.stringify(pageSchema) : '';
  }
  simkSetMeta('link[rel="canonical"]', 'href', canonical);
};

// UI-only route permissions. Laravel middleware/policies MUST enforce these roles
// independently on every protected API endpoint.
const SIMK_PROTECTED_ROUTES = Object.freeze({
  'admin-dashboard': ['pengurus_harian', 'pemimpin_lembaga'],
  'admin-verifikasi': ['pengurus_harian'],
  'admin-offline': ['pengurus_harian'],
  'admin-campaign': ['pengurus_harian'],
  'admin-konten': ['pengurus_harian'],
  'dashboard': ['pengurus_harian', 'pemimpin_lembaga'],
  'transactions': ['pengurus_harian', 'pemimpin_lembaga'],
  'report': ['pengurus_harian', 'pemimpin_lembaga'],
  'programs': ['pengurus_harian', 'pemimpin_lembaga'],
  'audit': ['pengurus_harian', 'pemimpin_lembaga'],
  'organization-profile-management': ['pengurus_harian'],
  'approval': ['pemimpin_lembaga'],
});

const simkUserRole = (user) => {
  const role = user?.role?.value ?? user?.role ?? null;
  return typeof role === 'string' ? role.trim().toLowerCase() : null;
};

// Resolve only known routes. URL state never grants backend permissions.
const SIMK_ROUTE_TABLE = Object.freeze({
  '/': 'beranda',
  '/beranda': 'beranda',
  '/profil': 'profil',
  '/donasi': 'public-donation',
  '/keuangan-publik': 'public-dashboard',
  '/transparansi': 'public-dashboard',
  '/berita': 'berita',
  '/faq': 'faq',
  '/login': 'auth',
  '/register': 'auth',
  '/pengelola/dashboard': 'admin-dashboard',
  '/admin/dashboard': 'admin-dashboard',
  '/pengelola/verifikasi-donasi': 'admin-verifikasi',
  '/admin/verifikasi-donasi': 'admin-verifikasi',
  '/pengelola/donasi-offline': 'admin-offline',
  '/admin/donasi-offline': 'admin-offline',
  '/pengelola/campaign': 'admin-campaign',
  '/admin/campaign': 'admin-campaign',
  '/pengelola/konten': 'admin-konten',
  '/admin/konten': 'admin-konten',
  '/pengelola/buku-kas': 'transactions',
  '/pengelola/transaksi': 'transactions',
  '/dashboard': 'dashboard',
  '/transaksi': 'transactions',
  '/laporan': 'report',
  '/program': 'programs',
  '/approval': 'approval',
  '/audit': 'audit',
  '/organization-profile-management': 'organization-profile-management',
});

const SIMK_CANONICAL_PATHS = Object.freeze({
  beranda: '/', profil: '/profil', 'public-donation': '/donasi',
  'public-dashboard': '/keuangan-publik', berita: '/berita', faq: '/faq',
  'admin-dashboard': '/pengelola/dashboard',
  'admin-verifikasi': '/pengelola/verifikasi-donasi',
  'admin-offline': '/pengelola/donasi-offline',
  'admin-campaign': '/pengelola/campaign',
  'admin-konten': '/pengelola/konten',
  dashboard: '/dashboard', transactions: '/pengelola/buku-kas',
  report: '/laporan', programs: '/program', approval: '/approval',
  audit: '/audit',
  'organization-profile-management': '/organization-profile-management',
});

const simkResolveRoute = (route) => {
  if (typeof route !== 'string' || !route.trim()) return null;
  const clean = route.split(/[?#]/, 1)[0].trim();
  const path = clean.startsWith('/')
    ? (clean.replace(/\/+$/, '') || '/')
    : clean;

  const tab = SIMK_ROUTE_TABLE[path];
  if (tab) {
    return {
      tab,
      path: SIMK_CANONICAL_PATHS[tab] || path,
      authView: path === '/register' ? 'register' : 'login',
    };
  }

  // Existing components may pass tab keys rather than URL paths.
  if (Object.prototype.hasOwnProperty.call(SIMK_CANONICAL_PATHS, path)) {
    return { tab: path, path: SIMK_CANONICAL_PATHS[path] };
  }

  const legacy = {
    home: 'beranda',
    'public-donation': 'public-donation',
    'public-dashboard': 'public-dashboard',
    transaksi: 'transactions', report: 'report', program: 'programs',
    'admin-dashboard': 'admin-dashboard',
    'admin-verifikasi': 'admin-verifikasi',
    'admin-offline': 'admin-offline',
    'admin-campaign': 'admin-campaign',
    'admin-konten': 'admin-konten',
  };
  if (legacy[path]) {
    return { tab: legacy[path], path: SIMK_CANONICAL_PATHS[legacy[path]] };
  }

  if (path.startsWith('/campaign/') && path.length > '/campaign/'.length) {
    try {
      return {
        tab: 'detail-campaign', path,
        campaignId: decodeURIComponent(path.substring('/campaign/'.length)),
      };
    } catch { return null; }
  }
  if (path.startsWith('/berita/') && path.length > '/berita/'.length) {
    try {
      return {
        tab: 'detail-berita', path,
        articleSlug: decodeURIComponent(path.substring('/berita/'.length)),
      };
    } catch { return null; }
  }
  return null;
};

const App = () => {
  /*
  |--------------------------------------------------------------------------
  | Backend Financial Transaction State
  |--------------------------------------------------------------------------
  */

  const [
    financialTransactions,
    setFinancialTransactions,
  ] = React.useState([]);

  const [
    financialTransactionLoading,
    setFinancialTransactionLoading,
  ] = React.useState(false);

  const [
    financialTransactionError,
    setFinancialTransactionError,
  ] = React.useState(null);

  const [
    financialTransactionPagination,
    setFinancialTransactionPagination,
  ] = React.useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  const [
    financialTransactionRefreshKey,
    setFinancialTransactionRefreshKey,
  ] = React.useState(0);

  /*
  |--------------------------------------------------------------------------
  | Backend Campaign State
  |--------------------------------------------------------------------------
  */

  const [
    publicPrograms,
    setPublicPrograms,
  ] = React.useState([]);

  const [
    publicCampaignLoading,
    setPublicCampaignLoading,
  ] = React.useState(true);

  const [
    publicCampaignError,
    setPublicCampaignError,
  ] = React.useState(null);

  const [
    managedPrograms,
    setManagedPrograms,
  ] = React.useState([]);

  const [
    campaignLoading,
    setCampaignLoading,
  ] = React.useState(false);

  const [
    campaignError,
    setCampaignError,
  ] = React.useState(null);

  /*
  |--------------------------------------------------------------------------
  | Backend Organization Profile State
  |--------------------------------------------------------------------------
  */

  const [
    organizationProfile,
    setOrganizationProfile,
  ] = React.useState(null);

  const [
    organizationProfileLoading,
    setOrganizationProfileLoading,
  ] = React.useState(true);

  const [
    organizationProfileError,
    setOrganizationProfileError,
  ] = React.useState(null);

  /*
  |--------------------------------------------------------------------------
  | Authentication State
  |--------------------------------------------------------------------------
  */

  const [
    currentUser,
    setCurrentUser,
  ] = React.useState(null);

  // Do not render privileged pages before validating a saved token via /me.
  const [authStatus, setAuthStatus] = React.useState('checking');
  // One confirmation for both the admin Sidebar and public Navbar.
  const [logoutConfirmOpen, setLogoutConfirmOpen] = React.useState(false);
  const [logoutInProgress, setLogoutInProgress] = React.useState(false);
  const logoutCancelRef = React.useRef(null);

  React.useEffect(() => {
    if (!logoutConfirmOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    logoutCancelRef.current?.focus();
    const onEscape = (event) => {
      if (event.key === 'Escape' && !logoutInProgress) setLogoutConfirmOpen(false);
    };
    document.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener('keydown', onEscape);
    };
  }, [logoutConfirmOpen, logoutInProgress]);

  const isAuthenticated = authStatus === 'authenticated' && Boolean(currentUser);
  const currentRole = isAuthenticated ? simkUserRole(currentUser) : null;
  const hasPengurusAccess = () => isAuthenticated && currentRole === 'pengurus_harian';
  const hasPemimpinAccess = () => isAuthenticated && currentRole === 'pemimpin_lembaga';
  const hasReadOnlyOversightAccess = () => isAuthenticated && ['pengurus_harian', 'pemimpin_lembaga'].includes(currentRole);

  /*
  |--------------------------------------------------------------------------
  | Backend User Approval State
  |--------------------------------------------------------------------------
  */

  const [
    approvalUsers,
    setApprovalUsers,
  ] = React.useState([]);

  const [
    approvalSummary,
    setApprovalSummary,
  ] = React.useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  const [
    approvalLoading,
    setApprovalLoading,
  ] = React.useState(false);

  const [
    approvalError,
    setApprovalError,
  ] = React.useState(null);

  const [
    approvalActionUserId,
    setApprovalActionUserId,
  ] = React.useState(null);

  /*
  |--------------------------------------------------------------------------
  | Navigation
  |--------------------------------------------------------------------------
  */

  // Read the URL on first render so /login, /register and deep links work.
  const [
    activeTab,
    setActiveTab,
  ] = React.useState(() => simkResolveRoute(window.location.pathname)?.tab || 'beranda');

  const [
    authView,
    setAuthView,
  ] = React.useState(() => simkResolveRoute(window.location.pathname)?.authView || 'login');

  const [
    selectedDonationContext,
    setSelectedDonationContext,
  ] = React.useState({
    allocationCategory:
      'lainnya',

    campaignId:
      null,

    campaignTitle:
      null,

    campaignSlug:
      null,
  });

  const [
    donations,
    setDonations,
  ] = React.useState([]); // Existing offline donation workflow.
  const [manualDonations, setManualDonations] = React.useState([]);
  const [manualDonationsLoading, setManualDonationsLoading] = React.useState(false);
  const [manualDonationsError, setManualDonationsError] = React.useState(null);
  const [manualDonationPage, setManualDonationPage] = React.useState(1);
  const [manualDonationLastPage, setManualDonationLastPage] = React.useState(1);

  const [
    articles,
    setArticles,
  ] = React.useState(
    []
  );

  const [
    faqs,
    setFaqs,
  ] = React.useState(
    []
  );

  const [
    selectedArticleSlug,
    setSelectedArticleSlug,
  ] = React.useState(simkResolveRoute(window.location.pathname)?.articleSlug || null);

  const [
    selectedCampaignId,
    setSelectedCampaignId,
  ] = React.useState(simkResolveRoute(window.location.pathname)?.campaignId || null);

  const [
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  ] = React.useState(false);

  // Desktop sidebar can be collapsed and restored independently from mobile.
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    simkUpdateSeo(activeTab);
  }, [activeTab, selectedArticleSlug, selectedCampaignId]);

  /*
  |--------------------------------------------------------------------------
  | UI State
  |--------------------------------------------------------------------------
  */

  const [
    isAddTrxModalOpen,
    setIsAddTrxModalOpen,
  ] = React.useState(false);

  const [
    editingTrx,
    setEditingTrx,
  ] = React.useState(null);

  const [
    trxToDelete,
    setTrxToDelete,
  ] = React.useState(null);

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = React.useState(false);

  const [
    receiptData,
    setReceiptData,
  ] = React.useState(null);

  const [
    isReceiptModalOpen,
    setIsReceiptModalOpen,
  ] = React.useState(false);

  const [
    toast,
    setToast,
  ] = React.useState(null);

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const showToast = (
    message,
    type = 'success'
  ) => {
    setToast({
      message,
      type,
    });

    window.setTimeout(
      () => {
        setToast(null);
      },
      4000
    );
  };

  const mapCampaignCategoryToDonationAllocation =
    (categoryName = '') => {
      const normalized =
        String(categoryName)
          .trim()
          .toLowerCase();

      if (
        normalized.includes(
          'kebutuhan harian'
        ) ||
        normalized.includes(
          'konsumsi'
        ) ||
        normalized.includes(
          'gizi'
        )
      ) {
        return 'konsumsi';
      }

      if (
        normalized.includes(
          'perlengkapan anak'
        ) ||
        normalized.includes(
          'pendidikan'
        ) ||
        normalized.includes(
          'spp'
        ) ||
        normalized.includes(
          'sekolah'
        )
      ) {
        return 'spp_pendidikan';
      }

      if (
        normalized.includes(
          'operasional'
        ) ||
        normalized.includes(
          'asrama'
        )
      ) {
        return 'operasional';
      }

      if (
        normalized.includes(
          'donasi rutin'
        ) ||
        normalized.includes(
          'rutin'
        )
      ) {
        return 'donasi_rutin';
      }

      if (
        normalized.includes(
          'infak'
        ) ||
        normalized.includes(
          'zakat'
        )
      ) {
        return 'infak_zakat';
      }

      return 'lainnya';
    };

  const openPublicDonation =
    (
      contextOrCategory =
        'Lainnya'
    ) => {
      if (
        typeof contextOrCategory ===
        'string'
      ) {
        setSelectedDonationContext({
          allocationCategory:
            mapCampaignCategoryToDonationAllocation(
              contextOrCategory
            ),

          campaignId:
            null,

          campaignTitle:
            null,

          campaignSlug:
            null,
        });
      } else {
        setSelectedDonationContext({
          allocationCategory:
            mapCampaignCategoryToDonationAllocation(
              contextOrCategory
                ?.campaignCategory ||
              contextOrCategory
                ?.allocationCategory ||
              ''
            ),

          campaignId:
            contextOrCategory
              ?.campaignId ??
            null,

          campaignTitle:
            contextOrCategory
              ?.campaignTitle ||
            null,

          campaignSlug:
            contextOrCategory
              ?.campaignSlug ||
            null,
        });
      }

      setActiveTab(
        'public-donation'
      );
      if (window.location.pathname !== '/donasi') {
        window.history.pushState({}, '', '/donasi');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

  const navigateToRoute = (route, options = {}) => {
    const resolved = simkResolveRoute(route);
    if (!resolved) {
      showToast('Halaman tidak ditemukan.', 'rose');
      return false;
    }

    // Client-side guard is for UX only. Protected API authorization is Laravel's job.
    const permittedRoles = SIMK_PROTECTED_ROUTES[resolved.tab];
    if (permittedRoles && !isAuthenticated) {
      setAuthView('login');
      setActiveTab('auth');
      if (window.location.pathname !== '/login') {
        const method = options.fromHistory ? 'replaceState' : 'pushState';
        window.history[method]({}, '', '/login');
      }
      if (authStatus !== 'checking') {
        showToast('Silakan login dengan akun Laravel untuk mengakses halaman ini.', 'info');
      }
      return false;
    }
    if (permittedRoles && !permittedRoles.includes(currentRole)) {
      showToast('Akun Anda tidak memiliki izin untuk halaman tersebut.', 'rose');
      return false;
    }

    if (resolved.tab === 'auth') setAuthView(resolved.authView);
    if (resolved.tab === 'detail-campaign') setSelectedCampaignId(resolved.campaignId);
    if (resolved.tab === 'detail-berita') setSelectedArticleSlug(resolved.articleSlug);
    setActiveTab(resolved.tab);

    // pushState is skipped on popstate to preserve browser Back/Forward.
    if (!options.fromHistory && window.location.pathname !== resolved.path) {
      window.history.pushState({}, '', resolved.path);
    }
    window.scrollTo({ top: 0, behavior: options.fromHistory ? 'instant' : 'smooth' });
    return true;
  };

  React.useEffect(() => {
    // Back/Forward synchronizes the displayed component, not just the address bar.
    const onPopState = () => navigateToRoute(window.location.pathname, { fromHistory: true });
    window.addEventListener('popstate', onPopState);
    window.navigateToRoute = navigateToRoute; // Kept for existing components.
    return () => {
      window.removeEventListener('popstate', onPopState);
      if (window.navigateToRoute === navigateToRoute) {
        delete window.navigateToRoute;
      }
    };
  }, [navigateToRoute]);

  // This is navigation only, NEVER authentication or role impersonation.
  const handleSwitchUserRole = (targetRole) => {
    if (!targetRole) {
      navigateToRoute('/beranda');
      return;
    }

    const requestedRole = targetRole === 'Pengurus Harian'
      ? 'pengurus_harian'
      : targetRole === 'Pemimpin Lembaga'
        ? 'pemimpin_lembaga'
        : targetRole;

    if (!isAuthenticated) {
      navigateToRoute('/login');
      return;
    }

    if (currentRole !== requestedRole) {
      showToast('Role akun tidak sesuai. Pergantian role harus melalui autentikasi Laravel.', 'rose');
      return;
    }

    navigateToRoute(requestedRole === 'pengurus_harian' ? '/pengelola/dashboard' : '/approval');
  };

  const loadManualDonations = async (page = 1) => {
    if (!hasPengurusAccess()) return;
    setManualDonationsLoading(true);
    setManualDonationsError(null);
    try {
      const response = await DonationApi.getManualTransferDonations(page);
      const items = Array.isArray(response?.data?.items) ? response.data.items : [];
      setManualDonationPage(Number(response?.data?.pagination?.current_page) || 1);
      setManualDonationLastPage(Number(response?.data?.pagination?.last_page) || 1);
      setManualDonations(items.map((item) => ({
        id: item.public_id || item.id,
        donorName: item.donor_name || 'Hamba Allah',
        phone: item.phone || null,
        email: item.email || null,
        campaignTitle: item.campaign?.title || 'Donasi Umum',
        amount: Number(item.amount) || 0,
        createdAt: item.created_at || null,
        status: String(item.status).toLowerCase() === 'verified' ? 'Terverifikasi'
          : String(item.status).toLowerCase() === 'cancelled' ? 'Ditolak' : 'Pending',
        type: 'manual_transfer',
        hasProof: item.has_payment_proof === true,
      })));
    } catch (error) {
      setManualDonationsError(error?.message || 'Gagal memuat antrean transfer manual.');
      setManualDonations([]);
    } finally {
      setManualDonationsLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'admin-verifikasi' && hasPengurusAccess()) {
      loadManualDonations();
    }
  }, [activeTab, currentUser]);

  const handleApproveDonation = async (publicId) => {
    if (!hasPengurusAccess()) return false;
    if (!window.confirm('Pastikan mutasi rekening resmi sudah dicek dan dana benar-benar diterima. Lanjutkan verifikasi?')) return false;
    try {
      await DonationApi.verifyManualTransfer(publicId);
      await loadManualDonations();
      setFinancialTransactionRefreshKey((key) => key + 1);
      showToast('Transfer diverifikasi dan dicatat satu kali di Buku Kas.');
      return true;
    } catch (error) {
      showToast(error?.message || 'Verifikasi gagal.', 'rose');
      return false;
    }
  };

  const handleRejectDonation = async (publicId, reasonCode) => {
    if (!hasPengurusAccess()) return false;
    if (!window.confirm('Tolak bukti ini? Donasi tidak akan masuk Buku Kas.')) return false;
    try {
      await DonationApi.rejectManualTransfer(publicId, reasonCode);
      await loadManualDonations();
      showToast('Pengajuan transfer manual ditolak.', 'info');
      return true;
    } catch (error) {
      showToast(error?.message || 'Penolakan gagal.', 'rose');
      return false;
    }
  };

  const handleAddOfflineDonation = async (payload) => {
    if (!hasPengurusAccess()) {
      showToast('Login Pengurus Harian diperlukan.', 'rose');
      return false;
    }
    if (payload.kind !== 'uang') {
      showToast('Donasi barang belum didukung API. Jangan mencatatnya sebagai penerimaan kas.', 'rose');
      return false;
    }
    try {
      const campaign = publicPrograms.find((item) => String(item.id) === String(payload.campaignId));
      const response = await apiRequest('/pengurus/donations/offline', {
        method: 'POST',
        body: JSON.stringify({
          campaign_id: campaign ? Number(campaign.id) : null,
          allocation_category: campaign
            ? mapCampaignCategoryToDonationAllocation(campaign.category)
            : 'lainnya',
          donor_name: payload.donorName,
          amount: Number(payload.amount),
          note: payload.message || null,
          publish_identity: false,
        }),
      });
      if (!response?.success || !response?.data) throw new Error('Backend tidak mengonfirmasi donasi.');
      const saved = response.data;
      setDonations((prev) => [{
        id: saved.public_id || saved.id,
        donorName: payload.donorName,
        campaignId: campaign?.id || null,
        campaignTitle: campaign?.title || 'Donasi Umum',
        amount: Number(payload.amount),
        message: payload.message || '',
        createdAt: saved.created_at || new Date().toISOString(),
        status: 'Pending',
        type: 'offline', kind: 'uang',
      }, ...prev]);
      showToast('Donasi offline disimpan sebagai PENDING. Verifikasi agar masuk buku kas.');
      setFinancialTransactionRefreshKey((key) => key + 1);
      return true;
    } catch (error) {
      showToast(error?.message || 'Donasi gagal disimpan ke backend.', 'rose');
      return false;
    }
  };

  // Verify only offline donations; the Laravel service owns ledger and audit writes.
  const handleVerifyOfflineDonation = async (publicId) => {
    if (!hasPengurusAccess()) {
      showToast('Hanya Pengurus Harian yang boleh memverifikasi donasi.', 'rose');
      return false;
    }
    try {
      if (!publicId) throw new Error('ID publik donasi tidak tersedia.');
      const response = await DonationApi.verifyOfflineDonation(publicId);
      if (response?.success !== true || !response?.data) {
        throw new Error(response?.message || 'Laravel belum mengonfirmasi verifikasi donasi.');
      }
      setFinancialTransactionRefreshKey((key) => key + 1);
      showToast('Donasi berhasil diverifikasi. Periksa catatan penerimaan pada Buku Kas.', 'success');
      return true;
    } catch (error) {
      showToast(error?.message || 'Verifikasi donasi gagal di backend.', 'rose');
      return false;
    }
  };

  // Legacy CampaignManagement callbacks: never treat local state as saved data.
  const handleSaveCampaign = async (payload) => {
    if (!hasPengurusAccess()) {
      showToast('Login Pengurus Harian diperlukan.', 'rose');
      return false;
    }
    try {
      const id = payload?.id;
      const existingId = /^\d+$/.test(String(id ?? '')) ? id : null;
      const response = existingId
        ? await CampaignApi.updateCampaign(existingId, payload)
        : await CampaignApi.createCampaign(payload);
      if (!response?.data) throw new Error('API tidak mengonfirmasi penyimpanan campaign.');
      const [managementLoaded] = await Promise.all([loadManagedCampaigns(), refreshPublicPrograms()]);
      showToast(managementLoaded
        ? (payload?.status === 'draft' ? 'Campaign tersimpan sebagai Draft. Hanya muncul di CMS sampai diaktifkan.' : 'Campaign berhasil disimpan dan tersedia di Manajemen Campaign.')
        : 'Campaign tersimpan, tetapi daftar pengurus gagal dimuat. Muat ulang halaman.',
        managementLoaded ? 'success' : 'rose');
      return true;
    } catch (error) {
      const message = error?.errors
        ? Object.values(error.errors).flat().join(' ')
        : error?.message || 'Campaign gagal disimpan.';
      showToast(message, 'rose');
      return { success: false, message };
    }
  };

  // For auditability, deactivate instead of silently deleting from local UI.
  const handleDeleteCampaign = async (id) => {
    if (!hasPengurusAccess()) {
      showToast('Login Pengurus Harian diperlukan.', 'rose');
      return false;
    }
    try {
      const response = await CampaignApi.updateCampaign(id, { status: 'inactive' });
      if (!response?.data) throw new Error('API tidak mengonfirmasi penonaktifan campaign.');
      await Promise.all([loadManagedCampaigns(), refreshPublicPrograms()]);
      showToast('Campaign dinonaktifkan melalui database.', 'info');
      return true;
    } catch (error) {
      showToast(error?.message || 'Gagal menonaktifkan campaign.', 'rose');
      return false;
    }
  };

  const handleAddCampaignUpdate = async (campaignId, updatePayload) => {
    if (!hasPengurusAccess()) throw new Error('Login Pengurus Harian diperlukan.');
    try {
      if (!window.CampaignApi) throw new Error('API campaign belum tersedia.');
      await CampaignApi.createPengurusUpdate(campaignId, {
        title: updatePayload.title,
        content: updatePayload.content,
        status: updatePayload.status === 'draft' ? 'draft' : 'published',
      });
      showToast('Kabar perkembangan berhasil disimpan di database.');
    } catch (error) {
      console.error('Gagal menyimpan perkembangan:', error);
      showToast(error?.message || 'Gagal menyimpan kabar perkembangan.');
      throw error;
    }
  };

  const handleSaveProfile = async (updatedProfile) => {
    if (!hasPengurusAccess()) {
      showToast('Login Pengurus Harian diperlukan.', 'rose');
      return false;
    }
    try {
      if (!window.CmsApi) throw new Error('API CMS tidak tersedia.');
      const response = await CmsApi.updateProfile({
        name: updatedProfile.name,
        tagline: updatedProfile.tagline,
        history: updatedProfile.history,
        vision: updatedProfile.vision,
        missions: Array.isArray(updatedProfile.missions) ? updatedProfile.missions : [],
        contact_info: {
          address: updatedProfile.contactInfo?.address || null,
          phone: updatedProfile.contactInfo?.phone || null,
          whatsapp: updatedProfile.contactInfo?.whatsapp || null,
          email: updatedProfile.contactInfo?.email || null,
        },
      });
      if (!response?.success || !response?.data) throw new Error('Server tidak mengonfirmasi perubahan profil.');
      const persisted = CmsApi.normalizeProfile(response.data);
      setOrganizationProfile(persisted);
      showToast('Profil CMS berhasil disimpan ke database.');
      return true;
    } catch (error) {
      showToast(error?.status === 401 || error?.status === 403
        ? 'Login Laravel sebagai Pengurus Harian diperlukan untuk mengedit CMS.'
        : error?.message || 'Penyimpanan profil ke database gagal.', 'rose');
      return false;
    }
  };

  // Legacy callbacks still passed as props. Never simulate persistence in React.
  // ContentManagement currently uses CmsApi itself; these remain safe if reused.
  const handleSaveArticle = async (article) => {
    if (!hasPengurusAccess()) return false;
    try {
      const payload = {
        title: article?.title,
        excerpt: article?.excerpt || '',
        content: article?.content,
        status: article?.status || 'draft',
      };
      const result = article?.id
        ? await CmsApi.updateArticle(article.id, payload)
        : await CmsApi.createArticle(payload);
      if (!result?.success) throw new Error('Artikel tidak tersimpan ke Laravel.');
      showToast('Artikel berhasil disimpan di database.');
      return true;
    } catch (error) {
      showToast(error?.message || 'Artikel gagal disimpan.', 'rose');
      return false;
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!hasPengurusAccess()) return false;
    try {
      const result = await CmsApi.deleteArticle(id);
      if (!result?.success) throw new Error('Artikel tidak terhapus di Laravel.');
      showToast('Artikel berhasil dihapus dari database.');
      return true;
    } catch (error) {
      showToast(error?.message || 'Penghapusan artikel gagal.', 'rose');
      return false;
    }
  };

  const handleSaveFaq = async (faq) => {
    if (!hasPengurusAccess()) return false;
    try {
      const payload = {
        question: faq?.question,
        answer: faq?.answer,
        category: faq?.category || 'Umum',
        sort_order: Number(faq?.sort_order ?? faq?.sortOrder ?? 0),
        is_published: faq?.is_published ?? faq?.isPublished ?? false,
      };
      const result = faq?.id
        ? await CmsApi.updateFaq(faq.id, payload)
        : await CmsApi.createFaq(payload);
      if (!result?.success) throw new Error('FAQ tidak tersimpan di Laravel.');
      showToast('FAQ berhasil disimpan di database.');
      return true;
    } catch (error) {
      showToast(error?.message || 'Penyimpanan FAQ gagal.', 'rose');
      return false;
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!hasPengurusAccess()) return false;
    try {
      const result = await CmsApi.deleteFaq(id);
      if (!result?.success) throw new Error('FAQ tidak terhapus di Laravel.');
      showToast('FAQ berhasil dihapus dari database.');
      return true;
    } catch (error) {
      showToast(error?.message || 'Penghapusan FAQ gagal.', 'rose');
      return false;
    }
  };

  const getCurrentUserName =
    () => {
      if (!currentUser) {
        return null;
      }

      return (
        currentUser.name ||
        currentUser.fullName ||
        currentUser.full_name ||
        currentUser.username ||
        null
      );
    };

  const normalizeCampaign =
    (campaign) => ({
      id: campaign.id,

      categoryId:
        campaign.category_id,

      category:
        campaign.category?.name ||
        'Lainnya',

      title:
        campaign.title,

      slug:
        campaign.slug,

      status:
        campaign.status,

      targetAmount:
        Number(
          campaign.target_amount ||
            0
        ),

      // Jangan menganggap nilai kosong berarti dana terkumpul Rp0.
      // Hanya tampilkan angka jika agregasi terverifikasi dikirim API.
      collectedAmount:
        campaign.collected_amount == null
          ? null
          : Number(campaign.collected_amount),

      // Dipakai halaman Detail Campaign. Keduanya berasal dari
      // agregasi donasi verified yang dikirim oleh API Laravel.
      verifiedCollectedAmount:
        campaign.collected_amount == null
          ? null
          : Number(campaign.collected_amount),

      verifiedDonationCount:
        campaign.verified_donation_count == null
          ? null
          : Number(campaign.verified_donation_count),

      // donor_count berbeda dengan verified_donation_count:
      // yang pertama dapat berarti orang unik, bukan jumlah transaksi.
      donorCount:
        campaign.donor_count == null
          ? null
          : Number(campaign.donor_count),

      description:
        campaign.description || '',

      deadline:
        campaign.deadline || null,

      headerImageUrl:
        CmsApi.normalizeMediaUrl(campaign.header_image_url),

      createdAt:
        campaign.created_at || null,

      updatedAt:
        campaign.updated_at || null,
    });

  /*
  |--------------------------------------------------------------------------
  | Campaign API
  |--------------------------------------------------------------------------
  */

  const fetchPublicPrograms =
    async () => {
      const response =
        await CampaignApi
          .getPublicCampaigns();

      if (!Array.isArray(response?.data)) {
        throw new Error('Format data campaign dari API tidak valid.');
      }

      // Pertahankan seluruh record dari API; UI publik memfilter
      // hanya campaign aktif yang belum melewati deadline.
      return response.data.map(normalizeCampaign);
    };

  const refreshPublicPrograms =
    async () => {
      setPublicCampaignLoading(true);
      setPublicCampaignError(null);
      try {
        const programs = await fetchPublicPrograms();
        setPublicPrograms(programs);
      } catch (error) {
        setPublicPrograms([]);
        setPublicCampaignError(error?.message || 'Gagal mengambil campaign.');
        console.error('Failed to load public campaigns:', error);
      } finally {
        setPublicCampaignLoading(false);
      }
    };

  const loadManagedCampaigns =
    async () => {
      try {
        setCampaignLoading(
          true
        );

        setCampaignError(
          null
        );

        const response =
          await CampaignApi
            .getPengurusCampaigns();

        if (!response?.success || !Array.isArray(response?.data)) {
          throw new Error('Respons daftar campaign CMS tidak sesuai format API Laravel.');
        }
        const campaigns = response.data;

        setManagedPrograms(
          campaigns.map(
            normalizeCampaign
          )
        );
        return true;
      } catch (error) {
        console.error(
          'Failed to load management campaigns:',
          error
        );

        setCampaignError(
          error?.message ||
            'Gagal mengambil data program pengurus.'
        );
        return false;
      } finally {
        setCampaignLoading(
          false
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Public Organization Profile API
  |--------------------------------------------------------------------------
  */

  const loadPublicOrganizationProfile =
    React.useCallback(
      async () => {
        try {
          setOrganizationProfileLoading(
            true
          );

          setOrganizationProfileError(
            null
          );

          const response =
            await CmsApi
              .getPublicProfile();

          setOrganizationProfile(
            CmsApi.normalizeProfile(
              response?.data ||
              null
            )
          );
        } catch (error) {
          console.error(
            'Failed to load public organization profile:',
            error
          );

          setOrganizationProfile(
            null
          );

          setOrganizationProfileError(
            error?.message ||
              'Gagal mengambil profil lembaga.'
          );
        } finally {
          setOrganizationProfileLoading(
            false
          );
        }
      },
      []
    );

  /*
  |--------------------------------------------------------------------------
  | Pemimpin Lembaga User Approval API
  |--------------------------------------------------------------------------
  */

  const loadUserApprovals =
    React.useCallback(
      async () => {
        if (
          !hasPemimpinAccess()
        ) {
          setApprovalUsers(
            []
          );

          setApprovalSummary({
            pending: 0,
            approved: 0,
            rejected: 0,
            total: 0,
          });

          setApprovalError(
            null
          );

          return;
        }

        try {
          setApprovalLoading(
            true
          );

          setApprovalError(
            null
          );

          const response =
            await UserApprovalApi
              .getUsers({
                per_page: 100,
              });

          const items =
            Array.isArray(
              response?.data?.items
            )
              ? response.data.items
              : [];

          setApprovalUsers(
            items.map(
              UserApprovalApi
                .normalizeUser
            )
          );

          setApprovalSummary(
            response?.data
              ?.summary ||
              {
                pending: 0,
                approved: 0,
                rejected: 0,
                total:
                  items.length,
              }
          );
        } catch (error) {
          console.error(
            'Failed to load user approval data:',
            error
          );

          setApprovalUsers(
            []
          );

          setApprovalSummary({
            pending: 0,
            approved: 0,
            rejected: 0,
            total: 0,
          });

          setApprovalError(
            error?.message ||
              'Gagal mengambil data persetujuan akun.'
          );
        } finally {
          setApprovalLoading(
            false
          );
        }
      },
      [
        currentUser,
      ]
    );

  /*
  |--------------------------------------------------------------------------
  | Financial Transaction API
  |--------------------------------------------------------------------------
  */

  const loadFinancialTransactions =
    React.useCallback(
      async (
        filters = {}
      ) => {
        if (
          !hasReadOnlyOversightAccess()
        ) {
          setFinancialTransactions(
            []
          );

          setFinancialTransactionError(
            null
          );

          setFinancialTransactionPagination({
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: 0,
          });

          return;
        }

        try {
          setFinancialTransactionLoading(
            true
          );

          setFinancialTransactionError(
            null
          );

          const response =
            await FinancialApi
              .getTransactions(
                filters
              );

          const items =
            Array.isArray(
              response?.data?.items
            )
              ? response.data.items
              : [];

          const normalized =
            items.map(
              (
                transaction
              ) =>
                FinancialApi
                  .normalizeTransaction(
                    transaction
                  )
            );

          setFinancialTransactions(
            normalized
          );

          setFinancialTransactionPagination(
            response?.data
              ?.pagination ||
              {
                current_page: 1,
                last_page: 1,
                per_page: 20,
                total:
                  normalized.length,
              }
          );
        } catch (error) {
          console.error(
            'Failed to load financial transactions:',
            error
          );

          setFinancialTransactionError(
            error?.message ||
              'Gagal mengambil transaksi keuangan.'
          );
        } finally {
          setFinancialTransactionLoading(
            false
          );
        }
      },
      [
        currentUser,
      ]
    );

  /*
  |--------------------------------------------------------------------------
  | Restore Authentication Session
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    let cancelled = false;

    const restoreSession =
      async () => {
        const token =
          sessionStorage.getItem(
            'access_token'
          );

        if (!token) {
          if (!cancelled) setAuthStatus('guest');
          return;
        }

        try {
          const response =
            await AuthApi.me();

          if (cancelled) {
            return;
          }

          const user = response?.data || null;
          if (!user || !['pengurus_harian', 'pemimpin_lembaga'].includes(simkUserRole(user))) {
            throw new Error('Profil/role akun tidak valid.');
          }
          setCurrentUser(user);
          setAuthStatus('authenticated');
        } catch {
          sessionStorage.removeItem(
            'access_token'
          );

          if (!cancelled) {
            setCurrentUser(null);
            setAuthStatus('guest');
          }
        }
      };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Load Pemimpin Lembaga Approval Summary
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    loadUserApprovals();
  }, [
    loadUserApprovals,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Load Public Campaigns
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    let cancelled = false;

    const loadPublicCampaigns = async () => {
      setPublicCampaignLoading(true);
      setPublicCampaignError(null);
      try {
        const programs = await fetchPublicPrograms();
        if (!cancelled) setPublicPrograms(programs);
      } catch (error) {
        console.error('Failed to load public campaigns:', error);
        if (!cancelled) {
          setPublicPrograms([]);
          setPublicCampaignError(error?.message || 'Gagal mengambil campaign.');
        }
      } finally {
        if (!cancelled) setPublicCampaignLoading(false);
      }
    };

    loadPublicCampaigns();
    return () => { cancelled = true; };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Load Public Organization Profile
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    loadPublicOrganizationProfile();
  }, [
    loadPublicOrganizationProfile,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Load Pengurus Campaigns
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    if (
      !['programs', 'admin-campaign'].includes(activeTab) ||
      !hasReadOnlyOversightAccess()
    ) {
      return;
    }

    loadManagedCampaigns();
  }, [
    activeTab,
    currentUser,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Authentication
  |--------------------------------------------------------------------------
  */

  const handleLogin =
    async (
      username,
      password
    ) => {
      try {
        const response =
          await AuthApi.login(
            username,
            password
          );

        const token =
          response?.data?.token ||
          response?.token;

        if (!token) {
          return {
            success: false,

            message:
              'Server tidak mengembalikan access token.',
          };
        }

        sessionStorage.setItem(
          'access_token',
          token
        );

        const profileResponse =
          await AuthApi.me();

        const user =
          profileResponse?.data;

        if (!user || !['pengurus_harian', 'pemimpin_lembaga'].includes(simkUserRole(user))) {
          sessionStorage.removeItem('access_token');

          return {
            success: false,

            message:
              'Profil pengguna tidak dapat dimuat.',
          };
        }

        setCurrentUser(user);
        setAuthStatus('authenticated');
        setIsMobileSidebarOpen(false);
        setIsDesktopSidebarOpen(true);

        const role = simkUserRole(user);
        const destination = role === 'pengurus_harian' ? '/pengelola/dashboard' : '/approval';
        setActiveTab(role === 'pengurus_harian' ? 'admin-dashboard' : 'approval');
        window.history.replaceState({}, '', destination);

        showToast(
          `Selamat datang kembali, ${
            user.name ||
            user.username
          }!`,
          'success'
        );

        return {
          success: true,
          user,
        };
      } catch (error) {
        sessionStorage.removeItem('access_token');
        setCurrentUser(null);
        setAuthStatus('guest');

        return {
          success: false,

          message:
            error?.message ||
            'Login gagal.',

          errors:
            error?.errors ||
            null,
        };
      }
    };

  const requestLogoutConfirmation = () => {
    if (!logoutInProgress) setLogoutConfirmOpen(true);
  };

  const handleLogout =
    async () => {
      let serverLogoutSucceeded = true;
      try {
        if (
          sessionStorage
            .getItem(
              'access_token'
            )
        ) {
          await AuthApi.logout();
        }
      } catch (error) {
        serverLogoutSucceeded = false;
        console.error('Server-side token revocation failed:', error);
      } finally {
        sessionStorage.removeItem(
          'access_token'
        );

        setCurrentUser(null);
        setAuthStatus('guest');
        setDonations([]);
        setManualDonations([]);
        setManualDonationPage(1);
        setManualDonationLastPage(1);
        setIsAddTrxModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsReceiptModalOpen(false);

        setApprovalUsers(
          []
        );

        setApprovalSummary({
          pending: 0,
          approved: 0,
          rejected: 0,
          total: 0,
        });

        setApprovalError(
          null
        );

        setApprovalActionUserId(
          null
        );

        setManagedPrograms(
          []
        );

        setFinancialTransactions(
          []
        );

        setFinancialTransactionError(
          null
        );

        setFinancialTransactionPagination({
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0,
        });

        setIsMobileSidebarOpen(false);
        setIsDesktopSidebarOpen(true);
        setActiveTab(
          'beranda'
        );
        window.history.replaceState({}, '', '/');

        showToast(
          serverLogoutSucceeded
            ? 'Anda telah keluar dari akun.'
            : 'Sesi lokal dihapus, tetapi pencabutan token di server gagal. Hubungi administrator bila perlu.',
          serverLogoutSucceeded ? 'info' : 'rose'
        );
      }
    };

  const confirmLogout = async () => {
    if (logoutInProgress) return;
    setLogoutInProgress(true);
    try {
      await handleLogout();
      setLogoutConfirmOpen(false);
    } catch (error) {
      showToast(error?.message || 'Tidak dapat mengakhiri sesi.', 'rose');
    } finally {
      setLogoutInProgress(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Account Registration
  |--------------------------------------------------------------------------
  */

  const handleRegisterSubmit =
    async (
      formData
    ) => {
      try {
        const payload = {
          name:
            formData.fullName
              .trim(),

          username:
            formData.username
              .trim(),

          nik:
            formData.nik
              .trim(),

          email:
            formData.email
              .trim(),

          phone:
            formData.phone
              .trim(),

          address:
            formData.address
              ?.trim() ||
            null,

          role:
            formData.role,

          password:
            formData.password,
        };

        const response =
          await AuthApi.register(
            payload
          );

        showToast(
          'Pendaftaran berhasil dikirim dan sedang menunggu persetujuan Pemimpin Lembaga.',
          'success'
        );

        return {
          success: true,
          data:
            response?.data ||
            null,
          message:
            response?.message ||
            'Pendaftaran berhasil dikirim.',
        };
      } catch (error) {
        const validationMessage =
          error?.errors
            ? Object.values(
                error.errors
              )
                .flat()
                .join(' ')
            : null;

        const message =
          validationMessage ||
          error?.message ||
          'Pendaftaran akun gagal.';

        showToast(
          message,
          'rose'
        );

        return {
          success: false,
          message,
          errors:
            error?.errors ||
            null,
        };
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Pemimpin Lembaga Account Approval
  |--------------------------------------------------------------------------
  */

  const handleApproveUser =
    async (
      userId
    ) => {
      if (!hasPemimpinAccess()) return { success: false };
      const targetUser =
        approvalUsers.find(
          (user) =>
            user.id ===
            userId
        );

      if (!targetUser) {
        return {
          success: false,
        };
      }

      try {
        setApprovalActionUserId(
          userId
        );

        await UserApprovalApi
          .approveUser(
            userId
          );

        showToast(
          `Akun ${targetUser.fullName} berhasil disetujui.`,
          'success'
        );

        await loadUserApprovals();

        return {
          success: true,
        };
      } catch (error) {
        console.error(
          'Failed to approve user:',
          error
        );

        showToast(
          error?.message ||
            'Akun gagal disetujui.',
          'rose'
        );

        return {
          success: false,
          error,
        };
      } finally {
        setApprovalActionUserId(
          null
        );
      }
    };

  const handleRejectUser =
    async (
      userId
    ) => {
      if (!hasPemimpinAccess()) return { success: false };
      const targetUser =
        approvalUsers.find(
          (user) =>
            user.id ===
            userId
        );

      if (!targetUser) {
        return {
          success: false,
        };
      }

      try {
        setApprovalActionUserId(
          userId
        );

        await UserApprovalApi
          .rejectUser(
            userId
          );

        showToast(
          `Akun ${targetUser.fullName} berhasil ditolak.`,
          'info'
        );

        await loadUserApprovals();

        return {
          success: true,
        };
      } catch (error) {
        console.error(
          'Failed to reject user:',
          error
        );

        showToast(
          error?.message ||
            'Akun gagal ditolak.',
          'rose'
        );

        return {
          success: false,
          error,
        };
      } finally {
        setApprovalActionUserId(
          null
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Financial Transactions
  |--------------------------------------------------------------------------
  |
  | Seluruh domain keuangan aktif menggunakan backend sebagai source of truth.
  | Backend menjadi source of truth untuk state transaksi keuangan pada App.
  |
  */

  const handleSaveTransaction =
    async (trxData) => {
      if (!hasPengurusAccess()) {
        showToast(
          'Anda tidak memiliki izin untuk mengubah transaksi.',
          'rose'
        );

        return {
          success: false,
        };
      }

      try {
        const payload =
          FinancialApi
            .buildTransactionPayload(
              trxData
            );

        let response;

        if (trxData.id) {
          response =
            await FinancialApi
              .updateTransaction(
                trxData.id,
                payload
              );
        } else {
          response =
            await FinancialApi
              .createTransaction(
                payload
              );
        }

        if (
          !response?.data
        ) {
          throw new Error(
            'Server tidak mengembalikan data transaksi.'
          );
        }

        const transaction =
          FinancialApi
            .normalizeTransaction(
              response.data
            );

        showToast(
          trxData.id
            ? `Transaksi ${transaction.id} berhasil diperbarui.`
            : `Transaksi ${transaction.id} berhasil dicatat.`,
          'success'
        );

        setEditingTrx(
          null
        );

        setIsAddTrxModalOpen(
          false
        );

        setFinancialTransactionRefreshKey(
          (previous) =>
            previous + 1
        );

        // Penerbitan kwitansi adalah tindakan terpisah, tidak otomatis saat transaksi dibuat.
        // Klik Cetak dari Buku Kas untuk membekukan nilai kwitansi sekali secara idempotent.
        if (transaction.type === 'pemasukan') {
          showToast('Transaksi tersimpan. Pilih Cetak pada Buku Kas untuk menerbitkan kwitansi tetap.', 'success');
        } else {
          await handlePrintTransactionReceipt(transaction);
        }

        return {
          success: true,
          data:
            transaction,
        };
      } catch (error) {
        console.error(
          'Failed to save financial transaction:',
          error
        );

        const validationMessage =
          error?.errors
            ? Object.values(
                error.errors
              )
                .flat()
                .join(' ')
            : null;

        showToast(
          validationMessage ||
            error?.message ||
            'Transaksi gagal disimpan.',
          'rose'
        );

        return {
          success: false,
          error,
        };
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Public Donation
  |--------------------------------------------------------------------------
  |
  | Donation dibuat terlebih dahulu di backend.
  | Payment initiation kemudian memakai public_id donation tersebut.
  | Jika payment initiation gagal setelah donation tercatat, retry memakai
  | donation yang sama agar tidak membuat duplicate donation record.
  |
  */

  const handleManualDonationSubmit = async (donationData) => {
    try {
      const payload = {
        campaign_id: donationData.campaignId ?? null,
        submission_token: donationData.submissionToken,
        allocation_category: donationData.category,
        donor_name: donationData.donorName.trim(),
        phone: donationData.phone?.trim() || null,
        email: donationData.email?.trim() || null,
        amount: Number(donationData.amount),
        donor_message: donationData.note?.trim() || null,
        publish_message: donationData.publishMessage === true,
        publish_identity: donationData.isAnonymous !== true,
      };
      const response = await DonationApi.createManualTransferDonation(payload, donationData.proofFile);
      if (!response?.success || !response?.data?.public_id) {
        throw new Error(response?.message || 'Server tidak mengonfirmasi bukti.');
      }
      showToast('Bukti diterima. Menunggu verifikasi pengurus.');
      return { success: true, donation: response.data };
    } catch (error) {
      const message = error?.errors
        ? Object.values(error.errors).flat().join(' ') : error?.message || 'Upload bukti gagal.';
      showToast(message, 'rose');
      return { success: false, message };
    }
  };

  const handlePublicDonationSubmit =
    async (
      donationData,
      existingDonation = null
    ) => {
      let donation =
        existingDonation;

      try {
        if (!donation?.public_id) {
          const donationPayload = {
            campaign_id:
              donationData
                .campaignId ??
              null,

            // Kompatibilitas sementara: backend saat ini masih memakai field ini.
            // TODO Laravel: hitung kembali berdasarkan campaign_id di server,
            // jangan mempercayai kode kategori yang dikirim browser.
            allocation_category:
              donationData.category,

            donor_name:
              donationData
                .donorName
                .trim(),

            phone:
              donationData.phone
                ?.trim() ||
              null,

            email:
              donationData.email
                ?.trim() ||
              null,

            amount:
              Number(
                donationData.amount
              ),

            donor_message:
              donationData.note
                ?.trim() ||
              null,

            publish_message:
              donationData.publishMessage === true,

            publish_identity:
              donationData.isAnonymous !== true,
          };

          const donationResponse =
            await DonationApi
              .createPublicDonation(
                donationPayload
              );

          donation =
            donationResponse?.data;

          if (!donation?.public_id) {
            throw new Error(
              'Server tidak mengembalikan public ID donasi.'
            );
          }
        }

        const paymentResponse =
          await PaymentApi
            .initiate(
              donation.public_id
            );

        const payment =
          paymentResponse?.data;

        if (!payment?.public_id) {
          throw new Error(
            'Server tidak mengembalikan public ID pembayaran.'
          );
        }

        showToast(
          'Donasi tercatat dan sesi pembayaran Midtrans berhasil dibuat. Pembayaran belum dianggap lunas sebelum dikonfirmasi backend.',
          'success'
        );

        return {
          success: true,
          donation,
          payment,
        };
      } catch (error) {
        console.error(
          'Public donation submission failed:',
          error
        );

        const message =
          error?.message ||
          'Gagal menyiapkan donasi dan sesi pembayaran.';

        showToast(
          message,
          'rose'
        );

        return {
          success: false,
          donation,
          payment:
            null,
          message,
          errors:
            error?.errors ||
            null,
        };
      }
    };

  const handlePrintTransactionReceipt = async (trxObj) => {
    if (trxObj.type === 'pemasukan') {
      try {
        const response = hasPengurusAccess()
          ? await FinancialApi.issueReceipt(trxObj.id)
          : await FinancialApi.getReceipt(trxObj.id);
        const snapshot = response?.data?.receipt;
        if (!snapshot || response?.data?.issued !== true) {
          throw new Error('Kwitansi belum diterbitkan oleh Pengurus Harian.');
        }
        setReceiptData({ ...snapshot, issued: true, type: 'pemasukan' });
        setIsReceiptModalOpen(true);
      } catch (error) {
        showToast(error?.message || 'Kwitansi gagal dimuat.', 'rose');
      }
      return;
    }
    // Voucher pengeluaran tetap merupakan pratinjau, bukan bukti donasi.
    setReceiptData({
      type: trxObj.type, receiptNo: trxObj.id, donorName: trxObj.donorName,
      description: trxObj.description, amount: trxObj.amount,
      category: trxObj.category, paymentMethod: trxObj.paymentMethod,
      date: trxObj.date, createdBy: trxObj.createdBy,
    });
    setIsReceiptModalOpen(true);
  };

  const handleDeleteTransaction =
    async (trxId) => {
      const target =
        financialTransactions
          .find(
            (transaction) =>
              transaction.id ===
              trxId
          );

      if (!target) {
        showToast(
          'Transaksi tidak ditemukan.',
          'rose'
        );

        return {
          success: false,
        };
      }

      if (
        target.editable !==
        true
      ) {
        showToast(
          'Transaksi hasil donasi dikelola oleh sistem dan tidak dapat dihapus manual.',
          'rose'
        );

        return {
          success: false,
        };
      }

      try {
        await FinancialApi
          .deleteTransaction(
            trxId
          );

        showToast(
          `Transaksi ${trxId} berhasil dihapus.`,
          'success'
        );

        setTrxToDelete(
          null
        );

        setIsDeleteModalOpen(
          false
        );

        setFinancialTransactionRefreshKey(
          (previous) =>
            previous + 1
        );

        return {
          success: true,
        };
      } catch (error) {
        console.error(
          'Failed to delete financial transaction:',
          error
        );

        showToast(
          error?.message ||
            'Transaksi gagal dihapus.',
          'rose'
        );

        return {
          success: false,
          error,
        };
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Campaign Management
  |--------------------------------------------------------------------------
  */

  const handleSaveProgram =
    async (progData) => {
      if (!hasPengurusAccess()) return { success: false };
      try {
        const payload = {
          category_id:
            Number(
              progData.categoryId
            ),

          title:
            progData.title.trim(),

          status:
            progData.status,

          target_amount:
            Number(
              progData.targetAmount
            ),

          deadline:
            progData.deadline,

          description:
            progData.description.trim(),

          header_image_url:
            progData
              .headerImageUrl
              ?.trim() ||
            null,
        };

        let response;

        if (progData.id) {
          response =
            await CampaignApi
              .updateCampaign(
                progData.id,
                payload
              );

          showToast(
            `Program "${progData.title}" berhasil diperbarui.`,
            'success'
          );
        } else {
          response =
            await CampaignApi
              .createCampaign(
                payload
              );

          showToast(
            `Program "${progData.title}" berhasil ditambahkan.`,
            'success'
          );
        }

        const campaign =
          response?.data;

        if (!campaign) {
          throw new Error(
            'Server tidak mengembalikan data campaign.'
          );
        }

        const normalizedProgram =
          normalizeCampaign(
            campaign
          );

        setManagedPrograms(
          (previous) => {
            const exists =
              previous.some(
                (program) =>
                  program.id ===
                  normalizedProgram.id
              );

            if (exists) {
              return previous.map(
                (program) =>
                  program.id ===
                  normalizedProgram.id
                    ? normalizedProgram
                    : program
              );
            }

            return [
              normalizedProgram,
              ...previous,
            ];
          }
        );

        /*
         * Refresh dari backend.
         * Browser bukan source of truth.
         */
        await refreshPublicPrograms();

        return {
          success: true,
          data:
            normalizedProgram,
        };
      } catch (error) {
        console.error(
          'Failed to save campaign:',
          error
        );

        showToast(
          error?.message ||
            'Program gagal disimpan.',
          'rose'
        );

        return {
          success: false,
          error,
        };
      }
    };

  const handleDeactivateProgram =
    async (progId) => {
      if (!hasPengurusAccess()) return { success: false };
      const target =
        managedPrograms.find(
          (program) =>
            program.id ===
            progId
        );

      if (!target) {
        return {
          success: false,
        };
      }

      try {
        const response =
          await CampaignApi
            .updateCampaign(
              progId,
              {
                status:
                  'inactive',
              }
            );

        const campaign =
          response?.data;

        if (!campaign) {
          throw new Error(
            'Server tidak mengembalikan data campaign.'
          );
        }

        const normalized =
          normalizeCampaign(
            campaign
          );

        setManagedPrograms(
          (previous) =>
            previous.map(
              (program) =>
                program.id ===
                progId
                  ? normalized
                  : program
            )
        );

        await refreshPublicPrograms();

        showToast(
          `Program "${target.title}" berhasil dinonaktifkan.`,
          'info'
        );

        return {
          success: true,
        };
      } catch (error) {
        console.error(
          'Failed to deactivate campaign:',
          error
        );

        showToast(
          error?.message ||
            'Program gagal dinonaktifkan.',
          'rose'
        );

        return {
          success: false,
          error,
        };
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Derived State & Routing
  |--------------------------------------------------------------------------
  */

  const pendingApprovalCount =
    Number(
      approvalSummary
        ?.pending ||
      0
    );

  const pendingDonationsCount = manualDonations.filter((d) => d.status === 'Pending').length;

  const adminRoutes = Object.keys(SIMK_PROTECTED_ROUTES);
  const isAdminView = adminRoutes.includes(activeTab);
  const canViewAdmin = isAdminView && isAuthenticated &&
    SIMK_PROTECTED_ROUTES[activeTab].includes(currentRole);

  // Campaign tidak pernah fallback ke mock data.
  const displayCampaigns = publicPrograms;

  // Never show mock transactions as if they were entries in the official ledger.
  const displayTransactions = Array.isArray(financialTransactions) ? financialTransactions : [];

  // Public organization identity must come from the CMS API only.
  const displayProfile = organizationProfile || {};

  // Never use fixture accounts as real approval records.
  const displayUsers = approvalUsers;

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      {logoutConfirmOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
            onClick={() => { if (!logoutInProgress) setLogoutConfirmOpen(false); }} />
          <section role="alertdialog" aria-modal="true" aria-labelledby="simk-logout-title"
            aria-describedby="simk-logout-description"
            className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <LucideIcon name="log-out" className="h-7 w-7" />
            </div>
            <h2 id="simk-logout-title" className="text-center text-xl font-extrabold text-slate-900">
              Yakin ingin keluar?
            </h2>
            <p id="simk-logout-description" className="mt-2 text-center text-sm leading-relaxed text-slate-500">
              Sesi pengelolaan SIMK-Panti akan diakhiri. Pastikan perubahan yang sedang dikerjakan sudah tersimpan.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button ref={logoutCancelRef} type="button" disabled={logoutInProgress}
                onClick={() => setLogoutConfirmOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:opacity-50">
                Tetap Masuk
              </button>
              <button type="button" disabled={logoutInProgress} onClick={confirmLogout}
                className="rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-600 disabled:opacity-50">
                {logoutInProgress ? 'Mengakhiri sesi...' : 'Ya, Keluar'}
              </button>
            </div>
          </section>
        </div>, document.body
      )}

      {/* Toast Alert Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in toast-alert">
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center space-x-3 text-xs font-bold ${
              toast.type === 'rose'
                ? 'bg-rose-900 text-rose-100 border-rose-700'
                : toast.type === 'info'
                ? 'bg-slate-900 text-white border-slate-700'
                : 'bg-emerald-900 text-emerald-100 border-emerald-700'
            }`}
          >
            <LucideIcon
              name={toast.type === 'rose' ? 'alert-circle' : 'check-circle-2'}
              className="w-4 h-4 text-emerald-400"
            />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Simulator role impersonation removed: only AuthApi.login + AuthApi.me
          can establish a user identity. Public/admin navigation is unchanged. */}

      {/* RENDER ADMIN SIDEBAR LAYOUT OR PUBLIC NAVBAR LAYOUT */}
      {isAdminView && !canViewAdmin ? (
        <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-xl font-bold text-slate-900">Akses halaman dilindungi</h1>
          <p className="text-sm text-slate-600">
            {authStatus === 'checking'
              ? 'Memeriksa sesi login Laravel...'
              : isAuthenticated
                ? 'Role akun Anda tidak memiliki izin untuk membuka halaman ini.'
                : 'Login Laravel diperlukan untuk mengakses dashboard pengurus.'}
          </p>
          <div className="flex gap-3">
            <button className="rounded-lg bg-emerald-600 px-4 py-2 text-white" onClick={() => navigateToRoute('/login')}>Login</button>
            <button className="rounded-lg border px-4 py-2" onClick={() => navigateToRoute('/beranda')}>Ke website publik</button>
          </div>
        </main>
      ) : isAdminView ? (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
          {/* Admin Sidebar */}
          <Sidebar
            currentUser={currentUser}
            currentRoute={activeTab}
            onNavigateTab={navigateToRoute}
            onLogout={requestLogoutConfirmation}
            pendingApprovalCount={pendingApprovalCount}
            pendingDonationsCount={pendingDonationsCount}
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            isDesktopSidebarOpen={isDesktopSidebarOpen}
            setIsDesktopSidebarOpen={setIsDesktopSidebarOpen}
            evaluatorMode={false}
          />

          {/* Admin Main Workspace Area */}
          <div
            className={`flex-1 flex flex-col min-w-0 transition-[margin] duration-300 ${isDesktopSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}`}
          >
            {/* The desktop sidebar changes only when the user presses this toggle. */}
            <header className="hidden lg:flex sticky top-0 z-30 items-center justify-between bg-white border-b border-slate-200 px-6 py-3 shadow-sm no-print">
              <button
                type="button"
                aria-label={isDesktopSidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
                aria-expanded={isDesktopSidebarOpen}
                onClick={() => setIsDesktopSidebarOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                <LucideIcon name={isDesktopSidebarOpen ? 'panel-left-close' : 'panel-left-open'} className="w-5 h-5" />
                <span>{isDesktopSidebarOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}</span>
              </button>
              <span className="text-xs font-semibold text-slate-500">{currentRole === 'pemimpin_lembaga' ? 'Pengawasan Pemimpin Lembaga' : 'Panel Pengurus Harian'}</span>
            </header>
            {/* Top Admin Mobile Header Bar */}
            <header className="lg:hidden sticky top-0 z-30 bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-sm no-print">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen((open) => !open)}
                  aria-label={isMobileSidebarOpen ? 'Tutup navigasi' : 'Buka navigasi'}
                  aria-expanded={isMobileSidebarOpen}
                  className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                  <LucideIcon name="menu" className="w-5 h-5" />
                </button>
                <div className="font-extrabold text-sm flex items-center space-x-2">
                  <LucideIcon name="building-2" className="w-4 h-4 text-emerald-400" />
                  <span>SIMK-Panti Admin</span>
                </div>
              </div>

              <div className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                {currentRole === 'pengurus_harian' ? 'Pengurus Harian' : 'Pemimpin Lembaga'}
              </div>
            </header>

            <main className="flex-1 p-4 sm:p-6">
              {activeTab === 'admin-dashboard' && (
                <AdminDashboard
                  campaigns={displayCampaigns}
                  donations={donations}
                  transactions={displayTransactions}
                  currentUser={currentUser}
                  onNavigateTab={navigateToRoute}
                  financialTransactionRefreshKey={financialTransactionRefreshKey}
                />
              )}

              {activeTab === 'admin-verifikasi' && (
                <DonationVerification
                  donations={manualDonations}
                  loading={manualDonationsLoading}
                  error={manualDonationsError}
                  onReload={() => loadManualDonations(manualDonationPage)}
                  currentPage={manualDonationPage}
                  lastPage={manualDonationLastPage}
                  onPageChange={loadManualDonations}
                  campaigns={displayCampaigns}
                  onApproveDonation={handleApproveDonation}
                  onRejectDonation={handleRejectDonation}
                  onOpenReceiptModal={handlePrintTransactionReceipt}
                />
              )}

              {activeTab === 'admin-offline' && (
                <OfflineDonation
                  donations={donations}
                  campaigns={displayCampaigns}
                  onAddOfflineDonation={handleAddOfflineDonation}
                  onVerifyOfflineDonation={handleVerifyOfflineDonation}
                />
              )}

              {activeTab === 'admin-campaign' && (
                <CampaignManagement
                  campaigns={managedPrograms}
                  campaignLoading={campaignLoading}
                  campaignError={campaignError}
                  onSaveCampaign={handleSaveCampaign}
                  onDeleteCampaign={handleDeleteCampaign}
                  onAddCampaignUpdate={handleAddCampaignUpdate}
                />
              )}

              {activeTab === 'admin-konten' && (
                <ContentManagement
                  currentUser={currentUser}
                  onProfileUpdated={loadPublicOrganizationProfile}
                  showToast={showToast}
                  orphanageProfile={displayProfile}
                  articles={articles}
                  faqs={faqs}
                  onSaveProfile={handleSaveProfile}
                  onSaveArticle={handleSaveArticle}
                  onDeleteArticle={handleDeleteArticle}
                  onSaveFaq={handleSaveFaq}
                  onDeleteFaq={handleDeleteFaq}
                />
              )}

              {activeTab === 'dashboard' && (
                <FinancialDashboard
                  currentUser={currentUser}
                  onNavigateTab={navigateToRoute}
                />
              )}

              {activeTab === 'transactions' && (
                <TransactionManagement
                  transactions={displayTransactions}
                  currentUser={currentUser}
                  transactionLoading={financialTransactionLoading}
                  transactionError={financialTransactionError}
                  transactionPagination={financialTransactionPagination}
                  transactionRefreshKey={financialTransactionRefreshKey}
                  onLoadTransactions={loadFinancialTransactions}
                  onOpenAddModal={() => {
                    setEditingTrx(null);
                    setIsAddTrxModalOpen(true);
                  }}
                  onOpenEditModal={(transaction) => {
                    if (transaction.editable !== true) {
                      showToast('Transaksi sistem tidak dapat diedit manual.', 'rose');
                      return;
                    }
                    setEditingTrx(transaction);
                    setIsAddTrxModalOpen(true);
                  }}
                  onConfirmDeleteTrx={(transaction) => {
                    if (transaction.editable !== true) {
                      showToast('Transaksi sistem tidak dapat dihapus manual.', 'rose');
                      return;
                    }
                    setTrxToDelete(transaction);
                    setIsDeleteModalOpen(true);
                  }}
                  onPrintTransactionReceipt={handlePrintTransactionReceipt}
                />
              )}

              {activeTab === 'programs' && (
                <ProgramManagement
                  priorityPrograms={managedPrograms && managedPrograms.length > 0 ? managedPrograms : displayCampaigns}
                  campaignLoading={campaignLoading}
                  campaignError={campaignError}
                  onSaveProgram={handleSaveProgram}
                  onDeactivateProgram={handleDeactivateProgram}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'organization-profile-management' && (
                <OrganizationProfileManagement
                  currentUser={currentUser}
                  onProfileUpdated={loadPublicOrganizationProfile}
                  showToast={showToast}
                />
              )}

              {activeTab === 'approval' && (
                <UserApproval
                  users={displayUsers}
                  summary={approvalSummary}
                  loading={approvalLoading}
                  error={approvalError}
                  actionUserId={approvalActionUserId}
                  onReload={loadUserApprovals}
                  onApproveUser={handleApproveUser}
                  onRejectUser={handleRejectUser}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'audit' && (
                <AuditTrailLog />
              )}

              {activeTab === 'report' && (
                <FinancialReportPSAK45
                  currentUser={currentUser}
                />
              )}
            </main>
          </div>
        </div>
      ) : (
        <>
          {/* Public Top Navbar */}
          <Navbar
            currentUser={currentUser}
            currentRoute={activeTab === 'beranda' ? 'home' : activeTab === 'public-donation' ? 'donasi' : activeTab}
            onSwitchUserRole={handleSwitchUserRole}
            onNavigateTab={navigateToRoute}
            onLogout={requestLogoutConfirmation}
            pendingApprovalCount={pendingApprovalCount}
            evaluatorMode={false}
            organizationProfile={displayProfile}
          />

          {/* Public Main Content */}
          <main className="flex-1">
            {activeTab === 'beranda' && (
              <LandingPage
                onNavigateToDonation={openPublicDonation}
                onNavigateToLogin={() => navigateToRoute('/login')}
                onNavigateToProfile={() => navigateToRoute('/profil')}
                onNavigateToCampaign={(id) => navigateToRoute(`/campaign/${id}`)}
                priorityPrograms={displayCampaigns}
                campaignLoading={publicCampaignLoading}
                campaignError={publicCampaignError}
                organizationProfile={displayProfile}
              />
            )}

            {activeTab === 'profil' && (
              <OrganizationProfile
                onNavigateToDonation={openPublicDonation}
                organizationProfile={displayProfile}
                organizationProfileLoading={organizationProfileLoading}
                organizationProfileError={organizationProfileError}
              />
            )}

            {activeTab === 'public-donation' && (
              <PublicDonation
                campaigns={publicPrograms}
                campaignLoading={publicCampaignLoading}
                campaignError={publicCampaignError}
                donationContext={selectedDonationContext}
                onSubmitPublicDonation={handlePublicDonationSubmit}
                onSubmitManualDonation={handleManualDonationSubmit}
                resolveAllocationCategory={mapCampaignCategoryToDonationAllocation}
                onNavigateHome={() => navigateToRoute('/beranda')}
              />
            )}

            {activeTab === 'detail-campaign' && (
              <DetailCampaign
                campaignId={selectedCampaignId}
                campaigns={displayCampaigns}
                onNavigateToDonation={openPublicDonation}
                onNavigateBack={() => navigateToRoute('/beranda')}
              />
            )}

            {activeTab === 'public-dashboard' && (
              <PublicFinancialDashboard
                onNavigateToDonation={openPublicDonation}
              />
            )}

            {activeTab === 'berita' && (
              <BeritaArtikel
                articles={articles}
                onNavigateToDetail={(slug) => navigateToRoute(`/berita/${slug}`)}
              />
            )}

            {activeTab === 'detail-berita' && (
              <DetailBerita
                articleSlug={selectedArticleSlug}
                articles={articles}
                onNavigateBack={() => navigateToRoute('/berita')}
              />
            )}

            {activeTab === 'faq' && (
              <Faq
                faqs={faqs}
              />
            )}

            {activeTab === 'auth' && (
              <AuthPages
                key={authView}
                initialView={authView}
                onLoginSuccess={handleLogin}
                onRegisterSubmit={handleRegisterSubmit}
                onSwitchUserRole={handleSwitchUserRole}
              />
            )}
          </main>

          <Footer organizationProfile={displayProfile} onNavigateTab={navigateToRoute} />
        </>
      )}

      {/* Global Interactive Modals */}
      <AddEditTrxModal
        isOpen={isAddTrxModalOpen}
        onClose={() => setIsAddTrxModalOpen(false)}
        onSubmitTransaction={handleSaveTransaction}
        editingTrx={editingTrx}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTransaction}
        trxToDelete={trxToDelete}
      />

      <DigitalReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        receiptData={receiptData}
      />
    </div>
  );
};

window.App = App;

