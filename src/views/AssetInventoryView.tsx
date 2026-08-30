import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../context/DisasterContext';
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  Pill, 
  Utensils, 
  Droplet, 
  X,
  Search,
  CheckCircle2,
  Package
} from 'lucide-react';

interface AssetItem {
  id: string;
  name: string;
  category: 'MEDICAL' | 'FOOD' | 'WATER';
  totalStock: number;
  reserved: number;
  inTransit: number;
  available: number;
  unit: string;
  status: 'High Stock' | 'Medium Stock' | 'Low Stock';
  iconName?: string;
}

const DEFAULT_ASSETS: AssetItem[] = [
  // Medical Supplies
  { id: 'med-1', name: 'Paracetamol Tablets', category: 'MEDICAL', totalStock: 12500, reserved: 2000, inTransit: 1500, available: 9000, unit: 'Tablets', status: 'High Stock', iconName: 'pill' },
  { id: 'med-2', name: 'OR Saline Bottles', category: 'MEDICAL', totalStock: 8200, reserved: 1200, inTransit: 800, available: 6200, unit: 'Bottles', status: 'High Stock', iconName: 'water' },
  { id: 'med-3', name: 'Antibiotic Capsules', category: 'MEDICAL', totalStock: 6750, reserved: 1500, inTransit: 750, available: 4500, unit: 'Capsules', status: 'Medium Stock', iconName: 'capsule' },
  { id: 'med-4', name: 'Bandages', category: 'MEDICAL', totalStock: 15000, reserved: 3000, inTransit: 2000, available: 10000, unit: 'Units', status: 'High Stock', iconName: 'bandage' },
  { id: 'med-5', name: 'Syringes (5ml)', category: 'MEDICAL', totalStock: 20000, reserved: 4000, inTransit: 3000, available: 13000, unit: 'Units', status: 'High Stock', iconName: 'syringe' },
  { id: 'med-6', name: 'IV Fluids', category: 'MEDICAL', totalStock: 7100, reserved: 900, inTransit: 600, available: 5600, unit: 'Bottles', status: 'Medium Stock', iconName: 'iv' },
  { id: 'med-7', name: 'Pain Relief Spray', category: 'MEDICAL', totalStock: 2500, reserved: 300, inTransit: 200, available: 2000, unit: 'Units', status: 'Low Stock', iconName: 'spray' },
  { id: 'med-8', name: 'Glucose Powder', category: 'MEDICAL', totalStock: 3400, reserved: 500, inTransit: 300, available: 2600, unit: 'Packets', status: 'Medium Stock', iconName: 'glucose' },

  // Food Items
  { id: 'food-1', name: 'Rice', category: 'FOOD', totalStock: 18000, reserved: 4000, inTransit: 2000, available: 12000, unit: 'Kg', status: 'High Stock' },
  { id: 'food-2', name: 'Pulses (Dal)', category: 'FOOD', totalStock: 6500, reserved: 1500, inTransit: 500, available: 4500, unit: 'Kg', status: 'Medium Stock' },
  { id: 'food-3', name: 'Biscuits', category: 'FOOD', totalStock: 22000, reserved: 5000, inTransit: 3000, available: 14000, unit: 'Packets', status: 'High Stock' },
  { id: 'food-4', name: 'Instant Noodles', category: 'FOOD', totalStock: 12000, reserved: 2000, inTransit: 1000, available: 9000, unit: 'Packets', status: 'High Stock' },

  // Fresh Water
  { id: 'water-1', name: 'Packaged Water Bottles (1L)', category: 'WATER', totalStock: 45000, reserved: 10000, inTransit: 5000, available: 30000, unit: 'Bottles', status: 'High Stock' },
  { id: 'water-2', name: 'Water Cans (20L)', category: 'WATER', totalStock: 2500, reserved: 500, inTransit: 300, available: 1700, unit: 'Cans', status: 'Medium Stock' },
  { id: 'water-3', name: 'Water Tanker Supply (1000L)', category: 'WATER', totalStock: 80000, reserved: 20000, inTransit: 10000, available: 50000, unit: 'Liters', status: 'High Stock' },
];

export const AssetInventoryView: React.FC = () => {
  const { setActiveTab } = useDisaster();
  const [assets, setAssets] = useState<AssetItem[]>(DEFAULT_ASSETS);
  const [activeTabCategory, setActiveTabCategory] = useState<'MEDICAL' | 'FOOD' | 'WATER'>('MEDICAL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [lastUpdated] = useState('30 Aug 2026, 14:30 IST');

  // New Asset Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'MEDICAL' as 'MEDICAL' | 'FOOD' | 'WATER',
    totalStock: 5000,
    unit: 'Units'
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
    }
  }, []);

  // Compute live category sums for the 3 top KPI cards
  const medicalSum = assets
    .filter(a => a.category === 'MEDICAL')
    .reduce((acc, curr) => acc + curr.totalStock, 0);

  const foodSum = assets
    .filter(a => a.category === 'FOOD')
    .reduce((acc, curr) => acc + curr.totalStock, 0);

  const waterSum = assets
    .filter(a => a.category === 'WATER')
    .reduce((acc, curr) => acc + curr.totalStock, 0);

  // Filter items for main active tab
  const activeCategoryItems = assets.filter(item => {
    const matchesCategory = item.category === activeTabCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Food summary items
  const foodItems = assets.filter(a => a.category === 'FOOD');
  // Water summary items
  const waterItems = assets.filter(a => a.category === 'WATER');

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const total = Number(formData.totalStock);
    const reserved = Math.round(total * 0.2);
    const inTransit = Math.round(total * 0.1);
    const available = total - reserved - inTransit;

    const newAsset: AssetItem = {
      id: `asset-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category,
      totalStock: total,
      reserved,
      inTransit,
      available,
      unit: formData.unit || 'Units',
      status: available > total * 0.5 ? 'High Stock' : available > total * 0.2 ? 'Medium Stock' : 'Low Stock'
    };

    setAssets(prev => [newAsset, ...prev]);
    setShowAddModal(false);
    setFormData({
      name: '',
      category: 'MEDICAL',
      totalStock: 5000,
      unit: 'Units'
    });
  };

  const handleDeleteAsset = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from inventory?`)) {
      setAssets(prev => prev.filter(a => a.id !== id));
    }
  };

  const getStatusPill = (status: AssetItem['status']) => {
    switch (status) {
      case 'High Stock':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md">High Stock</span>;
      case 'Medium Stock':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md">Medium Stock</span>;
      case 'Low Stock':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md">Low Stock</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md">{status}</span>;
    }
  };

  return (
    <div ref={containerRef} className="w-full space-y-6 select-none font-body-md text-on-background">
      
      {/* 1. TOP HEADER & METADATA BAR */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">
            Resource Assets & Inventory
          </h1>
          <p className="text-xs text-on-surface-variant">
            Live stockpile availability across state depots and emergency response hubs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-on-surface-variant flex items-center gap-2">
            <span>Last Updated: {lastUpdated}</span>
            <button 
              onClick={() => setAssets([...DEFAULT_ASSETS])}
              className="bg-surface hover:bg-surface-container border border-outline-variant px-2.5 py-1 rounded-lg text-primary text-xs font-bold font-mono flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset sample inventory data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* 2. TOP 3 KPI CARDS WITH SPARKLINES (Pixel-matched to reference) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Medical Supplies Card */}
        <div className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-on-surface-variant uppercase font-mono tracking-wider">Medical Supplies</div>
              <div className="font-display-lg text-[26px] font-black text-primary font-mono mt-0.5">
                {medicalSum.toLocaleString()}
              </div>
              <div className="text-[11px] text-on-surface-variant font-mono">items in stock</div>
            </div>
          </div>
          {/* Blue Sparkline */}
          <div className="w-20 h-10">
            <svg viewBox="0 0 70 30" className="w-full h-full stroke-blue-500 fill-none stroke-2">
              <path d="M0 22 L15 16 L30 24 L45 8 L60 14 L70 10" />
            </svg>
          </div>
        </div>

        {/* Food Items Card */}
        <div className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-on-surface-variant uppercase font-mono tracking-wider">Food Items</div>
              <div className="font-display-lg text-[26px] font-black text-primary font-mono mt-0.5">
                {foodSum.toLocaleString()}
              </div>
              <div className="text-[11px] text-on-surface-variant font-mono">units in stock</div>
            </div>
          </div>
          {/* Green Sparkline */}
          <div className="w-20 h-10">
            <svg viewBox="0 0 70 30" className="w-full h-full stroke-emerald-500 fill-none stroke-2">
              <path d="M0 20 L15 24 L30 12 L45 18 L60 6 L70 12" />
            </svg>
          </div>
        </div>

        {/* Fresh Water Card */}
        <div className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-on-surface-variant uppercase font-mono tracking-wider">Fresh Water</div>
              <div className="font-display-lg text-[26px] font-black text-primary font-mono mt-0.5">
                {waterSum.toLocaleString()}
              </div>
              <div className="text-[11px] text-on-surface-variant font-mono">liters available</div>
            </div>
          </div>
          {/* Cyan Sparkline */}
          <div className="w-20 h-10">
            <svg viewBox="0 0 70 30" className="w-full h-full stroke-cyan-500 fill-none stroke-2">
              <path d="M0 25 L15 15 L30 20 L45 10 L60 16 L70 6" />
            </svg>
          </div>
        </div>

      </div>

      {/* 3. CATEGORY SWITCHER BUTTONS & SEARCH */}
      <div className="bg-surface border border-outline-variant rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 font-label-sm text-xs font-bold">
          <button
            onClick={() => setActiveTabCategory('MEDICAL')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTabCategory === 'MEDICAL'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
          >
            <Pill className="w-4 h-4 text-blue-600" />
            <span>Medical Supplies</span>
          </button>

          <button
            onClick={() => setActiveTabCategory('FOOD')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTabCategory === 'FOOD'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
          >
            <Utensils className="w-4 h-4 text-emerald-600" />
            <span>Food Items</span>
          </button>

          <button
            onClick={() => setActiveTabCategory('WATER')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTabCategory === 'WATER'
                ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
          >
            <Droplet className="w-4 h-4 text-cyan-600" />
            <span>Fresh Water</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-surface-container-low border border-outline-variant rounded-xl pl-9 pr-3.5 py-1.5 text-xs font-mono text-on-surface placeholder:text-on-surface-variant/60 focus:outline-hidden focus:border-primary"
          />
        </div>
      </div>

      {/* 4. MAIN CATEGORY ASSET TABLE (Matches Screenshot Layout) */}
      <div className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="font-headline-sm text-headline-sm font-bold text-primary">
              {activeTabCategory === 'MEDICAL' ? 'Medical Supplies Stock' : activeTabCategory === 'FOOD' ? 'Food Items Stock' : 'Fresh Water Supplies'}
            </h2>
          </div>
          <span className="text-xs font-mono text-on-surface-variant">
            {activeCategoryItems.length} items listed
          </span>
        </div>

        <div className="overflow-x-auto border border-outline-variant rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse font-body-sm">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant">
                <th className="py-3 px-4 font-bold">Item</th>
                <th className="py-3 px-3 font-bold text-right">Total Stock</th>
                <th className="py-3 px-3 font-bold text-right text-on-surface-variant">Reserved</th>
                <th className="py-3 px-3 font-bold text-right text-secondary">In Transit</th>
                <th className="py-3 px-3 font-bold text-right text-emerald-700 font-bold">Available</th>
                <th className="py-3 px-3 font-bold">Unit</th>
                <th className="py-3 px-3 font-bold text-center">Status</th>
                <th className="py-3 px-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {activeCategoryItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-on-surface-variant font-mono">
                    No items in this category. Click <strong>"Add Asset"</strong> to create one.
                  </td>
                </tr>
              ) : (
                activeCategoryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-4 font-bold text-primary">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-surface-container-high flex items-center justify-center text-primary text-xs shrink-0">
                          <span className="material-symbols-outlined text-[14px]">
                            {item.category === 'MEDICAL' ? 'medical_services' : item.category === 'FOOD' ? 'inventory_2' : 'water_drop'}
                          </span>
                        </span>
                        <span className="font-semibold text-primary">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold">{item.totalStock.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono text-on-surface-variant">{item.reserved.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono text-secondary font-semibold">{item.inTransit.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 bg-emerald-50/40">
                      {item.available.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-on-surface-variant">{item.unit}</td>
                    <td className="py-3 px-3 text-center">
                      {getStatusPill(item.status)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDeleteAsset(item.id, item.name)}
                        className="p-1 text-error/60 hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="text-center pt-1">
          <button 
            onClick={() => setActiveTab('allocation-planner')}
            className="text-primary hover:underline text-xs font-bold font-mono inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All Resource Allocations →</span>
          </button>
        </div>
      </div>

      {/* 5. BOTTOM DUAL SUMMARY TABLES (Matches Reference Image) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Food Items Stock Summary Table */}
        <div className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-center border-b border-outline-variant pb-2.5">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <Utensils className="w-4 h-4" />
              <h3 className="font-headline-sm text-sm font-bold text-primary">Food Items Stock</h3>
            </div>
            <span className="text-[11px] font-mono text-on-surface-variant">{foodItems.length} items</span>
          </div>

          <div className="overflow-x-auto border border-outline-variant rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse font-body-sm">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant text-[11px] font-bold border-b border-outline-variant">
                  <th className="py-2.5 px-3">Item</th>
                  <th className="py-2.5 px-2 text-right">Total</th>
                  <th className="py-2.5 px-2 text-right">Reserved</th>
                  <th className="py-2.5 px-2 text-right">In Transit</th>
                  <th className="py-2.5 px-2 text-right text-emerald-700">Available</th>
                  <th className="py-2.5 px-2">Unit</th>
                  <th className="py-2.5 px-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 text-[11px]">
                {foodItems.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-3 font-semibold text-primary">{item.name}</td>
                    <td className="py-2 px-2 text-right font-mono">{item.totalStock.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-mono text-on-surface-variant">{item.reserved.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-mono text-secondary">{item.inTransit.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-mono font-bold text-emerald-700">{item.available.toLocaleString()}</td>
                    <td className="py-2 px-2 font-mono text-on-surface-variant">{item.unit}</td>
                    <td className="py-2 px-2 text-center">{getStatusPill(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center pt-1">
            <button 
              onClick={() => setActiveTabCategory('FOOD')}
              className="text-emerald-700 hover:underline text-[11px] font-bold font-mono inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All Food Items</span>
            </button>
          </div>
        </div>

        {/* Fresh Water Stock Summary Table */}
        <div className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-center border-b border-outline-variant pb-2.5">
            <div className="flex items-center gap-2 text-cyan-700 font-bold">
              <Droplet className="w-4 h-4" />
              <h3 className="font-headline-sm text-sm font-bold text-primary">Fresh Water Stock</h3>
            </div>
            <span className="text-[11px] font-mono text-on-surface-variant">{waterItems.length} items</span>
          </div>

          <div className="overflow-x-auto border border-outline-variant rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse font-body-sm">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant text-[11px] font-bold border-b border-outline-variant">
                  <th className="py-2.5 px-3">Item</th>
                  <th className="py-2.5 px-2 text-right">Total</th>
                  <th className="py-2.5 px-2 text-right">Reserved</th>
                  <th className="py-2.5 px-2 text-right">In Transit</th>
                  <th className="py-2.5 px-2 text-right text-emerald-700">Available</th>
                  <th className="py-2.5 px-2">Unit</th>
                  <th className="py-2.5 px-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 text-[11px]">
                {waterItems.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-3 font-semibold text-primary">{item.name}</td>
                    <td className="py-2 px-2 text-right font-mono">{item.totalStock.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-mono text-on-surface-variant">{item.reserved.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-mono text-secondary">{item.inTransit.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-mono font-bold text-emerald-700">{item.available.toLocaleString()}</td>
                    <td className="py-2 px-2 font-mono text-on-surface-variant">{item.unit}</td>
                    <td className="py-2 px-2 text-center">{getStatusPill(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center pt-1">
            <button 
              onClick={() => setActiveTabCategory('WATER')}
              className="text-cyan-700 hover:underline text-[11px] font-bold font-mono inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All Fresh Water</span>
            </button>
          </div>
        </div>

      </div>

      {/* 6. ADD ASSET MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                  Add New Asset
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-on-surface-variant hover:text-primary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-on-surface-variant font-bold mb-1 uppercase">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol Tablets, Rice 50kg, Water Cans"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 text-on-surface focus:outline-hidden focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1 uppercase">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as 'MEDICAL' | 'FOOD' | 'WATER' })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 text-on-surface focus:outline-hidden focus:border-primary"
                  >
                    <option value="MEDICAL">Medical Supplies</option>
                    <option value="FOOD">Food Items</option>
                    <option value="WATER">Fresh Water</option>
                  </select>
                </div>

                <div>
                  <label className="block text-on-surface-variant font-bold mb-1 uppercase">Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tablets, Bottles, Kg, Liters"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 text-on-surface focus:outline-hidden focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-on-surface-variant font-bold mb-1 uppercase">Total Stock Quantity</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.totalStock}
                  onChange={(e) => setFormData({ ...formData, totalStock: Number(e.target.value) })}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 text-on-surface focus:outline-hidden focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-surface-container text-on-surface-variant rounded-xl hover:bg-surface-container-high cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary rounded-xl hover:bg-primary-container cursor-pointer font-bold shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Asset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
