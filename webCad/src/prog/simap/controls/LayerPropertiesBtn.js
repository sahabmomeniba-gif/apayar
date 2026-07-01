import 'ol/ol.css';
import {Control} from 'ol/control';
import './style.css'
import { ControlType } from '../entities/SiMap';


class LayerControlBtn extends Control {
  constructor(opt_options) {
    const options = opt_options || {};

    // ImportButton.innerHTML = 'Import DXF';
    const element = document.createElement('div');
    element.className = "LayerControlBtn"
    // element.className = 'rotate-north ol-unselectable ol-control';
    // element.appendChild(ImportButton);
    super({
      element: element,
    });
      this.siMap = options.siMap
      this.element.innerHTML = 
      `
      <input type="button" class="set_panel" value="ctrl+4/layers Properties">
      <input type="file" class="my_file">
      `
      // element.getElementsByClassName('get_file')[0].blur();
      element.getElementsByClassName('set_panel')[0].onclick = (e)=> {
        this.siMap.activeControl(ControlType.layerProperties)
        // this.siMap.siCommand.execCommand('rotate',e.target)
    };

      this.siMap.map.addControl(this)
      // let input = document.createElement('input')
      // this.element.
    }
  }

export default LayerControlBtn