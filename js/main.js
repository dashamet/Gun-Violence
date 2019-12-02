let myDotVis;
let myScatterVis;
let myBrushVis;

// init globalDataSets
// let dataSet;


// key
// 0 = all shooting data

// load data
queue()
    .defer(d3.csv, "data/allShootings.csv")
    .defer(d3.csv, "data/us-state-names.csv")
    .await(initMainPage);

function initMainPage(error, shootingData, stateNameData) {
    console.log(shootingData);
    myDotVis = new dotVis('memorial-viz', shootingData);
}
