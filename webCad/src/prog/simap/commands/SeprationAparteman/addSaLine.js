import { Collection, Feature } from "ol";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import { Snap } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import { RegularShape, Stroke, Style } from "ol/style";
import { point } from "turf";
import SiLine from "../../entities/SiLine";
import { isEqualPoint } from "../../helpers/equalPoint";
import CustomSnaps from "../../interactions/snap/CustomSnaps";
import { snapTypeName } from "../../interactions/snap/SnapTypes";
import Command from "../Command";
import { getPoint, reapeatCondition, stepActionType } from "../CommandSteps";
import VectorImageLayer from 'ol/layer/VectorImage';
import SiPolyLine from "../../entities/SiPolyline";
import { MapActionsEventType, mapActionsType } from "../../entities/SiActions";
import { getExtendPointsToExtent } from "../../helpers/GetExtendPoint";
import { Line } from "dxf-writer";
import { GetVerticalLine } from "../../helpers/GetVerticals";
import { closestOnSegment } from "ol/coordinate";
import SaLine from "../../entities/Cadastal/SeperationApratemanLine";
import SiLayer from "../../entities/SiLayer";
// import Feature from "ol";
export default class DrawSaLine extends Command {
    constructor(option) {
        super(option)
        this.name = 'saline'
        this.steps = [new getPoint(this), reapeatCondition()]
        this.coordinates = []
        this.lineCollections = []
        this.startPoint = undefined;
        // this.endPoint = undefined;
        this.lineSegments = new Collection
    }
    onUndo(e) {
        let parallelSnap = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.parallel)
        if (!e.currentAction) {

            this.startPoint = this.firstPoint
            this.commandOrigin = this.firstPoint
            parallelSnap.setOrigin(this.firstPoint)
            this.styleFeature.setGeometry(new LineString([this.startPoint, this.siMap.getCursorPosition()]));
            // parallelSnap.removeFromSource(this.lineSegments[this.lineSegments.getLength()-1])
            this.lineSegments.removeAt(this.lineSegments.getLength() - 1)
            return
        }
        if (e.currentAction[0].entities[0]) {
            // console.log('2')
            this.startPoint = e.currentAction[0].entities[0].getGeometry().getCoordinates()[1]
            this.commandOrigin = this.startPoint
            parallelSnap.setOrigin(this.startPoint)
                // console.log()
            parallelSnap.removeFromSource(e.prvsAction[0].entities[0])
                // console.log(this.startPoint)
            this.styleFeature.setGeometry(new LineString([this.startPoint, this.siMap.getCursorPosition()]));
            this.lineSegments.removeAt(this.lineSegments.getLength() - 1)
            let entity = this.lineSegments.getArray()[this.lineSegments.getLength() - 1]
                // console.log(entity)
            if (!entity) return
            let polarTracking = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.polarTracking)
            if (polarTracking) {
                polarTracking.removeSnapFeature()
                polarTracking.addSnapFeature(entity)
                if (polarTracking.snapActive) {
                    this.siMap.map.removeInteraction(polarTracking)
                    this.siMap.map.addInteraction(polarTracking)
                }
            }
        } else {
            // console.log('else')

            this.startPoint = undefined
            parallelSnap.reset()
        }
    }
    onRedo(e) {
        let parallelSnap = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.parallel)
        if (e.currentAction[0].entities[0]) {
            this.startPoint = e.currentAction[0].entities[0].getGeometry().getCoordinates()[1]
                // console.log(this.startPoint,'redo')
            this.commandOrigin = this.startPoint
            this.styleFeature.setGeometry(new LineString([this.startPoint, this.siMap.getCursorPosition()]));
            this.lineSegments.push(e.currentAction[0].entities[0])
            let entity = this.lineSegments.getArray()[this.lineSegments.getLength() - 1]
                // console.log(entity)
            if (!entity) return
            let polarTracking = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.polarTracking)
            if (polarTracking) {
                polarTracking.removeSnapFeature()
                polarTracking.addSnapFeature(entity)
                if (polarTracking.snapActive) {
                    this.siMap.map.removeInteraction(polarTracking)
                    this.siMap.map.addInteraction(polarTracking)
                }
            }

            parallelSnap.setOrigin(this.startPoint)
                // this.lineSegments.remove(e.prvsAction[0].entities[0])
        } else {
            // this.firstPoint = undefined

            this.startPoint = undefined
            parallelSnap.setOrigin(this.startPoint)
        }
    }
    onRejectUndo(e) {
        // console.log('reject')
        let parallelSnap = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.parallel)
        this.startPoint = undefined
        parallelSnap.setOrigin(undefined)
            // this.firstPoint = undefined
        this.styleFeature.setGeometry(null)
    }
    stepshandler(data, name, activeStep) {
        if (name === stepActionType.notValid) return;
        let parallelSnap = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.parallel)
        switch (activeStep) {
            case 0:
                // console.log(data,)
                this.siMap.siActions.activate()
                parallelSnap.setOrigin(data)
                parallelSnap.addSnapFeature()
                let apartemanLayer = this.siMap.layers.find(l => l.name === '3')
                if (!apartemanLayer) {
                    apartemanLayer = new SiLayer({
                        siMap: this.siMap,
                        name: '3',
                        colorIndex: 2,
                    })
                }
                let othersLayer = this.siMap.layers.find(l => l.name === '4')
                if (!othersLayer) {
                    othersLayer = new SiLayer({
                        siMap: this.siMap,
                        name: '4',
                        colorIndex: 6,
                    })
                }
                if (this.startPoint) {
                    if (!isEqualPoint(this.startPoint, data, 1000)) {
                        var entity = new SaLine(this.startPoint, data, {
                            layer: this.siMap.storage.currentSaLineType.isAparteman ? apartemanLayer : othersLayer,
                            scale: new Array(2).fill(this.siMap.mapScale),
                            saLineType: this.siMap.storage.currentSaLineType.saLineType,
                            labelType: this.siMap.storage.currentSaLineType.labelType,
                            isAparteman: this.siMap.storage.currentSaLineType.isAparteman
                        })
                        let polarTracking = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.polarTracking)
                            // console.log(polarTracking)
                        if (polarTracking) {
                            polarTracking.removeSnapFeature()
                            polarTracking.addSnapFeature(entity)
                            if (polarTracking.snapActive) {
                                this.siMap.map.removeInteraction(polarTracking)
                                this.siMap.map.addInteraction(polarTracking)
                            }
                        }
                        this.lineSegments.push(entity)
                        this.handleNext()
                        this.startPoint = data;
                        this.styleFeature.setGeometry(new LineString([this.startPoint, this.siMap.getCursorPosition()]));
                    }
                } else {
                    this.startPoint = data
                    this.firstPoint = data
                    let polarTracking = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.polarTracking)
                    if (polarTracking) {
                        polarTracking.removeSnapFeature()
                        polarTracking.addSnapFeature(undefined, data)
                        if (polarTracking.snapActive) {
                            this.siMap.map.removeInteraction(polarTracking)
                            this.siMap.map.addInteraction(polarTracking)
                        }
                    }
                }
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
        let polarTracking = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.polarTracking)
        if (polarTracking) polarTracking.removeSnapFeature()
        let parallelSnap = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.parallel)
        parallelSnap.reset()
        this.siMap.siActions.Actions = this.mapActionsHistory
        this.siMap.siActions.currentActionIndex = this.mapActionsCurrentIndex
        this.siMap.siActions.addMapAction([{
            type: mapActionsType.addEntity,
            entities: this.lineSegments.getArray()
        }, ])
    }
    onDone() {
        let polarTracking = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.polarTracking)
        let parallelSnap = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.parallel)
        parallelSnap.reset()
        if (polarTracking) polarTracking.removeSnapFeature()
        this.siMap.siActions.addMapAction([{
            type: mapActionsType.addEntity,
            entities: this.lineSegments.getArray()
        }, ])
        this.siMap.clearModify()
    }
}