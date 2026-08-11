// Digitally Signed Official Receipt / Expense Voucher Modal Component (Uniform 1-Page Layout)
const DigitalReceiptModal = ({
  isOpen,
  onClose,
  receiptData
}) => {
  if (!isOpen || !receiptData) return null;

  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  const isIncome = receiptData.type !== 'pengeluaran';
  const displayPartyName = receiptData.donorName || receiptData.description || 'Hamba Allah / Umum';
  const displayOfficer = receiptData.createdBy || 'Budi Santoso, S.E.';

  // Convert amount to Indonesian words (Terbilang Rupiah helper)
  const terbilangRupiah = (num) => {
    if (!num || isNaN(num)) return "Nol Rupiah";
    const angka = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    if (num < 12) return angka[num];
    if (num < 20) return terbilangRupiah(num - 10) + " Belas";
    if (num < 100) return terbilangRupiah(Math.floor(num / 10)) + " Puluh " + terbilangRupiah(num % 10);
    if (num < 200) return "Seratus " + terbilangRupiah(num - 100);
    if (num < 1000) return terbilangRupiah(Math.floor(num / 100)) + " Ratus " + terbilangRupiah(num % 100);
    if (num < 2000) return "Seribu " + terbilangRupiah(num - 1000);
    if (num < 1000000) return terbilangRupiah(Math.floor(num / 1000)) + " Ribu " + terbilangRupiah(num % 1000);
    if (num < 1000000000) return terbilangRupiah(Math.floor(num / 1000000)) + " Juta " + terbilangRupiah(num % 1000000);
    return num.toLocaleString('id-ID');
  };

  const formattedTerbilang = terbilangRupiah(receiptData.amount).trim() + " Rupiah";

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      
      {/* Modal Dialog Card */}
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all no-print"
          title="Tutup Modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* PRINTABLE RECEIPT CONTAINER (UNIFORM STRICT 1-PAGE LAYOUT) */}
        <div className="printable-area space-y-4">
          
          {/* Header Receipt / Voucher */}
          <div className="border-b-2 border-slate-900 pb-3 text-center">
            <div className="flex items-center justify-between text-left mb-1.5">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold ${
                  isIncome ? 'bg-emerald-600' : 'bg-rose-600'
                }`}>
                  {isIncome ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 7 17 17 17"></polyline>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="17 17 17 7 7 7"></polyline>
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-black text-xs text-slate-900 leading-tight">YAYASAN PANTI ASUHAN KASIH BUNDA</h3>
                  <p className="text-[9px] text-slate-500 font-medium">Izin Kemenkumham RI AHU-0019283.AH.01.04</p>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                  isIncome ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-700 bg-rose-50 border-rose-200'
                }`}>
                  {isIncome ? 'KAS MASUK' : 'KAS KELUAR'}
                </div>
                <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                  {receiptData.receiptNo || receiptData.id}
                </div>
              </div>
            </div>

            <h2 className="text-base font-black text-slate-900 tracking-wider uppercase pt-1">
              {isIncome ? 'KUITANSI BUKTI PENERIMAAN KAS' : 'VOUCHER BUKTI PENGELUARAN KAS'}
            </h2>
          </div>

          {/* Body Detail Table */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5 text-xs">
            
            <div className="grid grid-cols-3 border-b border-slate-200 pb-1.5">
              <span className="font-bold text-slate-500">Tanggal Transaksi</span>
              <span className="col-span-2 font-bold text-slate-900">
                {receiptData.date ? receiptData.date.substring(0, 10) : new Date().toISOString().substring(0, 10)}
              </span>
            </div>

            <div className="grid grid-cols-3 border-b border-slate-200 pb-1.5">
              <span className="font-bold text-slate-500">
                {isIncome ? 'Telah Diterima Dari' : 'Peruntukkan Belanja'}
              </span>
              <span className="col-span-2 font-black text-slate-900 text-xs">
                {displayPartyName}
              </span>
            </div>

            <div className="grid grid-cols-3 border-b border-slate-200 pb-1.5">
              <span className="font-bold text-slate-500">Jumlah Uang</span>
              <span className={`col-span-2 font-black text-sm ${isIncome ? 'text-emerald-800' : 'text-rose-800'}`}>
                Rp {receiptData.amount ? receiptData.amount.toLocaleString('id-ID') : '0'}
              </span>
            </div>

            <div className="grid grid-cols-3 border-b border-slate-200 pb-1.5">
              <span className="font-bold text-slate-500">Terbilang</span>
              <span className="col-span-2 font-extrabold text-slate-800 italic bg-white p-1.5 rounded-lg border border-slate-200">
                # {formattedTerbilang} #
              </span>
            </div>

            <div className="grid grid-cols-3 border-b border-slate-200 pb-1.5">
              <span className="font-bold text-slate-500">Kategori Transaksi</span>
              <span className="col-span-2 font-semibold text-slate-800">{receiptData.category}</span>
            </div>

            <div className="grid grid-cols-3">
              <span className="font-bold text-slate-500">Rincian Keterangan</span>
              <span className="col-span-2 font-medium text-slate-700 leading-normal">
                {receiptData.description || receiptData.paymentMethod || '-'}
              </span>
            </div>

          </div>

          {/* Official Signatures Block (Without Digital Verified QR Seal) */}
          <div className="pt-4 grid grid-cols-2 gap-8 items-center text-center text-[11px]">
            
            {/* Officer Signature */}
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 font-medium">
                {isIncome ? 'Penerima Kas,' : 'Pembuat Voucher,'}
              </p>
              <div className="h-10 flex items-end justify-center">
                <span className="text-[9px] text-emerald-600 font-bold italic border-b border-emerald-300 px-2 py-0.5">
                  ✓ Signed Digital
                </span>
              </div>
              <p className="font-bold text-slate-900 text-xs underline pt-1">
                {displayOfficer}
              </p>
              <p className="text-[9px] text-slate-400 font-mono">Pengurus Harian</p>
            </div>

            {/* Approver Signature */}
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 font-medium">Mengetahui,</p>
              <div className="h-10 flex items-end justify-center">
                <span className="text-[9px] text-indigo-600 font-bold italic border-b border-indigo-300 px-2 py-0.5">
                  ✓ Signed Digital
                </span>
              </div>
              <p className="font-bold text-slate-900 text-xs underline pt-1">H. Ahmad Dahlan, M.Ag.</p>
              <p className="text-[9px] text-slate-400 font-mono">Pemimpin Lembaga</p>
            </div>

          </div>

          <div className="text-[9px] text-slate-400 text-center border-t border-slate-200 pt-2 font-mono">
            Dokumen ini diterbitkan secara resmi oleh SIMK-Panti & sah tanpa perlu stempel basah manual.
          </div>

        </div>

        {/* Action Controls (Hidden on Print) */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            Tutup
          </button>

          <button
            onClick={handlePrintReceipt}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-2 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-400">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect width="12" height="8" x="6" y="14"></rect>
            </svg>
            <span>Cetak Kuitansi (1 Lembar PDF)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

window.DigitalReceiptModal = DigitalReceiptModal;
