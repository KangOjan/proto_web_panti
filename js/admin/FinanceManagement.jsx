// Finance & Donation Management Component (Admin)
const FinanceManagement = ({ financeData, donorData, onOpenAddTrxModal, onToggleReceipt }) => {
  const [subTab, setSubTab] = React.useState('kas'); // 'kas' | 'donatur'
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('semua');

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const filteredTrx = financeData.transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'semua' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const filteredDonors = donorData.filter(d => {
    return d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           d.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Subtabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manajemen Donasi & Keuangan</h2>
          <p className="text-xs text-slate-500">Buku kas pemasukan/pengeluaran & database kuitansi digital donatur.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSubTab('kas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'kas' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Buku Kas Keuangan
          </button>

          <button
            onClick={() => setSubTab('donatur')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'donatur' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Database Donatur ({donorData.length})
          </button>

          {subTab === 'kas' && (
            <button
              onClick={onOpenAddTrxModal}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow transition-colors flex items-center space-x-1"
            >
              <i data-lucide="plus-circle" className="w-4 h-4"></i>
              <span>+ Catat Transaksi</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtab 1: Buku Kas Keuangan */}
      {subTab === 'kas' && (
        <div className="space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Total Donasi Masuk</span>
              <div className="text-xl font-extrabold text-emerald-700">{formatRupiah(financeData.monthlyIncome)}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Total Pengeluaran Kas</span>
              <div className="text-xl font-extrabold text-orange-600">{formatRupiah(financeData.monthlyExpense)}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Saldo Kas Saat Ini</span>
              <div className="text-xl font-extrabold text-slate-800">{formatRupiah(financeData.balance)}</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <i data-lucide="search" className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
              <input
                type="text"
                placeholder="Cari uraian transaksi, kategori..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="semua">Semua Transaksi</option>
              <option value="pemasukan">Pemasukan (Donasi)</option>
              <option value="pengeluaran">Pengeluaran (Operasional)</option>
            </select>
          </div>

          {/* Transaction Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse custom-table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th>ID & Tanggal</th>
                    <th>Uraian Transaksi</th>
                    <th>Kategori</th>
                    <th>Donatur / Sumber</th>
                    <th className="text-right">Nominal (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTrx.map(trx => (
                    <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                      <td>
                        <div className="font-bold text-slate-800">{trx.date}</div>
                        <div className="text-[11px] font-mono text-slate-400">{trx.id}</div>
                      </td>
                      <td>
                        <div className="font-semibold text-slate-900">{trx.description}</div>
                      </td>
                      <td>
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                          {trx.category}
                        </span>
                      </td>
                      <td className="text-xs text-slate-600">
                        {trx.donorName}
                      </td>
                      <td className={`text-right font-mono font-bold text-sm ${
                        trx.type === 'pemasukan' ? 'text-emerald-700' : 'text-orange-600'
                      }`}>
                        {trx.type === 'pemasukan' ? '+' : '-'} {formatRupiah(trx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Subtab 2: Database Donatur */}
      {subTab === 'donatur' && (
        <div className="space-y-6">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative">
              <i data-lucide="search" className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
              <input
                type="text"
                placeholder="Cari nama donatur, email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse custom-table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th>ID & Nama Donatur</th>
                    <th>Kategori</th>
                    <th>Kontak / No. Telp</th>
                    <th>Total Akumulasi Donasi</th>
                    <th>Status Kuitansi Digital</th>
                    <th className="text-right">Aksi Kuitansi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDonors.map(donor => (
                    <tr key={donor.id} className="hover:bg-slate-50 transition-colors">
                      <td>
                        <div className="font-bold text-slate-900">{donor.name}</div>
                        <div className="text-[11px] text-slate-400">{donor.email}</div>
                      </td>
                      <td>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          donor.category === 'Rutin' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {donor.category}
                        </span>
                      </td>
                      <td className="text-xs text-slate-700 font-mono">
                        {donor.phone}
                      </td>
                      <td className="font-mono font-bold text-emerald-800 text-sm">
                        {formatRupiah(donor.totalDonation)}
                      </td>
                      <td>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          donor.receiptStatus === 'Terkirim' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {donor.receiptStatus}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => onToggleReceipt(donor.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                        >
                          {donor.receiptStatus === 'Terkirim' ? 'Kirim Ulang Kuitansi' : 'Kirim Kuitansi Digital'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

window.FinanceManagement = FinanceManagement;
