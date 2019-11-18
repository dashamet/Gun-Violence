// Creating variables for the SVG dimensions
var margin = {top: 30, right: 180, bottom: 30, left: 80},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svgM1 = d3.select("#map1").append("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geoMercator()
    .translate([width / 2, height / 2])
    .scale([100]);

var path = d3.geoPath()
    .projection(d3.geoAlbersUsa());

d3.json("data/us-states.json", function(data) {
    console.log(data);
    var us = topojson.feature(data, data.objects.states).features;
    svgM1.selectAll("map1")
        .data(us)
        .enter().append("path")
        .attr("d", path);
});
