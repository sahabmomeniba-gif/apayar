const calculateCenter= feature=> {
    let geometry = feature.getGeometry()
    // console.log(geometry)
    let center, coordinates, minRadius;
    const type = geometry.getType();
    // console.log(type)
    if (type === 'Polygon') {
      let x = 0;
      let y = 0;
      let i = 0;
      coordinates = geometry.getCoordinates()[0].slice(1);
      coordinates.forEach(function (coordinate) {
        x += coordinate[0];
        y += coordinate[1];
        i++;
      });
      center = [x / i, y / i];
    } else if (type === 'LineString') {
      center = geometry.getCoordinateAt(0.5);
      coordinates = geometry.getCoordinates();
    } else {
      center = geometry.getCenter(geometry.getExtent());
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
      coordinates: coordinates,
      minRadius: minRadius,
      sqDistances: sqDistances,
    };
  }

export default calculateCenter