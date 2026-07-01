import { Inch2MM, Px2Inch } from "../initparams";
import { EntityType } from "./Entity";
import svgson from 'svgson'
// var _ = require('lodash');


/* example:
var svg = new SvgClass({paperWidth:200,paperHeight: 100,scale: 200, dpi:200,transform:'lonlat2xy'});
svg.addFeature({type:'Feature',geometry:polygon});
svg.drawFeatures();

 */
export class SvgExport {
    constructor(options) {
        this.options = options;
        // this.siMap = options.siMap
        // this.features=[];
        this.entities = [];
        this.shift = { x: 0, y: 0 };
        this.extent = options.extent
        this.paperSize = { width: options.paperWidth, height: options.paperHeight };
        const scaleX = options.scaleX ? options.scaleX : 1;
        const scaleY = options.scaleY ? options.scaleY : 1;
        this.scale = { x: scaleX, y: scaleY };
        this.dpi = options.dpi ? options.dpi : 300;
        this.svgDOM = {
            name: 'svg',
            type: 'element',
            value: '',
            attributes: {
                // width:this.paper.width*this.dpi/Inch2MM,
                // height:this.paper.height*this.dpi/Inch2MM,
                xmlns: "http://www.w3.org/2000/svg",
            },
            children: []
        };
        this.svgDOM.attributes = {
            width: (this.paperSize.width * this.dpi / Inch2MM),
            height: (this.paperSize.height * this.dpi / Inch2MM),
            xmlns: "http://www.w3.org/2000/svg"
        }
    }

    addEentities(Entity) {
        this.entities.push(Entity);
    }
    setEntities(collection) {
            this.entities = collection
        }
        // drawFeatures(){
        //   this.features.forEach((f)=>{
        //     switch(f.geometry.type){
        //         case 'Polygon':
        //           this.drawPolygonModel(f.geometry,f.atts);
        //           break;
        //         case 'MultiPolygon':
        //           f.geometry.coordinates.map(cs=>
        //           this.drawPolygonModel({coordinates:cs},f.atts)
        //           )
        //           break;
        //         case 'LineString':
        //           this.drawLineStringModel(f.geometry,f.atts);
        //           break;
        //     }
        //   })
        // }
    drawEntities() {
        this.entities.forEach((e) => {
            switch (e.entityType) {
                case EntityType.text:
                    // this.drawPolygonModel(e)
                    this.drawText(e);
                    break;
                case EntityType.polygon:
                    this.drawPolygonModel(e)
                    break;
                case EntityType.line:
                    this.drawLineStringModel(e);
                    break;
            }
        })
    }

    calcBBox() {
        if (this.options.fixScale && this.options.fixShift) {
            this.scale = this.options.fixScale;
            this.shift = this.options.fixShift;
            return;
        }
        let bbox = this.extent
            // if(!this.zone)
            //   this.zone = MapHelper.lonlat2Zone([bbox[0],bbox[1]]);
            // let c1 =  MapHelper.lonlat2xy([bbox[0],bbox[1]],this.zone);
            // let c2 =  MapHelper.lonlat2xy([bbox[2],bbox[3]],this.zone);
        let c1 = [bbox[0], bbox[1]]
        let c2 = [bbox[2], bbox[3]]
        let sx = (c2[0] - c1[0]) / (this.paperSize.width / 1000);
        let sy = (c2[1] - c1[1]) / (this.paperSize.height / 1000);
        let sc = Math.max(sx, sy);
        this.scale = { x: Math.ceil(sc / 50) * 50, y: Math.ceil(sc / 50) * 50 };
        let midx = (c2[0] + c1[0]) / 2;
        let midy = (c2[1] + c1[1]) / 2;

        this.shift.x = midx - this.paperSize.width / 2 / 1000 * this.scale.x;
        this.shift.y = midy - this.paperSize.height / 2 / 1000 * this.scale.y;

    }

    drawPolygonModel(polygon) {
        // console.log(polygon.styleProperties.lineWidth)
        let fillcolor = polygon.styleProperties.fillColor === 'rgba(0,0,0,0)' ? 'rgba(255,255,255,0)' : '#545353'
        let attribs = {
            stroke: '#000000',
            fill: fillcolor,
            // 'stroke-width': polygon.styleProperties.lineWidth*Px2Inch*this.dpi/Inch2MM,
            'stroke-width': 0.1 * this.dpi / Inch2MM,
            'stroke-linecap': 'round',
        }

        let elem = {
            name: 'polygon',
            type: 'element',
            value: '',
            attributes: attribs,
            children: []
        }
        let points = polygon.getGeometry().getCoordinates()[0].map(c => this.transform(c)).map(c => c[0] + ',' + c[1]).join(' ');
        elem.attributes.points = points;
        this.svgDOM.children.push(elem)
            // mapHelper.lonlat2xy_arr_forceZone(poly.coordinates);
    }
    drawLineStringModel(line) {
        let attribs = {
            stroke: '#000000',
            fill: 'rgba(255,255,255,0)',
            // 'stroke-width': line.styleProperties.lineWidth*Px2Inch*this.dpi/Inch2MM,
            'stroke-width': 0.1 * this.dpi / Inch2MM,
            'stroke-linecap': 'round',
        }

        let elem = {
            name: 'polyline',
            type: 'element',
            value: '',
            attributes: attribs,
            children: []
        }
        let points = line.getGeometry().getCoordinates().map(c => this.transform(c)).map(c => c[0] + ',' + c[1]).join(' ');
        elem.attributes.points = points;
        this.svgDOM.children.push(elem)
            // mapHelper.lonlat2xy_arr_forceZone(poly.coordinates);
    }
    addText(text, point, height, rot = 0, atts = {}) {
        this.entities.push({
            type: 'text',
            text: text,
            point: point,
            height: height,
            rot: rot,
            atts: atts
        })
    }
    drawText(e) {
        let center = [e.text.center[0], e.text.center[1]]
        let pt = this.transform(center);
        // let textPoints = ''+Math.round(this.scalePaperToPixel(e.calcTextFontSize()));
        let textPoints = e.calcTextFontSizeCoordinates()
            // console.log(textPoints)
        let tp1 = this.transform(textPoints[0])
        let tp2 = this.transform(textPoints[1])
        let ht = Math.round((Math.hypot((tp2[1] - tp1[1]), (tp2[0] - tp1[0]))) * 0.75)



        let atts = {
            x: pt[0] + '',
            y: pt[1] + '',
            // stroke: '#000000',
            // width:width,
            // height:fontHeight,
            'font-size': ht * 1.5,
            'text-anchor': "middle",
            'dominant-baseline': "central",
            transform: "rotate(" + (-e.text.rotate * 180 / Math.PI) + " " + pt[0] + ',' + pt[1] + ")",
            stroke: '#000000',
            // 'stroke-width': 0.05 * this.dpi / Inch2MM,
            // 'stroke-linecap': 'round',
            // points: '10,10 100,100 200,200 10,10'
        }

        let elem = {
            name: 'text',
            type: 'element',
            value: '',

            attributes: atts,
            children: [{
                value: e.text.string,
                type: 'text',
                attributes: {}
            }]
        };
        this.svgDOM.children.push(elem)
            // mapHelper.lonlat2xy_arr_forceZone(poly.coordinates);
    }

    draw(format) {
        this.calcBBox();
        // this.drawFeatures();
        this.drawEntities();
        const mysvg = svgson.stringify(this.svgDOM)
        if (format == 'xml')
            return mysvg;
        if (format == 'svg')
            return this.svgDOM;
        return 'data:image/svg+xml;base64,' + Buffer.from(mysvg).toString('base64');
    }
    scaleModelToPixel(a) {
        return a / this.scale.x * 1000 / Inch2MM * this.dpi;
    }
    scalePaperToPixel(height) {
        return height
            // return 50
        return height / Inch2MM * this.dpi;
    }
    transform(c) {
        let c2;
        // if(this.options.transform == 'lonlat2xy')
        //  c2 =  MapHelper.lonlat2xy(c,this.zone);
        // else
        c2 = []
        c2[0] = Math.round((c[0] - this.shift.x) / this.scale.x * 1000 / Inch2MM * this.dpi);
        c2[1] = Math.round((this.paperSize.height - (c[1] - this.shift.y) / this.scale.y * 1000) / Inch2MM * this.dpi);
        return c2;
    }
}