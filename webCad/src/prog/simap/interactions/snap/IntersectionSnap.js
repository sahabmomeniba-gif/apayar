import { Feature } from "ol";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import { RegularShape, Stroke, Style } from "ol/style";
import CustomSnaps from "./CustomSnaps";
import { snapTypeName } from "./SnapTypes";
import { GetIntersectPoint } from "../../helpers/GetIntersect";
export default class IntersectionSnap extends CustomSnaps {

    constructor(siSnap) {
        super({
            edge: false,
            vertex: true,
            source: new VectorSource,
            pixelTolerance: siSnap.tolerance
        }, siSnap.siMap);
        // this.siMap = siSnap.siMap
        this.name = snapTypeName.intersection
        this.snapActive = true;
        this.styleFeature = undefined;
        this.allFeatureSource = new VectorSource;
        this.onEntityAdd = true;
        this.styleFeature = new Feature({});
        let style = new Style({
            image: new RegularShape({
                // fill: new Fill({
                //     color: 'rgba(0, 255, 157,1)' 
                // }),
                stroke: new Stroke({
                    color: 'rgba(0, 255, 157,1)',
                }),
                points: 4,
                radius: 15,
                radius2: 0,
                angle: Math.PI / 4,
            }),
        });
        this.styleFeature.setStyle(style);
    }
    addSnapFeature(feature) {
        // console.log(feature)
        let vertexs = feature.getVertex();
        var points = vertexs.intersectPoints;
        points.forEach(point => {
            this.source_.addFeature(point)
        });
    }
    removeSnapFeature(feature) {
        // console.log(this.sourceCollection)
        this.sourceCollection.getArray().forEach(source => {
            if (source.entity === feature) {
                // console.log(source)
                let points = source.points;
                points.forEach(point => {
                    this.source_.removeFeature(point)
                });
                this.sourceCollection.remove(source)
            }
        })
    }
    onSnapped(result) {
        // console.log(result)
        if (result ? result.vertex : undefined) {
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