import React, { useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import { Link } from '@inertiajs/react';
import { Newspaper, Calendar, User, Search, ArrowRight } from 'lucide-react';

export default function BeritaArtikel(props) {
  const simk = useSimk();
  const articles = (props.articles && props.articles.length > 0) ? props.articles : simk.articles;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter(art =>
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout currentRoute="berita">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Newspaper className="w-4 h-4 text-emerald-400" />
              <span>Kabar & Transparansi Kegiatan Panti</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-2">
              Artikel & Berita Panti Asuhan
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mt-1 leading-relaxed">
              Dokumentasi aktivitas harian, laporan perkembangan anak asuh, serta informasi kegiatan transparansi Panti Asuhan Kasih Bunda.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10 text-emerald-200">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari artikel kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-400 relative"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-2">
              <Newspaper className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-semibold text-sm">Tidak ada artikel yang ditemukan.</p>
            </div>
          ) : (
            filteredArticles.map((art) => (
              <article key={art.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{art.date}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5" />
                        <span>{art.author}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-2 hover:text-emerald-700 transition-colors">
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/berita/${art.slug || art.id}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
