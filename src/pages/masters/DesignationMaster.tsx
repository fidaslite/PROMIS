import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, UserCheck, Edit, Trash2, X } from 'lucide-react';
import { designationService } from '../../services/designationService';
import toast, { Toaster } from 'react-hot-toast';

const DesignationMaster: React.FC = () => {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialForm = {
    Code: '',
    Name: '',
    ActiveStatus: true
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const res = await designationService.getAll();
      if (res.status === 'success') {
        // Filter to show only active records
        const activeOnly = res.data.filter((d: any) => d.ActiveStatus === true || d.ActiveStatus === 1);
        setDesignations(activeOnly);
      }
    } catch (error) {
      console.error("Fetch failed", error);
      toast.error("Failed to load designations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const handleEdit = (des: any) => {
    setEditingId(des.DesignationID);
    setFormData({
      Code: des.Code || '',
      Name: des.Name || '',
      ActiveStatus: true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialForm);
    toast.secondary("Edit cancelled");
  };

    const handleDelete = async (id: number) => {
      toast((t) => (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-slate-700">
            Are you sure you want to delete this designation?
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
                  // Soft delete: update ActiveStatus to false via update endpoint
                  const res = await designationService.update(id, { ActiveStatus: false });
                  if (res.status === 'success') {
                    toast.success("Designation deleted successfully");
                    fetchDesignations();
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
          minWidth: '320px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
      });
    };

  const handleSave = async () => {
    if (!formData.Code || !formData.Name) {
      toast.error("Code and Name are required");
      return;
    }
    
    try {
      let res;
      if (editingId) {
        res = await designationService.update(editingId, formData);
      } else {
        res = await designationService.create(formData);
      }

      if (res.status === 'success') {
        toast.success(res.message || "Operation successful");
        setFormData(initialForm);
        setEditingId(null);
        fetchDesignations();
      } else {
        toast.error(res.message || "Error occurred");
      }
    } catch (error) {
      console.error("Save failed", error);
      toast.error("An error occurred while saving");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Toaster position="top-right" />

      <div className="px-4 lg:px-6 pt-0 pb-6">
        {/* ADD/EDIT CONTAINER */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-1">
          <div className="bg-slate-50 px-5 py-2 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck size={16} className="text-blue-600" />
              <h3 className="text-xs font-semibold text-slate-700">
                {editingId ? 'Edit Designation' : 'Add New Designation'}
              </h3>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Designation Code *</label>
                <input 
                  type="text" 
                  placeholder="e.g. MGR" 
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500 transition-all" 
                  value={formData.Code}
                  onChange={(e) => setFormData({...formData, Code: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Designation Name</label>
                <input 
                  type="text" 
                  placeholder="Manager" 
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500 transition-all" 
                  value={formData.Name}
                  onChange={(e) => setFormData({...formData, Name: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                {editingId && (
                  <button 
                    onClick={handleCancel}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                )}
                <button 
                  onClick={handleSave}
                  className={`flex-1 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] text-white ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  <Save size={16} />
                  {editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LIST CONTAINER */}
        <div className="mt-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck size={16} className="text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-700">Personnel Designations</h3>
            </div>
            <button onClick={fetchDesignations} className="text-slate-400 hover:text-blue-600 transition-colors">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-4 py-3 text-center">S.No</th>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Designation Name</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {designations.length > 0 ? (
                  designations.map((des: any, index: number) => (
                    <tr key={des.DesignationID} className="hover:bg-slate-50/50 transition-colors text-sm">
                      <td className="px-4 py-3 text-slate-400 text-xs text-center">{index + 1}</td>
                      <td className="px-6 py-3 font-mono text-xs text-blue-600 font-medium">{des.Code}</td>
                      <td className="px-6 py-3 font-medium text-slate-700">{des.Name}</td>
                      <td className="px-6 py-3 text-right flex justify-end gap-3">
                        <button 
                          onClick={() => handleEdit(des)}
                          className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs font-semibold transition-colors"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(des.DesignationID)}
                          className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs font-semibold transition-colors"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 text-xs italic">
                      {loading ? 'Fetching data...' : 'No records found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignationMaster;