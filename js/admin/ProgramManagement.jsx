const ProgramManagement = ({
  priorityPrograms,
  campaignLoading = false,
  campaignError = null,
  onSaveProgram,
  onDeactivateProgram,
  currentUser,
}) => {
  const [isModalOpen, setIsModalOpen] =
    React.useState(false);

  const [editingProg, setEditingProg] =
    React.useState(null);

  const [deactivateConfirmId, setDeactivateConfirmId] =
    React.useState(null);

  const [categories, setCategories] =
    React.useState([]);

  const [categoriesLoading, setCategoriesLoading] =
    React.useState(false);

  const [saving, setSaving] =
    React.useState(false);

  const [title, setTitle] =
    React.useState('');

  const [categoryId, setCategoryId] =
    React.useState('');

  const [targetAmount, setTargetAmount] =
    React.useState(15000000);

  const [deadline, setDeadline] =
    React.useState('');

  const [description, setDescription] =
    React.useState('');

  const [headerImageUrl, setHeaderImageUrl] =
    React.useState('');

  const [status, setStatus] =
    React.useState('active');
  React.useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);

        const response =
          await CampaignApi.getCategories();

        if (cancelled) return;

        const data = Array.isArray(response.data)
          ? response.data
          : [];

        setCategories(data);

        if (
          !categoryId &&
          data.length > 0
        ) {
          setCategoryId(String(data[0].id));
        }
      } catch (error) {
        console.error(
          'Failed to load campaign categories:',
          error
        );
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => {
    setEditingProg(null);
    setTitle('');

    setCategoryId(
      categories.length > 0
        ? String(categories[0].id)
        : ''
    );

    setTargetAmount(15000000);
    setDeadline('');
    setDescription('');
    setHeaderImageUrl('');
    setStatus('active');
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (program) => {
    setEditingProg(program);

    setTitle(program.title || '');

    setCategoryId(
      program.categoryId
        ? String(program.categoryId)
        : ''
    );

    setTargetAmount(
      Number(program.targetAmount || 0)
    );

    setDeadline(
      program.deadline
        ? String(program.deadline).substring(0, 10)
        : ''
    );

    setDescription(
      program.description || ''
    );

    setHeaderImageUrl(
      program.headerImageUrl || ''
    );

    setStatus(
      program.status || 'inactive'
    );

    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      alert(
        'Judul program wajib diisi.'
      );
      return;
    }

    if (!categoryId) {
      alert(
        'Kategori program wajib dipilih.'
      );
      return;
    }

    if (!description.trim()) {
      alert(
        'Deskripsi program wajib diisi.'
      );
      return;
    }

    if (
      Number(targetAmount) < 100000
    ) {
      alert(
        'Target dana minimal Rp100.000.'
      );
      return;
    }

    if (!deadline) {
      alert(
        'Batas waktu program wajib diisi.'
      );
      return;
    }

    const selectedCategory =
      categories.find(
        (category) =>
          String(category.id) ===
          String(categoryId)
      );

    const payload = {
      id: editingProg?.id || null,

      categoryId:
        Number(categoryId),

      category:
        selectedCategory?.name ||
        editingProg?.category ||
        'Lainnya',

      title: title.trim(),

      targetAmount:
        Number(targetAmount),

      deadline,

      description:
        description.trim(),

      headerImageUrl:
        headerImageUrl.trim(),

      status,
    };

    try {
      setSaving(true);

      const result =
        await onSaveProgram(payload);

      if (result?.success) {
        setIsModalOpen(false);
        resetForm();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateConfirmId) {
      return;
    }

    try {
      setSaving(true);

      const result =
        await onDeactivateProgram(
          deactivateConfirmId
        );

      if (result?.success) {
        setDeactivateConfirmId(null);
      }
    } finally {
      setSaving(false);
    }
  };

  const totalPrograms =
    priorityPrograms.length;

  const activeCount =
    priorityPrograms.filter(
      (program) =>
        program.status === 'active'
    ).length;

  const totalTarget =
    priorityPrograms.reduce(
      (sum, program) =>
        sum +
        Number(
          program.targetAmount || 0
        ),
      0
    );

  const totalCollected =
    priorityPrograms.reduce(
      (sum, program) =>
        sum +
        Number(
          program.collectedAmount || 0
        ),
      0
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">

      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <LucideIcon name="layers" className="w-4 h-4 text-emerald-400" />

            <span>
              Ruang Kerja: Pengurus Harian
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
            Manajemen Program Prioritas Panti
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mt-1 leading-relaxed">
            Kelola program prioritas panti.
            Program berstatus Aktif akan
            ditampilkan pada halaman publik.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          disabled={categoriesLoading}
          className="px-5 py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black rounded-2xl text-xs shadow-lg flex items-center space-x-2"
        >
          <LucideIcon name="plus-circle" className="w-4 h-4" />

          <span>
            Tambah Program Prioritas
          </span>
        </button>
      </div>

      {campaignError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm font-semibold">
          {campaignError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-3xl border border-slate-200">
          <div className="text-xs font-extrabold text-slate-500 uppercase">
            Total Program
          </div>

          <div className="text-2xl font-black text-slate-900 mt-1">
            {totalPrograms} Program
          </div>
        </div>

        <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-200">
          <div className="text-xs font-extrabold text-emerald-800 uppercase">
            Program Aktif
          </div>

          <div className="text-2xl font-black text-emerald-700 mt-1">
            {activeCount} Program
          </div>
        </div>

        <div className="bg-teal-50 p-5 rounded-3xl border border-teal-200">
          <div className="text-xs font-extrabold text-teal-800 uppercase">
            Total Target Dana
          </div>

          <div className="text-xl font-black text-teal-700 mt-1">
            Rp {totalTarget.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-3xl">
          <div className="text-xs font-extrabold text-amber-400 uppercase">
            Total Terhimpun
          </div>

          <div className="text-xl font-black mt-1">
            Rp {totalCollected.toLocaleString('id-ID')}
          </div>

          <div className="text-[11px] text-slate-400 mt-1">
            Akan dihitung otomatis dari donasi
            terverifikasi.
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden p-6">

        <div className="flex items-center justify-between border-b border-slate-100 pb-4">

          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Daftar Program Prioritas Panti
            </h3>

            <p className="text-xs text-slate-500">
              Program tidak dihapus permanen.
              Gunakan status nonaktif untuk
              mengarsipkan program.
            </p>
          </div>

          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {priorityPrograms.length}
            {' '}Program
          </span>
        </div>

        <div className="overflow-x-auto mt-4">

          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">
                  Program & Kategori
                </th>

                <th className="py-3.5 px-4">
                  Deskripsi
                </th>

                <th className="py-3.5 px-4">
                  Target Dana
                </th>

                <th className="py-3.5 px-4">
                  Terhimpun
                </th>

                <th className="py-3.5 px-4">
                  Status
                </th>

                <th className="py-3.5 px-4 text-right">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">

              {campaignLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-12 text-slate-400"
                  >
                    Memuat program...
                  </td>
                </tr>
              ) : priorityPrograms.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-12 text-slate-400"
                  >
                    Belum ada program prioritas.
                  </td>
                </tr>
              ) : (
                priorityPrograms.map(
                  (program) => (
                    <tr
                      key={program.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900">
                          {program.title}
                        </div>

                        <div className="text-[10px] text-emerald-700 mt-1">
                          {program.category}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="max-w-xs line-clamp-2 text-slate-600">
                          {program.description}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold whitespace-nowrap">
                        Rp{' '}
                        {Number(
                          program.targetAmount || 0
                        ).toLocaleString('id-ID')}
                      </td>

                      <td className="py-3.5 px-4 font-black text-emerald-700 whitespace-nowrap">
                        Rp{' '}
                        {Number(
                          program.collectedAmount || 0
                        ).toLocaleString('id-ID')}
                      </td>

                      <td className="py-3.5 px-4">

                        {program.status === 'active' ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            Aktif
                          </span>
                        ) : program.status === 'draft' ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
                            Draft
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold">
                            Nonaktif
                          </span>
                        )}

                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleOpenEditModal(
                                program
                              )
                            }
                            className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg"
                            title="Edit Program"
                          >
                            <LucideIcon name="pencil" className="w-4 h-4" />
                          </button>

                          {program.status !==
                            'inactive' && (
                            <button
                              type="button"
                              onClick={() =>
                                setDeactivateConfirmId(
                                  program.id
                                )
                              }
                              className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-lg"
                              title="Nonaktifkan Program"
                            >
                              <LucideIcon name="archive" className="w-4 h-4" />
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  )
                )
              )}

            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">

          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">

            <button
              type="button"
              onClick={() =>
                setIsModalOpen(false)
              }
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100"
            >
              <LucideIcon name="x" className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900">
              {editingProg
                ? 'Edit Program Prioritas'
                : 'Tambah Program Prioritas'}
            </h3>

            <p className="text-xs text-slate-500 mt-1 mb-6">
              Data akan disimpan ke server SIMK-Panti.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div>
                <label className="block text-xs font-bold mb-1">
                  Judul Program *
                </label>

                <input
                  type="text"
                  required
                  maxLength="255"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  Kategori *
                </label>

                <select
                  required
                  value={categoryId}
                  onChange={(event) =>
                    setCategoryId(
                      event.target.value
                    )
                  }
                  disabled={categoriesLoading}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="">
                    Pilih kategori
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-bold mb-1">
                    Target Dana *
                  </label>

                  <input
                    type="number"
                    required
                    min="100000"
                    step="1000"
                    value={targetAmount}
                    onChange={(event) =>
                      setTargetAmount(
                        event.target.value
                      )
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">
                    Batas Waktu *
                  </label>

                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(event) =>
                      setDeadline(
                        event.target.value
                      )
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  URL Gambar Header
                </label>

                <input
                  type="url"
                  value={headerImageUrl}
                  onChange={(event) =>
                    setHeaderImageUrl(
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  Deskripsi *
                </label>

                <textarea
                  rows="4"
                  required
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  Status Program *
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="draft">
                    Draft
                  </option>

                  <option value="active">
                    Aktif
                  </option>

                  <option value="inactive">
                    Nonaktif
                  </option>
                </select>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">

                <div className="text-xs font-bold text-slate-700">
                  Dana Terkumpul
                </div>

                <div className="text-lg font-black text-emerald-700 mt-1">
                  Rp{' '}
                  {Number(
                    editingProg?.collectedAmount ||
                      0
                  ).toLocaleString('id-ID')}
                </div>

                <div className="text-[11px] text-slate-500 mt-1">
                  Nilai ini tidak dapat diedit secara manual.
                  Nantinya dihitung dari donasi/payment
                  yang sudah terverifikasi.
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">

                <button
                  type="button"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                  className="px-5 py-2.5 text-xs font-bold rounded-xl hover:bg-slate-100"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-black"
                >
                  {saving
                    ? 'Menyimpan...'
                    : editingProg
                    ? 'Simpan Perubahan'
                    : 'Tambah Program'}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {deactivateConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">

            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
              <LucideIcon name="archive" className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold mt-4">
              Nonaktifkan Program?
            </h3>

            <p className="text-xs text-slate-500 mt-2">
              Program tidak dihapus dari database,
              tetapi tidak akan ditampilkan lagi
              pada halaman publik.
            </p>

            <div className="flex gap-2 mt-6">

              <button
                type="button"
                onClick={() =>
                  setDeactivateConfirmId(null)
                }
                className="w-1/2 py-2.5 bg-slate-100 rounded-xl text-xs font-bold"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleDeactivate}
                className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-black"
              >
                Nonaktifkan
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

window.ProgramManagement =
  ProgramManagement;