import {  Stroke, Style } from "ol/style";
import Point from 'ol/geom/Point'
import LineString from "ol/geom/LineString";
import Command from "../Command";
import { getPoint,  getEntities, reapeatCondition, stepActionType, getFile, getImageFile} from "../CommandSteps";
import { EntityType } from "../../entities/Entity";
import SiPoint from "../../entities/SiPoint";
import SiPolyLine from "../../entities/SiPolyline";
import SiCircle from "../../entities/SiCircle";
import SiLine from "../../entities/SiLine";
import SiPolygon from "../../entities/SiPolygon";
import { EntityMove } from "../Modify/SiMoveModify";
import { Centriod, SiPointLabels } from "../../entities/Labels";
import { mapActionsType } from "../../entities/SiActions";
import readWorldFile from 'wld-reader'
import GeoImage from 'ol-ext/source/GeoImage'
import ImageLayer from 'ol/layer/Image';
import { Feature } from "ol";
import Polygon from "ol/geom/Polygon";
import calculateCenter from "../../helpers/CalculateCenter";

export default class SiImportJGW extends Command{
    constructor(option) {
        super(option)
        console.log('214')
        this.name = 'A'
        // console.log(this.siMap.siSelect.getOnModifyPoint())
        this.steps = [new getImageFile(this),new getFile(this)];
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
                    switch (name) {
                        case stepActionType.importFile:
                            let splitName = value.name.split('.') 
                            // console.log(splitName[splitName.length-1])
                            if(splitName[splitName.length-1]){
                                if(splitName[splitName.length-1] != 'jpg'){
                                    console.log('this input is not jpeg file')
                                    this.commandEnd()
                                    break;
                                }
                            }
                            this.imageFile = value.file;
                            this.handleNext();
                            
                            break; 
                        // case stepActionType.checkInput:
                        //     // console.log('check?')
                        //     this.hasInput = true;    
                        //     break;
                        // case stepActionType.cancelInput:
                        //     // console.log('cancel')
                        //     this.commandEnd()
                        //     break;
                    default:
                        break;
                }
                break;
            case 1:
                    switch (name) {
                        case stepActionType.importFile:
                            let splitName = value.name.split('.') 
                            // console.log(splitName[splitName.length-1])
                            if(splitName[splitName.length-1]){
                                if(splitName[splitName.length-1] != 'jgw'){
                                    console.log('this input is not jgw file')
                                    this.commandEnd()
                                    break;
                                }
                            }
                                this.jgwFile = value.file.result;
                                this.handleNext();
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
        this.transformVal = readWorldFile(this.jgwFile)
        const img= new Image()
        img.onload = (e)=>{
            let corners = getCorners(this.jgwFile,img.width,img.height);
            let tfc = transformValFromCorners(corners)
            let staticSource = new GeoImage({
                url: this.imageFile,
                projection: this.siMap.projection,
                imageExtent:tfc.extent,
                imageCenter: tfc.center,
                imageRotate: tfc.angle,
                imageScale: [tfc.pw/img.width,tfc.ph/img.height],
              });
              let imageLayer= new ImageLayer
              imageLayer.setSource(staticSource)
            //   console.log(staticSource)
            //   console.log(imageLayer)
              this.siMap.map.addLayer(imageLayer)
              this.siMap.zoomToExtent(tfc.extent,1)
        }
        img.src = this.imageFile
    }
    onAbrot(){
        this.siMap.clearModify();
        this.handleSiCommandMessage(undefined)
        this.lines.forEach(entity=>{
            entity.siLayer.source.removeFeature(entity)
        })
    }
}


let getCorners = (jgwFile, width, height) => {
    // console.log(jgwFile,width,height)
    let jgwFileContent = jgwFile.split('\r\n');
    const m11 = parseFloat(jgwFileContent[0]),
        m12 = parseFloat(jgwFileContent[1]),
        m21 = parseFloat(jgwFileContent[2]),
        m22 = parseFloat(jgwFileContent[3]),
        x0 = parseFloat(jgwFileContent[4]),
        y0 = parseFloat(jgwFileContent[5]);

    let transformation = (m11, m12, m21, m22, xy0, pixel) => {
        let transform = (a, b, c, d, e) => a * c + b * d + e;
        const xp = transform(pixel[0], m12, m11, pixel[1], xy0[0]);
        const yp = transform(pixel[0], m22, m21, pixel[1], xy0[1]);
        return [xp, yp];
    }

    const xy0 = [x0, y0];
    
    const x0y0 = transformation(m11, m12, m21, m22, xy0, [0, 0]);
    const x0ye = transformation(m11, m12, m21, m22, xy0, [0, height]);
    const xey0 = transformation(m11, m12, m21, m22, xy0, [width, 0]);
    const xeye = transformation(m11, m12, m21, m22, xy0, [width, height]);

    // const center = lon0lat0.map((v, i) => (v + lon0late[i] + lonelat0[i] + lonelate[i]) / 4);
    // console.log(8888,lon0lat0, lon0late, lonelat0, lonelate)
    return [x0y0, x0ye,xey0,  xeye];
}

const transformValFromCorners = (corners)=>{
    // console.log(skew)
    let cx=0,cy=0;
    let minX,minY,maxX,maxY;
    minX = Infinity;
    minY = Infinity;
    maxX = -Infinity;
    maxY = -Infinity;
    corners.forEach(point=>{
        cx+=point[0];
        cy+=point[1];
        if(point[0] <minX) minX = point[0]
        if(point[0] >maxX) maxX = point[0]
        if(point[1] <minY) minY = point[1]
        if(point[1] >maxY) maxY = point[1]
    })
    let poly = new Feature ({
        geometry:new Polygon([corners])
    })
    let poly2 = new Feature ({
        geometry:new Polygon([corners])
    })
    let clone = poly.getGeometry().clone();
    let tp; //translate point
    let sp; //scale point
    let rp; // rotate point
    let extent = poly.getGeometry().getExtent()
    // console.log(extent)
    let coordinates = corners
    coordinates.forEach(function (coordinate) {
    if(coordinate[0] === extent[2]){
        tp = coordinate
    }
    if(coordinate[1] === extent[1]){
        rp = coordinate
    }
    if(coordinate[1]=== extent[3]){
        sp = coordinate
    }
        });
    let angle =  Math.atan2((sp[0]-tp[0]),(sp[1]-tp[1])) + Math.PI/2
    
    clone.rotate(-angle,[cx/4,cy/4]);
    // clone.scale()
    poly.setGeometry(clone);
    let imageExtent = poly2.getGeometry().getExtent()
    let crood = poly2.getGeometry().getCoordinates()[0];

    let p1;
    let p2;
    let p3;
    // console.log(imageExtent)
    crood.forEach(point => {
        if(point[0] === imageExtent[0]){
            p1 = point
        }
        if(point[1] === imageExtent[1] && point !== p1){
            p2 = point
        }
        if(point[0] === imageExtent[2]){
            p3 = point
        }
    });
    // console.log(p1,p2,p3)
    let pw = Math.max(Math.hypot((p2[1]-p1[1]),(p2[0]-p1[0])),Math.hypot((p3[1]-p2[1]),(p3[0]-p2[0])))
    // let pw = Math.max(calcDistance(p1,p2),calcDistance(p2,p3))
    let ph = Math.min(Math.hypot((p2[1]-p1[1]),(p2[0]-p1[0])),Math.hypot((p3[1]-p2[1]),(p3[0]-p2[0])))
    return{
        center:[cx/4,cy/4],
        extent: poly.getGeometry().getExtent(),
        baseExtent:extent,
        angle:angle,
        poly2:poly2,
        pw:ph,
        ph:pw
    }
}
