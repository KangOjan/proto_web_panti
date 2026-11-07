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

// Common institutional records. The list is informational, not a claim that all are mandatory.
const CMS_LEGALITY_TYPES = [
  'Akta Pendirian Lembaga/Yayasan',
  'Akta Perubahan Lembaga/Yayasan',
  'SK Pengesahan Badan Hukum',
  'Tanda Pendaftaran LKS',
  'Surat Keterangan Domisili',
  'Surat Izin Operasional/Penyelenggaraan',
  'Sertifikat Akreditasi LKSA',
  'Anggaran Dasar dan Anggaran Rumah Tangga',
  'Surat Rekomendasi Dinas Sosial',
  'Dokumen Legalitas Lainnya',
];

const CMS_FACILITY_ICONS = [
  ['', 'Otomatis'],
  ['home', 'Asrama / Rumah'],
  ['book-open', 'Ruang Belajar'],
  ['graduation-cap', 'Pendidikan'],
  ['heart-pulse', 'Kesehatan'],
  ['users', 'Ruang Kegiatan'],
  ['utensils', 'Dapur / Ruang Makan'],
  ['building-2', 'Bangunan'],
];

const CMS_VISITING_DAYS = [
  ['monday', 'Senin'], ['tuesday', 'Selasa'], ['wednesday', 'Rabu'],
  ['thursday', 'Kamis'], ['friday', 'Jumat'], ['saturday', 'Sabtu'],
  ['sunday', 'Minggu'],
];

const cmsEmptyVisitSchedule = () => ({ days: [], start: '09:00', end: '16:00' });
const cmsVisitLabel = (schedule) => {
  if (!schedule || !schedule.days?.length) return null;
  const names = CMS_VISITING_DAYS.filter(([key]) => schedule.days.includes(key))
    .map(([, name]) => name).join(', ');
  return `${names}: ${schedule.start}-${schedule.end} WIB`;
};

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
      visiting_schedule: cmsEmptyVisitSchedule(),
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
                id: item?.id || null,
                has_document: item?.has_document === true,
                is_public: item?.is_public === true,

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

        visiting_schedule:
          profile.contact_info?.visiting_schedule &&
          Array.isArray(profile.contact_info.visiting_schedule.days)
            ? profile.contact_info.visiting_schedule
            : cmsEmptyVisitSchedule(),

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

                            photo:
                              member?.photo || '',

                            photo_url:
                              member?.photo_url || member?.photo || '',

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

  const [uploadingPhoto, setUploadingPhoto] = React.useState(false);
  const [uploadingLegalityId, setUploadingLegalityId] = React.useState(null);
  const [scheduleChanged, setScheduleChanged] = React.useState(false);
  const [receiptSettings, setReceiptSettings] = React.useState({ daily_manager_name: '', institution_head_name: '', daily_manager_has_signature: false, institution_head_has_signature: false });
  const [receiptSaving, setReceiptSaving] = React.useState(false);
  const [signatureBusy, setSignatureBusy] = React.useState('');
  const [receiptMessage, setReceiptMessage] = React.useState('');
  const [signaturePreview, setSignaturePreview] = React.useState({});
  const refreshSignatures = async (profile) => {
    const settings = profile?.receipt_settings || {};
    setReceiptSettings({
      daily_manager_name: settings.daily_manager_name || '',
      institution_head_name: settings.institution_head_name || '',
      daily_manager_has_signature: settings.daily_manager_has_signature === true,
      institution_head_has_signature: settings.institution_head_has_signature === true,
    });
    const previews = {};
    for (const role of ['daily_manager', 'institution_head']) {
      if (settings[`${role}_has_signature`]) {
        try { previews[role] = (await CmsApi.getReceiptSignature(role))?.data?.image || null; }
        catch (_) { previews[role] = null; }
      }
    }
    setSignaturePreview(previews);
  };
  const uploadReceiptSignature = async (role, file) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 512 * 1024) {
      setReceiptMessage('Gunakan PNG/JPG/WebP, maksimal 512 KB.'); return;
    }
    try {
      setSignatureBusy(role); setReceiptMessage('');
      const response = await CmsApi.uploadReceiptSignature(role, file);
      await refreshSignatures(response?.data);
      setReceiptMessage('Tanda tangan tersimpan secara privat. Kuitansi lama tidak berubah.');
    } catch (error) { setReceiptMessage(error?.message || 'Upload tanda tangan gagal.'); }
    finally { setSignatureBusy(''); }
  };
  const saveReceiptNames = async () => {
    if (!configured) { setReceiptMessage('Simpan identitas lembaga terlebih dahulu.'); return; }
    try {
      setReceiptSaving(true); setReceiptMessage('');
      const response = await CmsApi.updateReceiptSettings({
        daily_manager_name: receiptSettings.daily_manager_name.trim(),
        institution_head_name: receiptSettings.institution_head_name.trim(),
      });
      await refreshSignatures(response?.data);
      setReceiptMessage('Konfigurasi kwitansi tersimpan untuk penerbitan berikutnya.');
    } catch (error) { setReceiptMessage(error?.message || 'Gagal menyimpan konfigurasi.'); }
    finally { setReceiptSaving(false); }
  };

  const [error, setError] =
    React.useState(null);

  const [configured, setConfigured] =
    React.useState(false);

  const loadProfile =
    React.useCallback(
      async () => {
        const isHarian = String(currentUser?.role || '').toLowerCase() === 'pengurus_harian' || String(currentUser?.role || '').toLowerCase() === 'pengurus harian';
        if (!isHarian) {
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
          setScheduleChanged(false);
          await refreshSignatures(profile);
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

  const handleLegalityUpload = async (legalityId, file) => {
    if (!file || !legalityId || uploadingLegalityId) return;
    if (file.type !== 'application/pdf' || file.size > 5 * 1024 * 1024) {
      setError('Pilih file PDF maksimal 5 MB.');
      return;
    }
    try {
      setUploadingLegalityId(legalityId);
      setError(null);
      const response = await CmsApi.uploadLegalityDocument(legalityId, file);
      const confirmed = response?.data?.legalities?.find((item) => item.id === legalityId);
      if (!confirmed?.has_document) throw new Error('Server belum mengonfirmasi dokumen PDF.');
      // Keep unsaved form edits intact. Only update the document status of this row.
      setForm((previous) => ({
        ...previous,
        legalities: previous.legalities.map((item) =>
          item.id === legalityId ? { ...item, has_document: true, is_public: false } : item
        ),
      }));
      if (typeof showToast === 'function') showToast('PDF legalitas berhasil diunggah secara privat.', 'success');
    } catch (requestError) {
      setError(requestError?.message || 'Gagal mengunggah PDF legalitas.');
    } finally {
      setUploadingLegalityId(null);
    }
  };

  const handleLegalityDownload = async (legalityId) => {
    try { await CmsApi.downloadLegalityDocument(legalityId); }
    catch (requestError) { setError(requestError?.message || 'Gagal mengunduh PDF.'); }
  };

  const addLegality = () => {
    setForm(
      (previous) => ({
        ...previous,
        legalities: [
          ...previous.legalities,
          {
            id: null,
            has_document: false,
            is_public: false,
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

  const uploadMemberPhoto = async (groupIndex, memberIndex, file) => {
    if (!file || uploadingPhoto || saving) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type) || file.size > 3 * 1024 * 1024) {
      setError('Foto wajib JPG, PNG, atau WebP dengan ukuran maksimal 3 MB.');
      return;
    }
    try {
      setUploadingPhoto(true);
      setError(null);
      const response = await CmsApi.uploadOrganizationMemberPhoto(file);
      const path = response?.data?.path;
      if (!path) throw new Error('Server tidak mengembalikan lokasi foto.');
      setForm(previous => ({
        ...previous,
        organization_structure: previous.organization_structure.map((group, i) => i !== groupIndex
          ? group
          : { ...group, members: group.members.map((member, j) => j !== memberIndex
            ? member
            : { ...member, photo: path, photo_url: response?.data?.url || '' }) },
        ),
      }));
    } catch (uploadError) {
      setError(uploadError?.message || 'Gagal mengunggah foto pengurus.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const updateVisitingSchedule = (schedule) => {
    setScheduleChanged(true);
    setContactField('visiting_schedule', schedule);
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
            ...(item.id ? { id: item.id } : {}),
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
            is_public: item.is_public === true && item.verified === true && item.has_document === true,
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

      visiting_hours: scheduleChanged
        ? cmsVisitLabel(form.contact_info.visiting_schedule)
        : (form.contact_info.visiting_hours.trim() || null),

      visiting_schedule: form.contact_info.visiting_schedule,

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

      const isHarian = String(currentUser?.role || '').toLowerCase() === 'pengurus_harian' || String(currentUser?.role || '').toLowerCase() === 'pengurus harian';
      if (!isHarian) {
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

      const schedule = form.contact_info.visiting_schedule;
      if (schedule?.days?.length && (!schedule.start || !schedule.end || schedule.end <= schedule.start)) {
        setError('Jam selesai kunjungan harus lebih besar daripada jam mulai.');
        return;
      }

      if (uploadingPhoto || uploadingLegalityId) {
        setError('Selesaikan upload foto atau legalitas sebelum menyimpan perubahan.');
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
        setScheduleChanged(false);

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

  const isHarianRole = String(currentUser?.role || '').toLowerCase() === 'pengurus_harian' || String(currentUser?.role || '').toLowerCase() === 'pengurus harian';
  if (!isHarianRole) {
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

      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 space-y-5">
        <h2 className="text-lg font-bold text-slate-900">Pejabat & tanda tangan kwitansi</h2>
        <p className="text-xs text-slate-600">Konfigurasi hanya untuk kwitansi baru. File tanda tangan tersimpan privat; kwitansi yang telah diterbitkan tidak berubah.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            ['daily_manager', 'Pengurus Harian'], ['institution_head', 'Kepala Lembaga'],
          ].map(([role, label]) => (
            <div key={role} className="rounded-2xl border border-slate-200 p-4 space-y-3">
              <label className="block text-sm font-bold">Nama {label}
                <input type="text" maxLength={150} value={receiptSettings[`${role}_name`] || ''}
                  onChange={(event) => setReceiptSettings((old) => ({ ...old, [`${role}_name`]: event.target.value }))}
                  className="block w-full mt-1 rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="block text-xs font-bold">Upload tanda tangan {label} (PNG/JPG/WebP, maks 512 KB)
                <input type="file" accept="image/png,image/jpeg,image/webp" disabled={!configured || Boolean(signatureBusy)}
                  onChange={(event) => { const file = event.target.files?.[0]; uploadReceiptSignature(role, file); event.target.value = ''; }}
                  className="block w-full mt-2 text-xs" />
              </label>
              {signaturePreview[role] ? <img src={signaturePreview[role]} alt={`Tanda tangan ${label}`} className="h-16 max-w-full object-contain" /> :
                <p className="text-xs text-slate-500">Belum ada tanda tangan.</p>}
            </div>
          ))}
        </div>
        {receiptMessage && <p role="status" className="text-xs text-emerald-800">{receiptMessage}</p>}
        <button type="button" disabled={!configured || receiptSaving || Boolean(signatureBusy)} onClick={saveReceiptNames}
          className="rounded-xl bg-emerald-700 px-5 py-2.5 text-white font-bold disabled:opacity-50">
          {receiptSaving ? 'Menyimpan...' : 'Simpan Nama Penandatangan'}
        </button>
      </section>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-6"
      >
        {form.organization_structure.some((group) => /\[\s*DEMO\s*\]/i.test(group?.role || '') || (group?.members || []).some((member) => (/\[\s*DEMO\s*\]/i.test(member?.name || '') || /\[\s*DEMO\s*\]/i.test(member?.position || '')))) && (
          <div role="status" className="border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 rounded-xl text-sm">
            Data struktur organisasi yang masih berlabel [DEMO] sengaja tidak ditampilkan sebagai pengurus resmi pada website publik. Perbarui nama dan jabatan dengan data yang telah dikonfirmasi, lalu simpan profil.
          </div>
        )}
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
          description="PDF tetap privat secara default. Pengurus dapat memilih dokumen yang aman untuk dipublikasikan pada profil lembaga."
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
                    <label className="block space-y-1.5">
                      <span className="text-xs font-bold text-slate-700">Jenis Dokumen</span>
                      <select value={CMS_LEGALITY_TYPES.includes(item.type) ? item.type : (item.type ? '__other__' : '')}
                        onChange={(event) => updateArrayItem('legalities', index, {
                          ...item, type: event.target.value === '__other__' ? 'Dokumen Legalitas Lainnya' : event.target.value,
                        })}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500">
                        <option value="">Pilih jenis dokumen</option>
                        {CMS_LEGALITY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                        {!CMS_LEGALITY_TYPES.includes(item.type) && item.type && <option value="__other__">Jenis lain (data lama)</option>}
                      </select>
                      {item.type && (!CMS_LEGALITY_TYPES.includes(item.type) || item.type === 'Dokumen Legalitas Lainnya') && (
                        <input aria-label="Jenis dokumen lainnya" type="text" value={item.type}
                          onChange={(event) => updateArrayItem('legalities', index, { ...item, type: event.target.value })}
                          maxLength="150" placeholder="Tuliskan jenis dokumen"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" />
                      )}
                    </label>

                    <CmsInput
                      label="Nomor"
                      value={item.number}
                      onChange={(value) => updateArrayItem('legalities', index, { ...item, number: value })}
                    />

                    <label className="block space-y-1.5">
                      <span className="text-xs font-bold text-slate-700">Tanggal Penerbitan</span>
                      <input type="date" value={/^\d{4}-\d{2}-\d{2}$/.test(item.date || '') ? item.date : ''}
                        onChange={(event) => updateArrayItem('legalities', index, { ...item, date: event.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm" />
                      {item.date && !/^\d{4}-\d{2}-\d{2}$/.test(item.date) && (
                        <p className="text-[11px] text-amber-700">Tanggal lama "{item.date}" tidak valid. Pilih tanggal penerbitan yang benar.</p>
                      )}
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <label className={`font-semibold rounded-lg border px-3 py-2 ${item.id && !uploadingLegalityId ? 'cursor-pointer bg-white text-emerald-700 border-emerald-200' : 'cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'}`}>
                      {uploadingLegalityId === item.id && item.id ? 'Mengunggah PDF...' : item.has_document ? 'Ganti PDF Legalitas' : 'Unggah PDF Legalitas'}
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,application/pdf"
                        disabled={!item.id || Boolean(uploadingLegalityId) || saving}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) handleLegalityUpload(item.id, file);
                          event.target.value = '';
                        }}
                      />
                    </label>
                    {item.has_document && item.id && (
                      <button type="button" onClick={() => handleLegalityDownload(item.id)} className="font-bold text-blue-700 underline">
                        Unduh PDF (khusus pengurus)
                      </button>
                    )}
                    {!item.id && <span className="text-slate-500">Simpan profil terlebih dahulu untuk mengaktifkan unggah.</span>}
                    <p className="w-full text-[11px] leading-relaxed text-slate-600">PDF hanya tampil di halaman publik jika dokumen sudah diunggah, dicentang Terverifikasi dan Publikasikan PDF, kemudian perubahan profil disimpan. Periksa dan tutupi data pribadi sebelum publikasi.</p>
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
                    <label className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                      <input type="checkbox" checked={item.is_public === true && item.has_document === true && item.verified === true}
                        disabled={!item.id || !item.has_document || !item.verified}
                        onChange={(event) => updateArrayItem('legalities', index, {
                          ...item, is_public: event.target.checked,
                        })} />
                      Publikasikan PDF
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

                    <label className="space-y-1.5 block">
                      <span className="text-xs font-bold text-slate-700">Ikon Fasilitas (Opsional)</span>
                      <select
                        value={item.icon || ''}
                        onChange={(event) => updateArrayItem('facilities', index, {
                          ...item, icon: event.target.value,
                        })}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
                      >
                        {item.icon && !CMS_FACILITY_ICONS.some(([value]) => value === item.icon) && (
                          <option value={item.icon}>Ikon lama: {item.icon}</option>
                        )}
                        {CMS_FACILITY_ICONS.map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </label>
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

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700">Jam Kunjungan</p>
              <div className="flex flex-wrap gap-2">
                {CMS_VISITING_DAYS.map(([key, label]) => (
                  <label key={key} className="flex items-center gap-1.5 text-xs text-slate-700">
                    <input type="checkbox"
                      checked={form.contact_info.visiting_schedule.days.includes(key)}
                      onChange={(event) => {
                        const previous = form.contact_info.visiting_schedule;
                        updateVisitingSchedule({ ...previous,
                          days: event.target.checked
                            ? [...previous.days, key]
                            : previous.days.filter((day) => day !== key),
                        });
                      }}
                    /> {label}
                  </label>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs text-slate-600">Mulai
                  <input type="time" value={form.contact_info.visiting_schedule.start}
                    onChange={(event) => updateVisitingSchedule({
                      ...form.contact_info.visiting_schedule, start: event.target.value,
                    })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
                </label>
                <label className="text-xs text-slate-600">Selesai
                  <input type="time" value={form.contact_info.visiting_schedule.end}
                    onChange={(event) => updateVisitingSchedule({
                      ...form.contact_info.visiting_schedule, end: event.target.value,
                    })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
                </label>
              </div>
              <p className="text-xs text-slate-500">
                {scheduleChanged || form.contact_info.visiting_schedule.days.length
                  ? (cmsVisitLabel(form.contact_info.visiting_schedule) || 'Belum ada hari kunjungan')
                  : (form.contact_info.visiting_hours
                    ? `Jadwal lama: ${form.contact_info.visiting_hours}. Pilih hari dan jam untuk menggantinya.`
                    : 'Belum ada jam kunjungan yang ditetapkan.')}
              </p>
            </div>

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

                              <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700">Foto Pengurus (Opsional)</label>
                                <input type="file" accept="image/jpeg,image/png,image/webp"
                                  disabled={uploadingPhoto || saving}
                                  onChange={async (event) => {
                                    const file = event.target.files?.[0];
                                    if (file) await uploadMemberPhoto(groupIndex, memberIndex, file);
                                    event.target.value = '';
                                  }}
                                  className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-3 file:py-2 file:font-bold" />
                                {member.photo_url && (
                                  <img src={member.photo_url} alt={`Foto ${member.name}`}
                                    className="h-24 w-24 rounded-lg border border-slate-200 object-cover" />
                                )}
                                {member.photo && (
                                  <button type="button" disabled={uploadingPhoto || saving}
                                    className="text-xs font-semibold text-rose-600"
                                    onClick={() => {
                                      updateStructureMember(groupIndex, memberIndex, 'photo', '');
                                      updateStructureMember(groupIndex, memberIndex, 'photo_url', '');
                                    }}>
                                    Hapus Foto
                                  </button>
                                )}
                                <p className="text-[11px] text-slate-500">JPG, PNG, WebP. Maksimal 3 MB. Simpan profil setelah upload.</p>
                              </div>
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
            disabled={saving || uploadingPhoto}
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
