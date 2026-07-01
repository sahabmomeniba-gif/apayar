import { Collection, Feature } from "ol";
import { Interaction, Snap } from "ol/interaction";
import { snapTypeName } from "./SnapTypes";


export default class CustomSnaps extends Snap {
    constructor(option, siMap) {
        super(option);
        this.collection = new Collection;
        this.sourceCollection = new Collection;
        this.siMap = siMap
        this.init()
    }
    init() {
        this.siMap.map.on('pointermove', mapBrowserEvent => {
            if (!this.siMap.siSnap.active) return true
            const result = this.snapTo(mapBrowserEvent.pixel, mapBrowserEvent.coordinate, mapBrowserEvent.map);
            if (this.onSnapped) {
                // console.log(result)
                this.onSnapped(result)
            }
            return true
        })
    }
    getType() {
        return this.name;
    }
    refresh(entity) {
        // console.log('is it refreshed?')
        this.removeSnapFeature(entity);
        entity.calcVertex = false;
    }
    addSnapFeature(feature) {
        // this.addFeature(feature)
    }
    removeSnapFeature(feature) {
        // this.collection.forEach(snapFeature => {
        //     console.log(this.name)
        //     if(this.name != snapTypeName.intersection){
        //         console.log(this.name)
        //         if(snapFeature.get('sourceFeature') == feature){
        //             this.source_.removeFeature(snapFeature)
        //         }
        //     }
        //     else{
        //         if(snapFeature.get('intersectFeature1') == feature || snapFeature.get('intersectFeature2') == feature){
        //             this.source_.removeFeature(snapFeature)
        //             this.allFeatureSource.removeFeature(feature)
        //         }
        //     }
        // });
    }
    removeSnapsStyles() {
        if (this.styleFeature) {
            this.siMap.modify.removeFeature(this.styleFeature);
            // this.styleFeature = undefined;
            if (this.lineStyleFeature) {
                this.siMap.modify.removeFeature(this.lineStyleFeature);
                // this.lineStyleFeature = undefined;
            }
        }
    }
    changeActive() {
        if (!this.snapActive) {
            // console.log(this)
            this.snapActive = true
            return
        }
        if (this.snapActive) {
            this.snapActive = false
            if (this.name === snapTypeName.parallel) {
                this.reset();
                this.markerCollection.getArray().forEach(feature => this.siMap.modify.removeFeature(feature))
            }
            return
        }
    }
    active() {
        if (!this.active) {
            this.active = true
        }
    }
    disable() {
        if (this.active) {
            this.active = false
        }
    }
    cleanStyles() {
        if (this.styleFeature) {
            this.siMap.modify.removeFeature(this.styleFeature);
            // this.styleFeature = undefined;
        }
    }
}