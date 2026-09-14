// Impact Statistics Component
const ImpactStats = ({ stats }) => {
  const statItems = [
    {
      label: "Total Anak Asuh Active",
      value: stats.totalChildren,
      unit: "Anak",
      subtext: "SD, SMP, & SMA/SMK",
      icon: "users",
      bgGradient: "from-emerald-500 to-teal-600",
      badgeColor: "bg-emerald-100 text-emerald-800"
    },
    {
      label: "Alumni / Lulusan",
      value: `${stats.alumni}+`,
      unit: "Orang",
      subtext: "Bekerja & Berwirausaha",
      icon: "graduation-cap",
      bgGradient: "from-teal-600 to-emerald-700",
      badgeColor: "bg-teal-100 text-teal-800"
    },
    {
      label: "Donatur & Sahabat Aktif",
      value: `${stats.activeDonors}+`,
      unit: "Donatur",
      subtext: "Individu & Perusahaan",
      icon: "heart-handshake",
      bgGradient: "from-orange-500 to-amber-600",
      badgeColor: "bg-orange-100 text-orange-800"
    },
    {
      label: "Program Pemberdayaan",
      value: stats.activePrograms,
      unit: "Program",
      subtext: "Pendidikan & Skill",
      icon: "sparkles",
      bgGradient: "from-emerald-600 to-teal-800",
      badgeColor: "bg-emerald-100 text-emerald-800"
    }
  ];

  return (
    <section className="py-12 bg-white relative -mt-6 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-emerald-50/30 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.bgGradient} text-white flex items-center justify-center shadow-lg shadow-emerald-700/20`}>
                  <LucideIcon name={item.icon} className="w-6 h-6" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.badgeColor}`}>
                  {item.unit}
                </span>
              </div>
              
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {item.value}
              </div>

              <div className="text-sm font-semibold text-slate-700 mt-1">
                {item.label}
              </div>

              <div className="text-xs text-slate-500 mt-1">
                {item.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

window.ImpactStats = ImpactStats;
