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

class FeaturesControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};
    super({
      element: baseElement(),
    });
      this.siMap = options.siMap
      const element = FeatureProperties({
        title:'Feature Properties',
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
      let zoomControl = this.element.getElementsByClassName('zoomToFeature')[0]
      zoomControl.addEventListener('click',this.zoomToFeature.bind(this),false)
      let currentFeatureControl = this.element.getElementsByClassName('select-currentFeature')[0]
      currentFeatureControl.addEventListener("click", e=> {
        var options = currentFeatureControl.querySelectorAll("option");
        
        var count = options.length;
        if(typeof(count) === "undefined" || count < 2)
        {
          this.currentFeature = this.siMap.siSelect.getSelectionSet().getArray()[0];
          let coordinates;
          switch (this.currentFeature.entityType) {
            case EntityType.line:
                coordinates = this.currentFeature.getGeometry().getCoordinates()
                break;
              case EntityType.node:
                coordinates = [this.currentFeature.getGeometry().getCoordinates()]
                break;
            case EntityType.polygon:
              coordinates = this.currentFeature.getGeometry().getCoordinates()[0]
              break;
            case EntityType.circle:
                coordinates = [this.currentFeature.getGeometry().getCenter()]
              break;
            default:
              break;
          }
          this.currentFeatureIndex = e.target.value 
          this.currentVertexIndex = 0
          this.currentVertex =coordinates[this.currentVertexIndex]
          this.showCurrentVertex()
          this.setCurrentFeatureColor(true);
        }
      });
      currentFeatureControl.addEventListener('change',e=>{
        this.currentFeature = this.siMap.siSelect.getSelectionSet().getArray()[e.target.value];
        this.currentFeatureIndex = e.target.value
        
        this.currentVertexIndex = 0
        let coordinates;
          switch (this.currentFeature.entityType) {
            case EntityType.line:
              coordinates = this.currentFeature.getGeometry().getCoordinates()
              break;
            case EntityType.node:
                coordinates = [this.currentFeature.getGeometry().getCoordinates()]
                break;
            case EntityType.polygon:
              coordinates = this.currentFeature.getGeometry().getCoordinates()[0]
              break;
            case EntityType.circle:
                coordinates = [this.currentFeature.getGeometry().getCenter()]
                break;
            default:
              break;
          }
        this.currentVertex =coordinates[this.currentVertexIndex]
        this.showCurrentVertex()
        this.setCurrentFeatureColor(true);
      },false)
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
          
          this.currentColor = element.children[0].getAttribute('color')
          // console.log(element.children[0].getAttribute('name') )
          if(element.children[0].getAttribute('colorName') === 'byLayer'){
            this.setColor(styleStatus.byLayer)
          }
          else{
            this.setColor(styleStatus.byEntity)
          }
        },false)

      }
      let vertexControl  = this.element.getElementsByClassName('select-vertex')[0]
      vertexControl.addEventListener("click", e=> {
        var options = vertexControl.querySelectorAll("option");
        var count = options.length;
        if(count < 2 || this.currentVertexFeature == undefined)
        {
            if(this.siMap.siSelect.getSelectionSet().getArray().length == 0){
              return
            }
            if(!this.currentFeature){
              this.currentFeature = this.siMap.siSelect.getSelectionSet().getArray()[0];
              this.currentFeatureIndex = 0
              this.handleSelection()
            }
            let coordinates;
            switch (this.currentFeature.entityType) {
              case EntityType.line:
                coordinates = this.currentFeature.getGeometry().getCoordinates()
                break;
              case EntityType.node:
                coordinates = [this.currentFeature.getGeometry().getCoordinates()]
                break;
              case EntityType.polygon:
                coordinates = this.currentFeature.getGeometry().getCoordinates()[0]
                break;
              case EntityType.circle:
                coordinates = [this.currentFeature.getGeometry().getCenter()]
                break;
              default:
                break;
            }
            this.currentVertex = coordinates[0]
            this.currentVertexIndex = e.target.value
            this.showCurrentVertex()
        }
      });
      vertexControl.addEventListener('change',e=>{
        if(!this.currentFeature){
          this.currentFeature = this.siMap.siSelect.getSelectionSet().getArray()[0]
          this.currentFeatureIndex = 0
          this.handleSelection()
        }
        let coordinates;
        switch (this.currentFeature.entityType) {
              case EntityType.line:
                coordinates = this.currentFeature.getGeometry().getCoordinates()
                break;
              case EntityType.node:
                coordinates = [this.currentFeature.getGeometry().getCoordinates()]
                break;
              case EntityType.polygon:
                coordinates = this.currentFeature.getGeometry().getCoordinates()[0]
                break;
              case EntityType.circle:
                    coordinates = [this.currentFeature.getGeometry().getCenter()]
                    break;
              default:
                break;
            }
        this.currentVertex =coordinates[e.target.value]
        this.currentVertexIndex = e.target.value
        this.showCurrentVertex()
      },false)

      let vertexXcontrol = this.element.getElementsByClassName('input-vertexX')[0]
      let vertexYcontrol = this.element.getElementsByClassName('input-vertexY')[0]
      vertexXcontrol.addEventListener('change',e=>{
        this.handleVertexChange(parseFloat(e.target.value),undefined)    
      })
      vertexYcontrol.addEventListener('change',e=>{
        this.handleVertexChange(undefined,parseFloat(e.target.value))    
      })
      let lineTypeControl = this.element.getElementsByClassName('select-lineType')[0]
      lineTypeControl.addEventListener('change',e=>{
        this.handleChangelineType(e.target.value)   
      })
      let lineWidthControl = this.element.getElementsByClassName('select-LineWidth')[0]
      lineWidthControl.addEventListener('change',e=>{
        this.handleLineWidthChange(parseFloat(e.target.value))
      })
      let circleRaidusControl = this.element.getElementsByClassName('input-radius')[0]
      if(circleRaidusControl){
        circleRaidusControl.addEventListener('change',e=>{ 
          this.handleCircleRadiusChange(parseFloat(e.target.value))
        })
      }
    }
    handleCircleRadiusChange(radius){
      let geom = new Circle(this.currentFeature.getGeometry().getCenter(),radius)
      this.currentFeature.setGeometry(geom)
      this.currentFeature.setModifyPoint()

    }
    handleLineWidthChange(width){
      this.currentFeature.changeLineWidth(width*Mm2Px)
    }
    handleChangelineType(type){
        if(this.currentFeature === undefined) this.currentFeature = this.siMap.siSelect.getSelectionSet().getArray()[0]
        this.currentFeature.changeLineType(type)
    }
    handleVertexChange(x,y){
      let newX,newY;
      let coordinates;
      let geom;
      let type = this.currentFeature.entityType
      if (this.currentVertexIndex === undefined) this.currentVertexIndex =0
      switch (type) {
        case EntityType.line:
          coordinates = this.currentFeature.getGeometry().getCoordinates();
          if(x === undefined){
            newX = coordinates[this.currentVertexIndex][0]
          }
          else{
            newX = x
          }
          if(y === undefined){
            newY = coordinates[this.currentVertexIndex][1]
          }
          else{
            newY = y
          }
          coordinates[this.currentVertexIndex] = [newX,newY];
          this.currentVertex = [newX,newY]
          geom =  new LineString(coordinates)
          break;
        case EntityType.polygon:
          coordinates = this.currentFeature.getGeometry().getCoordinates()[0];
          if(x === undefined){
            newX = coordinates[this.currentVertexIndex][0]
          }
          else{
            newX = x
          }
          if(y === undefined){
            newY = coordinates[this.currentVertexIndex][1]
          }
          else{
            newY = y
          }
          coordinates[this.currentVertexIndex] = [newX,newY];
          this.currentVertex = [newX,newY]
          geom =  new Polygon([coordinates])
          break;
        case EntityType.node:
            coordinates = [this.currentFeature.getGeometry().getCoordinates()];
            if(x === undefined){
              newX = coordinates[this.currentVertexIndex][0]
            }
            else{
              newX = x
            }
            if(y === undefined){
              newY = coordinates[this.currentVertexIndex][1]
            }
            else{
              newY = y
            }
            coordinates[this.currentVertexIndex] = [newX,newY];
            this.currentVertex = [newX,newY]
            geom =  new Point(coordinates[0])
            break;
        case EntityType.circle:
          // console.log(this.currentFeature.getGeometry().getCenter())
          coordinates = this.currentFeature.getGeometry().getCenter();
            if(x === undefined){
              newX = coordinates[0]
            }
            else{
              newX = x
            }
            if(y === undefined){
              newY = coordinates[1]
            }
            else{
              newY = y
            }
            coordinates = [newX,newY];
            this.currentVertex = [newX,newY]
            geom =  new Circle(coordinates,this.currentFeature.getGeometry().getRadius())
            break;
        default:
          break;
      }
      this.currentFeature.setGeometry(geom)
      this.currentFeature.setModifyPoint()
      this.showCurrentVertex()
    }
    showCurrentVertex(){
      if (this.currentVertexFeature) this.siMap.modify.removeFeature(this.currentVertexFeature)
      let vertexFeature = new Feature({
        geometry: new Point(this.currentVertex)
      })
      this.currentVertexFeature = vertexFeature
      this.siMap.modify.addFeature(vertexFeature)
      let style = new Style({
        image: new RegularShape({
          fill: new Fill({
              color:'rgba(255,255,255)'
          }),
          stroke: new Stroke({
              color:'rgba(255,255,255)'
          }),
          points: 4,
          radius: 25,
          radius2: 0,
          angle: Math.PI / 4,
        }),
      })
      vertexFeature.setStyle(style)
      this.setCurrentFeatureColor(true);
    }
    removeCurrentVertex(){
      if(!this.currentVertexFeature){
        return
      }
      this.siMap.modify.removeFeature(this.currentVertexFeature)
      // this.currentFeatureIndex = undefined
      // this.currentVertexIndex = undefined
      // this.currentVertex = undefined
    }
    setCurrentFeatureColor(shouldResetPanel){
      let feature = this.getCurrentFeature()
      if(feature){
        this.currentFeatureColor = feature.styleProperties.color
        if(shouldResetPanel){
          this.handleSelection()
        }
      }
    }
    setColor(status){
      let feature = this.getCurrentFeature();
      feature.styleStatus.color = status 
      if(feature){
        feature.changeColor(this.currentColor)
        this.setCurrentFeatureColor(true)
      }
    }
    zoomToFeature(){
      let feature = this.getCurrentFeature()
      if(feature){
        let extent = feature.getGeometry().getExtent()
        this.siMap.map.getView().fit(extent,this.siMap.map.getSize())
        this.siMap.map.getView().setZoom(this.siMap.map.getView().getZoom()-1)
      }
    }
    getCurrentFeature(){
      if(this.siMap.siSelect && this.siMap.siSelect.getSelectionSet().getLength() > 0 && !this.currentFeature){
        return this.siMap.siSelect.getSelectionSet().getArray()[0]
      }
      else{
        return this.currentFeature
      }
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
         this.currentFeature = undefined
         this.currentVertex = undefined
         this.currentVertexFeature = undefined
         this.currentVertexIndex = undefined
         this.currentFeatureIndex = undefined
      }
      else{
        if(!this.currentFeature){
          this.getCurrentFeature()
          this.setCurrentFeatureColor(false)
        }
      }
      if(!this.currentFeature && this.siMap.siSelect.getSelectionSet().getLength() >0){
        this.currentFeature = this.siMap.siSelect.getSelectionSet().getArray()[0]
        this.currentFeatureIndex = 0
        this.currentVertexIndex = 0
        }
      const element = FeatureProperties({
        title:'Feature Properties',
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

export default FeaturesControl