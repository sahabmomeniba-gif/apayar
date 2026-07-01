import { Feature } from "ol";
import Point from "ol/geom/Point";
import { EntityType, ModifyType } from "./Entity";
import Entity from "./Entity"

export default class SiPoint extends Entity {
    constructor(x, y, options) {
        super(options)
        this.coordinates = [x, y]
            // console.log(this.coordinates)
        let geometry = new Point(this.coordinates)
        this.entityType = EntityType.node
        this.setGeometry(geometry)
        this.setCurrentStyle()
        this.siLayer.addEntity(this);
    }
    setModifyPoint() {
        this.modifyFeature.forEach(feature => {
            this.siLayer.siMap.modify.removeFeature(feature)
        })
        this.modifyFeature = []
        this.coordinates = this.getGeometry().getCoordinates()
        let feature = new Feature({
            geometry: new Point(this.coordinates),
            modifyType: ModifyType.translatePoint,
            targetFeature: this
        })
        feature.setStyle(this.getModifyStyle(ModifyType.endPoint, 0))
        this.modifyFeature.push(feature)
        this.siLayer.siMap.modify.addFeature(feature);
    }
}