import Point from "ol/geom/Point";
import { Feature } from "ol";
import VectorSource from "ol/source/Vector";
import { Fill, RegularShape, Stroke, Style } from "ol/style";
import CustomSnaps from "./CustomSnaps";
import { snapTypeName } from "./SnapTypes";
import { EntityType } from "../../entities/Entity";

export default class NearestSnap extends CustomSnaps {

    constructor(siSnap) {
        super({
            edge: true,
            vertex: true,
            source: new VectorSource,
            pixelTolerance: siSnap.tolerance
        }, siSnap.siMap);
        // this.siMap = siSnap.siMap
        this.name = snapTypeName.nearest
        this.snapActive = false;
        this.styleFeature = undefined;
        this.onEntityAdd = true;
        this.styleFeature = new Feature({});
        let style = new Style({
            image: new RegularShape({
                fill: new Fill({
                    color: 'rgba(0, 255, 157,1)'
                }),
                stroke: new Stroke({
                    color: 'rgba(0, 255, 157,1)',
                }),
                points: 4,
                radius: 7,
                angle: Math.PI / 4,
                rotation: 0
            })
        });
        this.styleFeature.setStyle(style);
    }
    addSnapFeature(feature) {
        this.source_.addFeature(feature)
            // console.log(this)
    }
    removeSnapFeature(feature) {
        this.source_.removeFeature(feature)
    }
    onSnapped(result) {
        if (result ? result.vertex : undefined) {
            if (!this.siMap.modify.hasFeature(this.styleFeature)) this.siMap.modify.addFeature(this.styleFeature)
            this.styleFeature.setGeometry(new Point(result.vertex));
        } else {
            if (this.styleFeature) {
                this.siMap.modify.removeFeature(this.styleFeature);
                this.styleFeature.setGeometry(undefined)
            }
        }

    }
}