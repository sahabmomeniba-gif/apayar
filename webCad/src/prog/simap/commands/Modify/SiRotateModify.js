import { Stroke, Style } from "ol/style";

import LineString from "ol/geom/LineString";

import Command from "../Command";
import { getNumber, getPoint, getEntities, stepActionType } from "../CommandSteps";
import { EntityType } from "../../entities/Entity";

import calculateCenter from "../../helpers/CalculateCenter";
import { mapActionsType } from "../../entities/SiActions";


export default class SiRotateModify extends Command {
    constructor(option) {
        super(option)
            // console.log(option)
        this.name = 'rotate'
        this.onModifyPoint = this.siMap.siSelect.getOnModifyPoint();
        this.startPoint = this.onModifyPoint ? this.onModifyPoint.getGeometry().getCoordinates() : undefined;
        if (this.startPoint) {
            this.hasModifyPoint = true;
        } else {
            this.hasModifyPoint = false;
        }
        this.steps = [new getEntities(this), new getPoint(this), new getNumber(this)]
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
        this.rotate = undefined;
        this.clones = []
        this.steps[0].load()
    }

    setEntities(collection) {
        this.entities = collection
    }
    stepshandler(value, name, activeStep) {
        if (name === stepActionType.notValid) return;
        // console.log(value,name,activeStep)
        switch (activeStep) {
            case 0:
                this.entities = value
                this.entities.forEach(entity => {
                    this.clones.push(entity.createClone())
                    var oldGeometry = entity.modifyStart();
                    this.mapActionOptions.geometryCollection.push({
                        entity: entity,
                        oldGeometry: oldGeometry,
                        newGeometry: undefined
                    })
                });
                // console.log(value)
                this.handleNext()
                if (!this.startPoint) {
                    this.siMap.siCommand.handleSiCommandMessage('Specify center point of Rotate:')
                } else {
                    this.handleNext()
                    this.siMap.siCommand.handleSiCommandMessage('Specify Angel of Rotate:')
                }
                break;
            case 1:
                this.handleNext()
                this.startPoint = value;
                this.steps[1].setStartPoint = value
                this.siMap.siCommand.handleSiCommandMessage('Specify Angel of Rotate:')
                break;
            case 2:
                if (name == 'singelClick') {
                    if (this.onModifyPoint) {
                        var center = calculateCenter(this.onModifyPoint.get('targetFeature')).center;
                        this.rotate = Math.atan2((value[1] - center[1]), (value[0] - center[0]));
                    } else {
                        this.rotate = Math.atan2((value[1] - this.startPoint[1]), (value[0] - this.startPoint[0]));
                    }
                }
                if (name == 'commandLine') this.rotate = value * Math.PI / 180
                this.handleNext()
                    // this.handleSiCommandMessage('Enter text:')
                break;
        }
    }

    onMouseMove(point, mapBrowserEvent) {
        if (this.activeStep > 0) {
            this.handleSiCommandMessage(undefined, `${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`)
        }
        if (this.activeStep > 1) {



            if (this.hasModifyPoint) {
                var center = calculateCenter(this.onModifyPoint.get('targetFeature')).center;
                this.styleFeature.setGeometry(new LineString([center, point]));
                var rotate = Math.atan2((point[1] - center[1]), (point[0] - center[0]));
                this.clones.forEach(clone => {
                    clone.setGeometry(clone.get('entitySource').getGeometry())
                    EntityRotate(clone, center, rotate, this.hasModifyPoint)
                });
            } else {
                var rotate = Math.atan2((point[1] - this.startPoint[1]), (point[0] - this.startPoint[0]));
                this.styleFeature.setGeometry(new LineString([this.startPoint, point]))
                this.clones.forEach(clone => {
                    clone.setGeometry(clone.get('entitySource').getGeometry())
                        // console.log(clone)
                    EntityRotate(clone, this.startPoint, rotate, this.hasModifyPoint)
                });
            }
            this.handleSiCommandMessage(undefined, `${rotate*180/Math.PI} deg`)

        }
    }
    onCommandType(command) {

    }
    onDone() {
        if (this.hasModifyPoint) {
            var center = calculateCenter(this.onModifyPoint.get('targetFeature')).center;
        } else {
            var center = this.startPoint;
        }
        this.siMap.clearModify();
        this.handleSiCommandMessage(undefined)
            // console.log(this.startPoint,this.endPoint)
        this.entities.forEach(entity => {
            EntityRotate(entity, center, this.rotate, this.hasModifyPoint)
            var newGeometry = entity.modifyEnd();
            this.mapActionOptions.geometryCollection.find(i => i.entity === entity).newGeometry = newGeometry
        });
        this.siMap.siActions.addMapAction([{
            type: mapActionsType.modify,
            geometryCollection: this.mapActionOptions.geometryCollection
        }])
        this.siMap.siSelect.setOnModifyPoint(undefined)
        this.siMap.siSelect.setOnModifyEntites(undefined)
    }
    onAbrot() {
        this.entities.forEach(entity => {
            entity.modifyEnd();
        });
    }
}

const EntityRotate = (entity, startPoint, rotate, onModifyPoint) => {
    // console.log(startPoint,rotate,onModifyPoint)
    if (onModifyPoint) startPoint = calculateCenter(entity).center
        // console.log(startPoint,rotate,onModifyPoint)
        // let delta = [endPoint[0]-startPoint[0],endPoint[1] - startPoint[1]]
    let clone = entity.getGeometry().clone()
    let type = entity.entityType
    if (!type) type = entity.get('entitySource').entityType;
    switch (type) {
        case EntityType.text:
            // let center = calculateCenter(entity).center 
            // console.log(center)
            clone.rotate(rotate, startPoint);
            entity.setGeometry(clone)
                // entity.getGeometry().rotate(rotate,startPoint)
            let text = entity.text
            if (!text) {
                var imgLayer = entity.get('imgLayer')
                    // console.log(imgLayer)
                var Rotate = entity.get('entitySource').getRotate()
                imgLayer.getSource().setRotation(-(rotate + Rotate))
                if (!onModifyPoint) {
                    var newCenter = calculateCenter(entity).center
                    imgLayer.getSource().setCenter(newCenter)
                }
                break;
            }
            // console.log(text.rotate,'rotate')
            // console.log(text.imgLayer.getSource())
            var prvsAngle = text.rotate
            text.imgLayer.getSource().setRotation(-(rotate + prvsAngle))
            text.rotate = rotate + prvsAngle
            if (!onModifyPoint) {
                var newCenter = calculateCenter(entity).center
                text.imgLayer.getSource().setCenter(newCenter)
                text.center = newCenter
            }
            break;
        case EntityType.cadastralPoint:
            break;
        default:
            // entity.getGeometry().rotate(startPoint,rotate);
            clone.rotate(rotate, startPoint);
            entity.setGeometry(clone)
                // console.log(entity.getGeometry().getCoordinates())
            break;
    }
}