import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Palette, Edit, Trash2, X } from 'lucide-react';
import { colorService } from '../../services/colorService';
import toast, { Toaster } from 'react-hot-toast';

const ColorMaster: React.FC = () => {
  const [colors, setColors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialForm = {
    color_code: '',
    color_name: '',
    hex_code: '#000000',
    ActiveStatus: true
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchColors = async () => {
    setLoading(true);
    try {
      const data = await colorService.getAll();
      setColors(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load colors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleEdit = (color: any) => {
    setEditingId(color.color_id);
    setFormData({
      color_code: color.color_code || '',
      color_name: color.color_name || '',
      hex_code: color.hex_code || '#000000',
      ActiveStatus: true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialForm);
    toast.secondary("Edit cancelled");
  };

  const handleDelete = async (id: number, name: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-slate-700">Delete color: <b>{name}</b>?</span>
        <div className="flex justify-end gap-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-md">Cancel</button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await colorService.update(id, { ActiveStatus: false });
                if (res.status === 'success') {
                  toast.success("Color deleted");
                  fetchColors();
                }
              } catch (error) { toast.error("Delete failed"); }
            }}
            className="px-3 py-1 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 rounded-md"
          >Confirm</button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' });
  };

  const handleSave = async () => {
    if (!formData.color_code || !formData.color_name) {
      toast.error("Code and Name are required");
      return;
    }
    try {
      const res = editingId 
        ? await colorService.update(editingId, formData)
        : await colorService.create(formData);

      if (res.status === 'success') {
        toast.success(editingId ? "Color updated" : "Color created");
        setFormData(initialForm);
        setEditingId(null);
        fetchColors();
      } else {
        toast.error(res.message || "Operation failed");
      }
    } catch (error) { toast.error("Error saving color"); }
  };

  return (
    <div className="px-4 lg:px-6 pt-2 pb-6">
      <Toaster position="top-right" />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-1">
        <div className="bg-slate-50 px-5 py-2 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-blue-600" />
            <h3 className="text-xs font-semibold text-slate-700">{editingId ? 'Edit Color' : 'Add New Color'}</h3>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Color Code *</label>
              <input type="text" placeholder="B01" className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500" value={formData.color_code} onChange={(e) => setFormData({ ...formData, color_code: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Color Name *</label>
              <input type="text" placeholder="Black" className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500" value={formData.color_name} onChange={(e) => setFormData({ ...formData, color_name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Hex Code / Picker</label>
              <div className="flex gap-2">
                <input type="text" placeholder="#FFFFFF (Optional)" className="flex-1 bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500 uppercase" value={formData.hex_code} onChange={(e) => setFormData({ ...formData, hex_code: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2 h-[40px]">
              {editingId && (
                <button onClick={handleCancel} className="flex-1 bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all"><X size={16} /> Cancel</button>
              )}
              <button onClick={handleSave} className={`flex-1 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${editingId ? 'bg-orange-500' : 'bg-blue-600'}`}><Save size={16} /> {editingId ? 'Update' : 'Save'}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2"><Palette size={16} className="text-slate-600" /><h3 className="text-sm font-semibold text-slate-700">Active Colors</h3></div>
          <button onClick={fetchColors} className="text-slate-400 hover:text-blue-600"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-4 py-3 text-center">#</th>
                <th className="px-6 py-3">Preview</th>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Hex</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {colors.filter(c => c.ActiveStatus !== false).map((c, idx) => (
                <tr key={c.color_id} className="hover:bg-slate-50 transition-colors text-sm">
                  <td className="px-4 py-3 text-center text-slate-400 text-xs">{idx + 1}</td>
                  <td className="px-6 py-3"><div className="w-6 h-6 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: c.hex_code || '#ccc' }}></div></td>
                  <td className="px-6 py-3 font-mono text-xs font-medium text-blue-600">{c.color_code}</td>
                  <td className="px-6 py-3 font-medium text-slate-700">{c.color_name}</td>
                  <td className="px-6 py-3 text-xs text-slate-500 uppercase">{c.hex_code}</td>
                  <td className="px-6 py-3 text-right flex justify-end gap-3">
                    <button onClick={() => handleEdit(c)} className="text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-1 text-xs"><Edit size={14} /> Edit</button>
                    <button onClick={() => handleDelete(c.color_id, c.color_name)} className="text-red-400 hover:text-red-600 font-semibold flex items-center gap-1 text-xs"><Trash2 size={14} /> Delete</button>
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

export default ColorMaster;