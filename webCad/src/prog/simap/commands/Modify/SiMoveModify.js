import { Stroke, Style } from "ol/style";
import Point from 'ol/geom/Point'
import LineString from "ol/geom/LineString";
import Command from "../Command";
import { getPoint, getEntities, stepActionType } from "../CommandSteps";
import { EntityType } from "../../entities/Entity";
import { mapActionsType } from "../../entities/SiActions";



export default class SiMoveModify extends Command {
    constructor(option) {
        super(option)
        this.name = 'move'
            // console.log(this.siMap.siSelect.getOnModifyPoint())
        this.startPoint = this.siMap.siSelect.getOnModifyPoint() ? this.siMap.siSelect.getOnModifyPoint().getGeometry().getCoordinates() : undefined;
        this.sp = this.startPoint
        this.steps = [new getEntities(this), new getPoint(this), new getPoint(this)]
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
        this.endPoint = undefined;
        this.clones = []
        this.steps[0].load()
            // this.mapActionOption = 
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

                this.handleNext()
                if (!this.startPoint) {
                    this.siMap.siCommand.handleSiCommandMessage('Specify start point of Move:')
                } else {
                    this.handleNext()
                    this.siMap.siCommand.handleSiCommandMessage('Specify end point of Move:')
                }
                break;
            case 1:
                this.handleNext()
                this.startPoint = value;
                this.steps[2].setStartPoint = value
                this.siMap.siCommand.handleSiCommandMessage('Specify end point of Move:')
                break;
            case 2:
                this.endPoint = value;
                this.handleNext();
                break;
        }
    }

    onMouseMove(point, mapBrowserEvent) {
        // console.log(this.siMap.map.getInteractions())
        if (this.activeStep > 0) {
            this.handleSiCommandMessage(undefined, `${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`)
        }
        if (this.activeStep > 1) {
            this.styleFeature.setGeometry(new LineString([this.startPoint, point]))
            this.clones.forEach(clone => {
                EntityMove(clone, this.sp, point)
            });
        }
        this.sp = point
    }
    onCommandType(command) {

    }
    onDone() {
        // console.log(this.activeStep)
        this.siMap.clearModify();
        this.handleSiCommandMessage(undefined)
            // console.log(this.startPoint,this.endPoint)

        this.entities.forEach(entity => {
            EntityMove(entity, this.startPoint, this.endPoint)
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

export const EntityMove = (entity, startPoint, endPoint) => {
    let delta = [endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]]
    let type = entity.entityType
    if (!type) type = entity.get('entitySource').entityType
    switch (type) {
        case EntityType.circle:
            // let newCircleGeom = new Circle([startPoint[0]+delta[0],startPoint[1]+delta[1]],entity.radius)
            // entity.setGeometry(newCircleGeom)
            entity.getGeometry().translate(delta[0], delta[1]);
            entity.center = [startPoint[0] + delta[0], startPoint[1] + delta[1]]
            break;
        case EntityType.text:
            entity.getGeometry().translate(delta[0], delta[1])
            let text = entity.text
                // console.log(text)
            if (!text) {
                var imgLayer = entity.get('imgLayer')
                var cloneCenter = entity.get('center')
                if (!cloneCenter) cloneCenter = entity.get('entitySource').getCenter()
                imgLayer.getSource().setCenter([cloneCenter[0] + delta[0], cloneCenter[1] + delta[1]])
                entity.setProperties({
                    center: imgLayer.getSource().getCenter()
                })
                break;
            }
            let center = text.center
            text.imgLayer.getSource().setCenter([center[0] + delta[0], center[1] + delta[1]])
            text.center = text.imgLayer.getSource().getCenter()
            break;
        case EntityType.node:
            entity.setGeometry(new Point(endPoint))
            entity.coordinate = endPoint
            break;
        case EntityType.cadastralPoint:
            break;
        case EntityType.staticText:
            entity.getGeometry().translate(delta[0], delta[1]);
            // entity.actualCenter = [entity.actualCenter[0] + delta[0], entity.actualCenter[1] + delta[1]]
            break;
        default:
            entity.getGeometry().translate(delta[0], delta[1]);
            break;
    }
}