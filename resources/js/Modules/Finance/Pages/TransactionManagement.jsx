import React, { useState, useMemo } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import {
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Printer,
  Edit2,
  Trash2,
  FileX
} from 'lucide-react';

export default function TransactionManagement(props) {
  const simk = useSimk();
  const transactions = (props.transactions && props.transactions.length > 0) ? props.transactions : simk.transactions;
  const currentUser = props.currentUser || simk.currentUser;
  const onOpenAddModal = props.onOpenAddModal || (() => {
    simk.setEditingTrx(null);
    simk.setIsAddTrxModalOpen(true);
  });
  const onOpenEditModal = props.onOpenEditModal || ((trx) => {
    simk.setEditingTrx(trx);
    simk.setIsAddTrxModalOpen(true);
  });
  const onConfirmDeleteTrx = props.onConfirmDeleteTrx || ((trx) => {
    simk.setTrxToDelete(trx);
    simk.setIsDeleteModalOpen(true);
  });
  const onPrintTransactionReceipt = props.onPrintTransactionReceipt || simk.handlePrintTransactionReceipt;
  const [filterType, setFilterType] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const categories = [
    'Donasi Rutin', 'Infak/Zakat', 'Bantuan Pemerintah/APBD',
    'Operasional', 'SPP/Pendidikan', 'Konsumsi', 'Kesehatan', 'Lainnya'
  ];

  const filteredTransactions = useMemo(() => {
    return transactions.filter(trx => {
      const matchesType = filterType === 'ALL' || trx.type === filterType;
      const matchesCategory = filterCategory === 'ALL' || trx.category === filterCategory;
      const matchesSearch =
        trx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trx.createdBy && trx.createdBy.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesDate = true;
      if (startDate) matchesDate = matchesDate && trx.date >= startDate;
      if (endDate) matchesDate = matchesDate && trx.date <= endDate;

      return matchesType && matchesCategory && matchesSearch && matchesDate;
    });
  }, [transactions, filterType, filterCategory, searchQuery, startDate, endDate]);

  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'pemasukan')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const totalExpense = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const isEditableRole = currentUser?.role === 'Pengurus Harian';

  return (
    <MainLayout currentRoute="transaksi">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                {isEditableRole ? 'Hak Akses CRUD Lengkap' : 'Hak Akses Read-Only'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Buku Kas Utama</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Pencatatan Transaksi Keuangan Panti
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik ikon pencetak (Printer) pada kolom <b>AKSI</b> untuk mencetak kuitansi 1 lembar bagi transaksi mana pun.
            </p>
          </div>

          {isEditableRole && (
            <button
              onClick={() => onOpenAddModal && onOpenAddModal()}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-md shadow-emerald-600/20 text-xs flex items-center space-x-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Catat Transaksi Baru</span>
            </button>
          )}
        </div>

        {/* Summary Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Pemasukan (Filter)</div>
              <div className="text-xl font-black text-emerald-700 mt-1">
                Rp {totalIncome.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-rose-800 uppercase tracking-wider">Total Pengeluaran (Filter)</div>
              <div className="text-xl font-black text-rose-700 mt-1">
                Rp {totalExpense.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Surplus / Defisit Kas</div>
              <div className={`text-xl font-black mt-1 ${
                totalIncome - totalExpense >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                Rp {(totalIncome - totalExpense).toLocaleString('id-ID')}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Jenis
              </button>
              <button
                onClick={() => setFilterType('pemasukan')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                  filterType === 'pemasukan' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>Pemasukan</span>
              </button>
              <button
                onClick={() => setFilterType('pengeluaran')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                  filterType === 'pengeluaran' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Pengeluaran</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500">Kategori:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
              >
                <option value="ALL">Semua Kategori</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Dari Tanggal</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sampai Tanggal</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cari Keterangan / Kode</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  placeholder="Kata kunci transaksi, NIK..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium relative"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">TANGGAL & KODE</th>
                  <th className="py-3.5 px-4">JENIS & KATEGORI</th>
                  <th className="py-3.5 px-4">KETERANGAN SUMBER / PERUNTUKKAN</th>
                  <th className="py-3.5 px-4">NOMINAL (RP)</th>
                  <th className="py-3.5 px-4">PETUGAS INPUT</th>
                  <th className="py-3.5 px-4 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400">
                      <FileX className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold">Tidak ada transaksi keuangan yang sesuai filter.</p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{trx.date}</div>
                        <div className="text-[10px] font-mono text-slate-400">{trx.id}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          trx.type === 'pemasukan'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {trx.type === 'pemasukan' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          <span className="capitalize">{trx.type}</span>
                        </span>
                        <div className="text-[11px] font-semibold text-slate-600 mt-1">{trx.category}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium leading-relaxed">{trx.description}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className={`font-black text-sm ${
                          trx.type === 'pemasukan' ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {trx.type === 'pemasukan' ? '+ ' : '- '}
                          Rp {trx.amount.toLocaleString('id-ID')}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-slate-700 font-medium">{trx.createdBy}</div>
                        <div className="text-[10px] text-slate-400">
                          {trx.createdAt ? new Date(trx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => onPrintTransactionReceipt && onPrintTransactionReceipt(trx)}
                            className="p-1.5 text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-100 rounded-lg transition-all border border-slate-200 shadow-2xs"
                            title="Cetak Kuitansi / Bukti Transaksi (1 Lembar PDF)"
                          >
                            <Printer className="w-4 h-4 text-slate-700 hover:text-emerald-700" />
                          </button>

                          {isEditableRole && (
                            <>
                              <button
                                type="button"
                                onClick={() => onOpenEditModal && onOpenEditModal(trx)}
                                className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                                title="Edit Transaksi"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => onConfirmDeleteTrx && onConfirmDeleteTrx(trx)}
                                className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                                title="Hapus Transaksi"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
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
