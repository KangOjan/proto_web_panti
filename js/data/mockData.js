// Mock Data for SIMK-Panti (Sistem Informasi Manajemen Keuangan Panti Asuhan)
window.INITIAL_SIMK_DATA = {
  /*
   * Prototype users.
   *
   * This data remains temporarily for evaluator-mode flows that have not yet
   * been migrated to the final Pemimpin Lembaga workflow.
   *
   * It must be removed during Phase 7 / final security cleanup because
   * authentication credentials and personal data must not live in frontend
   * source code in production.
   */
  users: [
    {
      id: 'USR-001',
      nik: '3201019283740001',
      fullName: 'Budi Santoso, S.E.',
      address: 'Jl. Merdeka No. 45, Jakarta Selatan',
      phone: '081234567890',
      role: 'Pengurus Harian',
      username: 'harian1',
      password: 'password123',
      status: 'Approved',
      registeredAt: '2026-01-10T09:00:00.000Z',
      approvedBy: 'H. Ahmad Dahlan, M.Ag.'
    },
    {
      id: 'USR-002',
      nik: '3201019283740002',
      fullName: 'H. Ahmad Dahlan, M.Ag.',
      address: 'Jl. Kebon Jeruk No. 12, Jakarta Barat',
      phone: '081198765432',
      role: 'Pemimpin Lembaga',
      username: 'pemimpin1',
      password: 'password123',
      status: 'Approved',
      registeredAt: '2026-01-05T08:30:00.000Z',
      approvedBy: 'Sistem Utama'
    },
    {
      id: 'USR-003',
      nik: '3201019283740003',
      fullName: 'Siti Rahmawati, A.Md.',
      address: 'Jl. Cempaka Putih No. 88, Jakarta Pusat',
      phone: '081345678901',
      role: 'Pengurus Harian',
      username: 'harian2',
      password: 'password123',
      status: 'Pending Approval',
      registeredAt: '2026-07-25T14:20:00.000Z',
      approvedBy: null
    },
    {
      id: 'USR-004',
      nik: '3201019283740004',
      fullName: 'Drs. Bambang Wijaya',
      address: 'Jl. Gatot Subroto No. 104, Jakarta Selatan',
      phone: '081567890123',
      role: 'Pemimpin Lembaga',
      username: 'pemimpin2',
      password: 'password123',
      status: 'Pending Approval',
      registeredAt: '2026-07-26T10:15:00.000Z',
      approvedBy: null
    },
    {
      id: 'USR-005',
      nik: '3201019283740005',
      fullName: 'Rahmat Hidayat',
      address: 'Jl. Raya Bogor KM 24, Jakarta Timur',
      phone: '081789012345',
      role: 'Pengurus Harian',
      username: 'harian3',
      password: 'password123',
      status: 'Rejected',
      registeredAt: '2026-07-20T11:00:00.000Z',
      approvedBy: 'H. Ahmad Dahlan, M.Ag.'
    }
  ],

  /*
   * Prototype priority-program data.
   *
   * Keep this section until the remaining evaluator-mode dependency is
   * explicitly removed. Campaign/backend integration remains the source of
   * truth for production campaign flows.
   */
  priorityPrograms: [
    {
      id: 'PROG-001',
      title: 'Pemenuhan Konsumsi & Gizi Harian',
      category: 'Konsumsi',
      targetAmount: 20000000,
      collectedAmount: 14200000,
      description: 'Pengadaan beras, lauk pauk, telur, susu, dan buah-buahan bergizi seimbang untuk 45 anak asuh setiap hari.',
      icon: 'utensils',
      badgeColor: 'amber',
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'PROG-002',
      title: 'Beasiswa SPP & Seragam Sekolah',
      category: 'SPP/Pendidikan',
      targetAmount: 18000000,
      collectedAmount: 12500000,
      description: 'Dukungan biaya SPP bulanan, buku teks pelajaran, dan kelengkapan seragam sekolah 45 anak dari tingkat SD hingga SMA.',
      icon: 'graduation-cap',
      badgeColor: 'emerald',
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'PROG-003',
      title: 'Operasional & Fasilitas Asrama',
      category: 'Operasional',
      targetAmount: 15000000,
      collectedAmount: 9800000,
      description: 'Pembiayaan tagihan listrik PLN, air PDAM, sanitasi, pemeliharaan tempat tidur asrama, dan koneksi internet lab komputer.',
      icon: 'home',
      badgeColor: 'teal',
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z'
    }
  ]
};