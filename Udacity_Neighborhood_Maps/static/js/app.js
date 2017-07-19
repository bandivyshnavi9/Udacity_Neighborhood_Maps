var map;
var marker;
var markers = [];
var locationsdata = null;
var bounds;
var infowindow;
var highlightmarker;
var styles = [];

function initMap() {
    /**
        This function is called and the map will default set to
        Erie location. Some styling to the map is defined in this
        method.
        The hamburger icon and list locations are defined here.
        The viewmodel is called from this function.
    **/
    $.ajax({
        url: 'static/json/styles.json',
        dataType: 'json',
    }).done(function(response) {
        styles = response;
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 42.06397543155331,
                lng: -79.947509765625
            },
            zoom: 13,
            styles: styles,
            mapTypeControl: false
        });
        infowindow = new google.maps.InfoWindow();
        var card = document.getElementById('hamburger');
        var navigation = document.getElementById('subcontainer');
        bounds = new google.maps.LatLngBounds();
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(navigation);
        ko.applyBindings(new ViewModel());
    }).fail(function(error) {
        alert("Error while getting the google maps styles JSON");
    });
}


var fetchdata = function() {
    /**
        This function will make ajax call to get the YELP data
        from the localhost in JSON format.
    **/
    $.ajax({
        url: "http://localhost:5000/JSON",
        method: "GET",
        async: false,
    }).done(function(response) {
        locationsdata = JSON.parse(response);
    }).fail(function(error) {
        ViewModel.errormessage =
        ("Error while getting the JSON data from localhost");
    });
};


var Location = function(data) {
    /**
        This function will create the class for each location.
        It will create marker and infowindow and extends the map bounds.
        The marker default icon is red and when clicked the marker will
        be blue and finally visited markers will be yellow.
    **/
    this.name = data.name;
    this.address = data.display_address;
    this.coordinates = data.coordinates;
    this.image = data.image;
    this.review_count = data.reviews_count;
    this.rating = data.rating;
    this.phone = data.display_phone;
    this.marker = new google.maps.Marker({
        position: this.coordinates,
        title: this.name,
        animation: google.maps.Animation.DROP,
        map: map,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
    });
    var content = '<div class="infocontainer"><div class="image"> <img src="' +
        this.image + '" alt="no image found"></div><div class="contentcontainer">' +
        this.name + '<div> <label> rating </label>' + this.rating + '</div><div>' +
        this.review_count + ' <label>reviews</label></div></div></div>';
    this.marker.addListener('closeclick', function() {
        this.marker = null;
    });
    google.maps.event.addListener(this.marker, 'click', function() {
        infowindow.open(map, this);
        infowindow.setContent(content);
        if (highlightmarker !== null && highlightmarker !== undefined)
            highlightmarker.setIcon(
                "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png");
        this.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
        highlightmarker = this;
    });
    bounds.extend(this.coordinates);
    map.fitBounds(bounds);
    google.maps.event.addDomListener(window, 'resize', function() {
        map.fitBounds(bounds);
    });
};

var ViewModel = function() {
    /**
        This viewmodel will implement filter functions
        and infowindow open actions when clicked on markers.
    **/
    var self = this;
    self.cross = ko.observable(false);
    self.subcontainer = ko.observable(false);
    self.hamburger = ko.observable(true);
    self.hamburgerclick = function() {
        self.subcontainer(true);
        self.cross(true);
        self.hamburger(false);
    };
    self.crossclick = function() {
        self.subcontainer(false);
        self.cross(false);
        self.hamburger(true);
    };
    self.errormessage = ko.observable();
    fetchdata();
    self.LocationsList = [];
    if (locationsdata === null) {
        self.errormessage("Error while getting JSON data");
        return;
    }
    locationsdata.forEach(function(location) {
        self.LocationsList.push(new Location(location));
    });
    self.Locations = ko.observableArray([]);
    self.LocationsList.forEach(function(location) {
        self.Locations.push(location);
    });
    self.filter = ko.observable();

    self.filteredLocations = ko.computed(function() {
        var filtertext = self.filter();
        self.Locations.removeAll();
        if (!filtertext) {
            return self.LocationsList;
        } else {
            ko.utils.arrayFilter(self.LocationsList, function(location) {
                location.marker.setVisible(false);
                if ((location.name).includes(filtertext)) {
                    self.Locations.push(location);
                }
            });
            self.Locations().forEach(function(location) {
                location.marker.setVisible(true);
                location.marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    location.marker.setAnimation(null);
                }, 750);
            });
            return self.Locations();
        }
    }, self);

    self.infowindowclick = function(location) {
        if (highlightmarker !== null && highlightmarker !== undefined) {
            highlightmarker.setIcon(
                "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png");
        }
        google.maps.event.trigger(location.marker, 'click');
        location.marker.setIcon(
            "http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
        highlightmarker = location.marker;
    };
};

function maploadError() {
    /**
    Error on loading the map
    **/
    alert("Map could not be loaded, please try again.");
}