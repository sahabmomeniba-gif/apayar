import { Collection } from 'ol'
import { EntityType } from '../../entities/Entity'
import './MenuStyle.css'
import MenuTemplate from './Template'

const FeatureProperties = (options)=>{
    const control = options.control
    let typeLabel,featureLen
    let circleRadius = false;
    let radius = 0;
    if(control.currentFeature){
        switch (control.currentFeature.entityType) {
            case EntityType.line:
                typeLabel = 'Length'
                featureLen = Math.round(control.currentFeature.getGeometry().getLength()*100)/100
                break;
            case EntityType.polygon:
                typeLabel = 'Area'
                featureLen = Math.round(control.currentFeature.getGeometry().getArea()*100)/100
                break;
            case EntityType.circle:
                typeLabel = 'Area'
                radius = control.currentFeature.getGeometry().getRadius()
                featureLen = Math.round(radius*radius*Math.PI*100)/100
                circleRadius = true
                break;
            default:
                typeLabel = 'Length'
                featureLen = 0
                break;
        }
    }
    else{
                typeLabel = 'Length'
                featureLen = 0
    }
    const selection =  options.control.siMap.siSelect ?  options.control.siMap.siSelect.selectionSet_ : new Collection
    const template = MenuTemplate(options)
    const colors = getColor(control.currentFeature)
    const features = getFeatures(selection.getArray(),control)
    const vertexs = getVertexs(selection.getArray(),control)
    const vertexX = control.currentVertexFeature ? Math.round(control.currentVertexFeature.getGeometry().getCoordinates()[0]*100)/100 : undefined
    const vertexY = control.currentVertexFeature ? Math.round(control.currentVertexFeature.getGeometry().getCoordinates()[1]*100)/100 : undefined
    
    
    const lineWidths = getLineWidth()
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
                <td>Current Feature</td>
                <td>
                    <select class="select select-currentFeature" >
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
                    <td>Layer Name</td>
                    <td>
                            <select  class="select">
                                <option value="0">لایه تفکیک</option>
                                <option value="1">لایه تفکیک 2</option>
                            </select>
                    </td>
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
                    <td>${typeLabel}</td>
                    <td class="input" >${featureLen}</td>
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
                    <td>Current Vertex</td>
                    <td>
                        <select  class="select select-vertex">
                            ${vertexs}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Vertex X</td>
                    <td>
                        <input type="number" value=${vertexX} class="input input-vertexX"/>
                    </td>
                    
                </tr>
                <tr>
                    <td>Vertex Y</td>
                    <td>
                        <input type="number" value=${vertexY} class="input input-vertexY"/>
                    </td>
                </tr>
                ${getCircleRaidus(circleRadius,radius)}
            </tbody>
        </table>
    </div>
    `
    return template
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
const getColor = (entity)=>{

       if(entity) var byLayerColor =entity.siLayer.styleProperties.color
       else var byLayerColor = 'rgba(255,255,255,1)'
       let colors =  [
           
            {
                name:'byLayer',
                color:byLayerColor
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

export default FeatureProperties