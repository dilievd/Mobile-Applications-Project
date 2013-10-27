var app = app || {};

(function (a) {
    
    var viewModel = kendo.observable({
        cities:[],
        getAlphabetically: getAlphabetically,
        getByDate: getByDate
    });
    
    sqlite.getVisitedCities(getVisitedCitiesCount);
    function getVisitedCitiesCount(tx, rs) {
        a.visitedCitiesCount = rs.rows.length;
    }
    
    sqlite.getCitiesByName(getCitiesCount);
    function getCitiesCount(tx, rs) {
        if (rs.rows.length == 0) {
            // db is empty -> add cities
            sqlite.addCity("Blagoevgrad", 42.02086, 23.094371, "");
            sqlite.addCity("Burgas", 42.50754, 27.462704, "");
            sqlite.addCity("Dobrich", 43.572743, 27.827271, "");
            sqlite.addCity("Haskovo", 41.934593, 25.555376, "");
            sqlite.addCity("Kiustendil", 41.934593, 25.555376, "");
            sqlite.addCity("Lovech", 43.136929, 24.714107, "");
            sqlite.addCity("Pazardzhik", 42.192773, 24.333546, "");
            sqlite.addCity("Pernik", 42.605347, 23.037851, "");
            sqlite.addCity("Pleven", 43.417175, 24.606711, "");
            sqlite.addCity("Plovdiv", 42.142023, 24.745964, "");
            sqlite.addCity("Ruse", 43.838984, 25.965103, "");
            sqlite.addCity("Shumen", 43.271269, 26.936067, "");
            sqlite.addCity("Sliven", 42.68171, 26.322892, "");
            sqlite.addCity("Stara Zagora", 42.425817,25.634417, "");
            sqlite.addCity("Sofia", 42.720786, 23.321013, "");
            sqlite.addCity("Varna", 43.212182, 27.910713, "");
            sqlite.addCity("Veliko Tarnovo", 43.078167, 25.618202, "");
            sqlite.addCity("Vidin", 43.99618, 22.867949, "");
        }
        else {
            a.allCitiesCount = rs.rows.length;
        }
    }
    
    function getAlphabetically() {
        var citiesFromDb = [];
        sqlite.getCitiesByName(getCities);
        function getCities(tx, rs) {
            for (var i = 0; i < rs.rows.length; i++) {
                citiesFromDb.push(rs.rows.item(i));
            }
           
            viewModel.set("cities", citiesFromDb);
        }
    }
    
    function getByDate() {
        var citiesFromDb = [];
        sqlite.getCitiesByDate(getCities);
        function getCities(tx, rs) {
            for (var i = 0; i < rs.rows.length; i++) {
                citiesFromDb.push(rs.rows.item(i));
            }
           
            viewModel.set("cities", citiesFromDb);
        }
    }
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
        getAlphabetically();
    }
    
    a.cities = {
        init:init
    }
    
    app.onSelect = function onSelect(e) {
        var index = this.current().index();
        if (index == 0) {
            getAlphabetically();
        }
        else {
            getByDate();
        }
    }
    
    document.addEventListener("deviceready", function () {
        app.application = new kendo.mobile.Application(document.body, { layout: "main-layout" });
        $(document).ready(app.initializeChart());
    }, false);
    
    function onConfirm(buttonIndex) {
        if (buttonIndex == 1) {
            app.locationService.initLocation();
        }
    }
    
    document.addEventListener("resume", function() {
        navigator.notification.confirm(
            'Do you want to check in now?',
            onConfirm,
            'There you are!',
            'Sure!,Nope'
        );
       
    }, false);

})(app);
