import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Input, TextareaAutosize, Tooltip, withStyles, Typography, Divider } from "@material-ui/core";
import './MapOl.css';
import Map from 'ol/Map'
import View from 'ol/View'
import { fromLonLat, get, Projection } from 'ol/proj'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import { defaults as defaultControls } from 'ol/control';
import { OSM, TileJSON } from 'ol/source';
import VectorSource from 'ol/source/Vector'
// import {SiInteractions, SiMap, SiModify, SiControls} from "../prog/simap/SiMap";
import SiMap, { styleModeType } from '../prog/simap/entities/SiMap'
import { Floor } from "./Floor";
import { platformModifierKeyOnly, pointerMove, primaryAction, singleClick, click, shiftKeyOnly, always } from 'ol/events/condition';
import proj4 from 'proj4';
proj4.defs("EPSG:32639", "+proj=utm +zone=39 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
import { Grid } from '@material-ui/core'

import { Icon, Style } from 'ol/style';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import SiLayer from '../prog/simap/entities/SiLayer';
import { Mm2Px } from '../prog/simap/initparams';
import SiToolbox from '../prog/simap/Toolbox/SiToolbox';
// import WebCadApp from '../prog/simap/webCadApp/webCadApp';
const styles = (theme) => ({
    root: {
        width: '100%',
        height: '100vh',
        // padding:'1rem',
        backgroundColor: '#000000e6',
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
    btn: {
        width: 'auto',
        height: '50px',
        color: 'black',
        marginRight: '0.5em',
        backgroundColor: 'rgba(216, 235, 221)',
    },
    inputText: {
        border: '1px solid black',
        margin: '0 0.5em 0 1em',
        fontFamily: 'B-Nazanin',
        direction: 'rtl',
        textAlign: 'center',
        fontSize: '1em'
    },
    label: {
        margin: '0 0.5em 0 1em',
    }
})


class webCad extends Component {
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
            Position: [undefined, undefined],
            siMap: undefined,
            Textarea: null,
            color: "rgba(255,255,255,1)",
            sampelLayer: [],
        };


    }
    handleInputDxf(e) {

    }
    handleChangeInputText(e) {
        this.setState({ inputText: e.target.value })
    }
    handleTextChange(e) {

        let siText = this.state.siMap.getParams().selectedText
            // console.log(siText)
        siText.changeText(this.state.inputText)
    }
    handleChangeComplete(e) {
        // console.log(e)
        this.setState({ color: e })
        this.state.siMap.setColor(e)
    };
    handleChangleayer(e) {
        // console.log(this.state.siMap)
        this.state.siMap.setLayer(this.state.sampelLayer[e.target.value])
            // this.setState({activeLayerName:e.target.value})
            // this.state.activeLayerName(e.target.value)
    }
    handleInputChange(e) {
        this.setState({ inputText: e.target.value })
    }
    handleRadiusChange(e) {
        this.setState({ inputRadius: e.target.value })
    }
    handleSetRaidus(siMap, radius) {
        let SiDrawInteraction = siMap.interactions.find(I => I.name == 'DrawCricle')
        if (!SiDrawInteraction) {
            return
        }
        if (!radius) {
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
        // this.webCadApp = new WebCadApp(this.mapRef.current)
            this.commandLine = this.commandRef.current
            this.siMap = new SiMap(this.mapRef.current, this.commandLine, {
                    textArea: this.commandTextAreaRef.current,
                    controls: {
                        featuresPropertiesControl: true,
                        textsPropertiesControl: true,
                        layerPropertiesControl: true,
                        snapPropertiesControl: true,
                    },
                    // commands: {
                    //     // draw:false,
                    //     // modify:false,
                    //     // action:false,
                    //     // manager:false,
                    //     // exceptions:['text']
                    // },
                    styleMode: styleModeType.noStyle,
                    // commands: {
                    //     draw: false,
                    //     modify: true,
                    //     action: true,
                    //     manager: true,
                    //     exceptions: ['text']
                    // },
                })
                // new SiToolbox(this.siMap)
            this.setState({ siMap: this.siMap })

        this.floor = new Floor(this.siMap)
        this.floor.MapOl()
        this.setState({ mapContainer: this.siMap.map })
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
    componentDidUpdate() {

    }

    render() {
        const { classes } = this.props;
        const { loaded } = this.state;
        return < >
            <
            Grid container >
            <
            Grid ref = { this.mapContainerRef }
        style = {
            { width: '100%', height: '100vh' }
        }
        item xs = { 12 }
        sm = { 12 }
        md = { 12 }
        lg = { 12 }
        xl = { 12 } >
            <
            div dir = "ltr"
        ref = { this.mapRef }
        className = { classes.root }
        style = {
                { height: '100vh' }
            } >
            <
            /div> < /
        Grid > <
            /Grid> < / >
    }

}


export default withStyles(styles)(webCad);