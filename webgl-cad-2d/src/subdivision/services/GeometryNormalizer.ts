import type{CadEntity,Vec2}from'../../cad/core/types';import type{NormalizedSegment}from'../model/SubdivisionLine';
export interface BoundaryDetectorSettings{endpointTolerance:number;gapClosingTolerance:number;intersectionTolerance:number;minEdgeLength:number;minPolygonArea:number;duplicatePolygonTolerance:number;curveSegments:number;includeOuterBoundaryCandidates:boolean}
export const BoundaryDetectorDefaults:BoundaryDetectorSettings={endpointTolerance:.01,gapClosingTolerance:.01,intersectionTolerance:.01,minEdgeLength:.001,minPolygonArea:.01,duplicatePolygonTolerance:.01,curveSegments:48,includeOuterBoundaryCandidates:false};
export const distance=(a:Vec2,b:Vec2)=>Math.hypot(b[0]-a[0],b[1]-a[1]);
export function normalizeEntity(entity:CadEntity,lineId:string,settings:BoundaryDetectorSettings):NormalizedSegment[]{
 const layerName=entity.source?.layer||entity.layerId.replace('layer:',''),sourceType=entity.source?.type||entity.type,points:Vec2[]=[];let closed=false;
 if(entity.type==='line')points.push(entity.start,entity.end);
 else if(entity.type==='polyline'||entity.type==='polygon'||entity.type==='hatch'){points.push(...entity.vertices);closed=entity.closed;}
 else if(entity.type==='arc'||entity.type==='circle'){let a=entity.type==='arc'?entity.startAngle:0,b=entity.type==='arc'?entity.endAngle:Math.PI*2;if(b<a)b+=Math.PI*2;const count=Math.max(8,Math.ceil(settings.curveSegments*(b-a)/(Math.PI*2)));for(let i=0;i<=count;i++){const q=a+(b-a)*i/count;points.push([entity.center[0]+Math.cos(q)*entity.radius,entity.center[1]+Math.sin(q)*entity.radius]);}closed=entity.type==='circle';}
 const out:NormalizedSegment[]=[];for(let i=1;i<points.length;i++)if(distance(points[i-1],points[i])>=settings.minEdgeLength)out.push({id:`${lineId}:s${i-1}`,start:points[i-1],end:points[i],sourceLineId:lineId,sourceEntityId:entity.id,layerName,sourceType});
 if(closed&&points.length>2&&distance(points[points.length-1],points[0])>=settings.endpointTolerance&&distance(points[points.length-1],points[0])>=settings.minEdgeLength)out.push({id:`${lineId}:s${out.length}`,start:points[points.length-1],end:points[0],sourceLineId:lineId,sourceEntityId:entity.id,layerName,sourceType});return out;
}
