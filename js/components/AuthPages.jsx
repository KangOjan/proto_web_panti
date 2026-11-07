// Auth Pages (Registration & Login with Approval Validation)
const AuthPages = ({
  initialView = 'login',
  onLoginSuccess,
  onRegisterSubmit
}) => {
  const [view, setView] =
    React.useState(
      initialView
    );

  // Login form state
  const [
    loginUsername,
    setLoginUsername,
  ] = React.useState('');

  const [
    loginPassword,
    setLoginPassword,
  ] = React.useState('');

  const [
    loginError,
    setLoginError,
  ] = React.useState(null);

  const [
    loginLoading,
    setLoginLoading,
  ] = React.useState(false);

  // Register form state
  const [
    formData,
    setFormData,
  ] = React.useState({
    nik: '',
    fullName: '',
    email: '',
    address: '',
    phone: '',
    role: 'pengurus_harian',
    username: '',
    password: '',
  });

  const [
    registerSuccess,
    setRegisterSuccess,
  ] = React.useState(false);

  const [
    registerError,
    setRegisterError,
  ] = React.useState(null);
  const [registerFieldErrors, setRegisterFieldErrors] = React.useState({});

  const [
    registerLoading,
    setRegisterLoading,
  ] = React.useState(false);

  React.useEffect(() => {
    setView(
      initialView
    );

    setLoginError(
      null
    );

    setRegisterError(
      null
    );
  }, [
    initialView,
  ]);

  const validateRegistration = (form) => {
    const errors = {};
    if (!/^\d{16}$/.test(form.nik.trim())) errors.nik = 'NIK harus terdiri dari tepat 16 angka.';
    if (!form.fullName.trim()) {
      errors.fullName = 'Nama lengkap wajib diisi.';
    } else if (!/^[\p{L}][\p{L}\p{M} .,'’\-]*$/u.test(form.fullName.trim()) || form.fullName.trim().length > 255) {
      errors.fullName = 'Nama lengkap hanya boleh berisi huruf dan tanda baca nama yang wajar, tanpa angka atau simbol.';
    }
    if (!form.email.trim()) {
      errors.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) || form.email.trim().length > 255) {
      errors.email = 'Gunakan alamat email yang valid, misalnya nama@gmail.com.';
    }
    if (!form.phone.trim()) {
      errors.phone = 'Nomor HP atau WhatsApp wajib diisi.';
    } else if (!/^(?:\+62|62|0)8[0-9]{8,11}$/.test(form.phone.trim())) {
      errors.phone = 'Nomor HP Indonesia harus berupa 08..., 628..., atau +628..., tanpa spasi atau simbol lainnya.';
    }
    if (!['pengurus_harian', 'pemimpin_lembaga'].includes(form.role)) {
      errors.role = 'Pilih peran Pengurus Harian atau Pemimpin Lembaga.';
    }
    if (form.address.trim().length > 2000) errors.address = 'Alamat maksimal 2.000 karakter.';
    if (!/^[A-Za-z0-9._-]{3,100}$/.test(form.username.trim())) {
      errors.username = 'Username 3-100 karakter, hanya huruf, angka, titik, garis bawah, atau tanda hubung.';
    }
    if (form.password.length < 8 || form.password.length > 72 || !/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      errors.password = 'Password harus 8-72 karakter dan mengandung setidaknya satu huruf serta satu angka.';
    }
    return errors;
  };

  const registrationFieldError = (field) => {
    const error = registerFieldErrors[field];
    return error ? (
      <p role="alert" className="mt-1.5 flex items-start gap-1.5 rounded-lg bg-rose-50 px-2.5 py-2 text-[11px] leading-relaxed text-rose-700">
        <span aria-hidden="true" className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-rose-100 font-bold">!</span>
        <span>{Array.isArray(error) ? error[0] : error}</span>
      </p>
    ) : null;
  };

  const updateFormField = (
    field,
    value
  ) => {
    setRegisterFieldErrors((old) => ({ ...old, [field]: null }));
    setRegisterError(null);
    setFormData(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  };

  const handleRegister =
    async (
      event
    ) => {
      event.preventDefault();

      if (registerLoading) {
        return;
      }

      setRegisterError(
        null
      );

      const fieldErrors = validateRegistration(formData);
      setRegisterFieldErrors(fieldErrors);
      if (Object.keys(fieldErrors).length > 0) {
        setRegisterError(null);
        event.currentTarget.querySelector(`[name="${Object.keys(fieldErrors)[0]}"]`)?.focus();
        return;
      }

      setRegisterLoading(
        true
      );

      try {
        const result =
          await onRegisterSubmit(
            formData
          );

        if (!result?.success) {
          if (result?.errors) {
            setRegisterFieldErrors({ ...result.errors, fullName: result.errors.name || null });
          }
          setRegisterError(
            result?.message ||
              'Pendaftaran akun gagal.'
          );

          return;
        }

        setRegisterSuccess(
          true
        );
      } catch (error) {
        console.error(
          'Registration failed:',
          error
        );

        setRegisterError(
          error?.message ||
            'Terjadi kesalahan saat menghubungi server.'
        );
      } finally {
        setRegisterLoading(
          false
        );
      }
    };

  const handleLogin =
    async (
      event
    ) => {
      event.preventDefault();

      if (loginLoading) {
        return;
      }

      setLoginError(
        null
      );

      setLoginLoading(
        true
      );

      try {
        const result =
          await onLoginSuccess(
            loginUsername.trim(),
            loginPassword
          );

        if (!result?.success) {
          setLoginError(
            result?.message ||
              'Login gagal. Silakan periksa kembali username dan password.'
          );
        }
      } catch (error) {
        console.error(
          'Login failed:',
          error
        );

        setLoginError(
          error?.message ||
            'Terjadi kesalahan saat menghubungi server.'
        );
      } finally {
        setLoginLoading(
          false
        );
      }
    };

  const returnToLogin =
    () => {
      setRegisterSuccess(
        false
      );

      setRegisterError(
        null
      );

      setView(
        'login'
      );
    };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 animate-fade-in relative overflow-hidden">

        {/* Decorative background */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-emerald-600/20">
            <LucideIcon
              name={
                view === 'login'
                  ? 'lock'
                  : 'user-plus'
              }
              className="w-7 h-7"
            />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {view === 'login'
              ? 'Masuk ke SIMK-Panti'
              : 'Pendaftaran Akun Baru'}
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            {view === 'login'
              ? 'Sistem Keuangan Panti Asuhan Berbasis Akuntabilitas & PSAK 45'
              : 'Isi data resmi berikut untuk mengajukan pendaftaran akun'}
          </p>
        </div>

        {/* LOGIN */}
        {view === 'login' && (
          <form
            onSubmit={
              handleLogin
            }
            className="space-y-4"
          >
            {loginError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
                <LucideIcon
                  name="alert-circle"
                  className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5"
                />

                <div className="font-medium leading-relaxed">
                  {loginError}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username
              </label>

              <div className="relative">
                <LucideIcon
                  name="user"
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"
                />

                <input
                  type="text"
                  required
                  value={
                    loginUsername
                  }
                  onChange={(
                    event
                  ) =>
                    setLoginUsername(
                      event.target.value
                    )
                  }
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>

              <div className="relative">
                <LucideIcon
                  name="key-round"
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"
                />

                <input
                  type="password"
                  required
                  value={
                    loginPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setLoginPassword(
                      event.target.value
                    )
                  }
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loginLoading
              }
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 text-sm transition-all flex items-center justify-center space-x-2 mt-2"
            >
              <span>
                {loginLoading
                  ? 'Memproses...'
                  : 'Masuk Ke Sistem'}
              </span>

              {!loginLoading && (
                <LucideIcon
                  name="arrow-right"
                  className="w-4 h-4"
                />
              )}
            </button>

            <div className="text-center pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Belum memiliki akun terdaftar?{' '}
              </span>

              <button
                type="button"
                onClick={() => {
                  setRegisterError(
                    null
                  );

                  setRegisterSuccess(
                    false
                  );

                  setView(
                    'register'
                  );
                }}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Daftar Akun Baru
              </button>
            </div>
          </form>
        )}

        {/* REGISTER */}
        {view === 'register' && (
          <div>
            {registerSuccess ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                  <LucideIcon
                    name="clock"
                    className="w-8 h-8"
                  />
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  Pendaftaran Berhasil Dikirim!
                </h3>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 text-left leading-relaxed space-y-2">
                  <p className="font-semibold">
                    Akun atas nama{' '}
                    <span className="font-extrabold">
                      {formData.fullName}
                    </span>{' '}
                    telah dibuat dengan status{' '}
                    <span className="underline font-bold">
                      Pending Approval
                    </span>.
                  </p>

                  <p>
                    Akun belum dapat digunakan untuk login sampai disetujui oleh{' '}
                    <strong>
                      Pemimpin Lembaga
                    </strong>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    returnToLogin
                  }
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Kembali ke Halaman Login
                </button>
              </div>
            ) : (
              <form
                onSubmit={
                  handleRegister
                }
                noValidate
                className="space-y-3.5"
              >
                {registerError && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
                    <LucideIcon
                      name="alert-circle"
                      className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5"
                    />

                    <div className="font-medium leading-relaxed">
                      {registerError}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    NIK (Nomor Induk Kependudukan) *
                  </label>

                  <input
                    name="nik"
                    aria-invalid={Boolean(registerFieldErrors.nik)}
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength="16"
                    placeholder="320101XXXXXXXXXX"
                    value={
                      formData.nik
                    }
                    onChange={(
                      event
                    ) =>
                      updateFormField(
                        'nik',
                        event.target.value
                      )
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                  />
                    {registrationFieldError("nik")}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Lengkap (Sesuai KTP) *
                  </label>

                  <input
                    name="fullName"
                    aria-invalid={Boolean(registerFieldErrors.fullName)}
                    type="text"
                    required
                    placeholder="Nama lengkap beserta gelar jika ada"
                    value={
                      formData.fullName
                    }
                    onChange={(
                      event
                    ) =>
                      updateFormField(
                        'fullName',
                        event.target.value
                      )
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                  />
                    {registrationFieldError("fullName")}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email *
                  </label>

                  <input
                    name="email"
                    aria-invalid={Boolean(registerFieldErrors.email)}
                    type="text"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="nama@email.com"
                    value={
                      formData.email
                    }
                    onChange={(
                      event
                    ) =>
                      updateFormField(
                        'email',
                        event.target.value
                      )
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                  />
                    {registrationFieldError("email")}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      No. HP / WhatsApp *
                    </label>

                    <input
                      name="phone"
                      aria-invalid={Boolean(registerFieldErrors.phone)}
                      type="text"
                      required
                      placeholder="0812XXXXXXXX"
                      value={
                        formData.phone
                      }
                      onChange={(
                        event
                      ) =>
                        updateFormField(
                          'phone',
                          event.target.value
                        )
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    />
                    {registrationFieldError("phone")}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Pilihan Peran (Role) *
                    </label>

                    <select
                      name="role"
                      aria-invalid={Boolean(registerFieldErrors.role)}
                      required
                      value={
                        formData.role
                      }
                      onChange={(
                        event
                      ) =>
                        updateFormField(
                          'role',
                          event.target.value
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-semibold bg-white"
                    >
                      <option value="pengurus_harian">
                        Pengurus Harian
                      </option>

                      <option value="pemimpin_lembaga">
                        Pemimpin Lembaga
                      </option>
                    </select>
                    {registrationFieldError("role")}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Alamat Lengkap
                  </label>

                  <input
                    name="address"
                    aria-invalid={Boolean(registerFieldErrors.address)}
                    type="text"
                    placeholder="Jl. Merdeka No. X..."
                    value={
                      formData.address
                    }
                    onChange={(
                      event
                    ) =>
                      updateFormField(
                        'address',
                        event.target.value
                      )
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                  />
                    {registrationFieldError("address")}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Username *
                    </label>

                    <input
                      name="username"
                      aria-invalid={Boolean(registerFieldErrors.username)}
                      type="text"
                      required
                      placeholder="username_anda"
                      value={
                        formData.username
                      }
                      onChange={(
                        event
                      ) =>
                        updateFormField(
                          'username',
                          event.target.value
                        )
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    />
                    {registrationFieldError("username")}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Password *
                    </label>

                    <input
                      name="password"
                      aria-invalid={Boolean(registerFieldErrors.password)}
                      type="password"
                      required
                      minLength="8"
                      placeholder="Minimal 8 karakter"
                      value={
                        formData.password
                      }
                      onChange={(
                        event
                      ) =>
                        updateFormField(
                          'password',
                          event.target.value
                        )
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    />
                    {registrationFieldError("password")}
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Password minimal 8 karakter dan harus memenuhi validasi keamanan backend.
                </p>

                <button
                  type="submit"
                  disabled={
                    registerLoading
                  }
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-md text-xs transition-all flex items-center justify-center space-x-2 mt-2"
                >
                  <span>
                    {registerLoading
                      ? 'Mengirim...'
                      : 'Kirim Permohonan Pendaftaran'}
                  </span>

                  {!registerLoading && (
                    <LucideIcon
                      name="send"
                      className="w-4 h-4"
                    />
                  )}
                </button>

                <div className="text-center pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Sudah memiliki akun?{' '}
                  </span>

                  <button
                    type="button"
                    onClick={
                      returnToLogin
                    }
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
  );
};

window.AuthPages = AuthPages;