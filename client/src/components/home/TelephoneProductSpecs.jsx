import React from 'react';
import { 
  HiOutlineDesktopComputer, 
  HiOutlineLink, 
  HiOutlineShieldCheck,
  HiOutlineSpeakerphone,
  HiOutlineWifi,
  HiOutlineHashtag
} from 'react-icons/hi';

const TelephoneProductSpecs = ({ specifications, variant = 'compact' }) => {
  if (!specifications) return null;

  // For compact view (Product Cards)
  if (variant === 'compact') {
    const compactSpecs = [
      { key: 'Display Type', icon: HiOutlineDesktopComputer, label: 'Display' },
      { key: 'Connectivity', icon: HiOutlineLink, label: 'Link' },
      { key: 'Programmable Keys', icon: HiOutlineHashtag, label: 'Keys' }
    ];

    const activeCompact = compactSpecs
      .map(s => ({ ...s, value: specifications[s.key] }))
      .filter(s => s.value);

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {activeCompact.slice(0, 2).map((spec, idx) => (
          <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl">
            <spec.icon className="text-blue-600" size={12} />
            <span className="text-[10px] font-black text-blue-700 truncate max-w-[120px]">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // For full view (Product Details)
  const specMap = [
    { key: 'Display Type', icon: HiOutlineDesktopComputer, label: 'Display Type', sub: 'Screen Info' },
    { key: 'Connectivity', icon: HiOutlineLink, label: 'Connectivity', sub: 'Interface / PoE' },
    { key: 'Programmable Keys', icon: HiOutlineHashtag, label: 'Function Keys', sub: 'Customizable' },
    { key: 'Audio', icon: HiOutlineSpeakerphone, label: 'Audio Quality', sub: 'Voice Tech' },
    { key: 'Durability', icon: HiOutlineShieldCheck, label: 'Build Quality', sub: 'Material' },
    { key: 'Bluetooth', icon: HiOutlineWifi, label: 'Wireless', sub: 'Bluetooth Support' }
  ];

  const activeSpecs = specMap
    .map(s => ({ ...s, value: specifications[s.key] }))
    .filter(s => s.value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeSpecs.map((spec, idx) => (
        <div key={idx} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <spec.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{spec.label}</p>
              <p className="text-sm font-bold text-gray-900 leading-tight mt-1">{spec.value}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">{spec.sub}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TelephoneProductSpecs;
