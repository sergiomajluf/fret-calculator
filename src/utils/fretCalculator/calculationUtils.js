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
  if (units === 'inches') {
    return mmToInches(value).toFixed(4) + '"';
  }
  return value.toFixed(2) + 'mm';
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
  
  // Add margins for outer strings (about 4.3mm on each side for 6-string guitars)
  // Scale the margin proportionally for other string counts
  const marginFactor = 4.3 * (stringsNumber / 6);
  return totalStringSpan + (marginFactor * 2);
};

/**
 * Get string positions for visualization
 * @param {number} stringsNumber - Number of strings
 * @param {number} stringSpacing - Spacing between strings
 * @returns {Array} Array of Y positions for each string
 */
export const getStringPositions = (stringsNumber, stringSpacing) => {
  const totalStringSpan = stringSpacing * (stringsNumber - 1);
  const startY = -totalStringSpan / 2;
  return Array.from(
    { length: stringsNumber }, 
    (_, i) => startY + (i * stringSpacing)
  );
};