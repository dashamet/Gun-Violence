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

loadData();

// create sort when clicked on drop down menu
d3.select("#ranking-type").on("change", createVisualization);

queue()
    .defer(d3.json, "data/us.topo.json")
    .await(createVisualization);

function loadData(){

    // load csv state names to topojson use data
    // http://bl.ocks.org/phil-pedruco/10447085
    d3.csv("data/allShootings.csv", function (error, csv) {
       csv.forEach(function (d) {
                d.Latitude = +d.Latitude;
                d.Longitude = +d.Longitude;
            });
            mapData = csv;
        });
}

function createVisualization(error, data) {

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
            .attr("opacity", .7)
            .style("stroke", "#fff")
    });

    //change options with dropdown
    var selectedValue = d3.select("#ranking-type").property("value");
    var selectedValue2 = d3.select("#gender").property("value");
    var selectedValue3 = d3.select("#age").property("value");

    //initVis append to groups (map group and dot group)
    // filter data based on dropdown and type on 3 dropdown options
    var filteredData = mapData;

    //all boths selected
    if(selectedValue === "both1" && selectedValue2==="both2" && selectedValue3==="both3") {
        filteredData = mapData;
    }
    //injured selected
    else if(selectedValue === "injured" && selectedValue2==="male") {
        filteredData = mapData.filter(function (d) {
            return d.Type === "Injured" && d.gender === "male";
        })
    }
    else if(selectedValue === "injured" && selectedValue2==="female") {
        filteredData = mapData.filter(function (d) {
            return d.Type === "Injured" && d.gender === "female";
        })
    }
    else if(selectedValue === "injured" && selectedValue2==="both2") {
        filteredData = mapData.filter(function (d) {
            return d.Type === "Injured";
        })
    }

    //deaths selected
    else if(selectedValue === "deaths" && selectedValue2==="male"){
        filteredData = mapData.filter(function (d) {
            return d.Type === "Killed" && d.gender === "male";
        })
    }
    else if(selectedValue === "deaths" && selectedValue2==="female"){
        filteredData = mapData.filter(function (d) {
            return d.Type === "Killed" && d.gender === "female";
        })
    }
    else if(selectedValue === "deaths" && selectedValue2==="both2"){
        filteredData = mapData.filter(function (d) {
            return d.Type === "Killed";
        })
    }

    // 1st both
    else if(selectedValue === "both1" && selectedValue2==="male") {
        filteredData = mapData.filter(function (d) {
            return d.gender === "male";
        });
    }
    else if(selectedValue === "both1" && selectedValue2==="female") {
        filteredData = mapData.filter(function (d) {
            return d.gender === "female";
        });
    }
    else if(selectedValue === "both1" && selectedValue2==="both2") {
        filteredData = mapData;
    }

    //all boths selected
    else {
        console.log('yee');
    }



    console.log(selectedValue);
    console.log(selectedValue2);
    //console.log(selectedValue3);
    console.log(filteredData.length);
    console.log(filteredData);

    var circles = svgM1.selectAll("circle")
        .data(filteredData);

    circles.enter().append("circle")
        .attr("class", "map1")
        .merge(circles)
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
        })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(function () {
                if (d.name === "N/A"){
                    return "<strong> Incident location: </strong>" + d.Address
                }
                else{
                    return "<strong> Name: </strong>" + d.name + " <br> "
                        + "<strong> Incident location: </strong>" + d.Address
                }
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

        circles.exit().remove();
}



