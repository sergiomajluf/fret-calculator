// ControlPanel.js - Component with all input parameters

import React from 'react';
import translations from '../../utils/fretCalculator/translations';
import { mmToInches, inchesToMm, formatMeasurement } from '../../utils/fretCalculator/calculationUtils';

/**
 * Control panel component with all input parameters
 * @param {Object} props - Component props 
 * @returns {JSX.Element} Control panel component
 */
const ControlPanel = ({
  language,
  selectedPreset,
  instrumentPresets,
  units,
  scaleLength,
  numFrets,
  neckWidth,
  bridgeWidth,
  fretWidth12,
  useCustomWidth12,
  stringsNumber,
  stringSpacing,
  fretThickness,
  calculatedBridgeWidth,
  handlePresetChange,
  handleUnitChange,
  handleParameterChange,
  setScaleLength,
  setNumFrets,
  setNeckWidth,
  setBridgeWidth,
  setFretWidth12,
  setUseCustomWidth12,
  setStringsNumber,
  setStringSpacing,
  setFretThickness,
  useBridgeWidthFromSpacing
}) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{translations[language].parameters}</h2>
      
      {/* Preset selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{translations[language].instrument}</label>
        <select 
          className="w-full p-2 border rounded bg-white"
          value={selectedPreset}
          onChange={(e) => handlePresetChange(parseInt(e.target.value))}
        >
          {instrumentPresets.map((preset, index) => (
            <option key={index} value={index}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Units selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{translations[language].units}</label>
        <div className="flex space-x-4">
          <button 
            className={`px-4 py-2 rounded ${units === 'mm' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleUnitChange('mm')}
          >
            {language === 'en' ? 'Millimeters (mm)' : 'Milímetros (mm)'}
          </button>
          <button 
            className={`px-4 py-2 rounded ${units === 'inches' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleUnitChange('inches')}
          >
            {language === 'en' ? 'Inches (in)' : 'Pulgadas (in)'}
          </button>
        </div>
      </div>
      
      {/* Scale length */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          {translations[language].scaleLength} ({units})
        </label>
        <input
          type="number"
          step={units === 'mm' ? '1' : '0.01'}
          value={scaleLength}
          onChange={(e) => {
            setScaleLength(parseFloat(e.target.value));
            handleParameterChange();
          }}
          className="w-full p-2 border rounded"
        />
      </div>
      
      {/* Number of frets */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{translations[language].numberOfFrets}</label>
        <input
          type="number"
          min="12"
          max="36"
          value={numFrets}
          onChange={(e) => {
            setNumFrets(parseInt(e.target.value));
            handleParameterChange();
          }}
          className="w-full p-2 border rounded"
        />
      </div>
      
      {/* Nut width */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          {translations[language].nutWidth} ({units})
        </label>
        <input
          type="number"
          step={units === 'mm' ? '0.5' : '0.01'}
          value={neckWidth}
          onChange={(e) => {
            setNeckWidth(parseFloat(e.target.value));
            handleParameterChange();
          }}
          className="w-full p-2 border rounded"
        />
      </div>
      
      {/* Width at 12th fret */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="useCustomWidth12"
            checked={useCustomWidth12}
            onChange={(e) => {
              setUseCustomWidth12(e.target.checked);
              handleParameterChange();
            }}
            className="mr-2"
          />
          <label htmlFor="useCustomWidth12" className="text-sm font-medium">
            {translations[language].useCustomWidth12}
          </label>
        </div>
        <input
          type="number"
          step={units === 'mm' ? '0.5' : '0.01'}
          value={fretWidth12}
          onChange={(e) => {
            setFretWidth12(parseFloat(e.target.value));
            handleParameterChange();
          }}
          disabled={!useCustomWidth12}
          className={`w-full p-2 border rounded ${!useCustomWidth12 ? 'bg-gray-100' : ''}`}
          placeholder={translations[language].fretWidth12}
        />
        <label className="block text-sm font-medium mt-1">
          {translations[language].fretWidth12} ({units})
        </label>
      </div>
      
      {/* String spacing settings */}
      <div className="mb-4 p-3 bg-gray-50 rounded border">
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            {translations[language].stringsNumber}
          </label>
          <input
            type="number"
            min="3"
            max="12"
            value={stringsNumber}
            onChange={(e) => {
              setStringsNumber(parseInt(e.target.value));
              handleParameterChange();
            }}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            {translations[language].stringSpacing} ({units})
          </label>
          <input
            type="number"
            step="0.1"
            min="2"
            value={stringSpacing}
            onChange={(e) => {
              setStringSpacing(parseFloat(e.target.value));
              handleParameterChange();
            }}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="flex items-center space-x-2 mt-2">
          <div className="flex-grow">
            <p className="text-sm text-gray-600 mb-1">
              {translations[language].calculateBridgeNote}
            </p>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">
                {translations[language].bridgeWidth}: {formatMeasurement(calculatedBridgeWidth, units)}
              </span>
              <button
                onClick={useBridgeWidthFromSpacing}
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                {translations[language].useThisValue}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bridge width */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          {translations[language].bridgeWidth} ({units})
        </label>
        <input
          type="number"
          step={units === 'mm' ? '0.5' : '0.01'}
          value={bridgeWidth}
          onChange={(e) => {
            setBridgeWidth(parseFloat(e.target.value));
            handleParameterChange();
          }}
          className="w-full p-2 border rounded"
        />
      </div>
      
      {/* Fret thickness */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          {translations[language].fretThickness} ({units})
        </label>
        <input
          type="number"
          step="0.1"
          min="0.5"
          max="3"
          value={fretThickness}
          onChange={(e) => {
            setFretThickness(parseFloat(e.target.value));
            handleParameterChange();
          }}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
};

export default ControlPanel;