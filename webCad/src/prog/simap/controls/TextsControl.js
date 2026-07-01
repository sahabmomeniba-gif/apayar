import 'ol/ol.css';
import {Control, defaults as defaultControls} from 'ol/control';
import baseElement from './BaseElement';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Fill, RegularShape, Stroke, Style } from 'ol/style';
import LineString from 'ol/geom/LineString';
import TextProperties from './Menu/TextProperties';

class TextsControl extends Control {
    
    constructor(opt_options) {
      const options = opt_options || {};
      super({
        element: baseElement(),
      });
      this.siMap = options.siMap
      const element = TextProperties({
        title:'Text Properties',
        control:this
      })
      this.element.appendChild(element)
      this.element.style.visibility = 'hidden'
      this.open = false;
      this.controlEvents()
    }
    controlEvents(){
        let exitControl = this.element.getElementsByClassName('exit')[0]
        exitControl.addEventListener('click',this.handleOpen.bind(this),false)
        let zoomControl = this.element.getElementsByClassName('zoomToFeature')[0]
        zoomControl.addEventListener('click',this.zoomToFeature.bind(this),false)
        let currentFeatureControl = this.element.getElementsByClassName('select-currentText')[0]
        currentFeatureControl.addEventListener("click", e=> {
            var options = currentFeatureControl.querySelectorAll("option");
            var count = options.length;
            if(typeof(count) === "undefined" || count < 2)
            {
            this.currentFeature = this.siMap.siSelect.getTextSet().getArray()[0];
            this.currentFeatureIndex = e.target.value 
            }
        });
        currentFeatureControl.addEventListener('change',e=>{
            this.currentFeature = this.siMap.siSelect.getTextSet().getArray()[e.target.value];
            this.currentFeatureIndex = e.target.value
            this.setCurrentFeatureColor(true)
        },false)
        let wrapper = this.element.getElementsByClassName('select-wrapper')[0]
        wrapper.addEventListener('click',e=>{
            wrapper.querySelector('.dropdown').classList.toggle('open');       
        })
        let colorSelectControl = this.element.getElementsByClassName('color-selector')
        for (let index = 0; index < colorSelectControl.length; index++) {
            const element = colorSelectControl[index];
            // console.log(element)
            element.addEventListener('click',e=>{
            this.currentColor = element.children[0].getAttribute('color')
            this.setFontColor()
            },false)
        }
        let textStringControl = this.element.getElementsByClassName('text-string')[0]
        textStringControl.addEventListener('change',e=>{
            this.handleChangeText(e.target.value)   
            this.siMap.siCommand.sendMessage(`text changed to "${e.target.value}"`)   
        })
        textStringControl.addEventListener('focus',e=>{
          this.siMap.siCommand.deActive()
        })
        let textCenterX = this.element.getElementsByClassName('text-center-x')[0]
        textCenterX.addEventListener('change',e=>{
            this.handleChangeCenter([parseFloat(e.target.value),this.currentFeature.text.center[1]])   
             
        })
        let textCenterY = this.element.getElementsByClassName('text-center-y')[0]
        textCenterY.addEventListener('change',e=>{
            this.handleChangeCenter(this.currentFeature.text.center[0],[parseFloat(e.target.value)])    
        })
        let textRotate= this.element.getElementsByClassName('text-rotate')[0]
        textRotate.addEventListener('change',e=>{
            this.handleChangeangle(parseFloat(e.target.value)*Math.PI/180)    
        })
    }
    handleChangeangle(angle){
        this.currentFeature.changeangle(angle)
        this.currentFeature.setModifyPoint()
        this.handleSelection(false)
    }
    handleChangeCenter(center){
        this.currentFeature.changeCenter(center)
        this.currentFeature.setModifyPoint()
        this.handleSelection(false)
    }
    handleChangeText(text){
        this.currentFeature.changeText(text)
        this.handleSelection(false)
    }
    zoomToFeature(){
        let feature = this.getCurrentFeature()
        if(feature){
          let extent = feature.getGeometry().getExtent()
          this.siMap.map.getView().fit(extent,this.siMap.map.getSize())
          this.siMap.map.getView().setZoom(this.siMap.map.getView().getZoom()-1)
        }
      }
    setFontColor(){
        let feature = this.getCurrentFeature();
        if(feature){
            feature.changeFontColor(this.currentColor)
            this.setCurrentFeatureColor(true)
        }
    }
    setCurrentFeatureColor(shouldResetPanel){
        let feature = this.getCurrentFeature()
        if(feature){
          this.currentFeatureColor = feature.styleProperties.textColor
          if(shouldResetPanel){
            this.handleSelection()
          }
        }
      }
    getCurrentFeature(){
        if(this.siMap.siSelect && this.siMap.siSelect.getTextSet().getLength() > 0 && !this.currentFeature){
          return this.siMap.siSelect.getTextSet().getArray()[0]
        }
        else{
          return this.currentFeature
        }
      }
    show(){
      // console.log(this.element)
      if(!this.open){
        if(this.siMap.controls.textsPropertiesControl === false){
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
      if(this.open){
        this.hide()
      }
      else{
        this.show()
      }
    }
    handleSelection(removeCurrentFeature){
        this.siMap.siCommand.reActive()
        if(removeCurrentFeature){
            this.currentFeature = undefined
            this.currentFeatureIndex = undefined
         }
         else{
           if(!this.currentFeature){
             this.getCurrentFeature()
             this.setCurrentFeatureColor(false)
           }
         }
      if(!this.currentFeature && this.siMap.siSelect.getTextSet().getLength() >0){
          this.currentFeature = this.siMap.siSelect.getTextSet().getArray()[0]
          this.currentFeatureIndex = 0
      }
      const element = TextProperties({
        title:'Text Properties',
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

  
export default TextsControl