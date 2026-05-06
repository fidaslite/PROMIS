import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, GitCommit, Edit, Trash2, X } from 'lucide-react';
import { lineService } from '../../services/lineService';
import toast, { Toaster } from 'react-hot-toast';

const LineMaster: React.FC = () => {
  const [lines, setLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialForm = {
    line_code: '',
    line_name: '',
    ActiveStatus: true
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchLines = async () => {
    setLoading(true);
    try {
      const data = await lineService.getAll();
      // Since your GET returns a direct array
      setLines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch failed", error);
      toast.error("Failed to load lines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLines();
  }, []);

  const handleEdit = (line: any) => {
    setEditingId(line.line_id);
    setFormData({
      line_code: line.line_code,
      line_name: line.line_name,
      ActiveStatus: true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialForm);
    toast.secondary("Edit cancelled");
  };

  const handleDelete = async (id: number, lineName: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-slate-700">
          Delete Line: <b>{lineName}</b>?
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
                // Soft delete: Update ActiveStatus to false
                const res = await lineService.update(id, { 
                  line_code: line.line_code,  
                  line_name: lineName, // Required by your LineUpdate model
                  ActiveStatus: false 
                });
                if (res.status === 'success') {
                  toast.success("Line deleted successfully");
                  fetchLines();
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
      style: { minWidth: '320px', border: '1px solid #e2e8f0', padding: '16px' },
    });
  };

  const handleSave = async () => {
    if (!formData.line_code || !formData.line_name) {
      toast.error("Both Code and Name are required");
      return;
    }

    try {
      let res;
      if (editingId) {
        // PUT /master/line/{id}
        res = await lineService.update(editingId, {
          line_code: formData.line_code, // Add this line  
          line_name: formData.line_name,
          ActiveStatus: formData.ActiveStatus
        });
      } else {
        // POST /master/line
        res = await lineService.create({
          line_code: formData.line_code,
          line_name: formData.line_name
        });
      }

      if (res.status === 'success') {
        toast.success(res.message || "Saved successfully");
        setFormData(initialForm);
        setEditingId(null);
        fetchLines();
      } else {
        toast.error(res.message || "Operation failed");
      }
    } catch (error) {
      console.error("Save failed", error);
      toast.error("An error occurred while saving");
    }
  };

  return (
    <div className="px-4 lg:px-6 pt-2 pb-6">
      <Toaster position="top-right" />

      {/* ENTRY FORM */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-1">
        <div className="bg-slate-50 px-5 py-2 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommit size={16} className="text-blue-600" />
            <h3 className="text-xs font-semibold text-slate-700">
              {editingId ? 'Edit Production Line' : 'Add New Production Line'}
            </h3>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Line Code *</label>
              <input
                type="text"
                placeholder="e.g. L01"
                // disabled={!!editingId} // Usually code is unique and not editable
                // className={`w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500 ${editingId ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500"
                value={formData.line_code}
                onChange={(e) => setFormData({ ...formData, line_code: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Line Name *</label>
              <input
                type="text"
                placeholder="Assembly Line 01"
                className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500"
                value={formData.line_name}
                onChange={(e) => setFormData({ ...formData, line_name: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              {editingId && (
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold h-[40px] rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <X size={16} />
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                className={`flex-1 font-semibold h-[40px] rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] text-white ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                <Save size={16} />
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LIST TABLE */}
      <div className="mt-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommit size={16} className="text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-700">Registered Production Lines</h3>
          </div>
          <button onClick={fetchLines} className="text-slate-400 hover:text-blue-600 transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-4 py-3 text-center">#</th>
                <th className="px-6 py-3">Line Code</th>
                <th className="px-6 py-3">Line Name</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {lines.length > 0 ? (
                lines.map((line: any, index: number) => (
                  <tr key={line.line_id} className="hover:bg-slate-50/50 transition-colors text-sm">
                    <td className="px-4 py-3 text-slate-400 text-xs text-center">{index + 1}</td>
                    <td className="px-6 py-3 font-medium text-slate-700">{line.line_code}</td>
                    <td className="px-6 py-3 font-medium text-slate-700">{line.line_name}</td>
                    <td className="px-6 py-3 text-right flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(line)}
                        className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs font-semibold"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(line.line_id, line.line_name)}
                        className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs font-semibold"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 text-xs italic">
                    {loading ? 'Fetching lines...' : 'No production lines defined.'}
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

export default LineMaster;