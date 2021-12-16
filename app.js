import { countryData } from "./world.js";

// GAME LOGIC STUFF
let countriesSelected = [];
let countriesChosen = [];
let layerList = [];

function checkForMatch(e) {
  const optionOne = countriesSelected[0];
  const optionTwo = countriesSelected[1];

  if (optionOne === optionTwo) {
    // remove both counties from list of countries
    console.log("same");
    map.removeLayer(e.target);
    resetHighlight(e);
  } else {
    console.log("try again");
  }
  countriesSelected = [];
}

// MAP SETUP
var map = L.map("map", { worldCopyJump: true }).setView([0, 0], 2);

var tiles = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
  {
    maxZoom: 18,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox/light-v9",
    tileSize: 512,
    zoomOffset: -1,
  }
).addTo(map);

// get color depending on population density value
function getColor(d) {
  return d == "SouthAmerica"
    ? "#08519c"
    : d == "Asia"
    ? "#c6dbef"
    : d == "Oceania"
    ? "#9ecae1"
    : d == "NorthAmerica"
    ? "#6baed6"
    : d == "Africa"
    ? "#3182bd"
    : d == "Europe"
    ? "#08519c"
    : "#FFEDA0";
}

function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,

    fillColor: getColor(feature.properties.region),
  };
}

// Loading the world data
var geojson = L.geoJson(countryData, {
  style: style,
  onEachFeature: onEachFeature,
}).addTo(map);

// ON CLICK BEHAVIOUR
// Highlights
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 2,
    color: "#777",
    dashArray: "",
    fillOpacity: 0.7,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
}

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

// The selection function and currently the logic
function selectFeature(e) {
  var layer = e.target;
  // map.fitBounds(e.target.getBounds());
  console.log(e.target.feature.properties);
  countriesSelected.push(e.target.feature.properties.country);
  console.log(countriesSelected);

  // LOGIC
  if (countriesSelected.length > 1) {
    checkForMatch(e);
  }

  layer.setStyle({
    weight: 0,
    fillColor: "#777",
    color: "#777",
    dashArray: "",
    fillOpacity: 0.7,
  });
}

function randomValueGenerator(feature) {
  // assign an additonal value
  // 43 features need only 42, delete Argentina
  if (feature.properties.country === "Brazil") {
    console.log(feature);
  }

  var numberOfCountries = layerList.length;
  console.log(numberOfCountries);
  feature.properties.matchingGame = numberOfCountries;
}

// adding the event listeners to each polygon
function onEachFeature(feature, layer) {
  layerList.push(feature);

  randomValueGenerator(feature);
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: selectFeature,
  });
  layer.bindTooltip(feature.properties.country, {
    permanent: true,
    direction: "center",
    className: "country",
  });
}

console.log(layerList.length);
console.log(layerList[0]);
