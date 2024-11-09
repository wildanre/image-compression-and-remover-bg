import React from 'react';

interface NavbarProps {
  setCurrentFeature: (feature: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setCurrentFeature }) => {
  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-lg font-bold">Image AI Tools</h1>
        <ul className="flex space-x-4 text-white">
          <li><button onClick={() => setCurrentFeature('compressor')}>Compressor</button></li>
          <li><button onClick={() => setCurrentFeature('background-removal')}>Background Removal</button></li>
          {/* <li><button onClick={() => setCurrentFeature('enhancement')}>Enhancement</button></li>
          <li><button onClick={() => setCurrentFeature('object-compression')}>Object Compression</button></li>
          <li><button onClick={() => setCurrentFeature('denoising')}>Noise Reduction</button></li>
          <li><button onClick={() => setCurrentFeature('quality-assessment')}>Quality Assessment</button></li> */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
