// Main React Application Component
// SIMK-Panti

const App = () => {
  const initialData =
    window.INITIAL_SIMK_DATA || {};

  /*
  |--------------------------------------------------------------------------
  | Prototype Domain State
  |--------------------------------------------------------------------------
  |
  | Domain-domain ini belum terintegrasi
  | dengan backend pada fase sekarang.
  |
  */

  const [users, setUsers] =
    React.useState(
      initialData.users || []
    );
  
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
  | Evaluator Mode
  |--------------------------------------------------------------------------
  |
  | Tidak boleh membuat fake authenticated user.
  | Authentication authority tetap backend.
  |
  */

  const handleSwitchUserRole =
    () => {
      showToast(
        'Untuk mengakses area pengurus, silakan login menggunakan akun yang telah disetujui.',
        'info'
      );

      setActiveTab(
        'auth'
      );

      setAuthView(
        'login'
      );
    };

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
  | Prototype Registration
  |--------------------------------------------------------------------------
  |
  | Belum backend-connected.
  |
  */

  const handleRegisterSubmit =
    (formData) => {
      const newUser = {
        id:
          `USR-${Math.floor(
            Math.random() *
              900 +
              100
          )}`,

        nik:
          formData.nik,

        fullName:
          formData.fullName,

        address:
          formData.address,

        phone:
          formData.phone,

        role:
          formData.role,

        username:
          formData.username,

        status:
          'Pending Approval',

        registrationDate:
          new Date()
            .toISOString()
            .substring(
              0,
              10
            ),
      };

      setUsers(
        (previous) => [
          newUser,
          ...previous,
        ]
      );

      showToast(
        'Pendaftaran prototype berhasil. Integrasi registrasi backend akan dilakukan pada fase terkait.',
        'info'
      );
    };

  /*
  |--------------------------------------------------------------------------
  | Prototype User Approval
  |--------------------------------------------------------------------------
  */

  const handleApproveUser =
    (userId) => {
      const targetUser =
        users.find(
          (user) =>
            user.id ===
            userId
        );

      if (!targetUser) {
        return;
      }

      setUsers(
        (previous) =>
          previous.map(
            (user) =>
              user.id ===
              userId
                ? {
                    ...user,
                    status:
                      'Approved',
                  }
                : user
          )
      );

      showToast(
        `Akun ${targetUser.fullName} disetujui pada mode prototype.`,
        'success'
      );
    };

  const handleRejectUser =
    (userId) => {
      const targetUser =
        users.find(
          (user) =>
            user.id ===
            userId
        );

      if (!targetUser) {
        return;
      }

      setUsers(
        (previous) =>
          previous.map(
            (user) =>
              user.id ===
              userId
                ? {
                    ...user,
                    status:
                      'Rejected',
                  }
                : user
          )
      );

      showToast(
        `Akun ${targetUser.fullName} ditolak pada mode prototype.`,
        'rose'
      );
    };

  /*
  |--------------------------------------------------------------------------
  | Financial Transactions
  |--------------------------------------------------------------------------
  |
  | Seluruh domain keuangan aktif menggunakan backend sebagai source of truth.
  | Tidak ada lagi state transaksi keuangan dari mockData pada App.
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
  | Derived State
  |--------------------------------------------------------------------------
  */

  const pendingApprovalCount =
    users.filter(
      (user) =>
        user.status ===
        'Pending Approval'
    ).length;

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in toast-alert">

          <div
            className={`px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center space-x-3 text-xs font-bold ${
              toast.type ===
              'rose'
                ? 'bg-rose-900 text-rose-100 border-rose-700'
                : toast.type ===
                  'info'
                ? 'bg-slate-900 text-white border-slate-700'
                : 'bg-emerald-900 text-emerald-100 border-emerald-700'
            }`}
          >

            <LucideIcon name={
                toast.type ===
                'rose'
                  ? 'alert-circle'
                  : 'check-circle-2'
              } className="w-4 h-4 text-emerald-400" />

            <span>
              {toast.message}
            </span>

          </div>
        </div>
      )}

      <Navbar
        currentUser={
          currentUser
        }

        activeTab={
          activeTab
        }

        setActiveTab={
          setActiveTab
        }

        onSwitchUser={
          handleSwitchUserRole
        }

        onLogout={
          handleLogout
        }

        onNavigateToAuth={(
          view
        ) => {
          setActiveTab(
            'auth'
          );

          setAuthView(
            view
          );
        }}

        pendingApprovalCount={
          pendingApprovalCount
        }
      />

      <main className="flex-1">

        {activeTab ===
          'beranda' && (
          <LandingPage
            onNavigateToDonation={
              openPublicDonation
            }

            onNavigateToLogin={
              () => {
                setActiveTab(
                  'auth'
                );

                setAuthView(
                  'login'
                );
              }
            }

            onNavigateToProfile={
              () =>
                setActiveTab(
                  'profil'
                )
            }

            priorityPrograms={
              publicPrograms
            }

            organizationProfile={
              organizationProfile
            }
          />
        )}

        {activeTab ===
          'profil' && (
          <OrganizationProfile
            onNavigateToDonation={
              openPublicDonation
            }

            organizationProfile={
              organizationProfile
            }

            organizationProfileLoading={
              organizationProfileLoading
            }

            organizationProfileError={
              organizationProfileError
            }
          />
        )}

        {activeTab ===
          'public-donation' && (
          <PublicDonation
            donationContext={
              selectedDonationContext
            }

            onSubmitPublicDonation={
              handlePublicDonationSubmit
            }
          />
        )}

        {activeTab ===
          'public-dashboard' && (
          <PublicFinancialDashboard />
        )}

        {activeTab ===
          'auth' && (
          <AuthPages
            initialView={
              authView
            }

            onLoginSuccess={
              handleLogin
            }

            onRegisterSubmit={
              handleRegisterSubmit
            }

            onQuickSimulateRole={
              handleSwitchUserRole
            }
          />
        )}

        {activeTab ===
          'dashboard' && (
          <FinancialDashboard
            currentUser={
              currentUser
            }

            onNavigateTab={
              setActiveTab
            }
          />
        )}

        {activeTab ===
          'transactions' && (
          <TransactionManagement
            transactions={
              financialTransactions
            }

            currentUser={
              currentUser
            }

            transactionLoading={
              financialTransactionLoading
            }

            transactionError={
              financialTransactionError
            }

            transactionPagination={
              financialTransactionPagination
            }

            transactionRefreshKey={
              financialTransactionRefreshKey
            }

            onLoadTransactions={
              loadFinancialTransactions
            }

            onOpenAddModal={
              () => {
                setEditingTrx(
                  null
                );

                setIsAddTrxModalOpen(
                  true
                );
              }
            }

            onOpenEditModal={(
              transaction
            ) => {
              if (
                transaction.editable !==
                true
              ) {
                showToast(
                  'Transaksi sistem tidak dapat diedit manual.',
                  'rose'
                );

                return;
              }

              setEditingTrx(
                transaction
              );

              setIsAddTrxModalOpen(
                true
              );
            }}

            onConfirmDeleteTrx={(
              transaction
            ) => {
              if (
                transaction.editable !==
                true
              ) {
                showToast(
                  'Transaksi sistem tidak dapat dihapus manual.',
                  'rose'
                );

                return;
              }

              setTrxToDelete(
                transaction
              );

              setIsDeleteModalOpen(
                true
              );
            }}

            onPrintTransactionReceipt={
              handlePrintTransactionReceipt
            }
          />
        )}

        {activeTab ===
          'programs' && (
          <ProgramManagement
            priorityPrograms={
              managedPrograms
            }

            campaignLoading={
              campaignLoading
            }

            campaignError={
              campaignError
            }

            onSaveProgram={
              handleSaveProgram
            }

            onDeactivateProgram={
              handleDeactivateProgram
            }

            currentUser={
              currentUser
            }
          />
        )}

        {activeTab ===
          'organization-profile-management' && (
          <OrganizationProfileManagement
            currentUser={
              currentUser
            }

            onProfileUpdated={
              loadPublicOrganizationProfile
            }

            showToast={
              showToast
            }
          />
        )}

        {activeTab ===
          'approval' && (
          <UserApproval
            users={
              users
            }

            onApproveUser={
              handleApproveUser
            }

            onRejectUser={
              handleRejectUser
            }

            currentUser={
              currentUser
            }
          />
        )}

        {activeTab ===
          'audit' && (
          <AuditTrailLog />
        )}

        {activeTab ===
          'report' && (
          <FinancialReportPSAK45
            currentUser={
              currentUser
            }
          />
        )}

      </main>

      <AddEditTrxModal
        isOpen={
          isAddTrxModalOpen
        }

        onClose={
          () =>
            setIsAddTrxModalOpen(
              false
            )
        }

        onSubmitTransaction={
          handleSaveTransaction
        }

        editingTrx={
          editingTrx
        }
      />

      <ConfirmDeleteModal
        isOpen={
          isDeleteModalOpen
        }

        onClose={
          () =>
            setIsDeleteModalOpen(
              false
            )
        }

        onConfirm={
          handleDeleteTransaction
        }

        trxToDelete={
          trxToDelete
        }
      />

      <DigitalReceiptModal
        isOpen={
          isReceiptModalOpen
        }

        onClose={
          () =>
            setIsReceiptModalOpen(
              false
            )
        }

        receiptData={
          receiptData
        }
      />

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">

        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">

          <div>
            <span className="font-bold text-slate-700">
              SIMK-Panti Asuhan Kasih Bunda
            </span>

            {' '}• Transparansi & Akuntabilitas Nirlaba
          </div>

          <div className="text-[11px] text-slate-400">
            Sistem Informasi Manajemen Keuangan Panti Asuhan
          </div>

        </div>
      </footer>

    </div>
  );
};

window.App = App;
