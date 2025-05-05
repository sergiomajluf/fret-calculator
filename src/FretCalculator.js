import { useState, useEffect } from 'react';

const FretCalculator = () => {
  // Presets para diferentes instrumentos
  const instrumentPresets = [
    { 
      name: 'Personalizado', 
      scaleLength: { mm: 648, in: 25.5 },
      numFrets: 22,
      neckWidth: { mm: 43, in: 1.69 },
      bridgeWidth: { mm: 56, in: 2.20 },
      fretThickness: { mm: 2.0, in: 0.079 }
    },
    { 
      name: 'Fender Stratocaster (25.5")', 
      scaleLength: { mm: 648, in: 25.5 },
      numFrets: 22,
      neckWidth: { mm: 42, in: 1.65 },
      bridgeWidth: { mm: 56, in: 2.20 },
      fretThickness: { mm: 2.0, in: 0.079 }
    },
    { 
      name: 'Gibson Les Paul (24.75")', 
      scaleLength: { mm: 628.65, in: 24.75 },
      numFrets: 22,
      neckWidth: { mm: 43, in: 1.69 },
      bridgeWidth: { mm: 54, in: 2.13 },
      fretThickness: { mm: 2.0, in: 0.079 }
    },
    { 
      name: 'PRS Custom 24 (25.0")', 
      scaleLength: { mm: 635, in: 25.0 },
      numFrets: 24,
      neckWidth: { mm: 42, in: 1.65 },
      bridgeWidth: { mm: 56, in: 2.20 },
      fretThickness: { mm: 2.0, in: 0.079 }
    },
    { 
      name: 'Ibanez RG (25.5")', 
      scaleLength: { mm: 648, in: 25.5 },
      numFrets: 24,
      neckWidth: { mm: 43, in: 1.69 },
      bridgeWidth: { mm: 58, in: 2.28 },
      fretThickness: { mm: 2.0, in: 0.079 }
    },
    { 
      name: 'Guitarra Clásica (25.6")', 
      scaleLength: { mm: 650, in: 25.6 },
      numFrets: 19,
      neckWidth: { mm: 52, in: 2.05 },
      bridgeWidth: { mm: 58, in: 2.28 },
      fretThickness: { mm: 2.0, in: 0.079 }
    },
    { 
      name: 'Bajo corto (30")', 
      scaleLength: { mm: 762, in: 30 },
      numFrets: 22,
      neckWidth: { mm: 38, in: 1.5 },
      bridgeWidth: { mm: 54, in: 2.13 },
      fretThickness: { mm: 2.5, in: 0.098 }
    },
    { 
      name: 'Bajo medio (32")', 
      scaleLength: { mm: 813, in: 32 },
      numFrets: 22,
      neckWidth: { mm: 40, in: 1.57 },
      bridgeWidth: { mm: 56, in: 2.20 },
      fretThickness: { mm: 2.5, in: 0.098 }
    },
    { 
      name: 'Bajo estándar (34")', 
      scaleLength: { mm: 864, in: 34 },
      numFrets: 24,
      neckWidth: { mm: 44, in: 1.73 },
      bridgeWidth: { mm: 60, in: 2.36 },
      fretThickness: { mm: 2.5, in: 0.098 }
    },
    { 
      name: 'Bajo extra largo (35")', 
      scaleLength: { mm: 889, in: 35 },
      numFrets: 24,
      neckWidth: { mm: 45, in: 1.77 },
      bridgeWidth: { mm: 62, in: 2.44 },
      fretThickness: { mm: 2.5, in: 0.098 }
    },
    { 
      name: 'Ukulele Soprano (13")', 
      scaleLength: { mm: 330, in: 13 },
      numFrets: 12,
      neckWidth: { mm: 35, in: 1.38 },
      bridgeWidth: { mm: 43, in: 1.69 },
      fretThickness: { mm: 1.5, in: 0.059 }
    },
    { 
      name: 'Ukulele Concierto (15")', 
      scaleLength: { mm: 380, in: 15 },
      numFrets: 18,
      neckWidth: { mm: 38, in: 1.5 },
      bridgeWidth: { mm: 45, in: 1.77 },
      fretThickness: { mm: 1.5, in: 0.059 }
    },
    { 
      name: 'Mandolina (14")', 
      scaleLength: { mm: 355, in: 14 },
      numFrets: 20,
      neckWidth: { mm: 28, in: 1.10 },
      bridgeWidth: { mm: 40, in: 1.57 },
      fretThickness: { mm: 1.2, in: 0.047 }
    }
  ];

  // Estados para los parámetros
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [scaleLength, setScaleLength] = useState(instrumentPresets[0].scaleLength.mm);
  const [numFrets, setNumFrets] = useState(instrumentPresets[0].numFrets);
  const [neckWidth, setNeckWidth] = useState(instrumentPresets[0].neckWidth.mm);
  const [bridgeWidth, setBridgeWidth] = useState(instrumentPresets[0].bridgeWidth.mm);
  const [units, setUnits] = useState('mm');
  const [fretThickness, setFretThickness] = useState(instrumentPresets[0].fretThickness.mm);
  const [fretPositions, setFretPositions] = useState([]);
  const [shareUrl, setShareUrl] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  
  // Constante para la relación matemática de los trastes (12va raíz de 2)
  const FRET_RATIO = Math.pow(2, 1/12);
  
  // Función para cargar parámetros desde la URL al inicio
  useEffect(() => {
    const loadParamsFromUrl = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        
        // Si hay parámetros en la URL, cargarlos
        if (params.toString()) {
          const preset = params.get('preset');
          const unitParam = params.get('units');
          const scale = params.get('scale');
          const frets = params.get('frets');
          const neck = params.get('neck');
          const bridge = params.get('bridge');
          const thickness = params.get('thickness');
          
          // Establecer las unidades primero
          if (unitParam === 'in' || unitParam === 'inches') {
            setUnits('inches');
          } else {
            setUnits('mm');
          }
          
          // Si hay un preset específico, cargarlo
          if (preset && !isNaN(parseInt(preset)) && parseInt(preset) >= 0 && parseInt(preset) < instrumentPresets.length) {
            setSelectedPreset(parseInt(preset));
          } else {
            // Si no hay preset o es inválido, usar el personalizado
            setSelectedPreset(0);
            setIsCustom(true);
          }
          
          // Cargar parámetros individuales si existen
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
  
  // Función para actualizar la URL con los parámetros actuales
  const updateUrlParams = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      
      // Añadir parámetros a la URL
      params.set('preset', selectedPreset.toString());
      params.set('units', units);
      params.set('scale', scaleLength.toString());
      params.set('frets', numFrets.toString());
      params.set('neck', neckWidth.toString());
      params.set('bridge', bridgeWidth.toString());
      params.set('thickness', fretThickness.toString());
      
      // Actualizar la URL del navegador sin recargar la página
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
      
      // Guardar la URL completa para compartir
      setShareUrl(`${window.location.origin}${newUrl}`);
    }
  };
  
  // Actualizar la URL cuando los parámetros cambian
  useEffect(() => {
    updateUrlParams();
  }, [selectedPreset, units, scaleLength, numFrets, neckWidth, bridgeWidth, fretThickness]);
  
  // Función para manejar la selección de presets
  const handlePresetChange = (presetIndex) => {
    const preset = instrumentPresets[presetIndex];
    setSelectedPreset(presetIndex);
    
    // Actualizar todos los parámetros según el preset seleccionado
    setScaleLength(units === 'mm' ? preset.scaleLength.mm : preset.scaleLength.in);
    setNumFrets(preset.numFrets);
    setNeckWidth(units === 'mm' ? preset.neckWidth.mm : preset.neckWidth.in);
    setBridgeWidth(units === 'mm' ? preset.bridgeWidth.mm : preset.bridgeWidth.in);
    setFretThickness(units === 'mm' ? preset.fretThickness.mm : preset.fretThickness.in);
    
    // Si es el preset "Personalizado", habilitar la edición
    setIsCustom(presetIndex === 0);
  };
  
  // Función para detectar cambios y activar el modo personalizado
  const handleParameterChange = () => {
    if (selectedPreset !== 0) {
      setSelectedPreset(0); // Cambiar a "Personalizado"
      setIsCustom(true);
    }
  };
  
  // Función para convertir mm a pulgadas
  const mmToInches = (mm) => mm / 25.4;
  
  // Función para convertir pulgadas a mm
  const inchesToMm = (inches) => inches * 25.4;
  
  // Función para formatear números según las unidades
  const formatMeasurement = (value) => {
    if (units === 'inches') {
      return mmToInches(value).toFixed(3) + '"';
    }
    return value.toFixed(1) + 'mm';
  };
  
  // Función para calcular las posiciones de los trastes
  const calculateFretPositions = () => {
    const positions = [];
    let currentLength = scaleLength;
    
    // La posición 0 es la cejuela
    positions.push({
      position: 0,
      distance: 0,
      width: neckWidth
    });
    
    // Calcular cada traste
    for (let i = 1; i <= numFrets; i++) {
      const fretDistance = currentLength / FRET_RATIO;
      const distanceFromNut = scaleLength - fretDistance;
      
      // Calcular el ancho interpolando entre el ancho de la cejuela y el puente
      const widthRatio = distanceFromNut / scaleLength;
      const width = neckWidth + (bridgeWidth - neckWidth) * widthRatio;
      
      positions.push({
        position: i,
        distance: distanceFromNut,
        width: width
      });
      
      currentLength = fretDistance;
    }
    
    // Añadir el puente como último punto
    positions.push({
      position: numFrets + 1,
      distance: scaleLength,
      width: bridgeWidth
    });
    
    return positions;
  };
  
  // Recalcular cuando cambian los parámetros
  useEffect(() => {
    const positions = calculateFretPositions();
    setFretPositions(positions);
  }, [scaleLength, numFrets, neckWidth, bridgeWidth, fretThickness]);
  
  // Función para convertir valores cuando cambian las unidades
  const handleUnitChange = (newUnits) => {
    if (newUnits === units) return;
    
    if (newUnits === 'inches') {
      // Convertir mm a pulgadas
      setScaleLength(mmToInches(scaleLength));
      setNeckWidth(mmToInches(neckWidth));
      setBridgeWidth(mmToInches(bridgeWidth));
      setFretThickness(mmToInches(fretThickness));
    } else {
      // Convertir pulgadas a mm
      setScaleLength(inchesToMm(scaleLength));
      setNeckWidth(inchesToMm(neckWidth));
      setBridgeWidth(inchesToMm(bridgeWidth));
      setFretThickness(inchesToMm(fretThickness));
    }
    
    setUnits(newUnits);
  };
  
  // Función para generar y descargar el SVG
  const handleGenerateSVG = () => {
    // Asegurarse de que los cálculos sean en mm para el SVG
    let scaleLengthMm = units === 'mm' ? scaleLength : inchesToMm(scaleLength);
    let neckWidthMm = units === 'mm' ? neckWidth : inchesToMm(neckWidth);
    let bridgeWidthMm = units === 'mm' ? bridgeWidth : inchesToMm(bridgeWidth);
    let fretThicknessMm = units === 'mm' ? fretThickness : inchesToMm(fretThickness);
    
    // Recalcular posiciones para el SVG de exportación
    const positions = [];
    let currentLength = scaleLengthMm;
    
    // La posición 0 es la cejuela
    positions.push({
      position: 0,
      distance: 0,
      width: neckWidthMm
    });
    
    // Calcular cada traste
    for (let i = 1; i <= numFrets; i++) {
      const fretDistance = currentLength / FRET_RATIO;
      const distanceFromNut = scaleLengthMm - fretDistance;
      
      // Calcular el ancho interpolando entre el ancho de la cejuela y el puente
      const widthRatio = distanceFromNut / scaleLengthMm;
      const width = neckWidthMm + (bridgeWidthMm - neckWidthMm) * widthRatio;
      
      positions.push({
        position: i,
        distance: distanceFromNut,
        width: width
      });
      
      currentLength = fretDistance;
    }
    
    // Añadir el puente como último punto
    positions.push({
      position: numFrets + 1,
      distance: scaleLengthMm,
      width: bridgeWidthMm
    });
    
    // Configurar el documento SVG para escala real (1mm = 1mm en el SVG)
    const padding = 20; // Padding en mm
    
    // Crear el SVG a partir de una cadena de texto para mayor control
    let svgString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${scaleLengthMm + padding * 2}mm" height="${Math.max(bridgeWidthMm, neckWidthMm) + padding * 2}mm" viewBox="0 0 ${scaleLengthMm + padding * 2} ${Math.max(bridgeWidthMm, neckWidthMm) + padding * 2}">
  <desc>Plantilla de trastes a escala real - ${instrumentPresets[selectedPreset].name} - Longitud: ${formatMeasurement(scaleLengthMm)}, ${numFrets} trastes</desc>
  <g transform="translate(${padding}, ${padding + Math.max(bridgeWidthMm, neckWidthMm) / 2})">
    <!-- Contorno del mástil -->
    <path d="M 0 ${-neckWidthMm / 2} `;
    
    // Añadir línea lateral izquierda
    positions.forEach(fret => {
      svgString += `L ${fret.distance} ${-fret.width / 2} `;
    });
    
    // Añadir línea inferior y lateral derecha
    svgString += `L ${scaleLengthMm} ${bridgeWidthMm / 2} `;
    
    // Línea lateral derecha (subiendo)
    for (let i = positions.length - 2; i >= 0; i--) {
      const fret = positions[i];
      svgString += `L ${fret.distance} ${fret.width / 2} `;
    }
    
    svgString += `Z" fill="none" stroke="black" stroke-width="0.5" />
    
    <!-- Cejuela -->
    <line x1="0" y1="${-neckWidthMm / 2}" x2="0" y2="${neckWidthMm / 2}" stroke="black" stroke-width="3" stroke-linecap="round" />
    
    <!-- Puente -->
    <line x1="${scaleLengthMm}" y1="${-bridgeWidthMm / 2}" x2="${scaleLengthMm}" y2="${bridgeWidthMm / 2}" stroke="black" stroke-width="3" stroke-linecap="round" />`;
    
    // Añadir líneas para cada traste
    positions.slice(1, -1).forEach(fret => {
      svgString += `
    <!-- Traste ${fret.position} -->
    <line x1="${fret.distance}" y1="${-fret.width / 2}" x2="${fret.distance}" y2="${fret.width / 2}" stroke="black" stroke-width="${fretThicknessMm}" stroke-linecap="round" />
    <text x="${fret.distance - 4}" y="${-fret.width / 2 - 5}" font-family="Arial" font-size="8" text-anchor="middle">${fret.position}</text>`;
    });
    
    // Información de escala
    svgString += `
    <text x="${scaleLengthMm / 2}" y="${bridgeWidthMm / 2 + 15}" font-family="Arial" font-size="10" text-anchor="middle">${instrumentPresets[selectedPreset].name} - Escala: ${formatMeasurement(scaleLengthMm)} - ${numFrets} trastes</text>
  </g>
</svg>`;
    
    // Crear un Blob con el SVG
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    // Crear un enlace para descargar
    const link = document.createElement('a');
    link.href = url;
    
    // Generar un nombre de archivo basado en el preset seleccionado
    const presetName = instrumentPresets[selectedPreset].name;
    const presetNameForFile = presetName.replace(/\s+\([^)]*\)/g, '').replace(/\s+/g, '_').toLowerCase();
    link.download = `trastes_${presetNameForFile}_${formatMeasurement(scaleLengthMm).replace(/[^0-9.]/g, '')}.svg`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Liberar el objeto URL
    URL.revokeObjectURL(url);
  };
  
  // Función para generar y descargar un DXF
  const handleGenerateDXF = () => {
    // Asegurarse de que los cálculos sean en mm para el DXF
    let scaleLengthMm = units === 'mm' ? scaleLength : inchesToMm(scaleLength);
    let neckWidthMm = units === 'mm' ? neckWidth : inchesToMm(neckWidth);
    let bridgeWidthMm = units === 'mm' ? bridgeWidth : inchesToMm(bridgeWidth);
    let fretThicknessMm = units === 'mm' ? fretThickness : inchesToMm(fretThickness);
    
    // Recalcular posiciones para el DXF
    const positions = [];
    let currentLength = scaleLengthMm;
    
    // La posición 0 es la cejuela
    positions.push({
      position: 0,
      distance: 0,
      width: neckWidthMm
    });
    
    // Calcular cada traste
    for (let i = 1; i <= numFrets; i++) {
      const fretDistance = currentLength / FRET_RATIO;
      const distanceFromNut = scaleLengthMm - fretDistance;
      
      // Calcular el ancho interpolando entre el ancho de la cejuela y el puente
      const widthRatio = distanceFromNut / scaleLengthMm;
      const width = neckWidthMm + (bridgeWidthMm - neckWidthMm) * widthRatio;
      
      positions.push({
        position: i,
        distance: distanceFromNut,
        width: width
      });
      
      currentLength = fretDistance;
    }
    
    // Añadir el puente como último punto
    positions.push({
      position: numFrets + 1,
      distance: scaleLengthMm,
      width: bridgeWidthMm
    });
    
    // Encabezado DXF
    let dxf = "0\nSECTION\n2\nHEADER\n";
    dxf += "9\n$ACADVER\n1\nAC1021\n";
    dxf += "9\n$INSUNITS\n70\n4\n"; // 4 = milímetros
    dxf += "0\nENDSEC\n";
    
    // Sección ENTITIES
    dxf += "0\nSECTION\n2\nENTITIES\n";
    
    // Cejuela - línea horizontal 
    dxf += "0\nLINE\n";
    dxf += "8\n0\n";
    dxf += `10\n0\n20\n${-neckWidthMm / 2}\n30\n0\n`;
    dxf += `11\n0\n21\n${neckWidthMm / 2}\n31\n0\n`;
    
    // Puente - línea horizontal
    dxf += "0\nLINE\n";
    dxf += "8\n0\n";
    dxf += `10\n${scaleLengthMm}\n20\n${-bridgeWidthMm / 2}\n30\n0\n`;
    dxf += `11\n${scaleLengthMm}\n21\n${bridgeWidthMm / 2}\n31\n0\n`;
    
    // Líneas para los trastes - líneas verticales
    positions.slice(1, -1).forEach((fret) => {
      dxf += "0\nLINE\n";
      dxf += "8\n0\n";
      dxf += `10\n${fret.distance}\n20\n${-fret.width / 2}\n30\n0\n`;
      dxf += `11\n${fret.distance}\n21\n${fret.width / 2}\n31\n0\n`;
    });
    
    // Contorno lateral izquierdo
    for (let i = 0; i < positions.length - 1; i++) {
      const fret1 = positions[i];
      const fret2 = positions[i + 1];
      
      dxf += "0\nLINE\n";
      dxf += "8\n0\n";
      dxf += `10\n${fret1.distance}\n20\n${-fret1.width / 2}\n30\n0\n`;
      dxf += `11\n${fret2.distance}\n21\n${-fret2.width / 2}\n31\n0\n`;
    }
    
    // Contorno lateral derecho
    for (let i = 0; i < positions.length - 1; i++) {
      const fret1 = positions[i];
      const fret2 = positions[i + 1];
      
      dxf += "0\nLINE\n";
      dxf += "8\n0\n";
      dxf += `10\n${fret1.distance}\n20\n${fret1.width / 2}\n30\n0\n`;
      dxf += `11\n${fret2.distance}\n21\n${fret2.width / 2}\n31\n0\n`;
    }
    
    // Cerrar el DXF
    dxf += "0\nENDSEC\n0\nEOF";
    
    // Crear un Blob con el DXF
    const blob = new Blob([dxf], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    
    // Crear un enlace para descargar
    const link = document.createElement('a');
    link.href = url;
    
    // Generar un nombre de archivo basado en el preset seleccionado
    const presetName = instrumentPresets[selectedPreset].name;
    const presetNameForFile = presetName.replace(/\s+\([^)]*\)/g, '').replace(/\s+/g, '_').toLowerCase();
    link.download = `trastes_${presetNameForFile}_${formatMeasurement(scaleLengthMm).replace(/[^0-9.]/g, '')}.dxf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Liberar el objeto URL
    URL.revokeObjectURL(url);
  };
  
  // Función para copiar URL compartible al portapapeles
  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        alert('¡URL copiada al portapapeles! Ya puedes compartirla.');
      },
      (err) => {
        alert('No se pudo copiar la URL: ' + err);
      }
    );
  };
  
  // Función para renderizar el SVG para vista previa (girado 90 grados)
  const renderSvgPreview = () => {
    // Para la vista previa, siempre trabajamos con valores normalizados para evitar desescalado visual
    // Convertir todo a mm para normalizar
    const scaleLengthMm = units === 'mm' ? scaleLength : inchesToMm(scaleLength);
    const neckWidthMm = units === 'mm' ? neckWidth : inchesToMm(neckWidth);
    const bridgeWidthMm = units === 'mm' ? bridgeWidth : inchesToMm(bridgeWidth);
    const fretThicknessMm = units === 'mm' ? fretThickness : inchesToMm(fretThickness);
    
    // Recalcular las posiciones para la vista previa normalizada
    const positions = [];
    let currentLength = scaleLengthMm;
    
    // La posición 0 es la cejuela
    positions.push({
      position: 0,
      distance: 0,
      width: neckWidthMm
    });
    
    // Calcular cada traste
    for (let i = 1; i <= numFrets; i++) {
      const fretDistance = currentLength / FRET_RATIO;
      const distanceFromNut = scaleLengthMm - fretDistance;
      
      // Calcular el ancho interpolando entre el ancho de la cejuela y el puente
      const widthRatio = distanceFromNut / scaleLengthMm;
      const width = neckWidthMm + (bridgeWidthMm - neckWidthMm) * widthRatio;
      
      positions.push({
        position: i,
        distance: distanceFromNut,
        width: width
      });
      
      currentLength = fretDistance;
    }
    
    // Añadir el puente como último punto
    positions.push({
      position: numFrets + 1,
      distance: scaleLengthMm,
      width: bridgeWidthMm
    });
    
    // Configuración básica para la vista previa
    const padding = 20;
    
    // Crear un SVG con la orientación y tamaño correctos
    return (
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${scaleLengthMm + padding * 2} ${Math.max(bridgeWidthMm, neckWidthMm) + padding * 2}`} 
        preserveAspectRatio="xMidYMin meet"
      >
        {/* Dibujamos el diapasón horizontalmente */}
        <g transform={`translate(${padding}, ${padding + Math.max(bridgeWidthMm, neckWidthMm) / 2})`}>
          {/* Contorno del mástil */}
          <path 
            d={
              `M 0 ${-neckWidthMm / 2} ` + 
              positions.map(fret => `L ${fret.distance} ${-fret.width / 2} `).join('') +
              `L ${scaleLengthMm} ${-bridgeWidthMm / 2} L ${scaleLengthMm} ${bridgeWidthMm / 2} ` +
              [...positions].reverse().slice(1).map(fret => `L ${fret.distance} ${fret.width / 2} `).join('') +
              `L 0 ${neckWidthMm / 2} Z`
            } 
            fill="none" 
            stroke="black" 
            strokeWidth="0.5"
          />
          
          {/* Líneas de trastes */}
          {positions.slice(1, -1).map((fret, index) => (
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
          
          {/* Cejuela */}
          <line 
            x1={0} 
            y1={-neckWidthMm / 2} 
            x2={0} 
            y2={neckWidthMm / 2}
            stroke="black" 
            strokeWidth={3} 
            strokeLinecap="round"
          />
          
          {/* Puente */}
          <line 
            x1={scaleLengthMm} 
            y1={-bridgeWidthMm / 2} 
            x2={scaleLengthMm} 
            y2={bridgeWidthMm / 2}
            stroke="black" 
            strokeWidth={3} 
            strokeLinecap="round"
          />
          
          {/* Números de trastes */}
          {positions.slice(1, -1).map((fret, index) => (
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
          
          {/* Información de escala */}
          <text 
            x={scaleLengthMm / 2} 
            y={bridgeWidthMm / 2 + 15} 
            fontSize="10"
            fill="black" 
            textAnchor="middle"
          >
            {instrumentPresets[selectedPreset].name} - Escala: {formatMeasurement(scaleLengthMm)} - {numFrets} trastes
          </text>
        </g>
      </svg>
    );
  };
  
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="w-full max-w-[1600px] mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Calculadora de Trastes para Instrumentos de Cuerda</h1>
        
        {/* Vista previa horizontal en la parte superior */}
        <div className="bg-white p-4 mb-6 rounded shadow overflow-hidden">
          <h2 className="text-xl font-semibold mb-2">Vista Previa</h2>
          <div className="border p-2 bg-gray-100 flex justify-center" style={{ height: '250px' }}>
            <div className="w-full h-full">
              {fretPositions.length > 0 && renderSvgPreview()}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Nota: La vista previa muestra el mástil horizontal para mejor visualización. 
            Los archivos descargados mantendrán la escala real para impresión.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Panel de controles */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Parámetros</h2>
            
            {/* Selector de presets */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Instrumento</label>
              <select 
                className="w-full p-2 border rounded bg-white"
                value={selectedPreset}
                onChange={(e) => handlePresetChange(parseInt(e.target.value))}
              >
                {instrumentPresets.map((preset, index) => (
                  <option key={index} value={index}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Selector de unidades */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Unidades</label>
              <div className="flex space-x-4">
                <button 
                  className={`px-4 py-2 rounded ${units === 'mm' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleUnitChange('mm')}
                >
                  Milímetros (mm)
                </button>
                <button 
                  className={`px-4 py-2 rounded ${units === 'inches' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleUnitChange('inches')}
                >
                  Pulgadas (in)
                </button>
              </div>
            </div>
            
            {/* Longitud de escala */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Longitud de escala ({units})
              </label>
              <input
                type="number"
                step={units === 'mm' ? '1' : '0.01'}
                value={scaleLength}
                onChange={(e) => {
                  setScaleLength(parseFloat(e.target.value));
                  handleParameterChange();
                }}
                className="w-full p-2 border rounded"
              />
            </div>
            
            {/* Número de trastes */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Número de trastes</label>
              <input
                type="number"
                min="12"
                max="36"
                value={numFrets}
                onChange={(e) => {
                  setNumFrets(parseInt(e.target.value));
                  handleParameterChange();
                }}
                className="w-full p-2 border rounded"
              />
            </div>
            
            {/* Ancho del mástil */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Ancho en la cejuela ({units})
              </label>
              <input
                type="number"
                step={units === 'mm' ? '0.5' : '0.01'}
                value={neckWidth}
                onChange={(e) => {
                  setNeckWidth(parseFloat(e.target.value));
                  handleParameterChange();
                }}
                className="w-full p-2 border rounded"
              />
            </div>
            
            {/* Ancho en el puente */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Ancho en el puente ({units})
              </label>
              <input
                type="number"
                step={units === 'mm' ? '0.5' : '0.01'}
                value={bridgeWidth}
                onChange={(e) => {
                  setBridgeWidth(parseFloat(e.target.value));
                  handleParameterChange();
                }}
                className="w-full p-2 border rounded"
              />
            </div>
            
            {/* Grosor del traste */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Grosor del traste ({units})
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="3"
                value={fretThickness}
                onChange={(e) => {
                  setFretThickness(parseFloat(e.target.value));
                  handleParameterChange();
                }}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div>
            {/* Botones y acciones */}
            <div className="bg-white p-4 mb-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Acciones</h2>
              
              {/* Botones de descarga */}
              <div className="mb-6 flex flex-col space-y-2">
                <button
                  onClick={handleGenerateSVG}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Descargar SVG
                </button>
                <button
                  onClick={handleGenerateDXF}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Descargar DXF
                </button>
              </div>
              
              {/* Compartir configuración */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Compartir esta configuración</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Puedes compartir o guardar esta URL para acceder a la misma configuración en el futuro:
                </p>
                <div className="flex">
                  <input 
                    type="text" 
                    className="flex-grow p-2 border rounded-l bg-gray-50 text-sm" 
                    value={shareUrl} 
                    readOnly 
                  />
                  <button 
                    onClick={copyShareUrl}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tabla de mediciones */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Mediciones de Trastes</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Traste</th>
                      <th className="px-4 py-2 text-left">Distancia</th>
                      <th className="px-4 py-2 text-left">Ancho</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fretPositions.map((fret) => (
                      <tr key={fret.position} className="border-b">
                        <td className="px-4 py-2">
                          {fret.position === 0 ? 'Cejuela' : 
                           fret.position === numFrets + 1 ? 'Puente' : fret.position}
                        </td>
                        <td className="px-4 py-2">{formatMeasurement(fret.distance)}</td>
                        <td className="px-4 py-2">{formatMeasurement(fret.width)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Esta herramienta utiliza la fórmula estándar del temperamento igual (12ª raíz de 2) para calcular las posiciones de los trastes.</p>
          <p>Los archivos SVG generados están configurados a escala real 1:1 para impresión o fabricación.</p>
          <p>Desarrollada para luthiers y constructores de instrumentos musicales.</p>
        </div>
      </div>
    </div>
  );
};

export default FretCalculator;