
import { Collection } from 'ol';
import { singleClick } from 'ol/events/condition';
import Event from 'ol/events/Event'
import { Modify } from 'ol/interaction';
import Interaction from 'ol/interaction/Interaction';
import SiRotate from '../modify/SiRotate';
import SiScale from '../modify/SiScale';
import SiTranslate from '../modify/SiTranslate';



const SelectEventType = {
    SELECT: 'select',
    SELECTEND:'selectend',
    COPY:'copy',
    PASTE:'paste'
  };

class SelectEvent extends Event {
    constructor(type, feature, siLayer,modifyPoint,deselected, mapBrowserEvent) {
      super(type);
      this.feature = feature;
      this.deselected = deselected;
      this.siLayer = siLayer;
      this.modifyPoint = modifyPoint;
      this.mapBrowserEvent = mapBrowserEvent;
    }
  }

class SiSelect extends Interaction{
    constructor(opt_options) {
        super()
        const options = opt_options ? opt_options : {};
        // this.on;
        // this.once;
        // this.un;
        this.siMap = options.siMap;
        // this.isDefault= true;
        this.siMap.map.addInteraction(this)
        this.active = true
        this.condition_ = singleClick;
        this.hitTolerance_ = 0;
        this.feature_ = undefined;
        this.modifyPoint_ = undefined;
        this.featureLayer_ = undefined;
        this.siLayer_ = undefined;
        this.deselected_ = undefined;

    }
    activate(){
      // console.log('its work on active')
      if(!this.active){
        this.siMap.map.addInteraction(this)
        this.active = true
      }
    }
    disable(){
      // console.log('its work on disable')
      if(this.active){
        this.siMap.map.removeInteraction(this)
        this.active = false
      }
      }
    getSiLayer(feature,type){
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
    setStyle(selected,deselected,siModify){
        // console.log(selected[0][0])
        if(!selected[0] && !deselected[0]){
          return
        }
        if(selected[0][0] && !selected[0][3]){
          // selected[0][2].setFeatureStyle(selected[0][0],'onSelect')
        }
        if(selected[0][3]){
          let modifySelectStyle = siModify.StyleFunction(selected[0][3],'onSelect')
          selected[0][3].setStyle(modifySelectStyle)
          // selected[0][2].setFeatureStyle(selected[0][0],'onSelect')
        }
        else{
          if(deselected[0][0] && deselected[0][0] != selected[0][0]){
            // deselected[0][2].setFeatureStyle(deselected[0][0],'')
          }
        }
    }
    handleEvent(mapBrowserEvent) {

        if (!this.condition_(mapBrowserEvent)) {

            return true;
          }
          const map = mapBrowserEvent.map;
          let deselected = [];
          let selected = [];
          let siModify;
          this.siMap.layers.forEach(layer => {
                if(layer.type === 'modify'){
                    siModify = layer
                }
            });
          siModify = this.siMap.mapModify
          this.siMap.layers.forEach(layer => {
              // console.log(layer)
              var Texts = layer.Texts
              Texts.forEach(text => {
                var polygonGeometry = text.siText.getGeometry(); 
                var coords = mapBrowserEvent.coordinate || mapBrowserEvent.coordinate_
                if(polygonGeometry.intersectsCoordinate(coords)){
                  selected.push([text.siText,layer.Layer,layer,undefined])
                  this.feature_ = selected[0][0]
                  this.siLayer_  = selected[0][2]
                  this.featureLayer_ = selected[0][1]
                  this.modifyPoint_ = undefined
                  deselected.push([this.feature_,this.featureLayer_,this.siLayer_,this.modifyPoint_ ])
                  if(siModify){
                    selected[0][1].setZIndex(0)
                    siModify.cleanModify()
                    // console.log(selected[0][2].modifable)
                    if(selected[0][2].modifiable){
                      siModify.addModifyForFeature(selected[0][0],'text')
                    }
                }
                }
              });
          });
          // let textLayer = this.siMap.layers.find(l => l.name == 'text layer');
          // if(textLayer){
          //     textLayer.frameLayer.getSource().getFeatures().forEach(textFrame => {
          //         var polygonGeometry = textFrame.getGeometry();
          //         var coords = mapBrowserEvent.coordinate || mapBrowserEvent.coordinate_
          //         if(polygonGeometry.intersectsCoordinate(coords)){
          //             selected.push([textFrame,textLayer.frameLayer,textLayer,undefined])
          //             this.feature_ = selected[0][0]
          //             this.siLayer_  = selected[0][2]
          //             this.featureLayer_ = selected[0][1]
          //             this.modifyPoint_ = undefined
          //             deselected.push([this.feature_,this.featureLayer_,this.siLayer_,this.modifyPoint_ ])
          //             if(siModify){
          //               selected[0][1].setZIndex(0)
          //               siModify.cleanModify()
          //               // console.log(selected[0][2].modifable)
          //               if(selected[0][2].modifiable){
          //                 siModify.addModifyForFeature(selected[0][0],selected[0][2].type)
          //               }
          //           }
          //         }
          //     });
          // }
          if(selected.length == 0){
            map.forEachFeatureAtPixel(
                mapBrowserEvent.pixel,
                (feature,layer)=>{
                    selected.push([feature,layer])
                }
              );
            if(selected.length === 0){
                 if(this.feature_){
                   deselected.push([this.feature_,this.featureLayer_,this.siLayer_,this.modifyPoint_ ])
                   selected.push([undefined,undefined,undefined,undefined])
                   this.deselected_ = deselected
                 }
                 this.feature_ = undefined
                 this.siLayer_  = undefined
                 this.featureLayer_ = undefined
                 this.modifyPoint_ = undefined
                 if(siModify){
                    siModify.cleanModify()
                  }
            }
            else{
                let selectedFeature;
                let selectedLayer;
                let selectedsiLayer;
                let selectedModifyPoint;
                let siLayer;
                selected.forEach(select => {
                    siLayer  = this.siMap.layers.find(l => l.name == select[0].get('layerName'))
                    if(siLayer && siLayer.type === 'modify'){
                        deselected.push([this.feature_,this.featureLayer_,this.siLayer_,this.modifyPoint_ ])
                        selectedModifyPoint = select[0]
                        selectedFeature = selectedModifyPoint.get('targetFeature')
                        selectedLayer = select[1]
                        selectedsiLayer = selectedFeature.siLayer
                    }
                });
                if(!selectedFeature){
                    deselected.push([this.feature_,this.featureLayer_,this.siLayer_,this.modifyPoint_ ])
                    selectedFeature = selected[0][0]
                    selectedLayer = selected[0][1]
                    selectedsiLayer = selected[0][0].siLayer
                    selectedModifyPoint = undefined
                    if(siModify){
                        selectedLayer.setZIndex(0)
                        siModify.cleanModify()
                        // console.log(selectedsiLayer)
                        if(selectedsiLayer.modifiable){
                          // console.log(selectedsiLayer.modifiable)
                          siModify.addModifyForFeature(selectedFeature,selectedsiLayer.type)
                        }
                    }
                }
                this.feature_ = selectedFeature
                this.siLayer_  = selectedsiLayer
                this.featureLayer_ = selectedLayer
                this.modifyPoint_ = selectedModifyPoint
                selected = []
                selected.push([selectedFeature,selectedLayer,selectedsiLayer,selectedModifyPoint])
            }
          }

        this.setStyle(selected,deselected,siModify)
        if (selected.length > 0 ) {
            this.dispatchEvent(
              new SelectEvent(
                SelectEventType.SELECT,
                this.feature_,
                this.siLayer_,
                this.modifyPoint_,
                deselected,
                mapBrowserEvent
              )
            );
          }
        if(selected.length === 0){
          // console.log(selected,deselected)
        this.dispatchEvent(
            new SelectEvent(
                SelectEventType.SELECTEND,
                this.feature_,
                this.siLayer_,
                this.modifyPoint_,
                deselected,
                mapBrowserEvent
            )
            );
    }
          return true;
    }

}

export const SiSelectInit = (siMap)=>{
    siMap.siSelect = new SiSelect({
        siMap: siMap
    })
    siMap.siSelect.on('selectend', e => {
    })
    siMap.siSelect.on('select', e => {
      //  console.log(e)
       if( siMap.onSelect) {
           siMap.onSelect(e?.feature?.values_?.entity,e);
       }
      if(e.siLayer=== 'text layer'){
        let textId = e.feature.get('textID')
        let siText  = e.siLayer.Texts.find(l => l.id == textId).siText
        siMap.Params.selectedText = siText
        // console.log(textId)
      }
      if(e.modifyPoint){
          if(e.modifyPoint.get('modifyType') === 'translate'){
              let mapTranslate = new SiTranslate({
                      siMap:siMap,
                      ModifyPoint:e.modifyPoint
                  })
                  siMap.map.addInteraction(mapTranslate)
                  mapTranslate.on('translating',e=>{


                  })
                  mapTranslate.once('translatestart',e=>{
                    // console.log(e)
                  })
                  mapTranslate.on('translateend',e=>{
                    siMap.map.removeInteraction(mapTranslate)
                  })
          }
          if(e.modifyPoint.get('modifyType') === 'rotate'){
              let mapRotate =  new SiRotate({
                siMap:siMap,
                ModifyPoint:e.modifyPoint
              })
              siMap.map.addInteraction(mapRotate)
              mapRotate.on('rotate end',e=>{
                siMap.map.removeInteraction(mapRotate)
              })
          }
          if(e.modifyPoint.get('modifyType') === 'scale'){
              let mapScale =  new SiScale({
                siMap:siMap,
                ModifyPoint:e.modifyPoint
            })
              siMap.map.addInteraction(mapScale)
              mapScale.on('scale end',e=>{
                siMap.map.removeInteraction(mapScale)
              })
          }
          if(e.modifyPoint.get('modifyType') === 'modify'){
              // console.log(e)
              let featureCollection = new Collection
              featureCollection.push(e.feature)
              let mapModify = new Modify({
                features:featureCollection
              })
              siMap.map.addInteraction(mapModify)
              mapModify.on('modifystart',e=>{
                siMap.mapModify.cleanModify()
                // siMap.activeDefaultInteractions()
              })
              mapModify.on('modifyend',e=>{
                  // console.log(e)
                  siMap.map.removeInteraction(mapModify)
              })
          }
      }
  })
}

export default SiSelect
