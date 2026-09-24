const normalizeOrganizationProfile = (
  profile
) => {
  if (!profile) {
    return null;
  }

  const contactInfo =
    profile.contact_info || {};

  const organizationStructure =
    Array.isArray(
      profile.organization_structure
    )
      ? profile.organization_structure
      : [];

  return {
    /*
     * Basic organization identity.
     */
    name:
      profile.name || '',

    tagline:
      profile.tagline || '',

    foundedYear:
      profile.founded_year ?? null,

    founder:
      profile.founder || '',

    history:
      profile.history || '',

    vision:
      profile.vision || '',

    /*
     * Simple document sections.
     */
    missions:
      Array.isArray(
        profile.missions
      )
        ? profile.missions
        : [],

    legalities:
      Array.isArray(
        profile.legalities
      )
        ? profile.legalities.map(
            (legality) => ({
              type:
                legality?.type || '',

              number:
                legality?.number || '',

              date:
                legality?.date || '',

              verified:
                legality?.verified ===
                true,
            })
          )
        : [],

    facilities:
      Array.isArray(
        profile.facilities
      )
        ? profile.facilities.map(
            (facility) => ({
              name:
                facility?.name || '',

              /*
               * Existing frontend components use "desc".
               * Backend uses "description".
               */
              desc:
                facility?.description || '',

              icon:
                facility?.icon || null,
            })
          )
        : [],

    achievements:
      Array.isArray(
        profile.achievements
      )
        ? profile.achievements.map(
            (achievement) => ({
              year:
                achievement?.year || '',

              title:
                achievement?.title || '',

              by:
                achievement?.by || '',
            })
          )
        : [],

    /*
     * Convert backend snake_case contract to the camelCase
     * structure already consumed by the existing frontend.
     */
    contactInfo: {
      address:
        contactInfo.address || '',

      phone:
        contactInfo.phone || '',

      whatsapp:
        contactInfo.whatsapp || '',

      email:
        contactInfo.email || '',

      visitingHours:
        contactInfo.visiting_hours || '',

      gmapsUrl:
        contactInfo.gmaps_url || '',
    },

    organizationStructure:
      organizationStructure.map(
        (level) => ({
          level:
            level?.level ?? null,

          role:
            level?.role || '',

          members:
            Array.isArray(
              level?.members
            )
              ? level.members.map(
                  (member) => ({
                    name:
                      member?.name || '',

                    position:
                      member?.position || '',

                    /*
                     * Existing frontend components use camelCase.
                     */
                    roleCode:
                      member?.role_code || null,

                    photo:
                      member?.photo || null,

                    desc:
                      member?.description || '',
                  })
                )
              : [],
        })
      ),

    updatedAt:
      profile.updated_at || null,
  };
};

const CmsApi = {
  /**
   * Retrieve the public organization profile.
   */
  getPublicProfile() {
    return apiRequest(
      '/organization-profile',
      {
        auth: false,
      }
    );
  },

  /**
   * Retrieve the organization profile for CMS management.
   */
  getManagedProfile() {
    return apiRequest(
      '/pengurus/organization-profile'
    );
  },

  /**
   * Partially update the singleton organization profile.
   */
  updateProfile(
    payload
  ) {
    return apiRequest(
      '/pengurus/organization-profile',
      {
        method: 'PATCH',

        body:
          JSON.stringify(
            payload
          ),
      }
    );
  },

  /**
   * Normalize the backend API contract into the structure currently
   * consumed by the existing public React components.
   *
   * This adapter allows the backend to keep conventional snake_case
   * field names without forcing a large frontend refactor.
   */
  normalizeProfile:
    normalizeOrganizationProfile,
};

window.CmsApi =
  CmsApi;