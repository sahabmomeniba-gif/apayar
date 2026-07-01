export const isEqualPoint = (point1, point2, ts) => {
    // console.log(point1, point2)
    if (!ts) ts = 10000
    let dx = Math.abs(point1[0] - point2[0]);
    let dy = Math.abs(point1[1] - point2[1]);
    if (dx <= 1 / ts && dy <= 1 / ts) {

        return true
    } else {
        return false
    }
}