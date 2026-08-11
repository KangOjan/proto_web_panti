// Navbar & Role Switcher Component for SIMK-Panti (Public + Role-Gated Layout)
const Navbar = ({
  currentUser,
  activeTab,
  setActiveTab,
  onSwitchUser,
  onLogout,
  onNavigateToAuth,
  pendingApprovalCount
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSwitchDropdownOpen, setIsSwitchDropdownOpen] = React.useState(false);

  // Re-initialize icons
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  const getRoleBadgeColor = (role) => {
    if (role === 'Pengurus Harian') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (role === 'Pemimpin Lembaga') return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    return 'bg-amber-100 text-amber-800 border-amber-300';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
      
      {/* Top Banner Notice for Tester / Evaluator */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 simulasi-banner">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
            Mode Evaluator
          </span>
          <span className="hidden sm:inline text-slate-300">
            Simulasi Switch User Instan (Tanpa Ketik Re-Login)
          </span>
        </div>

        {/* Quick Role Switcher Buttons in Top Bar */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-medium hidden md:inline">Simulasi Mode:</span>
          
          <button
            onClick={() => {
              onLogout();
              setActiveTab('beranda');
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              !currentUser && activeTab === 'beranda'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <i data-lucide="globe" className="w-3.5 h-3.5"></i>
            <span>Publik (Beranda)</span>
          </button>

          <button
            onClick={() => onSwitchUser('Pengurus Harian')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              currentUser?.role === 'Pengurus Harian'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <i data-lucide="user-check" className="w-3.5 h-3.5"></i>
            <span>Pengurus Harian</span>
          </button>

          <button
            onClick={() => onSwitchUser('Pemimpin Lembaga')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              currentUser?.role === 'Pemimpin Lembaga'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <i data-lucide="shield-check" className="w-3.5 h-3.5"></i>
            <span>Pemimpin Lembaga</span>
            {pendingApprovalCount > 0 && (
              <span className="ml-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full animate-pulse">
                {pendingApprovalCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab(currentUser ? 'dashboard' : 'beranda')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <i data-lucide="building-2" className="w-6 h-6"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">SIMK-Panti</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  v2.5 Live
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Panti Asuhan Kasih Bunda • Transparansi & Akuntabilitas Keuangan
              </p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1">
            
            {/* 1. PUBLIC MENU: BERANDA */}
            <button
              onClick={() => setActiveTab('beranda')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'beranda'
                  ? 'bg-slate-100 text-emerald-700 font-bold shadow-inner'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <i data-lucide="home" className="w-4 h-4"></i>
              <span>Beranda</span>
            </button>

            {/* 2. PUBLIC MENU: DONASI (TANPA LOGIN) */}
            <button
              onClick={() => setActiveTab('public-donation')}
              className={`px-3 py-2 rounded-xl text-sm font-extrabold transition-all flex items-center space-x-2 border ${
                activeTab === 'public-donation'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <i data-lucide="heart" className="w-4 h-4 text-rose-500 fill-rose-100"></i>
              <span>Donasi</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full uppercase">
                Bebas Login
              </span>
            </button>

            {/* 3. PUBLIC MENU: DASHBOARD KEUANGAN PUBLIK (TANPA LOGIN) */}
            <button
              onClick={() => setActiveTab('public-dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'public-dashboard'
                  ? 'bg-slate-100 text-emerald-700 font-bold shadow-inner'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <i data-lucide="line-chart" className="w-4 h-4 text-emerald-600"></i>
              <span>Dashboard Keuangan</span>
            </button>

            {/* 3. AUTHENTICATED INTERNAL WORKSPACE MENUS (ONLY WHEN LOGGED IN) */}
            {currentUser && (
              <>
                <div className="h-5 w-px bg-slate-200 mx-2"></div>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                    activeTab === 'dashboard'
                      ? 'bg-slate-100 text-emerald-700 shadow-inner'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <i data-lucide="layout-dashboard" className="w-4 h-4"></i>
                  <span>Dashboard Keuangan</span>
                </button>

                {/* Role: Pengurus Harian Tab */}
                {currentUser.role === 'Pengurus Harian' && (
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                      activeTab === 'transactions'
                        ? 'bg-slate-100 text-emerald-700 shadow-inner'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <i data-lucide="receipt" className="w-4 h-4"></i>
                    <span>Pencatatan Transaksi (CRUD)</span>
                  </button>
                )}

                {/* Role: Pemimpin Lembaga Tab */}
                {currentUser.role === 'Pemimpin Lembaga' && (
                  <button
                    onClick={() => setActiveTab('approval')}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 relative ${
                      activeTab === 'approval'
                        ? 'bg-slate-100 text-indigo-700 shadow-inner'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <i data-lucide="user-check" className="w-4 h-4"></i>
                    <span>Persetujuan Akun (Approval)</span>
                    {pendingApprovalCount > 0 && (
                      <span className="bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {pendingApprovalCount}
                      </span>
                    )}
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('audit')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                    activeTab === 'audit'
                      ? 'bg-slate-100 text-emerald-700 shadow-inner'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <i data-lucide="history" className="w-4 h-4"></i>
                  <span>Digital Audit Trail</span>
                </button>

                <button
                  onClick={() => setActiveTab('report')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                    activeTab === 'report'
                      ? 'bg-slate-100 text-emerald-700 shadow-inner'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <i data-lucide="printer" className="w-4 h-4"></i>
                  <span>Cetak Laporan PSAK 45</span>
                </button>
              </>
            )}

          </nav>

          {/* User Profile Info & Actions */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <div className="text-right hidden md:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.fullName}
                  </div>
                  <div className="flex items-center justify-end space-x-1 mt-0.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getRoleBadgeColor(currentUser.role)}`}>
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                {/* Dropdown Menu Toggle */}
                <div className="relative">
                  <button
                    onClick={() => setIsSwitchDropdownOpen(!isSwitchDropdownOpen)}
                    className="p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all flex items-center space-x-1"
                    title="Menu Opsi Pengguna"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                      {currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}
                    </div>
                    <i data-lucide="chevron-down" className="w-4 h-4 text-slate-500"></i>
                  </button>

                  {/* Profile Dropdown */}
                  {isSwitchDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-xs font-semibold text-slate-500">Pengguna Terhubung:</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{currentUser.fullName}</p>
                        <p className="text-xs text-slate-500 font-mono">NIK: {currentUser.nik}</p>
                      </div>

                      <div className="px-2 py-1.5">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                          Simulasi Ganti Peran
                        </div>
                        <button
                          onClick={() => {
                            onSwitchUser('Pengurus Harian');
                            setIsSwitchDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-medium flex items-center justify-between"
                        >
                          <span>Switch Ke: Pengurus Harian</span>
                          {currentUser.role === 'Pengurus Harian' && (
                            <i data-lucide="check" className="w-4 h-4 text-emerald-600"></i>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            onSwitchUser('Pemimpin Lembaga');
                            setIsSwitchDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 font-medium flex items-center justify-between"
                        >
                          <span>Switch Ke: Pemimpin Lembaga</span>
                          {currentUser.role === 'Pemimpin Lembaga' && (
                            <i data-lucide="check" className="w-4 h-4 text-indigo-600"></i>
                          )}
                        </button>
                      </div>

                      <div className="border-t border-slate-100 px-2 pt-1.5">
                        <button
                          onClick={() => {
                            setIsSwitchDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center space-x-2 font-semibold"
                        >
                          <i data-lucide="log-out" className="w-4 h-4 text-rose-500"></i>
                          <span>Keluar (Logout)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigateToAuth('login')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm flex items-center space-x-1.5 transition-all"
                >
                  <i data-lucide="log-in" className="w-3.5 h-3.5 text-emerald-400"></i>
                  <span>Log In</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <i data-lucide={isMobileMenuOpen ? "x" : "menu"} className="w-5 h-5"></i>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => { setActiveTab('beranda'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 ${
              activeTab === 'beranda' ? 'bg-slate-100 text-emerald-700 font-bold' : 'text-slate-700'
            }`}
          >
            <i data-lucide="home" className="w-4 h-4"></i>
            <span>Beranda</span>
          </button>

          <button
            onClick={() => { setActiveTab('public-donation'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-extrabold flex items-center space-x-2 ${
              activeTab === 'public-donation' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            <i data-lucide="heart" className="w-4 h-4 text-rose-500"></i>
            <span>Donasi (Bebas Login)</span>
          </button>

          <button
            onClick={() => { setActiveTab('public-dashboard'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 ${
              activeTab === 'public-dashboard' ? 'bg-slate-100 text-emerald-700 font-bold' : 'text-slate-700'
            }`}
          >
            <i data-lucide="line-chart" className="w-4 h-4 text-emerald-600"></i>
            <span>Dashboard Keuangan Publik</span>
          </button>

          {currentUser ? (
            <>
              <div className="border-t border-slate-100 pt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Menu Ruang Kerja Internal ({currentUser.role})
              </div>

              <button
                onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 ${
                  activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
                }`}
              >
                <i data-lucide="layout-dashboard" className="w-4 h-4"></i>
                <span>Dashboard Keuangan</span>
              </button>

              {currentUser.role === 'Pengurus Harian' && (
                <button
                  onClick={() => { setActiveTab('transactions'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 ${
                    activeTab === 'transactions' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
                  }`}
                >
                  <i data-lucide="receipt" className="w-4 h-4"></i>
                  <span>Pencatatan Transaksi (CRUD)</span>
                </button>
              )}

              {currentUser.role === 'Pemimpin Lembaga' && (
                <button
                  onClick={() => { setActiveTab('approval'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 ${
                    activeTab === 'approval' ? 'bg-indigo-50 text-indigo-800' : 'text-slate-700'
                  }`}
                >
                  <i data-lucide="user-check" className="w-4 h-4"></i>
                  <span>Persetujuan Akun (Approval)</span>
                </button>
              )}

              <button
                onClick={() => { setActiveTab('audit'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 ${
                  activeTab === 'audit' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
                }`}
              >
                <i data-lucide="history" className="w-4 h-4"></i>
                <span>Digital Audit Trail</span>
              </button>

              <button
                onClick={() => { setActiveTab('report'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 ${
                  activeTab === 'report' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
                }`}
              >
                <i data-lucide="printer" className="w-4 h-4"></i>
                <span>Cetak Laporan PSAK 45</span>
              </button>

              <button
                onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
              >
                <i data-lucide="log-out" className="w-4 h-4 text-rose-500"></i>
                <span>Keluar (Logout)</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => { onNavigateToAuth('login'); setIsMobileMenuOpen(false); }}
              className="w-full text-center py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm"
            >
              Log In ke Portal Internal
            </button>
          )}
        </div>
      )}
    </header>
  );
};

window.Navbar = Navbar;
