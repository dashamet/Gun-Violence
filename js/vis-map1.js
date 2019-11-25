// Creating variables for the SVG dimensions
var margin = {top: 30, right: 180, bottom: 30, left: 80},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svgM1 = d3.select("#map1").append("svg")
    .attr("width", width)
    .attr("height", height);

// Append Div for tooltip to SVG
var div = d3.select("#map1")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale([width * 0.9]);

var path = d3.geoPath()
    .projection(projection);

// create sort when clicked on drop down menu
d3.select("#ranking-type").on("change", createVisualization);

queue()
    .defer(d3.json, "data/us.topo.json")
    .defer(d3.csv, "data/us-state-names.csv")
    .defer(d3.csv, "data/shootingInjuredEdit - shooting_injured.csv")
    .defer(d3.csv, "data/shootingKilledEdit - shooting_killed.csv")
    .await(createVisualization);


function createVisualization(error, data) {

    // load csv state names to topojson use data
    // http://bl.ocks.org/phil-pedruco/10447085

    //change options with dropdown
    var selectedValue = d3.select("#ranking-type").property("value");

    d3.csv("data/us-state-names.csv", function (csv) {
        var us = topojson.feature(data, data.objects.state).features;

        csv.forEach(function (d, i) {
            us.forEach(function (e, j) {
                if (d.id === e.id) {
                    e.name = d.name
                }
            })
        });

        svgM1.selectAll("map1")
            .data(us)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", "black")
            .style("stroke", "#fff")
    });


    // map data
    if (selectedValue === "injured") {

        d3.csv("data/shootingInjuredEdit - shooting_injured.csv", function (error, csv) {
            var newData = csv.map(function (d) {
                return {
                    Latitude: +d.Latitude,
                    Longitude: +d.Longitude,
                    Address: d.Address,
                    ParticipantName: d.ParticipantName,
                    ParticipantGender: d.ParticipantGender,
                    ParticipantAgeGroup: d.ParticipantAgeGroup,
                }

            });

            // 500
            console.log(newData.length);

            var circles1 = svgM1.selectAll("circle")
                .data(newData);

            circles1.enter().append("circle")
                .attr("class", "injured")
                .merge(circles1)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", 4)
                .attr("fill", "red")
                .attr("transform", function (d) {
                    return "translate(" + projection([+d.Longitude, +d.Latitude]) + ")"

                    // 450 - where did the 50 go?
                    //console.log(d.Longitude.length)

                })
                .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(function () {
                            return "<strong>" + "Name: " + "</strong>" + d.ParticipantName + " <br> "
                                + "<strong>" + "Incident location: " + "</strong>" + d.Address
                        })
                        //.text(d.ParticipantGender.charAt(0).toUpperCase() + d.ParticipantGender.substring(1)+ ", " +d.ParticipantAgeGroup)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })

                // fade out tooltip on mouse out
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

                circles1.exit().remove();
        })

    }

    if (selectedValue === "deaths") {

        d3.csv("data/shootingKilledEdit - shooting_killed.csv", function (error, csv) {
            var newData2 = csv.map(function (d) {
                return {
                    Latitude: +d.Latitude,
                    Longitude: +d.Longitude,
                    Address: d.Address,
                    ParticipantGender: d.ParticipantGender,
                    ParticipantAgeGroup: d.ParticipantAgeGroup,
                }
            });

            var circles2 = svgM1.selectAll("circle")
                .data(newData2);

            circles2.enter().append("circle")
                .attr("class", "deaths")
                .merge(circles2)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", 4)
                .attr("fill", "red")
                .attr("transform", function (d) {
                    return "translate(" + projection([+d.Longitude, +d.Latitude]) + ")"

                    // 450 - where did the 50 go?
                    //console.log(d.Longitude.length)

                })
                .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(function () {
                        return "<strong>" + "Name: " + "</strong>" + d.ParticipantName + " <br> "
                            + "<strong>" + "Incident location: " + "</strong>" + d.Address
                    })
                        //.text(d.ParticipantGender.charAt(0).toUpperCase() + d.ParticipantGender.substring(1)+ ", " +d.ParticipantAgeGroup)
                        .text("Name: " + d.ParticipantName + ", Incident location: " + d.Address)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })

                // fade out tooltip on mouse out
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

                circles2.exit().remove();
        })
    }
}



