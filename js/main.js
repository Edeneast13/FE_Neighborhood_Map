var locations = [
			{
				"title": "Brooklyn Bridge" ,
				"lat": 40.7030827,
				"long": -73.9951502,
				"street": "Brooklyn Bridge", 
				"city": "New York, NY" 
			},
			{
				"title": "Pier 1 Playground",
				"lat": 40.7007388,
				"long": -73.9947489,
				"street": "102 Furman Street", 
				"city": "Brooklyn, NY" 
			},
			{
				"title": "Pier 2 Roller Rink",
				"lat": 40.6994094,
				"long": -73.9974218,
				"street": "150 Furman Street", 
				"city": "Brooklyn, NY" 
			},
			{
				"title": "Jane's Carousel",
				"lat": 40.7013773,
				"long": -73.9972716,
				"street": "Dock Street", 
				"city": "Brooklyn, NY"
			},
			{
				"title": "Brooklyn Ice Cream Factory",
				"lat": 40.703179,
				"long": -73.9957897,
				"street": "1 Water Street", 
				"city": "Brooklyn, NY"
			},
			{
				"title": "Atrium Dumbo Restuarant",
				"lat": 40.7035667,
				"long": -73.9924536,
				"street": "15 Main Street", 
				"city": "Brooklyn, NY"
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

	this.visible = ko.observable(true);

	this.marker = new google.maps.Marker({
		position: new google.maps.LatLng(location.lat, location.long),
		map: map,
		title: location.name
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
		if(!click){
			self.marker.setAnimation(google.maps.Animation.BOUNCE);
			self.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
			self.showInfo();
			click = true;
		}
		else{
			self.marker.setAnimation(null);
			self.marker.setIcon(null);
			click = false;
		}
	});

	this.infoWindow = new google.maps.InfoWindow({
		maxWidth: 200
	});

	var placesRequest = {
		location: map.getCenter(),
		radius: '500',
		query: location.title
	};

	var service = new google.maps.places.PlacesService(map);
	service.textSearch(placesRequest, placesCallback);

	var placeId;

	function placesCallback(results, status){
		if(status == google.maps.places.PlacesServiceStatus.OK){
			this.placeId = results[0].place_Id;
			this.website = results[0].website;
		}
	};

	this.info = ko.computed(function(){
		return '<div>' + '<h3>' + self.website + '</h3>' + '</div>'
	});

	this.showInfo = function(){
		map.setCenter(this.marker.getPosition());
		this.infoWindow.setContent(this.info());
		this.infoWindow.open(map, self.marker);
	};
};

/* VIEW MODEL*/
function ViewModel(){
	var self = this;

	this.searchParam = ko.observable("");

	this.locationList = ko.observableArray([]);

	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: {lat: 40.7035, lng: -73.9939}
	});

	locations.forEach(function(item){
		self.locationList.push(new Place(item))
	});

	this.searchQuery = ko.computed(function(){
		var searchFilter = self.searchParam().toLowerCase();
		if(!searchFilter){
			self.locationList().forEach(function(item){
				item.visible(true);
			});
			return self.locationList();
		}
		else{
			return ko.utils.arrayFilter(self.locationList(), function(item){
				var string = item.title.toLowerCase();
				var result = (string.search(searchFilter) >= 0);
				item.visible(result);
				return result;
			});
		}
	}, self);
} // end view model

//call a new view model and apply it using ko
function initialize(){
	ko.applyBindings(new ViewModel());
}










