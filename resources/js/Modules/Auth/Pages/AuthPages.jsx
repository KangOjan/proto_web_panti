import React, { useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import {
  Lock,
  UserPlus,
  Zap,
  AlertCircle,
  User,
  KeyRound,
  ArrowRight,
  Clock,
  Send
} from 'lucide-react';

export default function AuthPages(props) {
  const simk = useSimk();
  const initialView = props.initialView || 'login';
  const onLoginSuccess = props.onLoginSuccess || simk.handleLogin;
  const onRegisterSubmit = props.onRegisterSubmit || simk.handleRegisterSubmit;
  const onSwitchUserRole = props.onSwitchUserRole || simk.handleSwitchUserRole;
  const [view, setView] = useState(initialView);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

  const [formData, setFormData] = useState({
    nik: '',
    fullName: '',
    address: '',
    phone: '',
    role: 'Pengurus Harian',
    username: '',
    password: ''
  });
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.nik || !formData.fullName || !formData.username || !formData.password) {
      alert("Mohon lengkapi seluruh field formulir pendaftaran resmi.");
      return;
    }

    if (onRegisterSubmit) {
      onRegisterSubmit(formData);
    }
    setRegisterSuccess(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError(null);

    if (onLoginSuccess) {
      const result = onLoginSuccess(loginUsername, loginPassword);
      if (!result.success) {
        setLoginError(result.message);
      }
    }
  };

  return (
    <MainLayout currentRoute={view === 'login' ? 'login' : 'register'}>
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 animate-fade-in relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>

          {/* View Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-emerald-600/20">
              {view === 'login' ? <Lock className="w-7 h-7" /> : <UserPlus className="w-7 h-7" />}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {view === 'login' ? "Masuk ke SIMK-Panti" : "Pendaftaran Akun Baru"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {view === 'login'
                ? "Sistem Keuangan Panti Asuhan Berbasis Akuntabilitas & PSAK 45"
                : "Isi data resmi berikut untuk mengajukan pendaftaran akun"}
            </p>
          </div>

          {/* Quick Demo Assistant Box */}
          <div className="mb-6 bg-slate-900 text-slate-200 p-3.5 rounded-2xl text-xs space-y-2 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Pilih Role untuk Testing Cepat:</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setLoginUsername('harian1');
                  setLoginPassword('password123');
                  if (onSwitchUserRole) onSwitchUserRole('Pengurus Harian');
                }}
                className="px-2.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 rounded-xl font-semibold border border-emerald-800 text-left transition-all"
              >
                <div className="font-bold text-[11px]">Pengurus Harian</div>
                <div className="text-[10px] opacity-75">username: harian1</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginUsername('pemimpin1');
                  setLoginPassword('password123');
                  if (onSwitchUserRole) onSwitchUserRole('Pemimpin Lembaga');
                }}
                className="px-2.5 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 rounded-xl font-semibold border border-indigo-800 text-left transition-all"
              >
                <div className="font-bold text-[11px]">Pemimpin Lembaga</div>
                <div className="text-[10px] opacity-75">username: pemimpin1</div>
              </button>
            </div>
          </div>

          {/* VIEW 1: LOGIN FORM */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="font-medium leading-relaxed">{loginError}</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Masukkan username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 text-sm flex items-center justify-center space-x-2 mt-2"
              >
                <span>Masuk Ke Sistem</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">Belum memiliki akun terdaftar? </span>
                <button
                  type="button"
                  onClick={() => setView('register')}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  Daftar Akun Baru
                </button>
              </div>
            </form>
          )}

          {/* VIEW 2: REGISTER FORM */}
          {view === 'register' && (
            <div>
              {registerSuccess ? (
                <div className="space-y-4 text-center py-4">
                  <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Pendaftaran Berhasil Dikirim!</h3>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 text-left leading-relaxed space-y-2">
                    <p className="font-semibold">
                      Akun Anda atas nama <span className="font-extrabold">{formData.fullName}</span> telah berhasil dibuat dengan status <span className="underline font-bold">"Pending Approval"</span>.
                    </p>
                    <p>
                      Sesuai prosedur keamanan dan tata kelola panti, akun Anda memerlukan persetujuan (Approval) dari Pemimpin Lembaga sebelum dapat digunakan untuk login.
                    </p>
                  </div>
                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => {
                        if (onSwitchUserRole) onSwitchUserRole('Pemimpin Lembaga');
                      }}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Beralih ke Pemimpin Lembaga untuk Verifikasi Akun Ini
                    </button>

                    <button
                      onClick={() => {
                        setRegisterSuccess(false);
                        setView('login');
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Kembali ke Halaman Login
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      NIK (Nomor Induk Kependudukan) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength="16"
                      placeholder="320101XXXXXXXXXX"
                      value={formData.nik}
                      onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Lengkap (Sesuai KTP) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama lengkap beserta gelar jika ada"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        No. HP / WhatsApp *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="0812XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Pilihan Peran (Role) *
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-semibold bg-white"
                      >
                        <option value="Pengurus Harian">Pengurus Harian</option>
                        <option value="Pemimpin Lembaga">Pemimpin Lembaga</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Alamat Lengkap
                    </label>
                    <input
                      type="text"
                      placeholder="Jl. Merdeka No. X..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Username *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="username_anda"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md text-xs transition-all flex items-center justify-center space-x-2 mt-2"
                  >
                    <span>Kirim Permohonan Pendaftaran</span>
                    <Send className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500">Sudah memiliki akun? </span>
                    <button
                      type="button"
                      onClick={() => setView('login')}
                      className="text-xs font-bold text-emerald-700 hover:underline"
                    >
                      Login Sekarang
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
