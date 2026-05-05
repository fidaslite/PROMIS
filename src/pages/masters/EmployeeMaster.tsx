import React, { useState, useEffect } from 'react';
import { UserPlus, Save, Users, RefreshCw } from 'lucide-react';
import { employeeService } from '../../services/employeeService';

const EmployeeMaster: React.FC = () => {
  const [employees, setEmployees] = useState([]);
  const [designations, setDesignations] = useState(['Staff', 'Inspector', 'Contractor', 'Admin']); 
  const [loading, setLoading] = useState(false);

  // Form State including all model fields
  const [formData, setFormData] = useState({
    EmpType: 'Staff',
    EmpContractor: '',
    EmpCode: '',
    EmpUser: '',
    EmpPass: '',
    EmpName: '',
    EntryDate: new Date().toISOString().split('T')[0],
    ActiveStatus: true,
  });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeService.getAll();
      if (res.status === 'success') {
        setEmployees(res.data);
      }
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSave = async () => {
    console.log("Saving Employee Data:", formData);
  };

  return (
    <div className="px-4 lg:px-6 pt-2 pb-6">

      {/* COMPACT ADD EMPLOYEE CONTAINER */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-1">
        <div className="bg-slate-50 px-5 py-2 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus size={16} className="text-blue-600" />
            <h3 className="text-xs font-semibold text-slate-700">Add New Employee</h3>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3 items-end">
            {/* Field 1 */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee Code *</label>
              <input 
                type="text" 
                placeholder="EMP101" 
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500 transition-all" 
                value={formData.EmpCode}
                onChange={(e) => setFormData({...formData, EmpCode: e.target.value})}
              />
            </div>
            {/* Field 2 */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500 transition-all" 
                value={formData.EmpName}
                onChange={(e) => setFormData({...formData, EmpName: e.target.value})}
              />
            </div>
            {/* Field 3 */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee Type</label>
              <select 
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500 transition-all cursor-pointer"
                value={formData.EmpType}
                onChange={(e) => setFormData({...formData, EmpType: e.target.value})}
              >
                {designations.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            {/* Field 4 */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contractor Name</label>
              <input 
                type="text" 
                placeholder="If applicable" 
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500 transition-all" 
                value={formData.EmpContractor || ''}
                onChange={(e) => setFormData({...formData, EmpContractor: e.target.value})}
              />
            </div>
            {/* Field 5 */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Username</label>
              <input 
                type="text" 
                placeholder="User ID" 
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500 transition-all" 
                value={formData.EmpUser || ''}
                onChange={(e) => setFormData({...formData, EmpUser: e.target.value})}
              />
            </div>
            {/* Field 6 */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                placeholder="********" 
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500 transition-all" 
                value={formData.EmpPass || ''}
                onChange={(e) => setFormData({...formData, EmpPass: e.target.value})}
              />
            </div>

            {/* Save Button - Spans remaining 2 columns or aligns right */}
            <div className="md:col-span-2">
              <button 
                onClick={handleSave}
                className="w-full md:w-48 float-right bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
              >
                <Save size={16} />
                Save Employee
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EMPLOYEE LIST CONTAINER */}
      <div className="mt-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-700">Active Personnel</h3>
          </div>
          <button 
            onClick={fetchEmployees}
            className="text-slate-400 hover:text-blue-600 transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Designation</th>
                <th className="px-6 py-3">User Name</th>
                <th className="px-6 py-3">Password</th>
                <th className="px-6 py-3">Contractor</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {employees.length > 0 ? (
                employees.map((emp: any) => (
                  <tr key={emp.EmpId} className="hover:bg-slate-50/50 transition-colors text-sm">
                    <td className="px-6 py-3 font-mono text-xs text-blue-600 font-medium">{emp.EmpCode}</td>
                    <td className="px-6 py-3 font-medium text-slate-700">{emp.EmpName}</td>
                    <td className="px-6 py-3 text-xs text-slate-500">{emp.EmpType}</td>
                    <td className="px-6 py-3 text-xs text-slate-500">{emp.EmpUser || '-'}</td>
                    <td className="px-6 py-3 text-xs text-slate-500">{emp.EmpPass || '-'}</td>
                    <td className="px-6 py-3 text-xs text-slate-500">{emp.EmpContractor || '-'}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        emp.ActiveStatus 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : 'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {emp.ActiveStatus ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button className="text-blue-500 hover:underline text-xs font-semibold">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 text-xs italic">
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