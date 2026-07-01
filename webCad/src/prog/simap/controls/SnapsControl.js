import 'ol/ol.css';
import {Control} from 'ol/control';

import baseElement from './BaseElement';
import SnapProperties from './Menu/SnapProperties';
import { snapTypeName } from '../interactions/snap/SnapTypes';
import { polarAngels } from '../interactions/snap/PolarTracking';

class SnapsControl extends Control {
    
    constructor(opt_options) {
      const options = opt_options || {};
      super({
        element: baseElement(),
      });
      this.siMap = options.siMap
      const element = SnapProperties({
        title:'Snap Properties',
        control:this
      })
      this.element.appendChild(element)
      this.element.style.visibility = 'hidden'
      this.open = false;
      this.controlEvents()
      
    }
    controlEvents(){
      // console.log('controlEvents')
      let exitControl = this.element.getElementsByClassName('exit')[0]
      exitControl.addEventListener('click',this.handleOpen.bind(this),false)
      let snapOptions = this.element.getElementsByClassName('snap-option')
      for (let index = 0; index < snapOptions.length; index++) {
        const element = snapOptions[index];
        element.addEventListener('change',e=>{
                this.siMap.siSnap.disable()
                this.handleSnapChangeActive(e.target.value)
              })
      }
      let polarRelative = this.element.getElementsByClassName('polar-option')[0]
      polarRelative.addEventListener('change',e=>{
        // this.siMap.siSnap.disable()
        this.handleChangeRelativePolar()
      })
      let polarAngle = this.element.getElementsByClassName('polar-angle')[0]
      polarAngle.addEventListener('change',e=>{
        // this.siMap.siSnap.disable()
        this.handlePolarAngleChange(e.target.value)
      })
    }
    handlePolarAngleChange(value){
      let polarTracking = this.siMap.siSnap.snapCollection.find(snap=>snap.name === snapTypeName.polarTracking)
      // polarTracking.removeSnapFeature()
      if(polarTracking){
        this.siMap.map.removeInteraction(polarTracking)
        let angle;
        if(value ==="90") angle = polarAngels[90]
        if(value === "30") angle = polarAngels[30]
        if(value === "45") angle = polarAngels[45]
        polarTracking.angle = angle
        // console.log(polarTracking.currentFeature)
        if(polarTracking.currentOrigin){
          polarTracking.addSnapFeature(polarTracking.currentFeature,polarTracking.currentOrigin)
        }
        this.siMap.map.addInteraction(polarTracking)
      }
    }
    handleChangeRelativePolar(){
      let polarTracking = this.siMap.siSnap.snapCollection.find(snap=>snap.name === snapTypeName.polarTracking)
      // polarTracking.removeSnapFeature()
      if(polarTracking){
        this.siMap.map.removeInteraction(polarTracking)
        
        if(polarTracking.relativeMode){
          polarTracking.relativeMode = false
        }
        else{
          polarTracking.relativeMode = true
        }
        // console.log(polarTracking.relativeMode)
        if(polarTracking.currentFeature && !polarTracking.relativeMode){
          polarTracking.addSnapFeature(undefined,polarTracking.currentOrigin)
        }
        if(polarTracking.currentFeature && polarTracking.relativeMode){
          polarTracking.addSnapFeature(polarTracking.currentFeature,undefined)
        }
        this.siMap.map.addInteraction(polarTracking)
      }
    }
    handleSnapChangeActive(name){
        this.siMap.siSnap.changeActive(name)
        // if(name === snapTypeName.polarTracking) {
        //   this.siMap.siSnap.snapCollection.find(snap=>snap.name === snapTypeName.polarTracking)
        // }
        this.siMap.siSnap.activate()
        this.handleSelection()
    }
    show(){
      // console.log(this.element)
      if(!this.open){
        if(this.siMap.controls.featuresPropertiesControl === false){
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
      // console.log(this.element)
      if(this.open){
        this.hide()
      }
      else{
        this.show()
      }
    }
    handleRotateNorth() {
      this.getMap().getView().setRotation(0);
    }
    handleSelection(removeCurrentFeature){
      if(removeCurrentFeature){
         
      }
      else{
        if(!this.currentFeature){
          
        }
      }
      const element = SnapProperties({
        title:'Snap Properties',
        control:this
      })
      this.element.removeChild(this.element.lastChild)
      this.element.appendChild(element)
      this.controlEvents()
    }

  }

export default SnapsControl