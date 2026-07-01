
import { Feature } from "ol";
import Circle from "ol/geom/Circle";
import LineString from "ol/geom/LineString";
import Polygon from "ol/geom/Polygon";

import SiCircle from "../../entities/SiCircle";
import { lineDashedStyle } from "../../helpers/GetDefaultStyles";
import Command from "../Command";
import { getPoint,getLength, getNumber, stepActionType } from "../CommandSteps";

export default class DrawCircle extends Command{
    constructor(option) {
        super(option)
        this.name = 'circle'
        // console.log('circle e ')
        this.steps = [new getPoint(this),new getNumber(this,{gt:0})]
        this.radius = undefined;
        this.center = undefined;
        this.lineStyle = new Feature
        this.siMap.modify.addFeature(this.lineStyle);
        this.lineStyle.setStyle(lineDashedStyle)
    }
    stepshandler(data,name,activeStep){
        if(name === stepActionType.notValid) return;
        switch (activeStep) {
            case 0:
                this.center = data
                this.onCommandFeatureStyle.point(data)
                this.steps[1].startPoint = this.center;
                this.handleNext()
                break;    
            case 1:
                if(name == 'singelClick') this.radius = Math.hypot((data[1]-this.center[1]),(data[0]-this.center[0]))
                if(name == 'commandLine') this.radius = data;
                if(this.radius > 0){
                    this.handleNext()
                }
                break;              
            default:
                break;
        }
    }
    onMouseMove(point,mapBrowserEvent){
        if(this.center){
            let radius = Math.hypot(point[1]-this.center[1],point[0]-this.center[0])
            this.siMap.siCommand.handleSiCommandMessage('Specify radius of circle:',Math.round(radius*1000)/1000);
            this.styleFeature.setGeometry(new Circle(this.center,radius))
            this.lineStyle.setGeometry(new LineString([this.center,point])) 
        }
        else{
            this.handleSiCommandMessage('Specify center of circle:',`${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`)
        }
    }
    onDone(){
        // console.log(this)
        this.siMap.clearModify()
        new SiCircle(this.center,this.radius,{
                        layer:this.siMap.activeLayer,
        })
    }
}

