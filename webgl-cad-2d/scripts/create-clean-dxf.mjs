import fs from 'node:fs';import path from 'node:path';
const [input,output]=process.argv.slice(2);if(!input||!output)throw Error('Usage: node create-clean-dxf.mjs input.dxf output.dxf');
const source=fs.readFileSync(input,'utf8'),newline=source.includes('\r\n')?'\r\n':'\n',lines=source.split(/\r\n|\r|\n/),pairs=[];
for(let i=0;i+1<lines.length;i+=2)pairs.push({code:lines[i].trim(),rawCode:lines[i],value:lines[i+1].trim(),rawValue:lines[i+1]});
const banned=new Set(['TEXT','MTEXT','ATTRIB','ATTDEF']),styleCodes=new Set(['6','48','62','370','420','440']),out=[];let section='',table='';
const push=p=>out.push(p);
for(let i=0;i<pairs.length;){const p=pairs[i];
  if(p.code==='0'&&p.value==='SECTION'&&pairs[i+1]?.code==='2'){section=pairs[i+1].value;push(p);push(pairs[i+1]);i+=2;continue;}
  if(p.code==='0'&&p.value==='ENDSEC'){section='';table='';push(p);i++;continue;}
  if(section==='TABLES'&&p.code==='0'&&p.value==='TABLE'&&pairs[i+1]?.code==='2'){table=pairs[i+1].value;push(p);push(pairs[i+1]);i+=2;continue;}
  if(section==='TABLES'&&p.code==='0'&&p.value==='ENDTAB'){table='';push(p);i++;continue;}
  if((section==='ENTITIES'||section==='BLOCKS')&&p.code==='0'&&!['ENDSEC','BLOCK','ENDBLK','SEQEND'].includes(p.value)){
    const block=[p];i++;while(i<pairs.length&&pairs[i].code!=='0')block.push(pairs[i++]);if(banned.has(p.value))continue;for(const q of block)if(!styleCodes.has(q.code))push(q);continue;
  }
  if(section==='TABLES'&&table==='LAYER'&&p.code==='0'&&p.value==='LAYER'){
    const block=[p];i++;while(i<pairs.length&&pairs[i].code!=='0')block.push(pairs[i++]);let hasColor=false,hasType=false;for(const q of block){if(q.code==='62'){push({...q,rawValue:'7',value:'7'});hasColor=true;}else if(q.code==='6'){push({...q,rawValue:'CONTINUOUS',value:'CONTINUOUS'});hasType=true;}else if(!['370','420','440'].includes(q.code))push(q);}if(!hasColor)push({code:'62',rawCode:' 62',value:'7',rawValue:'7'});if(!hasType)push({code:'6',rawCode:'  6',value:'CONTINUOUS',rawValue:'CONTINUOUS'});continue;
  }
  push(p);i++;
}
fs.writeFileSync(output,out.flatMap(p=>[p.rawCode,p.rawValue]).join(newline)+newline,'utf8');
console.log(`Created ${path.resolve(output)} from ${pairs.length} groups (${pairs.length-out.length} removed/normalized groups)`);
