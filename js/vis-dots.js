dotVis = function(_parentElement, _dataShootings) {
    // Initialize data
    this.parentElement = _parentElement;
    this.data = _dataShootings;

    // call method initVis
    this.initVis();
};

dotVis.prototype.initVis = function() {
    let vis = this;

    // set constants
    vis.margin = {top: 30, right: 80, bottom: 50, left: 80};
    vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

    // create drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // no need to wrangle data
    vis.updateVis();
};


dotVis.prototype.updateVis = function(){
    let vis = this;

    // Set constants
    vis.dotR = 4.5;
    vis.dotSpacing = 12;

    // Create dots
    vis.dots = vis.svg.selectAll('.dot')
        .data(vis.data);
    vis.dots.enter().append('circle')
        .attr('class', function(d){
            return  `customCircle ${d.age} ${d.Type} ${d.gender}`
        })
        .attr('r', vis.dotR);
    vis.nCol = 25;
    vis.space = 30;

    // Create default view
    d3.selectAll('.customCircle.Killed')
        .attr('fill', 'red')
        .attr('cx', function(d,i){
            return (vis.width/2 - vis.nCol*vis.dotSpacing - vis.space) + i%vis.nCol*vis.dotSpacing
        })
        .attr('cy', function(d,i){
            vis.rowNum = (i-i%vis.nCol)/vis.nCol;
            return vis.dotSpacing*(vis.rowNum+1)
        });

    d3.selectAll('.customCircle.Injured')
        .attr('fill', 'black')
        .attr('cx', function(d,i){
            return i%vis.nCol*vis.dotSpacing +vis.width/2 + vis.space
        })
        .attr('cy', function(d,i){
            vis.rowNum = (i-i%vis.nCol)/vis.nCol;
            return vis.dotSpacing*(vis.rowNum+1)
        });

    // Append labels for default view
    vis.svg
        .append("text")
        .attr("class", "dotLabel")
        .text("Killed")
        .attr("x", (vis.width/2 - vis.nCol*vis.dotSpacing - vis.space) + vis.nCol*vis.dotSpacing/2)
        .attr("y", 0)
        .style("text-anchor", "middle");
    vis.svg
        .append("text")
        .attr("class", "dotLabel")
        .text("Injured")
        .attr("x", (vis.nCol*vis.dotSpacing)/2 + vis.width/2 + 30)
        .attr("y", 0)
        .style("text-anchor", "middle");

    // Create function to sort boys and girls
    vis.animateGender = function(){
        // remove old labels
        d3.selectAll(".dotLabel").remove();
        // larger nCol to accommodate more boys
        vis.nCol = 30;

        // move dots
        d3.selectAll('.customCircle.male')
            .transition()
            .duration(800)
            .attr('cx', function(d,i){
                return (vis.width/2 - vis.nCol*vis.dotSpacing - vis.space) + i%vis.nCol*vis.dotSpacing
            })
            .attr('cy', function(d,i){
                vis.rowNum = (i-i%vis.nCol)/vis.nCol;
                return vis.dotSpacing*(vis.rowNum+1)
            });

        d3.selectAll('.customCircle.female')
            .transition()
            .duration(800)
            .attr('cx', function(d,i){
                return i%vis.nCol*vis.dotSpacing + vis.width/2 + vis.space
            })
            .attr('cy', function(d,i){
                vis.rowNum = (i-i%vis.nCol)/vis.nCol;
                return vis.dotSpacing*(vis.rowNum+1)
            });

        // put gender unknown at the bottom
        d3.selectAll('.customCircle.unknown')
            .transition()
            .duration(800)
            .attr('r', vis.dotR)
            .attr('cx', function(d,i){
                return i%100*vis.dotSpacing+(vis.width/2 - vis.nCol*vis.dotSpacing - vis.space)
            })
            .attr('cy', function(d,i){
                if (i<100){
                    return vis.height - 125
                }
                else{
                    return vis.height - 125 - vis.dotSpacing
                }
            });

        // Append labels
        vis.svg.append("text")
            .attr("class", "dotLabel")
            .text("Boys")
            .attr("x", vis.width/2-vis.nCol*vis.dotSpacing/2 - vis.space)
            .attr("y", 0)
            .style("text-anchor", "middle");
        vis.svg.append("text")
            .attr("class", "dotLabel")
            .text("Girls")
            .attr("x", 30*vis.dotSpacing/2 + vis.width/2 + vis.space)
            .attr("y", 0)
            .style("text-anchor", "middle");
        vis.svg.append("text")
            .attr("class", "dotLabel")
            .text("Unknown")
            .attr("x", vis.width/2)
            .attr("y", vis.height - 105)
            .style("text-anchor", "middle")
    };

    // Create a function to animate deaths and injuries (i.e. return to default view-- used for the end of the animation)
    vis.animateDeathInjury = function(){
        // remove labels
        d3.selectAll(".dotLabel").remove();

        // set constant
        vis.nCol = 25;

        // move dots
        d3.selectAll('.customCircle.Killed')
            .transition()
            .duration(800)
            .attr('fill', 'red')
            .attr('cx', function(d,i){
                return (vis.width/2 - vis.nCol*vis.dotSpacing - vis.space) + i%vis.nCol*vis.dotSpacing
            })
            .attr('cy', function(d,i){
                vis.rowNum = (i-i%vis.nCol)/vis.nCol;
                return vis.dotSpacing*(vis.rowNum+1)
            });
        d3.selectAll('.customCircle.Injured')
            .transition()
            .duration(800)
            .attr('fill', 'black')
            .attr('cx', function(d,i){
                return i%vis.nCol*vis.dotSpacing + vis.width/2 + vis.space
            })
            .attr('cy', function(d,i){
                vis.rowNum = (i-i%vis.nCol)/vis.nCol;
                return vis.dotSpacing*(vis.rowNum+1)
            });
        // add labels
        vis.svg
            .append("text")
            .attr("class", "dotLabel")
            .text("Killed")
            .attr("x", (vis.width/2 - vis.nCol*vis.dotSpacing - vis.space) + vis.nCol*vis.dotSpacing/2)
            .attr("y", 0)
            .style("text-anchor", "middle");
        vis.svg
            .append("text")
            .attr("class", "dotLabel")
            .text("Injured")
            .attr("x", (vis.nCol*vis.dotSpacing)/2 + vis.width/2 + vis.space)
            .attr("y", 0)
            .style("text-anchor", "middle");
    };

    // Create function to animate children/teens
    vis.animateAge = function(){
        // remove old labels
        d3.selectAll(".dotLabel").remove();

        // set constant
        vis.nCol = 25;

        // move circles
        d3.selectAll('.customCircle.child')
            .transition()
            .duration(800)
            .attr('cx', function(d,i){
                return (vis.width/2 - vis.nCol*vis.dotSpacing - vis.space) + i%vis.nCol*vis.dotSpacing
            })
            .attr('cy', function(d,i){
                vis.rowNum = (i-i%vis.nCol)/vis.nCol;
                return vis.dotSpacing*(vis.rowNum+1)
            });
        d3.selectAll('.customCircle.teen')
            .transition()
            .duration(800)
            .attr('cx', function(d,i){
                return i%vis.nCol*vis.dotSpacing + vis.width/2 + vis.space
            })
            .attr('cy', function(d,i){
                vis.rowNum = (i-i%vis.nCol)/vis.nCol;
                return vis.dotSpacing*(vis.rowNum+1)
            });

        // append labels
        vis.svg
            .append("text")
            .attr("class", "dotLabel")
            .text("Children")
            .attr("x", (vis.width/2 - vis.nCol*vis.dotSpacing - vis.space) + vis.nCol*vis.dotSpacing/2)
            .attr("y", 0)
            .style("text-anchor", "middle");
        vis.svg
            .append("text")
            .attr("class", "dotLabel")
            .text("Teens")
            .attr("x", (vis.nCol*vis.dotSpacing)/2 + vis.width/2 + vis.space)
            .attr("y", 0)
            .style("text-anchor", "middle");
    };

    // animate deahts vs injuries broken down into children and teens
    vis.animateAgeInj = function(){
        // remove old labels
        d3.selectAll(".dotLabel").remove();

        // Set constants
        vis.barWidth = 11;
        vis.bottomPadding = 50;

        // move circles
        d3.selectAll('.customCircle.child.Killed')
            .transition()
            .duration(800)
            .attr('cx', function(d,i){
                return (3*vis.width/8 - vis.barWidth*vis.dotSpacing) + (i%vis.barWidth)*vis.dotSpacing;
            })
            .attr('cy', function(d,i){
                vis.rowNum = (i-i%vis.barWidth)/vis.barWidth;
                return vis.height - vis.dotSpacing*(vis.rowNum+1) - vis.bottomPadding;
            });
        d3.selectAll('.customCircle.child.Injured')
            .transition()
            .duration(800)
            .attr('cx', function(d,i){
                return (vis.width/2 - vis.barWidth*vis.dotSpacing) + (i%vis.barWidth)*vis.dotSpacing
            })
            .attr('cy', function(d,i){
                vis.rowNum = (i-i%vis.barWidth)/vis.barWidth;
                return vis.height - vis.dotSpacing*(vis.rowNum+1) - vis.bottomPadding;
            });
        d3.selectAll('.customCircle.teen.Killed')
            .transition()
            .duration(800)
            .attr('cx', function(d,i){
                return (5*vis.width/8 - vis.barWidth*vis.dotSpacing) + (i%vis.barWidth)*vis.dotSpacing
            })
            .attr('cy', function(d,i){
                vis.rowNum = (i-i%vis.barWidth)/vis.barWidth;
                return vis.height - vis.dotSpacing*(vis.rowNum+1) - vis.bottomPadding;
            });
        d3.selectAll('.customCircle.teen.Injured')
            .transition()
            .duration(800)
            .attr('cx', function(d,i){
                return (6*vis.width/8 - vis.barWidth*vis.dotSpacing) + (i%vis.barWidth)*vis.dotSpacing
            })
            .attr('cy', function(d,i){
                vis.rowNum = (i-i%vis.barWidth)/vis.barWidth;
                return vis.height - vis.dotSpacing*(vis.rowNum+1) - vis.bottomPadding
            });

        // append labels
        vis.svg
            .append("text")
            .attr("class", "dotLabel")
            .text("Children")
            .attr("x", (vis.width/2+(-vis.nCol*vis.dotSpacing-30)/2))
            .attr("y", 0)
            .style("text-anchor", "middle");
        vis.svg
            .append("text")
            .attr("class", "dotLabel")
            .text("Teens")
            .attr("x", 5*vis.width/8)
            .attr("y", 0)
            .style("text-anchor", "middle");
        vis.svg.append("text")
            .attr("class", "dotLabel")
            .text("Killed")
            .attr("x", 3*vis.width/8-vis.barWidth*vis.dotSpacing/2)
            .attr("y", vis.height-vis.bottomPadding+10)
            .style("text-anchor", "middle");
        vis.svg.append("text")
            .attr("class", "dotLabel")
            .text("Injured")
            .attr("x", vis.width/2-vis.barWidth*vis.dotSpacing/2)
            .attr("y", vis.height-vis.bottomPadding+10)
            .style("text-anchor", "middle");
        vis.svg.append("text")
            .attr("class", "dotLabel")
            .text("Killed")
            .attr("x", 5*vis.width/8-vis.barWidth*vis.dotSpacing/2)
            .attr("y", vis.height-vis.bottomPadding+10)
            .style("text-anchor", "middle");
        vis.svg.append("text")
            .attr("class", "dotLabel")
            .text("Injured")
            .attr("x", 6*vis.width/8-vis.barWidth*vis.dotSpacing/2)
            .attr("y", vis.height-vis.bottomPadding+10)
            .style("text-anchor", "middle")
    };

    // animation
    // set constant to determine whether the animation is running or not
    vis.running = 0;

    vis.playAnimation = function(){
        if (vis.running === 0) {
            vis.running = 1;
            vis.interval = setInterval(vis.animateCircles(), 10000);
        }
    };

    // create function to stop animation
    vis.stopAnimation = function(){
        vis.running = 0;
    };

    // attempt at a while loop
    // while (vis.running === 1){
    //     vis.animateCircles();
    // };

    // Create function to animate circles
    vis.animateCircles = function(){
        vis.animateGender();
        setTimeout(function() {vis.animateAge()}, 2500);
        setTimeout(function() {vis.animateAgeInj()}, 5000);
        setTimeout(function() {vis.animateDeathInjury()}, 7500);
    };

};