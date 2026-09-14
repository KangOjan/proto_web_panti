// Reusable Modals & Feedback Notifications Component (With Donasi-Style Form Design)
const AddEditTrxModal = ({
  isOpen,
  onClose,
  onSubmitTransaction,
  editingTrx = null
}) => {
  const [type, setType] = React.useState(editingTrx ? editingTrx.type : 'pemasukan');
  const [date, setDate] = React.useState(editingTrx ? editingTrx.date : new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = React.useState(editingTrx ? editingTrx.amount : 100000);
  const [category, setCategory] = React.useState(
    editingTrx ? editingTrx.category : (type === 'pemasukan' ? 'Konsumsi' : 'Operasional')
  );
  const [partyName, setPartyName] = React.useState(
    editingTrx ? (editingTrx.donorName || editingTrx.description || '') : ''
  );
  const [phone, setPhone] = React.useState(editingTrx ? (editingTrx.phone || '') : '');
  const [description, setDescription] = React.useState(editingTrx ? editingTrx.description : '');

  // Payment Method for Income: 'qris' | 'bank'
  const [paymentMethod, setPaymentMethod] = React.useState(
    editingTrx ? (editingTrx.paymentMethod?.includes('Transfer') ? 'bank' : 'qris') : 'qris'
  );
  const [selectedBank, setSelectedBank] = React.useState('BSI');
  const [copiedBank, setCopiedBank] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) return;

    const nextType = editingTrx?.type || 'pemasukan';

    setType(nextType);
    setDate(editingTrx?.date || new Date().toISOString().split('T')[0]);
    setAmount(editingTrx?.amount ?? 100000);
    setCategory(
      editingTrx?.category ||
        (nextType === 'pemasukan' ? 'Konsumsi' : 'Operasional')
    );
    setPartyName(
      editingTrx?.donorName ||
        editingTrx?.description ||
        ''
    );
    setPhone(editingTrx?.phone || '');
    setDescription(editingTrx?.description || '');
    setPaymentMethod(
      editingTrx?.paymentMethod?.includes('Transfer') ? 'bank' : 'qris'
    );
    setSelectedBank('BSI');
    setCopiedBank(false);
  }, [isOpen, editingTrx]);

  if (!isOpen) return null;

  const presetAmounts = [50000, 100000, 500000, 1000000];

  const banks = {
    'BSI': { name: 'Bank Syariah Indonesia (BSI)', no: '7192-0045-88', holder: 'Yayasan Panti Asuhan Kasih Bunda' },
    'Mandiri': { name: 'Bank Mandiri', no: '127-00-098234-1', holder: 'Yayasan Panti Asuhan Kasih Bunda' },
    'BCA': { name: 'Bank BCA', no: '882-019-4451', holder: 'Yayasan Panti Asuhan Kasih Bunda' }
  };

  const handleCopyAccount = (accountNo) => {
    navigator.clipboard.writeText(accountNo);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 3000);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'pemasukan') setCategory('Konsumsi');
    else setCategory('Operasional');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      alert("Mohon lengkapi nominal transaksi.");
      return;
    }

    const finalDescription = partyName
      ? `${partyName} - ${description || (type === 'pemasukan' ? 'Penerimaan Kas' : 'Pengeluaran Kas')}`
      : (description || (type === 'pemasukan' ? 'Penerimaan Kas' : 'Pengeluaran Kas'));

    let finalMethodLabel = 'Kas Masuk Bendahara';
    if (type === 'pemasukan') {
      if (paymentMethod === 'qris') finalMethodLabel = 'Scan QRIS Dinamis';
      else finalMethodLabel = `Transfer Bank (${selectedBank})`;
    }

    onSubmitTransaction({
      id: editingTrx ? editingTrx.id : null,
      type,
      date,
      amount: parseFloat(amount),
      category,
      donorName: partyName,
      phone,
      paymentMethod: finalMethodLabel,
      description: finalDescription
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in no-print overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
          title="Tutup Modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Modal Title Banner */}
        <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white ${
            type === 'pemasukan' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}>
            <LucideIcon name={type === 'pemasukan' ? "arrow-down-left" : "arrow-up-right"} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {editingTrx ? "Edit Transaksi Keuangan" : "Pencatatan Transaksi Baru"}
            </h3>
            <p className="text-xs text-slate-500">
              Setiap pencatatan transaksi akan otomatis menerbitkan Kuitansi Digital & terekam di Digital Audit Trail.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Type Selector Tabs (Pemasukan vs Pengeluaran) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jenis Transaksi *
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => handleTypeChange('pemasukan')}
                className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
                  type === 'pemasukan' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LucideIcon name="arrow-down-left" className="w-4 h-4" />
                <span>Pemasukan (Kas Masuk)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('pengeluaran')}
                className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
                  type === 'pengeluaran' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LucideIcon name="arrow-up-right" className="w-4 h-4" />
                <span>Pengeluaran (Kas Keluar)</span>
              </button>
            </div>
          </div>

          {/* Section 1: Identitas & Nominal Transaksi */}
          <div className="space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">1</span>
              <span>Identitas & Nominal {type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}</span>
            </h3>

            {/* Row 1: Nama Pihak (Left) & Kategori (Right) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {type === 'pemasukan' ? 'Nama Lengkap Donatur / Sumber Dana *' : 'Diserahkan Kepada / Nama Toko *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={type === 'pemasukan' ? "cth: Bapak H. Hendra / Hamba Allah" : "cth: Toko Sembako Barokah / Pembayaran SPP"}
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kategori {type === 'pemasukan' ? 'Alokasi Dana' : 'Biaya Operasional'} *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-bold bg-white text-slate-900"
                >
                  {type === 'pemasukan' ? (
                    <>
                      <option value="Konsumsi">Pemenuhan Konsumsi & Gizi Harian</option>
                      <option value="SPP/Pendidikan">Beasiswa SPP & Seragam Sekolah</option>
                      <option value="Operasional">Operasional & Fasilitas Asrama</option>
                      <option value="Donasi Rutin">Donasi Rutin Operasional Anak</option>
                      <option value="Infak/Zakat">Infak / Zakat Maal</option>
                      <option value="Bantuan Pemerintah/APBD">Bantuan Pemerintah / APBD</option>
                      <option value="Lainnya">Lainnya / Sedekah Umum</option>
                    </>
                  ) : (
                    <>
                      <option value="Konsumsi">Konsumsi & Dapur Anak</option>
                      <option value="SPP/Pendidikan">SPP & Seragam Sekolah</option>
                      <option value="Operasional">Operasional & Listrik/Air/Wi-Fi</option>
                      <option value="Kesehatan">Kesehatan & Obat-Obatan</option>
                      <option value="Lainnya">Lainnya / Biaya Insidental</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Row 2: Nominal Donasi (Left 50%) & No HP/WhatsApp + Tanggal (Right 50%) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              
              {/* Left Column: Nominal with 4 Preset Buttons (2 per row) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nominal {type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'} (Rp) *
                </label>

                {/* Quick Presets Grid (4 items: 2 per row) */}
                <div className="grid grid-cols-2 gap-2">
                  {presetAmounts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAmount(p)}
                      className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all border text-center ${
                        amount === p
                          ? (type === 'pemasukan' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-rose-600 text-white border-rose-600 shadow-sm')
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Rp {p.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input Field */}
                <div className="relative pt-1">
                  <span className="absolute left-4 top-3.5 font-black text-slate-400 text-sm">Rp</span>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-base font-black text-slate-900"
                  />
                </div>
              </div>

              {/* Right Column: No HP & Tanggal Transaksi */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tanggal Transaksi *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    No. HP / WhatsApp (Untuk Kuitansi Digital)
                  </label>
                  <input
                    type="text"
                    placeholder="cth: 0812XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
              </div>

            </div>

            {/* Row 3: Doa & Harapan / Rincian Keterangan (FULL WIDTH MULTI-LINE TEXTAREA) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {type === 'pemasukan' ? 'Doa & Harapan / Rincian Keterangan (Opsional)' : 'Rincian Keterangan Pengeluaran *'}
              </label>
              <textarea
                rows="3"
                placeholder={type === 'pemasukan' ? "Tuliskan doa, niat, atau catatan rincian donatur..." : "Pembelian beras 50kg, minyak goreng 10L, dan telur 5 karpet..."}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-medium leading-relaxed resize-y"
              ></textarea>
            </div>

          </div>

          {/* Section 2: Pilihan Metode Pembayaran (HANYA UNTUK PEMASUKAN: QRIS & TRANSFER BANK) */}
          {type === 'pemasukan' && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">2</span>
                <span>Pilihan Metode Pembayaran Kas Masuk</span>
              </h3>

              {/* 2 Methods for Pemasukan: Scan QRIS Dinamis vs Transfer Bank */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Method 1: Scan QRIS Dinamis */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                    paymentMethod === 'qris'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">Scan QRIS Dinamis</span>
                    <LucideIcon name="qr-code" className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 font-medium">
                    Otomatis menyesuaikan nominal donasi (GoPay, OVO, Dana, ShopeePay, m-Banking).
                  </p>
                </button>

                {/* Method 2: Transfer Bank */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                    paymentMethod === 'bank'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">Transfer Bank</span>
                    <LucideIcon name="building" className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 font-medium">
                    Transfer langsung ke rekening resmi panti asuhan (BSI, Mandiri, BCA).
                  </p>
                </button>

              </div>

              {/* QRIS PREVIEW */}
              {paymentMethod === 'qris' && (
                <div className="bg-slate-900 text-white rounded-2xl p-4 text-center space-y-2 animate-fade-in text-xs border border-slate-800">
                  <div className="font-bold text-amber-400">Kode QRIS Dinamis Diterbitkan</div>
                  <div className="bg-white p-2 rounded-xl inline-block text-slate-900">
                    <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100">
                      <rect x="5" y="5" width="90" height="90" fill="none" stroke="#0f172a" strokeWidth="3" rx="4" />
                      <rect x="10" y="10" width="22" height="22" fill="#0f172a" />
                      <rect x="68" y="10" width="22" height="22" fill="#0f172a" />
                      <rect x="10" y="68" width="22" height="22" fill="#0f172a" />
                      <rect x="42" y="42" width="16" height="16" fill="#10b981" />
                    </svg>
                    <div className="text-[10px] font-bold text-emerald-700">Rp {amount ? parseFloat(amount).toLocaleString('id-ID') : '0'}</div>
                  </div>
                </div>
              )}

              {/* BANK PREVIEW */}
              {paymentMethod === 'bank' && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 animate-fade-in text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-600">Pilih Rekening Bank:</span>
                    {Object.keys(banks).map(bKey => (
                      <button
                        key={bKey}
                        type="button"
                        onClick={() => setSelectedBank(bKey)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                          selectedBank === bKey
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {bKey}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{banks[selectedBank].name}</div>
                      <div className="font-mono font-black text-sm text-slate-800">{banks[selectedBank].no}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyAccount(banks[selectedBank].no)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold"
                    >
                      {copiedBank ? "Tersalin!" : "Salin No. Rek"}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Form Action Controls */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 text-white rounded-xl text-xs font-black shadow-md flex items-center space-x-2 transition-all ${
                type === 'pemasukan' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <LucideIcon name="check-circle-2" className="w-4 h-4" />
              <span>{editingTrx ? "Simpan Perubahan Transaksi" : "Simpan Transaksi"}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// Confirmation Modal for Delete Action
const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  trxToDelete
}) => {
  if (!isOpen || !trxToDelete) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in no-print">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <LucideIcon name="alert-triangle" className="w-7 h-7" />
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
};

window.AddEditTrxModal = AddEditTrxModal;
window.ConfirmDeleteModal = ConfirmDeleteModal;
