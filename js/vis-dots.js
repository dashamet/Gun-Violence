dotVis = function(_parentElement, _dataShootings) {
    this.parentElement = _parentElement;
    this.data = _dataShootings;

    // call method initVis
    this.initVis();
};

dotVis.prototype.initVis = function() {
    let vis = this;

    vis.margin = {top: 30, right: 80, bottom: 50, left: 80};
    vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    console.log("excuse me")
    vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.updateVis();
};

// dotVis.prototype.wrangleData = function(){
//     let vis = this;
//     vis.updateVis()
// };

dotVis.prototype.updateVis = function(){
    let vis = this;
    //let vis.animateAge, vis.animateGender, vis.animateDeathInjury, vis.playAnimation, vis.animateAgeInj, vis.stopAnimation;

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


    // Create default view
    vis.nCol = 25;
    vis.space = 30;

    d3.selectAll('.customCircle.Killed')
        .attr('fill', 'red')
        .attr('cx', function(d,i){
            return (vis.width/2 - vis.nCol*vis.dotSpacing - vis.space) + i%vis.nCol*vis.dotSpacing
            //return width/50*(3.5+i%40)
        })
        .attr('cy', function(d,i){
            vis.rowNum = (i-i%vis.nCol)/vis.nCol;
            return vis.dotSpacing*(vis.rowNum+1)
        });

    d3.selectAll('.customCircle.Injured')
        //.attr('r', vis.dotR)
        .attr('fill', 'black')
        .attr('cx', function(d,i){
            return i%vis.nCol*vis.dotSpacing +vis.width/2 + vis.space
            //return width/50*(3.5+i%40)*3
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
        .attr("x", (vis.width/2 - vis.nCol*vis.dotSpacing - vis.space) + vis.nCol*vis.dotSpacing/2)//(vis.width/2 - vis.nCol*vis.dotSpacing - vis.space))//(vis.width/2+(-vis.nCol*vis.dotSpacing-30)/2))
        .attr("y", 0)
        .style("text-anchor", "middle");
    vis.svg
        .append("text")
        .attr("class", "dotLabel")
        .text("Injured")
        .attr("x", (vis.nCol*vis.dotSpacing)/2 + vis.width/2 + 30)
        .attr("y", 0)
        .style("text-anchor", "middle");

    vis.animateGender = function(){
        d3.selectAll(".dotLabel").remove();
        vis.nCol = 25;
        d3.selectAll('.customCircle.male')
            .transition()
            .duration(800)
            .attr('r', vis.dotR)
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
            .attr('r', vis.dotR)
            .attr('cx', function(d,i){
                return i%vis.nCol*vis.dotSpacing + vis.width/2 + vis.space
            })
            .attr('cy', function(d,i){
                vis.rowNum = (i-i%vis.nCol)/vis.nCol;
                return vis.dotSpacing*(vis.rowNum+1)
            });
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
        vis.svg.append("text")
            .attr("class", "dotLabel")
            .text("Boys")
            .attr("x", vis.width/2+(-vis.nCol*vis.dotSpacing-30)/2)
            .attr("y", 0)
            .style("text-anchor", "middle");
        vis.svg.append("text")
            .attr("class", "dotLabel")
            .text("Girls")
            .attr("x", vis.nCol*vis.dotSpacing/2 + vis.width/2 + 30)
            .attr("y", 0)
            .style("text-anchor", "middle");
        vis.svg.append("text")
            .attr("class", "dotLabel")
            .text("Unknown")
            .attr("x", vis.width/2)
            .attr("y", vis.height - 105)
            .style("text-anchor", "middle")
    };


    vis.animateDeathInjury = function(){
        d3.selectAll(".dotLabel").remove();
        //vis.svg.selectAll(".dotLabel").remove();
        vis.nCol = 25;

        d3.selectAll('.customCircle.Killed')
            .transition()
            .duration(800)
            .attr('fill', 'red')
            .attr('cx', function(d,i){
                return (vis.width/2 - vis.nCol*vis.dotSpacing - vis.space) + i%vis.nCol*vis.dotSpacing
                //return width/50*(3.5+i%40)
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
                //return width/50*(3.5+i%40)*3
            })
            .attr('cy', function(d,i){
                vis.rowNum = (i-i%vis.nCol)/vis.nCol;
                return vis.dotSpacing*(vis.rowNum+1)
                //return (Math.trunc(i / 40)) * height/50 + marginTop;
            });
        vis.svg
            .append("text")
            .attr("class", "dotLabel")
            .text("Killed")
            //.attr("x", (vis.width/2+(-vis.nCol*vis.dotSpacing-vis.space)/2))
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


    vis.animateAge = function(){
        d3.selectAll(".dotLabel").remove()

        vis.nCol = 25;

        d3.selectAll('.customCircle.child')
            .transition()
            .duration(800)
            //.attr('fill', 'pink')
            .attr('cx', function(d,i){
                return (vis.width/2 - vis.nCol*vis.dotSpacing - vis.space) + i%vis.nCol*vis.dotSpacing
                //return width/50*(3.5+i%40)
            })
            .attr('cy', function(d,i){
                vis.rowNum = (i-i%vis.nCol)/vis.nCol;
                return vis.dotSpacing*(vis.rowNum+1)
            });
        d3.selectAll('.customCircle.teen')
            .transition()
            .duration(800)
            //.attr('fill', 'purple')
            .attr('cx', function(d,i){
                return i%vis.nCol*vis.dotSpacing + vis.width/2 + vis.space
                //return width/50*(3.5+i%40)*3
            })
            .attr('cy', function(d,i){
                vis.rowNum = (i-i%vis.nCol)/vis.nCol;
                return vis.dotSpacing*(vis.rowNum+1)
                //return (Math.trunc(i / 40)) * height/50 + marginTop;
            });
        vis.svg
            .append("text")
            .attr("class", "dotLabel")
            .text("Children")
            .attr("x", (vis.width/2 - vis.nCol*vis.dotSpacing - vis.space) + vis.nCol*vis.dotSpacing/2)//(vis.width/2+(-vis.nCol*vis.dotSpacing-vis.space)/2))
            .attr("y", 0)
            .style("text-anchor", "middle");
        vis.svg
            .append("text")
            .attr("class", "dotLabel")
            .text("Teens")
            .attr("x", (vis.nCol*vis.dotSpacing)/2 + vis.width/2 + vis.space)
            .attr("y", 0)
            .style("text-anchor", "middle");
    }

    vis.animateAge = function(){
        d3.selectAll(".dotLabel").remove();

        vis.nCol = 25;

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
                return vis.dotSpacing*(vis.rowNum+1);
                //return (Math.trunc(i / 40)) * height/50 + marginTop;
            });
        vis.svg
            .append("text")
            .attr("class", "dotLabel")
            .text("Children")
            .attr("x", (vis.width/2+(-vis.nCol*vis.dotSpacing-30)/2))
            .attr("y", 0)
            .style("text-anchor", "middle")
        vis.svg
            .append("text")
            .attr("class", "dotLabel")
            .text("Teens")
            .attr("x", (vis.nCol*vis.dotSpacing)/2 + vis.width/2 + 30)
            .attr("y", 0)
            .style("text-anchor", "middle")
    };

    vis.animateAgeInj = function(){
        d3.selectAll(".dotLabel").remove();
        //svgD.selectAll("text.dotLabel").remove()
        vis.barWidth = 11;
        vis.bottomPadding = 50;
        d3.selectAll('.customCircle.child.Killed')
            .transition()
            .duration(800)
            .attr('cx', function(d,i){
                return (3*vis.width/8 - vis.barWidth*vis.dotSpacing) + (i%vis.barWidth)*vis.dotSpacing;
                //return i%vis.barWidth*vis.dotSpacing,
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
                //return i%vis.barWidth*vis.dotSpacing + 1/5*vis.width
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
                //return i%vis.barWidth*vis.dotSpacing + vis.width/2
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
                //return i%vis.barWidth*vis.dotSpacing + 7*vis.width/10
            })
            .attr('cy', function(d,i){
                vis.rowNum = (i-i%vis.barWidth)/vis.barWidth;
                return vis.height - vis.dotSpacing*(vis.rowNum+1) - vis.bottomPadding
            });
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
            .style("text-anchor", "middle")
        vis.svg.append("text")
            .attr("class", "dotLabel")
            .text("Killed")
            .attr("x", 5*vis.width/8-vis.barWidth*vis.dotSpacing/2)
            .attr("y", vis.height-vis.bottomPadding+10)
            .style("text-anchor", "middle")
        vis.svg.append("text")
            .attr("class", "dotLabel")
            .text("Injured")
            .attr("x", 6*vis.width/8-vis.barWidth*vis.dotSpacing/2)
            .attr("y", vis.height-vis.bottomPadding+10)
            .style("text-anchor", "middle")
    };

    vis.interval;
    // animation

    vis.running = 0;

    vis.playAnimation = function(){
        if (vis.running === 0) {
            vis.running = 1;
            //animateCircles();
            //timeOut = setTimeout()
            vis.interval = setInterval(vis.animateCircles(), 10000);
        }
        //while(running === 0){
        //}
    };

    vis.stopAnimation = function(){
        //if (running === 1){
        vis.running = 0;
        //    clearInterval(interval);
        //}
    };

    while (vis.running === 1){
        vis.animateCircles();
    };

    vis.animateCircles = function(){
        vis.animateGender();
        setTimeout(function() {vis.animateAge()}, 2500);
        setTimeout(function() {vis.animateAgeInj()}, 5000);
        setTimeout(function() {vis.animateDeathInjury()}, 7500);
    };

};

// var animateAge, animateGender, animateDeathInjury, playAnimation, animateAgeInj, stopAnimation;

// d3.csv("data/allShootings.csv", function(data) {
    // console.log("allShootings", data);
    // const dotR = width/200;
    // const dotSpacing = 12;
    // let dots = svgD.selectAll('.dot')
    //     .data(data);
    // dots.enter().append('circle')
    //     .attr('class', function(d){
    //         return `customCircle ${d.age} ${d.Type} ${d.gender}`
    //     })
    //    // .attr('cx', function(d,i){
    //    //     return i%50*dotSpacing
    //   // })
    //    // .attr('cy', function(d,i){
    //    //     const rowNum = (i-i%50)/50
    //    //     return dotSpacing*(rowNum+1)
    //    // })
    //     .attr('r', dotR);

    //const nCol = 25;
    // d3.selectAll('.customCircle.Killed')
    //     .attr('fill', 'red')
    //     .attr('cx', function(d,i){
    //         return i%nCol*dotSpacing + 60
    //         //return width/50*(3.5+i%40)
    //     })
    //     .attr('cy', function(d,i){
    //         const rowNum = (i-i%nCol)/nCol;
    //         return dotSpacing*(rowNum+1)
    //     });
    // d3.selectAll('.customCircle.Injured')
    //     .attr('r', dotR)
    //     .attr('fill', 'black')
    //     .attr('cx', function(d,i){
    //         return i%nCol*dotSpacing + width/2 + 30
    //         //return width/50*(3.5+i%40)*3
    //     })
    //     .attr('cy', function(d,i){
    //         const rowNum = (i-i%nCol)/nCol;
    //         return dotSpacing*(rowNum+1)
    //         //return (Math.trunc(i / 40)) * height/50 + marginTop;
    //     });
    // svgD
    //     .append("text")
    //     .attr("class", "dotLabel")
    //     .text("Killed")
    //     .attr("x", (width/2+(-nCol*dotSpacing-30)/2))
    //     .attr("y", 0)
    //     .style("text-anchor", "middle");
    // svgD
    //     .append("text")
    //     .attr("class", "dotLabel")
    //     .text("Injured")
    //     .attr("x", (nCol*dotSpacing)/2 + width/2 + 30)
    //     .attr("y", 0)
    //     .style("text-anchor", "middle");
    //
    // animateGender = function(){
    //     d3.selectAll(".dotLabel").remove();
    //     const nCol = 25;
    //     d3.selectAll('.customCircle.male')
    //         .transition()
    //         .duration(800)
    //         //.attr('fill', 'red')
    //         .attr('r', dotR)
    //         .attr('cx', function(d,i){
    //             return i%nCol*dotSpacing + 60
    //         })
    //         .attr('cy', function(d,i){
    //             const rowNum = (i-i%nCol)/nCol;
    //             return dotSpacing*(rowNum+1)
    //         });
    //
    //     d3.selectAll('.customCircle.female')
    //         .transition()
    //         .duration(800)
    //         .attr('r', dotR)
    //         //.attr('fill', 'black')
    //         .attr('cx', function(d,i){
    //             return i%nCol*dotSpacing + width/2 + 30
    //         })
    //         .attr('cy', function(d,i){
    //             const rowNum = (i-i%nCol)/nCol;
    //             return dotSpacing*(rowNum+1)
    //         });
    //     d3.selectAll('.customCircle.unknown')
    //         .transition()
    //         .duration(800)
    //         .attr('r', dotR)
    //         //.attr('fill', 'grey')
    //         .attr('cx', function(d,i){
    //             return i%100*dotSpacing+40
    //         })
    //         .attr('cy', function(d,i){
    //             if (i<100){
    //                 return height - 20
    //             }
    //             else{
    //                 return height - 20 - dotSpacing
    //             }
    //         });
    //     svgD.append("text")
    //         .attr("class", "dotLabel")
    //         .text("Boys")
    //         .attr("x", width/2+(-nCol*dotSpacing-30)/2)
    //         .attr("y", 0)
    //         .style("text-anchor", "middle");
    //     svgD.append("text")
    //         .attr("class", "dotLabel")
    //         .text("Girls")
    //         .attr("x", nCol*dotSpacing/2 + width/2 + 30)
    //         .attr("y", 0)
    //         .style("text-anchor", "middle");
    //     svgD.append("text")
    //         .attr("class", "dotLabel")
    //         .text("Unknown")
    //         .attr("x", width/2)
    //         .attr("y", height)
    //         .style("text-anchor", "middle")
    // }
    //
    // animateDeathInjury = function(){
    //     svgD.selectAll(".dotLabel").remove();
    //     const nCol = 25;
    //
    //     d3.selectAll('.customCircle.Killed')
    //         .transition()
    //         .duration(800)
    //         .attr('fill', 'red')
    //         .attr('cx', function(d,i){
    //             return i%nCol*dotSpacing + 60
    //             //return width/50*(3.5+i%40)
    //         })
    //         .attr('cy', function(d,i){
    //             const rowNum = (i-i%nCol)/nCol
    //             return dotSpacing*(rowNum+1)
    //         });
    //     d3.selectAll('.customCircle.Injured')
    //         .transition()
    //         .duration(800)
    //         .attr('r', dotR)
    //         .attr('fill', 'black')
    //         .attr('cx', function(d,i){
    //             return i%nCol*dotSpacing + width/2 + 30
    //             //return width/50*(3.5+i%40)*3
    //         })
    //         .attr('cy', function(d,i){
    //             const rowNum = (i-i%nCol)/nCol;
    //             return dotSpacing*(rowNum+1)
    //             //return (Math.trunc(i / 40)) * height/50 + marginTop;
    //         });
    //     svgD
    //         .append("text")
    //         .attr("class", "dotLabel")
    //         .text("Killed")
    //         .attr("x", (width/2+(-nCol*dotSpacing-30)/2))
    //         .attr("y", 0)
    //         .style("text-anchor", "middle");
    //     svgD
    //         .append("text")
    //         .attr("class", "dotLabel")
    //         .text("Injured")
    //         .attr("x", (nCol*dotSpacing)/2 + width/2 + 30)
    //         .attr("y", 0)
    //         .style("text-anchor", "middle");
    // }

    // animateAge = function(){
    //     d3.selectAll(".dotLabel").remove()
    //     // var force = d3.layout.force()
    //     //     .nodes(nodes)
    //     //     .size([width, height])
    //     //     .gravity(.02)
    //     //     .charge(0)
    //     //     .on("tick", tick)
    //     //     .start();
    //
    //     const nCol = 25;
    //
    //     d3.selectAll('.customCircle.child')
    //         .transition()
    //         .duration(800)
    //         //.attr('fill', 'pink')
    //         .attr('r', dotR)
    //         .attr('cx', function(d,i){
    //             return  i%nCol*dotSpacing + 60
    //             //return width/50*(3.5+i%40)
    //         })
    //         .attr('cy', function(d,i){
    //             const rowNum = (i-i%nCol)/nCol
    //             return dotSpacing*(rowNum+1)
    //         });
    //     d3.selectAll('.customCircle.teen')
    //         .transition()
    //         .duration(800)
    //         .attr('r', dotR)
    //         //.attr('fill', 'purple')
    //         .attr('cx', function(d,i){
    //             return i%nCol*dotSpacing + width/2 + 30
    //             //return width/50*(3.5+i%40)*3
    //         })
    //         .attr('cy', function(d,i){
    //             const rowNum = (i-i%nCol)/nCol;
    //             return dotSpacing*(rowNum+1)
    //             //return (Math.trunc(i / 40)) * height/50 + marginTop;
    //         });
    //     svgD
    //         .append("text")
    //         .attr("class", "dotLabel")
    //         .text("Children")
    //         .attr("x", (width/2+(-nCol*dotSpacing-30)/2))
    //         .attr("y", 0)
    //         .style("text-anchor", "middle")
    //     svgD
    //         .append("text")
    //         .attr("class", "dotLabel")
    //         .text("Teens")
    //         .attr("x", (nCol*dotSpacing)/2 + width/2 + 30)
    //         .attr("y", 0)
    //         .style("text-anchor", "middle")
    // }

    // animateAgeInj = function(){
    //     svgD.selectAll("text.dotLabel").remove()
    //     const barWidth = 11;
    //     d3.selectAll('.customCircle.child.Killed')
    //         .transition()
    //         .duration(800)
    //         .attr('r', dotR)
    //         //.attr('fill', 'red')
    //         .attr('cx', function(d,i){
    //             return i%barWidth*dotSpacing
    //         })
    //         .attr('cy', function(d,i){
    //             const rowNum = (i-i%barWidth)/barWidth;
    //             return height - dotSpacing*(rowNum+1)
    //         });
    //     d3.selectAll('.customCircle.child.Injured')
    //         .transition()
    //         .duration(800)
    //         .attr('r', dotR)
    //         //.attr('fill', 'blue')
    //         .attr('cx', function(d,i){
    //             return i%barWidth*dotSpacing + 1/5*width
    //         })
    //         .attr('cy', function(d,i){
    //             const rowNum = (i-i%barWidth)/barWidth;
    //             return height - dotSpacing*(rowNum+1)
    //         });
    //     d3.selectAll('.customCircle.teen.Killed')
    //         .transition()
    //         .duration(800)
    //         .attr('r', dotR)
    //         //.attr('fill', 'darkRed')
    //         .attr('cx', function(d,i){
    //             return i%barWidth*dotSpacing + width/2
    //         })
    //         .attr('cy', function(d,i){
    //             const rowNum = (i-i%barWidth)/barWidth;
    //             return height - dotSpacing*(rowNum+1)
    //         });
    //     d3.selectAll('.customCircle.teen.Injured')
    //         .transition()
    //         .duration(800)
    //         .attr('r', dotR)
    //         //.attr('fill', 'darkBlue')
    //         .attr('cx', function(d,i){
    //             return i%barWidth*dotSpacing + 7*width/10
    //         })
    //         .attr('cy', function(d,i){
    //             const rowNum = (i-i%barWidth)/barWidth;
    //             return height - dotSpacing*(rowNum+1)
    //         });
    //     svgD
    //         .append("text")
    //         .attr("class", "dotLabel")
    //         .text("Children")
    //         .attr("x", (width/2+(-nCol*dotSpacing-30)/2))
    //         .attr("y", 0)
    //         .style("text-anchor", "middle");
    //     svgD
    //         .append("text")
    //         .attr("class", "dotLabel")
    //         .text("Teen")
    //         .attr("x", (nCol*dotSpacing)/2 + width/2 + 30)
    //         .attr("y", 0)
    //         .style("text-anchor", "middle");
    //     svgD.append("text")
    //         .attr("class", "dotLabel")
    //         .text("Killed")
    //         .attr("x", barWidth/2*dotSpacing)
    //         .attr("y", height+10)
    //         .style("text-anchor", "middle");
    //     svgD.append("text")
    //         .attr("class", "dotLabel")
    //         .text("Injured")
    //         .attr("x", barWidth/2*dotSpacing + 1/5*width)
    //         .attr("y", height+10)
    //         .style("text-anchor", "middle")
    //     svgD.append("text")
    //         .attr("class", "dotLabel")
    //         .text("Killed")
    //         .attr("x", barWidth/2*dotSpacing + width/2)
    //         .attr("y", height+10)
    //         .style("text-anchor", "middle")
    //     svgD.append("text")
    //         .attr("class", "dotLabel")
    //         .text("Injured")
    //         .attr("x", barWidth/2*dotSpacing + 7/10*width)
    //         .attr("y", height+10)
    //         .style("text-anchor", "middle")
    // }

    // let interval;
    // // animation
    //
    // var running = 0;
    //
    // playAnimation = function(){
    //     if (running === 0) {
    //         running = 1;
    //         //animateCircles();
    //         //timeOut = setTimeout()
    //         interval = setInterval(animateCircles, 10000);
    //     }
    //         //while(running === 0){
    //     //}
    // };
    //
    // stopAnimation = function(){
    //     //if (running === 1){
    //     running = 0;
    //     //    clearInterval(interval);
    //     //}
    // };
    //
    // while (running === 1){
    //     animateCircles();
    // };
    //
    // function animateCircles(){
    //     animateGender();
    //     setTimeout(function() {animateAge()}, 2500);
    //     setTimeout(function() {animateAgeInj()}, 5000);
    //     setTimeout(function() {animateDeathInjury()}, 7500);
    // };
//});
