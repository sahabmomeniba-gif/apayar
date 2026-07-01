export const getVertex = feature=>{
    let geometry = feature.getGeometry()
   
    let center, coordinates, minRadius;
    let linesCenter = [];
    let type = geometry.getType();
    switch (type) {
        case 'Polygon':
          let x = 0;
          let y = 0;
          let i = 0;
          coordinates = geometry.getCoordinates()[0]
          for (let index = 0; index < coordinates.length-1; index++) {
              x += coordinates[index][0];
              y += coordinates[index][1];
              i++;
              linesCenter.push([(coordinates[index][0]+coordinates[index+1][0])/2,(coordinates[index][1]+coordinates[index+1][1])/2])
          }
          center = [x / i, y / i];
          break;
        case 'LineString':
          center = geometry.getCoordinateAt(0.5);
          coordinates = geometry.getCoordinates();
          for (let index = 0; index < coordinates.length; index++) {
            if(index != coordinates.length-1){
                linesCenter.push([(coordinates[index][0]+coordinates[index+1][0])/2,(coordinates[index][1]+coordinates[index+1][1])/2])
            }
        }
          break
        case 'Circle':
          center = geometry.getCenter()       
          var radius = geometry.getRadius()
          coordinates = [[center[0]+radius,center[1]],[center[0]-radius,center[1]],[center[0],center[1]+radius],[center[0],center[1]-radius]]
          break;
        case 'Point':
          center = geometry.getCoordinates();
          coordinates = []
          // console.log(geometry)
          break;
        
    }
    let sqDistances;
    if (coordinates) {
      sqDistances = coordinates.map(function (coordinate) {
        const dx = coordinate[0] - center[0];
        const dy = coordinate[1] - center[1];
        return dx * dx + dy * dy;
      });
      minRadius = Math.sqrt(Math.max.apply(Math, sqDistances)) / 3;
    } else {
      minRadius =
        Math.max(
            geometry.getWidth(geometry.getExtent()),
            geometry.getHeight(geometry.getExtent())
        ) / 3;
    }
    return {
      center: center,
      vertexs: coordinates,
      linesCenter:linesCenter,
      sqDistances:sqDistances,
      minRadius:minRadius
    };
}

export default getVertex