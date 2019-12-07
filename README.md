# CS171-Final-Project: UnderAge and Underfire

#Project Description
 Our group hopes our project will shed light on the toll firearms take on 
 children and teenagers through suicide, homicide, accidental 
 death, and injury.
 
 Our Visualizations show the rates and type of 
 firearm injuries and deaths over time and the amount of children and teens, male and female, 
 who have been killed or injured by firearms. We make sure to humanize this crisis in our country 
 and memorialize the victims, as well as illustrate how certain types of policies have
 impacted total firearm deaths over time.
 
 Especially with the latter visualization, we hope to contribute in a small way to ultimately 
 reducing gun violence by spreading awareness of policies that have saved lives. 


There are adequate descriptions of how to interact with our visualizations, but in case of confusion,
here is the link to the video that briefly shows how
to interact with our visualizations:  
LINK HERE

#Libraries:  
bootstrap.min.js  
colorbrewer.js  
d3.min.js  
jquery.counterup.min.js  
jquery.min.js  
jquery.pagepiling.js  
jquery.waypoints.min.js  
my.js   
popper.min.js  
queue.min.js  
topojson.v1.min.js  
waypoint.js  
bootstrap.min.css  
jquery.pagepiling.css

#Our Code:  
main.js: 
- Initialize visualizations  
 
vis-dots.js: 
- Memorial visualization with dot animations (page 5)  

vis-line.js: 
- Injuries and deaths over time line graph with updates text
when text or circle hovered(page 3)  

vis-map1.js: 
- Plotting incidents of gun violence on a state map, 
with dropdowns to sort by injury or death, gender, or 
age range (page 4)

vis-map2.js: 
- chloropleth and corresponding legend with dropdown to show 
states without certain firearm policies (page 6)
   
vis-map2line.js  
- linked line graph to vis-map2, updated when hover on a state
 and includes lines with policy data(page 6)

index.html  
- where pagepiler is run as well as creating divs for all of our
visualizations and static pages

style.css 

#Data Links
Our data was scraped from a variety of sources.   

Here is the link to our process book if you want
to learn more about our sources and our creative process:  https://docs.google.com/document/d/1cwD3-cQMEhZHYYeOAjc17EDM-yCXPW24efqupfw35rI/edit?usp=sharing