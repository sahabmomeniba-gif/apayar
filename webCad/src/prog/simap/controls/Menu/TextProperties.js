import { Collection } from 'ol'
import './MenuStyle.css'
import MenuTemplate from './Template'

const TextProperties = (options)=>{
    const control = options.control
    const selection =  options.control.siMap.siSelect ?  options.control.siMap.siSelect.textSet_ : new Collection
    const template = MenuTemplate(options)
    const features = getFeatures(selection.getArray(),control)
    const currentFeature = control.currentFeature
    const currentFeatureString = currentFeature ? currentFeature.text.string : ''
    const currentFeatureX = currentFeature ? currentFeature.text.center[0] : 0
    const currentFeatureY = currentFeature ? currentFeature.text.center[1] : 0
    const currentFeatureRotate = currentFeature ? currentFeature.text.rotate*180/Math.PI : 0
    const colors = getColor()
    template.innerHTML += 
    `
    <div class="FeatureProperties">
        <label class="labels">
            Selection
        </label>
        <table class="styled-table">
        <tbody>
            <tr>
                <td>Total selected</td>
                <td>${selection.getLength()}</td>
            </tr>
            <tr>
                <td>Current Text</td>
                <td>
                    <select class="select select-currentText" >
                        ${features}
                    </select>
                </td>
            </tr>
            <tr>
                <td>zoom to extent</td>
                <td><button class="zoomToFeature">Zoom</button></td>
            </tr>
            <!-- and so on... -->
        </tbody>
        </table>
        <label class="labels">
                General
        </label>
        <table class="styled-table">
            <tbody>
                <tr>
                    <td>Layer Name</td>
                    <td>
                            <select  class="select">
                                <option value="0">لایه تفکیک</option>
                                <option value="1">لایه تفکیک 2</option>
                            </select>
                    </td>
                </tr>
                <tr>
                    <td>Color</td>
                    <td>
                            <div class="select-wrapper">
                                <div class="dropdown">
                                    <div class="select__trigger">
                                            <div class="selected-color">
                                                <div class="selected-color-content" style="background-color:${control.currentFeatureColor}">
                                                </div>
                                            </div>
                                            <div class="selected-name">${control.currentFeatureColorName? control.currentFeatureColorName:'byLayer'}</div>
                                    </div>

                                    <div class="custom-options">            
                                        ${colors}
                                    </div>
                                </div>
                            </div>
                    <td>
                </tr>
                
                <tr>
                    <td>Text String</td>
                    <td>
                        <input value="${currentFeatureString}" class="input text-string"/>
                    </td>
                </tr>
                <!-- and so on... -->
            </tbody>
        </table>
        <label class="labels">
                Geometry
        </label>
        <table class="styled-table">
            <tbody>
                <tr>
                    <td>Center X</td>
                    <td>
                        <input type="number" value="${currentFeatureX}"  class="select input text-center-x"/>
                    </td>
                    
                </tr>
                <tr>
                    <td>Center Y</td>
                    <td>
                        <input type="number" value="${currentFeatureY}"  class="select input text-center-y"/>
                    </td>
                </tr>
                <tr>
                    <td>Rotate(deg)</td>
                    <td>
                        <input type="number" value="${currentFeatureRotate}" class="select input text-rotate"/>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `
    return template
}

const getColor = ()=>{
    let colors =  [
         {
             name:'byLayer',
             color:'rgba(255,255,255)'
         },
         {
             name:'byBlock',
             color:'rgba(255,255,255)'
         },
         {
             name:'red',
             color:'rgba(255,0,0)'
         },
         {
             name:'blue',
             color:'rgba(0,0,255)'
         },
         {
             name:'green',
             color:'rgba(0,128,0)'
         },
         {
             name:'yellow',
             color:'rgba(255,255,0)'
         },
         {
             name:'purple',
             color:'rgba(128,0,128)'
         },
         {
             name:'olive',
             color:'rgba(128,128,0)'
         },
         {
             name:'lime',
             color:'rgba(0,255,0)'
         },
         {
             name:'aqua',
             color:'rgb(0,255,255)'
         },
         {
             name:'fuchsia',
             color:'rgba(255,0,255)'
         },
         
     ]
 let colorStr = ''
 colors.forEach(elm => {
     colorStr += 
     `
     <div class="custom-option color-selector" >
         <div class="custom-option-color" colorName=${elm.name} color=${elm.color}>
             <div class="custom-option-color-content "  style="background-color:${elm.color}">
              </div>
         </div>
         <div class="custom-option-name">${elm.name}</div>
     </div>
     `
 });
 return colorStr
}
const getFeatures = (array,control)=>{
    let str = ''
    array.forEach((element,index) => {
        if(index == control.currentFeatureIndex){
            str += `<option selected="selected"  value=${index}>${index}</option>`
        }
        else{
            str += `<option  value=${index}>${index}</option>`
        }
        
    });
    // console.log(str)
    return str
}
export default TextProperties