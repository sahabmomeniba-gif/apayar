import jsPDF from "jspdf";
// import {canvg} from 'canvg'
const a4Svg = (data)=>{
    let format = 'a4'
    let dim;
        switch (format) {
            case 'a4':
                dim = [297, 210]
                break;
        
            default:
                break;
        }
    const resolution = 300 //dpi
    const width = Math.round((dim[0] * resolution) / 25.4);
    const height = Math.round((dim[1] * resolution) / 25.4);
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = width;
    mapCanvas.height = height;
    const mapContext = mapCanvas.getContext('2d');
            Array.prototype.forEach.call(
              data.querySelectorAll('.ol-layer canvas'),
              function (canvas) {
                if (canvas.width > 0) {
                  const opacity = canvas.parentNode.style.opacity;
                  mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                  const transform = canvas.style.transform;
                  // Get the transform parameters from the style's transform matrix
                  const matrix = transform
                    .match(/^matrix\(([^\(]*)\)$/)[1]
                    .split(',')
                    .map(Number);
                  // Apply the transform to the export map context
                  CanvasRenderingContext2D.prototype.setTransform.apply(
                    mapContext,
                    matrix
                  );
                  mapContext.drawImage(canvas, 0, 0);
                }
              }
            );
            mapContext.globalAlpha = 1;
            const pdf = new jsPDF('landscape', undefined, format);
        pdf.addImage(
          mapCanvas.toDataURL('image/jpeg'),
          'JPEG',
          0,
          0,
          dim[0],
          dim[1]
        );
        // pdf.save('map2.pdf');
}

export default a4Svg