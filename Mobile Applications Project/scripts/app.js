var app = app || {};

(function (a) {
    
    var viewModel = kendo.observable({
        cities:[],
        getAlphabetically: getAlphabetically,
        getByDate: getByDate
    });
    
    //sqlite.clearDb();
    
    sqlite.getCitiesByName(getCitiesCount);
    function getCitiesCount(tx, rs) {
        if (rs.rows.length == 0) {
            // db is empty -> add cities
            sqlite.addCity("Sofia", "42.720786", "23.321013", "");
            sqlite.addCity("Burgas", "42.50754", "27.462704", "");
            sqlite.addCity("Varna", "43.212182", "27.910713", "");
            sqlite.addCity("Plovdiv", "42.142023", "24.745964", "");
            sqlite.addCity("Veliko Tarnovo", "43.078167", "25.618202", "");
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
            console.log(0);
        }
        else {
            getByDate();
            console.log(1);
        }
    }

    document.addEventListener("deviceready", function () {
        app.application = new kendo.mobile.Application(document.body, { layout: "main-layout" });
    }, false);

})(app);

/*(function(global) {
    
    var app = global.app = global.app || {};
    
    sqlite.addCity("Sofia", "42.720786", "23.321013", "");
    
    var viewModel = kendo.observable({
        cities:[]
    });
    
    function getDataSource() {
        var citiesFromDb = [];
        sqlite.getCities(getCities);
        function getCities(tx, rs) {
            for (var i = 0; i < rs.rows.length; i++) {
                citiesFromDb.push(rs.rows.item(i));
            }
           
            viewModel.set("cities", citiesFromDb);
        }
    }
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
        getDataSource();       
    }
    
    document.addEventListener("deviceready", function(e) {
        app.application = new kendo.mobile.Application(document.body, { layout: "main-layout" });
    }, false);
    
    global.cities = {
        init:init
    }

})(app);*/