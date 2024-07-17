//Central point 
let centLat= 44.97;
let centLong= -103.78;

// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}); 

// Create a baseMaps object to hold the streetmap layer.
let baseMaps = {
"Street Map": streetmap
};
//Create the base map
let myMap = L.map("map", {
  center: [centLat, centLong],
  zoom: 3,
  layers: [streetmap]

});

//This function accept the player count and return the size of the mrker accordingly. 
function markerSize(numPlayers) {
  if (numPlayers === 0) {
    return magnitude * 1
  };
  return numPlayers * 100
};


//this function returs the color as per the players count
function markerColor(numPlayers) {
  var color = "";
  if (numPlayers >= 0 && numPlayers <= 100) {
      return color = "#98ee00";
  }
  else if (numPlayers > 100 && numPlayers <= 200) {
      return color = "#d4ee00";
  }
  else if (numPlayers > 200 && numPlayers <= 300) {
      return color = "#eecc00";
  }
  else if (numPlayers > 300 && numPlayers <= 500) {
      return color =  "#ee9c00";
  }
  else if (numPlayers > 500 && numPlayers <= 1000) {
      return color = "#ea822c";
  }
  else if (1000 < numPlayers) {
      return color = "#ea2c2c";
  }
  else {
      return color = "black";
  }
};

//Create marker group for individual palyers
function createPlayerMarkers(data) {

  // Initialize anarray to hold player markers.
  let playerMarkers = [];

  // Loop through the all the earthquake array.
  for (let row = 0; row < data.length; row++) {
    playerData=data[row];
  
    // For each earthquake, create a marker, and bind a popup with the tittle and the place.
    let PlayerMaker = L.circle([playerData.lat,playerData.lon],{
        fillOpacity: 0.75,
        color: markerColor(playerData.total),
        radius: markerSize(playerData.total),
        //title:cities[i].name      
    }).bindPopup("<h4>State or Country:   "  + playerData.birthState + "</h4><hr><h4>Active Players:   " + playerData.activeTotal + "</h4>" + "<hr><h4> Inactive " + playerData.inactiveTotal + "</h4>");

    // Add the marker to the earthquakeMarkers array.
    playerMarkers.push(PlayerMaker);
  }

  //Return the layer group the main function
  return L.layerGroup(playerMarkers)
}
// end of player marker group

// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field


    // Filter the metadata for the object with the desired sample number


    // Use d3 to select the panel with id of `#sample-metadata`


    // Use `.html("") to clear any existing metadata


    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field


    // Filter the samples for the object with the desired sample number


    // Get the otu_ids, otu_labels, and sample_values


    // Build a Bubble Chart


    // Render the Bubble Chart


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately


    // Render the Bar Chart

  });
}

// Function to run on page load

function init() {
  // Load the CSV file using D3
d3.csv("Summary.csv").then(function(data) {
  // Work with the data
  console.log(data); // Output the data to the console

/*
const groupByStates = data.reduce((acc, obj) => {
  const key = obj.birthState;
  if (!acc[key]) {
      acc[key] = {location:[obj.lat,obj.lon],numPlayers:0};
  }
  acc[key].numPlayers++;
  return acc;
}, {});

console.log(groupByStates)
*/
playerMarkerGroup=createPlayerMarkers(data);
 // Create an overlayMaps object to hold the states count layer.
 let overlayMaps = {
  "States Counts": playerMarkerGroup
};

playerMarkerGroup.addTo(myMap);

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);   

  });
}
  

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected

}

// Initialize the dashboard
init();
