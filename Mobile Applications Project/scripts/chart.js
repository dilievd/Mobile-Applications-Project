var app = app || {};

(function() {
    app.initializeChart = function() {
        var visited = app.visitedCitiesCount;
        if (visited > 0) {
            var notvisited = app.allCitiesCount - app.visitedCitiesCount;
            $("#chart").kendoChart({
                title: {
                    text: "Bulgarian Cities"
                },
                legend: {
                    position: "top"
                },
                seriesDefaults: {
                    labels: {
                        visible: true,
                        format: "{0}"
                    }
                },
                series: [{
                    type: "pie",
                    data: [ {
                        category: "Visited",
                        value: visited
                    }, {
                        category: "Not Visited",
                        value: notvisited
                    } ]
                }]
            });
        }
    }
}());