import React from 'react';
import { 
  HiOutlineChip, 
  HiOutlineShieldCheck, 
  HiOutlineTable, 
  HiOutlineTerminal,
  HiOutlineCheckCircle
} from 'react-icons/hi';

const LMRProductSpecs = ({ specifications, variant = 'compact' }) => {
  if (!specifications) return null;

  // For compact view (Product Cards)
  if (variant === 'compact') {
    const compactSpecs = [
      { key: 'Frequency Range', icon: HiOutlineTerminal },
      { key: 'Frequency Band', icon: HiOutlineTerminal },
      { key: 'Power Output', icon: HiOutlineTerminal },
      { key: 'Power Out', icon: HiOutlineTerminal },
      { key: 'IP Rating', icon: HiOutlineShieldCheck }
    ];

    const activeCompact = compactSpecs
      .map(s => ({ ...s, value: specifications[s.key] }))
      .filter(s => s.value);

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {activeCompact.slice(0, 2).map((spec, idx) => (
          <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl">
            <spec.icon className="text-primary" size={12} />
            <span className="text-[10px] font-black text-primary truncate max-w-[120px]">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // For full view (Product Details)
  const specEntries = Object.entries(specifications).filter(([key]) => key !== 'Compatibility');
  const compatibility = specifications['Compatibility'];

  return (
    <div className="space-y-8">
      {/* Technical Specifications Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex items-center gap-2">
          <HiOutlineTable className="text-primary" size={20} />
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Technical Parameters</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody>
              {specEntries.map(([key, value], idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-1/3">{key}</td>
                  <td className="px-8 py-4 text-sm font-bold text-gray-900">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spare Part Compatibility Section */}
      {compatibility && (
        <div className="bg-blue-50 rounded-[32px] p-8 border border-blue-100 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white">
                <HiOutlineCheckCircle size={24} />
              </div>
              <h4 className="text-lg font-black text-gray-900">Spare Part Compatibility</h4>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-6">
              This component is certified for use with the following systems and equipment:
            </p>
            <div className="flex flex-wrap gap-3">
              {compatibility.split(',').map((item, idx) => (
                <div key={idx} className="px-4 py-2 bg-white border border-blue-200 rounded-xl shadow-sm flex items-center gap-2">
                  <HiOutlineChip className="text-primary" size={16} />
                  <span className="text-sm font-bold text-gray-700">{item.trim()}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
      )}
    </div>
  );
};

export default LMRProductSpecs;
