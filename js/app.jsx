// Main React Application Component for SIMK-Panti
const App = () => {
  // Global Application State
  const [users, setUsers] = React.useState(window.INITIAL_SIMK_DATA.users);
  const [transactions, setTransactions] = React.useState(window.INITIAL_SIMK_DATA.transactions);
  const [auditLogs, setAuditLogs] = React.useState(window.INITIAL_SIMK_DATA.auditLogs);
  const [priorityPrograms, setPriorityPrograms] = React.useState(window.INITIAL_SIMK_DATA.priorityPrograms || []);

  // Active Logged-in User (Default: null for Guest / Public Beranda View)
  const [currentUser, setCurrentUser] = React.useState(null);
  
  // Navigation View State: 'beranda' | 'profil' | 'public-donation' | 'public-dashboard' | 'auth' | 'dashboard' | 'transactions' | 'programs' | 'approval' | 'audit' | 'report'
  const [activeTab, setActiveTab] = React.useState('beranda');
  const [authView, setAuthView] = React.useState('login');

  // Pre-selected Priority Category for Public Donation
  const [selectedDonationCategory, setSelectedDonationCategory] = React.useState('Konsumsi');

  // Modals & Toast State
  const [isAddTrxModalOpen, setIsAddTrxModalOpen] = React.useState(false);
  const [editingTrx, setEditingTrx] = React.useState(null);
  const [trxToDelete, setTrxToDelete] = React.useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  // Digital Receipt Modal State
  const [receiptData, setReceiptData] = React.useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = React.useState(false);

  const [toast, setToast] = React.useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  // Action: Add Audit Trail Record
  const logAudit = (action, details, executorName = null) => {
    const newLog = {
      id: `LOG-${Math.floor(Math.random() * 9000 + 1000)}`,
      timestamp: new Date().toISOString(),
      userName: executorName || (currentUser ? currentUser.fullName : 'Donatur Publik'),
      nik: currentUser ? currentUser.nik : '-',
      userRole: currentUser ? currentUser.role : 'Donatur Publik (User Umum)',
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Action 1: Simulasi Switch User di Header
  const handleSwitchUserRole = (targetRole) => {
    if (targetRole === 'Pengurus Harian') {
      const found = users.find(u => u.username === 'harian1') || users.find(u => u.role === 'Pengurus Harian' && u.status === 'Approved');
      setCurrentUser(found);
      setActiveTab('dashboard');
      showToast(`Mode Evaluator: Berpindah ke Pengurus Harian (${found.fullName})`, 'info');
    } else if (targetRole === 'Pemimpin Lembaga') {
      const found = users.find(u => u.username === 'pemimpin1') || users.find(u => u.role === 'Pemimpin Lembaga' && u.status === 'Approved');
      setCurrentUser(found);
      setActiveTab('dashboard');
      showToast(`Mode Evaluator: Berpindah ke Pemimpin Lembaga (${found.fullName})`, 'info');
    }
  };

  // Action 2: Login Authenticator
  const handleLogin = (username, password) => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
      return { success: false, message: 'Username tidak ditemukan dalam basis data terdaftar.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Password yang Anda masukkan salah.' };
    }

    // Check Account Approval Status
    if (user.status === 'Pending Approval') {
      return {
        success: false,
        message: `Akun Anda (@${user.username}) saat ini berstatus "Pending Approval". Anda belum bisa login sebelum disetujui oleh Pemimpin Lembaga.`
      };
    }

    if (user.status === 'Rejected') {
      return {
        success: false,
        message: `Pengajuan akun Anda telah ditolak oleh Pemimpin Lembaga.`
      };
    }

    // Successful Login
    setCurrentUser(user);
    setActiveTab('dashboard');
    logAudit('LOGIN', `Pengguna "${user.fullName}" berhasil masuk ke sistem.`);
    showToast(`Selamat datang kembali, ${user.fullName}!`, 'success');
    return { success: true, user };
  };

  // Action 3: Register New User
  const handleRegisterSubmit = (formData) => {
    const newUser = {
      id: `USR-${Math.floor(Math.random() * 900 + 100)}`,
      nik: formData.nik,
      fullName: formData.fullName,
      address: formData.address,
      phone: formData.phone,
      role: formData.role,
      username: formData.username,
      password: formData.password,
      status: 'Pending Approval',
      registrationDate: new Date().toISOString().substring(0, 10)
    };

    setUsers(prev => [newUser, ...prev]);
    logAudit('REGISTER', `Pendaftaran akun baru oleh ${formData.fullName} (NIK: ${formData.nik}, Peran: ${formData.role}). Status: Pending Approval.`, formData.fullName);
    showToast(`Pendaftaran berhasil! Akun Anda berstatus "Pending Approval" & menunggu persetujuan Pemimpin Lembaga.`, 'info');
  };

  // Action 4: Approve User (Pemimpin Lembaga)
  const handleApproveUser = (userId) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Approved' } : u));
    logAudit('APPROVE_USER', `Pemimpin Lembaga menyetujui akun ${targetUser.fullName} (NIK: ${targetUser.nik}, Username: @${targetUser.username}).`);
    showToast(`Akun ${targetUser.fullName} telah disetujui!`, 'success');
  };

  // Action 5: Reject User (Pemimpin Lembaga)
  const handleRejectUser = (userId) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Rejected' } : u));
    logAudit('REJECT_USER', `Pemimpin Lembaga menolak akun ${targetUser.fullName} (NIK: ${targetUser.nik}).`);
    showToast(`Akun ${targetUser.fullName} telah ditolak.`, 'rose');
  };

  // Action 6: Save / Update Internal Transaction (Pengurus Harian) & Auto Open Receipt Modal
  const handleSaveTransaction = (trxData) => {
    let targetTrxObj = null;

    if (trxData.id) {
      // Edit mode
      targetTrxObj = {
        ...trxData,
        createdBy: currentUser ? currentUser.fullName : 'Budi Santoso, S.E.'
      };
      setTransactions(prev => prev.map(t => t.id === trxData.id ? targetTrxObj : t));
      logAudit('UPDATE_TRANSACTION', `Mengubah transaksi ${trxData.id} (${trxData.type.toUpperCase()} Rp ${trxData.amount.toLocaleString('id-ID')}).`);
      showToast(`Transaksi ${trxData.id} berhasil diperbarui!`, 'success');
    } else {
      // Create mode
      const newId = `TRX-${new Date().toISOString().substring(0,7).replace('-','')}-${Math.floor(Math.random() * 899 + 100)}`;
      targetTrxObj = {
        id: newId,
        date: trxData.date,
        type: trxData.type,
        category: trxData.category,
        description: trxData.description,
        amount: Number(trxData.amount),
        createdBy: currentUser ? currentUser.fullName : 'Budi Santoso, S.E.',
        createdAt: new Date().toISOString()
      };
      setTransactions(prev => [targetTrxObj, ...prev]);
      logAudit('CREATE_TRANSACTION', `Mencatat transaksi baru ${newId}: ${trxData.type.toUpperCase()} Rp ${Number(trxData.amount).toLocaleString('id-ID')} (${trxData.category} - ${trxData.description}).`);
      showToast(`Transaksi ${newId} berhasil disimpan!`, 'success');
    }

    setIsAddTrxModalOpen(false);

    // OPEN DIGITAL RECEIPT MODAL AUTOMATICALY
    if (targetTrxObj) {
      const receiptObj = {
        receiptNo: targetTrxObj.id,
        type: targetTrxObj.type,
        donorName: targetTrxObj.description,
        description: targetTrxObj.description,
        amount: targetTrxObj.amount,
        category: targetTrxObj.category,
        paymentMethod: targetTrxObj.type === 'pemasukan' ? 'Kas Masuk Bendahara' : 'Kas Keluar Operasional',
        date: targetTrxObj.date,
        createdBy: targetTrxObj.createdBy
      };
      setReceiptData(receiptObj);
      setIsReceiptModalOpen(true);
    }
  };

  // Action 7: Handle Public Donation Submission (Donatur Publik)
  const handlePublicDonationSubmit = (donationData) => {
    const newTrxId = `TRX-DONASI-${Math.floor(Math.random() * 8999 + 1000)}`;
    const today = new Date().toISOString().substring(0, 10);

    const newTransaction = {
      id: newTrxId,
      date: today,
      type: 'pemasukan',
      category: donationData.category || 'Donasi Rutin',
      description: `Donasi Publik (${donationData.category}) oleh ${donationData.donorName} via ${donationData.method === 'qris' ? 'Scan QRIS' : 'Transfer Bank'}`,
      amount: Number(donationData.amount),
      createdBy: 'Donatur Publik (Sistem Otomatis)',
      createdAt: new Date().toISOString()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    logAudit('PUBLIC_DONATION', `Penerimaan Donasi Publik (${donationData.category}) sebesar Rp ${Number(donationData.amount).toLocaleString('id-ID')} dari "${donationData.donorName}" via ${donationData.paymentMethod}. Kode: ${newTrxId}`, donationData.donorName);

    // Also update collectedAmount in priorityPrograms if category matches
    setPriorityPrograms(prev => prev.map(p => {
      if (p.category === donationData.category) {
        return { ...p, collectedAmount: (p.collectedAmount || 0) + Number(donationData.amount) };
      }
      return p;
    }));

    // Prepare and show digitally signed receipt
    const receiptObj = {
      receiptNo: newTrxId,
      type: 'pemasukan',
      donorName: donationData.donorName,
      description: `Donasi Publik (${donationData.category}) via ${donationData.paymentMethod}`,
      amount: Number(donationData.amount),
      category: donationData.category || 'Donasi Rutin',
      paymentMethod: donationData.paymentMethod,
      date: today,
      createdBy: 'Sistem SIMK-Panti (Audit Verifikasi Digital)'
    };

    setReceiptData(receiptObj);
    setIsReceiptModalOpen(true);
    showToast(`Terima kasih ${donationData.donorName}! Donasi sebesar Rp ${Number(donationData.amount).toLocaleString('id-ID')} berhasil diverifikasi & dicatat!`, 'success');
  };

  // Action 8: Open Receipt / Voucher Modal for Any Row in Transaction Table
  const handlePrintTransactionReceipt = (trxObj) => {
    const receiptObj = {
      receiptNo: trxObj.id,
      type: trxObj.type,
      donorName: trxObj.donorName || trxObj.description,
      description: trxObj.description,
      amount: trxObj.amount,
      category: trxObj.category,
      paymentMethod: trxObj.type === 'pemasukan' ? 'Kas Masuk Bendahara' : 'Kas Keluar Operasional',
      date: trxObj.date,
      createdBy: trxObj.createdBy
    };
    setReceiptData(receiptObj);
    setIsReceiptModalOpen(true);
  };

  // Action 9: Delete Transaction (CRUD)
  const handleDeleteTransaction = (trxId) => {
    const targetTrx = transactions.find(t => t.id === trxId);
    if (!targetTrx) return;

    setTransactions(prev => prev.filter(t => t.id !== trxId));
    logAudit('DELETE_TRANSACTION', `Menghapus data transaksi ${trxId} sebesar Rp ${targetTrx.amount.toLocaleString('id-ID')} (${targetTrx.description}).`);
    showToast(`Transaksi ${trxId} telah dihapus dari sistem!`, 'rose');
  };

  // Action 10: CRUD Program Prioritas Panti (Pengurus Harian)
  const handleSaveProgram = (progData) => {
    const existingIndex = priorityPrograms.findIndex(p => p.id === progData.id);
    if (existingIndex >= 0) {
      // Edit mode
      setPriorityPrograms(prev => prev.map(p => p.id === progData.id ? progData : p));
      logAudit('UPDATE_PROGRAM', `Pengurus Harian memperbarui Program Prioritas "${progData.title}" (${progData.category}, Target: Rp ${progData.targetAmount.toLocaleString('id-ID')}).`);
      showToast(`Program "${progData.title}" berhasil diperbarui!`, 'success');
    } else {
      // Create mode
      setPriorityPrograms(prev => [progData, ...prev]);
      logAudit('CREATE_PROGRAM', `Pengurus Harian menambahkan Program Prioritas baru "${progData.title}" (${progData.category}, Target: Rp ${progData.targetAmount.toLocaleString('id-ID')}).`);
      showToast(`Program Prioritas "${progData.title}" berhasil ditambahkan!`, 'success');
    }
  };

  const handleDeleteProgram = (progId) => {
    const target = priorityPrograms.find(p => p.id === progId);
    if (!target) return;

    setPriorityPrograms(prev => prev.filter(p => p.id !== progId));
    logAudit('DELETE_PROGRAM', `Pengurus Harian menghapus Program Prioritas "${target.title}" (ID: ${progId}).`);
    showToast(`Program "${target.title}" telah dihapus.`, 'rose');
  };

  // Logout
  const handleLogout = () => {
    if (currentUser) {
      logAudit('LOGOUT', `Pengguna ${currentUser?.fullName} keluar dari sesi.`);
    }
    setCurrentUser(null);
    setActiveTab('beranda');
    showToast('Anda telah keluar dari akun.', 'info');
  };

  const pendingApprovalCount = users.filter(u => u.status === 'Pending Approval').length;

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
            <i data-lucide={toast.type === 'rose' ? 'alert-circle' : 'check-circle-2'} className="w-4 h-4 text-emerald-400"></i>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header & Navbar Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSwitchUser={handleSwitchUserRole}
        onLogout={handleLogout}
        onNavigateToAuth={(view) => {
          setActiveTab('auth');
          setAuthView(view);
        }}
        pendingApprovalCount={pendingApprovalCount}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {activeTab === 'beranda' && (
          <LandingPage
            onNavigateToDonation={(category) => {
              setSelectedDonationCategory(category || 'Konsumsi');
              setActiveTab('public-donation');
            }}
            onNavigateToLogin={() => {
              setActiveTab('auth');
              setAuthView('login');
            }}
            onNavigateToProfile={() => setActiveTab('profil')}
            priorityPrograms={priorityPrograms}
          />
        )}

        {activeTab === 'profil' && (
          <OrganizationProfile
            onNavigateToDonation={(category) => {
              setSelectedDonationCategory(category || 'Konsumsi');
              setActiveTab('public-donation');
            }}
          />
        )}

        {activeTab === 'public-donation' && (
          <PublicDonation
            initialCategory={selectedDonationCategory}
            onSubmitPublicDonation={handlePublicDonationSubmit}
          />
        )}

        {activeTab === 'public-dashboard' && (
          <PublicFinancialDashboard
            transactions={transactions}
            onPrintTransactionReceipt={handlePrintTransactionReceipt}
          />
        )}

        {activeTab === 'auth' && (
          <AuthPages
            initialView={authView}
            onLoginSuccess={handleLogin}
            onRegisterSubmit={handleRegisterSubmit}
            onQuickSimulateRole={handleSwitchUserRole}
          />
        )}

        {activeTab === 'dashboard' && (
          <FinancialDashboard
            transactions={transactions}
            currentUser={currentUser}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionManagement
            transactions={transactions}
            currentUser={currentUser}
            onOpenAddModal={() => {
              setEditingTrx(null);
              setIsAddTrxModalOpen(true);
            }}
            onOpenEditModal={(trx) => {
              setEditingTrx(trx);
              setIsAddTrxModalOpen(true);
            }}
            onConfirmDeleteTrx={(trx) => {
              setTrxToDelete(trx);
              setIsDeleteModalOpen(true);
            }}
            onPrintTransactionReceipt={handlePrintTransactionReceipt}
          />
        )}

        {activeTab === 'programs' && (
          <ProgramManagement
            priorityPrograms={priorityPrograms}
            onSaveProgram={handleSaveProgram}
            onDeleteProgram={handleDeleteProgram}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'approval' && (
          <UserApproval
            users={users}
            onApproveUser={handleApproveUser}
            onRejectUser={handleRejectUser}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'audit' && (
          <AuditTrailLog
            auditLogs={auditLogs}
          />
        )}

        {activeTab === 'report' && (
          <FinancialReportPSAK45
            transactions={transactions}
            currentUser={currentUser}
          />
        )}
      </main>

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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-700">SIMK-Panti Asuhan Kasih Bunda</span> • Transparansi & Akuntabilitas Nirlaba
          </div>
          <div className="text-[11px] text-slate-400">
            Dibuat untuk Pengabdian Masyarakat • Sesuai PSAK 45 / ISAK 35 & ISO Audit Trail
          </div>
        </div>
      </footer>

    </div>
  );
};

window.App = App;
