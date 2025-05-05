// Footer.js - Component with informational footer

import React from 'react';
import translations from '../../utils/fretCalculator/translations';

/**
 * Footer component with description and credits
 * @param {Object} props - Component props
 * @returns {JSX.Element} Footer component
 */
const Footer = ({ language }) => {
  return (
    <div className="mt-6 text-center text-sm text-gray-600">
      <p>{translations[language].formula}</p>
      <p>{translations[language].realScale}</p>
      <p>{translations[language].developed}</p>
    </div>
  );
};

export default Footer;