// ActionPanel.js - Component with download buttons and sharing options

import React, { useState } from 'react';
import { generateSVG, generateDXF } from '../../utils/fretCalculator/exportUtils';
import translations from '../../utils/fretCalculator/translations';

/**
 * Panel with action buttons for export and sharing
 * @param {Object} props - Component props
 * @returns {JSX.Element} Action panel component
 */
const ActionPanel = ({
  scaleLength,
  neckWidth,
  bridgeWidth,
  fretWidth12,
  fretThickness,
  numFrets,
  stringsNumber,
  stringSpacing,
  useCustomWidth12,
  shareUrl,
  selectedPreset,
  instrumentPresets,
  units,
  language
}) => {
  // Function to handle SVG generation
  const handleGenerateSVG = () => {
    generateSVG({
      scaleLengthMm: scaleLength,
      neckWidthMm: neckWidth,
      bridgeWidthMm: bridgeWidth,
      fretWidth12Mm: fretWidth12,
      useCustomWidth12,
      fretThicknessMm: fretThickness,
      numFrets,
      stringsNumber,
      stringSpacing,
      presetName: instrumentPresets[selectedPreset].name,
      units,
      language
    });
  };

  // Function to handle DXF generation
  const handleGenerateDXF = () => {
    generateDXF({
      scaleLengthMm: scaleLength,
      neckWidthMm: neckWidth,
      bridgeWidthMm: bridgeWidth,
      fretWidth12Mm: fretWidth12,
      useCustomWidth12,
      fretThicknessMm: fretThickness,
      numFrets,
      stringsNumber,
      stringSpacing,
      units
    });
  };
  
  // Function to copy shareable URL to clipboard
  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        alert(translations[language].copied);
      },
      (err) => {
        alert(translations[language].copyError + err);
      }
    );
  };

  return (
    <div className="bg-white p-4 mb-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{translations[language].actions}</h2>
      
      {/* Download buttons */}
      <div className="mb-6 flex flex-col space-y-2">
        <button
          onClick={handleGenerateSVG}
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {translations[language].downloadSVG}
        </button>
        <button
          onClick={handleGenerateDXF}
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {translations[language].downloadDXF}
        </button>
      </div>
      
      {/* Share configuration */}
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">{translations[language].shareConfig}</h3>
        <p className="text-sm text-gray-600 mb-3">
          {translations[language].shareInstructions}
        </p>
        <div className="flex">
          <input 
            type="text" 
            className="flex-grow p-2 border rounded-l bg-gray-50 text-sm" 
            value={shareUrl} 
            readOnly 
          />
          <button 
            onClick={copyShareUrl}
            className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition"
          >
            {translations[language].copy}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;