import { Stroke, Style } from "ol/style";

import LineString from "ol/geom/LineString";

import Command from "../Command";
import { getNumber, getPoint, getEntities, stepActionType } from "../CommandSteps";
import { EntityType } from "../../entities/Entity";

import calculateCenter from "../../helpers/CalculateCenter";
import getVertex from "../../helpers/GetVertex";
import { mapActionsType } from "../../entities/SiActions";


export default class SiScaleModify extends Command {
    constructor(option) {
        super(option)
        this.name = 'scale'
        this.center = this.siMap.siSelect.getOnModifyPoint() ? this.siMap.siSelect.getOnModifyPoint().getGeometry().getCoordinates() : undefined;
        if (this.center) {
            this.onModifyPoint = true
        } else {
            this.onModifyPoint = false
        }
        this.steps = [new getEntities(this), new getPoint(this), new getNumber(this)]
        this.styleFeature.setStyle(
            new Style({
                stroke: new Stroke({
                    color: 'rgba(213, 255, 5)',
                    lineDash: [10, 15]
                }),
                width: 5
            })
        )
        this.entities = [];
        this.scaleFactor = undefined;
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
                if (!this.center) {
                    this.siMap.siCommand.handleSiCommandMessage('Specify center point of Scale:')
                } else {
                    this.center = getVertex(this.entities[0]).center
                    this.handleNext()
                    this.siMap.siCommand.handleSiCommandMessage('Specify Scale Factor:')
                }
                break;
            case 1:
                this.handleNext()
                this.center = value;
                this.steps[1].setcenter = value
                this.siMap.siCommand.handleSiCommandMessage('Specify Scale Factor:')
                break;
            case 2:
                if (name == 'singelClick') this.scaleFactor =
                    this.calculateScaleFromLength(Math.hypot((value[1] - this.center[1]), (value[0] - this.center[0])));
                if (name == 'commandLine') this.scaleFactor = value
                this.handleNext()
                    // this.handleSiCommandMessage('Enter text:')
                break;
        }
    }
    calculateScaleFromLength(len) {
        let extent = this.siMap.calcExtentFromFeaturesCollection(this.entities);
        let extentLen = Math.max((extent[2] - extent[0]), (extent[3] - extent[1]));
        return 2 * (len / extentLen)
    }
    onMouseMove(value, mapBrowserEvent) {
        let scale;
        if (this.activeStep > 0) {
            this.handleSiCommandMessage(undefined, `${Math.round(value[0]*1000)/1000},${Math.round(value[1]*1000)/1000}`)
        }
        if (this.activeStep > 1) {
            scale = this.calculateScaleFromLength(Math.hypot((value[1] - this.center[1]), (value[0] - this.center[0])));
            this.handleSiCommandMessage(undefined, `${scale}`)
                // this.handleSiCommandMessage(undefined,`${rotate*180/Math.PI} deg`)
            this.styleFeature.setGeometry(new LineString([this.center, value]))
            this.clones.forEach(clone => {
                clone.setGeometry(clone.get('entitySource').getGeometry())
                EntityScale(clone, this.center, scale, this.onModifyPoint)
            });
        }
        return false
    }
    onCommandType(command) {

    }
    onAbrot() {
        this.entities.forEach(entity => {
            entity.modifyEnd();
        });
    }
    onDone() {
        this.siMap.clearModify();
        this.handleSiCommandMessage(undefined)
            // console.log(this.center,this.endPoint)
        this.entities.forEach(entity => {
            EntityScale(entity, this.center, this.scaleFactor, this.onModifyPoint)
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
}

const EntityScale = (entity, center, scaleFactor, onModifyPoint) => {
    // if(entity.entity.type)
    let clone = entity.getGeometry().clone()
    let type = entity.entityType
    if (!type) type = entity.get('entitySource').entityType;
    switch (type) {
        case EntityType.text:
            clone.scale(scaleFactor, undefined, center);
            entity.setGeometry(clone)
            let text = entity.text
            if (!text) {
                var imgLayer = entity.get('imgLayer')
                    // console.log(imgLayer)
                var prvsScale = entity.get('entitySource').text.imgLayer.getSource().getScale();
                imgLayer.getSource().setScale([prvsScale[0] * scaleFactor, prvsScale[1] * scaleFactor]);
                if (!onModifyPoint) {
                    var newCenter = calculateCenter(entity).center
                    imgLayer.getSource().setCenter(newCenter)
                }
                break;
            }
            // console.log(text.imgLayer.getSource())
            var prvsScale = text.imgLayer.getSource().getScale();
            // console.log(prvsScale,scaleFactor)
            text.imgLayer.getSource().setScale([prvsScale[0] * scaleFactor, prvsScale[1] * scaleFactor]);
            if (!onModifyPoint) {
                var newCenter = calculateCenter(entity).center
                text.imgLayer.getSource().setCenter(newCenter)
                text.center = newCenter
            }
            break;
        case EntityType.cadastralPoint:
            break;
        default:
            clone.scale(scaleFactor, undefined, center);
            entity.setGeometry(clone)
            break;
    }
}