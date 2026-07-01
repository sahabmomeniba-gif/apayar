import { wcs_sideBarContentsType } from '../../entities/SiMap'
import '../style.css'


export const wcs_sideBar_styleHandler = (siMap) => {
    // console.log(siMap.appStyle.activeSideBarContent.content)
    let base = ''
    base += `
            <div class="wcs_navbar">
                    <nav>
                        ${sideBar(siMap)}
                    </nav>
            </div>
            <div class="wcs_panel">
                <div class="wcs_panel_title">
                    <div>${getPanelTitle(siMap)}</div>
                    <div class="wcs_closer_container">
                        
                        <a>
                            <img src="./webCad_Icons/wcs-menucloser-light.svg">
                        </a>
                    </div>        
                </div>
                <div class="wcs_panel_content">
                    ${siMap.appStyle.activeSideBarContent.content}
                </div>      
            </div>
        </div>
    `
    return base
}
const sideBar = (siMap) => {
    let str = '';
    let activeContentName = siMap.appStyle.activeSideBarContent.name
    siMap.appStyle.sideBarContent.forEach(content => {
        let backgroundColor = (content.name === activeContentName) ? getComputedStyle(document.body).getPropertyValue('--wcs--primary-color') : getComputedStyle(document.body).getPropertyValue('--wcs--secoundray-color')
        str += `
        <div > 
            <a style="background:${backgroundColor}" contentName="${content.name}"          
            >
                <img class="wcs_navbar_icon"  src="${content.icon}">
                <span>${content.title}</span>
            </a>
        </div>
            `
    })
    return str
}

const getPanelTitle = (siMap) => {
    if (!siMap) return
    let activeContentName = siMap.appStyle.activeSideBarContent.name
    switch (activeContentName) {
        case wcs_sideBarContentsType.objectProperties:
            return "Object Properties"
        case wcs_sideBarContentsType.layerProperties:
            return `<div class="wcs_sidebar_Layers_title">
                <div>
                    ${activeContentName}
                </div>
                <div class="wcs_addLayer_container">
                    <span class="wcs_addLayer_tooltip">create layer</span>
                    <a><img src='./webCad_Icons/wcs_addLayer.svg' /></a>
                </div>
            </div>  `
        case wcs_sideBarContentsType.baseImageProperties:
            return "Images Properties"
        case wcs_sideBarContentsType.labeling:
            return "برچسب"
        case wcs_sideBarContentsType.linelabeling:
            return "نوع خط"
        default:
            break;
    }
}