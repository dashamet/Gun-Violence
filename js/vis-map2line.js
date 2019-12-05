//Creating variables for the SVG dimensions
map2LineVis = function(_parentElement, _mapData, _stateNameData, _deathData) {
    this.parentElement = _parentElement;
    this.mapData = topojson.feature(_mapData, _mapData.objects.state).features;
    this.stateNameData = _stateNameData;
    this.deathData = _deathData


    // call method initVis
    this.initVis();
};

map2LineVis.prototype.initVis = function() {
    let vis = this;

    vis.margin = {top: 30, right: 180, bottom: 30, left: 80};
    vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;
    vis.active = d3.select(null);

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.projection = d3.geoAlbersUsa()
        .translate([vis.width / 2, vis.height / 2])
        .scale([vis.width * 0.9]);

    vis.path = d3.geoPath()
        .projection(vis.projection);

    vis.data = d3.map();

    // for line graph
    vis.parseTime = d3.timeParse("%Y");

    vis.x = d3.scaleTime()
        .range([0, vis.width]);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.valueLine = d3.line()
    .x(function(d) { return vis.x(d.Year); })
    .y(function(d) { return vis.y(d.TotalFirearmDeaths); });

    vis.stateNameData.forEach(function (d) {
        vis.mapData.forEach(function (e) {
            if (d.id === e.id) {
                e.name = d.name
            }
        })
    });

    vis.wrangleData();
};

map2LineVis.prototype.wrangleData = function(){
    let vis = this;

    vis.deathData.forEach(function (d) {
        d.Year = vis.parseTime(d.Year);
        d.FirearmHomicides = +d.FirearmHomicides;
        d.FirearmSuicides = +d.FirearmSuicides;
        d.TotalHuntingLicensesTagsPermitsandStamps = +d.TotalHuntingLicensesTagsPermitsandStamps;
        d.BackgroundCheckHandgun = +d.BackgroundCheckHandgun;
        d.BackgroundCheckLongGun = +d.BackgroundCheckLongGun;
        d.BackgroundCheckMultipleGunTypes = +d.BackgroundCheckMultipleGunTypes;
        d.BackgroundCheckRentalsHandgun = +d.BackgroundCheckRentalsHandgun;
        d.BackgroundCheckRentalsLongGun = +d.BackgroundCheckRentalsLongGun;
        d.BackgroundCheckPrivateSaleHandgun = +d.BackgroundCheckPrivateSaleHandgun;
        d.BackgroundCheckPrivateSaleLongGun = +d.BackgroundCheckPrivateSaleLongGun;
        d.BackgroundCheckTotals = +d.BackgroundCheckTotals;
        d.PersonsUnder5years = +d.PersonsUnder5years;
        d.Persons5to9years = +d.Persons5to9years;
        d.Persons10to14years = +d.Persons10to14years;
        d.Persons15to19years = +d.Persons15to19years;
        d.TotalChildPop = +d.TotalChildPop;
        d.TotalFirearmDeaths = +d.TotalFirearmDeaths;
    });

    console.log(vis.deathData);
    vis.updateVis();
};

map2LineVis.prototype.updateVis = function(){
    let vis = this;

    vis.svg.selectAll("map2line")
        .data(vis.mapData)
        .enter().append("path")
        .attr("d", vis.path)
        .attr("class", "state")
        .on("click", vis.clicked);

    //zoom to state feature: https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2
    vis.svg.on("click", vis.stopped, true);

vis.zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", vis.zoomed);

vis.svg.append("rect")
        .attr("class", "background")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .attr("opacity", .07)
        .on("click", vis.reset);

vis.svg.call(vis.zoom);

vis.svg.clicked = function(d) {
        if (vis.active.node() === this) return reset();
        vis.active.classed("active", false);
        vis.active = d3.select(this).classed("active", true);

        vis.bounds = vis.path.bounds(d),
            vis.dx = bounds[1][0] - bounds[0][0],
            vis.dy = bounds[1][1] - bounds[0][1],
            vis.xBounds= (bounds[0][0] + bounds[1][0]) / 2,
            vis.yBounds = (bounds[0][1] + bounds[1][1]) / 2,
            vis.scale = 0.9 / Math.max(vis.dx / vis.width, vis.dy / vis.height),
            vis.translate = [vis.width / 2 - vis.scale * vis.xBounds, vis.height / 2 - vis.scale * vis.yBounds];

        vis.svg.transition()
            .duration(750)
            .call( vis.zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(vis.scale) );

}

    vis.reset = function() {
        vis.active.classed("active", false);
        vis.active = d3.select(null);

        vis.svg.transition()
            .duration(750)
            .call(vis.zoom.transform, d3.zoomIdentity );
        };

        vis.zoomed = function() {
            vis.svg.style("stroke-width", 1.5 / d3.event.transform.k + "px");
            vis.svg.attr("transform", d3.event.transform);
        }

    // can drag when zoomed
    vis.stopped = function() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
    }
    console.log(vis.deathData)
    vis.x.domain(d3.extent(vis.deathData, function(d) { return d.Year; }));
    vis.y.domain([0, d3.max(vis.deathData, function(d) {return d.TotalFirearmDeaths})]);

    vis.svg.append("path")
        .data([vis.deathData])
        .attr("class", "line")
        .attr('id', 'line1')
        .style("stroke", "black")
        .style("fill","none")
        .attr("stroke-width", 2)
        .attr("d", vis.valueLine);

    // Add the X Axis
    vis.svg.append("g")
        .attr("transform", "translate(0," + vis.height + ")")
        .attr("class", "axis")
        .call(d3.axisBottom(vis.x));

    // Add the Y Axis
    vis.svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(vis.y));

    // Add the Y Axis label
    vis.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - vis.margin.left + 16)
        .attr("x",0 - (vis.height / 2))
        .attr("dy", "1em")
        .style("font-size", "14px")
        .style("text-anchor", "middle")
        .style("fill", "grey")
        .text("Total Number of Firearm Deaths");
};

//
// var margin = {top: 30, right: 180, bottom: 30, left: 80},
//     width = 1200 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;
//     active = d3.select(null);
//
// var svgM3 = d3.select("#map2-line").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// var projection = d3.geoAlbersUsa()
//     .translate([width / 2, height / 2])
//     .scale([width * 0.9]);
//
// var path = d3.geoPath()
//     .projection(projection);
//
// var data = d3.map();
//
// // for line graph
// var parseTime = d3.timeParse("%Y");
//
// var x = d3.scaleTime()
//     .range([0, width]);
//
// var y = d3.scaleLinear()
//     .range([height, 0]);
//
// //var valueline = d3.line()
//     //.x(function(d) { return x(d.Year); })
//     //.y(function(d) { return y(d.TotalFirearmDeaths); });
//
// queue()
//     .defer(d3.json, "data/us.topo.json")
//     .defer(d3.json, "data/us-states.json")
//     //.defer(d3.csv, "data/master.data.states.2019.01.18.csv")
//     .await(createVisualization);


// function createVisualization(error, data) {
//
//    // // load csv state names to topojson use data
//    //  d3.csv("data/us-state-names.csv", function (csv) {
//    //      var us = topojson.feature(data, data.objects.state).features;
//    //
//    //      csv.forEach(function (d, i) {
//    //          us.forEach(function (e, j) {
//    //              if (d.id === e.id) {
//    //                  e.name = d.name
//    //              }
//    //          })
//    //      });
//
//         svgM3.selectAll("map2line")
//             .data(us)
//             .enter().append("path")
//             .attr("d", path)
//             .attr("class", "state")
//             .on("click", clicked);
//
//         //zoom to state feature: https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2
//         svgM3.on("click", stopped, true);
//
//         var zoom = d3.zoom()
//             .scaleExtent([1, 8])
//             .on("zoom", zoomed);
//
//         svgM3.append("rect")
//             .attr("class", "background")
//             .attr("width", width)
//             .attr("height", height)
//             .attr("opacity", .07)
//             .on("click", reset);
//
//         svgM3.call(zoom);
//
//         function clicked(d) {
//             if (active.node() === this) return reset();
//             active.classed("active", false);
//             active = d3.select(this).classed("active", true);
//
//             var bounds = path.bounds(d),
//                 dx = bounds[1][0] - bounds[0][0],
//                 dy = bounds[1][1] - bounds[0][1],
//                 x = (bounds[0][0] + bounds[1][0]) / 2,
//                 y = (bounds[0][1] + bounds[1][1]) / 2,
//                 scale = 0.9 / Math.max(dx / width, dy / height),
//                 translate = [width / 2 - scale * x, height / 2 - scale * y];
//
//             svgM3.transition()
//                 .duration(750)
//                 .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
//
//         }
//
//         function reset() {
//             active.classed("active", false);
//             active = d3.select(null);
//
//             svgM3.transition()
//                 .duration(750)
//                 .call( zoom.transform, d3.zoomIdentity );
//         }
//
//         function zoomed() {
//             svgM3.style("stroke-width", 1.5 / d3.event.transform.k + "px");
//             svgM3.attr("transform", d3.event.transform);
//         }
//
//         // can drag when zoomed
//             function stopped() {
//                 if (d3.event.defaultPrevented) d3.event.stopPropagation();
//             }
//
//
//
//     });
//
//     // line graph data
//     d3.csv("data/master.data.states.2019.01.18.csv", function (error, csv) {
//         csv.forEach(function (d) {
//             d.Year = parseTime(d.Year);
//             d.FirearmHomicides = +d.FirearmHomicides;
//             d.FirearmSuicides = +d.FirearmSuicides;
//             d.TotalHuntingLicensesTagsPermitsandStamps = +d.TotalHuntingLicensesTagsPermitsandStamps;
//             d.BackgroundCheckHandgun = +d.BackgroundCheckHandgun;
//             d.BackgroundCheckLongGun = +d.BackgroundCheckLongGun;
//             d.BackgroundCheckMultipleGunTypes = +d.BackgroundCheckMultipleGunTypes;
//             d.BackgroundCheckRentalsHandgun = +d.BackgroundCheckRentalsHandgun;
//             d.BackgroundCheckRentalsLongGun = +d.BackgroundCheckRentalsLongGun;
//             d.BackgroundCheckPrivateSaleHandgun = +d.BackgroundCheckPrivateSaleHandgun;
//             d.BackgroundCheckPrivateSaleLongGun = +d.BackgroundCheckPrivateSaleLongGun;
//             d.BackgroundCheckTotals = +d.BackgroundCheckTotals;
//             d.PersonsUnder5years = +d.PersonsUnder5years;
//             d.Persons5to9years = +d.Persons5to9years;
//             d.Persons10to14years = +d.Persons10to14years;
//             d.Persons15to19years = +d.Persons15to19years;
//             d.TotalChildPop = +d.TotalChildPop;
//             d.TotalFirearmDeaths = +d.TotalFirearmDeaths;
//         });
//
//         //  x.domain(d3.extent(csv, function(d) { return d.Year; }));
//         //  y.domain([0, d3.max(csv, function(d) {return +d.TotalFirearmDeaths})]);
//         //
//         // svgM3.append("path")
//         //     .data([csv])
//         //     .attr("class", "line")
//         //     .attr('id', 'line1')
//         //     .style("stroke", "black")
//         //     .style("fill","none")
//         //     .attr("stroke-width", 2)
//         //     .attr("d", valueline);
//         //
//         // // Add the X Axis
//         // svg.append("g")
//         //     .attr("transform", "translate(0," + height + ")")
//         //     .attr("class", "axis")
//         //     .call(d3.axisBottom(x));
//         //
//         // // Add the Y Axis
//         // svg.append("g")
//         //     .attr("class", "axis")
//         //     .call(d3.axisLeft(y));
//         //
//         // // Add the Y Axis label
//         // svg.append("text")
//         //     .attr("transform", "rotate(-90)")
//         //     .attr("y", 0 - margin.left + 16)
//         //     .attr("x",0 - (height / 2))
//         //     .attr("dy", "1em")
//         //     .style("font-size", "14px")
//         //     .style("text-anchor", "middle")
//         //     .style("fill", "grey")
//         //     .text("Total Number of Firearm Deaths");
//
//    });
//
// }