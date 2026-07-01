import fs from 'node:fs';import { DxfImporter } from '../src/cad/import/DxfImporter';
const file=process.argv[2];if(!file)throw Error('Pass a DXF path');const result=new DxfImporter().import(fs.readFileSync(file,'utf8'));
const counts=result.entities.reduce<Record<string,number>>((a,e)=>(a[e.type]=(a[e.type]||0)+1,a),{});
if(!result.entities.length||!result.layers.length)throw Error('Importer returned an empty scene');
if(result.entities.some(e=>!Number.isFinite(e.bounds.minX)||!Number.isFinite(e.bounds.maxY)))throw Error('Non-finite entity bounds');
console.log(JSON.stringify({entities:result.entities.length,layers:result.layers.length,counts,warnings:result.warnings},null,2));
