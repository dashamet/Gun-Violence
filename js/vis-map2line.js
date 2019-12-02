//Creating variables for the SVG dimensions
var margin = {top: 30, right: 180, bottom: 30, left: 80},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    active = d3.select(null);

var svgM3 = d3.select("#map2-line").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale([width * 0.9]);

var path = d3.geoPath()
    .projection(projection);

var data = d3.map();

// for line graph
var parseTime = d3.timeParse("%Y");

var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var valueline = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.TotalFirearmDeaths); });

queue()
    .defer(d3.json, "data/us.topo.json")
    .defer(d3.json, "data/us-states.json")
    //.defer(d3.csv, "data/master.data.states.2019.01.18.csv")
    .await(createVisualization);


function createVisualization(error, data) {

   // load csv state names to topojson use data
    d3.csv("data/us-state-names.csv", function (csv) {
        var us = topojson.feature(data, data.objects.state).features;

        csv.forEach(function (d, i) {
            us.forEach(function (e, j) {
                if (d.id === e.id) {
                    e.name = d.name
                }
            })
        });

        svgM3.selectAll("map2line")
            .data(us)
            .enter().append("path")
            .attr("d", path)
            .attr("class", "state")
            .on("click", clicked);

        //zoom to state feature: https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2
        svgM3.on("click", stopped, true);

        var zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on("zoom", zoomed);

        svgM3.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .attr("opacity", .07)
            .on("click", reset);

        svgM3.call(zoom);

        function clicked(d) {
            if (active.node() === this) return reset();
            active.classed("active", false);
            active = d3.select(this).classed("active", true);

            var bounds = path.bounds(d),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = 0.9 / Math.max(dx / width, dy / height),
                translate = [width / 2 - scale * x, height / 2 - scale * y];

            svgM3.transition()
                .duration(750)
                .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );

        }

        function reset() {
            active.classed("active", false);
            active = d3.select(null);

            svgM3.transition()
                .duration(750)
                .call( zoom.transform, d3.zoomIdentity );
        }

        function zoomed() {
            svgM3.style("stroke-width", 1.5 / d3.event.transform.k + "px");
            svgM3.attr("transform", d3.event.transform);
        }

        // can drag when zoomed
            function stopped() {
                if (d3.event.defaultPrevented) d3.event.stopPropagation();
            }



    });

    // line graph data
    d3.csv("data/master.data.states.2019.01.18.csv", function (error, csv) {
        csv.forEach(function (d) {
            d.Year = parseTime(d.Year);
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

        //  x.domain(d3.extent(csv, function(d) { return d.Year; }));
        //  y.domain([0, d3.max(csv, function(d) {return +d.TotalFirearmDeaths})]);
        //
        // svgM3.append("path")
        //     .data([csv])
        //     .attr("class", "line")
        //     .attr('id', 'line1')
        //     .style("stroke", "black")
        //     .style("fill","none")
        //     .attr("stroke-width", 2)
        //     .attr("d", valueline);
        //
        // // Add the X Axis
        // svg.append("g")
        //     .attr("transform", "translate(0," + height + ")")
        //     .attr("class", "axis")
        //     .call(d3.axisBottom(x));
        //
        // // Add the Y Axis
        // svg.append("g")
        //     .attr("class", "axis")
        //     .call(d3.axisLeft(y));
        //
        // // Add the Y Axis label
        // svg.append("text")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", 0 - margin.left + 16)
        //     .attr("x",0 - (height / 2))
        //     .attr("dy", "1em")
        //     .style("font-size", "14px")
        //     .style("text-anchor", "middle")
        //     .style("fill", "grey")
        //     .text("Total Number of Firearm Deaths");

   });

}