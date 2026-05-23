import React from 'react';
import { 
  HiOutlineChip, 
  HiOutlineLightningBolt, 
  HiOutlineArrowsExpand,
  HiOutlineScale,
  HiOutlineGlobe,
  HiOutlineAdjustments
} from 'react-icons/hi';

const MiscProductSpecs = ({ specifications, variant = 'compact' }) => {
  if (!specifications) return null;

  // For compact view (Product Cards)
  if (variant === 'compact') {
    const compactSpecs = [
      { key: 'Resolution', icon: HiOutlineAdjustments },
      { key: 'Capacity', icon: HiOutlineLightningBolt },
      { key: 'Range', icon: HiOutlineGlobe },
      { key: 'Length', icon: HiOutlineArrowsExpand },
      { key: 'Type', icon: HiOutlineChip }
    ];

    const activeCompact = compactSpecs
      .map(s => ({ ...s, value: specifications[s.key] }))
      .filter(s => s.value);

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {activeCompact.slice(0, 2).map((spec, idx) => (
          <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl">
            <spec.icon className="text-emerald-600" size={12} />
            <span className="text-[10px] font-black text-emerald-700 truncate max-w-[120px]">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // For full view (Product Details)
  const specEntries = Object.entries(specifications);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {specEntries.map(([key, value], idx) => (
        <div key={idx} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <HiOutlineAdjustments size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{key}</p>
              <p className="text-sm font-bold text-gray-900 leading-tight mt-1">{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MiscProductSpecs;
