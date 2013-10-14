var app = app || {};

var sqlite = (function() {
    
    app.db = null;
    
    app.openDb = function() {
        if (window.sqlitePlugin !== undefined) {
            app.db = window.sqlitePlugin.openDatabase("ExploreBulgaria");
        }
        else {
            // For debugging in simulator fallback to native SQL Lite
            app.db = window.openDatabase("ExploreBulgaria", "1.0", "ExploreBulgariaApp", 200000);
        }
    }
    
    app.createTable = function() {
        app.db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS Cities" +
                          "(id INTEGER PRIMARY KEY ASC, " +
                          "name TEXT UNIQUE, " +
                          "longitude DOUBLE, " +
                          "latitude DOUBLE, " + 
                          "date TEXT, " +
                          "visited BIT);", []);
        });
    }

    app.insertRecord = function(name, latitude, longitude, date) {
        app.db.transaction(function(tx) {
            tx.executeSql("INSERT INTO Cities(name, latitude, longitude, date, visited) VALUES (?,?,?,?,?);",
                          [name, latitude, longitude, date, 0],
                          app.onInsertRecordSuccess,
                          app.onError);
        });
    }
    
    app.updateRecord = function(name) {
        app.db.transaction(function(tx) {
            var currentDate = new Date();
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            var today = day + "/" + month + "/" + year;
            tx.executeSql("UPDATE Cities SET visited = ?, date = ? WHERE name = ?;",
                          [1, today, name],
                          app.onSuccess,
                          app.onError);
        });
    }
    
    app.selectAllRecordsByName = function(fn) {
        app.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM Cities ORDER BY visited DESC, name;", [],
                          fn,
                          app.onError);
        });
    }
    
    function getAllRecordsByName(handleReceivedData) {
        app.selectAllRecordsByName(handleReceivedData);
    }
    
    app.selectAllRecordsByDate = function(fn) {
        app.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM Cities ORDER BY visited DESC, date DESC;", [],
                          fn,
                          app.onError);
        });
    }
    
    function getAllRecordsByDate(handleReceivedData) {
        app.selectAllRecordsByDate(handleReceivedData);
    }
    
    app.selectAllRecordsByVisited = function(fn) {
        app.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM Cities WHERE visited = 1;", [],
                          fn,
                          app.onError);
        });
    }
    
    function getAllRecordsByVisited(handleReceivedData) {
        app.selectAllRecordsByVisited(handleReceivedData);
    }
    
    app.deleteAllRecords = function() {
        app.db.transaction(function(tx) {
            tx.executeSql("DELETE FROM Cities;",
                          [],
                          app.onSuccess,
                          app.onError);
        });
    }

    app.onInsertRecordSuccess = function(tx, r) {
        console.log("Your SQLite 'insert record' query was successful!");
        app.allCitiesCount = app.allCitiesCount || 0;
        app.allCitiesCount++;
    }

    app.onSuccess = function(tx, r) {
        console.log("Your SQLite query was successful!");
    }

    app.onError = function(tx, e) {
        console.log("SQLite Error: " + e.message);
    }

    function init() {
        app.openDb();
        app.createTable();
    }
    
    init();
    
    return {
        getCitiesByName:getAllRecordsByName,
        getCitiesByDate:getAllRecordsByDate,
        getVisitedCities:getAllRecordsByVisited,
        markCityAsVisited:app.updateRecord,
        clearDb:app.deleteAllRecords,
        addCity:app.insertRecord
    }
}());
