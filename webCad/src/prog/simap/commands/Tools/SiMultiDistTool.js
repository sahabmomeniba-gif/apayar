import LineString from "ol/geom/LineString";
import { Stroke, Style } from "ol/style";
import { isEqualPoint } from "../../helpers/equalPoint";
import Command from "../Command";
import { getPoint, reapeatCondition, stepActionType} from "../CommandSteps";


export default class SiMultiDistTool extends Command{
    constructor(option) {
        super(option)
        
        this.name = 'mdist'
        this.coordinate = [];
        this.steps = [new getPoint(this),reapeatCondition()]
        this.styleFeature.setStyle(
            new Style({
                stroke:new Stroke({
                    color:'rgba(213, 255, 5,1)',
                    lineDash:[10,15]
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
            let currentLen = Math.hypot(value[1]-this.coordinate[this.coordinate.length-1][1],value[0]-this.coordinate[this.coordinate.length-1][0])
            this.styleFeature.setGeometry(new LineString([...this.coordinate,value]))
            this.handleSiCommandMessage(`Distance:${Math.round((this.dist+currentLen)*1000)/1000}  m`)
        }
    }
    onAbrot(){
        
    }
    onDone(){
        this.dist = 0 
        if(this.coordinate.length >0){
            for (let index = 0; index < this.coordinate.length-1; index++) {
                this.dist += Math.hypot(this.coordinate[index+1][1]-this.coordinate[index][1],this.coordinate[index+1][0]-this.coordinate[index][0])
            }
        }
        this.content.innerHTML = `
        <table class="idContent">
            <tr>
                <th style="width:50%"></th>
                <th></th> 
            </tr>
            <tr>
                <td>Distance=</td>
                <td>${Math.round(this.dist*1000)/1000}m</td>
            </tr>
        </table>
        `
        this.siMap.idOverlay.setPosition(this.coordinate[this.coordinate.length-1]);
    }
}



