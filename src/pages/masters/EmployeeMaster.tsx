import React, { useState, useEffect } from 'react';
import { UserPlus, Save, Users, RefreshCw, Edit, Trash2, X } from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import { designationService } from '../../services/designationService'; 
import toast, { Toaster } from 'react-hot-toast'; // Added for notifications

const EmployeeMaster: React.FC = () => {
  const [employees, setEmployees] = useState([]);
  const [designations, setDesignations] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialForm = {
    EmpType: '', 
    EmpContractor: '',
    EmpCode: '',
    EmpUser: '',
    EmpPass: '',
    EmpName: '',
    EntryDate: new Date().toISOString().split('T')[0],
    ActiveStatus: true,
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, desigRes] = await Promise.all([
        employeeService.getAll(),
        designationService.getAll()
      ]);
      
      if (empRes.status === 'success') {
          // Filtering to only show active employees in the list
          const activeOnly = empRes.data.filter((e: any) => e.ActiveStatus === true || e.ActiveStatus === 1);
          setEmployees(activeOnly);
      }
      if (desigRes.status === 'success') setDesignations(desigRes.data);
    } catch (error) {
      console.error("Fetch failed", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (emp: any) => {
    setEditingId(emp.EmpId);
    setFormData({
      EmpType: emp.EmpType || '', 
      EmpContractor: emp.EmpContractor || '',
      EmpCode: emp.EmpCode || '',
      EmpUser: emp.EmpUser || '',
      EmpPass: emp.EmpPass || '',
      EmpName: emp.EmpName || '',
      EntryDate: emp.EntryDate ? emp.EntryDate.split('T')[0] : initialForm.EntryDate,
      ActiveStatus: true, 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialForm);
    toast.secondary("Edit cancelled");
  };

    const handleDelete = async (empId: number) => {
      toast((t) => (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-slate-700">
            Are you sure you want to delete this employee?
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
                  // Sending ActiveStatus as false to the update endpoint
                  const res = await employeeService.update(empId, { ActiveStatus: false });
                  if (res.status === 'success') {
                    toast.success("Employee deleted successfully");
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
          minWidth: '320px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
      });
    };

  const handleSave = async () => {
    try {
      let res;
      if (editingId) {
        res = await employeeService.update(editingId, formData);
      } else {
        res = await employeeService.create(formData);
      }

      if (res.status === 'success') {
          toast.success(res.message || "Saved successfully");
          setFormData(initialForm);
          setEditingId(null);
          fetchData();
      } else {
          toast.error(res.message || "Failed");
      }
    } catch (error) {
      console.error("Save failed", error);
      toast.error("Fill all the required Feilds");
    }
  };

  const getDesignationName = (id: string | number) => {
    const found = designations.find(d => d.DesignationID.toString() === id.toString());
    return found ? found.Name : id;
  };

  return (
    <div className="px-4 lg:px-6 pt-2 pb-6">
      <Toaster position="top-right" /> {/* Toast Container */}
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-1">
        <div className="bg-slate-50 px-5 py-2 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus size={16} className="text-blue-600" />
            <h3 className="text-xs font-semibold text-slate-700">
              {editingId ? 'Edit Employee' : 'Add New Employee'}
            </h3>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee Code *</label>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500" 
                value={formData.EmpCode}
                onChange={(e) => setFormData({...formData, EmpCode: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500" 
                value={formData.EmpName}
                onChange={(e) => setFormData({...formData, EmpName: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Designation</label>
              <select 
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500 cursor-pointer"
                value={formData.EmpType}
                onChange={(e) => setFormData({...formData, EmpType: e.target.value})}
              >
                <option value="">Select Designation</option>
                {designations.map((des) => (
                  <option key={des.DesignationID} value={des.DesignationID}>{des.Name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contractor</label>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm" 
                value={formData.EmpContractor}
                onChange={(e) => setFormData({...formData, EmpContractor: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Username</label>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm" 
                value={formData.EmpUser}
                onChange={(e) => setFormData({...formData, EmpUser: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <input 
                type="text" // Changed from password to text as requested
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm" 
                value={formData.EmpPass}
                onChange={(e) => setFormData({...formData, EmpPass: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
              {editingId && (
                <button 
                  onClick={handleCancel}
                  className="w-full md:w-32 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <X size={16} />
                  Cancel
                </button>
              )}
              <button 
                onClick={handleSave}
                className={`w-full md:w-48 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                <Save size={16} />
                {editingId ? 'Update Employee' : 'Save Employee'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-700">Active Personnel</h3>
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
                <th className="px-6 py-3 ">Code</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Designation</th>
                <th className="px-6 py-3">Contractor</th>                
                <th className="px-6 py-3">User Name</th>
                <th className="px-6 py-3">Password</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {employees.length > 0 ? (
                employees.map((emp: any, index: number) => (
                  <tr key={emp.EmpId} className="hover:bg-slate-50/50 transition-colors text-sm">
                    <td className="px-4 py-3 text-slate-400 text-xs text-center">{index + 1}</td>
                    <td className="px-6 py-3 font-medium text-slate-700">{emp.EmpCode}</td>
                    <td className="px-6 py-3 font-medium text-slate-700">{emp.EmpName}</td>
                    <td className="px-6 py-3 text-xs text-slate-500">{getDesignationName(emp.EmpType)}</td>
                    <td className="px-6 py-3 text-xs text-slate-500">{emp.EmpContractor}</td>
                    <td className="px-6 py-3 text-xs text-slate-500">{emp.EmpUser || '-'}</td>
                    <td className="px-6 py-3 text-xs text-slate-500">{emp.EmpPass || '-'}</td>
                    <td className="px-6 py-3 text-right flex justify-end gap-3">
                      <button 
                        onClick={() => handleEdit(emp)}
                        className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs font-semibold"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(emp.EmpId)}
                        className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs font-semibold"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs italic">
                    {loading ? 'Fetching data...' : 'No records found.'}
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

export default EmployeeMaster;