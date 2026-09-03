import React, { useState, useMemo } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import {
  ShieldAlert,
  Search,
  ShieldOff
} from 'lucide-react';

export default function AuditTrailLog(props) {
  const simk = useSimk();
  const auditLogs = (props.auditLogs && props.auditLogs.length > 0) ? props.auditLogs : simk.auditLogs;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesAction = filterAction === 'ALL' || log.action.includes(filterAction);
      const matchesSearch =
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.nik.includes(searchQuery) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAction && matchesSearch;
    });
  }, [auditLogs, filterAction, searchQuery]);

  const getActionBadge = (action) => {
    if (action.includes('CREATE')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (action.includes('UPDATE')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (action.includes('DELETE')) return 'bg-rose-100 text-rose-800 border-rose-300';
    if (action.includes('APPROVE')) return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    if (action.includes('REJECT')) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-slate-100 text-slate-800 border-slate-300';
  };

  return (
    <MainLayout currentRoute="audit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
        {/* Header Banner */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Log Keamanan & Transparansi Akuntabilitas</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-2">Digital Audit Trail System</h1>
            <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
              Rekaman aktivitas digital yang tidak dapat dimanipulasi (*Immutable Audit Log*). Setiap tindakan pencatatan, pengubahan, penghapusan transaksi, atau persetujuan akun akan tersimpan lengkap dengan Timestamp UTC/Server Time dan identitas resmi pengguna.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-right">
            <div className="text-2xl font-black text-emerald-400">{auditLogs.length}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Rekaman Log</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            <button
              onClick={() => setFilterAction('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterAction === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Aksi
            </button>
            <button
              onClick={() => setFilterAction('CREATE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterAction === 'CREATE' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pencatatan (Create)
            </button>
            <button
              onClick={() => setFilterAction('UPDATE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterAction === 'UPDATE' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pengubahan (Update)
            </button>
            <button
              onClick={() => setFilterAction('DELETE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterAction === 'DELETE' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Penghapusan (Delete)
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari eksekutor, NIK, rincian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900 relative"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Timestamp (UTC / Server)</th>
                  <th className="py-3.5 px-4">Identitas Pengguna Executing</th>
                  <th className="py-3.5 px-4">Jenis Tindakan</th>
                  <th className="py-3.5 px-4">Rincian Perubahan & Objek Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-slate-400">
                      <ShieldOff className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold">Tidak ada data audit log yang ditemukan.</p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-xs font-bold text-slate-900">
                          {log.timestamp ? new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 19) : '-'} UTC
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{log.id}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{log.userName}</div>
                        <div className="text-[10px] font-mono text-slate-500">NIK: {log.nik}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">{log.userRole}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${getActionBadge(log.action)}`}>
                          {log.action}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium leading-relaxed max-w-xl">
                          {log.details}
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
