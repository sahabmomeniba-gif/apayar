// import { Fill, Stroke, Style } from "ol/style"
import Entity from "./Entity"
import { EntityType, ModifyType } from "./Entity";
import * as uniqid from "uniqid"
import 'ol/ol.css';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point'
import Polygon from 'ol/geom/Polygon'


import {
    Circle as CircleStyle,
    Fill,
    Icon,
    Stroke,
    Style,
    RegularShape,
} from 'ol/style';

import ImageLayer from 'ol/layer/Image';
import { M2Px, Px2M } from './../initparams';
import { bboxPolygon } from '@turf/turf'
import GeoImage from 'ol-ext/source/GeoImage'
import { feature } from "turf";
import calculateCenter from "../helpers/CalculateCenter";
import { asArray, asString } from "ol/color";


const calcDistance = (p1, p2) => {
    return Math.sqrt(Math.pow((p1[1] - p2[1]), 2) + Math.pow((p1[0] - p2[0]), 2))
}

export class SiText extends Entity {
    constructor(MapContainer, name, x, y, rotate, text, options) {
        super(options)
        this.entityType = EntityType.text;
        this.visible = true;
        this.text = {
            name: name,
            id: uniqid(),
            string: text,
            rotate: rotate,
            imgLayer: new ImageLayer,
            center: [x, y],
            style: this.TextStyle,
            siText: this,
            svgSource: undefined,
            textHeight: undefined,
            anchor: undefined,
            isLabel: false,
            label: {},
            source: undefined
        }
        this.siLayer.siMap.map.addLayer(this.text.imgLayer)
    }
    show() {
        this.visible = true;
    }
    hide() {
        this.visible = false;
    }
    render() {
        // let textStyle = new Text({
        //     text:entity.text,
        //     fill: new Fill({
        //         color:'rgba(255,255,255,1)',
        //     }),
        //     rotation:this.text.rotate,
        //     overflow:true,
        // })
        // console.log(this.text.source)

        if (this.visible) {

            if (!this.text.source) {
                // console.log('yes sir')
                var data = (new XMLSerializer()).serializeToString(this.text.svgSource[3]);
                var DOMURL = window.URL || window.webkitURL || window;

                var svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });

                var url = DOMURL.createObjectURL(svgBlob);
                // console.log(this.text.imageScale,url)
                this.text.svgSource[0] = url;
                let staticSource = new GeoImage({
                    url: url,
                    projection: this.siLayer.siMap.projection,
                    imageExtent: this.getGeometry().getExtent(),
                    imageCenter: this.text.center,
                    imageRotate: -this.text.rotate,
                    imageScale: this.text.imageScale,
                });
                this.text.source = staticSource
                    // this.text.imgLayer.setSource(staticSource)
            }
            this.text.imgLayer.setSource(this.text.source)
        }
        if (!this.visible) this.text.imgLayer.setSource()
    }
    setLabelToEntity(entity) {
        this.text.isLabel = true
        this.text.label.target = entity
    }
    calcTextHeight() {
        let clone = this.getGeometry().clone()
        let coordinates = clone.getCoordinates()[0]
        let segmentLen1 = Math.hypot((coordinates[1][1] - coordinates[0][1]), (coordinates[1][0], coordinates[0][0]))
        let segmentLen2 = Math.hypot((coordinates[2][1] - coordinates[1][1]), (coordinates[2][0], coordinates[1][0]))
        return Math.min(segmentLen2, segmentLen1)
    }
    getTextHeight() {
        // console.log(this.calcTextHeight(),this.text.textHeight)
        if (!this.text.textHeight) {
            return this.calcTextHeight()
        } else {
            return this.text.textHeight
        }
    }
    calcTextFontSizeCoordinates() {
        let clone = this.getGeometry().clone()
        let coordinates = clone.getCoordinates()[0]
        return [coordinates[1], coordinates[2]]

        // console.log(coordinates,this.text.string,'sxqcalc')
        // let segmentLen1 = Math.hypot((coordinates[1][1]-coordinates[0][1]),(coordinates[1][0],coordinates[0][0]))
        // let segmentLen2 = Math.hypot((coordinates[2][1]-coordinates[1][1]),(coordinates[2][0],coordinates[1][0]))
        // console.log(segmentLen1,segmentLen2)
        // let min = Math.min(segmentLen2,segmentLen1)
        // if(min == segmentLen1){

        //   return [coordinates[1],coordinates[2]]
        // }
        // else{
        //   let feature = new Feature({
        //     geometry:new MultiPoint([coordinates[1],coordinates[2]])
        //   })
        //   this.siLayer.siMap.modify.addFeature(feature)
        //   let style =new Style({
        //     image:new CircleStyle({
        //       radius:5,
        //       fill:new Fill({
        //         color:'rgba(0,0,0,1)',

        //       })
        //     })
        //   })
        //   feature.setStyle(style)
        //   return [coordinates[1],coordinates[2]]
        // }

        // let actualWidth =  Math.max(segmentLen1,segmentLen2)
        // let actualHeight = Math.min(segmentLen2,segmentLen1)
        // return actualHeight*0.75
        // var initFont  = 100
        // var font = `${initFont}px B-Nazanin`        
        // var c = document.createElement("canvas");
        // var ctx = c.getContext("2d");
        // ctx.font  = font    
        // var metrics = ctx.measureText(this.text.string);
        // var fontWidth = metrics.width*1.25
        // console.log(fontWidth,actualWidth)
        // if(fontWidth<actualWidth){
        //   while (fontWidth<actualWidth) {
        //     var initFont  = initFont+ 100
        //     console.log(initFont)
        //     var font = `${initFont}px B-Nazanin`        
        //     var c = document.createElement("canvas");
        //     var ctx = c.getContext("2d");
        //     ctx.font  = font    
        //     var metrics = ctx.measureText(this.text.string);
        //     var fontWidth = metrics.width*1.25
        //   }
        // }
        // let [sx,sy] = this.text.imgLayer.getSource().getScale()
        // let [iw,ih] = [this.text.svgSource[1],this.text.svgSource[2]]
        // console.log(iw*sx,ih*sy)
        // return Math.min(iw*sx,ih*sy)
        // let imgExtent =   this.text.imgLayer.getSource().getExtent()
        // let h = Math.min((imgExtent[2]-imgExtent[0]),(imgExtent[3]-imgExtent[1]))
        // let source =  this.text.imgLayer.getSource()   


    }
    getRotate() {
        return this.text.rotate
    }
    getCenter() {
        return this.text.center
    }
    createClone() {
        let clone = this.clone()
        this.siLayer.siMap.modify.addFeature(clone)

        let imgLayer = new ImageLayer
        let staticSource = new GeoImage({
            url: this.text.svgSource[0],
            projection: this.siLayer.siMap.projection,
            imageExtent: this.getGeometry().getExtent(),
            imageCenter: this.text.center,
            imageRotate: -this.text.rotate,
            imageScale: this.text.imgLayer.getSource().getScale(),
        });
        imgLayer.setSource(staticSource)
        this.siLayer.siMap.modifyLayers.push(imgLayer)
        this.siLayer.siMap.map.addLayer(imgLayer)
        clone.setProperties({
            entitySource: this,
            imgLayer: imgLayer,
            totalRotate: undefined,
            center: undefined
        })
        return clone
    }
    changeangle(angle) {
        this.text.imgLayer.getSource().setRotation(-angle)
        this.getGeometry().rotate(angle - this.text.rotate, this.text.center);
        this.text.rotate = angle
    }
    changeCenter(center) {
        let deltaX = center[0] - this.text.center[0]
        let deltaY = center[1] - this.text.center[1]
        this.text.center = center
        this.getGeometry().translate(deltaX, deltaY)
        this.text.imgLayer.getSource().setCenter(center)
    }
    changeOpacity(value) {
        // var stroke = this.getStyle().getStroke()
        // console.log(asArray(this.getStyle().getStroke().getColor()))
        // var color = asArray(this.getStyle().getStroke().getColor()).slice()
        let color = asArray(this.styleProperties.textColor).slice()
        color[3] = value
        this.changeFontColor(asString(color))
            // this.getStyle().getStroke()
    }
    changeFontColor(color) {
        this.styleProperties.textColor = color
        let svgSource = this.text.svgSource
        let img = this.createImage()
        let staticSource = new GeoImage({
            url: img[0],
            projection: this.siLayer.siMap.projection,
            imageExtent: this.getGeometry().getExtent(),
            imageCenter: this.text.center,
            imageRotate: -this.text.rotate,
            imageScale: this.text.imgLayer.getSource().getScale(),
        });
        this.text.imgLayer.setSource(staticSource)
        this.text.svgSource = img
    }
    setModifyPoint() {
        this.modifyFeature.forEach(feature => {
            this.siLayer.siMap.modify.removeFeature(feature)
        })
        this.modifyFeature = []
        this.coordinates = this.getGeometry().getCoordinates()[0].slice(1);
        let x = 0;
        let y = 0;
        let i = 0;
        let tp; //translate point
        let sp; //scale point
        let rp; // rotate point
        let extent = this.getGeometry().getExtent();
        // console.log(extent)
        let coordinates = this.coordinates
        coordinates.forEach(function(coordinate) {
            x += coordinate[0];
            y += coordinate[1];
            i++;
            if (coordinate[0] === extent[2]) {
                tp = coordinate
            }
            if (coordinate[1] === extent[1]) {
                rp = coordinate
            }
            if (coordinate[1] === extent[3]) {
                sp = coordinate
            }
        });
        let angle = Math.atan(Math.abs((sp[1] - tp[1])) / Math.abs((sp[0] - tp[0]))) - Math.PI / 4
        rp = coordinates[0]
        tp = this.text.center
        sp = coordinates[2]
        let tfeature = new Feature({
            geometry: new Point(tp),
            modifyType: ModifyType.translatePoint,
            targetFeature: this
        })
        tfeature.setStyle(this.getModifyStyle(ModifyType.translatePoint, 0, 0))
        this.modifyFeature.push(tfeature)
        this.siLayer.siMap.modify.addFeature(tfeature);
        let sfeature = new Feature({
            geometry: new Point(sp),
            modifyType: ModifyType.scalePoint,
            targetFeature: this
        })
        sfeature.setStyle(this.getModifyStyle(ModifyType.endPoint, 0, angle))
        this.modifyFeature.push(sfeature)
        this.siLayer.siMap.modify.addFeature(sfeature);
        let rfeature = new Feature({
            geometry: new Point(rp),
            modifyType: ModifyType.rotatePoint,
            targetFeature: this
        })
        rfeature.setStyle(this.getModifyStyle(ModifyType.rotatePoint, 0, 0))
        this.modifyFeature.push(rfeature)
        this.siLayer.siMap.modify.addFeature(rfeature);
    }
    addTextByTextHeight = (textHeight, anchor, addToSource) => {
        this.text.textHeight = textHeight
        this.text.anchor = anchor
        let img = this.createImage()
        this.text.svgSource = img
        let iw = Math.max(img[2], img[1])
        let ih = Math.min(img[2], img[1])
        let textWidth = iw / ih * textHeight
            // console.log(img)
        let TransFormX = textWidth / 2
        let TransFormY = textHeight / 2
            // console.log(TransFormX,TransFormY)
        let offSet;
        let [X, Y] = [this.text.center[0], this.text.center[1]];
        // console.log(X,Y)
        // console.log(anchor)
        switch (anchor) {
            case 'left bottom':
                X -= TransFormX;
                Y -= TransFormY;
                break;
            case 'left mid':
                X -= TransFormX;
                break;
            case 'left top':
                X -= TransFormX;
                Y += TransFormY;
                break;

            case 'mid bottom':
                Y -= TransFormY;
                break;
            case 'mid mid':
                break;
            case 'mid top':
                Y += TransFormY;
                break;

            case 'right bottom':
                X += TransFormX;
                Y -= TransFormY;
                break;
            case 'right mid':
                X += TransFormX;
                break;
            case 'right top':
                X += TransFormX;
                Y += TransFormY;
                break;

        }

        let coordinate = [
            [
                [
                    X - TransFormX,
                    Y - TransFormY
                ],
                [
                    X + TransFormX,
                    Y - TransFormY
                ],
                [
                    X + TransFormX,
                    Y + TransFormY
                ],
                [
                    X - TransFormX,
                    Y + TransFormY
                ],
                [
                    X - TransFormX,
                    Y - TransFormY
                ]
            ]
        ]
        let geometry = new Polygon(coordinate)
        let feature = new Feature({
                geometry: geometry,
                entity: this
            })
            // console.log(coordinate,textHeight,'add text byt height')
        this.addTextByFrameFeature(feature, addToSource)
    }
    addTextByFrameFeature = (feature, addToSource) => {
        // console.log(feature.getGeometry())
        let imageExtent = feature.getGeometry().getExtent()
            // console.log(imageExtent,'addTextByFrameFeature')
        let featureCenter = [(imageExtent[2] + imageExtent[0]) / 2, (imageExtent[3] + imageExtent[1]) / 2]
        let crood = feature.getGeometry().getCoordinates()[0];

        let p1;
        let p2;
        let p3;
        // console.log(imageExtent)
        crood.forEach(point => {
            if (point[0] === imageExtent[0]) {
                p1 = point
            }
            if (point[1] === imageExtent[1] && point !== p1) {
                p2 = point
            }
            if (point[0] === imageExtent[2]) {
                p3 = point
            }
        });
        // console.log(p1,p2,p3)
        let pw = Math.max(Math.hypot((p2[1] - p1[1]), (p2[0] - p1[0])), Math.hypot((p3[1] - p2[1]), (p3[0] - p2[0])))
            // let pw = Math.max(calcDistance(p1,p2),calcDistance(p2,p3))
        let ph = Math.min(Math.hypot((p2[1] - p1[1]), (p2[0] - p1[0])), Math.hypot((p3[1] - p2[1]), (p3[0] - p2[0])))
        let rotate = this.text.rotate
        let img = this.createImage()
        this.text.svgSource = img
        let iw = Math.max(img[2], img[1])
        let ih = Math.min(img[2], img[1])



        // feature.setProperties({
        //     layerName:this.siLayer.name,
        //     textID: this.text.id,
        //     color:'rgba(255,255,255,0)',
        //     fillColor:'rgba(255,255,255,0)',
        //     width:2,
        // })
        let style = new Style({
            fill: new Fill({
                color: 'rgba(255,255,255,0)'
            }),
            stroke: new Stroke({
                color: 'rgba(255,255,255,0)',
                width: 2
            })
        })
        let clone = feature.getGeometry().clone()
        clone.rotate(rotate, this.text.center)
        this.setGeometry(clone)
        this.setStyle(style)
        let cs = clone.flatCoordinates
        let cCen = [(cs[0] + cs[4]) / 2, (cs[1] + cs[5]) / 2]
        this.text.imageScale = [(pw / iw), (ph / ih)]
        let staticSource = new GeoImage({
            url: img[0],
            projection: this.siLayer.siMap.projection,
            imageExtent: imageExtent,
            imageCenter: cCen,
            imageRotate: -rotate,
            imageScale: [(pw / iw), (ph / ih)],
        });
        this.text.source = staticSource
        this.text.imgLayer.setSource(staticSource)
        this.render();
        this.text.frame = feature
        this.text.svgSize = [img[1], img[2]]
        if (addToSource == undefined) addToSource = true
        if (addToSource) {
            // this.siLayer.Texts.push(this.text)
            this.siLayer.addEntity(this)
        }
        this.text.center = cCen
    }
    changeTextHeight(newHeight, newAnchor) {
        this.text.textHeight = newHeight
            // this.siLayer.source.removeFeature(this)
        this.setGeometry()
        if (!newAnchor) newAnchor = this.text.anchor
        this.addTextByTextHeight(newHeight, newAnchor, false)
    }
    changeText(newText, setModify) {

        let prvsImg = this.createImage()
        this.text.string = newText
        let img = this.createImage()
        let sx = img[1] / prvsImg[1]
        let prvsScale = this.text.imgLayer.getSource().getScale()
        let actualWidth = prvsImg[1] * prvsScale[1] * (sx - 1)
        let clone = this.getGeometry().clone()
        clone.rotate(this.text.rotate, this.text.center)
        clone.getCoordinates().forEach(coord => {
            if (coord[0] > this.text.center[0]) {
                coord[0] += actualWidth / 2
            }
            if (coord[0] < this.text.center[0]) {
                coord[0] -= actualWidth / 2
            }
        });
        clone.rotate(-this.text.rotate, this.text.center)
        this.setGeometry(clone)
        this.text.imageScale = [actualWidth / img[1], prvsScale[1]]
            // let staticSource = new GeoImage({
            //   url: img[0],
            //   projection: this.siLayer.siMap.projection,
            //   imageExtent: this.getGeometry().getExtent(),
            //   imageCenter: this.text.center,
            //   imageRotate: this.text.rotate,
            //   imageScale: [actualWidth/img[1],prvsScale[1]]
            // });
            // this.text.imgLayer.setSource(staticSource)
        this.text.svgSource[0] = img
        this.setModifyPoint()
    }
    remove() {
        this.siLayer.source.removeFeature(this)
        this.text.imgLayer.setSource()
    }
    createImage = () => {

        var initFontSize = 100


        var font = `${initFontSize}px B-Nazanin`


        var c = document.createElement("canvas");
        var ctx = c.getContext("2d");
        ctx.font = font

        let metrics = ctx.measureText(this.text.string);
        var width = metrics.width
            // let fontHeight = initFontSize
        let fontHeight = (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent)
            // console.log(fontHeight)
        let actualHeight = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) * 1.25
            // console.log()
        var num = 2000
            // console.log(num)
        var svg = document.createElementNS(`http://www.w3.org/${num}/svg`, 'svg');
        svg.id = 'svgContainer'
        svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        svg.setAttribute('width', width);
        svg.setAttribute('height', actualHeight);

        var svgNS = svg.namespaceURI;

        var rect = document.createElementNS(svgNS, 'rect');
        rect.setAttribute('x', 0);
        rect.setAttribute('y', 0);
        rect.setAttribute('width', width);
        rect.setAttribute('height', actualHeight);
        rect.setAttribute('fill', 'rgba(245,125,240,0.0001');

        // svg.appendChild(rect);
        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

        var font = `${initFontSize}px B-Nazanin`
        text.style.font = font

        text.textContent = this.text.string
        text.setAttribute('x', '50%');
        text.setAttribute('y', '50%');
        text.setAttribute('fill', this.styleProperties.textColor);
        // text.setAttribute('dominant-baseline',"middle" )
        // text.setAttribute('text-anchor',"middle" )
        text.style.dominantBaseline = 'central'
        text.style.textAnchor = 'middle'
            // text.setAttribute('stroke','rgba(255,255,255,1')

        svg.appendChild(text);
        // var bbox = svg.getBBox();
        // var width = bbox.width;
        // var height = bbox.height;
        // console.log(bbox)
        var data = (new XMLSerializer()).serializeToString(svg);
        var DOMURL = window.URL || window.webkitURL || window;

        var svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });

        var url = DOMURL.createObjectURL(svgBlob);
        // console.log(text)
        return [url, width, actualHeight, svg, text]
    }
    addTextByExtent = (extent) => {
        let img = this.createImage()
        this.text.svgSource = img
        let nes = img[1] / img[2]
            // let extentWidth = Math.max(Math.abs(extent[3]-extent[1]),(Math.abs(extent[2]-extent[0])))
        let extentHeight = Math.min(Math.abs(extent[3] - extent[1]), (Math.abs(extent[2] - extent[0])))
        let TransFormY = extentHeight
        let TransFormX = TransFormY * nes
        TransFormX *= 0.5
        TransFormY *= 0.5
        let [X, Y] = [this.text.center[0], this.text.center[1]]
        let croods = [
            [
                [
                    X - TransFormX,
                    Y - TransFormY
                ],
                [
                    X + TransFormX,
                    Y - TransFormY
                ],
                [
                    X + TransFormX,
                    Y + TransFormY
                ],
                [
                    X - TransFormX,
                    Y + TransFormY
                ],
                [
                    X - TransFormX,
                    Y - TransFormY
                ]
            ]
        ]
        let newFeature = new Feature({
            geometry: new Polygon(croods)
        })

        this.addTextByFrameFeature(newFeature)
    }
    addImageByFont = (font) => {

        if (!font) {
            this.font = this.TextStyle.font
        }
        var c = document.createElement("canvas");
        var ctx = c.getContext("2d");
        // console.log(this.font)
        ctx.font = this.font
        let metrics = ctx.measureText(this.text);
        var width = metrics.width
        let fontHeight = (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent)
        let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        let transformX = width * Px2M
        let transformY = fontHeight * Px2M
        let imageExtent = [this.textCenter[0] - transformX, this.textCenter[1] - transformY, this.textCenter[0] + transformX, this.textCenter[1] + transformY]
        var poly = bboxPolygon(imageExtent);
        // console.log(font,width) 
        var FPoly = new Feature({
                geometry: new Polygon([poly.geometry.coordinates[0]])
            })
            // console.log(this)
        let f = this.frameLayer.addEntity(FPoly)
        let initStyle = new Style({

            stroke: new Stroke({
                color: 'rgba(0,0,0)',
                width: 3
            }),
        });
        this.frameLayer.Layer.setStyle(initStyle)
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'svgContainer'
        svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        svg.setAttribute('width', width);
        svg.setAttribute('height', fontHeight);
        svg.setAttribute('style', 'background:white');
        var svgNS = svg.namespaceURI;
        var rect = document.createElementNS(svgNS, 'rect');
        rect.setAttribute('x', 0);
        rect.setAttribute('y', 0);
        rect.setAttribute('width', '100%');
        rect.setAttribute('height', '100%');
        rect.setAttribute('fill', 'rgba(0,0,0,1)');
        svg.appendChild(rect);
        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.style.font = this.font
        text.textContent = this.text
        text.setAttribute('x', '50%');
        text.setAttribute('y', '50%');
        text.setAttribute('fill', 'rgba(255,255,255,1)');
        text.setAttribute('dominant-baseline', "middle")
        text.setAttribute('text-anchor', "middle")
        text.setAttribute('font-family', "B-Nazanin")
        svg.appendChild(text);
        var data = (new XMLSerializer()).serializeToString(svg);
        var DOMURL = window.URL || window.webkitURL || window;
        var svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });

        var url = DOMURL.createObjectURL(svgBlob);
        let imgLayer = new ImageLayer
        imgLayer.setProperties = {
            'name': this.name,
            'framLayer_id': this.frameLayer.id
        }
        let staticSource = new GeoImage({
            url: url,
            projection: this.siLayer.siMap.projection,
            imageExtent: imageExtent,
            imageCenter: this.textCenter,
            imageRotate: -this.rotate,
            imageScale: [2 * Px2M, 2 * Px2M]
        });
        imgLayer.setSource(staticSource)
        this.map.map.addLayer(imgLayer)
    }
}


export class TextStyle {
    constructor(font, name) {
        this.id = uniqid()
        this.name = name || undefined
        if (!font) {
            this.font = { size: '20px', weigth: 'normal' }
        } else {
            this.font = font
        }

    }
}

const calculateoffSetPosition = (feature, offset) => {
    // let lineOffset
    let rotate;
    let [xc, yc] = calculateCenter(feature).center
    let croods = feature.getGeometry().getCoordinates()
    let [xs, ys] = [croods[0][0], croods[0][1]]
    let [xe, ye] = [croods[1][0], croods[1][1]]
    let distance_SC = Math.sqrt(Math.pow((xc - xs), 2) + Math.pow((yc - ys), 2))

    let alpha = Math.atan(offset / distance_SC);
    let beta = Math.PI / 2
    let X = ((xs / Math.tan(beta)) + (xc / Math.tan(alpha)) + ys - yc) / ((1 / Math.tan(alpha)) + (1 / Math.tan(beta)))
    let Y = ((ys / Math.tan(beta)) + (yc / Math.tan(alpha)) + xc - xs) / ((1 / Math.tan(alpha)) + (1 / Math.tan(beta)))
    rotate = -Math.atan((yc - ys) / (xc - xs))
        // let L;
        // if(offset ===0){
        //   L = 0
        // }
        // else{
        //   L = offset/Math.cos(angle1)
        // }
        // let angle0 = Math.atan(Math.abs(xc-xs)/Math.abs(yc-ys))
        // let angle2 = angle0- angle1
        // let m1 = Math.tan(angle0)
        // let m2 = -1/Math.tan(angle2)
        // let X = (m1*xs-ys+yc-m2*xc)/(m1-m2)
        // let Y = m1*X+ys-m1*xs
        // console.log(X,Y)

    if (xs >= xc) {

        rotate = -Math.atan((yc - ys) / (xc - xs))
    } else {

        rotate = -Math.atan((yc - ys) / (xc - xs)) + Math.PI
    }

    return { offset: [X, Y], rotate: rotate }
}