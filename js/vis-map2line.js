//Creating variables for the SVG dimensions
map2LineVis = function(_parentElement, _mapData, _stateNameData, _deathData, _policyData) {
    this.parentElement = _parentElement;
    this.mapData = topojson.feature(_mapData, _mapData.objects.state).features;
    this.stateNameData = _stateNameData;
    this.deathData = _deathData;
    this.policyData = _policyData;

    //initialize nested data
    this.nestedData = [];
    this.policyNest = [];

    //initialize display data
    this.displayData = [];
    this.policyDisplayData = [];

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

    // Append Div for tooltip to SVG
    vis.div = d3.select("#kmap2")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // for line graph
    vis.parseTime = d3.timeParse("%Y");

    vis.x = d3.scaleTime()
        .range([0, vis.width]);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.area = d3.area()
        .curve(d3.curveMonotoneX)
        .defined(d => !isNaN(d.TotalFirearmDeaths))
        .x(function(d) {
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

    //make sure y-axis text appends only once
    vis.yGroup = vis.svg.append("g")
        .attr("class", "y-group");

    vis.yText = vis.yGroup
        .append("text")
        .attr("id", "y-text");

    //initialize area path
    vis.pathGroup = vis.svg.append('g')
        .attr('class', 'path-group');

    vis.path = vis.pathGroup
        .append('path')
        .attr('id', 'myLine');

    //title group
    vis.titleGroup = vis.svg.append("g")
        .attr("class", "title-group");

    vis.title = vis.titleGroup
        .append("text")
        .attr("id", "my-title");

    //initialize policy data lines
    vis.policyGroup = vis.svg.append("g")
        .attr("class", "policy-group");

    this.initDataWrangling();
};

//initial data load
map2LineVis.prototype.initDataWrangling = function(){
    let vis = this;

    //load line graph data
    vis.deathData.forEach(function (d) {
        d.Year = +d.Year;
        // d.BackgroundCheckTotals = +d.BackgroundCheckTotals;
        d.TotalFirearmDeaths = +d.TotalFirearmDeaths;
    });
    console.log(vis.deathData);

    //load policy data
    vis.policyData.forEach(function(d){
        d.Implemented = +d.Implemented;
    });

    //sort the years
    vis.filteredData = vis.deathData.sort(function(a,b){
        return a.Year - b.Year
    });

    vis.policyfilteredData = vis.policyData.sort(function(a,b){
        return a.Implemented - b.Implemented
    });

    // nest line graph data
    vis.nestedData = d3.nest()
        .key(function(d){ return d.State})
        .entries(vis.filteredData);

    // nest policy line data
    vis.policyNest = d3.nest()
        .key(function(d){ return d.State})
        .entries(vis.policyfilteredData);

    // console.log(vis.nestedData);
    // console.log(vis.policyNest);

    this.wrangleData();
}

//called by map2 every time a state is selected
map2LineVis.prototype.wrangleData = function(){
    let vis = this;

    // reset displayData
    vis.displayData = [];
    vis.policyDisplayData = [];

    // iterate over nestedData and grab only selected States
    vis.nestedData.forEach(function(d){
        if (d.key === selectedState){
            vis.displayData = d.values;
        }
    });

    // iterate over policyData and grab only selected States
    vis.policyNest.forEach(function(d){
        if (d.key === selectedState){
            vis.policyDisplayData = d.values;
        }
    });

    this.updateVis();
};

map2LineVis.prototype.updateVis = function(){
    let vis = this;

    // update domains
    vis.x.domain(d3.extent(vis.displayData, function(d) { return vis.parseTime(d.Year); }));
    vis.y.domain([0, d3.max(vis.displayData, function(d) {return d.TotalFirearmDeaths})]);

    // console.log(selectedState);
    //console.log(vis.displayData);

    console.log(vis.policyDisplayData);

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
    vis.yText
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - vis.margin.left + 16)
        .attr("x",0 - (vis.height / 2))
        .attr("dy", "1em")
        .style("font-size", "14px")
        .style("text-anchor", "middle")
        .style("fill", "grey")
        .text("Total Number of Firearm Deaths");

    // Add dynamically changing title
    vis.title
        .attr("x", (vis.width / 2))
        .attr("y", 0 - (vis.margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "grey")
        .text(selectedState);

    //make lines from previous selected state disappear
    vis.svg.selectAll("line").attr('opacity', 0);

    //add lines for when state policy implemented
    vis.policy = vis.policyGroup
        .selectAll("policyLine")
        .data(vis.policyDisplayData)
        .enter().append("line")
        .merge(vis.policyGroup)
        .attr("stroke-width", 3)
        .attr("stroke", "black")
        //make policy lines  prior to 1978 opaque
        .attr("opacity", function(d){
            if(d.Implemented < 1978){
                return .4;
            }
            else {
                return .9;
            }
        })
        //how far down
        .attr("y1", 0)
        //length
        .attr("y2", vis.height)
        //orient policy data that extends before line graph data (< 1978) before line graph starts
        .attr("x1", function(d){
            if(d.Implemented < 1978){
                return 10
            }
            else {
                return (vis.x(vis.parseTime(d.Implemented)));
            }
        })
        .attr("x2", function(d){
            if(d.Implemented < 1978){
                return 10
            }
            else {
                return (vis.x(vis.parseTime(d.Implemented)));
            }
        })
        //on hover, show law and the year law was implemented
        .on("mouseover", function(d) {
            vis.div.transition()
                .duration(50)
                .style("opacity", .9);
            vis.div.html(function () {
                if (d.Implemented === ""){
                    return "<strong> Type of Law: </strong>" + d.Law
                }
                //turn name of Law into an understandable string
                else{
                    if(d.Law === "min_age_possession"){
                        return "<strong> Type of Law: </strong>" + "Minimum Age for Firearm Possession" + " <br> "+
                            "<strong> Implemented: </strong>" + d.Implemented + " <br> "
                    }
                    else{
                        return "<strong> Type of Law: </strong>" + "Minimum Age For Purchasing Firearms" + " <br> "+
                            "<strong> Implemented: </strong>" + d.Implemented + " <br> "
                    }
                }
            })
                .style("left", (100) + "px")
                .style("top", (300) + "px");
        })

        //fade out tooltip on mouse out
        .on("mouseout", function(d) {
            vis.div.transition()
                .duration(50)
                .style("opacity", 0);
        })
        //transition for policy lines
        .transition().duration(300);
};