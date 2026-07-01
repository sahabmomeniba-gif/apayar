import { Feature } from "ol";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";

import getVertex from "../helpers/GetVertex";
import { EntityType, ModifyType } from "./Entity";
import Entity from "./Entity"
import calculateCenter from '../helpers/CalculateCenter'
import Style from "ol/style/Style";
import { Fill, Stroke, Text } from "ol/style";
import { Geometry, MultiLineString, Polygon } from "ol/geom";
export default class SiMultiLine extends Entity {
    constructor(coordinates, options) {
        super(options)
        this.coordinates = coordinates
            // console.log(this.coordinates)
        let geometry = new MultiLineString(this.coordinates)
        this.entityType = EntityType.multiLine
        this.setGeometry(geometry);
        this.setCurrentStyle();
        this.siLayer.addEntity(this);
        // this.setLabel()
        // console.log(options.scale)
        // this.scale = options.scale ? options.scale : new Array(this.getGeometry().getCoordinates().length).fill(this.siLayer.siMap.mapScale);
        this.scale = options.scale
        this.metadataId = options.metadataId
        this.label = options.label
        this.metadata = {
            id: 2
        }
    }
    removeLabel() {
        this.siLayer.source.removeFeature(this.frontLabel)
        this.siLayer.source.removeFeature(this.backLabel)
    }
    setSelectStyle() {
        this.setStyle([
            new Style({
                stroke: new Stroke({
                    color: 'rgba(0,0,255,1)',
                    width: 5
                }),
            }),
            new Style({
                stroke: new Stroke({
                    color: 'rgba(255,255,255,1)',
                    width: 1
                }),
            }),
        ])
    }
    getEntityStyle() {
        const styleFunction = (feature, reso) => {
            return (
                [
                    new Style({
                        stroke: new Stroke({
                            color: 'rgba(255,255,255,1)',
                            width: 1
                        }),
                    }),
                    new Style({
                        text: new Text({
                            font: 'Bold 16px "wcs_bNazanin"',
                            placement: 'line',
                            fill: new Fill({
                                color: 'rgba(255,255,255,1)',
                            }),
                            text: this.label
                        })
                    })
                ])
        }
        return styleFunction
    }
    select() {
        // console.log(this)
        if (this.selectable == false) return false
        if (!this.selected) {
            this.selected = true;
            this.siLayer.siMap.siCommand.execCommand('escape')
            this.siLayer.siMap.siSelect.selectionSet_.push(this)
            this.setModifyPoint()
            this.setSelectStyle()
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
    setModifyPoint() {
            // this.modifyFeature.forEach(feature => {
            //     this.siLayer.siMap.modify.removeFeature(feature)
            // })
            // this.modifyFeature = []

            // let vertex = getVertex(this);
            // vertex.vertexs.forEach(vertex => {
            //     let feature = new Feature({
            //         geometry: new Point(vertex),
            //         modifyType: ModifyType.endPoint,
            //         targetFeature: this,

            //     })
            //     feature.setStyle(this.getModifyStyle(ModifyType.endPoint, 0))
            //     this.siLayer.siMap.modify.addFeature(feature);
            //     this.modifyFeature.push(feature)
            // });
            // let centerFeature = new Feature({
            //     geometry: new Point(vertex.center),
            //     modifyType: ModifyType.translatePoint,
            //     targetFeature: this
            // })
            // centerFeature.setStyle(this.getModifyStyle(ModifyType.endPoint,
            //     Math.atan2(this.coordinates[1][1] - this.coordinates[0][1], this.coordinates[1][0] - this.coordinates[0][0])))
            // this.siLayer.siMap.modify.addFeature(centerFeature);
            // this.modifyFeature.push(centerFeature)
        }
        // getAngle() {
        //     let coordinates = this.getGeometry().getCoordinates();
        //     return Math.atan2((coordinates[1][1] - coordinates[0][1]), (coordinates[1][0] - coordinates[0][0])) * (180 / Math.PI)
        // }
        // getLength() {
        //     let coordinates = this.getGeometry().getCoordinates();
        //     return Math.hypot((coordinates[1][1] - coordinates[0][1]), (coordinates[1][0] - coordinates[0][0]))
        // }
        // getCenter() {
        //     return calculateCenter(this).center
        // }
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