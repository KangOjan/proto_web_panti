// Mock Data for SIMK-Panti (Sistem Informasi Manajemen Keuangan Panti Asuhan)
window.INITIAL_SIMK_DATA = {
  // Pre-configured Users with Approval Statuses
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
      status: 'Approved', // 'Approved' | 'Pending Approval' | 'Rejected'
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

  // Monthly Financial Transactions (Jan - Jul 2026)
  transactions: [
    // Juli 2026
    {
      id: 'TRX-202607-001',
      date: '2026-07-25',
      type: 'pemasukan',
      category: 'Donasi Rutin',
      amount: 15000000,
      donorName: 'Hamba Allah (Donatur Tetap)',
      description: 'Donasi bulanan hamba Allah via Bank Syariah Indonesia',
      createdBy: 'Budi Santoso, S.E.',
      createdAt: '2026-07-25T08:30:00.000Z',
      updatedAt: null
    },
    {
      id: 'TRX-202607-002',
      date: '2026-07-22',
      type: 'pemasukan',
      category: 'Infak/Zakat',
      amount: 8500000,
      donorName: 'Bapak H. Hendra & Keluarga',
      description: 'Zakat Maal Bapak H. Hendra & Keluarga',
      createdBy: 'Budi Santoso, S.E.',
      createdAt: '2026-07-22T10:15:00.000Z',
      updatedAt: null
    },
    {
      id: 'TRX-202607-003',
      date: '2026-07-20',
      type: 'pengeluaran',
      category: 'Konsumsi',
      amount: 6200000,
      description: 'Pembelian beras, lauk pauk, minyak, dan buah untuk 45 anak (2 minggu)',
      createdBy: 'Budi Santoso, S.E.',
      createdAt: '2026-07-20T11:00:00.000Z',
      updatedAt: null
    },
    {
      id: 'TRX-202607-004',
      date: '2026-07-15',
      type: 'pengeluaran',
      category: 'SPP/Pendidikan',
      amount: 4800000,
      description: 'Pembayaran SPP sekolah & seragam 12 anak panti jenjang SMP/SMA',
      createdBy: 'Budi Santoso, S.E.',
      createdAt: '2026-07-15T09:45:00.000Z',
      updatedAt: null
    },
    {
      id: 'TRX-202607-005',
      date: '2026-07-10',
      type: 'pengeluaran',
      category: 'Operasional',
      amount: 3200000,
      description: 'Tagihan Listrik PLN, Air PDAM, dan Internet Wi-Fi Gedung Panti',
      createdBy: 'Budi Santoso, S.E.',
      createdAt: '2026-07-10T14:20:00.000Z',
      updatedAt: null
    },

    // Juni 2026
    {
      id: 'TRX-202606-001',
      date: '2026-06-28',
      type: 'pemasukan',
      category: 'Bantuan Pemerintah/APBD',
      amount: 25000000,
      description: 'Cair Bantuan Hibah Operasional Dinas Sosial Tahap II',
      createdBy: 'Budi Santoso, S.E.',
      createdAt: '2026-06-28T09:00:00.000Z',
      updatedAt: null
    },
    {
      id: 'TRX-202606-002',
      date: '2026-06-20',
      type: 'pemasukan',
      category: 'Donasi Rutin',
      amount: 12000000,
      description: 'Donasi rutin alumni & pengusaha daerah',
      createdBy: 'Budi Santoso, S.E.',
      createdAt: '2026-06-20T13:10:00.000Z',
      updatedAt: null
    },
    {
      id: 'TRX-202606-003',
      date: '2026-06-18',
      type: 'pengeluaran',
      category: 'Kesehatan',
      amount: 2100000,
      description: 'Pemeriksaan kesehatan berkala & suplemen vitamin anak-anak',
      createdBy: 'Budi Santoso, S.E.',
      createdAt: '2026-06-18T10:30:00.000Z',
      updatedAt: null
    },
    {
      id: 'TRX-202606-004',
      date: '2026-06-10',
      type: 'pengeluaran',
      category: 'Konsumsi',
      amount: 7500000,
      description: 'Belanja dapur bulanan dan susu suplemen pertumbuhan',
      createdBy: 'Budi Santoso, S.E.',
      createdAt: '2026-06-10T08:00:00.000Z',
      updatedAt: null
    },

    // Mei 2026
    {
      id: 'TRX-202605-001',
      date: '2026-05-25',
      type: 'pemasukan',
      category: 'Infak/Zakat',
      amount: 18000000,
      description: 'Penerimaan Zakat Fitrah & Infak Syawal dari majelis taklim',
      createdBy: 'Budi Santoso, S.E.',
      createdAt: '2026-05-25T11:00:00.000Z',
      updatedAt: null
    },
    {
      id: 'TRX-202605-002',
      date: '2026-05-15',
      type: 'pengeluaran',
      category: 'Operasional',
      amount: 4500000,
      description: 'Perbaikan fasilitas tempat tidur & cat asrama anak',
      createdBy: 'Budi Santoso, S.E.',
      createdAt: '2026-05-15T15:00:00.000Z',
      updatedAt: null
    },

    // April 2026
    {
      id: 'TRX-202604-001',
      date: '2026-04-20',
      type: 'pemasukan',
      category: 'Donasi Rutin',
      amount: 22000000,
      description: 'Paket santunan Ramadhan dari Yayasan BUMN Peduli',
      createdBy: 'Budi Santoso, S.E.',
      createdAt: '2026-04-20T09:30:00.000Z',
      updatedAt: null
    },
    {
      id: 'TRX-202604-002',
      date: '2026-04-12',
      type: 'pengeluaran',
      category: 'Konsumsi',
      amount: 8800000,
      description: 'Pengadaan paket sembako & takjil kegiatan santunan',
      createdBy: 'Budi Santoso, S.E.',
      createdAt: '2026-04-12T16:20:00.000Z',
      updatedAt: null
    }
  ],

  // Digital Audit Trail Logs
  auditLogs: [
    {
      id: 'LOG-1005',
      timestamp: '2026-07-25T14:20:00.000Z',
      userName: 'Siti Rahmawati, A.Md.',
      nik: '3201019283740003',
      userRole: 'Pengurus Harian',
      action: 'REGISTER',
      details: 'Mendaftar akun baru dengan username "harian2" (Status: Pending Approval).'
    },
    {
      id: 'LOG-1004',
      timestamp: '2026-07-25T08:30:00.000Z',
      userName: 'Budi Santoso, S.E.',
      nik: '3201019283740001',
      userRole: 'Pengurus Harian',
      action: 'CREATE_TRANSACTION',
      details: 'Menambahkan transaksi Pemasukan (Donasi Rutin) sebesar Rp 15.000.000.'
    },
    {
      id: 'LOG-1003',
      timestamp: '2026-07-22T10:15:00.000Z',
      userName: 'Budi Santoso, S.E.',
      nik: '3201019283740001',
      userRole: 'Pengurus Harian',
      action: 'CREATE_TRANSACTION',
      details: 'Menambahkan transaksi Pemasukan (Infak/Zakat) sebesar Rp 8.500.000.'
    },
    {
      id: 'LOG-1002',
      timestamp: '2026-07-20T11:00:00.000Z',
      userName: 'Budi Santoso, S.E.',
      nik: '3201019283740001',
      userRole: 'Pengurus Harian',
      action: 'CREATE_TRANSACTION',
      details: 'Menambahkan transaksi Pengeluaran (Konsumsi) sebesar Rp 6.200.000.'
    },
    {
      id: 'LOG-1001',
      timestamp: '2026-07-20T11:00:00.000Z',
      userName: 'H. Ahmad Dahlan, M.Ag.',
      nik: '3201019283740002',
      userRole: 'Pemimpin Lembaga',
      action: 'REJECT_USER',
      details: 'Menolak permohonan pendaftaran akun Pengurus Harian atas nama "Rahmat Hidayat".'
    }
  ]
};
