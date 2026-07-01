import { Feature } from "ol"
import { getCenter, getHeight, getWidth } from "ol/extent"
import Point from "ol/geom/Point"
import { Vector } from "ol/layer"
import VectorSource from "ol/source/Vector"
import { Fill, RegularShape, Stroke, Style } from "ol/style"
import CircleStyle from "ol/style/Circle"
import * as uniqid from 'uniqid'
export default class SiModify {
    
    constructor(siMap) {
        let exist = siMap.layers.find(l =>  l.name === 'modify layer')
        if(exist){
            return exist
        }
        this.siMap = siMap
        this.source= new VectorSource
        this.name = 'modify layer'
        this.id = uniqid()
        this.StyleFunction = (feature,currentEvent)=>{
            let color;
            switch (currentEvent) {
                case 'onHover':
                    color = 'rgba(255, 71, 71)'
                    break;
                case 'onSelect':
                    color = 'rgba(255, 71, 71)'
                    break;
                default:
                    color = undefined
                    break
            }
            let style;
            switch (feature.getProperties().modifyType) {
                case 'translate':
                    style = new Style({
                        image: new RegularShape({
                            fill: new Fill({
                                color: color || 'rgba(0, 208, 255,1)',
                            }),
                            stroke: new Stroke({
                                color: color || 'rgba(0, 208, 255,1)',
                                width:1
                            }),
                            points: 4,
                            radius: 7,
                            angle: Math.PI / 4,
                            rotation:feature.get('angle')
                        })
                    })
                    break;
                case 'endpoint':
                    style = new Style({
                        image: new RegularShape({
                            fill: new Fill({
                                color: color || 'rgba(0, 208, 255,1)',
                            }),
                            stroke: new Stroke({
                                color: color || 'rgba(0, 208, 255,1)',
                                width:2
                            }),
                            points: 3,
                            radius: 10,
                            rotation: Math.PI / 4,
                            angle: feature.get('angle')
                          }),
                    })
                    break;
                case 'scale':
                    style = new Style({
                        image: new RegularShape({
                            fill: new Fill({
                                color: color || 'rgba(0, 208, 255,1)',
                            }),
                            stroke: new Stroke({
                                color: color || 'rgba(0, 208, 255,1)',
                                width:2
                            }),
                            points: 4,
                            radius: 7,
                            rotation: Math.PI / 4,
                            angle: feature.get('angle')
                            }),
                    })
                    break;
                case 'modify':
                    style = new Style({
                        image: new RegularShape({
                            fill: new Fill({
                                color: color || 'rgba(26, 237, 58,1)',
                            }),
                            stroke: new Stroke({
                                color: color || 'rgba(26, 237, 58,1)',
                                width:2
                            }),
                            points: 4,
                            radius: 7,
                            rotation: Math.PI / 4,
                            angle: feature.get('angle')
                            }),
                    })
                    break;
                case 'rotate':
                    style = new Style({
                        image: new CircleStyle({
                            radius: 5,
                            fill: new Fill({
                              color: 'rgba(0, 208, 255,1)',
                            })
                            }),
                    })
                    break;
                default:
                    break;
            }
            return style
        }
        this.Layer = new Vector({
            source: this.source,
            zIndex:10000
        })
        this.onModifyFeaturesSource = new VectorSource 
        this.onModifyLayer = new Vector({
            source:this.onModifyFeaturesSource
        })
        this.SnapLayer = new Vector
        this.SnapLayer.setStyle(null)
        this.siMap.map.addLayer(this.SnapLayer)
        this.snapSource = new VectorSource
        this.currentEvent = undefined
        this.Layer.setStyle(this.StyleFunction,this.currentEvent)
        this.type = 'modify'
        this.Texts = []
        this.siMap.layers.push(this)    
        this.siMap.map.addLayer(this.Layer)   
        // this.source.on('addfeature',e=>{
        //     this.siMap.siSnap.addFeature(e.feature)
        // })
        // this.Layer.getSource().on('removefeature', e=> {
        //     this.siMap.siSnap.removeFeature(e.feature)
        //     // this.siMap.siSnap.activeSnap(this.siMap.activeSnap)
        // });
        // const snap = new Snap({
        //     source: this.snapSource
        //   });
        //   this.siMap.map.addInteraction(snap);
    }
    getAllCurrentModifyPoints(){
        return this.source.getFeatures()
    }
    addRegularSnapVertex(){
        let siLayers = this.siMap.layers;
        siLayers.forEach(siLayer => {
            if(siLayer.type ==='vector'){
                let features = siLayer.source.getFeatures();
                features.forEach(feature => {
                    let result = calculateCenter(feature);
                    let croodinates = result.coordinates;
                    croodinates.push(result.center)
                    let geom = new feature.getGeometry().MultiPoint(croodinates)
                    let vertexFeature = new Feature({
                        geometry:geom
                    })
                    this.RegularSnapSource.addFeature(vertexFeature)
                });
            }
        })
        this.SnapLayer.setSource(this.RegularSnapSource)
        ;
    }
    addModifyVertexPoint(x,y,modifyType,angle,targetFeature){
        let pointFeature = new Feature({
            geometry: new Point([x,y]),
            layerName:this.name,
            modifyType:modifyType,
            targetFeature:targetFeature,
            angle:angle
        })
        this.source.addFeature(pointFeature)
        this.Layer.setZIndex(1)
        return pointFeature
    }
    addModifyForFeature(feature,siLayerType){
        let type;
        if(siLayerType === 'text'){
            type = siLayerType
        }
        else{
            type = feature.getGeometry().getType()
        }
        let center, coordinates , angle ,modifyPoints;
        let geometry = feature.getGeometry()
        let result = calculateCenter(feature)
        switch (type) {
            case 'Circle':
                center = result.center
                this.addModifyVertexPoint(center[0],center[1],'translate',angle,feature)
                break;
            case 'Polygon':
                center = result.center
                coordinates = result.coordinates
                angle =  Math.atan2(((coordinates[1][1]-coordinates[0][1])),(coordinates[1][0]-coordinates[0][0])) + Math.PI/4
                // console.log(angle)
                this.addModifyVertexPoint(center[0],center[1],'translate',angle,feature)
                coordinates.forEach(crood => {
                    this.addModifyVertexPoint(crood[0],crood[1],'modify',angle,feature)
                });
                break;
            case 'LineString':
                center = result.center
                coordinates = result.coordinates
                angle =  Math.atan2(((coordinates[1][1]-coordinates[0][1])),(coordinates[1][0]-coordinates[0][0])) + Math.PI/4
                // console.log(angle)
                this.addModifyVertexPoint(center[0],center[1],'translate',angle,feature)
                coordinates.forEach(crood => {
                    this.addModifyVertexPoint(crood[0],crood[1],'modify',angle,feature)
                });
                break;
            case 'text':
                let x = 0;
                let y = 0;
                let i = 0;
                let tp; //translate point
                let sp; //scale point
                let rp; // rotate point
                let extent = geometry.getExtent();
                // console.log(extent)
                coordinates = geometry.getCoordinates()[0].slice(1);
                coordinates.forEach(function (coordinate) {
                x += coordinate[0];
                y += coordinate[1];
                i++;
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
                angle =  Math.atan(Math.abs((sp[1]-tp[1]))/Math.abs((sp[0]-tp[0]))) - Math.PI/4
                this.addModifyVertexPoint(tp[0],tp[1],'translate',angle+Math.PI/4,feature)
                this.addModifyVertexPoint(sp[0],sp[1],'scale',angle,feature)
                this.addModifyVertexPoint(rp[0],rp[1],'rotate',angle,feature)

                center = [x / i, y / i];

                break;
            default:
                return
                center = getCenter(geometry.getExtent());
            break
        }
        
    }
    setOnModifyStyle(feature,modifyType){
        let layer = this.siMap.layers.find(l => l.name == feature.get('targetFeature').get('layerName'));
        let style = layer.StyleFunction(feature.get('targetFeature'),'onHover');
        this.onModifyFeaturesSource.addFeature(feature);
        this.onModifyLayer.setStyle(style)
        // switch (modifyType) {
        //     case 'translate':
        //         let translateLines = new Feature({
        //             geometry: new LineString(),
        //             layerName:this.name,
        //             modfiyType:modifyType,
        //             targetFeature:targetFeature,
        //         })
        //         break;
        
        //     default:
        //         break;
        // }
    }
    cleanModify(){
        this.source.clear()
    }
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
