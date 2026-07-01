import LineString from "ol/geom/LineString";
import Polygon from "ol/geom/Polygon";
import { Fill, Stroke, Style } from "ol/style";
import { isEqualPoint } from "../../helpers/equalPoint";
import Command from "../Command";
import { getPoint, reapeatCondition, stepActionType} from "../CommandSteps";


export default class SiAreaTool extends Command{
    constructor(option) {
        super(option)
        
        this.name = 'area'
        this.coordinate = [];
        this.steps = [new getPoint(this),reapeatCondition()]
        this.styleFeature.setStyle(
            new Style({
                stroke:new Stroke({
                    color:'#057affff',
                }),
                fill:new Fill({
                    color:'#7dd828df',
                }),
                width:5
            })
        )
        this.dist = 0
        this.container = document.createElement('div');
        this.container.className = 'ol-popup'
        this.container.style.minWidth = '150px'
        this.closer = document.createElement('a');
        this.closer.className  = 'ol-popup-closer'    
        this.content = document.createElement('div');
        this.content.className  = 'popup-content';
        this.container.appendChild(this.closer)
        this.container.appendChild(this.content)
        this.siMap.idOverlay.setElement(this.container)
        this.closer.onclick =  ()=> {
            this.siMap.idOverlay.setPosition(undefined);
            this.closer.blur();
        }
    }
    
    stepshandler(value,name,activeStep){
        if(name === stepActionType.notValid) return;
        switch (activeStep) {
            case 0:     
                if(this.coordinate.length ===0){
                    this.coordinate.push(value)
                    this.handleNext()
                    break;
                } 
                if(!isEqualPoint(value,this.coordinate[this.coordinate.length-1])){
                    this.coordinate.push(value)
                    if(this.coordinate.length >0){
                        for (let index = 0; index < this.coordinate.length-1; index++) {
                            this.dist += Math.hypot(this.coordinate[index+1][1]-this.coordinate[index][1],this.coordinate[index+1][0]-this.coordinate[index][0])
                        }
                    }
                    this.handleNext()
                }
                break;
        }
    }
    onMouseMove(value,mbe){
        if(this.coordinate.length >0){     
            this.styleFeature.setGeometry(new Polygon([[...this.coordinate,value]]))
            this.handleSiCommandMessage(`Area:${Math.round(( this.styleFeature.getGeometry().getArea())*1000000)/1000000}  m2`)
        }
    }
    onAbrot(){
        
    }
    onDone(){
        if(this.coordinate.length >1){
            let geom = new Polygon([this.coordinate])
            
            this.content.innerHTML = `
            <table class="idContent">
                <tr>
                    <th style="width:50%"></th>
                    <th></th> 
                </tr>
                <tr>
                    <td>Area=</td>
                    <td>${Math.round(geom.getArea()*1000000)/1000000}m2</td>
                </tr>
            </table>
            `
            this.siMap.idOverlay.setPosition(this.coordinate[this.coordinate.length-1]);
        }
    }
}



