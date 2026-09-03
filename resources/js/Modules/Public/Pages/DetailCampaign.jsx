import React, { useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import { INITIAL_SIMK_DATA } from '../../../Data/mockData';
import { Link } from '@inertiajs/react';
import {
  Heart,
  Calendar,
  CreditCard,
  History,
  ArrowLeft,
  CheckCircle2,
  Share2,
  AlertCircle,
  Copy,
  Check,
  MessageCircle,
  ShieldCheck,
  Users,
  Sparkles
} from 'lucide-react';

export default function DetailCampaign(props) {
  const simk = useSimk();
  const campaigns = (props.campaigns && props.campaigns.length > 0) ? props.campaigns : (simk?.campaigns || []);
  const campaignId = props.campaignId;

  const [activeTab, setActiveTab] = useState('description'); // description | updates | prayers
  const [isCopied, setIsCopied] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const availableCampaigns = React.useMemo(() => {
    if (campaigns && campaigns.length > 0) return campaigns;
    return INITIAL_SIMK_DATA.campaigns;
  }, [campaigns]);

  const campaign = availableCampaigns.find(c => c.id === campaignId) || availableCampaigns[0] || {
    id: 'CMP-001',
    title: 'Pemenuhan Konsumsi & Gizi Harian Anak Panti',
    category: 'Konsumsi',
    targetAmount: 20000000,
    collectedAmount: 14200000,
    deadline: '2026-09-30',
    status: 'Aktif',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60',
    description: `Program ini ditujukan untuk menjamin ketersediaan makanan bergizi seimbang (beras premium, sayur-mayur, telur, ayam/ikan, susu segar, dan buah) bagi 45 anak asuh di Panti Asuhan Kasih Bunda.

Gizi yang tercukupi adalah hak dasar setiap anak untuk tumbuh kembang yang optimal dan mendukung konsentrasi belajar mereka di sekolah.

Rincian Alokasi Dana:
• Belanja beras 500kg & sembako pokok: Rp 8.000.000
• Lauk pauk bergizi & protein hewani harian: Rp 7.500.000
• Susu & suplemen vitamin harian: Rp 4.500.000`,
    bankAccount: '7123-4567-89',
    bankName: 'Bank Syariah Indonesia (BSI)',
    accountHolder: 'YPI Kasih Bunda',
    donorCount: 74,
    updates: [
      {
        id: 'UPD-101',
        date: '2026-08-15',
        title: 'Penyaluran Tahap I: Pengadaan Sembako Bulan Agustus',
        content: 'Alhamdulillah, dana terhimpun sebesar Rp 10.000.000 telah disalurkan untuk belanja 500kg beras, minyak goreng, telur, dan lauk-pauk segar. Terima kasih para donatur dermawan.'
      }
    ]
  };

  const percentage = campaign.targetAmount > 0
    ? Math.min(100, Math.round(((campaign.collectedAmount || 0) / campaign.targetAmount) * 100))
    : 0;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(campaign.bankAccount || '7123456789');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `Mari bersama bantu program: ${campaign.title} di Panti Asuhan Kasih Bunda. Salurkan donasi Anda secara transparan. Info lengkap: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2500);
  };

  const samplePrayers = [
    { name: 'Bpk. Ahmad Fauzi', nominal: 'Rp 200.000', message: 'Semoga anak-anak panti selalu sehat, ceria, dan berkah studinya.', time: '3 jam lalu' },
    { name: 'Hamba Allah', nominal: 'Rp 500.000', message: 'Bismillah, semoga menjadi amal jariyah dan bermanfaat luas.', time: '8 jam lalu' },
    { name: 'Keluarga Ibu Sarah', nominal: 'Rp 350.000', message: 'Titip doa untuk kelancaran hajat keluarga kami. Terus semangat adik-adik.', time: '1 hari lalu' }
  ];

  return (
    <MainLayout currentRoute="donasi">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
        
        {/* Navigation & Share bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 flex items-center space-x-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan WA</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold hover:bg-slate-200 flex items-center space-x-1.5 transition-all"
            >
              {isLinkCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isLinkCopied ? 'Tersalin!' : 'Salin Tautan'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Main Visual, Title, Tabs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 aspect-video bg-slate-100">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold rounded-full">
                  {campaign.category}
                </span>
                <span className="px-3 py-1 text-xs font-black rounded-full border bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm">
                  {campaign.status}
                </span>
              </div>
            </div>

            {/* Campaign Header Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
              <div className="inline-flex items-center space-x-2 text-emerald-700 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-4 h-4" />
                <span>Program Terverifikasi Resmi Yayasan</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {campaign.title}
              </h1>

              {/* Interactive Tabs Header */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pt-3 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    activeTab === 'description'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Rincian Kebutuhan
                </button>

                <button
                  onClick={() => setActiveTab('updates')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'updates'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Update Penyaluran ({campaign.updates?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('prayers')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'prayers'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Doa Donatur ({samplePrayers.length})</span>
                </button>
              </div>

              {/* TAB 1: DESCRIPTION */}
              {activeTab === 'description' && (
                <div className="pt-2 text-slate-600 text-sm leading-relaxed whitespace-pre-line space-y-4">
                  <p>{campaign.description}</p>

                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-xs text-slate-700 space-y-1.5">
                    <div className="font-extrabold text-emerald-900 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Jaminan Transparansi Lembaga:</span>
                    </div>
                    <p className="text-slate-600">
                      Setiap penyaluran dana akan didokumentasikan dalam bentuk foto belanja dan kuitansi toko yang dipublikasikan pada tab <b>Update Penyaluran</b> program ini.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: UPDATES / TIMELINE PENYALURAN */}
              {activeTab === 'updates' && (
                <div className="pt-2 space-y-6">
                  {!campaign.updates || campaign.updates.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 space-y-2">
                      <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-xs font-semibold">Belum ada update perkembangan untuk program ini.</p>
                    </div>
                  ) : (
                    <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
                      {campaign.updates.map((update) => (
                        <div key={update.id} className="relative pl-8 space-y-1.5">
                          <div className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-white"></div>
                          <div className="text-[11px] font-mono font-bold text-slate-400">{update.date}</div>
                          <h4 className="text-sm font-black text-slate-900">{update.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            {update.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DOA & DUKUNGAN DONATUR */}
              {activeTab === 'prayers' && (
                <div className="pt-2 space-y-3">
                  {samplePrayers.map((prayer, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-extrabold text-slate-900">{prayer.name}</div>
                        <span className="text-[10px] text-slate-400">{prayer.time}</span>
                      </div>
                      <div className="text-[11px] font-black text-emerald-700 font-mono">
                        {prayer.nominal}
                      </div>
                      <p className="text-xs text-slate-600 italic">
                        "{prayer.message}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Donation Box */}
          <div className="lg:col-span-5 space-y-6 sticky top-20">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
              
              {/* Progress Numbers */}
              <div className="space-y-3">
                <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Dana Terkumpul</div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-700 font-mono">
                  Rp {(campaign.collectedAmount || 0).toLocaleString('id-ID')}
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Target: <b className="text-slate-800">Rp {(campaign.targetAmount || 0).toLocaleString('id-ID')}</b></span>
                  <span className="font-black text-slate-900">{percentage}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-1">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{campaign.donorCount || 74}+ Orang Baik Telah Berdonasi</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Batas: {campaign.deadline || '30 Sep 2026'}</span>
                  </div>
                </div>
              </div>

              {/* Bank Account Info Card with 1-Click Copy */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
                  <div className="flex items-center space-x-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Rekening Resmi Program:</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">BSI</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-base font-black text-slate-900">
                      {campaign.bankAccount || '7123-4567-89'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold">
                      a.n. {campaign.accountHolder || 'YPI Kasih Bunda'}
                    </div>
                  </div>

                  <button
                    onClick={handleCopyAccount}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1 ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              {/* Main CTA */}
              <Link
                href={`/donasi?campaign=${campaign.id}`}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/30 text-sm flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>Salurkan Donasi Sekarang</span>
              </Link>

              <div className="text-center">
                <span className="text-[11px] text-slate-400 font-medium">
                  🔒 Donasi tanpa login • Kuitansi digital otomatis
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
