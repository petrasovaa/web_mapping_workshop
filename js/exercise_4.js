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
var routeLine = L.mapbox.featureLayer().addTo(map)
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
//featureLayer.on('ready', function(){
//  this.eachLayer(function(layer){
//       layer.bindPopup('Welcome to ' + layer.feature.properties.name);
//})})
var clickHandler = function(e){
    $('#info').empty();
    var feature = e.target.feature;
  
    $('#sidebar').fadeIn(400, function(){
        var info = '';
        info += '<div>';
        info += '<h2>' + feature.properties.name + '</h2>';
        if (feature.properties.cuisine) 
            info += '<p>' + feature.properties.cuisine + '</p>';
        if (feature.properties.phone) 
            info += '<p>' + feature.properties.phone + '</p>';
        if (feature.properties.website) 
            info += '<p><a href="' + feature.properties.website + '">' + feature.properties.website + '</a></p>';
        info += '</div>'
        $('#info').append(info);
    })
    var myGeoJSON = myLocation.getGeoJSON();
    getDirections(myGeoJSON.geometry.coordinates, feature.geometry.coordinates)
}

featureLayer.on('ready', function(){
    this.eachLayer(function(layer){
    layer.on('click', clickHandler);
    })
})

map.on('click', function(){
    $('#sidebar').fadeOut(200);
     routeLine.clearLayers();
})


var myLocation = L.mapbox.featureLayer().addTo(map);
map.on('locationfound', function(e){
    myLocation.setGeoJSON({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [e.latlng.lng, e.latlng.lat]
        },
        properties: {
            "title": "Here I am!",
            "marker-color": "#ff8888",
           "marker-symbol": "star"
        }
    })
})
map.locate({setView: true})



function getDirections(from, to){
    var jsonPayload = JSON.stringify({
        locations: [
          {lat: from[1], lon: from[0]},
          {lat: to[1], lon: to[0]}
        ],
        costing: 'pedestrian',
        directionOptions: {
          units: 'miles'
        }
    })
    $.ajax({
        url: 'https://valhalla.mapzen.com/route',
        data: {
            json: jsonPayload,
            api_key: 'valhalla-DwRSpWy'
        }
    }).done(function(data){
        var routeShape = polyline.decode(data.trip.legs[0].shape)
        routeLine.setGeoJSON({
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: routeShape
            },
            properties: {
                "stroke": "#ed23f1",
                "stroke-opacity": 0.8,
                "stroke-width": 8
            }
        })
    $('#directions').fadeIn(400, function(){
        var summary = data.trip.summary
        $('summary').empty();
        $('#distance').text((Math.round(summary.length * 100) / 100) + ' ' + data.trip.units);
        $('#time').text((Math.round(summary.time, length / 60 * 100) /100)+ ' min');
    })
    })
}















