// calculationUtils.js - Utility functions for fret calculations

// Constant for fret position formula (12th root of 2)
export const FRET_RATIO = Math.pow(2, 1/12);

/**
 * Convert millimeters to inches
 * @param {number} mm - Value in millimeters
 * @returns {number} Value in inches
 */
export const mmToInches = (mm) => mm / 25.4;

/**
 * Convert inches to millimeters
 * @param {number} inches - Value in inches
 * @returns {number} Value in millimeters
 */
export const inchesToMm = (inches) => inches * 25.4;

/**
 * Format measurement according to the selected units
 * @param {number} value - The value to format (always in mm)
 * @param {string} units - The unit system ('mm' or 'inches')
 * @returns {string} Formatted measurement with units
 */
export const formatMeasurement = (value, units) => {
  // Check if value is undefined or null
  if (value === undefined || value === null) {
    return units === 'inches' ? '0.0000"' : '0.00mm';
  }
  
  // Ensure value is a number
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return units === 'inches' ? '0.0000"' : '0.00mm';
  }
  
  if (units === 'inches') {
    return mmToInches(numValue).toFixed(4) + '"';
  }
  return numValue.toFixed(2) + 'mm';
};

/**
 * Calculate the edge padding for strings
 * @param {number} stringsNumber - Number of strings
 * @returns {number} Edge padding in mm
 */
export const calculateStringEdgePadding = (stringsNumber) => {
  // Scale the margin proportionally based on number of strings
  // About 4.3mm on each side for 6-string guitars
  return 4.3 * (stringsNumber / 6);
};

/**
 * Calculate width at a given distance using either linear or two-segment interpolation
 * @param {number} distance - Distance from nut
 * @param {number} scaleLength - Scale length
 * @param {number} neckWidth - Width at nut
 * @param {number} bridgeWidth - Width at bridge
 * @param {number} fretWidth12 - Width at 12th fret (optional)
 * @param {boolean} useCustomWidth12 - Whether to use custom 12th fret width
 * @returns {number} Width at the specified distance
 */
export const calculateWidthAtDistance = (
  distance, 
  scaleLength, 
  neckWidth, 
  bridgeWidth, 
  fretWidth12, 
  useCustomWidth12
) => {
  // If using custom 12th fret width and it's specified
  if (useCustomWidth12 && fretWidth12 > 0) {
    // Calculate position of 12th fret (half of scale length)
    const pos12 = scaleLength / 2;
    
    // If distance is before 12th fret, interpolate between nut and 12th
    if (distance <= pos12) {
      const ratio = distance / pos12;
      return neckWidth + (fretWidth12 - neckWidth) * ratio;
    } 
    // If distance is after 12th fret, interpolate between 12th and bridge
    else {
      const ratio = (distance - pos12) / (scaleLength - pos12);
      return fretWidth12 + (bridgeWidth - fretWidth12) * ratio;
    }
  } 
  // Otherwise use the standard linear interpolation
  else {
    const ratio = distance / scaleLength;
    return neckWidth + (bridgeWidth - neckWidth) * ratio;
  }
};

/**
 * Calculate the positions of all frets
 * @param {Object} params - Calculation parameters
 * @returns {Array} Array of fret position objects
 */
export const calculateFretPositions = ({
  scaleLength,
  numFrets,
  neckWidth,
  bridgeWidth,
  fretWidth12,
  useCustomWidth12
}) => {
  const positions = [];
  let currentLength = scaleLength;
  
  // Position 0 is the nut
  positions.push({
    position: 0,
    distance: 0,
    width: neckWidth
  });
  
  // Calculate each fret
  for (let i = 1; i <= numFrets; i++) {
    const fretDistance = currentLength / FRET_RATIO;
    const distanceFromNut = scaleLength - fretDistance;
    
    // Calculate width using the utility function
    const width = calculateWidthAtDistance(
      distanceFromNut,
      scaleLength,
      neckWidth,
      bridgeWidth,
      fretWidth12,
      useCustomWidth12
    );
    
    positions.push({
      position: i,
      distance: distanceFromNut,
      width: width
    });
    
    currentLength = fretDistance;
  }
  
  // Add the bridge as the last point
  positions.push({
    position: numFrets + 1,
    distance: scaleLength,
    width: bridgeWidth
  });
  
  return positions;
};

/**
 * Calculate bridge width based on string spacing
 * @param {number} stringSpacing - Spacing between strings
 * @param {number} stringsNumber - Number of strings
 * @returns {number} Calculated bridge width
 */
export const calculateBridgeWidth = (stringSpacing, stringsNumber) => {
  // Number of spaces between strings is stringsNumber - 1
  const totalStringSpan = stringSpacing * (stringsNumber - 1);
  
  // Get edge padding using the shared helper function
  const edgePadding = calculateStringEdgePadding(stringsNumber);
  
  // Add the padding to both sides
  return totalStringSpan + (edgePadding * 2);
};

/**
 * Get string positions for visualization
 * @param {number} stringsNumber - Number of strings
 * @param {number} stringSpacing - Spacing between strings at bridge
 * @param {number} neckWidth - Width at nut
 * @param {number} bridgeWidth - Width at bridge
 * @returns {Object} Object with string positions and adjusted spacing at nut
 */
export const getStringPositions = (stringsNumber, stringSpacing, neckWidth, bridgeWidth) => {
  // Calculate edge padding at bridge (consistent with bridge width calculation)
  const edgePadding = calculateStringEdgePadding(stringsNumber);
  
  // Total span of strings at bridge
  const bridgeStringSpan = stringSpacing * (stringsNumber - 1);
  
  // Available width at nut (after padding)
  const availableNutWidth = neckWidth - (edgePadding * 2);
  
  // Calculate the string spacing at the nut to maintain parallel outer strings
  const nutStringSpacing = availableNutWidth / (stringsNumber - 1);
  
  // Total span of strings at nut
  const nutStringSpan = nutStringSpacing * (stringsNumber - 1);
  
  // Calculate positions at bridge
  const startYBridge = -bridgeStringSpan / 2;
  const bridgePositions = Array.from(
    { length: stringsNumber }, 
    (_, i) => startYBridge + (i * stringSpacing)
  );
  
  // Calculate positions at nut
  const startYNut = -nutStringSpan / 2;
  const nutPositions = Array.from(
    { length: stringsNumber }, 
    (_, i) => startYNut + (i * nutStringSpacing)
  );
  
  return {
    bridgePositions,
    nutPositions,
    nutStringSpacing
  };
};