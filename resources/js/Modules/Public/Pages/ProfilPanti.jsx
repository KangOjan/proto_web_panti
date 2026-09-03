import React from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import { INITIAL_SIMK_DATA } from '../../../Data/mockData';
import {
  Building2,
  Users,
  Award,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Heart,
  UserCheck,
  Sparkles,
  CheckCircle2,
  Calendar,
  ExternalLink,
  MessageCircle,
  Briefcase,
  GraduationCap
} from 'lucide-react';

export default function ProfilPanti(props) {
  const simk = useSimk();
  const orphanageProfile = (props.orphanageProfile && Object.keys(props.orphanageProfile).length > 0) ? props.orphanageProfile : simk.orphanageProfile;
  const organizationStructure = (props.organizationStructure && props.organizationStructure.length > 0) ? props.organizationStructure : simk.organizationStructure;
  const childrenProfiles = (props.childrenProfiles && props.childrenProfiles.length > 0) ? props.childrenProfiles : simk.childrenProfiles;

  const profile = {
    name: orphanageProfile.name || 'Panti Asuhan Kasih Bunda',
    tagline: orphanageProfile.tagline || 'Menebar Kasih, Membina Generasi Berakhlak Mulia & Mandiri',
    foundedYear: orphanageProfile.foundedYear || '2012',
    founder: orphanageProfile.founder || 'H. Ahmad Dahlan, M.Ag. & Hj. Aminah Dahlan',
    history: orphanageProfile.history || 'Panti Asuhan Kasih Bunda didirikan pada tanggal 14 Juli 2012 bermula dari kepedulian sosial terhadap anak-anak yatim piatu dan dhuafa di wilayah Jakarta Selatan. Selama lebih dari 14 tahun, kami telah membina lebih dari 150 alumni anak asuh yang kini berdikari.',
    vision: orphanageProfile.vision || 'Menjadi lembaga pengasuhan dan pembinaan anak yatim dhuafa yang amanah, profesional, berakhlak mulia, dan unggul dalam keterampilan masa depan.',
    missions: orphanageProfile.missions || [
      'Menyediakan pemenuhan kebutuhan dasar hidup secara layak, sehat, dan berkelanjutan.',
      'Menjamin keberlanjutan pendidikan formal anak hingga jenjang perguruan tinggi / kejuruan.',
      'Membina karakter Islami, tahfidz Al-Qur\'an, dan penanaman budi pekerti luhur.',
      'Membekali keterampilan vokasional, teknologi digital, dan kemandirian wirausaha.'
    ],
    legalities: orphanageProfile.legalities || [
      { type: 'Keputusan Kemenkumham RI', number: 'AHU-0012847.AH.01.04.Tahun 2012', date: '14 Juli 2012' },
      { type: 'Izin Operasional Dinas Sosial', number: '503/412/LKS-DINSOS/2023', date: 'Berlaku s.d. 2028' },
      { type: 'Akta Notaris Pendirian', number: 'No. 42 / Notaris Hj. Kartika, S.H.', date: '10 Mei 2012' },
      { type: 'Nomor Pokok Wajib Pajak (NPWP)', number: '03.284.192.4-012.000', date: 'Terdaftar Aktif' }
    ],
    facilities: orphanageProfile.facilities || [
      { name: 'Asrama Putra & Putri Terpisah', desc: 'Kamar tidur bersih, berpenerangan baik dengan ranjang individu dan lemari pakaian pribadi.' },
      { name: 'Laboratorium Komputer & Internet', desc: '10 unit komputer PC dengan akses internet terpantau untuk pembelajaran daring & coding dasar.' },
      { name: 'Musholla & Rumah Tahfidz', desc: 'Sarana ibadah bersama, kajian harian, dan bimbingan hafalan Al-Qur\'an.' },
      { name: 'Ruang Makan & Dapur Higienis', desc: 'Fasilitas makan bersama dengan standar gizi harian yang terkontrol.' }
    ],
    contactInfo: orphanageProfile.contactInfo || {
      address: 'Jl. Merdeka Kasih Bunda No. 45, Kebayoran Baru, Jakarta Selatan 12150',
      phone: '(021) 7829-1029',
      whatsapp: '0812-3456-7890',
      email: 'kontak@pantikasihbunda.or.id',
      visitingHours: 'Setiap Hari: 08.00 - 17.00 WIB'
    }
  };

  const orgStructure = (organizationStructure && organizationStructure.length > 0)
    ? organizationStructure
    : INITIAL_SIMK_DATA.organizationStructure;

  const childrenList = (childrenProfiles && childrenProfiles.length > 0)
    ? childrenProfiles
    : INITIAL_SIMK_DATA.childrenProfiles || [
      { id: 'CHD-001', initialName: 'Ananda R.', gender: 'Laki-laki', age: 12, education: 'Kelas 6 SD', dream: 'Dokter Spesialis Anak', avatar: '👦' },
      { id: 'CHD-002', initialName: 'Ananda S.', gender: 'Perempuan', age: 15, education: 'Kelas 3 SMP', dream: 'Guru Bahasa Indonesia', avatar: '👧' },
      { id: 'CHD-003', initialName: 'Ananda M.', gender: 'Laki-laki', age: 17, education: 'Kelas 2 SMA (Tahfidz 5 Juz)', dream: 'Programmer Web & Software', avatar: '👦' },
      { id: 'CHD-004', initialName: 'Ananda K.', gender: 'Perempuan', age: 9, education: 'Kelas 3 SD', dream: 'Pelukis & Desainer', avatar: '👧' }
    ];

  const handleOpenWhatsApp = () => {
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent('Halo Pengurus Panti Kasih Bunda, saya ingin berkonsultasi mengenai donasi / rencana kunjungan silaturahmi.')}`, '_blank');
  };

  return (
    <MainLayout currentRoute="profil">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-12">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-black">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Profil Resmi & Transparansi Lembaga</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{profile.name}</h1>
            <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">{profile.tagline}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center min-w-[170px] shadow-lg">
            <div className="text-[10px] uppercase tracking-wider text-amber-300 font-black">Dedikasi Pengabdian</div>
            <div className="text-3xl font-black text-white mt-0.5">{profile.foundedYear}</div>
            <div className="text-[11px] text-emerald-200 font-bold mt-1">14+ Tahun Amanah</div>
          </div>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Visi Utama Lembaga</h2>
                <p className="text-xs text-slate-400">Komitmen arah jangka panjang</p>
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-5 rounded-2xl border border-slate-100 italic">
              "{profile.vision}"
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Misi Pengabdian</h2>
                <p className="text-xs text-slate-400">Langkah nyata pembinaan anak asuh</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
              {profile.missions.map((m, idx) => (
                <li key={idx} className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* STRUKTUR ORGANISASI & PENGURUS LEMBAGA */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 px-3.5 py-1 rounded-full text-emerald-800 text-xs font-black">
              <UserCheck className="w-4 h-4" />
              <span>Struktur Organisasi & Pengurus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Struktur Kepengurusan Lembaga
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Dewan pembina, pimpinan yayasan, dan tim pengasuh profesional yang mendampingi tumbuh kembang anak-anak asuh setiap hari.
            </p>
          </div>

          <div className="space-y-8">
            {orgStructure.map((group, gIdx) => (
              <div key={gIdx} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="h-px flex-1 bg-slate-200"></span>
                  <span className="text-xs font-extrabold uppercase tracking-wider px-4 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-xs">
                    {group.role}
                  </span>
                  <span className="h-px flex-1 bg-slate-200"></span>
                </div>

                <div className={`grid gap-5 ${
                  group.members.length === 1
                    ? 'grid-cols-1 max-w-md mx-auto'
                    : group.members.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {group.members.map((member, mIdx) => (
                    <div
                      key={mIdx}
                      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-200 transition-all flex items-start space-x-4 group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl flex-shrink-0 border border-emerald-100 shadow-xs group-hover:scale-105 transition-transform">
                        {member.photo || '👤'}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{member.name}</h4>
                        <div className="text-xs font-bold text-emerald-700">{member.position}</div>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal pt-0.5">{member.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROFIL ANAK ASUHAN */}
        <div className="space-y-6 bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1 rounded-full text-emerald-300 text-xs font-black border border-emerald-400/30">
              <Users className="w-4 h-4" />
              <span>Profil Anak Asuhan (Privasi Terlindungi)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Mengenal Potensi & Impian Anak Asuh</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Profil ditampilkan secara terbatas (inisial nama, jenjang pendidikan, & cita-cita) sesuai kaidah perlindungan privasi anak dan pemenuhan hak tumbuh kembang mereka.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {childrenList.map((child) => (
              <div key={child.id} className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 hover:border-emerald-500/50 transition-all space-y-3 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-2xl shadow-inner">
                    {child.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{child.initialName}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      {child.gender} • {child.age} Thn
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs border-t border-slate-700/60 pt-3">
                  <div className="text-slate-400">Pendidikan: <span className="font-bold text-slate-200">{child.education}</span></div>
                  <div className="text-slate-400">Cita-cita: <span className="font-black text-amber-400">{child.dream}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LEGALITAS & SERTIFIKAT RESMI */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
            <div>
              <h3 className="text-lg font-black text-slate-900">Legalitas & Akreditasi Lembaga Resmi</h3>
              <p className="text-xs text-slate-500">Tercatat secara sah dan berkekuatan hukum di Republik Indonesia</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {profile.legalities.map((leg, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="text-xs font-black text-slate-800">{leg.type}</div>
                <div className="text-xs font-mono text-emerald-700 font-bold break-all">{leg.number}</div>
                <div className="text-[10px] text-slate-400 font-semibold">{leg.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LOKASI, JAM KUNJUNGAN & KONTAK CEPAT */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-slate-900">Ingin Mengunjungi Panti / Silaturahmi Langsung?</h3>
            <p className="text-xs text-slate-600 max-w-xl">
              Kami menyambut hangat kunjungan donatur, relawan, dan silaturahmi masyarakat.
              <br />
              <b>Alamat:</b> {profile.contactInfo.address}
              <br />
              <b>Jam Kunjungan:</b> {profile.contactInfo.visitingHours}
            </p>
          </div>

          <button
            onClick={handleOpenWhatsApp}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg text-xs flex items-center space-x-2 flex-shrink-0 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Konfirmasi Kunjungan via WhatsApp</span>
          </button>
        </div>

      </div>
    </MainLayout>
  );
}
