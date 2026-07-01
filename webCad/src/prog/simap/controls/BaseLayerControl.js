import 'ol/ol.css';
import { Control } from 'ol/control';
import baseElement from './BaseElement';
import FeatureProperties from './Menu/FeatureProperties';
import BaseLayerProperties from './Menu/BaseLayerProperties';


class BaseLayersControl extends Control {
    constructor(opt_options) {
        const options = opt_options || {};
        super({
            element: baseElement(),
        });
        this.siMap = options.siMap
        const element = BaseLayerProperties({
            title: 'Base Layers',
            control: this
        })
        this.element.appendChild(element)
        this.element.style.visibility = 'hidden'
        this.open = false;
        this.currentBaseLayer = this.siMap.baseLayers[0]
        this.controlEvents()
        if (options.shouldHide != undefined) {
            this.shouldHide = options.shouldHide
        } else {
            this.shouldHide = false
        }
    }
    controlEvents() {
        let exitControl = this.element.getElementsByClassName('exit')[0]
        exitControl.addEventListener('click', e => {
                this.handleOpen()
                if (this.label.selected) {
                    this.label.selected = false
                    this.siMap.clearModify()
                }
            },
            false)
        let selectedBaseLayerControl = this.element.getElementsByClassName('select-baseLayer')[0]
        selectedBaseLayerControl.addEventListener('change', e => {
            this.currentBaseLayer = this.siMap.baseLayers[e.target.value]
        }, false)
        let addBaseLayerControl = this.element.getElementsByClassName('AddBaseLayer')[0]
        addBaseLayerControl.addEventListener('click', e => {
            this.siMap.setBaseLayer(this.currentBaseLayer.source)
            this.handleSelection()
        }, false)
        let removeBaseLayerControl = this.element.getElementsByClassName('RemoveBaseLayer')[0]
        removeBaseLayerControl.addEventListener('click', e => {
            this.siMap.removeBaseLayer()
            this.handleSelection()
        }, false)
    }

    show() {
        // console.log(this.element)
        if (!this.open) {
            if (this.shouldHide == true) {
                return
            }
            this.element.style.visibility = ''
            this.open = true
        }
    }
    hide() {
        if (this.open) {
            this.element.style.visibility = 'hidden'
            this.open = false
        }
    }
    handleOpen() {
        if (this.open) {
            this.hide()
        } else {
            this.show()
        }
    }
    handleRotateNorth() {
        this.getMap().getView().setRotation(0);
    }
    handleSelection(removeCurrentFeature) {

        const element = BaseLayerProperties({
            title: 'Base Layers',
            control: this
        })
        this.element.removeChild(this.element.lastChild)
        this.element.appendChild(element)
        this.controlEvents()
    }
    getCurrentSelection() {
        return this.currentSelection
    }
}

export default BaseLayersControl