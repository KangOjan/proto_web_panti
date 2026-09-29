// Reusable Modals & Feedback Notifications Component
// Step 30B: Async-safe transaction create/update/delete UX

const AddEditTrxModal = ({
  isOpen,
  onClose,
  onSubmitTransaction,
  editingTrx = null,
}) => {
  const getToday = () =>
    new Date()
      .toISOString()
      .split('T')[0];

  const resolveInitialPaymentMethod = (
    transaction
  ) => {
    const label = String(
      transaction?.paymentMethod ||
        ''
    ).toLowerCase();

    if (
      label.includes(
        'transfer'
      )
    ) {
      return 'bank';
    }

    if (
      label.includes(
        'tunai'
      ) ||
      label.includes(
        'kas'
      )
    ) {
      return 'cash';
    }

    return 'qris';
  };

  const resolveInitialBank = (
    transaction
  ) => {
    const label = String(
      transaction?.paymentMethod ||
        ''
    );

    const match =
      label.match(
        /\(([^)]+)\)/
      );

    return (
      match?.[1] ||
      'BSI'
    );
  };

  const [
    type,
    setType,
  ] = React.useState(
    editingTrx
      ? editingTrx.type
      : 'pemasukan'
  );

  const [
    date,
    setDate,
  ] = React.useState(
    editingTrx
      ? editingTrx.date
      : getToday()
  );

  const [
    amount,
    setAmount,
  ] = React.useState(
    editingTrx
      ? editingTrx.amount
      : 100000
  );

  const [
    category,
    setCategory,
  ] = React.useState(
    editingTrx
      ? editingTrx.category
      : (
          type ===
          'pemasukan'
            ? 'Konsumsi'
            : 'Operasional'
        )
  );

  const [
    partyName,
    setPartyName,
  ] = React.useState(
    editingTrx
      ? (
          editingTrx
            .donorName ||
          editingTrx
            .partyName ||
          ''
        )
      : ''
  );

  const [
    phone,
    setPhone,
  ] = React.useState(
    editingTrx
      ? (
          editingTrx
            .phone ||
          ''
        )
      : ''
  );

  const [
    description,
    setDescription,
  ] = React.useState(
    editingTrx
      ? (
          editingTrx
            .description ||
          ''
        )
      : ''
  );

  /*
   * Payment method untuk transaksi manual.
   *
   * Ini hanya mencatat bagaimana dana
   * diterima. Tidak memulai pembayaran
   * Midtrans.
   */
  const [
    paymentMethod,
    setPaymentMethod,
  ] = React.useState(
    resolveInitialPaymentMethod(
      editingTrx
    )
  );

  const [
    selectedBank,
    setSelectedBank,
  ] = React.useState(
    resolveInitialBank(
      editingTrx
    )
  );

  const [
    copiedBank,
    setCopiedBank,
  ] = React.useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = React.useState(false);

  const [
    submitError,
    setSubmitError,
  ] = React.useState(null);

  React.useEffect(
    () => {
      if (!isOpen) {
        return;
      }

      const nextType =
        editingTrx?.type ||
        'pemasukan';

      setType(
        nextType
      );

      setDate(
        editingTrx?.date ||
        getToday()
      );

      setAmount(
        editingTrx?.amount ??
        100000
      );

      setCategory(
        editingTrx?.category ||
        (
          nextType ===
          'pemasukan'
            ? 'Konsumsi'
            : 'Operasional'
        )
      );

      setPartyName(
        editingTrx?.donorName ||
        editingTrx?.partyName ||
        ''
      );

      setPhone(
        editingTrx?.phone ||
        ''
      );

      setDescription(
        editingTrx?.description ||
        ''
      );

      setPaymentMethod(
        resolveInitialPaymentMethod(
          editingTrx
        )
      );

      setSelectedBank(
        resolveInitialBank(
          editingTrx
        )
      );

      setCopiedBank(
        false
      );

      setSubmitError(
        null
      );

      setIsSubmitting(
        false
      );
    },
    [
      isOpen,
      editingTrx,
    ]
  );

  if (!isOpen) {
    return null;
  }

  const presetAmounts = [
    50000,
    100000,
    500000,
    1000000,
  ];

  const banks = {
    BSI: {
      name:
        'Bank Syariah Indonesia (BSI)',

      no:
        '7192-0045-88',

      holder:
        'Yayasan Panti Asuhan Kasih Bunda',
    },

    Mandiri: {
      name:
        'Bank Mandiri',

      no:
        '127-00-098234-1',

      holder:
        'Yayasan Panti Asuhan Kasih Bunda',
    },

    BCA: {
      name:
        'Bank BCA',

      no:
        '882-019-4451',

      holder:
        'Yayasan Panti Asuhan Kasih Bunda',
    },
  };

  const handleClose = () => {
    if (
      isSubmitting
    ) {
      return;
    }

    setSubmitError(
      null
    );

    onClose();
  };

  const handleCopyAccount =
    async (
      accountNo
    ) => {
      try {
        await navigator
          .clipboard
          .writeText(
            accountNo
          );

        setCopiedBank(
          true
        );

        window.setTimeout(
          () => {
            setCopiedBank(
              false
            );
          },
          3000
        );
      } catch {
        setCopiedBank(
          false
        );
      }
    };

  const handleTypeChange = (
    newType
  ) => {
    if (
      isSubmitting
    ) {
      return;
    }

    setType(
      newType
    );

    setSubmitError(
      null
    );

    if (
      newType ===
      'pemasukan'
    ) {
      setCategory(
        'Konsumsi'
      );

      return;
    }

    setCategory(
      'Operasional'
    );
  };

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      if (
        isSubmitting
      ) {
        return;
      }

      setSubmitError(
        null
      );

      const parsedAmount =
        Number(
          amount
        );

      if (
        !Number.isFinite(
          parsedAmount
        ) ||
        parsedAmount <
          1000
      ) {
        setSubmitError(
          'Nominal transaksi minimal Rp 1.000.'
        );

        return;
      }

      const normalizedParty =
        String(
          partyName ||
          ''
        ).trim();

      if (
        !normalizedParty
      ) {
        setSubmitError(
          type ===
          'pemasukan'
            ? 'Nama donatur atau sumber dana wajib diisi.'
            : 'Nama penerima atau pihak transaksi wajib diisi.'
        );

        return;
      }

      const normalizedDescription =
        String(
          description ||
          ''
        ).trim();

      if (
        type ===
          'pengeluaran' &&
        !normalizedDescription
      ) {
        setSubmitError(
          'Rincian pengeluaran wajib diisi.'
        );

        return;
      }

      let finalMethodLabel =
        null;

      if (
        type ===
        'pemasukan'
      ) {
        if (
          paymentMethod ===
          'bank'
        ) {
          finalMethodLabel =
            `Transfer Bank (${selectedBank})`;
        } else if (
          paymentMethod ===
          'cash'
        ) {
          finalMethodLabel =
            'Tunai';
        } else {
          finalMethodLabel =
            'Scan QRIS Dinamis';
        }
      }

      try {
        setIsSubmitting(
          true
        );

        const result =
          await Promise.resolve(
            onSubmitTransaction({
              id:
                editingTrx
                  ? editingTrx.id
                  : null,

              type,

              date,

              amount:
                parsedAmount,

              category,

              donorName:
                normalizedParty,

              partyName:
                normalizedParty,

              phone:
                String(
                  phone ||
                  ''
                ).trim(),

              paymentMethod:
                finalMethodLabel,

              description:
                normalizedDescription ||
                (
                  type ===
                  'pemasukan'
                    ? 'Penerimaan kas.'
                    : 'Pengeluaran kas.'
                ),
            })
          );

        /*
         * Modal hanya ditutup ketika
         * backend benar-benar berhasil.
         */
        if (
          result?.success !==
          true
        ) {
          const validationMessage =
            result
              ?.error
              ?.errors
              ? Object.values(
                  result
                    .error
                    .errors
                )
                  .flat()
                  .join(' ')
              : null;

          setSubmitError(
            validationMessage ||
            result
              ?.error
              ?.message ||
            result
              ?.message ||
            'Transaksi gagal disimpan.'
          );

          return;
        }

        onClose();
      } catch (
        error
      ) {
        console.error(
          'Transaction modal submission failed:',
          error
        );

        setSubmitError(
          error?.message ||
          'Transaksi gagal disimpan.'
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in no-print overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          type="button"
          onClick={
            handleClose
          }
          disabled={
            isSubmitting
          }
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          title={
            isSubmitting
              ? 'Transaksi sedang disimpan'
              : 'Tutup Modal'
          }
        >
          <LucideIcon
            name="x"
            className="w-5 h-5"
          />
        </button>

        {/* Modal Title */}
        <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white ${
              type ===
              'pemasukan'
                ? 'bg-emerald-600'
                : 'bg-rose-600'
            }`}
          >
            <LucideIcon
              name={
                type ===
                'pemasukan'
                  ? 'arrow-down-left'
                  : 'arrow-up-right'
              }
              className="w-5 h-5"
            />
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {editingTrx
                ? 'Edit Transaksi Keuangan'
                : 'Pencatatan Transaksi Baru'}
            </h3>

            <p className="text-xs text-slate-500">
              Data transaksi disimpan ke buku kas backend SIMK-Panti dan dapat digunakan untuk kuitansi digital.
            </p>
          </div>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-6"
        >

          {/* Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jenis Transaksi *
            </label>

            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                disabled={
                  isSubmitting
                }
                onClick={() =>
                  handleTypeChange(
                    'pemasukan'
                  )
                }
                className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                  type ===
                  'pemasukan'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LucideIcon
                  name="arrow-down-left"
                  className="w-4 h-4"
                />

                <span>
                  Pemasukan (Kas Masuk)
                </span>
              </button>

              <button
                type="button"
                disabled={
                  isSubmitting
                }
                onClick={() =>
                  handleTypeChange(
                    'pengeluaran'
                  )
                }
                className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                  type ===
                  'pengeluaran'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LucideIcon
                  name="arrow-up-right"
                  className="w-4 h-4"
                />

                <span>
                  Pengeluaran (Kas Keluar)
                </span>
              </button>
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">
                1
              </span>

              <span>
                Identitas & Nominal{' '}
                {type ===
                'pemasukan'
                  ? 'Pemasukan'
                  : 'Pengeluaran'}
              </span>
            </h3>

            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {type ===
                  'pemasukan'
                    ? 'Nama Lengkap Donatur / Sumber Dana *'
                    : 'Diserahkan Kepada / Nama Toko *'}
                </label>

                <input
                  type="text"
                  required
                  disabled={
                    isSubmitting
                  }
                  placeholder={
                    type ===
                    'pemasukan'
                      ? 'cth: Bapak H. Hendra / Hamba Allah'
                      : 'cth: Toko Sembako Barokah / Pembayaran SPP'
                  }
                  value={
                    partyName
                  }
                  onChange={(
                    event
                  ) =>
                    setPartyName(
                      event.target
                        .value
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-semibold disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kategori{' '}
                  {type ===
                  'pemasukan'
                    ? 'Alokasi Dana'
                    : 'Biaya Operasional'}{' '}
                  *
                </label>

                <select
                  value={
                    category
                  }
                  disabled={
                    isSubmitting
                  }
                  onChange={(
                    event
                  ) =>
                    setCategory(
                      event.target
                        .value
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-bold bg-white text-slate-900 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  {type ===
                  'pemasukan'
                    ? (
                      <>
                        <option value="Konsumsi">
                          Pemenuhan Konsumsi & Gizi Harian
                        </option>

                        <option value="SPP/Pendidikan">
                          Beasiswa SPP & Seragam Sekolah
                        </option>

                        <option value="Operasional">
                          Operasional & Fasilitas Asrama
                        </option>

                        <option value="Donasi Rutin">
                          Donasi Rutin Operasional Anak
                        </option>

                        <option value="Infak/Zakat">
                          Infak / Zakat Maal
                        </option>

                        <option value="Bantuan Pemerintah/APBD">
                          Bantuan Pemerintah / APBD
                        </option>

                        <option value="Lainnya">
                          Lainnya / Sedekah Umum
                        </option>
                      </>
                    )
                    : (
                      <>
                        <option value="Konsumsi">
                          Konsumsi & Dapur Anak
                        </option>

                        <option value="SPP/Pendidikan">
                          SPP & Seragam Sekolah
                        </option>

                        <option value="Operasional">
                          Operasional & Listrik/Air/Wi-Fi
                        </option>

                        <option value="Kesehatan">
                          Kesehatan & Obat-Obatan
                        </option>

                        <option value="Lainnya">
                          Lainnya / Biaya Insidental
                        </option>
                      </>
                    )}
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">

              {/* Amount */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nominal{' '}
                  {type ===
                  'pemasukan'
                    ? 'Pemasukan'
                    : 'Pengeluaran'}{' '}
                  (Rp) *
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {presetAmounts.map(
                    (
                      preset
                    ) => (
                      <button
                        key={
                          preset
                        }
                        type="button"
                        disabled={
                          isSubmitting
                        }
                        onClick={() =>
                          setAmount(
                            preset
                          )
                        }
                        className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all border text-center disabled:opacity-50 disabled:cursor-not-allowed ${
                          Number(
                            amount
                          ) ===
                          preset
                            ? (
                                type ===
                                'pemasukan'
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                  : 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              )
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Rp{' '}
                        {preset
                          .toLocaleString(
                            'id-ID'
                          )}
                      </button>
                    )
                  )}
                </div>

                <div className="relative pt-1">
                  <span className="absolute left-4 top-3.5 font-black text-slate-400 text-sm">
                    Rp
                  </span>

                  <input
                    type="number"
                    required
                    min="1000"
                    disabled={
                      isSubmitting
                    }
                    value={
                      amount
                    }
                    onChange={(
                      event
                    ) =>
                      setAmount(
                        event.target
                          .value
                      )
                    }
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-base font-black text-slate-900 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Date + Phone */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tanggal Transaksi *
                  </label>

                  <input
                    type="date"
                    required
                    max={
                      getToday()
                    }
                    disabled={
                      isSubmitting
                    }
                    value={
                      date
                    }
                    onChange={(
                      event
                    ) =>
                      setDate(
                        event.target
                          .value
                      )
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    No. HP / WhatsApp (Opsional)
                  </label>

                  <input
                    type="text"
                    disabled={
                      isSubmitting
                    }
                    placeholder="cth: 0812XXXXXXXX"
                    value={
                      phone
                    }
                    onChange={(
                      event
                    ) =>
                      setPhone(
                        event.target
                          .value
                      )
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {type ===
                'pemasukan'
                  ? 'Rincian Keterangan (Opsional)'
                  : 'Rincian Keterangan Pengeluaran *'}
              </label>

              <textarea
                rows="3"
                required={
                  type ===
                  'pengeluaran'
                }
                disabled={
                  isSubmitting
                }
                placeholder={
                  type ===
                  'pemasukan'
                    ? 'Tuliskan catatan transaksi bila diperlukan...'
                    : 'Pembelian beras 50kg, minyak goreng 10L, dan telur 5 karpet...'
                }
                value={
                  description
                }
                onChange={(
                  event
                ) =>
                  setDescription(
                    event.target
                      .value
                  )
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-medium leading-relaxed resize-y disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Section 2 */}
          {type ===
            'pemasukan' && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">
                  2
                </span>

                <span>
                  Metode Penerimaan Kas
                </span>
              </h3>

              <p className="text-[11px] text-slate-500">
                Pilihan ini hanya mencatat metode penerimaan pada buku kas. Tidak membuat sesi pembayaran Midtrans.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                {/* Cash */}
                <button
                  type="button"
                  disabled={
                    isSubmitting
                  }
                  onClick={() =>
                    setPaymentMethod(
                      'cash'
                    )
                  }
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between disabled:opacity-50 disabled:cursor-not-allowed ${
                    paymentMethod ===
                    'cash'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">
                      Tunai
                    </span>

                    <LucideIcon
                      name="banknote"
                      className="w-6 h-6 text-emerald-600"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 font-medium">
                    Penerimaan kas secara langsung.
                  </p>
                </button>

                {/* QRIS */}
                <button
                  type="button"
                  disabled={
                    isSubmitting
                  }
                  onClick={() =>
                    setPaymentMethod(
                      'qris'
                    )
                  }
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between disabled:opacity-50 disabled:cursor-not-allowed ${
                    paymentMethod ===
                    'qris'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">
                      QRIS
                    </span>

                    <LucideIcon
                      name="qr-code"
                      className="w-6 h-6 text-emerald-600"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 font-medium">
                    Transaksi telah diterima melalui QRIS.
                  </p>
                </button>

                {/* Bank */}
                <button
                  type="button"
                  disabled={
                    isSubmitting
                  }
                  onClick={() =>
                    setPaymentMethod(
                      'bank'
                    )
                  }
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between disabled:opacity-50 disabled:cursor-not-allowed ${
                    paymentMethod ===
                    'bank'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">
                      Transfer Bank
                    </span>

                    <LucideIcon
                      name="building-2"
                      className="w-6 h-6 text-emerald-600"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 font-medium">
                    Transaksi telah diterima melalui rekening bank.
                  </p>
                </button>
              </div>

              {/* QRIS Information */}
              {paymentMethod ===
                'qris' && (
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-start gap-3 animate-fade-in">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <LucideIcon
                      name="qr-code"
                      className="w-5 h-5"
                    />
                  </div>

                  <div>
                    <div className="font-bold text-xs text-emerald-900">
                      Metode QRIS
                    </div>

                    <p className="text-[11px] text-emerald-700 mt-1">
                      Sistem hanya mencatat bahwa transaksi manual ini diterima melalui QRIS. Tidak ada QR pembayaran baru yang diterbitkan dari form buku kas.
                    </p>
                  </div>
                </div>
              )}

              {/* Bank Information */}
              {paymentMethod ===
                'bank' && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 animate-fade-in text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-600">
                      Pilih rekening:
                    </span>

                    {Object
                      .keys(
                        banks
                      )
                      .map(
                        (
                          bankKey
                        ) => (
                          <button
                            key={
                              bankKey
                            }
                            type="button"
                            disabled={
                              isSubmitting
                            }
                            onClick={() =>
                              setSelectedBank(
                                bankKey
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border disabled:opacity-50 disabled:cursor-not-allowed ${
                              selectedBank ===
                              bankKey
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-700 border-slate-300'
                            }`}
                          >
                            {
                              bankKey
                            }
                          </button>
                        )
                      )}
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900">
                        {
                          banks[
                            selectedBank
                          ].name
                        }
                      </div>

                      <div className="font-mono font-black text-sm text-slate-800">
                        {
                          banks[
                            selectedBank
                          ].no
                        }
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={
                        isSubmitting
                      }
                      onClick={() =>
                        handleCopyAccount(
                          banks[
                            selectedBank
                          ].no
                        )
                      }
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {copiedBank
                        ? 'Tersalin!'
                        : 'Salin No. Rek'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Backend / validation error */}
          {submitError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 flex items-start gap-3">
              <LucideIcon
                name="circle-alert"
                className="w-4 h-4 text-rose-600 mt-0.5 shrink-0"
              />

              <div>
                <div className="text-xs font-bold text-rose-800">
                  Transaksi belum tersimpan
                </div>

                <div className="text-xs text-rose-700 mt-1">
                  {
                    submitError
                  }
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={
                handleClose
              }
              disabled={
                isSubmitting
              }
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className={`px-6 py-2.5 text-white rounded-xl text-xs font-black shadow-md flex items-center space-x-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                type ===
                'pemasukan'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <LucideIcon
                name={
                  isSubmitting
                    ? 'loader-circle'
                    : 'check-circle-2'
                }
                className={`w-4 h-4 ${
                  isSubmitting
                    ? 'animate-spin'
                    : ''
                }`}
              />

              <span>
                {isSubmitting
                  ? (
                      editingTrx
                        ? 'Menyimpan Perubahan...'
                        : 'Menyimpan Transaksi...'
                    )
                  : (
                      editingTrx
                        ? 'Simpan Perubahan Transaksi'
                        : 'Simpan Transaksi'
                    )}
              </span>
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
  trxToDelete,
}) => {
  const [
    isDeleting,
    setIsDeleting,
  ] = React.useState(false);

  const [
    deleteError,
    setDeleteError,
  ] = React.useState(null);

  React.useEffect(
    () => {
      if (!isOpen) {
        return;
      }

      setIsDeleting(
        false
      );

      setDeleteError(
        null
      );
    },
    [
      isOpen,
      trxToDelete,
    ]
  );

  if (
    !isOpen ||
    !trxToDelete
  ) {
    return null;
  }

  const handleClose = () => {
    if (
      isDeleting
    ) {
      return;
    }

    setDeleteError(
      null
    );

    onClose();
  };

  const handleConfirm =
    async () => {
      if (
        isDeleting
      ) {
        return;
      }

      setDeleteError(
        null
      );

      try {
        setIsDeleting(
          true
        );

        const result =
          await Promise.resolve(
            onConfirm(
              trxToDelete.id
            )
          );

        /*
         * Delete modal juga hanya
         * ditutup jika backend sukses.
         */
        if (
          result?.success !==
          true
        ) {
          setDeleteError(
            result
              ?.error
              ?.message ||
            result
              ?.message ||
            'Transaksi gagal dihapus.'
          );

          return;
        }

        onClose();
      } catch (
        error
      ) {
        console.error(
          'Transaction delete failed:',
          error
        );

        setDeleteError(
          error?.message ||
          'Transaksi gagal dihapus.'
        );
      } finally {
        setIsDeleting(
          false
        );
      }
    };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in no-print">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">

        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <LucideIcon
            name="alert-triangle"
            className="w-7 h-7"
          />
        </div>

        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Konfirmasi Hapus Transaksi
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Apakah Anda yakin ingin menghapus transaksi{' '}
            <span className="font-bold text-slate-800">
              {
                trxToDelete.id
              }
            </span>{' '}
            (Rp{' '}
            {Number(
              trxToDelete
                .amount ||
              0
            ).toLocaleString(
              'id-ID'
            )}
            )?
          </p>

          <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-left">
            Transaksi akan dihapus dari daftar aktif buku kas. Backend menggunakan soft delete sehingga record tidak dihapus secara fisik dari database.
          </div>
        </div>

        {deleteError && (
          <div className="text-left rounded-xl border border-rose-200 bg-rose-50 p-3">
            <div className="text-xs font-bold text-rose-800">
              Penghapusan gagal
            </div>

            <div className="text-xs text-rose-700 mt-1">
              {
                deleteError
              }
            </div>
          </div>
        )}

        <div className="flex items-center justify-center space-x-2 pt-2">
          <button
            type="button"
            onClick={
              handleClose
            }
            disabled={
              isDeleting
            }
            className="w-1/2 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={
              handleConfirm
            }
            disabled={
              isDeleting
            }
            className="w-1/2 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <LucideIcon
              name={
                isDeleting
                  ? 'loader-circle'
                  : 'trash-2'
              }
              className={`w-4 h-4 ${
                isDeleting
                  ? 'animate-spin'
                  : ''
              }`}
            />

            <span>
              {isDeleting
                ? 'Menghapus...'
                : 'Ya, Hapus Data'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};


window.AddEditTrxModal =
  AddEditTrxModal;

window.ConfirmDeleteModal =
  ConfirmDeleteModal;