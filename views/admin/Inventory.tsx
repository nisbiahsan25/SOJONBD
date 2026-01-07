
import React, { useState } from 'react';
import { useApp } from '../../store';
import { Plus, Edit, Trash2, AlertTriangle, Package, X } from 'lucide-react';

const Inventory: React.FC = () => {
  const { inventory, addInventory, updateInventory, deleteInventory } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({
    item: '',
    category: 'Medicine',
    stock: 0,
    unit: 'Units',
    lowStockLimit: 10
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    addInventory({
      ...newItem,
      id: `I${Date.now()}`
    });
    setNewItem({
      item: '',
      category: 'Medicine',
      stock: 0,
      unit: 'Units',
      lowStockLimit: 10
    });
    setShowAdd(false);
  };

  const inputClasses = "w-full px-4 py-2 bg-white border-2 border-gray-200 text-gray-900 rounded-lg outline-none focus:border-dark-green focus:ring-0 transition-all font-semibold shadow-sm";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-500 font-medium">Manage medical and operational supplies</p>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-yellow-accent text-dark-green px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all"
        >
          {showAdd ? <X size={20} /> : <Plus size={20} />}
          {showAdd ? 'Cancel' : 'Add New Item'}
        </button>
      </div>

      {/* Add Item Form */}
      {showAdd && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 animate-in zoom-in duration-200">
          <h3 className="text-xl font-black mb-6 text-gray-900">Register New Stock Item</h3>
          <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
            <div className="lg:col-span-1">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Item Name</label>
              <input 
                required 
                className={inputClasses}
                value={newItem.item}
                onChange={e => setNewItem({...newItem, item: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Category</label>
              <select 
                className={inputClasses}
                value={newItem.category}
                onChange={e => setNewItem({...newItem, category: e.target.value})}
              >
                <option value="Medicine">Medicine</option>
                <option value="Equipment">Equipment</option>
                <option value="Safety">Safety</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Stock</label>
                <input 
                  type="number" 
                  className={inputClasses}
                  value={newItem.stock}
                  onChange={e => setNewItem({...newItem, stock: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Unit</label>
                <input 
                  className={inputClasses}
                  placeholder="e.g. Tabs"
                  value={newItem.unit}
                  onChange={e => setNewItem({...newItem, unit: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Low Limit</label>
              <input 
                type="number" 
                className={inputClasses}
                value={newItem.lowStockLimit}
                onChange={e => setNewItem({...newItem, lowStockLimit: parseInt(e.target.value)})}
              />
            </div>
            <button type="submit" className="bg-dark-green text-white py-2.5 rounded-xl font-black hover:bg-emerald-900 shadow-md transition-all">
              SAVE ITEM
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Item Name</th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Stock Level</th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventory.map((item) => {
              const isLow = item.stock <= item.lowStockLimit;
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                        <Package size={18} />
                      </div>
                      <span className="font-bold text-gray-900">{item.item}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">{item.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                        {item.stock} {item.unit}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {isLow ? (
                      <span className="flex items-center gap-1 text-[10px] font-black text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full w-fit uppercase tracking-widest">
                        <AlertTriangle size={12} /> Low Stock
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full w-fit uppercase tracking-widest">
                        Healthy
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button className="p-2 text-dark-green hover:bg-emerald-50 rounded-lg transition-all"><Edit size={16} /></button>
                      <button onClick={() => deleteInventory(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
