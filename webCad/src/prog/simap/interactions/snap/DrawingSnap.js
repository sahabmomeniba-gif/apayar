import {  Feature } from "ol";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import { Fill, RegularShape, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import Entity, { EntityType } from "../../entities/Entity";
import { multipleExist } from "../../helpers/MultiParamsArrayCheck";
import CustomSnaps from "./CustomSnaps";
import { snapTypeName } from "./SnapTypes";


export default class DrawingSnap extends CustomSnaps{
    
    constructor(siSnap){
        super({
            edge:false,
            vertex:true,
            source: new VectorSource,
            pixelTolerance:siSnap.tolerance
        });
        this.siMap = siSnap.siMap
        this.name = snapTypeName.drawing

        this.snapActive = true;
        this.styleFeature = undefined;
    }
    
    addSnapFeature(feature){     
      this.source_.addFeature(feature)
    }
    removeSnapFeature(feature){
        this.source_.removeFeature(feature)
    }
    onSnapped(result){
        if(result.snapped){
            if(!this.styleFeature){
                this.styleFeature = new Feature({
                    geometry: new Point(result.vertex)
                });
                let style = new Style({
                    image : new CircleStyle({
                        fill: new Fill({
                            color: 'rgba(0, 255, 157,1)' 
                        }),
                        stroke: new Stroke({
                            color: 'rgba(0, 255, 157,1)'  ,
                        }),
                        radius:4,

                    })
                });
                this.styleFeature.setStyle(style);
                this.siMap.modify.addFeature(this.styleFeature);       
            }
            else{
                this.styleFeature.setGeometry(new Point(result.vertex));
            }
        }
        else{
            if(this.styleFeature){
                this.siMap.modify.removeFeature(this.styleFeature);
                this.styleFeature = undefined;
            }
        }
        
    }
}