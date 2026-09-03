// INITIAL DUMMY DATA FOR SIMK-PANTI
export const INITIAL_SIMK_DATA = {
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

  campaigns: [
    {
      id: 'CMP-001',
      title: 'Pemenuhan Konsumsi & Gizi Harian Anak Panti',
      category: 'Konsumsi',
      targetAmount: 20000000,
      collectedAmount: 14200000,
      deadline: '2026-09-30',
      status: 'Aktif', // Draft | Aktif | Target Tercapai | Ditutup | Dibatalkan
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60',
      description: 'Pengadaan beras, lauk pauk, telur, susu, dan buah-buahan bergizi seimbang untuk 45 anak asuh setiap hari.',
      bankAccount: 'Bank Syariah Indonesia (BSI) - 7123-4567-89 a.n. YPI Kasih Bunda',
      updates: [
        {
          id: 'UPD-101',
          date: '2026-08-15',
          title: 'Penyaluran Tahap I: Pengadaan Sembako Bulan Agustus',
          content: 'Alhamdulillah, dana terhimpun sebesar Rp 10.000.000 telah disalurkan untuk belanja 500kg beras, minyak goreng, dan lauk-pauk.'
        }
      ],
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'CMP-002',
      title: 'Beasiswa SPP, Buku & Seragam Sekolah Anak Yatim',
      category: 'Pendidikan',
      targetAmount: 18000000,
      collectedAmount: 18000000,
      deadline: '2026-08-31',
      status: 'Target Tercapai',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=60',
      description: 'Dukungan biaya SPP bulanan, buku teks pelajaran, dan kelengkapan seragam sekolah 45 anak dari tingkat SD hingga SMA.',
      bankAccount: 'Bank Mandiri - 123-00-0987654-3 a.n. Yayasan Kasih Bunda',
      updates: [
        {
          id: 'UPD-102',
          date: '2026-08-20',
          title: 'Target 100% Tercapai! Pembayaran SPP Lunas',
          content: 'Terima kasih donatur! SPP dan buku pelajaran seluruh anak asuh untuk semester ganjil 2026 telah terbayar penuh.'
        }
      ],
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'CMP-003',
      title: 'Renovasi & Pemeliharaan Asrama Putri',
      category: 'Fasilitas',
      targetAmount: 25000000,
      collectedAmount: 9800000,
      deadline: '2026-10-15',
      status: 'Aktif',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=60',
      description: 'Perbaikan atap bocor, pengecatan dinding, dan peremajaan kasur serta lemari di kamar tidur asrama putri.',
      bankAccount: 'Bank Syariah Indonesia (BSI) - 7123-4567-89 a.n. YPI Kasih Bunda',
      updates: [],
      createdAt: '2026-02-10T00:00:00.000Z'
    },
    {
      id: 'CMP-004',
      title: 'Pemeriksaan Kesehatan & Suplemen Sehat',
      category: 'Kesehatan',
      targetAmount: 10000000,
      collectedAmount: 4500000,
      deadline: '2026-11-30',
      status: 'Aktif',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=60',
      description: 'Pemeriksaan dokter spesialis anak secara berkala, pemberian suplemen multivitamin, dan pengadaan P3K lengkap.',
      bankAccount: 'Bank BCA - 883-0918-271 a.n. Kasih Bunda Yayasan',
      updates: [],
      createdAt: '2026-03-01T00:00:00.000Z'
    }
  ],

  donations: [
    {
      id: 'DON-202608-001',
      donorName: 'Hendra Wijaya',
      email: 'hendra.w@gmail.com',
      phone: '081298765432',
      amount: 1000000,
      campaignId: 'CMP-001',
      campaignTitle: 'Pemenuhan Konsumsi & Gizi Harian Anak Panti',
      message: 'Semoga menjadi keberkahan dan kesehatan untuk anak-anak panti.',
      isAnonymous: false,
      proofImage: 'https://placehold.co/600x800/10b981/ffffff?text=Bukti+Transfer+BSI+1.000.000',
      status: 'Pending', // Pending | Terverifikasi | Ditolak
      type: 'online', // online | offline
      kind: 'uang', // uang | barang
      createdAt: '2026-08-28T14:30:00.000Z'
    },
    {
      id: 'DON-202608-002',
      donorName: 'Hamba Allah',
      email: 'anonim@donatur.org',
      phone: '081300001111',
      amount: 500000,
      campaignId: 'CMP-002',
      campaignTitle: 'Beasiswa SPP, Buku & Seragam Sekolah Anak Yatim',
      message: 'Semoga bermanfaat untuk sekolah anak-anak.',
      isAnonymous: true,
      proofImage: 'https://placehold.co/600x800/0ea5e9/ffffff?text=Bukti+Transfer+Mandiri+500.000',
      status: 'Terverifikasi',
      type: 'online',
      kind: 'uang',
      createdAt: '2026-08-26T10:15:00.000Z',
      verifiedAt: '2026-08-26T11:00:00.000Z',
      verifiedBy: 'Budi Santoso, S.E.'
    },
    {
      id: 'DON-202608-003',
      donorName: 'Majelis Taklim Ar-Rahman',
      email: 'arrahman.mt@yahoo.com',
      phone: '081765432109',
      amount: 2500000,
      campaignId: 'CMP-001',
      campaignTitle: 'Pemenuhan Konsumsi & Gizi Harian Anak Panti',
      message: 'Titipan infak pengajian bulanan ibu-ibu Majelis Taklim.',
      isAnonymous: false,
      proofImage: null,
      status: 'Terverifikasi',
      type: 'offline', // Penyerahan langsung di panti
      kind: 'uang',
      createdAt: '2026-08-24T16:00:00.000Z',
      verifiedAt: '2026-08-24T16:00:00.000Z',
      verifiedBy: 'Siti Rahmawati, A.Md.'
    },
    {
      id: 'DON-202608-004',
      donorName: 'CV Sumber Sembako Murni',
      email: 'sumbersembako@biz.id',
      phone: '082145678901',
      amount: 0,
      campaignId: 'CMP-001',
      campaignTitle: 'Pemenuhan Konsumsi & Gizi Harian Anak Panti',
      message: 'Donasi offline 10 karung beras 25kg & 5 dus minyak goreng.',
      isAnonymous: false,
      proofImage: null,
      status: 'Terverifikasi',
      type: 'offline',
      kind: 'barang',
      itemDetails: '10 karung beras 25kg, 5 dus minyak goreng 2L',
      createdAt: '2026-08-20T09:30:00.000Z',
      verifiedAt: '2026-08-20T09:30:00.000Z',
      verifiedBy: 'Budi Santoso, S.E.'
    }
  ],

  childrenProfiles: [
    {
      id: 'CHD-001',
      initialName: 'Ananda R.',
      gender: 'Laki-laki',
      age: 12,
      education: 'Kelas 6 SD',
      dream: 'Dokter Spesialis Anak',
      avatar: '👦',
      joinedYear: '2020'
    },
    {
      id: 'CHD-002',
      initialName: 'Ananda S.',
      gender: 'Perempuan',
      age: 15,
      education: 'Kelas 3 SMP',
      dream: 'Guru Bahasa Indonesia',
      avatar: '👧',
      joinedYear: '2019'
    },
    {
      id: 'CHD-003',
      initialName: 'Ananda M.',
      gender: 'Laki-laki',
      age: 17,
      education: 'Kelas 2 SMA (Tahfidz 5 Juz)',
      dream: 'Programmer & Tech Entrepreneur',
      avatar: '👦',
      joinedYear: '2018'
    },
    {
      id: 'CHD-004',
      initialName: 'Ananda K.',
      gender: 'Perempuan',
      age: 9,
      education: 'Kelas 3 SD',
      dream: 'Pelukis & Desainer',
      avatar: '👧',
      joinedYear: '2022'
    }
  ],

  articles: [
    {
      id: 'ART-001',
      title: 'Kunjungan Edukasi & Pelatihan Coding Dasar untuk Anak Panti',
      slug: 'kunjungan-edukasi-pelatihan-coding-dasar',
      excerpt: 'Sebanyak 25 anak asuh jenjang SMP dan SMA mengikuti workshop pemrograman web dasar yang diselenggarakan oleh komunitas tech volunteer.',
      content: 'Panti Asuhan Kasih Bunda menerima kunjungan istimewa dari tim relawan teknologi... Anak-anak sangat antusias belajar membuat halaman web sederhana.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
      date: '2026-08-22',
      author: 'Humas Panti'
    },
    {
      id: 'ART-002',
      title: 'Penyerahan Raport & Apresiasi Anak Asuh Berprestasi Semester Genap',
      slug: 'penyerahan-raport-apresiasi-anak-berprestasi',
      excerpt: 'Bangga! 5 anak asuh Panti Kasih Bunda berhasil meraih peringkat 3 besar di sekolah masing-masing.',
      content: 'Suasana haru dan penuh rasa syukur mewarnai acara penyerahan santunan prestasi semester ini...',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=60',
      date: '2026-07-15',
      author: 'Pengurus Harian'
    }
  ],

  faqs: [
    {
      id: 'FAQ-001',
      question: 'Bagaimana cara melakukan donasi online ke Panti Asuhan Kasih Bunda?',
      answer: 'Anda dapat memilih campaign donasi pada menu Donasi, memilih nominal atau memasukkan nominal kustom, melakukan transfer ke rekening resmi panti yang tertera, dan mengunggah bukti transfer.',
      category: 'Donasi'
    },
    {
      id: 'FAQ-002',
      question: 'Apakah saya bisa datang langsung menyerahkan bantuan barang / sembako?',
      answer: 'Tentu bisa! Pengurus panti menerima kunjungan langsung setiap hari pukul 08.00 - 17.00 WIB. Untuk rombongan besar, disarankan konfirmasi H-1 melalui WhatsApp.',
      category: 'Kunjungan'
    },
    {
      id: 'FAQ-003',
      question: 'Bagaimana transparansi penyaluran donasi terjamin?',
      answer: 'Setiap donasi terverifikasi akan diperhitungkan secara real-time pada progress bar campaign tujuan. Kami juga menyediakan Laporan Perkembangan Campaign dan Kuitansi Digital resmi.',
      category: 'Transparansi'
    }
  ],

  transactions: [
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
    }
  ],

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
    }
  ],

  orphanageProfile: {
    name: 'Panti Asuhan Kasih Bunda',
    tagline: 'Menebar Kasih, Membina Generasi Berakhlak Mulia & Mandiri',
    foundedYear: '2012',
    founder: 'H. Ahmad Dahlan, M.Ag. & Hj. Aminah Dahlan',
    history: 'Panti Asuhan Kasih Bunda didirikan pada tanggal 14 Juli 2012 bermula dari kepedulian sosial terhadap anak-anak yatim piatu dan dhuafa di wilayah sekitar yang membutuhkan tempat tinggal layak, bimbingan akhlak, dan akses pendidikan formal.',
    vision: 'Menjadi lembaga pengasuhan dan pembinaan anak yatim dhuafa yang amanah, profesional, dan unggul dalam mencetak generasi sholeh, berprestasi, serta mandiri pada tahun 2030.',
    missions: [
      'Menyediakan pemenuhan kebutuhan dasar hidup (sandang, pangan bergizi, dan papan yang layak) secara berkelanjutan.',
      'Menjamin keberlanjutan pendidikan formal anak dari tingkat dasar (SD) hingga perguruan tinggi.',
      'Membina karakter Islami, tahfidz Al-Qur\'an, serta budi pekerti luhur bagi seluruh anak asuh.',
      'Membekali keterampilan vokasional, teknologi digital, dan jiwa kewirausahaan untuk kemandirian masa depan anak asuh.',
      'Menyelenggarakan tata kelola lembaga yang transparan, akuntabel, dan berbasis standar akuntabilitas nirlaba.'
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
      { year: '2026', title: 'Juara 1 Lomba Tahfidz 5 Juz Tingkat Provinsi', by: 'Ananda M. (Kelas 2 SMA)' },
      { year: '2025', title: 'Penerima Beasiswa Penuh S1 Universitas Negeri', by: 'Annisa Nurul Aini (Alumni Panti)' },
      { year: '2025', title: 'Juara 2 Lomba Robotika & Coding Tingkat Kota', by: 'Tim Robotik Panti Kasih Bunda' }
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
        { name: 'Budi Santoso, S.E.', position: 'Ketua Pengurus Harian', roleCode: 'Pengurus Harian', photo: '👨‍💼', desc: 'Pengelola Campaign Donasi & Verifikasi Bukti Transfer' },
        { name: 'Siti Rahmawati, A.Md.', position: 'Sekretaris & Administrasi', roleCode: 'Pengurus Harian', photo: '👩‍💼', desc: 'Pencatatan Donasi Offline & Dokumentasi Kegiatan' }
      ]
    }
  ]
};
