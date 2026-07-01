import { Stroke, Style } from "ol/style";
import LineString from "ol/geom/LineString";
import { SiText } from "../../entities/SiText";
import Command from "../Command";
import { getNumber, getPoint, getText, openModal, stepActionType } from "../CommandSteps";
import { Centriod, CentriodType } from "../../entities/Labels";
import './style.css'

export default class AddLabel extends Command {
    constructor(option) {
        super(option)
        this.name = 'label'
        this.steps = [new openModal(this, {
            title: 'پلاک ثبتی',
            content: modal_content(this.siMap),
            width: '500px',
            height: '460px',
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
                    text: '',
                    rotation: 0,
                    layer: this.siMap.activeLayer,
                    size: 16,
                    centriodType: CentriodType.id,
                    sabtCode: this.labelObj.cms,
                    bakhsh: this.labelObj.bakhsh,
                    nahiye: this.labelObj.nahiye,
                    asli: this.labelObj.asli,
                    mafroozi: this.labelObj.mafroozi,
                    ghate: this.labelObj.ghate,
                    fari: this.labelObj.fari,
                })
                // console.log(label)
                // label.select()
                // let wcs_sidebar = this.siMap.getSiControl('wcs_sidebar');
                // if(wcs_sidebar) wcs_sidebar.handleSelect();
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
    const cmsStr = siMap.defaultCentriodCode.cms != '' ?
        `<input disabled="disabled" style="border-bottom:1px solid rgba(255,255,255,0.7)" value="${siMap.defaultCentriodCode.cms}"
      class="wcs_modal_input wcs_addLabel_cmsVal" maxlength="3"></input>` :
        `<input class="wcs_modal_input wcs_addLabel_cmsVal"  maxlength="3"></input>`
    const bakhshStr = siMap.defaultCentriodCode.bakhsh != '' ?
        `<input disabled="disabled" style="border-bottom:1px solid rgba(255,255,255,0.7)" value="${siMap.defaultCentriodCode.bakhsh}"
     class="wcs_modal_input wcs_addLabel_bakhshVal" pattern ="^[0-9]*$"   maxlength="2"
     oninput="javascript:var prevVal = ''; if (this.checkValidity()) prevVal = this.value;else this.value = prevVal;"
     ></input>` :
        `<input class="wcs_modal_input wcs_addLabel_bakhshVal" pattern ="^[0-9]*$"  maxlength="2"
        oninput="javascript:var prevVal = ''; if (this.checkValidity()) prevVal = this.value;else this.value = prevVal;"
     ></input>`
    const nahiyeStr = siMap.defaultCentriodCode.nahieh != '' ?
        `<input disabled="disabled" style="border-bottom:1px solid rgba(255,255,255,0.7)" value="${siMap.defaultCentriodCode.nahieh}"
     class="wcs_modal_input wcs_addLabel_nahiyeVal" pattern ="^[0-9]*$"  maxlength="2"
     oninput="javascript:var prevVal = ''; if (this.checkValidity()) prevVal = this.value;else this.value = prevVal;"
     ></input>` :
        `<input class="wcs_modal_input wcs_addLabel_nahiyeVal" pattern ="^[0-9]*$"  maxlength="2"
        oninput="javascript:var prevVal = ''; if (this.checkValidity()) prevVal = this.value;else this.value = prevVal;"
    ></input>`
    const asliStr = siMap.defaultCentriodCode.asli != '' ?
        `<input disabled="disabled" style="border-bottom:1px solid rgba(255,255,255,0.7)" value="${siMap.defaultCentriodCode.asli}"
     class="wcs_modal_input wcs_addLabel_asliVal" ></input>` :
        `<input class="wcs_modal_input wcs_addLabel_asliVal"></input>`
    const mafrooziStr = siMap.defaultCentriodCode.mafruzi != '' ?
        `<input disabled="disabled" style="border-bottom:1px solid rgba(255,255,255,0.7)" value="${siMap.defaultCentriodCode.mafruzi}"
     class="wcs_modal_input wcs_addLabel_mafrooziVal" ></input>` :
        `<input class="wcs_modal_input wcs_addLabel_mafrooziVal"></input>`
    let str = ''
    str += `
    <div class="wcs_cmsLabel">
        <div class="wcs_cmsLabel_item">
            <div class="wcs_panel_item_title"><label>کد واحد ثبتی</label></div>
            <div class="wcs_modal_input_container">
                ${cmsStr}
            </div>
        </div>
        <div class="wcs_cmsLabel_item">
            <div class="wcs_panel_item_title"><label>بخش</label></div>
            <div class="wcs_modal_input_container">
                ${bakhshStr}
            </div>
        </div>
        <div class="wcs_cmsLabel_item">
            <div class="wcs_panel_item_title"><label>ناحیه</label></div>
            <div class="wcs_modal_input_container">
                ${nahiyeStr}
            </div>
        </div>
        <div class="wcs_cmsLabel_item">
            <div class="wcs_panel_item_title"><label>پلاک اصلی</label></div>
            <div class="wcs_modal_input_container">
                ${asliStr}
            </div>
        </div>
        <div class="wcs_cmsLabel_item">
            <div class="wcs_panel_item_title"><label>پلاک فرعی</label></div>
            <div class="wcs_modal_input_container">
                <input class="wcs_modal_input wcs_addLabel_fariVal">
                </input>
            </div>
        </div>
        <div class="wcs_cmsLabel_item">
            <div class="wcs_panel_item_title"><label>مفروز و مجزا شده از</label></div>
            <div class="wcs_modal_input_container">
                ${mafrooziStr}
            </div>
        </div>
        <div class="wcs_cmsLabel_item">
            <div class="wcs_panel_item_title"><label>شماره قطعه</label></div>
            <div class="wcs_modal_input_container">
                <input class="wcs_modal_input wcs_addLabel_ghateVal">
                </input>
            </div>
        </div>
    </div>
    `
    element.innerHTML = str
    return element

}

const modal_EventHandler = (siMap, commandId) => {
    // let modal = siMap.getSiControl('wcs_modal').element
    let modal = siMap.getSiControl('wcs_modal').element
        // if (!modal) return
        // console.log(modal)
    let contentElement = modal.getElementsByClassName('wcs_modal_content')[0]
    let inputs = contentElement.getElementsByClassName('wcs_modal_input')
    let apply = modal.getElementsByClassName('wcs_modal_apply')[0]
    for (let index = 0; index < inputs.length; index++) {
        const element = inputs[index];
        element.addEventListener('focus', e => {
            siMap.siCommand.deActive()
            siMap.mapBlur()
        }, false)
    }
    apply.addEventListener('click', e => {
        // if(siMap.currentCommand.id != commandId) return
        let cms = contentElement.getElementsByClassName('wcs_addLabel_cmsVal')[0].value
        let bakhsh = contentElement.getElementsByClassName('wcs_addLabel_bakhshVal')[0].value
        let asli = contentElement.getElementsByClassName('wcs_addLabel_asliVal')[0].value
        let nahiye = contentElement.getElementsByClassName('wcs_addLabel_nahiyeVal')[0].value
        let fari = contentElement.getElementsByClassName('wcs_addLabel_fariVal')[0].value
        let ghate = contentElement.getElementsByClassName('wcs_addLabel_ghateVal')[0].value
        let mafroozi = contentElement.getElementsByClassName('wcs_addLabel_mafrooziVal')[0].value
        let notComplete = true;
        let modalMessage = modal.getElementsByClassName('wcs_modal_messager_content')[0]

        if (cms === '' || cms === null || cms === undefined) notComplete = false;
        if (bakhsh === '' || bakhsh === null || bakhsh === undefined) notComplete = false;
        if (asli === '' || asli === null || asli === undefined) notComplete = false;
        if (nahiye === '' || nahiye === null || nahiye === undefined) notComplete = false;
        if (fari === '' || fari === null || fari === undefined) notComplete = false;
        if (ghate === '' || ghate === null || ghate === undefined) notComplete = false;
        if (mafroozi === '' || mafroozi === null || mafroozi === undefined) notComplete = false;
        if (!notComplete) modalMessage.innerHTML = 'پر کردن تمامی فیلد ها اجباری است'
        else {
            if (siMap.siCommand.currentCommand) {

                siMap.siCommand.currentCommand.stepshandler({
                    cms: cms,
                    bakhsh: bakhsh,
                    asli: asli,
                    nahiye: nahiye,
                    fari: fari,
                    ghate: ghate,
                    mafroozi: mafroozi,
                }, 'apply', 0)

            }

        }
    }, false)

}