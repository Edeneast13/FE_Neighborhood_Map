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
				"title": "Pier 1 Playground",
				"lat": 40.7007388,
				"long": -73.9947489,
				"street": "102 Furman Street", 
				"city": "Brooklyn, NY",
				"tag": "pier1playground" 
			},
			{
				"title": "Pier 2 Roller Rink",
				"lat": 40.6994094,
				"long": -73.9974218,
				"street": "150 Furman Street", 
				"city": "Brooklyn, NY",
				"tag": "pier2rollerrink" 
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
				"title": "Atrium Dumbo Restuarant",
				"lat": 40.7035667,
				"long": -73.9924536,
				"street": "15 Main Street", 
				"city": "Brooklyn, NY",
				"tag": "atriumdumbo"
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
		if(!click){
			$('#instatag').empty();
			$('#instafeed').empty();
			self.marker.setAnimation(google.maps.Animation.BOUNCE);
			self.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
			self.tagFeed(self.tag);
			$('#instatag').append('#'+self.tag);
			click = true;
		}
		else{
			self.marker.setAnimation(null);
			self.marker.setIcon(null);
			$('#instatag').empty();
			$('#instafeed').empty();
			click = false;
		}
	});

	var instaId = "71ae4a45b8674b438519df470f6b3c38";
	var instaToken = "601545510.ba4c844.92f529b80405478590b9206bd84e5497";

	this.tagFeed = function(tag){
		var feed = new Instafeed({
			get: 'tagged',
			tagName: tag,
			accessToken: instaToken,
			sortBy: 'most-recent',
			limit: '18'
		});
		feed.run();
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










