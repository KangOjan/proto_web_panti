// Main React Application Component
// SIMK-Panti

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
  const isAuthenticated = authStatus === 'authenticated' && Boolean(currentUser);
  const currentRole = isAuthenticated ? simkUserRole(currentUser) : null;
  const hasPengurusAccess = () => isAuthenticated && currentRole === 'pengurus_harian';
  const hasPemimpinAccess = () => isAuthenticated && currentRole === 'pemimpin_lembaga';
  // Read-only monitoring. Creation, editing, deletion and verification remain Pengurus-only.
  const hasOversightReadAccess = () => isAuthenticated &&
    ['pengurus_harian', 'pemimpin_lembaga'].includes(currentRole);

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
  ] = React.useState([]); // Verified/pending donations must come from Laravel, not mock fixtures.

  const [
    articles,
    setArticles,
  ] = React.useState(
    window.INITIAL_SIMK_DATA?.articles || []
  );

  const [
    faqs,
    setFaqs,
  ] = React.useState(
    window.INITIAL_SIMK_DATA?.faqs || []
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

  // Verification must be persisted and authorized on the server, never
  // simulated by changing donations/campaign totals in React.
  const handleApproveDonation = async () => {
    showToast('Verifikasi dinonaktifkan sampai terhubung ke endpoint Laravel yang terotorisasi.', 'rose');
    return false;
  };

  const handleRejectDonation = async () => {
    showToast('Penolakan dinonaktifkan sampai terhubung ke endpoint Laravel yang terotorisasi.', 'rose');
    return false;
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
      await Promise.all([loadManagedCampaigns(), refreshPublicPrograms()]);
      showToast('Campaign berhasil disimpan di database.');
      return true;
    } catch (error) {
      showToast(error?.message || 'Campaign gagal disimpan.', 'rose');
      return false;
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

  const handleSaveArticle = (newArticle) => {
    setArticles((prev) => [newArticle, ...prev]);
    showToast('Artikel baru hanya masuk pratinjau lokal. API artikel dan upload gambar belum tersedia.', 'info');
  };

  const handleDeleteArticle = (id) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    showToast('Artikel berhasil dihapus!');
  };

  const handleSaveFaq = (newFaq) => {
    setFaqs((prev) => [...prev, newFaq]);
    showToast('FAQ hanya masuk pratinjau lokal. API penyimpanan FAQ belum tersedia.', 'info');
  };

  const handleDeleteFaq = (id) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    showToast('Pertanyaan FAQ berhasil dihapus!');
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
        campaign.header_image_url ||
        null,

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

        const campaigns =
          Array.isArray(
            response?.data
          )
            ? response.data
            : [];

        setManagedPrograms(
          campaigns.map(
            normalizeCampaign
          )
        );
      } catch (error) {
        console.error(
          'Failed to load management campaigns:',
          error
        );

        setCampaignError(
          error?.message ||
            'Gagal mengambil data program pengurus.'
        );
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
          !hasOversightReadAccess()
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
      activeTab !==
        'programs' ||
      !hasPengurusAccess()
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

        setReceiptData({
          receiptNo:
            transaction.id,

          type:
            transaction.type,

          donorName:
            transaction.donorName,

          description:
            transaction.description,

          amount:
            transaction.amount,

          category:
            transaction.category,

          paymentMethod:
            transaction.paymentMethod,

          date:
            transaction.date,

          createdBy:
            transaction.createdBy,
        });

        setIsReceiptModalOpen(
          true
        );

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

  const handlePrintTransactionReceipt =
    (trxObj) => {
      setReceiptData({
        receiptNo:
          trxObj.id,

        type:
          trxObj.type,

        donorName:
          trxObj.donorName ||
          trxObj.description,

        description:
          trxObj.description,

        amount:
          trxObj.amount,

        category:
          trxObj.category,

        paymentMethod:
          trxObj.paymentMethod ||
          (
            trxObj.type ===
            'pemasukan'
              ? 'Kas Masuk Bendahara'
              : 'Kas Keluar Operasional'
          ),

        date:
          trxObj.date,

        createdBy:
          trxObj.createdBy,
      });

      setIsReceiptModalOpen(
        true
      );
    };

  const handleDeleteTransaction =
    async (trxId) => {
      if (!hasPengurusAccess()) {
        showToast('Hanya Pengurus Harian yang dapat menghapus transaksi.', 'rose');
        return { success: false };
      }
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

  const pendingDonationsCount =
    donations.filter(
      (d) => d.type === 'online' && d.status === 'Pending'
    ).length;

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
            onLogout={handleLogout}
            pendingApprovalCount={pendingApprovalCount}
            pendingDonationsCount={pendingDonationsCount}
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            evaluatorMode={false}
          />

          {/* Admin Main Workspace Area */}
          <div className="flex-1 flex flex-col lg:ml-72 min-w-0">
            {/* Top Admin Mobile Header Bar */}
            <header className="lg:hidden sticky top-0 z-30 bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-sm no-print">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(true)}
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
                currentRole === 'pemimpin_lembaga' ? (
                  // Executive overview reuses the read-only financial analytics endpoint.
                  <FinancialDashboard
                    currentUser={currentUser}
                    onNavigateTab={navigateToRoute}
                  />
                ) : (
                  <AdminDashboard
                    campaigns={displayCampaigns}
                    donations={donations}
                    transactions={displayTransactions}
                    currentUser={currentUser}
                    onNavigateTab={navigateToRoute}
                    financialTransactionRefreshKey={financialTransactionRefreshKey}
                  />
                )
              )}

              {activeTab === 'admin-verifikasi' && (
                <DonationVerification
                  donations={donations}
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
                />
              )}

              {activeTab === 'admin-campaign' && (
                <CampaignManagement
                  campaigns={displayCampaigns}
                  onSaveCampaign={handleSaveCampaign}
                  onDeleteCampaign={handleDeleteCampaign}
                  onAddCampaignUpdate={handleAddCampaignUpdate}
                />
              )}

              {activeTab === 'admin-konten' && (
                <ContentManagement
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
                    if (!hasPengurusAccess()) {
                      showToast('Mode monitoring: hanya Pengurus Harian yang dapat mencatat transaksi.', 'rose');
                      return;
                    }
                    setEditingTrx(null);
                    setIsAddTrxModalOpen(true);
                  }}
                  onOpenEditModal={(transaction) => {
                    if (!hasPengurusAccess()) {
                      showToast('Mode monitoring: perubahan transaksi tidak diizinkan.', 'rose');
                      return;
                    }
                    if (transaction.editable !== true) {
                      showToast('Transaksi sistem tidak dapat diedit manual.', 'rose');
                      return;
                    }
                    setEditingTrx(transaction);
                    setIsAddTrxModalOpen(true);
                  }}
                  onConfirmDeleteTrx={(transaction) => {
                    if (!hasPengurusAccess()) {
                      showToast('Mode monitoring: penghapusan transaksi tidak diizinkan.', 'rose');
                      return;
                    }
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
                currentRole === 'pemimpin_lembaga' ? (
                  <section className="mx-auto max-w-6xl space-y-6">
                    <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-lg">
                      <p className="text-sm font-semibold text-emerald-300">Ikhtisar eksekutif</p>
                      <h1 className="mt-2 text-2xl font-extrabold">Program Prioritas</h1>
                      <p className="mt-2 text-sm text-slate-300">Daftar campaign dari API. Akses Pemimpin Lembaga bersifat baca saja.</p>
                    </div>
                    {publicCampaignLoading && <p className="text-sm text-slate-500">Memuat program dari database...</p>}
                    {publicCampaignError && <p className="text-sm text-rose-600">{publicCampaignError}</p>}
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {displayCampaigns.map((program) => (
                        <article key={program.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                          <span className="text-xs font-semibold text-emerald-700">{program.category}</span>
                          <h2 className="mt-2 text-base font-bold text-slate-900">{program.title}</h2>
                          <p className="mt-2 text-xs text-slate-500">Status: {program.status}</p>
                          <p className="mt-3 text-sm font-semibold">Target: Rp {Number(program.targetAmount || 0).toLocaleString('id-ID')}</p>
                          <p className="mt-1 text-sm">Dana terverifikasi: {program.verifiedCollectedAmount == null ? 'Belum tersedia' : `Rp ${program.verifiedCollectedAmount.toLocaleString('id-ID')}`}</p>
                          <button type="button" onClick={() => navigateToRoute(`/campaign/${encodeURIComponent(String(program.id))}`)}
                            className="mt-4 rounded-xl border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
                            Lihat detail publik
                          </button>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : (
                  <ProgramManagement
                    priorityPrograms={managedPrograms && managedPrograms.length > 0 ? managedPrograms : displayCampaigns}
                    campaignLoading={campaignLoading}
                    campaignError={campaignError}
                    onSaveProgram={handleSaveProgram}
                    onDeactivateProgram={handleDeactivateProgram}
                    currentUser={currentUser}
                  />
                )
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
            onLogout={handleLogout}
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

