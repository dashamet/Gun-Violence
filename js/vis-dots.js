var margin = {top: 30, right: 180, bottom: 30, left: 80},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#memorial-viz").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.csv("data/allShootings.csv", function(data) {
    console.log(data)
};
