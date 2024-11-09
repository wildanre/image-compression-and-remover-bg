import React, { useState } from 'react';
import ImageCompressor from './components/ImageCompressor';
import BackgroundRemoval from './components/BackgroundRemoval';
import Navbar from './components/Navbar';  // Correct import statement

const App: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState<string>('compressor');

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <Navbar setCurrentFeature={setCurrentFeature} />  {/* Using Navbar component */}
      <div className="container mx-auto p-4">
        {currentFeature === 'compressor' && <ImageCompressor />}
        {currentFeature === 'background-removal' && <BackgroundRemoval />}
        {/* {currentFeature === 'object-compression' && <ObjectBasedCompression />}
        {currentFeature === 'denoising' && <NoiseReduction />}
        {currentFeature === 'quality-assessment' && <QualityAssessment />} */}
      </div>
    </div>
  );
};

export default App;
