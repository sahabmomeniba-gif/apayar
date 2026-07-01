import type{SubdivisionDocument}from'../subdivision/model/SubdivisionDocument';
import{BoundaryGraphBuilder}from'../subdivision/services/BoundaryGraphBuilder';
import{PolygonCandidateBuilder}from'../subdivision/services/PolygonCandidateBuilder';
import{BoundaryDetectorDefaults,type BoundaryDetectorSettings}from'../subdivision/services/GeometryNormalizer';
import type{BoundaryDetectionResult}from'../subdivision/services/BoundaryDetector';

/**
 * Pure, UI-independent entry point for subdivision boundary detection.
 * It can be imported by this CAD app, another frontend, a worker, or a Node pipeline.
 */
export function detectSubdivisionBoundaries(input:SubdivisionDocument,settings:BoundaryDetectorSettings={...BoundaryDetectorDefaults}):BoundaryDetectionResult{
 const segments=input.lines.flatMap(line=>line.normalizedSegments);
 const graph=new BoundaryGraphBuilder().build(segments,settings);
 const polygons=new PolygonCandidateBuilder().build(graph.nodes,graph.edges,settings);
 const document:SubdivisionDocument={...input,nodes:graph.nodes,edges:graph.edges,polygons,warnings:[...input.warnings,...graph.warnings]};
 return{document,settings:{...settings},stats:{lineCount:input.lines.length,segmentCount:segments.length,nodeCount:graph.nodes.length,edgeCount:graph.edges.length,polygonCount:polygons.length},warnings:document.warnings};
}

export type{BoundaryDetectionResult,BoundaryDetectorSettings};
