import { extend } from "ol/array";
import { createEditingStyle } from "ol/style/Style";
import Style from 'ol/style/Style'
import Stroke from "ol/style/Stroke";
import { EntityType } from "../entities/Entity";
const GeometryType = {
    POINT: 'Point',
    LINE_STRING: 'LineString',
    LINEAR_RING: 'LinearRing',
    POLYGON: 'Polygon',
    MULTI_POINT: 'MultiPoint',
    MULTI_LINE_STRING: 'MultiLineString',
    MULTI_POLYGON: 'MultiPolygon',
    GEOMETRY_COLLECTION: 'GeometryCollection',
    CIRCLE: 'Circle',
}
export const getDefaultSelectFunction = () => {
    const styles = createEditingStyle();
    extend(styles[GeometryType.POLYGON], styles[GeometryType.LINE_STRING]);
    extend(
        styles[GeometryType.GEOMETRY_COLLECTION],
        styles[GeometryType.LINE_STRING]
    );

    return function(feature) {
        if (!feature.getGeometry()) {
            return null;
        }
        return styles[feature.getGeometry().getType()];
    };
}

export const DefaultSelectStyle = (style) => {
    // console.log(style.getStroke())
    // console.log('ok')
    let width = style.getStroke().getWidth() ? style.getStroke().getWidth() + 2 : 3
        // console.log(style)
    return [
        style,
        new Style({
            stroke: new Stroke({
                color: '#2e66ff7e',
                width: width,
            }),
        }),
    ]
}
export const lineDashedStyle = () => {
    return (
        new Style({
            stroke: new Stroke({
                color: 'rgba(213, 255, 5)',
                lineDash: [10, 15]
            }),
            width: 5
        })
    )
}