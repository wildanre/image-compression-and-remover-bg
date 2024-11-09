import React, { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';

const ImageCompressor: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [compressedImageUrl, setCompressedImageUrl] = useState<string | null>(null);
  const [compressionRatio, setCompressionRatio] = useState(0.8);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [format, setFormat] = useState('image/jpeg');
  const [aspect, setAspect] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedImage = e.target.files[0];
      setImage(uploadedImage);
      setImageSrc(URL.createObjectURL(uploadedImage));
    }
  };

  const handleCompressionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompressionRatio(Number(e.target.value));
  };

  const onCropComplete = useCallback((_croppedAreaPercentage: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const compressImage = () => {
    if (!image || !canvasRef.current || !croppedArea) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;

      img.onload = () => {
        canvas.width = croppedArea.width;
        canvas.height = croppedArea.height;

        if (ctx) {
          ctx.drawImage(
            img,
            croppedArea.x,
            croppedArea.y,
            croppedArea.width,
            croppedArea.height,
            0,
            0,
            croppedArea.width,
            croppedArea.height
          );
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedUrl = URL.createObjectURL(blob);
              setCompressedImageUrl(compressedUrl);
            }
          }, format, compressionRatio);
        }
      };
    };

    reader.readAsDataURL(image);
  };

  const handleSaveImage = () => {
    if (compressedImageUrl) {
      const link = document.createElement('a');
      link.href = compressedImageUrl;
      link.download = `compressed-image.${format === 'image/jpeg' ? 'jpg' : 'png'}`;
      link.click();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Image Compressor</h2>
      <input
        type="file"
        onChange={handleImageUpload}
        className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {imageSrc && (
        <>
          <div className="relative w-full h-64 mb-4">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Compression Ratio</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={compressionRatio}
              onChange={handleCompressionChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Crop Aspect Ratio</label>
            <select
              value={aspect}
              onChange={(e) => setAspect(Number(e.target.value))}
              className="w-full mt-1 p-2 text-black border border-gray-300 rounded"
            >
              <option value={1}>1:1</option>
              <option value={4 / 3}>4:3</option>
              <option value={16 / 9}>16:9</option>
              <option value={3 / 2}>3:2</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Output Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full mt-1 p-2 text-black border border-gray-300 rounded"
            >
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
            </select>
          </div>

          <button
            onClick={compressImage}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Compress Image
          </button>

          {compressedImageUrl && (
            <div className="mt-4">
              <img src={compressedImageUrl} alt="Compressed" className="w-full h-auto mb-4 rounded-lg shadow" />
              <button
                onClick={handleSaveImage}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save Image
              </button>
            </div>
          )}
        </>
      )}

      {/* Canvas digunakan untuk pemrosesan kompresi gambar */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

export default ImageCompressor;
