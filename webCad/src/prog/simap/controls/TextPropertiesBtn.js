import 'ol/ol.css';
import {Control} from 'ol/control';
import './style.css'
import { ControlType } from '../entities/Entity';


class TextControlBtn extends Control {
  constructor(opt_options) {
    const options = opt_options || {};

    // ImportButton.innerHTML = 'Import DXF';
    const element = document.createElement('div');
    element.className = "TextControlBtn"
    // element.className = 'rotate-north ol-unselectable ol-control';
    // element.appendChild(ImportButton);
    super({
      element: element,
    });
      this.siMap = options.siMap
      this.element.innerHTML = 
      `
      <input type="button" class="set_panel" value="ctrl+2/Texts Properties">
      <input type="file" class="my_file">
      `
      // element.getElementsByClassName('get_file')[0].blur();
      element.getElementsByClassName('set_panel')[0].onclick = (e)=> {
        this.siMap.activeControl(ControlType.textProperties)
        // this.siMap.siCommand.execCommand('rotate',e.target)
    };

      this.siMap.map.addControl(this)
      // let input = document.createElement('input')
      // this.element.
    }
  }

export default TextControlBtn