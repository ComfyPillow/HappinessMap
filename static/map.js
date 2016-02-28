var data = [];
var map;
var positive;
var negative;

var drawMap = function() {
	L.mapbox.accessToken = 'pk.eyJ1IjoiZ25nY3AiLCJhIjoiY2lsNXd5b3ZrMDA0a3UybHoxY3h5NGN3eiJ9.OrXfMbZ123f3f1EfPRCHHA';
	map = L.mapbox.map('map', 'gngcp.p97o5d8j').setView([40, -97], 5);
	var layer = L.mapbox.tileLayer('gngcp.p97o5d8j');
	layer.on('ready', function(){
		getData();
	});
}

var getData = function() {
	var source = new EventSource($SCRIPT_ROOT + "/tweets");
	
	/*source.addEventListener('message', function(e) {
	alert("test");
	  console.log(e.data);
	}, false);

	source.addEventListener('open', function(e) {
			alert("test");

		console.log(e.data);
	  // Connection was opened.
	}, false);

	source.addEventListener('error', function(e) {
	  if (e.readyState == EventSource.CLOSED) {
	  	console.log("closed");
	    // Connection was closed.
	  }
	}, false); */
	
	source.onmessage = function(event) {
	    console.log(JSON.parse(event.data));
	    data.push(JSON.parse(event.data));
	    //addLayers();
	    console.log(data);
	};  
}

var addLayers = function() {
	positive = new L.LayerGroup([]);
	negative = new L.LayerGroup([]);

	 for (i = 0; i < data.length; i++){
	    var circle = new L.circleMarker([data[i].lat, data[i].lng]).bindPopup(data[i].Summary);
	    circle.setRadius('5');

	    //Red if killed, gray if not
	    if (data[i]["Hit or Killed?"] == "Killed") {
	      circle.options.fillColor = '#870029';
	      circle.options.color = '#870029';
	    } else {
	      circle.options.fillColor = '#4CAF50';
	      circle.options.color = '#4CAF50';
	    } 

	    //Builds layer groups based on race
		if (data[i].Race == "Black or African American") {
	      positive.addLayer(circle);
	    } else {
	      negative.addLayer(circle);
	    }

	    populateFeed(data[i]);
	 } 
	 positive.addTo(map);
	 negative.addTo(map);
}



var populateFeed = function(data) {
	var infoPiece = document.createElement("div");
	infoPiece.className = "infoPiece";

	var textData = document.createElement("p");
	textData.innerHTML = data.Summary;
	infoPiece.appendChild(textData);

	$("#dataFeed").append(infoPiece);
}