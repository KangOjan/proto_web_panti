// Public media are served by Laravel/Nginx from /storage/, never from frontend/assets.
// Keep URLs origin-independent so moving from localhost to VPS does not break local paths.
const simkNormalizeMediaUrl = (raw) => {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const value = raw.trim();
  if (/example\.com/i.test(value)) return null;

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      if (!["http:", "https:"].includes(url.protocol)) return null;
      // Laravel APP_URL may be localhost without the Nginx development port.
      const isLocalHost = (host) =>
        host === "localhost" || host === "127.0.0.1";
      if (
        isLocalHost(url.hostname) &&
        (url.pathname.startsWith("/storage/") ||
          /^\/api\/v1\/articles\/[^/]+\/cover\/?$/.test(url.pathname))
      ) {
        return `${window.location.origin}${url.pathname}${url.search}`;
      }
      return url.href;
    } catch {
      return null;
    }
  }

  const path = value.replace(/^\/+/, "");
  if (/^api\/v1\/articles\/[^/?#]+\/cover(?:\?.*)?$/i.test(path)) {
    return `/${path}`;
  }
  if (
    !/^(?:storage\/)?(?:articles|campaigns|site|organization-profiles|organization)\//i.test(
      path,
    )
  )
    return null;
  if (!/^[a-z0-9._/%-]+$/i.test(path) || path.split("/").includes(".."))
    return null;
  return `/${path.startsWith("storage/") ? path : `storage/${path}`}`;
};

const normalizeOrganizationProfile = (profile) => {
  if (!profile) {
    return null;
  }

  const contactInfo = profile.contact_info || {};

  const organizationStructure = Array.isArray(profile.organization_structure)
    ? profile.organization_structure
    : [];

  return {
    /*
     * Basic organization identity.
     */
    name: profile.name || "",

    tagline: profile.tagline || "",

    foundedYear: profile.founded_year ?? null,

    heroImageUrl: simkNormalizeMediaUrl(profile.hero_image_url),

    founder: profile.founder || "",

    history: profile.history || "",

    vision: profile.vision || "",

    /*
     * Simple document sections.
     */
    missions: Array.isArray(profile.missions) ? profile.missions : [],

    legalities: Array.isArray(profile.legalities)
      ? profile.legalities.map((legality) => ({
          type: legality?.type || "",

          number: legality?.number || "",

          date: legality?.date || "",

          verified: legality?.verified === true,
          documentUrl: typeof legality?.document_url === 'string' &&
            /^\/api\/v1\/organization-profile\/legalities\/[0-9a-f-]{36}\/document$/.test(legality.document_url)
            ? legality.document_url : null,
        }))
      : [],

    facilities: Array.isArray(profile.facilities)
      ? profile.facilities.map((facility) => ({
          name: facility?.name || "",

          /*
           * Existing frontend components use "desc".
           * Backend uses "description".
           */
          desc: facility?.description || "",

          icon: facility?.icon || null,
        }))
      : [],

    achievements: Array.isArray(profile.achievements)
      ? profile.achievements.map((achievement) => ({
          year: achievement?.year || "",

          title: achievement?.title || "",

          by: achievement?.by || "",
        }))
      : [],

    /*
     * Convert backend snake_case contract to the camelCase
     * structure already consumed by the existing frontend.
     */
    contactInfo: {
      address: contactInfo.address || "",

      phone: contactInfo.phone || "",

      whatsapp: contactInfo.whatsapp || "",

      email: contactInfo.email || "",

      visitingHours: contactInfo.visiting_hours || "",

      gmapsUrl: contactInfo.gmaps_url || "",
    },

    organizationStructure: organizationStructure.map((level) => ({
      level: level?.level ?? null,

      role: level?.role || "",

      members: Array.isArray(level?.members)
        ? level.members.map((member) => ({
            name: member?.name || "",

            position: member?.position || "",

            /*
             * Existing frontend components use camelCase.
             */
            roleCode: member?.role_code || null,

            photo: simkNormalizeMediaUrl(member?.photo_url || member?.photo),

            desc: member?.description || "",
          }))
        : [],
    })),

    updatedAt: profile.updated_at || null,
  };
};

const CmsApi = {
  /**
   * Retrieve the public organization profile.
   */
  getPublicProfile() {
    return apiRequest("/organization-profile", {
      auth: false,
    });
  },

  /**
   * Retrieve the organization profile for CMS management.
   */
  getManagedProfile() {
    return apiRequest("/pengurus/organization-profile");
  },

  /**
   * Partially update the singleton organization profile.
   */
  updateProfile(payload) {
    return apiRequest("/pengurus/organization-profile", {
      method: "PATCH",

      body: JSON.stringify(payload),
    });
  },

  // Legalitas PDF tetap privat. Gunakan token login untuk upload maupun download.
  async uploadLegalityDocument(legalityId, file) {
    const form = new FormData();
    form.append('document', file);
    const token = sessionStorage.getItem('access_token');
    const base = window.SIMK_CONFIG?.API_BASE_URL || '/api/v1';
    const response = await fetch(`${base}/pengurus/organization-profile/legalities/${encodeURIComponent(legalityId)}/document`, {
      method: 'POST',
      headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: form,
    });
    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.success) {
      throw new Error(Object.values(json?.errors || {}).flat().join(' ') || json?.message || 'Upload dokumen legalitas gagal.');
    }
    return json;
  },
  async downloadLegalityDocument(legalityId) {
    const token = sessionStorage.getItem('access_token');
    const base = window.SIMK_CONFIG?.API_BASE_URL || '/api/v1';
    const response = await fetch(`${base}/pengurus/organization-profile/legalities/${encodeURIComponent(legalityId)}/document`, {
      headers: { Accept: 'application/pdf', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (!response.ok) throw new Error('Dokumen tidak dapat diunduh. Periksa hak akses atau status file.');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = `legalitas-${legalityId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally { window.setTimeout(() => URL.revokeObjectURL(url), 1000); }
  },

  // File uploads must use multipart without a manually set Content-Type.
  async uploadOrganizationMemberPhoto(file) {
    const form = new FormData();
    form.append("photo", file);
    const token = sessionStorage.getItem("access_token");
    const base = window.SIMK_CONFIG?.API_BASE_URL || "/api/v1";
    const response = await fetch(
      `${base}/pengurus/organization-profile/member-photo`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: form,
      },
    );
    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.success) {
      throw new Error(json?.message || "Upload foto pengurus gagal.");
    }
    return json;
  },

  /**
   * Normalize the backend API contract into the structure currently
   * consumed by the existing public React components.
   *
   * This adapter allows the backend to keep conventional snake_case
   * field names without forcing a large frontend refactor.
   */
  // CMS Article/FAQ: public requests must never fall back to demo data.
  getPublicArticles() {
    return apiRequest("/articles", { auth: false });
  },
  getPublicArticle(slug) {
    return apiRequest(`/articles/${encodeURIComponent(slug)}`, { auth: false });
  },
  getManagedArticles() {
    return apiRequest("/pengurus/articles");
  },
  createArticle(data) {
    return apiRequest("/pengurus/articles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateArticle(id, data) {
    return apiRequest(`/pengurus/articles/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  deleteArticle(id) {
    return apiRequest(`/pengurus/articles/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
  // Binary uploads cannot use apiRequest's JSON Content-Type behavior.
  async uploadArticleCover(id, file) {
    const payload = new FormData();
    payload.append("cover_image", file);
    const token = sessionStorage.getItem("access_token");
    const base = window.SIMK_CONFIG?.API_BASE_URL || "/api/v1";
    const response = await fetch(
      `${base}/pengurus/articles/${encodeURIComponent(id)}/cover`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: payload,
      },
    );
    const json = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(json?.message || "Upload gambar artikel gagal.");
    }
    return json;
  },
  updateReceiptSettings(payload) {
    return apiRequest('/pengurus/organization-profile/receipt-settings', { method: 'PATCH', body: JSON.stringify(payload) });
  },
  uploadReceiptSignature(role, file) {
    if (!['daily_manager', 'institution_head'].includes(role)) throw new Error('Jabatan tidak valid.');
    const data = new FormData();
    data.append('signature', file);
    return apiRequest(`/pengurus/organization-profile/receipt-signatures/${role}`, { method: 'POST', body: data });
  },
  getReceiptSignature(role) {
    if (!['daily_manager', 'institution_head'].includes(role)) throw new Error('Jabatan tidak valid.');
    return apiRequest(`/pengurus/organization-profile/receipt-signatures/${role}`);
  },

  getPublicFaqs() {
    return apiRequest("/faqs", { auth: false });
  },
  getManagedFaqs() {
    return apiRequest("/pengurus/faqs");
  },
  createFaq(data) {
    return apiRequest("/pengurus/faqs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateFaq(id, data) {
    return apiRequest(`/pengurus/faqs/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  deleteFaq(id) {
    return apiRequest(`/pengurus/faqs/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
  normalizeArticle(article) {
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content || "",
      image: simkNormalizeMediaUrl(
        article.image_url || article.cover_image_path,
      ),
      date: article.published_at ? article.published_at.slice(0, 10) : "",
      author: article.author || "Pengurus Panti",
      status: article.status,
      published_at: article.published_at,
    };
  },
  normalizeFaq(faq) {
    return {
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "Umum",
      sortOrder: faq.sort_order || 0,
      isPublished: faq.is_published === true,
    };
  },

  normalizeProfile: normalizeOrganizationProfile,

  normalizeMediaUrl: simkNormalizeMediaUrl,
};

window.CmsApi = CmsApi;
