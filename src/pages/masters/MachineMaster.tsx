import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Monitor, Edit, Trash2, X, Cpu } from 'lucide-react';
import { machineService } from '../../services/machineService';
import { lineService } from '../../services/lineService';
import toast, { Toaster } from 'react-hot-toast';

const MachineMaster: React.FC = () => {
  const [machines, setMachines] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialForm = {
    LineID: '',
    MachineCode: '',
    MachineName: '',
    Port: '',
    IP: '',
    PrinterShareName: '',
    MachineType: '',
    ActiveStatus: true,
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [machineRes, lineRes] = await Promise.all([
        machineService.getAll(),
        lineService.getAll()
      ]);
      if (machineRes.status === 'success') setMachines(machineRes.data);
      setLines(Array.isArray(lineRes) ? lineRes : []);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (machine: any) => {
    setEditingId(machine.MachineID);
    setFormData({
      LineID: machine.LineID || '',
      MachineCode: machine.MachineCode || '',
      MachineName: machine.MachineName || '',
      Port: machine.Port || '',
      IP: machine.IP || '',
      PrinterShareName: machine.PrinterShareName || '',
      MachineType: machine.MachineType || '',
      ActiveStatus: true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialForm);
    toast.secondary("Edit cancelled");
  };

  const handleDelete = async (id: number, code: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-slate-700">Delete Machine <b>{code}</b>?</span>
        <div className="flex justify-end gap-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-md">Cancel</button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await machineService.update(id, { ActiveStatus: false });
                if (res.status === 'success') {
                  toast.success("Machine deleted");
                  fetchData();
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
    if (!formData.MachineCode || !formData.MachineName || !formData.LineID) {
      toast.error("Please fill required fields (Line, Code, Name)");
      return;
    }
    try {
      const res = editingId 
        ? await machineService.update(editingId, formData)
        : await machineService.create(formData);

      if (res.status === 'success') {
        toast.success(res.message);
        setFormData(initialForm);
        setEditingId(null);
        fetchData();
      } else {
        toast.error(res.message);
      }
    } catch (error) { toast.error("Error saving machine"); }
  };

  const getLineName = (id: string | number) => {
    const found = lines.find(l => l.line_id.toString() === id.toString());
    return found ? found.line_name : 'Unknown Line';
  };

  return (
    <div className="px-4 lg:px-6 pt-2 pb-6">
      <Toaster position="top-right" />
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-1">
        <div className="bg-slate-50 px-5 py-2 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor size={16} className="text-blue-600" />
            <h3 className="text-xs font-semibold text-slate-700">{editingId ? 'Edit Machine' : 'Add New Machine'}</h3>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Production Line *</label>
              <div className="relative">
                <select 
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500 appearance-none pr-10"
                  value={formData.LineID}
                  onChange={(e) => setFormData({...formData, LineID: e.target.value})}
                >
                  <option value="">Select Line</option>
                  {lines.map(l => <option key={l.line_id} value={l.line_id}>{l.line_name}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Machine Code *</label>
              <input type="text" className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500" value={formData.MachineCode} onChange={(e) => setFormData({...formData, MachineCode: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Machine Name *</label>
              <input type="text" className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500" value={formData.MachineName} onChange={(e) => setFormData({...formData, MachineName: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Machine IP</label>
              <input type="text" placeholder="192.168.1.10" className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500" value={formData.IP} onChange={(e) => setFormData({...formData, IP: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Port / Type</label>
              <input type="text" placeholder="e.g. 5000 / Final" className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500" value={formData.MachineType} onChange={(e) => setFormData({...formData, MachineType: e.target.value})} />
            </div>

            <div className="md:col-span-3 flex justify-end gap-2">
              {editingId && (
                <button onClick={handleCancel} className="w-32 bg-slate-200 text-slate-700 font-semibold h-[40px] rounded-lg flex items-center justify-center gap-2 transition-all"><X size={16} /> Cancel</button>
              )}
              <button onClick={handleSave} className={`w-48 text-white font-semibold h-[40px] rounded-lg flex items-center justify-center gap-2 shadow-sm ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}><Save size={16} /> {editingId ? 'Update Machine' : 'Save Machine'}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2"><Cpu size={16} className="text-slate-600" /><h3 className="text-sm font-semibold text-slate-700">Inspection Machine List</h3></div>
          <button onClick={fetchData} className="text-slate-400 hover:text-blue-600"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-4 py-3 text-center">S.No</th>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Machine Name</th>
                <th className="px-6 py-3">Line</th>
                <th className="px-6 py-3">IP Address</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {machines.filter(m => m.ActiveStatus).map((m, idx) => (
                <tr key={m.MachineID} className="hover:bg-slate-50 transition-colors text-sm">
                  <td className="px-4 py-3 text-center text-slate-400 text-xs">{idx + 1}</td>
                  <td className="px-6 py-3 font-medium text-slate-700">{m.MachineCode}</td>
                  <td className="px-6 py-3 font-medium text-slate-700">{m.MachineName}</td>
                  <td className="px-6 py-3 text-xs text-slate-500">{getLineName(m.LineID)}</td>
                  <td className="px-6 py-3 text-xs text-slate-500">{m.IP || '-'}</td>
                  <td className="px-6 py-3 text-right flex justify-end gap-3">
                    <button onClick={() => handleEdit(m)} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs font-semibold"><Edit size={14} /> Edit</button>
                    <button onClick={() => handleDelete(m.MachineID, m.MachineCode)} className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs font-semibold"><Trash2 size={14} /> Delete</button>
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

export default MachineMaster;