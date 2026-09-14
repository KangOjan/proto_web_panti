// Admin Layout Component with Sidebar & Header Navigation
const AdminLayout = ({ activeTab, setActiveTab, setActiveRole, children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Ringkasan Dashboard', icon: 'layout-dashboard' },
    { id: 'children', label: 'Manajemen Anak Asuh', icon: 'users' },
    { id: 'finance', label: 'Donasi & Keuangan', icon: 'wallet' },
    { id: 'inventory', label: 'Inventaris & Logistik', icon: 'package' },
    { id: 'visits', label: 'Jadwal & Kunjungan', icon: 'calendar-check-2' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Top Admin Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              <LucideIcon name="menu" className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
                <LucideIcon name="shield-check" className="w-5 h-5" />
              </div>
              <span className="font-bold text-base text-white tracking-wide">
                Portal Admin Pengurus Panti
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Pengurus: <strong>Bpk. H. Supriatna</strong></span>
            </div>

            <button
              onClick={() => setActiveRole('public')}
              className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all flex items-center space-x-1.5 shadow"
            >
              <LucideIcon name="globe" className="w-3.5 h-3.5" />
              <span>Ke Tampilan Publik</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Wrapper */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-1 sticky top-24">
            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Menu Navigasi Admin
            </div>
            
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LucideIcon name={item.icon} className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <div className="bg-white w-64 h-full p-4 space-y-2 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-800 text-sm">Navigasi Admin</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded text-slate-500">
                  <LucideIcon name="x" className="w-5 h-5" />
                </button>
              </div>

              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                    activeTab === item.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <LucideIcon name={item.icon} className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 space-y-6">
          {children}
        </main>

      </div>

    </div>
  );
};

window.AdminLayout = AdminLayout;
