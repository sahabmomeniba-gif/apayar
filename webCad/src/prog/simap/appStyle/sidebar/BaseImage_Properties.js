import { lineTypeType, lineWeightType } from "../../entities/Entity"
import SiMap, { getCadColor } from "../../entities/SiMap"
import { getColorFromIndex, getLineTypeNameFromIndex, getLineWeigthNameFromIndex } from "./wcs_sidebar"
export const BaseImage_Properties = (siMap) => {
    var htmlStr = ''
    htmlStr += `
        <div class="wcs_imagesProperties_Container"> 
            ${getOuthoPhotoList(siMap)}
        </div>
    `
    return htmlStr
}
export const getOuthoPhotoList = (siMap) => {
    let str = ''
    if (!siMap.baseLayers) return str
    for (let index = 0; index < siMap.baseLayers.length; index++) {
        const baseLayer = siMap.baseLayers[index];
        let activeColor;
        // console.log(index, siMap.activeBaseLayerIndex)
        if (index === siMap.activeBaseLayerIndex) {
            activeColor = getComputedStyle(document.body).getPropertyValue('--wcs--hover-color')
        } else {
            activeColor = 'none'
        }
        let metadataLink = `http://10.1.47.36:2000/#/dyTab/imageryProjects/imageryProjects.tab/${baseLayer.id}`
        let metadata = baseLayer.id ? `<div layerId="${index}" class="wcs_baseLayer_Items_metadata wcs_panelList_items_icons_container wcs_clickable">
        <a href=${metadataLink} target="_blank" class="wcs_layers_statusIcon">
        <img src="./webCad_Icons/wcs_metadata.svg"/>
        </a></div>` : ''
        str += ` 
                <div class="wcs_layerProperties_Items" style="background:${activeColor}">
                <span class="wcs_LayerItem_tooltip">${baseLayer.name}</span>
                <div  layerId="${index}" class="wcs_layerProperties_Items_title ">
                <label >${baseLayer.name}</label></div>
                ${metadata}
                <div layerId="${index}" class="wcs_baseLayer_Items_add wcs_panelList_items_icons_container wcs_clickable">
                    <a class="wcs_layers_statusIcon">
                        <img  src="./webCad_Icons/wcs_addBaseLayer.svg"/>
                    </a>
                </div>
                <div layerId="${index}" class="wcs_baseLayer_Items_remove wcs_panelList_items_icons_container wcs_clickable">
                    <a class="wcs_layers_statusIcon">
                    <img src="./webCad_Icons/wcs_removeBaseLayer.svg"/>
                    </a>
                </div>
                    
                </div>
        `
    }
    let finalstr = `
        <div class="wcs_layerProperties_list">
            ${str}
        </div>     
    `

    return finalstr
}
const getLineWeight = (siMap) => {
    let str = ''
    let cadMainLineWeigth = [{
            name: 'Default',
            index: lineWeightType.default
        },
        {
            name: '0.5 mm',
            index: lineWeightType.w0d5
        },
        {
            name: '1 mm',
            index: lineWeightType.w1d0
        },

        {
            name: '1.5 mm',
            index: lineWeightType.w1d5
        },

        {
            name: '2 mm',
            index: lineWeightType.w2d0
        },

    ]
    cadMainLineWeigth.forEach(item => {
        let checked = ''
        if (siMap.activeLayer) {
            if (siMap.activeLayer.lineTypeWeigth === item.index) checked = './webCad_icons/wcs_checked_light.svg'
        }
        str += ` <div  elmLineWeigthName="${item.name}"  lineWeigthIndex="${item.index}" class="wcs_panel_objects_lineWeigth_container wcs_clickable">
                    <div><img class="wcs_checked_lineWeigth" src=${checked}></div>
                    <div><label>${item.name}</label></div>          
                </div>
                `
    })
    return str
}
const getLineType = (siMap) => {
    let str = ''
    let cadMainLineType = [{
            name: 'Dashed',
            index: lineTypeType.dashed
        },
        {
            name: 'Countinues',
            index: lineTypeType.countinus
        }
    ]
    cadMainLineType.forEach(item => {
        let checked = ''
        if (siMap.activeLayer) {
            if (siMap.activeLayer.lineTypeIndex === item.index) checked = './webCad_icons/wcs_checked_light.svg'
        }
        var byLayer = ''
            // console.log(checked)
        if (item.name === 'By Layer') { byLayer = 'byLayer' }
        str += ` <div byLayer="${byLayer}" elmLineTypeName="${item.name}"  lineTypeIndex="${item.index}" class="wcs_panel_objects_lineType_container wcs_clickable">
                    <div><img class="wcs_checked_lineType" src=${checked}></div>
                    <div><label>${item.name}</label></div>          
                </div>
                `
    })
    return str
}
const getColors = (siMap) => {
    let str = ''
    let cadMainColor = [{
            index: 0,
            name: 'Black',
            color: 'rgba(15,15,15,1)'
        },
        {
            index: 1,
            name: 'Red',
            color: 'rgb(255,0,0)'
        },
        {
            index: 2,
            name: 'Yellow',
            color: 'rgb(255,255,0)'
        },
        {
            index: 3,
            name: 'Green',
            color: 'rgb(0,255,0)'
        },
        {
            index: 4,
            name: 'Cyan',
            color: 'rgb(0,255,255)'
        },
        {
            index: 5,
            name: 'Blue',
            color: 'rgb(0,0,255)'
        },
        {
            index: 6,
            name: 'Magenta',
            color: 'rgb(255,0,255)'
        },
        {
            index: 7,
            name: 'White',
            color: 'rgb(255,255,255)'
        },
    ]
    cadMainColor.forEach(item => {
        var byLayer = ''
        if (item.name === 'By Layer') { byLayer = 'byLayer' }
        str += ` <div byLayer="${byLayer}" elmColorName="${item.name}" elmColor="${item.color}" colorIndex="${item.index}" class="wcs_panel_objects_color_container wcs_clickable">
                    <div><img src=""></div>
                    <div style="background-color:${item.color}"></div>
                    <div><label>${item.name}</label></div>          
                </div>
                `
    })
    return str
}