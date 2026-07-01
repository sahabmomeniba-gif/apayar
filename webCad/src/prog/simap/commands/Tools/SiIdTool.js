import { Overlay } from "ol";
import VectorSource from "ol/source/Vector";
import { Stroke, Style } from "ol/style";
import Entity, { EntityType, styleStatus } from "../../entities/Entity";
import Command from "../Command";
import { getPoint, selectEntities, selectEntityType, stepActionType} from "../CommandSteps";
import './style.css'

export default class SiIdTool extends Command{
    constructor(option) {
        super(option)
        
        this.name = 'id'
        this.point = undefined;
        let allSource = new VectorSource({
            features:this.siMap.getAllFeature()
        })
        this.steps = [new selectEntities(this,{
            type:selectEntityType.hoverClickSelect,
            hoverFeatures:allSource,
            clickFeatures:allSource,
            useCase:'id'
        })]

        this.container = document.createElement('div');
        this.container.className = 'ol-popup'
        this.container.style.minWidth = '280px'
        this.closer = document.createElement('a');
        this.closer.className  = 'ol-popup-closer'    
        this.content = document.createElement('div');
        this.content.className  = 'popup-content';
        this.container.appendChild(this.closer)
        this.container.appendChild(this.content)
        // console.log(this.container)
        this.styleFeature.setStyle(
            new Style({
                stroke:new Stroke({
                    color:'rgba(213, 255, 5,1)',
                    lineDash:[10,15]
                }),
                width:5
            })
        )
        this.siMap.idOverlay.setElement(this.container)
        this.closer.onclick =  ()=> {
            this.siMap.idOverlay.setPosition(undefined);
            this.closer.blur();
        }
            this.steps[0].load()
        }
    
    stepshandler(value,name,activeStep){
        if(name === stepActionType.notValid) return;
        switch (activeStep) {
            case 0:     
                switch (name) {
                    case selectEntityType.click:
                        this.selected = value.entity;
                        this.position = value.coordinate;
                        this.handleNext()
                        break;
                
                    default:
                        break;
                }
            
        }
    }
    onMouseMove(value,mbe){
        // this.handleSiCommandMessage('Coordinates:',`X = ${value[0]}  Y = ${value[1]}`)
    }
    onAbrot(){
        this.steps[0].disable();
    }
    onDone(){
        this.steps[0].disable();
        // console.log(this.selected)
        // console.log(this.position)
        // console.log(getColor(this.selected))
        this.content.innerHTML = `
        <table class="idContent">
            <tr>
                <th style="width:20%"></th>
                <th style="width:10%"></th> 
                <th></th> 
            </tr>
            <tr>
                <td>type</td>
                <td></td>
                <td>${getType(this.selected)}</td>
            </tr>
            <tr>
                <td >color</td>
                <td></td>
                <td><button class="colorContaier" style="background-color:${getColor(this.selected)}"></button></td>
            </tr>
            <tr>
                <td >layer</td>
                <td></td>
                <td>${this.selected.siLayer.title}</td>
            </tr>
        </table>
        `
        this.siMap.idOverlay.setPosition(this.position);
    }
}
const getColor = (entity)=>{
    // console.log(entity)
    if(entity.styleStatus){
        if(entity.styleStatus.color === styleStatus.byLayer) return entity.siLayer.styleProperties.color
        if(entity.styleStatus.color === styleStatus.byEntity) return entity.styleProperties.color
    }
}
const getType = (entity)=>{
    switch (entity.entityType) {
    case EntityType.line:
        if(entity.getGeometry().getCoordinates().length === 2){
            return 'line'
        }
        else{
            return 'polyline'
        }
    case EntityType.polygon: return 'polygon'
    case EntityType.circle: return 'circle'
    case EntityType.node: return 'point'
    case EntityType.text: return 'text'
    case EntityType.label: return 'label'
    default:
        return entity.entityType;
}
}



