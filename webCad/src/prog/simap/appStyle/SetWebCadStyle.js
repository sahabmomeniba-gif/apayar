import { styleModeType } from "../entities/SiMap"
import { wcs_sideBar_styleHandler } from "./sidebar/styleHandler"
import wcs_sidebar from "./sidebar/wcs_sidebar"
import { wcs_cadTemplate, wcs_commandsPalletTemplate, wcs_panelTemplate, wcs_statusBarTemplate, wcs_topMenuTemplate } from "./Template"

// export const setAppStyle = (siMap) => {
//     let div = document.createElement('div')
//     div.className = 'wcs_app_container'
//         // console.log(this.container)
//     siMap.container.appendChild(div)
//         // siMap.appStyle2.cadTarget = div

//     div.innerHTML = `
//         <div class="wcs_modal_container">
//         </div>
//         <div class="wcs_app_header">
//             <div class = "wcs_topMenu_container"></div>
//         </div>
//         <div class="wcs_app_main">
//             <div class = "wcs_app_sidebar">
//                 <div class = "wcs_panel_container"></div>
//                 <div class = "wcs_commandsPallet_container"></div>
//             </div>
//             <div class = "wcs_app_content">
//                 <div class = "wcs_cad_container"></div>
//                 <div class = "wcs_statusBar_container"></div>
//             </div>       
//         </div>
//     `
//     let panelElm = div.getElementsByClassName('wcs_panel_container')[0];
//     siMap.appStyle.modalContainer = div.getElementsByClassName('wcs_modal_container')[0]
//     siMap.appStyle.cadTarget = div.getElementsByClassName('wcs_cad_container')[0]
//     siMap.appStyle.pallet = div.getElementsByClassName('wcs_commandsPallet_container')[0]
//     siMap.appStyle.panel = div.getElementsByClassName('wcs_panel_container')[0]
//     siMap.appStyle.topMenu = wcs_topMenuTemplate()
//         // console.log(siMap.appStyle2.topMenu)
//     siMap.appStyle.statusBar = wcs_statusBarTemplate()
// }
export const setAppStyle = (siMap) => {
    let div = document.createElement('div')
    div.className = 'wcs_app_container'
        // console.log(this.container)
        // console.log(siMap.container.parentElement.parentElement.parentElement)
    if (siMap.styleMode === styleModeType.arse) {
        // console.log(siMap.container.parentElement)
        // siMap.container.parentElement.style.height = '65vh !important'
        // siMap.container.parentElement.parentElement.parentElement.style.height = '100vh'
        // siMap.container.parentElement.parentElement.parentElement.style.width = '100%'
    }
    siMap.container.appendChild(div)
        // siMap.appStyle2.cadTarget = div

    div.innerHTML = `
        <div class="wcs_modal_container">
        </div>
        <div class="wcs_app_main">
            <div class = "wcs_app_sidebar">
                <div class = "wcs_panel_container"></div>
                <div class = "wcs_commandsPallet_container"></div>
            </div>
            <div class = "wcs_app_content">
                <div class = "wcs_cad_container"></div>
            </div>       
        </div>
    `
    let panelElm = div.getElementsByClassName('wcs_panel_container')[0];
    siMap.appStyle.modalContainer = div.getElementsByClassName('wcs_modal_container')[0]
    siMap.appStyle.cadTarget = div.getElementsByClassName('wcs_cad_container')[0]
    siMap.appStyle.pallet = div.getElementsByClassName('wcs_commandsPallet_container')[0]
    siMap.appStyle.panel = div.getElementsByClassName('wcs_panel_container')[0]
    siMap.appStyle.topMenu = wcs_topMenuTemplate()
        // console.log(siMap.appStyle2.topMenu)
    siMap.appStyle.statusBar = wcs_statusBarTemplate()
}

// <div class="w
// // <div class="wcs_app_footer">
//     <div class = "wcs_commandsPallet_container"></div>
//     <div class = "wcs_statusBar_container"></div>
// </div>
// <div class = "wcs_panel_container"></div>
//     <div class = "wcs_cad_container"></div>