// Creating variables for the SVG dimensions
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var parseTime = d3.timeParse("%Y")

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

// define the 4th line
var valueline4 = d3.line()
    .defined(d => !isNaN(d.unintentional_injuries))
    .x(d => x(d.year))
    .y(d => y(d.unintentional_injuries))

//define the 5th line
var valueline5 = d3.line()
    .defined(d => !isNaN(d.intentional_injuries))
    .x(d => x(d.year))
    .y(d => y(d.intentional_injuries))

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
        d.year = parseTime(d.year);
        d.intentional_homicides = +d.intentional_homicides;
        d.intentional_suicides = +d.intentional_suicides;
        d.unintentional_deaths = +d.unintentional_deaths;
        d.unintentional_injuries = Number(d.unintentional_injuries);
        d.intentional_injuries = Number(d.intentional_injuries);
    });
    console.log(data)

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) {
        return Math.max(d.intentional_homicides, d.intentional_suicides, d.unintentional_deaths, d.unintentional_injuries,
            d.intentional_injuries); })]);

    // Add the valueline path.

    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "green")
        .style("fill","none")
        .attr("stroke-width", 2)
        .attr("d", valueline);

    // Add the valueline2 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "red")
        .style("fill","none")
        .attr("stroke-width", 1.5)
        .attr("d", valueline2)

    // Add the valueline3 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "blue")
        .style("fill","none")
        .attr("stroke-width", 1.5)
        .attr("d", valueline3);

    // Add the valueline4 paths.
    svg.append("path")
        .datum(data.filter(valueline4.defined()))
        .attr("stroke", "orange")
        .style("stroke-dasharray", ("3, 3"))
        .style("fill","none")
        .attr("d", valueline4);

    svg.append("path")
        .datum(data)
        .attr("stroke", "orange")
        .style("fill","none")
        .attr("stroke-width", 1.5)
        .attr("d", valueline4);

    // Add the valueline5 paths.
    svg.append("path")
        .datum(data.filter(valueline5.defined()))
        .attr("stroke", "black")
        .style("stroke-dasharray", ("3, 3"))
        .style("fill","none")
        .attr("d", valueline5);

    svg.append("path")
        .datum(data)
        .attr("stroke", "black")
        .style("fill","none")
        .attr("stroke-width", 1.5)
        .attr("d", valueline5);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));


});