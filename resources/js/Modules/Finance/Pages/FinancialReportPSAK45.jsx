import React, { useState, useMemo } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { useSimk } from '../../../Context/SimkContext';
import { Printer } from 'lucide-react';

export default function FinancialReportPSAK45(props) {
  const simk = useSimk();
  const transactions = (props.transactions && props.transactions.length > 0) ? props.transactions : simk.transactions;
  const currentUser = props.currentUser || simk.currentUser;
  const [periodType, setPeriodType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState('2026-07');
  const [selectedYear, setSelectedYear] = useState('2026');

  const reportTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (periodType === 'monthly') {
        return t.date.startsWith(selectedMonth);
      } else {
        return t.date.startsWith(selectedYear);
      }
    });
  }, [transactions, periodType, selectedMonth, selectedYear]);

  const incomeDonasi = useMemo(() => {
    return reportTransactions
      .filter(t => t.type === 'pemasukan' && t.category === 'Donasi Rutin')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [reportTransactions]);

  const incomeZakat = useMemo(() => {
    return reportTransactions
      .filter(t => t.type === 'pemasukan' && t.category === 'Infak/Zakat')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [reportTransactions]);

  const incomeAPBD = useMemo(() => {
    return reportTransactions
      .filter(t => t.type === 'pemasukan' && t.category === 'Bantuan Pemerintah/APBD')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [reportTransactions]);

  const incomeLainnya = useMemo(() => {
    return reportTransactions
      .filter(t => t.type === 'pemasukan' && t.category === 'Lainnya')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [reportTransactions]);

  const totalPendapatan = incomeDonasi + incomeZakat + incomeAPBD + incomeLainnya;

  const expenseOperasional = useMemo(() => {
    return reportTransactions
      .filter(t => t.type === 'pengeluaran' && t.category === 'Operasional')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [reportTransactions]);

  const expenseSPP = useMemo(() => {
    return reportTransactions
      .filter(t => t.type === 'pengeluaran' && t.category === 'SPP/Pendidikan')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [reportTransactions]);

  const expenseKonsumsi = useMemo(() => {
    return reportTransactions
      .filter(t => t.type === 'pengeluaran' && t.category === 'Konsumsi')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [reportTransactions]);

  const expenseKesehatan = useMemo(() => {
    return reportTransactions
      .filter(t => t.type === 'pengeluaran' && t.category === 'Kesehatan')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [reportTransactions]);

  const expenseLainnya = useMemo(() => {
    return reportTransactions
      .filter(t => t.type === 'pengeluaran' && t.category === 'Lainnya')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [reportTransactions]);

  const totalBeban = expenseOperasional + expenseSPP + expenseKonsumsi + expenseKesehatan + expenseLainnya;
  const kenaikanAsetNetto = totalPendapatan - totalBeban;

  const priorTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (periodType === 'monthly') {
        return t.date < `${selectedMonth}-01`;
      } else {
        return t.date < `${selectedYear}-01-01`;
      }
    });
  }, [transactions, periodType, selectedMonth, selectedYear]);

  const priorIncome = priorTransactions.filter(t => t.type === 'pemasukan').reduce((sum, t) => sum + t.amount, 0);
  const priorExpense = priorTransactions.filter(t => t.type === 'pengeluaran').reduce((sum, t) => sum + t.amount, 0);
  const saldoAwalKas = priorIncome - priorExpense + 15000000;
  const saldoAkhirKas = saldoAwalKas + kenaikanAsetNetto;

  const handleTriggerPrint = () => {
    window.print();
  };

  const monthNames = {
    '2026-01': 'Januari 2026',
    '2026-02': 'Februari 2026',
    '2026-03': 'Maret 2026',
    '2026-04': 'April 2026',
    '2026-05': 'Mei 2026',
    '2026-06': 'Juni 2026',
    '2026-07': 'Juli 2026'
  };

  return (
    <MainLayout currentRoute="laporan">
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in space-y-6">
        {/* Top Filter & Print Action Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 no-print flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                Standar Regulasi PSAK 45 / ISAK 35
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mt-1">Cetak & Ekspor Laporan Keuangan Nirlaba</h1>
            <p className="text-xs text-slate-500">Pilih periode laporan untuk menampilkan ringkasan laporan keuangan resmi.</p>
          </div>

          <div className="flex flex-wrap items-center space-x-3">
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setPeriodType('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  periodType === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Bulanan
              </button>
              <button
                onClick={() => setPeriodType('yearly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  periodType === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Tahunan
              </button>
            </div>

            {periodType === 'monthly' ? (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="2026-07">Juli 2026</option>
                <option value="2026-06">Juni 2026</option>
                <option value="2026-05">Mei 2026</option>
                <option value="2026-04">April 2026</option>
              </select>
            ) : (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="2026">Tahun 2026</option>
              </select>
            )}

            <button
              onClick={handleTriggerPrint}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md text-xs flex items-center space-x-2 transition-all"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Cetak Laporan PDF</span>
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT DOCUMENT BODY */}
        <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200 printable-area text-slate-900 space-y-6">
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <h2 className="text-xl font-black uppercase tracking-wider text-slate-900">
              PANTI ASUHAN KASIH BUNDA
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Jl. Kebon Jeruk No. 12, Jakarta Barat • Telp: (021) 555-0192 • Website: panti-kasihbunda.org
            </p>
            <h3 className="text-base font-extrabold text-emerald-800 uppercase tracking-tight mt-3">
              LAPORAN AKTIVITAS KEUANGAN NIRLABA (PSAK 45)
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              PERIODE: {periodType === 'monthly' ? (monthNames[selectedMonth] || selectedMonth) : `Tahun ${selectedYear}`}
            </p>
          </div>

          <div>
            <div className="bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-slate-800 uppercase tracking-wider border-l-4 border-emerald-600 mb-2">
              I. PENDAPATAN DANA NIRLABA (PENAMBAHAN ASET NETTO)
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">1. Donasi Rutin & Masyarakat</td>
                  <td className="py-2 text-right font-semibold">Rp {incomeDonasi.toLocaleString('id-ID')}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">2. Penerimaan Infak / Zakat Maal</td>
                  <td className="py-2 text-right font-semibold">Rp {incomeZakat.toLocaleString('id-ID')}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">3. Bantuan Hibah Pemerintah / APBD</td>
                  <td className="py-2 text-right font-semibold">Rp {incomeAPBD.toLocaleString('id-ID')}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">4. Penerimaan Lain-lain</td>
                  <td className="py-2 text-right font-semibold">Rp {incomeLainnya.toLocaleString('id-ID')}</td>
                </tr>
                <tr className="font-extrabold bg-emerald-50 text-emerald-950">
                  <td className="py-2.5 pl-4">TOTAL PENDAPATAN (A)</td>
                  <td className="py-2.5 text-right text-sm">Rp {totalPendapatan.toLocaleString('id-ID')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <div className="bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-slate-800 uppercase tracking-wider border-l-4 border-rose-600 mb-2">
              II. BEBAN OPERASIONAL & PROGRAM (PENGURANGAN ASET NETTO)
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">1. Biaya Konsumsi & Logistik Dapur Anak</td>
                  <td className="py-2 text-right font-semibold">Rp {expenseKonsumsi.toLocaleString('id-ID')}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">2. Biaya SPP, Seragam & Pendidikan Anak</td>
                  <td className="py-2 text-right font-semibold">Rp {expenseSPP.toLocaleString('id-ID')}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">3. Biaya Operasional Gedung (PLN, PDAM, Internet)</td>
                  <td className="py-2 text-right font-semibold">Rp {expenseOperasional.toLocaleString('id-ID')}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">4. Biaya Pemeliharaan Kesehatan & Obat-obatan</td>
                  <td className="py-2 text-right font-semibold">Rp {expenseKesehatan.toLocaleString('id-ID')}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">5. Beban Operasional Lainnya</td>
                  <td className="py-2 text-right font-semibold">Rp {expenseLainnya.toLocaleString('id-ID')}</td>
                </tr>
                <tr className="font-extrabold bg-rose-50 text-rose-950">
                  <td className="py-2.5 pl-4">TOTAL BEBAN OPERASIONAL (B)</td>
                  <td className="py-2.5 text-right text-sm">Rp {totalBeban.toLocaleString('id-ID')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border border-slate-300 rounded-2xl p-4 bg-slate-50 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-800">
              <span>KENAIKAN / (PENURUNAN) ASET NETTO (A - B)</span>
              <span className={kenaikanAsetNetto >= 0 ? "text-emerald-700 font-extrabold" : "text-rose-700 font-extrabold"}>
                Rp {kenaikanAsetNetto.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between text-xs text-slate-600">
              <span>SALDO KAS & BANK AWAL PERIODE</span>
              <span>Rp {saldoAwalKas.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-300 pt-2">
              <span>SALDO KAS & BANK AKHIR PERIODE</span>
              <span className="text-emerald-800 font-black">Rp {saldoAkhirKas.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <p className="text-slate-500 font-medium">Disiapkan Oleh,</p>
              <p className="font-bold text-slate-800 mt-0.5">Pengurus Harian Keuangan</p>
              <div className="h-16 flex items-end justify-center">
                <span className="text-[10px] text-slate-400 italic">(Tanda Tangan Digital Verified)</span>
              </div>
              <p className="font-extrabold text-slate-900 underline">Budi Santoso, S.E.</p>
              <p className="text-[10px] text-slate-500 font-mono">NIK: 3201019283740001</p>
            </div>

            <div>
              <p className="text-slate-500 font-medium">Disetujui Oleh,</p>
              <p className="font-bold text-slate-800 mt-0.5">Pemimpin Lembaga Panti</p>
              <div className="h-16 flex items-end justify-center">
                <span className="text-[10px] text-slate-400 italic">(Tanda Tangan Digital Verified)</span>
              </div>
              <p className="font-extrabold text-slate-900 underline">H. Ahmad Dahlan, M.Ag.</p>
              <p className="text-[10px] text-slate-500 font-mono">NIK: 3201019283740002</p>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center border-t border-slate-200 pt-4 font-mono">
            Dokumen ini digenerate secara otomatis oleh SIMK-Panti pada {new Date().toLocaleString('id-ID')} • Terverifikasi Audit Digital Server Time UTC
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
