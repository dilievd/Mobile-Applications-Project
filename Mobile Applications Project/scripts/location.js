(function (global) {
    var map,
        geocoder,
        LocationViewModel,
        app = global.app = global.app || {};

    LocationViewModel = kendo.data.ObservableObject.extend({
        _lastMarker: null,
        _isLoading: false,
        address: "",

        onNavigateHome: function () {
            var that = this,
                position;

            that._isLoading = true;
            that.showLoading();

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    var currLatitude = position.coords.latitude;
                    var currLongitude = position.coords.longitude;
                    position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    map.panTo(position);
                    that._putMarker(position);
                    
                    // check if in any of the towns
                    sqlite.getCitiesByName(getCities);
                    function getCities(tx, rs) {
                        for (var i = 0; i < rs.rows.length; i++) {
                            //rs.rows.item(i)
                            var distance = utilities.getDistance(currLatitude, currLongitude, rs.rows.item(i).latitude, rs.rows.item(i).longitude);
                            console.log(rs.rows.item(i).name + " - > " + distance); 
                            if (distance < 15) {
                                if (rs.rows.item(i).visited == 1) {
                                    navigator.notification.alert(
                                        'Your last visit here was at: ' + rs.rows.item(i).date + '!',  // message
                                        function() {},                                                 // callback
                                        'Welcome back to ' + rs.rows.item(i).name,                     // title
                                        'Got it!'                                                      // buttonName
                                    );
                                }
                                else {
                                    navigator.notification.alert(
                                        'You added ' + rs.rows.item(i).name + ' to your visited cities!',  // message
                                        function() {},                                                     // callback
                                        'Welcome!',                                                        // title
                                        'Got it!'                                                          // buttonName
                                    );
                                }
                                 sqlite.markCityAsVisited(rs.rows.item(i).name);
                            }
                        }
                    }

                    that._isLoading = false;
                    that.hideLoading();
                },
                function (error) {
                    //default map coordinates                    
                    position = new google.maps.LatLng(42.651033, 23.379238);
                    map.panTo(position);

                    that._isLoading = false;
                    that.hideLoading();

                    navigator.notification.alert("Unable to determine current location. Cannot connect to GPS satellite.",
                        function () { }, "Location failed", 'OK');
                },
                {
                    timeout: 30000,
                    enableHighAccuracy: false
                }
            );
        },

        onSearchAddress: function () {
            var that = this;

            geocoder.geocode(
                {
                    'address': that.get("address")
                },
                function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        navigator.notification.alert("Unable to find address.",
                            function () { }, "Search failed", 'OK');

                        return;
                    }

                    map.panTo(results[0].geometry.location);
                    that._putMarker(results[0].geometry.location);
                });
        },

        showLoading: function () {
            if (this._isLoading) {
                app.application.showLoading();
            }
        },

        hideLoading: function () {
            app.application.hideLoading();
        },

        _putMarker: function (position) {
            var that = this;

            if (that._lastMarker !== null && that._lastMarker !== undefined) {
                that._lastMarker.setMap(null);
            }

            that._lastMarker = new google.maps.Marker({
                map: map,
                position: position
            });
        }
    });

    app.locationService = {
        initLocation: function () {
            var mapOptions = {
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    },
    
                    mapTypeControl: false,
                    streetViewControl: false
                };

            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);            
            geocoder = new google.maps.Geocoder();
            app.locationService.viewModel.onNavigateHome.apply(app.locationService.viewModel, []);
        },

        show: function () {
            //show loading mask in case the location is not loaded yet 
            //and the user returns to the same tab
            app.locationService.viewModel.showLoading();
            
            //resize the map in case the orientation has been changed while showing other tab
            google.maps.event.trigger(map, "resize");
        },

        hide: function () {
            //hide loading mask if user changed the tab as it is only relevant to location tab
            app.locationService.viewModel.hideLoading();
        },

        viewModel: new LocationViewModel()
    };
}
)(window);