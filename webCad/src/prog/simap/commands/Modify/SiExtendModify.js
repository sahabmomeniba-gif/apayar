import {  Stroke, Style } from "ol/style";
import Command from "../Command";
import { selectEntities, selectEntityType, reapeatCondition, stepActionType} from "../CommandSteps";
import { EntityType } from "../../entities/Entity";

import VectorSource from "ol/source/Vector";
import SiPolyLine from "../../entities/SiPolyline";
import { Feature } from "ol";
import { getDefaultSelectFunction } from "../../helpers/GetDefaultStyles";
import { extend } from "ol/array";
import LineString from "ol/geom/LineString";
import { mapActionsType } from "../../entities/SiActions";

export default class SiExtendModify extends Command{
    constructor(option) {
        super(option)
        // this.siMap.mapInfo()
        this.name = 'extend'
        let allSource = new VectorSource({
            // features:this.siMap.getAllFeature()
        })
        this.steps = [new selectEntities(this,{
            type:selectEntityType.hoverClickSelect,
            hoverFeatures:allSource,
            clickFeatures:allSource,
            useCase:'extend'
        }),reapeatCondition()]
        this.steps[0].load();
        this.disableSnap();
        this.actionCollection = []
    }
    createSegmentsCollecion(){
        // let collection = new Collection
        let segments = this.siMap.getSegments();
        // console.log(segments,'command')
        // segments.forEach(segment => {
        //     console.log(segment,'cash')
        //     collection.push(segment)
        // });
        // console.log(collection,'collection')
        
        return segments
    }
    stepshandler(value,name,activeStep){
        if(name === stepActionType.notValid) return;
        switch (activeStep) {
            case 0:     
            // console.log(name,selectEntityType.shiftHover)
            switch (name) {
                case selectEntityType.click:
                        var entitySource = value.entity;
                        
                        
                        var extendPoints = entitySource.getExtendPoints();
                        // console.log(extendPoints)
                        
                        
                        var pointer = value.coordinate
                        var p1,p2,d1,d2;
                        var oldGeometry = entitySource.getGeometry().clone()
                        var coordinates = oldGeometry.getCoordinates()
                        if(extendPoints[0]){
                            p1 = extendPoints[0].getGeometry().getCoordinates();    
                            d1 = Math.hypot((pointer[1]-coordinates[0][1]),([pointer[0]-coordinates[0][0]]))           
                        }
                        if(extendPoints[1]){
                            p2 = extendPoints[1].getGeometry().getCoordinates(); 
                            d2 = Math.hypot((pointer[1]-coordinates[coordinates.length-1][1]),([pointer[0]-coordinates[coordinates.length-1][0]]))          
                        }
                        // if(!d1 && !d2) break;
                        // console.log(d1,d2)
                        // var coordinates = entitySource.getGeometry().clone().getCoordinates();
                        if((!d2 && d1) || (d1<d2)){
                            coordinates.shift()
                            coordinates = [extendPoints[0].getGeometry().getCoordinates(),...coordinates]
                            var newGeometry = new LineString(coordinates)
                            entitySource.setGeometry(
                                newGeometry
                                )
                            var action  = [{
                                type:mapActionsType.modify,
                                geometryCollection:[{
                                    entity:entitySource,
                                    oldGeometry:oldGeometry,
                                    newGeometry:newGeometry.clone()
                                }
                                ]
                            }]
                            this.siMap.siActions.addMapAction(action)
                            this.actionCollection.push(action)
                        }
                        //
                        if((d2 && !d1) || (d1>=d2)){
                            coordinates.pop()
                            coordinates = [...coordinates,extendPoints[1].getGeometry().getCoordinates()]
                            var newGeometry = new LineString(coordinates)
                            entitySource.setGeometry(
                                newGeometry
                                )
                            var action = [{
                                type:mapActionsType.modify,
                                geometryCollection:[
                                    {
                                        entity:entitySource,
                                        oldGeometry:oldGeometry,
                                        newGeometry:newGeometry.clone()
                                    }
                                ]
                            }]
                            this.siMap.siActions.addMapAction(action)
                            this.actionCollection.push(action)
                        }
                        // this.siMap.add
                        this.siMap.clearModify();
                        entitySource.setCurrentStyle();
                        this.siMap.siSnap.removeFeature(entitySource)
                        entitySource.calcVertex = false;
                        let allSource = new VectorSource;
                        this.siMap.getAllFeature().forEach(feature=>{
                            allSource.addFeature(feature)
                        })
                        this.steps[0].layer.setSource(allSource);
                        this.steps[0].clickSelect.features_.clear()
                        this.handleNext();
                        break;
                    case selectEntityType.hover:                  
                        var entitySource = value.entity;
                        // entitySource.setStyle(getDefaultSelectFunction());
                        var extendPoints = entitySource.getExtendPoints();
                        // console.log("🚀 ~ file: SiExtendModify.js ~ line 109 ~ SiExtendModify ~ stepshandler ~ extendPoints", extendPoints)
                        // console.log(extendPoints)
                        
                        
                        var p1,p2,d1,d2;
                        // if(!d1 && !d2) break;
                        // console.log(d1,d2)
                        // var pointer = this.siMap.getCursorPosition()
                        var pointer = value.coordinate
                        var coordinates = entitySource.getGeometry().getCoordinates()
                        if(extendPoints[0]){
                            p1 = extendPoints[0].getGeometry().getCoordinates();    
                            d1 = Math.hypot((pointer[1]-coordinates[0][1]),([pointer[0]-coordinates[0][0]]))           
                        }
                        if(extendPoints[1]){
                            p2 = extendPoints[1].getGeometry().getCoordinates(); 
                            d2 = Math.hypot((pointer[1]-coordinates[coordinates.length-1][1]),([pointer[0]-coordinates[coordinates.length-1][0]]))          
                        }
                        // console.log('d1',d1)
                        // console.log('d2',d2)
                        if((!d2 && d1) || (d1<d2)){
                            var feature = new Feature({
                                geometry:new LineString([extendPoints[0].getGeometry().getCoordinates(),entitySource.getGeometry().getCoordinates()[0]])
                            })  
                            feature.setStyle(getDefaultSelectFunction());
                            this.siMap.modify.addFeature(feature);
                        }
                        //
                        if((d2 && !d1) || (d1>=d2)){
                            
                                var feature = new Feature({
                                    geometry:new LineString([extendPoints[1].getGeometry().getCoordinates(),coordinates[coordinates.length-1]])
                                })
                                feature.setStyle(getDefaultSelectFunction());
                                this.siMap.modify.addFeature(feature);

                        }
                    break;
                    case selectEntityType.deselected:
                        this.siMap.clearModify();
                        value.setCurrentStyle()
                        break;
                            default:
                                break;
                            }
                    
                default:
                    break;
            }
        //         if(name === selectEntityType.click){
                    
                
            
        // }
    }
    onAbrot(){
        this.steps[0].disable();
        this.actionCollection.forEach(action=>{
            this.siMap.siActions.Actions.push(action)
        })    
        this.siMap.siActions.currentActionIndex+=this.actionCollection.length
    }
    onDone(){
        this.steps[0].disable();
        this.actionCollection.forEach(action=>{
            this.siMap.siActions.Actions.push(action)
        })    
        this.siMap.siActions.currentActionIndex+=this.actionCollection.length

    }
}


