import { Feature } from "ol";
import Point from "ol/geom/Point";
import Polygon from "ol/geom/Polygon";
import { Snap } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import SiPolygon from "../../entities/SiPolygon";
import { isEqualPoint } from "../../helpers/equalPoint";
import Command from "../Command";
import { getPoint, reapeatCondition, stepActionType } from "../CommandSteps";

export default class DrawPolygon extends Command{
    constructor(option) {
        super(option)
        this.name = 'poly'
        this.steps = [new getPoint(this),reapeatCondition()]
        this.coordinates = []
        this.firstPoint = undefined
        this.styleFeature.setStyle(this.onCommandStyles.polygon)
        this.drawingSnap = new Snap
    }
    stepshandler(data,name,activeStep){
        if(name === stepActionType.notValid) return;
        this.siMap.map.removeInteraction(this.drawingSnap)
        if(!this.firstPoint){
            // console.log('first coord')
            this.coordinates.push(data)
            this.firstCoordinate = data;
            this.firstPoint = new Feature({
                geometry:new Point(this.coordinates[0])
            })
        }
        else{
            if(this.coordinates[0][0] == data[0] &&  this.coordinates[0][1] == data[1]){
                this.commandEnd()
            }
            else{
                this.coordinates.push(data)
                this.handleNext()
            }
        }
        
        let source = new VectorSource
        this.coordinates.forEach(coordinate=>{
            source.addFeature(new Feature({
                geometry:new Point(coordinate)
            }))
        })
        this.drawingSnap = new Snap({
            edge:false,
            vertex:true,
            source: source,
        })
        this.siMap.map.addInteraction(this.drawingSnap)
        // this.coordinates.push(data);
        // console.log(this.coordinates)
        this.styleFeature.setGeometry(new Polygon([[...this.coordinates,this.coordinates[0]]]))
    }
    onMouseMove(point,mapBrowserEvent){
        if(this.coordinates.length === 0){
            this.handleSiCommandMessage('Specify start point',`${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`)
        }
        else{
            this.handleSiCommandMessage('Specify next point',`${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`)
        }
        if(this.coordinates.length > 0){
            this.styleFeature.setGeometry(new Polygon([[...this.coordinates,point,this.coordinates[0]]]))
        }
    }
    onAbrot(){
        this.siMap.map.removeInteraction(this.drawingSnap)
    }
    onDone(){
        this.coordinates.push(this.coordinates[0])
        for (let index = 0; index < this.coordinates.length; index++) {
            if(this.coordinates[index+1]){
                if(isEqualPoint(this.coordinates[index],this.coordinates[index+1],1000)){
                    this.coordinates.splice(index,1)
                }
            }
        }
        this.siMap.clearModify()
        new SiPolygon([this.coordinates],{
                        layer:this.siMap.activeLayer,
        })
        this.siMap.map.removeInteraction(this.drawingSnap)
    }
}