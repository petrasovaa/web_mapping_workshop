// Here is the javascript setup for a basic map:

// Enter your mapbox map id here to reference it for the base layer,
// this one references the ugly green map that I made.
var mapId = 'petrasovaa.019ho7jo';

// And this is my access token, use yours.
var accessToken = 'pk.eyJ1IjoicGV0cmFzb3ZhYSIsImEiOiJjaW5sNXlhbXYweXgydTJranVvYWZyZ3Q1In0.H97ncqzLRofNAmssApleoQ';

// Create the map object with your mapId and token,
// referencing the DOM element where you want the map to go.
L.mapbox.accessToken = accessToken;
var map = L.mapbox.map('map', mapId);

// Set the initial view of the map to the whole US
map.setView([39, -96], 4);

// Great, now we have a basic web map!

var dataToAdd = 'data/restaurants.geojson';
var featureLayer = L.mapbox.featureLayer();
featureLayer.loadURL(dataToAdd);
featureLayer.addTo(map);
featureLayer.on('ready', function(){
    this.eachLayer(function(layer){
      layer.setIcon(L.mapbox.marker.icon({
         "marker-color": "#8834bb",
         "marker-size": "large",
         "marker-symbol": "restaurant"
         }))
     })
    map.fitBounds(featureLayer.getBounds());
})
featureLayer.on('ready', function(){
  this.eachLayer(function(layer){
       layer.bindPopup('Welcome to' + layer.feature.properties.name);
})
})

