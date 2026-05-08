import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Box, Edit, Trash2, X, Package } from 'lucide-react';
import { productService } from '../../services/productService';
import toast, { Toaster } from 'react-hot-toast';

const ProductMaster: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialForm = {
    product_code: '',
    product_name: '',
    production_type_id: 0, // Defaulting as requested to avoid backend validation error
    ActiveStatus: true
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: any) => {
    setEditingId(product.product_id);
    setFormData({
      product_code: product.product_code || '',
      product_name: product.product_name || '',
      production_type_id: product.production_type_id || 0,
      ActiveStatus: true
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
          Delete product: <b>{code}</b>?
        </span>
        <div className="flex justify-end gap-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-md">
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await productService.update(id, { ActiveStatus: false });
                if (res.status === 'success') {
                  toast.success("Product deleted successfully");
                  fetchProducts();
                }
              } catch (error) {
                toast.error("Delete failed");
              }
            }}
            className="px-3 py-1 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 rounded-md shadow-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' });
  };

  const handleSave = async () => {
    if (!formData.product_code || !formData.product_name) {
      toast.error("Code and Name are required");
      return;
    }

    try {
      const res = editingId 
        ? await productService.update(editingId, formData)
        : await productService.create(formData);

      if (res.status === 'success') {
        toast.success(editingId ? "Product updated" : "Product created");
        setFormData(initialForm);
        setEditingId(null);
        fetchProducts();
      } else {
        toast.error(res.message || "Operation failed");
      }
    } catch (error) {
      toast.error("Error saving product");
    }
  };

  return (
    <div className="px-4 lg:px-6 pt-2 pb-6">
      <Toaster position="top-right" />

      {/* ENTRY FORM */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-1">
        <div className="bg-slate-50 px-5 py-2 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box size={16} className="text-blue-600" />
            <h3 className="text-xs font-semibold text-slate-700">
              {editingId ? 'Edit Product Details' : 'Register New Product'}
            </h3>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Product Code *</label>
              <input
                type="text"
                placeholder="e.g. SKU-1001"
                className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500"
                value={formData.product_code}
                onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Product Name *</label>
              <input
                type="text"
                placeholder="e.g. Cotton T-Shirt"
                className="w-full bg-white border border-slate-200 rounded-lg p-2 h-[40px] text-sm outline-none focus:border-blue-500"
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              />
            </div>

            <div className="flex gap-2 h-[40px]">
              {editingId && (
                <button onClick={handleCancel} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all">
                  <X size={16} /> Cancel
                </button>
              )}
              <button 
                onClick={handleSave}
                className={`flex-1 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
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
            <Package size={16} className="text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-700">Active Product Catalog</h3>
          </div>
          <button onClick={fetchProducts} className="text-slate-400 hover:text-blue-600 transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-4 py-3 text-center">#</th>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.filter(p => p.ActiveStatus !== false).length > 0 ? (
                products.filter(p => p.ActiveStatus !== false).map((product, index) => (
                  <tr key={product.product_id} className="hover:bg-slate-50 transition-colors text-sm">
                    <td className="px-4 py-3 text-center text-slate-400 text-xs">{index + 1}</td>
                    <td className="px-6 py-3 font-medium text-slate-700">{product.product_code}</td>
                    <td className="px-6 py-3 font-medium text-slate-700">{product.product_name}</td>
                    <td className="px-6 py-3 text-right flex justify-end gap-3">
                      <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs font-semibold">
                        <Edit size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(product.product_id, product.product_code)} className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs font-semibold">
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 text-xs italic">
                    {loading ? 'Fetching catalog...' : 'No products defined.'}
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

export default ProductMaster;
