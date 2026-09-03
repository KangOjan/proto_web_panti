import React, { useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import {
  FileText,
  Building2,
  Users,
  Image,
  Newspaper,
  HelpCircle,
  PlusCircle,
  Edit2,
  Trash2,
  Save,
  CheckCircle2
} from 'lucide-react';

export default function ContentManagement(props) {
  const simk = useSimk();
  const orphanageProfile = (props.orphanageProfile && Object.keys(props.orphanageProfile).length > 0) ? props.orphanageProfile : simk.orphanageProfile;
  const articles = (props.articles && props.articles.length > 0) ? props.articles : simk.articles;
  const faqs = (props.faqs && props.faqs.length > 0) ? props.faqs : simk.faqs;
  const childrenProfiles = (props.childrenProfiles && props.childrenProfiles.length > 0) ? props.childrenProfiles : simk.childrenProfiles;
  const onSaveProfile = props.onSaveProfile || simk.handleSaveProfile;
  const onSaveArticle = props.onSaveArticle || simk.handleSaveArticle;
  const onDeleteArticle = props.onDeleteArticle || simk.handleDeleteArticle;
  const onSaveFaq = props.onSaveFaq || simk.handleSaveFaq;
  const onDeleteFaq = props.onDeleteFaq || simk.handleDeleteFaq;
  const [activeTab, setActiveTab] = useState('profile'); // profile | articles | faqs | children

  // State Profile Edit
  const [name, setName] = useState(orphanageProfile.name || 'Panti Asuhan Kasih Bunda');
  const [tagline, setTagline] = useState(orphanageProfile.tagline || 'Menebar Kasih, Membina Generasi Berakhlak Mulia & Mandiri');
  const [history, setHistory] = useState(orphanageProfile.history || '');
  const [vision, setVision] = useState(orphanageProfile.vision || '');
  const [address, setAddress] = useState(orphanageProfile.contactInfo?.address || '');
  const [phone, setPhone] = useState(orphanageProfile.contactInfo?.phone || '');
  const [whatsapp, setWhatsapp] = useState(orphanageProfile.contactInfo?.whatsapp || '');
  const [email, setEmail] = useState(orphanageProfile.contactInfo?.email || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Article Modal State
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleImage, setArticleImage] = useState('https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60');

  // FAQ Modal State
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  const handleSaveProfileSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...orphanageProfile,
      name,
      tagline,
      history,
      vision,
      contactInfo: {
        ...orphanageProfile.contactInfo,
        address,
        phone,
        whatsapp,
        email
      }
    };
    if (onSaveProfile) {
      onSaveProfile(updatedProfile);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddArticleSubmit = (e) => {
    e.preventDefault();
    if (!articleTitle.trim() || !articleContent.trim()) return;

    const payload = {
      id: `ART-${Date.now().toString().slice(-4)}`,
      title: articleTitle,
      slug: articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: articleContent.substring(0, 120) + '...',
      content: articleContent,
      image: articleImage,
      date: new Date().toISOString().split('T')[0],
      author: 'Pengurus Harian'
    };

    if (onSaveArticle) onSaveArticle(payload);
    setIsArticleModalOpen(false);
    setArticleTitle('');
    setArticleContent('');
  };

  const handleAddFaqSubmit = (e) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    const payload = {
      id: `FAQ-${Date.now().toString().slice(-4)}`,
      question: faqQuestion,
      answer: faqAnswer,
      category: 'Umum'
    };

    if (onSaveFaq) onSaveFaq(payload);
    setIsFaqModalOpen(false);
    setFaqQuestion('');
    setFaqAnswer('');
  };

  return (
    <MainLayout currentRoute="admin-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Manajemen Konten & Informasi Publik</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
              Sistem Manajemen Konten (CMS)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Kelola informasi profil panti, kontak sekretariat, artikel berita kegiatan, serta daftar pertanyaan umum (FAQ) yang tampil pada website publik.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center space-x-2 transition-all ${
              activeTab === 'profile' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Info & Kontak Panti</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center space-x-2 transition-all ${
              activeTab === 'articles' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Artikel & Berita</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center space-x-2 transition-all ${
              activeTab === 'faqs' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Daftar Tanya Jawab (FAQ)</span>
          </button>
        </div>

        {/* TAB 1: PROFILE & CONTACTS */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfileSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            {savedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Informasi Panti berhasil diperbarui!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Panti Asuhan *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tagline / Motto *</label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sejarah Singkat Panti *</label>
              <textarea
                rows="3"
                required
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Visi Lembaga *</label>
              <textarea
                rows="2"
                required
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
              ></textarea>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Perubahan Kontak & Alamat Resmi</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">No. Telepon Kantor</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">No. WhatsApp Resmi</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email Resmi</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Alamat Lengkap Panti</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-md text-xs flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Informasi Panti</span>
            </button>
          </form>
        )}

        {/* TAB 2: ARTICLES */}
        {activeTab === 'articles' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Kelola Artikel & Berita Panti</h3>
                <p className="text-xs text-slate-500">Tambah atau hapus artikel kegiatan panti</p>
              </div>
              <button
                onClick={() => setIsArticleModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tulis Artikel Baru</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {articles.map((art) => (
                <div key={art.id} className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{art.title}</h4>
                    <p className="text-xs text-slate-400">{art.date} • Oleh {art.author}</p>
                  </div>
                  <button
                    onClick={() => onDeleteArticle && onDeleteArticle(art.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200"
                    title="Hapus Artikel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FAQS */}
        {activeTab === 'faqs' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Kelola FAQ Publik</h3>
                <p className="text-xs text-slate-500">Tambah atau hapus item pertanyaan umum</p>
              </div>
              <button
                onClick={() => setIsFaqModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah FAQ Baru</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="pt-3 flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{faq.question}</h4>
                    <p className="text-xs text-slate-600 mt-1">{faq.answer}</p>
                  </div>
                  <button
                    onClick={() => onDeleteFaq && onDeleteFaq(faq.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 flex-shrink-0 ml-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL ARTICLE */}
        {isArticleModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b pb-2">Tulis Artikel Baru</h3>
              <form onSubmit={handleAddArticleSubmit} className="space-y-3 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Judul Artikel..."
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border font-bold"
                />
                <textarea
                  rows="4"
                  required
                  placeholder="Isi artikel..."
                  value={articleContent}
                  onChange={(e) => setArticleContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border font-medium"
                ></textarea>
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setIsArticleModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 font-bold">Batal</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold">Simpan Artikel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL FAQ */}
        {isFaqModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b pb-2">Tambah FAQ Baru</h3>
              <form onSubmit={handleAddFaqSubmit} className="space-y-3 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Pertanyaan..."
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  className="w-full p-2.5 rounded-xl border font-bold"
                />
                <textarea
                  rows="3"
                  required
                  placeholder="Jawaban..."
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  className="w-full p-2.5 rounded-xl border font-medium"
                ></textarea>
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setIsFaqModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 font-bold">Batal</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold">Simpan FAQ</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
