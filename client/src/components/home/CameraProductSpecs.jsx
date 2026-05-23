import React from 'react';
import { 
  HiOutlineVideoCamera, 
  HiOutlineMoon, 
  HiOutlineLightningBolt, 
  HiOutlineDatabase,
  HiOutlineShieldCheck,
  HiOutlineZoomIn
} from 'react-icons/hi';

const CameraProductSpecs = ({ specifications, variant = 'compact' }) => {
  if (!specifications) return null;

  // For compact view (Product Cards)
  if (variant === 'compact') {
    const compactSpecs = [
      { key: 'Resolution', icon: HiOutlineVideoCamera, label: 'Res' },
      { key: 'Night Vision', icon: HiOutlineMoon, label: 'Night' },
      { key: 'Optical Zoom', icon: HiOutlineZoomIn, label: 'Zoom' }
    ];

    const activeCompact = compactSpecs
      .map(s => ({ ...s, value: specifications[s.key] }))
      .filter(s => s.value);

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {activeCompact.slice(0, 2).map((spec, idx) => (
          <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl">
            <spec.icon className="text-indigo-600" size={12} />
            <span className="text-[10px] font-black text-indigo-700 truncate max-w-[120px]">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // For full view (Product Details)
  const specMap = [
    { key: 'Resolution', icon: HiOutlineVideoCamera, label: 'Resolution', sub: 'Sensor Output' },
    { key: 'Thermal Resolution', icon: HiOutlineVideoCamera, label: 'Thermal Res', sub: 'Thermal Sensor' },
    { key: 'Night Vision', icon: HiOutlineMoon, label: 'Night Vision', sub: 'Low Light Tech' },
    { key: 'Power', icon: HiOutlineLightningBolt, label: 'Power Input', sub: 'Voltage / PoE' },
    { key: 'Storage', icon: HiOutlineDatabase, label: 'Local Storage', sub: 'SD Card Support' },
    { key: 'Protection', icon: HiOutlineShieldCheck, label: 'Ingress Protection', sub: 'IP / IK Rating' },
    { key: 'Optical Zoom', icon: HiOutlineZoomIn, label: 'Optical Zoom', sub: 'Lens Capability' }
  ];

  const activeSpecs = specMap
    .map(s => ({ ...s, value: specifications[s.key] }))
    .filter(s => s.value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeSpecs.map((spec, idx) => (
        <div key={idx} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
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

export default CameraProductSpecs;
