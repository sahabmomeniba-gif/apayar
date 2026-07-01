import SiPoint from "../../entities/SiPoint";
import Command from "../Command";
import { getPoint, reapeatCondition, stepActionType } from "../CommandSteps";

export default class DrawPoint extends Command{
    constructor(option) {
        super(option)
        this.name = 'point'
        this.steps = [new getPoint(this),reapeatCondition()]
        this.coordinates = []
    }
    stepshandler(data,name){
        if(name === stepActionType.notValid) return;
        this.coordinates.push(data);
        this.onCommandFeatureStyle.point(data)
    } 
    onMouseMove(point,mbe){
        if(this.coordinates.length === 0){
            this.handleSiCommandMessage('Specify start point',`${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`)
        }
        else{
            this.handleSiCommandMessage('Specify next point',`${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`)
        }
    }
    onDone(){
        this.siMap.clearModify()
        for (let index = 0; index < this.coordinates.length; index++) {
            const point = this.coordinates[index];     
            new SiPoint(point[0],point[1],{
                            layer:this.siMap.activeLayer,
            })
        }
    }
}