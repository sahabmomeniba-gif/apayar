import { Feature } from "ol";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import { Stroke, Style } from "ol/style";
import CustomSnaps from "./CustomSnaps";
import { snapTypeName } from "./SnapTypes";
import getVertex from "../../helpers/GetVertex";
import CircleStyle from "ol/style/Circle";
import MultiPoint from "ol/geom/MultiPoint";
import { EntityType } from "../../entities/Entity";

export default class MidPointSnap extends CustomSnaps {

    constructor(siSnap) {
        super({
            edge: false,
            vertex: true,
            source: new VectorSource,
            pixelTolerance: siSnap.tolerance
        }, siSnap.siMap);
        // this.siMap = siSnap.siMap
        this.name = snapTypeName.midPoint
        this.snapActive = false;
        this.styleFeature = undefined;
        this.onEntityAdd = true;
        this.styleFeature = new Feature({});
        let style = new Style({
            image: new CircleStyle({
                // fill: new Fill({
                //     color: 'rgba(0, 255, 157,1)' 
                // }),
                stroke: new Stroke({
                    color: 'rgba(0, 255, 157,1)',
                }),
                radius: 7,

            })
        });
        this.styleFeature.setStyle(style);
    }
    addSnapFeature(feature) {
        let vertexs = feature.getVertex();
        switch (feature.entityType) {
            case EntityType.line:
            case EntityType.polygon:

                var points = vertexs.midPoints;
                // console.log("🚀 ~ file: MidPointSnap.js ~ line 33 ~ MidPointSnap ~ addSnapFeature ~ points", points)
                points.forEach(point => {
                    this.source_.addFeature(point)
                });

                break;
            case EntityType.circle:
                var points = vertexs.centerPoints;
                // console.log("🚀 ~ file: MidPointSnap.js ~ line 41 ~ MidPointSnap ~ addSnapFeature ~ points", points)
                points.forEach(point => {
                    this.source_.addFeature(point)
                });
                break;
            default:
                return
        }
    }
    removeSnapFeature(feature) {
        // console.log(this.sourceCollection)
        this.sourceCollection.getArray().forEach(source => {
            // console.log(feature)
            if (source.entity === feature) {
                let points = source.points;
                // console.log("🚀 ~ file: MidPointSnap.js ~ line 56 ~ MidPointSnap ~ this.sourceCollection.getArray ~ points", points)
                // console.log(points)
                points.forEach(point => {
                    this.source_.removeFeature(point)
                });
                this.sourceCollection.remove(source)
            }
        })
    }

    onSnapped(result) {
        if (result ? result.vertex : undefined) {
            // console.log('snapeed')
            // console.log(this.styleFeature)
            // console.log(result.vertex)
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