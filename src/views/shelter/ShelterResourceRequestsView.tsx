import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Truck, 
  Plus, 
  CheckCircle2, 
  Send
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';

export const ShelterResourceRequestsView: React.FC = () => {
  const { 
    selectedShelterNode, 
    shelterNodes, 
    restockOrders, 
    requestShelterRestock, 
    updateRestockOrderStatus,
    setActiveTab 
  } = useDisaster();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [itemName, setItemName] = useState('Chlorine Water Purification Tablets');
  const [category, setCategory] = useState('WATER');
  const [quantity, setQuantity] = useState<number>(5000);
  const [unit, setUnit] = useState('tablets');
  const [urgency, setUrgency] = useState<'IMMEDIATE_4H' | 'URGENT_12H' | 'ROUTINE_24H'>('IMMEDIATE_4H');
  const [reason, setReason] = useState('Water reservoir contaminated by flood backflow. Need immediate treatment.');

  const shelter = selectedShelterNode || shelterNodes[0];

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    requestShelterRestock({
      shelterId: shelter?.id || 'SH-GHY-001',
      shelterName: shelter?.name || 'Pandu Relief Camp #1',
      district: shelter?.district || 'Kamrup Metropolitan',
      zoneId: shelter?.zoneId || 'Z-GHY-W-01',
      items: [{ name: itemName, category, quantity, unit }],
      urgency,
      reason,
      requestedBy: shelter?.officerInCharge || 'Camp Commander'
    });

    setIsModalOpen(false);
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
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
        >
          <Plus size={15} />
          <span>Create New Requisition</span>
        </button>
      </div>

      {/* Hero Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
            District Supply Chain Requisitions
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Outbound Supply Requisitions to DDMA
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Formal supply requisitions dispatched from <strong className="text-white">{shelter?.name}</strong> to Guwahati Central Logistics Depot.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-bold border border-blue-800 flex items-center gap-1.5">
            <Truck size={14} />
            <span>{restockOrders.length} Tracked Orders</span>
          </span>
        </div>
      </div>

      {/* Order Cards List */}
      <div className="space-y-4">
        {restockOrders.map((order) => {
          const isDispatched = order.status === 'DISPATCHED';
          const isDelivered = order.status === 'DELIVERED';

          return (
            <div
              key={order.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-400">{order.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    order.urgency === 'IMMEDIATE_4H' ? 'bg-red-950 text-red-300 border border-red-800' :
                    'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {order.urgency.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                    isDelivered ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    isDispatched ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                    'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    STATUS: {order.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Items List in Order */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Requested Commodities:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <strong className="text-xs text-white block">{item.name}</strong>
                        <span className="text-[10px] text-slate-500">{item.category}</span>
                      </div>
                      <strong className="text-sm font-mono text-purple-300 font-bold">
                        {item.quantity.toLocaleString()} {item.unit}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <strong>Justification:</strong> {order.reason}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
                <div>
                  Requested by: <strong className="text-white">{order.requestedBy}</strong> ({order.createdAt})
                </div>

                {isDispatched && !isDelivered && (
                  <button
                    onClick={() => updateRestockOrderStatus(order.id, 'DELIVERED')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={13} />
                    <span>Confirm Delivery at Gate ✓</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">Create DDMA Supply Order</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Item / Commodity Name</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="RATIONS">Rations</option>
                    <option value="WATER">Water</option>
                    <option value="MEDICAL">Medical</option>
                    <option value="POWER">Power</option>
                    <option value="BEDDING">Bedding</option>
                    <option value="HYGIENE">Hygiene</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Urgency Priority</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  <option value="IMMEDIATE_4H">Immediate (Within 4 Hours) — Life Risk</option>
                  <option value="URGENT_12H">Urgent (Within 12 Hours)</option>
                  <option value="ROUTINE_24H">Routine (Within 24 Hours)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Reason / Depletion Context</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl cursor-pointer shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  <span>Transmit Supply Order to District HQ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
