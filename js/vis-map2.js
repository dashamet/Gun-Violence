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

    vis.margin = {top: 30, right: 150, bottom: 50, left: 80};
    vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.div2 = d3.select("#" + vis.parentElement)
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 1);

    vis.projection = d3.geoAlbersUsa()
        .translate([vis.width / 2, vis.height / 2])
        .scale([vis.width*1.5]);

    vis.path = d3.geoPath()
        .projection(vis.projection);

    vis.stateNameData.forEach(function (d) {
        vis.mapData.forEach(function (e) {
            if (d.id === e.id) {
                e.name = d.name
            }
        })
    });

    vis.svg.selectAll(".state")
        .data(vis.mapData)
        .enter().append("path")
        .attr("data-legend", function(d) { return d.name})
        .attr("class", "state")
        .attr("d", vis.path)
        .attr("fill", 'transparent')
        // .on('mouseover', function(d){
        //
        //     // set selectedState
        //     selectedState = d.name;
        //     myMap2LineVis.wrangleData();
        //
        //     d3.select(this)
        //         .attr('fill', 'rgb(105,105,105)')
        //         .style('opacity', 1)
        // })
        // .on('mouseout', function(d){
        //
        //     myMap2LineVis.wrangleData();
        //
        //     // return state back to original color (code in updateVis)
        //     d3.select(this)
        //         .attr("fill", function(d) {
        //             vis.stateName = d.name;
        //             vis.index = 0;
        //             for (i = 0; i < vis.deathData2016.length; i++) {
        //                 if (vis.deathData2016[i]['State'] === vis.stateName) {
        //                     vis.index = i;
        //                 }
        //             }
        //             vis.val = vis.deathData2016[vis.index]['death_crude_rate'];
        //             if (isNaN(vis.val)) {
        //                 return "Grey"
        //             }
        //             else {
        //                 return vis.colorScale(vis.val);
        //             }
        //         })
        // })
        //state border from grey back to black
        .attr('stroke', 'white')
        .attr('stroke-width', 1)


        .on('click', function(d){
            console.log(d);
        });

    this.wrangleData();
};

map2Vis.prototype.wrangleData = function() {
    let vis = this;

    vis.displayData = [];

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

    this.updateVis()
};

map2Vis.prototype.updateVis = function(){
    let vis = this;

    vis.selectedValue = d3.select("#data-value").property("value");


    //hide all states
    //vis.svg.selectAll('.state').transition().duration(1000).attr('opacity', 0);


    vis.filteredPolicyData = vis.policyData.filter(function(d){
        if (vis.selectedValue === 'all'){
            return vis.policyData
        }
        else{
            return d.Law === vis.selectedValue && d.Extant === 1;
        }
    });
    console.log(vis.filteredPolicyData.length)
    vis.colorScale = d3.scaleQuantize()
        .domain(d3.extent(vis.deathRates))
        .range(["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"]);

    // Make legend
    vis.lsW = vis.width/25;
    vis.lsH = vis.width/20;
    console.log('?')
    vis.drInt = (d3.max(vis.deathRates)-d3.min(vis.deathRates))/6
    for(i = 0; i < 6; i++){
        vis.svg.append('rect')
            .attr('width', vis.lsW)
            .attr('height', vis.lsH)
            .attr('x', vis.width-12)
            .attr('y', 5*vis.height/8+i*vis.lsH + 20)
            .attr('fill', function(){
                return vis.colorScale(d3.min(vis.deathRates)+i*vis.drInt)
            });
        vis.svg.append('text')
            .attr('x', vis.width + vis.lsH - 10)
            .attr('y', 5*vis.height/8+i*vis.lsH + 3*vis.lsH/4 + 20)
            .attr('text-anchor', 'beginning')
            .text(function(){
                vis.startNum = d3.format(",.2r")(d3.min(vis.deathRates)+i*vis.drInt*1000)
                vis.endNum = d3.format(",.2r")(d3.min(vis.deathRates)+(i+1)*vis.drInt*1000)
                console.log(vis.startNum, vis.endNum);
                return vis.startNum + ' - ' + vis.endNum;
            })
            .attr('font-size', 3*vis.lsH/4 - 3 + 'px');
    }
    vis.svg.append('text')
        .attr('x', vis.width + vis.lsH + 5)
        .attr('y', 5*vis.height/8 + 5)
        .attr('text-anchor', 'middle')
        .text('Death Rate')
        .attr('font-size', 3*vis.lsH/4 + 'px');

    vis.svg.selectAll(".state")
        .on('mouseover', function(d){

            // set selectedState
            selectedState = d.name;
            myMap2LineVis.wrangleData();

            d3.select(this)
                .attr('fill', 'rgb(105,105,105)')
                .attr('opacity', 1)
        })
        .on('mouseout', function(d){

            myMap2LineVis.wrangleData();

            // return state back to original color (code in updateVis)
            d3.select(this)
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
                    if (vis.selectedValue === 'all'){
                        vis.alpha = 1
                    }
                    else{
                        vis.alpha = 1;
                        vis.stateName = d.name;
                        for (i = 0; i < vis.filteredPolicyData.length; i++) {
                            if (vis.filteredPolicyData[i]['State'] === vis.stateName) {
                                vis.alpha = 0.3;
                                console.log(vis.stateName)
                            }
                        }
                    }
                    return vis.alpha;
                })
        })
        .transition().duration(800)
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
            vis.alpha = 1;
            vis.stateName = d.name;
            if (vis.selectedValue === 'all'){
                vis.alpha = 1
            }
            else{
                vis.alpha = 1;
                vis.stateName = d.name;
                for (i = 0; i < vis.filteredPolicyData.length; i++) {
                    if (vis.filteredPolicyData[i]['State'] === vis.stateName) {
                        vis.alpha = 0.3;
                        console.log(vis.stateName)
                    }
                }
            }
            return vis.alpha;
        })
};