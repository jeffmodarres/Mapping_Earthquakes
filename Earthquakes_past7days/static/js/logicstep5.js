// Add console.log to check to see if our code is working.
console.log("working");

let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

let satellite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});


let baseMaps = {
    Street: streets,
    Dark: dark,
    Satellite : satellite
  };

// Create the map object with center and zoom level.
let map = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
})

// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();
let overlayNames = new L.layerGroup();
// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
    Earthquakes: earthquakes,
    Info: earthquakes
  };

  // Looping through our intervals to generate a label with a colored square for each interval.
 
// Add GeoJSON data.

// Create a style for the lines.
// let myStyle = {
//   color: "#ffffa1",
//   weight: 2
// }
// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 4;
}

function getColor(magnitude) {
  if (magnitude > 5) {
    return "#ea2c2c";
  }
  if (magnitude > 4) {
    return "#ea822c";
  }
  if (magnitude > 3) {
    return "#ee9c00";
  }
  if (magnitude > 2) {
    return "#eecc00";
  }
  if (magnitude > 1) {
    return "#d4ee00";
  }
  return "#98ee00";
}

const magnitudes = [0, 1, 2, 3, 4, 5];
const colors = [
  "#98ee00",
  "#d4ee00",
  "#eecc00",
  "#ee9c00",
  "#ea822c",
  "#ea2c2c"
];
// Create a legend control object.
let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend.
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");

for (var i = 0; i < magnitudes.length; i++) {
    console.log(colors[i]);
    div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
    return div;
// };

};

legend.addTo(map);
// This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into a function
// to calculate the radius.
function styleInfo(feature) {
  return {
    opacity: 0.5,
    fillOpacity: 0.5,
    fillColor: getColor(feature.properties.mag),
    color: getColor(feature.properties.mag),
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}


// d3.json('torontoNeighborhoods.json').then(function(data) {
  d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson').then(function(data) {
// console.log(data);
L.geoJSON(data, {

  // We turn each feature into a circleMarker on the map.
  
  pointToLayer: function(feature, latlng) {
              // console.log(data);
              return L.circleMarker(latlng);
          },
          onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
          },
          style : feature => styleInfo(feature),
      }).addTo(earthquakes);
      earthquakes.addTo(map);
  });
  
// L.geoJSON(data , {
// style :myStyle,
// onEachFeature: function(feature, layer) {
//           console.log(feature);
//           // return layer.bindPopup("<h2>Mag: " + feature.properties.mag + "</h2> <hr> <h4>Loc:" +feature.properties.place + "</h4> ");
//           return layer.circleMarker(feature.geometry.coordinates)
// }}).addTo(map);




// Grabbing our GeoJSON data.
// L.geoJSON(sanFranAirport).addTo(map);

// / Grabbing our GeoJSON data.
// L.geoJSON(sanFranAirport, {
//     // We turn each feature into a marker on the map.
//     pointToLayer: function(feature, latlng) {
//       console.log(feature);
//       return L.marker(latlng).bindPopup("<h2>" + feature.properties.city + "</h2>");
//     }

//   }).addTo(map);

// L.geoJSON(sanFranAirport, {
//     // We turn each feature into a marker on the map.
//     onEachFeature: function(feature, layer) {
//       console.log(feature);
//       return layer.bindPopup("<h2>" + feature.properties.city + "</h2> <hr> <h4>" +feature.properties.name + "</h4> ");
//     }

//   }).addTo(map);

// citiesData.forEach( function(city) {
//     console.log(city)

//     L.circleMarker(city.location, {
//         radius : city.population/5e5,
//         color: 'orange',
//         fillColor: "yellow",
//     }).addTo(map)


//     L.marker(city.location)
//     .bindPopup("<h2>" + city.city + ", " + city.state + "</h2> <hr> <h3>Population " + city.population.toLocaleString() + "</h3>")
//     .addTo(map);
// });
// // We create the tile layer that will be the background of our map.
// let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/satellite-v9',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: API_KEY
// });
// // Then we add our 'graymap' tile layer to the map.
// streets.addTo(map);

//  Add a marker to the map for Los Angeles, California.
// let marker = L.marker([34.0522, -118.2437]).addTo(map);
// L.circleMarker([34.0522, -118.2437], {
//     radius: 10,
//     color: 'black',
//     fillColor: "yellow"
//  }).addTo(map);

// We create the tile layer that will be the background of our map.


  L.control.layers(baseMaps,overlays).addTo(map);

// Then we add our 'graymap' tile layer to the map.
// streets.addTo(map);