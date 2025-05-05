// Preview.js - SVG preview component for the fretboard

import React from 'react';
import { calculateWidthAtDistance, getStringPositions, inchesToMm } from '../../utils/fretCalculator/calculationUtils';
import translations from '../../utils/fretCalculator/translations';

/**
 * Preview component that renders an SVG visualization of the fretboard
 * @param {Object} props - Component props
 * @returns {JSX.Element} SVG preview
 */
const Preview = ({
  fretPositions,
  scaleLength, 
  neckWidth, 
  bridgeWidth,
  fretWidth12,
  fretThickness,
  useCustomWidth12,
  stringsNumber,
  stringSpacing,
  selectedPreset,
  instrumentPresets,
  units,
  language
}) => {
  if (fretPositions.length === 0) {
    return <div>Loading...</div>;
  }

  // For preview, always normalize values to avoid visual scaling issues
  // Convert everything to mm for normalization, regardless of the units selected
  const padding = 20;
  
  // Make sure all measurements are in mm for consistency in the SVG
  const scaleLengthMm = units === 'mm' ? scaleLength : inchesToMm(scaleLength);
  const neckWidthMm = units === 'mm' ? neckWidth : inchesToMm(neckWidth);
  const bridgeWidthMm = units === 'mm' ? bridgeWidth : inchesToMm(bridgeWidth);
  const fretWidth12Mm = units === 'mm' ? fretWidth12 : inchesToMm(fretWidth12);
  const fretThicknessMm = units === 'mm' ? fretThickness : inchesToMm(fretThickness);
  const stringSpacingMm = units === 'mm' ? stringSpacing : inchesToMm(stringSpacing);
  
  // Convert fret positions to mm if needed
  const normalizedFretPositions = units === 'mm' ? fretPositions : fretPositions.map(fret => ({
    ...fret,
    distance: inchesToMm(fret.distance),
    width: inchesToMm(fret.width)
  }));
  
  // Calculate string positions with padding for parallel alignment
  // Add error handling for undefined or null values
  const stringPositionData = getStringPositions(
    stringsNumber || 6, 
    stringSpacingMm || 10, 
    neckWidthMm || 43, 
    bridgeWidthMm || 56
  );
  
  // Ensure our position data exists before accessing it
  const nutPositions = stringPositionData?.nutPositions || [];
  const bridgePositions = stringPositionData?.bridgePositions || [];
  
  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox={`0 0 ${scaleLengthMm + padding * 2} ${Math.max(bridgeWidthMm, neckWidthMm) + padding * 2}`} 
      preserveAspectRatio="xMidYMin meet"
    >
      {/* Draw the fingerboard horizontally */}
      <g transform={`translate(${padding}, ${padding + Math.max(bridgeWidthMm, neckWidthMm) / 2})`}>
        {/* Neck outline */}
        <path 
          d={
            `M 0 ${-neckWidthMm / 2} ` + 
            normalizedFretPositions.map(fret => `L ${fret.distance} ${-fret.width / 2} `).join('') +
            `L ${scaleLengthMm} ${-bridgeWidthMm / 2} L ${scaleLengthMm} ${bridgeWidthMm / 2} ` +
            [...normalizedFretPositions].reverse().slice(1).map(fret => `L ${fret.distance} ${fret.width / 2} `).join('') +
            `L 0 ${neckWidthMm / 2} Z`
          } 
          fill="none" 
          stroke="black" 
          strokeWidth="0.5"
        />
        
        {/* Draw string lines (with different positions at nut and bridge for parallel alignment) */}
        {nutPositions.map((nutPos, i) => {
          // Only draw if we have matching bridge positions
          if (i < bridgePositions.length) {
            const bridgePos = bridgePositions[i];
            return (
              <line 
                key={`string-${i}`}
                x1={0} 
                y1={nutPos} 
                x2={scaleLengthMm} 
                y2={bridgePos}
                stroke="#888888" 
                strokeWidth="0.5" 
                strokeDasharray="5,5"
              />
            );
          }
          return null;
        })}
        
        {/* Fret lines */}
        {normalizedFretPositions.slice(1, -1).map((fret, index) => (
          <line 
            key={`fret-${index}`}
            x1={fret.distance} 
            y1={-fret.width / 2} 
            x2={fret.distance} 
            y2={fret.width / 2}
            stroke="black" 
            strokeWidth={fretThicknessMm} 
            strokeLinecap="round"
          />
        ))}
        
        {/* Special mark for 12th fret if custom width is used */}
        {useCustomWidth12 && fretWidth12Mm > 0 && normalizedFretPositions.find(f => f.position === 12) && (
          <circle 
            cx={normalizedFretPositions.find(f => f.position === 12).distance} 
            cy={0} 
            r={3} 
            fill="red"
          />
        )}
        
        {/* Nut */}
        <line 
          x1={0} 
          y1={-neckWidthMm / 2} 
          x2={0} 
          y2={neckWidthMm / 2}
          stroke="black" 
          strokeWidth={3} 
          strokeLinecap="round"
        />
        
        {/* Bridge */}
        <line 
          x1={scaleLengthMm} 
          y1={-bridgeWidthMm / 2} 
          x2={scaleLengthMm} 
          y2={bridgeWidthMm / 2}
          stroke="black" 
          strokeWidth={3} 
          strokeLinecap="round"
        />
        
        {/* Fret numbers */}
        {normalizedFretPositions.slice(1, -1).map((fret, index) => (
          <text 
            key={`text-${index}`}
            x={fret.distance - 4} 
            y={-fret.width / 2 - 5} 
            fontSize="8"
            fill="black" 
            textAnchor="middle"
          >
            {fret.position}
          </text>
        ))}
        
        {/* Scale information */}
        <text 
          x={scaleLengthMm / 2} 
          y={bridgeWidthMm / 2 + 15} 
          fontSize="10"
          fill="black" 
          textAnchor="middle"
        >
          KreenTech - {instrumentPresets[selectedPreset].name} - {translations[language].scaleLength}: {units === 'mm' ? scaleLengthMm.toFixed(2) + 'mm' : scaleLength.toFixed(4) + '"'} - {normalizedFretPositions.length - 2} {language === 'en' ? 'frets' : 'trastes'}
        </text>
      </g>
    </svg>
  );
};

export default Preview;