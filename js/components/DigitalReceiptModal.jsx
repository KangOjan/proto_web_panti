// Kwitansi menggunakan snapshot yang diterbitkan server. Saat dicetak,
// React tidak mengambil data profil/transaksi terkini untuk mengubah isinya.
const DigitalReceiptModal = ({ isOpen, onClose, receiptData }) => {
  if (!isOpen || !receiptData) return null;
  const isIncome = !['expense', 'pengeluaran', 'cash_out', 'out'].includes(String(receiptData.type || '').toLowerCase());
  const issued = receiptData.issued === true;
  const amount = Math.max(0, Math.trunc(Number(receiptData.amount) || 0));
  const receiptNo = issued ? receiptData.receipt_number : receiptData.receiptNo || '-';
  const receivedFrom = issued ? receiptData.donor_name : receiptData.donorName || 'Hamba Allah';
  const purpose = issued ? receiptData.purpose : receiptData.description || '-';
  const payMethod = issued ? receiptData.payment_method : receiptData.paymentMethod || '-';
  const date = issued ? receiptData.receipt_date : receiptData.date || '-';
  const name = issued ? receiptData.organization_name : 'LKSA Taman Harapan Muhammadiyah Bandung';
  const inWords = issued ? receiptData.amount_words : '';
  const signers = [
    ['Pengurus Harian', issued ? receiptData.daily_manager_name : receiptData.createdBy || 'Pengurus Harian', issued ? receiptData.daily_manager_signature : null],
    ['Kepala Lembaga', issued ? receiptData.institution_head_name : 'Kepala Lembaga', issued ? receiptData.institution_head_signature : null],
  ];
  const formatMoney = (number) => `Rp ${number.toLocaleString('id-ID')}`;
  const printCopy = (label) => (
    <section key={label} className="simk-kwitansi-copy" aria-label={`Kuitansi ${label}`}>
      <aside className="simk-kwitansi-stub">
        <img src={receiptData.logo_url || "/assets/receipt/logo-lksa-20261031.png"} alt="Logo LKSA" className="simk-stub-logo" />
        <p className="simk-small-heading">ARSIP {label.toUpperCase()}</p>
        <p className="simk-label">Nomor</p><p className="simk-wrap">{receiptNo}</p>
        <p className="simk-label">Tanggal</p><p>{date}</p>
        <p className="simk-label">Dari</p><p className="simk-wrap">{receivedFrom}</p>
        <p className="simk-label">Jumlah</p><strong>{formatMoney(amount)}</strong>
      </aside>
      <div className="simk-kwitansi-main">
        <img className="simk-kwitansi-watermark" src={receiptData.watermark_url || "/assets/receipt/logo-muhammadiyah-20261031.png"} alt="" aria-hidden="true" />
        <div className="simk-kwitansi-content">
          <header className="simk-kwitansi-header">
            <img src={receiptData.logo_url || "/assets/receipt/logo-lksa-20261031.png"} alt="Logo LKSA Taman Harapan Muhammadiyah" />
            <div>
              <p className="simk-kwitansi-eyebrow">Bukti penerimaan donasi</p>
              <h3>{name}</h3>
              <p>Bandung, Jawa Barat</p>
            </div>
          </header>
          <div className="simk-kwitansi-title">
            <strong>{isIncome ? 'KWITANSI DONASI' : 'VOUCHER PENGELUARAN KAS'}</strong>
            <span>No. {receiptNo}</span>
          </div>
          <div className="simk-kwitansi-fields">
            <div><span>{isIncome ? 'Sudah diterima dari' : 'Dibayarkan untuk'}</span><strong>{receivedFrom}</strong></div>
            <div><span>Uang sejumlah</span><strong>{formatMoney(amount)}</strong></div>
            {inWords && <div><span>Terbilang</span><strong><em>{inWords}</em></strong></div>}
            <div><span>Untuk pembayaran</span><strong>{purpose}</strong></div>
            <div><span>Metode</span><strong>{payMethod}{receiptData.payment_channel ? ` (${receiptData.payment_channel})` : ''}</strong></div>
          </div>
          <div className="simk-kwitansi-signers">
            {signers.map(([position, person, signature]) => (
              <div key={position}>
                <p>{position},</p>
                <div className="simk-signature-slot">
                  {signature ? <img src={signature} alt={`Tanda tangan ${position}`} /> : null}
                </div>
                <p className="simk-signer-name">{person || position}</p>
              </div>
            ))}
          </div>
          <p className="simk-kwitansi-note">Diterbitkan dari catatan keuangan SIMK-Panti. Gambar tanda tangan bukan bukti tanda tangan digital tersertifikasi.</p>
        </div>
      </div>
    </section>
  );
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 flex items-center justify-center p-3 sm:p-6">
      <div id="simk-print-receipt" role="dialog" aria-modal="true" aria-label="Pratinjau kwitansi donasi"
        className="bg-white rounded-2xl w-full max-w-5xl p-4 sm:p-6 max-h-[95vh] overflow-y-auto">
        <div className="simk-no-print flex justify-between items-center mb-4">
          <h2 className="font-bold text-slate-900">Pratinjau {isIncome ? 'Kwitansi Donasi' : 'Voucher Pengeluaran'}</h2>
          <button type="button" onClick={onClose} className="rounded-lg bg-slate-100 px-3 py-2">Tutup</button>
        </div>
        {isIncome && !issued ? <p role="alert" className="rounded-xl bg-amber-50 p-4 text-amber-900">
          Kwitansi penerimaan belum diterbitkan oleh backend. Cetak dinonaktifkan agar data tidak berubah di kemudian hari.
        </p> : (
          <div className="simk-receipt-pages">{printCopy('Donatur')}{printCopy('Lembaga')}</div>
        )}
        <div className="simk-no-print flex justify-end mt-4">
          <button type="button" onClick={() => window.print()} disabled={isIncome && !issued}
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">Cetak / Simpan PDF</button>
        </div>
      </div>
    </div>
  );
};
window.DigitalReceiptModal = DigitalReceiptModal;
