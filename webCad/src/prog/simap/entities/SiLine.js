import { Feature } from "ol";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";

import getVertex from "../helpers/GetVertex";
import { EntityType, ModifyType } from "./Entity";
import Entity from "./Entity"
import calculateCenter from '../helpers/CalculateCenter'
import Style from "ol/style/Style";
import { Fill, Stroke, Text } from "ol/style";
import { Geometry, Polygon } from "ol/geom";
export default class SiLine extends Entity {
    constructor(x, y, options) {
        super(options)
        this.coordinates = [x, y]
            // console.log(this.coordinates)
        let geometry = new LineString(this.coordinates)
        this.entityType = EntityType.line
        this.setGeometry(geometry);
        this.setCurrentStyle();
        this.siLayer.addEntity(this);
        // this.setLabel()
        // console.log(options.scale)
        // this.scale = options.scale ? options.scale : new Array(this.getGeometry().getCoordinates().length).fill(this.siLayer.siMap.mapScale);
        this.scale = options.scale
        this.metadataId = options.metadataId
        this.metadata = options.metadata
    }
    removeLabel() {
        this.siLayer.source.removeFeature(this.frontLabel)
        this.siLayer.source.removeFeature(this.backLabel)
    }
    setModifyPoint() {
        this.modifyFeature.forEach(feature => {
            this.siLayer.siMap.modify.removeFeature(feature)
        })
        this.modifyFeature = []

        let vertex = getVertex(this);
        vertex.vertexs.forEach(vertex => {
            let feature = new Feature({
                geometry: new Point(vertex),
                modifyType: ModifyType.endPoint,
                targetFeature: this,

            })
            feature.setStyle(this.getModifyStyle(ModifyType.endPoint, 0))
            this.siLayer.siMap.modify.addFeature(feature);
            this.modifyFeature.push(feature)
        });
        let centerFeature = new Feature({
            geometry: new Point(vertex.center),
            modifyType: ModifyType.translatePoint,
            targetFeature: this
        })
        centerFeature.setStyle(this.getModifyStyle(ModifyType.endPoint,
            Math.atan2(this.coordinates[1][1] - this.coordinates[0][1], this.coordinates[1][0] - this.coordinates[0][0])))
        this.siLayer.siMap.modify.addFeature(centerFeature);
        this.modifyFeature.push(centerFeature)
    }
    getAngle() {
        let coordinates = this.getGeometry().getCoordinates();
        return Math.atan2((coordinates[1][1] - coordinates[0][1]), (coordinates[1][0] - coordinates[0][0])) * (180 / Math.PI)
    }
    getLength() {
        let coordinates = this.getGeometry().getCoordinates();
        return Math.hypot((coordinates[1][1] - coordinates[0][1]), (coordinates[1][0] - coordinates[0][0]))
    }
    getCenter() {
        return calculateCenter(this).center
    }
    createObjectPropetiesElement() {
        let str = ''
        for (const key in this.metadata) {
            str += `
                <div class="wcs_panel_item wcs_object wcs_object_cadastralPoint">
                    <div class="wcs_panel_item_title"><label>${key}</label></div>
                    <div class="wcs_panel_input_container"><input disabled="disabled" class="wcs_panel_input wcs_object_cadastralPoint_${key}" value=${this.metadata[key]}></input></div>
                </div>
            `
        }
        return str
    }
}
const calculateLineLablePosition = (feature, offset) => {
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