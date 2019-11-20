var margin = {top: 30, right: 180, bottom: 30, left: 80},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let spaceBetweenCircles = 5;
let radiusAnimationOne = height/200;
let radiusAnimationTwo = height/200;
let radiusSmallCircles = height/200;
let radiusBigCircles = height/40 - spaceBetweenCircles;

let marginTop = 10;
var svgD = d3.select("#memorial-viz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/allShootings.csv", function(data) {
    console.log("allShootings", data)
    let dots = svgD.selectAll('.dot')
        .data(data);
    dots.enter().append('circle')
        // .attr('class', function(d){
        //     console.log(d)
        //     return `customCircle ${d.age} ${d.killedBy}`
        // })
});
