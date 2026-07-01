import { Stroke, Style } from "ol/style";
import Point from 'ol/geom/Point'
import LineString from "ol/geom/LineString";
import Command from "../Command";
import { getPoint, getEntities, reapeatCondition, stepActionType, getFile, getNumber, openModal } from "../CommandSteps";
import { EntityType } from "../../entities/Entity";
import SiPoint from "../../entities/SiPoint";
import SiPolyLine from "../../entities/SiPolyline";
import SiCircle from "../../entities/SiCircle";
import SiLine from "../../entities/SiLine";
import SiPolygon from "../../entities/SiPolygon";
import { EntityMove } from "../Modify/SiMoveModify";
import { Centriod, CentriodType, SiPointLabels } from "../../entities/Labels";
import { mapActionsType } from "../../entities/SiActions";
import SiLayer from "../../entities/SiLayer";
import { cursorStyle, getCadColor, getCadLineDash, styleModeType } from "../../entities/SiMap";
import './style.css'
import { multipleExist } from "../../helpers/MultiParamsArrayCheck";
import SaLabel from "../../entities/Cadastal/SeperationApratemanLabel";
import { saLabelDetector } from "../../helpers/SpilitSeprationApartemanLabel";
import { anchorType, stringType } from "../../entities/SiStaticText";


export default class SiAttach extends Command {
    constructor(option) {
        super(option)
        this.name = 'attach'
            // console.log(this.siMap.siSelect.getOnModifyPoint())
        this.steps = [new openModal(this, {
            title: 'Attach',
            content: modal_content(this.siMap),
            width: '500px',
            height: '140px',
            eventHandler: modal_EventHandler
        })];
        this.lines = []
        this.data = undefined;
        this.scale = 1;
        this.rotate = 0;
        this.shift = [0, 0];
        this.styleFeature.setStyle(
            new Style({
                stroke: new Stroke({
                    color: 'rgba(213, 255, 5)',
                    lineDash: [10, 15]
                }),
                width: 5
            })
        )

    }
    stepshandler(value, name, activeStep) {
        if (name === stepActionType.notValid) return;
        // console.log(value,name,activeStep)
        // console.log(activeStep)
        switch (activeStep) {
            case 0:
                // console.log(value,'value')
                this.file = value.file
                this.steps[0].close()
                this.handleNext();
                // console.log(this.file)
                break;
            default:
                break;
        }
    }
    async readDxf(file, name) {
        // console.log(file,name)
        var self = this
        await self.siMap.parser.setFile(file, name).then(
            content => {
                self.data = content
                self.addDataToMap()
            }
        )
    }
    onMouseMove(point, mapBrowserEvent) {

    }
    onCommandType(command) {

    }
    onDone() {
        this.siMap.clearModify();
        this.handleSiCommandMessage(undefined)
            // console.log(this.file,'this.file')
        if (this.file) this.readDxf(this.file, 'attach.dxf')
            // console.log(this.data)

    }
    addDataToMap() {
        var e = this.data
        var siMap = this.siMap;
        var layers = e.tables.layer.layers;
        var siLayers = []
        for (const key in layers) {
            var layer = layers[key]
                // console.log(layer.colorIndex,'LAYER color index')
            let currentSiLayer = siMap.layers.find(l => l.name === layer.name)
            if (currentSiLayer) {
                siLayers.push(currentSiLayer)
            } else {
                layer.snap = false;
                currentSiLayer = new SiLayer({
                    siMap: siMap,
                    name: layer.name,
                    type: 'vector',
                    color: getCadColor(layer.colorIndex),
                    textColor: getCadColor(layer.colorIndex),
                    colorIndex: layer.colorIndex,
                    frozen: layer.frozen,
                    visible: layer.visible,
                    process: true,
                    shouldNotSnap: layer.snap,
                    title: layer.title
                })
                siLayers.push(
                    currentSiLayer
                )
            }
            if (layer.main) siMap.activeLayer = currentSiLayer
        }
        siLayers.forEach(layer => {
            layer.lazyLoad = true
        })
        siMap.activeLayer.lazyLoad = true
            // layers.map(layer=>{
            //
            // })
        var entites = e.entities;
        // console.log(e,'HAME')
        // console.log(entites)
        this.lines = []
        entites.forEach(entity => {
            var newEntity;
            var color;
            var colorIndex;
            var siLayer = siLayers.find(sl => sl.name === entity.layer);
            if (entity.colorIndex) {
                // console.log(entity.colorIndex,'bemoone pishet')
                if (entity.colorIndex != 256) {
                    color = getCadColor(entity.colorIndex);
                    colorIndex = entity.colorIndex;
                }
            }
            if (!siLayer) siLayer = siMap.activeLayer;
            else {
                // console.log(siLayer.name);
                // console.log(entity,color)
            }
            switch (entity.type) {
                case EntityType.line:
                    var p1 = this.transform([entity.vertices[0].x, entity.vertices[0].y])
                    var p2 = this.transform([entity.vertices[1].x, entity.vertices[1].y])
                    newEntity = new SiLine(
                        p1, p2, {
                            layer: siLayer,
                            color: color,
                            // lineWidth:entity.lineweight*Mm2Px/100,
                            lineDash: getCadLineDash(entity.lineType),
                            colorIndex: colorIndex
                        })
                    break;
                case EntityType.circle:
                    var center = this.transform([entity.center.x, entity.center.y])
                    newEntity = new SiCircle(
                        center, entity.radius * this.scale, {
                            layer: siLayer,
                            color: color,
                            // lineWidth:entity.lineweight*Mm2Px/100,
                            lineDash: getCadLineDash(entity.lineType),
                            colorIndex: colorIndex
                        })
                    break;
                case EntityType.text:
                    let isAparteman;
                    // console.log(siLayer.name)
                    if (siLayer.name === '3') {
                        // console.log('t')
                        isAparteman = true;
                    } else {
                        if (siLayer.name === '4') isAparteman = false;
                    }
                    switch (this.siMap.styleMode) {
                        case styleModeType.arse:
                            if (multipleExist(entity.text, ['F', 'M', 'G'])) {
                                let codes = {
                                        tasbit: multipleExist(entity.text, ['*']),
                                        cms: entity.text.substr(0, 3),
                                        bakhsh: entity.text.substr(3, 2),
                                        nahieh: entity.text.substr(5, 2),
                                        asli: entity.text.substr(7, entity.text.indexOf('F') - 7),
                                        fare: entity.text.substr(entity.text.indexOf('F') + 1, entity.text.indexOf('M') - entity.text.indexOf('F') - 1),
                                        mafruzi: entity.text.substr(entity.text.indexOf('M') + 1, entity.text.indexOf('G') - entity.text.indexOf('M') - 1),
                                        ghate: entity.text.substr(entity.text.indexOf('G') + 1, (entity.text.includes('A')) ? entity.text.indexOf('A') - entity.text.indexOf('G') - 1 : entity.text.length - entity.text.indexOf('G')).replace('*', ''),
                                    }
                                    // console.log(codes)
                                newEntity = new Centriod(center[0], center[1], {
                                    text: entity.text,
                                    rotation: -entity.rotation,
                                    color: color,
                                    layer: siLayer,
                                    LabelColor: color,
                                    sabtCode: codes.cms,
                                    fari: codes.fare,
                                    bakhsh: codes.bakhsh,
                                    mafroozi: codes.mafruzi,
                                    nahiye: codes.nahieh,
                                    ghate: codes.ghate,
                                    asli: codes.asli,
                                    tasbit: codes.tasbit,
                                    size: 16,
                                    centriodType: CentriodType.id,
                                    area: entity.area,

                                })
                            } else {
                                var size = 12
                                newEntity = new Centriod(center[0], center[1], {
                                    text: entity.text,
                                    rotation: -entity.rotation,
                                    color: color,
                                    layer: siLayer,
                                    LabelColor: color,
                                    size: size,
                                    centriodType: CentriodType.name,
                                    area: entity.area
                                })
                            }
                            break;
                        case styleModeType.seperationAparteman:
                            var th = 1;
                            let saLabelDetectorObj = saLabelDetector(entity.text)
                            new SaLabel([entity.startPoint.x, entity.startPoint.y], th, entity.rotation * Math.PI / 180, {
                                layer: siLayer,
                                anchor: anchorType.mid_mid,
                                stringType: stringType.normal,
                                colorIndex: colorIndex,
                                useCase: saLabelDetectorObj['A'],
                                samt: saLabelDetectorObj['S'],
                                ghate: saLabelDetectorObj['G'],
                                asli: saLabelDetectorObj['P'],
                                fari: saLabelDetectorObj['F'],
                                rights: saLabelDetectorObj['M'],
                                isAparteman: isAparteman,
                                coolerChannel: saLabelDetectorObj['V'],
                                block: saLabelDetectorObj['K'],
                                sathNumber: saLabelDetectorObj['S'],
                                // hasDocument: saLabelDetectorObj['H'] ? true : false,
                            })
                            break

                        default:

                            break;
                    }
                    break;
                case EntityType.polyline:
                case 'POLYLINE':
                    // console.log(entity)
                    var vertices = entity.vertices;
                    var coordinates = [];
                    vertices.forEach(v => {
                        coordinates.push(this.transform([v.x, v.y]));
                    })
                    newEntity = new SiPolyLine(
                        coordinates, {
                            layer: siLayer,
                            color: color,
                            // lineWidth:entity.lineweight*Mm2Px/100,
                            lineDash: getCadLineDash(entity.lineType),
                            colorIndex: colorIndex,
                            process: true,
                        })
                    break;
                default:
                    // console.log('no entity',entity.type)
                    break;
            }
        });
        // console.log(this.map.getAllLayers())
        siMap.activeLayer.lazyLoad = false
        siLayers.forEach(layer => {
            layer.lazyLoad = false
                // if(layer.name === '0'){
                //     this.setActiveLayer(layer)
                // }
        })
        siMap.zoomToAll()
    }
    onAbrot() {
        this.siMap.clearModify();
        this.handleSiCommandMessage(undefined)
        this.lines.forEach(entity => {
            entity.siLayer.source.removeFeature(entity)
        })
    }
    transform(p) {
        return Transformation2D(p, this.rotate, this.shift, this.scale)
    }
}

const Transformation2D = (point, rotate, shift, scale) => {
    var x0 = point[0]
    var y0 = point[1]
    var xTranslate, yTranslate, xRotate, yRotate, xScale, yScale;
    xTranslate = x0 + shift[0];
    yTranslate = y0 + shift[1];
    xRotate = xTranslate * Math.cos(rotate) - yTranslate * Math.sin(rotate)
    yRotate = xTranslate * Math.sin(rotate) + yTranslate * Math.cos(rotate)
    xScale = xRotate * scale
    yScale = yRotate * scale
    return (
        [
            xScale,
            yScale
        ]
    )
}

const modal_content = (siMap) => {
    let element = document.createElement('div');
    element.className = 'wcs_modal_content'
    let str = ''
    str += `
    <div class="wcs_modal_fileManager_container">
        <div class="wcs_modal_fileManager_container_items">
            <div class="wcs_modal_file_input_label_container"><label for="file_A">Import DXF File for Attach</label></div>
            <div class="wcs_modal_file_input_input_container"><input accept=".dxf" type="file" class="wcs_modal_fileInput"/></div> 
        </div>       
    </div>
    `
    element.innerHTML = str
    return element

}

const modal_EventHandler = (siMap, commandId) => {
    let modal = siMap.getSiControl('wcs_modal').element
    let contentElement = modal.getElementsByClassName('wcs_modal_content')[0]
    let input = contentElement.getElementsByClassName('wcs_modal_fileInput')[0]
    let modalMessage = modal.getElementsByClassName('wcs_modal_messager_content')[0]
    let apply = modal.getElementsByClassName('wcs_modal_apply')[0]

    apply.addEventListener('click', e => {
        // if(input.value === )
        let fileList = input.files
        console.log(fileList)
        if (!fileList[0]) modalMessage.innerHTML = 'please choose a dxf file'
        else {
            if (siMap.siCommand.currentCommand) {
                modalMessage.innerHTML = 'please wait'
                let file = fileList[0]
                    // console.log(file)
                const reader = new FileReader();
                // var command = this;
                reader.onloadend = evt => {
                    // console.log(evt,'evt')
                    siMap.siCommand.currentCommand.stepshandler({
                            file: evt.target
                        }, 'apply', 0)
                        // this.input.value = null
                    reader.abort()
                };
                reader.readAsText(file);
            }

        }
    }, false)

}