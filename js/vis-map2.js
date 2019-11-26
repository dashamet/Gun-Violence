// Creating variables for the SVG dimensions
var margin = {top: 30, right: 180, bottom: 30, left: 80},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    active = d3.select(null);

var parseTime = d3.timeParse("%Y");

// Append Div for tooltip to SVG
var div2 = d3.select("#map2")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var svgM2 = d3.select("#map2").append("svg")
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

runMap2();

function runMap2(){
    svgM2.selectAll("map2").remove();
    queue()
        .defer(d3.json, "data/us.topo.json")
        .defer(d3.json, "data/us-states.json")
        .defer(d3.csv, "data/master.data.states.2019.01.18.csv")
        .defer(d3.csv, "data/policyData.csv")
        .await(createMap2);
}


function createMap2(error, data, unused, deathData, policyData) {

    // //if add more data, take the dots between the name of the column of the data you are using
    // d3.csv("data/master.data.states.2019.01.18.csv", function (error, csv) {
    //     csv.forEach(function (d) {
    //             // d.Year = parseTime(d.Year);
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
    // });

    var deathData2016 = deathData.filter(function(data){
        return data.Year === "2016";
    });

    var deathRates = [];
    deathData2016.forEach(function(item, index){
        const deathRate = item['TotalFirearmDeaths']/item['Population'];
        item['death_crude_rate'] = deathRate;
        deathRates[index] = deathRate
    });

    var colorScale = d3.scaleQuantize()
        .domain(d3.extent(deathRates))
        .range(["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"]);


    var selectedValue = d3.select("#data-value").property("value");

    policyData.forEach(function(d){
        d.Implemented = +d.Implemented;
        d.Repealed = +d.Repealed;
        d.Extant = +d.Extant;
    });

    policyData = policyData.filter(function(data){
        return data.Law === selectedValue && data.Extant === 1;
    });

    console.log(policyData);

    //load csv state names to topojson use data
    d3.csv("data/us-state-names.csv", function (csv) {
        var us = topojson.feature(data, data.objects.state).features;

        csv.forEach(function (d, i) {
            us.forEach(function (e, j) {
                if (d.id === e.id) {
                    e.name = d.name
                }
            })
        });

       svgM2.selectAll("map2")
            .data(us)
            .enter().append("path")
            .attr("class", "state")
            // .merge(map2)
            .attr("d", path)
            .transition()
            .duration(100)
            .attr("fill", function(d){
                var stateName = d.name;
                var index = 0;
                for (i = 0; i < deathData2016.length; i++) {
                    if (deathData2016[i]['State'] === stateName) {
                        index = i;
                    }
                }
                var val = deathData2016[index]['death_crude_rate'];
                if (isNaN(val)) {
                    return "Grey"
                }
                else {
                    return colorScale(val);
                }
            })
            .attr("opacity", function(d){
                var alpha = 0.1;
                var stateName = d.name;
                for (i = 0; i < policyData.length; i++) {
                    if (policyData[i]['State'] === stateName) {
                        alpha = 1
                    }
                }
                return alpha;
            })
            .attr("stroke", 'grey')
            .attr("stroke-width", 0.1)
            .on("click", clicked);

        //zoom to state feature: https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2
        svgM2.on("click", stopped, true);

        var zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on("zoom", zoomed);

        var rect = svgM2.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .attr("opacity", .07);

        rect.on("click", reset);

        svgM2.call(zoom);

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

            svgM2.transition()
                .duration(750)
                .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );

        }

        function reset() {
            active.classed("active", false);
            active = d3.select(null);

            svgM2.transition()
                .duration(750)
                .call( zoom.transform, d3.zoomIdentity );
        }

        function zoomed() {
            svgM2.style("stroke-width", 1.5 / d3.event.transform.k + "px");
            svgM2.attr("transform", d3.event.transform);
        }

        // can drag when zoomed
        function stopped() {
            if (d3.event.defaultPrevented) d3.event.stopPropagation();
        }
    });

}