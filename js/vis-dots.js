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
        .attr('class', function(d){
            return `customCircle ${d.age} ${d.Type} ${d.Gender}`
        })
        .attr('cx', function(d,i){
            return width/50*(3.5+i%40)
            // if(i % 40 === 0){
            //     return width/10*3.5;
            // } else if(i % 40 === 1) {
            //     return width/10 * 4.5
            // } else if(i % 40 === 2) {
            //     return width/10 * 5.5
            // } else if(i % 4 === 3) {
            //     return width/10 * 6.5
            // }
        })
        .attr('cy', function(d,i){
            return (Math.trunc(i / 40)) * height/50 + marginTop;
        })
        .attr('r', width/300)
        // .attr('fill', function(d,i){
        //     if(d.age === 'child'){
        //         return 'blue'
        //     }else{
        //         return 'red'
        //     }
        // });
});
