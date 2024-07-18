  //Central point 
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
    return numPlayers * 1
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
function createMarkers(data,pStatus) {
    
    let total=0;
    let allStar=0;
    let hallOfFame=0;
   
    // Initialize anarray to hold player markers.
    let allStarMarkers = [];    
    let allTypesMarkers=[];
    let hallofFameMarkers=[];

    //select the data as per the user selected 
    if (pStatus==="all"){
      total=data.total;	    

    }
    else if (pStatus==="active"){
      total=data.activeTotal;
      allStar=data.aAllStar;
      hallOfFame=data.aHallOfFame;		
    }
    else if (pStatus==="inactive"){
      total=data.inactiveTotal;
      allStar=data.inaAllStar
      hallOfFame=data.inaHallOfFame

    }
    // Loop through the all the earthquake array.
  for (let row = 0; row < data.length; row++) {
    playerData=data[row];  
    // For each all palyers, create a marker, and bind a popup with the sats .
    let allMaker = L.circle([playerData.lat,playerData.lon],{
        fillOpacity: 0.75,
        color: markerColor(playerData.total),
        radius: markerSize(playerData.total),
        //title:cities[i].name      
    }).bindPopup("<h4>State or Country:   "  + playerData.birthState + "</h4><hr><h4>Active Players:   " + playerData.activeTotal + "</h4>" + "<hr><h4> Inactive " + playerData.inactiveTotal + "</h4>");
    // Add the marker to the earthquakeMarkers array.
    allTypesMarkers.push(allMaker);

   //Creta a marker for allStar players
    let allStarMaker = L.circle([playerData.lat,playerData.lon],{
      fillOpacity: 0.75,
      color: markerColor(allStar),
      radius: markerSize(allStar),
      //title:cities[i].name      
    }).bindPopup("<h4>State or Country:   "  + playerData.birthState + "</h4><hr><h4>Active Players:   " + playerData.activeTotal + "</h4>" + "<hr><h4> Inactive " + playerData.inactiveTotal + "</h4>");
    // Add the marker to the earthquakeMarkers array.
    allStarMarkers.push(allStarMaker);

   //Creta a marker for allStar players
   let hallOfFame = L.circle([playerData.lat,playerData.lon],{
    fillOpacity: 0.75,
    color: markerColor(allStar),
    radius: markerSize(allStar),
    //title:cities[i].name      
  }).bindPopup("<h4>State or Country:   "  + playerData.birthState + "</h4><hr><h4>Active Players:   " + playerData.activeTotal + "</h4>" + "<hr><h4> Inactive " + playerData.inactiveTotal + "</h4>");
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

// function to build both charts
function buildCharts(playerStatus) {
  //Read data from datasorce 
  d3.csv("SampleData.csv").then(function(data) {
    
   // Filter the samples for the object with the desired sample number
   function filterDatabyStatus(data, paraStatus) {
    return data.filter(obj => obj.activestatus === paraStatus);
    };
   if (playerStatus==='all'){
    let playerData=data;
   }
   else if (playerStatus==='active'){
    let playerData=filterDatabyStatus(data,'Active')

   }
   else if (playerStatus==='inactive'){
    let playerData=filterDatabyStatus(data,'Inactive')

   }

   // Sort the data by the 'age' field in ascending order
   data.sort((a, b) => b.H - a.H);
   let topTenPlayers=data.slice(0,11)
   console.log(topTenPlayers)
   let topTenPlayersNames=[];
   let topTenPlayersScore=[];
   let topTenPlayersBirhtPlace=[];
   let topTenPlayersHits=[];

   for (let i = 0; i <= 10; i++) {
    topTenPlayersNames.push(topTenPlayers[i].nameGiven);
    topTenPlayersScore.push(topTenPlayers[i].H);
    topTenPlayersBirhtPlace.push(topTenPlayers[i].birthCountry+"-" + topTenPlayers[i].birthState +"-"+ topTenPlayers[i].birthCity ) ;
   }
// Build a Bar Chart
    let dataBar = [
      {
          y: topTenPlayersScore, 
          x: topTenPlayersNames,
          type: 'bar',
          hoverinfo:topTenPlayersBirhtPlace
          //orientation: 'h'
      }
      ];
  
  // Layout configuration for the chart
   let layoutBar = {
      title: 'Top 10 hitters'
   };


    // Render the Bar Chart
    Plotly.newPlot('bar', dataBar, layoutBar);
   
  });
}

// Function to run on page load
function init() {
  d3.csv("Summary.csv").then(function(data) {
  createMarkers(data,"all");
  buildCharts('active');
  });
};
  

// Function for event listener
function optionChanged(playerStatus) {
  console.log(playerStatus)
  //createMarkers(data,playerStatus);
  buildCharts(playerStatus);
  
}

// Initialize the dashboard
init();
