import type{Bounds,Vec2}from'../../cad/core/types';
export interface SubdivisionPolygon{id:string;edgeIds:string[];vertices:Vec2[];area:number;perimeter:number;centroid:Vec2;bounds:Bounds;layerNames:string[];sourceEntityIds:string[];confidence:number;warnings:string[];isOuterBoundaryCandidate:boolean;isHoleCandidate:boolean;debugMetadata:Record<string,unknown>}
