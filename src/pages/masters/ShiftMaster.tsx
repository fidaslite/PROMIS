import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Clock, Edit, Trash2, X } from 'lucide-react';
import { shiftService } from '../../services/shiftService';
import { departmentService } from '../../services/departmentService';
import toast, { Toaster } from 'react-hot-toast';

const ShiftMaster: React.FC = () => {
  const [shifts, setShifts] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialForm = {
    Department: '',
    ShiftName: '',
    StartTime: '',
    EndTime: '',
    ActiveStatus: true
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [shiftRes, deptRes] = await Promise.all([
        shiftService.getAll(),
        departmentService.getAll()
      ]);
      if (shiftRes.status === 'success') setShifts(shiftRes.data);
      if (deptRes.status === 'success') setDepartments(deptRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- OVERLAP VALIDATION LOGIC ---
  const isOverlapping = () => {
    const newStart = formData.StartTime;
    const newEnd = formData.EndTime;

    return shifts.some((shift) => {
      // Skip the current shift if we are editing it
      if (editingId && shift.ShiftID === editingId) return false;

      const existStart = shift.StartTime;
      const existEnd = shift.EndTime;

      // Logic: (StartA < EndB) AND (EndA > StartB)
      return newStart < existEnd && newEnd > existStart;
    });
  };

  const handleSave = async () => {
    if (!formData.ShiftName || !formData.StartTime || !formData.EndTime) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.StartTime >= formData.EndTime) {
      toast.error("End time must be after start time");
      return;
    }

    if (isOverlapping()) {
      toast.error("This shift time overlaps with an existing shift!");
      return;
    }

    try {
      let res;
      if (editingId) {
        res = await shiftService.update(editingId, formData);
      } else {
        res = await shiftService.create(formData);
      }

      if (res.status === 'success') {
        toast.success(res.message);
        setFormData(initialForm);
        setEditingId(null);
        fetchData();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Connection error");
    }
  };

  const handleEdit = (shift: any) => {
    setEditingId(shift.ShiftID);
    // Formatting time for input type="time" (HH:mm)
    setFormData({
      Department: shift.Department || '',
      ShiftName: shift.ShiftName,
      StartTime: shift.StartTime ? shift.StartTime.substring(11, 16) : '',
      EndTime: shift.EndTime ? shift.EndTime.substring(11, 16) : '',
      ActiveStatus: true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

const handleDelete = async (id: number) => {
  toast((t) => (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-slate-700">
        Are you sure you want to delete this shift?
      </span>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            toast.dismiss(t.id);
            try {
              const res = await shiftService.update(id, { ActiveStatus: false });
              if (res.status === 'success') {
                toast.success("Shift deleted successfully");
                fetchData();
              } else {
                toast.error(res.message || "Delete failed");
              }
            } catch (error) {
              toast.error("An error occurred during deletion");
            }
          }}
          className="px-3 py-1 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 rounded-md shadow-sm transition-colors"
        >
          Confirm Delete
        </button>
      </div>
    </div>
  ), {
    duration: 5000,
    position: 'top-center',
    style: {
      minWidth: '300px',
      border: '1px solid #e2e8f0',
      padding: '16px',
      color: '#1e293b',
    },
  });
};

  return (
    <div className="px-4 lg:px-6 pt-2 pb-6">
      <Toaster position="top-right" />
      
      {/* ENTRY FORM */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-1">
        <div className="bg-slate-50 px-5 py-2 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-600" />
            <h3 className="text-xs font-semibold text-slate-700">
              {editingId ? 'Edit Shift Timing' : 'Define New Shift'}
            </h3>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            
            {/* Department Select - Added custom arrow for perfect alignment */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Department</label>
              <div className="relative">
                <select 
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500 appearance-none cursor-pointer pr-10"
                  value={formData.Department}
                  onChange={(e) => setFormData({...formData, Department: e.target.value})}
                >
                  <option value="">All Departments</option>
                  {departments.map(d => <option key={d.DeptID} value={d.Name}>{d.Name}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            {/* Shift Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Shift Name *</label>
              <input 
                type="text" 
                placeholder="Morning Shift"
                className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500"
                value={formData.ShiftName}
                onChange={(e) => setFormData({...formData, ShiftName: e.target.value})}
              />
            </div>

            {/* Start Time */}
            <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Start Time *</label>
            <div className="relative">
                <input 
                type="time" 
                className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500 block appearance-none pr-10"
                value={formData.StartTime}
                onChange={(e) => setFormData({...formData, StartTime: e.target.value})}
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
                </div>
            </div>
            </div>

            {/* End Time */}
            <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">End Time *</label>
            <div className="relative">
                <input 
                type="time" 
                className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500 block appearance-none pr-10"
                value={formData.EndTime}
                onChange={(e) => setFormData({...formData, EndTime: e.target.value})}
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
                </div>
            </div>
            </div>

            {/* Buttons - Matched height with h-[40px] */}
            <div className="flex gap-2 h-[40px]">
              {editingId && (
                <button 
                  onClick={() => {setEditingId(null); setFormData(initialForm);}} 
                  className="flex-1 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X size={18} className="mx-auto"/>
                </button>
              )}
              <button 
                onClick={handleSave}
                className={`flex-[2] text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                <Save size={16} /> {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* LIST TABLE */}
      <div className="mt-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-700">Configured Shifts</h3>
          </div>
          <button onClick={fetchData} className="text-slate-400 hover:text-blue-600">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-3 text-center">#</th>
                <th className="px-6 py-3">Shift Name</th>
                <th className="px-6 py-3">Dept</th>
                <th className="px-6 py-3">Time Range</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {shifts.map((s, idx) => (
                <tr key={s.ShiftID} className="hover:bg-slate-50 transition-colors text-sm">
                  <td className="px-6 py-3 text-center text-slate-400 text-xs">{idx + 1}</td>
                  <td className="px-6 py-3 font-medium text-slate-700">{s.ShiftName}</td>
                  <td className="px-6 py-3 text-slate-500">{s.Department || 'All'}</td>
                  <td className="px-6 py-3 font-medium text-slate-700">
                    {s.StartTime.substring(11, 16)} - {s.EndTime.substring(11, 16)}
                  </td>
                  <td className="px-6 py-3 text-right flex justify-end gap-4">
                    <button onClick={() => handleEdit(s)} className="text-blue-500 flex items-center gap-1 text-xs font-bold"><Edit size={14}/> Edit</button>
                    <button onClick={() => handleDelete(s.ShiftID)} className="text-red-400 flex items-center gap-1 text-xs font-bold"><Trash2 size={14}/> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShiftMaster;