# CS171 Final Project: Underage and Under Fire

## Project Description
Our project is a data-driven exploration of the toll firearms have taken on children and teenagers in the United States. We visualize causes of firearm injuries and deaths over time, the geography of gun violence, a breakdown of its victims, and the relationship between firearm deaths and gun control policy. 

A video overview of our website can be found [here](https://www.youtube.com/watch?v=DsNb6ZF8-Y8&feature=youtu.be). 

To learn more about our data sources and our creative process, check out our [process book](https://docs.google.com/document/d/1cwD3-cQMEhZHYYeOAjc17EDM-yCXPW24efqupfw35rI/edit?usp=sharing). 

## Code
* `index.html` contains our HTML code

* `style.css` contains our CSS code

* `my.js` contains our jQuery code

* `main.js` initializes the visualizations contained in the following .js files

* `vis-line.js` contains code for a line graph depicting causes of injuries and deaths over time (page 3)  

* `vis-map1.js` contains code for a map showing victims filtered based on age, gender, and type of harm (page 4)

* `vis-dots.js` contains code for an animated visualization depicting victims as dots (page 5)  

* `vis-map2.js` contains code for a choropleth map showing the correlation between states' firearm death rates and gun control policies (page 6)
   
* `vis-map2line.js` contains code for an area graph (linked to the choropoleth map above) which shows deaths by firearms over time in a selected state as well as when a particular policy was implemented in that state (page 6)

## Libraries
bootstrap.min.css 
bootstrap.min.js  
colorbrewer.js  
d3.min.js  
jquery.counterup.min.js  
jquery.min.js  
jquery.pagepiling.css
jquery.pagepiling.js  
popper.min.js  
queue.min.js  
topojson.v1.min.js   

## Data
We relied on three main sources of data:
1. [The Center for Disease Control and Prevention (CDC)](https://www.cdc.gov/injury/wisqars/index.html)
2. [Gun Violence Archive](https://www.gunviolencearchive.org/reports)
3. [RAND](https://www.rand.org/pubs/tools/TL283-1.html)
