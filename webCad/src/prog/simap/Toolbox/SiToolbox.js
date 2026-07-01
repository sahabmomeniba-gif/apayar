import { Overlay } from "ol";
import Control from "ol/control/Control";
import './style.css'
const baseElement = (positionParams) => {
    let container = document.createElement('div')
    container.className = 'toolboxContainer'
    container.style.height = 'auto'
    container.style.top = `${positionParams.top}px`
    container.style.right = `${positionParams.right}px`
    return container
}

export default class SiToolbox extends Control {
    constructor(siMap, options) {
        const positionParams = {
            top: 300,
            right: 200,
        }
        super({
            element: baseElement(positionParams),
        })
        this.siMap = siMap;
        this.itemList = []
        this.siMap.map.addControl(this);
        this.updateToolBox()
        this.addSiMapCommand('line', './webCad_Icons/wcs_line_command.svg')
        this.addSiMapCommand('polyline', './webCad_Icons/wcs_pline_command.svg')
        this.addSiMapCommand('circle', './webCad_Icons/wcs_circle_command.svg')
        this.addSiMapCommand('circle3p', './webCad_Icons/wcs_circle3p_command.svg')
        this.addSiMapCommand('points', './webCad_Icons/wcs_point_command.svg')
        this.addSiMapCommand('text', './webCad_Icons/wcs_text_command.svg')
        // this.setPosition([0, 0])

    }
    addSiMapCommand(command, IconSource) {
        if (!IconSource) IconSource = './webCad_Icons/wcs_custom_command.svg'
        this.itemList.push({
            name: command,
            IconSource: IconSource,
            exec: () => {
                this.siMap.siCommand.execCommand(command)
            }
        })
        this.updateToolBox()
    }
    addCommand(name, commandFunction, IconSource) {
        this.itemList.push({
            name: name,
            IconSource: IconSource,
            exec: commandFunction
        })
        this.updateToolBox()
    }
    updateToolBox() {
        let toolboxItemStr = ''
        this.itemList.forEach((item, index) => {
                toolboxItemStr += `
                <div listItemIndex="${index}" class="wcs_toolbox_items">
                    <span class="tooltiptext">${item.name}</span>
                    <a><img src="${item.IconSource}"></img></a>
                </div>
            `
            })
            // this.element.innerHTML = ''
        toolboxItemStr += `
                <hr style="width:100%"/>
                <div class="wcs_toolbox_items wcs_grabbable wcs_toolbox_grab">
                    <span class="tooltiptext"></span>
                    <a><img src="./webCad_Icons/wcs_toolbox_drag.svg"></img></a>
                </div>
                
        `
        this.element.innerHTML = toolboxItemStr
        let items = this.element.getElementsByClassName('wcs_toolbox_items');
        for (let index = 0; index < items.length; index++) {
            const element = items[index];
            element.addEventListener('click', e => {
                this.itemList[index].exec()
            }, false)
        }
        this.element.getElementsByClassName('wcs_toolbox_grab')[0].addEventListener('drag', e => {
            // this.element.style.transform = `translateX(${e.offsetX}px) translateY(${e.offsetY}px)`
        }, false)
    }
}