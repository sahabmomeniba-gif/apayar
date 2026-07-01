import Entity, { EntityType, ModifyType } from "./Entity";
import GeoImage from 'ol-ext/source/GeoImage'
import ImageLayer from 'ol/layer/Image';
import { createTextWithHeigth } from "../helpers/StaticText";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Fill, RegularShape, Style } from "ol/style";
import { createTextStyle } from "../helpers/GetTextStyle";
import Stroke from "ol/style/Stroke";
import { getCadColor } from "./SiMap";
import { asArray } from "ol/color";
export default class SiText extends Entity {
    constructor(str, center, height, angle, options) {
        super(options)
        this.entityType = EntityType.staticText
        this.text = str;
        this.textType = options.textType ? options.textType : 'text'
        if (this.textType === 'label') this.selectable = false
        this.textHeight = height
        this.angle = angle
        this.actualCenter = center
        this.center = center
        this.stringType = options.stringType ? options.stringType : 'normal'
        this.anchor = options.anchor ? options.anchor : anchorType.mid_mid
        this.setCenter()
        this.fontSize = options.fontSize ? options.fontSize : 14
        this.fontFamily = options.fontFamily ? options.fontFamily : 'wcs_bNazanin'
            // console.log(this.fontFamily)
        this.fontWeight = options.fontWeight ? options.fontWeight : 'normal'
        this.font = this.createFont()
        let geometry = new Point(this.center)
        this.setGeometry(geometry);
        this.siLayer.addEntity(this);
        this.setCurrentStyle();

        // console.log(this.colorIndex)
        // this.addText()

    }
    setCenter() {
        let groundSize = this.getTextSize()
            // console.log(groundSize)
            // let translate = Math.hypot(groundSize.width / 2, groundSize.height / 2)
        let tx
        let ty
        let alpha = this.angle
        switch (this.anchor) {
            case anchorType.mid_mid:
                tx = 0
                ty = 0
                break;
            case anchorType.mid_top:
                tx = -groundSize.height / 2;
                ty = -groundSize.height / 2;
                alpha = this.angle + Math.PI / 2
                break;
            case anchorType.mid_bottom:
                tx = groundSize.height / 2;
                ty = groundSize.height / 2;
                alpha = this.angle + Math.PI / 2
                break;
            case anchorType.left_bottom:
                tx = groundSize.width / 2
                ty = groundSize.height / 2
                break;
            case anchorType.left_mid:
                tx = groundSize.width / 2;
                ty = groundSize.width / 2;
                break;
            case anchorType.left_top:
                tx = groundSize.width / 2
                ty = -groundSize.height / 2
                break;
            case anchorType.right_bottom:
                tx = -groundSize.width / 2
                ty = groundSize.height / 2
                break;
            case anchorType.right_mid:
                tx = -groundSize.width / 2
                ty = -groundSize.width / 2
                break;
            case anchorType.right_top:
                tx = -groundSize.width / 2;
                ty = -groundSize.height / 2;
                break;
            default:
                break;
        }
        this.center = [this.center[0] + tx * Math.cos(alpha), this.center[1] + ty * Math.sin(alpha)]
    }
    setActualCenter() {
        let groundSize = this.getTextSize()
            // console.log('sa')
            // console.log(groundSize)
            // let translate = Math.hypot(groundSize.width / 2, groundSize.height / 2)
        let tx
        let ty
        let alpha = this.angle
        switch (this.anchor) {
            case anchorType.mid_mid:
                tx = 0
                ty = 0
                break;
            case anchorType.mid_top:
                tx = -groundSize.height / 2;
                ty = -groundSize.height / 2;
                alpha = this.angle + Math.PI / 2
                break;
            case anchorType.mid_bottom:
                tx = groundSize.height / 2;
                ty = groundSize.height / 2;
                alpha = this.angle + Math.PI / 2
                break;
            case anchorType.left_bottom:
                tx = groundSize.width / 2
                ty = groundSize.height / 2
                break;
            case anchorType.left_mid:
                tx = groundSize.width / 2;
                ty = groundSize.width / 2;
                break;
            case anchorType.left_top:
                tx = groundSize.width / 2
                ty = -groundSize.height / 2
                break;
            case anchorType.right_bottom:
                tx = -groundSize.width / 2
                ty = groundSize.height / 2
                break;
            case anchorType.right_mid:
                tx = -groundSize.width / 2
                ty = -groundSize.width / 2
                break;
            case anchorType.right_top:
                tx = -groundSize.width / 2;
                ty = -groundSize.height / 2;
                break;
            default:
                break;
        }
        this.actualCenter = [this.center[0] - tx * Math.cos(alpha), this.center[1] - ty * Math.sin(alpha)]
    }
    changeOpacity(value) {
        this.setCurrentStyle(value)
    }
    setCurrentStyle(value) {
        this.setStyle(this.getEntityStyle(value))
    }
    setModifyPoint() {
        this.modifyFeature.forEach(feature => {
            this.siLayer.siMap.modify.removeFeature(feature)
        })
        this.modifyFeature = []
        this.coordinates = this.actualCenter
        let feature = new Feature({
            geometry: new Point(this.coordinates),
            modifyType: ModifyType.translatePoint,
            targetFeature: this
        })
        feature.setStyle(this.getModifyStyle(ModifyType.endPoint, 0))
        this.modifyFeature.push(feature)
        this.siLayer.siMap.modify.addFeature(new Feature({
            geometry: new Point(this.center),
            style: (feature, reso) => {
                return this.getModifyStyle(ModifyType.endPoint, 0)
            }
        }))
        this.siLayer.siMap.modify.addFeature(feature);
    }
    modifyEnd() {
        this.changeOpacity(1);
        if (this.onModify === true) {
            this.onModify = false;
            this.siLayer.siMap.siSnap.refresh(this)
        }
        this.center = this.getGeometry().getCoordinates()
        this.setActualCenter()
    }
    getEntityStyle(opacity) {
        const styleFunction = (feature, reso) => {
            // console.log(reso, 'reso')
            let style;
            var color = asArray(getCadColor(this.colorIndex)).slice()
            color[3] = opacity
            try {
                let textSize = this.textHeight / reso
                style = [
                    new Style({
                        text: createTextStyle(this.text, reso, {
                            offsetX: 0,
                            offsetY: 0,
                            size: textSize,
                            // maxResolution: 0.01,
                            rotation: -this.angle,
                            type: this.stringType,
                            fontFamily: this.fontFamily,
                            fillColor: color
                                // placement: 'line'
                        }),
                        zIndex: 1
                    }),
                ]
            } catch (error) {
                console.log(error)
            }
            if (style) return style
        }
        return styleFunction
    }
    removeText() {

    }
    createFont() {
        return `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`
    }
    getTextSize() {
        var font = this.font
        var c = document.createElement("canvas");
        var ctx = c.getContext("2d");
        ctx.font = font
        let metrics = ctx.measureText(this.text);
        var width = metrics.width
            // let fontHeight = initFontSize
            // let fontHeight = (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent)
            // console.log(fontHeight)
        let height = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent)
            // var test = document.createElement('div');
            // test.style.position = 'absolute';
            // // test.style.visibility = 'hidden';
            // test.style.height = 'auto';
            // test.style.width = 'auto';
            // test.style.whiteSpace = 'nowrap';
            // test.style.font = this.font
            // test.innerHTML = `${this.text}`
            //     // console.log(this.text)
            // this.siLayer.siMap.appStyle.cadTarget.appendChild(test)
            // var height = (test.clientHeight)
            // var width = ((test.clientWidth) * 1.4)
            // console.log(test)
            // console.log(width, height)
            // this.siLayer.siMap.appStyle.cadTarget.removeChild(test)
        return {
            width: width * this.textHeight / height,
            height: this.textHeight,
        }
    }
    render() {
        this.setCenter();
        this.setCurrentStyle();
    }
}

export const anchorType = {
    mid_mid: 'mid mid',
    mid_top: 'mid top',
    mid_bottom: 'mid bottom',
    left_mid: 'left mid',
    left_top: 'left top',
    left_bottom: 'left bottom',
    right_mid: 'right mid',
    right_top: 'right top',
    right_bottom: 'right bottom'
}

export const stringType = {
    normal: 'normal',
    wrap: 'wrap',
    shorten: 'shorten',
    hide: 'hide'
}