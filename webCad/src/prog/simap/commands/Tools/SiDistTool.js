import LineString from "ol/geom/LineString";
import { Stroke, Style } from "ol/style";
import { isEqualPoint } from "../../helpers/equalPoint";
import Command from "../Command";
import { getPoint, reapeatCondition, stepActionType} from "../CommandSteps";


export default class SiDistTool extends Command{
    constructor(option) {
        super(option)
        
        this.name = 'dist'
        this.coordinate = [];
        this.startPoint = undefined;
        this.endPoint = undefined;
        
        this.steps = [new getPoint(this),new getPoint(this)]
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

                    this.startPoint  = value
                    this.handleNext()
                    break;
            case 1:
                if(!isEqualPoint(value,this.startPoint)){
                    this.endPoint = value
                    this.handleNext()
                }
                break;
        }
    }
    onMouseMove(value,mbe){
        if(this.startPoint){     
            let currentLen = Math.hypot(value[1]-this.startPoint[1],value[0]-this.startPoint[0])
            this.handleSiCommandMessage(`Distance:${Math.round((currentLen)*1000)/1000}  m`)
            this.styleFeature.setGeometry(new LineString([this.startPoint,value]))
        }
    }
    onAbrot(){
        
    }
    onDone(){
        this.dist = 0 ;
        if(this.coordinate.length >0){
            for (let index = 0; index < this.coordinate.length-1; index++) {
                this.dist += Math.hypot(this.coordinate[1][1]-this.coordinate[0][1],this.coordinate[1][0]-this.coordinate[0][0])
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
                <td>${Math.round(Math.hypot((this.endPoint[1]-this.startPoint[1]),(this.endPoint[0]-this.startPoint[0]))*1000)/1000}m</td>
            </tr>
            <tr>
                <td>DeltaX=</td>
                <td>${Math.round((this.endPoint[0]-this.startPoint[0])*1000)/1000}m</td>
            </tr>
            <tr>
                <td>DeltaY=</td>
                <td>${Math.round((this.endPoint[1]-this.startPoint[1])*1000)/1000}m</td>
            </tr>
        </table>
        `
        this.siMap.idOverlay.setPosition(this.endPoint);
    }
}



