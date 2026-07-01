import { Feature } from "ol";
import LineString from "ol/geom/LineString";
import Polygon from "ol/geom/Polygon";
import VectorSource from "ol/source/Vector";
export const getExtendPointsToExtent=(extent,line,siMap)=>{
    // console.log('ex')
    // console.log(line)
    // this.siLayer.siMap.modify.addFeature(bbox);
    let poly  = GetPolygonFromExtent(extent)
    // siMap.modify.addFeature(poly)
    // poly.setStyle(new Style({
    //     stroke:new Stroke({
    //         color:'rgba(255,12,115,1)'
    //     })
    // }))
    // console.log(poly)
    let maxRadius = 1*(Math.hypot((extent[2]-extent[0]),(extent[3]-extent[1])))
    let coordinates = line.getGeometry().getCoordinates();
    let firstIntersectPoint,lastIntersectPoint;
    let source = new VectorSource;
    source.addFeature(poly)
    
    // let startPoint = coordinates[0];
    // let endPoint = coordinates[coordinates.length-1];
    if(coordinates.length > 0){
        let li = coordinates.length-1 // last index
        // let firstSegment = [startPoint,coordinates[1]];
        // let lastSegment = [coordinates[coordinates.length-2],lastSegment];
        let firstAngle = Math.atan2((coordinates[1][1]-coordinates[0][1]),(coordinates[1][0]-coordinates[0][0]));
        let lastAngle = Math.atan2((coordinates[li][1]-coordinates[li-1][1]),(coordinates[li][0]-coordinates[li-1][0]));
        let firstExtendedLine = new Feature({
            geometry:new LineString(
                [
                        coordinates[0],
                        [coordinates[0][0]-maxRadius*Math.cos(firstAngle),coordinates[0][1]-maxRadius*Math.sin(firstAngle)],
                ]
            )
        })
        let lastExtendedLine = new Feature({
            geometry:new LineString(
                [
                    coordinates[li],
                    [coordinates[li][0]+maxRadius*Math.cos(lastAngle),coordinates[li][1]+maxRadius*Math.sin(lastAngle)],
                ]
            )
        })
        // firstExtendedLine.setStyle(
        //     new Style({
        //         stroke: new Stroke({
        //             color:'#61f50cff'
        //         })
        //     })
        // )
        // lastExtendedLine.setStyle(
        //     new Style({
        //         stroke: new Stroke({
        //             color:'#1000f5ff'
        //         })
        //     })
        // )
        // line.setStyle(
        //     new Style({
        //         stroke: new Stroke({
        //             color:'#f50000ff'
        //         })
        //     })
        // )
        // siMap.modify.addFeature(firstExtendedLine)
        // siMap.modify.addFeature(lastExtendedLine)
        // siMap.modify.addFeature(line)
        return {
            points:[],
            lines:[firstExtendedLine,lastExtendedLine],
            verticalLine:[]
        }
    }
    else{
        return {points:[],lines:[],verticalLine:[]}
    }
}

export const GetPolygonFromExtent = (extent)=>{
    // let extent = this.GetAllFeatureBbox();
    let [X,Y] = [(extent[2]+extent[0])/2,(extent[3]+extent[1])/2]
    let TransFormX = (extent[2]-extent[0])/2;
    let TransFormY = (extent[3]-extent[1])/2;
    let coordinate = [
        [
          [
            X-TransFormX,
            Y-TransFormY
          ],
          [
            X+TransFormX,
            Y-TransFormY
          ],
          [
            X+TransFormX,
            Y+TransFormY
          ],
          [
            X-TransFormX,
            Y+TransFormY
          ],
          [
            X-TransFormX,
            Y-TransFormY
          ]
        ]
      ]
    return new Feature({
        geometry:new Polygon(coordinate)
    })
}