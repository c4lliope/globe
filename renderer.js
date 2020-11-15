// Create a WorldWindow for the canvas.
var wwd = new WorldWind.WorldWindow("canvasOne");

wwd.addLayer(new WorldWind.BMNGOneImageLayer());
wwd.addLayer(new WorldWind.BMNGLandsatLayer());

wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

// Add Michigan counties
var polygonLayer = new WorldWind.RenderableLayer();
wwd.addLayer(polygonLayer);

var json = {
    type: "FeatureCollection",
    properties: {
        kind: "state",
        state: "MI"
    },
    features:[{
        type: "Feature",
        properties: {
            kind: "county",
            name: "Kalamazoo",
            state: "MI"
        },
        geometry:{
            type:"MultiPolygon",
            coordinates: [[[
                [-85.5410,42.4224],
                [-85.3000,42.4170],
                [-85.2945,42.0719],
                [-85.3000,42.0719],
                [-85.7655,42.0719],
                [-85.7655,42.4224]
            ]]]
        }
    }]
}
var kalamazoo = new WorldWind.GeoJSONParser(json)
kalamazoo.addRenderablesForFeatureCollection(polygonLayer, json)
var annArborJSON = {"type":"FeatureCollection","properties":{"kind":"state","state":"MI"},"features":[
    {"type":"Feature","properties":{"kind":"county","name":"Washtenaw","state":"MI"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-83.5528,42.4334],[-83.5419,42.0829],[-83.7719,42.0829],[-84.1334,42.0719],[-84.1334,42.4224],[-83.6624,42.4334]]]]}}
    ]}
var annArbor = new WorldWind.GeoJSONParser(annArborJSON)
annArbor.addRenderablesForFeatureCollection(polygonLayer, annArborJSON)

// Add WMS imagery
var serviceAddress = "https://neo.sci.gsfc.nasa.gov/wms/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";
var layerName = "MOD_LSTD_CLIM_M";

var createLayer = function (xmlDom) {
    var wms = new WorldWind.WmsCapabilities(xmlDom);
    var wmsLayerCapabilities = wms.getNamedLayer(layerName);
    var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
    var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
    wwd.addLayer(wmsLayer);
};

var logError = function (jqXhr, text, exception) {
    console.log("There was a failure retrieving the capabilities document: " +
        text +
    " exception: " + exception);
};

$.get(serviceAddress).done(createLayer).fail(logError);