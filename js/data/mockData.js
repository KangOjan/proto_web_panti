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
  ],

  // 1. Profil & Informasi Umum Panti Asuhan
  orphanageProfile: {
    name: 'Panti Asuhan Kasih Bunda',
    tagline: 'Menebar Kasih, Membina Generasi Berakhlak Mulia & Mandiri',
    foundedYear: '2012',
    founder: 'H. Ahmad Dahlan, M.Ag. & Hj. Aminah Dahlan',
    history: 'Panti Asuhan Kasih Bunda didirikan pada tanggal 14 Juli 2012 bermula dari kepedulian sosial terhadap anak-anak yatim piatu dan dhuafa di wilayah sekitar yang membutuhkan tempat tinggal layak, bimbingan akhlak, dan akses pendidikan formal. Sejak berdiri, panti asuhan telah berhasil membina lebih dari 180 alumni yang kini telah mandiri, melanjutkan ke perguruan tinggi, maupun bekerja secara profesional.',
    vision: 'Menjadi lembaga pengasuhan dan pembinaan anak yatim dhuafa yang amanah, profesional, dan unggul dalam mencetak generasi sholeh, berprestasi, serta mandiri pada tahun 2030.',
    missions: [
      'Menyediakan pemenuhan kebutuhan dasar hidup (sandang, pangan bergizi, dan papan yang layak) secara berkelanjutan.',
      'Menjamin keberlanjutan pendidikan formal anak dari tingkat dasar (SD) hingga perguruan tinggi.',
      'Membina karakter Islami, tahfidz Al-Qur\'an, serta budi pekerti luhur bagi seluruh anak asuh.',
      'Membekali keterampilan vokasional, teknologi digital, dan jiwa kewirausahaan untuk kemandirian masa depan anak asuh.',
      'Menyelenggarakan tata kelola lembaga yang transparan, akuntabel, dan berbasis standar laporan keuangan nirlaba (PSAK 45).'
    ],
    legalities: [
      { type: 'SK Kemenkumham RI', number: 'AHU-0019283.AH.01.04.Tahun 2012', date: '18 Agustus 2012', verified: true },
      { type: 'Izin Operasional Dinsos', number: '460/1089/DINSOS-YANREH/2021', date: '10 Mei 2021', verified: true },
      { type: 'Akta Notaris Pendirian', number: 'No. 24 Notaris H. Hendra Wijaya, S.H.', date: '14 Juli 2012', verified: true },
      { type: 'NPWP Yayasan', number: '72.481.993.4-013.000', date: 'Terdaftar Aktif', verified: true },
      { type: 'Tanda Daftar Lembaga Kesejahteraan Sosial (LKS)', number: 'Reg. 31.74.02.001.2022', date: 'Tersertifikasi', verified: true }
    ],
    facilities: [
      { name: 'Asrama Putra & Putri Terpisah', desc: 'Kamar tidur representatif, ber-AC, dan higienis dengan ranjang susun & lemari pribadi.', icon: 'home' },
      { name: 'Ruang Belajar & Lab Komputer', desc: 'Dilengkapi 15 unit PC terkoneksi internet cepat untuk pembelajaran daring dan keterampilan coding.', icon: 'laptop' },
      { name: 'Perpustakaan Mini & Pojok Baca', desc: 'Koleksi 1.200+ buku pelajaran, ensiklopedia, kisah teladan, dan buku keterampilan.', icon: 'book-open' },
      { name: 'Musholla & Rumah Tahfidz', desc: 'Pusat ibadah berjamaah, halaqah tahfidz Al-Qur\'an, dan kajian adab harian.', icon: 'moon' },
      { name: 'Dapur Sehat & Ruang Makan Gizi', desc: 'Dapur higienis berstandar gizi seimbang dengan penyajian menu bervariasi 3x sehari.', icon: 'utensils' },
      { name: 'Area Olahraga & Aula Serbaguna', desc: 'Lapangan bulu tangkis, tenis meja, dan aula pembinaan pelatihan keterampilan anak.', icon: 'award' }
    ],
    achievements: [
      { year: '2026', title: 'Juara 1 Lomba Tahfidz 5 Juz Tingkat Provinsi', by: 'M. Rizky Pratama (Kelas 2 SMA)' },
      { year: '2025', title: 'Penerima Beasiswa Penuh S1 Universitas Negeri Jakarta', by: 'Annisa Nurul Aini (Alumni Panti)' },
      { year: '2025', title: 'Juara 2 Lomba Robotika & Coding Tingkat Kota', by: 'Tim Robotik Panti Kasih Bunda' },
      { year: '2024', title: 'Akreditasi Lembaga Kesejahteraan Sosial Nilai A', by: 'Badan Akreditasi Lembaga Kesejahteraan Sosial (BALKS)' }
    ],
    contactInfo: {
      address: 'Jl. Merdeka Kasih Bunda No. 45, RT 04/RW 07, Kebayoran, Jakarta Selatan, 12180',
      phone: '(021) 7829-1029',
      whatsapp: '0812-3456-7890',
      email: 'kontak@pantikasihbunda.or.id',
      visitingHours: 'Setiap Hari: 08.00 - 17.00 WIB (Konfirmasi WhatsApp H-1 untuk kunjungan rombongan)',
      gmapsUrl: 'https://maps.google.com/?q=Jakarta+Selatan'
    }
  },

  // 2. Struktur Organisasi Kepengurusan Panti
  organizationStructure: [
    {
      level: 1,
      role: 'Dewan Pembina',
      members: [
        { name: 'Prof. Dr. H. Abdul Malik, M.A.', position: 'Ketua Dewan Pembina', photo: '👨‍🏫', desc: 'Guru Besar UIN & Penasihat Yayasan' },
        { name: 'Hj. Aminah Dahlan, S.Pd.', position: 'Anggota Pembina', photo: '🧕', desc: 'Pendiri & Pengawas Sosial Yayasan' }
      ]
    },
    {
      level: 2,
      role: 'Pimpinan Yayasan / Pemimpin Lembaga',
      members: [
        { name: 'H. Ahmad Dahlan, M.Ag.', position: 'Ketua Yayasan / Pemimpin Lembaga', roleCode: 'Pemimpin Lembaga', photo: '🧔', desc: 'Penanggung Jawab Utama Operasional & Kebijakan Strategis' }
      ]
    },
    {
      level: 3,
      role: 'Pengurus Harian (Manajemen Inti)',
      members: [
        { name: 'Budi Santoso, S.E.', position: 'Ketua Pengurus Harian & Keuangan', roleCode: 'Pengurus Harian', photo: '👨‍💼', desc: 'Pengelola Anggaran, Pelaporan PSAK 45, & Digital Audit Trail' },
        { name: 'Siti Rahmawati, A.Md.', position: 'Sekretaris & Administrasi', roleCode: 'Pengurus Harian', photo: '👩‍💼', desc: 'Pencatatan Data Donatur, Persuratan, & Legalitas' },
        { name: 'Dra. Hj. Nurhayati', position: 'Bendahara Kas Panti', roleCode: 'Pengurus Harian', photo: '🧕', desc: 'Pengawasan Alur Kas & Verifikasi Kuitansi Digital' }
      ]
    },
    {
      level: 4,
      role: 'Divisi Pengasuhan & Pembinaan Anak',
      members: [
        { name: 'Ust. Muhammad Farhan, S.Pd.I', position: 'Kepala Pengasuh & Pembina Tahfidz', photo: '👳', desc: 'Koordinator Halaqah Al-Qur\'an & Kedisiplinan Asrama' },
        { name: 'Dewi Lestari, S.Psi.', position: 'Konselor & Pembina Akademik', photo: '👩‍🏫', desc: 'Pendampingan Psikologis & Bimbingan Belajar Sekolah' },
        { name: 'Haryanto', position: 'Koordinator Sarana & Logistik', photo: '👨‍🔧', desc: 'Pemeliharaan Fasilitas Gedung, Listrik, & Air Asrama' }
      ]
    }
  ],

  // 3. Master Data Program Prioritas Panti (Dikelola CRUD oleh Pengurus Harian)
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

