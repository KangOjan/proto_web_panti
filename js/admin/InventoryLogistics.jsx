// Inventory & Logistics Management Component (Admin)
const InventoryLogistics = ({ inventoryData, onToggleWishlist, onOpenAddStockModal, onUpdateStock }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('semua');

  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'semua' || item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Inventaris & Stok Logistik Panti</h2>
          <p className="text-xs text-slate-500">
            Pendataan stok bahan makanan, pakaian, & alat tulis sekolah. Dilengkapi kontrol wishlist publik.
          </p>
        </div>

        <button
          onClick={onOpenAddStockModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-2 shrink-0"
        >
          <LucideIcon name="package-plus" className="w-4 h-4" />
          <span>Tambah Item Stok Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <LucideIcon name="search" className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nama barang, kode logistik..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500"
        >
          <option value="semua">Semua Kategori (Sembako/Pendidikan/Kebersihan)</option>
          <option value="sembako">Sembako</option>
          <option value="pendidikan">Pendidikan</option>
          <option value="pakaian & kebersihan">Pakaian & Kebersihan</option>
          <option value="kesehatan">Kesehatan</option>
        </select>
      </div>

      {/* Inventory Table with Toggle Switch */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse custom-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th>Kode & Nama Barang</th>
                <th>Kategori</th>
                <th>Stok Saat Ini</th>
                <th>Batas Min Stok</th>
                <th>Status Stok</th>
                <th className="text-center">Tampilkan di Wishlist Publik</th>
                <th className="text-right">Kelola Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map(item => {
                const isLowStock = item.stock <= item.minStock;

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{item.code}</div>
                    </td>
                    <td>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold text-slate-900 text-sm">
                        {item.stock} {item.unit}
                      </span>
                    </td>
                    <td className="text-xs text-slate-500">
                      {item.minStock} {item.unit}
                    </td>
                    <td>
                      {isLowStock ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold flex items-center space-x-1 w-fit">
                          <LucideIcon name="alert-triangle" className="w-3.5 h-3.5 text-amber-600" />
                          <span>Stok Menipis</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold w-fit">
                          Aman
                        </span>
                      )}
                    </td>

                    {/* CONTROL TOGGLE SWITCH TO PUBLIC WISHLIST */}
                    <td className="text-center">
                      <button
                        onClick={() => onToggleWishlist(item.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center space-x-1.5 mx-auto ${
                          item.showOnWishlist
                            ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                        title="Klik untuk mengubah visibilitas di Wishlist Publik"
                      >
                        <LucideIcon name={item.showOnWishlist ? "eye" : "eye-off"} className="w-3.5 h-3.5" />
                        <span>{item.showOnWishlist ? "Tampil di Wishlist" : "Tersembunyi"}</span>
                      </button>
                    </td>

                    <td className="text-right space-x-1">
                      <button
                        onClick={() => onUpdateStock(item.id, 5)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold"
                        title="+5 Stok"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => onUpdateStock(item.id, -5)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                        title="-5 Stok"
                      >
                        -5
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

window.InventoryLogistics = InventoryLogistics;
