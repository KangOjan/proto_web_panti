// Modern Dark Sidebar Component for Pengelola & Pemimpin Panel
// Role-based Navigation tailored for Pengurus Harian and Pemimpin Lembaga

const Sidebar = ({
  currentUser,
  currentRoute = 'admin-dashboard',
  onNavigateTab,
  onLogout,
  pendingApprovalCount = 0,
  pendingDonationsCount = 0,
  isMobileSidebarOpen = false,
  setIsMobileSidebarOpen,
  evaluatorMode = true,
}) => {
  const roleRaw = String(currentUser?.role || '').toLowerCase();
  const isPengurusHarian = roleRaw === 'pengurus harian' || roleRaw === 'pengurus_harian';
  const isPemimpinLembaga = roleRaw === 'pemimpin lembaga' || roleRaw === 'pemimpin_lembaga';

  const getRoleBadgeColor = (role) => {
    const r = String(role || '').toLowerCase();
    if (r === 'pengurus harian' || r === 'pengurus_harian') {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
    if (r === 'pemimpin lembaga' || r === 'pemimpin_lembaga') {
      return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    }
    return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  };

  // Build role-tailored navigation items
  const navItems = React.useMemo(() => {
    // 1. Menu khusus Pemimpin Lembaga (Pimpinan Yayasan / Direksi)
    if (isPemimpinLembaga) {
      return [
        {
          label: 'Otorisasi & Audit',
          items: [
            {
              name: 'Persetujuan Akun',
              routeKey: 'approval',
              href: '/approval',
              icon: window.UserCheck,
              badge: pendingApprovalCount > 0 ? pendingApprovalCount : null,
              badgeColor: 'bg-indigo-400 text-slate-950',
            },
            {
              name: 'Log Audit Aktivitas',
              routeKey: 'audit',
              href: '/audit',
              icon: window.History,
            },
          ],
        },
        {
          label: 'Pengawasan Keuangan',
          items: [
            {
              name: 'Visualisasi Grafik Keuangan',
              routeKey: 'dashboard',
              href: '/dashboard',
              icon: window.BarChart3,
            },
            {
              name: 'Buku Kas Transaksi (Monitoring)',
              routeKey: 'transaksi',
              href: '/transaksi',
              icon: window.Wallet,
            },
            {
              name: 'Laporan Arus Kas (PSAK 45)',
              routeKey: 'laporan',
              href: '/laporan',
              icon: window.FileSpreadsheet,
            },
            {
              name: 'Program Prioritas',
              routeKey: 'program',
              href: '/program',
              icon: window.Award,
            },
          ],
        },
        {
          label: 'Ikhtisar Eksekutif',
          items: [
            {
              name: 'Dashboard Pengelola',
              routeKey: 'admin-dashboard',
              href: '/pengelola/dashboard',
              icon: window.LayoutDashboard,
            },
          ],
        },
      ];
    }

    // 2. Menu khusus Pengurus Harian (Manajemen Operasional & Kasir)
    if (isPengurusHarian) {
      return [
        {
          label: 'Menu Pengelola',
          items: [
            {
              name: 'Dashboard Pengelola',
              routeKey: 'admin-dashboard',
              href: '/pengelola/dashboard',
              icon: window.LayoutDashboard,
            },
            {
              name: 'Verifikasi Donasi Online',
              routeKey: 'admin-verifikasi',
              href: '/pengelola/verifikasi-donasi',
              icon: window.FileCheck,
              badge: pendingDonationsCount > 0 ? pendingDonationsCount : null,
              badgeColor: 'bg-amber-400 text-slate-950',
            },
            {
              name: 'Pencatatan Donasi Langsung',
              routeKey: 'admin-offline',
              href: '/pengelola/donasi-offline',
              icon: window.Heart,
            },
            {
              name: 'Manajemen Campaign Donasi',
              routeKey: 'admin-campaign',
              href: '/pengelola/campaign',
              icon: window.Layers,
            },
            {
              name: 'Manajemen Konten (CMS)',
              routeKey: 'admin-konten',
              href: '/pengelola/konten',
              icon: window.FileText,
            },
          ],
        },
        {
          label: 'Keuangan & Akuntabilitas',
          items: [
            {
              name: 'Visualisasi Grafik Keuangan',
              routeKey: 'dashboard',
              href: '/dashboard',
              icon: window.BarChart3,
            },
            {
              name: 'Buku Kas Transaksi (CRUD)',
              routeKey: 'transaksi',
              href: '/transaksi',
              icon: window.Wallet,
            },
            {
              name: 'Laporan Arus Kas (PSAK 45)',
              routeKey: 'laporan',
              href: '/laporan',
              icon: window.FileSpreadsheet,
            },
            {
              name: 'Program Prioritas',
              routeKey: 'program',
              href: '/program',
              icon: window.Award,
            },
          ],
        },
      ];
    }

    // 3. Fallback jika peran evaluator atau super admin (tampilkan semua menu)
    return [
      {
        label: 'Menu Pengelola',
        items: [
          {
            name: 'Dashboard Pengelola',
            routeKey: 'admin-dashboard',
            href: '/pengelola/dashboard',
            icon: window.LayoutDashboard,
          },
          {
            name: 'Verifikasi Donasi Online',
            routeKey: 'admin-verifikasi',
            href: '/pengelola/verifikasi-donasi',
            icon: window.FileCheck,
            badge: pendingDonationsCount > 0 ? pendingDonationsCount : null,
            badgeColor: 'bg-amber-400 text-slate-950',
          },
          {
            name: 'Pencatatan Donasi Langsung',
            routeKey: 'admin-offline',
            href: '/pengelola/donasi-offline',
            icon: window.Heart,
          },
          {
            name: 'Manajemen Campaign Donasi',
            routeKey: 'admin-campaign',
            href: '/pengelola/campaign',
            icon: window.Layers,
          },
          {
            name: 'Manajemen Konten (CMS)',
            routeKey: 'admin-konten',
            href: '/pengelola/konten',
            icon: window.FileText,
          },
        ],
      },
      {
        label: 'Keuangan & Akuntabilitas',
        items: [
          {
            name: 'Visualisasi Grafik Keuangan',
            routeKey: 'dashboard',
            href: '/dashboard',
            icon: window.BarChart3,
          },
          {
            name: 'Buku Kas Transaksi (CRUD)',
            routeKey: 'transaksi',
            href: '/transaksi',
            icon: window.Wallet,
          },
          {
            name: 'Laporan Arus Kas (PSAK 45)',
            routeKey: 'laporan',
            href: '/laporan',
            icon: window.FileSpreadsheet,
          },
          {
            name: 'Program Prioritas',
            routeKey: 'program',
            href: '/program',
            icon: window.Award,
          },
        ],
      },
      {
        label: 'Otorisasi & Audit',
        items: [
          {
            name: 'Persetujuan Akun',
            routeKey: 'approval',
            href: '/approval',
            icon: window.UserCheck,
            badge: pendingApprovalCount > 0 ? pendingApprovalCount : null,
            badgeColor: 'bg-indigo-400 text-slate-950',
          },
          {
            name: 'Log Audit Aktivitas',
            routeKey: 'audit',
            href: '/audit',
            icon: window.History,
          },
        ],
      },
    ];
  }, [isPemimpinLembaga, isPengurusHarian, pendingApprovalCount, pendingDonationsCount]);

  const handleItemClick = (routeKey, href) => {
    if (setIsMobileSidebarOpen) setIsMobileSidebarOpen(false);
    if (onNavigateTab) {
      onNavigateTab(routeKey);
    } else if (window.navigateToRoute) {
      window.navigateToRoute(href);
    }
  };

  const isItemActive = (routeKey) => {
    if (currentRoute === routeKey) return true;
    if ((routeKey === 'transaksi' || routeKey === 'transactions') && (currentRoute === 'transaksi' || currentRoute === 'transactions')) return true;
    if ((routeKey === 'laporan' || routeKey === 'report') && (currentRoute === 'laporan' || currentRoute === 'report')) return true;
    if ((routeKey === 'program' || routeKey === 'programs') && (currentRoute === 'program' || currentRoute === 'programs')) return true;
    if ((routeKey === 'admin-konten' || routeKey === 'organization-profile-management') && (currentRoute === 'admin-konten' || currentRoute === 'organization-profile-management')) return true;
    return false;
  };

  const Link = window.Link;

  return (
    <React.Fragment>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen && setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 bottom-0 z-40 w-72 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 transition-all duration-300 ease-in-out lg:translate-x-0 ${
          evaluatorMode ? 'top-9' : 'top-0'
        } ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Top Header & Brand */}
        <div className="p-5 pb-3 space-y-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <window.Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">
                  SIMK-Panti
                </h1>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {isPemimpinLembaga ? 'Panel Pimpinan' : isPengurusHarian ? 'Panel Pengurus Harian' : 'Panel Pengelola'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen && setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-xl hover:bg-slate-800 text-slate-400"
            >
              <window.X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick link back to Public Web */}
          <div>
            <Link
              href="/"
              onClick={() => setIsMobileSidebarOpen && setIsMobileSidebarOpen(false)}
              className="w-full py-2.5 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-extrabold rounded-2xl border border-emerald-500/40 text-xs flex items-center justify-between transition-all group shadow-inner"
            >
              <div className="flex items-center space-x-2">
                <window.Globe className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span>Lihat Website Publik</span>
              </div>
              <window.ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </Link>
          </div>
        </div>

        {/* Scrollable Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-5 py-2 space-y-6 dark-scrollbar">
          {navItems.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
                {group.label}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const IconComponent = item.icon;
                  const active = isItemActive(item.routeKey);

                  return (
                    <button
                      key={item.routeKey}
                      type="button"
                      onClick={() => handleItemClick(item.routeKey, item.href)}
                      className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between text-left ${
                        active
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent
                          className={`w-4 h-4 ${
                            active ? 'text-white' : 'text-slate-400'
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>

                      {item.badge ? (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${item.badgeColor || 'bg-amber-400 text-slate-950'}`}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
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
                  {currentUser.fullName || currentUser.name || currentUser.username}
                </div>
                <span
                  className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded border ${getRoleBadgeColor(
                    currentUser.role
                  )}`}
                >
                  {currentUser.role}
                </span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-colors"
                title="Keluar / Logout"
              >
                <window.LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </React.Fragment>
  );
};

window.Sidebar = Sidebar;
