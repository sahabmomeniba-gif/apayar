var exampleNS = {};

        exampleNS.getRendererFromQueryString = function () {
            var obj = {}, queryString = location.search.slice(1),
                re = /([^&=]+)=([^&]*)/g, m;

            while (m = re.exec(queryString)) {
                obj[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            }
            if ('renderers' in obj) {
                return obj['renderers'].split(',');
            } else if ('renderer' in obj) {
                return [obj['renderer']];
            } else {
                return undefined;
            }
        };

        var renderer = exampleNS.getRendererFromQueryString();
        var isWebgl = renderer && renderer[0].toLowerCase() == 'webgl';

        // console.log(renderer);
        var style = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.6)'
            }),
            stroke: new ol.style.Stroke({
                color: '#319FD3',
                width: 1
            }),
            text: isWebgl ? undefined : new ol.style.Text({
                font: '12px Calibri,sans-serif',
                fill: new ol.style.Fill({
                    color: '#000'
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 3
                })
            })
        });
        

        var styles = [style];
       
        // console.log(styles);
        //debugger;
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                url: 'https://dev.camptocamp.com/files/gberaudo/webgl_polygons_lines/examples/data/geojson/countries.geojson',
                format: new ol.format.GeoJSON()
            }),
            style: function (feature, resolution) {
                return styles;
            }
        });

        console.table(vectorLayer);

        var map = new ol.Map({
            layers: [
              new ol.layer.Tile({
                  source: new ol.source.MapQuest({ layer: 'sat' })
              }),
              vectorLayer
            ],
            target: 'map',
            view: new ol.View({
                center: [0, 0],
                zoom: 1
            }),
        });

        var highlightStyleCache = {};

        var featureOverlay = new ol.FeatureOverlay({
            map: map,
            style: function (feature, resolution) {
                var text = resolution < 5000 ? feature.get('name') : '';
                if (!highlightStyleCache[text]) {
                    highlightStyleCache[text] = [new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#f00',
                            width: 1
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255,0,0,0.1)'
                        }),
                        text: isWebgl ? undefined : new ol.style.Text({
                            font: '12px Calibri,sans-serif',
                            text: text,
                            fill: new ol.style.Fill({
                                color: '#000'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#f00',
                                width: 3
                            })
                        })
                    })];
                }
                return highlightStyleCache[text];
            }
        });

        var highlight;
        var displayFeatureInfo = function (pixel) {

            var feature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                return feature;
            });

            var info = document.getElementById('info');
            if (feature) {
                info.innerHTML = feature.getId() + ': ' + feature.get('name');
            } else {
                info.innerHTML = '&nbsp;';
            }

            if (feature !== highlight) {
                if (highlight) {
                    featureOverlay.removeFeature(highlight);
                }
                if (feature) {
                    featureOverlay.addFeature(feature);
                }
                highlight = feature;
            }

        };

        map.on('pointermove', function (evt) {
            if (evt.dragging) {
                return;
            }
            var pixel = map.getEventPixel(evt.originalEvent);
            displayFeatureInfo(pixel);
        });

        map.on('click', function (evt) {
            displayFeatureInfo(evt.pixel);
        });