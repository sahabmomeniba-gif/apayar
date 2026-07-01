import {  Stroke, Style } from "ol/style";
import LineString from "ol/geom/LineString";
import { SiText } from "../../entities/SiText";
import Command from "../Command";
import { getNumber, getPoint, getText, stepActionType } from "../CommandSteps";


export default class AddSingelLineText extends Command{
    constructor(option) {
        super(option)
        this.name = 'text'
        this.steps = [new getPoint(this),new getNumber(this,{gt:0}),new getNumber(this),new getText(this)]
        this.coordinates = [] 
        this.styleFeature.setStyle(this.onCommandStyles.polygon)
        this.textString = ''
        this.center = undefined
        this.handleSiCommandMessage('Specify center point of text:')
        this.height = undefined;
        this.rotate = undefined;
        this.siText = undefined;
        // this.endPoint = undefined
    }
    stepshandler(value,name,activeStep){
        if(name === stepActionType.notValid) return;
        // console.log(value,name,activeStep)
        switch (activeStep) {
            case 0:
                this.center = value;       
                this.handleNext()
                this.handleSiCommandMessage('Specify height (m):')
                // console.log('2234123')
                break;
            case 1:
                if(name == 'singelClick') this.height = Math.abs(value[1] - this.center[1])
                if(name == 'commandLine') this.height = value
                this.handleNext()
                this.handleSiCommandMessage('Specify rotation angle of text (deg):')
                break;
            case 2:
                if(name == 'singelClick') this.rotate = Math.atan2((value[1]-this.center[1]),(value[0]-this.center[0]));
                if(name == 'commandLine') this.rotate = value*Math.PI/180
                this.handleNext()
                this.handleSiCommandMessage('Enter text:')
                    break;
            case 3:
                this.textString = value
                this.handleNext()
                break;
        }
    }

    onMouseMove(point,mapBrowserEvent){
        switch (this.activeStep) {
            case 0:
                this.handleSiCommandMessage(undefined,`${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`)
                break;
            case 1:
                var height = Math.round(Math.abs(point[1] - this.center[1])*100)/100
                this.styleFeature.setGeometry(new LineString([this.center,[this.center[0],point[1]]]))
                var style = new Style({
                    stroke:new Stroke({
                        color:'rgba(255,255,255)'
                        ,
                        lineDash:[5,2.5],
                        width:2
                    })
                })
                this.styleFeature.setStyle(style)
                this.handleSiCommandMessage(undefined,`${height} meter`)  
                break;
            case 2:
                // console.log(this.height)
                this.styleFeature.setGeometry(new LineString([this.center,[this.center[0]+this.height,this.center[1]]]))
                var rotate = Math.atan2((point[1]-this.center[1]),(point[0]-this.center[0]));
                var clone = this.styleFeature.getGeometry().clone();
                clone.rotate(rotate,this.center);
                this.styleFeature.setGeometry(clone);
                this.handleSiCommandMessage(undefined,`${rotate*180/Math.PI} deg`)
                break;
            default:
                break;
        } 
    }
    // onCommandType(command){
    //     if(this.activeStep != 3) return
    //     if(!this.rotate || !this.height) return
    //     if(!command) return
    //     console.log(this.rotate,this.height)
    //     // let text;
    //     console.log(command,'command Line')
    //     if(!this.siText){
    //         this.siText =  new SiText(undefined,'new text',this.center[0],this.center[1],this.rotate,command,{layer:this.siMap.activeLayer});
    //         this.siText.addTextByTextHeight(this.height,'mid mid')
    //         this.siMap.zoomToExtent(this.siText.getGeometry().getExtent(),-2)
    //     }
    //     else{
    //         console.log('first')
    //         this.siText.changeText(command,false)
    //     }
    // }
    onDone(){
        this.siMap.clearModify();
        this.handleSiCommandMessage(undefined)
        let text =  new SiText(undefined,'new text',this.center[0],this.center[1],this.rotate,this.textString,{layer:this.siMap.activeLayer});
        text.addTextByTextHeight(this.height,'mid mid')
        // this.siMap.zoomToExtent(text.getGeometry().getExtent(),-5)
        // this.siText.changeText(this.textString)
        
    }
}

const CommandElement = (command,step)=>{
    // console.log(command)
    let value  = command
    let element = document.createElement('div');
    let span = document.createElement('div')
    span.style.position = 'absolute'
    span.style.visibility = 'hidden'
 
    element.focus();
    element.onblur= function() {
        setTimeout(function() {
            element.focus();
        }, 0);
    };
    element.innerHTML = 
    `    
    <input type="text" id="command_input" value = "${value}" />
    `
    let input = element.children[0]
    input.style.minWidth = '30px'
    span.innerHTML = input.value
    console.log(span.offsetWidth)
    return element
}
