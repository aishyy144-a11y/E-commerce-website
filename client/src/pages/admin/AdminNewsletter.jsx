import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  HiOutlineMailOpen, 
  HiOutlinePaperAirplane, 
  HiOutlineUserGroup,
  HiOutlineMail,
  HiOutlineClock
} from 'react-icons/hi';
import { toast } from 'react-toastify';

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/newsletter/subscribers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscribers(response.data);
    } catch (err) {
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleSendBulk = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      return toast.warning('Please enter both subject and message');
    }

    if (!window.confirm(`Are you sure you want to send this email to ${subscribers.filter(s => s.status === 'active').length} active subscribers?`)) {
      return;
    }

    setSending(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/newsletter/send-bulk', {
        subject,
        message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(response.data.message);
      setSubject('');
      setMessage('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send bulk emails');
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Newsletter Management</h1>
        <p className="text-gray-500 font-medium">Manage subscribers and send promotional campaigns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bulk Email Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <HiOutlinePaperAirplane size={24} className="rotate-45" />
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Send Bulk Promotion</h3>
            </div>

            <form onSubmit={handleSendBulk} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Subject</label>
                <input 
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                  placeholder="Enter campaign subject"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">HTML Message Content</label>
                <textarea 
                  required
                  rows="10"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium leading-relaxed"
                  placeholder="Enter your promotion message (HTML supported)..."
                ></textarea>
                <p className="text-[10px] text-gray-400 font-bold ml-1">Tip: Use &lt;h1&gt;, &lt;p&gt;, &lt;b&gt; tags for formatting.</p>
              </div>

              <button 
                type="submit"
                disabled={sending || subscribers.length === 0}
                className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {sending ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <HiOutlinePaperAirplane size={20} className="rotate-45" />
                    Send Campaign to {subscribers.filter(s => s.status === 'active').length} Subscribers
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Subscriber List Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <HiOutlineUserGroup className="text-primary" size={24} />
                <h3 className="text-lg font-black text-gray-900 tracking-tighter uppercase">Subscribers</h3>
              </div>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black">
                {subscribers.length}
              </span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-hide pr-2">
              {subscribers.length === 0 ? (
                <div className="text-center py-10">
                  <HiOutlineMailOpen size={40} className="text-gray-100 mx-auto mb-2" />
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No subscribers yet</p>
                </div>
              ) : (
                subscribers.map((sub) => (
                  <div key={sub._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <HiOutlineMail className="text-primary" size={16} />
                      </div>
                      <span className="text-sm font-bold text-gray-700 truncate flex-1">{sub.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <HiOutlineClock className="text-gray-300" size={12} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        sub.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletter;
