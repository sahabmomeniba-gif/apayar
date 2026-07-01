import persianJs from "persianjs";

export const createTextWithHeigth = (MapContainer, str, format = 'svg') => {
    switch (format) {
        case 'svg':
            var num = 2000
            var svg = document.createElementNS(`http://www.w3.org/${num}/svg`, 'svg');
            svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
            // svg.setAttribute('width', width);
            // svg.setAttribute('height', actualHeight);
            var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
            defs.innerHTML = `
            <style type="text/css">@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@200&display=swap')</style>`
                // var defsStyle = document.createElementNS('http://www.w3.org/2000/svg', 'style')
                //     // defsStyle.baseURI = './B-NAZANIN.TTF'
                // defsStyle.type = 'type="text/css"'
                // defsStyle.innerHTML = document.createTextNode("@font-face{font-family: naser;src: url('./B-NAZANIN.TTF');font-weight: normal;}");

            svg.appendChild(defs)
                // var font = `${20}px wcs_bNazanin`
                // text.style.font = font
            if (str === '') {
                text.textContent = ''
            } else {
                text.textContent = persianJs().englishNumber().toString();
            }

            text.setAttribute('x', '50%');
            text.setAttribute('y', '50%');
            text.setAttribute('fill', 'rgb(255,255,255)');
            text.style.dominantBaseline = 'central'
            text.style.textAnchor = 'middle'
                // text.style.fontFamily = 'Vazirmatn'
            text.style.fontFamily = 'wcs_bNazanin'
            svg.appendChild(text);
            MapContainer.appendChild(svg)
            var bbox = text.getBBox();
            svg.setAttribute('width', bbox.width * 1.25);
            svg.setAttribute('height', bbox.height * 1.25);
            //
            var data = (new XMLSerializer()).serializeToString(svg);
            // console.log(data)
            var DOMURL = window.URL || window.webkitURL || window;

            var svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });

            var url = DOMURL.createObjectURL(svgBlob);
            MapContainer.removeChild(svg)
            return {
                url: url,
                width: bbox.width,
                height: bbox.height
            }

            break;

        default:
            break;
    }
}