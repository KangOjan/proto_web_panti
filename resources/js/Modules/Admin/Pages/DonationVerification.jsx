import React, { useState, useMemo } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  Check,
  X,
  Printer,
  FileCheck,
  Image,
  AlertCircle
} from 'lucide-react';

export default function DonationVerification(props) {
  const simk = useSimk();
  const donations = (props.donations && props.donations.length > 0) ? props.donations : simk.donations;
  const campaigns = (props.campaigns && props.campaigns.length > 0) ? props.campaigns : simk.campaigns;
  const onApproveDonation = props.onApproveDonation || simk.handleApproveDonation;
  const onRejectDonation = props.onRejectDonation || simk.handleRejectDonation;
  const onOpenReceiptModal = props.onOpenReceiptModal || simk.handlePrintTransactionReceipt;
  const [filterStatus, setFilterStatus] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonationForInspect, setSelectedDonationForInspect] = useState(null);

  const filteredDonations = useMemo(() => {
    return donations.filter(d => {
      const matchesType = d.type === 'online';
      const matchesStatus = filterStatus === 'ALL' || d.status === filterStatus;
      const matchesSearch =
        d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.campaignTitle && d.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [donations, filterStatus, searchQuery]);

  const pendingCount = donations.filter(d => d.type === 'online' && d.status === 'Pending').length;
  const verifiedCount = donations.filter(d => d.type === 'online' && d.status === 'Terverifikasi').length;
  const rejectedCount = donations.filter(d => d.type === 'online' && d.status === 'Ditolak').length;

  return (
    <MainLayout currentRoute="admin-verifikasi">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Sistem Verifikasi Bukti Donasi Online</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
              Pemeriksaan & Verifikasi Bukti Transfer
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mt-1 leading-relaxed">
              Periksa keabsahan bukti transfer donasi online donatur. Donasi yang diverifikasi akan otomatis memperbarui capaian dana campaign tujuan dan menerbitkan kuitansi digital resmi.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[160px]">
            <div className="text-[10px] uppercase tracking-wider text-amber-300 font-extrabold">Antrean Pending</div>
            <div className="text-2xl font-black text-amber-400 mt-0.5">{pendingCount} Donasi</div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            <button
              onClick={() => setFilterStatus('Pending')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                filterStatus === 'Pending'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Verifikasi ({pendingCount})</span>
            </button>

            <button
              onClick={() => setFilterStatus('Terverifikasi')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                filterStatus === 'Terverifikasi'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Terverifikasi ({verifiedCount})</span>
            </button>

            <button
              onClick={() => setFilterStatus('Ditolak')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                filterStatus === 'Ditolak'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Ditolak ({rejectedCount})</span>
            </button>

            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterStatus === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Semua Online</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari Donatur, ID, Campaign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Verification Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">KODE & TANGGAL</th>
                  <th className="py-3.5 px-4">DONATUR & KONTAK</th>
                  <th className="py-3.5 px-4">CAMPAIGN TUJUAN</th>
                  <th className="py-3.5 px-4">NOMINAL (RP)</th>
                  <th className="py-3.5 px-4">BUKTI TRANSFER</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 text-right">AKSI VERIFIKASI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-slate-400">
                      <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold">Tidak ada donasi online yang sesuai filter.</p>
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map((don) => (
                    <tr key={don.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-xs font-bold text-slate-900">{don.id}</div>
                        <div className="text-[10px] text-slate-400">{don.createdAt ? new Date(don.createdAt).toLocaleDateString('id-ID') : '-'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{don.donorName}</div>
                        <div className="text-[10px] text-slate-500">{don.email || don.phone || 'Tanpa Kontak'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-semibold truncate max-w-xs">{don.campaignTitle || 'Donasi Umum'}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-black text-emerald-700 text-sm">
                        Rp {don.amount.toLocaleString('id-ID')}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {don.proofImage ? (
                          <button
                            onClick={() => setSelectedDonationForInspect(don)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px] hover:bg-emerald-100 transition-colors"
                          >
                            <Image className="w-3.5 h-3.5" />
                            <span>Lihat Bukti</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Tanpa Foto</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {don.status === 'Pending' && (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 font-bold text-[11px]">
                            Pending
                          </span>
                        )}
                        {don.status === 'Terverifikasi' && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-[11px]">
                            Terverifikasi
                          </span>
                        )}
                        {don.status === 'Ditolak' && (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-300 font-bold text-[11px]">
                            Ditolak
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          {don.status === 'Pending' ? (
                            <>
                              <button
                                onClick={() => onApproveDonation && onApproveDonation(don.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-sm"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Verifikasi</span>
                              </button>

                              <button
                                onClick={() => onRejectDonation && onRejectDonation(don.id)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center space-x-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Tolak</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => onOpenReceiptModal && onOpenReceiptModal(don)}
                              className="p-1.5 text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg transition-all border border-slate-200"
                              title="Cetak Kuitansi Resmi"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
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

        {/* INSPECT PROOF MODAL */}
        {selectedDonationForInspect && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center relative">
              <button
                onClick={() => setSelectedDonationForInspect(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-extrabold text-slate-900">Bukti Transfer Donasi</h3>
              <p className="text-xs text-slate-500">
                Donatur: <b>{selectedDonationForInspect.donorName}</b> • Rp {selectedDonationForInspect.amount.toLocaleString('id-ID')}
              </p>

              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-h-80 flex items-center justify-center">
                <img
                  src={selectedDonationForInspect.proofImage}
                  alt="Bukti Transfer"
                  className="max-h-72 object-contain"
                />
              </div>

              {selectedDonationForInspect.status === 'Pending' && (
                <div className="flex items-center space-x-2 pt-2">
                  <button
                    onClick={() => {
                      if (onRejectDonation) onRejectDonation(selectedDonationForInspect.id);
                      setSelectedDonationForInspect(null);
                    }}
                    className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200"
                  >
                    Tolak Bukti
                  </button>
                  <button
                    onClick={() => {
                      if (onApproveDonation) onApproveDonation(selectedDonationForInspect.id);
                      setSelectedDonationForInspect(null);
                    }}
                    className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-md"
                  >
                    Verifikasi Donasi
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
