import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, CreditCard, Edit, Trash2, X, User } from 'lucide-react';
import { rfidService } from '../../services/rfidService';
import { employeeService } from '../../services/employeeService';
import toast, { Toaster } from 'react-hot-toast';

const RFIDMaster: React.FC = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialForm = {
    rfid_uid: '',
    assigned_to: '', // This will store the EmpUser (Username)
    empid: null as number | null, // This stores the SQL internal ID
    ActiveStatus: true
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rfidRes, empRes] = await Promise.all([
        rfidService.getAll(),
        employeeService.getAll()
      ]);
      
      // Handle the direct array return from rfidService
      setCards(Array.isArray(rfidRes) ? rfidRes : []);
      
      if (empRes.status === 'success') {
        setEmployees(empRes.data);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Updated logic to find the employee object and extract both Username and SQL ID
  const handleEmployeeChange = (empUser: string) => {
    const selectedEmp = employees.find(emp => emp.EmpUser === empUser);
    
    if (selectedEmp) {
      setFormData({
        ...formData,
        assigned_to: selectedEmp.EmpUser,
        empid: selectedEmp.EmpId // Capturing the existing SQL ID
      });
    } else {
      setFormData({ ...formData, assigned_to: '', empid: null });
    }
  };

  const handleEdit = (card: any) => {
    setEditingId(card.rfid_id);
    setFormData({
      rfid_uid: card.rfid_uid || '',
      assigned_to: card.assigned_to || '',
      empid: card.empid || null, // Capture the existing link
      ActiveStatus: true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialForm);
    toast.secondary("Edit cancelled");
  };

  const handleDelete = async (id: number, uid: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-slate-700">
          Delete RFID Card: <b>{uid}</b>?
        </span>
        <div className="flex justify-end gap-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-md">
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                // Soft delete by updating ActiveStatus
                const res = await rfidService.update(id, { ActiveStatus: false });
                if (res.status === 'success') {
                  toast.success("Card deleted successfully");
                  fetchData();
                }
              } catch (error) {
                toast.error("Delete failed");
              }
            }}
            className="px-3 py-1 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 rounded-md shadow-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' });
  };

  const handleSave = async () => {
    if (!formData.rfid_uid || !formData.empid) {
      toast.error("RFID UID and Employee selection are required");
      return;
    }

    try {
      // The payload now includes rfid_uid, assigned_to, and empid
      const res = editingId 
        ? await rfidService.update(editingId, formData)
        : await rfidService.create(formData);

      if (res.status === 'success') {
        toast.success(editingId ? "Card updated" : "Card created");
        setFormData(initialForm);
        setEditingId(null);
        fetchData();
      } else {
        toast.error(res.message || "Operation failed");
      }
    } catch (error) {
      toast.error("Error saving card");
    }
  };

  return (
    <div className="px-4 lg:px-6 pt-2 pb-6">
      <Toaster position="top-right" />

      {/* ENTRY FORM */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-1">
        <div className="bg-slate-50 px-5 py-2 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-blue-600" />
            <h3 className="text-xs font-semibold text-slate-700">
              {editingId ? 'Edit RFID Card' : 'Add New RFID Card'}
            </h3>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Card UID *</label>
              <input
                type="text"
                placeholder="e.g. A1B2C3D4"
                className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500"
                value={formData.rfid_uid}
                onChange={(e) => setFormData({ ...formData, rfid_uid: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assign To Employee (Username)</label>
              <div className="relative">
                <select 
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500 appearance-none cursor-pointer pr-10"
                  value={formData.assigned_to}
                  onChange={(e) => handleEmployeeChange(e.target.value)}
                >
                  <option value="">Select Employee User</option>
                  {employees.map(emp => (
                    <option key={emp.EmpId} value={emp.EmpUser}>
                      {emp.EmpName} ({emp.EmpUser})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                   <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            <div className="flex gap-2 h-[40px]">
              {editingId && (
                <button onClick={handleCancel} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all">
                  <X size={16} /> Cancel
                </button>
              )}
              <button 
                onClick={handleSave}
                className={`flex-1 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
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
            <CreditCard size={16} className="text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-700">Active RFID Cards</h3>
          </div>
          <button onClick={fetchData} className="text-slate-400 hover:text-blue-600">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-4 py-3 text-center">#</th>
                <th className="px-6 py-3">Card UID</th>
                <th className="px-6 py-3">Assigned To User</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cards.length > 0 ? (
                cards.map((card, index) => (
                  <tr key={card.rfid_id} className="hover:bg-slate-50 transition-colors text-sm">
                    <td className="px-4 py-3 text-center text-slate-400 text-xs">{index + 1}</td>
                    <td className="px-6 py-3 font-mono text-xs text-blue-600 font-medium">{card.rfid_uid}</td>
                    <td className="px-6 py-3 font-medium text-slate-700">
                      {card.assigned_to ? (
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-slate-400" />
                          {card.assigned_to}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-xs underline decoration-dotted">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right flex justify-end gap-3">
                      <button onClick={() => handleEdit(card)} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs font-semibold">
                        <Edit size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(card.rfid_id, card.rfid_uid)} className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs font-semibold">
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 text-xs italic">
                    {loading ? 'Fetching records...' : 'No RFID cards found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RFIDMaster;