import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button, Input, TextareaAutosize, Tooltip, withStyles , Typography ,Divider} from "@material-ui/core";
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
import proj4 from 'proj4';
proj4.defs("EPSG:32639","+proj=utm +zone=39 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs");
import {Grid} from '@material-ui/core'
import { Icon, Style } from 'ol/style';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import SiLayer from '../prog/simap/entities/SiLayer';
import { Mm2Px } from '../prog/simap/initparams';
import SiLine from '../prog/simap/entities/SiLine';
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
    }
})


class MapOl extends Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.mapContainerRef = React.createRef()
        this.commandRef = React.createRef();
        this.commandTextAreaRef = React.createRef();
        this.newTextRef = React.createRef();
        this.mpRef = React.createRef();
        this.FindLabelSize = React.createRef()
        this.state = {
            Position:[undefined,undefined],
            siMap:undefined,
            Textarea:null,
            color:"rgba(255,255,255,1)",
            sampelLayer : [],
        };


    }
    handleInputDxf(e){

    }
    handleChangeInputText(e){
        this.setState({inputText:e.target.value})
    }
    handleTextChange(e){
        
        let siText = this.state.siMap.getParams().selectedText
        // console.log(siText)
        siText.changeText(this.state.inputText)
    }
    handleChangeComplete(e){
        // console.log(e)
        this.setState({color:e})
        this.state.siMap.setColor(e)
      };
    handleChangleayer(e){
        // console.log(this.state.siMap)
        this.state.siMap.setLayer(this.state.sampelLayer[e.target.value])
        // this.setState({activeLayerName:e.target.value})
        // this.state.activeLayerName(e.target.value)
    }
    handleInputChange(e){
        this.setState({inputText:e.target.value})
    }
    handleRadiusChange(e){
        this.setState({inputRadius:e.target.value})
    }
    handleSetRaidus(siMap,radius){
        let SiDrawInteraction = siMap.interactions.find(I => I.name == 'DrawCricle')
        if(!SiDrawInteraction){
            return
        }
        if(!radius){
            return
        }
        // console.log(SiDrawInteraction)
        SiDrawInteraction.interaction.setRadius(parseFloat(radius))
    }
    componentDidMount() {
        let self = this;
        this.initMap();
        
    }
    
    initMap() {
        this.commandLine = this.commandRef.current
        this.siMap = new SiMap(this.mapRef.current,this.commandLine,{
            textArea:this.commandTextAreaRef.current,
            controls:{
                featuresPropertiesControl:true
            }
        })
        this.setState({siMap:this.siMap})

        this.floor = new Floor(this.siMap)
        this.floor.MapOl()
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
        console.time('first')
        for (let index = 0; index < 2000; index++) {
            // console.log(index)
            var x1 = Math.random()*1000
            var y1 = Math.random()*1000
            var x2 = Math.random()*1000
            var y2 = Math.random()*1000
            new SiLine([x1,y1],[x2,y2],{
                layer:sampelLayer[0]
            })
            // if(index === 1980) console.log('s2')
        }
        console.timeEnd('first')
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
                <Grid ref={this.mapContainerRef} style={{width:'100%',height:'650px'}} item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div dir="ltr" ref={this.mapRef} className={classes.root} style={{height: '100%',cursor:'url(cursor.ico) 30 30,auto'}}>
                    </div>
                </Grid>
                {/* <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <Grid item style={{border:'1px solid black',marginLeft:'0.25em',height: '499px',width:'100%'}}>
                        <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid item container style={{direction:'rtl',padding:'0.5em'}}>
                        <Grid item style = {{direciton:'rtl',textAlign:'center',margin:'0.5em 0'}}
                        xs={6} sm={6} md={6} lg={6} xl={6}
                        >
                            <Typography>ActiveLayer</Typography>
                        </Grid>
                        <Grid item style = {{direciton:'rtl',textAlign:'center',margin:'0.5em 0' }}
                        xs={6} sm={6} md={6} lg={6} xl={6}
                        >
                            <Select
                                style={{width:'100%'}}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={this.state.activeLayerName}
                                onChange={e=>this.handleChangleayer(e)}
                                >
                                    {
                                        this.state.sampelLayer.map((layer,index)=>{
                                            return(
                                                <MenuItem value={index}>{layer.name}</MenuItem>
                                            )
                                        })
                                    }
                            
                            </Select>
                        </Grid>
                        <Divider style={{width:'100%'}}></Divider>
                        
                        <Divider style={{width:'100%'}}></Divider>
                        <Grid item style = {{direciton:'rtl',textAlign:'center',margin:'0.5em 0'}}
                        xs={6} sm={6} md={6} lg={6} xl={6}
                        >
                            <Typography>ActiveColor</Typography>
                        </Grid>
                        <Grid item style = {{direciton:'rtl',textAlign:'center',margin:'0.5em 0' }}
                        xs={6} sm={6} md={6} lg={6} xl={6}
                        >
                            <HexColorPicker
                            style={{width:'100%'}}
                            color={this.state.color} 
                            onChange = {e=>this.handleChangeComplete(e)}
                            ></HexColorPicker>
                        </Grid>
                        <Divider style={{width:'100%'}}></Divider>
                        <Grid item style = {{direciton:'rtl',textAlign:'center',margin:'0.5em 0'}}
                        xs={6} sm={6} md={6} lg={6} xl={6}
                        >
                            <Input
                            // value={this.state.siMap.Params.selectedText.text.string}
                            ref={this.newTextRef}
                            onChange={e=>this.handleChangeInputText(e)}
                            />
                        </Grid>
                        <Grid item style = {{direciton:'rtl',textAlign:'center',margin:'0.5em 0' }}
                        xs={6} sm={6} md={6} lg={6} xl={6}
                        >
                            <Button style={{backgroundColor:'goldenrod'}} onClick={e=>this.handleTextChange(e)}>Change Text</Button>
                        </Grid>
                </Grid>
                        </Grid>  
                    </Grid>
                </Grid> */}
            </Grid>
            <div ref={this.mpRef} style={{height: '12px'}}>
                <div ref={this.FindLabelSize} className={classes.calculateTextSize}></div>
            </div>
            <br/>
            <TextareaAutosize style={{width:'100%' , margin:0}}
            disabled={true}
            minRows={6}
            ref={this.commandTextAreaRef}
            />
            command:<input disabled='true' ref={this.commandRef} style={{width:'100%' , minHeight:'1.5rem',margin:0}}  />
            <div style={{marginTop:'1.5em'}}>
                {/* <label className={classes.label}>Regular draw</label> */}
                <label>Draw: </label>  
                <button  className={classes.btn} onClick={e=>{this.state.siMap.siCommand.execCommand('polyline',e.target)}} >PolyLine</button>
                <button  className={classes.btn} onClick={e=>this.state.siMap.siCommand.execCommand('poly',e.target)}>Polygons</button>
                <button  className={classes.btn} onClick={e=>this.state.siMap.siCommand.execCommand('circle',e.target)}>circle</button>
                <button  className={classes.btn} onClick={e=>this.state.siMap.siCommand.execCommand('circle3p',e.target)}>circle3p</button>
                <label style={{paddingRight:'0.5em'}}>  ActiveLayerColor: </label> 
                <Input style={{minWidth:'5em'}} type='color' value={this.state.color} onChange={e=>{
                    this.state.siMap.activeLayer.changeColor(e.target.value)
                    
                }}></Input>
                
                <label style={{paddingRight:'0.5em'}}>  ActiveLayerlineWidth: </label>   
                <Input style={{width:'3em'}} type='number' defaultValue={1} onChange={e=>{
                    this.state.siMap.activeLayer.changeLineWidth(e.target.value*Mm2Px)
                }}></Input>
                <label style={{paddingRight:'0.5em'}}>  ActiveLayerlineType: </label>   
                <br/>
                <br/>
                <label>import files: </label>           
                <Button
                    className={classes.btn}
                    component="label"
                    >
                    Import Dxf
                    <input
                        type="file"
                        hidden
                        onChange={e=>{
                            let fileList = e.target.files
                            const reader = new FileReader();
                            reader.onloadend = evt=>{
                                this.state.siMap.importFile(evt.target,fileList[0].name)
                            };
                            reader.readAsText(fileList[0]);   
                        }
                    }
                    />
                </Button>
                <br/>
                <br/>
                <label>tools: </label> 
                <button  className={classes.btn} onClick={e=>{this.state.siMap.zoomToAll()}} >Zoom To ALL</button>
                {/* <input type="submit"> */}

                {/* <Button className={classes.btn} onClick={e=>this.state.siMap.siCommand.setExcCommandLine('textsingel')}>add singel line text</Button> */}
                {/* <Button className={classes.btn} onClick={e=>RegularDraw(this.state.siMap,'LineString')}>Regular LineString</Button>
                <Button className={classes.btn} onClick={e=>RegularDraw(this.state.siMap,'Rectangle')}>Regular Rectangle</Button> */}
            </div>
            {/* <br></br>
            <div>
                <label className={classes.label}>Text</label>
                <Input className={classes.inputText } onChange={e=>this.handleInputChange(e)}></Input>
                <Button className={classes.btn} onClick={e=>addSingelTextByFrame(this.state.siMap,this.state.inputText)}>add singel text</Button>
                <Button className={classes.btn} onClick={e=>addLabel(this.state.siMap,this.state.inputText)}>add label </Button>
            </div> */}
        </>
    }

}


export default withStyles(styles)(MapOl);
