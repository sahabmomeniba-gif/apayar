
import { Feature } from "ol";
import Circle from "ol/geom/Circle";
import LineString from "ol/geom/LineString";
import SiArc from "../../entities/SiArc";

import SiCircle from "../../entities/SiCircle";
import { lineDashedStyle } from "../../helpers/GetDefaultStyles";

import Command from "../Command";
import { getPoint, stepActionType } from "../CommandSteps";

export default class DrawArc3p extends Command{
    constructor(option) {
        super(option)
        this.name = 'arc3p'
        this.steps = [new getPoint(this),new getPoint(this),new getPoint(this)]
        this.coordinates = [];
        this.triangleStyle = new Feature;
        this.siMap.modify.addFeature(this.triangleStyle);
        this.triangleStyle.setStyle(lineDashedStyle)
    }
    stepshandler(data,name,activeStep){
        if(name === stepActionType.notValid) return;
        this.onCommandFeatureStyle.point(data)
        this.coordinates.push(data)
        this.handleNext()
    }
    onMouseMove(point,mapBrowserEvent){
        switch (this.coordinates.length) {
            case 0:
                this.handleSiCommandMessage('Specify first Point:',`${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`)
                break;
            case 1:
                this.handleSiCommandMessage('Specify next Point:',`${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`);
                this.triangleStyle.setGeometry(new LineString([this.coordinates[0],point]))
                break;
            case 2:
                this.handleSiCommandMessage('Specify next Point:',`${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`)
                let result = CalculateCircler(this.coordinates[0],this.coordinates[1],point)
                this.styleFeature.setGeometry(new Circle([result.center.x,result.center.y],result.radius))
                this.triangleStyle.setGeometry(new LineString([this.coordinates[0],this.coordinates[1],point,this.coordinates[0]]))
                break;
            default:
                break;
        }
    }
    onDone(){
        let result = CalculateCircler(this.coordinates[0],this.coordinates[1],this.coordinates[2])
        let angle1 = Math.atan2((this.coordinates[0][1]-result.center.y),(this.coordinates[0][0]-result.center.x))*180/Math.PI
        let angle3 = Math.atan2((this.coordinates[2][1]-result.center.y),(this.coordinates[2][0]-result.center.x))*180/Math.PI
        let angle2  = Math.atan2((this.coordinates[1][1]-result.center.y),(this.coordinates[1][0]-result.center.x))*180/Math.PI
        if(angle1 <0) angle1+=360
        if(angle2 <0) angle2+=360
        if(angle3 <0) angle3+=360
        let startAngle =  Math.min(angle1,angle2,angle3)
        let endAngle = Math.max(angle1,angle2,angle3)
        this.siMap.clearModify()
        new SiArc([result.center.x,result.center.y],result.radius,startAngle,endAngle,{
                        layer:this.siMap.activeLayer,
        })
    }
}

const CalculateCircler= (A,B,C)=>
{
    var yDelta_a = B[1] - A[1];
    var xDelta_a = B[0] - A[0];
    var yDelta_b = C[1] - B[1];
    var xDelta_b = C[0] - B[0];

    var center = [];

    var aSlope = yDelta_a / xDelta_a;
    var bSlope = yDelta_b / xDelta_b;

    center.x = (aSlope*bSlope*(A[1] - C[1]) + bSlope*(A[0] + B[0]) - aSlope*(B[0]+C[0]) )/(2* (bSlope-aSlope) );
    center.y = -1*(center.x - (A[0]+B[0])/2)/aSlope +  (A[1]+B[1])/2;
    var radius = Math.sqrt(Math.pow(A[0]-center.x,2)+Math.pow(A[1]-center.y,2))
    return {
        center:center,
        radius:radius
    };
}
