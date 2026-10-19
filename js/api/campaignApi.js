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

  getPublicUpdates(slug) {
    return apiRequest(`/campaigns/${encodeURIComponent(slug)}/updates`, { auth: false });
  },

  getPublicPrayers(slug) {
    return apiRequest(`/campaigns/${encodeURIComponent(slug)}/prayers`, { auth: false });
  },

  getPengurusUpdates(campaignId) {
    return apiRequest(`/pengurus/campaigns/${encodeURIComponent(campaignId)}/updates`);
  },

  createPengurusUpdate(campaignId, payload) {
    return apiRequest(`/pengurus/campaigns/${encodeURIComponent(campaignId)}/updates`, {
      method: 'POST', body: JSON.stringify(payload),
    });
  },

  editPengurusUpdate(campaignId, updateId, payload) {
    return apiRequest(`/pengurus/campaigns/${encodeURIComponent(campaignId)}/updates/${encodeURIComponent(updateId)}`, {
      method: 'PATCH', body: JSON.stringify(payload),
    });
  },

  deletePengurusUpdate(campaignId, updateId) {
    return apiRequest(`/pengurus/campaigns/${encodeURIComponent(campaignId)}/updates/${encodeURIComponent(updateId)}`, {
      method: 'DELETE',
    });
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