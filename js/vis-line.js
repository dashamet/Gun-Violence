lineVis = function(_parentElement, _deathInjData) {
    this.parentElement = _parentElement;
    this.data = _deathInjData;

    // call method initVis
    this.initVis();
};

lineVis.prototype.initVis = function() {
    let vis = this;

    // Creating variables for the SVG dimensions
    vis.margin = {top: 150, right: 220, bottom: 30, left: 80};
    vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right - 100;
    vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

    // Setting the ranges
    vis.x = d3.scaleTime().range([0, vis.width]);
    vis.y = d3.scaleLinear().range([vis.height, 0]);

    // Setting up a function that will covert a year string to a date
    vis.parseTime = d3.timeParse("%Y");

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Setting up a colour scale
    vis.color = d3.scaleOrdinal()

    // Creating a function to format the pop-up text
    vis.groupTxt = function(group) {
        if (group === "intentional_homicides") {
            return " killed by homicide";
        } else if(group === "intentional_suicides"){
            return " dead by suicide";
        } else if(group === "unintentional_deaths"){
            return " killed in an accident";
        } else if(group === "unintentional_injuries"){
            return " injured in an accident";
        } else if(group === "intentional_injuries"){
            return " injured by violence";
        }
    };

    // define the 1st line
    vis.valueline = d3.line()
        .x(function(d) {return vis.x(d.year); })
        .y(function(d) {return vis.y(d.intentional_homicides);})

    // define the 2nd line
    vis.valueline2 = d3.line()
        .x(function(d) {return vis.x(d.year); })
        .y(function(d) {return vis.y(d.intentional_suicides); })

    // define the 3rd line
    vis.valueline3 = d3.line()
        .x(function(d) {return vis.x(d.year); })
        .y(function(d) {return vis.y(d.unintentional_deaths); })

    // define the 4th line
    vis.valueline4 = d3.line()
        .defined(d => !isNaN(d.unintentional_injuries))
        .x(d => vis.x(d.year))
        .y(d => vis.y(d.unintentional_injuries))

    //define the 5th line
    vis.valueline5 = d3.line()
        .defined(d => !isNaN(d.intentional_injuries))
        .x(d => vis.x(d.year))
        .y(d => vis.y(d.intentional_injuries))

    vis.onMouseOver = function(){
        vis.current_id = d3.select(this).attr("id");
        d3.selectAll("#" + vis.current_id)
            .style("stroke-width","5px")
            .style("font-size", "20px")
            .style("stroke",  function(){
                if(d3.select(this).attr("class") !== "text"){
                    return "red"
                }
            })
            .style("fill", function(){
                if(d3.select(this).attr("class") === "circle"){
                    return "red"
                }
                else if(d3.select(this).attr("class") === "line"){
                    return "white"
                }
            });
        d3.selectAll(".line,.circle,.text")
            .style("opacity", function() {
                return (d3.select(this).attr('id') === vis.current_id) ? 1.0 : 0.2;
            });
        vis.svg.append("text")
            .attr("x", vis.width / 2)
            .attr("y", "7")
            .attr("text-anchor", "middle")
            .attr("class", "percent")
            .style("font-size", "20px")
            .style("fill", "red")
        d3.select(".initial").remove()
        d3.select(".title").remove()
        vis.svg.append("text")
            .attr("x", (vis.width / 2) + 60)
            .attr("y", -0.45*vis.margin.top)
            .attr("text-anchor", "middle")
            .attr("class", "description")
            .text(function(){
                    if(vis.current_id === "line1"){
                        return "Gun violence, as opposed to suicides or accidents, remains the largest firearm-related cause of death among youth."
                    }
                    else if(vis.current_id === "line2"){
                        return "The rate of suicides committed by firearms doubled from 2008 to 2017."
                    }
                    else if(vis.current_id === "line3"){
                        return "Accidents are responsible for the smallest proportion of youth deaths by firearms, and they have remained relatively stagnant."
                    }
                    else if(vis.current_id === "line4"){
                        return "Injuries caused by accidents with firearms have sharply declined since 2008."
                    }
                    else if(vis.current_id === "line5"){
                        return "The number of young people injured by gun violence has consistently been increasing."
                    }
                }
            )
            .style("font-size", "20px");
        vis.svg.append("text")
            .attr("x", vis.width/2)
            .attr("y", "-30")
            .attr("class", "percent")
            .text(function(){
                    if(vis.current_id === "line1"){
                        return "+0.96% (2008-2017)"
                    }
                    else if(vis.current_id === "line2"){
                        return "+102% (2008-2017)"
                    }
                    else if(vis.current_id === "line3"){
                        return "-3% (2008-2017)"
                    }
                    else if(vis.current_id === "line4"){
                        return "-32% (2008-2017)"
                    }
                    else if(vis.current_id === "line5"){
                        return "+57% (2008-2017)"
                    }
                }
            )
            .style("font-size", "20px")
            .style("fill", "red")
    };

    vis.onMouseOut = function(){
        d3.selectAll(".line,.circle,.text")
            .style("stroke-width", "3px")
            .style("font-size", "16px")
            .style("opacity", 1.0)
            .style("stroke", function(){
                if(d3.select(this).attr("class") !== "text"){
                    return "black"
                }
            })
            .style("fill", function(){
                if(d3.select(this).attr("class") === "line"){
                    return "white"
                }
                else if(d3.select(this).attr("class") === "circle"){
                    return "black"
                }
            });
        vis.svg.selectAll(".percent").remove();
        vis.svg.selectAll(".description").remove();
        d3.select(".sec3title")
            .attr("opacity", 1.0)
        vis.svg.append("text")
            .attr("x", (vis.width / 2) + 60)
            .attr("y", -0.45*vis.margin.top)
            .attr("text-anchor", "middle")
            .attr("class", "initial")
            .text("Hover over a line's label to highlight a cause of injury or death. Hover over a point to see the totals for a specific year.")
        vis.svg.append("text")
            .attr("x", (vis.width / 2) + 60)
            .attr("y", -0.8*vis.margin.top)
            .attr("text-anchor", "middle")
            .attr("class", "title")
            .text("The number of young people killed or injured by guns is on the rise.")
    };

    vis.wrangleData();
};

lineVis.prototype.wrangleData = function() {
    let vis = this;

    vis.color.domain(d3.keys(vis.data[0]).filter(function(key) { return key !== "year"; }));

    vis.data.forEach(function(d) {
        d.year = vis.parseTime(d.year);
        d.intentional_homicides = +d.intentional_homicides;
        d.intentional_suicides = +d.intentional_suicides;
        d.unintentional_deaths = +d.unintentional_deaths;
        d.unintentional_injuries = Number(d.unintentional_injuries);
        d.intentional_injuries = Number(d.intentional_injuries);
        vis.mod_data = vis.color.domain().map(function(name) {
            return {
                name: name,
                values: vis.data.map(function(d) {
                    return {year: d.year, victims: d[name], type: name};
                })
            };
        });

        console.log(vis.mod_data)
    });

    // Scale the range of the data
    vis.x.domain(d3.extent(vis.data, function(d) { return d.year; }));
    vis.y.domain([0, d3.max(vis.data, function(d) {
        return Math.max(d.intentional_homicides, d.intentional_suicides, d.unintentional_deaths, d.unintentional_injuries,
            d.intentional_injuries); })+1000]);

    vis.updateVis()
};

lineVis.prototype.updateVis = function() {
    let vis = this;

    // Add the valueline path.
    vis.svg.append("path")
        .data([vis.data])
        .attr("class", "line")
        .attr('id', 'line1')
        .style("stroke", "black")
        .style("fill","none")
        .attr("stroke-width", 2)
        .attr("d", vis.valueline);

    // Add the valueline2 path.
    vis.svg.append("path")
        .data([vis.data])
        .attr("class", "line")
        .attr("id", "line2")
        .style("stroke", "black")
        .style("fill","none")
        .attr("stroke-width", 1.5)
        .attr("d", vis.valueline2);

    // Add the valueline3 path.
    vis.svg.append("path")
        .data([vis.data])
        .attr("class", "line")
        .attr("id", "line3")
        .style("stroke", "black")
        .style("fill","none")
        .attr("stroke-width", 1.5)
        .attr("d", vis.valueline3);

    // Add the valueline4 paths.
    vis.svg.append("path")
        .datum(vis.data.filter(vis.valueline4.defined()))
        .attr("class", "line")
        .attr("id", "line4")
        .style("stroke", "black")
        .style("stroke-dasharray", ("2, 3"))
        .style("fill","none")
        .attr("d", vis.valueline4);

    vis.svg.append("path")
        .datum(vis.data)
        .style("stroke", "black")
        .attr("class", "line")
        .attr("id", "line4")
        .style("fill","none")
        .attr("stroke-width", 1.5)
        .attr("d", vis.valueline4);

    // Add the valueline5 paths.
    vis.svg.append("path")
        .datum(vis.data.filter(vis.valueline5.defined()))
        .attr("class", "line")
        .attr("id", "line5")
        .style("stroke", "black")
        .style("stroke-dasharray", ("2, 3"))
        .style("fill","none")
        .attr("d", vis.valueline5);

    vis.svg.append("path")
        .datum(vis.data)
        .attr("class", "line")
        .attr("id", "line5")
        .style("stroke", "black")
        .style("fill","none")
        .attr("stroke-width", 1.5)
        .attr("d",vis.valueline5);

    vis.records = vis.svg.selectAll(".records")
        .data(vis.mod_data)
        .enter().append("g")
        .attr("class", "records");

    vis.div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    vis.records.append("g").selectAll("circle")
        .data(function(d){return d.values})
        .enter()
        .append("circle")
        .attr("fill", "black")
        .attr("r", function(d){
            if(isNaN(d.victims)){
                return 0
            }
            else{return 4}
        })
        .attr("cx", function(d){return vis.x(d.year)})
        .attr("cy", function(d){
            if(isNaN(d.victims)){
                return 0
            }
            else{return vis.y(d.victims)}
        })
        .attr("class", "circle")
        .attr('id', function(d){
            if (d.type === "intentional_homicides") {
                return "line1";
            } else if(d.type === "intentional_suicides"){
                return "line2";
            } else if(d.type === "unintentional_deaths"){
                return "line3";
            } else if(d.type === "unintentional_injuries"){
                return "line4";
            } else if(d.type === "intentional_injuries"){
                return "line5";
            }
        })
        .attr("stroke", "black")
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration(50)
                .attr('opacity', '.85')
                .attr('r', 8);
            vis.div.transition()
                .duration(50)
                .style("opacity", 1.5);
            vis.div.html(function () {
                if (isNaN(d.victims)) {
                    return "<strong>" + d.year.getFullYear() + "</strong>" + " <br> " + "No data available"
                } else {
                    return "<strong>" + d.year.getFullYear() + "</strong>" + " <br> " + d.victims + vis.groupTxt(d.type)
                }
            })
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 15) + "px");
        })
        .on('mouseout', function (d) {
            d3.select(this).transition()
                .duration(50)
                .attr('r', 4);
            vis.div.transition()
                .duration('50')
                .style("opacity", 0);
        });

    // Add the X Axis
    vis.svg.append("g")
        .attr("transform", "translate(0," + vis.height + ")")
        .attr("class", "axis x-axis")
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
        .style("fill", "#969695")
        .text("Number of youth victims");

    vis.svg.append("text")
        .attr("transform", "translate("+(vis.width + 10)+","+vis.y(vis.data[0].intentional_homicides)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "black")
        .text("Deaths from violence")
        .attr("class", "text")
        .attr("id", "line1")
        .on("mouseover", vis.onMouseOver)
        .on("mouseout", vis.onMouseOut);

    vis.svg.append("text")
        .attr("transform", "translate("+(vis.width + 10)+","+vis.y(vis.data[0].intentional_suicides + 300)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "black")
        .text("Deaths by suicide")
        .attr("class", "text")
        .attr("id", "line2")
        .on("mouseover", vis.onMouseOver)
        .on("mouseout", vis.onMouseOut);

    vis.svg.append("text")
        .attr("transform", "translate("+(vis.width + 10)+","+vis.y(vis.data[0].unintentional_deaths)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "black")
        .text("Deaths from accidents")
        .attr("class", "text")
        .attr("id", "line3")
        .on("mouseover", vis.onMouseOver)
        .on("mouseout", vis.onMouseOut);

    vis.svg.append("text")
        .attr("transform", "translate("+(vis.x(vis.parseTime(2015)) + 10)+","+vis.y(vis.data[0].unintentional_injuries - 698)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "black")
        .text("Injuries from accidents")
        .attr("class", "text")
        .attr("id", "line4")
        .on("mouseover", vis.onMouseOver)
        .on("mouseout", vis.onMouseOut);

    console.log(vis.height-97)
    vis.svg.append("text")
        .attr("transform", "translate("+(vis.x(vis.parseTime(2016)) + 10)+","+vis.y(vis.data[0].intentional_injuries + 2400)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "black")
        .text("Injuries from violence")
        .attr("class", "text")
        .attr("id", "line5")
        .on("mouseover", vis.onMouseOver)
        .on("mouseout", vis.onMouseOut);

    vis.svg.append("text")
        .attr("x", "5")
        .attr("y", vis.height + 56)
        .attr("class", "caption")
        .style("font-size", "14px")
        .text("Note: The dashed line represents missing data")

    vis.svg.append("text")
        .attr("x", (vis.width / 2) + 60)
        .attr("y", -0.45*vis.margin.top)
        .attr("text-anchor", "middle")
        .attr("class", "initial")
        .text("Hover over a line's label to highlight a cause of injury or death.\n" +
            "Hover over a point to see the totals for a specific year.")

    vis.svg.append("text")
        .attr("x", (vis.width / 2) + 60)
        .attr("y", -0.8*vis.margin.top)
        .attr("text-anchor", "middle")
        .attr("class", "title")
        .text("The number of young people killed or injured by guns is on the rise.")


};



//
// // Creating variables for the SVG dimensions
// var margin = {top: 10, right: 220, bottom: 20, left: 60},
//     width = 1100 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;

// Setting the ranges
// var x = d3.scaleTime().range([0, width]);
// var y = d3.scaleLinear().range([height, 0]);

// Setting up a function that will covert a year string to a date
// var parseTime = d3.timeParse("%Y")

// // Setting up a colour scale
// var color = d3.scaleOrdinal()

// Creating a function to format the pop-up text
// function groupTxt(group) {
//     if (group === "intentional_homicides") {
//         return " killed by homicide";
//     } else if(group === "intentional_suicides"){
//         return " dead by suicide";
//     } else if(group === "unintentional_deaths"){
//         return " killed in an accident";
//     } else if(group === "unintentional_injuries"){
//         return " injured in an accident";
//     } else if(group === "intentional_injuries"){
//         return " injured by violence";
//     }
// }
//
// // define the 1st line
// var valueline = d3.line()
//     .x(function(d) {return x(d.year); })
//     .y(function(d) {return y(d.intentional_homicides);})

// // define the 2nd line
// var valueline2 = d3.line()
//     .x(function(d) {return x(d.year); })
//     .y(function(d) {return y(d.intentional_suicides); })
//
// // define the 3rd line
// var valueline3 = d3.line()
//     .x(function(d) {return x(d.year); })
//     .y(function(d) {return y(d.unintentional_deaths); })
//
// // define the 4th line
// var valueline4 = d3.line()
//     .defined(d => !isNaN(d.unintentional_injuries))
//     .x(d => x(d.year))
//     .y(d => y(d.unintentional_injuries))
//
// //define the 5th line
// var valueline5 = d3.line()
//     .defined(d => !isNaN(d.intentional_injuries))
//     .x(d => x(d.year))
//     .y(d => y(d.intentional_injuries))


// // appends the svg object to the body of the page
// // appends a 'group' element to 'svg'
// // moves the 'group' element to the top left margin
// var svg = d3.select("#line-graph").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");

// function onMouseOver(){
//     var current_id = d3.select(this).attr("id")
//     d3.selectAll("#" + current_id)
//         .style("stroke-width","5px")
//         .style("font-size", "20px")
//         .style("stroke",  function(){
//             if(d3.select(this).attr("class") !== "text"){
//                 return "red"
//             }
//         })
//         .style("fill", function(){
//             if(d3.select(this).attr("class") === "circle"){
//                 return "red"
//             }
//             else if(d3.select(this).attr("class") === "line"){
//                 return "white"
//             }
//         })
//     d3.selectAll(".line,.circle,.text")
//         .style("opacity", function() {
//             return (d3.select(this).attr('id') === current_id) ? 1.0 : 0.2;
//         })
//     svg.append("text")
//         .attr("x", "10")
//         .attr("y", "10")
//         .attr("class", "percent")
//         .text(function(){
//                 if(current_id === "line1"){
//                     return "+0.96% (2008-2017)"
//                 }
//                 else if(current_id === "line2"){
//                     return "+102% (2008-2017)"
//                 }
//                 else if(current_id === "line3"){
//                     return "-3% (2008-2017)"
//                 }
//                 else if(current_id === "line4"){
//                     return "-32% (2008-2017)"
//                 }
//                 else if(current_id === "line5"){
//                     return "+57% (2008-2017)"
//                 }
//             }
//         )
//         .style("font-size", "20px")
//         .style("fill", "red")
// }

// function onMouseOut(){
//     d3.selectAll(".line,.circle,.text")
//         .style("stroke-width", "3px")
//         .style("font-size", "16px")
//         .style("opacity", 1.0)
//         .style("stroke", function(){
//             if(d3.select(this).attr("class") !== "text"){
//                 return "black"
//             }
//         })
//         .style("fill", function(){
//             if(d3.select(this).attr("class") === "line"){
//                 return "white"
//             }
//             else if(d3.select(this).attr("class") === "circle"){
//                 return "black"
//             }
//         })
//     d3.select(".percent").remove()
// }


// Get the data
// d3.csv("data/aggregated-deaths-injuries.csv", function(data) {
// format the data

// color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));

// data.forEach(function(d) {
//     d.year = parseTime(d.year);
//     d.intentional_homicides = +d.intentional_homicides;
//     d.intentional_suicides = +d.intentional_suicides;
//     d.unintentional_deaths = +d.unintentional_deaths;
//     d.unintentional_injuries = Number(d.unintentional_injuries);
//     d.intentional_injuries = Number(d.intentional_injuries);
//     mod_data = color.domain().map(function(name) {
//         return {
//             name: name,
//             values: data.map(function(d) {
//                 return {year: d.year, victims: d[name], type: name};
//             })
//         };
//     });
//
//     console.log(mod_data)
// });

//console.log(data)
//
// // Scale the range of the data
// x.domain(d3.extent(data, function(d) { return d.year; }));
// y.domain([0, d3.max(data, function(d) {
//     return Math.max(d.intentional_homicides, d.intentional_suicides, d.unintentional_deaths, d.unintentional_injuries,
//         d.intentional_injuries); })+1000]);

// // Add the valueline path.
// svg.append("path")
//     .data([data])
//     .attr("class", "line")
//     .attr('id', 'line1')
//     .style("stroke", "black")
//     .style("fill","none")
//     .attr("stroke-width", 2)
//     .attr("d", valueline)
//
// // Add the valueline2 path.
// svg.append("path")
//     .data([data])
//     .attr("class", "line")
//     .attr("id", "line2")
//     .style("stroke", "black")
//     .style("fill","none")
//     .attr("stroke-width", 1.5)
//     .attr("d", valueline2)
//
// // Add the valueline3 path.
// svg.append("path")
//     .data([data])
//     .attr("class", "line")
//     .attr("id", "line3")
//     .style("stroke", "black")
//     .style("fill","none")
//     .attr("stroke-width", 1.5)
//     .attr("d", valueline3)
//
// // Add the valueline4 paths.
// svg.append("path")
//     .datum(data.filter(valueline4.defined()))
//     .attr("class", "line")
//     .attr("id", "line4")
//     .style("stroke", "black")
//     .style("stroke-dasharray", ("2, 3"))
//     .style("fill","none")
//     .attr("d", valueline4)
//
// svg.append("path")
//     .datum(data)
//     .style("stroke", "black")
//     .attr("class", "line")
//     .attr("id", "line4")
//     .style("fill","none")
//     .attr("stroke-width", 1.5)
//     .attr("d", valueline4)
//
// // Add the valueline5 paths.
// svg.append("path")
//     .datum(data.filter(valueline5.defined()))
//     .attr("class", "line")
//     .attr("id", "line5")
//     .style("stroke", "black")
//     .style("stroke-dasharray", ("2, 3"))
//     .style("fill","none")
//     .attr("d", valueline5)
//
// svg.append("path")
//     .datum(data)
//     .attr("class", "line")
//     .attr("id", "line5")
//     .style("stroke", "black")
//     .style("fill","none")
//     .attr("stroke-width", 1.5)
//     .attr("d", valueline5)
//
// var records = svg.selectAll(".records")
//     .data(mod_data)
//     .enter().append("g")
//     .attr("class", "records");
//
// var div = d3.select("body")
//     .append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);
//
// records.append("g").selectAll("circle")
//     .data(function(d){return d.values})
//     .enter()
//     .append("circle")
//     .attr("r", function(d){
//         if(isNaN(d.victims)){
//             return 0
//         }
//         else{return 4}
//     })
//     .attr("cx", function(d){return x(d.year)})
//     .attr("cy", function(d){return y(d.victims)})
//     .attr("class", "circle")
//     .attr('id', function(d){
//         if (d.type === "intentional_homicides") {
//             return "line1";
//         } else if(d.type === "intentional_suicides"){
//             return "line2";
//         } else if(d.type === "unintentional_deaths"){
//             return "line3";
//         } else if(d.type === "unintentional_injuries"){
//             return "line4";
//         } else if(d.type === "intentional_injuries"){
//             return "line5";
//         }
//     })
//     .attr("stroke", "black")
//     .on('mouseover', function (d, i) {
//         d3.select(this).transition()
//             .duration(50)
//             .attr('opacity', '.85')
//             .attr('r', 8);
//         div.transition()
//             .duration(50)
//             .style("opacity", 1.5);
//         div.html(function () {
//             if (isNaN(d.victims)) {
//                 return "<strong>" + d.year.getFullYear() + "</strong>" + " <br> " + "No data available"
//             } else {
//                 return "<strong>" + d.year.getFullYear() + "</strong>" + " <br> " + d.victims + groupTxt(d.type)
//             }
//         })
//             .style("left", (d3.event.pageX + 10) + "px")
//             .style("top", (d3.event.pageY - 15) + "px");
//     })
//     .on('mouseout', function (d) {
//         d3.select(this).transition()
//             .duration(50)
//             .attr('r', 4);
//         div.transition()
//             .duration('50')
//             .style("opacity", 0);
//     })

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
//     .text("Number of victims");

// Add a title
//svg.append("text")
//.attr("x", (width / 2))
//.attr("y", 0 - (margin.top / 2) + 10)
//.attr("text-anchor", "middle")
//.style("font-size", "20px")
//.text("Firearm Deaths and Injuries Broken Down by Cause");

// svg.append("text")
//     .attr("transform", "translate("+(width+90)+","+y(data[0].intentional_homicides)+")")
//     .attr("dy", ".35em")
//     .attr("text-anchor", "start")
//     .style("fill", "black")
//     .text("Deaths from violence")
//     .attr("class", "text")
//     .attr("id", "line1")
//     .on("mouseover", onMouseOver)
//     .on("mouseout", onMouseOut)
//
// svg.append("text")
//     .attr("transform", "translate("+(width+90)+","+y(data[0].intentional_suicides + 300)+")")
//     .attr("dy", ".35em")
//     .attr("text-anchor", "start")
//     .style("fill", "black")
//     .text("Deaths by suicide")
//     .attr("class", "text")
//     .attr("id", "line2")
//     .on("mouseover", onMouseOver)
//     .on("mouseout", onMouseOut)
//
// svg.append("text")
//     .attr("transform", "translate("+(width + 90)+","+y(data[0].unintentional_deaths)+")")
//     .attr("dy", ".35em")
//     .attr("text-anchor", "start")
//     .style("fill", "black")
//     .text("Deaths from accidents")
//     .attr("class", "text")
//     .attr("id", "line3")
//     .on("mouseover", onMouseOver)
//     .on("mouseout", onMouseOut)
//
// svg.append("text")
//     .attr("transform", "translate("+(width-90)+","+y(data[0].unintentional_injuries - 698)+")")
//     .attr("dy", ".35em")
//     .attr("text-anchor", "start")
//     .style("fill", "black")
//     .text("Injuries from accidents")
//     .attr("class", "text")
//     .attr("id", "line4")
//     .on("mouseover", onMouseOver)
//     .on("mouseout", onMouseOut)
//
// svg.append("text")
//     .attr("transform", "translate("+(width)+","+y(data[0].intentional_injuries + 2400)+")")
//     .attr("dy", ".35em")
//     .attr("text-anchor", "start")
//     .style("fill", "black")
//     .text("Injuries from violence")
//     .attr("class", "text")
//     .attr("id", "line5")
//     .on("mouseover", onMouseOver)
//     .on("mouseout", onMouseOut)

//});