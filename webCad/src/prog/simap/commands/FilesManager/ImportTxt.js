import {  Stroke, Style } from "ol/style";
import Point from 'ol/geom/Point'
import LineString from "ol/geom/LineString";
import Command from "../Command";
import { getPoint,  getEntities, reapeatCondition, stepActionType, getFile} from "../CommandSteps";
import { EntityType } from "../../entities/Entity";
import SiPoint from "../../entities/SiPoint";
import SiPolyLine from "../../entities/SiPolyline";
import SiCircle from "../../entities/SiCircle";
import SiLine from "../../entities/SiLine";
import SiPolygon from "../../entities/SiPolygon";
import { EntityMove } from "../Modify/SiMoveModify";
import { Centriod, SiPointLabels } from "../../entities/Labels";
import { mapActionsType } from "../../entities/SiActions";



export default class SiImportTxt extends Command{
    constructor(option) {
        super(option)
        this.name = 'importTxt'
        // console.log(this.siMap.siSelect.getOnModifyPoint())
        this.steps = [new getFile(this)];
        this.lines = []
        this.styleFeature.setStyle(
            new Style({
                stroke:new Stroke({
                    color:'rgba(213, 255, 5)',
                    lineDash:[10,15]
                }),
                width:5
            })
            )
        this.steps[0].load()
        this.handleSiCommandMessage('Press Enter for import file or Esc for exit command')
    }
   
    setEntities(collection){
        this.entities = collection
    }
    stepshandler(value,name,activeStep){
        if(name === stepActionType.notValid) return;
        // console.log(value,name,activeStep)
        switch (activeStep) {
            case 0:    
            // console.log(value)
                    switch (name) {
                        case stepActionType.importFile:
                            let splitName = value.name.split('.') 
                            // console.log(splitName[splitName.length-1])
                            if(splitName[splitName.length-1]){
                                if(splitName[splitName.length-1] != 'txt'){
                                    // console.log('this input is not text file')
                                    this.handleNext()
                                    break;
                                }
                            }
                            let file = value.file;
                            let arr = file.result.split(/\r?\n/);
                            try {
                                arr.forEach(data=>{
                                    let dataArr = data.split(',') 
                                    // console.log(dataArr)
                                    var entity = new SiPoint(parseFloat(dataArr[1]),parseFloat(dataArr[2]),{layer:this.siMap.activeLayer})
                                    this.lines.push(entity)
                                    entity.appendAttributes('point',{
                                        id:dataArr[0],
                                        x:dataArr[1],
                                        y:dataArr[2],
                                        z:dataArr[3]
                                    })
                                })
                            } catch (error) {
                                console.log(error);
                                this.onAbrot()
                                
                            }
                            this.handleNext()
                            break; 
                        case stepActionType.checkInput:
                            // console.log('check?')
                            this.hasInput = true;    
                            break;
                        case stepActionType.cancelInput:
                            // console.log('cancel')
                            this.handleNext()
                            break;
                    default:
                        break;
                }
                
            default:break;
        }
    }

    onMouseMove(point,mapBrowserEvent){

    }
    onCommandType(command){
        
    }
    onDone(){
        this.siMap.clearModify();
        this.handleSiCommandMessage(undefined)
    }
    onAbrot(){
        this.siMap.clearModify();
        this.handleSiCommandMessage(undefined)
        this.lines.forEach(entity=>{
            entity.siLayer.source.removeFeature(entity)
        })
    }
}
