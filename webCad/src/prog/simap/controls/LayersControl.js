import 'ol/ol.css';
import {Control} from 'ol/control';

import baseElement from './BaseElement';
import FeatureProperties from './Menu/FeatureProperties';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Fill, RegularShape, Stroke, Style } from 'ol/style';
import LineString from 'ol/geom/LineString';
import { EntityType, styleStatus } from '../entities/Entity';
import Polygon from 'ol/geom/Polygon';
import Circle from 'ol/geom/Circle';
import { Mm2Px } from '../initparams';
import CentriodProperties from './Menu/CentriodProperties';
import { CentriodType } from '../entities/Labels';
import { multipleExist } from '../helpers/MultiParamsArrayCheck';
import LayerProperties from './Menu/LayerProperties';

class LayersControls extends Control {
  constructor(opt_options) {
    const options = opt_options || {};
    super({
      element: baseElement(),
    });
      this.siMap = options.siMap
      const element = LayerProperties({
        title:'Layers Properties',
        control:this
      })
      this.element.appendChild(element)
      this.element.style.visibility = 'hidden'
      this.open = false;
      this.controlEvents()
      if(options.shouldHide !=undefined){
        this.shouldHide = options.shouldHide
      }
      else{
        this.shouldHide = false
      }
    }
    controlEvents(){
      let exitControl = this.element.getElementsByClassName('exit')[0]
      exitControl.addEventListener('click',this.handleOpen.bind(this),false)
      let wrapper = this.element.getElementsByClassName('select-wrapper')[0]
      wrapper.addEventListener('click',e=>{
        wrapper.querySelector('.dropdown').classList.toggle('open');
      })
      let colorSelectControl = this.element.getElementsByClassName('color-selector')
      for (let index = 0; index < colorSelectControl.length; index++) {
        const element = colorSelectControl[index];
        // console.log(element)
        element.addEventListener('click',e=>{
          this.setColor(element.children[0].getAttribute('color'))
        },false)
        let selectlayer = this.element.getElementsByClassName('select-layer')[0]
        selectlayer.addEventListener('change',e=>{
          this.handleActiveLayer(e.target.value)
        },false)
        let selectLineType = this.element.getElementsByClassName('select-lineType')[0]
        selectLineType.addEventListener('change',e=>{
          // console.log(e.target.value)
          this.setLineType(e.target.value)
        },false)
        let selectLineWidth = this.element.getElementsByClassName('select-LineWidth')[0]
        selectLineWidth.addEventListener('change',e=>{
          // console.log(e.target.value)
          this.setLineWidth(e.target.value)
        },false)
        let visibleControl = this.element.getElementsByClassName('input-visible')[0]
        visibleControl.addEventListener('change',e=>{
          // console.log()
          this.setVisible(e.target.checked)
        },false)
        let frozenControl = this.element.getElementsByClassName('input-frozen')[0]
        frozenControl.addEventListener('change',e=>{
          // console.log()
          this.setFrozen(e.target.checked)
        },false)
        let snapsControl = this.element.getElementsByClassName('input-snap')[0]
        snapsControl.addEventListener('change',e=>{
          // console.log()
          this.setSnaps(e.target.checked)
        },false)
        let zoomControl = this.element.getElementsByClassName('zoomToLayer')[0]
        zoomControl.addEventListener('click',e=>{
          // console.log()
          this.zoomToLayer()
        },false)
      }
    }
    zoomToLayer(){
      this.siMap.zoomToLayer(this.siMap.activeLayer.name,-1)
    }
    setSnaps(checked){
      // console.log('how')
      // this.siMap.lazyLoad = false
      if(checked){
        this.siMap.activeLayer.addSnaps()
        // return
      }
      else{
        this.siMap.activeLayer.removeSnaps()
        // return
      }
      // this.handleSelection()
    }
    setFrozen(checked){
      // console.log('how')
      if(checked){
        this.siMap.activeLayer.freeze()
        // return
      }
      else{
        this.siMap.activeLayer.unFreeze()
        // return
      }
      // this.handleSelection()
    }
    setVisible(checked){
      // console.log('how')
      if(checked){
        this.siMap.activeLayer.show()
        // return
      }
      else{
        this.siMap.activeLayer.hide()
        // return
      }
      // this.handleSelection()
    }
    setLineWidth(lineWidth){
      this.siMap.activeLayer.styleProperties.lineWidth = lineWidth*Mm2Px
      let entites = this.siMap.activeLayer.source.getFeatures();
      entites.forEach(entity=>{    
        // console.log(entity)
        if(entity.entityType != EntityType.text && entity.entityType != EntityType.label){
          if(entity.styleStatus.width === styleStatus.byLayer){
            entity.changeLineWidth(this.siMap.activeLayer.styleProperties.lineWidth)
          }
        }
      })
      // this.handleSelection()
    }
    setLineType(lineType){
      switch (lineType) {
        case 'countinus':  
            this.siMap.activeLayer.styleProperties.lineDash = [0,0]
            break;
        case 'dashed':
          this.siMap.activeLayer.styleProperties.lineDash = [5,0,5]
            break;
        default:
            break;
    }
    // this.handleSelection()
    }
    handleActiveLayer(name){
      let activeLayer = this.siMap.layers.find(layer=>layer.name === name);
      if(activeLayer){
        this.siMap.activeLayer = activeLayer
      }
      this.handleSelection()
    }
    setColor(color){
      // console.log(color,'setCOLOR')
      this.siMap.activeLayer.styleProperties.color = color
      let entites = this.siMap.activeLayer.source.getFeatures();
      entites.forEach(entity=>{    
        // console.log(entity)
        if(entity.entityType != EntityType.text && entity.entityType != EntityType.label){
          if(entity.styleStatus.color === styleStatus.byLayer){
            entity.changeColor(this.siMap.activeLayer.styleProperties.color)
          }
        }
      })
      this.handleSelection()
    }
    show(){
      // console.log(this.element)
      if(!this.open){
        if(this.shouldHide == true){
          return
        }
        this.element.style.visibility = ''
        this.open = true
      }
    }
    hide(){
      if(this.open){
        this.element.style.visibility = 'hidden'
        this.open = false
      }
    }
    handleOpen(){
      // console.log('closed')
      if(this.open){
        // this.label.deSelect()
        this.hide()
        // this.siMap.clearModify()
        // this.label.select = false
        // this.siMap.siSelect.label = undefined;
      }
      else{
        this.show()
      }
    }
    handleRotateNorth() {
      this.getMap().getView().setRotation(0);
    }
    handleSelection(){
      this.label = this.siMap.siSelect.currentLabel
      const element = LayerProperties({
          title:'Layers Properties',
          control:this
        })   
      this.element.removeChild(this.element.lastChild)
      this.element.appendChild(element)
      this.controlEvents()
    }
    getCurrentSelection(){
      return this.currentSelection
    }   
  }

export default LayersControls