var margin = {top: 30, right: 180, bottom: 30, left: 80},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let marginTop = 10;
var svgD = d3.select("#memorial-viz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/allShootings.csv", function(data) {
    console.log("allShootings", data);
    const dotR = width/300;
    const dotSpacing = 12;
    let dots = svgD.selectAll('.dot')
        .data(data);
    dots.enter().append('circle')
        .attr('class', function(d){
            return `customCircle ${d.age} ${d.Type} ${d.gender}`
        })
        .attr('cx', function(d,i){
            return i%50*dotSpacing
        })
        .attr('cy', function(d,i){
            const rowNum = (i-i%50)/50
            return dotSpacing*(rowNum+1)
        })
        .attr('r', dotR);

    function animateGender(){
        const nCol = 30
        d3.selectAll('.customCircle.male')
            .transition()
            .duration(800)
            .attr('fill', 'red')
            .attr('r', dotR)
            .attr('cx', function(d,i){
                return i%nCol*dotSpacing
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%nCol)/nCol
                return dotSpacing*(rowNum+1)
            });

        d3.selectAll('.customCircle.female')
            .transition()
            .duration(800)
            .attr('r', dotR)
            .attr('fill', 'blue')
            .attr('cx', function(d,i){
                return i%nCol*dotSpacing + width/2
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%nCol)/nCol
                return dotSpacing*(rowNum+1)
            });
        d3.selectAll('.customCircle.unknown')
            .transition()
            .duration(800)
            .attr('r', 3)
            .attr('fill', 'grey')
            .attr('cx', function(d,i){
                return i%100*dotSpacing
            })
            .attr('cy', function(d,i){
                if (i<100){
                    return height
                }
                else{
                    return height - dotSpacing
                }
            })
    }

    function animateDeathInjury(){
        const nCol = 30

        d3.selectAll('.customCircle.Killed')
            .transition()
            .duration(800)
            .attr('fill', 'darkBlue')
            .attr('r', dotR)
            .attr('cx', function(d,i){
                return i%nCol*dotSpacing
                //return width/50*(3.5+i%40)
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%nCol)/nCol
                return dotSpacing*(rowNum+1)
            });
        d3.selectAll('.customCircle.Injured')
            .transition()
            .duration(800)
            .attr('r', 3)
            .attr('fill', 'darkGrey')
            .attr('cx', function(d,i){
                return i%nCol*dotSpacing + width/2
                //return width/50*(3.5+i%40)*3
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%nCol)/nCol;
                return dotSpacing*(rowNum+1)
                //return (Math.trunc(i / 40)) * height/50 + marginTop;
            });
    }

    function animateAge(){
        const nCol = 30;

        d3.selectAll('.customCircle.child')
            .transition()
            .duration(800)
            .attr('fill', 'pink')
            .attr('r', dotR)
            .attr('cx', function(d,i){
                return i%nCol*dotSpacing
                //return width/50*(3.5+i%40)
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%nCol)/nCol
                return dotSpacing*(rowNum+1)
            });
        d3.selectAll('.customCircle.teen')
            .transition()
            .duration(800)
            .attr('r', 3)
            .attr('fill', 'purple')
            .attr('cx', function(d,i){
                return i%nCol*dotSpacing + width/2
                //return width/50*(3.5+i%40)*3
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%nCol)/nCol;
                return dotSpacing*(rowNum+1)
                //return (Math.trunc(i / 40)) * height/50 + marginTop;
            });
    }

    function animateOrig(){
        d3.selectAll('.customCircle')
            .transition()
            .duration(800)
            .attr('fill', 'black')
            .attr('r', dotR)
            .attr('cx', function(d,i){
                return i%60*dotSpacing
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%60)/60
                return dotSpacing*(rowNum+1)
            })
            .attr('r', dotR);
    }

    function animateAgeInj(){
        const barWidth = 12;
        d3.selectAll('.customCircle.child.Killed')
            .transition()
            .duration(800)
            .attr('r', 3)
            .attr('fill', 'darkGreen')
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
            .attr('r', 3)
            .attr('fill', 'green')
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
            .attr('r', 3)
            .attr('fill', 'darkBlue')
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
            .attr('r', 3)
            .attr('fill', 'blue')
            .attr('cx', function(d,i){
                return i%barWidth*dotSpacing + 7*width/10
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%barWidth)/barWidth;
                return height - dotSpacing*(rowNum+1)
            });
    }



    // animation
    setInterval (animateCircles, 10000);

    function animateCircles(){
        animateGender()
        setTimeout(function() {animateDeathInjury()}, 2000);
        setTimeout(function() {animateAge()}, 4000);
        setTimeout(function() {animateOrig()}, 6000);
        setTimeout(function() {animateAgeInj(), 8000})
    }
});
