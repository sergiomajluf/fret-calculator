// Preview.js - SVG preview component for the fretboard

import React from 'react';
import { calculateWidthAtDistance, getStringPositions } from '../../utils/fretCalculator/calculationUtils';
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
  // Convert everything to mm for normalization
  const padding = 20;
  
  // Calculate string positions
  const stringPositions = getStringPositions(stringsNumber, stringSpacing);
  
  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox={`0 0 ${scaleLength + padding * 2} ${Math.max(bridgeWidth, neckWidth) + padding * 2}`} 
      preserveAspectRatio="xMidYMin meet"
    >
      {/* Draw the fingerboard horizontally */}
      <g transform={`translate(${padding}, ${padding + Math.max(bridgeWidth, neckWidth) / 2})`}>
        {/* Neck outline */}
        <path 
          d={
            `M 0 ${-neckWidth / 2} ` + 
            fretPositions.map(fret => `L ${fret.distance} ${-fret.width / 2} `).join('') +
            `L ${scaleLength} ${-bridgeWidth / 2} L ${scaleLength} ${bridgeWidth / 2} ` +
            [...fretPositions].reverse().slice(1).map(fret => `L ${fret.distance} ${fret.width / 2} `).join('') +
            `L 0 ${neckWidth / 2} Z`
          } 
          fill="none" 
          stroke="black" 
          strokeWidth="0.5"
        />
        
        {/* Draw string lines */}
        {stringPositions.map((pos, i) => (
          <line 
            key={`string-${i}`}
            x1={0} 
            y1={pos} 
            x2={scaleLength} 
            y2={pos}
            stroke="#888888" 
            strokeWidth="0.5" 
            strokeDasharray="5,5"
          />
        ))}
        
        {/* Fret lines */}
        {fretPositions.slice(1, -1).map((fret, index) => (
          <line 
            key={`fret-${index}`}
            x1={fret.distance} 
            y1={-fret.width / 2} 
            x2={fret.distance} 
            y2={fret.width / 2}
            stroke="black" 
            strokeWidth={fretThickness} 
            strokeLinecap="round"
          />
        ))}
        
        {/* Special mark for 12th fret if custom width is used */}
        {useCustomWidth12 && fretWidth12 > 0 && fretPositions.find(f => f.position === 12) && (
          <circle 
            cx={fretPositions.find(f => f.position === 12).distance} 
            cy={0} 
            r={3} 
            fill="red"
          />
        )}
        
        {/* Nut */}
        <line 
          x1={0} 
          y1={-neckWidth / 2} 
          x2={0} 
          y2={neckWidth / 2}
          stroke="black" 
          strokeWidth={3} 
          strokeLinecap="round"
        />
        
        {/* Bridge */}
        <line 
          x1={scaleLength} 
          y1={-bridgeWidth / 2} 
          x2={scaleLength} 
          y2={bridgeWidth / 2}
          stroke="black" 
          strokeWidth={3} 
          strokeLinecap="round"
        />
        
        {/* Fret numbers */}
        {fretPositions.slice(1, -1).map((fret, index) => (
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
          x={scaleLength / 2} 
          y={bridgeWidth / 2 + 15} 
          fontSize="10"
          fill="black" 
          textAnchor="middle"
        >
          KreenTech - {instrumentPresets[selectedPreset].name} - {translations[language].scaleLength}: {scaleLength.toFixed(2)}{units === 'mm' ? 'mm' : '"'} - {fretPositions.length - 2} {language === 'en' ? 'frets' : 'trastes'}
        </text>
      </g>
    </svg>
  );
};

export default Preview;