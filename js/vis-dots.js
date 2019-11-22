var margin = {top: 30, right: 180, bottom: 30, left: 80},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let spaceBetweenCircles = 5;
let radiusAnimationOne = height/200;
let radiusAnimationTwo = height/200;
let radiusSmallCircles = height/200;
let radiusBigCircles = height/40 - spaceBetweenCircles;

let marginTop = 10;
var svgD = d3.select("#memorial-viz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/allShootings.csv", function(data) {
    console.log("allShootings", data)
    const dotR = width/300;
    let dots = svgD.selectAll('.dot')
        .data(data);
    dots.enter().append('circle')
        .attr('class', function(d){
            return `customCircle ${d.age} ${d.Type} ${d.gender}`
        })
        .attr('cx', function(d,i){
            return width/50*(3.5+i%40)
        })
        .attr('cy', function(d,i){
            return (Math.trunc(i / 40)) * height/50 + marginTop;
        })
        .attr('r', dotR);
        // .attr('fill', function(d,i){
        //     if(d.age === 'child'){
        //         return 'blue'
        //     }else{
        //         return 'red'
        //     }
        // });
    // animation 1 - arrange circles as two circles

    function animateGender(){
        const dotSpacing = 12;
        const nCol = 30
        d3.selectAll('.customCircle.male')
            .transition()
            .duration(800)
            .attr('fill', 'red')
            .attr('r', dotR)
            .attr('cx', function(d,i){
                return i%nCol*dotSpacing
                //return width/50*(3.5+i%40)
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
                //return width/50*(3.5+i%40)*3
            })
            .attr('cy', function(d,i){
                const rowNum = (i-i%nCol)/nCol
                return dotSpacing*(rowNum+1)
                //return (Math.trunc(i / 40)) * height/50 + marginTop;
            });
        d3.selectAll('.customCircle.unknown')
            .transition()
            .duration(800)
            .attr('r', 3)
            .attr('fill', 'grey')
            .attr('cx', function(d,i){
                return i%100*dotSpacing
                //return width/50*(3.5+i%40)
            })
            .attr('cy', function(d,i){
                if (i<100){
                    return height
                }
                else{
                    return height - dotSpacing
                }
                //return (Math.trunc(i / 40)) * height/50 + marginTop*2;
            })
    }

    function animateDeathInjury(){
        const dotSpacing = 12;
        const nCol = 30
        // d3.selectAll('.customCircle.male')
        //     .transition()
        //     .duration(800)
        //     .attr('fill', 'brown')
        //     .attr('r', dotR)
        //     .attr('cx', function(d,i){
        //         return i%nCol*dotSpacing
        //         //return width/50*(3.5+i%40)
        //     })
        //     .attr('cy', function(d,i){
        //         const rowNum = (i-i%nCol)/nCol
        //         return dotSpacing*(rowNum+1)
        //     });

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
        const dotSpacing = 12;
        const nCol = 30
        // d3.selectAll('.customCircle.male')
        //     .transition()
        //     .duration(800)
        //     .attr('fill', 'brown')
        //     .attr('r', dotR)
        //     .attr('cx', function(d,i){
        //         return i%nCol*dotSpacing
        //         //return width/50*(3.5+i%40)
        //     })
        //     .attr('cy', function(d,i){
        //         const rowNum = (i-i%nCol)/nCol
        //         return dotSpacing*(rowNum+1)
        //     });

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
    //
    // function animationOne(){
    //
    //     // update circles
    //     d3.selectAll('.customCircle.child')
    //         .transition()
    //         .duration(800)
    //         .attr('r', radiusSmallCircles)
    //         .attr('cx', function(d,i){
    //             let angle = (i / (data.length/4)) * Math.PI;
    //             let x = (radiusBigCircles * Math.cos(angle)) + (width/4);
    //             return x })
    //         .attr('cy', function(d,i){
    //             let angle = (i / (data.length/4)) * Math.PI;
    //             return (radiusBigCircles * Math.sin(angle)) + (height/2);
    //         });
    //
    //     d3.selectAll('.customCircle.teen')
    //         .transition()
    //         .duration(800)
    //         .attr('r', radiusSmallCircles)
    //         .attr('cx', function(d,i){
    //             let angle = (i / (data.length/4)) * Math.PI;
    //             let x = (radiusBigCircles * Math.cos(angle)) + (width/4*3);
    //             return x })
    //         .attr('cy', function(d,i){
    //             let angle = (i / (data.length/4)) * Math.PI;
    //             return (radiusBigCircles * Math.sin(angle)) + (height/2);
    //         });
    //
    //     // update labels
    //     d3.selectAll('.customLabel.child')
    //         .transition()
    //         .duration(800)
    //         .attr('r', radiusSmallCircles)
    //         .attr('x', function(d,i){
    //             let angle = (i / (data.length/4)) * Math.PI;
    //             let x = (radiusBigCircles * Math.cos(angle)) + (width/4);
    //             return x })
    //         .attr('y', function(d,i){
    //             let angle = (i / (data.length/4)) * Math.PI;
    //             y = (radiusBigCircles * Math.sin(angle)) + (height/2);
    //             return y
    //         });
    //
    //     // update labels
    //     d3.selectAll('.customLabel.adult')
    //         .transition()
    //         .duration(800)
    //         .attr('r', radiusSmallCircles)
    //         .attr('x', function(d,i){
    //             let angle = (i / (data.length/4)) * Math.PI;
    //             return (radiusBigCircles * Math.cos(angle)) + (width/4*3);
    //         })
    //         .attr('y', function(d,i){
    //             let angle = (i / (data.length/4)) * Math.PI;
    //             return (radiusBigCircles * Math.sin(angle)) + (height/2);
    //         });
    // }

// animation 2 - separate bar charts
    function animationTwo(){

        d3.selectAll('.customCircle.child')
            .transition()
            .duration(800)
            .attr('cx', function(d,i){
                return (width/100*(i%4+1))
            })
            .attr('cy', function(d,i){
                return (Math.trunc(i / 4)) * (radiusAnimationTwo*2 + spaceBetweenCircles);
            })
            .attr('r', radiusAnimationTwo);


        d3.selectAll('.customCircle.teen')
            .transition()
            .duration(800)
            .attr('cx', function(d,i){
                return (width/100*(6+i%4))
            })
            .attr('cy', function(d,i){
                return (Math.trunc(i / 4)) * (radiusAnimationTwo*2 + spaceBetweenCircles);
            })
            .attr('r', radiusAnimationTwo);


        // update labels
        d3.selectAll('.customLabel.child')
            .transition()
            .duration(800)
            .attr('x', function(d,i){
                return width/100*(1+i%4)
            })
            .attr('y', function(d,i){
                return (Math.trunc(i / 4)) * (radiusAnimationTwo*2 + spaceBetweenCircles);
            })
            .attr('r', radiusAnimationTwo);


        // update labels
        d3.selectAll('.customLabel.adult')
            .transition()
            .duration(800)
            .attr('x', function(d,i){
                return width/100*(i%4+6)
            })
            .attr('y', function(d,i){
                return (Math.trunc(i / 4)) * (radiusAnimationTwo*2 + spaceBetweenCircles);
            })
            .attr('r', radiusAnimationTwo);
    }

// animation 3 - back to start
    function animationThree(){

        // sort by
        d3.selectAll('.customCircle')
            .transition()
            .duration(800)
            .attr('cx', function(d,i){
                return width/50*(3.5+i%40)
            })
            .attr('cy', function(d,i){
                return (Math.trunc(i / 40)) * height/50 + marginTop;
            })
            .attr('r', width/300);
    }

    // animation
    setInterval (animateCircles, 6000);

    function animateCircles(){
        animateGender()
        setTimeout(function() {animateDeathInjury()}, 2000);
        setTimeout(function() {animateAge()}, 4000);
        //setTimeout(function() { animationTwo() }, 2000);
        //setTimeout(function() { animationThree() }, 4000);
    }

// // animation
//     setInterval (animateCircles, 6000);
//
//     function animateCircles(){
//         animationOne();
//         setTimeout(function() { animationTwo() }, 2000);
//         setTimeout(function() { animationThree() }, 4000);
//     }
});
