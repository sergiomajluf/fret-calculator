// presetData.js - Instrument presets data
import translations from './translations';

/**
 * Creates instrument presets with appropriate localization
 * @param {string} lang - Language code ('en' or 'es')
 * @returns {Array} Array of instrument preset objects
 */
const createInstrumentPresets = (lang) => [
  { 
    name: translations[lang].customized, 
    scaleLength: { mm: 648, in: 25.5 },
    numFrets: 22,
    neckWidth: { mm: 43, in: 1.69 },
    bridgeWidth: { mm: 56, in: 2.20 },
    fretWidth12: { mm: 0, in: 0 }, // Default 0 means not specified
    stringsNumber: 6,
    stringSpacing: { mm: 10.5, in: 0.413 },
    fretThickness: { mm: 2.0, in: 0.079 }
  },
  { 
    name: 'Fender Stratocaster (25.5")', 
    scaleLength: { mm: 648, in: 25.5 },
    numFrets: 22,
    neckWidth: { mm: 42, in: 1.65 },
    bridgeWidth: { mm: 56, in: 2.20 },
    fretWidth12: { mm: 51.5, in: 2.03 },
    stringsNumber: 6,
    stringSpacing: { mm: 10.5, in: 0.413 },
    fretThickness: { mm: 2.0, in: 0.079 }
  },
  { 
    name: 'Gibson Les Paul (24.75")', 
    scaleLength: { mm: 628.65, in: 24.75 },
    numFrets: 22,
    neckWidth: { mm: 43, in: 1.69 },
    bridgeWidth: { mm: 61.1, in: 2.405 },
    fretWidth12: { mm: 52.6, in: 2.07 },
    stringsNumber: 6,
    stringSpacing: { mm: 10.5, in: 0.413 },
    fretThickness: { mm: 2.0, in: 0.079 }
  },
  { 
    name: 'PRS Custom 24 (25.0")', 
    scaleLength: { mm: 635, in: 25.0 },
    numFrets: 24,
    neckWidth: { mm: 42, in: 1.65 },
    bridgeWidth: { mm: 56, in: 2.20 },
    fretWidth12: { mm: 51, in: 2.01 },
    stringsNumber: 6,
    stringSpacing: { mm: 10.4, in: 0.409 },
    fretThickness: { mm: 2.0, in: 0.079 }
  },
  { 
    name: 'Ibanez RG (25.5")', 
    scaleLength: { mm: 648, in: 25.5 },
    numFrets: 24,
    neckWidth: { mm: 43, in: 1.69 },
    bridgeWidth: { mm: 58, in: 2.28 },
    fretWidth12: { mm: 52, in: 2.05 },
    stringsNumber: 6,
    stringSpacing: { mm: 10.7, in: 0.421 },
    fretThickness: { mm: 2.0, in: 0.079 }
  },
  { 
    name: lang === 'en' ? 'Classical Guitar (25.6")' : 'Guitarra Clásica (25.6")', 
    scaleLength: { mm: 650, in: 25.6 },
    numFrets: 19,
    neckWidth: { mm: 52, in: 2.05 },
    bridgeWidth: { mm: 58, in: 2.28 },
    fretWidth12: { mm: 55, in: 2.17 },
    stringsNumber: 6,
    stringSpacing: { mm: 11.2, in: 0.441 },
    fretThickness: { mm: 2.0, in: 0.079 }
  },
  { 
    name: lang === 'en' ? 'Short Scale Bass (30")' : 'Bajo corto (30")', 
    scaleLength: { mm: 762, in: 30 },
    numFrets: 22,
    neckWidth: { mm: 38, in: 1.5 },
    bridgeWidth: { mm: 60, in: 2.36 },
    fretWidth12: { mm: 50, in: 1.97 },
    stringsNumber: 4,
    stringSpacing: { mm: 18, in: 0.709 },
    fretThickness: { mm: 2.5, in: 0.098 }
  },
  { 
    name: lang === 'en' ? 'Medium Scale Bass (32")' : 'Bajo medio (32")', 
    scaleLength: { mm: 813, in: 32 },
    numFrets: 22,
    neckWidth: { mm: 40, in: 1.57 },
    bridgeWidth: { mm: 62, in: 2.44 },
    fretWidth12: { mm: 52, in: 2.05 },
    stringsNumber: 4,
    stringSpacing: { mm: 19, in: 0.748 },
    fretThickness: { mm: 2.5, in: 0.098 }
  },
  { 
    name: lang === 'en' ? 'Standard Bass (34")' : 'Bajo estándar (34")', 
    scaleLength: { mm: 864, in: 34 },
    numFrets: 24,
    neckWidth: { mm: 44, in: 1.73 },
    bridgeWidth: { mm: 64, in: 2.52 },
    fretWidth12: { mm: 55, in: 2.17 },
    stringsNumber: 4,
    stringSpacing: { mm: 19, in: 0.748 },
    fretThickness: { mm: 2.5, in: 0.098 }
  },
  { 
    name: lang === 'en' ? 'Extra Long Scale Bass (35")' : 'Bajo extra largo (35")', 
    scaleLength: { mm: 889, in: 35 },
    numFrets: 24,
    neckWidth: { mm: 45, in: 1.77 },
    bridgeWidth: { mm: 66, in: 2.60 },
    fretWidth12: { mm: 57, in: 2.24 },
    stringsNumber: 5,
    stringSpacing: { mm: 17, in: 0.670 },
    fretThickness: { mm: 2.5, in: 0.098 }
  },
  { 
    name: lang === 'en' ? 'Soprano Ukulele (13")' : 'Ukulele Soprano (13")', 
    scaleLength: { mm: 330, in: 13 },
    numFrets: 12,
    neckWidth: { mm: 35, in: 1.38 },
    bridgeWidth: { mm: 43, in: 1.69 },
    fretWidth12: { mm: 39, in: 1.54 },
    stringsNumber: 4,
    stringSpacing: { mm: 8, in: 0.315 },
    fretThickness: { mm: 1.5, in: 0.059 }
  },
  { 
    name: lang === 'en' ? 'Concert Ukulele (15")' : 'Ukulele Concierto (15")', 
    scaleLength: { mm: 380, in: 15 },
    numFrets: 18,
    neckWidth: { mm: 38, in: 1.5 },
    bridgeWidth: { mm: 45, in: 1.77 },
    fretWidth12: { mm: 42, in: 1.65 },
    stringsNumber: 4,
    stringSpacing: { mm: 8.5, in: 0.335 },
    fretThickness: { mm: 1.5, in: 0.059 }
  },
  { 
    name: lang === 'en' ? 'Mandolin (14")' : 'Mandolina (14")', 
    scaleLength: { mm: 355, in: 14 },
    numFrets: 20,
    neckWidth: { mm: 28, in: 1.10 },
    bridgeWidth: { mm: 40, in: 1.57 },
    fretWidth12: { mm: 35, in: 1.38 },
    stringsNumber: 8,
    stringSpacing: { mm: 4, in: 0.157 },
    fretThickness: { mm: 1.2, in: 0.047 }
  }
];

export default createInstrumentPresets;