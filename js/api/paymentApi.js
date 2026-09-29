const PaymentApi = {
  initiate(
    donationPublicId
  ) {
    return apiRequest(
      `/donations/${encodeURIComponent(
        donationPublicId
      )}/payment`,
      {
        method: 'POST',
        auth: false,
      }
    );
  },

  getStatus(
    paymentPublicId
  ) {
    return apiRequest(
      `/payments/${encodeURIComponent(
        paymentPublicId
      )}`,
      {
        auth: false,
      }
    );
  },
};

window.PaymentApi =
  PaymentApi;