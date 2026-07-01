import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {TextareaAutosize, Tooltip, withStyles} from "@material-ui/core";
import './A4Port.css';
import Map from 'ol/Map'
import  _ from 'lodash'

import View from 'ol/View'
import { fromLonLat, Projection } from 'ol/proj'

import TileLayer from 'ol/layer/Tile'
// import {UtilsHelper, t, globals} from "../../components/helpers/utils.helper";
// import {MapHelper} from "../../components/helpers/map.helper";
import XYZ from 'ol/source/XYZ'
import SiMap from '../prog/simap/entities/SiMap'
import SiLayer from '../prog/simap/entities/SiLayer'
import SiPolygon from '../prog/simap/entities/SiPolygon'
import {SiText} from '../prog/simap/entities/SiText'
import {TextStyle} from '../prog/simap/entities/SiText'
import {MousePosition} from "ol/control";
import {defaults as defaultControls} from 'ol/control';
import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString'

import {createStringXY} from "ol/coordinate";
// import {connect} from "react-redux";
const styles= (theme)=>({
    root:{
        width:'100%',
        height:'97vh',
        // padding:'1rem',
        backgroundColor:'black',
        // border:'1px solid white',
    },
    calculateTextSize:{
        position: 'absolute',
        visibility: 'hidden',
        height: 'auto',
        width: 'auto',
        whiteSpace: 'nowrap',
        fontFamily:'B-Nazanin',
        fontSize:'20px'
    }
})
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
        center = geometry.getCenter(geometry.getExtent());
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
                geometry.getWidth(geometry.getExtent()),
                geometry.getHeight(geometry.getExtent())
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
const insertLabelsToLines = (polygon,textLayer,textHeight)=>{

    let MinLabelLength = calculateMinLineLabelLenght(polygon,0.5)
    let PolyCenter  = calculateCenter(polygon).center
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
                let result = calculateLineLablePosition(feature,MinLabelLength*0.05)
                let offset =  result.offset
                let rotaitons = result.rotate
                let [X,Y] = [offset[0],offset[1]]
                // let rotaitons = 0
                // let geom =  new Polygon([
                //     [
                //         [
                //             X-TransFormX,
                //             Y-TransFormY
                //         ],
                //         [
                //             X+TransFormX,
                //             Y-TransFormY
                //         ],
                //         [
                //             X+TransFormX,
                //             Y+TransFormY
                //         ],
                //         [
                //             X-TransFormX,
                //             Y+TransFormY
                //         ],
                //         [
                //             X-TransFormX,
                //             Y-TransFormY
                //         ]
                //     ]
                // ])
                // geom.rotate(0,InteriorPoint)
                // let BoundrayFeature = new Feature({
                //     geometry: geom
                // });

                let tstyle = new TextStyle('20px B-Nazanin')
                // console.log({InteriorPoint,rotaitons,labelText,geom})
                let text = new SiText(textLayer.map,'label1',X,Y,0,labelText,{TextStyle:tstyle,layer:textLayer})
                text.addTextByTextHeight(textHeight,'mid mid')
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

class A4Port extends Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.commandRef = React.createRef();
        this.commandTextAreaRef = React.createRef();
        this.mpRef = React.createRef();
        this.state = {
        };

        // this.mapId = UtilsHelper.uniqId();

    }

    componentDidMount() {
        let self = this;
        // console.log(this.props.parent)
        this.initMap();
        // setTimeout(() => {
        //     window.onresize();
        // }, 100);

    }

     initMap() {
        const MapProjection = new Projection({
            units: 'm',
            code: "EPSG:32639"
        })
        // await UtilsHelper.delay(500)
        this.setMousePositionControl()
        // this.map = new Map({
        //     target: this.mapRef.current,
        //     layers: [],
        //     view: new View({
        //         zoom: 18,
        //         center: [750,930],
        //         projection: MapProjection,
        //     }),
        //     controls: defaultControls().extend([this.mousePositionControl]),
        // })
        this.commandLine = this.commandRef.current
        this.siMap = new SiMap(this.mapRef.current, this.commandLine, {
            textArea: this.commandTextAreaRef.current,
            activeColor: 'rgb(231,46,46)',
            controls: {
                featuresPropertiesControl: false,
                overViewMapControl: {
                    active: true,

                }

            }
        })
        // this.props.setSiMap(this.siMap)

        // this.floor = new Floor(this.siMap)

        // this.FeaturesModify = new SiModify(this.siMap)

        // this.floor.build()
        // this.floor.test()
        // console.log(this.siMap)
        // SiSelectInit(this.siMap)

        this.setState({mapContainer:this.map})
        // document.addEventListener('click',e=>{
        //     console.log(e)
        // })
        // document.addEventListener('keyup',e=>{
        //     console.log(e)
        // })
        // this.map.on('',e=>{
        //     console.log(e)
        // })
        this.props.loaded && this.props.loaded(this);
        // this.siMap.activeDefaultInteractions();
        this.a4port()
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
            textColor:'rgb(222,191,79)'
        })
        // let p  = this.props.parent.doc.geometry.coordinates
        // let p1 = MapHelper.lonlat2xy_arr(p[0])
        let p1 = [[0,0],[100,0],[100,10],[17,20],[0,10],[0,0]]
        let poly = new SiPolygon([p1],{
            layer:Layer,
            color:'rgb(255,255,255)',
            fillColor:'rgba(0,0,0,0)',
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
        // console.log({extent,textHeight},this.scale,t,sc)

        insertLabel(poly,TextLayer,textHeight)
        insertLabelsToLines(poly,TextLayer,textHeight)
        this.siMap.map.once('rendercomplete',()=>{
            if(poly){
                // console.log(poly.getGeometry().getExtent())
                // this.siMap.zoomToExtent(poly.getGeometry().getExtent())
                this.siMap.setZoomTarget(poly)
            }
        })
    }
    setMousePositionControl() {
        this.mousePositionControl = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: 'EPSG:4326',
            // comment the following two lines to have the mouse position
            // be placed within the map.
            className: 'custom-mouse-position',
            target: this.mpRef.current
        });

    }

    componentWillUnmount() {
        // if (this.map)
        //     this.map.off('click', this.onMapClick);
        // this.saveZoom();
        // this.map = null;
    }



    render() {
        const {classes} = this.props;
        const {loaded} = this.state;
       return <>
               <div dir="ltr" ref={this.mapRef} className={classes.root} style={{height:'80%',width:'500px',background:'red',cursor:'url(cursor.ico) 30 30,auto'}}>
               </div>
           <div dir="ltr" ref={this.mpRef} style={{height: '12px'}}>
               <div ref={this.FindLabelSize} className={classes.calculateTextSize}></div>
           </div>
           {/*<button className={classes.btn} onClick={e=>this.state.siMap.siCommand.execCommand('circle3p')}>circle3p</button>*/}
           <TextareaAutosize dir="ltr" style={{width:'100%' , margin:0}}
                             disabled={true}
                             minRows={6}
                             ref={this.commandTextAreaRef}
           />
           command:<input dir="ltr" ref={this.commandRef} style={{width:'100%' , minHeight:'1.5rem',margin:0}}  />

</>
    }

}
// const mapDispatchToProps = dispatch => {
//     return {
//         siMap:(siMap)=>dispatch({type:'siMap',payload:siMap})
//         // UploadCadFile: (formData) => dispatch({type:CADFILE_UPLOADED_WATCH,payload:formData}),
//         //   LableAceepted: (formData) => dispatch({type:LABLE_ACCEPTED,payload:formData})
//     }}

// const reduxState = state => {
//     return {
//         globalState:state ,
//     }}
// const reduxDispatcher = dispatch => {
//     return {
//         setSiMap:async (siMap)=> {
//             return dispatch({type: 'siMap', payload: {siMap:siMap}})
//         }
//     }
// }

export default withStyles(styles)(A4Port);

// export default connect(reduxState, reduxDispatcher)(withStyles(styles)(A4Port));
