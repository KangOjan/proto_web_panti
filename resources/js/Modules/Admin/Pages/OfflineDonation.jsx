import React, { useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import {
  Heart,
  PlusCircle,
  Search,
  Package,
  DollarSign,
  Calendar,
  User,
  CheckCircle2
} from 'lucide-react';

export default function OfflineDonation(props) {
  const simk = useSimk();
  const donations = (props.donations && props.donations.length > 0) ? props.donations : simk.donations;
  const campaigns = (props.campaigns && props.campaigns.length > 0) ? props.campaigns : simk.campaigns;
  const onAddOfflineDonation = props.onAddOfflineDonation || simk.handleAddOfflineDonation;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [donorName, setDonorName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [kind, setKind] = useState('uang'); // uang | barang
  const [amount, setAmount] = useState('500000');
  const [itemDetails, setItemDetails] = useState('');
  const [campaignId, setCampaignId] = useState(campaigns[0]?.id || 'CMP-001');
  const [message, setMessage] = useState('');

  const offlineDonations = donations.filter(d => d.type === 'offline');

  const filteredOffline = offlineDonations.filter(d =>
    d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.itemDetails && d.itemDetails.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (d.message && d.message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!donorName.trim()) {
      alert("Mohon isi Nama Donatur.");
      return;
    }

    const selectedCampaign = campaigns.find(c => c.id === campaignId);

    const payload = {
      id: `DON-OFF-${Date.now().toString().slice(-6)}`,
      donorName,
      email: '',
      phone: '',
      amount: kind === 'uang' ? Number(amount) : 0,
      campaignId,
      campaignTitle: selectedCampaign ? selectedCampaign.title : 'Donasi Umum',
      message,
      isAnonymous: false,
      proofImage: null,
      status: 'Terverifikasi',
      type: 'offline',
      kind,
      itemDetails: kind === 'barang' ? itemDetails : '',
      createdAt: new Date(date).toISOString()
    };

    if (onAddOfflineDonation) {
      onAddOfflineDonation(payload);
    }

    setIsModalOpen(false);
    setDonorName('');
    setMessage('');
    setItemDetails('');
  };

  return (
    <MainLayout currentRoute="admin-offline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Heart className="w-4 h-4 text-emerald-400" />
              <span>Penerimaan Bantuan Langsung</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
              Pencatatan Donasi Langsung (Offline)
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mt-1 leading-relaxed">
              Dokumentasikan penerimaan bantuan berupa uang tunai maupun barang yang diserahkan secara langsung oleh donatur di sekretariat panti asuhan.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs shadow-lg flex items-center space-x-2 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Catat Donasi Offline Baru</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-500">
            Total Donasi Offline Recorded: <b className="text-slate-900">{offlineDonations.length} Transaksi</b>
          </div>

          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari nama donatur, rincian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 relative"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">TANGGAL & KODE</th>
                  <th className="py-3.5 px-4">NAMA DONATUR</th>
                  <th className="py-3.5 px-4">BENTUK DONASI</th>
                  <th className="py-3.5 px-4">CAMPAIGN TUJUAN</th>
                  <th className="py-3.5 px-4">NOMINAL / RINCIAN BARANG</th>
                  <th className="py-3.5 px-4">TAG SISTEM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredOffline.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400">
                      <Heart className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold">Belum ada donasi offline recorded.</p>
                    </td>
                  </tr>
                ) : (
                  filteredOffline.map((don) => (
                    <tr key={don.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-xs font-bold text-slate-900">{don.id}</div>
                        <div className="text-[10px] text-slate-400">{don.createdAt ? new Date(don.createdAt).toLocaleDateString('id-ID') : '-'}</div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {don.donorName}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          don.kind === 'barang'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {don.kind === 'barang' ? <Package className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
                          <span className="capitalize">{don.kind}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-semibold truncate max-w-xs">{don.campaignTitle}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {don.kind === 'uang' ? (
                          <div className="font-black text-emerald-700 text-sm">
                            Rp {don.amount.toLocaleString('id-ID')}
                          </div>
                        ) : (
                          <div className="font-bold text-slate-800">
                            {don.itemDetails || 'Bantuan Sembako / Barang'}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                          Donasi Offline (Direct)
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL CATAT DONASI OFFLINE */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">Pencatatan Donasi Offline</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Nama Donatur / Intansi *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Donatur..."
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Tanggal Penerimaan *</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Bentuk Donasi *</label>
                    <select
                      value={kind}
                      onChange={(e) => setKind(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                    >
                      <option value="uang">Uang Tunai</option>
                      <option value="barang">Barang / Sembako</option>
                    </select>
                  </div>
                </div>

                {kind === 'uang' ? (
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Nominal Donasi (Rp) *</label>
                    <input
                      type="number"
                      required
                      min="1000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-black text-emerald-700"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Rincian Barang & Jumlah *</label>
                    <input
                      type="text"
                      required
                      placeholder="cth: 10 Karung Beras 25kg, 5 Dus Minyak..."
                      value={itemDetails}
                      onChange={(e) => setItemDetails(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Alokasi Campaign *</label>
                  <select
                    value={campaignId}
                    onChange={(e) => setCampaignId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                  >
                    {campaigns.map(c => (
                      <option key={c.id} value={c.id}>
                        [{c.category}] {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Catatan / Doa Donatur</label>
                  <textarea
                    rows="2"
                    placeholder="Catatan tambahan..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md"
                  >
                    Simpan Donasi Offline
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
