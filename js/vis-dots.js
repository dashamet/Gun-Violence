var margin = {top: 30, right: 80, bottom: 50, left: 80},
    width = 900 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

let marginTop = 10;
var svgD = d3.select("#memorial-viz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/allShootings.csv", function(data) {
    console.log("allShootings", data);
    const dotR = width/200;
    const dotSpacing = 12;
    let dots = svgD.selectAll('.dot')
        .data(data);
    dots.enter().append('circle')
        .attr('class', function(d){
            return `customCircle ${d.age} ${d.Type} ${d.gender}`
        })
        // .attr('cx', function(d,i){
        //     return i%50*dotSpacing
        // })
        // .attr('cy', function(d,i){
        //     const rowNum = (i-i%50)/50
        //     return dotSpacing*(rowNum+1)
        // })
        .attr('r', dotR);

    const nCol = 25;
    d3.selectAll('.customCircle.Killed')
        .attr('fill', 'red')
        .attr('cx', function(d,i){
            return i%nCol*dotSpacing + 60
            //return width/50*(3.5+i%40)
        })
        .attr('cy', function(d,i){
            const rowNum = (i-i%nCol)/nCol;
            return dotSpacing*(rowNum+1)
        });
    d3.selectAll('.customCircle.Injured')
        .attr('r', dotR)
        .attr('fill', 'black')
        .attr('cx', function(d,i){
            return i%nCol*dotSpacing + width/2 + 30
            //return width/50*(3.5+i%40)*3
        })
        .attr('cy', function(d,i){
            const rowNum = (i-i%nCol)/nCol;
            return dotSpacing*(rowNum+1)
            //return (Math.trunc(i / 40)) * height/50 + marginTop;
        });
    svgD
        .append("text")
        .attr("class", "dotLabel")
        .text("Killed")
        .attr("x", (width/2+(-nCol*dotSpacing-30)/2))
        .attr("y", 0)
        .style("text-anchor", "middle");
    svgD
        .append("text")
        .attr("class", "dotLabel")
        .text("Injured")
        .attr("x", (nCol*dotSpacing)/2 + width/2 + 30)
        .attr("y", 0)
        .style("text-anchor", "middle");

    function animateGender(){
        d3.selectAll(".dotLabel").remove();
        const nCol = 25;
        d3.selectAll('.customCircle.male')
            .transition()
            .duration(800)
            //.attr('fill', 'red')
            .attr('r', dotR)
            .attr('cx', function(d,i){
                return i%nCol*dotSpacing + 60
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%nCol)/nCol;
                return dotSpacing*(rowNum+1)
            });

        d3.selectAll('.customCircle.female')
            .transition()
            .duration(800)
            .attr('r', dotR)
            //.attr('fill', 'black')
            .attr('cx', function(d,i){
                return i%nCol*dotSpacing + width/2 + 30
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%nCol)/nCol;
                return dotSpacing*(rowNum+1)
            });
        d3.selectAll('.customCircle.unknown')
            .transition()
            .duration(800)
            .attr('r', dotR)
            //.attr('fill', 'grey')
            .attr('cx', function(d,i){
                return i%100*dotSpacing+40
            })
            .attr('cy', function(d,i){
                if (i<100){
                    return height - 20
                }
                else{
                    return height - 20 - dotSpacing
                }
            });
        svgD.append("text")
            .attr("class", "dotLabel")
            .text("Boys")
            .attr("x", width/2+(-nCol*dotSpacing-30)/2)
            .attr("y", 0)
            .style("text-anchor", "middle");
        svgD.append("text")
            .attr("class", "dotLabel")
            .text("Girls")
            .attr("x", nCol*dotSpacing/2 + width/2 + 30)
            .attr("y", 0)
            .style("text-anchor", "middle");
        svgD.append("text")
            .attr("class", "dotLabel")
            .text("Unknown")
            .attr("x", width/2)
            .attr("y", height)
            .style("text-anchor", "middle")
    }

    function animateDeathInjury(){
        svgD.selectAll(".dotLabel").remove();
        const nCol = 25;

        d3.selectAll('.customCircle.Killed')
            .transition()
            .duration(800)
            .attr('fill', 'red')
            .attr('cx', function(d,i){
                return i%nCol*dotSpacing + 60
                //return width/50*(3.5+i%40)
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%nCol)/nCol
                return dotSpacing*(rowNum+1)
            });
        d3.selectAll('.customCircle.Injured')
            .transition()
            .duration(800)
            .attr('r', dotR)
            .attr('fill', 'black')
            .attr('cx', function(d,i){
                return i%nCol*dotSpacing + width/2 + 30
                //return width/50*(3.5+i%40)*3
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%nCol)/nCol;
                return dotSpacing*(rowNum+1)
                //return (Math.trunc(i / 40)) * height/50 + marginTop;
            });
        svgD
            .append("text")
            .attr("class", "dotLabel")
            .text("Killed")
            .attr("x", (width/2+(-nCol*dotSpacing-30)/2))
            .attr("y", 0)
            .style("text-anchor", "middle");
        svgD
            .append("text")
            .attr("class", "dotLabel")
            .text("Injured")
            .attr("x", (nCol*dotSpacing)/2 + width/2 + 30)
            .attr("y", 0)
            .style("text-anchor", "middle");
    }

    function animateAge(){
        d3.selectAll(".dotLabel").remove()
        // var force = d3.layout.force()
        //     .nodes(nodes)
        //     .size([width, height])
        //     .gravity(.02)
        //     .charge(0)
        //     .on("tick", tick)
        //     .start();

        const nCol = 25;

        d3.selectAll('.customCircle.child')
            .transition()
            .duration(800)
            //.attr('fill', 'pink')
            .attr('r', dotR)
            .attr('cx', function(d,i){
                return  i%nCol*dotSpacing + 60
                //return width/50*(3.5+i%40)
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%nCol)/nCol
                return dotSpacing*(rowNum+1)
            });
        d3.selectAll('.customCircle.teen')
            .transition()
            .duration(800)
            .attr('r', dotR)
            //.attr('fill', 'purple')
            .attr('cx', function(d,i){
                return i%nCol*dotSpacing + width/2 + 30
                //return width/50*(3.5+i%40)*3
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%nCol)/nCol;
                return dotSpacing*(rowNum+1)
                //return (Math.trunc(i / 40)) * height/50 + marginTop;
            });
        svgD
            .append("text")
            .attr("class", "dotLabel")
            .text("Children")
            .attr("x", (width/2+(-nCol*dotSpacing-30)/2))
            .attr("y", 0)
            .style("text-anchor", "middle")
        svgD
            .append("text")
            .attr("class", "dotLabel")
            .text("Teens")
            .attr("x", (nCol*dotSpacing)/2 + width/2 + 30)
            .attr("y", 0)
            .style("text-anchor", "middle")
    }

    function animateAgeInj(){
        svgD.selectAll("text.dotLabel").remove()
        const barWidth = 11;
        d3.selectAll('.customCircle.child.Killed')
            .transition()
            .duration(800)
            .attr('r', dotR)
            //.attr('fill', 'red')
            .attr('cx', function(d,i){
                return i%barWidth*dotSpacing
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%barWidth)/barWidth;
                return height - dotSpacing*(rowNum+1)
            });
        d3.selectAll('.customCircle.child.Injured')
            .transition()
            .duration(800)
            .attr('r', dotR)
            //.attr('fill', 'blue')
            .attr('cx', function(d,i){
                return i%barWidth*dotSpacing + 1/5*width
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%barWidth)/barWidth;
                return height - dotSpacing*(rowNum+1)
            });
        d3.selectAll('.customCircle.teen.Killed')
            .transition()
            .duration(800)
            .attr('r', dotR)
            //.attr('fill', 'darkRed')
            .attr('cx', function(d,i){
                return i%barWidth*dotSpacing + width/2
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%barWidth)/barWidth;
                return height - dotSpacing*(rowNum+1)
            });
        d3.selectAll('.customCircle.teen.Injured')
            .transition()
            .duration(800)
            .attr('r', dotR)
            //.attr('fill', 'darkBlue')
            .attr('cx', function(d,i){
                return i%barWidth*dotSpacing + 7*width/10
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%barWidth)/barWidth;
                return height - dotSpacing*(rowNum+1)
            });
        svgD
            .append("text")
            .attr("class", "dotLabel")
            .text("Children")
            .attr("x", (width/2+(-nCol*dotSpacing-30)/2))
            .attr("y", 0)
            .style("text-anchor", "middle");
        svgD
            .append("text")
            .attr("class", "dotLabel")
            .text("Teen")
            .attr("x", (nCol*dotSpacing)/2 + width/2 + 30)
            .attr("y", 0)
            .style("text-anchor", "middle");
        svgD.append("text")
            .attr("class", "dotLabel")
            .text("Killed")
            .attr("x", barWidth/2*dotSpacing)
            .attr("y", height+10)
            .style("text-anchor", "middle");
        svgD.append("text")
            .attr("class", "dotLabel")
            .text("Injured")
            .attr("x", barWidth/2*dotSpacing + 1/5*width)
            .attr("y", height+10)
            .style("text-anchor", "middle")
        svgD.append("text")
            .attr("class", "dotLabel")
            .text("Killed")
            .attr("x", barWidth/2*dotSpacing + width/2)
            .attr("y", height+10)
            .style("text-anchor", "middle")
        svgD.append("text")
            .attr("class", "dotLabel")
            .text("Injured")
            .attr("x", barWidth/2*dotSpacing + 7/10*width)
            .attr("y", height+10)
            .style("text-anchor", "middle")
    }



    // animation
    setInterval (animateCircles, 12500);

    function animateCircles(){
        //animateAge();
        setTimeout(function() {animateGender()}, 2500);
        setTimeout(function() {animateAge()}, 5000);
        setTimeout(function() {animateAgeInj()}, 7500);
        setTimeout(function() {animateDeathInjury()}, 10000);
    }
});
