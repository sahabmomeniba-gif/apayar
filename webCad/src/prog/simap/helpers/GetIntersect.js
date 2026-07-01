import {circle, lineIntersect, point, pointToLineDistance} from '@turf/turf'
import { Feature } from 'ol';
import GeoJsonFormat from 'ol/format/GeoJSON'
import Geometry from 'ol/geom/Geometry';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import { EntityType } from '../entities/Entity';
import _ from 'lodash'
import { isEqualPoint } from './equalPoint';
export const GetIntersectPoint = (newFeature,source)=>{
    let format = new GeoJsonFormat()
    let geojson1 = format.writeFeatureObject(newFeature);
    // console.log('sala,')
    // console.log(source.getFeatures())
    // let extent = Feature.getGeometry().getExtent();
    let intersects;
    let points = []
    let feautres = source.getFeatures()
    feautres.forEach(feature=> {      
        if(feature.entityType === EntityType.label && feature.entityType === EntityType.text || feature.entityType === EntityType.node){
            // console.log(newFeature,feature) 
            return points
        }
        if(feature!=newFeature){
            let geometry = feature.getGeometry();
            let type = geometry.getType();
            let newFeatureType = newFeature.getGeometry().getType()
            if(type != 'Circle' && newFeatureType != 'Circle'){
                if(type === 'Point' || type === 'MultiPoint' || newFeatureType === 'Point' || newFeatureType === 'MultiPoint'){
                    return points
                }
                // let geojson2 = format.writeFeatureObject(feature);
                // intersects = [];
                if(type === 'LineString'){
                    var coordinates = feature.getGeometry().getCoordinates();
                    switch (newFeatureType) {
                        case 'LineString':
                            // var count = 0
                            // console.log('line 2 line 2')
                            var newCoordinates = newFeature.getGeometry().getCoordinates();
                            // console.log(first)
                            // console.log(newCoordinates.length)
                            for (let i = 0; i < coordinates.length-1; i++) {
                                for (let j = 0; j < newCoordinates.length-1; j++) {
                                    // count++
                                    var intersect = line_intersect(coordinates[i],coordinates[i+1],newCoordinates[j],newCoordinates[j+1])
                                    // console.log(intersect)
                                    // if(newCoordinates.length > 2){
                                    //     console.log(intersect)
                                    // }
                                    // console.log(intersect)
                                    if(intersect === null) break;
                                    if(intersect.seg1 && intersect.seg2){
                                        // console.log('first')
                                        // if(isEqualPoint([intersect.x,intersect.y],coordinates[i],1000)){
                                            
                                        //     break;
                                        // }
                                        // if(isEqualPoint([intersect.x,intersect.y],coordinates[i+1],1000)){
                                        //     break;
                                        // }
                                        // if(isEqualPoint([intersect.x,intersect.y],newCoordinates[j+1],1000)){
                                        //     break;
                                        // }
                                        // if(isEqualPoint([intersect.x,intersect.y],newCoordinates[j],1000)){
                                        //     break;
                                        // }
                                        var intersectFeature = new Feature({
                                            geometry:new Point([intersect.x,intersect.y]),
                                        })
                                        intersectFeature.setProperties({
                                            entites:[feature,newFeature]
                                        })
                                        points.push(intersectFeature)
                                    }
                                }
                            }
                            break;
                        case 'Polygon':
                            var newCoordinates = feature.getGeometry().getCoordinates()[0];
                            for (let i = 0; i < coordinates.length-1; i++) {
                                for (let j = 0; j < newCoordinates.length-1; j++) {
                                    // count++
                                    var intersect = line_intersect(coordinates[i],coordinates[i+1],newCoordinates[j],newCoordinates[j+1])
                                    // console.log(intersect)
                                    // if(newCoordinates.length > 2){
                                    //     console.log(intersect)
                                    // }
                                    if(intersect === null) break;
                                    if(intersect.seg1 && intersect.seg2){
                                        // if(isEqualPoint([intersect.x,intersect.y],coordinates[i],1000)){
                                        //     break;
                                        // }
                                        // if(isEqualPoint([intersect.x,intersect.y],coordinates[i+1],1000)){
                                        //     break;
                                        // }
                                        // if(isEqualPoint([intersect.x,intersect.y],newCoordinates[j+1],1000)){
                                        //     break;
                                        // }
                                        // if(isEqualPoint([intersect.x,intersect.y],newCoordinates[j],1000)){
                                        //     break;
                                        // }
                                        var intersectFeature = new Feature({
                                            geometry:new Point([intersect.x,intersect.y]),
                                        })
                                        intersectFeature.setProperties({
                                            entites:[feature,newFeature]
                                        })
                                        points.push(intersectFeature)
                                    }
                                }
                            }
                            break
                        default:
                            break;
                    }}
                    if(type === 'Polygon'){
                        var coordinates = feature.getGeometry().getCoordinates()[0];
                        
                        switch (newFeatureType) {
                            case 'LineString':
                                var newCoordinates = feature.getGeometry().getCoordinates();
                                for (let i = 0; i < coordinates.length-1; i++) {
                                    for (let j = 0; j < newCoordinates.length-1; j++) {
                                        // count++
                                        var intersect = line_intersect(coordinates[i],coordinates[i+1],newCoordinates[j],newCoordinates[j+1])
                                        // console.log(intersect)
                                        // if(newCoordinates.length > 2){
                                        //     console.log(intersect)
                                        // }
                                        if(intersect === null) break;
                                        if(intersect.seg1 && intersect.seg2){
                                            // if(isEqualPoint([intersect.x,intersect.y],coordinates[i],1000)){
                                            //     break;
                                            // }
                                            // if(isEqualPoint([intersect.x,intersect.y],coordinates[i+1],1000)){
                                            //     break;
                                            // }
                                            // if(isEqualPoint([intersect.x,intersect.y],newCoordinates[j+1],1000)){
                                            //     break;
                                            // }
                                            // if(isEqualPoint([intersect.x,intersect.y],newCoordinates[j],1000)){
                                            //     break;
                                            // }
                                            var intersectFeature = new Feature({
                                                geometry:new Point([intersect.x,intersect.y]),
                                            })
                                            intersectFeature.setProperties({
                                                entites:[feature,newFeature]
                                            })
                                            points.push(intersectFeature)
                                        }
                                    }
                                }
                                break;
                            case 'Polygon':
                                var newCoordinates = feature.getGeometry().getCoordinates()[0];
                                for (let i = 0; i < coordinates.length-1; i++) {
                                    for (let j = 0; j < newCoordinates.length-1; j++) {
                                        // count++
                                        var intersect = line_intersect(coordinates[i],coordinates[i+1],newCoordinates[j],newCoordinates[j+1])
                                        // console.log(intersect)
                                        // if(newCoordinates.length > 2){
                                        //     console.log(intersect)
                                        // }
                                        if(intersect === null) break;
                                        if(intersect.seg1 && intersect.seg2){
                                            // if(isEqualPoint([intersect.x,intersect.y],coordinates[i],1000)){
                                            //     break;
                                            // }
                                            // if(isEqualPoint([intersect.x,intersect.y],coordinates[i+1],1000)){
                                            //     break;
                                            // }
                                            // if(isEqualPoint([intersect.x,intersect.y],newCoordinates[j+1],1000)){
                                            //     break;
                                            // }
                                            // if(isEqualPoint([intersect.x,intersect.y],newCoordinates[j],1000)){
                                            //     break;
                                            // }
                                            var intersectFeature = new Feature({
                                                geometry:new Point([intersect.x,intersect.y]),
                                            })
                                            intersectFeature.setProperties({
                                                entites:[feature,newFeature]
                                            })
                                            points.push(intersectFeature)
                                        }
                                    }
                                }
                                break
                            default:
                                break;
                        }
                }
                // intersects = lineIntersect(geojson1, geojson2);
                // let intersectFeatures = format.readFeatures(intersects)
                // intersectFeatures.forEach(ifeature => {
                //     ifeature.setProperties({
                //         intersectFeature1:newFeature,
                //         intersectFeature2:feature,
                //     })
                //     points.push(ifeature)                                  
                // });
            }
            else{
                if(type === 'Circle'){
                    switch (newFeatureType) {
                        case 'LineString':
                            case 'LineString':
                            let coordinates = newFeature.getGeometry().getCoordinates();
                            // console.log(coordinates)
                            for (let index = 0; index < coordinates.length; index++) {
                                if(index != coordinates.length-1){
                                    let singelLine =new Feature({
                                        geometry:new LineString([coordinates[index],coordinates[index+1]])
                                    })
                                    let result = inteceptCircleLineSeg(feature,singelLine)
                                    if(result.length > 0){
                                        result.forEach(coord => {
                                            // console.log(feature)
                                            var center = feature.getGeometry().getCenter()
                                            // console.log(isEqualPoint([coord.x,coord.y],center,1000))
                                            let isEndPointEqual =  (isEqualPoint([coord.x,coord.y],coordinates[index],10000) || isEqualPoint([coord.x,coord.y],coordinates[index+1],10000))
                                            // var diff =Math.abs(Math.hypot(coord.y-center[1],coord.x-center[0])-feature.getGeometry().getRadius())
                                            if(!isEndPointEqual){
                                                var intersectFeature = new Feature({
                                                    geometry:new Point([coord.x,coord.y]),
                                                })
                                                intersectFeature.setProperties({
                                                    entites:[feature,newFeature]
                                                })
                                                points.push(intersectFeature)
                                            }
                                        });
                                    }
                                    // console.log()
                                }
                            }
                            break;
                            case 'Circle':
                                // circle2circleIntersect
                                let c1 = {x:newFeature.getGeometry().getCenter()[0],y:newFeature.getGeometry().getCenter()[1],r:newFeature.getGeometry().getRadius()}
                                let c2 = {x:feature.getGeometry().getCenter()[0],y:feature.getGeometry().getCenter()[1],r:feature.getGeometry().getRadius()}
                                let intersects = circle2circleIntersect(c1,c2);

                                if(intersects.p1){
                                    var intersectFeature = new Feature({
                                        geometry:new Point([intersects.p1.x,intersects.p1.y])
                                    })
                                    intersectFeature.setProperties({
                                        entites:[feature,newFeature]
                                    })
                                    points.push(intersectFeature)
                                } 
                                if(intersects.p2){
                                    var intersectFeature = new Feature({
                                        geometry:new Point([intersects.p2.x,intersects.p2.y])
                                    })
                                    intersectFeature.setProperties({
                                        entites:[feature,newFeature]
                                    })
                                    points.push(intersectFeature)
                                } 
                                break;
                        default:
                            break;
                    }
                }
                else{
                    // console.log(feature.getGeometry().getType(),newFeature.getGeometry().getType())
                    switch (type) {
                        case 'LineString':
                            let coordinates = feature.getGeometry().getCoordinates();

                            for (let index = 0; index < coordinates.length; index++) {
                                if(index != coordinates.length-1){
                                    let singelLine =new Feature({
                                        geometry:new LineString([coordinates[index],coordinates[index+1]])
                                    })
                                    let result = inteceptCircleLineSeg(newFeature,singelLine)
                                    if(result.length > 0){
                                        result.forEach(coord => {
                                            // console.log(coord)
                                            var intersectFeature = new Feature({
                                                geometry:new Point([coord.x,coord.y]),
                                            })
                                            intersectFeature.setProperties({
                                                entites:[feature,newFeature]
                                            })
                                            points.push(intersectFeature)
                                        });
                                    }
                                    // console.log()
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        }
      });
    return points
}

const  line2lineIntersection=(pointA, pointB, pointC, pointD)=> {
    var z1 = (pointA[0] - pointB[0]);
    var z2 = (pointC[0] - pointD[0]);
    var z3 = (pointA[1] - pointB[1]);
    var z4 = (pointC[1] - pointD[1]);
    var dist = z1 * z4 - z3 * z2;
    if (dist == 0) {
      return null;
    }
    var tempA = (pointA[0] * pointB[1] - pointA[1] * pointB[0]);
    var tempB = (pointC[0] * pointD[1] - pointC[1] * pointD[0]);
    var xCoor = (tempA * z2 - z1 * tempB) / dist;
    var yCoor = (tempA * z4 - z3 * tempB) / dist;
  
    if (xCoor < Math.min(pointA[0], pointB[0]) || xCoor > Math.max(pointA[0], pointB[0]) ||
      xCoor < Math.min(pointC[0], pointD[0]) || xCoor > Math.max(pointC[0], pointD[0])) {
      return null;
    }
    if (yCoor < Math.min(pointA[1], pointB[1]) || yCoor > Math.max(pointA[1], pointB[1]) ||
      yCoor < Math.min(pointC[1], pointD[1]) || yCoor > Math.max(pointC[1], pointD[1])) {
      return null;
    }
  
    return {x:xCoor,y:yCoor};
  }
  
const line_intersect = (pointA, pointB, pointC, pointD)=>{

    var x1 = pointA[0];
    var y1 = pointA[1];
    var x2 = pointB[0];
    var y2 = pointB[1];
    var x3 = pointC[0];
    var y3 = pointC[1];
    var x4 = pointD[0];
    var y4 = pointD[1];    
    var ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom == 0) {
        return null;
    }
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
    return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1),
        seg1: ua >= 0 && ua <= 1,
        seg2: ub >= 0 && ub <= 1
    };

  }  

const circle2circleIntersect = (c1,c2)=>{

        let dx = c2.x - c1.x;
        let dy = c2.y - c1.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > c1.r + c2.r) { return {}; }
    
        // One circle completely inside the other
        if (d < Math.abs(c1.r - c2.r)) { return {}; }
        dx /= d;
        dy /= d;
        const a = (c1.r * c1.r - c2.r * c2.r + d * d) / (2 * d);
        const px = c1.x + a * dx;
        const py = c1.y + a * dy;
        const h = Math.sqrt(c1.r * c1.r - a * a);
        return {
        p1: {
            x: px + h * dy,
            y: py - h * dx
        },
        p2: {
            x: px - h * dy,
            y: py + h * dx
        }
    };
}

const inteceptCircleLineSeg = (circle, line)=>{
    let a, b, c, d, u1, u2, ret, retP1, retP2, v1, v2;
    v1 = {};
    v2 = {};
    v1.x = line.getGeometry().getCoordinates()[1][0] - line.getGeometry().getCoordinates()[0][0];
    v1.y = line.getGeometry().getCoordinates()[1][1] - line.getGeometry().getCoordinates()[0][1];
    v2.x = line.getGeometry().getCoordinates()[0][0] - circle.getGeometry().getCenter()[0];
    v2.y = line.getGeometry().getCoordinates()[0][1] - circle.getGeometry().getCenter()[1];
    b = (v1.x * v2.x + v1.y * v2.y);
    c = 2 * (v1.x * v1.x + v1.y * v1.y);
    b *= -2;
    d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.getGeometry().getRadius() * circle.getGeometry().getRadius()));
    if(isNaN(d)){ // no intercept
        return [];
    }
    u1 = (b - d) / c;  // these represent the unit distance of point one and two on the line
    u2 = (b + d) / c;    
    retP1 = {};   // return points
    retP2 = {}  
    ret = []; // return array
    if(u1 <= 1 && u1 >= 0){  // add point if on the line segment
        retP1.x = line.getGeometry().getCoordinates()[0][0] + v1.x * u1;
        retP1.y = line.getGeometry().getCoordinates()[0][1] + v1.y * u1;
        ret[0] = retP1;
    }
    if(u2 <= 1 && u2 >= 0){  // second add point if on the line segment
        retP2.x = line.getGeometry().getCoordinates()[0][0] + v1.x * u2;
        retP2.y =line.getGeometry().getCoordinates()[0][1] + v1.y * u2;
        ret[ret.length] = retP2;
    }       
    return ret;
}