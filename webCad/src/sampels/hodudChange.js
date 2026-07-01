// import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
// import {Button, Input, Tooltip, withStyles} from "@material-ui/core";
// import './MapOl.css';
// import Map from 'ol/Map'
// import View from 'ol/View'
// import {fromLonLat, get, Projection} from 'ol/proj'
// import TileLayer from 'ol/layer/Tile'
// import XYZ from 'ol/source/XYZ'
// import MousePosition from 'ol/control/MousePosition';
// import {createStringXY} from 'ol/coordinate';
// import {defaults as defaultControls} from 'ol/control';
// import {OSM, TileJSON} from 'ol/source';
// import VectorSource from 'ol/source/Vector'
// import {SiInteractions, SiMap, SiModify, SiControls} from "../prog/simap/SiMap";
// import {Floor} from "./Floor";
// import {Modify, Select, Translate, defaults as defaultInteractions, Snap, Draw} from 'ol/interaction';
// import {
//     platformModifierKeyOnly,
//     pointerMove,
//     primaryAction,
//     singleClick,
//     click,
//     shiftKeyOnly,
//     always
// } from 'ol/events/condition';
// import _ from 'loadsh'
// import proj4 from 'proj4';

// proj4.defs("EPSG:32639", "+proj=utm +zone=39 +datum=WGS84 +units=m +no_defs");
// proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
// import {
//     centroid, area, polygon as turfPolygon, pointToLineDistance, lineString as turfLineString, point as turfPoint,
//     feature, transformRotate, bbox, bboxPolygon, buffer as t_buffer, pointOnFeature as t_point_on_feature, geometry
// } from '@turf/turf'
// import {sample} from 'turf';
// import VectorLayer from 'ol/layer/Vector';
// import {Feature} from 'ol';
// import Polygon from 'ol/geom/Polygon';
// // import { Fill, RegularShape, Stroke, Style,Text } from 'ol/style';
// // import { asArray } from 'ol/color';
// // import GeoImage from 'ol-ext/source/GeoImage'
// // import Transform from 'ol-ext/interaction/Transform'
// // import ImageLayer from 'ol/layer/Image';
// // import { getLength } from 'ol/sphere';
// // import SiTranslate from './interactions/modify/SiTranslate';
// import SiSelect, {SiSelectInit} from '../prog/simap/interactions/selects/SiSelect';
// import SiRotate from '../prog/simap/interactions/modify/SiRotate';
// import SiScale from '../prog/simap/interactions/modify/SiScale';
// import RegularDraw from '../prog/simap/interactions/draw/regular/RegularDraw';
// import addSingelTextByFrame from '../prog/simap/interactions/texts/addSingelTextByFrame';
// import addLabel from '../prog/simap/interactions/texts/addLabel';
// import SiCopyPaste from '../prog/simap/interactions/edit/SiCopyPaste';
// import SiDrawCricleW3P, {HandleDrawCricleWith3P} from '../prog/simap/interactions/draw/cricle/SiCricleW3P';
// import SiDrawCricle, {HandleDrawCricle} from '../prog/simap/interactions/draw/cricle/SiDrawCricle';
// import FeaturesControl from '../prog/simap/controls/FeaturesControl';
// import {Grid} from '@material-ui/core'


// const styles = (theme) => ({
//     root: {
//         width: '100%',
//         height: '100vh',
//         // padding:'1rem',
//         backgroundColor: 'black',
//         // border:'1px solid white',
//     },
//     calculateTextSize: {
//         position: 'absolute',
//         visibility: 'hidden',
//         height: 'auto',
//         width: 'auto',
//         whiteSpace: 'nowrap',
//         fontFamily: 'B-Nazanin',
//         fontSize: '20px'
//     },
//     btn: {
//         width: 'auto',
//         height: '50px',
//         color: 'black',
//         marginRight: '0.5em',
//         backgroundColor: 'rgba(216, 235, 221)',
//     },
//     inputText: {
//         border: '1px solid black',
//         margin: '0 0.5em 0 1em',
//         fontFamily: 'B-Nazanin',
//         direction: 'rtl',
//         textAlign: 'center',
//         fontSize: '1em'
//     },
//     label: {
//         margin: '0 0.5em 0 1em',
//     }
// })


// class HodudChange extends Component {
//     constructor(props) {
//         super(props);
//         this.mapRef = React.createRef();
//         this.mpRef = React.createRef();
//         this.FindLabelSize = React.createRef()
//         this.state = {
//             Position: [undefined, undefined],
//             siMap: undefined,
//             geometry:{
//             "type": "Polygon",
//             "coordinates": [
//             [
//                 [
//                     47.4254300179178,
//                     32.9887523955804
//                 ],
//                 [
//                     47.4256090924141,
//                     32.9887276346525
//                 ],
//                 [
//                     47.4256221544117,
//                     32.9888452339899
//                 ],
//                 [
//                     47.4254496163553,
//                     32.9888547192048
//                 ],
//                 [
//                     47.4254300179178,
//                     32.9887523955804
//                 ]
//             ]
//         ]
//         }
//         };



//     }

//     handleInputChange(e) {
//         this.setState({inputText: e.target.value})
//     }

//     handleRadiusChange(e) {
//         this.setState({inputRadius: e.target.value})
//     }

//     handleSetRaidus(siMap, radius) {
//         let SiDrawInteraction = siMap.interactions.find(I => I.name == 'DrawCricle')
//         if (!SiDrawInteraction) {
//             return
//         }
//         if (!radius) {
//             return
//         }
//         console.log(SiDrawInteraction)
//         SiDrawInteraction.interaction.setRadius(parseFloat(radius))
//     }

//     componentDidMount() {
//         let self = this;
//         this.initMap();

//     }

//     initMap() {
//         const MapProjection = new Projection({
//             units: 'm',
//             code: "EPSG:32639"
//         })
//         const raster = new TileLayer({
//             source: new OSM(),
//         });

//         this.setMousePositionControl()
//         this.map = new Map({
//             target: this.mapRef.current,
//             layers: [],
//             view: new View({
//                 zoom: 15,
//                 center: [0, 0],
//                 projection: MapProjection,
//             }),
//             controls: defaultControls().extend([this.mousePositionControl]),
//         })
//         this.siMap = new SiMap(this.map)
//         this.setState({siMap: this.siMap})

//         // this.floor = new Floor(this.siMap)

//         // this.FeaturesModify = new SiModify(this.siMap)
//         //
//         // this.floor.build()
//         //
//         // SiSelectInit(this.siMap)
//         //
//         // this.setState({mapContainer: this.map})
//         // this.props.loaded && this.props.loaded(this);
//         // this.siMap.activeDefaultInteractions();
//     }


//     setMousePositionControl() {
//         this.mousePositionControl = new MousePosition({
//             coordinateFormat: createStringXY(4),
//             projection: 'EPSG:4326',
//             // comment the following two lines to have the mouse position
//             // be placed within the map.
//             className: 'custom-mouse-position',
//             target: this.mpRef.current
//         });

//     }

//     componentWillUnmount() {

//     }

//     componentDidUpdate() {

//     }

//     render() {
//         const {classes} = this.props;
//         const {loaded} = this.state;
//         return <>
//             <Grid container>
//                 <Grid item xs={9} sm={9} md={9} lg={9} xl={9}>
//                     <div dir="ltr" ref={this.mapRef} className={classes.root} style={{height: '500px'}}>
//                     </div>
//                 </Grid>
//                 <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
//                     <div style={{border: '1px solid black', marginLeft: '0.25em', height: '499px'}}></div>
//                 </Grid>
//             </Grid>

//             <div ref={this.mpRef} style={{height: '15px'}}>
//                 <div ref={this.FindLabelSize} className={classes.calculateTextSize}></div>
//             </div>
//             <div>
//                 <label className={classes.label}>Regular draw</label>
//                 <Button className={classes.btn} onClick={e => RegularDraw(this.state.siMap, 'LineString')}>Regular
//                     LineString</Button>
//                 <Button className={classes.btn} onClick={e => RegularDraw(this.state.siMap, 'Polygon')}>Regular
//                     Polygons</Button>
//                 <Button className={classes.btn} onClick={e => RegularDraw(this.state.siMap, 'Circle')}>Regular
//                     Circle</Button>
//                 <Button className={classes.btn} onClick={e => RegularDraw(this.state.siMap, 'Rectangle')}>Regular
//                     Rectangle</Button>
//             </div>
//             <br></br>
//             <div>
//                 <label className={classes.label}>Text</label>
//                 <Input className={classes.inputText} onChange={e => this.handleInputChange(e)}></Input>
//                 <Button className={classes.btn}
//                         onClick={e => addSingelTextByFrame(this.state.siMap, this.state.inputText)}>add singel
//                     text</Button>
//                 <Button className={classes.btn} onClick={e => addLabel(this.state.siMap, this.state.inputText)}>add
//                     label </Button>
//             </div>
//             <br></br>
//             <div>
//                 <label className={classes.label}>Custom Draw</label>
//                 <Button className={classes.btn} onClick={e => HandleDrawCricleWith3P(this.state.siMap)}>draw cricle with
//                     3 points</Button>
//                 <Button className={classes.btn} onClick={e => HandleDrawCricle(this.state.siMap)}>draw cricle with
//                     radius</Button>
//                 <label className={classes.label}>radius</label>
//                 <Input className={classes.inputText} onChange={e => this.handleRadiusChange(e)}></Input>

//                 <Button className={classes.btn}
//                         onClick={e => this.handleSetRaidus(this.state.siMap, this.state.inputRadius)}>set
//                     raidus</Button>

//             </div>
//         </>
//     }

// }


// export default withStyles(styles)(HodudChange);
