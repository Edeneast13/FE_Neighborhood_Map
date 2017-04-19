
var locations = {
	"places": [
			{
				"title": "Brooklyn Bridge" ,
				"lat": 40.7030827,
				"long": -73.9951502,
				"keyWords": ["bridge", "brooklyn", "historic", "monument"],
				"street": "Brooklyn Bridge", 
				"city": "New York, NY" 
			},
			{
				"title": "Pier 1 Playground",
				"lat": 40.7007388,
				"long": -73.9947489,
				"keyWords": ["park", "water", "hudson", "oudoors"],
				"street": "102 Furman Street", 
				"city": "Brooklyn, NY" 
			},
			{
				"title": "Pier 2 Roller Rink",
				"lat": 40.6994094,
				"long": -73.9974218,
				"keyWords": ["sports", "water", "hudson", "skating"],
				"street": "150 Furman Street", 
				"city": "Brooklyn, NY" 
			},
			{
				"title": "Brooklyn Bridge Garden Bar",
				"lat": 40.6994091,
				"long": -73.9974218,
				"keyWords": ["social", "bar", "bridge", "drinks"],
				"street": "12 Furman Street", 
				"city": "Brooklyn, NY" 
			},
			{
				"title": "Dumbo Arts Festival",
				"lat": 40.7013773,
				"long": -73.9972716,
				"keyWords": ["social", "art"],
				"street": "45 Main Street #602", 
				"city": "Brooklyn, NY"
			},
			{
				"title": "Jane's Carousel",
				"lat": 40.7013773,
				"long": -73.9972716,
				"keyWords": ["social", "outdoors", "game"],
				"street": "Dock Street", 
				"city": "Brooklyn, NY"
			}
		]
};

var viewModel = function(){
	var self = this;

	this.Location = function(title, lat, lng, keyWords, street, city){
		this.title = ko.observable(title);
		this.lat = ko.observable(lat);
		this.lng = ko.observable(lng);
		this.keyWords = ko.observableArray(keyWords);
		this.street = ko.observable(street);
		this.city = ko.observable(city);

	this.marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat, lng),
		animation: google.maps.Animation.DROP,
		title: title
	});

	var currentLocal = this;
	this.expandableInfo = ko.computed(function(){
		return '<div>' + '<h3>' 
			+ currentLocal.title() 
			+ '</h3>' + '<div><p>' 
			+ currentLocal.keyWords().join(', ')
			+ '<br><br>'
			+'</div></p></div>'
	});

	google.maps.event.addListener(this.marker, 'click', function(){
		currentLocal.expandableInfo();
	});

	this.expandableInfo = function(){
		map.setCenter(currentLocal.marker.getPosition());
	};

	this.marker.setMap(map);
};

this.getLocationList = function(){
	var places = [];
	var keyWords = []; 

		for(var i = 0; i < locations.places.length; i++){
			for (var j = 0; j < locations.places[i].keyWords.length; j++) {
				keyWords.push(locations.places[i].keyWords[j]);
			}
			places.push(ko.observable(new self.Location(locations.places[i].title, locations.places[i].lat, locations.places[i].long, keyWords, locations.places[i].street, locations.places[i].city)));
		}
		return places;
	};

	this.allLocations = ko.observable(this.getLocationList());

	var defaultString = "Search";
	this.searchString = ko.observable(defaultString);

	this.places = ko.computed(function(){
		var filteredPlaces = ko.observableArray();
		var filter = self.searchString.toLowerCase();
		self.allLocations().forEach(function(location){
			location().marker.setVisible(false);

			if(location().title().toLowerCase().indexOf(filter) != -1 || self.searchString() === defaultString){
				filteredPlaces.push(location());
				location().marker.setVisible(true);
			}
			else{
				var words = location().keyWords();
				if(words[i].toLowerCase.indexOf(filter) != -1){
					filteredPlaces.push(location());
					location().marker.setVisible(true);
				}
			}
		});
		return filteredPlaces();
	});
};

$(function(){
	ko.applyBindings(viewModel);
});










