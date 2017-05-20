"use strict"

/* Location Data */
var locations = [
			{
				"title": "Brooklyn Bridge" ,
				"lat": 40.7030827,
				"long": -73.9951502,
				"street": "Brooklyn Bridge", 
				"city": "New York, NY", 
				"tag": "brooklynbridge"
			},
			{
				"title": "Brooklyn Navy Yard",
				"lat": 40.7034886,
				"long": -73.9805604,
				"street": "63 Flushing Avenue", 
				"city": "Brooklyn, NY",
				"tag": "brooklynnavalyard" 
			},
			{
				"title": "Kings County Distillery",
				"lat": 40.6994894,
				"long": -73.9808352,
				"street": "1299 Sands Street", 
				"city": "Brooklyn, NY",
				"tag": "kingscountrydistillery" 
			},
			{
				"title": "Jane's Carousel",
				"lat": 40.7013773,
				"long": -73.9972716,
				"street": "Dock Street", 
				"city": "Brooklyn, NY",
				"tag": "janescarousel"
			},
			{
				"title": "Brooklyn Ice Cream Factory",
				"lat": 40.703179,
				"long": -73.9957897,
				"street": "1 Water Street", 
				"city": "Brooklyn, NY",
				"tag": "brooklynicecreamfactory"
			},
			{
				"title": "Manhatten Bridge",
				"lat": 40.707222,
				"long": -73.9909,
				"street": "Manhatten Bridge", 
				"city": "Brooklyn, NY",
				"tag": "manhattenbridge"
			}
];

var map;

/* PLACE OBJECT */
var Place = function(location){
	var self = this;
	this.title = location.title;
	this.lat = location.lat;
	this.long = location.long;
	this.street = location.street;
	this.city = location.city;
	this.tag = location.tag;

	this.visible = ko.observable(true);

	this.marker = new google.maps.Marker({
		position: new google.maps.LatLng(location.lat, location.long),
		map: map,
		title: location.title
	});

	this.showMarker = ko.computed(function(){
		if(this.visible()){
			this.marker.setMap(map);
		}
		else{
			this.marker.setMap(null);
		}
		return true;
	}, this);

	var click = false;

	this.marker.addListener('click', function(){
		clickResponse();
	});

	//client id and token for instagram api
	var instaId = "71ae4a45b8674b438519df470f6b3c38";
	var instaToken = "601545510.ba4c844.92f529b80405478590b9206bd84e5497";

	//creates a new instafeed object 
	this.tagFeed = function(tag){
		var feed = new Instafeed({
			get: 'tagged',
			tagName: tag,
			accessToken: instaToken,
			sortBy: 'most-recent',
			limit: '21',
			error: function(){
				console.log("Instagram error");
				$('#instafeed').append("There seems to be something wrong with Instagram right now. ");
			}
		});
		feed.run();
	};

	function clickResponse(){
		if(!click){
			$('#instatag').empty();
			$('#instafeed').empty();
			$('#wiki').empty();
			self.marker.setAnimation(google.maps.Animation.BOUNCE);
			self.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
			setTimeout(function(){
				self.marker.setAnimation(null);
				self.marker.setIcon(null);
			}, 1400);
			self.tagFeed(self.tag);
			$('#instatag').append('#'+self.tag);
			wikiRequest(self.title);
			click = true;
		}
		else{
			self.marker.setAnimation(null);
			self.marker.setIcon(null);
			$('#instatag').empty();
			$('#instafeed').empty();
			$('#wiki').empty();
			click = false;
		}
	}
};

/* WIKIPEDIA */
function wikiRequest(title){
	console.log("Wiki called");

	//asynchronous call to wikipedia
	function request(){
		$.ajax({
			url: 'http://en.wikipedia.org/w/api.php',
			data: { action: 'opensearch', search: title, format: "json"},
			dataType: 'jsonp',
			success: processResult,
			error: processError
		});
	}

	function processResult(result){
		var response = result[2];
		$('#wiki').append("Wikipedia: " + response);
	}

	function processError(){
		console.log("Error");
		$('#wiki').append("Wikipedia: " + " There seems to be an issue with Wikipedia right now.");
	}

	request();
}//end wiki request

/* VIEW MODEL*/
function ViewModel(){
	var self = this;
	var markers = []; 

	this.searchParam = ko.observable("");

	this.locationList = ko.observableArray([]);

	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: {lat: 40.7035, lng: -73.9939}
	});

	locations.forEach(function(item){
		self.locationList.push(new Place(item))
	});

	self.titleClick = function(){
		console.log("Clicked");
		var context = ko.contextFor(event.target);
		google.maps.event.trigger(markers[context.$index()], 'click');
	}

	this.searchQuery = ko.computed(function(){
		var searchFilter = self.searchParam().toLowerCase();
		var marker;
		if(!searchFilter){
			self.locationList().forEach(function(item){
				item.visible(true);
				marker = item.marker;
				markers.push(marker);
			});
			return self.locationList();
		}
		else{
			return ko.utils.arrayFilter(self.locationList(), function(item){
				var string = item.title.toLowerCase();
				var result = (string.search(searchFilter) >= 0);
				item.visible(result);
				marker = item.marker;
				markers.push(marker);
				return result;
			});
		}
	}, self);
} // end view model

//call a new view model and apply it using ko
function initialize(){
	ko.applyBindings(new ViewModel());
}










