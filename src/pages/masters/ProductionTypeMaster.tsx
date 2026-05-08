import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Settings, Edit, Trash2, X, Search, Info } from 'lucide-react';
import { productionTypeService } from '../../services/productionTypeService';
import toast, { Toaster } from 'react-hot-toast';

const ProductionTypeMaster: React.FC = () => {
  const [productionTypes, setProductionTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const initialForm = {
    production_type_Code: '',
    production_type_name: '',
    description: '',
    ActiveStatus: true
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchProductionTypes = async () => {
    setLoading(true);
    try {
      const data = await productionTypeService.getAll();
      setProductionTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load production types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductionTypes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (type: any) => {
    setEditingId(type.production_type_id);
    setFormData({
      production_type_Code: type.production_type_Code || '',
      production_type_name: type.production_type_name || '',
      description: type.description || '',
      ActiveStatus: type.ActiveStatus ?? true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleSave = async () => {
    if (!formData.production_type_Code || !formData.production_type_name) {
      toast.error("Code and Name are required");
      return;
    }

    try {
      const res = editingId 
        ? await productionTypeService.update(editingId, formData)
        : await productionTypeService.create(formData);

      if (res.status === 'success') {
        toast.success(editingId ? "Updated" : "Created");
        setFormData(initialForm);
        setEditingId(null);
        fetchProductionTypes();
      }
    } catch (error) {
      toast.error("Error saving production type");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-slate-700">Delete <b>{name}</b>?</span>
        <div className="flex justify-end gap-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-md">Cancel</button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await productionTypeService.update(id, { ...formData, ActiveStatus: false });
                if (res.status === 'success') {
                  toast.success("Deactivated");
                  fetchProductionTypes();
                }
              } catch (error) { toast.error("Delete failed"); }
            }}
            className="px-3 py-1 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 rounded-md shadow-sm"
          >Confirm</button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' });
  };

  const filteredTypes = productionTypes.filter(t => 
    (t.ActiveStatus !== false) && 
    (t.production_type_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     t.production_type_Code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="px-4 lg:px-6 pt-2 pb-6 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      {/* SINGLE LINE ENTRY FORM */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4 mt-1">
        <div className="p-4">
          <div className="flex flex-wrap md:flex-nowrap items-end gap-3">
            <div className="flex-1 min-w-[120px] space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Code *</label>
              <input 
                name="production_type_Code" 
                value={formData.production_type_Code} 
                onChange={handleInputChange} 
                placeholder="MASS-PROD" 
                className="w-full bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none transition-all" 
              />
            </div>
            <div className="flex-[1.5] min-w-[180px] space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Production Type *</label>
              <input 
                name="production_type_name" 
                value={formData.production_type_name} 
                onChange={handleInputChange} 
                placeholder="Mass Production" 
                className="w-full bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none transition-all" 
              />
            </div>
            <div className="flex-[2] min-w-[200px] space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Machine Name/Type</label>
              <input 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                placeholder="Describe methodology..." 
                className="w-full bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none transition-all" 
              />
            </div>
            <div className="flex gap-2 h-[38px]">
              {editingId && (
                <button 
                  onClick={handleCancel} 
                  className="px-3 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              )}
              <button 
                onClick={handleSave} 
                className="bg-blue-600 text-white font-bold rounded-lg px-6 h-full text-xs shadow-md shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <Save size={16} /> {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LIST TABLE SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-slate-600" />
            <h3 className="text-sm font-bold text-slate-700">Production Type Registry</h3>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 w-48 md:w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <button onClick={fetchProductionTypes} className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded-lg shadow-sm">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-4 py-3 text-center">#</th>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Production Type</th>
                <th className="px-6 py-3">Machiine Name/Type</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTypes.length > 0 ? (
                filteredTypes.map((type, idx) => (
                  <tr key={type.production_type_id} className="hover:bg-slate-50 transition-colors text-sm">
                    <td className="px-4 py-3 text-center text-slate-400 text-xs">{idx + 1}</td>
                    <td className="px-6 py-3 font-bold text-xs text-slate-700 uppercase">{type.production_type_Code}</td>
                    <td className="px-6 py-3 font-bold text-slate-700">{type.production_type_name}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-start gap-2 text-xs text-slate-500 max-w-xs truncate">
                        <Info size={12} className="mt-0.5 shrink-0 opacity-40" />
                        {type.description || <span className="italic opacity-60">No description</span>}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right flex justify-end gap-3 h-full items-center">
                      <button onClick={() => handleEdit(type)} className="text-blue-500 hover:text-blue-700 font-bold text-xs flex items-center gap-1">
                        <Edit size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(type.production_type_id, type.production_type_name)} className="text-red-400 hover:text-red-600 font-bold text-xs flex items-center gap-1">
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 text-xs italic">
                    {loading ? 'Fetching...' : 'No types found.'}
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

export default ProductionTypeMaster;