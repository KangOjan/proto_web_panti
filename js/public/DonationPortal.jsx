// Donation Portal & Foster Parent Program Component
const DonationPortal = ({ childrenData, onOpenDonationModal, onOpenFosterModal }) => {
  const [activeEduFilter, setActiveEduFilter] = React.useState('semua');
  const [copiedBank, setCopiedBank] = React.useState(null);

  const filteredChildren = childrenData.filter(child => {
    if (activeEduFilter === 'semua') return true;
    if (activeEduFilter === 'sd') return child.education.includes('SD');
    if (activeEduFilter === 'smp') return child.education.includes('SMP');
    if (activeEduFilter === 'sma') return child.education.includes('SMA') || child.education.includes('SMK');
    return true;
  });

  const copyToClipboard = (text, bankName) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bankName);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  return (
    <div className="space-y-20 py-12">
      
      {/* SECTION A: Pilihan Donasi Digital */}
      <section className="bg-emerald-900 text-white py-16 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 shadow-2xl relative overflow-hidden">
        
        {/* Background glow overlay */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            Portal Donasi Digital
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Pilihan Metode Pembayaran Mudah & Transparan
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto">
            Salurkan infak, sedekah, dan donasi terbaik Anda melalui berbagai metode transfer bank resmi, QRIS, dan e-Wallet.
          </p>
        </div>

        {/* Bank & e-Wallet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-5xl mx-auto">
          
          {/* Card 1: Bank Transfer */}
          <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase">Transfer Bank</span>
              <LucideIcon name="building-2" className="w-5 h-5 text-emerald-300" />
            </div>
            
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-slate-300">BCA</div>
                  <div className="text-lg font-mono font-bold text-white tracking-wider">8830-1234-56</div>
                </div>
                <button
                  onClick={() => copyToClipboard('8830123456', 'BCA')}
                  className="p-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center space-x-1"
                >
                  <LucideIcon name={copiedBank === 'BCA' ? 'check' : 'copy'} className="w-4 h-4" />
                  <span>{copiedBank === 'BCA' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-slate-300">Mandiri</div>
                  <div className="text-lg font-mono font-bold text-white tracking-wider">1310-0099-8877</div>
                </div>
                <button
                  onClick={() => copyToClipboard('131000998877', 'Mandiri')}
                  className="p-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center space-x-1"
                >
                  <LucideIcon name={copiedBank === 'Mandiri' ? 'check' : 'copy'} className="w-4 h-4" />
                  <span>{copiedBank === 'Mandiri' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            <div className="text-xs text-emerald-300">a.n Yayasan Kasih Bunda PantiAsih</div>
          </div>

          {/* Card 2: QRIS Interaktif */}
          <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase">QRIS All Payment</span>
              <LucideIcon name="qr-code" className="w-5 h-5 text-emerald-300" />
            </div>
            
            <div className="bg-white p-3 rounded-xl mx-auto text-center border-2 border-emerald-400/40 max-w-[160px]">
              <div className="w-32 h-32 bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center text-white text-center">
                <LucideIcon name="qr-code" className="w-20 h-20 text-emerald-400" />
                <span className="text-[10px] font-bold text-slate-300 mt-1">SCAN QRIS HERE</span>
              </div>
            </div>

            <div className="text-center text-xs text-emerald-200">
              Dapat di-scan melalui Mobile Banking, GoPay, OVO, ShopeePay, DANA, LinkAja
            </div>
          </div>

          {/* Card 3: e-Wallet & Konfirmasi */}
          <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase">e-Wallet & Konfirmasi</span>
              <LucideIcon name="wallet" className="w-5 h-5 text-emerald-300" />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-900/60">
                <span className="font-semibold text-white">GoPay / OVO</span>
                <span className="font-mono text-emerald-300 font-bold">0812-8877-6655</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-900/60">
                <span className="font-semibold text-white">ShopeePay / DANA</span>
                <span className="font-mono text-emerald-300 font-bold">0812-8877-6655</span>
              </div>
            </div>

            <button
              onClick={onOpenDonationModal}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center space-x-2"
            >
              <LucideIcon name="send" className="w-4 h-4" />
              <span>Isi Form Konfirmasi Donasi</span>
            </button>
          </div>

        </div>

      </section>

      {/* SECTION B: Program Orang Tua Asuh */}
      <section id="orang-tua-asuh" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
            <LucideIcon name="heart" className="w-3.5 h-3.5 text-orange-600" />
            <span>Program Pendampingan Belajar & Gizi</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Program "Orang Tua Asuh"
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Berikan dukungan beasiswa pendidikan dan pemenuhan gizi bulanan untuk anak asuh pilihan Anda. Informasi dijaga privasinya (hanya nama depan & profil umum).
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center space-x-2">
          {['semua', 'sd', 'smp', 'sma'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveEduFilter(filter)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeEduFilter === filter
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter === 'semua' ? 'Semua Jenjang' : filter.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Children Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChildren.map((child) => (
            <div
              key={child.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div className="p-6 space-y-4">
                
                {/* Header Profile */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-xl shadow-md">
                      {child.firstName[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {child.firstName} ({child.age} th)
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {child.education}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    child.status === 'Yatim Piatu' ? 'badge-red' : child.status === 'Yatim' ? 'badge-amber' : 'badge-emerald'
                  }`}>
                    {child.status}
                  </span>
                </div>

                {/* Info List */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1.5 font-medium">
                      <LucideIcon name="sparkles" className="w-3.5 h-3.5 text-amber-500" />
                      <span>Cita-cita:</span>
                    </span>
                    <span className="font-bold text-slate-800">{child.ambition}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1.5 font-medium">
                      <LucideIcon name="smile" className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Hobi & Minat:</span>
                    </span>
                    <span className="font-bold text-slate-800">{child.hobbies}</span>
                  </div>
                </div>

                {/* Foster Status Badge */}
                <div className="pt-2">
                  {child.fosterStatus === 'Ada Orang Tua Asuh' ? (
                    <div className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold flex items-center justify-center space-x-1.5">
                      <LucideIcon name="check-circle-2" className="w-4 h-4 text-teal-600" />
                      <span>Memiliki Orang Tua Asuh</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-800 border border-orange-200 text-xs font-semibold flex items-center justify-center space-x-1.5">
                      <LucideIcon name="clock" className="w-4 h-4 text-orange-600" />
                      <span>Membutuhkan Orang Tua Asuh</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Action Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={() => onOpenFosterModal(child)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <LucideIcon name="heart" className="w-4 h-4" />
                  <span>Jadi Orang Tua Asuh {child.firstName}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </section>

    </div>
  );
};

window.DonationPortal = DonationPortal;
