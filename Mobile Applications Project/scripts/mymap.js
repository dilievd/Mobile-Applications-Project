(function (global) {
    var map,
        geocoder,
        MymapViewModel,
        app = global.app = global.app || {};

    MymapViewModel = kendo.data.ObservableObject.extend({
        _lastMarker: null,
        _isLoading: false,
        address: "",

        onNavigateHome: function () {
            var that = this,
                position;

            position = new google.maps.LatLng(42.966423, 25.23996);
            map.panTo(position);
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

    app.mymapService = {
        initMarkers: function () {
            var mapOptions = {
                    zoom: 6,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    },
    
                    mapTypeControl: false,
                    streetViewControl: false
                };

            map = new google.maps.Map(document.getElementById("visitedcities-canvas"), mapOptions);            
            geocoder = new google.maps.Geocoder();
            app.mymapService.viewModel.onNavigateHome.apply(app.mymapService.viewModel, []);
        },

        show: function () {
            //resize the map in case the orientation has been changed while showing other tab
            google.maps.event.trigger(map, "resize");
            
            //put markers
            sqlite.getVisitedCities(getVisitedCitiesCount);
            function getVisitedCitiesCount(tx, rs) {
                for (var i = 0; i < rs.rows.length; i++) {
                    position = new google.maps.LatLng(rs.rows.item(i).latitude, rs.rows.item(i).longitude);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: position
                    });
                }
            }
        },
        
        viewModel: new MymapViewModel()
    };
}
)(window);