mapOneVis = function(_parentElement, _mapData, _stateNameData, _deathData, _shootingData) {
    this.parentElement = _parentElement;
    this.mapData = topojson.feature(_mapData, _mapData.objects.state).features;
    this.stateNameData = _stateNameData;
    //this.deathData = _deathData;
    this.shootingData = _shootingData;

    // call method initVis
    this.initVis();
};


mapOneVis.prototype.initVis = function() {
    let vis = this;

    // set constants
    vis.margin = {top: 10, right: 10, bottom: 10, left: 10};
    vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = $('#' + vis.parentElement).height() -vis.margin.top - vis.margin.bottom;

    // create projection
    vis.projection = d3.geoAlbersUsa()
        .translate([vis.width / 2, vis.height / 2])
        .scale([vis.width * 0.82]);

    // create drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Append Div for tooltip to SVG
    vis.div = d3.select("#map1")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // create path
    vis.path = d3.geoPath()
        .projection(vis.projection);

    // match state names
    vis.stateNameData.forEach(function (d) {
        vis.mapData.forEach(function (e) {
            if (d.id === e.id) {
                e.name = d.name
            }
        })
    });

    // draw map
    vis.svg.selectAll("map1")
        .data(vis.mapData)
        .enter().append("path")
        .attr("class", "state")
        .attr("d", vis.path)
        .attr("fill", 'black')
        .attr("stroke", 'grey')
        .attr("stroke-width", 0.1);

    // initialize map
    vis.initCircles();
};

// initialize all Circles, we will then, later, grab them by class to play around with them
mapOneVis.prototype.initCircles = function() {
    let vis = this;

    // after the map has been draw, draw all the circles for the initial view;
    vis.shootingData.forEach(d=>{
        d.Latitude = +d.Latitude;
        d.Longitude = +d.Longitude;
    });

    // create circles
    vis.circles = vis.svg.selectAll(".mapOneCircle")
        .data(vis.shootingData);

    // draw all the circles
    vis.circles.enter().append("circle")
        .attr("class", function(d){ return `mapOneCircle ${d['age']} ${d['gender']} ${d['Type']}` })
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("r", 4)
        .attr("fill", "red")
        .attr("transform", function (d) {
             return "translate(" + vis.projection([+d.Longitude, +d.Latitude]) + ")"
        })
        // create mouseover for tooltip
        .on("mouseover", function(d) {
            vis.div.transition()
                .duration(200)
                .style("opacity", .9);
            vis.div.html(function() {
                if (d.name === "N/A"){
                    return "<strong> Incident location: </strong>" + d.Address
                }
                else{
                    return "<strong> Name: </strong>" + d.name + " <br> "
                        + "<strong> Incident location: </strong>" + d.Address
                }
            })
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })

        // fade out tooltip on mouse out
        .on("mouseout", function() {
            vis.div.transition()
                .duration(500)
                .style("opacity", 0);
        });
};

mapOneVis.prototype.updateVis = function() {
    let vis = this;

    console.log('got called');

    // get values;
    vis.selectedValueOne = d3.select("#ranking-type").property("value");
    vis.selectedValueTwo = d3.select("#gender").property("value");
    vis.selectedValueThree = d3.select("#age").property("value");

    // hide all circles
    d3.selectAll('.mapOneCircle').transition().duration(500).attr('r', 0);

    // then show only selected circles;
    d3.selectAll('.mapOneCircle' + vis.selectedValueOne + vis.selectedValueTwo + vis.selectedValueThree).transition().duration(500).attr('r', 4);
};