import { Stroke, Style } from "ol/style";
import LineString from "ol/geom/LineString";
import { SiText } from "../../entities/SiText";
import Command from "../Command";
import { getNumber, getPoint, getText, openModal, stepActionType } from "../CommandSteps";
import { Centriod, CentriodType, SA_Centriod } from "../../entities/Labels";
import './style.css'

export default class AddSALabel extends Command {
    constructor(option) {
        super(option)
        this.name = 'salabel'
        this.steps = [new getPoint(this)]
        this.coordinates = []
        this.textString = ''
        this.handleSiCommandMessage(' محل برچسب را انتخاب کنید')
            // this.endPoint = undefined
    }
    stepshandler(value, name, activeStep) {
        if (name === stepActionType.notValid) return;
        // console.log(value,name,activeStep)
        switch (activeStep) {
            case 0:
                this.center = value;
                this.handleNext()
                break;
            default:
                break;
        }
    }

    onMouseMove(point, mapBrowserEvent) {
            switch (this.activeStep) {
                case 0:
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

        let label = new SA_Centriod(this.center[0], this.center[1], {
            layer: this.siMap.activeLayer,
            labelRadius: 3
        })
        label.select()
        let wcs_sidebar = this.siMap.getSiControl('wcs_sidebar');
        if (wcs_sidebar) wcs_sidebar.handleSelect();
        label.createCode()
        label.render()

        // this.siMap.zoomToExtent(text.getGeometry().getExtent(),-5)
        // this.siText.changeText(this.textString)

    }
}