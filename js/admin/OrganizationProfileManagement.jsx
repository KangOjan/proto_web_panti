// Organization Profile CMS Management for Pengurus Harian
// Stable CMS form primitives.
// These components are intentionally defined outside OrganizationProfileManagement
// so React does not remount every input on each parent state update.
const CmsSection = ({
  icon,
  title,
  description,
  children
}) => (
  <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
    <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
        <LucideIcon
          name={icon}
          className="w-5 h-5"
        />
      </div>

      <div>
        <h2 className="font-extrabold text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="text-xs text-slate-500 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>

    {children}
  </section>
);

const CmsInput = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder = '',
  min,
  max
}) => (
  <label className="space-y-1.5 block">
    <span className="text-xs font-bold text-slate-700">
      {label}
      {required && (
        <span className="text-rose-500">
          {' '}*
        </span>
      )}
    </span>

    <input
      type={type}
      value={value ?? ''}
      min={min}
      max={max}
      required={required}
      placeholder={placeholder}
      onChange={
        (
          event
        ) =>
          onChange(
            event.target.value
          )
      }
      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
    />
  </label>
);

const CmsTextarea = ({
  label,
  value,
  onChange,
  rows = 4,
  placeholder = ''
}) => (
  <label className="space-y-1.5 block">
    <span className="text-xs font-bold text-slate-700">
      {label}
    </span>

    <textarea
      value={value ?? ''}
      rows={rows}
      placeholder={placeholder}
      onChange={
        (
          event
        ) =>
          onChange(
            event.target.value
          )
      }
      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-y"
    />
  </label>
);

const OrganizationProfileManagement = ({
  currentUser,
  onProfileUpdated,
  showToast
}) => {
  const createEmptyProfile = () => ({
    name: '',
    tagline: '',
    founded_year: '',
    founder: '',
    history: '',
    vision: '',
    missions: [],
    legalities: [],
    facilities: [],
    achievements: [],
    contact_info: {
      address: '',
      phone: '',
      whatsapp: '',
      email: '',
      visiting_hours: '',
      gmaps_url: '',
    },
    organization_structure: [],
  });

  const normalizeManagedProfile = (
    profile
  ) => {
    if (!profile) {
      return createEmptyProfile();
    }

    return {
      name:
        profile.name || '',

      tagline:
        profile.tagline || '',

      founded_year:
        profile.founded_year ?? '',

      founder:
        profile.founder || '',

      history:
        profile.history || '',

      vision:
        profile.vision || '',

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
              (item) => ({
                type:
                  item?.type || '',

                number:
                  item?.number || '',

                date:
                  item?.date || '',

                verified:
                  item?.verified === true,
              })
            )
          : [],

      facilities:
        Array.isArray(
          profile.facilities
        )
          ? profile.facilities.map(
              (item) => ({
                name:
                  item?.name || '',

                description:
                  item?.description || '',

                icon:
                  item?.icon || '',
              })
            )
          : [],

      achievements:
        Array.isArray(
          profile.achievements
        )
          ? profile.achievements.map(
              (item) => ({
                year:
                  item?.year || '',

                title:
                  item?.title || '',

                by:
                  item?.by || '',
              })
            )
          : [],

      contact_info: {
        address:
          profile.contact_info
            ?.address || '',

        phone:
          profile.contact_info
            ?.phone || '',

        whatsapp:
          profile.contact_info
            ?.whatsapp || '',

        email:
          profile.contact_info
            ?.email || '',

        visiting_hours:
          profile.contact_info
            ?.visiting_hours || '',

        gmaps_url:
          profile.contact_info
            ?.gmaps_url || '',
      },

      organization_structure:
        Array.isArray(
          profile.organization_structure
        )
          ? profile.organization_structure
              .map(
                (group) => ({
                  level:
                    group?.level ?? 1,

                  role:
                    group?.role || '',

                  members:
                    Array.isArray(
                      group?.members
                    )
                      ? group.members.map(
                          (member) => ({
                            name:
                              member?.name || '',

                            position:
                              member?.position || '',

                            role_code:
                              member?.role_code || '',

                            photo:
                              member?.photo || '',

                            description:
                              member?.description || '',
                          })
                        )
                      : [],
                })
              )
          : [],
    };
  };

  const [form, setForm] =
    React.useState(
      createEmptyProfile
    );

  const [loading, setLoading] =
    React.useState(true);

  const [saving, setSaving] =
    React.useState(false);

  const [error, setError] =
    React.useState(null);

  const [configured, setConfigured] =
    React.useState(false);

  const loadProfile =
    React.useCallback(
      async () => {
        if (
          currentUser?.role !==
          'pengurus_harian'
        ) {
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError(null);

          const response =
            await CmsApi
              .getManagedProfile();

          const profile =
            response?.data || null;

          setConfigured(
            Boolean(profile)
          );

          setForm(
            normalizeManagedProfile(
              profile
            )
          );
        } catch (requestError) {
          console.error(
            'Failed to load managed organization profile:',
            requestError
          );

          setError(
            requestError?.message ||
              'Gagal mengambil profil lembaga.'
          );
        } finally {
          setLoading(false);
        }
      },
      [
        currentUser,
      ]
    );

  React.useEffect(() => {
    loadProfile();
  }, [
    loadProfile,
  ]);

  const setField = (
    field,
    value
  ) => {
    setForm(
      (previous) => ({
        ...previous,
        [field]:
          value,
      })
    );
  };

  const setContactField = (
    field,
    value
  ) => {
    setForm(
      (previous) => ({
        ...previous,
        contact_info: {
          ...previous
            .contact_info,
          [field]:
            value,
        },
      })
    );
  };

  const updateArrayItem = (
    field,
    index,
    nextValue
  ) => {
    setForm(
      (previous) => ({
        ...previous,
        [field]:
          previous[field]
            .map(
              (
                item,
                itemIndex
              ) =>
                itemIndex ===
                index
                  ? nextValue
                  : item
            ),
      })
    );
  };

  const removeArrayItem = (
    field,
    index
  ) => {
    setForm(
      (previous) => ({
        ...previous,
        [field]:
          previous[field]
            .filter(
              (
                _,
                itemIndex
              ) =>
                itemIndex !==
                index
            ),
      })
    );
  };

  const addMission = () => {
    setForm(
      (previous) => ({
        ...previous,
        missions: [
          ...previous.missions,
          '',
        ],
      })
    );
  };

  const addLegality = () => {
    setForm(
      (previous) => ({
        ...previous,
        legalities: [
          ...previous.legalities,
          {
            type: '',
            number: '',
            date: '',
            verified: false,
          },
        ],
      })
    );
  };

  const addFacility = () => {
    setForm(
      (previous) => ({
        ...previous,
        facilities: [
          ...previous.facilities,
          {
            name: '',
            description: '',
            icon: '',
          },
        ],
      })
    );
  };

  const addAchievement = () => {
    setForm(
      (previous) => ({
        ...previous,
        achievements: [
          ...previous.achievements,
          {
            year: '',
            title: '',
            by: '',
          },
        ],
      })
    );
  };

  const addStructureGroup = () => {
    setForm(
      (previous) => ({
        ...previous,
        organization_structure: [
          ...previous
            .organization_structure,
          {
            level:
              previous
                .organization_structure
                .length + 1,

            role: '',

            members: [
              {
                name: '',
                position: '',
                role_code: '',
                photo: '',
                description: '',
              },
            ],
          },
        ],
      })
    );
  };

  const updateStructureGroup = (
    groupIndex,
    field,
    value
  ) => {
    setForm(
      (previous) => ({
        ...previous,

        organization_structure:
          previous
            .organization_structure
            .map(
              (
                group,
                index
              ) =>
                index ===
                groupIndex
                  ? {
                      ...group,
                      [field]:
                        value,
                    }
                  : group
            ),
      })
    );
  };

  const removeStructureGroup = (
    groupIndex
  ) => {
    setForm(
      (previous) => ({
        ...previous,

        organization_structure:
          previous
            .organization_structure
            .filter(
              (
                _,
                index
              ) =>
                index !==
                groupIndex
            ),
      })
    );
  };

  const addStructureMember = (
    groupIndex
  ) => {
    setForm(
      (previous) => ({
        ...previous,

        organization_structure:
          previous
            .organization_structure
            .map(
              (
                group,
                index
              ) =>
                index ===
                groupIndex
                  ? {
                      ...group,

                      members: [
                        ...group.members,
                        {
                          name: '',
                          position: '',
                          role_code: '',
                          photo: '',
                          description: '',
                        },
                      ],
                    }
                  : group
            ),
      })
    );
  };

  const updateStructureMember = (
    groupIndex,
    memberIndex,
    field,
    value
  ) => {
    setForm(
      (previous) => ({
        ...previous,

        organization_structure:
          previous
            .organization_structure
            .map(
              (
                group,
                index
              ) =>
                index ===
                groupIndex
                  ? {
                      ...group,

                      members:
                        group.members
                          .map(
                            (
                              member,
                              indexMember
                            ) =>
                              indexMember ===
                              memberIndex
                                ? {
                                    ...member,
                                    [field]:
                                      value,
                                  }
                                : member
                          ),
                    }
                  : group
            ),
      })
    );
  };

  const removeStructureMember = (
    groupIndex,
    memberIndex
  ) => {
    setForm(
      (previous) => ({
        ...previous,

        organization_structure:
          previous
            .organization_structure
            .map(
              (
                group,
                index
              ) =>
                index ===
                groupIndex
                  ? {
                      ...group,

                      members:
                        group.members
                          .filter(
                            (
                              _,
                              indexMember
                            ) =>
                              indexMember !==
                              memberIndex
                          ),
                    }
                  : group
            ),
      })
    );
  };

  const buildPayload = () => ({
    name:
      form.name.trim(),

    tagline:
      form.tagline.trim() ||
      null,

    founded_year:
      form.founded_year === ''
        ? null
        : Number(
            form.founded_year
          ),

    founder:
      form.founder.trim() ||
      null,

    history:
      form.history.trim() ||
      null,

    vision:
      form.vision.trim() ||
      null,

    missions:
      form.missions
        .map(
          (mission) =>
            mission.trim()
        )
        .filter(Boolean),

    legalities:
      form.legalities
        .filter(
          (item) =>
            item.type.trim() ||
            item.number.trim() ||
            item.date.trim()
        )
        .map(
          (item) => ({
            type:
              item.type.trim(),

            number:
              item.number.trim(),

            date:
              item.date.trim() ||
              null,

            verified:
              item.verified ===
              true,
          })
        ),

    facilities:
      form.facilities
        .filter(
          (item) =>
            item.name.trim() ||
            item.description
              .trim() ||
            item.icon.trim()
        )
        .map(
          (item) => ({
            name:
              item.name.trim(),

            description:
              item.description
                .trim(),

            icon:
              item.icon.trim() ||
              null,
          })
        ),

    achievements:
      form.achievements
        .filter(
          (item) =>
            item.year.trim() ||
            item.title.trim() ||
            item.by.trim()
        )
        .map(
          (item) => ({
            year:
              item.year.trim(),

            title:
              item.title.trim(),

            by:
              item.by.trim() ||
              null,
          })
        ),

    contact_info: {
      address:
        form.contact_info
          .address
          .trim() ||
        null,

      phone:
        form.contact_info
          .phone
          .trim() ||
        null,

      whatsapp:
        form.contact_info
          .whatsapp
          .trim() ||
        null,

      email:
        form.contact_info
          .email
          .trim() ||
        null,

      visiting_hours:
        form.contact_info
          .visiting_hours
          .trim() ||
        null,

      gmaps_url:
        form.contact_info
          .gmaps_url
          .trim() ||
        null,
    },

    organization_structure:
      form.organization_structure
        .filter(
          (group) =>
            group.role.trim() ||
            group.members.some(
              (member) =>
                member.name.trim() ||
                member.position
                  .trim()
            )
        )
        .map(
          (group) => ({
            level:
              Number(
                group.level
              ),

            role:
              group.role.trim(),

            members:
              group.members
                .filter(
                  (member) =>
                    member.name
                      .trim() ||
                    member.position
                      .trim()
                )
                .map(
                  (member) => ({
                    name:
                      member.name
                        .trim(),

                    position:
                      member.position
                        .trim(),

                    role_code:
                      member.role_code
                        .trim() ||
                      null,

                    photo:
                      member.photo
                        .trim() ||
                      null,

                    description:
                      member.description
                        .trim() ||
                      null,
                  })
                ),
          })
        ),
  });

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      if (
        currentUser?.role !==
        'pengurus_harian'
      ) {
        return;
      }

      if (
        !form.name.trim()
      ) {
        setError(
          'Nama lembaga wajib diisi.'
        );
        return;
      }

      try {
        setSaving(true);
        setError(null);

        const response =
          await CmsApi
            .updateProfile(
              buildPayload()
            );

        const profile =
          response?.data;

        if (!profile) {
          throw new Error(
            'Server tidak mengembalikan profil lembaga.'
          );
        }

        setForm(
          normalizeManagedProfile(
            profile
          )
        );

        setConfigured(true);

        if (
          typeof onProfileUpdated ===
          'function'
        ) {
          await onProfileUpdated();
        }

        if (
          typeof showToast ===
          'function'
        ) {
          showToast(
            configured
              ? 'Profil lembaga berhasil diperbarui.'
              : 'Profil lembaga berhasil dibuat.',
            'success'
          );
        }
      } catch (requestError) {
        console.error(
          'Failed to save organization profile:',
          requestError
        );

        const validationMessage =
          requestError?.errors
            ? Object.values(
                requestError.errors
              )
                .flat()
                .join(' ')
            : null;

        const message =
          validationMessage ||
          requestError?.message ||
          'Profil lembaga gagal disimpan.';

        setError(
          message
        );

        if (
          typeof showToast ===
          'function'
        ) {
          showToast(
            message,
            'rose'
          );
        }
      } finally {
        setSaving(false);
      }
    };

  if (
    currentUser?.role !==
    'pengurus_harian'
  ) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white border border-rose-200 rounded-3xl p-8 text-center shadow-sm">
          <LucideIcon
            name="shield-alert"
            className="w-10 h-10 text-rose-500 mx-auto mb-3"
          />
          <h2 className="text-lg font-extrabold text-slate-900">
            Akses CMS Ditolak
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Pengelolaan profil lembaga hanya tersedia untuk Pengurus Harian.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <LucideIcon
          name="loader-circle"
          className="w-8 h-8 text-emerald-600 mx-auto animate-spin"
        />
        <p className="text-sm text-slate-500 mt-3">
          Memuat profil lembaga...
        </p>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-400/20 rounded-full px-3 py-1 mb-3">
            <LucideIcon
              name="building-2"
              className="w-3.5 h-3.5"
            />
            CMS Profil Lembaga
          </div>

          <h1 className="text-2xl sm:text-3xl font-black">
            Kelola Profil Panti
          </h1>

          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Konten yang disimpan di halaman ini menjadi sumber data resmi untuk halaman Profil Panti publik.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-xs font-extrabold px-3 py-2 rounded-xl border ${
            configured
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30'
              : 'bg-amber-500/10 text-amber-300 border-amber-400/30'
          }`}>
            {configured
              ? 'Profil Terkonfigurasi'
              : 'Belum Dikonfigurasi'}
          </span>

          <button
            type="button"
            onClick={
              loadProfile
            }
            disabled={
              loading ||
              saving
            }
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold disabled:opacity-50"
          >
            Muat Ulang
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl px-4 py-3 text-sm font-semibold flex items-start gap-2">
          <LucideIcon
            name="alert-circle"
            className="w-4 h-4 mt-0.5 flex-shrink-0"
          />
          <span>
            {error}
          </span>
        </div>
      )}

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-6"
      >
        <CmsSection
          icon="building-2"
          title="Identitas Lembaga"
          description="Informasi utama yang tampil pada profil publik."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CmsInput
              label="Nama Lembaga"
              value={form.name}
              required
              onChange={
                (value) =>
                  setField(
                    'name',
                    value
                  )
              }
            />

            <CmsInput
              label="Tagline"
              value={form.tagline}
              onChange={
                (value) =>
                  setField(
                    'tagline',
                    value
                  )
              }
            />

            <CmsInput
              label="Tahun Berdiri"
              type="number"
              min="1900"
              max={
                new Date()
                  .getFullYear()
              }
              value={
                form.founded_year
              }
              onChange={
                (value) =>
                  setField(
                    'founded_year',
                    value
                  )
              }
            />

            <CmsInput
              label="Pendiri"
              value={form.founder}
              onChange={
                (value) =>
                  setField(
                    'founder',
                    value
                  )
              }
            />
          </div>

          <CmsTextarea
            label="Sejarah"
            value={form.history}
            rows={6}
            onChange={
              (value) =>
                setField(
                  'history',
                  value
                )
            }
          />

          <CmsTextarea
            label="Visi"
            value={form.vision}
            rows={4}
            onChange={
              (value) =>
                setField(
                  'vision',
                  value
                )
            }
          />
        </CmsSection>

        <CmsSection
          icon="target"
          title="Misi"
          description="Tambahkan satu butir misi per baris."
        >
          <div className="space-y-3">
            {form.missions.map(
              (
                mission,
                index
              ) => (
                <div
                  key={index}
                  className="flex gap-2"
                >
                  <input
                    value={mission}
                    onChange={
                      (
                        event
                      ) =>
                        updateArrayItem(
                          'missions',
                          index,
                          event.target
                            .value
                        )
                    }
                    className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500"
                    placeholder={`Misi ${index + 1}`}
                  />

                  <button
                    type="button"
                    onClick={
                      () =>
                        removeArrayItem(
                          'missions',
                          index
                        )
                    }
                    className="px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    <LucideIcon
                      name="trash-2"
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              )
            )}

            <button
              type="button"
              onClick={
                addMission
              }
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
            >
              <LucideIcon
                name="plus-circle"
                className="w-4 h-4"
              />
              Tambah Misi
            </button>
          </div>
        </CmsSection>

        <CmsSection
          icon="shield-check"
          title="Legalitas"
          description="Dokumen legal dan status verifikasi lembaga."
        >
          <div className="space-y-4">
            {form.legalities.map(
              (
                item,
                index
              ) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <CmsInput
                      label="Jenis Dokumen"
                      value={item.type}
                      onChange={
                        (value) =>
                          updateArrayItem(
                            'legalities',
                            index,
                            {
                              ...item,
                              type:
                                value,
                            }
                          )
                      }
                    />

                    <CmsInput
                      label="Nomor"
                      value={item.number}
                      onChange={
                        (value) =>
                          updateArrayItem(
                            'legalities',
                            index,
                            {
                              ...item,
                              number:
                                value,
                            }
                          )
                      }
                    />

                    <CmsInput
                      label="Tanggal / Status"
                      value={item.date}
                      onChange={
                        (value) =>
                          updateArrayItem(
                            'legalities',
                            index,
                            {
                              ...item,
                              date:
                                value,
                            }
                          )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={
                          item.verified
                        }
                        onChange={
                          (
                            event
                          ) =>
                            updateArrayItem(
                              'legalities',
                              index,
                              {
                                ...item,
                                verified:
                                  event.target
                                    .checked,
                              }
                            )
                        }
                      />
                      Terverifikasi
                    </label>

                    <button
                      type="button"
                      onClick={
                        () =>
                          removeArrayItem(
                            'legalities',
                            index
                          )
                      }
                      className="text-xs font-bold text-rose-600"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              )
            )}

            <button
              type="button"
              onClick={
                addLegality
              }
              className="text-xs font-bold text-emerald-700 flex items-center gap-1.5"
            >
              <LucideIcon
                name="plus-circle"
                className="w-4 h-4"
              />
              Tambah Legalitas
            </button>
          </div>
        </CmsSection>

        <CmsSection
          icon="home"
          title="Fasilitas"
        >
          <div className="space-y-4">
            {form.facilities.map(
              (
                item,
                index
              ) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <CmsInput
                      label="Nama Fasilitas"
                      value={item.name}
                      onChange={
                        (value) =>
                          updateArrayItem(
                            'facilities',
                            index,
                            {
                              ...item,
                              name:
                                value,
                            }
                          )
                      }
                    />

                    <CmsInput
                      label="Icon Lucide"
                      value={item.icon}
                      placeholder="Contoh: home"
                      onChange={
                        (value) =>
                          updateArrayItem(
                            'facilities',
                            index,
                            {
                              ...item,
                              icon:
                                value,
                            }
                          )
                      }
                    />
                  </div>

                  <CmsTextarea
                    label="Deskripsi"
                    value={
                      item.description
                    }
                    rows={3}
                    onChange={
                      (value) =>
                        updateArrayItem(
                          'facilities',
                          index,
                          {
                            ...item,
                            description:
                              value,
                          }
                        )
                    }
                  />

                  <button
                    type="button"
                    onClick={
                      () =>
                        removeArrayItem(
                          'facilities',
                          index
                        )
                    }
                    className="text-xs font-bold text-rose-600"
                  >
                    Hapus Fasilitas
                  </button>
                </div>
              )
            )}

            <button
              type="button"
              onClick={
                addFacility
              }
              className="text-xs font-bold text-emerald-700 flex items-center gap-1.5"
            >
              <LucideIcon
                name="plus-circle"
                className="w-4 h-4"
              />
              Tambah Fasilitas
            </button>
          </div>
        </CmsSection>

        <CmsSection
          icon="trophy"
          title="Prestasi"
        >
          <div className="space-y-4">
            {form.achievements.map(
              (
                item,
                index
              ) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <CmsInput
                      label="Tahun"
                      value={item.year}
                      onChange={
                        (value) =>
                          updateArrayItem(
                            'achievements',
                            index,
                            {
                              ...item,
                              year:
                                value,
                            }
                          )
                      }
                    />

                    <CmsInput
                      label="Prestasi"
                      value={item.title}
                      onChange={
                        (value) =>
                          updateArrayItem(
                            'achievements',
                            index,
                            {
                              ...item,
                              title:
                                value,
                            }
                          )
                      }
                    />

                    <CmsInput
                      label="Oleh"
                      value={item.by}
                      onChange={
                        (value) =>
                          updateArrayItem(
                            'achievements',
                            index,
                            {
                              ...item,
                              by:
                                value,
                            }
                          )
                      }
                    />
                  </div>

                  <button
                    type="button"
                    onClick={
                      () =>
                        removeArrayItem(
                          'achievements',
                          index
                        )
                    }
                    className="mt-3 text-xs font-bold text-rose-600"
                  >
                    Hapus Prestasi
                  </button>
                </div>
              )
            )}

            <button
              type="button"
              onClick={
                addAchievement
              }
              className="text-xs font-bold text-emerald-700 flex items-center gap-1.5"
            >
              <LucideIcon
                name="plus-circle"
                className="w-4 h-4"
              />
              Tambah Prestasi
            </button>
          </div>
        </CmsSection>

        <CmsSection
          icon="map-pin"
          title="Kontak Publik"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CmsInput
              label="Telepon"
              value={
                form.contact_info
                  .phone
              }
              onChange={
                (value) =>
                  setContactField(
                    'phone',
                    value
                  )
              }
            />

            <CmsInput
              label="WhatsApp"
              value={
                form.contact_info
                  .whatsapp
              }
              onChange={
                (value) =>
                  setContactField(
                    'whatsapp',
                    value
                  )
              }
            />

            <CmsInput
              label="Email"
              type="email"
              value={
                form.contact_info
                  .email
              }
              onChange={
                (value) =>
                  setContactField(
                    'email',
                    value
                  )
              }
            />

            <CmsInput
              label="Jam Kunjungan"
              value={
                form.contact_info
                  .visiting_hours
              }
              onChange={
                (value) =>
                  setContactField(
                    'visiting_hours',
                    value
                  )
              }
            />

            <div className="md:col-span-2">
              <CmsInput
                label="URL Google Maps"
                type="url"
                value={
                  form.contact_info
                    .gmaps_url
                }
                onChange={
                  (value) =>
                    setContactField(
                      'gmaps_url',
                      value
                    )
                }
              />
            </div>
          </div>

          <CmsTextarea
            label="Alamat"
            value={
              form.contact_info
                .address
            }
            rows={3}
            onChange={
              (value) =>
                setContactField(
                  'address',
                  value
                )
            }
          />
        </CmsSection>

        <CmsSection
          icon="network"
          title="Struktur Organisasi"
          description="Kelompokkan anggota berdasarkan level dan peran organisasi."
        >
          <div className="space-y-5">
            {form.organization_structure
              .map(
                (
                  group,
                  groupIndex
                ) => (
                  <div
                    key={groupIndex}
                    className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_auto] gap-3 items-end">
                      <CmsInput
                        label="Level"
                        type="number"
                        min="1"
                        max="50"
                        value={
                          group.level
                        }
                        onChange={
                          (value) =>
                            updateStructureGroup(
                              groupIndex,
                              'level',
                              value
                            )
                        }
                      />

                      <CmsInput
                        label="Nama Kelompok / Peran"
                        value={
                          group.role
                        }
                        onChange={
                          (value) =>
                            updateStructureGroup(
                              groupIndex,
                              'role',
                              value
                            )
                        }
                      />

                      <button
                        type="button"
                        onClick={
                          () =>
                            removeStructureGroup(
                              groupIndex
                            )
                        }
                        className="h-[42px] px-4 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50"
                      >
                        Hapus Grup
                      </button>
                    </div>

                    <div className="space-y-3">
                      {group.members.map(
                        (
                          member,
                          memberIndex
                        ) => (
                          <div
                            key={
                              memberIndex
                            }
                            className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <CmsInput
                                label="Nama Anggota"
                                value={
                                  member.name
                                }
                                onChange={
                                  (value) =>
                                    updateStructureMember(
                                      groupIndex,
                                      memberIndex,
                                      'name',
                                      value
                                    )
                                }
                              />

                              <CmsInput
                                label="Jabatan"
                                value={
                                  member.position
                                }
                                onChange={
                                  (value) =>
                                    updateStructureMember(
                                      groupIndex,
                                      memberIndex,
                                      'position',
                                      value
                                    )
                                }
                              />

                              <CmsInput
                                label="Role Code"
                                value={
                                  member.role_code
                                }
                                placeholder="Opsional"
                                onChange={
                                  (value) =>
                                    updateStructureMember(
                                      groupIndex,
                                      memberIndex,
                                      'role_code',
                                      value
                                    )
                                }
                              />

                              <CmsInput
                                label="Foto"
                                value={
                                  member.photo
                                }
                                placeholder="URL/path opsional"
                                onChange={
                                  (value) =>
                                    updateStructureMember(
                                      groupIndex,
                                      memberIndex,
                                      'photo',
                                      value
                                    )
                                }
                              />
                            </div>

                            <CmsTextarea
                              label="Deskripsi"
                              value={
                                member.description
                              }
                              rows={2}
                              onChange={
                                (value) =>
                                  updateStructureMember(
                                    groupIndex,
                                    memberIndex,
                                    'description',
                                    value
                                  )
                              }
                            />

                            <button
                              type="button"
                              onClick={
                                () =>
                                  removeStructureMember(
                                    groupIndex,
                                    memberIndex
                                  )
                              }
                              className="text-xs font-bold text-rose-600"
                            >
                              Hapus Anggota
                            </button>
                          </div>
                        )
                      )}

                      <button
                        type="button"
                        onClick={
                          () =>
                            addStructureMember(
                              groupIndex
                            )
                        }
                        className="text-xs font-bold text-emerald-700 flex items-center gap-1.5"
                      >
                        <LucideIcon
                          name="user-plus"
                          className="w-4 h-4"
                        />
                        Tambah Anggota
                      </button>
                    </div>
                  </div>
                )
              )}

            <button
              type="button"
              onClick={
                addStructureGroup
              }
              className="text-xs font-bold text-emerald-700 flex items-center gap-1.5"
            >
              <LucideIcon
                name="plus-circle"
                className="w-4 h-4"
              />
              Tambah Grup Struktur
            </button>
          </div>
        </CmsSection>

        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur border border-slate-200 shadow-xl rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Perubahan akan dicatat pada Audit Trail setelah berhasil disimpan.
          </div>

          <button
            type="submit"
            disabled={
              saving
            }
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-xl text-sm font-extrabold flex items-center justify-center gap-2"
          >
            <LucideIcon
              name={
                saving
                  ? 'loader-circle'
                  : 'save'
              }
              className={`w-4 h-4 ${
                saving
                  ? 'animate-spin'
                  : ''
              }`}
            />

            {saving
              ? 'Menyimpan...'
              : configured
              ? 'Simpan Perubahan'
              : 'Buat Profil Lembaga'}
          </button>
        </div>
      </form>
    </div>
  );
};

window.OrganizationProfileManagement =
  OrganizationProfileManagement;
