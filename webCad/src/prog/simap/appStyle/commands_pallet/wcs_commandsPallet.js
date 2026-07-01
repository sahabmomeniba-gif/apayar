import 'ol/ol.css';
import { Control } from 'ol/control';
import { wcs_commandsPalletTemplate, wcs_navBarTemplate } from '../Template';
import { wcs_commandsPallet_styleHandler } from './styleHandler'

class wcs_commandsPallet {

    constructor(siMap, element) {
        // console.log(element)
        this.element = element
        this.siMap = siMap
        this.name = 'commandsPallet'
        this.element.innerHTML = wcs_commandsPallet_styleHandler(this.siMap)
        this.init()
        this.handleEvents()
            // this.reShape()
    }
    init() {
        this.navBarItems = this.element.getElementsByClassName('wcs_commandsPallet_navbar')[0].getElementsByTagName('div');
        this.commandsPalletIcon = this.element.getElementsByClassName('wcs_commandPallet_btn')
    }
    handleEvents() {
        for (let index = 0; index < this.navBarItems.length; index++) {
            const element = this.navBarItems[index];
            element.addEventListener('click', e => {
                this.siMap.setWcsCommandsPalletContent(element.getAttribute('navName'))
                this.reShape()
            }, false)
        }
        for (let index = 0; index < this.commandsPalletIcon.length; index++) {
            const element = this.commandsPalletIcon[index];
            element.addEventListener('click', e => {
                // console.log(element.getAttribute('command'))
                this.siMap.siCommand.execCommand(element.getAttribute('command'))
            }, false)
        }
    }
    reShape() {
        this.element.removeChild(this.element.firstChild)
        this.element.innerHTML = wcs_commandsPallet_styleHandler(this.siMap)
        this.init()
        this.handleEvents()
    }
}

export default wcs_commandsPallet