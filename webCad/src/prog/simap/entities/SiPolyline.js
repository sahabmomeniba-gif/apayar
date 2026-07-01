import { Feature } from "ol";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import getVertex from "../helpers/GetVertex";
import { EntityType, ModifyType } from "./Entity";
import Entity from "./Entity"

export default class SiPolyLine extends Entity {
    constructor(coordinates, options) {
        super(options)
            // this.coordinates = coordinates
        this.modifyFeature = []
        let geometry = new LineString(coordinates)
        this.entityType = EntityType.line
        this.setGeometry(geometry)
        this.setCurrentStyle()
        this.siLayer.addEntity(this);
        // this.scale = options.scale ? options.scale : new Array(this.getGeometry().getCoordinates().length).fill(this.siLayer.siMap.mapScale);
        this.scale = options.scale
        this.metadataId = options.metadataId
        this.metadata = options.metadata
    }
    setModifyPoint() {
        this.modifyFeature.forEach(feature => {
                this.siLayer.siMap.modify.removeFeature(feature)
            })
            // let points = this.getExtendPoints();
            // points.forEach(feature=>{
            //     if(feature) {
            //         feature.setStyle(this.getModifyStyle(ModifyType.translatePoint,0))
            //         this.modifyFeature.push(feature)
            //         this.siLayer.siMap.modify.addFeature(feature);
            //     }
            // })
            // this.setVertexs()
            // // console.log(,'segmented') 
            // this.createSegments()
            // let intersects = this.vertexts.intersectPoints
            // // console.log(this.vertexts)
            // intersects.forEach(feature=>{

        //     feature.setStyle(this.getModifyStyle(ModifyType.rotatePoint,0))
        //     this.modifyFeature.push(feature)
        //     this.siLayer.siMap.modify.addFeature(feature);
        // })
        this.coordinates = this.getGeometry().getCoordinates()
        for (let index = 0; index < this.coordinates.length; index++) {
            let segmentLine, segmentCoord;
            if (index != this.coordinates.length - 1) {

                segmentCoord = [this.coordinates[index], this.coordinates[index + 1]]
                segmentLine = new Feature({
                    geometry: new LineString(segmentCoord)
                })
            } else {
                break
            }
            let vertex = getVertex(segmentLine);
            vertex.vertexs.forEach(vertex => {
                let feature = new Feature({
                    geometry: new Point(vertex),
                    modifyType: ModifyType.endPoint,
                    targetFeature: this,

                })
                feature.setStyle(this.getModifyStyle(ModifyType.endPoint, 0))
                this.modifyFeature.push(feature)
                this.siLayer.siMap.modify.addFeature(feature);
            });
            let centerFeature = new Feature({
                geometry: new Point(vertex.center),
                modifyType: ModifyType.midPoint,
                targetFeature: this,
                startIndex: index,
                endIndex: index + 1
            })
            centerFeature.setStyle(this.getModifyStyle(ModifyType.midPoint,
                Math.atan2(segmentCoord[1][1] - segmentCoord[0][1], segmentCoord[1][0] - segmentCoord[0][0])))
            this.modifyFeature.push(centerFeature)
            this.siLayer.siMap.modify.addFeature(centerFeature);
        }

    }
}