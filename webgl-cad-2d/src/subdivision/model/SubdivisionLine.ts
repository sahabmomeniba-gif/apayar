import type{Vec2}from'../../cad/core/types';
export interface NormalizedSegment{id:string;start:Vec2;end:Vec2;sourceLineId:string;sourceEntityId:string;layerName:string;sourceType:string}
export interface SubdivisionLine{id:string;sourceEntityId:string;sourceHandle?:string|number;layerId:string;layerName:string;geometryType:string;start:Vec2;end:Vec2;vertices?:Vec2[];normalizedSegments:NormalizedSegment[];style?:Record<string,unknown>;rawMetadata:Record<string,unknown>}
