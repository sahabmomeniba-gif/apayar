
import { Feature } from "ol";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { cursorStyle } from "../entities/SiMap";
import { reapeatCondition } from "./CommandSteps";
import uniqId from 'uniqid'
export default class Command{
    constructor(options){
        // const options = opt_options ? opt_options:{}
        this.name = options.name? options.name : undefined;
        // this.command = options.command;
        this.siMap = options.siMap;
        this.id = uniqId()
        // console.log(cursorStyle.command)
        this.siMap.setCursorStyle(cursorStyle.command)
        this.siMap.clearModify()
        // this.siMap.siCommand.Commands.push(this)
        this.currentMessage = undefined; 
        this.steps = [];
        this.commandType = options.commandType
        if(this.commandType === 'modify'){
            this.mapActionOptions = {
                geometryCollection:[]
            }
        }
        this.activeStep = 0;
        this.commandOrigin = [0,0]
        this.onCommandStyles = {
            point:new Style({
                    image:new CircleStyle({
                        radius:5,
                        fill:new Fill({
                            color:'rgba(255,255,255,1)'
                        })
        
                    })
                })
            ,
            line:
                new Style({
                    stroke: new Stroke({
                        color:this.siMap.activeLayer.styleProperties.color,
                        width:this.siMap.activeLayer.styleProperties.lineWidth
                    })
                }),
            polygon:
                new Style({
                    stroke: new Stroke({
                        color:this.siMap.activeLayer.styleProperties.color,
                        width:this.siMap.activeLayer.styleProperties.lineWidth
                    }),
                    fill: new Fill({
                        color:this.siMap.activeLayer.styleProperties.fillColor,
                    })
                })
            
        }
        this.onCommandFeatureStyle = {
            point:(coordinate)=>{
                let feature =  new Feature({
                    geometry:new Point(coordinate),
                    
                })
                
                feature.setStyle(this.onCommandStyles.point)
                // console.log(this.siMap.mapModify.source)
                this.siMap.modify.addFeature(feature)
            },
            line: (coordinate)=>{
                let feature =  new Feature({
                    geometry:new LineString(coordinate),
                    
                })
                
                feature.setStyle(this.onCommandStyles.line)
                // console.log(this.siMap.mapModify.source)
                this.siMap.modify.addFeature(feature)
            }
        }
        this.styleFeature = new Feature
        this.siMap.modify.addFeature(this.styleFeature)
        this.styleFeature.setStyle(this.onCommandStyles.line)
        this.mapActionsHistory = this.siMap.siActions.getActions()
        this.mapActionsCurrentIndex = this.siMap.siActions.getCurrentActionIndex()
        this.siMap.siActions.Actions = []
        this.siMap.siActions.currentActionIndex = -1
        this.exec()
    }
    // onUndo(){

    // }
    disableSnap(){
        this.siMap.siSnap.disable();
    }
    stepshandler(){
        return true
    }
    onDoubleClick(){
        return true
    }
    onSingelClick(){
        return true
    }
    onMouseMove(){
        return true
    }
    onUndo(){

    }
    onRedo(){
        
    }
    onBothMouseClick(){
        
    }
    // handleDefaultMessage(defaultMessage){
    //     // let thisDefaultMessage = `${defaultMessage}`
    //     console.log(defaultMessage)
    //     // this.siMap.siCommand.setPopup(thisDefaultMessage,inputMessage,position)
    //     this.siMap.siCommand.setDefaultMessage(defaultMessage)
    // }
    // handleInputMessage(inputMessage){
    //     // let thisDefaultMessage = `${defaultMessage}`
    //     // this.siMap.siCommand.setPopup(thisDefaultMessage,inputMessage,position)
        
    //     this.siMap.siCommand.setInputMessageElement(inputMessage)
    // }
    handleSiCommandMessage(defaultMessage,inputMessage){
        if(defaultMessage)  this.siMap.siCommand.setDefaultMessage(defaultMessage);
        if(!inputMessage) inputMessage = ''
        this.siMap.siCommand.setInputMessageElement(inputMessage)
    }
    handleNext(){
        // console.log('handle next')
        if(!this.steps[this.activeStep+1]){
            this.commandEnd()
        }
        else{
            if(this.steps[this.activeStep+1][0] != 'reapeat'){
                this.activeStep++
            }
            else{
                this.activeStep -=this.steps[this.activeStep+1][1]-1
            }
        }
        // console.log(this.activeStep)
    }
    exec(){
        this.siMap.siInteraction.activate(this);

        // this.siMap.siCommand.activateCommandLine(this);
    }
    onAbrot(){
        this.siMap.siActions.Actions = this.mapActionsHistory
        this.siMap.siActions.currentActionIndex = this.mapActionsCurrentIndex
        return
    }
    commandEnd(){
        // console.log('is it end')
        this.siMap.clearModify();
        this.siMap.siInteraction.disable();
        this.siMap.siActions.activate()   
        this.siMap.siCommand.currentCommand = undefined;
        this.siMap.siCommand.currentDefaultMessage = undefined
        this.siMap.siCommand.setInputMessageElement(undefined)
        this.siMap.setCursorStyle(cursorStyle.normal)
        if(this.onDone){
            // console.log(this.mapActionsHistory)
            this.siMap.siActions.Actions = this.mapActionsHistory
            this.siMap.siActions.currentActionIndex = this.mapActionsCurrentIndex
            this.onDone();
        }
    }
    execCL(commandLine){
        if(commandLine === null){ 
            if(this.steps[this.steps.length-1][0] === 'reapeat'){
                this.commandEnd()
            }      
        }
        else{
            if(this.handleCommandLine){
                this.handleCommandLine(commandLine)
            }
            if(this.steps[this.activeStep].onCommandLineExec){
                this.steps[this.activeStep].onCommandLineExec(commandLine)
            }
        }
    }
}
