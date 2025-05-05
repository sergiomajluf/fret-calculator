// exportUtils.js - Functions for exporting SVG and DXF files

import {
    FRET_RATIO,
    formatMeasurement,
    calculateWidthAtDistance,
    getStringPositions,
    inchesToMm
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
    // Ensure all measurements are in mm for consistent SVG output
    const scaleLengthValue = units === 'mm' ? scaleLengthMm : inchesToMm(scaleLengthMm);
    const neckWidthValue = units === 'mm' ? neckWidthMm : inchesToMm(neckWidthMm);
    const bridgeWidthValue = units === 'mm' ? bridgeWidthMm : inchesToMm(bridgeWidthMm);
    const fretWidth12Value = units === 'mm' ? fretWidth12Mm : inchesToMm(fretWidth12Mm);
    const fretThicknessValue = units === 'mm' ? fretThicknessMm : inchesToMm(fretThicknessMm);
    const stringSpacingValue = units === 'mm' ? stringSpacing : inchesToMm(stringSpacing);
  
    // Calculate positions for export SVG
    const positions = [];
    let currentLength = scaleLengthValue;
    
    // Utility function for calculating width at a given distance in mm
    const calculateWidthAtDistanceMm = (distance) => {
      if (useCustomWidth12 && fretWidth12Value > 0) {
        const pos12 = scaleLengthValue / 2;
        if (distance <= pos12) {
          const ratio = distance / pos12;
          return neckWidthValue + (fretWidth12Value - neckWidthValue) * ratio;
        } else {
          const ratio = (distance - pos12) / (scaleLengthValue - pos12);
          return fretWidth12Value + (bridgeWidthValue - fretWidth12Value) * ratio;
        }
      } else {
        const ratio = distance / scaleLengthValue;
        return neckWidthValue + (bridgeWidthValue - neckWidthValue) * ratio;
      }
    };
    
    // Position 0 is the nut
    positions.push({
      position: 0,
      distance: 0,
      width: neckWidthValue
    });
    
    // Calculate each fret
    for (let i = 1; i <= numFrets; i++) {
      const fretDistance = currentLength / FRET_RATIO;
      const distanceFromNut = scaleLengthValue - fretDistance;
      
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
      distance: scaleLengthValue,
      width: bridgeWidthValue
    });
    
    // Configure the SVG document for real scale (1mm = 1mm in SVG)
    const padding = 20;
    
    // Create SVG from a text string for more control
    let svgString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${scaleLengthValue + padding * 2}mm" height="${Math.max(bridgeWidthValue, neckWidthValue) + padding * 2}mm" viewBox="0 0 ${scaleLengthValue + padding * 2} ${Math.max(bridgeWidthValue, neckWidthValue) + padding * 2}">
    <desc>KreenTech Fret Calculator - ${presetName} - Scale Length: ${formatMeasurement(scaleLengthValue, units)}, ${numFrets} frets</desc>
    <g transform="translate(${padding}, ${padding + Math.max(bridgeWidthValue, neckWidthValue) / 2})">
      <!-- Neck outline -->
      <path d="M 0 ${-neckWidthValue / 2} `;
    
    // Add left edge path
    positions.forEach(fret => {
      svgString += `L ${fret.distance} ${-fret.width / 2} `;
    });
    
    // Add bottom edge and right edge path
    svgString += `L ${scaleLengthValue} ${bridgeWidthValue / 2} `;
    
    // Right edge (going back up)
    for (let i = positions.length - 2; i >= 0; i--) {
      const fret = positions[i];
      svgString += `L ${fret.distance} ${fret.width / 2} `;
    }
    
    svgString += `Z" fill="none" stroke="black" stroke-width="0.5" />
    
    <!-- Nut -->
    <line x1="0" y1="${-neckWidthValue / 2}" x2="0" y2="${neckWidthValue / 2}" stroke="black" stroke-width="3" stroke-linecap="round" />
    
    <!-- Bridge -->
    <line x1="${scaleLengthValue}" y1="${-bridgeWidthValue / 2}" x2="${scaleLengthValue}" y2="${bridgeWidthValue / 2}" stroke="black" stroke-width="3" stroke-linecap="round" />`;
    
    // Add lines for each fret
    positions.slice(1, -1).forEach(fret => {
      svgString += `
    <!-- Fret ${fret.position} -->
    <line x1="${fret.distance}" y1="${-fret.width / 2}" x2="${fret.distance}" y2="${fret.width / 2}" stroke="black" stroke-width="${fretThicknessValue}" stroke-linecap="round" />
    <text x="${fret.distance - 4}" y="${-fret.width / 2 - 5}" font-family="Arial" font-size="8" text-anchor="middle">${fret.position}</text>`;
    });
    
    // Mark the 12th fret specially if custom width is used
    if (useCustomWidth12 && fretWidth12Value > 0) {
      const fret12 = positions.find(f => f.position === 12);
      if (fret12) {
        svgString += `
    <!-- 12th Fret Special Mark -->
    <circle cx="${fret12.distance}" cy="0" r="3" fill="red" />`;
      }
    }
    
    // Add string lines if requested
    if (stringsNumber > 0) {
      try {
        // Calculate string positions with padding for parallel alignment
        const stringPositionData = getStringPositions(
          stringsNumber || 6, 
          stringSpacingValue || 10, 
          neckWidthValue || 43, 
          bridgeWidthValue || 56
        );
        
        // Only proceed if we have valid string position data
        if (stringPositionData && 
            stringPositionData.nutPositions && 
            stringPositionData.bridgePositions) {
            
          // Make sure both arrays have the same length
          const length = Math.min(
            stringPositionData.nutPositions.length, 
            stringPositionData.bridgePositions.length
          );
          
          for (let i = 0; i < length; i++) {
            const nutPos = stringPositionData.nutPositions[i];
            const bridgePos = stringPositionData.bridgePositions[i];
            
            svgString += `
    <!-- String ${i+1} -->
    <line x1="0" y1="${nutPos}" x2="${scaleLengthValue}" y2="${bridgePos}" stroke="#888888" stroke-width="0.5" stroke-dasharray="5,5" />`;
          }
        }
      } catch (error) {
        console.error("Error rendering strings in SVG:", error);
        // Fallback to a simpler rendering if there's an error
        // Evenly space strings across the width
        const topY = -bridgeWidthValue / 2 * 0.8;
        const bottomY = bridgeWidthValue / 2 * 0.8;
        const step = (bottomY - topY) / (stringsNumber - 1 || 1);
        
        for (let i = 0; i < stringsNumber; i++) {
          const y = topY + i * step;
          svgString += `
    <!-- String ${i+1} (fallback) -->
    <line x1="0" y1="${y}" x2="${scaleLengthValue}" y2="${y}" stroke="#888888" stroke-width="0.5" stroke-dasharray="5,5" />`;
        }
      }
    }
    
    // Add scale information
    svgString += `
    <text x="${scaleLengthValue / 2}" y="${bridgeWidthValue / 2 + 15}" font-family="Arial" font-size="10" text-anchor="middle">KreenTech Fret Calculator - ${presetName} - Scale: ${formatMeasurement(scaleLengthValue, units)} - ${numFrets} ${language === 'en' ? 'frets' : 'trastes'}</text>
  </g>
  </svg>`;
    
    // Create a Blob with the SVG
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    // Create a link to download
    const link = document.createElement('a');
    link.href = url;
    
    // Generate a filename based on the preset and scale length
    const scaleLengthForFile = formatMeasurement(scaleLengthValue, units).replace('"', 'in');
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
    // Ensure all measurements are in mm for consistent DXF output
    const scaleLengthValue = units === 'mm' ? scaleLengthMm : inchesToMm(scaleLengthMm);
    const neckWidthValue = units === 'mm' ? neckWidthMm : inchesToMm(neckWidthMm);
    const bridgeWidthValue = units === 'mm' ? bridgeWidthMm : inchesToMm(bridgeWidthMm);
    const fretWidth12Value = units === 'mm' ? fretWidth12Mm : inchesToMm(fretWidth12Mm);
    const fretThicknessValue = units === 'mm' ? fretThicknessMm : inchesToMm(fretThicknessMm);
    const stringSpacingValue = units === 'mm' ? stringSpacing : inchesToMm(stringSpacing);
    
    // Calculate positions for DXF
    const positions = [];
    let currentLength = scaleLengthValue;
    
    // Utility function for calculating width at a given distance in mm
    const calculateWidthAtDistanceMm = (distance) => {
      if (useCustomWidth12 && fretWidth12Value > 0) {
        const pos12 = scaleLengthValue / 2;
        if (distance <= pos12) {
          const ratio = distance / pos12;
          return neckWidthValue + (fretWidth12Value - neckWidthValue) * ratio;
        } else {
          const ratio = (distance - pos12) / (scaleLengthValue - pos12);
          return fretWidth12Value + (bridgeWidthValue - fretWidth12Value) * ratio;
        }
      } else {
        const ratio = distance / scaleLengthValue;
        return neckWidthValue + (bridgeWidthValue - neckWidthValue) * ratio;
      }
    };
    
    // Position 0 is the nut
    positions.push({
      position: 0,
      distance: 0,
      width: neckWidthValue
    });
    
    // Calculate each fret
    for (let i = 1; i <= numFrets; i++) {
      const fretDistance = currentLength / FRET_RATIO;
      const distanceFromNut = scaleLengthValue - fretDistance;
      
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
      distance: scaleLengthValue,
      width: bridgeWidthValue
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
    dxf += `10\n0\n20\n${-neckWidthValue / 2}\n30\n0\n`;
    dxf += `11\n0\n21\n${neckWidthValue / 2}\n31\n0\n`;
    
    // Bridge - horizontal line
    dxf += "0\nLINE\n";
    dxf += "8\n0\n";
    dxf += `10\n${scaleLengthValue}\n20\n${-bridgeWidthValue / 2}\n30\n0\n`;
    dxf += `11\n${scaleLengthValue}\n21\n${bridgeWidthValue / 2}\n31\n0\n`;
    
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
      try {
        // Calculate string positions with padding for parallel alignment
        const stringPositionData = getStringPositions(
          stringsNumber || 6, 
          stringSpacingValue || 10, 
          neckWidthValue || 43, 
          bridgeWidthValue || 56
        );
        
        // Only proceed if we have valid string position data
        if (stringPositionData && 
            stringPositionData.nutPositions && 
            stringPositionData.bridgePositions) {
            
          // Make sure both arrays have the same length
          const length = Math.min(
            stringPositionData.nutPositions.length, 
            stringPositionData.bridgePositions.length
          );
          
          for (let i = 0; i < length; i++) {
            const nutPos = stringPositionData.nutPositions[i];
            const bridgePos = stringPositionData.bridgePositions[i];
            
            dxf += "0\nLINE\n";
            dxf += "8\n1\n"; // Different layer for strings
            dxf += `10\n0\n20\n${nutPos}\n30\n0\n`;
            dxf += `11\n${scaleLengthValue}\n21\n${bridgePos}\n31\n0\n`;
          }
        }
      } catch (error) {
        console.error("Error rendering strings in DXF:", error);
        // Fallback to a simpler rendering if there's an error
        // Evenly space strings across the width
        const topY = -bridgeWidthValue / 2 * 0.8;
        const bottomY = bridgeWidthValue / 2 * 0.8;
        const step = (bottomY - topY) / (stringsNumber - 1 || 1);
        
        for (let i = 0; i < stringsNumber; i++) {
          const y = topY + i * step;
          
          dxf += "0\nLINE\n";
          dxf += "8\n1\n"; // Different layer for strings
          dxf += `10\n0\n20\n${y}\n30\n0\n`;
          dxf += `11\n${scaleLengthValue}\n21\n${y}\n31\n0\n`;
        }
      }
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
    const scaleLengthForFile = formatMeasurement(scaleLengthValue, units).replace('"', 'in');
    link.download = `kreentech-fretslotCalculator-${scaleLengthForFile}.dxf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Release the URL object
    URL.revokeObjectURL(url);
  };