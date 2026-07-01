import { Fill, Stroke, Style, Text } from "ol/style";
import SiLine from "../SiLine";
import { SaObjectsType } from "./SaObjectsType";
import './style.css'
import { saLineTypeList } from "../../initparams";
import { createTextStyle } from "../../helpers/GetTextStyle";
import { getCadColor, wcs_sideBarContentsType } from "../SiMap";
import { LineLabeling, lineLabelingEventsHandler } from "../../appStyle/sidebar/LineLabeling";
import SiLayer from "../SiLayer";
import { DefaultSelectStyle, getDefaultSelectFunction } from "../../helpers/GetDefaultStyles";
import { asArray } from "ol/color";
export default class SaLine extends SiLine {
    constructor(x, y, options) {
        super(x, y, options)
        this.objectType = SaObjectsType.line;
        this.saLineType = options.saLineType ? options.saLineType : saLineTypeList[0];
        this.labelType = options.labelType ? options.labelType : 'onLine';
        this.rightPoly = options.rightPoly;
        this.leftPoly = options.leftPoly;
        this.rightPolyIndex = options.rightPolyIndex;
        this.leftPolyIndex = options.leftPolyIndex;
        this.nmh = options.nmh
            // this.isAparteman = options.isAparteman ? options.isAparteman : true;
        if (options.isAparteman === false || !options.isAparteman) {
            this.isAparteman = false;
        } else {
            this.isAparteman = true;
        }
        // console.log(this.isAparteman, options.isAparteman)
        this.setCurrentStyle()
            // this.styleStatus.color = 'by entity'
    }

    changeLayer(layerName) {
        if (!layerName) return
        let newLayer = this.siLayer.siMap.layers.find(l => l.name === layerName)
        if (!newLayer) return
        this.siLayer.source.removeFeature(this);
        newLayer.source.addFeature(this)
            // console.log(newLayer.name)
        this.siLayer = newLayer
    }
    getCoordinates() {
        return this.getGeometry().getCoordinates()
    }
    setCurrentStyle(opacity) {
        this.setStyle(this.getEntityStyle(opacity))
    }
    getEntityStyle(opacity) {
        // console.log(this.siLayer.colorIndex)
        if (this.isAparteman) {
            this.colorIndex = 2
        }
        if (!this.isAparteman) this.colorIndex = 6
        var color = asArray(getCadColor(this.colorIndex)).slice()
        color[3] = opacity
        var textColor = asArray('rgba(255,255,255,1)')
            // textColor[3] = opacity
            // console.log(this.colorIndex)
        const styleFunction = (feature, reso) => {
            // console.log(this.colorIndex, 'color index')
            let offset = 0.015 / reso * 10
            let textSize = 0.015 / reso * 10
            let len = this.getLength()
            let textSizeModel = textSize * reso
            if (len < textSizeModel * 10) {
                offset *= len / (textSizeModel * 10)
                textSize *= len / (textSizeModel * 10)
            }
            let style;
            switch (this.labelType) {
                case saLineLabelType.onLine:
                    style = [
                        new Style({
                            stroke: new Stroke({
                                color: color,
                                lineDash: this.styleProperties.lineDash,
                                width: this.styleProperties.lineWidth,
                            }),
                            text: new Text({
                                font: 'Bold 16px "wcs_bNazanin"',
                                placement: 'line',
                                fill: new Fill({
                                    color: textColor,
                                }),
                                text: this.saLineType.name
                            }),
                            zIndex: 1
                        }),
                    ]
                    break;
                case saLineLabelType.onSide:
                    style = [
                        new Style({
                            stroke: new Stroke({
                                color: color,
                                lineDash: this.styleProperties.lineDash,
                                width: this.styleProperties.lineWidth,
                            }),
                        }),
                        new Style({
                            text: createTextStyle(this.saLineType.front, reso, {
                                offsetX: 0,
                                offsetY: -offset,
                                size: textSize,
                                fillColor: textColor,
                                // maxResolution: 0.01,
                                placement: 'point',
                                rotation: -this.getAngle() * Math.PI / 180 + Math.PI,
                                type: 'normal'

                            }),
                            zIndex: 1
                        }),
                        new Style({
                            text: createTextStyle(this.saLineType.back, reso, {
                                offsetX: 0,
                                offsetY: offset,
                                size: textSize,
                                // maxResolution: 0.01,
                                fillColor: textColor,
                                placement: 'point',
                                rotation: -this.getAngle() * Math.PI / 180 + Math.PI,
                                type: 'normal'
                            }),
                            zIndex: 1
                        })
                    ]
                    break;
                case saLineLabelType.noLabel:
                    style = [
                        new Style({
                            stroke: new Stroke({
                                color: color,
                                lineDash: this.styleProperties.lineDash,
                                width: this.styleProperties.lineWidth,
                            }),
                        }),
                    ]
                    break;
                default:
                    break;
            }
            if (this.labelType === saLineLabelType.onLine) {

            }
            if (this.labelType === saLineLabelType.onSide) {

            }
            return style
        }
        return styleFunction
    }
    changeOpacity(value) {
        this.setCurrentStyle(value)
    }
    updateToSiMapStorage() {
        this.siLayer.siMap.storage.currentSaLineType = {
            saLineType: this.saLineType,
            labelType: this.labelType,
            isAparteman: this.isAparteman
        }

        // if()
    }
    updateFromSiMapStorage() {
        this.saLineType = this.siLayer.siMap.storage.currentSaLineType.saLineType
        this.labelType = this.siLayer.siMap.storage.currentSaLineType.labelType
        this.isAparteman = this.siLayer.siMap.storage.currentSaLineType.isAparteman
            // console.log(this.siLayer.siMap.storage.currentSaLineType.isAparteman)
        if (this.isAparteman) {
            this.changeLayer('3')
        }
        if (!this.isAparteman) {
            this.changeLayer('4')
        }
        if (this.rightPoly) {
            if (this.rightPoly.get('polyText').ghate) {
                this.rightPoly.get('linesType')[this.rightPolyIndex] = this.saLineType
                this.rightPoly.setLabel(this.rightPolyIndex, this.saLineType.name)
            }
        }
        if (this.leftPoly) {
            if (this.leftPoly.get('polyText').ghate) {
                this.leftPoly.get('linesType')[this.leftPolyIndex] = this.saLineType
                this.leftPoly.setLabel(this.leftPolyIndex, this.saLineType.name)
            }
        }
        this.setCurrentStyle()
    }
    select() {
        // console.log(this)
        if (this.selectable == false) return false
        if (!this.selected) {
            this.selected = true;
            this.siLayer.siMap.siCommand.execCommand('escape')
            let sidebar = this.siLayer.siMap.getSiControl('wcs_sidebar')
            if (sidebar) {
                this.siLayer.siMap.setWcsSideBarContent(wcs_sideBarContentsType.linelabeling)
                sidebar.reShape()
                sidebar.element.getElementsByClassName('wcs_panel_content')[0].innerHTML = LineLabeling(this.siLayer.siMap, this)
            }
            this.siLayer.siMap.siSelect.selectionSet_.push(this)
                // this.setModifyPoint()
            this.setSelectStyle()
            lineLabelingEventsHandler(this.siLayer.siMap, sidebar.element.getElementsByClassName('wcs_panel_content')[0], this)
            return true
        }
    }
    boxSelect(boxSelecting, shouldRunModifyPoint) {
        if (this.selectable == false) return false
        if (!this.selected) {
            this.selected = true;
            // if(sho)
            this.setSelectStyle()
            this.siLayer.siMap.siSelect.selectionSet_.push(this)
            return true
        }
    }
    setSelectStyle() {
        this.setStyle([
            new Style({
                stroke: new Stroke({
                    color: 'rgba(0,0,255,1)',
                    width: 3,
                    lineDash: [5, 0, 5]
                }),
            }),
            new Style({
                stroke: new Stroke({
                    color: 'rgba(255,255,255,1)',
                    width: 1,
                    lineDash: [5, 0, 5]
                }),
            })
        ])
    }
}
export const getFontSizeFromReso = (reso) => {
    let s = 0
    s = 0.015 / reso * 5
        // if (reso < 0.005) s = 20
        // else if (reso < 0.01) s = 15
        // else if (reso < 0.02) s = 10
        // else if (reso < 0.04) s = 5
        // else if (reso < 0.08) s = 2
    return s
}

export const getSaLineType = (lineweight, lineType) => {
    let payload = saLineTypeList.find(saLineType => (saLineType.Linetype === lineType && parseFloat(saLineType.Lineweight) === parseFloat(lineweight)))
    return payload
}

export const saLineLabelType = {
    onLine: "onLine",
    onSide: "onSide",
    noLabel: 'noLabel'
}