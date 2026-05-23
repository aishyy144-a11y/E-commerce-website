import React from 'react';
import { 
  HiOutlineClock, 
  HiOutlineLightningBolt, 
  HiOutlineTerminal, 
  HiOutlineArrowsExpand,
  HiOutlineCube,
  HiOutlineShieldCheck
} from 'react-icons/hi';

const DroneProductSpecs = ({ specifications, variant = 'compact' }) => {
  if (!specifications) return null;

  const specMap = [
    { key: 'Flight Time', icon: HiOutlineClock, label: 'Flight' },
    { key: 'Battery Capacity', icon: HiOutlineLightningBolt, label: 'Capacity', altKey: 'Capacity' },
    { key: 'Voltage', icon: HiOutlineLightningBolt, label: 'Voltage' },
    { key: 'Compatibility', icon: HiOutlineTerminal, label: 'Comp.' },
    { key: 'Max Speed', icon: HiOutlineArrowsExpand, label: 'Speed' },
    { key: 'Payload', icon: HiOutlineCube, label: 'Payload' }
  ];

  const activeSpecs = specMap
    .map(s => ({ 
      ...s, 
      value: specifications[s.key] || specifications[s.altKey] 
    }))
    .filter(s => s.value);

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {activeSpecs.slice(0, 3).map((spec, idx) => (
          <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl">
            <spec.icon className="text-primary" size={14} />
            <span className="text-[10px] font-black text-gray-900 whitespace-nowrap">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {activeSpecs.map((spec, idx) => (
        <div key={idx} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-primary/5 rounded-2xl flex items-center justify-center mb-4">
            <spec.icon className="text-primary" size={20} />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{spec.key}</p>
          <p className="text-lg font-black text-gray-900">{spec.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DroneProductSpecs;
