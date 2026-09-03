import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  trxToDelete
}) {
  if (!isOpen || !trxToDelete) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in no-print">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-base font-extrabold text-slate-900">Konfirmasi Hapus Transaksi</h3>
          <p className="text-xs text-slate-500 mt-1">
            Apakah Anda yakin ingin menghapus transaksi <span className="font-bold text-slate-800">{trxToDelete.id}</span> (Rp {trxToDelete.amount?.toLocaleString('id-ID')})?
          </p>
          <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-left">
            ⚠️ Tindakan penghapusan ini akan dicatat ke dalam Digital Audit Trail secara permanen.
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 pt-2">
          <button
            onClick={onClose}
            className="w-1/2 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onConfirm(trxToDelete.id);
              onClose();
            }}
            className="w-1/2 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md"
          >
            Ya, Hapus Data
          </button>
        </div>
      </div>
    </div>
  );
}
