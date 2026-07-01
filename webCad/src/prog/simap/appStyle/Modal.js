import { Control } from "ol/control";

const wcs_modalTemplate = () => {
    let container = document.createElement('div');
    container.className = 'wcs_modal_container'
    return container
}

const wcs_modal_styleHandler = () => {
    return `
    <div class="wcs_modal">
      <div class="wcs_modal_header">
        <div class="wcs_modal_title">title</div> 
        <div class="wcs_modal_closer"></div> 
      </div>
      <div class="wcs_modal_content">
      </div>
      <div class="wcs_modal_footer">
        <div class="wcs_modal_btn_container">
            <button class="wcs_modal_apply"><span>Apply</span></button>
            <button class="wcs_modal_cancel"><span>Cancel</span></button>
            </div>   
        <div class="wcs_modal_messager">
          <div class="wcs_modal_messager_content"></div>
        </div>
      </div>
    </div>`
}
class wcs_modal {

    constructor(siMap, container) {
        // super({
        //     element: wcs_modalTemplate(),
        // });
        this.element = container
            // this.element.style.background = 'rgba(255,255,255,0.1)'
        this.siMap = siMap
        this.element.innerHTML = wcs_modal_styleHandler()
        this.name = 'wcs_modal'
        this.init()
        this.handleEvents()

        // this.reShape()
    }
    init() {
        this.modalCloser = this.element.getElementsByClassName('wcs_modal_closer')[0];
        this.modalCancel = this.element.getElementsByClassName('wcs_modal_cancel')[0];
    }
    handleEvents() {

        this.modalCloser.addEventListener('click', e => {
            this.element.style.display = 'none'
            this.siMap.modalOpen = false
            if (this.siMap.siCommand.currentCommand) this.siMap.siCommand.siCommandAbrot()
        })
        this.modalCancel.addEventListener('click', e => {
            this.element.style.display = 'none'
            this.siMap.modalOpen = false
            if (this.siMap.siCommand.currentCommand) this.siMap.siCommand.siCommandAbrot()
        })

    }
    open(content, width, height) {
        console.log(width, height)
        this.element.style.display = 'inline-block'
        this.siMap.container.style.background = 'white'
        if (width) {
            this.element.getElementsByClassName('wcs_modal')[0].style.width = width
                // console.log(`calc((100% - ${this.options.width})/2)`)
            this.element.getElementsByClassName('wcs_modal')[0].style.left = `calc((100% - ${width})/2)`
        }
        if (height) {
            this.element.getElementsByClassName('wcs_modal')[0].style.height = height
            this.element.getElementsByClassName('wcs_modal')[0].style.top = `calc((100% - ${height})/2)`
        }
        this.element.getElementsByClassName('wcs_modal')[0].innerHTML = content
        this.siMap.modalOpen = true
    }
    close() {
        this.element.style.display = 'none'
            // this.command.siMap.modalOpen = false
    }
    reShape() {
        this.element.removeChild(this.element.firstChild)
        this.element.innerHTML = wcs_modal_styleHandler()
        this.init()
        this.handleEvents()
    }
}

export default wcs_modal