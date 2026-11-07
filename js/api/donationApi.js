const DonationApi = {
  getManualTransferConfig() {
    return apiRequest('/donations/manual-transfer/config', { auth: false });
  },

  createManualTransferDonation(payload, proofFile) {
    const data = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      data.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
    });
    data.append('proof', proofFile);
    return apiRequest('/donations/manual-transfer', {
      method: 'POST', auth: false, body: data,
    });
  },

  getManualTransferDonations(page = 1) {
    const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
    return apiRequest(`/pengurus/donations?manual_transfer=1&page=${safePage}`);
  },

  verifyManualTransfer(publicId) {
    return apiRequest(`/pengurus/donations/${encodeURIComponent(String(publicId))}/verify`, {
      method: 'PATCH', body: JSON.stringify({ bank_confirmed: true }),
    });
  },

  rejectManualTransfer(publicId, reasonCode) {
    return apiRequest(`/pengurus/donations/${encodeURIComponent(String(publicId))}/reject`, {
      method: 'PATCH', body: JSON.stringify({ reason_code: reasonCode }),
    });
  },

  async getManualTransferProof(publicId) {
    const token = getAccessToken();
    if (!token) throw new Error('Sesi login tidak ditemukan.');
    const response = await fetch(
      `${API_BASE_URL}/pengurus/donations/${encodeURIComponent(String(publicId))}/proof`,
      { headers: { Accept: 'image/png,image/jpeg,application/json', Authorization: `Bearer ${token}` }, cache: 'no-store' }
    );
    if (!response.ok) throw new Error('Bukti transfer tidak dapat diakses.');
    const imageBlob = await response.blob();
    if (!['image/jpeg', 'image/png'].includes(imageBlob.type)) {
      throw new Error('Format bukti pembayaran tidak valid.');
    }
    return imageBlob;
  },

  createPublicDonation(
    payload
  ) {
    return apiRequest(
      '/donations',
      {
        method: 'POST',
        auth: false,
        body: JSON.stringify(
          payload
        ),
      }
    );
  },

  // Pengurus Harian only; requires Sanctum authentication.
  getManagedDonations(page = 1) {
    const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
    return apiRequest(`/pengurus/donations?page=${safePage}`);
  },

  createOfflineDonation(payload) {
    return apiRequest('/pengurus/donations/offline', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Only offline donations can be verified manually. Online donations are
  // verified by the authorized payment settlement flow.
  verifyOfflineDonation(publicId) {
    if (!publicId) {
      throw new Error('ID publik donasi diperlukan.');
    }
    return apiRequest(
      `/pengurus/donations/${encodeURIComponent(String(publicId))}/verify`,
      { method: 'PATCH' }
    );
  },
};

window.DonationApi =
  DonationApi;