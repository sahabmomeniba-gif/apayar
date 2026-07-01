import { Collection, Feature } from 'ol';
import Event from 'ol/events/Event'
import Polygon from 'ol/geom/Polygon';
import Interaction from 'ol/interaction/Interaction';
import { Fill, Stroke, Style } from 'ol/style';
import Entity, { EntityType, ModifyType } from '../../entities/Entity';



const SelectEventType = {
    SELECT: 'select',
    SELECTEND: 'selectend',
};

class SelectEvent extends Event {
    constructor(type, selected, selectionSet, mapBrowserEvent) {
        super(type);
        this.selected = selected;
        this.selectionSet = selectionSet;
        this.mapBrowserEvent = mapBrowserEvent;
    }
}

class SiSelect extends Interaction {
    constructor(siMap) {
        super()
            // const options = opt_options ? opt_options : {};
        this.siMap = siMap
        this.siMap.map.addInteraction(this)
        this.active = true
        this.selectionSet_ = new Collection;
        this.textSet_ = new Collection;
        this.labelCollection_ = new Collection;
        this.hitToTolorance_ = 10;
        this.cursorFeature_ = new Feature;
        this.drawBoxStart = false;
        this.drawBoxEnd = false;
        this.drawBoxStartCoordinates = undefined;
        this.onModifyEntites = undefined
        this.onModifyPoint = undefined
        this.boxFeature = new Feature
        let style = new Style({
            fill: new Fill({
                color: 'rgba(10, 168, 47,0.5)'
            }),
            stroke: new Stroke({
                lineDash: [5, 5],
                width: 2,
                color: 'rgba(255,255,255,1)'
            })
        })
        this.boxFeature.setStyle(style)

        // this.siMap.featuresPropertiesControl.handleSelection();
    }
    activate() {
        if (!this.active) {
            this.setActive(true)
            this.active = true
        }
    }
    setOnModifyEntites(collection) {
        this.onModifyEntites = collection
    }
    getOnModifyEntites() {
        return this.onModifyEntites
    }
    setOnModifyPoint(point) {
        this.onModifyPoint = point
    }
    getOnModifyPoint() {
        return this.onModifyPoint
    }
    getAllSelectionSet() {
        let set = new Collection
            // console.log('w13')
        this.selectionSet_.forEach(entity => {
            // console.log("🚀 ~ file: SiSelect2.js ~ line 78 ~ SiSelect ~ getAllSelectionSet ~ entity", entity)
            // console.log()
            set.push(entity)
        })
        this.textSet_.forEach(entity => {
            set.push(entity)
        })
        this.labelCollection_.forEach(entity => {
            set.push(entity)
        })
        if (this.currentLabel) set.push(this.currentLabel)
        return set
    }
    getSelectionSet() {
        return this.selectionSet_
    }
    getTextSet() {
        return this.textSet_
    }
    disable() {
        if (this.active) {
            this.setActive(false)
            this.active = false
                // this.siMap.siSelect.setOnModifyPoint(undefined)
                // this.siMap.siSelect.setOnModifyEntites(undefined)
        }
    }
    getSiLayer(feature, type) {
        switch (type) {
            case 'vector':
                return feature.get('entity')
                    // break;
            case 'text':
                return this.siMap.layers.find(l => l.name == feature.get('layerName'))
                    // break;
            default:
                break;
        }
        return
    }
    handleEvent(mapBrowserEvent) {
        // if(mapBrowserEvent.type != 'pointermove') console.log(mapBrowserEvent)
        if (mapBrowserEvent.type === 'click') {
            let map = mapBrowserEvent.map;
            if (!this.drawBoxStart) {
                let hit = false
                map.forEachFeatureAtPixel(mapBrowserEvent.pixel, feature => {
                    // console.log(feature)
                    // if(feature.length)
                    if (feature.get('modifyType')) {
                        if (!hit) {
                            hit = true
                            this.dispatchEvent(
                                new SelectEvent(
                                    SelectEventType.SELECT,
                                    feature,
                                    this.getSelectionSet(),
                                    mapBrowserEvent
                                )
                            );
                            return true
                        }
                    }
                    if (!hit) {
                        if (feature.entityType) {
                            if (!feature.selected && feature.siLayer.visible) {
                                if (feature.select(false)) {
                                    hit = true
                                        // this.siMap.featuresPropertiesControl.handleSelection()
                                        // this.siMap.textsPropertiesControl.handleSelection()
                                    let sideBar = this.siMap.getSiControl('wcs_sidebar')
                                    if (sideBar) sideBar.handleSelect()
                                    this.dispatchEvent(
                                        new SelectEvent(
                                            SelectEventType.SELECT,
                                            feature,
                                            this.getSelectionSet(),
                                            mapBrowserEvent
                                        )
                                    );
                                    return true
                                }
                            }
                        }
                    }
                }, {
                    hitTolerance: this.hitToTolorance_
                })
                if (!hit) {
                    this.drawBoxStart = true
                    this.drawBoxStartCoordinates = mapBrowserEvent.coordinate
                    this.siMap.modify.addFeature(this.boxFeature)
                    return true
                }
            } else {
                this.drawBoxStart = false
                if (this.boxFeature.getGeometry() === undefined || this.boxFeature.getGeometry() === null) {
                    this.siMap.modify.removeFeature(this.boxFeature)
                    return true
                }
                const extent = this.boxFeature.getGeometry().getExtent();
                let selectedFeatures = []
                this.siMap.layers.forEach(layer => {
                    let source = layer.source
                    let features = source.getFeaturesInExtent(extent)
                        .filter((feature) => feature.getGeometry().intersectsExtent(extent));
                    // console.log(features.length)     
                    features.forEach(feature => {
                        selectedFeatures.push(feature)
                    });
                })
                let shouldRunModifyPoint;
                // console.log(selectedFeatures)
                if (selectedFeatures.length <= 30) {
                    shouldRunModifyPoint = true
                } else {
                    shouldRunModifyPoint = false
                }
                selectedFeatures.forEach(feature => {
                    if (feature.entityType) {
                        if (feature.siLayer.visible) feature.boxSelect(true, shouldRunModifyPoint)
                    }
                });

                this.siMap.modify.removeFeature(this.boxFeature)
                this.drawBoxStartCoordinates = undefined
                this.boxFeature.setGeometry(null)
                let sideBar = this.siMap.getSiControl('wcs_sidebar')
                    // console.log(sideBar)
                if (sideBar) sideBar.handleSelect()
                    // this.siLayer.siMap.siCommand.handleSiCommandMessage(undefined,undefined)
                return true
            }
        }
        if (mapBrowserEvent.type === 'pointermove') {
            if (this.drawBoxStart) {
                let point = mapBrowserEvent.coordinate
                let coords = [this.drawBoxStartCoordinates, [point[0], this.drawBoxStartCoordinates[1]],
                    point, [this.drawBoxStartCoordinates[0], point[1]], this.drawBoxStartCoordinates
                ]
                this.boxFeature.setGeometry(new Polygon([coords]))
            }
            return true
        }
        if (mapBrowserEvent.type === 'pointerdrag') {
            if (this.drawBoxStart) {
                let point = mapBrowserEvent.coordinate
                let coords = [this.drawBoxStartCoordinates, [point[0], this.drawBoxStartCoordinates[1]],
                    point, [this.drawBoxStartCoordinates[0], point[1]], this.drawBoxStartCoordinates
                ]
                this.boxFeature.setGeometry(new Polygon([coords]))
            }
            return true
        }
        return true
    }
    removeSelectionSet() {
        this.selectionSet_.forEach(feature => {
            // console.log(feature)
            if (feature)
                feature.deSelect(false)
        });
        this.textSet_.forEach(feature => {
            if (feature)
                feature.deSelect(false)
        });
        this.labelCollection_.forEach(feature => {
            if (feature)
                feature.deSelect(false)
        });
        if (this.currentLabel) this.currentLabel.deSelect(false)
        this.currentLabel = null;
        this.selectionSet_ = new Collection
        this.textSet_ = new Collection
        this.labelCollection_ = new Collection
            // this.siMap.featuresPropertiesControl.handleSelection(true)
            // this.siMap.textsPropertiesControl.handleSelection(true)
            // console.log(this.siMap.getControlElement('wcs_sidebar'))
        let sideBar = this.siMap.getSiControl('wcs_sidebar')
        if (sideBar) sideBar.handleSelect()
    }



}

export const SiSelectInit2 = (siMap) => {
    siMap.siSelect = new SiSelect(siMap)
    siMap.siSelect.on('selectend', e => {})
    siMap.siSelect.on('select', e => {

        if (e.selected.get('modifyType')) {
            //  siMap.siSelect.disable()
            // siMap.featuresPropertiesControl.removeCurrentVertex()
            let type = e.selected.get('modifyType')
            let target = e.selected.get('targetFeature')
                // console.log(e)
            siMap.siSelect.setOnModifyPoint(e.selected)
            siMap.siSelect.setOnModifyEntites([target])
            switch (type) {
                case ModifyType.translatePoint:

                    siMap.siCommand.execCommand('move')

                    //  let translate = new SiTranslate({
                    //    siMap:siMap,
                    //    ModifyPoint:e.selected
                    //  })
                    //  siMap.map.addInteraction(translate)
                    //  translate.on('translatestart',e=>{
                    //    siMap.siSelect.disable()
                    //  })
                    //  translate.on('translateend',e=>{
                    //   siMap.siSelect.activate()
                    //   siMap.map.removeInteraction(translate)
                    //   siMap.featuresPropertiesControl.handleSelection(false)
                    //   siMap.textsPropertiesControl.handleSelection(false)
                    //   siMap.siSnap.changeFeature(target)
                    //   siMap.siSelect.setOnModifyEntites([])
                    //  })
                    break;
                case ModifyType.rotatePoint:
                    siMap.siCommand.execCommand('rotate')
                        //   console.log('on rotate')
                        //  let rotate = new SiRotate({
                        //    siMap:siMap,
                        //    ModifyPoint:e.selected
                        //  })
                        //  siMap.map.addInteraction(rotate)
                        //  rotate.on('rotate start',e=>{

                    //    siMap.siSelect.disable()
                    //  })
                    //  rotate.on('rotate end',e=>{
                    //   siMap.featuresPropertiesControl.handleSelection(false)
                    //   siMap.textsPropertiesControl.handleSelection(false)
                    //   siMap.siSelect.activate()
                    //   siMap.map.removeInteraction(rotate)
                    //   siMap.siSnap.changeFeature(target)
                    //   siMap.siSelect.setOnModifyEntites([])
                    //  })
                    break
                case ModifyType.scalePoint:
                    siMap.siCommand.execCommand('scale')
                        //  let scale = new SiScale({
                        //    siMap:siMap,
                        //    ModifyPoint:e.selected
                        //  })
                        //  siMap.map.addInteraction(scale)
                        //  scale.on('scale start',e=>{
                        //   console.log(e)
                        //    siMap.siSelect.disable()
                        //  })
                        //  scale.on('scale end',e=>{
                        //   console.log(e)
                        //   siMap.siSelect.activate()
                        //   siMap.map.removeInteraction(scale)
                        //   siMap.siSnap.changeFeature(target)
                        //   siMap.siSelect.setOnModifyEntites([])
                        //  })
                    break
                case ModifyType.endPoint:
                    siMap.siCommand.execCommand('stretchend')
                        //  let endPoint = new SiEndPointModify({
                        //    siMap:siMap,
                        //    ModifyPoint:e.selected
                        //  })
                        //  siMap.map.addInteraction(endPoint)
                        //  endPoint.on('modifystart',e=>{
                        //   console.log(e)
                        //    siMap.siSelect.disable()
                        //  })
                        //  endPoint.on('modifyend',e=>{
                        //   console.log(e)
                        //   siMap.siSelect.activate()
                        //   siMap.map.removeInteraction(endPoint)
                        //   siMap.siSnap.changeFeature(target)
                        //   siMap.siSelect.setOnModifyEntites([])
                        //  })
                    break;
                case ModifyType.midPoint:
                    siMap.siCommand.execCommand('stretchmid')
                        //  let midPoint = new SiMidPointModify({
                        //    siMap:siMap,
                        //    ModifyPoint:e.selected
                        //  })
                        //  siMap.map.addInteraction(midPoint)
                        //  midPoint.on('modifystart',e=>{
                        //   console.log(e)
                        //    siMap.siSelect.disable()
                        //  })
                        //  midPoint.on('modifyend',e=>{
                        //   console.log(e)
                        //   siMap.siSelect.activate()
                        //   siMap.map.removeInteraction(midPoint)
                        //   siMap.siSelect.setOnModifyEntites([])
                        //   // siMap.siSnap.changeFeature(target)
                        //  })
                    break
                default:
                    break;
            }
        }
    })
}

export default SiSelect