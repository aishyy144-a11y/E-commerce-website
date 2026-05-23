import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineTrash, 
  HiOutlineShieldCheck,
  HiOutlineUserCircle
} from 'react-icons/hi';
import { toast } from 'react-toastify';

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (err) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      await api.delete(`/api/users/${id}`);
      toast.success('User removed');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to remove user');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Customer Base</h1>
        <p className="text-gray-500 font-medium">Manage your industrial client relationships.</p>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Client</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Email</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Access Level</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Joined Date</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                        <HiOutlineUserCircle size={24} />
                      </div>
                      <span className="font-black text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                      <HiOutlineMail className="text-gray-300" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      user.role === 'admin' 
                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                        : 'bg-gray-50 text-gray-500 border-gray-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleDelete(user._id)}
                      disabled={user.role === 'admin'}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
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

export default AdminCustomers;
