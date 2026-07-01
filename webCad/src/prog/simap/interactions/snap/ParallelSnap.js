import Point from "ol/geom/Point";
import { Collection, Feature, MapBrowserEvent } from "ol";
import VectorSource from "ol/source/Vector";
import { Fill, RegularShape, Stroke, Style } from "ol/style";
import CustomSnaps from "./CustomSnaps";
import { snapTypeName, snapTypes } from "./SnapTypes";
import { EntityType } from "../../entities/Entity";
import { getExtendPointsToExtent } from "../../helpers/GetExtendPoint";
import { isEqualPoint } from "../../helpers/equalPoint";
import LineString from "ol/geom/LineString";
import { Select } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import { feature } from "@turf/turf";
import calculateCenter from "../../helpers/CalculateCenter";

export default class ParallelSnap extends CustomSnaps {

    constructor(siSnap) {
        super({
            edge: true,
            vertex: true,
            source: new VectorSource,
            pixelTolerance: 3,
        }, siSnap.siMap);
        // this.siMap = siSnap.siMap
        this.name = snapTypeName.parallel
        this.snapActive = true;
        this.styleFeature = undefined;
        this.onEntityAdd = false;
        this.type = snapTypes.snap
        this.parallelEntities = new VectorSource
        this.currentOrigin = undefined;
        this.prvsLine = undefined;
        this.markerCollection = new Collection
        let Lstyle = new Style({
            stroke: new Stroke({
                color: 'rgba(0, 255, 157,1)',
                lineDash: [5, 0, 5],
                width: 2
            })
        });
        this.crossStyle = new Style({
            image: new RegularShape({
                fill: new Fill({
                    color: 'rgba(0, 255, 157,1)',
                }),
                stroke: new Stroke({
                    color: 'rgba(0, 255, 157,1)',
                    width: 1
                }),
                points: 4,
                radius: 7,
                radius2: 0,
                angle: 0,
            }),
        })
        this.parallelStyle = [
            new Style({
                image: new RegularShape({
                    fill: new Fill({
                        color: 'rgba(0, 255, 157,1)',
                    }),
                    stroke: new Stroke({
                        color: 'rgba(0, 255, 157,1)',
                        width: 1
                    }),
                    points: 2,
                    radius: 10,
                    radius2: 0,
                    angle: 0,
                    displacement: [-5, 0]
                }),
            }),
            new Style({
                image: new RegularShape({
                    fill: new Fill({
                        color: 'rgba(0, 255, 157,1)',
                    }),
                    stroke: new Stroke({
                        color: 'rgba(0, 255, 157,1)',
                        width: 1
                    }),
                    points: 2,
                    radius: 10,
                    radius2: 0,
                    angle: 0,
                    displacement: [5, 0]
                }),
            }),
        ]
        this.siMap.map.on('pointermove', mbe => {
            if (!this.siMap.siSnap.active || !this.snapActive) return
                // console.log((mbe.originalEvent.shiftKey || mbe.originalEvent.ctrlKey))
            if (!(mbe.originalEvent.shiftKey || mbe.originalEvent.ctrlKey)) return
            let siMap = this.siMap
            let features = siMap.map.getFeaturesAtPixel(mbe.pixel, { hitTolerance: 10 }).filter(entity => entity.entityType === EntityType.line)
            if (mbe.originalEvent.shiftKey && !mbe.originalEvent.ctrlKey) {
                if (features.length === 1 && features[0].getGeometry().getCoordinates().length === 2) {
                    if (features[0] != this.prvsLine) {
                        // console.log(this.parallelEntities.hasFeature(features[0]))
                        if (!this.parallelEntities.hasFeature(features[0])) {
                            let crossFeature = new Feature({ geometry: new Point(calculateCenter(features[0]).center) })
                            this.siMap.modify.addFeature(crossFeature)
                            crossFeature.setStyle(this.crossStyle)
                            this.markerCollection.push(crossFeature)
                            this.addEntityToSource(features[0])
                        }
                    }
                }
            }
            if (mbe.originalEvent.ctrlKey && !mbe.originalEvent.shiftKey) {
                // console.log('first')
                if (features.length === 1) {
                    if (this.parallelEntities.hasFeature(features[0])) {
                        this.parallelEntities.removeFeature(features[0])
                            // console.log(this.parallelEntities)
                        this.siMap.modify.forEachFeature(feature => {
                            var coordinate = feature.getGeometry().getCoordinates()
                            var center = calculateCenter(features[0]).center
                            if (isEqualPoint(coordinate, center, 1000)) {
                                this.siMap.modify.removeFeature(feature)
                                this.markerCollection.remove(feature)
                            }
                        })
                    }
                }
            }
            if (mbe.originalEvent.ctrlKey && mbe.originalEvent.shiftKey) {
                this.parallelEntities = new VectorSource
                this.markerCollection.getArray().forEach(feature => {
                    this.siMap.modify.removeFeature(feature)
                    this.markerCollection.remove(feature)
                })
            }
            return
        })

        this.styleFeature = new Feature({
            // geometry: new Point(result.vertex)
        });

        // let parallelStyle = new Style({

        // })
        this.styleFeature.setStyle(this.crossStyle);
        this.lineStyleFeature = new Feature({
            // geometry:new LineString([this.currentOrigin,result.vertex])
        })
        this.lineStyleFeature.setStyle(Lstyle)
            // console.log(this.angle)
    }
    removeFromSource(entity) {
        this.parallelEntities.removeFeature(entity);
        let center = calculateCenter(entity).center;
        let marker = this.markerCollection.getArray().find(m => isEqualPoint(m.getGeometry().getCoordinates(), center, 10000))
        this.siMap.modify.removeFeature(marker)
        this.markerCollection.remove(marker)
    }
    setOrigin(point) {
        this.siMap.map.removeInteraction(this)
        this.currentOrigin = point;
        this.addSnapFeature();
        this.siMap.map.addInteraction(this);
    }
    reset() {
        this.parallelEntities = new VectorSource;
        this.source_ = new VectorSource;
        this.prvsLine = undefined;
        this.currentOrigin = undefined;
    }
    addEntityToSource(entity) {
        this.parallelEntities.addFeature(entity)
            // console.log(this.currentOrigin)
        if (!this.currentOrigin) return
        let coordinates = entity.getGeometry().getCoordinates();
        let p1 = coordinates[0]
        let p2 = coordinates[1]
        let angle = Math.atan2((p2[1] - p1[1]), (p2[0] - p1[0]))
        let endPoint = [this.currentOrigin[0] + 0.0001 * Math.cos(angle), this.currentOrigin[1] + 0.0001 * Math.sin(angle)]
        let rFeature = new Feature({ geometry: new LineString([this.currentOrigin, endPoint]) })
        let lines = getExtendPointsToExtent(this.siMap.getViewExtent(), rFeature, this.siMap).lines
        let ExtendedLine = new Feature({
            geometry: new LineString([lines[0].getGeometry().getCoordinates()[1], lines[1].getGeometry().getCoordinates()[1]])
        })
        ExtendedLine.setProperties({
            parallelEntity: entity
        })
        this.source_.addFeature(ExtendedLine)
        this.siMap.map.removeInteraction(this)
        this.siMap.map.addInteraction(this)
    }
    addSnapFeature() {
        if (!this.currentOrigin) {
            this.source_ = new VectorSource
            return
        }
        this.siMap.map.removeInteraction(this)
        let source = new VectorSource
        this.parallelEntities.forEachFeature(entity => {
            // console.log(entity)
            let coordinates = entity.getGeometry().getCoordinates();
            let p1 = coordinates[0]
            let p2 = coordinates[1]
            let angle = Math.atan2((p2[1] - p1[1]), (p2[0] - p1[0]))
            let endPoint = [this.currentOrigin[0] + 0.0001 * Math.cos(angle), this.currentOrigin[1] + 0.0001 * Math.sin(angle)]
            let rFeature = new Feature({ geometry: new LineString([this.currentOrigin, endPoint]) })
            let lines = getExtendPointsToExtent(this.siMap.getViewExtent(), rFeature, this.siMap).lines
            let ExtendedLine = new Feature({
                geometry: new LineString([lines[0].getGeometry().getCoordinates()[1], lines[1].getGeometry().getCoordinates()[1]])
            })
            ExtendedLine.setProperties({
                parallelEntity: entity
            })
            source.addFeature(ExtendedLine)
                // this.source_ = new VectorSource;
        });
        this.source_ = source
        this.siMap.map.addInteraction(this)
    }
    removeSnapFeature(feature) {

        // this.markerCollection = new Collection
        // this.selectLineSource.removeFeature(feature)
    }
    removeParallel() {
        this.source_ = new VectorSource
        this.siMap.map.removeInteraction(this)
        this.siMap.map.addInteraction(this)
            // this.markerCollection.getArray().forEach(marker=>{
            //     this.siMap.modify.forEachFeature(feature=>{
            //         var coordinate = feature.getGeometry().getCoordinates()
            //         var center = marker.getGeometry().getCoordinates()
            //         if(isEqualPoint(coordinate,center,1000)){
            //             this.siMap.modify.removeFeature(feature)
            //             this.markerCollection.remove(feature)
            //         }
            //     })
            // }) 
        this.markerCollection.getArray().forEach(marker => {
            // console.log(marker)
            this.siMap.modify.removeFeature(marker)
            this.markerCollection.remove(marker)
        })
    }
    selectLine(line) {

    }
    removeSelection() {

    }
    onSnapped(result) {
        // console.log(result)
        if (result ? result.vertex : undefined) {
            this.styleFeature.setGeometry(new Point(result.vertex));
            let rfeature = this.source_.getClosestFeatureToCoordinate(result.vertex);
            // console.log(rfeature)
            if (rfeature) {
                let entitySource = rfeature.get('parallelEntity')
                if (entitySource) {
                    let center = calculateCenter(entitySource).center
                    this.siMap.modify.forEachFeature(feature => {
                        if (isEqualPoint(feature.getGeometry().getCoordinates(), center, 10000)) {
                            feature.setStyle(this.parallelStyle)
                            this.currentParallelFeature = feature
                                // this.lineStyleFeature.setGeometry(new LineString([this.currentOrigin,result.vertex]))
                            this.lineStyleFeature.setGeometry(rfeature.getGeometry())
                            if (!this.siMap.modify.hasFeature(this.lineStyleFeature)) this.siMap.modify.addFeature(this.lineStyleFeature)
                            if (!this.siMap.modify.hasFeature(this.lineStyleFeature)) this.siMap.modify.addFeature(this.lineStyleFeature)
                        }
                    })
                }
            }
            // if(!this.siMap.modify.hasFeature(this.styleFeature))  this.siMap.modify.addFeature(this.styleFeature)
            // if(this.currentOrigin){
            //     this.lineStyleFeature.setGeometry(new LineString([this.currentOrigin,result.vertex]))
            //     if(!this.siMap.modify.hasFeature(this.lineStyleFeature)) this.siMap.modify.addFeature(this.lineStyleFeature)
            //     }
        } else {
            this.removeSnapsStyles()
                // console.log(currentParallelFeature)
            if (this.currentParallelFeature) {
                this.currentParallelFeature.setStyle(this.crossStyle)
            }
        }

    }
}

export const polarAngels = {
    90: [0, 90, 180, 270],
    45: [0, 45, 90, 135, 180, 225, 270, 315],
    30: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 310, 330]
}