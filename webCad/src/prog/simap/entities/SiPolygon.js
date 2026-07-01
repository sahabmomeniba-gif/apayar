import { Feature } from "ol";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import Polygon from "ol/geom/Polygon";
import getVertex from "../helpers/GetVertex";
import  { EntityType, ModifyType } from "./Entity";
import Entity from "./Entity"
export default class SiPolygon extends Entity {
    constructor(rings,options) {
        super(options)
        this.coordinates = rings
        let geometry  = new Polygon(this.coordinates)
        this.entityType = EntityType.polygon
        this.setGeometry(geometry)
        this.setCurrentStyle()
        this.siLayer.addEntity(this);
    }
    setModifyPoint(){
        this.modifyFeature.forEach(feature=>{
            this.siLayer.siMap.modify.removeFeature(feature)
        })
        this.modifyFeature = []
        this.coordinates = this.getGeometry().getCoordinates()[0]    
        for (let index = 0; index < this.coordinates.length-1; index++) {
            let segmentLine,segmentCoord;
            segmentCoord = [this.coordinates[index],this.coordinates[index+1]]
            segmentLine = new Feature({
                     geometry:new LineString(segmentCoord)
                 })           
            let vertex =  getVertex(segmentLine);
            let feature = new Feature({
                        geometry: new Point(vertex.vertexs[0]),
                        modifyType:ModifyType.endPoint,
                        targetFeature:this
                    })
            feature.setStyle(this.getModifyStyle(ModifyType.endPoint,0))
            this.modifyFeature.push(feature)
            this.siLayer.siMap.modify.addFeature(feature);
            let centerFeature = new Feature({
                    geometry: new Point(vertex.center),
                    modifyType:ModifyType.midPoint,
                    targetFeature:this,
                    startIndex:index,
                    endIndex:index+1
                })
            centerFeature.setStyle(this.getModifyStyle(ModifyType.midPoint,
            Math.atan2(segmentCoord[1][1]-segmentCoord[0][1],segmentCoord[1][0]-segmentCoord[0][0])))
            this.modifyFeature.push(centerFeature)
            this.siLayer.siMap.modify.addFeature(centerFeature);
    }
}
}
