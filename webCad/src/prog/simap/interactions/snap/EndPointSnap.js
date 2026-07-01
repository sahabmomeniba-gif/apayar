import { Feature } from "ol";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import { RegularShape, Stroke, Style } from "ol/style";
import Entity, { EntityType } from "../../entities/Entity";
import { multipleExist } from "../../helpers/MultiParamsArrayCheck";
import CustomSnaps from "./CustomSnaps";
import { snapTypeName } from "./SnapTypes";


export default class EndPointSnap extends CustomSnaps {

    constructor(siSnap) {
        super({
            edge: true,
            vertex: true,
            source: new VectorSource,
            pixelTolerance: siSnap.tolerance
        }, siSnap.siMap);
        // this.siMap = siSnap.siMap
        this.name = snapTypeName.endpoint
        this.snapActive = true;
        this.styleFeature = undefined;
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
                radius: 10,
                angle: Math.PI / 4,
                rotation: 0
            })
        });
        this.styleFeature.setStyle(style);
    }

    addSnapFeature(feature) {
        if (feature.entityType === EntityType.circle) return
        let vertexs = feature.getVertex();
        var points = vertexs.endPoints;
        points.forEach(point => {
            this.source_.addFeature(point)
        });
    }
    removeSnapFeature(feature) {
        this.sourceCollection.getArray().forEach(source => {
            if (source.entity === feature) {
                // console.log(source)
                let points = source.points;
                if (!points) return
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