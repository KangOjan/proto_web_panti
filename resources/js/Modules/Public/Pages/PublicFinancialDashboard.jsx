import React, { useState, useMemo, useEffect, useRef } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import {
  Globe,
  ArrowDownLeft,
  HeartHandshake,
  Calculator,
  SlidersHorizontal,
  Search,
  ListChecks,
  Printer,
  FileSearch,
  PieChart as PieChartIcon
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function PublicFinancialDashboard(props) {
  const simk = useSimk();
  const transactions = (props.transactions && props.transactions.length > 0) ? props.transactions : simk.transactions;
  const onPrintTransactionReceipt = props.onPrintTransactionReceipt || simk.handlePrintTransactionReceipt;
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const categories = [
    'Konsumsi', 'SPP/Pendidikan', 'Operasional', 'Infak/Zakat', 'Donasi Rutin', 'Lainnya'
  ];

  const filteredTransactions = useMemo(() => {
    return transactions.filter(trx => {
      const matchesType = trx.type === 'pemasukan';
      const matchesCategory = filterCategory === 'ALL' || trx.category === filterCategory;

      const donorOrParty = trx.donorName || trx.description || '';
      const matchesSearch =
        donorOrParty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trx.amount.toString().includes(searchQuery);

      let matchesDate = true;
      if (startDate) matchesDate = matchesDate && trx.date >= startDate;
      if (endDate) matchesDate = matchesDate && trx.date <= endDate;

      return matchesType && matchesCategory && matchesSearch && matchesDate;
    });
  }, [transactions, filterCategory, searchQuery, startDate, endDate]);

  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'pemasukan')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const totalDonorsCount = filteredTransactions.length;
  const averageDonation = totalDonorsCount > 0 ? Math.round(totalIncome / totalDonorsCount) : 0;

  const incomeByCategory = useMemo(() => {
    const categoryTotals = {};
    filteredTransactions
      .filter(t => t.type === 'pemasukan')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
    return categoryTotals;
  }, [filteredTransactions]);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const labels = Object.keys(incomeByCategory);
      const dataValues = Object.values(incomeByCategory);

      const ctx = chartRef.current.getContext('2d');
      chartInstanceRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels.length > 0 ? labels : ['Belum Ada Donasi'],
          datasets: [{
            data: dataValues.length > 0 ? dataValues : [1],
            backgroundColor: labels.length > 0 ? [
              '#10b981', '#14b8a6', '#0ea5e9', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'
            ] : ['#e2e8f0'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
                padding: 12
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const val = context.raw || 0;
                  return ` Rp ${val.toLocaleString('id-ID')}`;
                }
              }
            }
          },
          cutout: '68%'
        }
      });
    }
  }, [incomeByCategory]);

  return (
    <MainLayout currentRoute="keuangan-publik">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold shadow-inner">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Portal Transparansi Donasi Publik</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-2">
              Transparansi Pemasukan Donasi
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Laporan penghimpunan dana dan arus donasi terkelola secara real-time beserta rincian alokasi program sesuai standar akuntabilitas nirlaba.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[160px]">
            <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-extrabold">Total Donasi Terhimpun</div>
            <div className="text-lg font-black text-white mt-0.5">
              Rp {totalIncome.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Real-time Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-center justify-between shadow-xs">
            <div>
              <div className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Total Donasi Terkelola</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                Rp {totalIncome.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">Tercatat real-time dari donatur</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
              <ArrowDownLeft className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-3xl p-5 flex items-center justify-between shadow-xs">
            <div>
              <div className="text-xs font-extrabold text-teal-800 uppercase tracking-wider">Frekuensi Transaksi</div>
              <div className="text-2xl font-black text-teal-700 mt-1">
                {totalDonorsCount} Transaksi
              </div>
              <p className="text-[11px] text-teal-600 mt-1 font-medium">Donasi publik terverifikasi</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-600/20">
              <HeartHandshake className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-5 flex items-center justify-between shadow-xs border border-slate-800">
            <div>
              <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Rata-Rata Per Donasi</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                Rp {averageDonation.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">Nilai kontribusi per transaksi</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold">
              <Calculator className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* CHART & CATEGORY BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Alokasi Donasi Masuk</h3>
                <p className="text-xs text-slate-500">Distribusi proporsi donasi per kategori program</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                Pemasukan
              </span>
            </div>

            <div className="h-64 relative flex items-center justify-center">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Rincian Per Kategori Alokasi Dana</h3>
              <p className="text-xs text-slate-500">Rincian nominal total yang dihimpun untuk kebutuhan anak panti</p>
            </div>

            <div className="space-y-3">
              {Object.keys(incomeByCategory).length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <PieChartIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold">Belum ada donasi masuk pada rentang filter ini.</p>
                </div>
              ) : (
                Object.entries(incomeByCategory).map(([catName, catTotal]) => {
                  const percentage = totalIncome > 0 ? Math.round((catTotal / totalIncome) * 100) : 0;
                  return (
                    <div key={catName} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">{catName}</span>
                        <span className="text-emerald-700 font-black">
                          Rp {catTotal.toLocaleString('id-ID')} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* PUBLIC FILTER TOOLBAR */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <h3 className="text-base font-extrabold text-slate-900">Filter Transaksi Donasi Masuk</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Menampilkan <b className="text-slate-900">{filteredTransactions.length}</b> transaksi donasi
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <div className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 text-white shadow-sm flex items-center space-x-1.5">
                <ArrowDownLeft className="w-4 h-4" />
                <span>Pemasukan Donasi Terverifikasi</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500">Filter Kategori:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Semua Kategori</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Dari Tanggal</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sampai Tanggal</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cari Nama Donatur / Kategori / Nominal</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="cth: Hendra, Konsumsi, 100000..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold relative"
                />
              </div>
            </div>
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <ListChecks className="w-4 h-4 text-emerald-600" />
              <span>Daftar Transaksi Donasi Masuk & Identitas Donatur</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Klik ikon printer untuk melihat Kuitansi Digital Resmi</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">TANGGAL & KODE</th>
                  <th className="py-3.5 px-4">KATEGORI ALOKASI</th>
                  <th className="py-3.5 px-4">NAMA LENGKAP DONATUR</th>
                  <th className="py-3.5 px-4">RINCIAN DOA / KETERANGAN</th>
                  <th className="py-3.5 px-4">NOMINAL DONASI (RP)</th>
                  <th className="py-3.5 px-4 text-right">KUITANSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400">
                      <FileSearch className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold">Tidak ada transaksi pemasukan yang cocok dengan filter Anda.</p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((trx) => {
                    const donorDisplay = trx.donorName || trx.description || 'Hamba Allah / Umum';
                    return (
                      <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900">{trx.date}</div>
                          <div className="text-[10px] font-mono text-slate-400">{trx.id}</div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <ArrowDownLeft className="w-3 h-3" />
                            <span>Pemasukan</span>
                          </span>
                          <div className="text-[11px] font-bold text-slate-700 mt-1">{trx.category}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-black text-slate-900 flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                            <span>{donorDisplay}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {trx.paymentMethod || 'Kas Masuk Bendahara'}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-700 font-medium leading-relaxed max-w-xs truncate">
                            {trx.description || '-'}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-black text-sm text-emerald-700">
                            + Rp {trx.amount.toLocaleString('id-ID')}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onPrintTransactionReceipt && onPrintTransactionReceipt(trx)}
                            className="p-1.5 text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-100 rounded-lg transition-all border border-slate-200 shadow-2xs"
                            title="Lihat Kuitansi Resmi (1 Lembar PDF)"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
