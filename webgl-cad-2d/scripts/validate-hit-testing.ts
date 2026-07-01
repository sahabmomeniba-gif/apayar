import type { CadEntity } from '../src/cad/core/types';import { screenHitDistance } from '../src/cad/utils/geometry';
const base={id:'test',layerId:'0',styleId:'default',metadata:{},visible:true,selectable:true,locked:false,bounds:{minX:0,minY:0,maxX:100,maxY:100}};
const project=(p:[number,number])=>p,hit=(e:CadEntity,p:[number,number])=>screenHitDistance(e,p,project,1,10)<=10;
const cases:[string,boolean][]=[
  ['line proximity',hit({...base,type:'line',start:[0,0],end:[100,0]},[50,7])],
  ['polyline segment',hit({...base,type:'polyline',vertices:[[0,0],[50,50],[100,0]],closed:false},[52,48])],
  ['circle interior',hit({...base,type:'circle',center:[50,50],radius:30},[50,50])],
  ['arc angular span',hit({...base,type:'arc',center:[50,50],radius:30,startAngle:0,endAngle:Math.PI/2},[80,50])],
  ['text extent',hit({...base,type:'text',position:[10,30],content:'LABEL',size:12,rotation:0,align:'left'},[25,24])]
];
for(const[name,ok]of cases){if(!ok)throw Error(`Failed: ${name}`);}console.log(`Screen-space hit tests passed: ${cases.length}`);
