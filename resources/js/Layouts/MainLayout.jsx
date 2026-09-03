import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import DigitalReceiptModal from '../Components/Modals/DigitalReceiptModal';
import AddEditTrxModal from '../Components/Modals/AddEditTrxModal';
import ConfirmDeleteModal from '../Components/Modals/ConfirmDeleteModal';
import { useSimk } from '../Context/SimkContext';
import { AlertCircle, CheckCircle2, Menu, Building2, Globe, UserCheck, ShieldCheck } from 'lucide-react';

export default function MainLayout({ children, currentRoute }) {
  const {
    users,
    campaigns,
    donations,
    childrenProfiles,
    articles,
    faqs,
    orphanageProfile,
    organizationStructure,
    transactions,
    auditLogs,
    currentUser,
    toast,
    showToast,
    isAddTrxModalOpen,
    setIsAddTrxModalOpen,
    editingTrx,
    setEditingTrx,
    trxToDelete,
    setTrxToDelete,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    receiptData,
    setReceiptData,
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    handleLogin,
    handleLogout,
    handleRegisterSubmit,
    handleApproveUser,
    handleRejectUser,
    handleApproveDonation,
    handleRejectDonation,
    handleAddOnlineDonationSubmit,
    handleAddOfflineDonation,
    handleSaveCampaign,
    handleDeleteCampaign,
    handleAddCampaignUpdate,
    handleSaveProfile,
    handleSaveArticle,
    handleDeleteArticle,
    handleSaveFaq,
    handleDeleteFaq,
    handleSaveTransaction,
    handleDeleteTransaction,
    handlePrintTransactionReceipt,
    handleSwitchUserRole
  } = useSimk();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Evaluator Mode Toggle via .env (VITE_EVALUATOR_MODE=true|false)
  const isEvaluatorEnabled = import.meta.env.VITE_EVALUATOR_MODE !== 'false';

  const pendingApprovalCount = users.filter(u => u.status === 'Pending Approval').length;
  const pendingDonationsCount = donations.filter(d => d.type === 'online' && d.status === 'Pending').length;

  // Determine if Admin Layout (Sidebar) vs Public Layout (Navbar)
  const isAdminView = Boolean(
    currentUser ||
    (currentRoute && (currentRoute.startsWith('admin-') || currentRoute.startsWith('pengelola') || ['approval', 'audit', 'dashboard', 'transaksi', 'program', 'laporan'].includes(currentRoute)))
  );

  // Pass shared state to children
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        users,
        campaigns,
        donations,
        childrenProfiles,
        articles,
        faqs,
        orphanageProfile,
        organizationStructure,
        transactions,
        auditLogs,
        currentUser,
        onLoginSuccess: handleLogin,
        onRegisterSubmit: handleRegisterSubmit,
        onApproveUser: handleApproveUser,
        onRejectUser: handleRejectUser,
        onSubmitDonation: handleAddOnlineDonationSubmit,
        onApproveDonation: handleApproveDonation,
        onRejectDonation: handleRejectDonation,
        onAddOfflineDonation: handleAddOfflineDonation,
        onSaveCampaign: handleSaveCampaign,
        onDeleteCampaign: handleDeleteCampaign,
        onAddCampaignUpdate: handleAddCampaignUpdate,
        onSaveProfile: handleSaveProfile,
        onSaveArticle: handleSaveArticle,
        onDeleteArticle: handleDeleteArticle,
        onSaveFaq: handleSaveFaq,
        onDeleteFaq: handleDeleteFaq,
        onSaveTransaction: handleSaveTransaction,
        onOpenAddModal: () => {
          setEditingTrx(null);
          setIsAddTrxModalOpen(true);
        },
        onOpenEditModal: (trx) => {
          setEditingTrx(trx);
          setIsAddTrxModalOpen(true);
        },
        onConfirmDeleteTrx: (trx) => {
          setTrxToDelete(trx);
          setIsDeleteModalOpen(true);
        },
        onPrintTransactionReceipt: handlePrintTransactionReceipt,
        onOpenReceiptModal: handlePrintTransactionReceipt,
        onSwitchUserRole: handleSwitchUserRole,
        showToast
      });
    }
    return child;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      {/* Toast Alert Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in toast-alert">
          <div className={`px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center space-x-3 text-xs font-bold ${
            toast.type === 'rose'
              ? 'bg-rose-900 text-rose-100 border-rose-700'
              : toast.type === 'info'
              ? 'bg-slate-900 text-white border-slate-700'
              : 'bg-emerald-900 text-emerald-100 border-emerald-700'
          }`}>
            {toast.type === 'rose' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* GLOBAL TOP EVALUATOR BANNER */}
      {isEvaluatorEnabled && (
        <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 sticky top-0 z-50 no-print">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
              MODE EVALUATOR
            </span>
            <span className="hidden sm:inline text-slate-300">
              Simulasi Role Pengguna
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => handleSwitchUserRole(null)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                !currentUser
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Publik (Beranda)</span>
            </button>

            <button
              onClick={() => handleSwitchUserRole('Pengurus Harian')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                currentUser?.role === 'Pengurus Harian'
                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Pengurus Harian</span>
              {pendingDonationsCount > 0 && (
                <span className="ml-1 bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {pendingDonationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleSwitchUserRole('Pemimpin Lembaga')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                currentUser?.role === 'Pemimpin Lembaga'
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pemimpin Lembaga</span>
              {pendingApprovalCount > 0 && (
                <span className="ml-1 bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {pendingApprovalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* RENDER ADMIN SIDEBAR LAYOUT OR PUBLIC NAVBAR LAYOUT */}
      {isAdminView ? (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
          {/* Admin Sidebar */}
          <Sidebar
            currentUser={currentUser}
            currentRoute={currentRoute}
            onSwitchUserRole={handleSwitchUserRole}
            onLogout={handleLogout}
            pendingApprovalCount={pendingApprovalCount}
            pendingDonationsCount={pendingDonationsCount}
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            evaluatorMode={isEvaluatorEnabled}
          />

          {/* Admin Main Workspace Area */}
          <div className="flex-1 flex flex-col lg:ml-72 min-w-0">
            {/* Top Admin Mobile Header Bar */}
            <header className="lg:hidden sticky top-0 z-30 bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-sm no-print">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-200"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="font-extrabold text-sm flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>SIMK-Panti Admin</span>
                </div>
              </div>

              <div className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                {currentUser?.role || 'Pengelola'}
              </div>
            </header>

            <main className="flex-1 p-4 sm:p-6">
              {childrenWithProps}
            </main>
          </div>
        </div>
      ) : (
        <>
          {/* Public Top Navbar */}
          <Navbar
            currentUser={currentUser}
            currentRoute={currentRoute}
            onSwitchUserRole={handleSwitchUserRole}
            onLogout={handleLogout}
            pendingApprovalCount={pendingApprovalCount}
            pendingDonationsCount={pendingDonationsCount}
            evaluatorMode={false}
          />

          {/* Public Main Content */}
          <main className="flex-1">
            {childrenWithProps}
          </main>

          <Footer />
        </>
      )}

      {/* Global Interactive Modals */}
      <AddEditTrxModal
        isOpen={isAddTrxModalOpen}
        onClose={() => setIsAddTrxModalOpen(false)}
        onSubmitTransaction={handleSaveTransaction}
        editingTrx={editingTrx}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTransaction}
        trxToDelete={trxToDelete}
      />

      <DigitalReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        receiptData={receiptData}
      />
    </div>
  );
}
