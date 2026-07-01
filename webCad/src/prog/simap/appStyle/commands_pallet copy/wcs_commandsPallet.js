import 'ol/ol.css';
import {Control} from 'ol/control';
import { wcs_panelTemplate } from '../Template';
import {wcs_commandsPallet_styleHandler, wcs_panel_styleHandler} from './styleHandler'

class wcs_panel extends Control {
    
    constructor(siMap) {
      super({
        element:  wcs_panelTemplate(),
      });
      this.siMap = siMap
      this.element.innerHTML = wcs_panel_styleHandler(this.siMap)
      this.init()
      this.handleEvents()
      // this.reShape()
    }
    init(){
     
    }
    handleEvents(){
      
    }
    reShape(){
    }
  }

export default wcs_panel