// Creating variables for the SVG dimensions
var margin = {top: 30, right: 220, bottom: 10, left: 60},
    width = 1100 - margin.left - margin.right,
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

function onMouseOver(){
    var current_id = d3.select(this).attr("id")
    var current_class = d3.select(this).attr("class")
    d3.selectAll("#" + current_id)
        .style("stroke-width","5px")
        .style("font-size", "20px")
        .style("stroke",  function(){
            if(d3.select(this).attr("class") !== "text"){
                return "red"
            }
        })
        .style("fill", function(){
            if(d3.select(this).attr("class") === "circle"){
                return "red"
            }
            else if(d3.select(this).attr("class") === "line"){
                return "white"
            }
        })
    d3.selectAll(".line,.circle,.text")
        .style("opacity", function() {
            return (d3.select(this).attr('id') === current_id) ? 1.0 : 0.2;
        })
}

function onMouseOut(){
    d3.selectAll(".line,.circle,.text")
        .transition()
        .duration(500)
        .style("stroke-width", "3px")
        .style("font-size", "16px")
        .style("opacity", 1.0)
        .style("stroke", function(){
            if(d3.select(this).attr("class") !== "text"){
                return "black"
            }
        })
        .style("fill", function(){
            if(d3.select(this).attr("class") === "line"){
                return "white"
            }
            else if(d3.select(this).attr("class") === "circle"){
                return "black"
            }
        })
}


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
        .attr('id', 'line1')
        .style("stroke", "black")
        .style("fill","none")
        .attr("stroke-width", 2)
        .attr("d", valueline)
        .on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut)

    // Add the valueline2 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("id", "line2")
        .style("stroke", "black")
        .style("fill","none")
        .attr("stroke-width", 1.5)
        .attr("d", valueline2)
        .on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut)

    // Add the valueline3 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("id", "line3")
        .style("stroke", "black")
        .style("fill","none")
        .attr("stroke-width", 1.5)
        .attr("d", valueline3)
        .on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut)

    // Add the valueline4 paths.
    svg.append("path")
        .datum(data.filter(valueline4.defined()))
        .attr("class", "line")
        .attr("id", "line4")
        .style("stroke", "black")
        .style("stroke-dasharray", ("2, 3"))
        .style("fill","none")
        .attr("d", valueline4)
        .on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut)

    svg.append("path")
        .datum(data)
        .style("stroke", "black")
        .attr("class", "line")
        .attr("id", "line4")
        .style("fill","none")
        .attr("stroke-width", 1.5)
        .attr("d", valueline4)
        .on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut)

    // Add the valueline5 paths.
    svg.append("path")
        .datum(data.filter(valueline5.defined()))
        .attr("class", "line")
        .attr("id", "line5")
        .style("stroke", "black")
        .style("stroke-dasharray", ("2, 3"))
        .style("fill","none")
        .attr("d", valueline5)
        .on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut)

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("id", "line5")
        .style("stroke", "black")
        .style("fill","none")
        .attr("stroke-width", 1.5)
        .attr("d", valueline5)
        .on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut)

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
        .attr("class", "circle")
        .attr('id', function(d){
            if (d.type === "intentional_homicides") {
                return "line1";
            } else if(d.type === "intentional_suicides"){
                return "line2";
            } else if(d.type === "unintentional_deaths"){
                return "line3";
            } else if(d.type === "unintentional_injuries"){
                return "line4";
            } else if(d.type === "intentional_injuries"){
                return "line5";
            }
        })
        .attr("stroke", "black")
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration(50)
                .attr('opacity', '.85')
                .attr('r', 8);
            div.transition()
                .duration(50)
                .style("opacity", 1.5);
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
        .on('mouseout', function (d) {
            d3.select(this).transition()
                .duration(50)
                .attr('r', 4);
            div.transition()
                .duration('50')
                .style("opacity", 0);
        })

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axis")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));

    // Add the Y Axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 16)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("font-size", "14px")
        .style("text-anchor", "middle")
        .style("fill", "grey")
        .text("Number of victims");

    // Add a title
    //svg.append("text")
    //.attr("x", (width / 2))
    //.attr("y", 0 - (margin.top / 2) + 10)
    //.attr("text-anchor", "middle")
    //.style("font-size", "20px")
    //.text("Firearm Deaths and Injuries Broken Down by Cause");

    svg.append("text")
        .attr("transform", "translate("+(width-108)+","+y(data[0].intentional_homicides)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "black")
        .text("Homicides")
        .attr("class", "text")
        .attr("id", "line1");

    svg.append("text")
        .attr("transform", "translate("+(width-108)+","+y(data[0].intentional_suicides + 300)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "black")
        .text("Suicides")
        .attr("class", "text")
        .attr("id", "line2");

    svg.append("text")
        .attr("transform", "translate("+(width-108)+","+y(data[0].unintentional_deaths)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "black")
        .text("Deaths from accidents")
        .attr("class", "text")
        .attr("id", "line3");

    svg.append("text")
        .attr("transform", "translate("+(width-289)+","+y(data[0].unintentional_injuries - 698)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "black")
        .text("Injuries from accidents")
        .attr("class", "text")
        .attr("id", "line4");

    svg.append("text")
        .attr("transform", "translate("+(width-197)+","+y(data[0].intentional_injuries + 2400)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "black")
        .text("Injuries from violence")
        .attr("class", "text")
        .attr("id", "line5");

});