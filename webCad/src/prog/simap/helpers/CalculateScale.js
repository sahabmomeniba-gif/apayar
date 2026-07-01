import { METERS_PER_UNIT } from "ol/proj";

var INCHES_PER_UNIT = {
    'm': 39.37,
    'dd': 4374754
  };
var DOTS_PER_INCH = 72;

export const getScaleFromResolution = function(resolution, units, opt_round) {
    var scale = INCHES_PER_UNIT[units] * DOTS_PER_INCH * resolution;
    if (opt_round) {
      scale = Math.round(scale);
    }
    return scale;
  };

export const  mapScale =  (map,dpi)=> {
    var unit = map.getView().getProjection().getUnits();
    var resolution = map.getView().getResolution();
    var inchesPerMetre = 39.37;

    return resolution * METERS_PER_UNIT[unit] * inchesPerMetre * dpi;
}