
$('#map').height(window.innerHeight);

$('.days').change(function(e){
	//switch(selectedDay){
	//	case 'monday':
			map.removeLayer(mondayMarkers);
		//	break;
		//case 'tuesday':
			map.removeLayer(tuesdayMarkers);
		//	break;
		//case 'wednesday':
			map.removeLayer(wednesdayMarkers);
		//	break;
		//case 'thursday':
			map.removeLayer(thursdayMarkers);
		//	break;
		//case 'friday':
			map.removeLayer(fridayMarkers);
		//	break;
		//case 'saturday':
			map.removeLayer(saturdayMarkers);
		//	break;
		//case 'sunday':
			map.removeLayer(sundayMarkers);
	//		break;
	//}

	selectedDay = $('.days option:selected').val().toLowerCase();
	$.getJSON('/bvenues.json', function(data){
		console.log(data);
	});
});

var selectedDay = $('.days option:selected').val().toLowerCase();

L.mapbox.accessToken = 'pk.eyJ1IjoiZGF2eWRrYSIsImEiOiIyOVlNT3ZZIn0.EmsgGuMUc0HoC43W0NJCcQ';
// Replace 'examples.map-i87786ca' with your map id.
var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v4/davydka.ljgd7beh/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
	attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});

var map = L.map('map')
	.addLayer(mapboxTiles)
	.setView([40.729017, -73.954034], 13);


var monday = [],
	tuesday= [],
	wednesday= [],
	thursday= [],
	friday= [],
	saturday= [],
	sunday= [];
var mondayMarkers,
	tuesdayMarkers,
	wednesdayMarkers,
	thursdayMarkers,
	fridayMarkers,
	saturdayMarkers,
	sundayMarkers;

var socket = io();
socket.on('map', function (data) {

	//console.log(data);

	//var marker = L.marker(data.latLong).addTo(map);
	var marker = L.marker(data.latLong);
	marker.bindPopup("<b>"+data.venue+"</b><br>"+data.event+"<br>"+data.entryDate+"<br><br>"+data.text, {className: data.day});

	switch(data.day){
		case 'monday':
			if(selectedDay == 'monday')
				monday.push(marker);
			break;
		case 'tuesday':
			if(selectedDay == 'tuesday')
				tuesday.push(marker);
			break;
		case 'wednesday':
			if(selectedDay == 'wednesday')
				wednesday.push(marker);
			break;
		case 'thursday':
			if(selectedDay == 'thursday')
				thursday.push(marker);
			break;
		case 'friday':
			if(selectedDay == 'friday')
				friday.push(marker);
			break;
		case 'saturday':
			if(selectedDay == 'saturday')
				saturday.push(marker);
			break;
		case 'sunday':
			if(selectedDay == 'sunday')
				sunday.push(marker);
			break;
	}

	monday = uniqueMarkers(monday);
	mondayMarkers = L.layerGroup(monday);
	mondayMarkers.addTo(map);

	tuesday = uniqueMarkers(tuesday);
	console.log(selectedDay);
	tuesdayMarkers = L.layerGroup(tuesday);
	tuesdayMarkers.addTo(map);

	wednesday = uniqueMarkers(wednesday);
	wednesdayMarkers = L.layerGroup(wednesday);
	wednesdayMarkers.addTo(map);

	thursday = uniqueMarkers(thursday);
	thursdayMarkers = L.layerGroup(thursday);
	thursdayMarkers.addTo(map);

	friday = uniqueMarkers(friday);
	fridayMarkers = L.layerGroup(friday);
	fridayMarkers.addTo(map);

	saturday = uniqueMarkers(saturday);
	saturdayMarkers = L.layerGroup(saturday);
	saturdayMarkers.addTo(map);

	sunday = uniqueMarkers(sunday);
	sundayMarkers = L.layerGroup(sunday);
	sundayMarkers.addTo(map);


});

$.getJSON('/bvenues.json', function(data){
	console.log(data);
});

function uniqueMarkers(markersArray){
	var uniqueMarkers = [];
	$.each(markersArray, function(i, el){
		if($.inArray(el, uniqueMarkers) === -1) uniqueMarkers.push(el);
	});
	return uniqueMarkers;
}