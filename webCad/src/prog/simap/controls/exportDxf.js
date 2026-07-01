import 'ol/ol.css';
import {Control} from 'ol/control';
import './style.css'
import Drawing from 'dxf-writer'
class ExportDxfControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};


    // ImportButton.innerHTML = 'Import DXF';
    const element = document.createElement('div');
    element.className = "exportDxf"
    // element.className = 'rotate-north ol-unselectable ol-control';
    // element.appendChild(ImportButton);
    super({
      element: element,
    });
      this.DxfString = ''
      this.siMap = options.siMap
      // this.element.blur()
      this.element.innerHTML = 
      `
      <input type='button'  class="get_file fileColor" value="Export DXF">
      <a type="file" class="my_file"
      download="result.dxf"
      >
      `
      // console.log(element.getElementsByClassName('get_file')[0].blur())
      // element.getElementsByClassName('get_file')[0].blur();
      element.getElementsByClassName('get_file')[0].onclick = (e)=> {
      // e.target.blur();
      element.getElementsByClassName('my_file')[0].click();
    };
    element.getElementsByClassName('get_file')[0].addEventListener('click',e=>
      {     
        this.DxfString = this.siMap.exportDxf()
        saveData(this.DxfString,'result.dxf')
        // console.log(this.url)
    },false)
      // this.siMap.map.addControl(this)
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

  const saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        // var json = JSON.stringify(data),
            var blob = new Blob([data], {type: "octet/stream"})
            var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

export default ExportDxfControl