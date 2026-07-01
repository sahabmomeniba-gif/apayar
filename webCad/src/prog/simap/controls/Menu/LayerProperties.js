import { Collection } from 'ol'
import { EntityType } from '../../entities/Entity'
import './MenuStyle.css'
import MenuTemplate from './Template'

const LayerProperties = (options)=>{
    const control = options.control
    const layers = control.siMap.layers
    const len = layers ? layers.length : 0;
    const layerStr = getLayers(control.siMap)
    const template = MenuTemplate(options)
    const colors = getColor(control.siMap)
    const lineWidths = getLineWidth()
    let visibility =''
    if(control.siMap.activeLayer){
        if(control.siMap.activeLayer.visible) visibility = 'checked'
        else visibility = ''        
    }
    let frozen =''
    if(control.siMap.activeLayer){
        if(control.siMap.activeLayer.frozen) frozen = 'checked'
        else frozen = ''        
    }
    let snap =''
    if(control.siMap.activeLayer){
        if(!control.siMap.activeLayer.shouldNotSnap) snap = 'checked'
        else frozen = ''        
    }
    template.innerHTML += 
    `
    <div class="FeatureProperties">
        <label class="labels">
            Layers
        </label>
        <table class="styled-table">
        <tbody>
            <tr>
                <td>Total layer</td>
                <td>${len}</td>
            </tr>
            <tr>
                <td>Active Layer</td>
                <td>
                        <select  class="select select-layer">
                            ${layerStr}
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
                                            <div class="selected-color-content" style="background-color:${control.siMap.activeLayer.styleProperties.color}">
                                            </div>
                                        </div>
                                        <div class="selected-name">current</div>
                                </div>

                                <div class="custom-options">            
                                    ${colors}
                                </div>
                            </div>
                        </div>
                <td>
            </tr>
            <tr>
            <td>Line Type</td>
                <td>
                        <select  class="select select-lineType">
                            <option value="countinus">countinus</option>
                            <option value="dashed">dashed</option>
                        </select>
                </td>
            </tr>
            <tr>
                    <td>Line Width</td>
                    <td>
                            <select  class="select select-LineWidth">
                                ${lineWidths}
                            </select>
                    </td>
                </tr>
                
                <tr>
                    <td>visiblity</td>
                    <td><input type="checkbox"  ${visibility} class="input-visible"></td>
                </tr>
                <tr>
                    <td>frozen</td>
                    <td><input type="checkbox"  ${frozen}  class="input-frozen"></td>
                </tr>
                <tr>
                    <td>snap</td>
                    <td><input type="checkbox"  ${snap}  class="input-snap"></td>
                </tr>
                <tr>
                    <td>zoom to layer</td>
                    <td><button class="zoomToLayer">zoom</button></td>
                </tr>
            <!-- and so on... -->
        </tbody>
        </table>
       
    </div>
    `
    return template
}
const getLayers = (siMap)=>{
    // console.log(siMap.activeLayer.name)
    let str = ``
    if(siMap){
        siMap.layers.forEach(layer=>{
            if(siMap.activeLayer.name != layer.name){
                str+= `<option value="${layer.name}">${layer.title}</option>`
            }
            else{
                str+= `<option selected = "selected" value="${layer.name}">${layer.title}</option>`
            }
        })
    }
    return str
}
const getCircleRaidus = (circleRadius,radius)=>{
    if (!circleRadius) return ``
    else{
        return (
            `
                <tr>
                    <td>Radius</td>
                    <td>
                        <input type="number" value=${Math.round(radius*100)/100} class="input input-radius"/>
                    </td>
                </tr>
            `
        )
    }
}
const getColor = (siMap)=>{
    // console.log(siMap.activeLayer.styleProperties.color)
       let colors =  [
            {
                name:'current',
                color:siMap.activeLayer.styleProperties.color,
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
    return str
}
const getLineWidth = ()=>{
    let LineWidth = [
        {
            name:'ByLayer',
            value:1
        },
        {
            name:'ByBlock',
            value:1
        }
    ]
    let width = 0
    while(width<=2.1){
        LineWidth.push({
            name:`${Math.round(width*100)/100} mm`,
            value:Math.round(width*100)/100
        })
        width+=0.1
    }
    let str = ''
    LineWidth.forEach((element,index) => {     
            str += `<option class="select-LineWidth-option" value=${element.value}>${element.name}</option>`  
    });
    // console.log(str)
    return str
}
const getVertexs = (array,control)=>{
    let vertexList = ''
    // console.log(control.currentFeatureIndex,array.length)
    
    if(control.currentFeatureIndex === undefined || array.length ==0){
        // console.log('??????')
        return
    }
    let feature = array[control.currentFeatureIndex]
    let coordinates;
    if(!feature) return
    switch (feature.entityType) {
        case EntityType.line:
            coordinates = feature.getGeometry().getCoordinates()
            break;
        case EntityType.polygon:
            coordinates = feature.getGeometry().getCoordinates()[0]
            break;
        case EntityType.node:
            coordinates = [feature.getGeometry().getCoordinates()]
            break;
        case EntityType.circle:
            coordinates = [feature.getGeometry().getCenter()]
            break;
        default:
            break;
    }
    if(!feature) return
        coordinates.forEach((coord,index) => { 
        if(!(feature.entityType == EntityType.polygon && index == coordinates.length - 1)){
            if(index == control.currentVertexIndex){
                vertexList += `<option selected = "selected" class="select-vertex-option" value=${index}>${index}</option>`
            }
            else{
                vertexList += `<option class="select-vertex-option" value=${index}>${index}</option>`
            }
        }
    });
    return vertexList
}

export default LayerProperties