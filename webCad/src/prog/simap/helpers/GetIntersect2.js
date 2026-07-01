import {lineIntersect} from '@turf/turf'
import { Feature } from 'ol';
import GeoJsonFormat from 'ol/format/GeoJSON'
// import Geometry from 'ol/geom/Geometry';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import { EntityType } from '../entities/Entity';

export const GetIntersectPoint = (entity,source)=>{
    if(entity.entityType === EntityType.text) return []
    if(entity.entityType === EntityType.line){
        source.forEachFeature(feature=> {
            let type = feature.getGeometry().getType();
            switch (type) {
                case 'LineString':
                    for (let i = 0; i < entity.getGeometry().getCoordinates().length-1; i++) {
                        let segment1 = [entity.getGeometry().getCoordinates()[i],entity.getGeometry().getCoordinates()[i+1]]
                        for (let j = 0; j < feature.getGeometry().getCoordinates().length-1; j++) {
                            let segment2 = [feature.getGeometry().getCoordinates()[i],feature.getGeometry().getCoordinates()[i+1]]
                            
                        }
                    }   
                    break;
                case 'Polygon':
                    break;
                case 'Circle':
                    break;
                
                default:
                    break;
            }
        })
    }

    let format = new GeoJsonFormat()
    let geojson1 = format.writeFeatureObject(newFeature);
    // let extent = Feature.getGeometry().getExtent();
    let intersects;
    let points = []
    source.forEachFeature(feature=> {
        if(feature!=newFeature){
            let geometry = feature.getGeometry();
            let type = geometry.getType();
            let newFeatureType = newFeature.getGeometry().getType()
            if(type != 'Circle' && newFeatureType != 'Circle'){
                if(type === 'Point' || type === 'MultiPoint' || newFeatureType === 'Point' || newFeatureType === 'MultiPoint'){
                    return points
                }
                let geojson2 = format.writeFeatureObject(feature);
                intersects = lineIntersect(geojson1, geojson2);
                let intersectFeatures = format.readFeatures(intersects)
                intersectFeatures.forEach(ifeature => {
                    ifeature.setProperties({
                        intersectFeature1:newFeature,
                        intersectFeature2:feature,
                    })
                    points.push(ifeature)
                });
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
                                            // console.log(coord)
                                            points.push(new Feature({
                                                geometry: new Point([coord.x,coord.y])
                                            }))
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
                else{
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
                                            points.push(new Feature({
                                                geometry: new Point([coord.x,coord.y])
                                            }))
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

const LineToLineIntersect = (line1,line2)=>{

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

function line_intersect(x1, y1, x2, y2, x3, y3, x4, y4)
{
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