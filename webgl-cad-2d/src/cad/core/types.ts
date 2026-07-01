export type Vec2=[number,number]; export interface Bounds{minX:number;minY:number;maxX:number;maxY:number}
export type EntityType='point'|'line'|'polyline'|'polygon'|'circle'|'arc'|'text'|'hatch'|'block-reference';
export interface CadStyle{id:string;name:string;strokeColor:string;strokeWidth:number;fillColor:string;fillOpacity:number;opacity:number;textColor:string;textSize:number;dash:number[];pointSize:number}
export interface CadLayer{id:string;name:string;visible:boolean;locked:boolean;snapEnabled:boolean;color?:string;opacity:number;lineWidth:number;dash:number[];fillColor?:string;styleId?:string;order:number;entityCount:number}
export interface CadSource{format:'dxf'|'native';type?:string;handle?:string|number;layer?:string;block?:string}
export interface EntityBase{id:string;type:EntityType;layerId:string;styleId:string;style?:Partial<CadStyle>;metadata:Record<string,unknown>;visible:boolean;selectable:boolean;locked:boolean;bounds:Bounds;source?:CadSource}
export type CadEntity=EntityBase&({type:'point';position:Vec2}|{type:'line';start:Vec2;end:Vec2}|{type:'polyline'|'polygon'|'hatch';vertices:Vec2[];closed:boolean}|{type:'circle';center:Vec2;radius:number}|{type:'arc';center:Vec2;radius:number;startAngle:number;endAngle:number}|{type:'text';position:Vec2;content:string;size:number;rotation:number;align:'left'|'center'|'right'}|{type:'block-reference';name:string;position:Vec2;scale:Vec2;rotation:number;children:CadEntity[]});
export type CadEntityInput=CadEntity extends infer E?E extends CadEntity?Omit<E,'bounds'>:never:never;
export type ToolName='select'|'pan'|'zoom'|'measure'|'line'|'polyline'; export type CommandPhase='idle'|'active'|'finished'|'cancelled';
