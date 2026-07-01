import {  Stroke, Style } from "ol/style";
import Command from "../Command";
import { selectEntities, selectEntityType, reapeatCondition, stepActionType} from "../CommandSteps";
import { EntityType } from "../../entities/Entity";

import VectorSource from "ol/source/Vector";
import SiPolyLine from "../../entities/SiPolyline";
import  _ from 'lodash'
import { isEqualPoint } from "../../helpers/equalPoint";
import { mapActionsType } from "../../entities/SiActions";
import SiLine from "../../entities/SiLine";


export default class SiTrimModify extends Command{
    constructor(option) {
        super(option)
        // this.siMap.mapInfo()
        this.name = 'trim'
        this.trimActions = []
        // this.segmentFeatures = this.createSegmentsCollecion();
        
        // let allSource = new VectorSource;
        // this.siMap.getAllFeature().forEach(feature=>{
        //     allSource.addFeature(feature)
        // })

        // this.segmentFeatures.forEach(segment => {
        //     vectorSource.addFeature(segment)
        // });
        let vectorSource = new VectorSource({
        })
        this.steps = [new selectEntities(this,{
            type:selectEntityType.hoverClickSelect,
            hoverFeatures:vectorSource,
            clickFeatures:vectorSource,
            useCase:'trim'
        }),reapeatCondition()]
        this.styleFeature.setStyle(
            new Style({
                stroke:new Stroke({
                    color:'rgba(213, 255, 5,1)',
                    lineDash:[10,15]
                }),
                width:5
            })
        )
        this.steps[0].load();
        this.disableSnap();
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
                    this.TrimSegment = value.entity    ;
                           
                    // this.steps[0].disable();     
                    EntityTrim(this.TrimSegment,this.siMap,this);  
                    let vectorSource = new VectorSource
                    this.steps[0].layer.setSource(vectorSource)
                    this.handleNext()
                    break;
                    case selectEntityType.shiftHover:
                        
                        break;
                    case selectEntityType.deselected:
                        // this.siMap.clearModify()
                        // var entitySource = value.get('entitySource');
                        // console.log(entitySource)
                        // entitySource.setCurrentStyle();
                        break;
                        case selectEntityType.hover:
                            // this.steps[0].currentEntitySource = value.entity.get('entitySource')
                            // console.log(value.entity.get('entitySource').getGeometry().getCoordinates())   
                            // var entitySource = value.get('entitySource');
                            // // console.log('2131xdc3q2tr')
                            // entitySource.setCurrentStyle();
                                break;
                        case  selectEntityType.shiftClick:
                            
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
        this.trimActions.forEach(action=>{
            this.siMap.siActions.Actions.push(action)
        })    
        this.siMap.siActions.currentActionIndex+=this.trimActions.length
    }
    onDone(){
        this.steps[0].disable();
        this.trimActions.forEach(action=>{
            this.siMap.siActions.Actions.push(action)
        })    
        this.siMap.siActions.currentActionIndex+=this.trimActions.length
    }
}



const EntityTrim = (feature,siMap,command)=>{
    let entity = feature.get('entitySource');
    let TrimIndex = feature.get('index');
    let part1  = [];
    let part2 = [];
    let coordinates= entity.getSegmentsCoordinates();
    let sourceCoordinates= entity.getGeometry().getCoordinates();
    for (let index = 0; index < coordinates.length; index++) {
        // let coordinates = entity.getGeometry().getCoordinates();
        let isSourceCoordinates = false;
        sourceCoordinates.forEach(coordinate => {
                if(isEqualPoint(coordinates[index],coordinate,1000)){
                    isSourceCoordinates = true;
                }
                
            });
            if(isSourceCoordinates){
                if(index < TrimIndex){   
                    part1.push(coordinates[index])
                }
                if(index > TrimIndex){
                    part2.push(coordinates[index])
                }
                if(index === TrimIndex){
                    part1.push(coordinates[index])
                }
            }
            else{
                if((index === TrimIndex) ){
                    part1.push(coordinates[TrimIndex]);
                }
                if((index === TrimIndex+1) ){
                    part2.push(coordinates[TrimIndex+1]);
                }
            }
    }
    // part1.push(coordinates[TrimIndex]);
    // part2 = [coordinates[TrimIndex+1],...part2]
    // for (let index = 1; index < part1.length-1; index++) {
    //         // intersectInLine.splice(sindex,1);
    //         let isSourceCoordinates = false;
    //         sourceCoordinates.forEach(coordinate => {
    //             if(_.isEqual(part1[index],coordinate)){
    //                 console.log(coordinate,part1)
    //                 isSourceCoordinates = true;
    //             }
    //         });
    //         if(!isSourceCoordinates)   {
    //             part1.splice(index,1) 
    //         }
    // }
    // // console.log(part2,'part2')
    // for (let index = 1; index < part2.length-1; index++) {     
    //         // intersectInLine.splice(sindex,1);
    //         let isSourceCoordinates = false;
    //         sourceCoordinates.forEach(coordinate => {
    //             if(_.isEqual(part2[index],coordinate)){
    //                 console.log(coordinate,part2)
    //                 isSourceCoordinates = true;
    //             }
    //         });
    //         if(!isSourceCoordinates){
    //             part2.splice(index,1) 

    //         }    
    // }
    let structures = entity.getStructures()
    let options = {layer:structures.siLayer}
    let part1Entity,part2Entity;
    // intersectInLine.splice(sindex,1);
    for (let index = 0; index < part1.length-1; index++) {
        if(isEqualPoint(part1[index],part1[index+1],10000)) part1.splice(index,1);
    }
    for (let index = 0; index < part2.length-1; index++) {
        if(part2[index+1]) if(isEqualPoint(part2[index],part2[index+1],10000)) part2.splice(index,1);
    }
    // console.log(part1)
    // console.log(part2)
    switch (entity.entityType) {
        case EntityType.line:
            if(part1.length>1){         
               if(sourceCoordinates.length > 2){
                   part1Entity = new SiPolyLine(part1,options)
               }
               if(sourceCoordinates.length === 2){
                    part1Entity = new SiLine(part1[0],part1[1],options)              
               }
               part1Entity.setStyle(entity.getStyle())
                part1Entity.styleStatus = structures.styleStatus
            }
            if(part2.length>1){         
                if(sourceCoordinates.length > 2){
                    part2Entity = new SiPolyLine(part2,options)
                }
                if(sourceCoordinates.length === 2){
                    part2Entity = new SiLine(part2[0],part2[1],options)              
                }
                part2Entity.setStyle(entity.getStyle())
                part2Entity.styleStatus = structures.styleStatus
            }
            break;
            default:
                break;    
            }
    
    entity.remove();
    entity.siLayer.siMap.clearModify();
    let actionEntites = []
    if(part1Entity){
        var extent = part1Entity.getGeometry().getExtent();
        siMap.getAllFeatureInExtent(extent).forEach(entity=>{
            entity.setVertexs()
            // entity.createSegments()
        })
        actionEntites.push(part1Entity)
    }
    if(part2Entity){
        var extent = part2Entity.getGeometry().getExtent();
        siMap.getAllFeatureInExtent(extent).forEach(entity=>{
            entity.setVertexs()
        })
        actionEntites.push(part2Entity)
    }
    // if(!siMap.siActions.active) siMap.siActions.activate()
    let trimAction = [
        {type:mapActionsType.removeEntity,
            entities:[entity]},
        {
        type:mapActionsType.addEntity,
        entities:actionEntites
        }
        ]
    siMap.siActions.addMapAction(trimAction)
    command.trimActions.push(trimAction)
}

