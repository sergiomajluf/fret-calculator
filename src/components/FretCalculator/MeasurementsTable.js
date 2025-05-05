// MeasurementsTable.js - Component for displaying fret measurements

import React from 'react';
import { formatMeasurement } from '../../utils/fretCalculator/calculationUtils';
import translations from '../../utils/fretCalculator/translations';

/**
 * Table component displaying all fret measurements
 * @param {Object} props - Component props
 * @returns {JSX.Element} Measurements table
 */
const MeasurementsTable = ({ fretPositions, numFrets, units, language }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">{translations[language].measurements}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">{translations[language].fret}</th>
              <th className="px-4 py-2 text-left">{translations[language].distance}</th>
              <th className="px-4 py-2 text-left">{translations[language].width}</th>
            </tr>
          </thead>
          <tbody>
            {fretPositions.map((fret) => (
              <tr key={fret.position} className="border-b">
                <td className="px-4 py-2">
                  {fret.position === 0 ? translations[language].nut : 
                   fret.position === numFrets + 1 ? translations[language].bridge : fret.position}
                </td>
                <td className="px-4 py-2">{formatMeasurement(fret.distance, units)}</td>
                <td className="px-4 py-2">{formatMeasurement(fret.width, units)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeasurementsTable;