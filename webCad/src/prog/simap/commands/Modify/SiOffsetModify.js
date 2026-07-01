import {  Stroke, Style } from "ol/style";
import Command from "../Command";
import { selectEntities, selectEntityType, reapeatCondition, getNumber, getPoint, stepActionType} from "../CommandSteps";
import { EntityType } from "../../entities/Entity";

import VectorSource from "ol/source/Vector";
import SiPolyLine from "../../entities/SiPolyline";
import  _ from 'lodash'
import { isEqualPoint } from "../../helpers/equalPoint";
import { mapActionsType } from "../../entities/SiActions";
import SiLine from "../../entities/SiLine";
import LineString from "ol/geom/LineString";
import { Feature } from "ol";
import { cursorStyle } from "../../entities/SiMap";
import Polygon from "ol/geom/Polygon";
import { getDefaultSelectFunction } from "../../helpers/GetDefaultStyles";



export default class SiOffsetModify extends Command{
    constructor(option) {
        super(option)
        // this.siMap.mapInfo()
        this.name = 'offset'
        let vectorSource = new VectorSource({
            features:this.siMap.getAllEntitiesByType(EntityType.line)
        })
        this.steps = [new selectEntities(this,{
            type:selectEntityType.hoverClickSelect,
            hoverFeatures:vectorSource,
            clickFeatures:vectorSource,
            useCase:'offset'
        }),
        new getNumber(this,{gt:0}),
        new getPoint(this)
        ,reapeatCondition(3)]
        this.styleFeature.setStyle(
            new Style({
                stroke:new Stroke({
                    color:'rgba(213, 255, 5,1)',
                    lineDash:[10,15]
                }),
                width:5
            })
        )
        this.newOffSetStyle = [new Style({
            stroke:new Stroke({
                color:'#d9ff00ff',
                width:3
            })
        }),
        new Style({
            stroke:new Stroke({
                color:'#fbfbfbff',
                width:1
            })
        })
        ]
        this.steps[0].load();
        this.disableSnap();
        this.entities = []
        this.siMap.siCommand.handleSiCommandMessage('Select object to offset:')
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
        switch (activeStep) {
            case 0:     
            // console.log(name,selectEntityType.shiftHover)
            switch (name) {
                case selectEntityType.click:
                    this.entity = value.entity;
                    // this.siMap.siActions.activate()
                    // this.steps[0].disable();     
                    
                    // let vectorSource = new VectorSource
                    // this.steps[0].layer.setSource(vectorSource)
                    this.siMap.setCursorStyle(cursorStyle.command)
                    this.siMap.siCommand.handleSiCommandMessage('Enter Distance of offset or click start Point of distance:')
                    this.steps[0].disable()
                    this.entity.setSelectStyle(false)
                    this.handleNext()
                    break;
                    case selectEntityType.shiftHover:         
                        break;
                    case selectEntityType.deselected:
                        break;
                        case selectEntityType.hover:
                                break;
                        case  selectEntityType.shiftClick:
                            
                            default:
                                break;
                            }
                break;
            case 1:
                // EntityOffSet(this.entity,value,this.siMap,this); 
                
                if(name === 'singelClick') {
                    if(!this.DistStartPoint){
                        this.siMap.siCommand.handleSiCommandMessage('Enter Distance of offset or click end Point of distance:')
                        this.DistStartPoint = value
                    } 
                    else{
                        this.siMap.siCommand.handleSiCommandMessage('Specify point on side to offset')
                        this.dist = Math.hypot((value[1]-this.DistStartPoint[1]),(value[0]-this.DistStartPoint[0]))
                        this.DistStartPoint = undefined;
                        this.styleFeature.setGeometry(null);
                        this.handleNext()
                    } 
                }
                else{
                    this.dist = value
                    this.siMap.siCommand.handleSiCommandMessage('Specify point on side to offset')
                    this.handleNext()
                }
                break;
            case 2:
                // console.log(this.baseDistA,this.baseDistB)
                if(name === stepActionType.notValid){
                    if(value === 'm'){
                        this.multiOffset = true
                        this.baseDistA = this.dist;
                        this.baseDistB = this.dist;
                        let offsets = EntityOffSet(this.entity,this.dist,this.siMap,this);  
                        // console.log(offsets)
                        this.multiOffsetCenterA = [(offsets[0][1][0]+offsets[0][0][0])/2,(offsets[0][1][1]+offsets[0][0][1])/2]
                        this.multiOffsetCenterB = [(offsets[1][1][0]+offsets[1][0][0])/2,(offsets[1][1][1]+offsets[1][0][1])/2]
                        this.multiOffsetOriginA = [(offsets[0][1][0]+offsets[0][0][0])/2,(offsets[0][1][1]+offsets[0][0][1])/2]
                        this.multiOffsetOriginB = [(offsets[1][1][0]+offsets[1][0][0])/2,(offsets[1][1][1]+offsets[1][0][1])/2]
                        this.siMap.siCommand.handleSiCommandMessage(`Specify point on side to Multi Offset by Distance of`)
                    }
                    break;
                }
                if(!this.multiOffset){
                    let offsets = EntityOffSet(this.entity,this.dist,this.siMap,this);  
                    // console.log(offsets)
                    let centerA = [(offsets[0][1][0]+offsets[0][0][0])/2,(offsets[0][1][1]+offsets[0][0][1])/2]
                    let centerB = [(offsets[1][1][0]+offsets[1][0][0])/2,(offsets[1][1][1]+offsets[1][0][1])/2]
                    // console.log(centerA,centerB)
                    let distA = Math.hypot(centerA[1]-value[1],centerA[0]-value[0])
                    let distB = Math.hypot(centerB[1]-value[1],centerB[0]-value[0])
                    // console.log(distA,distB)
                    if(distA === distB) break
                    let structures = this.entity.getStructures()
                    let options = {layer:structures.siLayer}
                    let part1Entity,part2Entity;
                    let sourceCoordinates = this.entity.getGeometry().getCoordinates()
                    if(distB > distA){
                        if(sourceCoordinates.length > 2){
                            part1Entity = new SiPolyLine(offsets[0],options)
                        }
                        if(sourceCoordinates.length === 2){
                             part1Entity = new SiLine(offsets[0][0],offsets[0][1],options)              
                        }
                        part1Entity.styleStatus = structures.styleStatus
                        part1Entity.setStyle(this.entity.getEntityStyle())
                        this.steps[0].addEntity(part1Entity)
                        this.entities.push(part1Entity)
                    }
                    else{
                        if(sourceCoordinates.length > 2){
                            part2Entity = new SiPolyLine(offsets[1],options)
                        }
                        if(sourceCoordinates.length === 2){
                            part2Entity = new SiLine(offsets[1][0],offsets[1][1],options)              
                        }
                        part2Entity.styleStatus = structures.styleStatus
                        part2Entity.setStyle(this.entity.getEntityStyle())
                        this.steps[0].addEntity(part2Entity)
                        this.entities.push(part2Entity)
                    }
    
                        this.steps[0].disable();
                        this.siMap.siCommand.handleSiCommandMessage('Select object to offset:')
                        this.siMap.setCursorStyle(cursorStyle.select)
                        this.entity.setCurrentStyle()
                        this.handleNext()
                        this.siMap.clearModify()
                        this.steps[0].load();
                        break;
                }
                else{
                    let distA = Math.hypot(this.multiOffsetOriginA[1]-value[1],this.multiOffsetOriginA[0]-value[0])
                    let distB = Math.hypot(this.multiOffsetOriginB[1]-value[1],this.multiOffsetOriginB[0]-value[0])
                    // console.log(distA,distB)
                    if(distA === distB) break
                    if(distA < distB){
                        let offsetsA = EntityOffSet(this.entity,this.baseDistA,this.siMap,this); 
                        let centerA = [(offsetsA[0][1][0]+offsetsA[0][0][0])/2,(offsetsA[0][1][1]+offsetsA[0][0][1])/2]
                        let centerB = [(offsetsA[1][1][0]+offsetsA[1][0][0])/2,(offsetsA[1][1][1]+offsetsA[1][0][1])/2]
                        let distA = Math.hypot(this.multiOffsetCenterA[1]-centerA[1],this.multiOffsetCenterA[0]-centerA[0])
                        let distB = Math.hypot(this.multiOffsetCenterA[1]-centerB[1],this.multiOffsetCenterA[0]-centerB[0])
                        if(distA === distB) break;
                        let structures = this.entity.getStructures()
                        let options = {layer:structures.siLayer}
                        let part1Entity,part2Entity;
                        let sourceCoordinates = this.entity.getGeometry().getCoordinates()
                        if(distB > distA){
                            if(sourceCoordinates.length > 2){
                                part1Entity = new SiPolyLine(offsetsA[0],options)
                            }
                            if(sourceCoordinates.length === 2){
                                 part1Entity = new SiLine(offsetsA[0][0],offsetsA[0][1],options)              
                            }
                            part1Entity.styleStatus = structures.styleStatus
                            part1Entity.setStyle(this.entity.getEntityStyle())
                            this.steps[0].addEntity(part1Entity)
                            this.multiOffsetCenterA = [(offsetsA[0][1][0]+offsetsA[0][0][0])/2,(offsetsA[0][1][1]+offsetsA[0][0][1])/2]
                            this.entities.push(part1Entity)
                        }
                        else{
                            if(sourceCoordinates.length > 2){
                                part2Entity = new SiPolyLine(offsetsA[1],options)
                            }
                            if(sourceCoordinates.length === 2){
                                part2Entity = new SiLine(offsetsA[1][0],offsetsA[1][1],options)              
                            }
                            part2Entity.styleStatus = structures.styleStatus
                            part2Entity.setStyle(this.entity.getEntityStyle())
                            this.steps[0].addEntity(part2Entity)
                            this.multiOffsetCenterA = [(offsetsA[1][1][0]+offsetsA[1][0][0])/2,(offsetsA[1][1][1]+offsetsA[1][0][1])/2]
                            this.siMap.modify.removeFeature(this.part1Style)
                            this.siMap.modify.removeFeature(this.part2Style)
                            this.part1Style = undefined;
                            this.part2Style = undefined;
                            this.entities.push(part2Entity)
                        }
                        this.baseDistA += this.dist    
                        this.part1Style = undefined;
                        this.part2Style = undefined;
                        this.siMap.clearModify()
                        break;              
                    }
                    else{
                        let offsetsB = EntityOffSet(this.entity,this.baseDistB,this.siMap,this); 
                        let centerA = [(offsetsB[0][1][0]+offsetsB[0][0][0])/2,(offsetsB[0][1][1]+offsetsB[0][0][1])/2]
                        let centerB = [(offsetsB[1][1][0]+offsetsB[1][0][0])/2,(offsetsB[1][1][1]+offsetsB[1][0][1])/2]
                        let distA = Math.hypot(this.multiOffsetCenterB[1]-centerA[1],this.multiOffsetCenterB[0]-centerA[0])
                        let distB = Math.hypot(this.multiOffsetCenterB[1]-centerB[1],this.multiOffsetCenterB[0]-centerB[0])
                        if(distA === distB) break;
                        let structures = this.entity.getStructures()
                        let options = {layer:structures.siLayer}
                        let part1Entity,part2Entity;
                        let sourceCoordinates = this.entity.getGeometry().getCoordinates()
                        if(distB > distA){
                            if(sourceCoordinates.length > 2){
                                part1Entity = new SiPolyLine(offsetsB[0],options)
                            }
                            if(sourceCoordinates.length === 2){
                                 part1Entity = new SiLine(offsetsB[0][0],offsetsB[0][1],options)              
                            }
                            part1Entity.styleStatus = structures.styleStatus
                            part1Entity.setStyle(this.entity.getEntityStyle())
                            this.steps[0].addEntity(part1Entity)
                            this.multiOffsetCenterB = [(offsetsB[0][1][0]+offsetsB[0][0][0])/2,(offsetsB[0][1][1]+offsetsB[0][0][1])/2]
                            this.entities.push(part1Entity)
                        }
                        else{
                            if(sourceCoordinates.length > 2){
                                part2Entity = new SiPolyLine(offsetsB[1],options)
                            }
                            if(sourceCoordinates.length === 2){
                                part2Entity = new SiLine(offsetsB[1][0],offsetsB[1][1],options)              
                            }
                            part2Entity.styleStatus = structures.styleStatus
                            part2Entity.setStyle(this.entity.getEntityStyle())
                            this.steps[0].addEntity(part2Entity)
                            this.multiOffsetCenterB = [(offsetsB[1][1][0]+offsetsB[1][0][0])/2,(offsetsB[1][1][1]+offsetsB[1][0][1])/2]
                            this.entities.push(part2Entity)
                        }
                        this.baseDistB += this.dist  
                        this.part1Style = undefined;
                        this.part2Style = undefined;
                        this.siMap.clearModify()
                        break;
                    }
                    
                }
            default:
                    break;
            }
        //         if(name === selectEntityType.click){
                    
                
            
        // }
    }
    onMouseMove(value,mbe){
        if(this.activeStep === 1 && this.DistStartPoint){
            this.styleFeature.setGeometry(new LineString([this.DistStartPoint,value]));
            let dist = Math.hypot((value[1]-this.DistStartPoint[1]),(value[0]-this.DistStartPoint[0]))
            this.handleSiCommandMessage(undefined,`${Math.round(dist*1000)/1000}`)
        }
        if(this.activeStep ===2 && !this.multiOffset){
                    let offsets = EntityOffSet(this.entity,this.dist,this.siMap,this);  
                    // console.log(offsets)
                    let centerA = [(offsets[0][1][0]+offsets[0][0][0])/2,(offsets[0][1][1]+offsets[0][0][1])/2]
                    let centerB = [(offsets[1][1][0]+offsets[1][0][0])/2,(offsets[1][1][1]+offsets[1][0][1])/2]
                    // console.log(centerA,centerB)
                    let distA = Math.hypot(centerA[1]-value[1],centerA[0]-value[0])
                    let distB = Math.hypot(centerB[1]-value[1],centerB[0]-value[0])
                    // console.log(distA,distB)
                    // if(distA === distB) break
                    // let part1Entity,part2Entity;
                    let sourceCoordinates = this.entity.getGeometry().getCoordinates()
                    if(distB > distA){
                        if(!this.part1Style){
                            this.part1Style = new Feature({
                                geometry:new LineString(offsets[0])
                            })       
                        this.part1Style.setStyle(this.newOffSetStyle)
                        this.siMap.modify.addFeature(this.part1Style)
                        }
                        if(this.part2Style){
                            this.siMap.modify.removeFeature(this.part2Style)
                            this.part2Style = undefined
                        }
                    }
                    else{
                        if(!this.part2Style){
                            this.part2Style = new Feature({
                                geometry:new LineString(offsets[1])
                            })       
                            this.part2Style.setStyle(this.newOffSetStyle)
                        this.siMap.modify.addFeature(this.part2Style)
                        }
                        if(this.part1Style){
                            this.siMap.modify.removeFeature(this.part1Style)
                            this.part1Style = undefined
                        }
                    }
        }
        if(this.activeStep ===2 && this.multiOffset){
            let distA = Math.hypot(this.multiOffsetOriginA[1]-value[1],this.multiOffsetOriginA[0]-value[0])
            let distB = Math.hypot(this.multiOffsetOriginB[1]-value[1],this.multiOffsetOriginB[0]-value[0])
            if(distB > distA){
                this.handleSiCommandMessage(undefined,`${Math.round(this.baseDistA*1000)/1000}`)
                let offsetsA = EntityOffSet(this.entity,this.baseDistA,this.siMap,this); 
                let centerA = [(offsetsA[0][1][0]+offsetsA[0][0][0])/2,(offsetsA[0][1][1]+offsetsA[0][0][1])/2]
                let centerB = [(offsetsA[1][1][0]+offsetsA[1][0][0])/2,(offsetsA[1][1][1]+offsetsA[1][0][1])/2]
                let distA = Math.hypot(this.multiOffsetCenterA[1]-centerA[1],this.multiOffsetCenterA[0]-centerA[0])
                let distB = Math.hypot(this.multiOffsetCenterA[1]-centerB[1],this.multiOffsetCenterA[0]-centerB[0])
                if(distB > distA){
                    if(!this.part1Style){
                        this.part1Style = new Feature({
                            geometry:new LineString(offsetsA[0])
                        })       
                    this.part1Style.setStyle(this.newOffSetStyle)
                    this.siMap.modify.addFeature(this.part1Style)
                    }
                    if(this.part2Style){
                        this.siMap.modify.removeFeature(this.part2Style)
                        this.part2Style = undefined
                    }
                }
                else{
                    if(!this.part1Style){
                        this.part1Style = new Feature({
                            geometry:new LineString(offsetsA[1])
                        })       
                    this.part1Style.setStyle(this.newOffSetStyle)
                    this.siMap.modify.addFeature(this.part1Style)
                    }
                    if(this.part2Style){
                        this.siMap.modify.removeFeature(this.part2Style)
                        this.part2Style = undefined
                    }
                }

            }
            else{
                this.handleSiCommandMessage(undefined,`${Math.round(this.baseDistB*1000)/1000}`)
                let offsetsB = EntityOffSet(this.entity,this.baseDistB,this.siMap,this); 
                let centerA = [(offsetsB[0][1][0]+offsetsB[0][0][0])/2,(offsetsB[0][1][1]+offsetsB[0][0][1])/2]
                let centerB = [(offsetsB[1][1][0]+offsetsB[1][0][0])/2,(offsetsB[1][1][1]+offsetsB[1][0][1])/2]
                let distA = Math.hypot(this.multiOffsetCenterB[1]-centerA[1],this.multiOffsetCenterB[0]-centerA[0])
                let distB = Math.hypot(this.multiOffsetCenterB[1]-centerB[1],this.multiOffsetCenterB[0]-centerB[0])
                if(distB > distA){
                    if(!this.part2Style){
                        this.part2Style = new Feature({
                            geometry:new LineString(offsetsB[0])
                        })       
                    this.part2Style.setStyle(this.newOffSetStyle)
                    this.siMap.modify.addFeature(this.part1Style)
                    }
                    if(this.part1Style){
                        this.siMap.modify.removeFeature(this.part1Style)
                        this.part1Style = undefined
                    }
                }
                else{
                    if(!this.part2Style){
                        this.part2Style = new Feature({
                            geometry:new LineString(offsetsB[1])
                        })       
                    this.part2Style.setStyle(this.newOffSetStyle)
                    this.siMap.modify.addFeature(this.part2Style)
                    }
                    if(this.part1Style){
                        this.siMap.modify.removeFeature(this.part1Style)
                        this.part1Style = undefined
                    }
                }
            }
        }
    }
    onAbrot(){
        if(this.entity) this.entity.setCurrentStyle()
        this.steps[0].disable();
        this.siMap.siActions.addMapAction([
            {
            type:mapActionsType.addEntity,
            entities:this.entities
            },
        ])
    }
    onDone(){
        if(this.entity) this.entity.setCurrentStyle()
        this.steps[0].disable();
        this.siMap.siActions.addMapAction([
            {
            type:mapActionsType.addEntity,
            entities:this.entities
            },
        ])
    }
}



const EntityOffSet = (entity,dist,siMap,command)=>{
    // console.log(dist)
    switch (entity.entityType) {
        case EntityType.line:
            var coordinates = entity.getGeometry().getCoordinates();
            if(coordinates.length != 2) break;
            var angle = Math.atan2(coordinates[1][1]-coordinates[0][1],coordinates[1][0]-coordinates[0][0])
            var offSetLineA_coordinate = coordinates.map(coordinate=>{
                // console.log(coordinate)
                return ([coordinate[0]+dist*Math.cos(Math.PI/2+angle),coordinate[1]+dist*Math.sin(Math.PI/2+angle)])
            })
            var offSetLineB_coordinate = coordinates.map(coordinate=>{
                return ([coordinate[0]+dist*Math.cos(-Math.PI/2+angle),coordinate[1]+dist*Math.sin(-Math.PI/2+angle)])
            })
            // console.log(offSetLineA_coordinate)
            // console.log(offSetLineB_coordinate)
            // siMap.modify.addFeature(new Feature({
            //     geometry:new LineString(offSetLineA_coordinate)
            // }))
            // siMap.modify.addFeature(new Feature({
            //     geometry:new LineString(offSetLineB_coordinate)
            // }))
            return [offSetLineA_coordinate,offSetLineB_coordinate]
            break;
        default:
            break;
    }
}

