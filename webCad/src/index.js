import React, { Component } from "react";
import { render } from "react-dom";
import MapOl from "./sampels/MapOl";
import HodudChange from "./sampels/hodudChange";
import A4port from "./sampels/A4port";
import A4port2 from "./sampels/A4port2";
import WebCad from "./sampels/WebCad";
import A4Port3 from "./sampels/A4Port3";
// import Cesium from 'cesium/'
// imort Cesium3DTile
const HelloWorld = () => <div>This is single line component</div>;

class App extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                {/* <A4Port3/> */}
            {/* // Accessed the component */}
            {/* <A4port2/> */}
            {/* <MapOl/> */}
            <WebCad/>
            {/* <A4port/> */}
            {/*<HodudChange />*/}
            </div>
    );
    }
}

render(<App />, document.getElementById("root"));
