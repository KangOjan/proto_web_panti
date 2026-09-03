import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SIMK_DATA } from '../Data/mockData';

const SimkContext = createContext(null);

export function SimkProvider({ children }) {
  // Global State stored in localStorage with fallback to INITIAL_SIMK_DATA
  const [users, setUsers] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('simk_users') : null;
    return saved ? JSON.parse(saved) : INITIAL_SIMK_DATA.users;
  });

  const [campaigns, setCampaigns] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('simk_campaigns') : null;
    return saved ? JSON.parse(saved) : INITIAL_SIMK_DATA.campaigns;
  });

  const [donations, setDonations] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('simk_donations') : null;
    return saved ? JSON.parse(saved) : INITIAL_SIMK_DATA.donations;
  });

  const [childrenProfiles, setChildrenProfiles] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('simk_children') : null;
    return saved ? JSON.parse(saved) : INITIAL_SIMK_DATA.childrenProfiles;
  });

  const [articles, setArticles] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('simk_articles') : null;
    return saved ? JSON.parse(saved) : INITIAL_SIMK_DATA.articles;
  });

  const [faqs, setFaqs] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('simk_faqs') : null;
    return saved ? JSON.parse(saved) : INITIAL_SIMK_DATA.faqs;
  });

  const [orphanageProfile, setOrphanageProfile] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('simk_profile') : null;
    return saved ? JSON.parse(saved) : INITIAL_SIMK_DATA.orphanageProfile;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('simk_transactions') : null;
    return saved ? JSON.parse(saved) : INITIAL_SIMK_DATA.transactions;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('simk_audit_logs') : null;
    return saved ? JSON.parse(saved) : INITIAL_SIMK_DATA.auditLogs;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('simk_current_user') : null;
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default to Pengurus Harian for instant testing & evaluation
    return INITIAL_SIMK_DATA.users.find(u => u.username === 'harian1') || INITIAL_SIMK_DATA.users[0];
  });

  // Modal and Receipt Shared State
  const [isAddTrxModalOpen, setIsAddTrxModalOpen] = useState(false);
  const [editingTrx, setEditingTrx] = useState(null);
  const [trxToDelete, setTrxToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('simk_users', JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('simk_campaigns', JSON.stringify(campaigns));
    }
  }, [campaigns]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('simk_donations', JSON.stringify(donations));
    }
  }, [donations]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('simk_children', JSON.stringify(childrenProfiles));
    }
  }, [childrenProfiles]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('simk_articles', JSON.stringify(articles));
    }
  }, [articles]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('simk_faqs', JSON.stringify(faqs));
    }
  }, [faqs]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('simk_profile', JSON.stringify(orphanageProfile));
    }
  }, [orphanageProfile]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('simk_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('simk_audit_logs', JSON.stringify(auditLogs));
    }
  }, [auditLogs]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentUser) {
        localStorage.setItem('simk_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('simk_current_user');
      }
    }
  }, [currentUser]);

  // Audit Logger
  const logAudit = (action, details, executorName = null) => {
    const newLog = {
      id: `LOG-${Math.floor(Math.random() * 9000 + 1000)}`,
      timestamp: new Date().toISOString(),
      userName: executorName || (currentUser ? currentUser.fullName : 'Pengelola / Publik'),
      nik: currentUser ? currentUser.nik : '-',
      userRole: currentUser ? currentUser.role : 'Pengunjung Publik',
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Quick Role Switcher
  const handleSwitchUserRole = (targetRole) => {
    if (!targetRole) {
      setCurrentUser(null);
      showToast('Mode Evaluator: Berpindah ke Pengunjung Publik', 'info');
      return;
    }
    if (targetRole === 'Pengurus Harian') {
      const found = users.find(u => u.username === 'harian1') || users.find(u => u.role === 'Pengurus Harian' && u.status === 'Approved');
      setCurrentUser(found);
      showToast(`Mode Evaluator: Berpindah ke Pengurus Harian (${found?.fullName})`, 'info');
    } else if (targetRole === 'Pemimpin Lembaga') {
      const found = users.find(u => u.username === 'pemimpin1') || users.find(u => u.role === 'Pemimpin Lembaga' && u.status === 'Approved');
      setCurrentUser(found);
      showToast(`Mode Evaluator: Berpindah ke Pemimpin Lembaga (${found?.fullName})`, 'info');
    }
  };

  // Auth Handlers
  const handleLogin = (username, password) => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return { success: false, message: 'Username tidak ditemukan.' };
    if (user.password !== password) return { success: false, message: 'Password salah.' };
    if (user.status === 'Pending Approval') return { success: false, message: 'Akun Anda berstatus Pending Approval.' };
    if (user.status === 'Rejected') return { success: false, message: 'Pengajuan akun Anda ditolak.' };

    setCurrentUser(user);
    logAudit('LOGIN', `Pengguna "${user.fullName}" berhasil masuk ke sistem.`);
    showToast(`Selamat datang, ${user.fullName}!`, 'success');
    return { success: true, user };
  };

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
      registeredAt: new Date().toISOString()
    };

    setUsers(prev => [newUser, ...prev]);
    logAudit('REGISTER', `Pendaftaran akun baru oleh ${formData.fullName} (NIK: ${formData.nik}, Peran: ${formData.role}). Status: Pending Approval.`, formData.fullName);
    showToast(`Pendaftaran berhasil! Akun Anda berstatus "Pending Approval" & menunggu persetujuan.`, 'info');
  };

  const handleApproveUser = (userId) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Approved' } : u));
    logAudit('APPROVE_USER', `Pemimpin Lembaga menyetujui akun ${targetUser.fullName} (NIK: ${targetUser.nik}).`);
    showToast(`Akun ${targetUser.fullName} telah disetujui!`, 'success');
  };

  const handleRejectUser = (userId) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Rejected' } : u));
    logAudit('REJECT_USER', `Pemimpin Lembaga menolak akun ${targetUser.fullName} (NIK: ${targetUser.nik}).`);
    showToast(`Akun ${targetUser.fullName} telah ditolak.`, 'rose');
  };

  // DONATION VERIFICATION HANDLERS
  const handleApproveDonation = (donationId) => {
    const targetDonation = donations.find(d => d.id === donationId);
    if (!targetDonation) return;

    const updatedDonations = donations.map(d => {
      if (d.id === donationId) {
        return {
          ...d,
          status: 'Terverifikasi',
          verifiedAt: new Date().toISOString(),
          verifiedBy: currentUser ? currentUser.fullName : 'Pengurus Harian'
        };
      }
      return d;
    });

    setDonations(updatedDonations);

    if (targetDonation.campaignId && targetDonation.amount > 0) {
      setCampaigns(prev => prev.map(c => {
        if (c.id === targetDonation.campaignId) {
          const newCollected = (c.collectedAmount || 0) + targetDonation.amount;
          const newStatus = newCollected >= c.targetAmount ? 'Target Tercapai' : c.status;
          return {
            ...c,
            collectedAmount: newCollected,
            status: newStatus
          };
        }
        return c;
      }));
    }

    logAudit('VERIFY_DONATION', `Pengelola memverifikasi donasi ${donationId} sebesar Rp ${targetDonation.amount.toLocaleString('id-ID')} dari "${targetDonation.donorName}".`);
    showToast(`Donasi ${donationId} berhasil diverifikasi! Progress campaign telah diperbarui.`, 'success');
  };

  const handleRejectDonation = (donationId) => {
    const targetDonation = donations.find(d => d.id === donationId);
    if (!targetDonation) return;

    setDonations(prev => prev.map(d => d.id === donationId ? { ...d, status: 'Ditolak' } : d));
    logAudit('REJECT_DONATION', `Pengelola menolak donasi ${donationId} dari "${targetDonation.donorName}".`);
    showToast(`Donasi ${donationId} ditolak.`, 'rose');
  };

  const handleAddOnlineDonationSubmit = (newDonation) => {
    setDonations(prev => [newDonation, ...prev]);
    logAudit('SUBMIT_DONATION_ONLINE', `Donatur "${newDonation.donorName}" mengirim pengajuan donasi online ${newDonation.id} sebesar Rp ${newDonation.amount.toLocaleString('id-ID')} (Pending Verifikasi).`, newDonation.donorName);
    showToast('Donasi online Anda berhasil dikirim! Menunggu verifikasi Pengelola.', 'info');
  };

  const handleAddOfflineDonation = (offlineObj) => {
    setDonations(prev => [offlineObj, ...prev]);

    if (offlineObj.campaignId && offlineObj.amount > 0) {
      setCampaigns(prev => prev.map(c => {
        if (c.id === offlineObj.campaignId) {
          const newCollected = (c.collectedAmount || 0) + offlineObj.amount;
          const newStatus = newCollected >= c.targetAmount ? 'Target Tercapai' : c.status;
          return { ...c, collectedAmount: newCollected, status: newStatus };
        }
        return c;
      }));
    }

    logAudit('ADD_OFFLINE_DONATION', `Pengelola mencatat donasi offline ${offlineObj.id} dari "${offlineObj.donorName}" (${offlineObj.kind.toUpperCase()}).`);
    showToast(`Donasi offline ${offlineObj.id} berhasil dicatat!`, 'success');
  };

  // CAMPAIGN HANDLERS
  const handleSaveCampaign = (campaignObj) => {
    const existingIndex = campaigns.findIndex(c => c.id === campaignObj.id);
    if (existingIndex >= 0) {
      setCampaigns(prev => prev.map(c => c.id === campaignObj.id ? campaignObj : c));
      logAudit('UPDATE_CAMPAIGN', `Memperbarui campaign donasi "${campaignObj.title}" (Status: ${campaignObj.status}).`);
      showToast(`Campaign "${campaignObj.title}" berhasil diperbarui!`, 'success');
    } else {
      setCampaigns(prev => [campaignObj, ...prev]);
      logAudit('CREATE_CAMPAIGN', `Membuat campaign donasi baru "${campaignObj.title}" (Target: Rp ${campaignObj.targetAmount.toLocaleString('id-ID')}).`);
      showToast(`Campaign "${campaignObj.title}" berhasil dibuat!`, 'success');
    }
  };

  const handleDeleteCampaign = (campaignId) => {
    const target = campaigns.find(c => c.id === campaignId);
    if (!target) return;

    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    logAudit('DELETE_CAMPAIGN', `Menghapus campaign donasi "${target.title}" (ID: ${campaignId}).`);
    showToast(`Campaign "${target.title}" telah dihapus.`, 'rose');
  };

  const handleAddCampaignUpdate = (campaignId, updateObj) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          updates: [updateObj, ...(c.updates || [])]
        };
      }
      return c;
    }));
    logAudit('ADD_CAMPAIGN_UPDATE', `Menambahkan update perkembangan penyaluran pada campaign ${campaignId}: "${updateObj.title}".`);
    showToast('Update perkembangan campaign berhasil dipublikasikan!', 'success');
  };

  // CONTENT CMS HANDLERS
  const handleSaveProfile = (profileObj) => {
    setOrphanageProfile(profileObj);
    logAudit('UPDATE_PROFILE', 'Pengelola memperbarui informasi panti, visi-misi, dan kontak resmi.');
    showToast('Informasi Panti Asuhan berhasil diperbarui!', 'success');
  };

  const handleSaveArticle = (articleObj) => {
    setArticles(prev => [articleObj, ...prev]);
    logAudit('CREATE_ARTICLE', `Menulis artikel baru: "${articleObj.title}".`);
    showToast('Artikel baru berhasil dipublikasikan!', 'success');
  };

  const handleDeleteArticle = (articleId) => {
    setArticles(prev => prev.filter(a => a.id !== articleId));
    logAudit('DELETE_ARTICLE', `Menghapus artikel ID ${articleId}.`);
    showToast('Artikel telah dihapus.', 'rose');
  };

  const handleSaveFaq = (faqObj) => {
    setFaqs(prev => [...prev, faqObj]);
    logAudit('CREATE_FAQ', `Menambahkan pertanyaan FAQ baru: "${faqObj.question}".`);
    showToast('FAQ baru berhasil ditambahkan!', 'success');
  };

  const handleDeleteFaq = (faqId) => {
    setFaqs(prev => prev.filter(f => f.id !== faqId));
    logAudit('DELETE_FAQ', `Menghapus FAQ ID ${faqId}.`);
    showToast('FAQ telah dihapus.', 'rose');
  };

  // Transaction Save/Delete
  const handleSaveTransaction = (trxData) => {
    let targetTrxObj = null;

    if (trxData.id) {
      targetTrxObj = {
        ...trxData,
        createdBy: currentUser ? currentUser.fullName : 'Pengurus Harian'
      };
      setTransactions(prev => prev.map(t => t.id === trxData.id ? targetTrxObj : t));
      showToast(`Transaksi ${trxData.id} berhasil diperbarui!`, 'success');
    } else {
      const newId = `TRX-${new Date().toISOString().substring(0,7).replace('-','')}-${Math.floor(Math.random() * 899 + 100)}`;
      targetTrxObj = {
        id: newId,
        date: trxData.date,
        type: trxData.type,
        category: trxData.category,
        description: trxData.description,
        amount: Number(trxData.amount),
        createdBy: currentUser ? currentUser.fullName : 'Pengurus Harian',
        createdAt: new Date().toISOString()
      };
      setTransactions(prev => [targetTrxObj, ...prev]);
      showToast(`Transaksi ${newId} berhasil disimpan!`, 'success');
    }

    setIsAddTrxModalOpen(false);

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

  const handleDeleteTransaction = (trxId) => {
    setTransactions(prev => prev.filter(t => t.id !== trxId));
    showToast(`Transaksi ${trxId} telah dihapus!`, 'rose');
  };

  const handlePrintTransactionReceipt = (trxObj) => {
    const receiptObj = {
      receiptNo: trxObj.id || trxObj.receiptNo,
      type: trxObj.type || 'pemasukan',
      donorName: trxObj.donorName || trxObj.description,
      description: trxObj.description || trxObj.campaignTitle || 'Donasi Panti Asuhan',
      amount: trxObj.amount,
      category: trxObj.category || 'Donasi',
      paymentMethod: trxObj.paymentMethod || 'Transfer Bank / QRIS',
      date: trxObj.date || (trxObj.createdAt ? trxObj.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]),
      createdBy: trxObj.createdBy || 'SIMK-Panti Server'
    };
    setReceiptData(receiptObj);
    setIsReceiptModalOpen(true);
  };

  const handleLogout = () => {
    if (currentUser) {
      logAudit('LOGOUT', `Pengguna ${currentUser?.fullName} keluar dari sesi.`);
    }
    setCurrentUser(null);
    showToast('Anda telah keluar dari akun.', 'info');
  };

  // Reset to default data
  const handleResetData = () => {
    localStorage.clear();
    setUsers(INITIAL_SIMK_DATA.users);
    setCampaigns(INITIAL_SIMK_DATA.campaigns);
    setDonations(INITIAL_SIMK_DATA.donations);
    setChildrenProfiles(INITIAL_SIMK_DATA.childrenProfiles);
    setArticles(INITIAL_SIMK_DATA.articles);
    setFaqs(INITIAL_SIMK_DATA.faqs);
    setOrphanageProfile(INITIAL_SIMK_DATA.orphanageProfile);
    setTransactions(INITIAL_SIMK_DATA.transactions);
    setAuditLogs(INITIAL_SIMK_DATA.auditLogs);
    setCurrentUser(INITIAL_SIMK_DATA.users.find(u => u.username === 'harian1') || INITIAL_SIMK_DATA.users[0]);
    showToast('Seluruh data demo telah di-reset ke nilai default!', 'success');
  };

  const value = {
    users,
    setUsers,
    campaigns,
    setCampaigns,
    donations,
    setDonations,
    childrenProfiles,
    setChildrenProfiles,
    articles,
    setArticles,
    faqs,
    setFaqs,
    orphanageProfile,
    setOrphanageProfile,
    organizationStructure: INITIAL_SIMK_DATA.organizationStructure,
    transactions,
    setTransactions,
    auditLogs,
    setAuditLogs,
    currentUser,
    setCurrentUser,
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
    handleSwitchUserRole,
    handleResetData
  };

  return (
    <SimkContext.Provider value={value}>
      {children}
    </SimkContext.Provider>
  );
}

export function useSimk() {
  const context = useContext(SimkContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      users: INITIAL_SIMK_DATA.users,
      campaigns: INITIAL_SIMK_DATA.campaigns,
      donations: INITIAL_SIMK_DATA.donations,
      childrenProfiles: INITIAL_SIMK_DATA.childrenProfiles,
      articles: INITIAL_SIMK_DATA.articles,
      faqs: INITIAL_SIMK_DATA.faqs,
      orphanageProfile: INITIAL_SIMK_DATA.orphanageProfile,
      organizationStructure: INITIAL_SIMK_DATA.organizationStructure,
      transactions: INITIAL_SIMK_DATA.transactions,
      auditLogs: INITIAL_SIMK_DATA.auditLogs,
      currentUser: INITIAL_SIMK_DATA.users[0],
      showToast: () => {},
      handleLogin: () => {},
      handleLogout: () => {},
      handleRegisterSubmit: () => {},
      handleApproveUser: () => {},
      handleRejectUser: () => {},
      handleApproveDonation: () => {},
      handleRejectDonation: () => {},
      handleAddOnlineDonationSubmit: () => {},
      handleAddOfflineDonation: () => {},
      handleSaveCampaign: () => {},
      handleDeleteCampaign: () => {},
      handleAddCampaignUpdate: () => {},
      handleSaveProfile: () => {},
      handleSaveArticle: () => {},
      handleDeleteArticle: () => {},
      handleSaveFaq: () => {},
      handleDeleteFaq: () => {},
      handleSaveTransaction: () => {},
      handleDeleteTransaction: () => {},
      handlePrintTransactionReceipt: () => {},
      handleSwitchUserRole: () => {},
      handleResetData: () => {}
    };
  }
  return context;
}
