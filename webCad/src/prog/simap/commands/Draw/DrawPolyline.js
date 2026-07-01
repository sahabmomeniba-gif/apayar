import { Collection, Feature } from "ol";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import { Snap } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import { RegularShape, Stroke, Style } from "ol/style";
import { mapActionsType } from "../../entities/SiActions";
import SiLine from "../../entities/SiLine";
import SiPolyLine from "../../entities/SiPolyline";
import { isEqualPoint } from "../../helpers/equalPoint";
import CustomSnaps from "../../interactions/snap/CustomSnaps";
import Command from "../Command";
import { getPoint, reapeatCondition, stepActionType } from "../CommandSteps";
import { snapTypeName } from "../../interactions/snap/SnapTypes";
export default class DrawPolyline extends Command {
    constructor(option) {
        super(option)
        this.name = 'polyline'
        this.steps = [new getPoint(this), reapeatCondition()]
        this.coordinates = [];
        this.startPoint = undefined;
        this.lineSegments = new Collection
        this.mapActionIndex = this.siMap.siActions.currentActionIndex
    }
    onUndo(e) {
        let parallelSnap = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.parallel)
        if (!e.currentAction) {
            this.lineSegments.removeAt(this.lineSegments.getLength() - 1)
            this.startPoint = this.firstPoint
            this.commandOrigin = this.firstPoint
            parallelSnap.setOrigin(this.firstPoint)
            this.styleFeature.setGeometry(new LineString([this.startPoint, this.siMap.getCursorPosition()]));
            this.lineSegments.removeAt(this.lineSegments.getLength() - 1)
            return
        }
        if (e.currentAction[0].entities[0]) {
            this.startPoint = e.currentAction[0].entities[0].getGeometry().getCoordinates()[1]
            this.commandOrigin = this.startPoint
            parallelSnap.setOrigin(this.startPoint)
                // console.log()
            parallelSnap.removeFromSource(e.prvsAction[0].entities[0])
            this.styleFeature.setGeometry(new LineString([this.startPoint, this.siMap.getCursorPosition()]));
            this.lineSegments.removeAt(this.lineSegments.getLength() - 1)
            let entity = this.lineSegments.getArray()[this.lineSegments.getLength() - 1]
                // console.log(entity)
            if (!entity) return
            let polarTracking = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.polarTracking)
            if (polarTracking) {
                if (polarTracking.active) {
                    this.siMap.map.removeInteraction(polarTracking)
                    polarTracking.removeSnapFeature()
                    polarTracking.addSnapFeature(entity)
                    this.siMap.map.addInteraction(polarTracking)
                }
            }
        } else {
            parallelSnap.reset()
            this.startPoint = undefined
        }
    }
    onRedo(e) {
        let parallelSnap = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.parallel)
        if (e.currentAction[0].entities[0]) {
            this.startPoint = e.currentAction[0].entities[0].getGeometry().getCoordinates()[1]
            this.commandOrigin = this.startPoint
            this.styleFeature.setGeometry(new LineString([this.startPoint, this.siMap.getCursorPosition()]));
            this.lineSegments.push(e.currentAction[0].entities[0])
            let entity = this.lineSegments.getArray()[this.lineSegments.getLength() - 1]
                // console.log(entity)
            if (!entity) return
            let polarTracking = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.polarTracking)
            if (polarTracking) {
                if (polarTracking.active) {
                    this.siMap.map.removeInteraction(polarTracking)
                    polarTracking.removeSnapFeature()
                    polarTracking.addSnapFeature(entity)
                    this.siMap.map.addInteraction(polarTracking)
                }
            }
            parallelSnap.setOrigin(this.startPoint)
                // this.lineSegments.remove(e.prvsAction[0].entities[0])
        } else {
            parallelSnap.setOrigin(this.startPoint)
            this.startPoint = undefined
        }
    }
    onRejectUndo(e) {
        // console.log('reject')
        let parallelSnap = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.parallel)
        this.startPoint = undefined
        parallelSnap.setOrigin(undefined)
        this.styleFeature.setGeometry(null)
    }
    stepshandler(data, name, activeStep) {
        if (name === stepActionType.notValid) return;
        let parallelSnap = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.parallel)
        switch (activeStep) {
            case 0:
                // console.log(data,)
                this.siMap.siActions.activate()
                if (this.startPoint) {
                    if (!isEqualPoint(this.startPoint, data, 1000)) {
                        parallelSnap.setOrigin(data)
                        parallelSnap.addSnapFeature()
                            // this.styleFeature.setGeometry(new LineString(this.coordinates))
                        var entity = new SiLine(this.startPoint, data, {
                            layer: this.siMap.activeLayer
                        })
                        let polarTracking = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.polarTracking)
                        if (polarTracking) {
                            if (polarTracking.active) {
                                this.siMap.map.removeInteraction(polarTracking)
                                this.lineSegments.forEach(entity => {
                                    polarTracking.removeFeature(entity)
                                })
                                polarTracking.addSnapFeature(entity)
                                this.siMap.map.addInteraction(polarTracking)
                            }
                        }
                        this.lineSegments.push(entity)
                        this.handleNext()
                        this.startPoint = data;
                        this.styleFeature.setGeometry(new LineString([this.startPoint, this.siMap.getCursorPosition()]));
                    }
                } else {
                    this.firstPoint = data
                    this.startPoint = data
                }
                // console.log(this.coordinates,'data arr')
                // this.onCommandFeatureStyle.point(data)
                // 
                break;
            default:
                break;
        }
    }
    onMouseMove(point, mapBrowserEvent) {
        if (this.startPoint) this.styleFeature.setGeometry(new LineString([this.startPoint, point]));
        if (this.coordinates.length === 0) {
            this.handleSiCommandMessage('Specify start point', `${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`)
        } else {
            this.handleSiCommandMessage('Specify next point', `${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`)
        }
    }
    onAbrot() {
        // this.siMap.map.removeInteraction(this.drawingSnap)
        // for (let index = 0; index < this.coordinates.length-1; index++) {
        //     var line = new SiLine(this.coordinates[index],this.coordinates[index+1],{
        //         layer:this.siMap.activeLayer,
        //     })
        // }
        let polarTracking = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.polarTracking)
        if (polarTracking) polarTracking.removeSnapFeature()
        let parallelSnap = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.parallel)
        parallelSnap.reset()
        this.siMap.siActions.Actions = this.mapActionsHistory
        this.siMap.siActions.currentActionIndex = this.mapActionsCurrentIndex
        this.lineSegments.forEach(entity => {
            this.siMap.activeLayer.source.removeFeature(entity)
        })
    }
    onDone() {
        // if(this.coordinates[this.coordinates.length-1][0] == this.coordinates[this.coordinates.length-2][0] && this.coordinates[this.coordinates.length-1][1] == this.coordinates[this.coordinates.length-2][1]){
        //     this.coordinates.pop()
        // }
        // console.log(this.coordinates,'1')
        // for (let index = 0; index < this.coordinates.length; index++) {
        //     if(this.coordinates[index+1]){
        //         if(isEqualPoint(this.coordinates[index],this.coordinates[index+1],1000)){
        //             this.coordinates.splice(index,1)
        //         }
        //     }
        // }
        // console.log(this.coordinates,'2')
        let polarTracking = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.polarTracking)
        if (polarTracking) polarTracking.removeSnapFeature()
        let parallelSnap = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.parallel)
        parallelSnap.reset()
        this.lineSegments.forEach(entity => {
            if (this.coordinates.length === 0) this.coordinates.push(entity.getGeometry().getCoordinates()[0])
            this.coordinates.push(entity.getGeometry().getCoordinates()[1])
            this.siMap.activeLayer.source.removeFeature(entity)
        })
        new SiPolyLine(this.coordinates, {
            layer: this.siMap.activeLayer,
            scale: new Array(this.coordinates.length).fill(this.siMap.mapScale),
            metadataId: new Array(2).fill(this.siMap.metadataId)
        })
        this.siMap.clearModify()
            // for (let index = 0; index < this.coordinates.length-1; index++) {
            //     var line = new SiLine(this.coordinates[index],this.coordinates[index+1],{
            //         layer:this.siMap.activeLayer,
            //     })
            // }
    }
}