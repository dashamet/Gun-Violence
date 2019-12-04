let myDotVis;
let myMap2;
let myLineVis;
let myMapOne;

// load data
queue()
    .defer(d3.csv, "data/allShootings.csv")
    .defer(d3.json,"data/us.topo.json")
    .defer(d3.csv, "data/us-state-names.csv")
    .defer(d3.csv, "data/master.data.states.2019.01.18.csv")
    .defer(d3.csv, "data/policyData.csv")
    .defer(d3.csv, "data/aggregated-deaths-injuries.csv")

    .await(initMainPage);

function initMainPage(error, shootingData, usMapData, stateNameData, deathData, policyData, deathInjData) {
    console.log(shootingData);
    myDotVis = new dotVis('memorial-viz', shootingData);
    myMapOne = new mapOneVis('map1', shootingData, usMapData);
    myMap2 = new map2Vis('map2', usMapData, stateNameData, deathData, policyData);
    myLineVis = new lineVis('line-graph', deathInjData)

}
