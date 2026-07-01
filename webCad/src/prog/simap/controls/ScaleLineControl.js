import 'ol/ol.css';
import {Control} from 'ol/control';
import './style.css'
import baseElement from './BaseElement';
import FeatureProperties from './Menu/FeatureProperties';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Fill, RegularShape, Stroke, Style } from 'ol/style';
import LineString from 'ol/geom/LineString';
import { EntityType } from '../entities/Entity';
import Polygon from 'ol/geom/Polygon';
import Circle from 'ol/geom/Circle';
import { Mm2Px } from '../initparams';

class PositionControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};

    // ImportButton.innerHTML = 'Import DXF';
    const element = document.createElement('div');
    element.className = "position"
    // element.className = 'rotate-north ol-unselectable ol-control';
    // element.appendChild(ImportButton);
    super({
      element: element,
    });
      this.scale = ""
      this.siMap = options.siMap
      
      // element.getElementsByClassName('get_file')[0].blur();
      this.siMap.map.on('pointermove',e=>{
        this.position = `X = ${Math.round(e.coordinate[0]*1000)/1000}  Y = ${Math.round(e.coordinate[1]*1000)/1000}`
        this.element.innerHTML = 
        `
        <span class="positionSpan">${this.position}</span>
        `
      })
      this.siMap.map.addControl(this)
      // let input = document.createElement('input')
      // this.element.
    }
  }
// const getScale = (siMap)=>{
//   let scale = this.siMap.getCurrentScale;
//   let rnumber;
//   switch (scale) {
//     case scale > 10000:
//         rnumber = 1000
//         break;
//     case scale > 1000:
//       rnumber = 1000
//       break;
//     case scale > 100:
//       rnumber = 100
//       break;
//     case scale > 10:
//       rnumber = 10
//     default:
//       break;
//   }
// }
export default PositionControl