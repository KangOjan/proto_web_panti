import React from 'react';
import { Link } from '@inertiajs/react';
import {
  Building2,
  ExternalLink,
  LayoutDashboard,
  FileCheck,
  Heart,
  Layers,
  FileText,
  UserCheck,
  History,
  LogOut,
  Globe,
  X,
  BarChart3,
  Wallet,
  FileSpreadsheet
} from 'lucide-react';

export default function Sidebar({
  currentUser,
  currentRoute,
  onSwitchUserRole,
  onLogout,
  pendingApprovalCount = 0,
  pendingDonationsCount = 0,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  evaluatorMode
}) {
  // Toggle Mode Evaluator via .env (VITE_EVALUATOR_MODE=true|false)
  const isEvaluatorEnabled = evaluatorMode !== undefined
    ? Boolean(evaluatorMode)
    : (import.meta.env.VITE_EVALUATOR_MODE !== 'false');

  const getRoleBadgeColor = (role) => {
    if (role === 'Pengurus Harian') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (role === 'Pemimpin Lembaga') return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  };

  const navItems = [
    {
      label: 'Menu Pengelola',
      items: [
        {
          name: 'Dashboard Pengelola',
          href: '/pengelola/dashboard',
          routeKey: 'admin-dashboard',
          icon: LayoutDashboard
        },
        {
          name: 'Verifikasi Donasi Online',
          href: '/pengelola/verifikasi-donasi',
          routeKey: 'admin-verifikasi',
          icon: FileCheck,
          badge: pendingDonationsCount > 0 ? pendingDonationsCount : null,
          badgeColor: 'bg-amber-400 text-slate-950'
        },
        {
          name: 'Pencatatan Donasi Langsung',
          href: '/pengelola/donasi-offline',
          routeKey: 'admin-offline',
          icon: Heart
        },
        {
          name: 'Manajemen Campaign Donasi',
          href: '/pengelola/campaign',
          routeKey: 'admin-campaign',
          icon: Layers
        },
        {
          name: 'Manajemen Konten (CMS)',
          href: '/pengelola/konten',
          routeKey: 'admin-content',
          icon: FileText
        }
      ]
    },
    {
      label: 'Keuangan & Akuntabilitas',
      items: [
        {
          name: 'Visualisasi Grafik Keuangan',
          href: '/dashboard',
          routeKey: 'dashboard',
          icon: BarChart3
        },
        {
          name: 'Buku Kas Transaksi (CRUD)',
          href: '/transaksi',
          routeKey: 'transaksi',
          icon: Wallet
        },
        {
          name: 'Laporan Arus Kas (PSAK 45)',
          href: '/laporan',
          routeKey: 'laporan',
          icon: FileSpreadsheet
        }
      ]
    },
    {
      label: 'Otorisasi & Audit',
      items: [
        {
          name: 'Persetujuan Akun',
          href: '/approval',
          routeKey: 'approval',
          icon: UserCheck,
          badge: pendingApprovalCount > 0 ? pendingApprovalCount : null,
          badgeColor: 'bg-indigo-400 text-slate-950'
        },
        {
          name: 'Log Audit Aktivitas',
          href: '/audit',
          routeKey: 'audit',
          icon: History
        }
      ]
    }
  ];

  return (
    <>
      {/* Backdrop for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        ></div>
      )}

      <aside className={`fixed left-0 bottom-0 z-40 w-72 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 transition-all duration-300 ease-in-out lg:translate-x-0 ${
        isEvaluatorEnabled ? 'top-9' : 'top-0'
      } ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Top Header & Brand */}
        <div className="p-5 pb-3 space-y-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">
                  SIMK-Panti
                </h1>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Panel Pengelola
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-xl hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SINGLE BUTTON DIRECT TO PUBLIC WEBSITE PREVIEW */}
          <div>
            <Link
              href="/"
              className="w-full py-2.5 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-extrabold rounded-2xl border border-emerald-500/40 text-xs flex items-center justify-between transition-all group shadow-inner"
            >
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span>Lihat Website Publik</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </Link>
          </div>
        </div>

        {/* Scrollable Navigation Groups with Custom Sleek Dark Scrollbar */}
        <nav className="flex-1 overflow-y-auto px-5 py-2 space-y-6 dark-scrollbar">
          {navItems.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
                {group.label}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentRoute === item.routeKey || (currentRoute && currentRoute.includes(item.routeKey));

                  return (
                    <Link
                      key={item.routeKey}
                      href={item.href}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
          {currentUser && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white truncate max-w-[170px]">
                  {currentUser.fullName}
                </div>
                <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded border ${getRoleBadgeColor(currentUser.role)}`}>
                  {currentUser.role}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </aside>
    </>
  );
}
