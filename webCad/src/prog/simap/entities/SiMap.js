import 'ol/ol.css';
import SiCommand, { commandType } from "../commands/SiCommand"
import SiModify from "./SiModify"
import SiLayer from "./SiLayer"
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import DrawCircle3p from "../commands/Draw/DrawCircle3p";
import Collection from 'ol/Collection';
import axios from 'axios'
import {
    defaults,
    DragPan,
    Draw,
    Translate,
} from 'ol/interaction';
// import { AddSingelLineText } from "../commands/Texts/addSingelLineText";

import SiSnap from "../interactions/snap/SiSnap";

import { SiInteraction } from "../interactions/SiInteracitons";
import DrawPoint from "../commands/Draw/DrawPoint";
import DrawLine from "../commands/Draw/DrawLine";

import DrawPolygon from "../commands/Draw/DrawPolygons";

import DrawCircle from "../commands/Draw/DrawCircle";
import { Projection } from "ol/proj";
import { Feature, Graticule, MapBrowserEvent, Overlay, View } from "ol";
import { Map } from "ol";
import { SiSelectInit2 } from "../interactions/selects/SiSelect2";

import DrawPolyline from "../commands/Draw/DrawPolyline";
import { defaults as defaultControl, FullScreen, ScaleLine } from "ol/control";

import TextsControl from '../controls/TextsControl';
import AddSingelLineText from '../commands/Texts/addSingelLineText';
import SnapsControl from '../controls/SnapsControl';
import { SiExport } from './SiExport';
import { extend } from 'ol/extent';
import { SvgExport } from './SvgExport';
import { Canvg } from 'canvg';
import { SiMapPopup } from '../controls/SiMapPopup';
import SiMoveModify from '../commands/Modify/SiMoveModify';
import SiRotateModify from '../commands/Modify/SiRotateModify';
import SiScaleModify from '../commands/Modify/SIScaleModify';
import { EntityType } from './Entity';
import SiTrimModify from '../commands/Modify/SiTrimModify';
import SiCoordinatesTool from '../commands/Tools/SiCoordinatesTool';
import Polygon from 'ol/geom/Polygon';
import SiExtendModify from '../commands/Modify/SiExtendModify';
import { SiStretchEndVertexModify, SiStretchMidVertexModify } from '../commands/Modify/SiStretchModify';
import { SiParser } from '../Parsers/SiParser';
import SiCircle from './SiCircle';
import SiLine from './SiLine'
import colorsMapper from "autocad-colors-index"
import { autoLineType, epictype, M2Px, Mm2Px, oraLineTypes, oraUseCodes, Point2M, saLineTypeList, samtListType } from '../initparams';
import { SiText, TextStyle } from './SiText';
import SiStaticText, { anchorType, stringType } from './SiStaticText'
import SiPolyLine from './SiPolyline';
import { Fill, RegularShape, Stroke, Style } from 'ol/style';
import Text from 'ol/style/Text';
import { Centriod, CentriodType, SiPointLabels } from './Labels';
import CentriodControl from '../controls/CentriodControl';
import { multipleExist } from '../helpers/MultiParamsArrayCheck';
import AddLabel from '../commands/Texts/addLabel';
import ImportDxfControl from '../controls/ImportDxf';
import ExportDxfControl from '../controls/exportDxf';
import Drawing from 'dxf-writer';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ'
import SiActions, { MapActionsEventType, mapActionsType } from './SiActions';
import SiCopy from '../commands/MapActions/SiCopy';
import CustomControlButton from '../controls/CustomControlButton';
// import { defAreaJson } from '../../../sampels/sampleDefArea';
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4';
import { transform } from 'ol/proj';
import OSM from 'ol/source/OSM';
import BaseLayersControl from '../controls/BaseLayerControl';
import SiIdTool from '../commands/Tools/SiIdTool';
import SiDistTool from '../commands/Tools/SiDistTool';
import SiMultiDistTool from '../commands/Tools/SiMultiDistTool';
import SiAreaTool from '../commands/Tools/SiAreaTool';
import SiOffsetModify from '../commands/Modify/SiOffsetModify';
import EventType from 'ol/render/EventType';
import SiImportTxt from '../commands/FilesManager/ImportTxt';
import { Object_Properties } from '../appStyle/sidebar/Object_Properties';
import { Layer_Properties } from '../appStyle/sidebar/Layer_Properties';
import { BaseImage_Properties } from '../appStyle/sidebar/BaseImage_Properties';
import wcs_commandsPallet from '../appStyle/commands_pallet/wcs_commandsPallet';
import wcs_sidebar from '../appStyle/sidebar/wcs_sidebar';
import SiAttach from '../commands/FilesManager/SiAttach';
import SiImportDxf from '../commands/FilesManager/ImportDxf';
import SiImportJGW from '../commands/FilesManager/ImportJGW';
import Point from "ol/geom/Point";
import wcs_modal from '../appStyle/Modal';
import AddMabar from '../commands/Texts/addMabar';
import SiArc from './SiArc';
import DrawArc3p from '../commands/Draw/DrawArc3p';
import CadastalPoint from './CadastralPoint';
import { setAppStyle } from '../appStyle/SetWebCadStyle';
import uniqid from 'uniqid'
import AddSALabel from '../commands/Texts/addSALabel';
import { createTextWithHeigth } from '../helpers/StaticText';
import SeperationApartemanLine, { getSaLineType, saLineLabelType } from './Cadastal/SeperationApratemanLine';
import { Labeling } from '../appStyle/sidebar/Labeling';
import SaLine from './Cadastal/SeperationApratemanLine';
import wcs_mapModal from '../appStyle/mapModal';
import VectorImageLayer from 'ol/layer/VectorImage';
import SaLabel from './Cadastal/SeperationApratemanLabel';
import { saLabelDetector } from '../helpers/SpilitSeprationApartemanLabel';
import { LineLabeling } from '../appStyle/sidebar/LineLabeling';
import AddSingelSALabel from '../commands/SeprationAparteman/addSingelSaLabel';
import AddMultiSALabel from '../commands/SeprationAparteman/addMultiSaLabel';
import addMultiSaLabelGhate from '../commands/SeprationAparteman/addMultiSaLablGhate';
import DrawSaLine from '../commands/SeprationAparteman/addSaLine';
import { SaObjectsType } from './Cadastal/SaObjectsType';
import SiMultiLine from './SiMultiLine';
import data from './../sample.json'
// import Triangles from './Road_Construction/Triangles';
import { topographyPoints, triangles } from '../sampleData';
import { point } from '@turf/turf';
// import contourLines from './Road_Construction/Triangles';
import SiPoint from './SiPoint';
import SiwebGlLayer from './SiwebGlLayer';
import { LineString, MultiLineString } from 'ol/geom';
import { calculateLineLablePosition } from '../helpers/CalculateLabel';
import { isEqualPoint } from '../helpers/equalPoint';
import SiImportPureDxf from '../commands/FilesManager/ImportPureDxf';
import SiPolygon from './SiPolygon';
import { sampleData } from '../sampeldataTopography';
proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");
proj4.defs("EPSG:32638", "+proj=utm +zone=38 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:32639", "+proj=utm +zone=39 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:32636", "+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:32637", "+proj=utm +zone=37 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:32640", "+proj=utm +zone=40 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:32641", "+proj=utm +zone=41 +datum=WGS84 +units=m +no_defs");
register(proj4);

// import OLCesium from 'olcs/OLCesium';

export default class SiMap {
    constructor(target, commandLine, opt_options) {
        const options = opt_options ? opt_options : {};
        this.zone = options.zone ? options.zone : 39;
        const defaultProjection = new Projection({
            units: 'm',
            code: `EPSG:326${this.zone}`
        })
        this.container = target
        this.styleMode = options.styleMode ? options.styleMode : styleModeType.noStyle
        this.maps = []
        this.labels = []
        this.storage = {}
        this.processMethod = options.processMethod ? options.processMethod : () => {}
        this.textLayer = new VectorImageLayer({
            source: new VectorSource
        })
        this.name = options.name ? options.name : `${uniqid}_map`
        this.defaultCentriodCode = {
            cms: '',
            bakhsh: '',
            nahieh: '',
            asli: '',
            mafruzi: ''
        }
        switch (this.styleMode) {
            case styleModeType.noStyle:
                // this.cadTarget = this.container
                this.appStyle = {
                    cadTarget: this.container
                }
                break;
            case styleModeType.main:
            case styleModeType.seperationAparteman:
                var pallet = [siMapCommandsPalletType.draw, siMapCommandsPalletType.modify, siMapCommandsPalletType.measure, siMapCommandsPalletType.files, siMapCommandsPalletType.seperationAparteman]
                this.appStyle = {
                    show: true,
                    panelOpen: true,
                    sideBarContent: wcs_sideBarContents_seprationAparteman(this),
                    activeSideBarContent: wcs_sideBarContents_seprationAparteman(this).find(c => c.name === wcs_sideBarContentsType.objectProperties),
                    activePalletContent: pallet.find(c => c.name === wcs_commandsPalletType.draw),
                    commandsPallet: pallet,
                    elements: []
                }
                setAppStyle(this)
                break;
            case styleModeType.arse:
                var pallet = [siMapCommandsPalletType.draw, siMapCommandsPalletType.modify, siMapCommandsPalletType.measure, siMapCommandsPalletType.files, siMapCommandsPalletType.cadastral]
                this.appStyle = {
                    show: true,
                    panelOpen: true,
                    sideBarContent: wcs_sideBarContents_arse(this),
                    activeSideBarContent: wcs_sideBarContents_arse(this).find(c => c.name === wcs_sideBarContentsType.objectProperties),
                    activePalletContent: pallet.find(c => c.name === wcs_commandsPalletType.draw),
                    commandsPallet: pallet,
                    elements: []
                }
                setAppStyle(this)
                break;
            case styleModeType.routeSurveying:
                var pallet = [siMapCommandsPalletType.draw, siMapCommandsPalletType.modify, siMapCommandsPalletType.measure, siMapCommandsPalletType.files, siMapCommandsPalletType.routeSurveying]
                this.appStyle = {
                    show: true,
                    panelOpen: true,
                    sideBarContent: wcs_sideBarContents_arse(this),
                    activeSideBarContent: wcs_sideBarContents_arse(this).find(c => c.name === wcs_sideBarContentsType.objectProperties),
                    activePalletContent: pallet.find(c => c.name === wcs_commandsPalletType.draw),
                    commandsPallet: pallet,
                    elements: []
                }
                setAppStyle(this)
                break;
            default:
                this.cadTarget = this.container
                break;
        }
        this.optionsControls = options.controls ? options.controls : {}
        this.projection = options.projection ? options.projection : defaultProjection;
        this.fullScreen = new FullScreen({})

        this.fullScreen.element.children[0].blur()
            // this.fullScreen.element.style.visibility = 'hidden'
        this.onFullScreen = false;
        this.fullScreen.on('enterfullscreen', e => {
            this.onFullScreen = true;
        })
        this.fullScreen.on('leavefullscreen', e => {
            this.onFullScreen = false;
        })
        this.commandHandler = [{
                name: commandType.Draw,
                active: true
            },
            {
                name: commandType.Modify,
                active: true
            },
            {
                name: commandType.Manager,
                active: true
            },
            {
                name: commandType.Action,
                active: true
            },
        ]
        this.commandsExceptions = []
        if (options.commands) {
            if (options.commands.draw != undefined) this.commandHandler.find(i => i.name === commandType.Draw).active = options.commands.draw
            if (options.commands.modify != undefined) this.commandHandler.find(i => i.name === commandType.Modify).active = options.commands.modify
            if (options.commands.manager != undefined) this.commandHandler.find(i => i.name === commandType.Manager).active = options.commands.manager
            if (options.commands.action != undefined) this.commandHandler.find(i => i.name === commandType.Action).active = options.commands.action
            if (options.commands.exceptions) this.commandsExceptions = options.commands.exceptions
        }
        this.activeColor = options.activeColor ? options.activeColor : 'rgba(255,255,255,1)';
        this.addViewsMap('open layers map', 39, engineType.openlayers2D)
            // this.addViewsMap('test map', 38, engineType.cesium3D)
        this.setMap(this.maps[0])
        this.map.on('movestart', e => {
            // console.log(this.calcLabelInView().length)
            this.labels.forEach(label => {
                    // this.map.removeLayer(label.imageLayer)
                })
                // console.log('move start')

        })
        this.dataId = options.dataId
        if (this.dataId) {
            this.load()
        }
        this.map.on('moveend', e => {
                // console.log(this.map.getView().getZoom())
            })
            // console.log(epictype['Export Worksheet'].length)
            // var sa = new SaLine([10, 5], [23, 1], {
            //         layer: this.activeLayer
            //     })
            // sa.setLabel()
            // sa.select()

        // new SiStaticText('دیواریست به', sa.getCenter(), 0.2, sa.getAngle() * Math.PI / 180, {
        //     layer: this.activeLayer,
        //     anchor: anchorType.left_mid,
        //     stringType: stringType.normal
        // })
        // new SiStaticText('دیوار دیواریست به', sa.getCenter(), 0.2, sa.getAngle() * Math.PI / 180, {
        //     layer: this.activeLayer,
        //     anchor: anchorType.mid_top,
        //     stringType: stringType.normal
        // })
        // new SaLabel([0, 0], 0.2, 0, {
        //         layer: this.activeLayer,
        //         anchor: anchorType.mid_top,
        //         stringType: stringType.normal,
        //         useCase: 1,
        //         samt: 2,
        //         ghate: 1,
        //         asli: 345,
        //         fari: 234,
        //         rights: 'این آپارتمان از پارکینگ 2 و 3 حق عبور دارد',
        //         isAparteman: true,
        //         coolerChannel: 3,
        //         block: 1,
        //         sathNumber: 3,
        //         hasDocument: true
        //     })
        // createTextWithHeigth(this.appStyle.cadTarget, 'salam', 0.1, 90, 'svg')
        // this.map = this.maps[0].map
        // this.initMap()
        // console.log(Math.asin(-0.048783292014))
        // console.log(Math.cos(-0.048778646936))
        // this.siCommand.execCommand('showstyle')
        // new SiMultiLine([
        //         [
        //             [0, 0],
        //             [10, 0]
        //         ],
        //         [
        //             [25, -30],
        //             [123, 34]
        //         ]
        //     ], {
        //         layer: this.activeLayer
        //     })
        // new Triangles([
        //         [0, 0],
        //         [10, 2],
        //         [3, 45]
        //     ], {
        //         layer: this.activeLayer
        //     })
        // new SiArc([0, 0], 10, 215, 45, {
        //         layer: this.defaultLayer
        //     })
        // var map = this.map
        // var script = document.createElement('script')
        // script.type = 'text/javascript'
        // script.src = '../src/Cesium-1.97/Source/Cesium.js'
        // document.body.appendChild(script)
        // const ol3d = new OLCesium({ map: map }); // ol2dMap is the ol.Map instance
        // const scene = ol3d.getCesiumScene();
        // scene.terrainProvider = Cesium.createWorldTerrain();
        // ol3d.setEnabled(true);
        // new SiLine([-49.80739833410853,-18.640493388513654],[-8.819194843686141,7.218556457538163],{layer:this.defaultLayer})
        // console.log(this.map.getInteractions())
        // SiSelectInit(this)
        // this.siCommand.execCommand('addcl')
    }
    initMap() {
        this.map.addControl(this.fullScreen)
        this.layers = []
        this.textCollectionSource = new VectorSource;


        this.activeBaseLayerIndex = undefined
        this.setZone(this.zone);
        this.globalBaseLayers = [{
                name: 'Google Map',
                source: new XYZ({
                    url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
                    projection: 'EPSG:3857',
                }),
            },
            {
                name: 'OSM',
                source: new OSM()
            }
        ]
        this.baseLayers = [...this.globalBaseLayers]
        this.dragPan = new DragPan({
            condition: (mapBrowserEvent) => {
                mapBrowserEvent.preventDefault()
                if (mapBrowserEvent.originalEvent.button === 1) return true
            }
        })
        this.modalOpen = false;
        this.panelInputFocus = false;
        this.map.addInteraction(this.dragPan);
        this.map.getTargetElement().setAttribute("tabIndex", "0");
        this.mapFocus();
        // this.map.addLayer(new TileLayer({
        //     visible:true,
        //     source: new XYZ({
        //       url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
        //       projection: 'EPSG:3857',
        //     }),
        //   }),)
        // this.map.addLayer(new TileLayer({
        //     visible:true,
        //     source: new OSM()
        //   }),)
        this.dragCollection = new Collection;
        // this.drag = new Translate({
        //     features:this.dragCollection
        // })
        // this.drag.on('translatestart',e=>{
        //     this.clearModify()
        // })
        // this.drag.on('translateend',e=>{
        //     e.features.forEach(feature=>{
        //         feature.setModifyPoint()
        //     })
        // })
        // this.map.addInteraction(this.drag)

        this.map.on('pointermove', e => {
                // e.preventDefault()
                // this.map.getTargetElement().focus();
                this.ImportDxfControl.element.focus()
                    // console.log(this.siCommand.currentCommand)
                    // console.log(this.siCommand.currentCommand)
                if (this.siCommand.currentCommandLine === '' && !this.siCommand.currentCommand) {
                    this.siCommand.currentDefaultMessage = undefined
                    this.siCommand.setInputMessageElement(undefined)
                }
            })
            // console.log(this.map.getRenderer())

        this.labelCollection = [];
        this.modify = new VectorSource
            // console.log(this.map.getInteractions())
        this.map.addLayer(new VectorLayer({
            source: this.modify,
            zIndex: 100
        }))
        this.map.getTargetElement().style.cursor = cursorStyle.normal
        this.map.on('rendercomplete', e => {
            // console.timeEnd('renderTime')
        })

        this.map.on('moveend', e => {
            // console.log(e)
            // console.log(this.map.getView().getZoom())
            // this.currentScale = getScaleFromResolution(this.map.getView().getResolution(),this.map.getView().getProjection().getUnits())
            // // console.log(this.currentScale)
            // console.log(this.calcLabelInView())
            this.labelCollection.forEach(label => {
                if (this.map.getView().getZoom() >= label.minZoom) {
                    if (!label.visible) {
                        // console.log('s3214')
                        label.show();
                        label.render();
                    }
                } else {
                    if (label.visible) {
                        label.hide();
                        label.render();
                    }
                }
                if (!label.firstRender) {
                    label.render()
                    label.firstRender = true;
                }
            })

            // if(this.map.getView().getZoom() > 20){
            //     this.labelCollection.forEach(label=>{
            //         label.show();
            //         label.render()
            //     })
            // }
            // else{
            //     this.labelCollection.forEach(label=>{
            //         label.hide();
            //         label.render()
            //     })
            // }
            // let totalText = this.calcTextCounInView();
            // // console.log(totalText)
            // // let texts = this.textCollectionSource.getFeatures(); 
            // if(totalText.length > 50){
            //     totalText.forEach(text => {
            //         text.hide();
            //         text.render();
            //     });
            // }
            // else{
            //     totalText.forEach(text => {
            //         text.show();
            //         text.render();
            //     });
            // }
        })
        this.siActions = new SiActions(this);
        this.commandHandler = [{
                name: commandType.Draw,
                active: true
            },
            {
                name: commandType.Modify,
                active: true
            },
            {
                name: commandType.Manager,
                active: true
            },
            {
                name: commandType.Action,
                active: true
            },
        ]
        this.commandsExceptions = []

        // this.siSelect = new SiSelect(this)
        this.parser = new SiParser(this);
        // this.commandLine = commandLine
        this.siInteraction = new SiInteraction({ siMap: this })
            // this.textArea = options.textArea ? options.textArea : undefined;
        this.mapScale = 2000;
        this.interactions = []
        this.Params = {
            selectedText: ''
        }
        this.ImportDxfControl = new ImportDxfControl({
            siMap: this
        })
        this.ExportDxfControl = new ExportDxfControl({
            siMap: this
        })
        this.siSnap = new SiSnap(this)
            // this.map.on('p')
        this.siCommand = new SiCommand(this)
        this.defaultLayer = new SiLayer({
            siMap: this,
            name: '0',
            shouldMapExtentToThis: false,
            textColor: 'rgba(255,255,255,1)',
            // color:'rgba(255,255,255,1)',
        })
        this.activeLayer = this.defaultLayer
        this.init()
            // this.mapModify = new SiModify(this)
        this.lockCursor = new Feature({
            geometry: new Point([0, 0])
        })
        const stroke = new Stroke({ color: 'white', width: 1, lineDash: [8, 0, 8] });
        const fill = new Fill({ color: 'white' });
        const iconStyle = new Style({
            image: new RegularShape({
                fill: fill,
                stroke: stroke,
                points: 4,
                radius: 32,
                radius2: 0,
                angle: 0,
            }),
        })

        this.lockCursor.setStyle(iconStyle)
            // this.siMap.modify.addFeature(point)

        this.data = new Collection
        this.geoJsonExport = undefined
        SiSelectInit2(this)
        this.controls = []
            // this.controlsInit()
        this.mapImage = undefined
        this.zoomFeature = undefined
        this.siExport = new SiExport(this)
        this.mapPopup = new SiMapPopup(this)
        this.defArea = undefined;
        this.baseLayer = new TileLayer({
            visible: true,
            isBaseLayer: false,
            zIndex: 0
        });
        this.map.addLayer(this.baseLayer)
        this.orthophoto = []
        this.map.on('pointermove', e => {
            this.currentCursorPostion = e.coordinate_
            this.currentCursorPixel = e.pixel_
                // return true
        })
        this.map.on('pointerdrag', e => {
            // console.log(e.pixel)
            this.currentCursorDragPixel = e.pixel
        })
        this.modifyLayers = []
        this.idOverlay = new Overlay({
            element: document.createElement('div'),
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
        });
        this.map.addOverlay(this.idOverlay)
    }
    addViewsMap(name, zone, engine) {
        switch (engine) {
            case engineType.openlayers2D:
                let container = document.createElement('div')
                container.style.width = '100%'
                container.style.height = '100%'
                container.style.display = 'none'
                container.addEventListener('focus', e => {
                    container.style.outline = 'none'
                }, false)
                this.appStyle.cadTarget.appendChild(container)
                    // container.className = 'wcs'
                this.maps.push({
                    name: name,
                    map: new Map({
                        target: container,
                        layers: [],
                        interactions: defaults({
                            altShiftDragRotate: false,
                            doubleClickZoom: false,
                            dragPan: false,
                            KeyboardZoom: false
                        }),
                        controls: defaultControl({
                            attribution: false,
                            zoom: false,
                            rotate: false,
                            rotateOptions: false,
                            zoomOptions: false,
                            attributionOptions: false
                        }),
                    }),
                    container: container
                })
                break;
            default:
                break;
        }
    }
    createTriangles(points = topographyPoints, tri = triangles) {
        let mainCountor = 1;
        let zList = []
        let countorList = {}
            // class surfaceLine extends SiLine{
            //     constructor(params) {

        //     }
        // }
        points.forEach(point => {
            let a = new SiStaticText(`${point.id}`, [point.x, point.y], 2, 0, {
                layer: this.activeLayer,
            })
            a.boxSelect = () => (false)
            a.select = () => (false)
            zList.push(point.z)
        })
        let maxZ = zList.reduce((a, b) => Math.max(a, b), -Infinity);
        let minZ = zList.reduce((a, b) => Math.min(a, b), +Infinity);
        var m = (minZ / mainCountor) - ((minZ / mainCountor) % 1);
        // console.log(m);
        let heightIndex = m * mainCountor
        while (heightIndex < maxZ) {
            countorList[heightIndex] = []
            heightIndex += mainCountor
        }
        // console.log(countorList);
        // console.log(max, min);
        // new contourLines(points, {
        //     layer: this.activeLayer
        // })
        // let tri = triangles
        // console.log(tri)
        // console.log(tri.length);
        let triList = []
        let surfaceLayer = new SiLayer({
                siMap: this,
                frozen: false,
                // visible:false,
                name: 'surfacelayer'
            })
            // console.log(tri.length)
        this.storage.routeSurveying = {}
        this.storage.routeSurveying.points = points
        this.storage.routeSurveying.surfaceLine = []
        this.storage.routeSurveying.triangles = []
        tri.forEach((triangle, index) => {

            let triObj = {
                id: uniqid(),
                list: triangle
            }
            this.storage.routeSurveying.triangles.push(triObj)
            for (let index = 0; index < triangle.length; index++) {
                let point, nextPoint, endPoint;
                let startPoint = points[triangle[index]]
                endPoint = points[triangle[index + 1]]
                if (index === triangle.length - 1) {
                    endPoint = points[triangle[0]]
                }
                // if (triangle[index + 1]) {
                //     endPoint = points[triangle[index + 1]]
                // } else {
                //     endPoint = points[triangle[0]]
                // }
                // console.log(startPoint);
                point = [startPoint.x, startPoint.y]
                nextPoint = [endPoint.x, endPoint.y]
                console.log(point, nextPoint);
                let hasLine = this.storage.routeSurveying.surfaceLine.find(line => line.isEqual(point, nextPoint))
                    // console.log(hasLine);
                if (!hasLine) {
                    let line = new SiLine(point, nextPoint, { layer: surfaceLayer })
                        // line.appendAttributes()
                    line.isEqual = (point, nextPoint) => {
                        let coordinates = line.getGeometry().getCoordinates()
                        let condition1 = (isEqualPoint(point, coordinates[0], 1000) && isEqualPoint(nextPoint, coordinates[1], 1000))
                        let condition2 = (isEqualPoint(point, coordinates[1], 1000) && isEqualPoint(nextPoint, coordinates[0], 1000))
                        if (condition1 || condition2) return true
                        else return false
                    }
                    line.appendAttributes('surface', {
                        startPoint: startPoint,
                        endPoint: endPoint,
                        triangles: [triObj.id],
                    })
                    line.select = () => {
                        // console.log(line.attributes);
                        // console.log(line.attributes['surface']);
                        let triangles = line.attributes['surface'].triangles
                        console.log(triangles);
                        if (triangles.length > 1) {
                            let triSource1 = this.storage.routeSurveying.triangles.find(tri => tri.id === triangles[0])
                            let triSource2 = this.storage.routeSurveying.triangles.find(tri => tri.id === triangles[1])
                            // console.log(triSource1, triSource2, 'triangles');
                            let lines = []
                            this.storage.routeSurveying.surfaceLine.forEach(sline => {
                                    let tris = sline.attributes['surface'].triangles
                                    let c1 = tris.indexOf(triSource1.id)
                                    let c2 = tris.indexOf(triSource2.id)
                                    if ((c1 != -1 || c2 != -1) && (line.id != sline.id)) {
                                        if (c1 != -1) tris.splice(c1, 1)
                                        if (c2 != -1) tris.splice(c2, 1)
                                        lines.push(sline)
                                        // sline.setStyle(new Style({
                                        //     stroke:new Stroke({
                                        //         color:'rgba(255,214,12,1)'
                                        //     })
                                        // }))
                                    }
                                })
                                // console.log(lines, 'sa');
                            this.storage.routeSurveying.triangles.splice(this.storage.routeSurveying.triangles.indexOf(triSource1), 1)
                            this.storage.routeSurveying.triangles.splice(this.storage.routeSurveying.triangles.indexOf(triSource2), 1)
                                // console.log(this.storage.routeSurveying.triangles, 'rt');
                                // return true
                            let triangle1 = triSource1.list
                            let triangle2 = triSource2.list
                            console.log(triangle1, triangle2, 'pre');
                            // let startPointId = line.attributes['surface'].startPoint.id
                            // let endPointId = line.attributes['surface'].endPoint.id
                            // triangle1.splice(triangle1.indexOf(startPointId), 1)
                            // triangle1.splice(triangle1.indexOf(endPointId), 1)
                            // triangle2.splice(triangle2.indexOf(startPointId), 1)
                            // triangle2.splice(triangle2.indexOf(endPointId), 1)
                            let subscription = []
                            triangle1.forEach(elm=>{              
                                if( triangle2.indexOf(elm) != -1){
                                    subscription.push(elm)
                                }
                            })
                            subscription.forEach(elm=>{
                                triangle1.splice(triangle1.indexOf(elm),1)
                                triangle2.splice(triangle2.indexOf(elm),1)
                            })
                            console.log(triangle1, triangle2, 'pre1');
                            triangle1.push(triangle2[0]);
                            triangle2.push(triangle1[0]);
                            triangle1.push(subscription[0]);
                            triangle2.push(subscription[1]);
                            console.log(triangle1, 't1');
                            console.log(triangle2, 't2');
                            let newTri1 = {
                                id: uniqid(),
                                list: triangle1
                            }
                            let newTri2 = {
                                id: uniqid(),
                                list: triangle2
                            }
                            this.storage.routeSurveying.triangles.push(newTri1)
                            this.storage.routeSurveying.triangles.push(newTri2)
                                // console.log(triangle1, triangle2, 'pre2');
                            let newStartPoint = points[triangle1[0]]
                            let newEndPoint = points[triangle2[0]]
                            line.setGeometry(new LineString([
                                [newStartPoint.x, newStartPoint.y],
                                [newEndPoint.x, newEndPoint.y]
                            ]))
                            line.attributes.surface = {
                                startPoint: newStartPoint,
                                endPoint: newEndPoint,
                                triangles: [newTri1.id, newTri2.id]
                            }
                            lines.forEach(sline => {
                                    // console.log(sline.attributes);
                                    // multipleExist(entity.text, ['F', 'M', 'G'])
                                    let c1 = multipleExist(newTri1.list, [sline.attributes.surface.startPoint.id, sline.attributes.surface.endPoint.id])
                                    let c2 = multipleExist(newTri2.list, [sline.attributes.surface.startPoint.id, sline.attributes.surface.endPoint.id])
                                        // let c1 = (sline.attributes.surface.startPoint.id === newTri1.list[0] || sline.attributes.surface.endPoint.id === newTri1.list[0])
                                        // let c2 = (sline.attributes.surface.startPoint.id === newTri2.list[0] || sline.attributes.surface.endPoint.id === newTri2.list[0])
                                        // console.log(c1, c2);
                                    if (c1 && c2) console.log('wtf');
                                    if (c1) {
                                        // console.log('1');
                                        sline.attributes.surface.triangles.push(newTri1.id)
                                    } else if (c2) {
                                        // console.log('2');
                                        sline.attributes.surface.triangles.push(newTri2.id)
                                    } else {
                                        console.log('else')
                                        console.log(sline.attributes.surface)
                                        console.log(newTri1.list)
                                        console.log(newTri2.list) 
                                        console.log(c1, c2, 'else');
                                    }
                                })
                                // console.log(line.attributes)
                        }
                        // console.log(this.storage.routeSurveying.triangles, 2);
                        return true
                    }
                    this.storage.routeSurveying.surfaceLine.push(line)
                } else {
                    // console.log(hasLine.attributes);
                    hasLine.attributes['surface'].triangles.push(triObj.id)
                }
            }

        })
    }
    createCountorLines(points = this.storage.routeSurveying.points, tri = this.storage.routeSurveying.triangles) {
        console.log(tri)
            // let points = this.storage.
            // let glLayer = new SiwebGlLayer({
            //     siMap: this,
            //     name: 'glLayer',
            //     shouldMapExtentToThis: false,
            //     textColor: 'rgba(255,255,255,1)',
            // })

        // function getRndInteger(min, max) {
        //     return Math.floor(Math.random() * (max - min)) + min;
        // }
        // let total = 1000000;
        // let index = 0;
        // console.time('time')
        // let features = new Collection
        // let coord = []
        // while (index < total) {
        //     const coord1 = [index, 0]
        //     const coord2 = [index, 10]
        //         // new SiLine(coord1, coord2, {
        //         //     layer: glLayer
        //         // })
        //     coord.push([coord1, coord2])

        //     // features.push(f)
        //     // glLayer.source.addFeatures()
        //     // glLayer.source.addFeature(f)
        //     index++
        // }
        // let f = new Feature({
        //         geometry: new MultiLineString(coord)
        //     })
        //     // glLayer.Layer.setSource(new VectorSource({
        //     //     features: features
        //     // }))
        // glLayer.Layer.setSource(new VectorSource({}))
        // glLayer.Layer.getSource().addFeature(f)
        // console.log(features)
        // console.timeEnd('time')
        // console.log(getRndInteger(100, 150))
        // let points = topographyPoints
        // let points = points
        let mainCountor = 1;
        let zList = []
        let countorList = {}
        points.forEach(point => {
            new SiStaticText(`${point.z}`, [point.x, point.y], 0.2, 0, {
                layer: this.activeLayer,
            })
            zList.push(point.z)
        })
        let maxZ = zList.reduce((a, b) => Math.max(a, b), -Infinity);
        let minZ = zList.reduce((a, b) => Math.min(a, b), +Infinity);
        var m = (minZ / mainCountor) - ((minZ / mainCountor) % 1);
        // console.log(m);
        let heightIndex = m * mainCountor
        while (heightIndex < maxZ) {
            countorList[heightIndex] = []
            heightIndex += mainCountor
        }
        // console.log(countorList);
        // console.log(max, min);
        // new contourLines(points, {
        //     layer: this.activeLayer
        // })
        // let tri = triangles
        // console.log(tri)
        // console.log(tri.length);
        let triList = []
        let triangleLayer = new SiLayer({
                siMap: this,
                frozen: false,
                // visible:false,
                name: 'triLayer'
            })
            // console.log(tri.length)
        tri.forEach(triangleObj => {
            // console.log(triangle)
            let triangle = triangleObj.list
            let coordinates = []
            let xyz = []
                // console.log(triangle.length)
            for (let index = 0; index < triangle.length; index++) {
                const element = triangle[index];
                // console.log(element);

                coordinates.push([points[triangle[index]].x, points[triangle[index]].y])
                xyz.push(points[triangle[index]])
                    // console.log(coordinates);
            }
            coordinates.push([points[triangle[0]].x, points[triangle[0]].y])
            xyz.push(points[triangle[0]])
                // console.log(coordinates);

            var triPoly = new SiPolygon([coordinates], { layer: triangleLayer, color: "rgba(255,0,0,1)", selectable: false })
                // triPoly.setStyle(null)
            triPoly.setProperties({
                xyz: xyz
            })
            triList.push(triPoly)
        })

        let countorLine = {}
        triList.forEach(triPoly => {
                // console.log(triPoly.getGeometry().getCoordinates()[0])
                let triCountorList = {}
                    // triPoly.appendAttributes('countorList',{})
                    // console.log(triPoly.getGeometry().getCoordinates()[0])
                let xyz = triPoly.get('xyz')
                    // console.log(xyz)
                triPoly.getGeometry().getCoordinates()[0].forEach((vertex, index) => {
                    // console.log(xyz)
                    // console.log('how');
                    if (!xyz[index + 1]) return
                        // console.log(vertex,'vertex')
                    let X = parseFloat(xyz[index].x);
                    let Y = parseFloat(xyz[index].y);
                    let Z = parseFloat(xyz[index].z);
                    let nX = parseFloat(xyz[index + 1].x);
                    let nY = parseFloat(xyz[index + 1].y);
                    let nZ = parseFloat(xyz[index + 1].z);
                    let X0 = parseFloat(xyz[0].x);
                    let Y0 = parseFloat(xyz[0].y);
                    let Z0 = parseFloat(xyz[0].z);
                    let z2, z1, x1, y1, x2, y2;
                    // if (index < triPoly.getGeometry().getCoordinates()[0].length - 2) {
                    z2 = Math.round(Math.max(Z, nZ) * 1000) / 1000
                    z1 = Math.round(Math.min(Z, nZ) * 1000) / 1000
                        // console.log(z1,z2)
                    if (z2 === nZ) {
                        // console.log('r')
                        x2 = nX
                        y2 = nY
                        x1 = X
                        y1 = Y
                    } else {
                        // console.log('l')
                        x2 = X
                        y2 = Y
                        x1 = nX
                        y1 = nY
                    }
                    // }
                    // if (index === triPoly.getGeometry().getCoordinates()[0].length - 2) {
                    //     z2 = Math.round(Math.max(xyz[parseFloat(index)].z, xyz[0].z) * 1000) / 1000
                    //     z1 = Math.round(Math.min(xyz[parseFloat(index)].z, xyz[0].z) * 1000) / 1000
                    //     if (z2 === xyz[0].z) {
                    //         x2 = X0
                    //         y2 = Y0
                    //         x1 = X
                    //         y1 = Y
                    //     } else {
                    //         x2 = X
                    //         y2 = Y
                    //         x1 = X0
                    //         y1 = Y0
                    //     }
                    // }

                    if (z1 && z2) {
                        var m = (z1 / mainCountor) - ((z1 / mainCountor) % 1);
                        // console.log(m);
                        let firstHeightIndex = m * mainCountor
                            // console.log(z1,z2,firstHeightIndex)
                            // console.log(firstHeightIndex, z1);
                        if (firstHeightIndex < z1) firstHeightIndex += mainCountor
                        while (firstHeightIndex < z2) {
                            // console.log(firstHeightIndex);
                            let cx = (x2 - x1) / (z2 - z1)
                            let cy = (y2 - y1) / (z2 - z1)
                            let X = cx * (firstHeightIndex - z1) + x1
                            let Y = cy * (firstHeightIndex - z1) + y1
                                // countorList[firstHeightIndex].push([X, Y])
                                // console.log(triCountorList)
                                // new SiPoint(X, Y, { layer: this.activeLayer })
                            if (firstHeightIndex in triCountorList) {
                                // console.log(triCountorList[firstHeightIndex]) 
                                triCountorList[firstHeightIndex].push([X, Y])

                            } else {
                                // console.log(triCountorList[firstHeightIndex],'is un')
                                triCountorList[firstHeightIndex] = []
                                triCountorList[firstHeightIndex].push([X, Y])
                            }
                            firstHeightIndex += mainCountor
                        }
                        // console.log(z2 % 1);
                        // console.log(z1 % 1);
                    }
                })
                triPoly.appendAttributes('triCountorList', triCountorList)
            })
            // console.log(countorList);
        triList.forEach(triPoly => {
                // console.log(triPoly.attributes)
                console.log(triPoly)
                for (const key in triPoly.getAttribute('triCountorList')) {
                    // let lines = []
                    if (Object.hasOwnProperty.call(triPoly.getAttribute('triCountorList'), key)) {
                        const countor = triPoly.getAttribute('triCountorList')[key];
                        // console.log(countor,key,triPoly.id)
                        // console.log(key,countor);
                        // new SiMultiLine([countor], { layer: this.activeLayer, label: key })
                        countorList[key] = [...countorList[key], countor]
                    }
                }

            })
            // console.log(countorList);
        for (const key in countorList) {
            if (Object.hasOwnProperty.call(countorList, key)) {
                const countor = countorList[key];
                // console.log(key,countor);
                let countorLine = new SiMultiLine(countor, { layer: this.activeLayer, label: key })
                    // countorLine.select = () => (false)
                    // countorLine.boxSelect = () => (false)
            }
        }
        // console.log(triList[0].get('xyz'));
    }
    setMap(mapObject) {
        if (this.map) this.map.getTargetElement().style.display = 'none'
            // console.log(this.map)
        mapObject.container.style.display = 'block'
            // this.cadTarget.removeChild(this.cadTarget.children[0])
        this.map = mapObject.map
        this.initMap()
        this.map.updateSize()
            // this.map.updateSize()
    }
    mapFocus() {
        // console.log('focus')
        this.focus = true;
        this.map.getTargetElement().focus()
    }
    mapBlur() {
        // console.log('blur')
        this.focus = false;
        this.map.getTargetElement().blur()
    }
    setWcsSideBarContent(name) {
        // console.log(name)
        let content = this.appStyle.sideBarContent.find(c => c.name === name);
        if (content) {
            this.appStyle.activeSideBarContent = content
        }
    }
    setWcsCommandsPalletContent(name) {
        // console.log(name)
        let content = this.appStyle.commandsPallet.find(c => c.name === name);
        if (content) {
            this.appStyle.activePalletContent = content
        }
    }
    setBaseLayer(source) {
        if (this.baseLayer.getSource()) this.baseLayer.setSource(null)
        this.baseLayer.setSource(source)
    }
    removeBaseLayer() {
        this.baseLayer.setSource(null)
    }
    getLinesCoordinatesChange() {
        let results = {
            add: [],
            remove: []
        }
        let actionsChange = this.siActions.getActions();
        let ActionIndex = this.siActions.getCurrentActionIndex();
        for (let index = 0; index < ActionIndex; index++) {
            const action = actionsChange[index];
            switch (action.type) {
                case mapActionsType.addEntity:
                    action.entities.forEach(entity => {
                        if (entity.entityType === EntityType.line) {
                            results.add.push(entity.getGeometry().getCoordinates())
                        }
                    })
                    break;
                case mapActionsType.removeEntity:
                    action.entities.forEach(entity => {
                        if (entity.entityType === EntityType.line) {
                            results.remove.push(entity.getGeometry().getCoordinates())
                        }
                    })
                    break;
                case mapActionsType.modify:
                    action.geometryCollection.forEach(item => {
                        if (item.entity.entityType === EntityType.line) {
                            results.add.push(item.newGeometry.getCoordinates())
                            results.remove.push(item.oldGeometry.getCoordinates())
                        }
                    })
                    break;
                default:
                    break;
            }
        }
        return results
    }
    setCursorStyle(style) {
        // console.log(style)
        this.map.getTargetElement().style.cursor = style
    }
    getFontSize(height) {
        // console.log(this.currentScale)
        return height / (Point2M * 1)
    }
    addControlButton(option) {
        let opt_options = {...option, siMap: this }
        let newBtn = new CustomControlButton(opt_options)
        this.map.addControl(newBtn)
        return newBtn
    }
    calcTextCounInView() {
            let totalText = []
            let extent = this.map.getView().calculateExtent(this.map.getSize());
            this.textCollectionSource.forEachFeatureInExtent(extent, (entity) => {
                if (entity.entityType === EntityType.text) {
                    // console.log(entity)
                    totalText.push(entity)
                }
            });
            return totalText;
        }
        // calcLabelInView() {
        //     let totalText = []
        //     let extent = this.map.getView().calculateExtent(this.map.getSize());
        //     // console.log(this.labelsSource.getFeatures())
        //     this.labelsSource.forEachFeatureInExtent(extent, (feature) => {
        //         totalText.push(feature)
        //     });
        //     return totalText;
        // }
    getCursorPosition() {
        return this.currentCursorPostion
    }
    getCursorPixel() {
        console.log(this.currentCursorPixel)
        return this.currentCursorPixel
    }
    setZoomTarget(feature) {
        this.zoomFeature = feature;
        this.zoomToTarget(feature);
    }
    zoomToExtent(extent, Scale) {
        let map = this.map
        map.getView().fit(extent, map.getSize())
        map.getView().setZoom(map.getView().getZoom() + Scale)
    }
    zoomToLayer(name, scale = 0) {
        let map = this.map
        let layer = this.layers.find(siLayer => siLayer.name === name)
        if (layer) {
            map.getView().fit(layer.source.getExtent(), map.getSize())
            map.getView().setZoom(map.getView().getZoom() + scale)
        }

    }
    zoomToAll() {
        let entites = this.getAllEntites();
        this.zoomToExtent(this.calcExtentFromFeaturesCollection(entites), 0)
    }
    zoomToTarget(feature, scale = 0) {
        let map = this.map
        let extent = feature.getGeometry().getExtent();
        map.getView().fit(extent, map.getSize())
        map.getView().setZoom(map.getView().getZoom() + scale)
    }
    getZoomTarget() {
        return this.zoomFeature
    }
    getAllFeature() {
        let allFeautre = []
        this.layers.forEach(layer => {
            let entities = layer.source.getFeatures();
            entities.forEach(entity => {
                if ((entity.entityType != EntityType.text && entity.entityType != EntityType.label)) {
                    allFeautre.push(entity)
                }
            })
        });
        return allFeautre;
    }
    getAllEntites() {
        let allFeautre = []
        this.layers.forEach(layer => {
            let entities = layer.source.getFeatures();
            entities.forEach(entity => {
                allFeautre.push(entity)
            })
        });
        return allFeautre;
    }
    getAllEntitiesByType(entityType) {
        let allFeautre = []
        this.layers.forEach(layer => {
            let entities = layer.source.getFeatures();
            entities.forEach(entity => {
                if (entity.entityType === entityType) {
                    allFeautre.push(entity)
                }
            })
        });
        return allFeautre;
    }
    setActiveLayer(siLayer) {
        this.activeLayer = siLayer;
    }
    exportSiMap() {

    }
    exportEntites() {
        let entites = this.getAllEntites();
        let exEntites = []
        entites.forEach(entity => {
            let entityObj = {}
            if (entity.entityType === EntityType.label) {
                entityObj.type = EntityType.text;
            } else {
                entityObj.type = entity.entityType;
            }
            entityObj.layer = entity.siLayer.name;
            entityObj.process = entity.siLayer.process;
            // console.log(colorsMapper.list())
            switch (entity.entityType) {
                case EntityType.text:
                    entityObj.rotation = entity.text.rotate;
                    entityObj.startPoint = { x: entity.text.center[0], y: entity.text.center[1], z: 0 };
                    entityObj.textHeight = entity.text.textHeight ? entity.text.textHeight : 0.1;
                    entityObj.text = entity.text.string;
                    break;
                case EntityType.label:
                    var center = entity.getGeometry().getCoordinates();
                    entityObj.rotation = entity.rotaiton
                    entityObj.startPoint = { x: center[0], y: center[1], z: 0 };
                    entityObj.textHeight = 0.1;
                    entityObj.text = entity.text;
                    break;
                case EntityType.line:
                    // console.log(entity)
                    var coordinates = entity.getGeometry().getCoordinates()
                    if (coordinates.length > 2) {
                        entityObj.vertices = []
                        entityObj.type = EntityType.polyline
                            // console.log(entity.siLayer)
                            // console.log(entity.getGeometry())
                        entityObj.scale = entity.scale;
                        var coordinates = entity.getGeometry().getCoordinates()
                        for (let index = 0; index < coordinates.length; index++) {
                            const coordinate = coordinates[index];
                            entityObj.vertices.push({ x: coordinate[0], y: coordinate[1], z: 0 })
                        }
                        break;
                    }
                    entityObj.vertices = []
                        // console.log(entity.getGeometry())
                    for (let index = 0; index < coordinates.length; index++) {
                        const coordinate = coordinates[index];
                        entityObj.vertices.push({ x: coordinate[0], y: coordinate[1], z: 0 })
                    }
                    entityObj.scale = entity.scale;
                    break;
                case EntityType.circle:
                    // console.log(entity)
                    var center = entity.getGeometry().getCenter()
                    entityObj.center = { x: center[0], y: center[1], z: 0 };
                    // console.log(entity.getGeometry())
                    entityObj.radius = entity.getGeometry().getRadius()
                    break;
                case EntityType.polyline:
                    // console.log(entity)
                    entityObj.vertices = []
                        // console.log(entity.getGeometry())
                    var coordinates = entity.getGeometry().getCoordinates()
                    for (let index = 0; index < coordinates.length; index++) {
                        const coordinate = coordinates[index];
                        entityObj.vertices.push({ x: coordinate[0], y: coordinate[1], z: 0 })
                    }
                    break;
                default:
                    break;
            }
            exEntites.push(entityObj)
        })
        return exEntites
    }
    exportSaData(isBd = false) {
        let entites = this.getAllEntites();
        // console.log(entites)
        let exEntites = []
        let layers = []
        entites.forEach(entity => {
                let entityObj = {}
                if (entity.entityType === EntityType.label || entity.entityType === EntityType.staticText) {
                    entityObj.type = EntityType.text;
                } else {
                    entityObj.type = entity.entityType;
                }
                var hasLayer = layers.find(l => l.name === entity.siLayer.name)
                if (!hasLayer) {
                    layers.push({
                        name: entity.siLayer.name,
                    })
                }
                entityObj.layer = entity.siLayer.name;
                entityObj.process = entity.siLayer.process;
                entityObj.entityId = entity.id;
                entityObj.olId = entity.getId();
                switch (entity.entityType) {
                    case EntityType.text:
                        entityObj.rotation = entity.text.rotate;
                        entityObj.startPoint = { x: entity.text.center[0], y: entity.text.center[1], z: 0 };
                        entityObj.textHeight = entity.text.textHeight ? entity.text.textHeight : 0.1;
                        entityObj.text = entity.text.string;
                        break;
                    case EntityType.label:
                        var center = entity.getGeometry().getCoordinates();
                        entityObj.rotation = entity.rotaiton
                        entityObj.startPoint = { x: center[0], y: center[1], z: 0 };
                        entityObj.textHeight = 0.1;
                        entityObj.text = entity.text;
                        break;
                    case EntityType.staticText:
                        if (entity.textType === 'label') break;
                        var center = entity.actualCenter;
                        entityObj.rotation = entity.angle * 180 / Math.PI
                        entityObj.startPoint = { x: center[0], y: center[1], z: 0 };
                        entityObj.textHeight = entity.textHeight;
                        if (!isBd) entityObj.text = entity.text;
                        else entityObj.text = entity.id;
                        if (entity.objectType = SaObjectsType.label) {
                            // console.log(entityObj)
                            let direction;
                            for (const key in samtListType) {
                                if (Object.hasOwnProperty.call(samtListType, key)) {
                                    const element = samtListType[key];
                                    // console.log(1, entity.samt, element)
                                    if (element.code === parseFloat(entity.samt)) direction = element.code
                                }
                            }
                            // lineweight

                            if (!isBd) entityObj.text = entity.label;
                            else entityObj.text = entity.id;
                            entityObj.properties = {
                                epictype: oraUseCodes.A266FF2A662E84b639DA[entity.useCase],
                                directon: direction ? direction : "",
                                ghate: entity.ghate,
                                asli: entity.asli,
                                fari: entity.fari,
                                ertefaghi: entity.rights,
                                isAparteman: entity.isAparteman,
                                coolerChannel: entity.coolerChannel,
                                blocksNumber: entity.block,
                                sathNumber: entity.sathNumber,
                                hasDoc: entity.hasDocument,
                                stringLabel: entity.stringLabel
                            }
                        }
                        break;
                    case EntityType.line:
                        // console.log(entity)
                        var coordinates = entity.getGeometry().getCoordinates()
                        if (coordinates.length > 2) {
                            entityObj.vertices = []
                            entityObj.type = EntityType.polyline
                                // console.log(entity.siLayer)
                                // console.log(entity.getGeometry())
                            entityObj.scale = entity.scale;

                            var coordinates = entity.getGeometry().getCoordinates()
                            for (let index = 0; index < coordinates.length; index++) {
                                const coordinate = coordinates[index];
                                entityObj.vertices.push({ x: coordinate[0], y: coordinate[1], z: 0 })
                            }
                            break;
                        }
                        entityObj.vertices = []
                            // console.log(entity.getGeometry())
                        for (let index = 0; index < coordinates.length; index++) {
                            const coordinate = coordinates[index];
                            entityObj.vertices.push({ x: coordinate[0], y: coordinate[1], z: 0 })
                        }
                        entityObj.scale = entity.scale;
                        if (entity.saLineType) {
                            entityObj.lineweight = parseFloat(entity.saLineType.Lineweight) * 100
                            entityObj.lineType = entity.saLineType.Linetype
                        }
                        if (entity.objectType = SaObjectsType.line) {
                            entityObj.properties = {
                                lineType: entity.saLineType
                            }
                        }
                        break;
                    case EntityType.circle:
                        // console.log(entity)
                        var center = entity.getGeometry().getCenter()
                        entityObj.center = { x: center[0], y: center[1], z: 0 };
                        // console.log(entity.getGeometry())
                        entityObj.radius = entity.getGeometry().getRadius()
                        break;
                    case EntityType.polyline:
                        // console.log(entity)
                        entityObj.vertices = []
                            // console.log(entity.getGeometry())
                        var coordinates = entity.getGeometry().getCoordinates()
                        for (let index = 0; index < coordinates.length; index++) {
                            const coordinate = coordinates[index];
                            entityObj.vertices.push({ x: coordinate[0], y: coordinate[1], z: 0 })
                        }
                        break;
                    default:
                        console.log(entity)
                        break;
                }
                exEntites.push(entityObj)
            })
            // console.log(exEntites)
        return exEntites
    }
    exportEntitesWithCmsType() {
        let cmsTypeObj = {}
        let mabarTypeObj = [];
        let allEntites = this.getAllEntites();
        allEntites.forEach(entity => {
            if (entity.entityType === EntityType.label && [null, "", undefined].indexOf(entity.epicType) < 0) {
                if (entity.centriodType === CentriodType.id) cmsTypeObj[entity.text] = entity.epicType
                if (entity.centriodType === CentriodType.name) mabarTypeObj.push({
                    center: entity.getGeometry().getCoordinates(),
                    name: entity.text,
                    arz: entity.arz,
                    arzEslahi: entity.arzEslahi
                })
            }
        })
        return {
            entities: this.exportEntites(),
            cmsType: cmsTypeObj,
            mabarType: mabarTypeObj
        }
    }

    exportDxf = () => {

        let d = new Drawing()

        d.setUnits('Meters');
        // d.header("ACADVER", [[1, "AC1018"]]);
        // d.headers.ACADVER = [1,'AC1021']
        // console.log(d)
        // let entites = this.getAllEntites();
        this.layers.forEach(siLayer => {
            console.log(siLayer.name)
                // console.log(siLayer.colorIndex)
            let ACI;
            let A = cadColorACI.find(a => a.index == siLayer.colorIndex)
                // console.log(A)
            if (!A) ACI = Drawing.ACI.WHITE;
            else ACI = A.ACI
            d.addLayer(siLayer.name, ACI, 'CONTINUOUS')
            d.setActiveLayer(siLayer.name)
            siLayer.source.getFeatures().forEach(entity => {
                // console.log(entity)
                switch (entity.entityType) {

                    case EntityType.line:
                        // console.log('line')
                        var coordinates = entity.getGeometry().getCoordinates();
                        // console.log(coordinates)
                        if (coordinates.length < 3) {
                            d.drawLine(coordinates[0][0], coordinates[0][1], coordinates[1][0], coordinates[1][1])
                        } else {
                            d.drawPolyline(coordinates)
                        }
                        break;
                    case EntityType.circle:
                        var center = entity.getGeometry().getCenter();
                        var radius = entity.getGeometry().getRadius();
                        d.drawCircle(center[0], center[1], radius)
                        break;
                    case EntityType.text:
                        console.log(entity.text.center, entity.text.rotate, entity.text.string)
                        d.drawText(entity.text.center[0], entity.text.center[1], 0.1, entity.text.rotaiton, entity.text.string)
                        break;
                    case EntityType.polygon:
                        var coordinates = entity.getGeometry().getCoordinates()[0]
                        d.drawPolyline(coordinates)
                        break;
                    case EntityType.label:
                        var center = entity.getGeometry().getCoordinates()
                            // console.log(entity)
                        d.drawText(center[0], center[1], 0.1, -entity.rotation * 180 / Math.PI, entity.text)
                        break;
                    default:
                        // console.log(entity)
                        break;
                }
            })
        });
        // console.log(d)
        return d.toDxfString()
            // return d
    }
    setZone(zone) {
        this.zone = zone;
        this.projection = new Projection({
            units: 'm',
            code: `EPSG:326${this.zone}`
        })
        this.map.setView(new View({
            zoom: 20,
            center: [0, 0],
            projection: this.projection,
            maxZoom: 35,
        }), )
    }
    getAllFeatureInExtent(extent) {
        let collection = []
            // console.log(this.layers)
        this.layers.forEach(layer => {
                var source = layer.source
                let features = source.getFeaturesInExtent(extent)
                    .filter((feature) => feature.getGeometry().intersectsExtent(extent));
                features.forEach(feature => {
                    if (feature.entityType != EntityType.text && feature.entityType != EntityType.label) {
                        collection.push(feature)
                    }
                })

            })
            // console.log(collection.length)
        return collection
    }
    importSaData(e, options) {
        console.log(e.entities)
        let c = 0;
        this.getAllEntites().forEach(entity => {
                entity.remove()
            })
            // console.log(this.projection)
        var siMap = this;
        var layers = e.tables.layer.layers;
        var zone = e.tables.zone;
        if (!zone) zone = 39
        this.setZone(zone);
        // console.log(e.tables.scale, 'scale')
        if (e.tables.scale) {
            this.mapScale = e.tables.scale
        }
        var siLayers = []
        for (const key in layers) {
            var layer = layers[key]
                // console.log(layer.colorIndex,'LAYER color index')
            let currentSiLayer = this.layers.find(l => l.name === layer.name)
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
                    process: layer.process,
                    shouldNotSnap: layer.snap,
                    title: layer.title
                })
                siLayers.push(
                    currentSiLayer
                )
            }
            if (layer.main) this.activeLayer = currentSiLayer
        }
        siLayers.forEach(layer => {
            layer.lazyLoad = true
        })
        this.activeLayer.lazyLoad = true
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
            let isAparteman;
            // console.log(siLayer.name)
            if (siLayer.name === '3') {
                // console.log('t')
                isAparteman = true;
            } else {
                if (siLayer.name === '4') isAparteman = false;
            }
            switch (entity.type) {
                case EntityType.line:
                    // console.log(isAparteman)
                    // console.log(siLayer.name)
                    // console.log(isAparteman, 'isAparteman')
                    if (isAparteman === undefined) {
                        newEntity = new SiLine(
                            [entity.vertices[0].x, entity.vertices[0].y], [entity.vertices[1].x, entity.vertices[1].y], {
                                layer: siLayer,
                                color: color,
                                lineDash: getCadLineDash(entity.lineType),
                                colorIndex: colorIndex,
                            })
                    } else {
                        newEntity = new SaLine(
                            [entity.vertices[0].x, entity.vertices[0].y], [entity.vertices[1].x, entity.vertices[1].y], {
                                layer: siLayer,
                                color: color,
                                // lineWidth:entity.lineweight*Mm2Px/100,
                                lineDash: getCadLineDash(entity.lineType),
                                colorIndex: colorIndex,
                                scale: entity.scale,
                                saLineType: getSaLineType(entity.lineweight / 100, entity.lineType),
                                labelType: saLineLabelType.onSide,
                                isAparteman: isAparteman
                                    // labelType: saLineLabelType.onLine
                                    // labelType: saLineLabelType.noLabel
                            })
                    }
                    break;
                case EntityType.circle:

                    newEntity = new SiCircle(
                        [entity.center.x, entity.center.y], entity.radius, {
                            layer: siLayer,
                            color: color,
                            lineDash: getCadLineDash(entity.lineType),
                            colorIndex: colorIndex
                        })
                    break;
                case EntityType.text:
                    c++
                    var th = entity.textHeight;
                    // var th = 1;
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
                    // new SiStaticText(entity.text, [entity.startPoint.x, entity.startPoint.y], entity.textHeight, entity.rotation * Math.PI / 180, {
                    //     layer: this.activeLayer,
                    //     anchor: anchorType.mid_top,
                    //     stringType: stringType.normal
                    // });
                case EntityType.polyline:
                case 'POLYLINE':
                    // console.log(entity)
                    var vertices = entity.vertices;
                    var coordinates = [];
                    vertices.forEach(v => {
                        coordinates.push([v.x, v.y]);
                    })
                    newEntity = new SiPolyLine(
                        coordinates, {
                            layer: siLayer,
                            color: color,
                            // lineWidth:entity.lineweight*Mm2Px/100,
                            lineDash: getCadLineDash(entity.lineType),
                            colorIndex: colorIndex,
                            scale: entity.scale,
                            process: layer.process,
                        })
                    break;
                default:
                    // console.log('no entity',entity.type)
                    break;
            }
            if (siLayer.name === 'DefArea') this.defArea = newEntity
        });
        // console.log(this.map.getAllLayers())
        this.activeLayer.lazyLoad = false
        siLayers.forEach(layer => {
            layer.lazyLoad = false
        })
        siMap.zoomToAll()
            // console.log(c)
            // siMap.layerPropertiesControl.handleSelection()
            // siMap.siCommand.execCommand('list')

        // console.timeEnd('first')
        // this.exportEntites();
    }
    importPureDxfFile(e, options) {

        this.getAllEntites().forEach(entity => {
            entity.remove()
        })

        var siMap = this;
        // console.log(e)
        var layers = e.tables.layer.layers;
        var zone = e.tables.zone;
        if (!zone) zone = 39
        this.setZone(zone);
        var siLayers = []
        for (const key in layers) {
            var layer = layers[key]
                // console.log(layer.colorIndex,'LAYER color index')
            let currentSiLayer = this.layers.find(l => l.name === layer.name)
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
                    process: layer.process,
                    shouldNotSnap: layer.snap,
                    title: layer.title
                })
                siLayers.push(
                    currentSiLayer
                )
            }
            if (layer.main) this.activeLayer = currentSiLayer
        }
        siLayers.forEach(layer => {
            layer.lazyLoad = true
        })
        this.activeLayer.lazyLoad = true
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
                    // entity.metadata = [{ name: 'a', id: 'ab' }, { id: 'b' }]
                    // entity.scale = [500, 200]
                    newEntity = new SiLine(
                        [entity.vertices[0].x, entity.vertices[0].y], [entity.vertices[1].x, entity.vertices[1].y], {
                            layer: siLayer,
                            color: color,
                            // lineWidth:entity.lineweight*Mm2Px/100,
                            lineDash: getCadLineDash(entity.lineType),
                            colorIndex: colorIndex,
                        })
                    break;
                case EntityType.circle:

                    newEntity = new SiCircle(
                        [entity.center.x, entity.center.y], entity.radius, {
                            layer: siLayer,
                            color: color,
                            // lineWidth:entity.lineweight*Mm2Px/100,
                            lineDash: getCadLineDash(entity.lineType),
                            colorIndex: colorIndex
                        })
                    break;
                case EntityType.text:
                    // console.log(entity)
                    var center, rotation;
                    if (entity.endPoint) {
                        center = [(entity.startPoint.x + entity.endPoint.x) / 2, (entity.startPoint.y + entity.endPoint.y) / 2]
                    } else {
                        center = [entity.startPoint.x, entity.startPoint.y]
                    }
                    if (!entity.rotation) {
                        rotation = 0
                    } else {
                        rotation = entity.rotation * Math.PI / 180
                    }
                    new SiStaticText(entity.text, center, entity.textHeight, rotation, {
                        layer: siLayer,
                        anchor: anchorType.mid_mid,

                    })
                    break;
                case EntityType.polyline:
                case 'POLYLINE':
                    // console.log(entity)
                    var vertices = entity.vertices;
                    var coordinates = [];
                    vertices.forEach(v => {
                        coordinates.push([v.x, v.y]);
                    })
                    newEntity = new SiPolyLine(
                        coordinates, {
                            layer: siLayer,
                            color: color,
                            // lineWidth:entity.lineweight*Mm2Px/100,
                            lineDash: getCadLineDash(entity.lineType),
                            colorIndex: colorIndex,
                            scale: entity.scale,
                            process: layer.process,
                        })
                    break;
                default:
                    // console.log('no entity',entity.type)
                    break;
            }
            if (siLayer.name === 'DefArea') this.defArea = newEntity
        });
        // console.log(this.map.getAllLayers())
        this.activeLayer.lazyLoad = false
        siLayers.forEach(layer => {
            layer.lazyLoad = false
        })
        siMap.zoomToAll()
            // siMap.layerPropertiesControl.handleSelection()
        siMap.siCommand.execCommand('list')

        // console.timeEnd('first')
        // this.exportEntites();
    }
    readDefAreaJson(e, options) {
        console.log(e)
            // console.time('first')
            // console.log(e.tables)
        this.getAllEntites().forEach(entity => {
                entity.remove()
            })
            // console.log(this.projection)
        if (options) {
            this.defaultCentriodCode.cms = options.cms ? options.cms : '';
            this.defaultCentriodCode.bakhsh = options.bakhsh ? options.bakhsh : '';
            this.defaultCentriodCode.nahieh = options.nahieh ? options.nahieh : '';
            this.defaultCentriodCode.asli = options.asli ? options.asli : '';
            this.defaultCentriodCode.mafruzi = options.mafruzi ? options.mafruzi : '';
        }
        var siMap = this;
        // console.log(e)
        var layers = e.tables.layer.layers;
        var zone = e.tables.zone;
        if (!zone) zone = 39
        this.setZone(zone);
        // console.log(e.tables.scale, 'scale')
        if (e.tables.scale) {
            this.mapScale = e.tables.scale
        }
        // console.log(this.mapScale, 'mapscale')
        // console.log(this.map.getView().getProjection())
        var siLayers = []
        for (const key in layers) {
            var layer = layers[key]
                // console.log(layer.colorIndex,'LAYER color index')
            let currentSiLayer = this.layers.find(l => l.name === layer.name)
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
                    process: layer.process,
                    shouldNotSnap: layer.snap,
                    title: layer.title
                })
                siLayers.push(
                    currentSiLayer
                )
            }
            if (layer.main) this.activeLayer = currentSiLayer
        }
        siLayers.forEach(layer => {
            layer.lazyLoad = true
        })
        this.activeLayer.lazyLoad = true
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
                    // entity.metadata = [{ name: 'a', id: 'ab' }, { id: 'b' }]
                    // entity.scale = [500, 200]
                    newEntity = new SiLine(
                        [entity.vertices[0].x, entity.vertices[0].y], [entity.vertices[1].x, entity.vertices[1].y], {
                            layer: siLayer,
                            color: color,
                            // lineWidth:entity.lineweight*Mm2Px/100,
                            lineDash: getCadLineDash(entity.lineType),
                            colorIndex: colorIndex,
                            scale: entity.scale
                        })
                    break;
                case EntityType.circle:

                    newEntity = new SiCircle(
                        [entity.center.x, entity.center.y], entity.radius, {
                            layer: siLayer,
                            color: color,
                            // lineWidth:entity.lineweight*Mm2Px/100,
                            lineDash: getCadLineDash(entity.lineType),
                            colorIndex: colorIndex
                        })
                    break;
                case EntityType.text:
                    // console.log(entity)
                    var center, rotation;
                    if (entity.endPoint) {
                        center = [(entity.startPoint.x + entity.endPoint.x) / 2, (entity.startPoint.y + entity.endPoint.y) / 2]
                    } else {
                        center = [entity.startPoint.x, entity.startPoint.y]
                    }
                    if (!entity.rotation) {
                        rotation = 0
                    } else {
                        rotation = entity.rotation * Math.PI / 180
                    }
                    var area;
                    //  console.log(entity)
                    //  if(entity.text === '80111001725F10M1G0AA201044.97XX463.42YY656.8DD8011100_55_270BB201046.9EE0II02RR01LL01OO99*') area = 1000000
                    //  else area = 0
                    if (entites.length > 0) {
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
                                rotation: -rotation,
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
                                rotation: -rotation,
                                color: color,
                                layer: siLayer,
                                LabelColor: color,
                                size: size,
                                centriodType: CentriodType.name,
                                area: entity.area
                            })
                        }
                        break;
                    }
                    // console.log(entity.textHeight)
                    // let point = new SiPoint(entity.startPoint.x,entity.startPoint.y,{
                    //     layer:siLayer,
                    //     color:'rgba(255,255,255,1)',
                    // })
                    // console.log(`${this.getFontSize(0.1)}px`)
                    // let style = new Style({
                    //     text: new Text({
                    //         text:entity.text,
                    //         fill: new Fill({
                    //             color:'rgba(255,255,255,1)',
                    //         }),
                    //         rotation:rotation,
                    //         overflow:true,
                    //         font: 15 + 'px Calibri,sans-serif'
                    //     }),
                    // })
                    // point.setStyle(style)
                    let text = new SiText('', 'CADText', center[0], center[1], -rotation, entity.text, { textColor: color, layer: siLayer })
                    text.addTextByTextHeight(entity.textHeight, 'mid mid')
                    break;
                case EntityType.polyline:
                case 'POLYLINE':
                    // console.log(entity)
                    var vertices = entity.vertices;
                    var coordinates = [];
                    vertices.forEach(v => {
                        coordinates.push([v.x, v.y]);
                    })
                    newEntity = new SiPolyLine(
                        coordinates, {
                            layer: siLayer,
                            color: color,
                            // lineWidth:entity.lineweight*Mm2Px/100,
                            lineDash: getCadLineDash(entity.lineType),
                            colorIndex: colorIndex,
                            scale: entity.scale,
                            process: layer.process,
                        })
                    break;
                default:
                    // console.log('no entity',entity.type)
                    break;
            }
            if (siLayer.name === 'DefArea') this.defArea = newEntity
        });
        // console.log(this.map.getAllLayers())
        this.activeLayer.lazyLoad = false
        siLayers.forEach(layer => {
            layer.lazyLoad = false
        })
        siMap.zoomToAll()
            // siMap.layerPropertiesControl.handleSelection()
        siMap.siCommand.execCommand('list')

        // console.timeEnd('first')
        // this.exportEntites();
    }
    getAllEntitesJson() {
        // this.map.getFeaturesAtPixel
        return this.save()
    }
    async getOurthophotoList() {
        if (!this.defArea) return
        else {
            let extent = this.defArea.getGeometry().getExtent()
            return await axios.get(`http://10.1.47.36:2000/api/maps/getImageProjects/${this.zone}/${extent[0]}/${extent[1]}/${extent[2]}/${extent[3]}`)
        }
    }
    updateOurthophotoList() {
        // this.getOurthophotoList()
        this.baseLayers = [...this.globalBaseLayers]
            // console.log(this.orthophoto)
        this.orthophoto.forEach(image => {
                console.log(this.zone)
                this.baseLayers.push({
                    name: image.title,
                    source: new XYZ({
                        url: `http://10.1.47.36:2000/api/maps/tilesWOAuthR/${image.name}/{z}/{x}/{y}`,
                    }),
                    id: image.id,
                })
            })
            // if(this.baseLayersPropertiesControl) this.baseLayersPropertiesControl.handleSelection()  
    }
    addCommand(name, type, operator, command) {
        this.siCommand.Commands.push({
            name: name,
            command: command,
            type: type,
            operator: operator
        })
    }
    init() {
        this.siCommand.Commands.push({
                name: 'zoom',
                command: () => {
                    this.zoomToAll()
                },
                type: 'draw',
                operator: 'function'
            }, {
                name: 'get',
                command: () => {
                    this.getOurthophotoList()
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'list',
                command: () => {
                    this.getOurthophotoList().then(
                            resp => {
                                this.orthophoto = resp.data
                                this.updateOurthophotoList()
                            }
                        )
                        .catch(e => console.log(e))
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'getall',
                command: () => {
                    console.log(this.exportDxf())
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'fullscreen',
                command: () => {
                    this.fullScreen.element.children[0].click()
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'addsingelsalabel',
                command: AddSingelSALabel,
                type: 'draw',
                operator: 'class'
            }, {
                name: 'addmultisalabel',
                command: AddMultiSALabel,
                type: 'draw',
                operator: 'class'
            }, {
                name: 'saline',
                command: DrawSaLine,
                type: 'draw',
                operator: 'class'
            }, {
                name: 'addmultisalabelghate',
                command: addMultiSaLabelGhate,
                type: 'draw',
                operator: 'class'
            }, {
                name: 'salabel',
                command: AddSALabel,
                type: 'draw',
                operator: 'class'
            }, {
                name: 'label',
                command: AddLabel,
                type: 'draw',
                operator: 'class'
            }, {
                name: 'mabar',
                command: AddMabar,
                type: 'draw',
                operator: 'class'
            }, {
                name: 'line',
                command: DrawLine,
                type: 'draw',
                operator: 'class'
            }, {
                // name: 'polyline',
                // command: DrawPolyline,
                // type: 'draw',
                // operator: 'class'
            }, {
                name: 'point',
                command: DrawPoint,
                type: 'draw',
                operator: 'class'
            }, {
                name: 'polygon',
                command: DrawPolygon,
                type: 'draw',
                operator: 'class'
            }, {
                name: 'poly',
                command: DrawPolygon,
                type: 'draw',
                operator: 'class'
            }, {
                name: 'circle3p',
                command: DrawCircle3p,
                type: 'draw',
                operator: 'class'
            }, {
                name: 'arc3p',
                command: DrawArc3p,
                type: 'draw',
                operator: 'class'
            },

            {
                name: 'circle',
                command: DrawCircle,
                type: 'draw',
                operator: 'class'
            }, {
                name: 'save',
                command: () => {
                    this.save()
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'saveapartemandata',
                command: async() => {
                    this.saveApartemanData()
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'processmethod',
                command: async() => {
                    this.seperationApartemanPolyProcess()
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'load',
                command: () => {
                    this.load()
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'exportsadata',
                command: () => {
                    var exp = this.exportSaData()
                    console.log(exp)
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'export',
                command: () => {
                    this.exportMap()
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'text',
                command: AddSingelLineText,
                type: 'draw',
                operator: 'class'
            }, {
                name: 'move',
                command: SiMoveModify,
                type: 'modify',
                operator: 'class'
            }, {
                name: 'copy',
                command: SiCopy,
                type: 'manager',
                operator: 'class'
            }, {
                name: 'rotate',
                command: SiRotateModify,
                type: 'modify',
                operator: 'class'
            }, {
                name: 'scale',
                command: SiScaleModify,
                type: 'modify',
                operator: 'class'
            }, {
                name: 'trim',
                command: SiTrimModify,
                type: 'modify',
                operator: 'class'
            }, {
                name: 'offset',
                command: SiOffsetModify,
                type: 'modify',
                operator: 'class'
            }, {
                name: 'extend',
                command: SiExtendModify,
                type: 'modify',
                operator: 'class'
            }, {
                name: 'stretchend',
                command: SiStretchEndVertexModify,
                type: 'modify',
                operator: 'class'
            }, {
                name: 'stretchmid',
                command: SiStretchMidVertexModify,
                type: 'modify',
                operator: 'class'
            }, {
                name: 'coordinates',
                command: SiCoordinatesTool,
                type: 'manager',
                operator: 'class'
            }, {
                name: 'mdist',
                command: SiMultiDistTool,
                type: 'manager',
                operator: 'class'
            }, {
                name: 'area',
                command: SiAreaTool,
                type: 'manager',
                operator: 'class'
            }, {
                name: 'dist',
                command: SiDistTool,
                type: 'manager',
                operator: 'class'
            }, {
                name: 'id',
                command: SiIdTool,
                type: 'manager',
                operator: 'class'
            }, {
                name: 'extent',
                command: () => {
                    this.calcExtent(this.siSelect.getSelectionSet())
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'undo',
                command: () => {
                    this.siActions.undo()
                },
                type: 'action',
                operator: 'function'
            }, {
                name: 'testmap',
                command: () => {
                    this.setMap(this.maps[1])
                },
                type: 'action',
                operator: 'function'
            }, {
                name: 'redo',
                command: () => {
                    this.siActions.redo()
                },
                type: 'action',
                operator: 'function'
            }, {
                name: 'addgpsdata',
                command: async() => {
                    let allEntites = this.getAllEntites()
                    let points = []
                    allEntites.forEach(entity => {
                            if (entity.entityType === EntityType.node && entity.hasAttribute('point')) {
                                let attr = entity.getAttribute('point')
                                    // console.log(attr)
                                if (attr['x'] && attr['y'] && attr['z'] && attr['id']){
                                    points.push({
                                        x:parseFloat(attr.x),
                                        y:parseFloat(attr.y),
                                        z:parseFloat(attr.z),
                                        id:parseFloat(attr.id),
                                    })
                                } 
                                else {
                                    entity.remove()
                                }
                            }
                        })
                        // console.log(points)
                    await axios.post('http://127.0.0.1:8000/createtriangles/', JSON.stringify(points), { 'Content-Type': 'application/json' })
                        .then(resp => {
                            let tri = resp.data
                            this.createTriangles(points, tri)
                                // this.createCountorLines(points, tri)
                        })
                        .catch(err => console.log(err))
                        // points.forEach()
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'ccl',
                command: () => {
                    this.createCountorLines()
                        // this.createCountorLines()
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'addcl',
                command: () => {
                    this.createTriangles()
                        // this.createCountorLines()
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'importtxt',
                command: SiImportTxt,
                type: 'manager',
                operator: 'class'
            }, {
                name: 'importjgw',
                command: SiImportJGW,
                type: 'manager',
                operator: 'class'
            }, {
                name: 'importsadata',
                command: () => {
                    // const obj = JSON.parse('{"name":"John", "age":30, "city":"New York"}');
                    console.log(data)
                    this.importSaData(data)
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'importpuredxf',
                command: SiImportPureDxf,
                type: 'manager',
                operator: 'class'
            }, {
                name: 'importdxf',
                command: SiImportDxf,
                type: 'manager',
                operator: 'class'
            }, {
                name: 'exportdxf',
                command: () => {
                    var DxfString = this.exportDxf()
                    saveData(DxfString, 'result.dxf')
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'attach',
                command: SiAttach,
                type: 'manager',
                operator: 'class'
            }, {
                name: 'showstyle',
                command: () => {
                    this.map.getControls().forEach(control => {
                        this.map.removeControl(control)
                    })
                    this.map.addControl(new wcs_sidebar(this))
                    this.map.addControl(new wcs_commandsPallet(this))
                    this.map.addControl(new wcs_modal(this))
                        // this.map.addControl(new wcs_panel(this))
                        // this.map.addControl(new WebCadStyle__C1(this))
                        // this.map.addControl(new WebCadStyle__C2(this))
                        // this.map.addControl(new WebCadStyle__C3(this))
                        // this.map.addControl(new WebCadStyle__C4(this))
                        // console.log(this.map.getTargetElement().style)
                        // this.map.getTargetElement()
                },
                type: 'action',
                operator: 'function'
            }, {
                name: 'activemainstyle',
                command: () => {

                    this.addElement(wcs_sidebar, this.appStyle.panel)
                    this.addElement(wcs_commandsPallet, this.appStyle.pallet)
                    this.addElement(wcs_modal, this.appStyle.modalContainer)
                    this.map.addControl(new wcs_mapModal(this))
                },
                type: 'action',
                operator: 'function'
            }, {
                name: 'escape',
                command: () => {
                    this.siCommand.abrotCommand()
                    this.siSelect.removeSelectionSet()
                    this.clearModify()
                    this.siCommand.currentCommandLine = ''
                    this.siCommand.currentDefaultMessage = undefined
                    this.siCommand.setInputMessageElement(undefined)
                    this.idOverlay.setPosition(undefined)
                    this.siCommand.reActive()
                    this.mapFocus()
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'del',
                command: () => {
                    var set = []
                    var selectionSet = this.siSelect.getSelectionSet()
                    selectionSet.forEach(entity => {
                        if (entity.removeable) {
                            set.push(entity)
                            entity.removeAllLabel()
                            entity.remove()
                        }
                    });
                    var textSet = this.siSelect.getTextSet()
                    textSet.forEach(entity => {
                        if (entity.removeable) {
                            set.push(entity)
                            entity.remove()
                        }
                    });
                    var labelSet = this.siSelect.labelCollection_
                    labelSet.forEach(entity => {
                        if (entity.removeable) {
                            set.push(entity)
                            entity.remove()
                        }
                    });
                    var label = this.siSelect.currentLabel;
                    if (label) {
                        set.push(label)
                        label.remove();
                    }
                    this.clearModify();
                    this.siActions.addMapAction([{
                        type: mapActionsType.removeEntity,
                        entities: set
                    }])
                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'exportpng',
                command: () => {
                    let allEntity = this.getAllEntites()
                    let extent = this.calcExtentFromFeaturesCollection(allEntity)
                    let img = this.exportAsPNG(60, 60, allEntity, extent)
                    img.then(
                        resp => {
                            // console.log(resp)
                            let link = document.getElementById('image-download')
                            link.href = resp
                        }
                    )

                },
                type: 'manager',
                operator: 'function'
            }, {
                name: 'exportjpeg',
                command: () => {
                    let allEntity = this.getAllEntites()
                    let extent = this.calcExtentFromFeaturesCollection(allEntity)
                    let img = this.exportAsJPEG(60, 60, allEntity, extent)
                    img.then(
                        resp => {
                            // console.log(resp)
                            let link = document.getElementById('image-download')
                            link.href = resp
                        }
                    )

                },
                type: 'manager',
                operator: 'function'
            },
        )

    }
    async exportAsPNG(pw, ph, allEntity, extent) {
        // console.log(
        //     'pw:',pw,'ph:',ph
        // )
        // console.log('allEntity',allEntity)
        // console.log('extent',extent)
        let svg = new SvgExport({
            paperWidth: pw,
            paperHeight: ph,
            extent: extent
        })
        svg.setEntities(allEntity)
            // this.layers.forEach(layer => {
            //     var source = layer.source
            //     var features = source.getFeatures()
            //     features.forEach(entity => {
            //         svg.addEentities(entity)
            //     });
            // });
        let svgXML = svg.draw('xml')
            // console.log(svgXML)
            // this.testSvg.current.innerHTML = svgXML
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "white";
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        const png = await Canvg.from(ctx, svgXML).then(
            e => {
                e.start()
                let img = canvas.toDataURL('image/png')
                return img
            }
        )
        return png
    }
    async exportAsJPEG(pw, ph, allEntity, extent) {
        // console.log(
        //     'pw:',pw,'ph:',ph
        // )
        // console.log('allEntity',allEntity)
        // console.log('extent',extent)
        let svg = new SvgExport({
            paperWidth: pw,
            paperHeight: ph,
            extent: extent
        })
        svg.setEntities(allEntity)
            // this.layers.forEach(layer => {
            //     var source = layer.source
            //     var features = source.getFeatures()
            //     features.forEach(entity => {
            //         svg.addEentities(entity)
            //     });
            // });
        let svgXML = svg.draw('xml')
            // console.log(svgXML)
            // this.testSvg.current.innerHTML = svgXML
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "white";
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        const jpeg = await Canvg.from(ctx, svgXML).then(
            e => {
                e.start()
                let img = canvas.toDataURL('image/jpeg')
                return img
            }
        )
        return jpeg
    }
    async saveApartemanData() {
        if (!this.storage.boundray) {
            this.siCommand.handleSiCommandMessage('قطعات تفکیکی یافت نشد لطفاً ابتدا پردازش  قطعات را انجام دهید')
        } else {
            // this.save()
            let poly = []
            this.storage.boundray.olPoly.forEach(olPoly => {
                poly.push({
                    polygon: olPoly.getGeometry().getCoordinates(),
                    label: olPoly.get('polyText').getData(),
                    linesType: olPoly.get('linesType')
                })
            })
            console.log(poly)
                // await axios.post('/api/docs/insert', {
                //     collectionName: 'seperationApartemanData',
                //     doc: {
                //         seperationApartemanData: poly,
                //     }
                // })
        }
    }
    getViewExtent() {
        return this.currentViewBbox
    }
    exportAsSVG(pw, ph) {

        let svg = new SvgExport({
            siMap: this,
            paperWidth: pw,
            paperHeight: ph
        })
        this.layers.forEach(layer => {
            var source = layer.source
            var features = source.getFeatures()
            features.forEach(entity => {
                svg.addEentities(entity)
            });
        });
        let svgXML = svg.draw('xml')
        return svgXML
    }
    changeBackgroundColor(color) {
        this.map.getTargetElement().style.background = `${color} !important`
    }

    async importPureDxf(file, name) {
        var siMap = this;
        await this.parser.setFile(file, name).then(
            content => {
                siMap.importPureDxfFile(content)
            }
        )
    }
    async importDxf(file, name) {
            var siMap = this;
            await this.parser.setFile(file, name).then(
                content => {
                    // siMap.readDefAreaJson(content)
                    switch (this.styleMode) {
                        case styleModeType.seperationAparteman:
                            siMap.importSaData(content)
                            break;
                        case styleModeType.arse:
                            siMap.readDefAreaJson(content)
                            break;
                        default:
                            break;
                    }

                }
            )
        }
        // async importFile(file,name){
        //     // console.log(file)
        //     var siMap = this;
        //     await this.parser.setFile(file,name).then(
        //         e=>{
        //             var layers = e.tables.layer.layers;
        //             var siLayers = []
        //             for (const key in  layers) {
        //                 var layer  = layers[key]
        //                 siLayers.push(
        //                     new SiLayer({
        //                                 siMap:siMap,
        //                                 name:layer.name,
        //                                 type:'vector',
        //                                 color:getCadColor(layer.colorIndex),
        //                                 textColor:getCadColor(layer.colorIndex),
        //                             })
        //                 )
        //             }
        //             // layers.map(layer=>{
        //             //
        //             // })
        //             var entites = e.entities;
        //             // console.log(e,'HAME')
        //             // console.log(entites)
        //             entites.forEach(entity => {
        //                     var color;
        //                     var siLayer = siLayers.find(sl=>sl.name === entity.layer);
        //                     if(entity.colorIndex){
        //                         color = getCadColor(entity.colorIndex);
        //                     }
        //                     if(!siLayer) siLayer = siMap.activeLayer;
        //                     else{
        //                         // console.log(siLayer.name);
        //                         // console.log(entity,color)
        //                     }

    //                     switch (entity.type) {
    //                         case EntityType.line:

    //                             new SiLine(
    //                                 [entity.vertices[0].x,entity.vertices[0].y],[entity.vertices[1].x,entity.vertices[1].y]
    //                                 ,
    //                                 {
    //                                     layer:siLayer,
    //                                     color:color,
    //                                     // lineWidth:entity.lineweight*Mm2Px/100,
    //                                     lineDash:getCadLineDash(entity.lineType)
    //                                 })
    //                             break;
    //                         case EntityType.circle:

    //                             new SiCircle(
    //                                 [entity.center.x,entity.center.y]
    //                                 ,entity.radius,
    //                                 {
    //                                     layer:siLayer,
    //                                     color:color,
    //                                     // lineWidth:entity.lineweight*Mm2Px/100,
    //                                     lineDash:getCadLineDash(entity.lineType)
    //                                 })
    //                             break;
    //                         case EntityType.text:
    //                             var center,rotation;
    //                             if(entity.endPoint){
    //                                 center = [(entity.startPoint.x+entity.endPoint.x)/2,(entity.startPoint.y+entity.endPoint.y)/2]
    //                             }
    //                             else{
    //                                 center = [entity.startPoint.x,entity.startPoint.y]
    //                             }
    //                             if(!entity.rotation){
    //                                 rotation = 0
    //                             }
    //                             else{
    //                                 rotation = -entity.rotation*Math.PI/180
    //                             }
    //                             // if(entites.length > 1000000000000000){
    //                             //     new Centriod(center[0],center[1],{
    //                             //         text:entity.text,
    //                             //         rotation:rotation,
    //                             //         color:color,
    //                             //         layer:siLayer,
    //                             //         LabelColor:color,
    //                             //         sabtCode: 124,
    //                             //         fari:1,
    //                             //         bakhsh:1,
    //                             //         mafroozi:0,
    //                             //         nahiye:12,
    //                             //         ghate:10,
    //                             //         asli:14,
    //                             //         tasbit:false,
    //                             //     })
    //                             //     break;
    //                             // }
    //                             let text = new SiText('','CADText',center[0],center[1],-rotation,entity.text,
    //                                 {textColor:color,layer:siLayer})
    //                             text.addTextByTextHeight(entity.textHeight,'mid mid')
    //                             break;
    //                         case EntityType.polyline:
    //                             var vertices = entity.vertices;
    //                             var coordinates = [];
    //                             for (const key in  vertices) {
    //                                 var vertex  = vertices[key];
    //                                 coordinates.push([vertex.x,vertex.y]);
    //                             }
    //                             new SiPolyLine(
    //                                 coordinates
    //                                 ,
    //                                 {
    //                                     layer:siLayer,
    //                                     color:color,
    //                                     // lineWidth:entity.lineweight*Mm2Px/100,
    //                                     lineDash:getCadLineDash(entity.lineType)
    //                                 })
    //                             break;
    //                         default:
    //                             break;
    //                     }
    //                 });
    //                 siMap.zoomToAll()
    //         }
    //     )
    //     // console.log(val)
    // }
    setNewMap() {

    }
    GetAllFeatureBbox() {
        return this.calcExtentFromFeaturesCollection(this.getAllFeature());
    }
    GetAllFeatureBboxPolygon() {
        let extent = this.GetAllFeatureBbox();
        let [X, Y] = [(extent[2] + extent[0]) / 2, (extent[3] + extent[1]) / 2]
        let TransFormX = (extent[2] - extent[0]) / 2;
        let TransFormY = (extent[3] - extent[1]) / 2;
        let coordinate = [
            [
                [
                    X - TransFormX,
                    Y - TransFormY
                ],
                [
                    X + TransFormX,
                    Y - TransFormY
                ],
                [
                    X + TransFormX,
                    Y + TransFormY
                ],
                [
                    X - TransFormX,
                    Y + TransFormY
                ],
                [
                    X - TransFormX,
                    Y - TransFormY
                ]
            ]
        ]
        return new Feature({
            geometry: new Polygon(coordinate)
        })
    }

    activeControl(name) {
        this.controls.forEach(control => {
            if (control.name != name) {
                control.control.hide()
                this.map.removeControl(control.control)

            } else {

                let currentMenuControl = control.control
                this.map.addControl(currentMenuControl)
                currentMenuControl.handleOpen()
            }
        });
    }
    getSiControl(name) {
            let element;
            if (!this.appStyle.elements) return
            this.appStyle.elements.forEach(control => {
                // console.log(control)
                // console.log(control.name,name)
                if (control.name === name) {
                    // console.log(control)
                    element = control
                }
            })
            return element
        }
        // getControl()
    getSegments() {
        let collection = []
        this.layers.forEach(layer => {
            let entities = layer.source.getFeatures();
            entities.forEach(entity => {
                if (entity.entityType != EntityType.text) {
                    entity.createSegments();
                    let segments = entity.getSegments()
                    segments.forEach(elm => {
                        collection.push(elm);
                    });
                }
            })
        });
        return collection;
    }
    clearMenuControl() {
        this.map.removeControl(this.featuresPropertiesControl)
    }
    clearModify() {
        this.modify.clear()
        this.modifyLayers.forEach(layer => {
            this.map.removeLayer(layer);
        });
        this.modifyLayers = []
            // let features = this.getAllFeature();
            // features.forEach(feature => {
            //     feature.segmentSource.clear()
            // });
    }

    getParams() {
        return this.Params
    }
    setColor(color) {
        this.activeColor = color
    }
    addLayer(options) {
        let l = this.layers.find(l => options.name == l.name)
        if (l) {
            return l
        }
        return new SiLayer(options)
    }
    setLayer(siLayer) {
        this.activeLayer = siLayer
    }
    activeSelect() {
        // SiSelectInit(this)
        this.siSelect.activate()
    }
    disableSelect() {
            this.siSelect.disable()
        }
        // mapInfo(){
        //     var totalFeature = this.getAllFeature()
        // }
    async save() {
        if (!this.dataId) {
            this.siCommand.handleSiCommandMessage('you can not save this view')
            return false
        }
        this.data = {}
        let layers = []
        this.layers.forEach(siLayer => {
            if (siLayer.name != 'modify layer') {
                layers.push(siLayer.getData())
            }
        });
        // this.data.layers = layers
        // console.log(this.exportEntites())
        this.data.entities = this.exportSaData()
        this.data.tables = {}
        this.data.tables.zone = this.zone
        this.data.tables.layer = {}
        let layersObj = {}
        for (let index = 0; index < this.layers.length; index++) {
            let siLayer = this.layers[index];
            layersObj[index] = {
                name: siLayer.name,
                colorIndex: siLayer.colorIndex,
                frozen: siLayer.frozen,
                visible: siLayer.visible,
                process: siLayer.process,
                snap: siLayer.shouldNotSnap,
                title: siLayer.title
            }
        }
        // console.log(this.data)
        this.data.tables.layer.layers = layersObj
        await axios.post('/api/docs/remove', {
            collectionName: 'webCadData',
            selector: {
                webCadId: this.dataId
            }
        })
        await axios.post('/api/docs/insert', {
                collectionName: 'webCadData',
                doc: {
                    data: this.data,
                    webCadId: this.dataId
                }
            })
            .then(function(response) {
                // console.log(response);
            })
            .catch(function(error) {
                // console.log(error);
            });
        // console.log(this.data)
        // localStorage.setItem("webcad_data", JSON.stringify(this.data));
        // 
        // return this.geoJsonExport
        // var geoJsonStr = writer.writeFeatures(this.data);
        // this.geoJsonExport = geoJsonStr

    }
    async load() {
        if (!this.dataId) {
            this.siCommand.handleSiCommandMessage('there is no data saved in this view')
            return false
        }
        await axios.post('/api/docs/findOne', {
            collectionName: 'webCadData',
            selector: {
                webCadId: this.dataId
            }
        }).then(resp => {
            this.clearSiMap()
            switch (this.styleMode) {
                case styleModeType.seperationAparteman:
                    if (resp.seperationApartemanData) {
                        console.log('has sa aparteman data')
                    }
                    this.importSaData(resp.data.data)
                    break;
                case styleModeType.arse:
                    this.readDefAreaJson(resp.data.data)
                    break;
                default:
                    break;
            }
        }).catch(
            e => console.log(e)
        )

        // // console.log(data)
        // if (!data) {
        //     return
        // }
        // this.clearSiMap()
        // this.importSaData(data)
        //     // console.log(data.layers)
    }
    seprateSelectionSetByType() {
        let selectionSet = this.siSelect.getSelectionSet();
        let line = [];
        let circle = [];
        let polygon = [];
        let pline = [];
        let text = [];
        let node = []
        selectionSet.forEach(entity => {
            if (entity.entityType === EntityType.line) {
                if (entity.getGeometry().getCoordinates().length === 2) line.push(entity)
                else pline.push(entity)
            }
            if (entity.entityType === EntityType.circle) circle.push(entity)
            if (entity.entityType === EntityType.text) text.push(entity)
            if (entity.entityType === EntityType.polygon) polygon.push(entity)
            if (entity.entityType === EntityType.node) node.push(entity)
        })
        return {
            line: line,
            pline: pline,
            polygon: polygon,
            text: text,
            node: node,
            circle: circle,
        }
    }
    getEntityByOlId(id) {
        let entity;
        this.layers.forEach(layer => {
            var finder = layer.source.getFeatureById(id)
            if (finder) entity = finder
        })
        return entity
    }
    getEntityById(id) {
        let entity;
        this.layers.forEach(layer => {
            var features = layer.source.getFeatures();
            // console.log(features)
            var finder = features.find(item => item.id === id)
            if (finder) entity = finder
        })
        return entity
    }
    async seperationApartemanPolyProcess() {
        let dataInMap = this.getAllEntites()
            // console.log(dataInMap)
        let bd = await this.processMethod(dataInMap)
            // console.log(bd)
        if (!bd.dataIsInvalid) {
            this.storage.boundray = await this.processMethod(this.exportSaData(true))
            this.storage.boundray.saLines = []
            dataInMap.forEach(entity => {
                // console.log(entity)
                if (entity.entityType === EntityType.line) {
                    this.storage.boundray.saLines.push({
                        entity: entity,
                        frontPoint: calculateLineLablePosition(entity, 0.01).offset,
                        backPoint: calculateLineLablePosition(entity, -0.01).offset,
                        // frontPoly: ,
                        // backPoly: ,
                    })
                }
                if (entity.entityType === EntityType.staticText && entity.objectType === SaObjectsType.label) {
                    entity.text = oraUseCodes.A266FF2A662E84b639DA.find(i => i.Code === entity.useCase).Name
                    entity.textType = 'label'
                    entity.selectable = false
                }
            })
            this.storage.boundray.olPoly = []
            this.storage.boundray.polygons.polygons.forEach((poly, index) => {
                let feature = new Feature({
                    geometry: new Polygon([poly])
                })
                feature.setStyle(new Style({
                    fill: new Fill({
                        color: 'rgba(255,255,0,1)'
                    }),
                    stroke: new Stroke({
                        color: 'black'
                    })
                }))
                feature.setProperties({
                        index: index,
                        text: poly['texts']
                    })
                    // this.modify.addFeature(feature)
                    // console.log(feature.getGeometry().getCoordinates())
                this.storage.boundray.olPoly.push(feature)
                feature.getProperties()
            })
            this.storage.boundray.saLines.forEach(saLine => {
                let baseCoordinate = saLine.entity.getGeometry().getCoordinates()
                this.storage.boundray.olPoly.forEach(olPoly => {
                    var polygonGeometry = olPoly.getGeometry();
                    var frontCoords = saLine.frontPoint
                    var backCoords = saLine.backPoint
                    olPoly.setProperties({
                        linesType: {},
                        labels: {}
                    })
                    olPoly.setLabel = (index, text) => {
                        if (index === undefined) return
                            // console.log(index, text, olPoly)
                        if (olPoly.get('labels')[index]) olPoly.get('labels')[index].remove()
                        let line = [olPoly.getGeometry().getCoordinates()[0][index], olPoly.getGeometry().getCoordinates()[0][index + 1]]
                            // console.log(line)
                        let center = [(line[1][0] + line[0][0]) / 2, (line[1][1] + line[0][1]) / 2]
                        let angle = Math.atan2((line[1][1] - line[0][1]), (line[1][0] - line[0][0]))
                        var a = new SiStaticText(text, center, 1, angle, {
                            layer: this.activeLayer,
                            anchor: anchorType.mid_top,
                            textType: 'label',
                        })
                        olPoly.get('labels')[index] = a
                    }

                    if (polygonGeometry.intersectsCoordinate(frontCoords)) saLine.rightPoly = olPoly
                    if (polygonGeometry.intersectsCoordinate(backCoords)) saLine.leftPoly = olPoly
                });
                if (saLine.rightPoly) {
                    // console.log('s2')
                    var coords = saLine.rightPoly.getGeometry().getCoordinates()[0]
                    for (let index = 0; index < coords.length - 1; index++) {
                        let direct = [coords[index], coords[index + 1]]
                        let indirect = [coords[index + 1], coords[index]]
                            // console.log(direct, indirect, baseCoordinate)
                        if (isEqualPoint(direct[0], baseCoordinate[0], 100) && isEqualPoint(direct[1], baseCoordinate[1], 100)) {
                            // console.log('p')
                            saLine.rightPolyIndex = index
                            saLine.rightPoly.setProperties({
                                saLine: saLine
                            })
                        }
                        if (isEqualPoint(indirect[0], baseCoordinate[0], 100) && isEqualPoint(indirect[1], baseCoordinate[1], 100)) {
                            // console.log('p')
                            saLine.rightPolyIndex = index
                            saLine.rightPoly.setProperties({
                                saLine: saLine
                            })
                        }
                    }
                }
                if (saLine.leftPoly) {
                    // console.log('s2')
                    var coords = saLine.leftPoly.getGeometry().getCoordinates()[0]
                        // console.log(coords)
                    for (let index = 0; index < coords.length - 1; index++) {
                        let direct = [coords[index], coords[index + 1]]
                        let indirect = [coords[index + 1], coords[index]]

                        if (isEqualPoint(direct[0], baseCoordinate[0], 100) && isEqualPoint(direct[1], baseCoordinate[1], 100)) {
                            // console.log('p')
                            saLine.leftPolyIndex = index
                        }
                        if (isEqualPoint(indirect[1], baseCoordinate[0], 100) && isEqualPoint(indirect[0], baseCoordinate[1], 100)) {
                            // console.log('p')
                            saLine.leftPolyIndex = index
                        }
                    }
                }
            })
            this.storage.boundray.saLines.forEach(saLine => {

                if (!saLine.rightPoly || !saLine.leftPoly) {
                    saLine.lineType = saLineTypeList.find(item => item.id === 19)
                } else {

                    // let frontNMH = 
                    let rightId = saLine.rightPoly.get('text')['0'].text
                    let leftId = saLine.leftPoly.get('text')['0'].text
                        // console.log(rightId, leftId);
                    let backNMH, frontNMH;
                    dataInMap.forEach(entity => {
                        if (entity.id === rightId) {
                            // console.log(oraUseCodes.A266FF2A662E84b639DA.find(i => i.Code === entity.useCase))
                            frontNMH = oraUseCodes.A266FF2A662E84b639DA.find(i => i.Code === entity.useCase).NMH
                        }
                        if (entity.id === leftId) {
                            backNMH = oraUseCodes.A266FF2A662E84b639DA.find(i => i.Code === entity.useCase).NMH
                            if (!backNMH) console.log(entity);
                        }
                    })

                    saLine.frontNMH = frontNMH
                    saLine.backNMH = backNMH
                    var rightLineType = autoLineType.A266FF2A662E84b639DA.find(item => (item.MelkNMH === frontNMH && item.AdjNMH === backNMH))
                    var leftLineType = autoLineType.A266FF2A662E84b639DA.find(item => (item.MelkNMH === backNMH && item.AdjNMH === frontNMH))
                        // console.log(frontNMH, backNMH);
                        // console.log(rightLineType, leftLineType)
                    if (rightLineType || leftLineType) {
                        if (rightLineType && !leftLineType) {
                            saLine.lineType = saLineTypeList.find(item => parseFloat(item.Code) === parseFloat(rightLineType.LineType))
                        }
                        if (!rightLineType && leftLineType) {
                            saLine.lineType = saLineTypeList.find(item => parseFloat(item.Code) === parseFloat(leftLineType.LineType))
                        }
                        if (rightLineType && leftLineType) {
                            if (parseFloat(rightLineType.LineType) === parseFloat(leftLineType.LineType)) {

                                saLine.lineType = saLineTypeList.find(item => parseFloat(item.Code) === parseFloat(leftLineType.LineType))
                                    // console.log('equal');
                            } else {
                                // console.log('not equal');
                                saLine.lineType = saLineTypeList.find(item => parseFloat(item.Code) === parseFloat(leftLineType.LineType))
                                    // saLine.lineType = saLineTypeList.find(item => item.id === 0)
                            }
                        }
                    } else {
                        saLine.lineType = saLineTypeList.find(item => item.id === 0)
                    }
                    // console.log(autoLineType.A266FF2A662E84b639DA.find(item => (item.MelkNMH === frontNMH && item.AdjNMH === backNMH)))
                    // console.log(frontNMH, backNMH)
                    // console.log(saLine.lineType)
                }
            })
            this.storage.boundray.saLines.forEach(saLine => {

                let coordinate = saLine.entity.getGeometry().getCoordinates()
                    // console.log(saLine.lineType)
                let isAparteman;
                if (saLine.rightPoly && saLine.rightPolyIndex != undefined) {

                    let polyText = this.getEntityById(saLine.rightPoly.get('text')[0].text)
                    saLine.rightPoly.setProperties({
                        polyText: polyText
                    })
                    if (polyText.ghate) {

                        saLine.rightPoly.setLabel(saLine.rightPolyIndex, saLine.lineType.name)
                        saLine.rightPoly.get('linesType')[saLine.rightPolyIndex] = saLine.lineType
                    }
                    if (polyText.isAparteman) isAparteman = polyText.isAparteman
                        // console.log(a)
                }
                if (saLine.leftPoly && saLine.leftPolyIndex != undefined) {
                    saLine.leftPoly.setLabel()
                    let polyText = this.getEntityById(saLine.leftPoly.get('text')[0].text)
                    saLine.leftPoly.setProperties({
                        polyText: polyText
                    })
                    if (polyText.ghate) {
                        saLine.leftPoly.setLabel(saLine.leftPolyIndex, saLine.lineType.name)
                        saLine.leftPoly.get('linesType')[saLine.leftPolyIndex] = saLine.lineType
                    }
                    if (polyText.isAparteman) isAparteman = polyText.isAparteman
                }
                // if(saLine.rightPoly.)
                if (isAparteman) {
                    var layer = this.layers.find(layer => layer.name === '3')
                } else {
                    var layer = this.layers.find(layer => layer.name === '4')
                }
                new SaLine(
                    coordinate[0], coordinate[1], {
                        layer: layer,
                        // color: color,
                        // lineWidth:entity.lineweight*Mm2Px/100,
                        // lineDash: getCadLineDash(entity.lineType),
                        // colorIndex: colorIndex,
                        // scale: entity.scale,
                        saLineType: saLine.lineType,
                        labelType: saLineLabelType.noLabel,
                        isAparteman: isAparteman,
                        nmh: [saLine.frontNMH, saLine.backNMH],
                        rightPoly: saLine.rightPoly,
                        leftPoly: saLine.leftPoly,
                        rightPolyIndex: saLine.rightPolyIndex,
                        leftPolyIndex: saLine.leftPolyIndex,
                        // labelType: saLineLabelType.onLine
                        // labelType: saLineLabelType.noLabel
                    })
                saLine.entity.remove()
            })

        }

        console.log(this.storage)
            // console.log(process)
    }
    clearSiMap() {
        // console.log('sa')
        this.getAllEntites().forEach(entity => {
            // console.log(entity)
            entity.remove()
        })
        this.layers.forEach(layer => {
            // if(layer.name === 'defa')
            this.map.removeLayer(layer)
        })
        this.layers = []
        this.activeLayer = new SiLayer({
            siMap: this,
            name: 'default layer',
            shouldMapExtentToThis: false,
            textColor: 'rgba(255,255,255,1)',
            // color:'rgba(255,255,255,1)',
        })
    }
    calcExtentFromFeaturesCollection(collection) {
        let features;
        if (collection instanceof Collection) features = collection.getArray()
        if (collection instanceof Array) features = collection
        if (!features[0]) return []
        let featExtent = features[0].getGeometry().getExtent();
        var i;
        for (i = 0; i < features.length; i++) {
            extend(featExtent, features[i].getGeometry().getExtent());
        }
        return featExtent
    }
    addElement(elementClass, elementContainer) {
        // console.log('addf')
        if (elementClass) {
            this.appStyle.elements.push(new elementClass(this, elementContainer))
        }
    }
}
export const getCadColor = (index) => {
    if (!index) {
        return undefined
    } else {
        // console.log(colorsMapper.getByACI(index).rgb )
        return colorsMapper.getByACI(index).rgb
    }
}
export const cadColorACI = [{
        index: 3,
        colorName: 'GREEN',
        ACI: Drawing.ACI.GREEN
    },
    {
        index: 2,
        colorName: 'YELLOW',
        ACI: Drawing.ACI.YELLOW
    },
    {
        index: 1,
        colorName: 'RED',
        ACI: Drawing.ACI.RED
    },
    {
        index: 7,
        colorName: 'WHITE',
        ACI: Drawing.ACI.WHITE
    },
    {
        index: 6,
        colorName: 'MAGENTA',
        ACI: Drawing.ACI.MAGENTA
    },
    {
        index: 5,
        colorName: 'BLUE',
        ACI: Drawing.ACI.BLUE
    },
    {
        index: 4,
        colorName: 'CYAN',
        ACI: Drawing.ACI.CYAN
    }
]

export const cursorStyle = {
    command: 'url(../webCad_Icons/cadCursor_command.ico) 33 33,auto',
    normal: 'url(../webCad_Icons/cadCursor_normal.ico) 33 33,auto',
    select: 'url(../webCad_Icons/cadCursor_select.ico) 33 33,auto',
}

export const ControlType = {
    featureProperties: 'feature properties',
    textProperties: 'text properties',
    snapProperties: 'snapProperties',
    centriodProperties: 'centriodProperties',
    layerProperties: 'layerProperties',
    baseLayerProperties: 'baseLayerProperties'
}
export const getCadLineDash = (type) => {
    switch (type) {
        case 'DASHDOT':
            return [10, 0, 10]
        case 'DASHDOT':
            return [5, 10, 5]
        case 'DOT':
            return [1, 0, 1]
        default:
            break
    }
}
export const wcs_sideBarContents_seprationAparteman = (siMap) => (
    [{
            name: wcs_sideBarContentsType.objectProperties,
            content: Object_Properties(siMap),
            title: 'Objects',
            icon: './webCad_Icons/wcs-features-light.svg'
        },
        {
            name: wcs_sideBarContentsType.layerProperties,
            content: Layer_Properties(siMap),
            title: 'Layer',
            icon: './webCad_Icons/wcs-layers-ligh.svg'
        },
        {
            name: wcs_sideBarContentsType.labeling,
            content: Labeling(siMap),
            title: 'Label',
            icon: './webCad_Icons/wcs-labeling.svg'
        },
        {
            name: wcs_sideBarContentsType.linelabeling,
            content: LineLabeling(siMap),
            title: 'Line Type',
            icon: './webCad_Icons/wcs-labeling.svg'
        },
        // {
        //     name: wcs_sideBarContentsType.layerProperties,
        //     content: Layer_Properties(siMap),
        //     title: 'Errors',
        //     icon: './webCad_Icons/wcs-layers-ligh.svg'
        // },
        // src="./webCad_Icons/wcs-features-light.svg"
    ])
export const wcs_sideBarContents = (siMap) => (
    [{
            name: wcs_sideBarContentsType.objectProperties,
            content: Object_Properties(siMap),
            title: 'Objects',
            icon: './webCad_Icons/wcs-features-light.svg'
        },
        {
            name: wcs_sideBarContentsType.layerProperties,
            content: Layer_Properties(siMap),
            title: 'Layer',
            icon: './webCad_Icons/wcs-layers-ligh.svg'
        },
        {
            name: wcs_sideBarContentsType.labeling,
            content: Labeling(siMap),
            title: 'Labeling',
            icon: './webCad_Icons/wcs-labeling.svg'
        },
        {
            name: wcs_sideBarContentsType.layerProperties,
            content: Layer_Properties(siMap),
            title: 'Errors',
            icon: './webCad_Icons/wcs-layers-ligh.svg'
        },
        {
            name: 'base image properties',
            content: BaseImage_Properties(siMap),
            title: 'Images',
            icon: "./webCad_Icons/wcs-baseimage-light.svg"
        },
        // src="./webCad_Icons/wcs-features-light.svg"
    ])
export const wcs_sideBarContents_arse = (siMap) => (
    [{
            name: wcs_sideBarContentsType.objectProperties,
            content: Object_Properties(siMap),
            title: 'Objects',
            icon: './webCad_Icons/wcs-features-light.svg'
        },
        {
            name: wcs_sideBarContentsType.layerProperties,
            content: Layer_Properties(siMap),
            title: 'Layer',
            icon: './webCad_Icons/wcs-layers-ligh.svg'
        },
        {
            name: 'base image properties',
            content: BaseImage_Properties(siMap),
            title: 'Images',
            icon: "./webCad_Icons/wcs-baseimage-light.svg"
        },
        // src="./webCad_Icons/wcs-features-light.svg"
    ])
export const wcs_sideBarContentsType = {
    noContent: 'no content',
    objectProperties: 'Object properties',
    layerProperties: 'Layers',
    baseImageProperties: 'base image properties',
    labeling: 'Labeling',
    errors: 'errors',
    linelabeling: 'line Labeling'
}
export const wcs_SA_commandsPalletContents = (siMap) => (
    [{
            name: 'draw pallet',
            content: [{
                    icon: './webCad_Icons/wcs_line_command.svg',
                    command: 'line',
                    name: 'Line'
                },
                {
                    icon: './webCad_Icons/wcs_pline_command.svg',
                    command: 'polyline',
                    name: 'Polyline'
                },
                {
                    icon: './webCad_Icons/wcs_circle_command.svg',
                    command: 'circle',
                    name: 'Circle radius center'
                },
                {
                    icon: './webCad_Icons/wcs_circle3p_command.svg',
                    command: 'circle3p',
                    name: 'Circle 3 point'
                },
                // {
                //     icon:'./webCad_Icons/wcs_polygon_command.svg',
                //     command:'polygon'
                // },
                {
                    icon: './webCad_Icons/wcs_point_command.svg',
                    command: 'point',
                    name: 'points'
                },
                {
                    icon: './webCad_Icons/wcs_text_command.svg',
                    command: 'text',
                    name: 'text'
                },
            ],
            title: 'Draw',
        },
        {
            name: 'modify pallet',
            content: [{
                    icon: './webCad_Icons/wcs_move_command.svg',
                    command: 'move',
                    name: 'Move'
                },
                {
                    icon: './webCad_Icons/wcs_rotate_command.svg',
                    command: 'rotate',
                    name: 'Rotate'
                },
                {
                    icon: './webCad_Icons/wcs_scale_command.svg',
                    command: 'scale',
                    name: 'Scale'
                },
                {
                    icon: './webCad_Icons/wcs_trim_command.svg',
                    command: 'trim',
                    name: 'Trim'
                },
                // {
                //     icon:'./webCad_Icons/wcs_polygon_command.svg',
                //     command:'polygon'
                // },
                {
                    icon: './webCad_Icons/wcs_extend_command.svg',
                    command: 'extend',
                    name: 'Extend'
                },
                {
                    icon: './webCad_Icons/wcs_copy_command.svg',
                    command: 'copy',
                    name: 'Copy'
                },

            ],
            title: 'Modify',
        },
        {
            name: 'tools pallet',
            content: [{
                    icon: './webCad_Icons/wcs_id_command.svg',
                    command: 'id',
                    name: 'Identity'
                },
                {
                    icon: './webCad_Icons/wcs_dist_command.svg',
                    command: 'dist',
                    name: 'Distance'
                },
                {
                    icon: './webCad_Icons/wcs_mdist_command.svg',
                    command: 'mdist',
                    name: 'Multi Distance'
                },
                {
                    icon: './webCad_Icons/wcs_coordinate_command.svg',
                    command: 'coordinates',
                    name: 'Coordinates'
                },
                {
                    icon: './webCad_Icons/wcs_area_command.svg',
                    command: 'area',
                    name: 'Area'
                },


            ],
            title: 'Tools',
        },
        {
            name: 'files pallet',
            content: [{
                    icon: './webCad_Icons/wcs_import_command.svg',
                    command: 'importpuredxf',
                    name: 'Import Dxf',
                },
                {
                    icon: './webCad_Icons/wcs_export_command.svg',
                    command: 'exportdxf',
                    name: 'Export DXF',
                },
                {
                    icon: './webCad_Icons/wcs_importtxt_command.svg',
                    command: 'importtxt',
                    name: 'Import TXT',
                },
                {
                    icon: './webCad_Icons/wcs_attach_command.svg',
                    command: 'attach',
                    name: 'Attach'
                },

            ],
            title: 'Files',
        },
        {
            name: 'aparteman pallet',
            content: [{
                    icon: './webCad_Icons/wcs_import_command.svg',
                    command: 'saveapartemandata',
                    name: 'ذخیره سازی قطعات'
                },
                {
                    icon: './webCad_Icons/wcs_attach_command.svg',
                    command: 'processmethod',
                    name: 'تشکیل پلی گون ها'
                },
                {
                    icon: './webCad_Icons/wcs_import_command.svg',
                    command: 'save',
                    name: 'ذخیره سازی ترسیمات'
                },
                {
                    icon: './webCad_Icons/wcs_import_command.svg',
                    command: 'load',
                    name: 'بازخوانی ترسیمات'
                },
                {
                    icon: './webCad_Icons/wcs_import_command.svg',
                    command: 'importdxf',
                    name: 'خواندن فایل تفکیک آپارتمان'
                },
            ],
            title: 'Aparteman',
        },
        // src="./webCad_Icons/wcs-features-light.svg"
    ])
export const wcs_commandsPalletContents = (siMap) => (
    [{
            name: 'draw pallet',
            content: [{
                    icon: './webCad_Icons/wcs_line_command.svg',
                    command: 'line',
                    name: 'Line'
                },
                {
                    icon: './webCad_Icons/wcs_pline_command.svg',
                    command: 'polyline',
                    name: 'Polyline'
                },
                {
                    icon: './webCad_Icons/wcs_circle_command.svg',
                    command: 'circle',
                    name: 'Circle radius center'
                },
                {
                    icon: './webCad_Icons/wcs_circle3p_command.svg',
                    command: 'circle3p',
                    name: 'Circle 3 point'
                },
                // {
                //     icon:'./webCad_Icons/wcs_polygon_command.svg',
                //     command:'polygon'
                // },
                {
                    icon: './webCad_Icons/wcs_point_command.svg',
                    command: 'point',
                    name: 'points'
                },
                {
                    icon: './webCad_Icons/wcs_text_command.svg',
                    command: 'text',
                    name: 'text'
                },
            ],
            title: 'Draw',
        },
        {
            name: 'modify pallet',
            content: [{
                    icon: './webCad_Icons/wcs_move_command.svg',
                    command: 'move',
                    name: 'Move'
                },
                {
                    icon: './webCad_Icons/wcs_rotate_command.svg',
                    command: 'rotate',
                    name: 'Rotate'
                },
                {
                    icon: './webCad_Icons/wcs_scale_command.svg',
                    command: 'scale',
                    name: 'Scale'
                },
                {
                    icon: './webCad_Icons/wcs_trim_command.svg',
                    command: 'trim',
                    name: 'Trim'
                },
                // {
                //     icon:'./webCad_Icons/wcs_polygon_command.svg',
                //     command:'polygon'
                // },
                {
                    icon: './webCad_Icons/wcs_extend_command.svg',
                    command: 'extend',
                    name: 'Extend'
                },
                {
                    icon: './webCad_Icons/wcs_copy_command.svg',
                    command: 'copy',
                    name: 'Copy'
                },

            ],
            title: 'Modify',
        },
        {
            name: 'tools pallet',
            content: [{
                    icon: './webCad_Icons/wcs_id_command.svg',
                    command: 'id',
                    name: 'Identity'
                },
                {
                    icon: './webCad_Icons/wcs_dist_command.svg',
                    command: 'dist',
                    name: 'Distance'
                },
                {
                    icon: './webCad_Icons/wcs_mdist_command.svg',
                    command: 'mdist',
                    name: 'Multi Distance'
                },
                {
                    icon: './webCad_Icons/wcs_coordinate_command.svg',
                    command: 'coordinates',
                    name: 'Coordinates'
                },
                {
                    icon: './webCad_Icons/wcs_area_command.svg',
                    command: 'area',
                    name: 'Area'
                },


            ],
            title: 'Measure',
        },
        {
            name: 'files pallet',
            content: [{
                    icon: './webCad_Icons/wcs_import_command.svg',
                    command: 'importpuredxf',
                    name: 'Import Dxf',
                },
                {
                    icon: './webCad_Icons/wcs_export_command.svg',
                    command: 'exportdxf',
                    name: 'Export DXF',
                },
                {
                    icon: './webCad_Icons/wcs_importtxt_command.svg',
                    command: 'importtxt',
                    name: 'Import TXT',
                },
                {
                    icon: './webCad_Icons/wcs_attach_command.svg',
                    command: 'attach',
                    name: 'Attach'
                },
            ],
            title: 'Files',
        },
        {
            name: 'cadastral pallet',
            content: [{
                    icon: './webCad_Icons/wcs_label_command.svg',
                    command: 'label',
                    name: 'برچسب ثبتی'
                },
                {
                    icon: './webCad_Icons/wcs_label_command.svg',
                    command: 'mabar',
                    name: 'برچسب معبر'
                },
                {
                    icon: './webCad_Icons/wcs_import_command.svg',
                    command: 'importjgw',
                    name: 'importJGW'
                },
                {
                    icon: './webCad_Icons/wcs_import_command.svg',
                    command: 'importdxf',
                    name: 'خواندن فایل عرصه',
                },
            ],
            title: 'Cadastral',
        },
        // src="./webCad_Icons/wcs-features-light.svg"
    ])

export const wcs_commandsPalletType = {
        draw: 'draw pallet',
        modify: 'modify pallet',
        tools: 'tools pallet',
        files: 'files pallet',
        cadastral: 'cadastral',
        aparteman: 'aparteman'
    }
    // this.map.addLayer(new TileLayer({
    //     visible:true,
    //     source: new XYZ({
    //       url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
    //       projection: 'EPSG:3857',
    //     }),
    //   }),)
    // this.map.addLayer(new TileLayer({
    //     visible:true,
    //     source: new OSM()
    //   }),)
const saveData = (function() {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function(data, fileName) {
        // var json = JSON.stringify(data),
        var blob = new Blob([data], { type: 'application/json' })
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

export const siMapCommandsPalletType = {
    draw: {
        name: 'draw pallet',
        content: [{
                icon: './webCad_Icons/wcs_line_command.svg',
                command: 'line',
                name: 'Line'
            },
            {
                icon: './webCad_Icons/wcs_pline_command.svg',
                command: 'polyline',
                name: 'Polyline'
            },
            {
                icon: './webCad_Icons/wcs_circle_command.svg',
                command: 'circle',
                name: 'Circle radius center'
            },
            {
                icon: './webCad_Icons/wcs_circle3p_command.svg',
                command: 'circle3p',
                name: 'Circle 3 point'
            },
            // {
            //     icon:'./webCad_Icons/wcs_polygon_command.svg',
            //     command:'polygon'
            // },
            {
                icon: './webCad_Icons/wcs_point_command.svg',
                command: 'point',
                name: 'points'
            },
            {
                icon: './webCad_Icons/wcs_text_command.svg',
                command: 'text',
                name: 'text'
            },
        ],
        title: 'Draw',
    },
    modify: {
        name: 'modify pallet',
        content: [{
                icon: './webCad_Icons/wcs_move_command.svg',
                command: 'move',
                name: 'Move'
            },
            {
                icon: './webCad_Icons/wcs_rotate_command.svg',
                command: 'rotate',
                name: 'Rotate'
            },
            {
                icon: './webCad_Icons/wcs_scale_command.svg',
                command: 'scale',
                name: 'Scale'
            },
            {
                icon: './webCad_Icons/wcs_trim_command.svg',
                command: 'trim',
                name: 'Trim'
            },
            // {
            //     icon:'./webCad_Icons/wcs_polygon_command.svg',
            //     command:'polygon'
            // },
            {
                icon: './webCad_Icons/wcs_extend_command.svg',
                command: 'extend',
                name: 'Extend'
            },
            {
                icon: './webCad_Icons/wcs_copy_command.svg',
                command: 'copy',
                name: 'Copy'
            },

        ],
        title: 'Modify',
    },
    measure: {
        name: 'tools pallet',
        content: [{
                icon: './webCad_Icons/wcs_id_command.svg',
                command: 'id',
                name: 'Identity'
            },
            {
                icon: './webCad_Icons/wcs_dist_command.svg',
                command: 'dist',
                name: 'Distance'
            },
            {
                icon: './webCad_Icons/wcs_mdist_command.svg',
                command: 'mdist',
                name: 'Multi Distance'
            },
            {
                icon: './webCad_Icons/wcs_coordinate_command.svg',
                command: 'coordinates',
                name: 'Coordinates'
            },
            {
                icon: './webCad_Icons/wcs_area_command.svg',
                command: 'area',
                name: 'Area'
            },


        ],
        title: 'Measure',
    },
    files: {
        name: 'files pallet',
        content: [{
                icon: './webCad_Icons/wcs_import_command.svg',
                command: 'importpuredxf',
                name: 'Import Dxf',
            },
            {
                icon: './webCad_Icons/wcs_export_command.svg',
                command: 'exportdxf',
                name: 'Export DXF',
            },
            {
                icon: './webCad_Icons/wcs_importtxt_command.svg',
                command: 'importtxt',
                name: 'Import TXT',
            },
            {
                icon: './webCad_Icons/wcs_attach_command.svg',
                command: 'attach',
                name: 'Attach'
            },
        ],
        title: 'Files',
    },
    cadastral: {
        name: 'cadastral pallet',
        content: [{
                icon: './webCad_Icons/wcs_label_command.svg',
                command: 'label',
                name: 'برچسب ثبتی'
            },
            {
                icon: './webCad_Icons/wcs_label_command.svg',
                command: 'mabar',
                name: 'برچسب معبر'
            },
            {
                icon: './webCad_Icons/wcs_import_command.svg',
                command: 'importjgw',
                name: 'importJGW'
            },
            {
                icon: './webCad_Icons/wcs_import_command.svg',
                command: 'importdxf',
                name: 'خواندن فایل عرصه',
            },
        ],
        title: 'Cadastral',
    },
    seperationAparteman: {
        name: 'aparteman pallet',
        content: [{
                icon: './webCad_Icons/wcs_import_command.svg',
                command: 'saveapartemandata',
                name: 'ذخیره سازی قطعات'
            },
            {
                icon: './webCad_Icons/wcs_attach_command.svg',
                command: 'processmethod',
                name: 'تشکیل پلی گون ها'
            },
            {
                icon: './webCad_Icons/wcs_import_command.svg',
                command: 'save',
                name: 'ذخیره سازی ترسیمات'
            },
            {
                icon: './webCad_Icons/wcs_import_command.svg',
                command: 'load',
                name: 'بازخوانی ترسیمات'
            },
            {
                icon: './webCad_Icons/wcs_import_command.svg',
                command: 'importdxf',
                name: 'خواندن فایل تفکیک آپارتمان'
            },
        ],
        title: 'Aparteman',
    },
    routeSurveying: {
        name: 'routeSurveying pallet',
        content: [{
            icon: './webCad_Icons/wcs_import_command.svg',
            command: 'addgpsdata',
            name: 'import points'
        }, {
            icon: './webCad_Icons/wcs_import_command.svg',
            command: 'ccl',
            name: 'create countorline'
        }, ],
        title: 'route',
    },
}

export const MapMouseEventType = {
    DoublePointerDown: 'Double Pointer Down'
};

class MapMouseEvent extends MapBrowserEvent {
    constructor(type, mbe) {
        super(type);
        this.mapBrowserEvent = mbe
    }
}

export const styleModeType = {
    noStyle: 'noStyle',
    main: 'main',
    seperationAparteman: 'seperationAparteman',
    arse: 'arse',
    routeSurveying: 'routeSurveying'
}

export const engineType = {
    openlayers2D: 'openlayers2D',
    cesium3D: 'cesium3D'
}