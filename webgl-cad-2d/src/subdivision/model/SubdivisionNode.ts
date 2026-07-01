import type{Vec2}from'../../cad/core/types';
export interface SubdivisionNode{id:string;x:number;y:number;connectedEdgeIds:string[];sourceEntityIds:string[];toleranceCluster:{representative:Vec2;memberCount:number}}
