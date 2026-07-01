import jsPDF from "jspdf";
import {  Inch2MM } from "../initparams";
import html2canvas from "html2canvas"
export class SiExport{
    constructor(siMap){
        this.siMap = siMap;
        this.currentUrl = undefined;
        // this.createImageUrlFromMap(undefined,undefined,'image.jpeg','a4',300)
    }
    exportAsPdf(options){
        let format = options.format ? options.format : 'a4';
        let resolution = options.resolution ? options.resolution : 300;
        let imageWidth = options.imageWidth ? options.imageWidth : this.getDim(format)[0]
        let imageHeight = options.imageHeight ? options.imageHeight : this.getDim(format)[1]
        let postionX = options.postionX ? options.postionX : 0
        let postionY = options.postionY ? options.postionY : 0
        let imageFormat =  options.imageFormat ? options.imageFormat : 'image/jpeg'
        let fileName = options.fileName ? options.fileName : 'exportMap'
        let extentTo = options.extentTo ? options.extentTo : this.siMap.map.getView().calculateExtent(this.siMap.map.getSize())
        // if(extentTo){
        //     this.siMap.zoomToExtent(extentTo)
        // }
        // const width = Math.round((imageWidth * resolution) / Inch2MM) 
        // const height = Math.round((imageHeight * resolution) / Inch2MM) 
        this.createImageUrlFromMap(imageWidth,imageHeight,imageFormat,format,resolution,extentTo)
        let url = this.getCurrentURL()
        // console.log(url)
        if(url){
            let pdf = new jsPDF({
                orientation:'portrait',
                format:format,
                unit:'mm',
            });
            pdf.addImage(
              url,
              'JPEG',
              postionX,
              postionY,
              imageWidth,
              imageHeight
            );   
            pdf.save(`${fileName}.PDF`)
        }
    }
    createImageUrlFromMap(imageWidth,imageHeight,imageFormat='image/jpeg',format = 'a4',resolution = 300,extent){
        const map = this.siMap.map
        map.getView().fit(extent,map.getSize())
        map.getView().setZoom(map.getView().getZoom()-2) 
        const units = map.getView().getProjection().getUnits();
        const width = Math.round((imageWidth * resolution) / Inch2MM) 
        const height = Math.round((imageHeight * resolution) / Inch2MM) 
        const viewResolution = map.getView().getResolution();
        const siExport = this
        const size = map.getSize();
        const target = this.siMap.cadTarget
        
        const exportOptions = {
            useCORS: true,
            scale:1,
            ignoreElements: function (element) {
              const className = element.className || '';
              return !(
                className.indexOf('ol-control') === -1 ||
                className.indexOf('ol-scale') > -1 ||
                (className.indexOf('ol-attribution') > -1 &&
                  className.indexOf('ol-uncollapsible'))
              );
            },
          };
        // console.log(map.getSize())
        html2canvas(target, exportOptions).then(function (mapCanvas) {
            // mapCanvas.width = 100;
            // mapCanvas.height = 200;

            // console.log(mapCanvas.width,mapCanvas.height)
            siExport.setCurrentURL(mapCanvas.toDataURL(imageFormat))
            // console.log(mapCanvas.toDataURL('image/jpeg'))
            let url = siExport.getCurrentURL()
            const pdf = new jsPDF('landscape', undefined, format);
            pdf.addImage(
                mapCanvas.toDataURL('image/jpeg'),
              'JPEG',
              0,
              0,
              100,
              75
            );
            pdf.save('map.pdf');
            // // Reset original map size
            // scaleLine.setDpi();
            // map.getTargetElement().style.width = '';
            // map.getTargetElement().style.height = '';
            // map.updateSize();
            // map.getView().setResolution(viewResolution);
            // exportButton.disabled = false;
            // document.body.style.cursor = 'auto';
          });
        // const mapCanvas = document.createElement('canvas');
        //         mapCanvas.width = width;
        //         mapCanvas.height = height;
        //         mapCanvas.style.background = '1px solid black'
        //         const mapContext = mapCanvas.getContext('2d');
        //         // mapContext.fillStyle = 'rgba(255,255,255,1)'
        //         // mapContext.fillRect(0, 0, width, height);
        //         Array.prototype.forEach.call(
        //             target.querySelectorAll('.ol-layer canvas'),
        //             function (canvas) {
        //                 if (canvas.width > 0) {
        //                     const opacity = canvas.parentNode.style.opacity;
        //                     mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
        //                     const transform = canvas.style.transform;
        //                     // Get the transform parameters from the style's transform matrix
        //                     const matrix = transform
        //                     .match(/^matrix\(([^\(]*)\)$/)[1]
        //                     .split(',')
        //                     .map(Number);
        //                     // Apply the transform to the export map context
        //                     CanvasRenderingContext2D.prototype.setTransform.apply(
        //                         mapContext,
        //                         matrix
        //                         );
                                
        //                         mapContext.drawImage(canvas, width/2 - canvas.width/2, height/2 - canvas.height/2);     
        //                     }
        //                 }
        //         );
        //         mapContext.globalAlpha = 1;
        //         map.setSize(size);
        //         map.getView().setResolution(viewResolution);
        
        //   const printSize = [width, height];
        //   map.setSize(printSize);
        //   const scaling = Math.min(width / size[0], height / size[1]);
        //   map.getView().setResolution(viewResolution / scaling);
    }
    getDim(format){
        let dim;
        const dims = {
            a0: [1189, 841],
            a1: [841, 594],
            a2: [594, 420],
            a3: [420, 297],
            a4: [297, 210],
            a5: [210, 148],
          };
        switch (format) {
            case 'a0':
                dim = dims.a0
                break;
            case 'a1':
                dim = dims.a1
                break;
            case 'a2':
                    dim = dims.a2
                    break;
            case 'a3':
                dim = dims.a3
                break;
            case 'a4':
                dim = dims.a4
                break;
            case 'a5':
                dim = dims.a5
                break;
            default:
                break;
        }
        return dim;
    }
    setCurrentURL(url){

        this.currentUrl = url
    }
    getCurrentURL(){

        return this.currentUrl
    }
}