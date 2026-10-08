// Main React Application Component
// SIMK-Panti

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

  const [
    activeTab,
    setActiveTab,
  ] = React.useState('beranda');

  const [
    authView,
    setAuthView,
  ] = React.useState('login');

  const [
    selectedDonationContext,
    setSelectedDonationContext,
  ] = React.useState({
    allocationCategory:
      'konsumsi',

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
  ] = React.useState(
    window.INITIAL_SIMK_DATA?.donations || []
  );

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
  ] = React.useState(null);

  const [
    selectedCampaignId,
    setSelectedCampaignId,
  ] = React.useState(null);

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
        'Konsumsi'
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
    };

  const navigateToRoute = (route) => {
    if (!route) return;
    const cleanRoute = route.split('?')[0];

    // Public routes:
    if (cleanRoute === '/' || cleanRoute === '/beranda') {
      setActiveTab('beranda');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/profil') {
      setActiveTab('profil');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/donasi' || cleanRoute === 'public-donation') {
      setActiveTab('public-donation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/keuangan-publik' || cleanRoute === '/transparansi' || cleanRoute === 'public-dashboard') {
      setActiveTab('public-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/berita') {
      setActiveTab('berita');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute.startsWith('/berita/')) {
      const slug = cleanRoute.replace('/berita/', '');
      setSelectedArticleSlug(slug);
      setActiveTab('detail-berita');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute.startsWith('/campaign/')) {
      const id = cleanRoute.replace('/campaign/', '');
      setSelectedCampaignId(id);
      setActiveTab('detail-campaign');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/faq') {
      setActiveTab('faq');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/login') {
      setAuthView('login');
      setActiveTab('auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/register') {
      setAuthView('register');
      setActiveTab('auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Admin & Pengelola routes:
    if (cleanRoute === '/pengelola/dashboard' || cleanRoute === '/admin/dashboard' || cleanRoute === 'admin-dashboard') {
      setActiveTab('admin-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/pengelola/verifikasi-donasi' || cleanRoute === '/admin/verifikasi-donasi' || cleanRoute === 'admin-verifikasi') {
      setActiveTab('admin-verifikasi');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/pengelola/donasi-offline' || cleanRoute === '/admin/donasi-offline' || cleanRoute === 'admin-offline') {
      setActiveTab('admin-offline');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/pengelola/campaign' || cleanRoute === '/admin/campaign' || cleanRoute === 'admin-campaign') {
      setActiveTab('admin-campaign');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/pengelola/konten' || cleanRoute === '/admin/konten' || cleanRoute === 'admin-konten') {
      setActiveTab('admin-konten');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/dashboard') {
      setActiveTab('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/transaksi' || cleanRoute === 'transactions') {
      setActiveTab('transactions');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/laporan' || cleanRoute === 'report') {
      setActiveTab('report');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/program' || cleanRoute === 'programs') {
      setActiveTab('programs');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/approval') {
      setActiveTab('approval');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanRoute === '/audit') {
      setActiveTab('audit');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveTab(cleanRoute.replace('/', ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    window.navigateToRoute = navigateToRoute;
  }, []);

  const handleSwitchUserRole = (targetRole) => {
    if (!targetRole) {
      setCurrentUser(null);
      navigateToRoute('/');
      showToast('Beralih ke mode Pengunjung Publik.');
      return;
    }
    if (targetRole === 'Pengurus Harian' || targetRole === 'pengurus_harian') {
      setCurrentUser({
        id: 'USR-001',
        nik: '3201012345670001',
        fullName: 'Budi Santoso',
        username: 'harian1',
        role: 'Pengurus Harian',
      });
      navigateToRoute('/pengelola/dashboard');
      showToast('Beralih ke simulasi Pengurus Harian.');
      return;
    }
    if (targetRole === 'Pemimpin Lembaga' || targetRole === 'pemimpin_lembaga') {
      setCurrentUser({
        id: 'USR-002',
        nik: '3201019876540002',
        fullName: 'Dra. Hj. Siti Aminah, M.Pd.',
        username: 'pemimpin1',
        role: 'Pemimpin Lembaga',
      });
      navigateToRoute('/approval');
      showToast('Beralih ke simulasi Pemimpin Lembaga.');
      return;
    }
  };

  const handleApproveDonation = (id) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Terverifikasi' } : d))
    );
    const don = donations.find((d) => d.id === id);
    if (don) {
      setPublicPrograms((prev) =>
        prev.map((c) =>
          c.id === don.campaignId || c.title === don.campaignTitle
            ? { ...c, collectedAmount: (c.collectedAmount || 0) + (don.amount || 0) }
            : c
        )
      );
      const newTrx = {
        id: `TRX-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().split('T')[0],
        type: 'pemasukan',
        category: 'Donasi Rutin',
        description: `Donasi Online Terverifikasi: ${don.donorName} (${don.campaignTitle || 'Donasi Umum'})`,
        amount: don.amount,
        createdBy: currentUser?.fullName || 'Pengurus Harian',
        editable: false,
      };
      setFinancialTransactions((prev) => [newTrx, ...prev]);
    }
    showToast('Donasi online berhasil diverifikasi & kuitansi resmi diterbitkan!');
  };

  const handleRejectDonation = (id) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Ditolak' } : d))
    );
    showToast('Bukti donasi ditolak.', 'rose');
  };

  const handleAddOfflineDonation = (payload) => {
    setDonations((prev) => [payload, ...prev]);
    if (payload.kind === 'uang') {
      setPublicPrograms((prev) =>
        prev.map((c) =>
          c.id === payload.campaignId || c.title === payload.campaignTitle
            ? { ...c, collectedAmount: (c.collectedAmount || 0) + (payload.amount || 0) }
            : c
        )
      );
      const newTrx = {
        id: `TRX-${Date.now().toString().slice(-6)}`,
        date: payload.createdAt.split('T')[0],
        type: 'pemasukan',
        category: 'Donasi Rutin',
        description: `Donasi Offline Tunai: ${payload.donorName} (${payload.campaignTitle})`,
        amount: payload.amount,
        createdBy: currentUser?.fullName || 'Pengurus Harian',
        editable: false,
      };
      setFinancialTransactions((prev) => [newTrx, ...prev]);
    }
    showToast('Donasi offline berhasil dicatat dan dibukukan!');
  };

  const handleSaveCampaign = async (payload) => {
    try {
      if (window.CampaignApi && payload.id && !payload.id.startsWith('CMP-')) {
        await CampaignApi.updateCampaign(payload.id, payload);
      }
    } catch (e) {
      console.warn('Backend update campaign fallback to local:', e);
    }
    setPublicPrograms((prev) => {
      const exists = prev.some((c) => c.id === payload.id);
      if (exists) {
        return prev.map((c) => (c.id === payload.id ? { ...c, ...payload } : c));
      }
      return [payload, ...prev];
    });
    setManagedPrograms((prev) => {
      const exists = prev.some((c) => c.id === payload.id);
      if (exists) {
        return prev.map((c) => (c.id === payload.id ? { ...c, ...payload } : c));
      }
      return [payload, ...prev];
    });
    showToast('Program campaign berhasil disimpan!');
  };

  const handleDeleteCampaign = (id) => {
    setPublicPrograms((prev) => prev.filter((c) => c.id !== id));
    setManagedPrograms((prev) => prev.filter((c) => c.id !== id));
    showToast('Program campaign berhasil dihapus!');
  };

  const handleAddCampaignUpdate = (campaignId, updatePayload) => {
    const updater = (c) => {
      if (c.id === campaignId) {
        const currentUpdates = c.updates || [];
        return { ...c, updates: [updatePayload, ...currentUpdates] };
      }
      return c;
    };
    setPublicPrograms((prev) => prev.map(updater));
    setManagedPrograms((prev) => prev.map(updater));
    showToast('Update penyaluran program berhasil dipublikasikan!');
  };

  const handleSaveProfile = async (updatedProfile) => {
    setOrganizationProfile(updatedProfile);
    try {
      if (window.CmsApi) {
        await CmsApi.updateProfile({
          name: updatedProfile.name,
          tagline: updatedProfile.tagline,
          history: updatedProfile.history,
          vision: updatedProfile.vision,
          contact_info: {
            address: updatedProfile.contactInfo?.address,
            phone: updatedProfile.contactInfo?.phone,
            whatsapp: updatedProfile.contactInfo?.whatsapp,
            email: updatedProfile.contactInfo?.email,
          },
        });
      }
    } catch (e) {
      console.warn('Backend update profile fallback:', e);
    }
    showToast('Informasi profil panti asuhan berhasil diperbarui!');
  };

  const handleSaveArticle = (newArticle) => {
    setArticles((prev) => [newArticle, ...prev]);
    showToast('Artikel baru berhasil dipublikasikan!');
  };

  const handleDeleteArticle = (id) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    showToast('Artikel berhasil dihapus!');
  };

  const handleSaveFaq = (newFaq) => {
    setFaqs((prev) => [...prev, newFaq]);
    showToast('Pertanyaan FAQ berhasil ditambahkan!');
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

      /*
       * Nilai ini nantinya berasal
       * dari backend Donation/Payment.
       */
      collectedAmount:
        Number(
          campaign.collected_amount ||
            0
        ),

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

      const campaigns =
        Array.isArray(
          response?.data
        )
          ? response.data
          : [];

      return campaigns.map(
        normalizeCampaign
      );
    };

  const refreshPublicPrograms =
    async () => {
      try {
        const programs =
          await fetchPublicPrograms();

        setPublicPrograms(
          programs
        );
      } catch (error) {
        console.error(
          'Failed to load public campaigns:',
          error
        );
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
          !currentUser ||
          currentUser.role !==
            'pemimpin_lembaga'
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
          !currentUser ||
          currentUser.role !==
            'pengurus_harian'
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
          return;
        }

        try {
          const response =
            await AuthApi.me();

          if (cancelled) {
            return;
          }

          setCurrentUser(
            response?.data ||
              null
          );
        } catch {
          sessionStorage.removeItem(
            'access_token'
          );

          if (!cancelled) {
            setCurrentUser(
              null
            );
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

    const loadPublicCampaigns =
      async () => {
        try {
          const programs =
            await fetchPublicPrograms();

          if (!cancelled) {
            setPublicPrograms(
              programs
            );
          }
        } catch (error) {
          if (cancelled) {
            return;
          }

          console.error(
            'Failed to load public campaigns:',
            error
          );
        }
      };

    loadPublicCampaigns();

    return () => {
      cancelled = true;
    };
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
      !currentUser
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

        if (!user) {
          sessionStorage.removeItem(
            'access_token'
          );

          return {
            success: false,

            message:
              'Profil pengguna tidak dapat dimuat.',
          };
        }

        setCurrentUser(
          user
        );

        setActiveTab(
          'dashboard'
        );

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
        sessionStorage.removeItem(
          'access_token'
        );

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
        console.error(
          'Logout request failed:',
          error
        );
      } finally {
        sessionStorage.removeItem(
          'access_token'
        );

        setCurrentUser(
          null
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

        showToast(
          'Anda telah keluar dari akun.',
          'info'
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
      if (
        currentUser?.role !==
        'pengurus_harian'
      ) {
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

            note:
              donationData.note
                ?.trim() ||
              null,

            publish_identity:
              false,
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

  const adminRoutes = [
    'admin-dashboard',
    'admin-verifikasi',
    'admin-offline',
    'admin-campaign',
    'admin-konten',
    'dashboard',
    'transactions',
    'report',
    'programs',
    'approval',
    'audit',
    'organization-profile-management',
  ];

  const isAdminView = Boolean(
    currentUser || adminRoutes.includes(activeTab)
  );

  const displayCampaigns =
    publicPrograms && publicPrograms.length > 0
      ? publicPrograms
      : (window.INITIAL_SIMK_DATA?.campaigns || []);

  const displayTransactions =
    financialTransactions && financialTransactions.length > 0
      ? financialTransactions
      : (window.INITIAL_SIMK_DATA?.transactions || []);

  const displayProfile =
    organizationProfile ||
    (window.INITIAL_SIMK_DATA?.orphanageProfile || {});

  const displayUsers =
    approvalUsers && approvalUsers.length > 0
      ? approvalUsers
      : (window.INITIAL_SIMK_DATA?.users || []);

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

      {/* GLOBAL TOP EVALUATOR BANNER (Matched exactly from final frontend MainLayout) */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 sticky top-0 z-50 no-print simulasi-banner">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
            Mode Evaluator
          </span>
          <span className="hidden sm:inline text-slate-300">
            Simulasi Role Pengguna
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            type="button"
            onClick={() => handleSwitchUserRole(null)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              !currentUser
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <LucideIcon name="globe" className="w-3.5 h-3.5" />
            <span>Publik (Beranda)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchUserRole('Pengurus Harian')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              currentUser?.role === 'Pengurus Harian'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <LucideIcon name="user-check" className="w-3.5 h-3.5" />
            <span>Pengurus Harian</span>
            {pendingDonationsCount > 0 && (
              <span className="ml-1 bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingDonationsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSwitchUserRole('Pemimpin Lembaga')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              currentUser?.role === 'Pemimpin Lembaga'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <LucideIcon name="shield-check" className="w-3.5 h-3.5" />
            <span>Pemimpin Lembaga</span>
            {pendingApprovalCount > 0 && (
              <span className="ml-1 bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingApprovalCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* RENDER ADMIN SIDEBAR LAYOUT OR PUBLIC NAVBAR LAYOUT */}
      {isAdminView ? (
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
            evaluatorMode={true}
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
                {currentUser?.role || 'Pengelola'}
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
                />
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
            onLogout={handleLogout}
            pendingApprovalCount={pendingApprovalCount}
            evaluatorMode={false}
          />

          {/* Public Main Content */}
          <main className="flex-1">
            {activeTab === 'beranda' && (
              <LandingPage
                onNavigateToDonation={openPublicDonation}
                onNavigateToLogin={() => {
                  setActiveTab('auth');
                  setAuthView('login');
                }}
                onNavigateToProfile={() => navigateToRoute('/profil')}
                onNavigateToDetail={(id) => navigateToRoute(`/campaign/${id}`)}
                priorityPrograms={displayCampaigns}
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
              <DonasiPublik
                campaigns={displayCampaigns}
                initialCampaignId={selectedDonationContext.campaignId}
                onSubmitDonation={handlePublicDonationSubmit}
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
                initialView={authView}
                onLoginSuccess={handleLogin}
                onRegisterSubmit={handleRegisterSubmit}
                onSwitchUserRole={handleSwitchUserRole}
              />
            )}
          </main>

          <Footer />
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

