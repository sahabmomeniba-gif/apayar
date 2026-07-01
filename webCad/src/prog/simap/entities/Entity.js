import { intersect } from "@turf/turf";
import { Collection, Feature } from "ol";
import ol_source_GeoImage from "ol-ext/source/GeoImage";
import { asArray } from "ol/color";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import ImageLayer from "ol/layer/Image";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Icon, RegularShape, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import Text from "ol/style/Text";
import * as uniqid from 'uniqid';
import { isEqualPoint } from "../helpers/equalPoint";
import { DefaultSelectStyle, getDefaultSelectFunction } from "../helpers/GetDefaultStyles";
import { GetIntersectPoint } from "../helpers/GetIntersect";
import getVertex from "../helpers/GetVertex";
import { createTextWithHeigth } from "../helpers/StaticText";
import { Mm2Px } from "../initparams";
import { mapActionsType } from "./SiActions";
export const ControlType = {
    featureProperties: 'feature properties',
    textProperties: 'text properties',
    snapProperties: 'snapProperties',
    centriodProperties: 'centriodProperties'
}

export default class Entity extends Feature {
    constructor(opt_options) {
        const options = opt_options ? opt_options : {};
        // console.log(options.layer)
        super();
        // console.log(opt_options)
        // console.log(options)
        this.options = options
        this.name = options.name ? options.name : undefined;
        this.id = options.id ? options.id : uniqid();
        this.siLayer = options.layer;
        this.entityType = undefined;
        this.selectable = true
        this.colorIndex = options.colorIndex ? options.colorIndex : 7;
        this.lineTypeIndex = lineTypeType.countinus
        this.lineWeightIndex = lineWeightType.default
        if (options.selectable != undefined) {
            this.selectable = options.selectable
        }
        this.styleStatus = {
            color: styleStatus.byLayer,
            width: styleStatus.byLayer,
            lineDash: styleStatus.byLayer,
            fillColor: styleStatus.byLayer,
            textColor: styleStatus.byLayer
        }
        this.siLayerStyleProperties = this.siLayer.styleProperties;
        this.styleProperties = {}
        if (options.color) {
            this.styleStatus.color = styleStatus.byEntity
            this.styleProperties.color = options.color
        } else {
            this.styleProperties.color = this.siLayerStyleProperties.color
        }
        if (options.lineWidth) {
            this.styleStatus.width = styleStatus.byEntity
            this.styleProperties.lineWidth = options.lineWidth
        } else {
            this.styleProperties.lineWidth = this.siLayerStyleProperties.lineWidth
        }
        if (options.lineDash) {
            this.styleStatus.lineDash = styleStatus.byEntity
            this.styleProperties.lineDash = options.lineDash
        } else {
            this.styleProperties.lineDash = this.siLayerStyleProperties.lineDash
        }
        if (options.textColor) {
            this.styleStatus.textColor = styleStatus.byEntity
            this.styleProperties.textColor = options.textColor
        } else {
            this.styleProperties.textColor = this.siLayerStyleProperties.textColor
        }
        if (options.fillColor) {
            this.styleStatus.fillColor = styleStatus.byEntity
            this.styleProperties.fillColor = options.fillColor
        } else {
            this.styleProperties.fillColor = this.siLayerStyleProperties.fillColor
        }
        this.calcVertex = false;
        this.labels = []
        this.modifyFeature = []
        this.process = this.siLayer.process
        this.styleProperties = {
                ...this.styleProperties,
                shapeStyle: options.shapeStyle ? options.shapeStyle : this.siLayerStyleProperties.shapeStyle,
                shapeRadius: options.shapeRadius ? options.shapeRadius : this.siLayerStyleProperties.shapeRadius,
                fontSize: options.fontSize ? options.fontSize : this.siLayerStyleProperties.fontSize,
                fontFamily: options.fontFamily ? options.fontFamily : this.siLayerStyleProperties.fontFamily,
                textWeight: options.textWeight ? options.textWeight : this.siLayerStyleProperties.textWeight,
                textBackground: options.textBackground ? options.textBackground : this.siLayerStyleProperties.textBackground,
            }
            // console.log(options)
            // console.log(this.styleProperties)
        this.onHover = false;
        this.selected = false;
        this.onModify = false;
        this.removeable = options.removeable != undefined ? options.removeable : true;
        this.vertexts = {
            endPoints: [],
            midPoints: [],
            centerPoints: [],
            intersectPoints: [],
            nodePoint: []
        }
        this.segmentedCoordinates = [];
        this.segmentsCollection = [];
        this.images = {}
        this.attributes = {
            layer: this.siLayer.name,
            colorIndex: this.colorIndex,
        }
    }
    getAttribute(key){
        return this.attributes[key]
    }
    getAttributes() {
        return this.attributes
    }
    setAttributes(attributes) {
        this.attributes = attributes
    }
    appendAttributes(key, value) {
        this.attributes[key] = value
    }
    hasAttribute(key){
        if( key in this.attributes) return true 
        else false
    }
    getGeometryType() {
        switch (this.entityType) {
            case EntityType.polygon:
                return "Polygon"
            case EntityType.multiPolygon:
                return "MultiPolygon"
            case EntityType.node:
            case EntityType.staticText:
            case EntityType.label:
            case EntityType.text:
                return "Point"
            case EntityType.line:
                return "LineString"
            case EntityType.multiLine:
                return "MultiLineString"
            default:
                break;
        }
    }
    exportToGeoJson() {
        let geoJson = {
            "type": "Feature",
            "properties": this.getAttributes(),
            "geometry": {
                "coordinates": this.getGeometry().getCoordinates(),
                "type": this.getGeometryType(),
                "id": this.id
            }
        }
        return geoJson
    }
    getStructures() {
        return {
            properties: this.getProperties(),
            styleProperties: this.styleProperties,
            siLayer: this.siLayer,
            styleStatus: this.styleStatus,
            entityType: this.entityType,
            geometry: this.getGeometry().clone(),
        }
    }
    modifyStart() {
        this.changeOpacity(0.5);
        if (this.onModify === false) {
            this.onModify = true;
        }
        return this.getGeometry().clone()
    }
    modifyEnd() {
        this.changeOpacity(1);
        if (this.onModify === true) {
            this.onModify = false;
            this.siLayer.siMap.siSnap.refresh(this)
        }
        if (this.labels.length > 0) {
            this.removeAllLabel()
        }
        if (this.setLabel) this.setLabel()
        return this.getGeometry().clone()
    }
    getVertex() {
        return this.vertexts
    }
    createTextURL(text) {
        return createTextWithHeigth(this.siLayer.siMap.appStyle.cadTarget, text, 'svg')

    }

    addLabel(text, center, height, angle, name, width) {
            console.log(120)
            const imageLayer = new ImageLayer({
                minZoom: 18
            })
            imageLayer.on("prerender", e => {

            });
            imageLayer.on("postrender", e => {

            });
            const textInfo = this.createTextURL(text)
                // console.log(textInfo)
            let imageScale;
            if (width) {
                imageScale = [width / textInfo.width, height / textInfo.height]
            } else {
                imageScale = [height / textInfo.height, height / textInfo.height]
            }

            let staticSource = new ol_source_GeoImage({
                url: textInfo.url,
                projection: this.siLayer.siMap.projection,
                imageCenter: center,
                imageRotate: -angle,
                imageScale: imageScale,
            });

            // console.log(staticSource)
            imageLayer.setSource(staticSource)
            const imageFeature = new Feature({
                geometry: new Point(center)
            })
            const props = {
                name: name,
                imageLayer: imageLayer,
                source: staticSource,
                center: center,
                height: height,
                angle: angle,
            }
            imageFeature.setProperties(props)
            this.siLayer.siMap.labels.push(props)
            this.siLayer.siMap.labelsSource.addFeature(imageFeature)
            this.siLayer.siMap.map.addLayer(imageLayer)
        }
        // removeLabel(index) {
        //     this.siLayer.siMap.map.removeLayer(this.labels[index].imageLayer)
        //     this.siLayer.siMap.labels.splice(index, 1)
        // }
    removeLabelByName(name) {
        this.siLayer.siMap.labels.forEach((label, index) => {
            if (label.name === name) this.removeLabel(index)
        })
    }
    removeAllLabel() {
        this.siLayer.siMap.labels.forEach(label => {
            this.siLayer.siMap.map.removeLayer(label.imageLayer)
        })
        this.siLayer.siMap.labels = []
        this.siLayer.siMap.labelsSource = new VectorSource
    }
    getExtendPoints() {
        if (this.entityType != EntityType.line) return []
        let extent = this.siLayer.siMap.GetAllFeatureBbox();
        let bbox = this.siLayer.siMap.GetAllFeatureBboxPolygon();
        bbox.setStyle(
                new Style({
                    stroke: new Stroke({
                        color: '#61f50cff'
                    })
                })
            )
            // this.siLayer.siMap.modify.addFeature(bbox);
        let maxRadius = 1 * (Math.hypot((extent[2] - extent[0]), (extent[3] - extent[1])))
        let coordinates = this.getGeometry().getCoordinates();
        let firstIntersectPoint, lastIntersectPoint;
        let source = new VectorSource;
        this.siLayer.siMap.getAllFeature().forEach(feature => {
            source.addFeature(feature)
        })
        source.removeFeature(this)

        // let startPoint = coordinates[0];
        // let endPoint = coordinates[coordinates.length-1];
        if (coordinates.length > 0) {
            let li = coordinates.length - 1 // last index
                // let firstSegment = [startPoint,coordinates[1]];
                // let lastSegment = [coordinates[coordinates.length-2],lastSegment];
            let firstAngle = Math.atan2((coordinates[1][1] - coordinates[0][1]), (coordinates[1][0] - coordinates[0][0]));
            let lastAngle = Math.atan2((coordinates[li][1] - coordinates[li - 1][1]), (coordinates[li][0] - coordinates[li - 1][0]));
            let firstExtendedLine = new Feature({
                geometry: new LineString(
                    [
                        coordinates[0],
                        [coordinates[0][0] - maxRadius * Math.cos(firstAngle), [coordinates[0][1] - maxRadius * Math.sin(firstAngle)]],
                    ]
                )
            })
            let lastExtendedLine = new Feature({
                geometry: new LineString(
                    [
                        coordinates[li],
                        [coordinates[li][0] + maxRadius * Math.cos(lastAngle), [coordinates[li][1] + maxRadius * Math.sin(lastAngle)]],
                    ]
                )
            })
            firstExtendedLine.setStyle(
                new Style({
                    stroke: new Stroke({
                        color: '#61f50cff'
                    })
                })
            )
            lastExtendedLine.setStyle(
                    new Style({
                        stroke: new Stroke({
                            color: '#1000f5ff'
                        })
                    })
                )
                // this.siLayer.siMap.modify.addFeature(firstExtendedLine)
                // this.siLayer.siMap.modify.addFeature(lastExtendedLine)
            var minDist = Infinity;
            let firstIntersectPoints = GetIntersectPoint(firstExtendedLine, source);

            if (firstIntersectPoints) {
                if (firstIntersectPoints.length > 0) {
                    firstIntersectPoints.forEach(point => {
                        let coord = point.getGeometry().getCoordinates();
                        let len = Math.hypot((coord[1] - coordinates[0][1]), (coord[0] - coordinates[0][0]))
                        if (len < minDist) {
                            firstIntersectPoint = point;
                            minDist = len;
                        }

                    });
                }
            }
            var minDist = Infinity;
            let lastIntersectPoints = GetIntersectPoint(lastExtendedLine, source);
            if (lastIntersectPoints) {
                if (lastIntersectPoints.length > 0) {
                    lastIntersectPoints.forEach(point => {
                        let coord = point.getGeometry().getCoordinates();
                        let len = Math.hypot((coord[1] - coordinates[0][1]), (coord[0] - coordinates[0][0]))
                        if (len < minDist) {
                            lastIntersectPoint = point;
                            minDist = len;
                        }
                    });
                }
            }
            return [firstIntersectPoint, lastIntersectPoint]
        } else {
            return []
        }
    }
    setVertexs() {
        // console.log('vertex')
        this.vertexts = {
                endPoints: [],
                midPoints: [],
                centerPoints: [],
                intersectPoints: [],
                nodePoint: []
            }
            // console.log('sLOW')
        let vertex = getVertex(this);
        // console.log(vertex,this.entityType)
        vertex.vertexs.forEach(elm => {
            var feature = new Feature({
                geometry: new Point(elm)
            })
            this.vertexts.endPoints.push(feature)
        });
        vertex.linesCenter.forEach(elm => {
            switch (this.entityType) {
                case EntityType.polygon:
                case EntityType.line:
                    var feature = new Feature({
                        geometry: new Point(elm)
                    })
                    this.vertexts.midPoints.push(feature)
                    break;
                default:
                    break
            }
        });
        if (this.entityType === EntityType.circle) {
            var feature = new Feature({
                geometry: new Point(vertex.center)
            })
            this.vertexts.centerPoints.push(feature)
        }
        if (this.entityType === EntityType.node) {
            var feature = new Feature({
                geometry: new Point(vertex.center)
            })
            this.vertexts.nodePoint.push(feature)
        }
        let allFeatures = this.siLayer.siMap.getAllFeatureInExtent(this.getGeometry().getExtent());
        let source = new VectorSource;
        allFeatures.forEach(feature => {
            // if (feature.entityType != EntityType.label) console.log(feature)
            if (!source.hasFeature(feature)) source.addFeature(feature)
        })
        let intersectPoints = GetIntersectPoint(this, source);

        // console.log(intersectPoints,'21412')
        if (intersectPoints) {
            if (intersectPoints.length > 0) {
                intersectPoints.forEach(point => {
                    var intersectEntites = point.get('entites')
                    intersectEntites.forEach(entity => {
                            var hasPoint = false;
                            entity.vertexts.intersectPoints.forEach(ipoint => {
                                // console.log(isEqualPoint(ipoint.getGeometry().getCoordinates(),point.getGeometry().getCoordinates(),1000))
                                // console.log(point,'point')
                                // console.log(ipoint,'ipoint')
                                if (isEqualPoint(ipoint.getGeometry().getCoordinates(), point.getGeometry().getCoordinates(), 1000)) hasPoint = true
                            })
                            if (!hasPoint) entity.vertexts.intersectPoints.push(point)
                        })
                        // this.vertexts.intersectPoints.push(point)

                    // this.collection.push(point)
                });
            }
        }
    }
    getSegments() {
        return this.segmentsCollection;
    }
    getSegmentsCoordinates() {
        return this.segmentedCoordinates
    }
    createSegments() {
        // if(this.entityType !=)
        if (this.entityType != EntityType.line) return []
        this.segmentsCollection = []
        this.coordinateSeparator()
        if (this.getGeometry().getCoordinates().length > 2 && this.entityType === EntityType.line) {
            // console.log(this.segmentsCollection)
        }
        if (this.segmentedCoordinates.length == 0) return
        switch (this.entityType) {
            case EntityType.line:
                for (let index = 0; index < this.segmentedCoordinates.length - 1; index++) {
                    let feature = new Feature({
                        geometry: new LineString([this.segmentedCoordinates[index], this.segmentedCoordinates[index + 1]])
                    });
                    feature.setProperties({
                        entitySource: this,
                        index: index
                    })
                    this.segmentsCollection.push(feature);
                    let style = this.getEntityStyle().clone()
                    var color = asArray(style.getStroke().getColor()).slice()
                    color[3] = 0.1
                    style.getStroke().setColor(color)
                    feature.setStyle(style)
                        // console.log(this.segmentsCollection.length)

                    // this.segmentsCollection.forEach(feature=>{
                    //     console.log(feature.getGeometry().getCoordinates(),index)
                    // })
                    // if(2 ==2){
                    //     this.siLayer.siMap.modify.addFeature(feature);
                    //     if(index%2 == 0){
                    //         var style = new Style({
                    //             stroke:new Stroke({
                    //                 color:`rgba(122,24,100)`,
                    //                 width:5
                    //             })
                    //         })           ;
                    //         feature.setStyle(style);
                    //     }
                    //     else{
                    //         var style = new Style({
                    //             stroke:new Stroke({
                    //                 color:`rgba(122,250,35)`,
                    //                 width:5
                    //             })
                    //         })           ;
                    //         feature.setStyle(style);
                    //     }
                    // }
                }
                break;

            default:
                break;
        }

    }
    coordinateSeparator() {
        this.setVertexs()
        let type = this.entityType;
        let intersects = this.vertexts.intersectPoints;
        // console.log(intersects.length,'212')
        let segmentedCoordinates = []
        switch (type) {
            case EntityType.line:
                let coordinates = this.getGeometry().getCoordinates();
                // console.log(coordinates,'wqe3')
                for (let index = 0; index < coordinates.length; index++) {
                    if (index == coordinates.length - 1) {
                        segmentedCoordinates.push(coordinates[index]);
                        break;
                    }
                    segmentedCoordinates.push(coordinates[index])
                    var intersectInLine = []
                    let sl = [coordinates[index], coordinates[index + 1]] //segment Line
                    intersects.forEach(point => {
                        let p = point.getGeometry().getCoordinates();
                        // console.log(p)
                        // console.log(isOnLine(p,sl[0],Math.atan2((sl[1][1]-sl[0][1]),(sl[1][0]-sl[0][0]))))
                        if (isOnLine(p, sl[0], Math.atan2((sl[1][1] - sl[0][1]), (sl[1][0] - sl[0][0])))) {
                            intersectInLine.push(p)
                        }

                    });
                    switch (intersectInLine.length) {
                        case 0:
                            break;
                        case 1:
                            segmentedCoordinates.push(intersectInLine[0]);
                            break;
                        default:
                            // let segmentLen = Math.hypot((sl[1][1]-sl[0][1]),(sl[1][0]-sl[0][0]));


                            while (intersectInLine.length > 1) {
                                // console.log(intersectInLine,'array')
                                let sindex = 0;
                                let firstLen = Math.hypot((intersectInLine[0][1] - sl[0][1]), (intersectInLine[0][0] - sl[0][0]));
                                for (let i = 1; i < intersectInLine.length; i++) {
                                    // console.log(firstLen,'avalish')
                                    let ip = intersectInLine[i];
                                    // console.log(ip,sl)
                                    let len = Math.hypot((ip[1] - sl[0][1]), (ip[0] - sl[0][0]));
                                    // console.log(len,firstLen,'len , flen')
                                    if (len < firstLen) {
                                        sindex = i;
                                        firstLen = Math.hypot((ip[1] - sl[0][1]), (ip[0] - sl[0][0]));
                                        // console.log(firstLen,'flen')
                                    }
                                }
                                segmentedCoordinates.push(intersectInLine[sindex]);
                                intersectInLine.splice(sindex, 1);
                                // console.log(intersectInLine.length,'ra naro roo maghz man')
                            }
                            if (intersectInLine.length == 1) {
                                // console.log(intersectInLine,'array2')
                                segmentedCoordinates.push(intersectInLine[0]);
                            }
                            // console.log(intersectInLine,'array3')
                            break;
                    }
                }
                break;

            default:
                break;
        }
        this.segmentedCoordinates = segmentedCoordinates
        return segmentedCoordinates
    }
    remove() {
        // console.log(this)
        this.siLayer.source.removeFeature(this)
    }
    changeLayer(layerName) {
        // console.log(layerName)
        if (!layerName) return
        let newLayer = this.siLayer.siMap.layers.find(l => l.name === layerName)
        if (!newLayer) return
        this.siLayer.source.removeFeature(this);
        newLayer.source.addFeature(this)
        this.siLayer = newLayer
        if (this.styleStatus.color === styleStatus.byLayer) this.changeColor(this.siLayer.styleProperties.color)
            // if(this.styleStatus.lineDash === styleStatus.byLayer) this.changeLineType(this.siLayer.styleStatus.lineDash)
    }
    changeOpacity(value) {
        if (this.entityType === EntityType.node || this.entityType === EntityType.label) return
            // var stroke = this.getStyle().getStroke()
            // console.log(asArray(this.getStyle().getStroke().getColor()))
        let newStyle
        if (this.getStyle().length > 0) newStyle = this.getStyle()[0].clone()
        else newStyle = this.getStyle().clone()
        var color = asArray(newStyle.getStroke().getColor()).slice()
        color[3] = value
        this.changeColor(color)
            // this.getStyle().getStroke()
    }
    createClone() {
        let clone = this.clone()
        this.siLayer.siMap.modify.addFeature(clone)
        clone.setProperties({
            entitySource: this
        })
        return clone
    }
    removeClone() {
        this.siLayer.siMap.modify.removeFeature(this.clone())
    }
    getModifyStyle(type, rotation, Angle) {
        let angle = Angle ? Angle : 0
        switch (type) {
            case ModifyType.translatePoint:
                return (
                    new Style({
                        image: new RegularShape({
                            fill: new Fill({
                                color: 'rgba(245, 35, 20,1)',
                            }),
                            stroke: new Stroke({
                                color: 'rgba(245, 35, 20,1)',
                                width: 1.5
                            }),

                            points: 4,
                            radius: 4,
                            rotation: Math.PI / 4,
                            angle: angle

                        }),
                        zIndex: 11,
                        // stroke:new Stroke({
                        //     color:'rgba(245, 35, 20)',
                        //     width:3
                        // })
                    })
                )
            case ModifyType.endPoint:
                return (
                    new Style({
                        image: new RegularShape({
                            fill: new Fill({
                                color: 'rgb(255,0,0)',
                            }),
                            stroke: new Stroke({
                                color: 'rgb(255,255,255)'
                            }),
                            points: 4,
                            radius: 7,
                            rotation: Math.PI / 4,
                            angle: angle
                        }),
                        zIndex: 10
                    })
                )
            case ModifyType.midPoint:
                return (
                    new Style({
                        image: new RegularShape({
                            fill: new Fill({
                                color: '#4e03fcff',
                            }),
                            radius: 9 / Math.SQRT2,
                            radius2: 9,
                            points: 4,
                            angle: angle,
                            rotation: -rotation,
                            scale: [1.5, 0.5],
                        }),
                        zIndex: 10
                    })
                )
            case ModifyType.rotatePoint:
                if (this.siLayer.siMap.modifyIcon) {
                    return (
                        new Style({
                            image: new Icon({
                                color: '#BADA55',
                                crossOrigin: 'anonymous',
                                // For Internet Explorer 11
                                imgSize: [10, 10],
                                src: './rotate_icon.svg',
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                            }),
                            zIndex: 10,
                        })
                    )
                }
                return (
                    new Style({
                        image: new CircleStyle({
                            fill: new Fill({
                                color: 'rgba(6, 143, 77,2)',
                            }),
                            radius: 10 / Math.SQRT2,
                            rotation: 0,
                        }),
                        zIndex: 10
                    })
                )
            default:
                break;
        }
    }
    getEntityStyle() {
        switch (this.entityType) {
            case EntityType.line:
            case EntityType.multiLine:
                return (

                    new Style({
                        stroke: new Stroke({
                            color: this.styleProperties.color,
                            lineDash: this.styleProperties.lineDash,
                            width: this.styleProperties.lineWidth,
                        }),
                        // text: new Text({
                        //     font: 'bold 20px "Open Sans", "Arial Unicode MS", "sans-serif"',
                        //     placement: 'point',
                        //     fill: new Fill({
                        //         color: 'white',
                        //     }),
                        //     text: 'دیواریست'
                        // }),
                        zIndex: 1
                    })

                )
            case EntityType.arc:
                return (
                    new Style({
                        stroke: new Stroke({
                            color: this.styleProperties.color,
                            lineDash: this.styleProperties.lineDash,
                            width: this.styleProperties.lineWidth,
                        }),
                        zIndex: 1
                    })
                )
            case EntityType.cadastralPoint:
                // var stroke = new Stroke({ color: 'white', width: 2 });
                var fill = new Fill({ color: this.styleProperties.color });
                return (
                    new Style({
                        image: new RegularShape({
                            fill: fill,
                            // stroke: stroke,
                            points: 3,
                            radius: 7,
                            rotation: Math.PI / 4,
                            angle: 0,
                        }),
                    })
                )
            case EntityType.node:
                return (
                    new Style({
                        image: new CircleStyle({
                            radius: this.styleProperties.shapeRadius,
                            stroke: new Stroke({
                                color: this.styleProperties.color,
                            }),
                            fill: new Fill({
                                color: this.styleProperties.color,
                            })
                        })
                    })
                )
            case EntityType.polygon:
                return (
                    new Style({
                        stroke: new Stroke({
                            color: this.styleProperties.color,
                            width: this.styleProperties.lineWidth,
                        }),
                        fill: new Fill({
                            color: this.styleProperties.fillColor,
                        }),
                        zIndex: 1
                    })
                )
            case EntityType.circle:
                return (
                    new Style({
                        stroke: new Stroke({
                            color: this.styleProperties.color,
                            width: this.styleProperties.lineWidth,
                            lineDash: this.styleProperties.lineDash,
                        }),
                    })
                )
            default:
                return
        }
    }

    setCurrentStyle() {
        this.setStyle(this.getEntityStyle())
    }
    changeColor(color) {
        let newStyle
        if (this.getStyle().length > 0) newStyle = this.getStyle()[0].clone()
        else newStyle = this.getStyle().clone()
        if (this.entityType === EntityType.node) {
            newStyle.getImage().getFill().setColor(color)
        } else {
            newStyle.getStroke().setColor(color)
        }

        this.setStyle(newStyle)
        this.styleProperties.color = color
            // this.setStyle
    }
    setSelectStyle(hasModifyPoint) {
        // console.log(this)
        if (this.entityType === EntityType.node || this.entityType === EntityType.label || this.entityType === EntityType.text) return
            // console.log(this.getStyle())
        if (!Array.isArray(this.getStyle())) var newStyle = this.getStyle().clone()
        else var newStyle = this.getStyle()[0].clone()
        if (!hasModifyPoint) {
            let color = '#308efaff'
            if (this.entityType === EntityType.node || this.entityType === EntityType.cadastralPoint) {
                newStyle.getImage().getFill().setColor(color)
            } else {
                var fill = newStyle.getFill()
                if (!fill) {
                    newStyle.getStroke().setColor(color)
                    newStyle.getStroke().setWidth(2)
                } else {
                    fill.setColor(color)
                }
            }
            this.setStyle(newStyle)
        } else {
            if (this.entityType === EntityType.cadastralPoint) {
                var stroke = new Stroke({ color: 'white', width: 2 });
                var fill = new Fill({ color: 'blue' });
                var style = new Style({
                    image: new RegularShape({
                        fill: fill,
                        stroke: stroke,
                        points: 3,
                        radius: 7,
                        rotation: Math.PI / 4,
                        angle: 0,
                    }),
                })
                this.setStyle(style)
                return
            } else {
                this.setStyle(DefaultSelectStyle(newStyle, this.entityType))
            }
        }

    }
    changeLineType(input_type) {
        let newStyle
        let type;
        if (this.getStyle().length > 0) newStyle = this.getStyle()[0].clone()
        else newStyle = this.getStyle().clone()
        if (input_type === lineTypeType.byLayer) {
            type = this.siLayer.lineTypeIndex
        } else {
            type = input_type
        }
        switch (type) {
            case 'countinus':
                this.styleProperties.lineDash = [0, 0]
                newStyle.getStroke().setLineDash([0, 0])
                this.setStyle(newStyle)
                break;
            case 'dashed':
                this.styleProperties.lineDash = [5, 0, 5]
                newStyle.getStroke().setLineDash([5, 0, 5])
                this.setStyle(newStyle)
                break;
            default:
                break;
        }
        this.lineTypeIndex = input_type
    }
    changeLineWidth(input_index) {
        // console.log(width)
        let newStyle
        let index;
        let width;
        if (this.getStyle().length > 0) newStyle = this.getStyle()[0].clone()
        else newStyle = this.getStyle().clone()
        if (input_index === lineWeightType.byLayer) {
            index = this.siLayer.lineWeightIndex
        } else {
            index = input_index
        }
        // console.log(input_index,index)
        switch (index) {
            case lineWeightType.default:
                width = 3
                break;
            case lineWeightType.w0d5:
                width = 0.5 * Mm2Px
                break;
            case lineWeightType.w1d0:
                width = 1 * Mm2Px
                break;
            case lineWeightType.w1d5:
                width = 1.5 * Mm2Px
                break;
            case lineWeightType.w2d0:
                width = 2 * Mm2Px
                break;
            default:
                width = 1
                break;
        }
        this.styleProperties.lineWidth = width
        newStyle.getStroke().setWidth(width)
        this.setStyle(newStyle)
        this.lineWeightIndex = input_index
    }
    getLayerColor() {
        return this.layer.color
    }
    removeModifyPoint() {
        this.modifyFeature.forEach(feature => {
            this.siLayer.siMap.modify.removeFeature(feature)

        });
    }
    boxSelect(boxSelecting, shouldRunModifyPoint) {
        if (this.selectable == false) return false
        if (!this.selected) {
            this.selected = true;
            if (this.entityType != EntityType.text && this.entityType != EntityType.label) {
                this.setSelectStyle(shouldRunModifyPoint)
            }
            if (this.setModifyPoint && shouldRunModifyPoint) {
                this.setModifyPoint()
            }
            switch (this.entityType) {
                case EntityType.text:
                    this.siLayer.siMap.siSelect.textSet_.push(this)
                    break;
                default:
                    this.siLayer.siMap.siSelect.selectionSet_.push(this)
                    break;
            }
            return true
        }
    }
    select() {
        // console.log(this)
        // console.log(this)
        // this.coordinateSeparator()
        // console.log(this.vertexts.intersectPoints)
        // console.log(this.segmentedCoordinates)
        // console.log(this.vertexts.intersectPoints)
        // console.log(this.siLayer.siMap.siActions.getActions())
        // console.log(this.getVertex())
        // console.log(this.siLayer.name)
        // console.log(this.getStyle().getStroke().getColor())

        if (this.selectable == false) return false
        if (!this.selected) {
            this.selected = true;
            this.setModifyPoint()
            switch (this.entityType) {
                case EntityType.text:
                    this.siLayer.siMap.siSelect.textSet_.push(this)
                    break;
                default:
                    this.siLayer.siMap.siSelect.selectionSet_.push(this)
                    break;
            }
            if (this.handleSelect) this.handleSelect()
            return true
        }
    }

    deSelect(shouldRemoveFeature) {
        if (shouldRemoveFeature == undefined) shouldRemoveFeature = false
        this.removeModifyPoint()
        if (this.selected) {
            this.selected = false
            if (this.entityType != EntityType.label && this.entityType != EntityType.text) {
                this.setCurrentStyle()
            }
            switch (this.entityType) {
                case EntityType.text:
                    if (shouldRemoveFeature) this.siLayer.siMap.siSelect.textSet_.remove(this)
                    break;
                case EntityType.label:
                    // console.log('labelDeselect')
                    this.siLayer.siMap.dragCollection = new Collection
                    this.siLayer.siMap.activeControl(ControlType.centriodProperties)
                    this.siLayer.siMap.siSelect.currentLabel = null;
                    // this.siLayer.siMap.siSelect.
                    break;
                default:
                    if (shouldRemoveFeature) this.siLayer.siMap.siSelect.selectionSet_.remove(this)
                    break;
            } // this.siLayer.siMap.textsPropertiesControl.handleSelection()
        }
        // this.siLayer.siMap.clearModify()
    }
    getData() {
        return {
            N: this.name,
            T: this.entityType,
            S: this.styleStatus,
            C: this.colorIndex,
            TE: this.text ? this.text : '',
            G: {
                coordinates: this.getGeometry().getCoordinates()
            }
        }
    }
}

export const EntityType = {
    line: 'LINE',
    node: 'NODE',
    endPoint: 'endPoint',
    text: 'TEXT',
    polygon: 'POLYGON',
    circle: 'CIRCLE',
    polyline: 'LWPOLYLINE',
    label: 'LABEL',
    arc: 'ARC',
    cadastralPoint: 'CADASTRALPOINT',
    staticText: 'STATICTEXT',
    multiLine: 'MULTILINE',
    triangles: 'TRIANGLES',
    multiPolygon: 'MultiPolygon'
}

export const ModifyType = {
    endPoint: 'endPoint',
    midPoint: 'midPoint',
    translatePoint: 'translatePoint',
    rotatePoint: 'rotatePoint',
    scalePoint: 'scalePoint',
}
export const styleStatus = {
    byLayer: 'byLayer',
    byBlock: 'byBlock',
    byEntity: 'byEntity'
}
const isOnLine = (p1, p2, angle) => {
        // console.log(p1,p2,angle)]
        // console.log(angle)
        // console.log(angle*180/Math.PI,'angle')
        let m = Math.tan(angle);
        let dy = p1[1] - p2[1];
        let dx = p1[0] - p2[0];
        if (angle != Math.PI / 2 && angle != -Math.PI / 2) {
            // console.log(dy,dx,m)
            // console.log(dy-m*dx)
            // console.log(dy-m*dx)
            if ((dy - m * dx) < 0.0001 && (dy - m * dx) > -0.0001) return true
        } else {
            if (dx < 0.0001 && dx > -0.0001) return true
        }
        return false
    }
    // best name in web cad ;D
export const lineTypeType = {
    countinus: 'countinus',
    dashed: 'dashed',
    byLayer: 'by layer'
}
export const lineWeightType = {
    default: 'default',
    byLayer: 'by layer',
    w0d5: 'w0d5',
    w1d0: 'w1',
    w1d5: 'w1d5',
    w2d0: 'w2d0'
}