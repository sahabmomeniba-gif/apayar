import { Collection } from "ol";
import { Layer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorImageLayer from "ol/layer/VectorImage";
import VectorSource from "ol/source/Vector";
import * as uniqid from 'uniqid';
import { Mm2Px } from "../initparams";

import { EntityType, lineTypeType, lineWeightType, styleStatus } from './Entity'
import { mapActionsType } from "./SiActions";
import { getCadColor } from "./SiMap";
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer';
import { asArray } from "ol/color";
import { packColor } from 'ol/renderer/webgl/shaders';
const ControlType = {
    featureProperties: 'feature properties',
    textProperties: 'text properties',
    snapProperties: 'snapProperties',
    centriodProperties: 'centriodProperties',
    layerProperties: 'layerProperties'
}
export default class SiwebGlLayer {
    constructor(opt_options) {
        let options = opt_options ? opt_options : {};
        let exist = options.siMap.layers.find(l => options.name == l.name)
        if (exist) {
            return
        }
        // this.defaulColor = options.defaulColor ? options.defaulColor : 'rgba(12,65,200,1)'
        this.siMap = options.siMap
        this.colorIndex = options.colorIndex ? options.colorIndex : 7
        this.lineTypeIndex = 'countinus'
        this.lineWeightIndex = 'default'
        this.name = options.name ? options.name : this.siMap.layers.length
        this.title = options.title ? options.title : this.name
        this.id = options.id ? options.id : uniqid()
        this.map = options.siMap.map
        this.type = options.type
        this.notVisibleCollection = []
            // console.log(options)
        if (options.visible != undefined) {
            this.visible = options.visible
        } else {
            this.visible = true
        }
        this.frozen = options.frozen === true;
        // console.log(this.frozen)
        this.Texts = []
        this.process = options.process
        this.lazyCollections = new Collection;
        this.lazyLoad = options.lazyLoad === true;
        if (typeof this.lazyLoad != 'number') this.lazyLoad = 0;
        if (options.modifiable === undefined) {
            this.modifiable = true
        } else {
            this.modifiable = options.modifiable
        }
        this.styleProperties = {
            color: getCadColor(this.colorIndex),
            fillColor: options.fillColor ? options.fillColor : 'rgba(0,0,0,0)',
            lineWidth: options.lineWidth ? options.lineWidth : 2,
            lineDash: options.lineDash ? options.lineDash : [0, 0],
            shapeStyle: options.shapeStyle ? options.shapeStyle : 'circle',
            shapeRadius: options.shapeRadius ? options.shapeRadius : 4,
            fontSize: options.fontSize ? options.fontSize : '20px',
            fontFamily: options.fontFamily ? options.fontFamily : 'B-Nazanin',
            textWeight: options.textWeight ? options.textWeight : 'normal',
            textColor: options.textColor ? options.textColor : 'rgba(255,255,255,1)',
            textBackground: options.textBackground ? options.textBackground : 'rgba(0,0,0,1)',
        }
        this.shouldMapExtentToThis = options.shouldMapExtentToThis ? options.shouldMapExtentToThis : false
        this.source = new VectorSource({})
        this.shouldNotSnap = options.shouldNotSnap ? options.shouldNotSnap : false
        this.Layer = new WebGLLayer({
            source: this.source,
            zIndex: 1
        })
        if (this.visible) {
            this.siMap.map.addLayer(this.Layer)
        } else {

        }
        // this.Layer.on('postrender',e=>{
        //     console.log(e)
        // })
        // console.log(this.Layer.getUpdateWhileInteracting(),'layers')

        this.siMap.layers.push(this)
            // this.siMap.layerPropertiesControl.handleSelection()


        if (this.shouldMapExtentToThis && this.type !== 'text') {
            this.Layer.getSource().on('addfeature', e => {
                this.siMap.map.getView().fit(this.Layer.getSource().getExtent(), this.siMap.map.getSize())
                this.siMap.map.getView().setZoom(this.siMap.map.getView().getZoom() - 1)
            })
        }
        this.Layer.getSource().on('addfeature', e => {
            if (this.frozen) e.feature.selectable = false;
            if (!this.lazyLoad) {
                this.siMap.siActions.addMapAction([{
                    type: mapActionsType.addEntity,
                    entities: [e.feature]
                }])
            }
            if (e.feature.entityType != EntityType.text) {
                // this.siMap.siSnap.addFeature(e.feature)
            } else {
                if (e.feature.entityType === EntityType.text) {
                    // this.siMap.textCollectionSource.addFeature(e.feature)
                }
            }
        });
        this.Layer.getSource().on('removefeature', e => {
            if (e.feature.entityType != EntityType.text) {
                this.siMap.siSnap.removeFeature(e.feature)
            } else {
                if (e.feature.entityType === EntityType.text) {
                    this.siMap.textCollectionSource.removeFeature(e.feature)
                }
            }
        });
    }
    styleFunction() {}
    hide() {
        if (this.visible) this.visible = false;
        // console.log(this.source.getFeatures())
        this.siMap.map.removeLayer(this.Layer)
            // this.Layer.setSource(new VectorSource)
        this.siMap.siSelect.removeSelectionSet()
            // console.log(this.Layer.getSource())
    }
    show() {
        if (!this.visible) this.visible = true;
        // this.notVisibleCollection.forEach(entity=>{
        //     this.source.addFeature(entity);
        // })
        // this.Layer.setSource(this.source)
        // this.notVisibleCollection = []
        console.log(this.notVisibleCollection)
        if (this.notVisibleCollection.length === 0) this.siMap.map.addLayer(this.Layer)
        else {
            this.notVisibleCollection.forEach(entity => {
                this.source.addFeature(entity)
            })
            this.siMap.map.addLayer(this.Layer)
            this.notVisibleCollection = []
        }
        // console.log(this.Layer.getSource())
    }
    freeze() {
        if (!this.frozen) this.frozen = true;
        let entites = this.source.getFeatures()
        entites.forEach(entity => {
            entity.selectable = false;
            this.siMap.siSnap.removeFeature(entity);
            entity.changeOpacity(0.4)
                // entity.calcVertex = false;
        })
        this.siMap.siSelect.removeSelectionSet()
    }
    unFreeze() {
        if (this.frozen) this.frozen = false;
        let entites = this.source.getFeatures();
        entites.forEach(entity => {
            entity.selectable = true;
            entity.changeOpacity(1)
        })
    }
    removeSnaps() {
        // console.log('first1')
        this.shouldNotSnap = true;
        let entites = this.source.getFeatures();
        entites.forEach(entity => {
            // this.siMap.siSnap.removeFeature(entity);
            entity.calcVertex = false;
        })
    }
    addSnaps() {
        // console.log('first2')
        this.shouldNotSnap = false
    }
    addEntity(entity) {
        if (this.visible) this.source.addFeature(entity)
        else this.notVisibleCollection.push(entity)
    }
    getData() {
        let entites = []
        this.source.forEachFeature(feature => {
            entites.push(feature.getData())
        });
        return {
            N: this.name,
            C: this.colorIndex,
            E: entites,
            P: this.process
        }
    }
    changeColor(color) {
        this.styleProperties.color = color
        this.source.forEachFeature(entity => {
            if (entity.styleStatus.color === styleStatus.byLayer) {
                entity.changeColor(color)
            }
        })
    }
    changeLineWidth(value) {
        this.lineWeightIndex = value
            // console.log(value)
        this.source.forEachFeature(entity => {
            if (entity.lineWeightIndex === lineWeightType.byLayer) entity.changeLineWidth(lineWeightType.byLayer)
        })
    }

    changeLineType(value) {
        this.lineTypeIndex = value;
        this.source.forEachFeature(entity => {
            if (entity.lineTypeIndex === lineTypeType.byLayer) entity.changeLineType(lineTypeType.byLayer)
        })
    }
}

class WebGLLayer extends Layer {
    createRenderer() {
        return new WebGLVectorLayerRenderer(this, {
            fill: {
                attributes: {
                    color: function(entity) {
                        const color = asArray(getCadColor(entity.colorIndex) || '#eee');
                        color[3] = 0.85;
                        return packColor(color);
                    },
                    opacity: function() {
                        return 0.6;
                    },
                },
            },
            stroke: {
                attributes: {
                    color: function(entity) {
                        const color = [...asArray(getCadColor(entity.colorIndex) || '#eee')];
                        color.forEach((_, i) => (color[i] = Math.round(color[i] * 0.75))); // darken slightly
                        return packColor(color);
                    },
                    width: function() {
                        return 1.5;
                    },
                    opacity: function() {
                        return 1;
                    },
                },
            },
        });
    }
}