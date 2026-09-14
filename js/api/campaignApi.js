const CampaignApi = {
  getPublicCampaigns() {
    return apiRequest(
      '/campaigns',
      {
        auth: false,
      }
    );
  },

  getPublicCampaign(slug) {
    return apiRequest(
      `/campaigns/${encodeURIComponent(
        slug
      )}`,
      {
        auth: false,
      }
    );
  },

  getCategories() {
    return apiRequest(
      '/pengurus/campaign-categories'
    );
  },

  createCategory(payload) {
    return apiRequest(
      '/pengurus/campaign-categories',
      {
        method: 'POST',
        body: JSON.stringify(
          payload
        ),
      }
    );
  },

  getPengurusCampaigns() {
    return apiRequest(
      '/pengurus/campaigns'
    );
  },

  getCampaign(id) {
    return apiRequest(
      `/pengurus/campaigns/${encodeURIComponent(
        id
      )}`
    );
  },

  createCampaign(payload) {
    return apiRequest(
      '/pengurus/campaigns',
      {
        method: 'POST',
        body: JSON.stringify(
          payload
        ),
      }
    );
  },

  updateCampaign(
    id,
    payload
  ) {
    return apiRequest(
      `/pengurus/campaigns/${encodeURIComponent(
        id
      )}`,
      {
        method: 'PATCH',
        body: JSON.stringify(
          payload
        ),
      }
    );
  },
};

window.CampaignApi =
  CampaignApi;