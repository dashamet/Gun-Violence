brushVis = function(_parentElement, _deathData) {
    this.parentElement = _parentElement;
    this.deathData = _deathData;
    this.displayData = [];

    // call method initVis
    this.initVis();
};

// init brushVis
brushVis.prototype.initVis = function() {
    let vis = this;

    vis.margin = {top: 20, right: 50, bottom: 20, left: 50};
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // clip path
    vis.svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", vis.width)
        .attr("height", vis.height);

    console.log(vis.height);


    // init scales
    vis.x = d3.scaleTime().range([0, vis.width]);
    vis.y = d3.scaleLinear().range([vis.height, 0]);

    // init x & y axis
    vis.xAxis = vis.svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + vis.height + ")");
    vis.yAxis = vis.svg.append("g")
        .attr("class", "axis axis--y");

    // init pathGroup
    vis.pathGroup = vis.svg.append('g').attr('class','pathGroup');

    // init path one (average)
    vis.pathOne = vis.pathGroup
        .append('path')
        .attr("class", "pathOne");

    // init path two (single state)
    vis.pathTwo = vis.pathGroup
        .append('path')
        .attr("class", "pathTwo");

    // init path generator
    vis.area = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function(d) {

            console.log(d.Year);
          //  return vis.x(d.Year);


        })
        .y0(vis.y(0))
        .y1(function(d) {

            console.log(d.TotalFirearmDeaths);
            //return vis.y(d.TotalFirearmDeaths);

        });

    // init brushGroup:
    vis.brushGroup = vis.svg.append("g")
        .attr("class", "brush");

    // init brush
    vis.brush = d3.brushX()
        .extent([[0, 0], [vis.width, vis.height]])
        .on("brush end", function(){
            let currentBrushRegion = d3.event.selection;
            myMap2.selectedRegion = [vis.x.invert(currentBrushRegion[0]), vis.x.invert(currentBrushRegion[1])];
            myMap2.wrangleData();
        });

    // call method initVis
    this.initDataWrangling();
};

// initDataWrangling - data wrangling, done only once
brushVis.prototype.initDataWrangling = function() {
    let vis = this;

    let parseDate = d3.timeParse("%Y");

    vis.deathData.forEach(function(d){
        d.Year = parseDate(d.Year);
        d.TotalFirearmDeaths = parseFloat(d.TotalFirearmDeaths);
    });

    vis.filteredData = vis.deathData.sort(function(a,b){
        return a.Year - b.Year
    });

    let dataByDate = d3.nest()
        .key(function(d) { return d.Year; })
        .entries(vis.filteredData);

    vis.averageData = [];

    // iterate over each year
    dataByDate.forEach( Year => {
        let tmpSum = 0;
        let tmpLength = Year.values.length;
        let tmpDate = Year.values[0].date;
        Year.values.forEach( value => {
            tmpSum += value.average;
        });

        vis.averageData.push (
            {date: tmpDate, average: tmpSum/tmpLength}
        )
    });

    this.wrangleData();
};

// wrangleData - gets called whenever a state is selected
brushVis.prototype.wrangleData = function(){
    let vis = this;

    // reset displayData
    vis.displayData = [];

    // iterate over filteredData and gab only selected States
    if (selectedState === '') {
        vis.filteredData.forEach(d => {
            vis.displayData.push(d);
        })
    } else {
        vis.filteredData.forEach(d => {
            if (d.State === selectedState) {
                vis.displayData.push(d);
            }
        })
    }

    // Update the visualization
    this.updateVis();
};

// updateVis
brushVis.prototype.updateVis = function() {
    let vis = this;

    // update domains
    vis.x.domain( d3.extent(vis.displayData, function(d) { return d.Year }) );
    vis.y.domain( d3.extent(vis.filteredData, function(d) { return d.TotalFirearmDeaths }) );

    // draw x & y axis
    vis.xAxis.transition().duration(400).call(d3.axisBottom(vis.x));
    vis.yAxis.transition().duration(400).call(d3.axisLeft(vis.y).ticks(2));

    // draw pathOne
    vis.pathOne.datum(vis.averageData)
        .transition().duration(400)
        .attr("d", vis.area)
        .attr("clip-path", "url(#clip)");

    // draw pathTwo if selectedState
    if (selectedState !== ''){
        vis.pathTwo.datum(vis.displayData)
            .transition().duration(400)
            .attr('fill', 'rgba(255,0,0,0.47)')
            .attr('stroke', 'darkred')
            .attr("d", vis.area);
    } else {
        vis.pathTwo.datum([vis.filteredData[1], vis.filteredData[299]])
            .transition().duration(400)
            .attr('fill', 'rgba(255,0,0,0)')
            .attr('stroke', 'transparent')
            .attr("d", vis.area);
    }

    vis.brushGroup
        .call(vis.brush);
};