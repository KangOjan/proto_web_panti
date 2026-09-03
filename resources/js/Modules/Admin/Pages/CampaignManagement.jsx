import React, { useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import {
  Layers,
  PlusCircle,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  Check,
  History,
  Send,
  Calendar,
  CreditCard
} from 'lucide-react';

export default function CampaignManagement(props) {
  const simk = useSimk();
  const campaigns = (props.campaigns && props.campaigns.length > 0) ? props.campaigns : simk.campaigns;
  const onSaveCampaign = props.onSaveCampaign || simk.handleSaveCampaign;
  const onDeleteCampaign = props.onDeleteCampaign || simk.handleDeleteCampaign;
  const onAddCampaignUpdate = props.onAddCampaignUpdate || simk.handleAddCampaignUpdate;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [selectedCampaignForUpdate, setSelectedCampaignForUpdate] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form Campaign State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Konsumsi');
  const [targetAmount, setTargetAmount] = useState(20000000);
  const [collectedAmount, setCollectedAmount] = useState(0);
  const [deadline, setDeadline] = useState('2026-10-31');
  const [status, setStatus] = useState('Aktif'); // Draft | Aktif | Target Tercapai | Ditutup | Dibatalkan
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60');
  const [bankAccount, setBankAccount] = useState('Bank Syariah Indonesia (BSI) - 7123-4567-89 a.n. YPI Kasih Bunda');

  // Form Update State
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');

  const categories = ['Konsumsi', 'Pendidikan', 'Fasilitas', 'Kesehatan', 'Operasional', 'Lainnya'];
  const statuses = ['Draft', 'Aktif', 'Target Tercapai', 'Ditutup', 'Dibatalkan'];

  const handleOpenAddModal = () => {
    setEditingCampaign(null);
    setTitle('');
    setCategory('Konsumsi');
    setTargetAmount(20000000);
    setCollectedAmount(0);
    setDeadline('2026-10-31');
    setStatus('Aktif');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60');
    setBankAccount('Bank Syariah Indonesia (BSI) - 7123-4567-89 a.n. YPI Kasih Bunda');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (camp) => {
    setEditingCampaign(camp);
    setTitle(camp.title || '');
    setCategory(camp.category || 'Konsumsi');
    setTargetAmount(camp.targetAmount || 0);
    setCollectedAmount(camp.collectedAmount || 0);
    setDeadline(camp.deadline || '2026-10-31');
    setStatus(camp.status || 'Aktif');
    setDescription(camp.description || '');
    setImage(camp.image || '');
    setBankAccount(camp.bankAccount || '');
    setIsModalOpen(true);
  };

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Mohon isi Judul dan Deskripsi Campaign.");
      return;
    }

    const payload = {
      id: editingCampaign ? editingCampaign.id : `CMP-${Math.floor(Math.random() * 899 + 100)}`,
      title,
      category,
      targetAmount: Number(targetAmount),
      collectedAmount: Number(collectedAmount),
      deadline,
      status: Number(collectedAmount) >= Number(targetAmount) ? 'Target Tercapai' : status,
      description,
      image,
      bankAccount,
      updates: editingCampaign?.updates || [],
      createdAt: editingCampaign?.createdAt || new Date().toISOString()
    };

    if (onSaveCampaign) {
      onSaveCampaign(payload);
    }
    setIsModalOpen(false);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!updateTitle.trim() || !updateContent.trim()) {
      alert("Mohon isi Judul Update dan Content Penyaluran.");
      return;
    }

    const updatePayload = {
      id: `UPD-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      title: updateTitle,
      content: updateContent
    };

    if (onAddCampaignUpdate) {
      onAddCampaignUpdate(selectedCampaignForUpdate.id, updatePayload);
    }

    setIsUpdateModalOpen(false);
    setUpdateTitle('');
    setUpdateContent('');
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Aktif':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Target Tercapai':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Draft':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Ditutup':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Dibatalkan':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <MainLayout currentRoute="admin-campaign">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Pengelolaan & Publikasi Program Donasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
              Manajemen Campaign Donasi
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mt-1 leading-relaxed">
              Buat campaign baru, atur target dana, tenggat waktu, status operasional, serta publikasikan laporan perkembangan penyaluran donasi secara berkala.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs shadow-lg flex items-center space-x-2 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Buat Program Donasi Baru</span>
          </button>
        </div>

        {/* Campaign List Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Daftar Campaign Donasi</h3>
              <p className="text-xs text-slate-500">Kelola status tayang, target, deadline, dan perkembangan penyaluran</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {campaigns.length} Campaign Terdaftar
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">CAMPAIGN & KATEGORI</th>
                  <th className="py-3.5 px-4">TARGET DANA (RP)</th>
                  <th className="py-3.5 px-4">TERHIMPUN (RP)</th>
                  <th className="py-3.5 px-4">DEADLINE</th>
                  <th className="py-3.5 px-4">STATUS CAMPAIGN</th>
                  <th className="py-3.5 px-4 text-right">AKSI & UPDATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400">
                      <Layers className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold">Belum ada campaign donasi.</p>
                    </td>
                  </tr>
                ) : (
                  campaigns.map((camp) => {
                    const percent = camp.targetAmount > 0
                      ? Math.min(100, Math.round(((camp.collectedAmount || 0) / camp.targetAmount) * 100))
                      : 0;

                    return (
                      <tr key={camp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-black text-slate-900 text-xs">{camp.title}</div>
                          <div className="flex items-center space-x-1.5 mt-1">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              {camp.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{camp.id}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900">
                          Rp {(camp.targetAmount || 0).toLocaleString('id-ID')}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-black text-emerald-700">
                            Rp {(camp.collectedAmount || 0).toLocaleString('id-ID')} ({percent}%)
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                          {camp.deadline || 'Tanpa Batas'}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(camp.status)}`}>
                            {camp.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => {
                                setSelectedCampaignForUpdate(camp);
                                setIsUpdateModalOpen(true);
                              }}
                              className="px-2.5 py-1 text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg text-[11px] font-bold border border-slate-200 flex items-center space-x-1"
                              title="Tambah Update Perkembangan Penyaluran"
                            >
                              <History className="w-3.5 h-3.5" />
                              <span>+ Update ({camp.updates?.length || 0})</span>
                            </button>

                            <button
                              onClick={() => handleOpenEditModal(camp)}
                              className="p-1.5 text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg border border-slate-200"
                              title="Edit Campaign"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmId(camp.id)}
                              className="p-1.5 text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg border border-slate-200"
                              title="Hapus Campaign"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL SAVE CAMPAIGN */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-extrabold text-slate-900 mb-4 border-b border-slate-100 pb-3">
                {editingCampaign ? "Edit Campaign Donasi" : "Buat Campaign Donasi Baru"}
              </h3>

              <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Judul Campaign *</label>
                  <input
                    type="text"
                    required
                    placeholder="Judul campaign..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Kategori *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold bg-white"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Status Campaign *</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold bg-white"
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Batas Waktu (Deadline) *</label>
                    <input
                      type="date"
                      required
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Target Dana (Rp) *</label>
                    <input
                      type="number"
                      required
                      min="100000"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-black text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Dana Terkumpul Saat Ini (Rp)</label>
                    <input
                      type="number"
                      min="0"
                      value={collectedAmount}
                      onChange={(e) => setCollectedAmount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-black text-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Rekening Tujuan Donasi *</label>
                  <input
                    type="text"
                    required
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">URL Foto Header Campaign *</label>
                  <input
                    type="text"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Deskripsi Campaign *</label>
                  <textarea
                    rows="4"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium"
                  ></textarea>
                </div>

                <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-black shadow-md"
                  >
                    Simpan Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL TAMBAH UPDATE PERKEMBANGAN */}
        {isUpdateModalOpen && selectedCampaignForUpdate && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">Tambah Update Perkembangan</h3>
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Campaign: <b>{selectedCampaignForUpdate.title}</b>
              </p>

              <form onSubmit={handleUpdateSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Judul Update / Penyaluran *</label>
                  <input
                    type="text"
                    required
                    placeholder="cth: Penyaluran Tahap I - Pengadaan Sembako"
                    value={updateTitle}
                    onChange={(e) => setUpdateTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Rincian Informasi / Laporan Penyaluran *</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Detail penggunaan dana..."
                    value={updateContent}
                    onChange={(e) => setUpdateContent(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-black shadow-md"
                  >
                    Publikasikan Update
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
