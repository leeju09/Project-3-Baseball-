 
 // Function to find the value of a specific attribute in a list of dictionaries
function findValueInList(list, attribute, valueToFind,valueToReturn) {
  for (let i = 0; i < list.length; i++) {
      if (list[i][attribute] === valueToFind) {
          return list[i][valueToReturn];
      }
  }
  return 0; // Return 0 if the value is not found
}
 
 //Creating Initial Map world map 
  let centLat= 44.97;
  let centLong= -103.78;
  // Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }); 

  // Create a baseMaps object to hold the streetmap layer.
  let baseMap = {
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
    return numPlayers=0
  };
  return numPlayers * 100
};

//this function returs the color as per the players count
function markerColor(numPlayers) {
  var color = "";
  if (numPlayers >= 0 && numPlayers <= 100) {
      return color = "black";
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
      return color = "grey";
  }
};

//Create marker group for individual palyers
function createMarkers(data) {
  
    // Initialize anarray to hold player markers.
    let allTypesMarkers=[];
    let allStarMarkers = []; 
    let hallofFameMarkers=[];

    // Loop through the all the earthquake array.
  for (let row = 0; row < data.length; row++) {
    playerData=data[row];  
    // For each all palyers, create a marker, and bind a popup with the sats .
    let allMaker = L.circle([playerData.lat,playerData.lon],{
        fillOpacity: 0.75,
        color: markerColor(playerData.total),
        radius: markerSize(playerData.total),
           
    }).bindPopup("<h4>State or Country:   "  + playerData.birthState + "</h4><hr><h4>Total Players:   " + playerData.total + "</h4>" + "<hr><h4> AllStars : " + playerData.allStar +  "</h4>" + "<hr><h4> HallOfFame : " + playerData.hallOfFame +  "</h4>");
    // Add the marker to the earthquakeMarkers array.
    allTypesMarkers.push(allMaker);

   //Creta a marker for allStar players
    let allStarMaker = L.circle([playerData.lat,playerData.lon],{
      fillOpacity: 0.75,
      color: markerColor(playerData.allStar),
      radius: markerSize(playerData.allStar)*10,
        
    }).bindPopup("<h4>State or Country:   "  + playerData.birthState + "</h4><hr><h4>Total Players:   " + playerData.total + "</h4>" + "<hr><h4> AllStars : " + playerData.allStar +  "</h4>" + "<hr><h4> HallOfFame : " + playerData.hallOfFame +  "</h4>");
    // Add the marker to the earthquakeMarkers array.
    allStarMarkers.push(allStarMaker);

   //Creta a marker for allStar players
   let hallOfFame = L.circle([playerData.lat,playerData.lon],{
    fillOpacity: 0.75,
    color: markerColor(playerData.hallOfFame),
    radius: markerSize(playerData.hallOfFame)*10,
    //title:cities[i].name      
  }).bindPopup("<h4>State or Country:   "  + playerData.birthState + "</h4><hr><h4>Total Players:   " + playerData.total + "</h4>" + "<hr><h4> AllStars : " + playerData.allStar +  "</h4>" + "<hr><h4> HallOfFame : " + playerData.hallOfFame +  "</h4>");
  // Add the marker to the earthquakeMarkers array.
  hallofFameMarkers.push(hallOfFame);
  }
    //add markers to the layer group
    allTypesMarkersGroup=L.layerGroup(allTypesMarkers);
    allStarMarkersGroup=L.layerGroup(allStarMarkers);
    hallofFameMarkersGroup=L.layerGroup(hallofFameMarkers);
   
    // Create an overlayMaps object to hold the states count layer.
    let overlayMaps = {
      "All Types": allTypesMarkersGroup, 
      "AllStar": allStarMarkersGroup,
      "HallOfFame":hallofFameMarkersGroup

    }; 

    allTypesMarkersGroup.addTo(myMap);
    allStarMarkersGroup.addTo(myMap);
    hallofFameMarkersGroup.addTo(myMap);

    L.control.layers(baseMap, overlayMaps, {
      collapsed: false
    }).addTo(myMap); 
   };

// end of player marker group

//Creattin choropleth map for only for USA palyers 
function usaMap(bbData) {
  // Load the boundaries of the states
  var geojsonData = './Resources/us-states.json';

  // Create a Leaflet map centered at a specific location
  var USmap = L.map('usamap').setView([37.0902, -95.7129], 4);

  // Add a tile layer to the map (e.g., OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenStreetMap contributors'
  }).addTo(USmap);

  // Create a choropleth layer
  fetch(geojsonData)
    .then(response => response.json())
    .then(data => {
      let geojson = L.choropleth(data, {
        valueProperty: function(feature) {
          return findValueInList(bbData, "birthState", feature.properties.code, "total");
        },
        scale: ["#ffffb2", "#b10026"],
        steps: 10,
        mode: 'q',
        style: {
          color: '#fff',
          weight: 1,
          fillOpacity: 0.8
        },
        // Binding a popup to each layer
        onEachFeature: function(feature, layer) {
          layer.bindPopup("<strong>" + feature.properties.name + "</strong><br /><br />Total players :" +
            findValueInList(bbData, "birthState", feature.properties.code, "total") + "<br /><br />AllStar : " +
            findValueInList(bbData, "birthState", feature.properties.code, "allStar") + "<br /><br />HallOfFame : " +
            findValueInList(bbData, "birthState", feature.properties.code, "hallOfFame")
            );
        }
      }).addTo(USmap);
      
      // Set up the legend.
      let legend = L.control({ position: "bottomright" });
      legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let limits = [0,200,400,600,800,1000,1200,1400,1900,2200]//geojson.options.limits;
        let colors = geojson.options.colors;
        let labels = [];

        // Add the minimum and maximum.
        let legendInfo = "<h5>Players Density <br />(1876-2015)</h1>" +
          "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
          "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      };

      // Adding the legend to the map
      legend.addTo(USmap);
    });
}

//function to build bar graph to using palyes DOB data bucket
function buildCharts(){
  //Read data from datasorce 
  d3.csv("./Resources/BirthYearBucket.csv").then(function(data) {
    //console.log(data);
    let xticks=[];
    let yticks=[];

    for (let row = 0; row < data.length; row++) {
      yearData=data[row];  
      xticks.push(yearData.Year_Bucket);
      yticks.push(yearData.numPlayers);
     }
  
// Build a Bar Chart
    let dataBar = [      {
          y: yticks, 
          x: xticks,
          type: 'bar',
          //orientation: 'h'
      }
      ];  
  // Layout configuration for the chart
   let layoutBar = {
      title: 'Players Birth Year Distribution'
   };
    // Render the Bar Chart
    Plotly.newPlot('bar', dataBar, layoutBar);
   
  });
}


// Function to run on page load
function init() {
  d3.csv("./Resources/Summary.csv").then(function(data) {   
  //console.log(data);  
  createMarkers(data,"all");
  usaMap(data);  
  });
  buildCharts(); 
};

// Initialize the dashboard
init();
