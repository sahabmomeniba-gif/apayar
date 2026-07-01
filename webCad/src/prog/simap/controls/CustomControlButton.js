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

class CustomControlButton extends Control {
  constructor(opt_options) {
    const options = opt_options || {};

    // ImportButton.innerHTML = 'Import DXF';
    const element = document.createElement('div');
    element.style.position = 'absolute'
    if(options.right) element.style.right = options.right
    if(options.top) element.style.top = options.top
    if(options.left) element.style.left = options.left
    if(options.bottom) element.style.bottom = options.bottom
    
    // element.className = "importDxf"
    // element.className = 'rotate-north ol-unselectable ol-control';
    // element.appendChild(ImportButton);
    super({
      element: element,
    });
      this.siMap = options.siMap
      this.element.innerHTML = 
      `
      <input type="button" class="get_file" value="${options.title ? options.title : 'click me'}">
      <input type="file" class="my_file">
      `
      // element.getElementsByClassName('get_file')[0].blur();border: 5px solid green !important;
      let btnElm = element.getElementsByClassName('get_file')[0]
      var command = options.command ? options.command : ''
      // console.log(options.fileFunction)
      btnElm.onclick = (e)=> {
        e.target.blur()
        this.siMap.siCommand.execCommand(`${command}`,e.target)
        if(options.input){
          element.getElementsByClassName('my_file')[0].click();
        }
    };
    var color = options.color ? options.color : '#88c'
    btnElm.style.borderColor = color
      // let input = document.createElement('input')
      // this.element.
    }
    getLinkElement(){
      return this.element.getElementsByClassName('my_file')[0]
    }
    getButtonElement(){
      return this.element.getElementsByClassName('get_file')[0]
    }
  }

export default CustomControlButton