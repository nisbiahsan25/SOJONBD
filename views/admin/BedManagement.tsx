
import React, { useState } from 'react';
import { useApp } from '../../store';
import { BedDouble, CheckCircle2, XCircle, Plus, X, Filter, Hammer } from 'lucide-react';
import { Bed } from '../../types';

const BedManagement: React.FC = () => {
  const { beds, patients, addBed, updateBed } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [newBed, setNewBed] = useState({ bedNo: '', room: '' });

  const handleAddBed = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `B${Date.now().toString().slice(-4)}`;
    addBed({
      id,
      bedNo: newBed.bedNo,
      room: newBed.room,
      status: 'Available'
    });
    setNewBed({ bedNo: '', room: '' });
    setShowAdd(false);
  };

  const handleToggle = (e: React.MouseEvent, bed: Bed) => {
    e.preventDefault();
    e.stopPropagation(); // Ensure the event doesn't bubble if there are child buttons
    
    const assignedPatient = patients.find(p => p.bedId === bed.id && p.status === 'Active');
    
    if (assignedPatient) {
      alert(`Access Denied: Bed is currently occupied by ${assignedPatient.name}. Please release the patient first.`);
      return;
    }

    const nextStatus = bed.status === 'Maintenance' ? 'Available' : 'Maintenance';
    updateBed({ ...bed, status: nextStatus });
  };

  const filteredBeds = filterAvailable 
    ? beds.filter(b => b.status === 'Available' && !patients.some(p => p.bedId === b.id && p.status === 'Active')) 
    : beds;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50 p-4 rounded-[32px] border border-gray-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setFilterAvailable(!filterAvailable)}
            className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-black transition-all border-2 ${filterAvailable ? 'bg-dark-green text-white border-dark-green shadow-xl' : 'bg-white text-gray-500 border-gray-100 hover:border-dark-green'}`}
          >
            <Filter size={18} strokeWidth={3} />
            {filterAvailable ? 'SHOWING READY BEDS' : 'ALL FACILITY BEDS'}
          </button>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-yellow-accent text-dark-green px-10 py-3 rounded-2xl font-black flex items-center gap-3 hover:shadow-2xl hover:-translate-y-1 transition-all shadow-xl shadow-yellow-100"
        >
          <Plus size={24} strokeWidth={3} /> REGISTER NEW BED
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {filteredBeds.map((bed) => {
          const assignedPatient = patients.find(p => p.bedId === bed.id && p.status === 'Active');
          const isOccupied = !!assignedPatient;
          const isMaintenance = bed.status === 'Maintenance';
          
          return (
            <div 
              key={bed.id} 
              onClick={(e) => handleToggle(e, bed)}
              className={`p-8 rounded-[40px] shadow-sm border-4 transition-all cursor-pointer group hover:scale-[1.05] hover:shadow-2xl relative select-none ${
                isOccupied ? 'bg-emerald-50 border-emerald-100' : 
                isMaintenance ? 'bg-orange-50 border-orange-100' : 'bg-white border-transparent hover:border-dark-green hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl transition-all duration-500 ${
                  isOccupied ? 'bg-emerald-100 text-emerald-600' : 
                  isMaintenance ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400 group-hover:bg-dark-green group-hover:text-yellow-accent group-hover:rotate-12'
                }`}>
                  {isMaintenance ? <Hammer size={28} strokeWidth={2.5} /> : <BedDouble size={28} strokeWidth={2.5} />}
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-sm ${
                    isOccupied ? 'bg-emerald-600 text-white' : 
                    isMaintenance ? 'bg-orange-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {isOccupied ? 'Occupied' : bed.status}
                  </span>
                </div>
              </div>
              
              <h4 className="text-2xl font-black text-gray-900 tracking-tight">{bed.bedNo}</h4>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1 mb-6">{bed.room}</p>
              
              {isOccupied ? (
                <div className="pt-6 border-t border-emerald-100 flex items-center gap-4">
                   <img src={assignedPatient.photo} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md" />
                   <div className="overflow-hidden">
                      <p className="text-xs font-black text-emerald-900 truncate">{assignedPatient.name}</p>
                      <p className="text-[10px] text-emerald-600 font-black uppercase">PATIENT ID: {assignedPatient.id}</p>
                   </div>
                </div>
              ) : (
                <div className="pt-6 border-t border-gray-100 flex items-center gap-2 text-[10px] font-black text-gray-300 group-hover:text-dark-green transition-all uppercase tracking-[0.2em]">
                   <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                   Tap to Change Status
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white p-12 rounded-[50px] shadow-2xl w-full max-w-lg animate-in zoom-in duration-300 border-8 border-emerald-50">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                 <div className="bg-emerald-100 p-4 rounded-2xl text-dark-green">
                    <BedDouble size={32} />
                 </div>
                 <h3 className="text-3xl font-black text-gray-900">New Ward Bed</h3>
              </div>
              <button onClick={() => setShowAdd(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><X className="text-gray-400" size={28}/></button>
            </div>
            <form onSubmit={handleAddBed} className="space-y-8">
              <div>
                <label className="block text-[11px] font-black text-gray-400 mb-2 uppercase tracking-widest">Bed Designation (Name/ID)</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Ward-A-101"
                  className="w-full px-6 py-5 bg-[#3f3f3f] text-white placeholder:text-gray-400 border-none rounded-[24px] outline-none focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-lg"
                  value={newBed.bedNo}
                  onChange={e => setNewBed({...newBed, bedNo: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 mb-2 uppercase tracking-widest">Floor / Zone Location</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. 2nd Floor - Rehab Zone"
                  className="w-full px-6 py-5 bg-[#3f3f3f] text-white placeholder:text-gray-400 border-none rounded-[24px] outline-none focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-lg"
                  value={newBed.room}
                  onChange={e => setNewBed({...newBed, room: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-dark-green text-white py-6 rounded-[28px] font-black text-xl hover:bg-emerald-900 shadow-2xl shadow-emerald-200 transition-all transform hover:-translate-y-1">
                REGISTER BED NOW
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedManagement;
