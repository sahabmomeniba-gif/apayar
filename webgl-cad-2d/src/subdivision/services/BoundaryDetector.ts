import type{SubdivisionDocument}from'../model/SubdivisionDocument';import{BoundaryDetectorDefaults,type BoundaryDetectorSettings}from'./GeometryNormalizer';import{detectSubdivisionBoundaries}from'../../appayarHelpers/boundaryDetector';
export interface BoundaryDetectionResult{document:SubdivisionDocument;settings:BoundaryDetectorSettings;stats:{lineCount:number;segmentCount:number;nodeCount:number;edgeCount:number;polygonCount:number};warnings:string[]}
/** @deprecated Import detectSubdivisionBoundaries from appayarHelpers instead. */
export class BoundaryDetector{constructor(public settings:BoundaryDetectorSettings={...BoundaryDetectorDefaults}){}detect(input:SubdivisionDocument):BoundaryDetectionResult{return detectSubdivisionBoundaries(input,this.settings);}}
