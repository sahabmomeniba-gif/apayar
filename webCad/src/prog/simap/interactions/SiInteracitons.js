import { Interaction } from "ol/interaction";
import { reapeatCondition } from "../commands/CommandSteps";
import { EntityType } from "../entities/Entity";


export class SiInteraction extends Interaction {
    constructor(options) {
        super()
        this.siMap = options.siMap
        this.active = false
        this.activeCommand = undefined;
        this.entitySearcherTelorance = 10;
        this.maxEntity = 50;
        // this.siMap.map.addInteraction(this);
    }

    handleEvent(mapBrowserEvent) {
        // if(this.currentPixel && mapBrowserEvent.type === 'pointermove'){
        //     console.log(Math.hypot(mapBrowserEvent.pixel[1]-this.currentPixel[1],mapBrowserEvent.pixel[0] -this.currentPixel[0]))
        //     if(Math.hypot(mapBrowserEvent.pixel[1]-this.currentPixel[1],mapBrowserEvent.pixel[0] -this.currentPixel[0]) === 0){
        //         console.log('snaped?')
        //     }
        // }
        this.currentPixel = mapBrowserEvent.pixel
        if (!this.activeCommand) {
            return true
        }
        // console.log(this.activeCommand)
        // if(mapBrowserEvent.type === 'click'){
        //         mapBrowserEvent.preventDefault()
        //         // console.log(mapBrowserEvent.coordinate)
        //         this.activeCommand.onSingelClick(mapBrowserEvent.coordinate, mapBrowserEvent)   
        //         this.activeCommand.steps[this.activeCommand.activeStep].onSingelClick(mapBrowserEvent.coordinate, mapBrowserEvent)
        //         return true      
        // }
        if (mapBrowserEvent.type === 'pointerdown') {
            mapBrowserEvent.preventDefault()
                // console.log(mapBrowserEvent.coordinate)
            if (mapBrowserEvent.originalEvent.button != 1) {
                this.activeCommand.onSingelClick(mapBrowserEvent.coordinate, mapBrowserEvent)
                this.activeCommand.steps[this.activeCommand.activeStep].onSingelClick(mapBrowserEvent.coordinate, mapBrowserEvent)
                return true
            }
        }
        if (mapBrowserEvent.type === 'pointermove') {
            // this.step.pointerMove(mapBrowserEvent.coordinate,mapBrowserEvent)
            this.activeCommand.onMouseMove(mapBrowserEvent.coordinate, mapBrowserEvent)
            this.activeCommand.steps[this.activeCommand.activeStep].onMouseMove(mapBrowserEvent.coordinate, mapBrowserEvent)
            let center = mapBrowserEvent.coordinate
            let currentExtent = [center[0] - this.entitySearcherTelorance, center[1] - this.entitySearcherTelorance, center[0] + this.entitySearcherTelorance, center[1] + this.entitySearcherTelorance]
                // console.time('first')
            let entites = this.siMap.getAllFeatureInExtent(currentExtent);
            // console.timeEnd('first')
            // console.log(entites.length)
            // console.log(this.maxEntity)
            if (entites.length < this.maxEntity) {
                entites.forEach(entity => {
                    // console.log(entity)
                    if (!entity.entityType) return
                    if (!entity.calcVertex) {
                        // console.log(entity.siLayer.shouldNotSnap)
                        if (entity.entityType != EntityType.text && !entity.siLayer.shouldNotSnap) {
                            this.siMap.siSnap.addFeature(entity)
                            entity.calcVertex = true;
                        } else {
                            if (entity.entityType === EntityType.text) {
                                this.siMap.textCollectionSource.addFeature(entity)
                            }
                        }
                    }
                });

            }
            return true
        }
        if (mapBrowserEvent.type === 'dblclick') {
            this.activeCommand.onDoubleClick(mapBrowserEvent.coordinate, mapBrowserEvent)
            this.activeCommand.steps[this.activeCommand.activeStep].onDoubleClick(mapBrowserEvent.coordinate, mapBrowserEvent)
            if (this.activeCommand.steps[this.activeCommand.activeStep + 1] === reapeatCondition) {
                this.activeCommand.commandEnd()
            }
            return true
        }
        // if (pointerMove(mapBrowserEvent)) {
        //     if(this.onMove)  this.step.onMove(mapBrowserEvent.coordinate, mapBrowserEvent)

        // }
        return true
    }
    activate(step) {
        // console.log('siInteraction activate')
        this.siMap.map.addInteraction(this);
        this.activeCommand = step;
        this.siMap.siSnap.activate();
        this.siMap.disableSelect()
            // this.siMap.siSelect.removeSelectionSet()
    }
    disable() {
        let siMap = this.siMap
        this.siMap.siSelect.removeSelectionSet()
        siMap.map.removeInteraction(this);
        this.activeCommand = undefined;
        siMap.siSnap.disable();
        setTimeout(function() {
            siMap.activeSelect()
        }, 300);

    }
}