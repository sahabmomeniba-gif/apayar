import { testData ,CadData,TextsData } from "./sampel";
// import {SiLayer, SiLine, SiMap, SiModify, SiPolygon,SiText,TextStyle,VectorStyle} from "../prog/simap/SiMap";
import SiMap from "../prog/simap/entities/SiMap";
import SiLayer from "../prog/simap/entities/SiLayer";
import  SiLine  from "../prog/simap/entities/SiLine";

import proj4 from 'proj4';
proj4.defs("EPSG:32639","+proj=utm +zone=39 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs");
import LineString from 'ol/geom/LineString'
// import {centroid,area,polygon as turfPolygon, pointToLineDistance,lineString as turfLineString,point as turfPoint,
//     feature,transformRotate, bbox, bboxPolygon,buffer as t_buffer,pointOnFeature as t_point_on_feature, lineOffset } from '@turf/turf'
// import { center, sample } from 'turf';
import VectorLayer from 'ol/layer/Vector';
import { Feature } from 'ol';
// import Polygon from 'ol/geom/Polygon';
// import { Fill, Stroke, Style } from 'ol/style';

// import {getArea, getLength} from 'ol/sphere';
import  SiPolygon  from "../prog/simap/entities/SiPolygon";
// import SiPoint from "../prog/simap/entities/SiPoint";
import  SiCircle  from "../prog/simap/entities/SiCircle";
import { dxfSample } from "./sample";
import { TextStyle } from "../prog/simap/entities/SiText";
import { SiText } from "../prog/simap/entities/SiText";
import colorsMapper   from "autocad-colors-index"
import Point from "ol/geom/Point";
import { Layer } from "ol/layer";
import {Mm2Px, Px2M} from '../prog/simap/initparams'
// import { SiExport } from "../prog/simap/entities/SiExport";
// import { SvgExport } from "../prog/simap/entities/SvgExport";
const isSame = (v1, v2, tol)=> {
    return Math.abs(v1 - v2) <= tol
  }
const polygonRotate = coords => {
    let ma = []
    for (let i = 0; i < coords.length - 1; i++) {
        let x1 = coords[i][0];
        let y1 = coords[i][1];
        let x2 = coords[i + 1][0];
        let y2 = coords[i + 1][1];
        let ang = Math.atan2(x2 - x1, y2 - y1) + Math.PI ;
        let len = Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), 0.5);
        if (ang > Math.PI) ang -= Math.PI;
        let lenUsed = false;
        for (let j = 0; j < ma.length; j++) {
            if (isSame(ma[j].ang, ang, Math.PI / 18)) {
                ma[j].len += len;
                lenUsed = true;
                break;
            }
        }
        if (!lenUsed)
            ma.push({
                ang: ang,
                len: len
            })
  
    }
    let re = _.maxBy(ma, m => m.len);
  re.ang +=  Math.PI / 2
  if (re.ang > Math.PI / 2)
  re.ang += Math.PI
  if (re.ang > 2*Math.PI ){
    re.ang -= 2*Math.PI
  }
    return re.ang;
    
  }

  const calculateCenter= feature=> {
    let geometry = feature.getGeometry()
    let center, coordinates, minRadius;
    const type = geometry.getType();
    if (type === 'Polygon') {
      let x = 0;
      let y = 0;
      let i = 0;
      coordinates = geometry.getCoordinates()[0].slice(1);
      coordinates.forEach(function (coordinate) {
        x += coordinate[0];
        y += coordinate[1];
        i++;
      });
      center = [x / i, y / i];
    } else if (type === 'LineString') {
      center = geometry.getCoordinateAt(0.5);
      coordinates = geometry.getCoordinates();
    } else {
      center = getCenter(geometry.getExtent());
    }
    let sqDistances;
    if (coordinates) {
      sqDistances = coordinates.map(function (coordinate) {
        const dx = coordinate[0] - center[0];
        const dy = coordinate[1] - center[1];
        return dx * dx + dy * dy;
      });
      minRadius = Math.sqrt(Math.max.apply(Math, sqDistances)) / 3;
    } else {
      minRadius =
        Math.max(
          getWidth(geometry.getExtent()),
          getHeight(geometry.getExtent())
        ) / 3;
    }
    return {
      center: center,
      coordinates: coordinates,
      minRadius: minRadius,
      sqDistances: sqDistances,
    };
  }

const calculateMinLineLabelLenght = (poly,ts)=>{
  let coords = poly.getGeometry().getCoordinates()[0]
  let minLenght = Infinity;
  let feature = new Feature
  for (let i = 0; i < coords.length; i++) {
    if(i != coords.length-1){
      feature.setGeometry(new LineString([coords[i],coords[i+1]]))
      // console.log(feature.getGeometry().getCoordinates(),feature.getGeometry().getLength())
      let lenght  = feature.getGeometry().getLength()
      // console.log(lenght)
      if (lenght <minLenght){
        minLenght = lenght
      }
    }
  }

  if(minLenght<ts){
    minLenght = ts
  }
  return minLenght
}

const calculateLineLablePosition = (feature,offset)=>{
  // let lineOffset
  let rotate;
  let [xc,yc] = calculateCenter(feature).center
  let croods = feature.getGeometry().getCoordinates()
  let [xs,ys] = [croods[0][0],croods[0][1]]
  let [xe,ye] = [croods[1][0],croods[1][1]]
  let distance_SC =Math.sqrt(Math.pow((xc-xs),2)+Math.pow((yc-ys),2)) 
  
  let alpha = Math.atan(offset/distance_SC) ;
  let beta = Math.PI/2 
  let X = ((xs/Math.tan(beta))+(xc/Math.tan(alpha))+ys-yc)/((1/Math.tan(alpha))+(1/Math.tan(beta)))
  let Y = ((ys/Math.tan(beta))+(yc/Math.tan(alpha))+xc-xs)/((1/Math.tan(alpha))+(1/Math.tan(beta)))
  rotate = -Math.atan((yc-ys)/(xc-xs))
  // let L;
  // if(offset ===0){
  //   L = 0
  // }
  // else{
  //   L = offset/Math.cos(angle1)
  // }
  // let angle0 = Math.atan(Math.abs(xc-xs)/Math.abs(yc-ys))
  // let angle2 = angle0- angle1
  // let m1 = Math.tan(angle0)
  // let m2 = -1/Math.tan(angle2)
  // let X = (m1*xs-ys+yc-m2*xc)/(m1-m2)
  // let Y = m1*X+ys-m1*xs
  // console.log(X,Y)
  
  if(xs>=xc){

    rotate = -Math.atan((yc-ys)/(xc-xs))
  }
  else{
 
    rotate =  -Math.atan((yc-ys)/(xc-xs)) + Math.PI
  }
  
  return {offset:[X,Y],rotate:rotate}
}

const insertLabelsToLines = (polygon,textLayer,textHeight)=>{

  let MinLabelLength = calculateMinLineLabelLenght(polygon,0.5)
  let polyCenter = calculateCenter(polygon).center
  // console.log({MinLabelLength})
  let coords = polygon.getGeometry().getCoordinates()[0]
  let feature =  new Feature;
  for (let i = 0; i < coords.length; i++) {
      if(i != coords.length-1){
          feature.setGeometry(new LineString([coords[i],coords[i+1]]))
          if(feature.getGeometry().getLength() > 0){

              // if(feature.getGeometry())

              // console.log(result)
              let InteriorPoint = calculateCenter(feature).center
              let round = Math.round(feature.getGeometry().getLength())
              let labelText;
              if(round == feature.getGeometry().getLength()){
                  labelText = `${round}.00`
              }
              else{
                  labelText = `${Math.round(feature.getGeometry().getLength()*100)/100}`
              }
              var c = document.createElement("canvas");
              var ctx = c.getContext("2d");

              ctx.font  = '20px B-Nazanin'
              // console.log(ctx)
              // console.log(this.font)
              let metrics = ctx.measureText(labelText);
              var width = metrics.width
              // console.log(width);
              let fontHeight = (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent)
              let nes = width/fontHeight
              let TransFormX = MinLabelLength*0.05
              let TransFormY = TransFormX/nes
              let result = calculateLineLablePosition(feature,textHeight/2)
              let offset =  result.offset
              let rotaitons = result.rotate
              let [X,Y] = [offset[0],offset[1]]
              // let rotaitons = 0
              let tstyle = new TextStyle('20px B-Nazanin')
              let text = new SiText(textLayer.map,'label1',InteriorPoint[0],InteriorPoint[1],-rotaitons,labelText,{TextStyle:tstyle,layer:textLayer})
              text.addTextByTextHeight(textHeight,'mid mid')
              text.setLabelToEntity(feature)

              // let text = new SiText(textLayer.map,'label1',X,Y,rotaitons,labelText,{TextStyle:tstyle,layer:textLayer})
              // let ts = 0.01;
              // let anchorX,anchorY;
              // if(Math.sin(rotaitons) == 0){
              //   anchorX = 'mid'
              // }
              // if(Math.cos(rotaitons) == 0){
              //   anchorY = 'mid'
              // }
              // var xcoords = [InteriorPoint[0] + ts,InteriorPoint[1]]
              // var ycoords = [InteriorPoint[0],InteriorPoint[1] + ts]
              // if(!anchorX){
              //   if(polygon.getGeometry().intersectsCoordinate(xcoords)){
              //     anchorX = 'right'
              //   }
              //   else{
              //     anchorX = 'left'
              //   }
              // }
              // if(!anchorY){
              //   if(polygon.getGeometry().intersectsCoordinate(ycoords)){
              //     anchorY = 'top'
              //   }
              //   else{
              //     anchorY = 'bottom'
              //   }
              // }
              // console.log(`${anchorX} ${anchorY}` , rotaitons*180/Math.PI, text.text.string)
              // console.log(text.text.string,Math.sin(150*Math.PI/180))
              // text.addTextByFrameFeature(BoundrayFeature)
          }
      }
  }


}

const insertLabel = (feature,textLayer,textHeight)=>{
  let croods = feature.getGeometry().getCoordinates()[0]
  let featureBbox = feature.getGeometry().getExtent()
  let delta = Math.max(Math.abs(featureBbox[0]-featureBbox[2]),Math.abs(featureBbox[1]-featureBbox[3]))
  let rotaitons = polygonRotate(croods)
  let rotationsDevTo45 = rotaitons
  while(rotationsDevTo45>Math.PI/2){
      rotationsDevTo45-=Math.PI/2
  }
  let InteriorPoint = feature.getGeometry().getInteriorPoint().getFlatCoordinates()
  let PolygonArea = Math.round(feature.getGeometry().getArea()*100)/100
  let labelText = `قطعه 1`
  let labelText2 = `${PolygonArea}` + ' ' + 'متر مربع'

  let tstyle = new TextStyle('20px B-Nazanin')
  let text = new SiText(textLayer.map,'label1',InteriorPoint[0],InteriorPoint[1],0,labelText,{TextStyle:tstyle,layer:textLayer})
  text.addTextByTextHeight(textHeight,'mid top')
  let text2 = new SiText(textLayer.map,'label1',InteriorPoint[0],InteriorPoint[1],0,labelText2,{TextStyle:tstyle,layer:textLayer})
  text2.addTextByTextHeight(textHeight,'mid bottom')
}

// const insertLabelsToLines = (polygon,textLayer)=>{

//   let MinLabelLength = calculateMinLineLabelLenght(polygon,0.5)
//   console.log(MinLabelLength)
//   let coords = polygon.getGeometry().getCoordinates()[0]
//   let feature =  new Feature;
//   let collection = []
//   for (let i = 0; i < coords.length; i++) {
//     if(i != coords.length-1){
//       feature.setGeometry(new LineString([coords[i],coords[i+1]]))
//     if(feature.getGeometry().getLength() > 0){

//       console.log(MinLabelLength)
//       // if(feature.getGeometry())
     
//       // console.log(result)
//       let InteriorPoint = calculateCenter(feature).center
//       let round = Math.round(feature.getGeometry().getLength())
//       let labelText;
//       if(round == feature.getGeometry().getLength()){
//           labelText = `${round}.00`
//       }
//       else{
//           labelText = `${Math.round(feature.getGeometry().getLength()*100)/100}`
//       }
//       var c = document.createElement("canvas");
//       var ctx = c.getContext("2d");
  
//       ctx.font  = '20px B-Nazanin'
//         // console.log(ctx)
//         // console.log(this.font)
//       let metrics = ctx.measureText(labelText);
//       var width = metrics.width
//         // console.log(width);
//       let fontHeight = (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent)
//       let nes = width/fontHeight
//       let TransFormX = MinLabelLength*0.05
//       let TransFormY = TransFormX/nes
//       let result = calculateLineLablePosition(feature,MinLabelLength*0.05)
//       let offset =  result.offset
//       let rotate = result.rotate
//       let [X,Y] = [offset[0],offset[1]] 
//       // let rotaitons = 0
//       let geom =  new Polygon([
//         [
//           [
//             X-TransFormX,
//             Y-TransFormY
//           ],
//           [
//             X+TransFormX,
//             Y-TransFormY
//           ],
//           [
//             X+TransFormX,
//             Y+TransFormY
//           ],
//           [
//             X-TransFormX,
//             Y+TransFormY
//           ],
//           [
//             X-TransFormX,
//             Y-TransFormY
//           ]
//         ]
//       ])
//       let BoundrayFeature = new Feature({
//         geometry: geom
//       });
      
//       let tstyle = new TextStyle('20px B-Nazanin')
//       let text = new SiText(textLayer.map,'label1',offset[0],offset[1],rotate,labelText,{TextStyle:tstyle,layer:textLayer})
//       text.addTextByFrameFeature(BoundrayFeature)
//     }
//     }
//     }
//   return collection
// }

// const insertLabel = (feature,textLayer)=>{
//   let croods = feature.getGeometry().getCoordinates()[0]
//   let featureBbox = feature.getGeometry().getExtent()
//   let delta = Math.max(Math.abs(featureBbox[0]-featureBbox[2]),Math.abs(featureBbox[1]-featureBbox[3]))
//   let rotate = polygonRotate(croods)
//   let rotationsDevTo45 = rotate
//   while(rotationsDevTo45>Math.PI/2){
//     rotationsDevTo45-=Math.PI/2
//   } 
//   let InteriorPoint = feature.getGeometry().getInteriorPoint().getFlatCoordinates()
//   let PolygonArea = feature.getGeometry().getArea()
//   let [X,Y] = [InteriorPoint[0],InteriorPoint[1]] 
//   let labelText = `قطعه 123456789`
//   let labelText2 = `${PolygonArea} متر مربع`
//   var c = document.createElement("canvas");
//   var ctx = c.getContext("2d");
//   ctx.font  = '20px B-Nazanin'
//   let metrics = ctx.measureText(labelText);
//   var width = metrics.width
//   let fontHeight = (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent)
//   let nes = width/fontHeight
//   let TransFormX  = PolygonArea/delta/rotationsDevTo45 
//   let TransFormY = TransFormX/nes
//   if(TransFormY*TransFormX*4 > PolygonArea){
//     TransFormX = TransFormX*PolygonArea/(4*TransFormY*TransFormX)
//     TransFormY = TransFormX/nes
//   }
//   let ts = 0.2
//   TransFormX *= ts
//   TransFormY *= ts
//   let geom =  new Polygon([
//     [
//       [
//         X-TransFormX,
//         Y-TransFormY
//       ],
//       [
//         X+TransFormX,
//         Y-TransFormY
//       ],
//       [
//         X+TransFormX,
//         Y+TransFormY
//       ],
//       [
//         X-TransFormX,
//         Y+TransFormY
//       ],
//       [
//         X-TransFormX,
//         Y-TransFormY
//       ]
//     ]
//   ])
//   // geom.rotate(0,InteriorPoint)
//   let BoundrayFeature = new Feature({
//     geometry: geom
//   });
//   // let geom2 = geom.clone()
//   // geom2.translate(-Math.sqrt(geom.getArea()),-Math.sqrt(geom.getArea()))
//   // let BoundrayFeature2 = new Feature({
//   //   geometry: geom2
//   // });
//   console.log(geom.getCoordinates())
//   let tstyle = new TextStyle('20px B-Nazanin')
//   let text = new SiText(textLayer.map,'label1',InteriorPoint[0],InteriorPoint[1],rotate,labelText,{TextStyle:tstyle,layer:textLayer})
//   text.addTextByFrameFeature(BoundrayFeature)
//   // let text2 = new SiText(textLayer.map,'label1',InteriorPoint[0],InteriorPoint[1],0,labelText2,{TextStyle:tstyle,layer:textLayer})
//   // text2.addTextByFrameFeature(BoundrayFeature2)
//   // text.text.imgLayer.getSource().setRotation(rotate)
//   // text.text.rotate = rotate
//   // var featureCenter = calculateCenter(BoundrayFeature).center
//   // var clone = BoundrayFeature.getGeometry().clone()
//   // clone.rotate(-rotate,featureCenter)
//   // text.setGeometry(clone)
//   // text2.text.imgLayer.getSource().setRotation(rotate)
//   // text2.text.rotate = rotate
//   // var featureCenter = calculateCenter(BoundrayFeature2).center
//   // var clone = BoundrayFeature2.getGeometry().clone()
//   // clone.rotate(-rotate,featureCenter)
//   // text2.setGeometry(clone)
//   return ([text,text])
// }


export class Floor  {

    constructor(siMap) {
        this.siMap = siMap
    }
    
    init() {
      
    }
    // build() {
    //     // console.log(testData)
    //     let MapContainer = this.siMap
    //     let polygonsFeatures =  CadData.polygons.features
    //     let linesFeatures =  CadData.lines.features
    //     let lineStyle = new VectorStyle('build_line Style',{color:'rgba(245,212,1,1)',width:3},{color:'rgba(245,212,1,0.0001)'})
    //     let onHoverlineStyle = new VectorStyle('build_line on hover Style',{color:'rgba(245,212,120,1)',width:6})
    //     let onSelectlineStyle = new VectorStyle('build_line on hover Style',{color:'rgba(245,212,120,2)',width:6})
        
    //     let polygonsLayer = new SiLayer({siMap:this.siMap, name:'polygons layer',shouldMapExtentToThis:true,notSelectable:true , defaultStyle:lineStyle
    //     ,onHoverStyle:onHoverlineStyle,onSelectStyle:onSelectlineStyle})
    //     let linesLayer = new SiLayer({siMap:this.siMap,name:'lines layer',shouldMapExtentToThis:true,defaultStyle:lineStyle
    //                                 ,onHoverStyle:onHoverlineStyle,onSelectStyle:onSelectlineStyle})
    //     for(let i=0;i<polygonsFeatures.length;i++) {
    //         let poly = new SiPolygon([polygonsFeatures[i].geometry.coordinates[0]], {layer: polygonsLayer})
    //     }
    //     for(let i=0;i<linesFeatures.length;i++) {
    //         let line = new SiLine(linesFeatures[i].geometry.coordinates[0], linesFeatures[i].geometry.coordinates[1], {layer: linesLayer,style:{stroke:{color:'rgba(231,2,13)'}}})
    //     }
    //     // let polygonsLayer = MapContainer.layers.find(l => l.name == 'polygons layer')
    //     // console.log(polygonsLayer)
    //     let boundrayLabelsStyle = new VectorStyle('build_labels Style',{color:'rgba(255,255,255,0.1)',width:1},{color:'rgba(255,255,255,0.01)',width:1})
    //     let onHoverlabelsBoundrayStyle = new VectorStyle('build_labels on hover Style',{color:'rgba(255,255,255,3)',width:1},{color:'rgba(255,255,255,1)',width:1})
    //     let onSelectlabelsBoundrayStyle = new VectorStyle('build_labels on select Style',{color:'rgba(233, 237, 185,1)',width:2})
    //     let textLayer = new SiLayer({siMap:this.siMap,name:'text layer',defaultStyle:boundrayLabelsStyle,onHoverStyle:onHoverlabelsBoundrayStyle,
    //                                 onSelectStyle:onSelectlabelsBoundrayStyle,type:'text'})
    //     insertLabels(polygonsLayer.source.getFeatures(),textLayer)
    //     // insertLabelsToLines(linesLayer.source.getFeatures(),textLayer)
    //     // insertLabelsToLines(linesLayer.source.getFeatures(),textLayer)
    //     let mapModify = new SiModify(this.siMap)
    //     // console.log(mapModify)
    //     // mapModify.addModifyVertexPoint(516829.1503,3953079.270,'translate')
    //     // mapModify.addModifyVertexPoint(516829.1503,3953069.270,'endpoint')
    // }
    load() {
    }
    MapOl(){
      // let Layer = new SiLayer({
      //   siMap:this.siMap,
      //   name:'a4portLayer',
      //   shouldMapExtentToThis:true,
      //   color:'rgba(255,255,255,1)',
      //   textColor:'rgba(255,255,255,1)'
      // })
      // let text = new SiText(undefined,'test text',0,0,0,'salam1',{
      //   layer:Layer
      // })
      // text.addTextByTextHeight(2)
      // let text2 = new SiText(undefined,'test text',10,10,Math.PI/4,'salam2',{
      //   layer:Layer
      // })
      // text2.addTextByTextHeight(2)
      // new SiCircle([0,0],15,{
      //   layer:Layer,
      //   color:'rgba(255,255,255,1)'
      // })
    }
    a4port(){
      let Layer = new SiLayer({
        siMap:this.siMap,
        name:'a4portLayer',
        modifiable:false,
        shouldMapExtentToThis:true,
        color:'rgba(255,255,255,1)',
        textColor:'rgba(0,0,0,1)'
      })
      let TextLayer = new SiLayer({
        siMap:this.siMap,
        name:'a4portTextLayer',
        shouldMapExtentToThis:true,
        color:'rgba(255,255,255,1)',
        textColor:'rgba(0,0,0,1)',
      })
      let p1 = [[0,0],[10,0],[10,10],[17,20],[0,10],[0,0]]
      let poly = new SiPolygon([p1],{
        layer:Layer,
        color:'rgba(0,0,0,1)',
        lineWidth:1*Mm2Px,
        fillColor:'#eedcdc00',
        selectable:false
      })
      let extent = poly.getGeometry().getExtent();
        let dx = extent[2]-extent[0]
        let dy = extent[3]-extent[1]
        let paper={width:100,height:100,margin:[0,0]}
        let resolution = 100
        let sx = dx / ((paper.width - paper.margin[0]) / 1000);
        let sy = dy / ((paper.height - paper.margin[1]) / 1000);
        let sc = Math.max(sx, sy);
        let t = 10000
        if (sc < 300)
            t = 50;
        else if (sc < 1000)
            t = 100;
        else if (sc < 3000)
            t = 500;
        else if (sc < 10000)
            t = 1000;
        else if (sc < 30000)
            t = 5000;

        this.scale =  Math.ceil(sc / t) * t
        let textHeight = this.scale * 2/1000
      insertLabel(poly,TextLayer,textHeight)
        insertLabelsToLines(poly,TextLayer,textHeight)
      this.siMap.map.once('rendercomplete',()=>{
        if(poly){
          // console.log(poly.getGeometry().getExtent())
          // this.siMap.zoomToExtent(poly.getGeometry().getExtent())
          // console.log(poly)
          this.siMap.setZoomTarget(poly)
        }
      })
      // let svg = new SvgExport({
      //   siMap:this.siMap,
      //   paperWidth:40,
      //   paperHeight:40
      // })
      // svg.addEentities(poly)
      // // svg.addEentities(polylabels[0])
      // polylabels.forEach(label => {
      //   svg.addEentities(label)
      // });
      // lineslabels.forEach(label=>{
      //   svg.addEentities(label)
      // })
      // // this.siMap.svgExport =svg
      // // console.log(svg.draw('xml'))
      // return svg.draw('xml')
    }
    a4port2(){
      let Layer = new SiLayer({
        siMap:this.siMap,
        name:'a4portLayer',
        // modifiable:false,
        shouldMapExtentToThis:true,
        color:'rgba(255,255,255,1)',
        textColor:'rgba(0,0,0,1)'
      })
      
      // let text = new SiText(this.siMap.map,'sample',0,0,0,'salam',{layer:Layer})
      // text.addTextByTextHeight(20000*2.5)
      let p1 = [[0,0],[10,0],[10,10],[17,20],[0,10],[0,0]]
      let p2 = [[10,0],[10,10],[30,10],[30,0],[10,0]]
      let p3 = [[30,30],[30,10],[10,10],[17,20],[10,30],[30,30]]
      new SiPolygon([p1],{
        layer:Layer,
        color:'rgba(0,0,0,1)',
        fillColor:'rgba(0,0,0,0.75)',
      })
      new SiPolygon([p2],{
        layer:Layer,
        color:'rgba(0,0,0,1)',
        fillColor:'rgba(255,255,255,1)',
      })
      new SiPolygon([p3],{
        layer:Layer,
        color:'rgba(0,0,0,1)',
        fillColor:'rgba(255,255,255,1)',
      })
      
      // this.siMap.setZoomTarget(poly)
      
    }
    test() {
      // let polygonsFeatures =  CadData.polygons.features
      // let linesFeatures =  CadData.lines.features
      let data = dxfSample.entities
      let Layer = new SiLayer({
        siMap:this.siMap,
        name:'vectorLayer',
        shouldMapExtentToThis:true,
        type:'vector',
        color:'rgba(255,255,255,1)',
        modifiable:false
      })
      let textLayer = new SiLayer({
        siMap:this.siMap,
        name:'text layer2',
        shouldMapExtentToThis:false,
        type:'text',
        modifiable:true
      })
      let tstyle = new TextStyle('20px B-Nazanin')
      const getLineDash = (type)=>{
        switch (type) {
          case 'DASHDOT':
            return [10,0,10]
          case 'DASHDOT':
            return [5,10,5]
          case 'DOT':
            return [1,0,1]
          default:
            break
        }
      }
      const getColor= (index)=>{
        if(index !=0){
          return colorsMapper.getByACI(index).rgb
        }
        else{
          console.log('index 0')
          return undefined
        }
      }
      data.forEach(entity => {
          switch (entity.type) {
            case "LINE":
              new SiLine(
                [[entity.vertices[0].x,entity.vertices[0].y],[entity.vertices[1].x,entity.vertices[1].y]]
                ,
                {
                layer:Layer,
                color: getColor(entity.colorIndex),
                lineWidth:entity.lineweight,
                lineDash:getLineDash(entity.lineType)
              })
              break;
            case "TEXT":  
              let text = new SiText(this.siMap.map,'sample',entity.startPoint.x,entity.startPoint.y,entity.rotation,entity.text,
                          {TextStyle:tstyle,layer:textLayer})
            text.addTextByTextHeight(entity.textHeight*2.5)
            default:
              break;
          }
      });

      let drawDxf = (dxfFile,siMap)=>{
        const parser = new DxfParser();
        const dxf = parser.parseSync(dxfFile);
        // let l = new SiLine([0,0],[10000,10000],{layer:siMap.activeLayer})
        // console.log(dxfFile)
        // let vertex = (v)=>[v.x,v.y]
        // dxfFile.entities.forEach(e=>{
        //     switch (e.type) {
        //         case'LINE':
        //             let l = new SiLine([vertex(e.vertices[0]),vertex(e.vertices[1])],{layer:siMap.activeLayer})
        //             console.log(vertex(e.vertices[0]),vertex(e.vertices[1]))
        //     }
        // })
        let data = dxf.entities
        let Layer = siMap.addLayer({
            siMap:siMap,
            name:'vectorLayer',
            shouldMapExtentToThis:true,
            type:'vector',
            color:'rgba(150,230,45,1)',
            lineWidth:4,
        })
        
        let tstyle = new TextStyle('20px B-Nazanin')
        const getColor= (index)=>{
          if(index !=0){
            return colorsMapper.getByACI(index).rgb
          }
          else{
            // console.log('index 0')
            return undefined
          }
        }
        const getLineDash = (type)=>{
            switch (type) {
                case 'DASHDOT':
                    return [10,0,10]
                case 'DASHDOT':
                    return [5,10,5]
                case 'DOT':
                    return [1,0,1]
                default:
                    break
            }
        }
        data.forEach(entity => {
            // console.log(entity)
            switch (entity.type) {
                case "LINE":
                    new SiLine(
                        [[entity.vertices[0].x,entity.vertices[0].y],[entity.vertices[1].x,entity.vertices[1].y]]
                        ,
                        {
                            layer:Layer,
                            color:getColor(entity.colorIndex),
                            lineWidth:entity.lineweight,
                            // lineDash:getLineDash(entity.lineType)
                        })
                    break;
                case "CIRCLE":
                    // console.log(entity)
                    new SiCircle(
                        [entity.center.x,entity.center.y]
                        ,entity.radius,
                        {
                            layer:Layer,
                            color:getColor(entity.colorIndex),
                            lineWidth:entity.lineweight,
                            // lineDash:getLineDash(entity.lineType)
                        })
                    break;
                case "TEXT":
                    let text = new SiText(siMap.map,'sample',entity.startPoint.x,entity.startPoint.y,-entity.rotation,entity.text,
                        {TextStyle:tstyle,layer:siMap.textLayer})
                    text.addTextByTextHeight(entity.textHeight*2.5)
                default:
                    break;
            }
        });
        return dxf;
    }
        this.siMap.onSelect = (ent,ev)=>{
            if(ent.type == "text") {
                // console.log(2, ent)
                ent.changeText('راه پله مشاعی')
            }
        }
      // console.log(i)
      // console.log(j)
      // for(let i=0;i<polygonsFeatures.length;i++) {
      //           let poly = new SiPolygon([polygonsFeatures[i].geometry.coordinates[0]], {layer: Layer
      //           ,
      //           color:'rgba(245,212,1,1)'})
      //       }
      // for(let i=0;i<linesFeatures.length;i++) {
      //           let line = new SiLine(linesFeatures[i].geometry.coordinates[0], linesFeatures[i].geometry.coordinates[1],
      //              {
      //                layer:Layer,
      //                color:'rgba(245,212,1,1)'
      //              }
      //              )
      //       }
      // new SiLine([516825.1503,3953079.270],[516832.1503,3953059.270],{
      //   layer:Layer,
      //   lineDash:[5,10,5],
      //   width:10
      // })
      // new SiPoint(516829.1503,3953079.270,{
      //   layer:Layer,
      //   shapeStyle:'rectangle'
      // })
      // new SiPoint(516832.1503,3953079.270,{
      //   layer:Layer,
      //   color:'rgba(125,125,125,1)',
      //   shapeRadius:8
      // })
      // new SiCircle([516852.1503,3953089.270],7,{
      //   layer:Layer,
      //   color:'rgba(125,125,125,1)',
      //   fillColor:'rgba(25,220,35,1)'
      // })
    }
    
}
