import { Feature } from "ol";
import LineString from "ol/geom/LineString";
import calculateCenter from "./CalculateCenter";

export const GetVerticalLine = (line)=>{
    let clone = line.getGeometry().clone();
    let center = calculateCenter(line).center
    clone.rotate(Math.PI/2,center);
    return new Feature({
        geometry:clone
    })
}