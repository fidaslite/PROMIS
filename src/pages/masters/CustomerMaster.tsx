import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Users, Edit, Trash2, X, MapPin, Phone, Mail, LayoutGrid, FileEdit, Search, User } from 'lucide-react';
import { customerService } from '../../services/customerService';
import toast, { Toaster } from 'react-hot-toast';

const CustomerMaster: React.FC = () => {
  const [viewMode, setViewMode] = useState<'view' | 'add'>('view');
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const initialForm = {
    CustomerCode: '',
    CustomerName: '',
    ConsultantPerson: '',
    State: '',
    City: '',
    MobileNo: '',
    Pincode: '',
    Address1: '',
    email: '',
    GST: '',
    PAN: '',
    Country: 'India',
    Date: new Date().toISOString().split('T')[0],
    ActiveStatus: true
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await customerService.getAll();
      if (res.status === 'success') {
        setCustomers(res.data);
      }
    } catch (error) {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (customer: any) => {
    setEditingId(customer.CustomerID);
    setFormData({
      ...customer,
      Date: customer.Date ? new Date(customer.Date).toISOString().split('T')[0] : initialForm.Date
    });
    setViewMode('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialForm);
    setViewMode('view');
  };

  const handleSave = async () => {
    if (!formData.CustomerName || !formData.CustomerCode) {
      toast.error("Code and Name are required");
      return;
    }

    try {
      const res = editingId 
        ? await customerService.update(editingId, formData)
        : await customerService.create(formData);

      if (res.status === 'success') {
        toast.success(res.message);
        setFormData(initialForm);
        setEditingId(null);
        setViewMode('view');
        fetchCustomers();
      }
    } catch (error) {
      toast.error("Error saving customer");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-slate-700">Delete customer: <b>{name}</b>?</span>
        <div className="flex justify-end gap-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-md">Cancel</button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await customerService.update(id, { ActiveStatus: false });
                if (res.status === 'success') {
                  toast.success("Customer deactivated");
                  fetchCustomers();
                }
              } catch (error) { toast.error("Delete failed"); }
            }}
            className="px-3 py-1 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 rounded-md shadow-sm"
          >Confirm</button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' });
  };

  const filteredCustomers = customers.filter(c => 
    c.ActiveStatus && 
    (c.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     c.CustomerCode?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="px-4 lg:px-6 pt-2 pb-6 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      {/* HEADER CONTROLS */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-100">
            <Users size={20} />
          </div>
          <p className="text-sm font-medium text-slate-500">Customer Relationship Management</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setViewMode('view')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'view' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutGrid size={14} /> View Directory
          </button>
          <button
            onClick={() => {setEditingId(null); setFormData(initialForm); setViewMode('add');}}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'add' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <FileEdit size={14} /> {editingId ? 'Edit Customer' : 'Add New'}
          </button>
        </div>
      </div>

      {viewMode === 'add' ? (
        /* ENTRY FORM (ADD/EDIT) */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Customer Code *</label>
                <input name="CustomerCode" value={formData.CustomerCode} onChange={handleInputChange} placeholder="e.g. CUST001" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Customer Name *</label>
                <input name="CustomerName" value={formData.CustomerName} onChange={handleInputChange} placeholder="e.g. Reliance Industries" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Consultant Person</label>
                <input name="ConsultantPerson" value={formData.ConsultantPerson} onChange={handleInputChange} placeholder="Contact Person" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t pt-6">
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Address</label>
                <input name="Address1" value={formData.Address1} onChange={handleInputChange} placeholder="Flat, Street, Area" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">City</label>
                <input name="City" value={formData.City} onChange={handleInputChange} placeholder="Mumbai" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">State</label>
                <input name="State" value={formData.State} onChange={handleInputChange} placeholder="Maharashtra" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Pincode</label>
                <input name="Pincode" value={formData.Pincode} onChange={handleInputChange} placeholder="400001" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Country</label>
                <input name="Country" value={formData.Country} onChange={handleInputChange} placeholder="India" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Mobile No</label>
                <input name="MobileNo" value={formData.MobileNo} onChange={handleInputChange} placeholder="+91 0000000000" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Email</label>
                <input name="email" value={formData.email} onChange={handleInputChange} placeholder="contact@customer.com" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t pt-6">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">GST Number</label>
                <input name="GST" value={formData.GST} onChange={handleInputChange} placeholder="27AAAAA0000A1Z5" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none uppercase" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">PAN Number</label>
                <input name="PAN" value={formData.PAN} onChange={handleInputChange} placeholder="ABCDE1234F" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none uppercase" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Date</label>
                <input type="date" name="Date" value={formData.Date} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="flex items-end gap-2 h-[38px]">
                <button onClick={handleCancel} className="flex-1 bg-slate-100 text-slate-600 font-bold rounded-lg h-full text-xs hover:bg-slate-200 transition-all">Cancel</button>
                <button onClick={handleSave} className="flex-[2] bg-blue-600 text-white font-bold rounded-lg h-full text-xs shadow-md shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  <Save size={16} /> Save Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LIST VIEW (DIRECTORY) */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-slate-600" />
              <h3 className="text-sm font-bold text-slate-700">Active Customer Directory</h3>
            </div>
            <div className="flex items-center gap-3">
               <div className="relative">
                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                  type="text" 
                  placeholder="Search name or code..." 
                  className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
               <button onClick={fetchCustomers} className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded-lg shadow-sm">
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-4 py-3 text-center">#</th>
                  <th className="px-6 py-3">Customer Info</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Contact Person</th>
                  <th className="px-6 py-3">Mobile & Email</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, idx) => (
                    <tr key={customer.CustomerID} className="hover:bg-slate-50 transition-colors text-sm">
                      <td className="px-4 py-3 text-center text-slate-400 text-xs">{idx + 1}</td>
                      <td className="px-6 py-3">
                        <div className="font-bold text-slate-800">{customer.CustomerName}</div>
                        <div className="text-[10px] text-slate-600 font-mono tracking-tighter">{customer.CustomerCode}</div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-xs text-slate-700 font-medium">{customer.City}, {customer.State}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin size={10}/> {customer.Pincode}</div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2 text-xs text-slate-700">
                          <User size={12} className="text-slate-400"/>
                          {customer.ConsultantPerson || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Phone size={12} className="text-slate-400"/>
                          {customer.MobileNo || '-'}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                          <Mail size={10} className="text-slate-400"/>
                          {customer.email || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right flex justify-end gap-3 h-full items-center">
                        <button onClick={() => handleEdit(customer)} className="text-blue-500 hover:text-blue-700 font-bold text-xs flex items-center gap-1"><Edit size={14} /> Edit</button>
                        <button onClick={() => handleDelete(customer.CustomerID, customer.CustomerName)} className="text-red-400 hover:text-red-600 font-bold text-xs flex items-center gap-1"><Trash2 size={14} /> Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="p-12 text-center text-slate-400 text-xs italic">No matching customers found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMaster;