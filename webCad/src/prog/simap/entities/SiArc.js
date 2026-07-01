import { Feature } from "ol";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";

import getVertex from "../helpers/GetVertex";
import { EntityType, ModifyType } from "./Entity";
import Entity from "./Entity"
import Geometry from "ol/geom/Geometry";
import { Icon, Stroke, Style } from "ol/style";
import { lineArc, point } from "@turf/turf";
import { latlon2xy, RotateTranslate2dTransform, xy2latlon } from "../helpers/TransformCoordinates";
import MultiLineString from "ol/geom/MultiLineString";


export default class SiArc extends Entity {
    constructor(center,radius,startAngle,endAngle,options) {
        console.log("🚀 ~ file: SiArc.js ~ line 17 ~ SiArc ~ constructor ~ center", center)
        console.log("🚀 ~ file: SiArc.js ~ line 17 ~ SiArc ~ constructor ~ endAngle", endAngle)
        console.log("🚀 ~ file: SiArc.js ~ line 17 ~ SiArc ~ constructor ~ startAngle", startAngle)
        console.log("🚀 ~ file: SiArc.js ~ line 17 ~ SiArc ~ constructor ~ radius", radius)
        super(options)
        // console.log(center,'center')
        
        this.center = center;
        // let turfCenter = point(xy2latlon(center[0],center[1],39));
        this.radius = radius
        this.startAngle = startAngle
        this.endAngle = endAngle
        // while (this.startAngle <0) {
        //     this.startAngle+=360
        // }
        // while (this.endAngle <0) {
        //     this.endAngle+=360
        // }
        
        // let arc = lineArc(turfCenter, this.radius, this.startAngle, this.endAngle,{units:'meters',steps:1000});
        let arc = this.getLineArc(this.center,this.radius,this.startAngle,this.endAngle,100)
        // this.coordinate = arc.geometry.coordinates.map(coordinate=>{
        //     return latlon2xy(coordinate[0],coordinate[1],39)
        // })
        this.coordinates = arc
        // console.log(this.coordinates)
        this.setGeometry(new MultiLineString(this.coordinates))
        this.siLayer.addEntity(this);
        this.entityType = EntityType.arc
        this.setCurrentStyle();
        // this.setModifyPoint()
    }
    getCenter(){
        return this.center
    }
    getAngles(){
        return {
            firstAngle:this.firstAngle,
            lastAngle:this.lastAngle
        }
    }
    getRadius(){
        return this.radius
    }
    getLineArc(center,radius,startAngle,endAngle,segments=100){
        let lines = []
        let count = 0;
        // console.log(startAngle,endAngle)
        // if(startAngle > 360){
        //     let b = Math.round(startAngle/360)
        //     startAngle -= b*360
        // }
        // if(endAngle > 360){
        //     let b = Math.round(endAngle/360)
        //     endAngle -= b*360
        // }
        // console.log(startAngle,endAngle)
        if(startAngle>endAngle){
            endAngle += 360
        }
        let segAngle = (endAngle-startAngle)/segments
        console.log(segAngle)
        let firstCoordinate = RotateTranslate2dTransform(center,radius,startAngle)
        let lastCoordinate = firstCoordinate
        while (count<segments) {
            // console.log(Math.round((count+1)*segAngle*100000000)/100000000)
            startAngle += Math.round(segAngle*100000000)/100000000
            let newCoordinates = (RotateTranslate2dTransform(center,radius,startAngle)) 
            lines.push([lastCoordinate,newCoordinates])
            count++
            lastCoordinate = newCoordinates
        }
        return lines
    }
    setModifyPoint(){
        let vertexs = this.getArcVertex()
        // console.log(vertexs)
        this.modifyFeature.forEach(feature=>{
            this.siLayer.siMap.modify.removeFeature(feature)
        })
        this.modifyFeature = []
       let centerFeature = new Feature({
           geometry: new Point(vertexs.center),
           modifyType:ModifyType.translatePoint
           ,targetFeature:this
       })
       centerFeature.setStyle(this.getModifyStyle(ModifyType.endPoint,0))
       this.siLayer.siMap.modify.addFeature(centerFeature);
       this.modifyFeature.push(centerFeature)
       let startPointFeature = new Feature({
        geometry: new Point(vertexs.startCoordinate),
        modifyType:ModifyType.endPoint
        ,targetFeature:this
        })
        startPointFeature.setStyle(this.getModifyStyle(ModifyType.endPoint,0))
        this.siLayer.siMap.modify.addFeature(startPointFeature);
        this.modifyFeature.push(startPointFeature)
        let endPointFeature = new Feature({
        geometry: new Point(vertexs.endCoordinate),
        modifyType:ModifyType.endPoint
        ,targetFeature:this
        })
        endPointFeature.setStyle(this.getModifyStyle(ModifyType.endPoint,0))
        this.siLayer.siMap.modify.addFeature(endPointFeature);
        this.modifyFeature.push(endPointFeature)
        let midPointFeature = new Feature({
        geometry: new Point(vertexs.midCoordinate),
        modifyType:ModifyType.midPoint
        ,targetFeature:this
        })
        midPointFeature.setStyle(this.getModifyStyle(ModifyType.endPoint,0))
        this.siLayer.siMap.modify.addFeature(midPointFeature);
        this.modifyFeature.push(midPointFeature)
    }
    getArcVertex(){
        return {
            center:this.center,
            startCoordinate:(RotateTranslate2dTransform(this.center,this.radius,Math.round(this.startAngle*100000000)/100000000) ),
            endCoordinate:(RotateTranslate2dTransform(this.center,this.radius,Math.round(this.endAngle*100000000)/100000000) ),
            midCoordinate:(RotateTranslate2dTransform(this.center,this.radius,Math.round(((this.startAngle+this.endAngle)/2)*100000000)/100000000) ) 
        }
    }
    getAngle(){
        let coordinates = this.getGeometry().getCoordinates();
        return Math.atan2((coordinates[1][1]-coordinates[0][1]),(coordinates[1][0]-coordinates[0][0]))*(180/Math.PI)
    }
    getLength(){
        let coordinates = this.getGeometry().getCoordinates();
        return Math.hypot((coordinates[1][1]-coordinates[0][1]),(coordinates[1][0]-coordinates[0][0]))
    }

}

