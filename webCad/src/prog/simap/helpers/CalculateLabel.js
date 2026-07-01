import calculateCenter from "./CalculateCenter";

export const calculateLineLablePosition = (feature, offset) => {
    // let lineOffset
    let rotate;
    let [xc, yc] = calculateCenter(feature).center
    let croods = feature.getGeometry().getCoordinates()
    let [xs, ys] = [croods[0][0], croods[0][1]]
    let [xe, ye] = [croods[1][0], croods[1][1]]
    let distance_SC = Math.sqrt(Math.pow((xc - xs), 2) + Math.pow((yc - ys), 2))

    let alpha = Math.atan(offset / distance_SC);
    let beta = Math.PI / 2
    let X = ((xs / Math.tan(beta)) + (xc / Math.tan(alpha)) + ys - yc) / ((1 / Math.tan(alpha)) + (1 / Math.tan(beta)))
    let Y = ((ys / Math.tan(beta)) + (yc / Math.tan(alpha)) + xc - xs) / ((1 / Math.tan(alpha)) + (1 / Math.tan(beta)))
    rotate = -Math.atan((yc - ys) / (xc - xs))
        // let L;
        // if(offset ===0){
        //   L = 0
        // }
        // else{
        //   L = offset/Math.cos(angle1)
        // }
        // let angle0 = Math.atan(Math.abs(xc-xs)/Math.abs(yc-ys))
        // let angle2 = angle0- angle1
        // let m1 = Math.tan(angle0)
        // let m2 = -1/Math.tan(angle2)
        // let X = (m1*xs-ys+yc-m2*xc)/(m1-m2)
        // let Y = m1*X+ys-m1*xs
        // console.log(X,Y)

    if (xs >= xc) {

        rotate = -Math.atan((yc - ys) / (xc - xs))
    } else {

        rotate = -Math.atan((yc - ys) / (xc - xs)) + Math.PI
    }

    return { offset: [X, Y], rotate: rotate }
}