// Creating variables for the SVG dimensions
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the 1st line
var valueline = d3.line()
    .x(function(d) {return x(d.year); })
    .y(function(d) {return y(d.intentional_homicides);})

// define the 2nd line
var valueline2 = d3.line()
    .x(function(d) {return x(d.year); })
    .y(function(d) {return y(d.intentional_suicides); })

// define the 3rd line
var valueline3 = d3.line()
    .x(function(d) {return x(d.year); })
    .y(function(d) {return y(d.unintentional_deaths); })


// appends the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("data/aggregated-deaths-injuries.csv", function(data) {
    // format the data
    data.forEach(function(d) {
        d.intentional_homicides = +d.intentional_homicides;
        d.intentional_suicides = +d.intentional_suicides;
        d.unintentional_deaths = +d.unintentional_deaths;
    });
    console.log(data)

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) {
        return Math.max(d.intentional_homicides, d.intentional_suicides, d.unintentional_deaths); })]);

    // Add the valueline path.

    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "red")
        .style("fill","none")
        .attr("d", valueline);

    // Add the valueline2 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "red")
        .style("fill","none")
        .attr("d", valueline2)

    // Add the valueline3 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "red")
        .style("fill","none")
        .attr("d", valueline3);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

});