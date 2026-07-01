import { Control } from "ol/control";
import { LineTypeModalContent, modalEventsHander } from "../entities/Cadastal/SeperationApratemanLine";

const wcs_modalTemplate = () => {
    let container = document.createElement('div');
    container.className = 'wcs_modal_container'
    return container
}

const wcs_modal_styleHandler = () => {
        return `
    <div class="wcs_mapModal">
    </div>
`
    }
    // const wcs_modal_styleHandler

class wcs_mapModal extends Control {

    constructor(siMap) {
        super({
            element: wcs_modalTemplate(),
        });
        this.siMap = siMap
        this.element.innerHTML = wcs_modal_styleHandler()
        this.name = 'wcs_modal'
        this.init()
        this.handleEvents()
            // this.open(LineTypeModalContent(), '1000px', '1000px')
            // modalEventsHander(this.element)
            // this.element.style.display = 'inline-block'
            // this.reShape()
    }
    init() {

    }
    handleEvents() {

    }
    open(content, width, height) {
        console.log(width, height)
        this.element.style.display = 'inline-block'
        this.siMap.container.style.background = 'white'
        if (width) {
            this.element.getElementsByClassName('wcs_mapModal')[0].style.width = width
                // console.log(`calc((100% - ${this.options.width})/2)`)
            this.element.getElementsByClassName('wcs_mapModal')[0].style.left = `calc((100% - ${width})/2)`
        }
        if (height) {
            this.element.getElementsByClassName('wcs_mapModal')[0].style.height = height
            this.element.getElementsByClassName('wcs_mapModal')[0].style.top = `calc((100% - ${height})/2)`
        }
        this.element.getElementsByClassName('wcs_mapModal')[0].innerHTML = content
        this.siMap.modalOpen = true
    }
    close() {
        this.modal_container.element.style.display = 'none'
        this.command.siMap.modalOpen = false
    }
    reShape() {
        this.element.removeChild(this.element.firstChild)
        this.element.innerHTML = wcs_modal_styleHandler()
        this.init()
        this.handleEvents()
    }
}

export default wcs_mapModal