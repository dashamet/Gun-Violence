mapOneVis = function(_parentElement, _mapData, _stateNameData, _deathData, _shootingData) {
    this.parentElement = _parentElement;
    this.mapData = topojson.feature(_mapData, _mapData.objects.state).features;
    this.stateNameData = _stateNameData;
    this.deathData = _deathData;
    this.shootingData = _shootingData;
    //this.topoData = _topoData;

    console.log("4:52")
    // call method initVis
    this.initVis();
};


mapOneVis.prototype.initVis = function() {
    let vis = this;

    vis.margin = {top: 0, right: 0, bottom: 0, left: 0};
    vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = $('#' + vis.parentElement).height() -vis.margin.top - vis.margin.bottom;

    vis.projection = d3.geoAlbersUsa()
        .translate([vis.width / 2, vis.height / 2])
        .scale([vis.width * 0.7]);

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


    vis.path = d3.geoPath()
        .projection(vis.projection);

    vis.stateNameData.forEach(function (d) {
        vis.mapData.forEach(function (e) {
            if (d.id === e.id) {
                e.name = d.name
            }
        })
    });

    // find center
    // vis.svg.append('rect')
    //     .attr('height', vis.height)
    //     .attr('width', 5)
    //     .attr('fill', 'lavender')
    //     .attr('x', vis.width/2)
    //     .attr('y', 10)

    vis.svg.selectAll("map1")
        .data(vis.mapData)
        .enter().append("path")
        .attr("class", "state")
        .attr("d", vis.path)
        .attr("fill", 'black')
        .attr("stroke", 'grey')
        .attr("stroke-width", 0.1)

    // initialize map
    vis.initMap();
};


// initialize map only once, we won't update anything
mapOneVis.prototype.initMap = function() {
    let vis = this;

    // we will use some basic math & transformations rather than a projection here;
    // vis.viewpoint = {'width': 975, 'height': 610};
    // vis.zoom = vis.width/vis.viewpoint.width;
    //
    // console.log(vis.zoom);
    //
    // // adjust map position
    // vis.map = vis.svg.append("g")
    //     .attr("class", "states")
    //     .attr('transform', `scale(${vis.zoom} ${vis.zoom})`);

    //vis.path = d3.geoPath();

    //vis.us = topojson.feature(vis.topoData, vis.topoData.objects.state).features;

    //
    // vis.map.selectAll("map1")
    //     .data(vis.us)
    //     .enter().append("path")
    //     .attr("d", vis.path)
    //     .attr("fill", "black")
    //     .style("stroke", "#fff");

    vis.initCircles()
};

// initialize all Circles, we will then, later, grab them by class to play around with them
mapOneVis.prototype.initCircles = function() {
    let vis = this;

    // after the map has been draw, draw all the circles for the initial view;
    vis.shootingData.forEach(d=>{
        d.Latitude = +d.Latitude;
        d.Longitude = +d.Longitude;
    });

    vis.circles = vis.svg.selectAll(".mapOneCircle")
        .data(vis.shootingData);

    // draw all the circles
    vis.circles.enter().append("circle")
        .attr("class", function(d){ /*console.log(d);*/ return `mapOneCircle ${d['age']} ${d['gender']} ${d['Type']}` })
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("r", 4)
        .attr("fill", "red")
        .attr("transform", function (d) {
            //console.log(vis.projection([+d.Longitude, +d.Latitude]))
             return "translate(" + vis.projection([+d.Longitude, +d.Latitude]) + ")"
        })
        .on("mouseover", function(d) {
            vis.div.transition()
                .duration(200)
                .style("opacity", .9);
            vis.div.html(function () {
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
            vis.div.transition()
                .duration(500)
                .style("opacity", 0);
        });
};

mapOneVis.prototype.updateVis = function() {
    let vis = this;

    console.log('got called');

    // get values;
    let selectedValueOne = d3.select("#ranking-type").property("value");
    let selectedValueTwo = d3.select("#gender").property("value");
    let selectedValueThree = d3.select("#age").property("value");

    console.log(selectedValueOne, selectedValueTwo, selectedValueThree);


    // hide all circles
    d3.selectAll('.mapOneCircle').transition().duration(500).attr('r', 0);

    // then show only selected circles;
    d3.selectAll('.mapOneCircle' + selectedValueOne + selectedValueTwo + selectedValueThree).transition().duration(500).attr('r', 4);
};