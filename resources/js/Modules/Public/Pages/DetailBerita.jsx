import React from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

export default function DetailBerita(props) {
  const simk = useSimk();
  const articles = (props.articles && props.articles.length > 0) ? props.articles : simk.articles;
  const articleSlug = props.articleSlug;
  const article = articles.find(a => a.slug === articleSlug || a.id === articleSlug) || articles[0] || {
    id: 'ART-001',
    title: 'Kunjungan Edukasi & Pelatihan Coding Dasar untuk Anak Panti',
    excerpt: 'Sebanyak 25 anak asuh jenjang SMP dan SMA mengikuti workshop pemrograman web dasar.',
    content: `Panti Asuhan Kasih Bunda menerima kunjungan istimewa dari tim relawan teknologi. Kegiatan diawali dengan pengenalan logika dasar komputer dan pemrograman web HTML/CSS.

Anak-anak sangat antusias mengikuti setiap sesi latihan. Beberapa anak bahkan berhasil membuat halaman biodata sederhana secara mandiri.

"Kami sangat bersyukur atas ilmu dan bimbingan yang diberikan oleh para mentor relawan. Keterampilan digital seperti ini sangat penting untuk bekal masa depan anak-anak kami," ungkap Budi Santoso, Pengurus Harian Panti Kasih Bunda.

Kegiatan ditutup dengan penyerahan bantuan 5 unit komputer desktop untuk mendukung laboratorium belajar panti.`,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
    date: '2026-08-22',
    author: 'Humas Panti'
  };

  return (
    <MainLayout currentRoute="berita">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
        <Link
          href="/berita"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Berita</span>
        </Link>

        <article className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-6">
          <div className="space-y-3 border-b border-slate-100 pb-6">
            <div className="flex items-center space-x-3 text-xs text-slate-400 font-semibold">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.date}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5" />
                <span>{article.author}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {article.title}
            </h1>
          </div>

          <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-emerald max-w-none text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {article.content}
          </div>
        </article>
      </div>
    </MainLayout>
  );
}
