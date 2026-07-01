import { Feature } from "ol";
import { LineString } from "ol/geom";
import { Fill, Stroke, Style, Text } from "ol/style";
import { rotate } from "ol/transform";
import SiLine from "../SiLine";
import { SaObjectsType } from "./SaObjectsType";
import { calculateLineLablePosition } from '../../helpers/CalculateLabel'
import './style.css'
import { Modal } from "@material-ui/core";
import { oraLineTypes, oraUseCodes, saLineTypeList } from "../../initparams";
import { createTextStyle } from "../../helpers/GetTextStyle";
import { feature } from "@turf/turf";
import SiText from "../SiStaticText";
import { getCadColor, wcs_sideBarContents, wcs_sideBarContentsType } from "../SiMap";
import { Labeling, labelingEventsHandler } from "../../appStyle/sidebar/Labeling";
export default class SaLabel extends SiText {
    constructor(center, height, angle, options) {
        super('', center, height, angle, {...options, fontFamily: 'Arial, Helvetica, sans-serif' })
        this.name = 'sa_centriod'
        this.objectType = SaObjectsType.label
        this.label = ''
            // this.centriodType = options.centriodType ? options.centriodType : CentriodType.name
        this.useCase = options.useCase;
        this.samt = options.samt ? options.samt : ''
        this.ghate = options.ghate ? options.ghate : ''
        this.asli = options.asli ? options.asli : ''
        this.fari = options.fari ? options.fari : ''
        this.rights = options.rights ? options.rights : ''
        this.isAparteman = options.isAparteman != undefined ? options.isAparteman : true;
        this.stringLabel = options.stringLabel ? options.stringLabel : '';
        this.coolerChannel = options.coolerChannel ? options.coolerChannel : '';
        this.block = options.block ? options.block : '';
        this.sathNumber = options.sathNumber ? options.sathNumber : '';
        this.hasDocument = options.hasDocument != undefined ? options.hasDocument : false;
        this.epicType = undefined;
        this.refresh()
    }
    refresh() {
        this.createCode();
        if (this.isAparteman) {
            this.colorIndex = 2
        } else {
            this.colorIndex = 6
        }
        // this.changeColor(getCadColor(this.colorIndex))
        this.setCurrentStyle()
        this.render();
    }
    select() {
        // console.log(this)
        console.log(oraLineTypes.A266FF2A662E84b639DA.find(c => c.Code === this.useCase))
        if (this.selectable == false) return false
            // console.log('select')
            // console.log(this.selected)
        if (!this.selected) {
            this.selected = true;
            // if (this.siLayer.siMap.currentSelectedSaLabel) this.siLayer.siMap.currentSelectedSaLabel.deSelect()
            // this.siLayer.siMap.siSelect.removeSelectionSet()
            this.siLayer.siMap.siCommand.execCommand('escape')
            this.siLayer.siMap.currentSelectedSaLabel = this
            let sidebar = this.siLayer.siMap.getSiControl('wcs_sidebar')
                // console.log(sidebar)
            if (sidebar) {
                this.siLayer.siMap.setWcsSideBarContent(wcs_sideBarContentsType.labeling)
                sidebar.reShape()
                sidebar.element.getElementsByClassName('wcs_panel_content')[0].innerHTML = Labeling(this.siLayer.siMap, this)
                labelingEventsHandler(this.siLayer.siMap, sidebar.element.getElementsByClassName('wcs_panel_content')[0], this)
            }
            this.siLayer.siMap.siSelect.selectionSet_.push(this)
            this.setModifyPoint()
            this.updateToSiMapStorage()
            return true
        }
    }
    boxSelect() {
        if (this.selectable == false) return false
        this.selected = true;
        this.siLayer.siMap.siSelect.selectionSet_.push(this)
        this.setModifyPoint()
    }
    deSelect() {
        this.removeModifyPoint()
        this.setCurrentStyle()
        if (this.selected) {
            this.siLayer.siMap.siSelect.selectionSet_.remove(this)
            this.selected = false
            let sidebar = this.siLayer.siMap.getSiControl('wcs_sidebar')
            if (sidebar) {
                // this.siLayer.siMap.setWcsSideBarContent(wcs_sideBarContentsType.objectProperties)
                this.siLayer.siMap.currentSelectedSaLabel = undefined
                sidebar.element.getElementsByClassName('wcs_panel_content')[0].innerHTML = Labeling(this.siLayer.siMap, this)
                sidebar.reShape()
            }
        }
    }
    updateToSiMapStorage() {
        this.siLayer.siMap.storage.currentSaLabel = {
            useCase: this.useCase,
            ghate: this.ghate,
            samt: this.samt,
            asli: this.asli,
            fari: this.fari,
            rights: this.rights,
            isAparteman: this.isAparteman,
            stringLabel: this.stringLabel,
            coolerChannel: this.coolerChannel,
            block: this.block,
            sathNumber: this.sathNumber,
            hasDocument: this.hasDocument,
        }
    }
    updateFromSiMapStorage() {
        if (!this.siLayer.siMap.storage.currentSaLabel) return
        else {
            // console.log('???')
            this.useCase = this.siLayer.siMap.storage.currentSaLabel.useCase
            this.ghate = this.siLayer.siMap.storage.currentSaLabel.ghate
            this.samt = this.siLayer.siMap.storage.currentSaLabel.samt
            this.asli = this.siLayer.siMap.storage.currentSaLabel.asli
            this.fari = this.siLayer.siMap.storage.currentSaLabel.fari
            this.isAparteman = this.siLayer.siMap.storage.currentSaLabel.isAparteman
            this.stringLabel = this.siLayer.siMap.storage.currentSaLabel.stringLabel
            this.coolerChannel = this.siLayer.siMap.storage.currentSaLabel.coolerChannel
            this.block = this.siLayer.siMap.storage.currentSaLabel.block
            this.sathNumber = this.siLayer.siMap.storage.currentSaLabel.sathNumber
            this.hasDocument = this.siLayer.siMap.storage.currentSaLabel.hasDocument
            if (this.isAparteman) {
                this.changeLayer('3')
            }
            if (!this.isAparteman) {
                this.changeLayer('4')
            }
            this.refresh()
        }
    }
    changeLayer(layerName) {
        if (!layerName) return
        let newLayer = this.siLayer.siMap.layers.find(l => l.name === layerName)
        if (!newLayer) return
        this.siLayer.source.removeFeature(this);
        newLayer.source.addFeature(this)
            // console.log(newLayer.name)
        this.siLayer = newLayer
    }
    createCode() {
        let A = this.useCase ? `A${this.useCase}` : ''
        let G = this.ghate ? `G${this.ghate}` : ''
        let F = this.fari ? `F${this.fari}` : ''
        let P = this.asli ? `P${this.asli}` : ''
        let S = this.samt ? `S${this.samt}` : ''
        let V = this.coolerChannel ? `V${this.coolerChannel}` : ''
        let K = this.block ? `K=${this.block}=` : ''
        let Q = this.sathNumber ? `Q${this.sathNumber}` : ''
        let M = this.rights ? `M=${this.rights}=` : ''
        let H = this.hasDocument ? 'H' : ''
        if (this.stringLabel === '') {
            this.label = A + G + F + P + S + V + K + Q + M + H
            this.text = A + G + F + P + S
        } else {
            this.label = this.stringLabel
            this.text = this.stringLabel
        }
        this.render()
    }
    getData() {
        return this.label
    }
}