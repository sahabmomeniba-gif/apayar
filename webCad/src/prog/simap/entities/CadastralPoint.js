import { Feature } from "ol";
import Point from "ol/geom/Point";
import { EntityType, ModifyType } from "./Entity";
import Entity from "./Entity"
import { Fill, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";

export default class CadastalPoint extends Entity {
    constructor(x, y, options) {
        super(options)
        this.coordinates = [x, y]
            // console.log(this.coordinates)
        let geometry = new Point(this.coordinates)
        this.entityType = EntityType.cadastralPoint
        this.setGeometry(geometry)
        this.setCurrentStyle()
        this.siLayer.addEntity(this);
        this.metadata = options.metadata ? options.metadata : {}
    }
    setModifyPoint() {
        return
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
        // createObjectPropetiesEvents(container) {

    // }
}