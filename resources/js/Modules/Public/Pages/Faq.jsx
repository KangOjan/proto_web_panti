import React, { useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import { INITIAL_SIMK_DATA } from '../../../Data/mockData';
import {
  HelpCircle,
  Search,
  Plus,
  Minus,
  MessageCircle,
  ShieldCheck,
  Heart,
  Building2
} from 'lucide-react';

export default function Faq(props) {
  const simk = useSimk();
  const faqs = (props.faqs && props.faqs.length > 0) ? props.faqs : simk.faqs;
  const availableFaqs = (faqs && faqs.length > 0)
    ? faqs
    : INITIAL_SIMK_DATA.faqs;

  const [openId, setOpenId] = useState(availableFaqs[0]?.id || 'FAQ-001');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'Donasi', 'Kunjungan', 'Transparansi'];

  const filteredFaqs = availableFaqs.filter(f => {
    const matchesCategory = selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchesSearch =
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenWhatsApp = () => {
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent('Halo Pengurus Panti Kasih Bunda, saya ingin bertanya lebih lanjut mengenai donasi / program panti.')}`, '_blank');
  };

  return (
    <MainLayout currentRoute="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-10">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold mx-auto">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Pusat Bantuan & Tanya Jawab Donatur</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Frequently Asked Questions (FAQ)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Temukan jawaban lengkap atas pertanyaan seputar mekanisme donasi, laporan akuntabilitas, kuitansi digital, serta jadwal kunjungan panti asuhan.
          </p>

          <div className="pt-2 max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10 text-emerald-200">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari pertanyaan seputar donasi & kunjungan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-400 relative"
            />
          </div>
        </div>

        {/* Category Pills & FAQ List Container */}
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Category Filter Pills */}
          <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat === 'ALL' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion Items */}
          <div className="space-y-3.5">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-2">
                <HelpCircle className="w-10 h-10 mx-auto text-slate-300" />
                <p className="font-semibold text-sm">Tidak ada pertanyaan yang sesuai pencarian Anda.</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id;
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
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-emerald-700 transition-colors"
                    >
                      <div className="space-y-1 min-w-0 pr-2">
                        {faq.category && (
                          <span className="inline-block text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {faq.category}
                          </span>
                        )}
                        <h3 className="leading-snug text-slate-900">{faq.question}</h3>
                      </div>

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
              })
            )}
          </div>
        </div>

        {/* Still Have Questions CTA Banner */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-emerald-900/50">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">Masih Memiliki Pertanyaan Lain?</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Tim pengurus kami siap membantu dan memberikan informasi lebih rinci terkait program dan kunjungan.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-extrabold rounded-xl shadow-lg text-xs flex items-center space-x-2 transition-all shrink-0 transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" />
            <span>Tanya via WhatsApp</span>
          </button>
        </div>

      </div>
    </MainLayout>
  );
}
