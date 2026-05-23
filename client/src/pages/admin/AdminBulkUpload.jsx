import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  HiOutlineCloudUpload, 
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle
} from 'react-icons/hi';

const AdminBulkUpload = () => {
  const navigate = useNavigate();
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleBulkUpload = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      let products;
      try {
        products = JSON.parse(jsonInput);
      } catch (e) {
        throw new Error('Invalid JSON format. Please check your data.');
      }

      if (!Array.isArray(products)) {
        throw new Error('Data must be an array of products.');
      }

      const response = await axios.post('http://localhost:5000/api/products/bulk', products);
      setSuccess(`Successfully uploaded ${response.data.length} products!`);
      setJsonInput('');
      setTimeout(() => navigate('/admin/products'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const sampleJson = `[
  {
    "name": "Sample Product",
    "slug": "sample-product-1",
    "modelNumber": "MODEL-123",
    "brand": "BrandName",
    "description": "Professional technical description...",
    "price": 299.99,
    "stock": 50,
    "category": "CATEGORY_ID_HERE",
    "images": ["https://image-url.com/1.jpg"],
    "specifications": {
      "Voltage": "220V",
      "Power": "500W"
    }
  }
]`;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Bulk Inventory Upload</h1>
        <p className="text-gray-500 font-medium">Quickly import large technical catalogs using structured JSON data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
              <HiOutlineCloudUpload className="text-primary text-2xl" />
              <h3 className="text-xl font-black text-gray-900">JSON Data Input</h3>
            </div>

            <textarea 
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your JSON array here..."
              className="w-full h-[400px] p-6 bg-gray-50 border border-gray-100 rounded-3xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all leading-relaxed"
            />

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 font-bold text-sm">
                <HiOutlineExclamationCircle size={20} />
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 text-green-600 rounded-2xl flex items-center gap-3 font-bold text-sm">
                <HiOutlineCheckCircle size={20} />
                {success}
              </div>
            )}

            <button 
              onClick={handleBulkUpload}
              disabled={loading || !jsonInput}
              className="w-full py-6 bg-primary text-white font-black text-xl rounded-[32px] shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <HiOutlineCloudUpload size={24} />
                  Start Bulk Import
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <HiOutlineClipboardList className="text-primary" />
              Required Format
            </h4>
            <div className="space-y-4">
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Ensure your data is an <strong>array of objects</strong>. Each object must contain:
              </p>
              <ul className="space-y-2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                <li>• name (String)</li>
                <li>• description (String)</li>
                <li>• price (Number)</li>
                <li>• category (ObjectId String)</li>
                <li>• stock (Number)</li>
                <li>• images (Array of URLs)</li>
              </ul>
            </div>
          </div>

          <div className="bg-primary-light p-8 rounded-[32px] border border-primary/10">
            <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Sample JSON</h4>
            <pre className="text-[10px] text-primary/80 font-mono overflow-x-auto whitespace-pre-wrap">
              {sampleJson}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBulkUpload;
