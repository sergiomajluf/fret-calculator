# Calculadora de Trastes para Instrumentos de Cuerda

![Calculadora de Trastes](https://img.shields.io/badge/Calculadora-Trastes-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green)

Una herramienta precisa para luthiers y fabricantes de instrumentos musicales, que calcula y genera planos a escala real para la ubicación de trastes en instrumentos de cuerda como guitarras, bajos, y ukuleles.

## 🎸 [Ver Demo en Vivo](https://sergiomajluf.github.io/fret-calculator)

![Vista previa de la calculadora](https://via.placeholder.com/800x400?text=Vista+Previa+Calculadora+de+Trastes)

## 📋 Características

- **Cálculos precisos** basados en la fórmula del temperamento igual (12ª raíz de 2)
- **Unidades en milímetros o pulgadas** para adaptarse a diferentes preferencias
- **Personalización completa** de parámetros:
  - Longitud de escala
  - Número de trastes
  - Ancho en la cejuela
  - Ancho en el puente
  - Grosor de los trastes
- **Exportación a formatos vectoriales** para fabricación:
  - SVG (ideal para impresión o corte láser)
  - DXF (compatible con software CAD)
- **Vista previa interactiva** del diapasón
- **Tabla de mediciones** con las posiciones exactas de cada traste

## 🚀 Tecnologías Utilizadas

- React.js
- Tailwind CSS
- GitHub Pages

## 📐 Fundamentos Matemáticos

La calculadora utiliza la fórmula estándar para calcular la posición de cada traste según el temperamento igual:

```
Distancia desde la cejuela al traste n = Longitud de escala - (Longitud de escala / (2^(n/12)))
```

Donde:
- n es el número del traste
- La longitud de escala es la distancia entre la cejuela y el puente

## 🔧 Configuraciones Típicas

### Guitarras
- Escala estándar: 25.5" (648mm) o 24.75" (628mm)
- Número de trastes: 19-24
- Ancho en cejuela: 42-44mm (guitarras clásicas: 51-52mm)
- Ancho en puente: 52-56mm (guitarras clásicas: 58-62mm)

### Bajos
- Escala estándar: 34" (864mm) o 30" (762mm) para short scale
- Número de trastes: 20-24
- Ancho en cejuela: 38-45mm
- Ancho en puente: 54-60mm

### Ukuleles
- Soprano: 13-14" (330-355mm)
- Concierto: 15-16" (380-406mm)
- Tenor: 17-18" (430-460mm)
- Barítono: 19-20" (485-510mm)

## 📝 Cómo Usar

1. Selecciona tus unidades preferidas (mm o pulgadas)
2. Ingresa la longitud de escala de tu instrumento
3. Ajusta el número de trastes
4. Configura el ancho en la cejuela y en el puente
5. Configura el grosor de los trastes
6. Descarga el archivo SVG o DXF
7. Usa el archivo para fabricación o como plantilla de medición

## 📋 Para Desarrolladores

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/sergiomajluf/fret-calculator.git

# Entrar en el directorio
cd fret-calculator

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

### Desplegar en GitHub Pages

```bash
npm run deploy
```

## 🔍 Recursos Adicionales

- [Teoría del temperamento igual](https://es.wikipedia.org/wiki/Temperamento_igual)
- [Guía para construir guitarras](https://www.guitarmaking.com/)
- [Tabla de escalas para diferentes instrumentos](https://www.liutaiomottola.com/formulae/fret.htm)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 👥 Contribuciones

Las contribuciones son bienvenidas. Si tienes alguna idea para mejorar esta calculadora, no dudes en crear un pull request o abrir un issue.

## 💬 Contacto

Para preguntas o comentarios, puedes contactarme a través de [GitHub](https://github.com/sergiomajluf) o en Twitter [@sergiomajluf](https://twitter.com/sergiomajluf).

---

Hecho con ❤️ por [Sergio Majluf](https://github.com/sergiomajluf)