import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { HiOutlinePhotograph, HiOutlineX, HiOutlineCheck } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUploadWithCrop = ({ value, onChange, label, aspect = 16 / 9 }) => {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImage(reader.result);
        setShowCropper(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const createCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onChange(croppedImage);
      setShowCropper(false);
      setImage(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label || 'Image'}</label>
      
      <div className="relative group">
        {value ? (
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label className="p-2 bg-white rounded-xl cursor-pointer hover:bg-primary hover:text-white transition-all">
                <HiOutlinePhotograph size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
              <button 
                type="button"
                onClick={() => onChange('')}
                className="p-2 bg-white rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
              >
                <HiOutlineX size={20} />
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-100 hover:border-primary/50 transition-all group">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-primary transition-all mb-3">
              <HiOutlinePhotograph size={24} />
            </div>
            <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600">Click to upload image</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        )}
      </div>

      <AnimatePresence>
        {showCropper && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden relative z-10 shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-black text-gray-900 uppercase tracking-tight">Crop Image</h3>
                <button onClick={() => setShowCropper(false)} className="text-gray-400 hover:text-gray-900"><HiOutlineX size={24} /></button>
              </div>
              
              <div className="relative h-96 bg-gray-900">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span>Zoom Level</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(e.target.value)}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCropper(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 font-black rounded-2xl hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={createCroppedImage}
                    className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                  >
                    <HiOutlineCheck size={20} />
                    Apply Crop
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function to crop the image
async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (error) => reject(error));
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg', 0.8);
}

export default ImageUploadWithCrop;
