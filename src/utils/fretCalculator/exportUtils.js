// exportUtils.js - Functions for exporting SVG and DXF files

import {
  FRET_RATIO,
  formatMeasurement,
  calculateWidthAtDistance,
  getStringPositions
} from './calculationUtils';

/**
 * Generate and download an SVG file of the fretboard
 * @param {Object} params - SVG generation parameters
 */
export const generateSVG = ({
  scaleLengthMm,
  neckWidthMm,
  bridgeWidthMm,
  fretWidth12Mm,
  useCustomWidth12,
  fretThicknessMm,
  numFrets,
  stringsNumber,
  stringSpacing,
  presetName,
  units,
  language
}) => {
  // Calculate positions for export SVG
  const positions = [];
  let currentLength = scaleLengthMm;
  
  // Utility function for calculating width at a given distance in mm
  const calculateWidthAtDistanceMm = (distance) => {
    if (useCustomWidth12 && fretWidth12Mm > 0) {
      const pos12 = scaleLengthMm / 2;
      if (distance <= pos12) {
        const ratio = distance / pos12;
        return neckWidthMm + (fretWidth12Mm - neckWidthMm) * ratio;
      } else {
        const ratio = (distance - pos12) / (scaleLengthMm - pos12);
        return fretWidth12Mm + (bridgeWidthMm - fretWidth12Mm) * ratio;
      }
    } else {
      const ratio = distance / scaleLengthMm;
      return neckWidthMm + (bridgeWidthMm - neckWidthMm) * ratio;
    }
  };
  
  // Position 0 is the nut
  positions.push({
    position: 0,
    distance: 0,
    width: neckWidthMm
  });
  
  // Calculate each fret
  for (let i = 1; i <= numFrets; i++) {
    const fretDistance = currentLength / FRET_RATIO;
    const distanceFromNut = scaleLengthMm - fretDistance;
    
    // Calculate width using the utility function
    const width = calculateWidthAtDistanceMm(distanceFromNut);
    
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
    distance: scaleLengthMm,
    width: bridgeWidthMm
  });
  
  // Configure the SVG document for real scale (1mm = 1mm in SVG)
  const padding = 20;
  
  // Create SVG from a text string for more control
  let svgString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${scaleLengthMm + padding * 2}mm" height="${Math.max(bridgeWidthMm, neckWidthMm) + padding * 2}mm" viewBox="0 0 ${scaleLengthMm + padding * 2} ${Math.max(bridgeWidthMm, neckWidthMm) + padding * 2}">
  <desc>KreenTech Fret Calculator - ${presetName} - Scale Length: ${formatMeasurement(scaleLengthMm, units)}, ${numFrets} frets</desc>
  <g transform="translate(${padding}, ${padding + Math.max(bridgeWidthMm, neckWidthMm) / 2})">
    <!-- Neck outline -->
    <path d="M 0 ${-neckWidthMm / 2} `;
  
  // Add left edge path
  positions.forEach(fret => {
    svgString += `L ${fret.distance} ${-fret.width / 2} `;
  });
  
  // Add bottom edge and right edge path
  svgString += `L ${scaleLengthMm} ${bridgeWidthMm / 2} `;
  
  // Right edge (going back up)
  for (let i = positions.length - 2; i >= 0; i--) {
    const fret = positions[i];
    svgString += `L ${fret.distance} ${fret.width / 2} `;
  }
  
  svgString += `Z" fill="none" stroke="black" stroke-width="0.5" />
  
  <!-- Nut -->
  <line x1="0" y1="${-neckWidthMm / 2}" x2="0" y2="${neckWidthMm / 2}" stroke="black" stroke-width="3" stroke-linecap="round" />
  
  <!-- Bridge -->
  <line x1="${scaleLengthMm}" y1="${-bridgeWidthMm / 2}" x2="${scaleLengthMm}" y2="${bridgeWidthMm / 2}" stroke="black" stroke-width="3" stroke-linecap="round" />`;
  
  // Add lines for each fret
  positions.slice(1, -1).forEach(fret => {
    svgString += `
  <!-- Fret ${fret.position} -->
  <line x1="${fret.distance}" y1="${-fret.width / 2}" x2="${fret.distance}" y2="${fret.width / 2}" stroke="black" stroke-width="${fretThicknessMm}" stroke-linecap="round" />
  <text x="${fret.distance - 4}" y="${-fret.width / 2 - 5}" font-family="Arial" font-size="8" text-anchor="middle">${fret.position}</text>`;
  });
  
  // Mark the 12th fret specially if custom width is used
  if (useCustomWidth12 && fretWidth12Mm > 0) {
    const fret12 = positions.find(f => f.position === 12);
    if (fret12) {
      svgString += `
  <!-- 12th Fret Special Mark -->
  <circle cx="${fret12.distance}" cy="0" r="3" fill="red" />`;
    }
  }
  
  // Add string lines if requested
  if (stringsNumber > 0) {
    // Calculate string positions
    const stringPositions = getStringPositions(stringsNumber, stringSpacing);
    
    stringPositions.forEach((pos, i) => {
      svgString += `
  <!-- String ${i+1} -->
  <line x1="0" y1="${pos}" x2="${scaleLengthMm}" y2="${pos}" stroke="#888888" stroke-width="0.5" stroke-dasharray="5,5" />`;
    });
  }
  
  // Add scale information
  svgString += `
  <text x="${scaleLengthMm / 2}" y="${bridgeWidthMm / 2 + 15}" font-family="Arial" font-size="10" text-anchor="middle">KreenTech Fret Calculator - ${presetName} - Scale: ${formatMeasurement(scaleLengthMm, units)} - ${numFrets} ${language === 'en' ? 'frets' : 'trastes'}</text>
</g>
</svg>`;
  
  // Create a Blob with the SVG
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  // Create a link to download
  const link = document.createElement('a');
  link.href = url;
  
  // Generate a filename based on the preset and scale length
  const scaleLengthForFile = formatMeasurement(scaleLengthMm, units).replace('"', 'in');
  link.download = `kreentech-fretslotCalculator-${scaleLengthForFile}.svg`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Release the URL object
  URL.revokeObjectURL(url);
};

/**
 * Generate and download a DXF file of the fretboard
 * @param {Object} params - DXF generation parameters
 */
export const generateDXF = ({
  scaleLengthMm,
  neckWidthMm,
  bridgeWidthMm,
  fretWidth12Mm,
  useCustomWidth12,
  fretThicknessMm,
  numFrets,
  stringsNumber,
  stringSpacing,
  units
}) => {
  // Calculate positions for DXF
  const positions = [];
  let currentLength = scaleLengthMm;
  
  // Utility function for calculating width at a given distance in mm
  const calculateWidthAtDistanceMm = (distance) => {
    if (useCustomWidth12 && fretWidth12Mm > 0) {
      const pos12 = scaleLengthMm / 2;
      if (distance <= pos12) {
        const ratio = distance / pos12;
        return neckWidthMm + (fretWidth12Mm - neckWidthMm) * ratio;
      } else {
        const ratio = (distance - pos12) / (scaleLengthMm - pos12);
        return fretWidth12Mm + (bridgeWidthMm - fretWidth12Mm) * ratio;
      }
    } else {
      const ratio = distance / scaleLengthMm;
      return neckWidthMm + (bridgeWidthMm - neckWidthMm) * ratio;
    }
  };
  
  // Position 0 is the nut
  positions.push({
    position: 0,
    distance: 0,
    width: neckWidthMm
  });
  
  // Calculate each fret
  for (let i = 1; i <= numFrets; i++) {
    const fretDistance = currentLength / FRET_RATIO;
    const distanceFromNut = scaleLengthMm - fretDistance;
    
    // Calculate width using the utility function
    const width = calculateWidthAtDistanceMm(distanceFromNut);
    
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
    distance: scaleLengthMm,
    width: bridgeWidthMm
  });
  
  // DXF header
  let dxf = "0\nSECTION\n2\nHEADER\n";
  dxf += "9\n$ACADVER\n1\nAC1021\n";
  dxf += "9\n$INSUNITS\n70\n4\n"; // 4 = millimeters
  dxf += "0\nENDSEC\n";
  
  // ENTITIES section
  dxf += "0\nSECTION\n2\nENTITIES\n";
  
  // Nut - horizontal line 
  dxf += "0\nLINE\n";
  dxf += "8\n0\n";
  dxf += `10\n0\n20\n${-neckWidthMm / 2}\n30\n0\n`;
  dxf += `11\n0\n21\n${neckWidthMm / 2}\n31\n0\n`;
  
  // Bridge - horizontal line
  dxf += "0\nLINE\n";
  dxf += "8\n0\n";
  dxf += `10\n${scaleLengthMm}\n20\n${-bridgeWidthMm / 2}\n30\n0\n`;
  dxf += `11\n${scaleLengthMm}\n21\n${bridgeWidthMm / 2}\n31\n0\n`;
  
  // Lines for each fret - vertical lines
  positions.slice(1, -1).forEach((fret) => {
    dxf += "0\nLINE\n";
    dxf += "8\n0\n";
    dxf += `10\n${fret.distance}\n20\n${-fret.width / 2}\n30\n0\n`;
    dxf += `11\n${fret.distance}\n21\n${fret.width / 2}\n31\n0\n`;
  });
  
  // Left edge contour
  for (let i = 0; i < positions.length - 1; i++) {
    const fret1 = positions[i];
    const fret2 = positions[i + 1];
    
    dxf += "0\nLINE\n";
    dxf += "8\n0\n";
    dxf += `10\n${fret1.distance}\n20\n${-fret1.width / 2}\n30\n0\n`;
    dxf += `11\n${fret2.distance}\n21\n${-fret2.width / 2}\n31\n0\n`;
  }
  
  // Right edge contour
  for (let i = 0; i < positions.length - 1; i++) {
    const fret1 = positions[i];
    const fret2 = positions[i + 1];
    
    dxf += "0\nLINE\n";
    dxf += "8\n0\n";
    dxf += `10\n${fret1.distance}\n20\n${fret1.width / 2}\n30\n0\n`;
    dxf += `11\n${fret2.distance}\n21\n${fret2.width / 2}\n31\n0\n`;
  }
  
  // String lines if requested
  if (stringsNumber > 0) {
    // Calculate string positions
    const stringPositions = getStringPositions(stringsNumber, stringSpacing);
    
    stringPositions.forEach((pos, i) => {
      dxf += "0\nLINE\n";
      dxf += "8\n1\n"; // Different layer for strings
      dxf += `10\n0\n20\n${pos}\n30\n0\n`;
      dxf += `11\n${scaleLengthMm}\n21\n${pos}\n31\n0\n`;
    });
  }
  
  // Close the DXF
  dxf += "0\nENDSEC\n0\nEOF";
  
  // Create a Blob with the DXF
  const blob = new Blob([dxf], { type: 'application/dxf' });
  const url = URL.createObjectURL(blob);
  
  // Create a link to download
  const link = document.createElement('a');
  link.href = url;
  
  // Generate a filename based on the preset and scale length
  const scaleLengthForFile = formatMeasurement(scaleLengthMm, units).replace('"', 'in');
  link.download = `kreentech-fretslotCalculator-${scaleLengthForFile}.dxf`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Release the URL object
  URL.revokeObjectURL(url);
};