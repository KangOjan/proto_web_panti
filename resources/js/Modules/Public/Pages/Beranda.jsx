import React, { useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import { Link } from '@inertiajs/react';
import {
  Heart,
  ShieldCheck,
  Building2,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Newspaper,
  HelpCircle,
  Clock,
  Layers,
  CheckCircle2,
  FileCheck,
  Receipt,
  CreditCard,
  MessageCircle,
  TrendingUp,
  Share2,
  Check,
  ChevronRight,
  CalendarDays,
  Plus,
  Minus
} from 'lucide-react';

export default function Beranda(props) {
  const simk = useSimk();
  const orphanageProfile = (props.orphanageProfile && Object.keys(props.orphanageProfile).length > 0) ? props.orphanageProfile : simk.orphanageProfile;
  const campaigns = (props.campaigns && props.campaigns.length > 0) ? props.campaigns : simk.campaigns;
  const articles = (props.articles && props.articles.length > 0) ? props.articles : simk.articles;
  const faqs = (props.faqs && props.faqs.length > 0) ? props.faqs : simk.faqs;

  const [openFaqId, setOpenFaqId] = useState('FAQ-001');

  const profile = {
    name: orphanageProfile.name || 'Panti Asuhan Kasih Bunda',
    tagline: orphanageProfile.tagline || 'Menebar Kasih, Membina Generasi Berakhlak Mulia & Mandiri',
    foundedYear: orphanageProfile.foundedYear || '2012',
    history: orphanageProfile.history || 'Panti Asuhan Kasih Bunda didirikan pada tanggal 14 Juli 2012 bermula dari kepedulian sosial...',
    facilities: orphanageProfile.facilities || [],
    achievements: orphanageProfile.achievements || [],
    contactInfo: orphanageProfile.contactInfo || {
      address: 'Jl. Merdeka Kasih Bunda No. 45, Jakarta Selatan',
      phone: '(021) 7829-1029',
      whatsapp: '0812-3456-7890',
      email: 'kontak@pantikasihbunda.or.id'
    }
  };

  const activeCampaigns = campaigns.length > 0 ? campaigns : [
    {
      id: 'CMP-001',
      title: 'Pemenuhan Konsumsi & Gizi Harian Anak Panti',
      category: 'Konsumsi',
      targetAmount: 20000000,
      collectedAmount: 14200000,
      deadline: '2026-09-30',
      status: 'Aktif',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60',
      description: 'Pengadaan beras, lauk pauk, telur, susu, dan buah-buahan bergizi seimbang untuk 45 anak asuh.',
      donorCount: 74
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
      description: 'Dukungan biaya SPP bulanan, buku teks pelajaran, dan seragam sekolah anak asuh.',
      donorCount: 92
    },
    {
      id: 'CMP-003',
      title: 'Renovasi Kamar Asrama & Sarana Belajar Komputer',
      category: 'Fasilitas',
      targetAmount: 35000000,
      collectedAmount: 21500000,
      deadline: '2026-10-15',
      status: 'Aktif',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=60',
      description: 'Perbaikan plafon asrama anak dan penambahan 5 unit komputer untuk pelatihan keterampilan digital.',
      donorCount: 68
    }
  ];

  const displayArticles = articles.length > 0 ? articles : [
    {
      id: 'ART-001',
      title: 'Kunjungan Edukasi & Pelatihan Coding Dasar untuk Anak Panti',
      slug: 'kunjungan-edukasi-pelatihan-coding-dasar',
      excerpt: 'Sebanyak 25 anak asuh jenjang SMP dan SMA mengikuti workshop pemrograman web dasar yang diselenggarakan oleh komunitas tech volunteer.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
      date: '22 Agustus 2026',
      author: 'Humas Panti',
      category: 'Kegiatan'
    },
    {
      id: 'ART-002',
      title: 'Penyerahan Raport & Apresiasi Anak Asuh Berprestasi Semester Genap',
      slug: 'penyerahan-raport-apresiasi-anak-berprestasi',
      excerpt: 'Bangga! 5 anak asuh Panti Kasih Bunda berhasil meraih peringkat 3 besar di sekolah masing-masing.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=60',
      date: '15 Juli 2026',
      author: 'Pengurus Harian',
      category: 'Prestasi'
    }
  ];

  const displayFaqs = faqs.length > 0 ? faqs : [
    {
      id: 'FAQ-001',
      question: 'Bagaimana cara melakukan donasi online ke Panti Asuhan Kasih Bunda?',
      answer: 'Anda dapat memilih campaign donasi pada menu Donasi, memilih nominal atau memasukkan nominal kustom, melakukan transfer ke rekening resmi panti yang tertera, dan mengunggah bukti transfer.'
    },
    {
      id: 'FAQ-002',
      question: 'Apakah saya bisa datang langsung menyerahkan bantuan barang / sembako?',
      answer: 'Tentu bisa! Pengurus panti menerima kunjungan langsung setiap hari pukul 08.00 - 17.00 WIB. Untuk rombongan besar, disarankan konfirmasi H-1 melalui WhatsApp.'
    },
    {
      id: 'FAQ-003',
      question: 'Bagaimana transparansi penyaluran donasi terjamin?',
      answer: 'Setiap donasi terverifikasi akan diperhitungkan secara real-time pada progress bar campaign tujuan. Kami juga menyediakan Laporan Perkembangan Campaign dan Kuitansi Digital resmi.'
    }
  ];

  const impactStats = [
    { label: 'Anak Asuh Terbina', value: '45+', desc: 'Yatim, Piatu & Dhuafa Aktif', icon: Users, color: 'emerald' },
    { label: 'Donasi Tersalurkan', value: 'Rp 450Jt+', desc: '100% Diaudit & Terverifikasi', icon: TrendingUp, color: 'teal' },
    { label: 'Tahun Pengabdian', value: '14 Tahun', desc: 'Melayani Sejak 2012', icon: Building2, color: 'amber' },
    { label: 'Akreditasi Lembaga', value: 'Terakreditasi A', desc: 'Resmi Kemenkumham & Dinsos', icon: ShieldCheck, color: 'blue' }
  ];

  const trustPillars = [
    {
      title: 'Legalitas Berbadan Hukum',
      desc: 'Terdaftar resmi di Kemenkumham RI (No. AHU-0012847.AH.01.04) dan Dinas Sosial sebagai Lembaga Kesejahteraan Sosial (LKS).',
      icon: ShieldCheck,
      badge: 'SK Kemenkumham Aktif'
    },
    {
      title: 'Penyaluran Terdokumentasi',
      desc: 'Setiap pengadaan dana dipublikasikan secara terbuka melalui laporan foto, nota belanja, dan linimasa perkembangan program.',
      icon: FileCheck,
      badge: 'Laporan Terbuka'
    },
    {
      title: 'Kuitansi Digital Otomatis',
      desc: 'Setiap donasi yang diverifikasi langsung menerbitkan tanda terima resmi (digital receipt) ber-ID unik yang dapat diunduh.',
      icon: Receipt,
      badge: 'Receipt Otomatis'
    },
    {
      title: 'Rekening Resmi Yayasan',
      desc: 'Seluruh transaksi masuk langsung ke rekening bank berbadan hukum atas nama yayasan, tanpa perantara rekening pribadi.',
      icon: CreditCard,
      badge: 'Rek. Badan Hukum'
    }
  ];

  const recentDonorWishes = [
    { name: 'Hamba Allah', initials: 'HA', amount: 'Rp 500.000', program: 'Pemenuhan Gizi Harian', message: 'Semoga anak-anak panti selalu sehat, cerdas, dan dilimpahi keberkahan.', time: '2 jam lalu' },
    { name: 'Keluarga Bpk. Hendra S.', initials: 'HS', amount: 'Rp 1.000.000', program: 'Beasiswa Pendidikan', message: 'Doa terbaik untuk kelancaran sekolah adik-adik sekalian. Terus semangat mengejar cita-cita.', time: '5 jam lalu' },
    { name: 'Ibu Ratna Dewi', initials: 'RD', amount: 'Rp 250.000', program: 'Kamar Asrama & Komputer', message: 'Semoga fasilitas belajar barunya bermanfaat dan melahirkan programmer hebat!', time: '1 hari lalu' }
  ];

  return (
    <MainLayout currentRoute="home">
      <div className="animate-fade-in pb-0">
        
        {/* ========================================================================= */}
        {/* 1. FULL-WIDTH HERO SECTION */}
        {/* ========================================================================= */}
        <section className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden pt-12 pb-28 sm:pt-16 sm:pb-36 lg:pt-20 lg:pb-40 border-b border-slate-800">
          
          {/* Subtle Ambient Background Mesh Lights */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[140px] pointer-events-none"></div>
          
          {/* Subtle Grid Accent Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column (7 cols): Copy & Primary CTAs */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                
                {/* Official Accreditation Pill */}
                <div className="inline-flex items-center space-x-2 bg-emerald-500/15 px-4 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold shadow-inner tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lembaga Kesejahteraan Sosial Resmi • Akreditasi A</span>
                </div>

                {/* Powerful Main Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.1]">
                  Menebar Kasih, Membina Generasi{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                    Mandiri & Berakhlak Mulia
                  </span>
                </h1>

                {/* Clear Sub-headline */}
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {profile.name} membina 45 anak yatim piatu & dhuafa. Bersama wujudkan masa depan mereka lewat donasi yang{' '}
                  <span className="text-emerald-300 font-semibold">100% transparan, terverifikasi, dan tercatat resmi</span>.
                </p>

                {/* Main Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                  <Link
                    href="/donasi"
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 text-sm flex items-center justify-center space-x-2.5 transition-all transform hover:-translate-y-0.5"
                  >
                    <Heart className="w-4.5 h-4.5 fill-slate-950" />
                    <span>Donasi Sekarang (Bebas Login)</span>
                  </Link>

                  <Link
                    href="/profil"
                    className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 backdrop-blur-md border border-white/15 transition-all"
                  >
                    <Building2 className="w-4 h-4 text-emerald-300" />
                    <span>Profil & Legalitas Panti</span>
                  </Link>
                </div>

                {/* Instant Trust Ticker */}
                <div className="pt-5 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs text-slate-400 font-medium border-t border-slate-800/60">
                  {['Izin Kemenkumham RI', 'Dinas Sosial Terdaftar', 'Kuitansi Donasi Sah', '100% Diaudit'].map((item) => (
                    <div key={item} className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Right Column (5 cols): Emotional Hero Photo Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 group">
                  <img
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60"
                    alt="Senyum Anak Panti Asuhan Kasih Bunda"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                  {/* Floating Live Donor Pill */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-xl rounded-xl p-3 shadow-2xl border border-white/15 flex items-center space-x-3 text-white">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 flex-shrink-0">
                      <Heart className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                    </div>
                    <div className="text-xs min-w-0">
                      <div className="font-bold text-white truncate">Hamba Allah baru berdonasi</div>
                      <div className="text-[11px] text-emerald-300/80 font-medium truncate">Rp 250.000 • Untuk Pemenuhan Gizi Harian</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. CONNECTED IMPACT STATS STRIP (-MT OVERLAY ON HERO BORDER) */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20 mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {impactStats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-200/60 border border-slate-100 hover:-translate-y-1 transition-all duration-300 space-y-2.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                    {stat.value}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-700">{stat.label}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{stat.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. 4 PILLARS OF TRUST: MENGAPA BERDONASI DI SINI */}
        {/* ========================================================================= */}
        <section className="bg-slate-50/70 border-y border-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-3.5 py-1 rounded-full text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Transparansi & Akuntabilitas</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Mengapa Berdonasi di Panti Kasih Bunda?
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Kami menjunjung tinggi amanah donatur melalui sistem pencatatan donasi digital, audit berkala, dan transparansi laporan penyaluran.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trustPillars.map((pillar, idx) => {
                const PillarIcon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:border-emerald-200 hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <PillarIcon className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{pillar.badge}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CAMPAIGN DONASI PRIORITAS */}
        {/* ========================================================================= */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
              <div>
                <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Program Donasi Pilihan</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Campaign Kebutuhan Anak Panti
                </h2>
                <p className="text-sm text-slate-500 mt-1 max-w-lg">
                  Pilih program kebutuhan mendesak yang ingin Anda dukung secara langsung.
                </p>
              </div>

              <Link
                href="/donasi"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors shrink-0"
              >
                <span>Salurkan Donasi Umum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCampaigns.map((camp) => {
                const percent = camp.targetAmount > 0
                  ? Math.min(100, Math.round(((camp.collectedAmount || 0) / camp.targetAmount) * 100))
                  : 0;

                return (
                  <div
                    key={camp.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col group"
                  >
                    {/* Campaign Image */}
                    <div className="aspect-video relative overflow-hidden bg-slate-100">
                      <img
                        src={camp.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60'}
                        alt={camp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                        <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                          {camp.category}
                        </span>
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                          camp.status === 'Target Tercapai'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {camp.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {camp.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {camp.description}
                      </p>

                      {/* Crowdfunding Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-emerald-600 font-mono text-[13px]">
                            Rp {(camp.collectedAmount || 0).toLocaleString('id-ID')}
                          </span>
                          <span className="text-slate-400 font-mono">{percent}%</span>
                        </div>

                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                          <span>Target: Rp {(camp.targetAmount || 0).toLocaleString('id-ID')}</span>
                          <span>{camp.donorCount || 40}+ Donatur</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-4 flex items-center justify-between border-t border-slate-100">
                      <Link
                        href={`/campaign/${camp.id}`}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors flex items-center space-x-1"
                      >
                        <span>Detail Program</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/donasi?campaign=${camp.id}`}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-sm flex items-center space-x-1.5 transition-all"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span>Donasi Sekarang</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. SOCIAL PROOF: DOA & DUKUNGAN DONATUR TERBARU */}
        {/* ========================================================================= */}
        <section className="bg-slate-50/70 border-y border-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Doa & Solidaritas Kebaikan</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Doa Donatur & Orang Baik</h2>
              </div>
              <span className="text-xs font-medium text-slate-400 hidden sm:inline">
                Update Real-Time
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentDonorWishes.map((wish, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {wish.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{wish.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{wish.time}</div>
                    </div>
                  </div>

                  <div className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 font-mono">
                    {wish.amount} • {wish.program}
                  </div>

                  <p className="text-xs text-slate-600 italic leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{wish.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. NEWS & ARTICLES PREVIEW */}
        {/* ========================================================================= */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <div className="inline-flex items-center space-x-2 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
                  <Newspaper className="w-3.5 h-3.5" />
                  <span>Kabar & Transparansi Kegiatan</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Artikel & Berita Panti</h2>
              </div>

              <Link href="/berita" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 transition-colors shrink-0">
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {displayArticles.slice(0, 2).map((art) => (
                <Link
                  key={art.id}
                  href={`/berita/${art.slug || art.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col sm:flex-row group"
                >
                  <div className="sm:w-44 h-40 sm:h-auto relative overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {art.category && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                        {art.category}
                      </span>
                    )}
                  </div>
                  <div className="p-5 space-y-2 flex-1 flex flex-col justify-center">
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium">
                      <CalendarDays className="w-3 h-3" />
                      <span>{art.date}</span>
                      <span>•</span>
                      <span>{art.author}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                    <span className="text-xs font-semibold text-emerald-600 inline-flex items-center space-x-1 pt-1">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. FAQ QUICK PREVIEW */}
        {/* ========================================================================= */}
        <section className="bg-slate-50/70 border-y border-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center space-x-2 bg-slate-200 text-slate-700 px-3.5 py-1 rounded-full text-xs font-bold">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Pusat Bantuan & Tanya Jawab</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Jawaban ringkas seputar penyaluran donasi, verifikasi kuitansi, transparansi, dan tata cara kunjungan panti asuhan.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-3.5">
              {displayFaqs.slice(0, 4).map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                      isOpen
                        ? 'bg-white border-emerald-300 shadow-md ring-1 ring-emerald-500/20'
                        : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-emerald-700 transition-colors"
                    >
                      <span className="leading-snug">{faq.question}</span>
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isOpen
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/40 animate-fade-in">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/faq"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:border-emerald-300 shadow-xs transition-all"
              >
                <span>Lihat Seluruh Tanya Jawab (FAQ Lengkap)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. FULL-WIDTH CALL TO ACTION BANNER */}
        {/* ========================================================================= */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 p-8 sm:p-12 lg:p-16 text-white shadow-xl text-center space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/8 rounded-full blur-3xl pointer-events-none"></div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight relative z-10">
                Bersama Nyalakan Harapan Masa Depan Anak Yatim Dhuafa
              </h2>
              <p className="text-sm text-emerald-200/80 max-w-xl mx-auto leading-relaxed relative z-10">
                Donasi Anda disalurkan secara amanah dengan kuitansi digital sah dan dokumentasi belanja terbuka.
              </p>
              <div className="pt-2 relative z-10">
                <Link
                  href="/donasi"
                  className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 text-sm transition-all transform hover:-translate-y-0.5"
                >
                  <Heart className="w-4.5 h-4.5 fill-slate-950" />
                  <span>Salurkan Kebaikan Sekarang</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
