import { Feature } from "ol";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import { Fill, RegularShape, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import Entity, { EntityType } from "../../entities/Entity";
import { multipleExist } from "../../helpers/MultiParamsArrayCheck";
import CustomSnaps from "./CustomSnaps";
import { snapTypeName } from "./SnapTypes";


export default class NodeSnap extends CustomSnaps {

    constructor(siSnap) {
        super({
            edge: true,
            vertex: true,
            source: new VectorSource,
            pixelTolerance: siSnap.tolerance + 10
        }, siSnap.siMap);
        // this.siMap = siSnap.siMap
        this.name = snapTypeName.node
        this.snapActive = true;
        this.styleFeature = undefined;
        this.onEntityAdd = true;
        this.styleFeature = new Feature({});
        let style = [
            new Style({
                image: new CircleStyle({
                    fill: new Fill({
                        color: '#00ff99ff',
                    }),
                    radius: 5,

                })
            }),
        ]
        this.styleFeature.setStyle(style);
    }

    addSnapFeature(feature) {
        let vertexs = feature.getVertex();
        // console.log(vertexs)
        var points = vertexs.nodePoint;
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