import DxfParser from 'dxf-parser';
import type { CadEntity, CadLayer, Vec2 } from '../core/types';
import { entityBounds } from '../utils/geometry';

const ACI = ['#000000','#ff0000','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff','#ffffff'];
const id = () => crypto.randomUUID();
const pt = (p: any): Vec2 => [Number(p?.x || 0), Number(p?.y || 0)];
const clean = (s: string) => s.replace(/\\P/g, '\n').replace(/\\[A-Za-z][^;]*;/g, '').replace(/[{}]/g, '');
const rgb = (n: number) => `#${Math.abs(n).toString(16).padStart(6, '0').slice(-6)}`;

export interface ImportWarning { type: string; count: number; message: string }
export interface ImportResult { entities: CadEntity[]; layers: CadLayer[]; warnings: ImportWarning[]; source: { version?: string; blockCount: number } }

export class DxfImporter {
  import(text: string): ImportResult {
    const dxf: any = new DxfParser().parseSync(text);
    if (!dxf) throw Error('The DXF parser returned no drawing.');
    const names = new Set<string>(['0']);
    Object.keys(dxf.tables?.layer?.layers || {}).forEach(n => names.add(n));
    (dxf.entities || []).forEach((e: any) => names.add(e.layer || '0'));
    const layers = [...names].map((name, order): CadLayer => {
      const x = dxf.tables?.layer?.layers?.[name];
      const lt = dxf.tables?.lineType?.lineTypes?.[x?.lineTypeName];
      return { id:`layer:${name}`, name, visible:x?.visible !== false && !x?.frozen, locked:false, snapEnabled:true,
        color:x?.color ? rgb(x.color) : ACI[Math.abs(x?.colorIndex || 7) % 8], opacity:1, lineWidth:1.25,
        dash:(lt?.pattern || []).map((n:number) => Math.abs(n) * 8), order, entityCount:0 };
    });
    const skipped = new Map<string, number>();
    const mapEntity = (raw: any, parent?: {name:string; position:Vec2; scale:Vec2; rotation:number}): CadEntity | undefined => {
      const transform = (q: Vec2): Vec2 => {
        if (!parent) return q;
        const x=q[0]*parent.scale[0], y=q[1]*parent.scale[1], c=Math.cos(parent.rotation), s=Math.sin(parent.rotation);
        return [parent.position[0]+x*c-y*s, parent.position[1]+x*s+y*c];
      };
      const color = raw.color ? rgb(raw.color) : raw.colorIndex && raw.colorIndex !== 256 ? ACI[Math.abs(raw.colorIndex)%8] : undefined;
      const style: any = {};
      if (color) style.strokeColor = style.textColor = color;
      if (raw.lineweight > 0) style.strokeWidth = Math.max(.5, raw.lineweight/25);
      const lt = dxf.tables?.lineType?.lineTypes?.[raw.lineType];
      if (lt?.pattern) style.dash = lt.pattern.map((n:number) => Math.abs(n)*8);
      const base: any = { id:String(raw.handle || id()), layerId:`layer:${raw.layer || '0'}`, styleId:'default',
        style:Object.keys(style).length ? style : undefined,
        metadata:{dxfType:raw.type,handle:raw.handle,layer:raw.layer,colorIndex:raw.colorIndex,trueColor:raw.color,lineType:raw.lineType,lineweight:raw.lineweight,block:parent?.name},
        visible:raw.visible !== false, selectable:true, locked:false, bounds:{minX:0,minY:0,maxX:0,maxY:0},
        source:{format:'dxf',type:raw.type,handle:raw.handle,layer:raw.layer,block:parent?.name} };
      let e: CadEntity | undefined;
      switch (raw.type) {
        case 'LINE': { const v=raw.vertices || []; if(v.length>1)e={...base,type:'line',start:transform(pt(v[0])),end:transform(pt(v[1]))}; break; }
        case 'LWPOLYLINE': case 'POLYLINE': case 'SPLINE': {
          const v=(raw.vertices || raw.controlPoints || raw.fitPoints || []).map((x:any)=>transform(pt(x)));
          if(v.length>1)e={...base,type:raw.shape?'polygon':'polyline',vertices:v,closed:!!(raw.shape||raw.closed)}; break;
        }
        case '3DFACE': case 'SOLID': {
          const v=(raw.vertices || raw.points || []).filter(Boolean).map((x:any)=>transform(pt(x)));
          if(v.length>2)e={...base,type:'hatch',vertices:v,closed:true,style:{...style,fillColor:color||'#94a3b8',fillOpacity:.25}}; break;
        }
        case 'POINT': e={...base,type:'point',position:transform(pt(raw.position))}; break;
        case 'CIRCLE': e={...base,type:'circle',center:transform(pt(raw.center)),radius:Number(raw.radius)*(parent?.scale[0]||1)}; break;
        case 'ARC': e={...base,type:'arc',center:transform(pt(raw.center)),radius:Number(raw.radius)*(parent?.scale[0]||1),startAngle:Number(raw.startAngle)+(parent?.rotation||0),endAngle:Number(raw.endAngle)+(parent?.rotation||0)}; break;
        case 'ELLIPSE': {
          const c=pt(raw.center), a=pt(raw.majorAxisEndPoint), ratio=Number(raw.axisRatio||1), v:Vec2[]=[];
          for(let i=0;i<=48;i++){const q=(raw.startAngle||0)+((raw.endAngle??Math.PI*2)-(raw.startAngle||0))*i/48;v.push(transform([c[0]+a[0]*Math.cos(q)-a[1]*ratio*Math.sin(q),c[1]+a[1]*Math.cos(q)+a[0]*ratio*Math.sin(q)]));}
          e={...base,type:'polyline',vertices:v,closed:true}; break;
        }
        case 'TEXT': case 'MTEXT': {
          e={...base,type:'text',position:transform(pt(raw.startPoint||raw.position)),content:clean(String(raw.text||'')),size:Number(raw.textHeight||raw.height||2.5),rotation:Number(raw.rotation||0)*Math.PI/180+(parent?.rotation||0),align:raw.halign===1?'center':raw.halign===2?'right':'left'}; break;
        }
        case 'INSERT': {
          const block=dxf.blocks?.[raw.name], position=transform(pt(raw.position));
          const scale=[Number(raw.xScale||1),Number(raw.yScale||1)] as Vec2;
          const rotation=Number(raw.rotation||0)*Math.PI/180+(parent?.rotation||0);
          const ctx={name:raw.name,position,scale,rotation};
          const children=(block?.entities||[]).map((x:any)=>mapEntity(x,ctx)).filter(Boolean) as CadEntity[];
          e={...base,type:'block-reference',name:raw.name||'Unnamed',position,scale,rotation,children};
          if(!block)skipped.set('MISSING_BLOCK',(skipped.get('MISSING_BLOCK')||0)+1); break;
        }
        default: skipped.set(raw.type,(skipped.get(raw.type)||0)+1);
      }
      if(e)e.bounds=entityBounds(e);
      return e;
    };
    const entities=(dxf.entities||[]).map((x:any)=>mapEntity(x)).filter(Boolean) as CadEntity[];
    const warnings=[...skipped].map(([type,count])=>({type,count,message:`${count} ${type} item${count===1?'':'s'} could not be converted`}));
    return {entities,layers,warnings,source:{version:dxf.header?.$ACADVER,blockCount:Object.keys(dxf.blocks||{}).length}};
  }
}
