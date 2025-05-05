// FretCalculator.js - Main component that combines everything

import React, { useState, useEffect } from 'react';
import Preview from './Preview';
import ControlPanel from './ControlPanel';
import ActionPanel from './ActionPanel';
import MeasurementsTable from './MeasurementsTable';
import Footer from './Footer';
import translations from '../../utils/fretCalculator/translations';
import createInstrumentPresets from '../../utils/fretCalculator/presetData';
import { 
  mmToInches, 
  inchesToMm, 
  calculateFretPositions,
  calculateBridgeWidth,
  calculateStringEdgePadding
} from '../../utils/fretCalculator/calculationUtils';

/**
 * Main FretCalculator component
 * @returns {JSX.Element} FretCalculator component
 */
const FretCalculator = () => {
  // States for application parameters
  const [language, setLanguage] = useState('en');
  const [instrumentPresets, setInstrumentPresets] = useState(createInstrumentPresets('en'));
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [scaleLength, setScaleLength] = useState(instrumentPresets[0].scaleLength.mm);
  const [numFrets, setNumFrets] = useState(instrumentPresets[0].numFrets);
  const [neckWidth, setNeckWidth] = useState(instrumentPresets[0].neckWidth.mm);
  const [bridgeWidth, setBridgeWidth] = useState(instrumentPresets[0].bridgeWidth.mm);
  const [fretWidth12, setFretWidth12] = useState(instrumentPresets[0].fretWidth12.mm);
  const [useCustomWidth12, setUseCustomWidth12] = useState(false);
  const [stringsNumber, setStringsNumber] = useState(instrumentPresets[0].stringsNumber);
  const [stringSpacing, setStringSpacing] = useState(instrumentPresets[0].stringSpacing.mm);
  const [units, setUnits] = useState('mm');
  const [fretThickness, setFretThickness] = useState(instrumentPresets[0].fretThickness.mm);
  const [fretPositions, setFretPositions] = useState([]);
  const [shareUrl, setShareUrl] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [calculatedBridgeWidth, setCalculatedBridgeWidth] = useState(0);
  
  // Calculate parameters based on string spacing
  const [nutStringSpacing, setNutStringSpacing] = useState(
    // Initialize with a reasonable default value
    instrumentPresets[0].stringSpacing.mm * 0.9
  );
  
  // Update instrument presets when language changes
  useEffect(() => {
    setInstrumentPresets(createInstrumentPresets(language));
  }, [language]);
  
  // Function to load parameters from URL on initial load
  useEffect(() => {
    const loadParamsFromUrl = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        
        // If there are parameters in the URL, load them
        if (params.toString()) {
          const lang = params.get('lang');
          const preset = params.get('preset');
          const unitParam = params.get('units');
          const scale = params.get('scale');
          const frets = params.get('frets');
          const neck = params.get('neck');
          const bridge = params.get('bridge');
          const fret12 = params.get('fret12');
          const useCustom12 = params.get('useCustom12');
          const strings = params.get('strings');
          const spacing = params.get('spacing');
          const thickness = params.get('thickness');
          
          // Set language if specified
          if (lang === 'es' || lang === 'en') {
            setLanguage(lang);
          }
          
          // Set units first
          if (unitParam === 'in' || unitParam === 'inches') {
            setUnits('inches');
          } else {
            setUnits('mm');
          }
          
          // If there's a specific preset, load it
          if (preset && !isNaN(parseInt(preset)) && parseInt(preset) >= 0 && parseInt(preset) < instrumentPresets.length) {
            setSelectedPreset(parseInt(preset));
          } else {
            // If no preset or invalid, use custom
            setSelectedPreset(0);
            setIsCustom(true);
          }
          
          // Load individual parameters if they exist
          if (scale && !isNaN(parseFloat(scale))) {
            setScaleLength(parseFloat(scale));
          } else if (preset && !isNaN(parseInt(preset))) {
            setScaleLength(units === 'mm' ? 
              instrumentPresets[parseInt(preset)].scaleLength.mm : 
              instrumentPresets[parseInt(preset)].scaleLength.in);
          }
          
          if (frets && !isNaN(parseInt(frets))) {
            setNumFrets(parseInt(frets));
          } else if (preset && !isNaN(parseInt(preset))) {
            setNumFrets(instrumentPresets[parseInt(preset)].numFrets);
          }
          
          if (neck && !isNaN(parseFloat(neck))) {
            setNeckWidth(parseFloat(neck));
          } else if (preset && !isNaN(parseInt(preset))) {
            setNeckWidth(units === 'mm' ? 
              instrumentPresets[parseInt(preset)].neckWidth.mm : 
              instrumentPresets[parseInt(preset)].neckWidth.in);
          }
          
          if (bridge && !isNaN(parseFloat(bridge))) {
            setBridgeWidth(parseFloat(bridge));
          } else if (preset && !isNaN(parseInt(preset))) {
            setBridgeWidth(units === 'mm' ? 
              instrumentPresets[parseInt(preset)].bridgeWidth.mm : 
              instrumentPresets[parseInt(preset)].bridgeWidth.in);
          }
          
          if (fret12 && !isNaN(parseFloat(fret12))) {
            setFretWidth12(parseFloat(fret12));
            setUseCustomWidth12(true);
          } else if (preset && !isNaN(parseInt(preset))) {
            setFretWidth12(units === 'mm' ? 
              instrumentPresets[parseInt(preset)].fretWidth12.mm : 
              instrumentPresets[parseInt(preset)].fretWidth12.in);
          }
          
          if (useCustom12 === 'true') {
            setUseCustomWidth12(true);
          } else if (useCustom12 === 'false') {
            setUseCustomWidth12(false);
          }
          
          if (strings && !isNaN(parseInt(strings))) {
            setStringsNumber(parseInt(strings));
          } else if (preset && !isNaN(parseInt(preset))) {
            setStringsNumber(instrumentPresets[parseInt(preset)].stringsNumber);
          }
          
          if (spacing && !isNaN(parseFloat(spacing))) {
            setStringSpacing(parseFloat(spacing));
          } else if (preset && !isNaN(parseInt(preset))) {
            setStringSpacing(units === 'mm' ? 
              instrumentPresets[parseInt(preset)].stringSpacing.mm : 
              instrumentPresets[parseInt(preset)].stringSpacing.in);
          }
          
          if (thickness && !isNaN(parseFloat(thickness))) {
            setFretThickness(parseFloat(thickness));
          } else if (preset && !isNaN(parseInt(preset))) {
            setFretThickness(units === 'mm' ? 
              instrumentPresets[parseInt(preset)].fretThickness.mm : 
              instrumentPresets[parseInt(preset)].fretThickness.in);
          }
        }
      }
    };
    
    loadParamsFromUrl();
  }, []);
  
  // Calculate parameters based on string spacing
  useEffect(() => {
    // Convert to mm for calculations if needed
    const stringSpacingMm = units === 'mm' ? stringSpacing : inchesToMm(stringSpacing);
    const neckWidthMm = units === 'mm' ? neckWidth : inchesToMm(neckWidth);
    
    // Calculate bridge width
    const calculatedWidthMm = calculateBridgeWidth(stringSpacingMm, stringsNumber);
    
    // Convert back to inches if needed
    const calculatedWidth = units === 'mm' ? calculatedWidthMm : mmToInches(calculatedWidthMm);
    setCalculatedBridgeWidth(calculatedWidth);
    
    // Calculate nut string spacing for parallel strings
    const edgePadding = calculateStringEdgePadding(stringsNumber);
    const availableNutWidth = neckWidthMm - (edgePadding * 2);
    const nutSpacingMm = availableNutWidth / (stringsNumber - 1);
    
    // Convert to current units
    const nutSpacing = units === 'mm' ? nutSpacingMm : mmToInches(nutSpacingMm);
    setNutStringSpacing(nutSpacing);
  }, [stringSpacing, stringsNumber, neckWidth, units]);
  
  // Function to update URL with current parameters
  const updateUrlParams = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      
      // Add parameters to URL
      params.set('lang', language);
      params.set('preset', selectedPreset.toString());
      params.set('units', units);
      params.set('scale', scaleLength.toString());
      params.set('frets', numFrets.toString());
      params.set('neck', neckWidth.toString());
      params.set('bridge', bridgeWidth.toString());
      params.set('fret12', fretWidth12.toString());
      params.set('useCustom12', useCustomWidth12.toString());
      params.set('strings', stringsNumber.toString());
      params.set('spacing', stringSpacing.toString());
      params.set('thickness', fretThickness.toString());
      
      // Update browser URL without reloading the page
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
      
      // Save the complete URL for sharing
      setShareUrl(`${window.location.origin}${newUrl}`);
    }
  };
  
  // Update URL when parameters change
  useEffect(() => {
    updateUrlParams();
  }, [language, selectedPreset, units, scaleLength, numFrets, neckWidth, bridgeWidth, 
      fretWidth12, useCustomWidth12, stringsNumber, stringSpacing, fretThickness]);
  
  // Function to handle preset selection
  const handlePresetChange = (presetIndex) => {
    const preset = instrumentPresets[presetIndex];
    setSelectedPreset(presetIndex);
    
    // Update all parameters based on selected preset
    setScaleLength(units === 'mm' ? preset.scaleLength.mm : preset.scaleLength.in);
    setNumFrets(preset.numFrets);
    setNeckWidth(units === 'mm' ? preset.neckWidth.mm : preset.neckWidth.in);
    setBridgeWidth(units === 'mm' ? preset.bridgeWidth.mm : preset.bridgeWidth.in);
    setFretWidth12(units === 'mm' ? preset.fretWidth12.mm : preset.fretWidth12.in);
    setStringsNumber(preset.stringsNumber);
    setStringSpacing(units === 'mm' ? preset.stringSpacing.mm : preset.stringSpacing.in);
    setFretThickness(units === 'mm' ? preset.fretThickness.mm : preset.fretThickness.in);
    
    // Only use custom 12th fret width if it's actually defined in the preset
    const hasCustomWidth12 = (units === 'mm' ? preset.fretWidth12.mm : preset.fretWidth12.in) > 0;
    setUseCustomWidth12(hasCustomWidth12);
    
    // If it's the "Custom" preset, enable editing
    setIsCustom(presetIndex === 0);
  };
  
  // Function to detect changes and activate custom mode
  const handleParameterChange = () => {
    if (selectedPreset !== 0) {
      setSelectedPreset(0); // Change to "Custom"
      setIsCustom(true);
    }
  };
  
  // Function to handle unit changes
  const handleUnitChange = (newUnits) => {
    if (newUnits === units) return;
    
    if (newUnits === 'inches') {
      // Convert mm to inches
      setScaleLength(mmToInches(scaleLength));
      setNeckWidth(mmToInches(neckWidth));
      setBridgeWidth(mmToInches(bridgeWidth));
      setFretWidth12(mmToInches(fretWidth12));
      setStringSpacing(mmToInches(stringSpacing));
      setFretThickness(mmToInches(fretThickness));
    } else {
      // Convert inches to mm
      setScaleLength(inchesToMm(scaleLength));
      setNeckWidth(inchesToMm(neckWidth));
      setBridgeWidth(inchesToMm(bridgeWidth));
      setFretWidth12(inchesToMm(fretWidth12));
      setStringSpacing(inchesToMm(stringSpacing));
      setFretThickness(inchesToMm(fretThickness));
    }
    
    setUnits(newUnits);
  };

  // Function to handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };
  
  // Function to update bridge width from calculated value
  const useBridgeWidthFromSpacing = () => {
    setBridgeWidth(calculatedBridgeWidth);
    handleParameterChange();
  };
  
  // Recalculate when parameters change
  useEffect(() => {
    // If the units are inches, convert to mm first since our calculation functions expect mm
    let scaleLengthValue = scaleLength;
    let neckWidthValue = neckWidth;
    let bridgeWidthValue = bridgeWidth;
    let fretWidth12Value = fretWidth12;
    
    // Only convert if necessary
    if (units === 'inches') {
      scaleLengthValue = inchesToMm(scaleLength);
      neckWidthValue = inchesToMm(neckWidth);
      bridgeWidthValue = inchesToMm(bridgeWidth);
      fretWidth12Value = inchesToMm(fretWidth12);
    }
    
    const positions = calculateFretPositions({
      scaleLength: scaleLengthValue,
      numFrets,
      neckWidth: neckWidthValue, 
      bridgeWidth: bridgeWidthValue, 
      fretWidth12: fretWidth12Value, 
      useCustomWidth12
    });
    
    // If units are inches, convert the calculated positions back to inches
    if (units === 'inches') {
      const inchPositions = positions.map(fret => ({
        ...fret,
        distance: mmToInches(fret.distance),
        width: mmToInches(fret.width)
      }));
      setFretPositions(inchPositions);
    } else {
      setFretPositions(positions);
    }
  }, [scaleLength, numFrets, neckWidth, bridgeWidth, fretWidth12, useCustomWidth12, units]);
  
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="w-full max-w-[1600px] mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{translations[language].appTitle}</h1>
          <div className="flex space-x-4">
            <button 
              className={`px-4 py-2 rounded ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => handleLanguageChange('en')}
            >
              English
            </button>
            <button 
              className={`px-4 py-2 rounded ${language === 'es' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => handleLanguageChange('es')}
            >
              Español
            </button>
          </div>
        </div>
        
        {/* Horizontal preview at the top */}
        <div className="bg-white p-4 mb-6 rounded shadow overflow-hidden">
          <h2 className="text-xl font-semibold mb-2">{translations[language].preview}</h2>
          <div className="border p-2 bg-gray-100 flex justify-center" style={{ height: '250px' }}>
            <div className="w-full h-full">
              {fretPositions.length > 0 && (
                <Preview 
                  fretPositions={fretPositions}
                  scaleLength={scaleLength}
                  neckWidth={neckWidth}
                  bridgeWidth={bridgeWidth}
                  fretWidth12={fretWidth12}
                  fretThickness={fretThickness}
                  useCustomWidth12={useCustomWidth12}
                  stringsNumber={stringsNumber}
                  stringSpacing={stringSpacing}
                  selectedPreset={selectedPreset}
                  instrumentPresets={instrumentPresets}
                  units={units}
                  language={language}
                />
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {translations[language].previewNote}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Control panel */}
          <ControlPanel 
            language={language}
            selectedPreset={selectedPreset}
            instrumentPresets={instrumentPresets}
            units={units}
            scaleLength={scaleLength}
            numFrets={numFrets}
            neckWidth={neckWidth}
            bridgeWidth={bridgeWidth}
            fretWidth12={fretWidth12}
            useCustomWidth12={useCustomWidth12}
            stringsNumber={stringsNumber}
            stringSpacing={stringSpacing}
            nutStringSpacing={nutStringSpacing}
            fretThickness={fretThickness}
            calculatedBridgeWidth={calculatedBridgeWidth}
            handlePresetChange={handlePresetChange}
            handleUnitChange={handleUnitChange}
            handleParameterChange={handleParameterChange}
            setScaleLength={setScaleLength}
            setNumFrets={setNumFrets}
            setNeckWidth={setNeckWidth}
            setBridgeWidth={setBridgeWidth}
            setFretWidth12={setFretWidth12}
            setUseCustomWidth12={setUseCustomWidth12}
            setStringsNumber={setStringsNumber}
            setStringSpacing={setStringSpacing}
            setFretThickness={setFretThickness}
            useBridgeWidthFromSpacing={useBridgeWidthFromSpacing}
          />
          
          <div>
            {/* Action panel */}
            <ActionPanel 
              scaleLength={scaleLength}
              neckWidth={neckWidth}
              bridgeWidth={bridgeWidth}
              fretWidth12={fretWidth12}
              fretThickness={fretThickness}
              numFrets={numFrets}
              stringsNumber={stringsNumber}
              stringSpacing={stringSpacing}
              useCustomWidth12={useCustomWidth12}
              shareUrl={shareUrl}
              selectedPreset={selectedPreset}
              instrumentPresets={instrumentPresets}
              units={units}
              language={language}
            />
            
            {/* Measurements table */}
            <MeasurementsTable 
              fretPositions={fretPositions}
              numFrets={numFrets}
              units={units}
              language={language}
            />
          </div>
        </div>
        
        {/* Footer */}
        <Footer language={language} />
      </div>
    </div>
  );
};

export default FretCalculator;