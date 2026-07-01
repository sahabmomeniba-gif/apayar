import proj4 from "proj4";
export const xy2latlon = (x,y,zone)=>{
    console.log(`EPSG:326${zone}`)
    var fromProj = proj4.defs(`EPSG:326${zone}`);
    var toProf = proj4.defs('EPSG:4326');
    return proj4(fromProj, toProf, [x, y]) // [lat, lng]
}
export const latlon2xy = (lat,lon,zone)=>{
    var fromProj = proj4.defs('EPSG:4326');
    var toProf = proj4.defs(`EPSG:326${zone}`);
    return proj4(fromProj, toProf, [lat, lon]) // [lat, lng]
}

export const RotateTranslate2dTransform = (coordinate,radius,angle)=>{
    return [coordinate[0]+radius*Math.cos(Math.PI*angle/180),coordinate[1]+radius*Math.sin(Math.PI*angle/180)]
}