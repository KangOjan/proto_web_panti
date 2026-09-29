const DonationApi = {
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
};

window.DonationApi =
  DonationApi;