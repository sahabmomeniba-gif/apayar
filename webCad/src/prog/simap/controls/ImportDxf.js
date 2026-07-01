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

class ImportDxfControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};

    // ImportButton.innerHTML = 'Import DXF';
    const element = document.createElement('div');
    element.className = "importDxf"
    // element.className = 'rotate-north ol-unselectable ol-control';
    // element.appendChild(ImportButton);
    super({
      element: element,
    });
      this.siMap = options.siMap
      this.element.innerHTML = 
      `
      <input type="button" class="get_file fileColor" value="Import DXF">
      <input type="file" class="my_file">
      `
      // element.getElementsByClassName('get_file')[0].blur();
      element.getElementsByClassName('get_file')[0].onclick = (e)=> {
        e.target.blur()
        element.getElementsByClassName('my_file')[0].click();
    };
    element.getElementsByClassName('my_file')[0].addEventListener('change',e=>
      {     
        // console.log(e)
          let fileList = e.target.files
          const reader = new FileReader();
          reader.onloadend = evt=>{
              this.siMap.importDxf(evt.target,fileList[0].name)
              e.target.value = null
              reader.abort()
          };
          reader.readAsText(fileList[0]);   
    },false)
      // this.siMap.map.addControl(this)
      // let input = document.createElement('input')
      // this.element.
    }
  }

export default ImportDxfControl