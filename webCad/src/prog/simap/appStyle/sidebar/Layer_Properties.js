import { lineTypeType, lineWeightType } from "../../entities/Entity"
import { getCadColor } from "../../entities/SiMap"
import { getColorFromIndex, getLineTypeNameFromIndex, getLineWeigthNameFromIndex } from "./wcs_sidebar"

export const Layer_Properties = (siMap) => {

    let htmlStr = ''
    htmlStr += `
        <div class="wcs_layerProperties_Container"> 
            ${getLayerList(siMap)}
        </div>
    `
    return htmlStr
}

export const getLayerList = (siMap) => {
    let str = ''
    if (!siMap.layers) return str
    siMap.layers.forEach(siLayer => {
        let visibility = siLayer.visible ? 'wcs_layer_visible' : 'wcs_layer_hidden'
        let snap = siLayer.shouldNotSnap ? 'wcs_layer_snapoff' : 'wcs_layer_snapon'
        let freeze = siLayer.frozen ? 'wcs_layer_freeze' : 'wcs_layer_unfreeze'
        let activeColor;
        if (siMap.activeLayer.id === siLayer.id) {
            activeColor = getComputedStyle(document.body).getPropertyValue('--wcs--hover-color')
        } else {
            activeColor = 'none'
        }
        str += ` 
                <div class="wcs_layerProperties_Items" style="background:${activeColor}">
                <span class="wcs_LayerItem_tooltip">${siLayer.title}</span>
                <div  layerId="${siLayer.id}" class="wcs_layerProperties_Items_title wcs_clickable">
                <label >${siLayer.title}</label></div>
                <div layerId="${siLayer.id}" class="wcs_layerProperties_Items_visiblity wcs_clickable">
                    <a class="wcs_layers_statusIcon">
                        <img  src="./webCad_Icons/${visibility}.svg"/>
                    </a>
                </div>
                <div layerId="${siLayer.id}" class="wcs_layerProperties_Items_freeze wcs_clickable">
                    <a class="wcs_layers_statusIcon">
                    <img src="./webCad_Icons/${freeze}.svg"/>
                    </a>
                </div>
                <div layerId="${siLayer.id}" class="wcs_layerProperties_Items_snap wcs_clickable">
                    <a class="wcs_layers_statusIcon">
                        <img src="./webCad_Icons/${snap}.svg"/>
                    </a>
                </div>
                <div layerId="${siLayer.id}" class="wcs_layerProperties_Items_color">
                    <div style="background-color:${siLayer.styleProperties.color}">
                    </div>
                </div>
                </div>
        `
    });
    // console.log(siMap.activeLayer)
    let finalstr = `
        <div class="wcs_layerProperties_list">
            ${str}
        </div>
        <div class="wcs_layerProperties_inform">
            <div class="wcs_layerProperties_inform_title"><label>Active Layer Properties</label></div>  
            <div class="wcs_panel_item wcs_object wcs_object_text">
                <div class="wcs_panel_item_title"><label>Name</label>
                
                </div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_layer_title" style="direction:'rtl'" value="${siMap.activeLayer ? siMap.activeLayer.title:''}"></input></div>
            </div>
            <div class="wcs_panel_item">
                <div class="wcs_panel_item_title"><label>Color</label></div>
                <div class="wcs_panel_dropdown">
                    <div class="wcs_panel_dropdown_btn" style="padding:0 0 0.25rem 0.25rem">
                        <div class="wcs_panel_colorSelector_div" style="background:${siMap.activeLayer ? getColorFromIndex(siMap.activeLayer.colorIndex).color:''};"></div>
                        <label class="wcs_panel_colorSelector_label">${siMap.activeLayer ? getColorFromIndex(siMap.activeLayer.colorIndex).name:''}</label>
                        <a><img src="./webCad_Icons/arrow-bottom-light.svg"></a>
                    </div>  
                    <div class="wcs_panel_dropdown_content" style="left: 100%">
                        ${getColors(siMap)}
                    </div>                   
                </div>        
            </div>
            <div class="wcs_panel_item wcs_lineType">
                <div class="wcs_panel_item_title"><label>Line Type</label></div>
                <div class="wcs_panel_dropdown wcs_panel_dropdown_lineType" >
                    <div class="wcs_panel_dropdown_btn ">
                        <label>${siMap.activeLayer ? getLineTypeNameFromIndex(siMap.activeLayer.lineTypeIndex):''}</label>
                        <a><img src="./webCad_Icons/arrow-bottom-light.svg"></a>
                    </div>  
                    <div  class="wcs_panel_dropdown_content" style="left: 100%">
                        ${getLineType(siMap)}
                    </div>
                </div>
            </div>  
            <div class="wcs_panel_item wcs_lineWeight">
                <div class="wcs_panel_item_title"><label>Line Weight</label></div>
                <div class="wcs_panel_dropdown">
                    <div class="wcs_panel_dropdown_btn ">
                        <label>${siMap.activeLayer ? getLineWeigthNameFromIndex(siMap.activeLayer.lineWeightIndex):''}</label>
                        <a><img src="./webCad_Icons/arrow-bottom-light.svg"></a>
                    </div>  
                    <div  class="wcs_panel_dropdown_content" style="left: 100%;">
                        ${getLineWeight(siMap)}
                    </div>
                    </div>
            </div>  
            
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