//Creating variables for the SVG dimensions
map2LineVis = function(_parentElement, _mapData, _stateNameData, _deathData, _policyData) {
    this.parentElement = _parentElement;
    this.mapData = topojson.feature(_mapData, _mapData.objects.state).features;
    this.stateNameData = _stateNameData;
    this.deathData = _deathData;
    this.policyData = _policyData;

    this.nestedData = [];

    this.displayData = [];

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

    // clip path
    // vis.svg.append("defs")
    //     .append("clipPath")
    //     .attr("id", "clip")
    //     .append("rect")
    //     .attr("width", vis.width)
    //     .attr("height", vis.height);

    // for line graph
    vis.parseTime = d3.timeParse("%Y");

    vis.x = d3.scaleTime()
        .range([0, vis.width]);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.area = d3.area()
        .curve(d3.curveMonotoneX)
        .defined(d => !isNaN(d.TotalFirearmDeaths))
        .x(function(d) { console.log(vis.x(vis.parseTime(d.Year)));
        if(d.Year){
            return vis.x(vis.parseTime(d.Year));
        }
              })
        .y0(vis.y(0))
        .y1(d => vis.y(d.TotalFirearmDeaths));


    vis.xAxis = vis.svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.yAxis = vis.svg.append("g")
        .attr("class", "axis y-axis");

    vis.pathGroup = vis.svg.append('g')
        .attr('class', 'path-group');

    vis.path = vis.pathGroup
        .append('path')
        .attr('id', 'myLine');

    //policy data lines
    //add lines for when policy created
    /*vis.svg.selectAll("policyLine")
        .data(vis.filteredPolicyData)
        .enter().append("line")
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .attr("x1", 30)
        // .attr("x2", function(d){
        //     return d.Implemented
        // })
        // .attr("y1", function(d){
        //      return d.Implemented
        // })
        .attr("x2", 30)
        .attr("y1", 572)

        .attr("y2", 0);*/


    this.initDataWrangling();
};

//initial data load
map2LineVis.prototype.initDataWrangling = function(){
    let vis = this;

    vis.deathData.forEach(function (d) {
        d.Year = +d.Year;
        // d.FirearmHomicides = +d.FirearmHomicides;
        // d.FirearmSuicides = +d.FirearmSuicides;
        // d.TotalHuntingLicensesTagsPermitsandStamps = +d.TotalHuntingLicensesTagsPermitsandStamps;
        // d.BackgroundCheckHandgun = +d.BackgroundCheckHandgun;
        // d.BackgroundCheckLongGun = +d.BackgroundCheckLongGun;
        // d.BackgroundCheckMultipleGunTypes = +d.BackgroundCheckMultipleGunTypes;
        // d.BackgroundCheckRentalsHandgun = +d.BackgroundCheckRentalsHandgun;
        // d.BackgroundCheckRentalsLongGun = +d.BackgroundCheckRentalsLongGun;
        // d.BackgroundCheckPrivateSaleHandgun = +d.BackgroundCheckPrivateSaleHandgun;
        // d.BackgroundCheckPrivateSaleLongGun = +d.BackgroundCheckPrivateSaleLongGun;
        // d.BackgroundCheckTotals = +d.BackgroundCheckTotals;
        // d.PersonsUnder5years = +d.PersonsUnder5years;
        // d.Persons5to9years = +d.Persons5to9years;
        // d.Persons10to14years = +d.Persons10to14years;
        // d.Persons15to19years = +d.Persons15to19years;
        // d.TotalChildPop = +d.TotalChildPop;
        d.TotalFirearmDeaths = +d.TotalFirearmDeaths;
    });
    console.log(vis.deathData);

    //load policy data
    vis.policyData.forEach(function(d){
        d.Implemented = vis.parseTime(d.Implemented);
    });

    vis.filteredData = vis.deathData.sort(function(a,b){
        return a.Year - b.Year
    });

    vis.policyfilteredData = vis.policyData.sort(function(a,b){
        return a.Year - b.Year
    });

    // nest data
    vis.nestedData = d3.nest()
        .key(function(d){ return d.State})
        .entries(vis.filteredData);

    console.log(vis.nestedData);

    this.wrangleData();
}

//called by map2 every time a state is selected
map2LineVis.prototype.wrangleData = function(){
    let vis = this;

    // reset displayData
    vis.displayData = [];

    // iterate over nestedData and grab only selected States
    vis.nestedData.forEach(function(d){
        if (d.key === selectedState){
            vis.displayData = d.values;
        }
    })

    this.updateVis();
};

map2LineVis.prototype.updateVis = function(){
    let vis = this;

    // update domains
    vis.x.domain(d3.extent(vis.displayData, function(d) { return vis.parseTime(d.Year); }));
    vis.y.domain([0, d3.max(vis.displayData, function(d) {return d.TotalFirearmDeaths})]);

    //console.log(vis.filteredData);
    console.log(selectedState);
    console.log(vis.displayData);

    //draw path
    vis.path
        .datum(vis.displayData)
        .transition().duration(500)
        .attr('fill', "#B61717")
        .attr('stroke', 'transparent')
        .attr('d', vis.area);

    // Add the X Axis
   vis.xAxis
        .transition().duration(400)
        .call(d3.axisBottom(vis.x));

    // Add the Y Axis
    vis.yAxis
        .transition().duration(400)
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