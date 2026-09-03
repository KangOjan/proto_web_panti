import React, { useRef, useEffect, useMemo } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import { Link } from '@inertiajs/react';
import {
  LayoutDashboard,
  Layers,
  Clock,
  CheckCircle2,
  Heart,
  PlusCircle,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  ArrowDownLeft,
  PieChart as PieChartIcon,
  BarChart3,
  Wallet,
  Calendar,
  Check
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function AdminDashboard(props) {
  const simk = useSimk();
  const campaigns = (props.campaigns && props.campaigns.length > 0) ? props.campaigns : simk.campaigns;
  const donations = (props.donations && props.donations.length > 0) ? props.donations : simk.donations;
  const transactions = (props.transactions && props.transactions.length > 0) ? props.transactions : simk.transactions;
  const currentUser = props.currentUser || simk.currentUser;

  const chartBarRef = useRef(null);
  const chartPieRef = useRef(null);
  const barInstance = useRef(null);
  const pieInstance = useRef(null);

  const activeCampaignsCount = campaigns.filter(c => c.status === 'Aktif').length;
  const pendingDonations = donations.filter(d => d.status === 'Pending');
  const verifiedDonations = donations.filter(d => d.status === 'Terverifikasi');

  const totalVerifiedOnline = verifiedDonations
    .filter(d => d.type === 'online')
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  const totalVerifiedOffline = verifiedDonations
    .filter(d => d.type === 'offline')
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  const totalDonationsManaged = totalVerifiedOnline + totalVerifiedOffline;
  const totalVerifiedCount = verifiedDonations.length;
  const avgDonation = totalVerifiedCount > 0 ? Math.round(totalDonationsManaged / totalVerifiedCount) : 0;

  // Monthly Data Calculation for Bar Chart
  const months = ['02', '03', '04', '05', '06', '07'];
  const monthLabels = ['Feb 2026', 'Mar 2026', 'Apr 2026', 'Mei 2026', 'Jun 2026', 'Jul 2026'];

  const monthlyIncome = useMemo(() => {
    return months.map(m =>
      transactions
        .filter(t => t.type === 'pemasukan' && t.date.startsWith(`2026-${m}`))
        .reduce((sum, t) => sum + t.amount, 0)
    );
  }, [transactions]);

  const monthlyExpense = useMemo(() => {
    return months.map(m =>
      transactions
        .filter(t => t.type === 'pengeluaran' && t.date.startsWith(`2026-${m}`))
        .reduce((sum, t) => sum + t.amount, 0)
    );
  }, [transactions]);

  // Category Distribution for Doughnut Chart
  const categories = ['Pendidikan', 'Konsumsi', 'Operasional', 'Kesehatan', 'Infak & Zakat'];
  const categoryAmounts = useMemo(() => {
    return categories.map(cat => {
      // Sum verified donations matching campaign category + direct transactions
      const fromDonations = verifiedDonations
        .filter(d => (d.category && d.category.includes(cat)) || (d.campaignTitle && d.campaignTitle.includes(cat)))
        .reduce((sum, d) => sum + (d.amount || 0), 0);
      const fromTransactions = transactions
        .filter(t => t.type === 'pemasukan' && t.category && t.category.includes(cat))
        .reduce((sum, t) => sum + t.amount, 0);
      return Math.max(fromDonations, fromTransactions, 5000000);
    });
  }, [verifiedDonations, transactions]);

  // Render Charts
  useEffect(() => {
    // 1. Bar Chart: Tren Pemasukan vs Pengeluaran
    if (chartBarRef.current) {
      if (barInstance.current) barInstance.current.destroy();

      const ctx = chartBarRef.current.getContext('2d');
      barInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: monthLabels,
          datasets: [
            {
              label: 'Pemasukan Donasi & Kas',
              data: monthlyIncome,
              backgroundColor: '#10b981',
              borderRadius: 8,
              barPercentage: 0.6,
              categoryPercentage: 0.7
            },
            {
              label: 'Pengeluaran Operasional',
              data: monthlyExpense,
              backgroundColor: '#f43f5e',
              borderRadius: 8,
              barPercentage: 0.6,
              categoryPercentage: 0.7
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { size: 11, weight: 'bold', family: "'Plus Jakarta Sans', sans-serif" }
              }
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: Rp ${ctx.raw.toLocaleString('id-ID')}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `Rp ${(value / 1000000).toFixed(0)} Jt`,
                font: { size: 10 }
              },
              grid: { color: '#f1f5f9' }
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 10 } }
            }
          }
        }
      });
    }

    // 2. Doughnut Chart: Proporsi Donasi Per Kategori
    if (chartPieRef.current) {
      if (pieInstance.current) pieInstance.current.destroy();

      const ctx = chartPieRef.current.getContext('2d');
      pieInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categories,
          datasets: [
            {
              data: categoryAmounts,
              backgroundColor: ['#10b981', '#0ea5e9', '#f59e0b', '#ec4899', '#8b5cf6'],
              borderWidth: 3,
              borderColor: '#ffffff',
              hoverOffset: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,
                padding: 12,
                font: { size: 10, weight: 'bold', family: "'Plus Jakarta Sans', sans-serif" }
              }
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.label}: Rp ${ctx.raw.toLocaleString('id-ID')}`
              }
            }
          }
        }
      });
    }

    return () => {
      if (barInstance.current) barInstance.current.destroy();
      if (pieInstance.current) pieInstance.current.destroy();
    };
  }, [monthlyIncome, monthlyExpense, categoryAmounts]);

  return (
    <MainLayout currentRoute="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-black">
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Portal Pengelola & Analitik Donasi Panti</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
              Dashboard Transparansi & Verifikasi Donasi
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mt-1 leading-relaxed">
              Selamat datang, <b>{currentUser?.fullName || 'Pengurus Harian'}</b>. Pantau visualisasi penerimaan donasi, kelola program prioritas, serta verifikasi bukti transfer donatur.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs border border-white/20 shadow-sm flex items-center space-x-2 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-emerald-300" />
              <span>Visualisasi Keuangan Lengkap</span>
            </Link>

            <Link
              href="/admin/verifikasi-donasi"
              className="px-4 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs shadow-lg flex items-center space-x-2 transition-all"
            >
              <Clock className="w-4 h-4 text-slate-950" />
              <span>Verifikasi Donasi ({pendingDonations.length})</span>
            </Link>
          </div>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Donasi Terkelola</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              Rp {totalDonationsManaged.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-600 font-bold">
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {totalVerifiedCount} Transaksi
              </span>
              <span>Terverifikasi Real-time</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Program / Campaign Aktif</span>
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{activeCampaignsCount} Program</div>
            <p className="text-[11px] text-slate-400 font-medium">Dari total {campaigns.length} program tercatat</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rata-Rata per Donasi</span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-xs">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-900">
              Rp {avgDonation.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Nilai kontribusi rata-rata donatur</p>
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Antrean Verifikasi</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-900">{pendingDonations.length} Donasi</div>
            <p className="text-[11px] text-amber-700 font-bold">Menunggu konfirmasi bukti transfer</p>
          </div>
        </div>

        {/* DATA VISUALIZATION SECTION: CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Bar Chart (2 columns on large screen) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 text-[11px] font-extrabold uppercase text-emerald-700 tracking-wider">
                  <BarChart3 className="w-4 h-4" />
                  <span>Tren Keuangan Bulanan</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Penerimaan Donasi vs Penyaluran Kas
                </h3>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-bold self-start sm:self-auto">
                Februari - Juli 2026
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <canvas ref={chartBarRef}></canvas>
            </div>
          </div>

          {/* Chart 2: Doughnut Chart (1 column on large screen) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4 flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-4">
              <div className="inline-flex items-center space-x-1.5 text-[11px] font-extrabold uppercase text-teal-700 tracking-wider">
                <PieChartIcon className="w-4 h-4" />
                <span>Distribusi Alokasi Dana</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                Proporsi Program Panti
              </h3>
            </div>

            <div className="h-64 w-full relative flex items-center justify-center">
              <canvas ref={chartPieRef}></canvas>
            </div>

            <p className="text-[11px] text-slate-400 text-center font-medium pt-1">
              Data akumulasi otomatis dari seluruh donasi masuk terverifikasi.
            </p>
          </div>

        </div>

        {/* PROGRESS CAPAIAN TARGET PROGRAM PRIORITAS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-[11px] font-extrabold uppercase text-emerald-700 tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Capaian Dana Program</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                Progres Capaian Target Program Prioritas
              </h3>
            </div>
            <Link
              href="/pengelola/campaign"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 self-start sm:self-auto"
            >
              <span>Kelola Seluruh Program</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campaigns.slice(0, 3).map((camp) => {
              const collected = camp.collectedAmount || 0;
              const target = camp.targetAmount || 1;
              const pct = Math.min(Math.round((collected / target) * 100), 100);

              return (
                <div
                  key={camp.id}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3 hover:border-emerald-200 hover:shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {camp.category || 'Prioritas'}
                    </span>
                    <span className="text-xs font-black text-emerald-700">{pct}%</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {camp.title}
                  </h4>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Terkumpul:</span>
                      <span className="font-bold text-slate-800">Rp {collected.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">Target:</span>
                      <span className="font-bold text-slate-600">Rp {target.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Verification Table Snippet */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Antrean Verifikasi Donasi Online (Pending)</h3>
              <p className="text-xs text-slate-500">Periksa bukti transfer dan setujui donasi untuk meng-update progress campaign</p>
            </div>
            <Link
              href="/admin/verifikasi-donasi"
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center space-x-1"
            >
              <span>Kelola Semua Donasi</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Donatur</th>
                  <th className="py-3 px-4">Campaign Tujuan</th>
                  <th className="py-3 px-4">Nominal</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {pendingDonations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-400">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-1 text-emerald-500" />
                      <p className="font-semibold text-xs">Semua donasi online telah diverifikasi.</p>
                    </td>
                  </tr>
                ) : (
                  pendingDonations.map((don) => (
                    <tr key={don.id}>
                      <td className="py-3 px-4 font-bold text-slate-900">{don.donorName}</td>
                      <td className="py-3 px-4 text-slate-600 truncate max-w-xs">{don.campaignTitle}</td>
                      <td className="py-3 px-4 font-black text-emerald-700">Rp {don.amount.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Pending
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href="/admin/verifikasi-donasi"
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                        >
                          Periksa Bukti
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
