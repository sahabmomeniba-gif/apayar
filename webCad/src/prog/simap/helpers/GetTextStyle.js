import { Fill, Stroke, Text } from "ol/style";

export const getText = function(text, resolution, type, maxResolution, placement) {
    // console.log(resolution, maxResolution)
    if (resolution > maxResolution) {
        text = '';
    } else if (type == 'hide') {
        text = '';
    } else if (type == 'shorten') {
        if (text) text = text.trunc(12);
    } else if (
        type == 'wrap' &&
        (!placement || placement != 'line')
    ) {
        if (text) text = stringDivider(text, 16, '\n');
    }
    // console.log(text)
    return text;
};
String.prototype.trunc =
    String.prototype.trunc ||
    function(n) {
        return this.length > n ? this.substr(0, n - 1) + '...' : this.substr(0);
    };
export const createTextStyle = function(text, resolution, options) {
    // console.log(text)
    const align = options.align;
    const baseline = options.align;
    const size = options.size;
    const offsetX = parseInt(options.offsetX, 10);
    const offsetY = parseInt(options.offsetY, 10);
    const placement = options.placement ? options.placement : 'point'
    const maxAngle = options.maxangle
    const overflow = options.overflow !== undefined ? options.overflow : undefined;
    const fontFamily = options.fontFamily ? options.fontFamily : 'wcs_bNazanin';
    const rotation = parseFloat(options.rotation ? options.rotation : 0);
    const font = `normal ${size}px ${fontFamily}`;
    const fillColor = options.fillColor ? options.fillColor : 'rgba(255,255,255,1)';
    const outlineColor = options.outlineColor ? options.outlineColor : '';
    const outlineWidth = parseInt(options.outlineWidth, 10);
    const type = options.type ? options.type : 'normal'
    const maxResolution = options.maxResolution ? options.maxResolution : 1200
        // console.log('s2')
        // console.log(getText(text, resolution, type, maxResolution, placement))
    return new Text({
        textAlign: align == '' ? undefined : align,
        textBaseline: baseline,
        font: font,
        text: getText(text, resolution, type, maxResolution, placement),
        fill: new Fill({ color: fillColor }),
        stroke: new Stroke({ color: outlineColor, width: outlineWidth }),
        offsetX: offsetX,
        offsetY: offsetY,
        placement: placement,
        maxAngle: maxAngle,
        overflow: overflow,
        rotation: rotation,
    });
};

function stringDivider(str, width, spaceReplacer) {
    if (str.length > width) {
        let p = width;
        while (p > 0 && str[p] != ' ' && str[p] != '-') {
            p--;
        }
        if (p > 0) {
            let left;
            if (str.substring(p, p + 1) == '-') {
                left = str.substring(0, p + 1);
            } else {
                left = str.substring(0, p);
            }
            const right = str.substring(p + 1);
            return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
        }
    }
    return str;
}