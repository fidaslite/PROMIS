import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Cpu, Edit, Trash2, X, Layers } from 'lucide-react';
import { rfidDeviceService } from '../../services/rfidDeviceService';
import { lineService } from '../../services/lineService';
import { machineService } from '../../services/machineService';
import toast, { Toaster } from 'react-hot-toast';

const RFIDDeviceMaster: React.FC = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [allMachines, setAllMachines] = useState<any[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialForm = {
    device_code: '',
    line_id: '',
    machine_id: '',
    ActiveStatus: '1'
  };

  const [formData, setFormData] = useState<any>(initialForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deviceRes, lineRes, machineRes] = await Promise.all([
        rfidDeviceService.getAll(),
        lineService.getAll(),
        machineService.getAll()
      ]);
      
      // Using .data because your backend returns {"status": "success", "data": [...]}
      if (deviceRes.status === 'success') setDevices(deviceRes.data);
      
      // lineService returns direct array [{}, {}]
      setLines(Array.isArray(lineRes) ? lineRes : []);
      
      // machineService returns {"status": "success", "data": [...]}
      if (machineRes.status === 'success') setAllMachines(machineRes.data);
    } catch (error) {
      toast.error("Failed to load dependency data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // DYNAMIC FILTERING: Filter machines based on selected Line
  useEffect(() => {
    if (formData.line_id) {
      const filtered = allMachines.filter(m => String(m.LineID) === String(formData.line_id));
      setFilteredMachines(filtered);
      
      // Reset machine selection if the current machine doesn't belong to the newly selected line
      if (!editingId && formData.machine_id && !filtered.find(m => String(m.MachineID) === String(formData.machine_id))) {
        setFormData((prev: any) => ({ ...prev, machine_id: '' }));
      }
    } else {
      setFilteredMachines([]);
    }
  }, [formData.line_id, allMachines, editingId]);

  const handleEdit = (device: any) => {
    setEditingId(device.device_id);
    setFormData({
      device_code: device.device_code || '',
      line_id: device.line_id || '',
      machine_id: device.machine_id || '',
      ActiveStatus: '1'
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
        <span className="text-sm font-medium text-slate-700">
          Are you sure you want to delete device <b>{code}</b>?
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
                const res = await rfidDeviceService.update(id, { ActiveStatus: '0' });
                if (res.status === 'success') {
                  toast.success("Device deleted successfully");
                  fetchData();
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
    if (!formData.device_code || !formData.line_id || !formData.machine_id) {
      toast.error("All fields are required");
      return;
    }

    try {
      const payload = {
        device_code: formData.device_code,
        line_id: parseInt(formData.line_id),
        machine_id: parseInt(formData.machine_id)
      };

      const res = editingId 
        ? await rfidDeviceService.update(editingId, payload)
        : await rfidDeviceService.create(payload);

      if (res.status === 'success') {
        toast.success(res.message);
        setFormData(initialForm);
        setEditingId(null);
        fetchData();
      } else {
        toast.error(res.message || "Operation failed");
      }
    } catch (error) {
      toast.error("Error saving device");
    }
  };

  return (
    <div className="px-4 lg:px-6 pt-2 pb-6">
      <Toaster position="top-right" />

      {/* ENTRY FORM */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-1">
        <div className="bg-slate-50 px-5 py-2 border-b border-slate-200 flex items-center gap-2">
          <Cpu size={16} className="text-blue-600" />
          <h3 className="text-xs font-semibold text-slate-700">
            {editingId ? 'Edit RFID Device' : 'Register New RFID Device'}
          </h3>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Device Code *</label>
              <input
                type="text"
                placeholder="RFID-Reader-01"
                className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500"
                value={formData.device_code}
                onChange={(e) => setFormData({ ...formData, device_code: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Production Line *</label>
              <div className="relative">
                <select 
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500 appearance-none pr-10"
                  value={formData.line_id}
                  onChange={(e) => setFormData({...formData, line_id: e.target.value})}
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
              <label className="text-[10px] font-bold text-slate-500 uppercase">Machine (Line Restricted) *</label>
              <div className="relative">
                <select 
                  disabled={!formData.line_id}
                  className={`w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500 appearance-none pr-10 ${!formData.line_id ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                  value={formData.machine_id}
                  onChange={(e) => setFormData({...formData, machine_id: e.target.value})}
                >
                  <option value="">{formData.line_id ? 'Select Machine' : 'Select Line First'}</option>
                  {filteredMachines.map(m => <option key={m.MachineID} value={m.MachineID}>{m.MachineName}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                   <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            <div className="flex gap-2 h-[40px]">
              {editingId && (
                <button onClick={handleCancel} className="flex-1 bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm">
                  <X size={16} /> Cancel
                </button>
              )}
              <button 
                onClick={handleSave} 
                className={`flex-1 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
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
            <Layers size={16} className="text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-700">Registered Devices</h3>
          </div>
          <button onClick={fetchData} className="text-slate-400 hover:text-blue-600 transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-4 py-3 text-center">#</th>
                <th className="px-6 py-3">Device Code</th>
                <th className="px-6 py-3">Assigned Line</th>
                <th className="px-6 py-3">Assigned Machine</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {devices.length > 0 ? (
                devices.map((d, idx) => (
                  <tr key={d.device_id} className="hover:bg-slate-50 transition-colors text-sm">
                    <td className="px-4 py-3 text-center text-slate-400 text-xs">{idx + 1}</td>
                    <td className="px-6 py-3 font-medium text-slate-700 uppercase text-xs">{d.device_code}</td>
                    <td className="px-6 py-3 font-medium text-slate-700 uppercase text-xs">{d.line_name || '-'}</td>
                    <td className="px-6 py-3 font-medium text-slate-700 uppercase text-xs">{d.MachineName || '-'}</td>
                    <td className="px-6 py-3 text-right flex justify-end gap-3">
                      <button 
                        onClick={() => handleEdit(d)} 
                        className="text-blue-500 hover:text-blue-700 font-semibold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(d.device_id, d.device_code)} 
                        className="text-red-400 hover:text-red-600 font-semibold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-xs italic">
                    {loading ? 'Fetching records...' : 'No RFID devices found.'}
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

export default RFIDDeviceMaster;