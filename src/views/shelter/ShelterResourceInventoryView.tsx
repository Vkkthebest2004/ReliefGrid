import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Truck
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';
import type { ShelterInventoryItem } from '../../types';

export const ShelterResourceInventoryView: React.FC = () => {
  const { 
    selectedShelterNode, 
    shelterNodes, 
    updateShelterInventoryItem, 
    setActiveTab, 
    requestShelterRestock 
  } = useDisaster();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [editingItem, setEditingItem] = useState<ShelterInventoryItem | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);

  const shelter = selectedShelterNode || shelterNodes[0];

  if (!shelter) return <div className="p-8 text-center text-slate-400">Loading shelter stock…</div>;

  const filteredItems = shelter.inventory.filter((item) => {
    const matchCat = activeCategory === 'ALL' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateShelterInventoryItem(shelter.id, editingItem.id, newQuantity);
      setEditingItem(null);
    }
  };

  const handleQuickRestockRequest = (item: ShelterInventoryItem) => {
    requestShelterRestock({
      shelterId: shelter.id,
      shelterName: shelter.name,
      district: shelter.district,
      zoneId: shelter.zoneId,
      items: [{ name: item.name, quantity: item.minThreshold * 2, unit: item.unit, category: item.category }],
      urgency: item.status === 'CRITICAL_DEFICIT' ? 'IMMEDIATE_4H' : 'URGENT_12H',
      reason: `Automated re-order: Current stock of ${item.quantity} ${item.unit} is below minimum safe threshold.`,
      requestedBy: shelter.officerInCharge
    });
    setActiveTab('shelter-requests');
  };

  return (
    <div className="space-y-6 pb-20 font-body-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('shelter-dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('shelter-requests')}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
        >
          <Truck size={15} />
          <span>Create Supply Requisition to DDMA</span>
        </button>
      </div>

      {/* Hero Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
            Shelter Logistics Node
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Resource Inventory & Stock Levels
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time stock monitoring for <strong className="text-white">{shelter.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Potable Water</span>
            <strong className="text-sm font-mono text-blue-400">{shelter.waterReservesLiters.toLocaleString()} L</strong>
          </div>
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Ration Supply</span>
            <strong className="text-sm font-mono text-emerald-400">{shelter.rationDaysRemaining} Days</strong>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['ALL', 'RATIONS', 'WATER', 'MEDICAL', 'POWER', 'BEDDING', 'HYGIENE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commodities..."
            className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isCrit = item.status === 'CRITICAL_DEFICIT';
          const isLow = item.status === 'LOW';
          const ratio = Math.min(100, Math.round((item.quantity / (item.minThreshold * 2)) * 100));

          return (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                    {item.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isCrit ? 'bg-red-950 text-red-300 border border-red-800' :
                    isLow ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Min Safe Threshold: {item.minThreshold} {item.unit}
                </p>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Current Stock:</span>
                    <strong className={`text-sm ${isCrit ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-white'}`}>
                      {item.quantity} {item.unit}
                    </strong>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        isCrit ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex gap-2">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setNewQuantity(item.quantity);
                  }}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Edit Count
                </button>

                {(isCrit || isLow) && (
                  <button
                    onClick={() => handleQuickRestockRequest(item)}
                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-md shadow-purple-600/20"
                  >
                    Reorder Stock
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Count Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Update Stock: {editingItem.name}</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleUpdateStock} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">New Verified Quantity ({editingItem.unit})</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-base focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-2.5 bg-slate-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold cursor-pointer shadow-lg shadow-purple-600/20"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
