import type { CadEntityInput, CommandPhase, ToolName, Vec2 } from '../core/types';
export interface PointerInput { world:Vec2; screen:Vec2; button:number; shift:boolean }
export interface CommandHost { snap(p:Vec2,origin?:Vec2):Vec2; selectAt(p:Vec2,add:boolean):void; pan(delta:Vec2):void; zoomAt(screen:Vec2,factor:number):void; create(e:CadEntityInput):void; removeSelection():void; changed():void }
export interface CommandState { tool:ToolName; phase:CommandPhase; points:Vec2[]; cursor?:Vec2; message:string; measurement?:number }

abstract class CadCommand {
  state:CommandState; protected down?:Vec2;
  constructor(public tool:ToolName, protected host:CommandHost, message:string){this.state={tool,phase:'active',points:[],message};}
  pointerMove(i:PointerInput){this.state.cursor=this.host.snap(i.world,this.state.points[this.state.points.length-1]);this.host.changed();}
  pointerDown(i:PointerInput){this.down=i.screen;} pointerUp(_i:PointerInput){}
  confirm(){this.finish();} cancel(){this.state.phase='cancelled';this.state.points=[];this.host.changed();}
  protected finish(){this.state.phase='finished';this.host.changed();}
}
class SelectCommand extends CadCommand { constructor(h:CommandHost){super('select',h,'Select an entity · Shift adds');} pointerDown(i:PointerInput){this.host.selectAt(i.screen,i.shift);} }
class PanCommand extends CadCommand { constructor(h:CommandHost){super('pan',h,'Drag to pan');} pointerMove(i:PointerInput){if(this.down){this.host.pan([i.screen[0]-this.down[0],i.screen[1]-this.down[1]]);this.down=i.screen;}} pointerUp(){this.down=undefined;} }
class ZoomCommand extends CadCommand { constructor(h:CommandHost){super('zoom',h,'Click to zoom in · Shift-click to zoom out');} pointerDown(i:PointerInput){this.host.zoomAt(i.screen,i.shift?1/1.5:1.5);} }
class PointCommand extends CadCommand {
  constructor(tool:'measure'|'line'|'polyline',h:CommandHost){super(tool,h,`Specify first point for ${tool}`);}
  pointerDown(i:PointerInput){const p=this.host.snap(i.world,this.state.points[this.state.points.length-1]);this.state.points.push(p);
    if(this.tool==='line'&&this.state.points.length===2){this.host.create({id:crypto.randomUUID(),type:'line',start:this.state.points[0],end:p,layerId:'',styleId:'default',metadata:{createdBy:'line command'},visible:true,selectable:true,locked:false});this.finish();}
    else if(this.tool==='measure'&&this.state.points.length===2){this.state.measurement=Math.hypot(p[0]-this.state.points[0][0],p[1]-this.state.points[0][1]);this.state.message=`Distance ${this.state.measurement.toFixed(3)} · click to measure again`;this.state.points=[];this.host.changed();}
    else {this.state.message=this.tool==='polyline'?'Specify next point · Enter/Space finishes':'Specify second point';this.host.changed();}}
  confirm(){if(this.tool==='polyline'&&this.state.points.length>1){this.host.create({id:crypto.randomUUID(),type:'polyline',vertices:[...this.state.points],closed:false,layerId:'',styleId:'default',metadata:{createdBy:'polyline command'},visible:true,selectable:true,locked:false});this.finish();}}
}
export class CommandManager {
  active!:CadCommand; lastTool:ToolName='select';
  constructor(private host:CommandHost){this.activate('select');}
  activate(tool:ToolName){if(this.active?.state.phase==='active')this.active.cancel();if(tool!=='select')this.lastTool=tool;this.active=tool==='select'?new SelectCommand(this.host):tool==='pan'?new PanCommand(this.host):tool==='zoom'?new ZoomCommand(this.host):new PointCommand(tool,this.host);this.host.changed();}
  pointerMove(i:PointerInput){this.active.pointerMove(i);} pointerDown(i:PointerInput){this.active.pointerDown(i);if(this.active.state.phase==='finished')this.activate('select');} pointerUp(i:PointerInput){this.active.pointerUp(i);}
  confirm(){this.active.confirm();if(this.active.state.phase==='finished')this.activate('select');} cancel(){this.active.cancel();this.activate('select');}
  key(e:KeyboardEvent){if(e.key==='Escape'){this.cancel();return;}if(e.key==='Delete'){this.host.removeSelection();return;}if(e.key==='Enter'||e.code==='Space'){e.preventDefault();if(this.active.tool==='select'&&e.code==='Space')this.activate(this.lastTool);else this.confirm();return;}const map:Record<string,ToolName>={s:'select',h:'pan',z:'zoom',m:'measure',l:'line',p:'polyline'};const t=map[e.key.toLowerCase()];if(t)this.activate(t);}
  get state(){return this.active.state;}
}
