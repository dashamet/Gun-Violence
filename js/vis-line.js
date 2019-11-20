// Creating variables for the SVG dimensions
var margin = {top: 30, right: 180, bottom: 30, left: 80},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Setting the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Setting up a function that will covert a year string to a date
var parseTime = d3.timeParse("%Y")

// Setting up a colour scale
var color = d3.scaleOrdinal()

// Creating a function to format the pop-up text
function groupTxt(group) {
    if (group === "intentional_homicides") {
        return " killed by homicide";
    } else if(group === "intentional_suicides"){
        return " dead by suicide";
    } else if(group === "unintentional_deaths"){
        return " killed in an accident";
    } else if(group === "unintentional_injuries"){
        return " injured in an accident";
    } else if(group === "intentional_injuries"){
        return " injured by violence";
    }
}

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
var svg = d3.select("#line-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("data/aggregated-deaths-injuries.csv", function(data) {
    // format the data

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));

    data.forEach(function(d) {
        d.year = parseTime(d.year);
        d.intentional_homicides = +d.intentional_homicides;
        d.intentional_suicides = +d.intentional_suicides;
        d.unintentional_deaths = +d.unintentional_deaths;
        d.unintentional_injuries = Number(d.unintentional_injuries);
        d.intentional_injuries = Number(d.intentional_injuries);
        mod_data = color.domain().map(function(name) {
            return {
                name: name,
                values: data.map(function(d) {
                    return {year: d.year, victims: d[name], type: name};
                })
            };
        });

        console.log(mod_data)
    });

    //console.log(data)

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) {
        return Math.max(d.intentional_homicides, d.intentional_suicides, d.unintentional_deaths, d.unintentional_injuries,
            d.intentional_injuries); })+1000]);

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#4daf4a")
        .style("fill","none")
        .attr("stroke-width", 2)
        .attr("d", valueline);

    // Add the valueline2 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#e41a1c")
        .style("fill","none")
        .attr("stroke-width", 1.5)
        .attr("d", valueline2)

    // Add the valueline3 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#377eb8")
        .style("fill","none")
        .attr("stroke-width", 1.5)
        .attr("d", valueline3);

    // Add the valueline4 paths.
    svg.append("path")
        .datum(data.filter(valueline4.defined()))
        .attr("stroke", "#ff7f00")
        .style("stroke-dasharray", ("3, 3"))
        .style("fill","none")
        .attr("d", valueline4);

    svg.append("path")
        .datum(data)
        .attr("stroke", "#ff7f00")
        .style("fill","none")
        .attr("stroke-width", 1.5)
        .attr("d", valueline4);

    // Add the valueline5 paths.
    svg.append("path")
        .datum(data.filter(valueline5.defined()))
        .attr("stroke", "#984ea3")
        .style("stroke-dasharray", ("3, 3"))
        .style("fill","none")
        .attr("d", valueline5);

    svg.append("path")
        .datum(data)
        .attr("stroke", "#984ea3")
        .style("fill","none")
        .attr("stroke-width", 1.5)
        .attr("d", valueline5);

    var records = svg.selectAll(".records")
        .data(mod_data)
        .enter().append("g")
        .attr("class", "records");

    var div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    records.append("g").selectAll("circle")
        .data(function(d){return d.values})
        .enter()
        .append("circle")
        .attr("r", function(d){
            if(isNaN(d.victims)){
                return 0
            }
            else{return 4}
        })
        .attr("cx", function(d){return x(d.year)})
        .attr("cy", function(d){return y(d.victims)})
        .attr("fill", function(d){return color[d.type]})
        .attr("stroke", "black")
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85')
                .attr('r', 8);
            div.transition()
                .duration(50)
                .style("opacity", 1);
            div.html(function () {
                if (isNaN(d.victims)) {
                    return "<strong>" + d.year.getFullYear() + "</strong>" + " <br> " + "No data available"
                } else {
                    return "<strong>" + d.year.getFullYear() + "</strong>" + " <br> " + d.victims + groupTxt(d.type)
                }
            })
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 15) + "px");
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');
            div.transition()
                .duration('50')
                .style("opacity", 0);
        })

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the Y Axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of victims");

    // Add a title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2) + 10)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Firearm Deaths and Injuries Broken Down by Cause");

    svg.append("text")
        .attr("transform", "translate("+(width+10)+","+y(data[0].intentional_suicides + 300)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "#e41a1c")
        .text("Suicides");

    svg.append("text")
        .attr("transform", "translate("+(width+10)+","+y(data[0].intentional_homicides)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "#4daf4a")
        .text("Homicides");

    svg.append("text")
        .attr("transform", "translate("+(width-197)+","+y(data[0].unintentional_injuries - 700)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "#ff7f00")
        .text("Injuries from accidents");

    svg.append("text")
        .attr("transform", "translate("+(width-95)+","+y(data[0].intentional_homicides + 5500)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "#984ea3")
        .text("Injuries from violence");

    svg.append("text")
        .attr("transform", "translate("+(width+10)+","+y(data[0].unintentional_deaths)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "#377eb8")
        .text("Deaths from accidents");



});