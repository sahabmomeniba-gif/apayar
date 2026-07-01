import NearestSnap from "./NearestSnap";
import EndPointSnap from "./EndPointSnap";
import MidPointSnap from "./MidPointSnap";
import IntersectionSnap from "./IntersectionSnap";
import { Collection } from "ol";
import { sample } from "@turf/turf";
import { snapTypeName } from "./SnapTypes";
import Entity, { EntityType } from "../../entities/Entity";
import { multipleExist } from "../../helpers/MultiParamsArrayCheck";
import DrawingSnap from "./DrawingSnap";
import PolarTracking from "./PolarTracking";
import NodeSnap from "./NodeSnap";
import ParallelSnap from "./ParallelSnap";

export default class SiSnap{
    constructor(siMap){
        this.siMap =siMap
        this.snapCollection = [];
        this.featureCollection = new Collection
        this.tolerance = 15;
        this.init()
        this.active = false
    }
    init(){
        this.snapCollection.push(
            new NearestSnap(this),
            new EndPointSnap(this),
            new MidPointSnap(this),
            new IntersectionSnap(this),
            new PolarTracking(this),
            new NodeSnap(this),
            new ParallelSnap(this)
            // new DrawingSnap(this)
        )
    }
    changeActive(name){
       let selectedSnap = this.snapCollection.find(snap=>snap.name === name)
       selectedSnap.changeActive()
    }
    addFeature(feature){
            // console.log(feature.entityType)
        // console.log(typeof feature.entityType)
            if(feature.entityType === EntityType.label) return
            // if(feature.entityType === EntityType.node) return
            if(feature.entityType === EntityType.text) return
            // console.log(multipleExist(feature.entityType,[EntityType.node,EntityType.label,EntityType.text]))
            // if(multipleExist(feature.entityType,[EntityType.label,EntityType.node,EntityType.text])) return
            // console.log(feature)
            feature.setVertexs()
            this.featureCollection.push(feature)
            this.snapCollection.forEach(snap => {
                switch (snap.getType()) {
                    case snapTypeName.nearest:
                        snap.sourceCollection.push({
                            entity:feature,
                            points:undefined
                        })
                        
                        break;
                    case snapTypeName.endpoint:
                        snap.sourceCollection.push({
                            entity:feature,
                            points:feature.getVertex().endPoints
                        })
                        break;
                    case snapTypeName.midPoint:
                        if(feature.entityType === EntityType.circle){
                            snap.sourceCollection.push({
                                entity:feature,
                                points:feature.getVertex().centerPoints
                            }); 
                            break;
                        }
                        snap.sourceCollection.push({
                            entity:feature,
                            points:feature.getVertex().midPoints
                        });
                        break;
                    case snapTypeName.intersection:
                        snap.sourceCollection.push({
                            entity:feature,
                            points:feature.getVertex().intersectPoints
                        })
                        break;
                    case snapTypeName.node:
                            // console.log(feature.getVertex())
                            snap.sourceCollection.push({
                                entity:feature,
                                points:feature.getVertex().nodePoint
                            })
                            break;
                    default:
                        break;
                }
                if(snap.onEntityAdd) snap.addSnapFeature(feature);
            });
    }
    refresh(feature){
        if(feature.entityType === EntityType.text) return
        this.snapCollection.forEach(snap => {
            if(snap.onEntityAdd) snap.refresh(feature)
        })
    }
    removeFeature(feature){
        if(feature.entityType === EntityType.text) return
        this.featureCollection.remove(feature)
        // console.log(this.snapCollection)
        this.snapCollection.forEach(snap => {
            // console.log(snap)
            // snap.sourceCollection.getArray().forEach(source=>{
            //         if(source.entity === feature)   snap.sourceCollection.remove(source)
            // })
            snap.removeSnapFeature(feature)
        });
    }
    changeFeature(feature){
        this.snapCollection.forEach(snap => {
            // console.log(snap)
            snap.removeSnapFeature(feature)
        });
        this.snapCollection.forEach(snap => {
            snap.addSnapFeature(feature)
        });
    }
    activate(){
        // console.log('snap activate')
            // console.log()
            let map = this.siMap.map;
            // console.log(map)
            // let str = ''
            this.snapCollection.forEach(snap => {
                // console.log(snap)
            
                if(snap.snapActive){
                    // console.log(snap.name)
                    // map.getInteractions().getArray().find(interaction => {
                    //     if(interaction === snap){
                    //         map.removeInteraction(snap)
                    //     }
                    //     });
                    // str+=' ' + snap.name
                    map.addInteraction(snap)
                }
            });
            this.active = true;
        //   console.log('active snap:',str)
    }
    disable(){
        
        // console.log('disable snap')
            let map = this.siMap.map;
            // let str = ''
            // console.log(this.snapCollection)
            this.snapCollection.forEach(snap => {
                // str+=' ' + snap.name
                            map.removeInteraction(snap)
            });
            this.active = false;
            // console.log(map.getInteractions())
            // console.log('disable snap:',str)
        
    }
} 