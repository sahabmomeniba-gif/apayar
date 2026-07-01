import { Collection } from 'ol'
import { EntityType } from '../../entities/Entity'
import './MenuStyle.css'
import MenuTemplate from './Template'

const BaseLayerProperties = (options)=>{
    const control = options.control
    const template = MenuTemplate(options)
    const GlobalBaseLayers = getGlobalBaseLayers(control)
    let currentBaseLayerName =''
    if(control.currentBaseLayer){
        if(!control.siMap.baseLayer.getSource()) currentBaseLayerName = ''
        else currentBaseLayerName = control.currentBaseLayer.name
    }
    template.innerHTML += 
    `
    <div class="FeatureProperties">
        <label class="labels">
            Imagery 
        </label>
        <table class="styled-table">
        <tbody>
            <tr>
                <td>Current</td>
                <td>
                    <span class="select select-currentFeature" >
                        ${currentBaseLayerName}
                    </span>
                </td>
            </tr>
            <tr>
                <td>BaseLayers</td>
                <td>
                    <select class="select select-baseLayer" >
                        ${GlobalBaseLayers}
                    </select>
                </td>
            </tr>
            <tr>
                <td>add BaseLayer</td>
                <td><button class="AddBaseLayer">Add</button></td>
            </tr>
            <tr>
                <td>remove BaseLayer</td>
                <td><button class="RemoveBaseLayer">Remove</button></td>
            </tr>
            <!-- and so on... -->
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
const getGlobalBaseLayers = (control)=>{
    if(!control) return ``
    if(!control.currentBaseLayer) return ``
    let str = ''
    control.siMap.baseLayers.forEach((element,index) => {
        if(element.name === control.currentBaseLayer.name){
            str += `<option selected="selected"  value=${index}>${element.name}</option>`
        }
        else{
            str += `<option  value=${index}>${element.name}</option>`
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

export default BaseLayerProperties