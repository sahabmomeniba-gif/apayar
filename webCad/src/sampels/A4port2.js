import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button, Input, TextareaAutosize, Tooltip, withStyles , Typography ,Divider, Link} from "@material-ui/core";
import './MapOl.css';
import Map from 'ol/Map'
import View from 'ol/View'
import {fromLonLat, get, Projection} from 'ol/proj'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import MousePosition from 'ol/control/MousePosition';
import {createStringXY} from 'ol/coordinate';
import {defaults as defaultControls} from 'ol/control';
import {OSM, TileJSON} from 'ol/source';
import VectorSource from 'ol/source/Vector'
// import {SiInteractions, SiMap, SiModify, SiControls} from "../prog/simap/SiMap";
import SiMap from '../prog/simap/entities/SiMap'
import {Floor} from "./Floor";
import { platformModifierKeyOnly, pointerMove, primaryAction, singleClick,click, shiftKeyOnly, always } from 'ol/events/condition';
import  _ from 'lodash'
import proj4 from 'proj4';
proj4.defs("EPSG:32639","+proj=utm +zone=39 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs");
import {Grid} from '@material-ui/core'
import { Icon, Style } from 'ol/style';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import SiLayer from '../prog/simap/entities/SiLayer';
import { Collection } from 'ol';
import './PrintviewStyle.css'
import a4Svg from './A4SizeSVG';
import { SiExport } from '../prog/simap/entities/SiExport';

   
const styles = (theme) => ({
    root: {
        width: '100%',
        height: '100vh',
        // padding:'1rem',
        backgroundColor: 'black',
        // border:'1px solid white',
    },
    calculateTextSize: {
        position: 'absolute',
        visibility: 'hidden',
        height: 'auto',
        width: 'auto',
        whiteSpace: 'nowrap',
        fontFamily: 'B-Nazanin',
        fontSize: '20px'
    },
    btn:{
        width:'auto',
        height:'50px',
        color:'black',
        marginRight:'0.5em',
        backgroundColor:'rgba(216, 235, 221)',
    },
    inputText:{
        border:'1px solid black',
        margin:'0 0.5em 0 1em',
        fontFamily:'B-Nazanin',
        direction:'rtl',
        textAlign:'center',
        fontSize:'1em'
    },
    label:{
        margin:'0 0.5em 0 1em',
    },
})


class MapOl extends Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.mapContainerRef = React.createRef()
        this.mapContainerRef2 = React.createRef()
        this.commandRef = React.createRef();
        this.commandTextAreaRef = React.createRef();
        this.newTextRef = React.createRef();
        this.mpRef = React.createRef();
        this.svgRef = React.createRef();
        this.FindLabelSize = React.createRef()
        this.state = {
            Position:[undefined,undefined],
            siMap:undefined,
            Textarea:null,
            color:"rgba(255,255,255,1)",
            sampelLayer : [],
        };


    }
    handleExportAsSVG(siMap){
           siMap.siCommand.execCommand('exportsvg')
    }
    handleDownloadAsPNG(siMap){
        siMap.siCommand.execCommand('downloadpng')
    }
    componentDidMount() {
        let self = this;
        this.initMap();
    }
    
    initMap() {
        this.commandLine = this.commandRef.current
        this.siMap = new SiMap(this.mapContainerRef.current,this.commandLine,{
            textArea:this.commandTextAreaRef.current,
            activeColor:'rgba(0,0,0,1)',
            featuresPropertiesControl:false,
            controls:{
                featuresPropertiesControl:false,
                overViewMapControl:{
                    active:true,
                    
                }
                
            }
        })
        // this.siMap2 = new SiMap(this.mapContainerRef2.current,this.commandLine,{
        //     textArea:this.commandTextAreaRef.current,
        //     activeColor:'rgba(0,0,0,1)',
        //     controls:{
        //         featuresPropertiesControl:false,
        //         overViewMapControl:{
        //             active:true,
                    
        //         }
                
        //     }
        // })
        this.setState({siMap:this.siMap})

        this.floor = new Floor(this.siMap)
        let svg = this.floor.a4port()
        this.siMap.testSvg = this.svgRef
        // this.svgRef.current.innerHTML = svg

        
        // this.floor2 = new Floor(this.siMap2)
        // this.floor2.a4port2()
        const sampelLayer = [
            new SiLayer({
                siMap:this.siMap,
                name:'لایه 1',
                shouldMapExtentToThis:false,
                type:'vector',
            }),
            new SiLayer({
                siMap:this.siMap,
                name:'لایه 2',
                shouldMapExtentToThis:false,
                type:'vector',
            })
        ]
        
        this.setState({mapContainer:this.siMap.map})    
        this.setState({sampelLayer:sampelLayer})  
        
        this.props.loaded && this.props.loaded(this);
        }
        
    setMousePositionControl() {
        this.mousePositionControl = new MousePosition({
            coordinateFormat: createStringXY(13),
            projection: 'EPSG:4326',
            // comment the following two lines to have the mouse position
            // be placed within the map.
            className: 'custom-mouse-position',
            target: this.mpRef.current
        });

    }

    componentWillUnmount() {

    }
    componentDidUpdate(){

    }

    render() {
        const {classes} = this.props;
        const {loaded} = this.state;
        return <>

                <Grid container>
                <Grid ref={this.mapContainerRef} style={{width:'100%',height:'90vh',border:'1px solid black'}} item xs={6} sm={6} md={6} lg={6} xl={6}>
                    {/* <div dir="ltr" ref={this.mapRef} className={classes.root} style={{height: '100%',cursor:'url(cursor.ico) 30 30,auto'}}>
                    </div> */}
                    
                    
                </Grid>  
                         
                <Grid ref={this.mapContainerRef2} style={{width:'100%',height:'90vh'}} item xs={6} sm={6} md={6} lg={6} xl={6}>
                    <div style={{width:'100%',height:'100%'}} ref={this.svgRef}></div>
                </Grid>  
                </Grid>
                <input disabled='true' ref={this.commandRef} style={{width:'100%' , minHeight:'1.5rem',margin:0,visibility:'hidden'}}  />
                <TextareaAutosize style={{width:'100%' , margin:0,visibility:'hidden'}}
                disabled={true}
                minRows={6}
                ref={this.commandTextAreaRef}
                />
                {/* <img src={this.state.imageSource}></img> */}
            <Button onClick={e=>this.handleExportAsSVG(this.state.siMap)}>ExportSVG</Button>
            {/* <Button onClick={e=>this.handleDownloadAsPNG(this.state.siMap)}>download</Button> */}
            <a id="image-download" download="map.png">downlaod as png</a>
        </>
    }

}


export default withStyles(styles)(MapOl);
