import Select from 'ol/interaction/Select'
import { pointerMove, shiftKeyOnly } from 'ol/events/condition';
import { Stroke, Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import { Collection } from 'ol';
import { feature } from 'turf';
import { defaultStrokeStyle } from 'ol/render/canvas';
import { getDefaultSelectFunction } from '../helpers/GetDefaultStyles';
import { cursorStyle } from '../entities/SiMap';
import { EntityType } from '../entities/Entity';
import { isNumber, webCad_isNumber } from '../helpers/isDataTypes';
class CommandStep {
    constructor(options) {
        this.name = options.name;
        this.command = options.command
    }
    onSingelClick() {

    }
    onMouseMove() {
        // return true
    }
    onDoubleClick() {

    }
    onCommandLineExec() {

    }
    onDone() {

    }
}

export class getPoint extends CommandStep {
    constructor(command) {
        super({
            name: 'getPoint',
            command: command,

        })
        this.currentCursorCoordinate = undefined
        this.startPoint = [0, 0]
            // this.command.siMap.siCommand.handleSiCommandMessage('Specify end point:')
    }
    setStartPoint(coordinate) {
        this.startPoint = coordinate
    }
    onSingelClick(point, mbe) {
        // console.log(point,'its on getPoint')
        let activeStep = this.command.activeStep
        this.command.commandOrigin = point
        this.command.stepshandler(point, stepActionType.singelClick, activeStep)
    }
    onMouseMove(point, mbe) {
        this.currentCursorCoordinate = point
        return false
    }
    onCommandLineExec(actualCommand) {
        // console.log(command)
        let activeStep = this.command.activeStep
        let coords, string, hasRelative, origin, command;
        let baseCommand = actualCommand.split('@')
            // console.log(baseCommand)
        if (baseCommand && baseCommand.length === 2 && baseCommand[0] === '') {
            origin = this.command.commandOrigin
            hasRelative = true
            command = baseCommand[1]
        } else {
            origin = [0, 0]
            hasRelative = false
            command = actualCommand
        }
        // console.log(hasRelative)
        // console.log(command)
        string = command.split(',')
        if (string.length === 2) {
            var number = [parseFloat(string[0]), parseFloat(string[1])]
            if (isNaN(number[0]) || isNaN(number[1])) return false
                // console.log(typeof number[0]+1 == 'number')
            coords = [parseFloat(origin[0] + number[0]), parseFloat(origin[1] + number[1])]
                // console.log(coords)
            this.command.commandOrigin = coords
            this.command.stepshandler(coords, stepActionType.commandLine, activeStep)
            return true
        }
        string = command.split('<')
        if (string.length == 2) {
            var number = [parseFloat(string[0]), parseFloat(string[1])]
            if (isNaN(number[0]) || isNaN(number[1])) return false
            let sp = origin
            let angle = number[1] * Math.PI / 180
            coords = [number[0] * Math.cos(angle) + sp[0], number[0] * Math.sin(angle) + sp[1]]
                // console.log(coords)
            this.command.commandOrigin = coords
            this.command.stepshandler(coords, stepActionType.commandLine, activeStep)
            return true
        }
        // string = command.split('@')
        // if(string.length == 2){
        //     var number = [parseFloat(string[0]),parseFloat(string[1])]
        //     if(!webCad_isNumber(number[0]) || !webCad_isNumber(number[1])) return false 
        //         let sp = origin
        //         coords = [number[0]+sp[0],number[1]+sp[1]]
        //         // console.log(coords)
        //         this.command.commandOrigin = coords
        //         this.command.stepshandler(coords,stepActionType.commandLine,activeStep)
        //         return true
        // }
        if (isNaN(command)) {
            this.command.stepshandler(command, stepActionType.notValid, activeStep)
            return false
        }
        var number = parseFloat(string)
            // console.log(number)
        if (!webCad_isNumber(number)) return false
        let sp = this.command.commandOrigin
        let cp = this.currentCursorCoordinate
        let angle = Math.atan2((cp[1] - sp[1]), (cp[0] - sp[0]))
        coords = [string * Math.cos(angle) + sp[0], string * Math.sin(angle) + sp[1]]
            // console.log(coords)
        this.command.commandOrigin = coords
        this.command.stepshandler(coords, stepActionType.commandLine, activeStep)
        return true
            // let angle = Math.atan2((),())

        // if(!Array.isArray(data)){
        //     coords = data.split(',').map(c=>+c)
        // }
        // else{
        //     coords = data
        // }
        // // console.log(coords)
        // if(coords.length !=2){
        //     return false
        // }
        // if(typeof coords[0] != 'number' || typeof coords[1] != 'number'){
        //     return false
        // }

        // this.command.stepshandler(coords,this.name,activeStep)
    }
}

export const NumbricCondition = {
    greateThan: (value) => {
        return {
            name: 'gt',
            value: value
        }
    }
}
export class getNumber extends CommandStep {
    constructor(command, options) {
        super({
            name: 'getNumber',
            command: command
        })
        if (!options) options = {}
        this.gt = options.gt ? options.gt : undefined;
        this.lt = options.lt ? options.lt : undefined;
        this.eq = options.eq ? options.eq : undefined;
        this.type = options.type ? options.type : undefined;
        this.startPoint = undefined;
    }
    checkCondition(value) {
        if (this.gt && (value < this.gt)) return false
        if (this.lt && (value > this.lt)) return false
        if (this.eq && (value != this.eq)) return false
        if (this.type) {
            switch (this.type) {
                case 'int':
                    if (!value.isInteger()) return false
                    break;

                default:
                    break;
            }
        }
        return true
    }
    onSingelClick(point, mbe) {
        let activeStep = this.command.activeStep
        this.command.stepshandler(point, 'singelClick', activeStep)
    }

    onCommandLineExec(data) {
        let parseData = parseFloat(data)
            // console.log("🚀 ~ file: CommandSteps.js ~ line 157 ~ getNumber ~ onCommandLineExec ~ parseData", parseData)
            // console.log(typeof(parseData+1))
        if (!parseData) {
            if (parseData !== 0) return false
                // console.log('kar nakard? :)')

        }
        if (!this.checkCondition(parseData)) return false
        let activeStep = this.command.activeStep
        this.command.stepshandler(parseData, 'commandLine', activeStep)
    }
}

export const selectEntityType = {
    click: 'click',
    hover: 'hover',
    shiftClick: 'shiftClick',
    shiftHover: 'shiftHover',
    shiftHoverDeselect: 'shiftHoverDeselect',
    deselected: 'deselected',

}
export class selectEntities extends CommandStep {
    constructor(command, options) {
            super({
                name: 'getEntities',
                command: command
            })
            this.entitySearcherTelorance = 10;
            this.maxEntity = 50;
            this.command.siMap.setCursorStyle(cursorStyle.select)
            this.type = options.type ? options.type : selectEntityType.singelClickSelect
            this.hoverFeatures = options.hoverFeatures ? options.hoverFeatures : undefined;
            this.clickFeatures = options.clickFeatures ? options.clickFeatures : undefined;
            this.shiftClickFeatures = options.shiftClickFeatures ? options.shiftClickFeatures : undefined;
            this.shiftHoverFeatures = options.shiftHoverFeatures ? options.shiftHoverFeatures : undefined;
            this.useCase = options.useCase
            this.layer = new VectorLayer({
                source: this.hoverFeatures,
            })
            this.shiftLayer = new VectorLayer({
                source: this.shiftClickFeatures
            })
            this.style = options.onHoverStyle ? options.onHoverStyle : getDefaultSelectFunction()
        }
        // onMouseMove(){
        //     if(this.type == selectEntityType.hoverClickSelect){

    //     }
    // }
    disable() {
        this.command.siMap.map.removeInteraction(this.hoverSelect)
        this.command.siMap.map.removeInteraction(this.clickSelect)
        this.command.siMap.map.removeLayer(this.layer)
    }
    onMouseMove(center, mbe) {
        if (this.currentEntitySource) {
            this.currentEntitySource.setCurrentStyle()
        }

        let currentExtent = [center[0] - this.entitySearcherTelorance, center[1] - this.entitySearcherTelorance, center[0] + this.entitySearcherTelorance, center[1] + this.entitySearcherTelorance]
        let entites = this.command.siMap.getAllFeatureInExtent(currentExtent);
        if (entites.length < this.maxEntity) {
            entites.forEach(entity => {
                if (entity.entityType === EntityType.line) {
                    switch (this.useCase) {
                        case 'trim':
                            entity.createSegments();
                            let segments = entity.getSegments()
                            segments.forEach(segment => {
                                this.layer.getSource().addFeature(segment)
                            });
                            break;
                        case 'extend':
                            if (!this.layer.getSource().hasFeature(entity)) {
                                this.layer.getSource().addFeature(entity)
                            }
                            break;
                        default:
                            if (entity.hoverSelectInCommand) entity.hoverSelectInCommand()
                            break;
                    }
                }
            });
        }
    }
    addEntity(entity) {
        this.layer.getSource().addFeature(entity)
    }
    load() {
        let activeStep = this.command.activeStep
        this.command.siMap.map.addLayer(this.layer)
        this.hoverSelect = new Select({
                layers: [this.layer],
                condition: pointerMove,
                hitTolerance: 10,

            })
            // this.hoverSelect.setActive(false)
        this.clickSelect = new Select({
                layers: [this.layer],
                hitTolerance: 10,
            })
            // this.shiftClickSelect = new Select({
            //     layers:[this.shiftLayer] ,
            //     hitTolerance:10,    
            //     condition:(mbe)=>{
            //         return shiftKeyOnly(mbe)
            //     }
            // })
            // console.log(this.shiftLayer.getSource().getFeatures())
            // this.shiftHoverSelect = new Select({
            //     layers:[this.layer],
            //     hitTolerance:10,   
            //     condition:(mbe)=>{
            //         // console.log(pointerMove(mbe) && shiftKeyOnly(mbe))
            //         return pointerMove(mbe) && shiftKeyOnly(mbe)
            //     } 
            // })
            // this.hoverSelect.setActive(false) 
            // this.command.siMap.map.addInteraction(this.clickSelect)
        this.hoverSelect.on('select', e => {

            // this.command.stepshandler(e.selected,'hover_select',activeStep);
            let entitySource;
            if (e.deselected[0]) {
                this.command.stepshandler(e.deselected[0], selectEntityType.deselected, activeStep);
            }
            if (e.mapBrowserEvent.originalEvent.shiftKey && e.selected[0]) {
                // this.currentEntitySource = e.selected[0].get('entitySource');
                // this.currentEntitySource.setStyle(this.style);
                this.command.stepshandler(e.selected[0], selectEntityType.shiftHover, activeStep);
                // entitySource.setCurrentStyle();
            }
            if (!e.mapBrowserEvent.originalEvent.shiftKey && e.selected[0]) {
                // console.log('hoverSelect')
                // e.selected[0].get('entitySource').setCurrentStyle()
                this.command.stepshandler({ entity: e.selected[0], coordinate: e.mapBrowserEvent.coordinate }, selectEntityType.hover, activeStep);
            }
            // this.command.stepshandler(e.selected[0],selectEntityType.hover,activeStep);
            // if(e.deselected[0]){
            //     if(entitySource){
            //         entitySource.setCurrentStyle();
            //         entitySource = undefined;
            //     }
            // }
        })

        this.clickSelect.on('select', e => {
                // console.log(e)

                if (e.mapBrowserEvent.originalEvent.shiftKey && e.selected[0]) {
                    this.command.stepshandler({ entity: e.selected[0], coordinate: e.mapBrowserEvent.coordinate }, selectEntityType.shiftClick, activeStep);
                }
                if (!e.mapBrowserEvent.originalEvent.shiftKey && e.selected[0]) {
                    this.command.stepshandler({ entity: e.selected[0], coordinate: e.mapBrowserEvent.coordinate }, selectEntityType.click, activeStep);
                }
            })
            // this.shiftClickSelect.on('select',e=>{
            //     console.log(e)
            //     this.command.stepshandler(e.selected[0],'ShiftClick_select',activeStep)
            // })
            // this.shiftHoverSelect.on('select',e=>{
            //     console.log(e)
            //     // this.command.stepshandler(e.selected[0],'ShiftClick_select',activeStep)
            // })
        this.command.siMap.map.addInteraction(this.clickSelect)
        this.command.siMap.map.addInteraction(this.hoverSelect)
            // this.command.siMap.map.addInteraction(this.shiftClickSelect)
            // this.command.siMap.map.addInteraction(this.shiftHoverSelect)
    }
}

export class getImageFile extends CommandStep {
    constructor(command, options) {
        super({
            name: 'getImageFile',
            command: command
        })
        this.file = undefined;
        this.init()
        this.load()
    }
    load() {
        this.input.click();
    }
    onCommandLineExec(cl) {
        console.log(cl)
        if (cl === null || cl === '') {
            this.load()
        }
    }
    init() {

        this.input = document.createElement('input')

        // console.log('initializing');
        this.input.type = 'file'
        this.input.style.display = 'none';
        this.input.addEventListener('click', e => {
            // console.log('e')
        }, false)
        this.input.addEventListener('change', e => {
            // console.log(e)
            let activeStep = this.command.activeStep
            this.command.stepshandler(true, stepActionType.checkInput, activeStep);
            let fileList = this.input.files
                // console.log(fileList)
            this.file = fileList[0]
            let name = fileList[0].name
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                this.command.stepshandler({ file: event.target.result, name: name }, stepActionType.importFile, activeStep);
            });
            reader.readAsDataURL(this.file);


        }, false)
    }
}

export class openModal extends CommandStep {
    constructor(command, options) {
        super({
                name: 'openModal',
                command: command
            })
            // console.log(options)
        this.modal_container = this.command.siMap.getSiControl('wcs_modal')
            // console.log(this.modal_container.element)
        this.modal_container.reShape()
        if (this.modal_container) this.element = this.modal_container.element
        this.options = options
        this.open();
        this.handleEvent()
            // 
    }
    handleEvent() {
        if (this.options.eventHandler) {
            this.options.eventHandler(this.command.siMap)
        }
    }
    open() {
        if (this.modal_container) {
            this.modal_container.element.style.display = 'inline-block'
            if (this.options.title) {
                this.element.getElementsByClassName('wcs_modal_title')[0].innerHTML = this.options.title
            }
            if (this.options.content) {
                this.element.getElementsByClassName('wcs_modal_content')[0].innerHTML = this.options.content.innerHTML
            }
            if (this.options.width) {
                // console.log(this.options.width)
                this.element.getElementsByClassName('wcs_modal')[0].style.width = this.options.width
                    // console.log(`calc((100% - ${this.options.width})/2)`)
                this.element.getElementsByClassName('wcs_modal')[0].style.left = `calc((100% - ${this.options.width})/2)`
            }
            if (this.options.height) {
                this.element.getElementsByClassName('wcs_modal')[0].style.height = this.options.height
                this.element.getElementsByClassName('wcs_modal')[0].style.top = `calc((100% - ${this.options.height})/2)`
            }
            this.modal_container.element.getElementsByClassName('wcs_modal_messager_content')[0].innerHTML = ''
            this.command.siMap.modalOpen = true
        }
    }
    close() {
        if (this.modal_container) {
            this.modal_container.element.style.display = 'none'
            this.command.siMap.modalOpen = false
        }

    }
}
export class getFile extends CommandStep {
    constructor(command, options) {
        super({
            name: 'getFile',
            command: command
        })
        this.file = undefined;
        this.init()
            // this.load()
    }
    load() {
        this.input.click();
    }
    onCommandLineExec(cl) {
        if (cl === null || cl === '') {
            this.load()
        }
    }
    init() {

        this.input = document.createElement('input')

        // console.log('initializing');
        this.input.type = 'file'
        this.input.style.display = 'none';
        this.input.addEventListener('click', e => {
            console.log('e')
        }, false)
        this.input.addEventListener('change', e => {
            // console.log(e)
            let activeStep = this.command.activeStep
            this.command.stepshandler(true, stepActionType.checkInput, activeStep);
            let fileList = this.input.files
                // console.log(fileList)
            this.file = fileList[0]
            let name = fileList[0].name
            const reader = new FileReader();
            reader.onloadend = evt => {
                // console.log(evt,'evt')
                this.command.stepshandler({ file: evt.target, name: name }, stepActionType.importFile, activeStep);
                this.input.value = null
                reader.abort()
            };
            reader.readAsText(fileList[0]);
        }, false)
    }
}
export class getEntities extends CommandStep {
    constructor(command, options) {
        super({
            name: 'getEntities',
            command: command
        })
    }
    onMouseMove() {
        return true
    }
    load() {
        let siMap = this.command.siMap
        let activeStep = this.command.activeStep
        if (siMap.siSelect.getOnModifyEntites()) {
            // console.log(siMap.siSelect.getOnModifyEntites())
            this.command.stepshandler(siMap.siSelect.getOnModifyEntites(), 'select', activeStep)
        } else {
            if (siMap.siSelect.getAllSelectionSet().getArray().length > 0) {
                this.command.stepshandler(siMap.siSelect.getAllSelectionSet(), 'select', activeStep)
            } else {
                this.command.handleSiCommandMessage('No entity found. Select one or more entity first')
                let delayInMilliseconds = 1000;
                setTimeout(function() {
                    siMap.siCommand.abrotCommand()
                    siMap.siCommand.currentCommandLine = ''
                    siMap.siCommand.currentDefaultMessage = undefined
                    siMap.siCommand.setInputMessageElement(undefined)
                }, delayInMilliseconds);
            }
        }
    }
}
export class getLength extends CommandStep {
    constructor(command) {
        super({
            name: 'getLength',
            command: command
        })
        this.startPoint = undefined;
        this.endPoint = undefined;
        this.length = undefined;
    }
    onSingelClick(point, mbe) {
        // console.log('getLength')
        if (!this.startPoint) {
            return
        } else {
            this.endPoint = point
            this.length = Math.hypot(this.endPoint[1] - this.startPoint[1], this.endPoint[0] - this.startPoint[0])
            let activeStep = this.command.activeStep
            this.command.stepshandler(this.length, this.name, activeStep)
        }
    }
    onCommandLineExec(data) {
        // console.log(data,'len')
        let parseData = parseFloat(data)
        if (typeof parseData != 'number') {
            // console.log(typeof parseData)
            return false
        }
        if (parseData <= 0) {
            return false
        }
        this.length = parseData
        let activeStep = this.command.activeStep
        this.command.stepshandler(this.length, this.name, activeStep)
    }
}
export class getText extends CommandStep {
    constructor(command) {
        super({
            name: 'getText',
            command: command
        })
    }
    onSingelClick(point, mbe) {
        return
    }
    onCommandLineExec(data) {
        let activeStep = this.command.activeStep
        this.command.stepshandler(data, this.name, activeStep)
    }
}
// export class getLine extends CommandStep(){
//     constructor(command){
//         super({
//             name:'getLine',
//             command:command
//         })
//         this.startPoint = undefined;
//         this.endPoint = undefined;
//         this.length = undefined;
//         this.angle = undefined;
//     }
//     onSingelClick(point,mbe){
//         console.log('getLength')
//         if(!this.startPoint){
//             this.startPoint = point
//         }
//         else{
//             this.endPoint = point
//             this.length = Math.hypot(this.endPoint[1]-this.startPoint[1],this.endPoint[0]-this.startPoint[0])       
//             this.angle =  Math.atan2(this.endPoint[1]-this.startPoint[1],this.endPoint[0]-this.startPoint[0])
//             this.command.stepshandler({
//                 coordinates:[this.startPoint,this.endPoint],
//                 length:this.length,
//                 angle:this.angle
//             }
//                 ,this.name)
//         }
//     }
//     onCommandLineExec(data){
//         if(this.startPoint){

//         }
//         let parseData = parseFloat(data)
//         if(typeof parseData != 'number'){
//             console.log(typeof parseData)
//             return false
//         }
//         if(parseData <= 0){
//             return false
//         }
//         this.length = parseData       
//         this.command.stepshandler(this.length,this.name)
//     }
// }


// export const getPoint = (data)=>{
//     // const data = command.currentData;
//     // let data = payload;
//     let coords;
//     if(!Array.isArray(data)){
//         coords = data.split(',').map(c=>+c)
//     }
//     else{
//         coords = data
//     }
//     // console.log(coords)
//     if(coords.length !=2){
//         return false
//     }
//     if(typeof coords[0] != 'number' || typeof coords[1] != 'number'){
//         return false
//     }
//     return coords
// }
export const reapeatCondition = (stepBack = 1) => {
    return ['reapeat', stepBack]
}

export const stepActionType = {
    singelClick: 'singelClick',
    commandLine: 'commandLine',
    notValid: 'notValid',
    importFile: 'import file',
    cancelInput: 'cancel input',
    checkInput: 'check input'
}