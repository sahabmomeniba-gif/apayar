import { Stroke, Style } from "ol/style";
import LineString from "ol/geom/LineString";
import { SiText } from "../../entities/SiText";
import Command from "../Command";
import { getNumber, getPoint, getText, openModal, stepActionType } from "../CommandSteps";
import { Centriod, CentriodType } from "../../entities/Labels";
import './style.css'

export default class AddMabar extends Command {
    constructor(option) {
        super(option)
        this.name = 'mabar'
        this.steps = [new openModal(this, {
            title: 'معبر',
            content: modal_content(this.siMap),
            width: '500px',
            height: '260px',
            eventHandler: modal_EventHandler
        }), new getPoint(this)]
        this.coordinates = []
        this.textString = ''

        // this.endPoint = undefined
    }
    stepshandler(value, name, activeStep) {
        if (name === stepActionType.notValid) return;
        // console.log(value,name,activeStep)
        switch (activeStep) {
            case 0:
                this.handleSiCommandMessage('نقطه مرکز برچسب را انتخاب کنید')
                this.labelObj = value;
                this.steps[0].close()
                this.handleNext();
                break;
            case 1:
                this.center = value;
                this.handleNext()
                break;
            default:
                break;
        }
    }

    onMouseMove(point, mapBrowserEvent) {
            switch (this.activeStep) {
                case 1:
                    this.handleSiCommandMessage(undefined, `${Math.round(point[0]*1000)/1000},${Math.round(point[1]*1000)/1000}`)
                    break;
                default:
                    break;
            }
        }
        // onCommandType(command){
        //     if(this.activeStep != 3) return
        //     if(!this.rotate || !this.height) return
        //     if(!command) return
        //     console.log(this.rotate,this.height)
        //     // let text;
        //     console.log(command,'command Line')
        //     if(!this.siText){
        //         this.siText =  new SiText(undefined,'new text',this.center[0],this.center[1],this.rotate,command,{layer:this.siMap.activeLayer});
        //         this.siText.addTextByTextHeight(this.height,'mid mid')
        //         this.siMap.zoomToExtent(this.siText.getGeometry().getExtent(),-2)
        //     }
        //     else{
        //         console.log('first')
        //         this.siText.changeText(command,false)
        //     }
        // }
    onDone() {
        this.siMap.clearModify();
        this.handleSiCommandMessage(undefined);
        if (this.labelObj) {
            let label = new Centriod(this.center[0], this.center[1], {
                text: this.labelObj.text,
                rotation: 0,
                layer: this.siMap.activeLayer,
                size: 16,
                centriodType: CentriodType.name,
                arz: this.labelObj.arz,
                arzEslahi: this.labelObj.arz_eslahi,
            })
            label.select()
            let wcs_sidebar = this.siMap.getSiControl('wcs_sidebar');
            if (wcs_sidebar) wcs_sidebar.handleSelect();
            label.createCode()
            label.render()
        }
        // this.siMap.zoomToExtent(text.getGeometry().getExtent(),-5)
        // this.siText.changeText(this.textString)

    }
}

const modal_content = (siMap) => {
    let element = document.createElement('div');
    element.className = 'wcs_modal_content'
    let str = ''
    str += `
    <div class="wcs_cmsLabel">
        <div class="wcs_cmsLabel_item">
            <div class="wcs_panel_item_title"><label>نام معبر</label></div>
            <div class="wcs_panel_input_container">
                <input class="wcs_modal_input wcs_addLabel_nameVal">
                </input>
            </div>
        </div>
        <div class="wcs_cmsLabel_item">
            <div class="wcs_panel_item_title"><label>عرض معبر</label></div>
            <div class="wcs_panel_input_container">
                <input class="wcs_modal_input wcs_addLabel_arzVal" type="number">
                </input>
            </div>
        </div>
        <div class="wcs_cmsLabel_item">
            <div class="wcs_panel_item_title"><label>عرض اصلاحی معبر</label></div>
            <div class="wcs_panel_input_container">
                <input class="wcs_modal_input wcs_addLabel_arzEslahiVal" type="number">
                </input>
            </div>
        </div>
    </div>
    `
    element.innerHTML = str
    return element

}

const modal_EventHandler = (siMap) => {
    let modal = siMap.getSiControl('wcs_modal').element
    let contentElement = modal.getElementsByClassName('wcs_modal_content')[0]
    let inputs = contentElement.getElementsByClassName('wcs_panel_input')
    let apply = modal.getElementsByClassName('wcs_modal_apply')[0]
    for (let index = 0; index < inputs.length; index++) {
        const element = inputs[index];
        element.addEventListener('focus', e => {
            siMap.siCommand.deActive()
            siMap.mapBlur()
        }, false)
    }
    apply.addEventListener('click', e => {
        // console.log(e)
        let name = contentElement.getElementsByClassName('wcs_addLabel_nameVal')[0].value
        let arz = contentElement.getElementsByClassName('wcs_addLabel_arzVal')[0].value
        let arz_eslahi = contentElement.getElementsByClassName('wcs_addLabel_arzEslahiVal')[0].value
        let modalMessage = modal.getElementsByClassName('wcs_modal_messager_content')[0]
        if (!name || name === '' || name === null || name === undefined) modalMessage.innerHTML = 'فیلد نام اجباری است'
        else {
            if (siMap.siCommand.currentCommand) {
                console.log(siMap.siCommand.currentCommand.activeStep)
                siMap.siCommand.currentCommand.stepshandler({
                    text: name,
                    arz: arz,
                    arz_eslahi: arz_eslahi,
                }, 'apply', 0)
            }

        }
    }, false)

}