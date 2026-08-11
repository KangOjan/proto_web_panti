// Visit Schedule Component (Public Form)
const VisitSchedule = ({ onSubmitVisitRequest, visitsList }) => {
  const [formData, setFormData] = React.useState({
    requesterName: '',
    organization: '',
    email: '',
    phone: '',
    date: '',
    timeSlot: '09:00 - 11:30 WIB',
    visitorCount: '10',
    purpose: '',
    notes: ''
  });

  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.requesterName || !formData.phone || !formData.date || !formData.purpose) {
      alert("Harap lengkapi semua kolom wajib.");
      return;
    }

    onSubmitVisitRequest(formData);
    setSubmitted(true);
    setFormData({
      requesterName: '',
      organization: '',
      email: '',
      phone: '',
      date: '',
      timeSlot: '09:00 - 11:30 WIB',
      visitorCount: '10',
      purpose: '',
      notes: ''
    });

    setTimeout(() => setSubmitted(false), 5000);
  };

  // Approved upcoming visits for public view
  const approvedVisits = visitsList.filter(v => v.status === 'Disetujui');

  return (
    <section id="kunjungan" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <i data-lucide="calendar-range" className="w-4 h-4 text-emerald-600"></i>
            <span>Ramah Komunitas & Donatur</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Jadwalkan Kunjungan & Bakti Sosial
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Komunitas, perusahaan, sekolah, maupun perseorangan dapat mengajukan tanggal kunjungan (seperti buka bersama, baksos, pelatihan) agar jadwal tidak bentrok.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Interactive Schedule Form */}
          <div className="lg:col-span-7 bg-gradient-to-b from-slate-50 to-emerald-50/20 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <i data-lucide="file-text" className="w-5 h-5"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Formulir Pengajuan Kunjungan</h3>
                <p className="text-xs text-slate-500">Pengurus panti akan meninjau dan mengonfirmasi dalam 1x24 jam.</p>
              </div>
            </div>

            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center space-x-3 animate-fade-in">
                <i data-lucide="check-circle-2" className="w-6 h-6 text-emerald-700 shrink-0"></i>
                <div>
                  <strong>Pengajuan Berhasil Dikirim!</strong>
                  <p className="text-xs text-emerald-800 font-normal">Tim pengurus PantiAsih Kasih Bunda telah menerima jadwal Anda dan akan menghubungi via WhatsApp/Email.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penanggung Jawab *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bpk. Ahmad Hidayat"
                    value={formData.requesterName}
                    onChange={(e) => setFormData({...formData, requesterName: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Instansi / Komunitas</label>
                  <input
                    type="text"
                    placeholder="Contoh: Alumni SMA 3 Bandung"
                    value={formData.organization}
                    onChange={(e) => setFormData({...formData, organization: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. WhatsApp / HP *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rencana Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sesi Waktu</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                  >
                    <option>09:00 - 11:30 WIB (Pagi)</option>
                    <option>13:30 - 15:30 WIB (Siang)</option>
                    <option>16:30 - 19:00 WIB (Sore / Buber)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Perkiraan Rombongan</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.visitorCount}
                    onChange={(e) => setFormData({...formData, visitorCount: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Maksud & Tujuan Kunjungan *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Contoh: Penyerahan bantuan sembako, santunan, dan mengajar keterampilan lukis..."
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center space-x-2"
              >
                <i data-lucide="send" className="w-4 h-4"></i>
                <span>Kirim Pengajuan Jadwal Kunjungan</span>
              </button>
            </form>

          </div>

          {/* Right Column: Approved Upcoming Calendar Overview */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold flex items-center space-x-2 text-teal-400">
                  <i data-lucide="calendar" className="w-5 h-5"></i>
                  <span>Jadwal Terkonfirmasi (Minggu Ini)</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-900 text-teal-300 text-xs font-bold">
                  {approvedVisits.length} Terjadwal
                </span>
              </div>

              <div className="space-y-3">
                {approvedVisits.map((visit) => (
                  <div key={visit.id} className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-emerald-400">
                        {visit.date} ({visit.timeSlot})
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800">
                        {visit.visitorCount} orang
                      </span>
                    </div>

                    <div className="text-sm font-bold text-white">
                      {visit.requesterName}
                    </div>

                    <div className="text-xs text-slate-300">
                      {visit.purpose}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 text-xs text-slate-400 flex items-center space-x-2 border border-slate-700/50">
                <i data-lucide="info" className="w-4 h-4 text-emerald-400 shrink-0"></i>
                <span>Jadwal di atas sudah disetujui pengurus agar tidak bentrok.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

window.VisitSchedule = VisitSchedule;
