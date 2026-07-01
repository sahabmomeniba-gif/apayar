import { Feature } from "ol";
import Entity from "./Entity"
import Circle from "ol/geom/Circle";
import Point from "ol/geom/Point";
import getVertex from "../helpers/GetVertex";
import  { EntityType, ModifyType } from "./Entity";
export default class SiCircle extends Entity {
    constructor(center,radius,options) {
        super(options)
        this.center = center
        this.radius = radius
        let geometry  = new Circle(this.center,this.radius)
        this.entityType = EntityType.circle
        this.setGeometry(geometry)
        this.setCurrentStyle()
        this.siLayer.addEntity(this);
    }
    getData(){
        return {
            N:this.name,
            T:this.entityType,
            ST:this.styleStatus,
            C:this.colorIndex,
            T:this.text ? this.text : null,
            G:{
                RADIUS:this.getGeometry().getRadius(),
                CENTER:this.getGeometry().getCenter()
            }
            
        }
    }
    setModifyPoint(){
        this.modifyFeature.forEach(feature=>{
            this.siLayer.siMap.modify.removeFeature(feature)
        })
        this.modifyFeature = []
        this.radius = this.getGeometry().getRadius()
        this.center = this.getGeometry().getCenter()
        let vertexs = getVertex(this)
        let centerfeature = new Feature({
                geometry: new Point(vertexs.center),
                modifyType:ModifyType.translatePoint
                ,targetFeature:this
            })
            centerfeature.setStyle(this.getModifyStyle(ModifyType.endPoint,0))
            this.modifyFeature.push(centerfeature)
            this.siLayer.siMap.modify.addFeature(centerfeature);
        vertexs.vertexs.forEach(vertex => {
            let feature  = new Feature({
                geometry: new Point(vertex),
                modifyType:ModifyType.scalePoint
                ,targetFeature:this
            })
            feature.setStyle(this.getModifyStyle(ModifyType.endPoint,0))
            this.modifyFeature.push(feature)
            this.siLayer.siMap.modify.addFeature(feature);
        });
     }
     getArea(){
        return (Math.PI*(this.getGeometry().getRadius()*this.getGeometry().getRadius()))
     }
}
