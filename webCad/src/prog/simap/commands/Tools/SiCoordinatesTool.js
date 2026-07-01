import { Stroke, Style } from "ol/style";
import Command from "../Command";
import { getPoint, stepActionType} from "../CommandSteps";


export default class SiCoordinatesTool extends Command{
    constructor(option) {
        super(option)
        
        this.name = 'coordinates'
        this.point = undefined;
        this.steps = [new getPoint(this)]
        this.styleFeature.setStyle(
            new Style({
                stroke:new Stroke({
                    color:'rgba(213, 255, 5,1)',
                    lineDash:[10,15]
                }),
                width:5
            })
        )
    }
    
    stepshandler(value,name,activeStep){
        if(name === stepActionType.notValid) return;
        switch (activeStep) {
            case 0:     
                this.point = value
                this.handleNext()
                break;
            
        }
    }
    onMouseMove(value,mbe){
        this.handleSiCommandMessage('Coordinates:',`X = ${value[0]}  Y = ${value[1]}`)
    }
    onAbrot(){
        
    }
    onDone(){
        const siMap = this.siMap
        this.handleSiCommandMessage('Coordinates:',`X = ${this.point[0]}  Y = ${this.point[1]}`)
        let delayInMilliseconds = 1000; 
                    setTimeout(function() {
                        siMap.siCommand.currentCommandLine = ''
                        siMap.siCommand.currentDefaultMessage = undefined
                        siMap.siCommand.setInputMessageElement(undefined)
                    }, delayInMilliseconds);
    }
}



