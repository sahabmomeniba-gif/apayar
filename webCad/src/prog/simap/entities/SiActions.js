import Event from 'ol/events/Event'
import { Interaction } from 'ol/interaction';

export const MapActionsEventType = {
    UNDO:'UNDO',
    REDO:'REDO',
    REJECTUNDO:'REJECTUNDO',
    REJECTREDO:'REJECTREDO'
  };

class MapActionsEvents extends Event {
    constructor(type,prvsAction , currentAction) {
      super(type);
      this.prvsAction = prvsAction;
      this.currentAction = currentAction;
    }
  }
export default class SiActions{
    constructor(siMap){
        this.siMap = siMap;
        this.Actions = [];
        this.currentActionIndex =-1;
        this.active = true
    }
    activate(){
        // console.log('activate')
        if (!this.active) this.active = true
    }
    disable(){
        if (this.active) this.active = false
    }
    getActions(){
        return this.Actions
    }
    getCurrentActionIndex(){
        return this.currentActionIndex
    }
    addMapAction(actions){
        // console.log(actions)
        // console.log('action')
        this.Actions.length = this.currentActionIndex+1
        this.Actions = [...this.Actions,actions]
        this.currentActionIndex++
    }
    //geometries
    undo(){
        // console.log(this.Actions,this.currentActionIndex)
        if(!this.active) return
        let prvsAction = this.Actions[this.currentActionIndex];
        if(!prvsAction){
            this.siMap.map.dispatchEvent(
                new MapActionsEvents(
                    MapActionsEventType.REJECTUNDO,
                    '',
                    ''
                )
                );
            return
        } 
        prvsAction.forEach(action=>{
            // console.log(action)
            switch (action.type) {
                case mapActionsType.addEntity:
                    action.entities.forEach(entity => {
                        entity.remove();
                    });
                break;
                case mapActionsType.removeEntity:
                    // console.log(prvsAction)
                    // console.log(action)
                    action.entities.forEach(entity => {
                        if(!entity.siLayer.source.hasFeature(entity)){
                            entity.siLayer.lazyLoad = true
                            entity.calcVertex = false
                            entity.siLayer.source.addFeature(entity)
                            entity.siLayer.lazyLoad = false
                        }
                        else{
                        }
                    });
                    break;
                case mapActionsType.modify:
                    action.geometryCollection.forEach(item=>{
                        var entity = item.entity;
                        entity.setGeometry(item.oldGeometry);
                    })
                    break;
                default:
                    return;
            }
        })   
        this.siMap.map.dispatchEvent(
            new MapActionsEvents(
                MapActionsEventType.UNDO,
                this.Actions[this.currentActionIndex],
                this.Actions[this.currentActionIndex-1]
            )
            );
        this.currentActionIndex--
    }
    redo(){
        // console.log(this.Actions,this.currentActionIndex)
        if(!this.active) return
        let nextAction = this.Actions[this.currentActionIndex+1];        
        if(!nextAction) return
        nextAction.forEach(action=>{
            // console.log(action)
            switch (action.type) {
                case mapActionsType.addEntity:
                        action.entities.forEach(entity=>{
                            if(!entity.siLayer.source.hasFeature(entity)){
                                entity.siLayer.lazyLoad = true
                                entity.calcVertex = false
                                entity.siLayer.source.addFeature(entity)
                                entity.siLayer.lazyLoad = false
                            }
                        })
                    break;
                case mapActionsType.removeEntity:
                    // console.log(prvsAction)
                    action.entities.forEach(entity=>{
                        entity.siLayer.source.removeFeature(entity)
                    })
                    break;
                case mapActionsType.modify:
                    action.geometryCollection.forEach(item=>{
                        var entity = item.entity;
                        entity.setGeometry(item.newGeometry);
                    })
                    break;
                        
                default:
                    return;
            }
        })
        this.siMap.map.dispatchEvent(
            new MapActionsEvents(
                MapActionsEventType.REDO,
                this.Actions[this.currentActionIndex],
                this.Actions[this.currentActionIndex+1]
            )
            );
        this.currentActionIndex++
    }
}
export const mapActionsType = {
    modify:'modify',
    addEntity:'addEntity',
    removeEntity:'removeEntity',
}
