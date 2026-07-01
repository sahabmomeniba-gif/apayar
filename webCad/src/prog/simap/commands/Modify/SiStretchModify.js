import { Stroke, Style } from "ol/style";

import LineString from "ol/geom/LineString";

import Command from "../Command";
import { getNumber, getPoint, getEntities, stepActionType } from "../CommandSteps";
import { EntityType } from "../../entities/Entity";
import _ from 'lodash'
import calculateCenter from "../../helpers/CalculateCenter";
import Polygon from "ol/geom/Polygon";
// import GeometryType from "ol/geom/GeometryType";

import { isEqualPoint } from "../../helpers/equalPoint";
import { mapActionsType } from "../../entities/SiActions";

const GeometryType = {
    POINT: 'Point',
    LINE_STRING: 'LineString',
    LINEAR_RING: 'LinearRing',
    POLYGON: 'Polygon',
    MULTI_POINT: 'MultiPoint',
    MULTI_LINE_STRING: 'MultiLineString',
    MULTI_POLYGON: 'MultiPolygon',
    GEOMETRY_COLLECTION: 'GeometryCollection',
    CIRCLE: 'Circle',
}
export class SiStretchEndVertexModify extends Command {
    constructor(option) {
        super(option)
            // console.log(option);
        this.name = 'stretchend'
        let modifyPoint = this.siMap.siSelect.getOnModifyPoint()
        this.startPoint = modifyPoint ? modifyPoint.getGeometry().getCoordinates() : undefined;
        this.endPoint = undefined;
        this.target = undefined;
        this.targetCoordinates = [];
        if (this.startPoint) {
            // console.log("🚀 ~ file: SiStretchModify.js ~ line 21 ~ SiStretchModify ~ constructor ~ his.startPoint", this.startPoint)
            this.hasModifyPoint = true
            this.steps = [new getEntities(this), new getPoint(this)]
            this.styleFeature.setStyle(
                new Style({
                    stroke: new Stroke({
                        color: 'rgba(213, 255, 5,1)',
                        lineDash: [10, 15]
                    }),
                    width: 5
                })
            )
            this.entities = [];
            // this.stretchType = this.startPoint.get('modifyType');
            this.clones = []
            this.steps[0].load()
        } else {
            this.hasModifyPoint = false
            this.commandEnd();
        }

    }

    setEntities(collection) {
        this.entities = collection
    }
    stepshandler(value, name, activeStep) {
        if (name === stepActionType.notValid) return;
        // console.log(value,name,activeStep)
        switch (activeStep) {
            case 0:
                this.entities = value;
                this.entities.forEach(entity => {
                    this.clones.push(entity.createClone())
                    var oldGeometry = entity.modifyStart();
                    this.mapActionOptions.geometryCollection.push({
                        entity: entity,
                        oldGeometry: oldGeometry,
                        newGeometry: undefined
                    })
                });

                this.target = this.entities[0];
                let type = this.target.entityType;
                let coordinate;
                switch (type) {
                    case EntityType.line:
                        coordinate = this.target.getGeometry().getCoordinates()
                        for (let index = 0; index < coordinate.length; index++) {
                            const elm = coordinate[index];
                            if (isEqualPoint(elm, this.startPoint, 1000)) {
                                this.VertexIndex = parseFloat(index)
                            }
                        }
                        // var geom = new LineString(coordinate)
                        // this.onModifyFeature_.setGeometry(geom)
                        break;
                    case EntityType.polygon:
                        coordinate = this.target.getGeometry().getCoordinates()[0]
                        for (let index = 0; index < coordinate.length; index++) {
                            const elm = coordinate[index];
                            if (isEqualPoint(elm, this.startPoint, 1000)) {
                                this.VertexIndex = parseFloat(index)
                            }
                        }

                        break;
                    default:
                        break;
                }
                this.targetCoordinates = coordinate;
                // console.log("🚀 ~ file: SiStretchModify.js ~ line 90 ~ SiStretchEndVertexModify ~ stepshandler ~ coordinate", coordinate)
                // this.handleNext()
                if (!this.startPoint) {
                    this.siMap.siCommand.handleSiCommandMessage('you can not strech this entites')
                } else {
                    this.handleNext()
                    this.siMap.siCommand.handleSiCommandMessage('Specify stretch point of vertex:')
                }
                break;
            case 1:
                this.endPoint = value;
                this.handleNext()
                    // this.handleSiCommandMessage('Enter text:')
                break;
        }
    }

    onMouseMove(point, mapBrowserEvent) {
        if (this.activeStep > 0) {
            this.handleSiCommandMessage(undefined, `${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`);
            var endPoint = point;
            this.styleFeature.setGeometry(new LineString([this.startPoint, point]))
            this.clones.forEach(clone => {
                clone.setGeometry(clone.get('entitySource').getGeometry());
                // console.log(clone.getGeometry().getCoordinates())
                EntityEndVertexStretch(clone, endPoint, this.VertexIndex)
            });
        }
        // if(this.activeStep > 1){
        //     var rotate = Math.atan2((point[1]-this.startPoint[1]),(point[0]-this.startPoint[0]));
        //     this.handleSiCommandMessage(undefined,`${rotate*180/Math.PI} deg`)
        //     if(this.hasModifyPoint) this.styleFeature.setGeometry(new LineString([this.startPoint,point])) 
        //     else this.styleFeature.setGeometry(new LineString([this.startPoint,point])) 
        //     this.clones.forEach(clone => {
        //         clone.setGeometry(clone.get('entitySource').getGeometry())
        //         EntityRotate(clone,this.startPoint,rotate,this.hasModifyPoint)
        //     });
        // }
    }
    onCommandType(command) {

    }
    onDone() {
        if (!this.hasModifyPoint) return false
        EntityEndVertexStretch(this.target, this.endPoint, this.VertexIndex)
        this.entities.forEach(entity => {
            var newGeometry = entity.modifyEnd();
            this.mapActionOptions.geometryCollection.find(i => i.entity === entity).newGeometry = newGeometry
        });
        this.siMap.siActions.addMapAction([{
                type: mapActionsType.modify,
                geometryCollection: this.mapActionOptions.geometryCollection
            }])
            // console.log(finalCoordinates)
            // console.log(this.VertexIndex,this.targetCoordinates)
        this.siMap.clearModify();
        this.handleSiCommandMessage(undefined)
            // this.target.setModifyPoint()
        this.siMap.siSelect.setOnModifyPoint(undefined)
        this.siMap.siSelect.setOnModifyEntites(undefined)
    }
    onAbrot() {
        this.entities.forEach(entity => {
            entity.modifyEnd();

        });
    }
}

const EntityEndVertexStretch = (entity, endPoint, vertexIndex) => {
    let type = entity.getGeometry().getType();
    // console.log(type)
    let entityCoordinates;
    switch (type) {
        case GeometryType.LINE_STRING:
            entityCoordinates = entity.getGeometry().getCoordinates();
            break;
        case GeometryType.POLYGON:
            entityCoordinates = entity.getGeometry().getCoordinates()[0];
            break;
        default:
            break;
    }
    let finalCoordinates = [];
    for (let index = 0; index < entityCoordinates.length; index++) {
        if (index != vertexIndex) {
            finalCoordinates[index] = entityCoordinates[index];
        } else {
            if (type === GeometryType.POLYGON && (index === 0 || index === entityCoordinates.length - 1)) {
                finalCoordinates[entityCoordinates.length - 1] = endPoint;
                finalCoordinates[0] = endPoint;
            } else {
                finalCoordinates[index] = endPoint;
            }
        }
    }
    //   this.targetCoordinates[this.Vertexindex] = this.endPoint
    switch (type) {
        case GeometryType.LINE_STRING:
            var newGeom = new LineString(finalCoordinates)
            entity.setGeometry(newGeom)
            break;
        case GeometryType.POLYGON:
            var newGeom = new Polygon([finalCoordinates])
            entity.setGeometry(newGeom)

            break;
        default:
            break;
    }
}

export class SiStretchMidVertexModify extends Command {
    constructor(option) {
        super(option)
            // console.log(option);
        this.name = 'stretchmid'
        this.modifyPoint = this.siMap.siSelect.getOnModifyPoint();
        this.startPoint = this.modifyPoint ? this.modifyPoint.getGeometry().getCoordinates() : undefined;
        // console.log(this.startPoint)
        // this.endPoint;
        // this.target;
        this.targetCoordinates = [];
        if (this.startPoint) {
            // console.log("🚀 ~ file: SiStretchModify.js ~ line 21 ~ SiStretchModify ~ constructor ~ his.startPoint", this.startPoint)
            this.hasModifyPoint = true
            this.steps = [new getEntities(this), new getPoint(this)]
            this.styleFeature.setStyle(
                new Style({
                    stroke: new Stroke({
                        color: 'rgba(213, 255, 5,1)',
                        lineDash: [10, 15]
                    }),
                    width: 5
                })
            )
            this.entities = [];
            // this.stretchType = this.startPoint.get('modifyType');
            this.clones = []
            this.steps[0].load()
        } else {
            this.hasModifyPoint = false
            this.commandEnd();
        }

    }

    setEntities(collection) {
        this.entities = collection
    }
    stepshandler(value, name, activeStep) {
        if (name === stepActionType.notValid) return;
        // console.log(value,name,activeStep)
        switch (activeStep) {
            case 0:
                this.entities = value;
                this.entities.forEach(entity => {
                    this.clones.push(entity.createClone())
                    var oldGeometry = entity.modifyStart();
                    this.mapActionOptions.geometryCollection.push({
                        entity: entity,
                        oldGeometry: oldGeometry,
                        newGeometry: undefined
                    })
                });
                this.target = this.entities[0];
                // for (let index = 0; index < coordinate.length-1; index++) {

                //         let midCoordinate = [(coordinate[index][0]+coordinate[index+1][0])/2,(coordinate[index][1]+coordinate[index+1][1])/2];
                //         if(_.isEqual(midCoordinate,this.startPoint)){
                //             this.StartIndex = index;
                //             this.EndIndex = index+1;
                //         }

                // }
                this.StartIndex = this.modifyPoint.get('startIndex');
                this.EndIndex = this.modifyPoint.get('endIndex');

                if (!this.startPoint) {
                    this.siMap.siCommand.handleSiCommandMessage('you can not strech this entites')
                } else {
                    this.handleNext()
                    this.siMap.siCommand.handleSiCommandMessage('Specify stretch point of vertex:')
                }
                break;
            case 1:
                this.endPoint = value;
                this.handleNext()
                    // this.handleSiCommandMessage('Enter text:')
                break;
        }
    }

    onMouseMove(point, mapBrowserEvent) {
        if (this.activeStep > 0) {
            this.handleSiCommandMessage(undefined, `${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`);
            var endPoint = point;
            this.styleFeature.setGeometry(new LineString([this.startPoint, point]))
            this.clones.forEach(clone => {
                clone.setGeometry(clone.get('entitySource').getGeometry());
                // console.log(clone.getGeometry().getCoordinates())
                EntityMidVertexStretch(clone, this.startPoint, endPoint, this.StartIndex, this.EndIndex)
            });
        }
    }
    onCommandType(command) {}
    onDone() {
        if (!this.hasModifyPoint) return false
        EntityMidVertexStretch(this.target, this.startPoint, this.endPoint, this.StartIndex, this.EndIndex)
        this.entities.forEach(entity => {
            var newGeometry = entity.modifyEnd();
            this.mapActionOptions.geometryCollection.find(i => i.entity === entity).newGeometry = newGeometry
        });
        this.siMap.siActions.addMapAction([{
            type: mapActionsType.modify,
            geometryCollection: this.mapActionOptions.geometryCollection
        }])
        this.siMap.clearModify();
        this.handleSiCommandMessage(undefined)
            // this.target.setModifyPoint()
        this.siMap.siSelect.setOnModifyPoint(undefined)
        this.siMap.siSelect.setOnModifyEntites(undefined)
    }
    onAbrot() {
        this.entities.forEach(entity => {
            entity.modifyEnd();
        });
    }
}

const EntityMidVertexStretch = (entity, startPoint, endPoint, startIndex, endIndex) => {
    let type = entity.getGeometry().getType();
    let deltaX = endPoint[0] - startPoint[0];
    let deltaY = endPoint[1] - startPoint[1];
    // console.log(type)
    let entityCoordinates;
    switch (type) {
        case GeometryType.LINE_STRING:
            entityCoordinates = entity.getGeometry().getCoordinates();
            break;
        case GeometryType.POLYGON:
            entityCoordinates = entity.getGeometry().getCoordinates()[0];
            break;
        default:
            break;
    }
    let finalCoordinates = [];
    //   for (let index = 0; index < entityCoordinates.length; index++) {
    //     if(index != vertexIndex){
    //         finalCoordinates[index] = entityCoordinates[index];
    //     }
    //     else{
    //         if(type === GeometryType.POLYGON && (index===0 || index === entityCoordinates.length-1)){
    //           finalCoordinates[entityCoordinates.length-1] = endPoint; 
    //           finalCoordinates[0] = endPoint;
    //         }
    //         else{
    //           finalCoordinates[index] = endPoint;
    //         }
    //     }
    // }
    // console.log(endIndex,startIndex)
    if (startIndex != undefined && endIndex != undefined) {
        entityCoordinates[startIndex] = [entityCoordinates[startIndex][0] + deltaX, entityCoordinates[startIndex][1] + deltaY]
        entityCoordinates[endIndex] = [entityCoordinates[endIndex][0] + deltaX, entityCoordinates[endIndex][1] + deltaY]
    }
    switch (type) {
        case GeometryType.LINE_STRING:
            var newGeom = new LineString(entityCoordinates)
            entity.setGeometry(newGeom)
            break;
        case GeometryType.POLYGON:
            var newGeom = new Polygon([entityCoordinates])
            entity.setGeometry(newGeom)

            break;
        default:
            break;
    }
}