import {ValidatorHelper} from "./validator.helper";
import * as _ from 'lodash';
import * as tokml from 'tokml';

import * as turf from '@turf/turf'
import intersect from '@turf/intersect';
import union from '@turf/union';
import booleanClockwise from '@turf/boolean-clockwise';
import difference from '@turf/difference';
import t_intersect from '@turf/intersect';
import t_contains from '@turf/boolean-contains';
import turf_bbox from '@turf/bbox';
import t_centroid from '@turf/centroid';
import t_area from '@turf/area';
import t_length from '@turf/length';
import t_distance from '@turf/distance';
import t_along from '@turf/along';
import t_simplify from '@turf/simplify';
import t_line_overlap from '@turf/line-overlap';
import t_line_offset from '@turf/line-offset';
import t_line_slice from '@turf/line-slice';
import t_kinks from '@turf/kinks';
import t_boolean_point_in_polygon from '@turf/boolean-point-in-polygon';
import t_nearest_point_on_line from '@turf/nearest-point-on-line';
import {saveAs} from 'file-saver';
import * as t_turf_line_slice_at_intersection from '../assets/js/turf-line-slice-at-intersection';
import * as dxf from 'dxf-writer';
import * as xlsx from 'xlsx';
import proj4 from 'proj4';
import L from 'leaflet';
import {UtilsHelper} from "./utils.helper";
import {SvgClass} from "../classes/svg";
import t_buffer from '@turf/buffer';
var projs = [[
    'EPSG:4326',
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees']];
for (let i = 1; i <= 60; i++) {
    projs.push(['EPSG:326' + i,
        '+proj=utm +zone=' + i + ' +datum=WGS84 +units=m +no_defs'])
}
proj4.defs(projs);

export var MapHelper = {
    tile_deg2num: function (lat_deg, lon_deg, zoom) {
        let lat_rad = lat_deg / 180 * Math.PI;
        let n = Math.pow(2.0, zoom);
        let xtile = Math.floor((lon_deg + 180.0) / 360.0 * n)
        let ytile = Math.floor((1.0 - Math.log(Math.tan(lat_rad) + (1 / Math.cos(lat_rad))) / Math.PI) / 2.0 * n)
        return {x: xtile, y: ytile}
    },
    tile_num2deg: function (xtile, ytile, zoom) {
        let n = Math.pow(2.0, zoom);
        let lon_deg = xtile / n * 360.0 - 180.0;
        let lat_rad = Math.atan(Math.sinh(Math.PI * (1 - 2 * ytile / n)))
        let lat_deg = lat_rad * 180 / Math.PI;
        return {lat: lat_deg, lon: lon_deg}
    },
    getParentTile: function (xtile, ytile, zoom, parentZoom) {
        let deg = this.tile_num2deg(xtile, ytile, zoom);
        let epsilon = 0.00001;
        return this.tile_deg2num(deg.lat - epsilon, deg.lon + epsilon, parentZoom);
    },
    optionsToCssStyle: function (options) {
        let style = {};
        if (options.color)
            style.color = options.color;
        else
            style.color = 'blue';

        if (options.fillOpacity)
            style.fillOpacity = options.fillOpacity;
        else
            style.fillOpacity = 0.6;

        if (options.stroke)
            style.stroke = options.stroke;
        else
            style.stroke = style.color;
        return style;
    },
    bbox: function (features) {
        if(Array.isArray(features))
            features = {type:"FeatureCollection",features}
        return turf_bbox(features);

    },
    bboxToXYbbox: function (bbox, forcedZone) {
        let p1 = this.coordsLonLatToXY([bbox[0], bbox[1]], forcedZone);
        let p2 = this.coordsLonLatToXY([bbox[2], bbox[3]], forcedZone);
        return [p1[0], p1[1], p2[0], p2[1]];
    },
    coordsLonLatToXY: function (coords, forcedZone) {
        if (Array.isArray(coords[0])) {
            let re = [];
            coords.map(c => re.push(this.coordsLonLatToXY(c, forcedZone)));
            return re;
        }
        return this.lonlat2xy(coords, forcedZone);
    },
    tokml: function (geojson) {
        return tokml(geojson);

    },
    isSelfIntersection: function (poly) {
        var kinks = t_kinks(poly);
        return kinks.features.length > 0;

    },
    updateBbox: function (features) {
        features.forEach(function (f) {
            f.geometry.bbox = turf_bbox(f.geometry);
        });

    },
    zoomToBbox4326: function (map, bbox) {
        let latlon1 = [bbox[1], bbox[0]];
        let latlon2 = [bbox[3], bbox[2]];

        MapHelper.zoomToBounds(map, [latlon1, latlon2]);
    },
    boundsToPolygon: function (bounds) {
        let p1 = [bounds.getSouthWest().lng, bounds.getSouthWest().lat];
        let p2 = [bounds.getNorthEast().lng, bounds.getSouthWest().lat];
        let p3 = [bounds.getNorthEast().lng, bounds.getNorthEast().lat];
        let p4 = [bounds.getSouthWest().lng, bounds.getNorthEast().lat];
        return {type: 'Polygon', coordinates: [[p1, p2, p3, p4, p1]]}

    },
    zoomToBounds: function (map, bounds) {
        // let latlon1 = [bbox[0], bbox[1]];
        // let latlon2 = [bbox[2], bbox[3]];


        if (bounds[0][1] > bounds[1][1]) {
            UtilsHelper.swap(bounds[0][1], bounds[1][1]);
        }
        if (bounds[0][1] < -180)
            bounds[0][1] += 360;
        if (bounds[1][1] < -180)
            bounds[1][1] += 360;
        if (bounds[0][0] > bounds[1][0]) {
            UtilsHelper.swap(bounds[0][0], bounds[1][0]);
        }

        map.fitBounds(bounds);
    },
    zoomToPoint: function (map, coordinates, zoom) {
        let c = [coordinates[1], coordinates[0]];
        if (!zoom)
            map.panTo(c);
        else
            map.setView(c, zoom);

    },
    zoomToGeometry: function (map, geom, zoom) {
        if (geom.type == 'Point') {
            this.zoomToPoint(map, geom.coordinates, zoom)
        } else if (geom.type == 'Polygon') {
            let c = t_centroid(geom)
            this.zoomToGeometry(map, c.geometry, zoom)
        }
    },
    blinkCircle: async function (map, coordinates, zoom) {
        let c = [coordinates[1], coordinates[0]];
        let z = map.getZoom();
        let r = Math.pow(2, 10) / Math.pow(2, z) * 10000
        let tempLayer = L.circle(c, r, {
            color: 'blue',
            fillColor: 'blue'
        })
        map.addLayer(tempLayer);
        for (let i = 0; i < 20; i++) {
            await UtilsHelper.delay(50)
            r *= 0.8;
            tempLayer.setRadius(r);

        }

        map.removeLayer(tempLayer);

    },
    getArea: function (coordinates) {
        let a2 = 0;
        let i = 0;
        for (; i < coordinates.length - 1; i++) {
            a2 += coordinates[i][0].toFixed(5) * coordinates[i + 1][1].toFixed(5) - coordinates[i + 1][0].toFixed(5) * coordinates[i][1].toFixed(5)
        }

        a2 += coordinates[i][0] * coordinates[0][1] - coordinates[0][0] * coordinates[i][1];
        return a2 / 2;
    },
    getLen: function (coordinates) {
        let a2 = 0;
        let i = 0;
        for (; i < coordinates.length - 1; i++) {
            a2 += Math.pow(
                Math.pow(coordinates[i + 1][0] - coordinates[i][0], 2) +
                Math.pow(coordinates[i + 1][1] - coordinates[i][1], 2)
                , 0.5)
        }
        return a2;
    },
    calcArea: function (geom) {
        let coordinates;
        let i = 0;
        let a = 0;
        if (!geom.type) {
            coordinates = geom;
            return Math.abs(this.getArea(coordinates));
        } else if (geom.type == 'Polygon') {
            coordinates = geom.coordinates;
            for (i = 0; i < coordinates.length; i++)
                a += this.getArea(coordinates[i])
            return Math.abs(a);
        } else if (geom.type == 'MultiPolygon') {
            coordinates = geom.coordinates;
            for (i = 0; i < coordinates.length; i++) {
                let b = 0
                for (let j = 0; j < coordinates[i].length; j++)
                    b += this.getArea(coordinates[i][j])
                a += Math.abs(b)
            }
            return Math.abs(a);
        }
    },
    calcAzimuth: function (L, a, b) {
        var p1 = L.point(a);
        var p2 = L.point(b);

        return 90 - L.GeometryUtil.computeAngle(p1, p2);
    },
    lonlat2xy_arr: function (lonlats) {
        return this.latlon2xy_arr(this.swapArrayLatLon(lonlats));
    },
    isSamePoint: function (p1, p2, ep = 0.00000001) {
        return Math.abs(p1[0] - p2[0]) < ep && Math.abs(p1[1] - p2[1]) < ep;
    },
    lonlat2xy_arr_forceZone: function (lonlats, zone) {
        return this.latlon2xy_arr_forceZone(this.swapArrayLatLon(lonlats), zone);
    },
    latlon2xy_arr_forceZone: function (latlons, zone) {
        let res: number[][] = [];
        for (let i = 0; i < latlons.length; i++) {
            res.push(this.latlon2xyForceZone(latlons[i], zone));
        }
        return res;
    },
    latlon2xy_arr: function (latlons) {
        let res = [];
        let zone;
        if (latlons[0])
            zone = 30 + Math.round((latlons[0][1] + 3) / 6);
        for (let i = 0; i < latlons.length; i++) {
            res.push(this.latlon2xy(latlons[i], zone));
        }
        return res;
    },
    xy2latlon_arr: function (xys, zone) {
        let res: number[][] = [];
        for (let i = 0; i < xys.length; i++) {
            res.push(this.xy2latlon(xys[i], zone));
        }
        return res;
    },
    xy2lonlat_arr: function (xys, zone) {
        let res: number[][] = [];
        for (let i = 0; i < xys.length; i++) {
            res.push(this.xy2lonlat(xys[i], zone));
        }
        return res;
    },
    lonlat2xy: function (lonlat, forcedZone = null) {
        return this.latlon2xy([lonlat[1], lonlat[0]], forcedZone);
    },
    latlon2xy: function (latlon, forcedZone) {
        let zone = forcedZone;
        if (!zone)
            zone = 30 + Math.round((latlon[1] + 3) / 6);
        let lonlat = [latlon[1], latlon[0]];
        let xy = proj4('EPSG:326' + zone, 'EPSG:4326').inverse(lonlat);
        xy[0] = +(xy[0]);
        xy[1] = +(xy[1]);
        return xy;
    },
    latlon2xy900913: function (latlon) {
        let lonlat = [latlon[1], latlon[0]];
        let xy = proj4('EPSG:900913', 'EPSG:4326').inverse(lonlat);
        xy[0] = +(xy[0].toFixed(3));
        xy[1] = +(xy[1].toFixed(3));
        return xy;
    },
    lonlat2xy900913: function (lonlat) {
        let xy = proj4('EPSG:900913', 'EPSG:4326').inverse(lonlat);
        xy[0] = +(xy[0].toFixed(3));
        xy[1] = +(xy[1].toFixed(3));
        return xy;
    },

    turf,

    t_area,

    union,

    booleanClockwise,

    polygonLonLat2xy900913: function (polygon) {
        var res = [];
        polygon.coordinates.forEach(function (c) {
            let cxy = [];
            for (var i = 0; i < c.length; i++)
                cxy.push(this.lonlat2xy900913(c[i]))
            res.push(cxy);
        })
        return res;
    },
    lon2Zone: function (lon) {
        return 30 + Math.round((lon + 3) / 6);
    },
    polygonLonLat2xy: function (polygon) {
        var res = [];
        polygon.coordinates.forEach(function (c) {
            let cxy = [];
            var zone = 30 + Math.round((c[0][0] + 3) / 6);
            for (var i = 0; i < c.length; i++)
                cxy.push(this.lonlat2xy(c[i], zone))
            res.push(cxy);
        })
        return res;
    },
    latlon2xyForceZone: function (latlon, zone) {
        if (!latlon[0] || !latlon[1])
            return;

        let lonlat = [latlon[1], latlon[0]];
        let xy = proj4('EPSG:326' + zone, 'EPSG:4326').inverse(lonlat);
        xy[0] = +(xy[0].toFixed(3));
        xy[1] = +(xy[1].toFixed(3));
        return xy;
    },
    latlon2Zone: function (latlon) {
        return 30 + Math.round((latlon[1] + 3) / 6);
    },
    lonlat2Zone: function (lonlat) {
        return this.latlon2Zone([lonlat[1], lonlat[0]]);
    },
    xy2lonlat: function (xy, zone) { //EPSG : 32639
        return this.xy2latlon(xy, zone).reverse();
    },
    str2lonlat: function (str, zone) { //EPSG : 32639
        let lonlat = str.split(',').map(n => +n.trim());
        if (lonlat.length == 2) {
            if (lonlat[0] > 10000) {
                lonlat = this.xy2lonlat(lonlat, zone);
            }
        } else if (lonlat.length == 3) {
            if (lonlat[0] > 10000) {
                lonlat = this.xy2lonlat(lonlat, lonlat[2]);
            }
        }
        return lonlat;
    },
    xy2latlon: function (xy, zone) { //EPSG : 32639
        let lonlat = proj4('EPSG:326' + zone, 'EPSG:4326').forward(xy);
        return [lonlat[1], lonlat[0]];
    },


    Degree2DMS: function (latlon) {
        let result = {};
        result.d = Math.trunc(latlon);
        result.m = Math.trunc((latlon - result.d) * 60);
        result.s = (((latlon - result.d) * 60) - result.m) * 60;

        return result;
    },

    DMS2Degree: function (degree, minute, second) {
        if (degree != 0)
            return (+degree) + (+minute / 60) + (+second / 3600);
        return;
    },


    changeZone: function (xy, srcZone, dstZone) {

        if (srcZone == dstZone)
            return xy;
        let xy2 = this.latlon2xyForceZone(this.xy2latlon(xy, srcZone), dstZone);
        return xy2;
    },
    swapArrayLatLon: function (arr) {
        let res = []
        for (let i = 0; i < arr.length; i++)
            res.push([arr[i][1], arr[i][0]]);

        return res;
    },
    getFeatureInfoQuery: function (L, map, visibleLayers, latlng, params): string {
        /*var url = Config.config.geoServerUrl;
         var domain = $location.protocol() + '://' + (url ? url : 'localhost');*/
        let size = map.getSize();
        let sizex: number = +(size.x / 10).toFixed(0);
        let sizey: number = +(size.y / 10).toFixed(0);
        let bounds = map.getBounds();
        let w: number = bounds.getNorthEast().lng - bounds.getSouthWest().lng;
        let h: number = bounds.getNorthEast().lat - bounds.getSouthWest().lat;
        let X2 = (((latlng.lng - bounds.getSouthWest().lng) / w) * sizex).toFixed(0);
        let Y2 = (((bounds.getNorthEast().lat - latlng.lat) / h) * sizey).toFixed(0);
        let defaultParams = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            srs: 'EPSG:4326',
            styles: '',
            format: 'image/png',
            bbox: map.getBounds().toBBoxString(),
            height: sizey,
            width: sizex,
            layers: visibleLayers,
            query_layers: visibleLayers,
            info_format: 'application/json',
            feature_count: 20
            //info_format: 'application/vnd.ogc.gml'
        };


        params = L.Util.extend(defaultParams, params || {});
        params[params.version === '1.3.0' ? 'i' : 'x'] = X2;
        params[params.version === '1.3.0' ? 'j' : 'y'] = Y2;

        return ('auth.settings.geoserverInServerUrl' + 'wms') + L.Util.getParamString(params);
    },
    pointToFeaturePolygon: function (x, y, dim, properties) {
        let feature = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [[[x - dim, y - dim], [x + dim, y - dim], [x + dim, y + dim], [x - dim, y + dim], [x - dim, y - dim]]]
            },
            properties: properties
        }
        return feature;
    },
    bboxIntersection: function (b1, b2) {
        if ((b1[2] < b2[0]) || (b1[3] < b2[1])) return false;
        if ((b2[2] < b1[0]) || (b2[3] < b1[1])) return false;
        return true;
    },
    intersect_feature_featureCollection: function (f, fc) {
        let res = {type: 'FeatureCollection', features: []}
        fc.features.forEach(function (f2) {
            let intersection = intersect(f, f2);
            if (intersection) {
                intersection.properties = Object.assign(Object.assign({}, f.properties), f2.properties);
                intersection.properties._area = t_area(intersection)
                res.features.push(intersection)
            }
        });
        return res;

    },
    intersect_two_featureCollections: function (fc1, fc2) {
        let res = {type: 'FeatureCollection', features: []}
        fc1.features.forEach(function (f1) {
            fc2.features.forEach(function (f2) {
                var intersection = intersect(f1, f2);
                if (intersection) {
                    intersection.properties = Object.assign(Object.assign({}, f1.properties));
                    for (var key in f2.properties) {
                        if (!intersection.properties[key])
                            intersection.properties[key] = f2.properties[key]
                        else if (!intersection.properties[key + '_1'])
                            intersection.properties[key + '_1'] = f2.properties[key]
                        else if (!intersection.properties[key + '_2'])
                            intersection.properties[key + '_2'] = f2.properties[key]
                        else if (!intersection.properties[key + '_3'])
                            intersection.properties[key + '_3'] = f2.properties[key]
                    }
                    intersection.properties._area = t_area(intersection)
                    res.features.push(intersection)
                }
            });
        });
        return res;
    },
    centroi: function d(polygon) {
        return t_centroid(polygon);
    },
    geometryArea: function (geom) { // Polygon & MultiPolygon lonlat
        let coordinates;
        let a = 0;
        if (!geom.type) {
            coordinates = geom;
            return Math.abs(this.getArea(this.lonlat2xy_arr(coordinates)));
        } else if (geom.type == 'Polygon') {
            coordinates = geom.coordinates;
            for (let i = 0; i < coordinates.length; i++)
                a += this.getArea(this.lonlat2xy_arr(coordinates[i]))
            return Math.abs(a);
        } else if (geom.type == 'MultiPolygon') {
            coordinates = geom.coordinates;
            for (let i = 0; i < coordinates.length; i++) {
                let b = 0
                for (let j = 0; j < coordinates[i].length; j++) {
                    b += this.getArea(this.lonlat2xy_arr(coordinates[i][j]))
                }
                a += Math.abs(b)
            }
            return Math.abs(a);
        }

    },
    geometryLen: function (geom) { // Polygon & MultiPolygon lonlat
        let coordinates;
        let a = 0;
        if (!geom.type) {
            coordinates = geom;
            return this.getLen(this.lonlat2xy_arr(coordinates));
        } else if (geom.type == 'LineString') {
            coordinates = geom.coordinates;
            return this.getLen(this.lonlat2xy_arr(coordinates))
        } else if (geom.type == 'MultiLineString') {
            coordinates = geom.coordinates;
            for (let i = 0; i < coordinates.length; i++)
                a += this.getLen(this.lonlat2xy_arr(coordinates[i]))
            return Math.abs(a);
        }

    },
    multiPolygonArea: function (geometry) {
        let res = 0;
        for (var i = 1; i < geometry.geometries.length; i++) {
            res += this.geometryArea(geometry.geometries[i])
        }
        return res;
    },
    polygonArea: function (geometry) {
        let coordinates = this.polygonLonLat2xy(geometry);
        // let coordinates = polygonLonLat2xy900913(geometry);
        var cs = coordinates[0];
        for (var i = 1; i < coordinates.length; i++)
            cs = cs.concat(coordinates[i]);
        return this.calcArea(cs);
    },
    cadColorToColor: function (cc, defaultColor) {
        if (!cc)
            return defaultColor;
        if (ValidatorHelper.isNumber(cc)) {
            cc = +cc;
            if (!cadColors[cc])
                return cc;
            let res = cadColors[cc].toString(16);
            while (res.length < 6)
                res = '0' + res;
            return '#' + res;
        } else if (typeof cc == 'string' && cc.split(',').length == 3) {
            let rgb = cc.split(',').map(n => +n);
            let nc = rgb[0] * 256 * 256 + rgb[1] * 256 + rgb[2];
            let res = nc.toString(16);
            while (res.length < 6)
                res = '0' + res;
            return '#' + res;
        } else return cc;
    },
    rgbToHex: function (r, g, b) {
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    },

    rgbColorToColor: function (rgbString, defaultColor) {
        if (!rgbString || typeof rgbString != 'string')
            return defaultColor;
        let cc = rgbString;
        if (ValidatorHelper.isNumber(cc)) {
            let cn = +cc;
            if (!cadColors[cn])
                return cn;
            let res = cadColors[cn].toString(16);
            while (res.length < 6)
                res = '0' + res;
            return '#' + res;
        } else return cc;
    },
    geojsonToDxf: function (geojson) {
        let d = new dxf();

        // d.addLayer('l_green', dxf.ACI.GREEN, 'CONTINUOUS');
        // d.setActiveLayer('l_green');
        for (var i = 0; i < geojson.features.length; i++) {
            let g = geojson.features[i].geometry;
            if (g.type == 'Polygon') {
                for (var j = 0; j < g.coordinates.length; j++) {
                    let c = g.coordinates[j];
                    c = this.lonlat2xy_arr(c);
                    d.drawPolyline(c)
                }
            }
            if (g.type == 'MultiPolygon') {
                for (var j = 0; j < g.coordinates.length; j++)
                    for (var k = 0; k < g.coordinates[j].length; k++) {
                        let c = g.coordinates[j][k];
                        c = this.lonlat2xy_arr(c);
                        d.drawPolyline(c)
                    }
            }
        }

        var formBlob = new Blob([d.toDxfString()], {type: 'text/plain'});
        saveAs(formBlob, 'export.dxf');

    },
    arrayOfObjectsToArrayOfArray: function (oa) {
        var cols = [];
        for (var i = 0; i < oa.length; i++) {
            var o = oa[i]
            for (var key in o)
                if (cols.indexOf(key) == -1)
                    cols.push(key);
        }
        var res = [];
        res.push(cols)
        for (var i = 0; i < oa.length; i++) {
            var resi = [];
            for (var j = 0; j < cols.length; j++) {
                resi.push(oa[i][cols[j]])
            }
            res.push(resi)
        }
        return res;
    },
    pinp: function (point, polygon) {
        return t_boolean_point_in_polygon(point, polygon);
    },
    intersect: function (polygon1, polygon2) {
        return t_intersect(polygon1, polygon2);
    },

    difference: function (polygon1, polygon2) {
        return difference(polygon1, polygon2);
    },

    t_contains: function (geo1, geo2) {
        return t_contains(geo1, geo2);
    },

    fullt_contains: function (geo1, geo2) {
        if (!geo1) {
            return {err: "geo1 not found!"}
        }
        if (!geo2) {
            return {err: "geo2 not found!"}
        }

        if (geo1.type == "Polygon" && geo2.type == "Polygon") {
            return t_contains(this.buffer(geo1,1).geometry, geo2)
        }

        if (geo1.type == "MultiPolygon" && geo2.type == "Polygon") {
            let status = false
            for (var i = 0; i < geo1.coordinates.length; i++) {
                let geom = {
                    "type": "Polygon",
                    "coordinates": geo1.coordinates[i]
                };

                let isIn = t_contains(this.buffer(geom,1).geometry, geo2)
                if (isIn) {
                    status = true
                }
            }

            return status
        }

        if (geo1.type == "Polygon" && geo2.type == "MultiPolygon") {
            let status = true
            for (var i = 0; i < geo2.coordinates.length; i++) {
                let geom = {
                    "type": "Polygon",
                    "coordinates": geo2.coordinates[i]
                };

                let isIn = t_contains(this.buffer(geo1,1).geometry, geom)
                if (!isIn) {
                    status = false
                }
            }
            return status
        }

        if (geo1.type == "MultiPolygon" && geo2.type == "MultiPolygon") {
            let status = []
            for (var i = 0; i < geo1.coordinates.length; i++) {
                let geom1 = {
                    "type": "Polygon",
                    "coordinates": geo1.coordinates[i]
                };

                for (var j = 0; j < geo2.coordinates.length; j++) {
                    let geom2 = {
                        "type": "Polygon",
                        "coordinates": geo2.coordinates[j]
                    };

                    let isIn = t_contains(this.buffer(geom1,1).geometry, geom2)
                    if (isIn) {
                        status.push(j)
                    }
                }
            }

            if(status.length !== geo2.coordinates.length) {
                return false
            }
            return true
        }
    },


    pOnLine: function (line, point) {
        return t_nearest_point_on_line(line, point);
    },
    lineOverlap: function (geom1, geom2) {
        return t_line_overlap(geom1, geom2);
    },
    lineOffset: t_line_offset,
    lineSlice: function (startPoint, stopPoint, line) {
        return t_line_slice(startPoint, stopPoint, line);
    },
    distance: function (startPoint, endPoint, options= {units: 'meters'}) {
        return t_distance(startPoint, endPoint, options);
    },
    length: function (line, options) {
        return t_length(line, options);
    },
    isSame: function (v1, v2, tol) {
        let r;
        if (Array.isArray(v1))
            r = (Math.abs(v1[0] - v2[0]) <= tol && Math.abs(v1[1] - v2[1]) <= tol)
        else
            r = Math.abs(v1 - v2) <= tol
        return r
    },

    lineIntersect: function (geom1, geom2) {
        let segments = t_turf_line_slice_at_intersection({type: 'Feature', geometry: geom1},
            {type: 'Feature', geometry: geom2});
        var d = 0
        segments.forEach(function (s) {
            let l = t_length(s);

            let mid = t_along(s, l / 2);
            s.isInside = this.pinp(mid, geom2);
            s.startDist = d;
            s.endDist = d + l;
            d += l;
        })

        return _.filter(segments, s => s.isInside);
    },
    simplify: function (geojson, options) {
        // var options = {tolerance: 0.01, highQuality: false};
        return t_simplify(geojson, options);
    },
    geojsonToExcel: function (geojson) {
        var data = this.arrayOfObjectsToArrayOfArray(geojson.features.map(f => f.properties))
        var wb = xlsx.utils.book_new(), ws = xlsx.utils.aoa_to_sheet(data);

        /* add worksheet to workbook */
        xlsx.utils.book_append_sheet(wb, ws, 'a');

        xlsx.writeFile(wb, 'export.xlsx');

    },
    jsonToExcel: function (json) {
        var data = this.arrayOfObjectsToArrayOfArray(json)
        var wb = xlsx.utils.book_new(), ws = xlsx.utils.aoa_to_sheet(data);

        /* add worksheet to workbook */
        xlsx.utils.book_append_sheet(wb, ws, 'a');

        xlsx.writeFile(wb, 'export.xlsx');

    },
    removePolygonDuplicateVertices: function (coordinates) {
        var ep = 0.00000001;
        for (let i = 0; i < coordinates.length - 1; i++) {
            let p1 = coordinates[i];
            let p2 = coordinates[i + 1];
            if ((Math.abs(p1[0] - p2[0]) < ep) && (Math.abs(p1[1] - p2[1]) < ep)) {
                coordinates.splice(i, 1);
                i--;
            }
        }
    },
    getCoordTypes: function () {
        return [{id: 1, name: "DMS"},
            {id: 2, name: "Decimal Degree"},
            {id: 3, name: "UTM"},
            {id: 4, name: "Autotext"},
            {id: 5, name: "Province & County"}
        ]

    },
    getZone: function () {
        return [{id: 36, name: "36"}, {id: 37, name: "37"}, {id: 38, name: "38"}, {id: 39, name: "39"}
            , {id: 40, name: "40"}, {id: 41, name: "41"}, {id: 42, name: "42"}]

    }

    , getPolygonSVG: function (p) {
        var svg = new SvgClass({paperWidth: 50, paperHeight: 50, transform: 'lonlat2xy'});
        svg.addFeature({type: 'Feature', geometry: p});
        return svg.draw('xml');
    }

    , getGeometriesSVG: function (geoms, width, height) {
        var svg = new SvgClass({paperWidth: width, paperHeight: height, transform: 'lonlat2xy'});
        geoms.forEach(function (p) {
            svg.addFeature({type: 'Feature', geometry: p});
        });

        return svg.draw('xml');
    }

    , layerToPolygon: function (layer) {
        let mCoords = [];
        let coords;
        let latlngs;
        let f1;
        if (layer._latlngs)
            f1 = layer;
        else if (layer._layers) {
            let obj = layer._layers;
            f1 = obj[Object.keys(obj)[0]];
        }
        if (f1._latlngs[0].lat)
            latlngs = f1._latlngs;
        else
            latlngs = f1._latlngs;

        if(latlngs.length == 1){
            coords = latlngs[0].map(l => [l.lng, l.lat]);
            while (coords[0][0] == coords[coords.length - 1][0] && coords[0][1] == coords[coords.length - 1][1])
                coords.pop();
            coords.push(coords[0]);

            return {type: "Polygon", coordinates: [coords]};
        }
        else {
            latlngs.map(laln => {
                coords = laln.map(l => [l.lng, l.lat]);
                while (coords[0][0] == coords[coords.length - 1][0] && coords[0][1] == coords[coords.length - 1][1])
                    coords.pop();
                coords.push(coords[0]);

                mCoords.push(coords);
            });

            return {type: "Polygon", coordinates: mCoords};
        }



    },
    layerToMultiPolygon: function (layer) {
        let coords;
        let latlngs;
        let f1;
        if (layer._latlngs)
            f1 = layer;
        else if (layer._layers) {
            let obj = layer._layers;
            f1 = obj[Object.keys(obj)[0]];
        }
        let rings = [];

        f1._latlngs.map(r => {
            let coords = r[0].map(l => [l.lng, l.lat]);
            while (coords[0][0] == coords[coords.length - 1][0] && coords[0][1] == coords[coords.length - 1][1])
                coords.pop();
            coords.push(coords[0]);
            rings.push([coords])
        });

        return {type: "MultiPolygon", coordinates: rings};
    }

    , layerToLine: function (layer) {
        let coords;
        let latlngs;
        let f1;
        if (layer._latlngs)
            f1 = layer;
        else if (layer._layers) {
            let obj = layer._layers;
            f1 = obj[Object.keys(obj)[0]];
        }
        if (f1._latlngs[0].lat)
            latlngs = f1._latlngs;
        else
            latlngs = f1._latlngs[0];
        coords = latlngs.map(l => [l.lng, l.lat]);

        return {type: "LineString", coordinates: coords};
    }

    , layerToPoint: function (layer) {
        let coord;
        let latlng;
        let f1;
        if (layer._latlng)
            f1 = layer;
        else if (layer._layers) {
            let obj = layer._layers;
            f1 = obj[Object.keys(obj)[0]];
        }
        if (f1._latlng.lat)
            latlng = f1._latlng;
        else
            latlng = f1._latlng;
        coord = [latlng.lng, latlng.lat];

        return {type: "Point", coordinates: coord};
    },
    layerToGeometry(layer, type) {
        switch (type) {
            case 'Polygon':
                return MapHelper.layerToPolygon(layer)
                break;
            case 'Point':
                return MapHelper.layerToPoint(layer)
                break;
            case 'LineString':
                return MapHelper.layerToLine(layer)
                break;
        }
    },

    ell2Xyz: function(lon, lat, h) {
        lon = lon * Math.PI / 180;
        lat = lat * Math.PI / 180;
        const a = 6378137.0;
        const f = 1/298.257223563;
        const e2 = 1 - Math.pow(1 - f, 2);
        const v = a / Math.pow(1 - e2 * Math.sin(lat) * Math.sin(lat), 0.5);
        const x = (v + h) * Math.cos(lat) * Math.cos(lon);
        const y = (v + h) * Math.cos(lat) * Math.sin(lon);
        const z = (v * (1 - e2) + h) * Math.sin(lat);
        return {x, y, z};
    },

    dist: function(v1, v2) {
        return Math.pow(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2) + Math.pow(v2.z - v1.z, 2), 0.5);
    },

    dist2d: function(v1, v2) {
        return Math.pow(Math.pow(v2[0]  -v1[0] , 2) + Math.pow(v2[1]   - v2[1]  , 2) , 0.5);
    },

    buffer : function(polygon, dist) {
    return t_buffer(polygon, dist, {units: 'meters'});
},

    scaleFactor: function(lon, lat, h) {
        let lonlat = [lon, lat];
        const zone = this.lonlat2Zone(lonlat);
        const v1u = this.lonlat2xy(lonlat, zone);
        const v2u = Object.assign({}, v1u);
        v2u[0] += 100;
        const Du = 100;

        const v2LonLat = this.xy2lonlat([v2u[0], v2u[1]], zone);

        const v1e = this.ell2Xyz(lon, lat, h);
        const v2e = this.ell2Xyz(v2LonLat[0], v2LonLat[1], h);

        const De = this.dist(v2e, v1e);

        return De / Du;
    }

}

var cadColors = [
    0,
    16711680,
    16776960,
    65280,
    65535,
    255,
    16711935,
    16777215,
    4276545,
    8421504,
    16711680,
    16755370,
    12386304,
    12418686,
    8454144,
    8476246,
    6815744,
    6833477,
    5177344,
    5190965,
    16727808,
    16760746,
    12398080,
    12422526,
    8462080,
    8478806,
    6822144,
    6835781,
    5182208,
    5192501,
    16744192,
    16766122,
    12410368,
    12426622,
    8470528,
    8481622,
    6829056,
    6837829,
    5187328,
    5194293,
    16760576,
    16771754,
    12422400,
    12430718,
    8478720,
    8484438,
    6835712,
    6840133,
    5192448,
    5196085,
    16776960,
    16777130,
    12434688,
    12434814,
    8487168,
    8487254,
    6842368,
    6842437,
    5197568,
    5197621,
    12582656,
    15400874,
    9288960,
    11386238,
    6324480,
    7766358,
    5138432,
    6252613,
    3886848,
    4804405,
    8388352,
    13959082,
    6208768,
    10337662,
    4227328,
    7045462,
    3434496,
    5662789,
    2576128,
    4345653,
    4194048,
    12582826,
    3063040,
    9289086,
    2064640,
    6324566,
    1665024,
    5138501,
    1265408,
    3886901,
    65280,
    11206570,
    48384,
    8306046,
    33024,
    5669206,
    26624,
    4548677,
    20224,
    3493685,
    65343,
    11206591,
    48430,
    8306061,
    33055,
    5669216,
    26649,
    4548686,
    20243,
    3493691,
    65407,
    11206612,
    48478,
    8306077,
    33088,
    5669227,
    26676,
    4548694,
    20263,
    3493698,
    65471,
    11206634,
    48525,
    8306093,
    33120,
    5669238,
    26702,
    4548703,
    20283,
    3493705,
    65535,
    11206655,
    48573,
    8306109,
    33153,
    5669249,
    26728,
    4548712,
    20303,
    3493711,
    49151,
    11201279,
    36285,
    8302013,
    24705,
    5666433,
    20072,
    4546408,
    15183,
    3492175,
    32767,
    11195647,
    24253,
    8297917,
    16513,
    5663617,
    13416,
    4544104,
    10063,
    3490383,
    16383,
    11190271,
    11965,
    8293821,
    8065,
    5660801,
    6504,
    4542056,
    4943,
    3488591,
    255,
    11184895,
    189,
    8289981,
    129,
    5658241,
    104,
    4539752,
    79,
    3487055,
    4129023,
    12561151,
    3014845,
    9273021,
    2031745,
    6313601,
    1638504,
    5129576,
    1245263,
    3880271,
    8323327,
    13937407,
    6160573,
    10321597,
    4194433,
    7034497,
    3407976,
    5653864,
    2555983,
    4339023,
    12517631,
    15379199,
    9240765,
    11370173,
    6291585,
    7755393,
    5111912,
    6243688,
    3866703,
    4797775,
    16711935,
    16755455,
    12386493,
    12418749,
    8454273,
    8476289,
    6815848,
    6833512,
    5177423,
    5190991,
    16711871,
    16755434,
    12386445,
    12418733,
    8454240,
    8476278,
    6815822,
    6833503,
    5177403,
    5190985,
    16711807,
    16755412,
    12386398,
    12418717,
    8454208,
    8476267,
    6815796,
    6833494,
    5177383,
    5190978,
    16711743,
    16755391,
    12386350,
    12418701,
    8454175,
    8476256,
    6815769,
    6833486,
    5177363,
    5190971,
    3355443,
    5263440,
    6908265,
    8553090,
    12500670,
    16777215
]
