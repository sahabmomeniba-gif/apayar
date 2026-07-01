import { Stroke, Style } from "ol/style";
import Point from 'ol/geom/Point'
import LineString from "ol/geom/LineString";
import Command from "../Command";
import { getPoint, getEntities, reapeatCondition, stepActionType } from "../CommandSteps";
import { EntityType } from "../../entities/Entity";
import SiPoint from "../../entities/SiPoint";
import SiPolyLine from "../../entities/SiPolyline";
import SiCircle from "../../entities/SiCircle";
import SiLine from "../../entities/SiLine";
import SiPolygon from "../../entities/SiPolygon";
import { EntityMove } from "../Modify/SiMoveModify";
import { Centriod, SiPointLabels } from "../../entities/Labels";
import { mapActionsType } from "../../entities/SiActions";



export default class SiCopy extends Command {
    constructor(option) {
        super(option)
        this.name = 'copy'
            // console.log(this.siMap.siSelect.getOnModifyPoint())
        this.steps = [new getEntities(this), new getPoint(this), new getPoint(this), reapeatCondition()]
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
        this.startPoint = undefined;
        this.endPoint = undefined;
        this.clones = []
        this.steps[0].load()
        this.change = []
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
                });
                this.handleNext()
                this.siMap.siCommand.handleSiCommandMessage('Specify start point of Copy:')
                break;
            case 1:
                this.handleNext()
                this.startPoint = value;
                this.siMap.siCommand.handleSiCommandMessage('Specify end point of Copy:')
                break;
            case 2:
                this.endPoint = value;
                this.entities.forEach(entity => {
                    let newEntity = EntityCopy(entity, this.startPoint, this.endPoint);
                    this.change.push(newEntity)
                })
                this.commandOrigin = this.startPoint
                this.handleNext();
                break;
        }
    }

    onMouseMove(point, mapBrowserEvent) {
        if (this.activeStep > 0) {
            this.handleSiCommandMessage(undefined, `${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`)
        }
        if (this.activeStep > 1) {
            this.clones.forEach(clone => {
                EntityMove(clone, this.sp, point)
            });
        }
        this.sp = point
    }
    onCommandType(command) {

    }
    onDone() {
        this.siMap.clearModify();
        this.handleSiCommandMessage(undefined)
        this.siMap.siActions.addMapAction([{
            type: mapActionsType.addEntity,
            entities: this.change
        }, ])
    }
    onAbrot() {

    }
}

const EntityCopy = (entity, startPoint, endPoint, command) => {
    let structures = entity.getStructures()
    let options = {...structures.styleProperties, layer: structures.siLayer }
        // console.log(structures)
    let delta = [endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]]
    let newEntity;
    switch (structures.entityType) {
        case EntityType.line:
            var coordinates = structures.geometry.getCoordinates()
            if (coordinates.length > 2) {
                newEntity = new SiPolyLine(coordinates, options)
                newEntity.getGeometry().translate(delta[0], delta[1]);
            } else {
                newEntity = new SiLine(coordinates[0], coordinates[1], options)
                newEntity.getGeometry().translate(delta[0], delta[1]);
            }
            break;
        case EntityType.circle:
            newEntity = new SiCircle(structures.geometry.getCenter(), structures.geometry.getRadius(), options)
            newEntity.getGeometry().translate(delta[0], delta[1]);
            newEntity.center = [startPoint[0] + delta[0], startPoint[1] + delta[1]]
            break;
        case EntityType.node:
            var coordinates = structures.geometry.getCoordinates()
            newEntity = new SiPoint(coordinates[0], coordinates[1], options)
            newEntity.setGeometry(new Point(endPoint))
            newEntity.coordinate = endPoint
            break;
        case EntityType.polygon:
            var coordinates = structures.geometry.getCoordinates()[0]
            newEntity = new SiPolygon(coordinates, options)
            newEntity.getGeometry().translate(delta[0], delta[1]);
            break;
        case EntityType.label:
            var coordinates = structures.geometry.getCoordinates()
            var LabelProperties = entity.getLabelProperties()
            var labelOptions = {...LabelProperties, layer: structures.siLayer }
            newEntity = new Centriod(coordinates[0], coordinates[1], labelOptions)
            newEntity.getGeometry().translate(delta[0], delta[1]);
            if (entity.visible) newEntity.show()
            newEntity.render()
            break;
        default:
            return;
    }
    newEntity.styleStatus = structures.styleStatus
    return newEntity
}