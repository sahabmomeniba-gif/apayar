import { Stroke, Style } from "ol/style";
import LineString from "ol/geom/LineString";
import { SiText } from "../../entities/SiText";
import Command from "../Command";
import { getNumber, getPoint, getText, openModal, stepActionType } from "../CommandSteps";
import { Centriod, CentriodType, SA_Centriod } from "../../entities/Labels";
import SaLabel from "../../entities/Cadastal/SeperationApratemanLabel";
import SiLayer from "../../entities/SiLayer";
import { anchorType, stringType } from "../../entities/SiStaticText";

export default class AddSingelSALabel extends Command {
    constructor(option) {
        super(option)
        this.name = 'singelSaLabel'
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

        if (!this.siMap.storage.currentSaLabel) return
        if (!this.siMap.storage.currentSaLabel.useCase && !this.siMap.storage.currentSaLabel.stringLabel) return
        this.siMap.clearModify();
        this.handleSiCommandMessage(undefined);
        let apartemanLayer = this.siMap.layers.find(l => l.name === '3')
        if (!apartemanLayer) {
            apartemanLayer = new SiLayer({
                siMap: this.siMap,
                name: '3',
                colorIndex: 2,
            })
        }
        let othersLayer = this.siMap.layers.find(l => l.name === '4')
        if (!othersLayer) {
            othersLayer = new SiLayer({
                siMap: this.siMap,
                name: '4',
                colorIndex: 6,
            })
        }
        // console.log(this.siMap.storage.currentSaLabel.isAparteman)
        let label = new SaLabel(this.center, 0.1, 0, {
            layer: this.siMap.storage.currentSaLabel.isAparteman ? apartemanLayer : othersLayer,
            anchor: anchorType.mid_mid,
            stringType: stringType.normal,
            stringLabel: this.siMap.storage.currentSaLabel.stringLabel,
            colorIndex: this.siMap.storage.currentSaLabel.isAparteman ? 2 : 6,
            useCase: this.siMap.storage.currentSaLabel.useCase,
            samt: this.siMap.storage.currentSaLabel.samt,
            ghate: this.siMap.storage.currentSaLabel.ghate,
            asli: this.siMap.storage.currentSaLabel.asli,
            fari: this.siMap.storage.currentSaLabel.fari,
            rights: this.siMap.storage.currentSaLabel.rights,
            isAparteman: this.siMap.storage.currentSaLabel.isAparteman,
            coolerChannel: this.siMap.storage.currentSaLabel.coolerChannel,
            block: this.siMap.storage.currentSaLabel.block,
            sathNumber: this.siMap.storage.currentSaLabel.sathNumber,
            hasDocument: this.siMap.storage.currentSaLabel.hasDocument,
        })
    }
}