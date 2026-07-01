import Point from "ol/geom/Point";
import { Feature } from "ol";
import VectorSource from "ol/source/Vector";
import { Fill, RegularShape, Stroke, Style } from "ol/style";
import CustomSnaps from "./CustomSnaps";
import { snapTypeName, snapTypes } from "./SnapTypes";
import { EntityType } from "../../entities/Entity";
import { getExtendPointsToExtent } from "../../helpers/GetExtendPoint";
import { isEqualPoint } from "../../helpers/equalPoint";
import LineString from "ol/geom/LineString";

export default class PolarTracking extends CustomSnaps {

    constructor(siSnap) {
        super({
            edge: true,
            vertex: true,
            source: new VectorSource,
            pixelTolerance: siSnap.tolerance
        }, siSnap.siMap);
        // this.siMap = siSnap.siMap
        this.name = snapTypeName.polarTracking
        this.snapActive = false;
        this.styleFeature = undefined;
        this.onEntityAdd = false;
        this.type = snapTypes.polar
        this.angle = polarAngels[90]
        this.relativeMode = true
        this.currentOrigin = [0, 0]
        this.styleFeature = new Feature({
            // geometry: new Point(result.vertex)
        });
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
        let Lstyle = new Style({
            stroke: new Stroke({
                color: 'rgba(0, 255, 157,1)',
                lineDash: [5, 0, 5],
                width: 2
            })
        });
        this.lineStyleFeature = new Feature({
            // geometry:new LineString([this.currentOrigin,result.vertex])
        })
        this.lineStyleFeature.setStyle(Lstyle)
            // console.log(this.angle)
    }
    addSnapFeature(feature, origin) {
        // console.log(this.currentFeature)
        // console.log('ok e?')
        if (origin) this.currentOrigin = origin
        let source = new VectorSource
        if (feature) {
            if (feature.entityType != EntityType.line) return
            let coordinates = feature.getGeometry().getCoordinates()
            this.currentOrigin = coordinates[1]
            this.currentFeature = feature
            this.angle.forEach(angle => {
                let clone = feature.getGeometry().clone();
                clone.rotate(angle * Math.PI / 180, coordinates[1]);
                let rFeature = new Feature({ geometry: clone })
                let lines = getExtendPointsToExtent(this.siMap.getViewExtent(), rFeature, this.siMap).lines

                if (this.relativeMode) {
                    if (lines[0]) source.addFeature(lines[0])
                    if (lines[1]) source.addFeature(lines[1])
                        // console.log('add shode')
                    source.addFeature(rFeature)
                }
            });
        }
        this.angle.forEach(angle => {
            let endPoint = [this.currentOrigin[0] + 0.0001 * Math.cos(angle * Math.PI / 180), this.currentOrigin[1] + 0.0001 * Math.sin(angle * Math.PI / 180)]
                // console.log(this.currentOrigin)
                // console.log(endPoint)
            let rFeature = new Feature({ geometry: new LineString([this.currentOrigin, endPoint]) })
            let lines = getExtendPointsToExtent(this.siMap.getViewExtent(), rFeature, this.siMap).lines
            if (lines[0]) source.addFeature(lines[0])
            if (lines[1]) source.addFeature(lines[1])
            source.addFeature(rFeature)
        });
        this.source_ = source

        // console.log(this)
    }
    removeSnapFeature() {
        // console.log(feature)
        this.currentFeature = undefined;
        // this.currentOrigin = undefined;
        this.siMap.map.removeInteraction(this);
        this.source_ = new VectorSource;
        this.siMap.map.addInteraction(this);
        this.siMap.map.removeInteraction(this);
    }

    onSnapped(result) {
        // console.log(result)
        if (result ? result.vertex : undefined) {
            this.styleFeature.setGeometry(new Point(result.vertex));
            if (!this.siMap.modify.hasFeature(this.styleFeature)) this.siMap.modify.addFeature(this.styleFeature)
            if (this.currentOrigin) {
                this.lineStyleFeature.setGeometry(new LineString([this.currentOrigin, result.vertex]))
                if (!this.siMap.modify.hasFeature(this.lineStyleFeature)) this.siMap.modify.addFeature(this.lineStyleFeature)
            }
        } else {
            this.removeSnapsStyles()
        }

    }
}

export const polarAngels = {
    90: [0, 90, 180, 270],
    45: [0, 45, 90, 135, 180, 225, 270, 315],
    30: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 310, 330]
}