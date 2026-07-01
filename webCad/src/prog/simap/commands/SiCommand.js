import { toStringHDMS } from 'ol/coordinate'
import { MapActionsEventType } from '../entities/SiActions'
import { ControlType, cursorStyle, styleModeType } from '../entities/SiMap'
import { multipleExist } from '../helpers/MultiParamsArrayCheck'
import { snapTypeName } from '../interactions/snap/SnapTypes'
import { reapeatCondition } from './CommandSteps'
import Event from 'ol/events/Event'
import './style.css'
import { Feature } from 'ol'
import Point from "ol/geom/Point";
import { Fill, Icon, RegularShape, Stroke, Style } from 'ol/style'
import { MouseWheelZoom } from 'ol/interaction'
export default class SiCommand { //command manager
    constructor(siMap) {
        this.siMap = siMap
        this.currentCommand = undefined
        this.currentCommandLine = ''
        this.Commands = []
        this.currentKeyboardType = null;
        this.active = true
        this.currentDefaultMessage = ''
        this.wheelFirstPointerDownPixel = undefined;
        this.wheelSecoundPointerDownPixel = undefined;
        // this.mapElement = this.siMap.map.getTargetElement().getElementsByTagName()
        // this.currentType = '';
        this.init()
            // this.initCL()
        this.count = 0;
    }
    init() {
        var pointerdown;
        var pointerKey = 0;
        var siMap = this.siMap;

        this.siMap.map.on('pointerdown', mbe => {
            // console.log('poinerdown')
            pointerdown = true
            pointerKey = mbe.originalEvent.which
            this.reActive()
            this.siMap.mapFocus()
        })
        this.siMap.map.getTargetElement().getElementsByClassName('ol-layers')[0].addEventListener('pointermove', e => {
            if (!this.active || !this.siMap.focus) {
                console.log(this.siMap.modalOpen)
                if (!this.siMap.modalOpen && !this.siMap.panelInputFocus) {
                    this.reActive()
                    this.siMap.mapFocus()
                }
            }
        })
        this.siMap.map.on('click', mbe => {
            mbe.originalEvent.preventDefault()
            pointerKey = 0
            pointerdown = false
            this.reActive()
            this.siMap.mapFocus()
                // console.log('leftclick')
        })
        this.siMap.map.getTargetElement().addEventListener('contextmenu', function(e) {
            // console.log(e)
            // console.log([e.clientX,e.clientY])
            // console.log('CONTEX')
            e.preventDefault()
            if (pointerdown && pointerKey === 1) {
                siMap.map.dispatchEvent(
                    new MapMouseEvent(
                        MapMouseEventType.bothClick,
                        e,
                        siMap.getCursorPosition()
                    )
                );
                siMap.disableSelect()
                setTimeout(function() {
                    siMap.activeSelect()
                }, 300);
            } else {
                console.log('rightclick')
                    // siMap.disableSelect()
                    // setTimeout(function() {
                    //     siMap.activeSelect()
                    //     }, 300);
            }
            pointerKey = 0
            pointerdown = false
        });
        // this.siMap.map.on(MapMouseEventType.bothClick,e=>{
        //     if(this.currentCommand){
        //         this.currentCommand.onBothMouseClick()
        //     }

        //         this.siMap.modify.removeFeature(this.siMap.lockCursor)
        //         this.siMap.lockCursor.setGeometry(new Point(e.coordinates))
        //         this.siMap.modify.addFeature(this.siMap.lockCursor)
        //         // let extent = this.siMap.map.getView().calculateExtent(this.siMap.map.getSize())
        //         this.siMap.map.getInteractions().getArray().find(interaction=>interaction instanceof MouseWheelZoom).useAnchor_ = false
        //         this.siMap.zoomToTarget(
        //             this.siMap.lockCursor
        //             ,-5)


        //     // this.siMap.zoomToExtent(this.siMap.lockCursor)
        //     // this.siMap.map.getInteractions().getArray().find(interaction=>interaction instanceof MouseWheelZoom).lastAnchor_ = e.coordinates
        // })
        // document.addEventListener('wheel',e=>{
        //     if(!this.siMap.map.getInteractions().getArray().find(interaction=>interaction instanceof MouseWheelZoom).active){

        //         // console.log(extent)
        //     }
        //     // this.siMap.map.getInteractions().getArray().find(interaction=>interaction instanceof MouseWheelZoom).lastAnchor_ = e.coordinates
        // })
        this.siMap.map.once('rendercomplete', mbe => {
            if (this.siMap.styleMode != styleModeType.noStyle) this.execCommand('activemainstyle')
        })
        this.siMap.map.on('moveend', mbe => {
            // console.log('moveend?')
            this.siMap.currentViewBbox = this.siMap.map.getView().calculateExtent(this.siMap.map.getSize())
            let polarTracking = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.polarTracking)
                // console.log(polarSnap)
            if (polarTracking) {
                if (polarTracking.snapActive && polarTracking.currentFeature) {
                    this.siMap.map.removeInteraction(polarTracking)
                    polarTracking.addSnapFeature(polarTracking.currentFeature)
                    this.siMap.map.addInteraction(polarTracking)
                }
            }
            let parallelSnap = this.siMap.siSnap.snapCollection.find(snap => snap.name === snapTypeName.parallel)
            parallelSnap.addSnapFeature()
        })
        this.siMap.map.on('pointerdown', mbe => {
            // console.log(mbe)
            if (mbe.originalEvent.button === 1 && !this.currentCommand) {
                if (!this.wheelFirstPointerDownPixel) this.wheelFirstPointerDownPixel = mbe.pixel
                else {
                    this.wheelSecoundPointerDownPixel = mbe.pixel
                        // console.log(this.wheelFirstPointerDownPixel,this.wheelSecoundPointerDownPixel)
                    if (Math.abs(this.wheelFirstPointerDownPixel[0] - this.wheelSecoundPointerDownPixel[0]) <= 3 && Math.abs(this.wheelFirstPointerDownPixel[1] - this.wheelSecoundPointerDownPixel[1]) <= 3) {
                        this.execCommand('zoom')
                        this.wheelFirstPointerDownPixel = undefined;
                        this.wheelSecoundPointerDownPixel = undefined;
                    } else {
                        this.wheelFirstPointerDownPixel = undefined;
                        this.wheelSecoundPointerDownPixel = undefined;
                    }
                }
            }
            return true
        })
        this.siMap.map.on(MapActionsEventType.UNDO, e => {
            // console.log(e)
            if (this.currentCommand) {
                this.currentCommand.onUndo(e)
                this.siMap.siSnap.snapCollection.forEach(snap => {
                    snap.removeSnapsStyles()
                })
            }
        })
        this.siMap.map.on(MapActionsEventType.REDO, e => {
            if (this.currentCommand) {
                this.currentCommand.onRedo(e)
                this.siMap.siSnap.snapCollection.forEach(snap => {
                    snap.removeSnapsStyles()
                })
            }
        })
        this.siMap.map.on(MapActionsEventType.REJECTUNDO, e => {
                if (this.currentCommand) {
                    this.currentCommand.onRejectUndo(e)
                }
            })
            // document.addEventListener('fullscreenchange', exitHandler);
            // document.addEventListener('webkitfullscreenchange', exitHandler);
            // document.addEventListener('mozfullscreenchange', exitHandler);
            // document.addEventListener('MSFullscreenChange', exitHandler);

        // function exitHandler(e) {
        //     if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        //         console.log(e)
        //     }
        // }  
        this.siMap.map.getTargetElement().addEventListener('keydown', e => {
            // console.log(e)
            // if(this.active){
            //     e.preventDefault()
            // }
            // if(this.siMap.onFullScreen){
            //     console.log('salam')
            //     return false
            // } 
            if (e.code.startsWith("Key") || e.code.startsWith("Digit") || e.code.startsWith("Numpad") || e.code.startsWith("Period")) {
                if (e.key === 'Enter') {
                    if (!this.active) return
                    if (this.currentCommand) {
                        if (this.currentCommandLine == '') {
                            this.currentCommand.execCL(null)
                        }
                    }
                    this.handleCL();
                    // this.siMap.textArea.value = this.siMap.textArea.value + '\n' + this.currentCommandLine 
                    this.currentCommandLine = ''

                } else {
                    if (!e.ctrlKey) {
                        if (!this.active) return
                        this.currentCommandLine += e.key
                    } else {
                        switch (e.key) {
                            case '1':
                                e.preventDefault()
                                this.siMap.activeControl(ControlType.featureProperties)
                                break;
                            case '2':
                                e.preventDefault()
                                this.siMap.activeControl(ControlType.textProperties)
                                break;
                            case '3':
                                e.preventDefault()
                                this.siMap.activeControl(ControlType.snapProperties)
                                break;
                            case '4':
                                e.preventDefault()
                                if (this.siMap.layerPropertiesControl) this.siMap.layerPropertiesControl.handleSelection()
                                this.siMap.activeControl(ControlType.layerProperties)
                                break;
                            case '5':
                                e.preventDefault()
                                if (this.siMap.baseLayersPropertiesControl) this.siMap.baseLayersPropertiesControl.handleSelection()
                                this.siMap.activeControl(ControlType.baseLayerProperties)
                                break;
                            case 'z':
                            case 'Z':
                                e.preventDefault()
                                this.siMap.siSelect.removeSelectionSet()
                                if (!this.currentCommand) this.siMap.clearModify()
                                this.execCommand('undo')
                                break;
                            case 'y':
                            case 'Y':
                                e.preventDefault()
                                this.siMap.siSelect.removeSelectionSet()
                                if (!this.currentCommand) this.siMap.clearModify()
                                this.execCommand('redo')
                                break;
                            default:
                                break;
                        }
                    }
                }
            } else {

                switch (e.code) {
                    case 'Escape':
                    case 'F2':
                        e.preventDefault()
                        this.abrotCommand()
                        this.siMap.siSelect.removeSelectionSet()
                        this.siMap.clearModify()
                        this.currentCommandLine = ''
                        this.currentDefaultMessage = undefined
                        this.setInputMessageElement(undefined)
                        this.siMap.idOverlay.setPosition(undefined)
                        this.reActive()
                        this.siMap.mapFocus()
                        break;
                    case 'Enter':
                        if (!this.active) return
                        if (this.currentCommand) {
                            if (this.currentCommandLine == '') {
                                this.currentCommand.execCL(null)
                            }
                        }
                        this.handleCL();
                        // this.siMap.textArea.value = this.siMap.textArea.value + '\n' + this.currentCommandLine 
                        this.currentCommandLine = ''
                        break;
                    case 'Backspace':
                        if (this.currentCommandLine != '') {
                            this.currentCommandLine = this.currentCommandLine.slice(0, -1)
                        }
                        break
                    case 'Space':
                        if (!this.active) return
                        if (this.currentCommand) {
                            if (this.currentCommandLine == '') {
                                this.currentCommand.execCL(null)
                            }
                        }
                        this.handleCL();
                        this.siMap.textArea.value = this.siMap.textArea.value + '\n' + this.currentCommandLine
                        this.currentCommandLine = ''
                            // if(!this.currentCommand){
                            //     this.currentCommandLine += e.key
                            // }
                            // else{                  
                            //     if(this.currentCommand.steps[this.currentCommand.activeStep+1] === reapeatCondition){
                            //         let currentCommandName = this.currentCommand.name;
                            //         this.currentCommand.execCL(null)
                            //         this.execCommand(currentCommandName)
                            //     }
                            //     else{
                            //         this.currentCommandLine += e.key
                            //     }
                            // }
                        break
                    case 'Comma':
                        this.currentCommandLine += e.key
                        break;
                    case 'Minus':
                        this.currentCommandLine += e.key
                        break;
                    case 'Delete':
                        if (this.currentCommand) break
                        this.siMap.siCommand.execCommand('del')
                        this.siMap.clearModify()
                        this.siMap.siSelect.removeSelectionSet()
                        this.siMap.siSelect.currentLabel = undefined;
                        break;
                    case 'F3':
                        e.preventDefault();
                        if (this.siMap.siSnap.active) {
                            this.siMap.siSnap.disable();
                        } else {
                            this.siMap.siSnap.activate();
                        }
                        break;
                    default:
                        break;
                }
            }
            if (!this.active) return
                // this.siMap.commandLine.value = this.currentCommandLine 
            this.setInputMessageElement(this.currentCommandLine)
                // if(this.currentCommand){
                //     this.currentCommand.onCommandType(this.currentCommandLine)
                // }
        })

    }
    handleSiCommandMessage(defaultMessage, inputMessage) {
        if (defaultMessage) this.setDefaultMessage(defaultMessage);
        if (!inputMessage) inputMessage = ''
        this.setInputMessageElement(inputMessage)
    }
    setInputMessageElement(inputMessage) {

        let element = siCommandPopUpElement(this.currentDefaultMessage, inputMessage)
        this.siMap.mapPopup.setElement(element)
            // this.siMap.mapPopup.setPosition(position)     

    }
    setDefaultMessage(message) {
        this.currentDefaultMessage = message
    }
    getCurrentCommandLine() {
        return this.currentCommandLine
    }
    siCommandAbrot() {
        this.abrotCommand()
        this.siMap.siSelect.removeSelectionSet()
        this.siMap.clearModify()
        this.currentCommandLine = ''
        this.currentDefaultMessage = undefined
        this.setInputMessageElement(undefined)
        this.siMap.idOverlay.setPosition(undefined)
        this.reActive()
        this.siMap.mapFocus()
    }
    initCL() {
        if (!this.active) return
        this.siMap.commandLine.addEventListener('change', (ev) => {
            this.currentCommandLine = ev.target.value;
            // console.log(this.currentCommandLine)
            switch (this.currentCommand) {
                case undefined:
                    // console.log('execCommand')
                    this.execCommand(this.currentCommandLine)
                    break;
                default:
                    this.currentCommand.handleCommandLine(this.currentCommandLine)
                    break;
            }
        });

        // this.execCommand('drawCircle3p')
    }
    handleCL() {
        // console.log('handle ',this.currentCommandLine);
        // this.count++;
        // console.log(this.currentCommand)
        switch (this.currentCommand) {
            case undefined:
                this.execCommand(this.currentCommandLine)
                break;
            default:
                // console.log('123')
                this.currentCommand.execCL(this.currentCommandLine)
                break;
        }
    }
    sendMessage(message) {
        this.siMap.textArea.value = this.siMap.textArea.value + '\n' + message
    }
    deActive() {
        if (this.active) this.active = false
    }
    reActive() {
            if (!this.active) this.active = true
        }
        // setExcCommandLine(commandLine){
        //     if(this.currentCommand && this.currentCommand.name === commandLine){
        //         return
        //     }

    //     this.abrotCommand()
    //     this.currentCommandLine = commandLine
    //     // this.execCommand(this.currentCommandLine)
    //     this.handleCL();
    //     this.siMap.textArea.value = this.siMap.textArea.value + '\n' + this.currentCommandLine 
    //     this.currentCommandLine = '' 
    // }
    execCommand(name, element) {
        // console.log(name)
        let commandObj = this.Commands.find(command => command.name == name.toLowerCase())
        if (!commandObj) {
            return
        }
        // console.log(this.siMap.commandsExceptions,commandObj.name)
        // console.log(this.siMap.commandsExceptions.indexOf(commandObj.name))
        if (this.siMap.commandsExceptions.indexOf(commandObj.name) === -1) {
            if (!this.siMap.commandHandler.find(i => i.name === commandObj.type).active) return
        }
        // if(this.siMap.commandHandler)
        if (this.currentCommand && commandObj.type != 'action') return
        if (element) {
            element.blur()
        }
        let operator = commandObj.operator
        switch (operator) {
            case 'class':
                let command = commandObj.command
                    // console.log(command)
                this.currentCommand = new command({
                    siMap: this.siMap,
                    commandType: commandObj.type
                })
                if (!this.currentCommand) {
                    return
                } else {
                    this.siMap.siActions.disable()
                }
                // 
                // this.currentCommand.exec()
                break;
            case 'function':
                commandObj.command()
                break;
            default:
                break;
        }
        this.siMap.map.getTargetElement().focus()
    }
    abrotCommand() {
        if (this.currentCommand) {
            // console.log(this.currentCommand)
            this.siMap.setCursorStyle(cursorStyle.normal)
            this.currentCommand.activeStep = 0;
            this.siMap.clearModify();
            this.currentCommand.onAbrot()
            this.siMap.siActions.activate()
                // this.siMap.map.removeInteraction(this.currentCommand)
            this.siMap.siInteraction.disable();
            this.currentCommand = undefined;
        }
    }
}

const siCommandPopUpElement = (commandMessage, commandInput) => {
    // console.log(command)
    let value = commandInput
    let element = document.createElement('div');
    element.focus();
    element.onblur = function() {
        setTimeout(function() {
            element.focus();
        }, 0);
    };
    // element.style.position = ''
    let commandMessageStr = commandMessage ? `<span  class="commandMessage" role="textbox" >${commandMessage}</span>` : ''
    let commandInputStr = commandInput ? `<span class="commandInput" role="textbox" contenteditable>${commandInput}</span>` : ''
    element.innerHTML =
        `    
    ${commandMessageStr}
    ${commandInputStr}
    `

    return element
}

export const commandType = {
    Action: 'action',
    Modify: 'modify',
    Draw: 'draw',
    Manager: 'manager'
}
export const MapMouseEventType = {
    bothClick: 'bothClick'
};

class MapMouseEvent extends Event {
    constructor(type, mbe, coordinates) {
        super(type);
        this.mapBrowserEvent = mbe
        this.coordinates = coordinates
    }
}