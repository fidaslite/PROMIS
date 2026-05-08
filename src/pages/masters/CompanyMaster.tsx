import React, { useState, useEffect } from 'react';
import { Save, Building2, Globe, Mail, Phone, MapPin, Landmark, LayoutGrid, FileEdit, Upload, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { companyService } from '../../services/companyService';
import toast, { Toaster } from 'react-hot-toast';

const CompanyMaster: React.FC = () => {
  const [viewMode, setViewMode] = useState<'show' | 'edit'>('show');
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const initialForm = {
    CompanyName: '', Tagline: '', PlantCode: '', LogoPath: '',
    AddressLine1: '', AddressLine2: '', AddressLine3: '', State: '', Pincode: '',
    BankName: '', AccountNumber: '', IFSCCode: '', GSTNo: '',
    PrimaryContactName: '', PrimaryEmail: '', PrimaryMobile: '', PrimaryWhatsApp: '',
    SecondaryContactName: '', SecondaryEmail: '', SecondaryMobile: '', SecondaryWhatsApp: '',
    Website: '', CreatedBy: 'Admin'
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await companyService.getDetails();
      if (res.status === 'success' && res.data.length > 0) {
        const data = res.data[0];
        setCompanyId(data.CompanyID);
        setFormData(data);
        // Set logo preview from the dedicated binary endpoint
        setLogoPreview(companyService.getLogoUrl(data.CompanyID));
        setViewMode('show');
      } else {
        setViewMode('edit');
      }
    } catch (error) {
      toast.error("Failed to fetch company details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, LogoPath: base64String }));
        setLogoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.CompanyName) {
      toast.error("Company Name is required");
      return;
    }
    try {
      const res = companyId 
        ? await companyService.update(companyId, formData)
        : await companyService.create(formData);

      if (res.status === 'success') {
        toast.success(res.message);
        fetchData();
      }
    } catch (error) {
      toast.error("Error saving data");
    }
  };

  return (
    <div className="px-4 lg:px-6 pt-2 pb-6 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 ml-auto">
          <button onClick={() => setViewMode('show')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'show' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}><LayoutGrid size={14} /> Show</button>
          <button onClick={() => setViewMode('edit')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'edit' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}><FileEdit size={14} /> {companyId ? 'Edit' : 'Add'}</button>
        </div>
      </div>

{viewMode === 'show' ? (
  /* NEW COMPACT & ALIGNED DASHBOARD VIEW */
  <div className="space-y-4 animate-in fade-in duration-500">
    
    {/* TOP BANNER: Identity & Logo */}
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
      <div className="flex-shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
        {logoPreview ? (
          <img src={logoPreview} alt="Logo" className="w-24 h-24 md:w-20 md:h-20 object-contain" />
        ) : (
          <div className="w-20 h-20 flex items-center justify-center text-slate-300"><ImageIcon size={40} /></div>
        )}
      </div>
      
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{formData.CompanyName || 'Company Name'}</h2>
        <p className="text-sm text-blue-600 font-medium mt-1">{formData.Tagline || 'Enterprise Tagline'}</p>
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
          {/* <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-200 flex items-center gap-1.5">
            <Building2 size={12}/> Plant: {formData.PlantCode || 'N/A'}
          </span> */}
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-200 flex items-center gap-1.5">
            <Globe size={12}/> {formData.Website || 'No Website'}
          </span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Address Identity */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-5 text-slate-900"><MapPin size={48}/></div>
        <h3 className="text-[10px] font-black text-blue-600 uppercase mb-4 tracking-widest">Registered Office</h3>
        <div className="text-xs text-slate-600 leading-relaxed space-y-1">
          <p className="font-semibold text-slate-800">{formData.AddressLine1}</p>
          <p>{formData.AddressLine2}</p>
          <p>{formData.AddressLine3}</p>
          <p className="pt-2 text-slate-400 font-bold uppercase">{formData.State} — {formData.Pincode}</p>
        </div>
      </div>

      {/* 2. Statutory Details */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-5 text-slate-900"><Landmark size={48}/></div>
        <h3 className="text-[10px] font-black text-emerald-600 mb-4 uppercase tracking-widest">Billing & Statutory</h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase">GSTIN</span>
            <span className="text-xs font-mono font-bold text-slate-700">{formData.GSTNo || '-'}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Bank</span>
            <span className="text-xs font-bold text-slate-700">{formData.BankName || '-'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">IFSC</span>
            <span className="text-xs font-mono font-bold text-slate-700">{formData.IFSCCode || '-'}</span>
          </div>
        </div>
      </div>

      {/* 3. Account Numbers */}
      <div className=" bg-white  p-5 rounded-2xl shadow-sm text-black">
        <h3 className="text-[10px]  font-black text-slate-400 uppercase mb-4 tracking-widest">Account Information</h3>
        <div className="space-y-4">
          <div>
            <p className="text-[9px] text-slate-500 font-bold uppercase mb-1 text-black-500">Account Number</p>
            <p className="text-lg font-mono font-bold tracking-wider">{formData.AccountNumber || '---'}</p>
          </div>
          <div className="pt-2 border-t border-slate-800">
             <div className="flex items-center gap-2 text-xs text-slate-400">
                <Landmark size={14}/> Default Settlement Bank
             </div>
          </div>
        </div>
      </div>
    </div>

    {/* CONTACT PERSONS - Compact Row */}
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
       <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
            {formData.PrimaryContactName?.charAt(0) || 'P'}
          </div>
          <div>
             <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Primary Contact</h4>
             <p className="text-sm font-bold text-slate-800">{formData.PrimaryContactName}</p>
             <div className="flex gap-3 text-[10px] text-slate-500 mt-1">
                <span className="flex items-center gap-1"><Phone size={10}/> {formData.PrimaryMobile}</span>
                <span className="flex items-center gap-1"><Mail size={10}/> {formData.PrimaryEmail}</span>
             </div>
          </div>
       </div>

       <div className="flex items-center gap-4 border-l-0 md:border-l border-slate-100 md:pl-8">
          <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-bold italic">
            {formData.SecondaryContactName?.charAt(0) || 'S'}
          </div>
          <div>
             <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Secondary Contact</h4>
             <p className="text-sm font-bold text-slate-800">{formData.SecondaryContactName || 'Not Assigned'}</p>
             {formData.SecondaryContactName && (
               <div className="flex gap-3 text-[10px] text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><Phone size={10}/> {formData.SecondaryMobile}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={10}/> {formData.SecondaryWhatsApp}</span>
               </div>
             )}
          </div>
       </div>
    </div>
  </div>
) : (
        /* COMPACT EDIT VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 space-y-8">
            
            {/* Identity */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
              <div className="lg:col-span-1 flex flex-col items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="text-[9px] font-bold text-slate-500 uppercase mb-3">Company Logo</label>
                <div className="relative group w-20 h-20 bg-white border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                   {logoPreview ? <img src={logoPreview} className="w-full h-full object-contain" /> : <Upload className="text-slate-300" />}
                   <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <p className="text-[8px] text-slate-400 mt-2 text-center leading-tight">Click to upload PNG/JPG</p>
              </div>
              <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Company Name *</label>
                  <input name="CompanyName" value={formData.CompanyName} onChange={handleInputChange} placeholder="Legal Entity Name" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Tagline</label>
                  <input name="Tagline" value={formData.Tagline} onChange={handleInputChange} placeholder="Corporate Slogan" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none" />
                </div>
                {/* <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Plant Code</label>
                  <input name="PlantCode" value={formData.PlantCode} onChange={handleInputChange} placeholder="Factory/Branch ID" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none" />
                </div> */}
                <div className="flex flex-col gap-1 md:col-span-3">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Website URL</label>
                  <input name="Website" value={formData.Website} onChange={handleInputChange} placeholder="https://www.example.com" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>

            {/* Address & Statutory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location Information</h4>
                <input name="AddressLine1" value={formData.AddressLine1} onChange={handleInputChange} placeholder="Building / Plot No" className="w-full bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                <input name="AddressLine2" value={formData.AddressLine2} onChange={handleInputChange} placeholder="Street / Road" className="w-full bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                <div className="grid grid-cols-3 gap-2">
                  <input name="AddressLine3" value={formData.AddressLine3} onChange={handleInputChange} placeholder="City" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                  <input name="State" value={formData.State} onChange={handleInputChange} placeholder="State" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                  <input name="Pincode" value={formData.Pincode} onChange={handleInputChange} placeholder="Zip Code" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Bank & Tax Details</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input name="BankName" value={formData.BankName} onChange={handleInputChange} placeholder="Bank Name" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                  <input name="GSTNo" value={formData.GSTNo} onChange={handleInputChange} placeholder="GSTIN" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                  <input name="AccountNumber" value={formData.AccountNumber} onChange={handleInputChange} placeholder="Account No" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                  <input name="IFSCCode" value={formData.IFSCCode} onChange={handleInputChange} placeholder="IFSC Code" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
               <div className="space-y-3">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Contact</h4>
                 <div className="grid grid-cols-2 gap-2">
                    <input name="PrimaryContactName" value={formData.PrimaryContactName} onChange={handleInputChange} placeholder="Name" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                    <input name="PrimaryEmail" value={formData.PrimaryEmail} onChange={handleInputChange} placeholder="Email" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                    <input name="PrimaryMobile" value={formData.PrimaryMobile} onChange={handleInputChange} placeholder="Mobile" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                    <input name="PrimaryWhatsApp" value={formData.PrimaryWhatsApp} onChange={handleInputChange} placeholder="WhatsApp" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                 </div>
               </div>
               <div className="space-y-3">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Secondary Contact</h4>
                 <div className="grid grid-cols-2 gap-2">
                    <input name="SecondaryContactName" value={formData.SecondaryContactName} onChange={handleInputChange} placeholder="Name" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                    <input name="SecondaryEmail" value={formData.SecondaryEmail} onChange={handleInputChange} placeholder="Email" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                    <input name="SecondaryMobile" value={formData.SecondaryMobile} onChange={handleInputChange} placeholder="Mobile" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                    <input name="SecondaryWhatsApp" value={formData.SecondaryWhatsApp} onChange={handleInputChange} placeholder="WhatsApp" className="bg-white border border-slate-200 rounded-lg px-3 h-[38px] text-sm outline-none" />
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-slate-50 px-8 py-4 flex justify-end gap-3 border-t border-slate-200">
            <button onClick={() => setViewMode('show')} className="px-6 py-2 text-xs font-bold text-slate-500">Discard</button>
            <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md"><Save size={16} /> Save Profile</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyMaster;