map2Vis = function(_parentElement, _mapData, _stateNameData, _deathData, _policyData) {
    this.parentElement = _parentElement;
    this.mapData = topojson.feature(_mapData, _mapData.objects.state).features;
    this.stateNameData = _stateNameData;
    this.deathData = _deathData;
    this.policyData = _policyData;

    this.deathRates = [];

    // call method initVis
    this.initVis();
};

map2Vis.prototype.initVis = function() {
    let vis = this;

    vis.margin = {top: 30, right: 80, bottom: 50, left: 80};
    vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = $('#' + vis.parentElement).height() - margin.top - margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    vis.div2 = d3.select("#" + vis.parentElement)
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    vis.updateVis();

    vis.projection = d3.geoAlbersUsa()
        .translate([width / 2, height / 2])
        .scale([width * 0.9]);

    vis.path = d3.geoPath()
        .projection(vis.projection);

    vis.stateNameData.forEach(function (d) {
        vis.mapData.forEach(function (e) {
            if (d.id === e.id) {
                e.name = d.name
            }
        })
    });

    vis.svg.selectAll("map2")
        .data(vis.mapData)
        .enter().append("path")
        .attr("class", "state")
        .attr("d", vis.path)
        .attr("fill", 'transparent')
        //.transition()
        //.duration(100)
        //.attr("fill", function(d){
        // vis.stateName = d.name;
        // var index = 0;
        // for (i = 0; i < deathData2016.length; i++) {
        //     if (deathData2016[i]['State'] === stateName) {
        //         index = i;
        //     }
        // }
        // var val = deathData2016[index]['death_crude_rate'];
        // if (isNaN(val)) {
        //     return "Grey"
        // }
        // else {
        //     return colorScale(val);
        // }
        //})
        // .attr("opacity", function(d){
        //     var alpha = 0.1;
        //     var stateName = d.name;
        //     for (i = 0; i < policyData.length; i++) {
        //         if (policyData[i]['State'] === stateName) {
        //             alpha = 1
        //         }
        //     }
        //     return alpha;
        // })
        .attr("stroke", 'grey')
        .attr("stroke-width", 0.1);
    //.on("click", clicked);

    vis.wrangleData();
};

map2Vis.prototype.wrangleData = function() {
    let vis = this;

    vis.deathData2016 = vis.deathData.filter(function(d){
        return d.Year === "2016";
    });
    //vis.deathRates = [];

    vis.deathData2016.forEach(function(item, index){
        vis.deathRate = item['TotalFirearmDeaths']/item['Population'];
        item['death_crude_rate'] = vis.deathRate;
        vis.deathRates[index] = vis.deathRate
    });

    vis.policyData.forEach(function(d){
        d.Implemented = +d.Implemented;
        d.Repealed = +d.Repealed;
        d.Extant = +d.Extant;
    });


    vis.updateVis()
};

map2Vis.prototype.updateVis = function(){
    let vis = this;

    vis.selectedValue = d3.select("#data-value").property("value");
    console.log(vis.selectedValue);

    vis.policyData = vis.policyData.filter(function(d){
        return d.Law === vis.selectedValue && d.Extant === 1;
    });

    vis.colorScale = d3.scaleQuantize()
        .domain(d3.extent(vis.deathRates))
        .range(["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"]);

    vis.svg.selectAll(".state")
        .attr("fill", function(d) {
            vis.stateName = d.name;
            vis.index = 0;
            for (i = 0; i < vis.deathData2016.length; i++) {
                if (vis.deathData2016[i]['State'] === vis.stateName) {
                    vis.index = i;
                }
            }
            vis.val = vis.deathData2016[vis.index]['death_crude_rate'];
            if (isNaN(vis.val)) {
                return "Grey"
            }
            else {
                return vis.colorScale(vis.val);
            }
        })
        .attr("opacity", function(d) {
            vis.alpha = 0.5;
            vis.stateName = d.name;
            for (i = 0; i < vis.policyData.length; i++) {
                if (vis.policyData[i]['State'] === vis.stateName) {
                    vis.alpha = 1
                }
            }
            return vis.alpha;
        });
}


//var parseTime = d3.timeParse("%Y");
//
// var data = d3.map();
//
// runMap2();
//
// function runMap2(){
//     svgM2.selectAll("map2").remove();
//     queue()
//         .defer(d3.json, "data/us.topo.json")
//         .defer(d3.json, "data/us-states.json")
//         .defer(d3.csv, "data/master.data.states.2019.01.18.csv")
//         .defer(d3.csv, "data/policyData.csv")
//         .await(createMap2);
// }


//function createMap2(error, data, unused, deathData, policyData) {

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
//
// var deathData2016 = deathData.filter(function(data){
//     return data.Year === "2016";
// });
// var deathRates = [];
// deathData2016.forEach(function(item, index){
//     const deathRate = item['TotalFirearmDeaths']/item['Population'];
//     item['death_crude_rate'] = deathRate;
//     deathRates[index] = deathRate
// });

// var colorScale = d3.scaleQuantize()
//     .domain(d3.extent(deathRates))
//     .range(["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"]);
//

//var selectedValue = d3.select("#data-value").property("value");
//
// policyData.forEach(function(d){
//     d.Implemented = +d.Implemented;
//     d.Repealed = +d.Repealed;
//     d.Extant = +d.Extant;
// });
//
// policyData = policyData.filter(function(data){
//     return data.Law === selectedValue && data.Extant === 1;
// });
//
// console.log(policyData);

//load csv state names to topojson use data
// d3.csv("data/us-state-names.csv", function (csv) {
//     var us = topojson.feature(data, data.objects.state).features;
//
//     csv.forEach(function (d, i) {
//         us.forEach(function (e, j) {
//             if (d.id === e.id) {
//                 e.name = d.name
//             }
//         })
//     });

// svgM2.selectAll("map2")
//      .data(us)
//      .enter().append("path")
//      .attr("class", "state")
//      // .merge(map2)
//      .attr("d", path)
//      .transition()
//      .duration(100)
//      .attr("fill", function(d){
//          var stateName = d.name;
//          var index = 0;
//          for (i = 0; i < deathData2016.length; i++) {
//              if (deathData2016[i]['State'] === stateName) {
//                  index = i;
//              }
//          }
//          var val = deathData2016[index]['death_crude_rate'];
//          if (isNaN(val)) {
//              return "Grey"
//          }
//          else {
//              return colorScale(val);
//          }
//      })
//      .attr("opacity", function(d){
//          var alpha = 0.1;
//          var stateName = d.name;
//          for (i = 0; i < policyData.length; i++) {
//              if (policyData[i]['State'] === stateName) {
//                  alpha = 1
//              }
//          }
//          return alpha;
//      })
//      .attr("stroke", 'grey')
//      .attr("stroke-width", 0.1)
//      .on("click", clicked);

// function zoom() {
//     //zoom to state feature: https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2
//     svgM2.on("click", stopped, true);
//
//     var zoom = d3.zoom()
//         .scaleExtent([1, 8])
//         .on("zoom", zoomed);
//
//     var rect = svgM2.append("rect")
//         .attr("class", "background")
//         .attr("width", width)
//         .attr("height", height)
//         .attr("opacity", .07);
//
//     rect.on("click", reset);
//
//     svgM2.call(zoom);
//
//     function clicked(d) {
//         if (active.node() === this) return reset();
//         active.classed("active", false);
//         active = d3.select(this).classed("active", true);
//
//         var bounds = path.bounds(d),
//             dx = bounds[1][0] - bounds[0][0],
//             dy = bounds[1][1] - bounds[0][1],
//             x = (bounds[0][0] + bounds[1][0]) / 2,
//             y = (bounds[0][1] + bounds[1][1]) / 2,
//             scale = 0.9 / Math.max(dx / width, dy / height),
//             translate = [width / 2 - scale * x, height / 2 - scale * y];
//
//         svgM2.transition()
//             .duration(750)
//             .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
//
//     }
//
//     function reset() {
//         active.classed("active", false);
//         active = d3.select(null);
//
//         svgM2.transition()
//             .duration(750)
//             .call(zoom.transform, d3.zoomIdentity);
//     }
//
//     function zoomed() {
//         svgM2.style("stroke-width", 1.5 / d3.event.transform.k + "px");
//         svgM2.attr("transform", d3.event.transform);
//     }
//
//     // can drag when zoomed
//     function stopped() {
//         if (d3.event.defaultPrevented) d3.event.stopPropagation();
//     }
// };