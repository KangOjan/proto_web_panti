// Digitally Signed Official Receipt / Expense Voucher Modal
// Step 30C: Strict isolated single-page print layout

const DigitalReceiptModal = ({
  isOpen,
  onClose,
  receiptData,
}) => {
  /*
   * Remove print mode after browser
   * print dialog is closed/cancelled.
   */
  React.useEffect(
    () => {
      const cleanupPrintMode =
        () => {
          document.body
            .classList
            .remove(
              'receipt-printing'
            );
        };

      window.addEventListener(
        'afterprint',
        cleanupPrintMode
      );

      return () => {
        window.removeEventListener(
          'afterprint',
          cleanupPrintMode
        );

        cleanupPrintMode();
      };
    },
    []
  );

  if (
    !isOpen ||
    !receiptData
  ) {
    return null;
  }

  const isIncome =
    receiptData.type !==
    'pengeluaran';

  const displayPartyName =
    receiptData.donorName ||
    receiptData.partyName ||
    receiptData.description ||
    'Hamba Allah / Umum';

  const displayOfficer =
    receiptData.createdBy ||
    'Budi Santoso, S.E.';

  const numericAmount =
    Number(
      receiptData.amount ||
      0
    );

  /*
   * Indonesian number-to-words helper.
   *
   * Important:
   * recursive zero remainder returns
   * empty string, not "Nol Rupiah".
   */
  const numberToWords = (
    number
  ) => {
    const value =
      Math.floor(
        Number(number)
      );

    if (
      !Number.isFinite(
        value
      ) ||
      value === 0
    ) {
      return '';
    }

    const words = [
      '',
      'Satu',
      'Dua',
      'Tiga',
      'Empat',
      'Lima',
      'Enam',
      'Tujuh',
      'Delapan',
      'Sembilan',
      'Sepuluh',
      'Sebelas',
    ];

    if (
      value <
      12
    ) {
      return words[value];
    }

    if (
      value <
      20
    ) {
      return `${numberToWords(
        value - 10
      )} Belas`;
    }

    if (
      value <
      100
    ) {
      const tens =
        numberToWords(
          Math.floor(
            value / 10
          )
        );

      const remainder =
        numberToWords(
          value % 10
        );

      return `${tens} Puluh${
        remainder
          ? ` ${remainder}`
          : ''
      }`;
    }

    if (
      value <
      200
    ) {
      const remainder =
        numberToWords(
          value - 100
        );

      return `Seratus${
        remainder
          ? ` ${remainder}`
          : ''
      }`;
    }

    if (
      value <
      1000
    ) {
      const hundreds =
        numberToWords(
          Math.floor(
            value / 100
          )
        );

      const remainder =
        numberToWords(
          value % 100
        );

      return `${hundreds} Ratus${
        remainder
          ? ` ${remainder}`
          : ''
      }`;
    }

    if (
      value <
      2000
    ) {
      const remainder =
        numberToWords(
          value - 1000
        );

      return `Seribu${
        remainder
          ? ` ${remainder}`
          : ''
      }`;
    }

    if (
      value <
      1000000
    ) {
      const thousands =
        numberToWords(
          Math.floor(
            value / 1000
          )
        );

      const remainder =
        numberToWords(
          value % 1000
        );

      return `${thousands} Ribu${
        remainder
          ? ` ${remainder}`
          : ''
      }`;
    }

    if (
      value <
      1000000000
    ) {
      const millions =
        numberToWords(
          Math.floor(
            value / 1000000
          )
        );

      const remainder =
        numberToWords(
          value %
            1000000
        );

      return `${millions} Juta${
        remainder
          ? ` ${remainder}`
          : ''
      }`;
    }

    if (
      value <
      1000000000000
    ) {
      const billions =
        numberToWords(
          Math.floor(
            value /
              1000000000
          )
        );

      const remainder =
        numberToWords(
          value %
            1000000000
        );

      return `${billions} Miliar${
        remainder
          ? ` ${remainder}`
          : ''
      }`;
    }

    return value
      .toLocaleString(
        'id-ID'
      );
  };

  const amountInWords =
    numericAmount === 0
      ? 'Nol Rupiah'
      : `${numberToWords(
          numericAmount
        )} Rupiah`;

  const handleClose = () => {
    document.body
      .classList
      .remove(
        'receipt-printing'
      );

    onClose();
  };

  const handlePrintReceipt =
    () => {
      document.body
        .classList
        .add(
          'receipt-printing'
        );

      /*
       * Give browser one render frame
       * to apply print isolation rules.
       */
      window.requestAnimationFrame(
        () => {
          window.print();
        }
      );
    };

  const modalContent = (
    <>
      <style>
        {`
          @media print {
            @page {
              size: A4 portrait;
              margin: 12mm;
            }

            html,
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
            }

            /*
             * Receipt is rendered through
             * a portal directly under body.
             *
             * The normal application root
             * is therefore completely removed
             * from print layout.
             */
            body.receipt-printing #root {
              display: none !important;
            }

            body.receipt-printing {
              overflow: visible !important;
            }

            body.receipt-printing
              .receipt-print-layer {
              position: static !important;
              inset: auto !important;

              display: block !important;

              width: 100% !important;
              height: auto !important;
              min-height: 0 !important;

              margin: 0 !important;
              padding: 0 !important;

              overflow: visible !important;

              background: #ffffff !important;
              backdrop-filter: none !important;
            }

            body.receipt-printing
              .receipt-print-card {
              position: static !important;

              width: 100% !important;
              max-width: none !important;

              height: auto !important;
              max-height: none !important;

              margin: 0 !important;
              padding: 0 !important;

              overflow: visible !important;

              border: 0 !important;
              border-radius: 0 !important;

              box-shadow: none !important;
            }

            body.receipt-printing
              .receipt-printable {
              width: 100% !important;
              max-width: none !important;

              margin: 0 !important;
              padding: 0 !important;

              break-inside: avoid !important;
              page-break-inside: avoid !important;

              break-after: avoid-page !important;
              page-break-after: avoid !important;

              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            body.receipt-printing
              .no-print {
              display: none !important;
            }

            body.receipt-printing
              .receipt-printable * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}
      </style>

      <div className="receipt-print-layer fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
        <div className="receipt-print-card bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">

          {/* Close */}
          <button
            type="button"
            onClick={
              handleClose
            }
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all no-print"
            title="Tutup Modal"
          >
            <LucideIcon
              name="x"
              className="w-5 h-5"
            />
          </button>

          {/* Printable Document */}
          <div className="receipt-printable space-y-4">

            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-3 text-center">
              <div className="flex items-center justify-between text-left mb-1.5">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold ${
                      isIncome
                        ? 'bg-emerald-600'
                        : 'bg-rose-600'
                    }`}
                  >
                    <LucideIcon
                      name={
                        isIncome
                          ? 'arrow-down-left'
                          : 'arrow-up-right'
                      }
                      className="w-4 h-4"
                    />
                  </div>

                  <div>
                    <h3 className="font-black text-xs text-slate-900 leading-tight">
                      YAYASAN PANTI ASUHAN KASIH BUNDA
                    </h3>

                    <p className="text-[9px] text-slate-500 font-medium">
                      Izin Kemenkumham RI AHU-0019283.AH.01.04
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                      isIncome
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : 'text-rose-700 bg-rose-50 border-rose-200'
                    }`}
                  >
                    {isIncome
                      ? 'KAS MASUK'
                      : 'KAS KELUAR'}
                  </div>

                  <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                    {receiptData
                      .receiptNo ||
                      receiptData.id ||
                      '-'}
                  </div>
                </div>
              </div>

              <h2 className="text-base font-black text-slate-900 tracking-wider uppercase pt-1">
                {isIncome
                  ? 'KUITANSI BUKTI PENERIMAAN KAS'
                  : 'VOUCHER BUKTI PENGELUARAN KAS'}
              </h2>
            </div>

            {/* Detail */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5 text-xs">

              <div className="grid grid-cols-3 border-b border-slate-200 pb-1.5">
                <span className="font-bold text-slate-500">
                  Tanggal Transaksi
                </span>

                <span className="col-span-2 font-bold text-slate-900">
                  {receiptData.date
                    ? String(
                        receiptData.date
                      ).substring(
                        0,
                        10
                      )
                    : new Date()
                        .toISOString()
                        .substring(
                          0,
                          10
                        )}
                </span>
              </div>

              <div className="grid grid-cols-3 border-b border-slate-200 pb-1.5">
                <span className="font-bold text-slate-500">
                  {isIncome
                    ? 'Telah Diterima Dari'
                    : 'Dibayarkan Kepada'}
                </span>

                <span className="col-span-2 font-black text-slate-900 text-xs">
                  {
                    displayPartyName
                  }
                </span>
              </div>

              <div className="grid grid-cols-3 border-b border-slate-200 pb-1.5">
                <span className="font-bold text-slate-500">
                  Jumlah Uang
                </span>

                <span
                  className={`col-span-2 font-black text-sm ${
                    isIncome
                      ? 'text-emerald-800'
                      : 'text-rose-800'
                  }`}
                >
                  Rp{' '}
                  {numericAmount
                    .toLocaleString(
                      'id-ID'
                    )}
                </span>
              </div>

              <div className="grid grid-cols-3 border-b border-slate-200 pb-1.5">
                <span className="font-bold text-slate-500">
                  Terbilang
                </span>

                <span className="col-span-2 font-extrabold text-slate-800 italic bg-white p-1.5 rounded-lg border border-slate-200">
                  #{' '}
                  {
                    amountInWords
                  }{' '}
                  #
                </span>
              </div>

              <div className="grid grid-cols-3 border-b border-slate-200 pb-1.5">
                <span className="font-bold text-slate-500">
                  Kategori Transaksi
                </span>

                <span className="col-span-2 font-semibold text-slate-800">
                  {receiptData.category ||
                    '-'}
                </span>
              </div>

              <div className="grid grid-cols-3">
                <span className="font-bold text-slate-500">
                  Rincian Keterangan
                </span>

                <span className="col-span-2 font-medium text-slate-700 leading-normal">
                  {receiptData.description ||
                    receiptData.paymentMethod ||
                    '-'}
                </span>
              </div>

            </div>

            {/* Signatures */}
            <div className="pt-4 grid grid-cols-2 gap-8 items-center text-center text-[11px]">

              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-medium">
                  {isIncome
                    ? 'Penerima Kas,'
                    : 'Pembuat Voucher,'}
                </p>

                <div className="h-10 flex items-end justify-center">
                  <span className="text-[9px] text-emerald-600 font-bold italic border-b border-emerald-300 px-2 py-0.5">
                    ✓ Signed Digital
                  </span>
                </div>

                <p className="font-bold text-slate-900 text-xs underline pt-1">
                  {
                    displayOfficer
                  }
                </p>

                <p className="text-[9px] text-slate-400 font-mono">
                  Pengurus Harian
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-medium">
                  Mengetahui,
                </p>

                <div className="h-10 flex items-end justify-center">
                  <span className="text-[9px] text-indigo-600 font-bold italic border-b border-indigo-300 px-2 py-0.5">
                    ✓ Signed Digital
                  </span>
                </div>

                <p className="font-bold text-slate-900 text-xs underline pt-1">
                  H. Ahmad Dahlan, M.Ag.
                </p>

                <p className="text-[9px] text-slate-400 font-mono">
                  Pemimpin Lembaga
                </p>
              </div>

            </div>

            <div className="text-[9px] text-slate-400 text-center border-t border-slate-200 pt-2 font-mono">
              Dokumen ini diterbitkan oleh SIMK-Panti.
            </div>

          </div>

          {/* Screen-only actions */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between no-print">
            <button
              type="button"
              onClick={
                handleClose
              }
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={
                handlePrintReceipt
              }
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-2 transition-all"
            >
              <LucideIcon
                name="printer"
                className="w-4 h-4 text-emerald-400"
              />

              <span>
                Cetak Kuitansi (1 Lembar PDF)
              </span>
            </button>
          </div>

        </div>
      </div>
    </>
  );

  /*
   * Portal is important.
   *
   * Receipt becomes a direct child
   * of body instead of remaining
   * inside the normal application
   * tree.
   */
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

window.DigitalReceiptModal =
  DigitalReceiptModal;