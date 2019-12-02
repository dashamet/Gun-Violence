let myDotVis;
let myScatterVis;
let myBrushVis;

// init globalDataSets
// let dataSet;


// key
// 0 = all shooting data
let promises = [
    //d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json"),
    d3.csv("data/allShootings.csv")
];

Promise.all(promises)
    .then( function(data){ initMainPage(data) })
    .catch( function (err){console.log(err)} );

function initMainPage(dataArray) {
    myDotVis = new Vis('memorial-viz', dataArray[0]);
}
