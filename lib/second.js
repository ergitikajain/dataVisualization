var svg1 = d3.select("#child"),
    margin2 = {top: 20, right: 20, bottom: 150, left: 70},
    width2 = +svg1.attr("width") - margin2.left - margin2.right,
    height2 = +svg1.attr("height") - margin2.top - margin2.bottom;
   var g1 = svg1.append("g").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
console.log("firefox browser " + isFirefox);

// set x scale
var x1 = d3.scaleBand()
    .rangeRound([0, width2])
    .paddingInner(0.05)
    .align(0.1);

// set y scale
var y1 = d3.scaleLinear()
    .rangeRound([height2, 0]);

// set the colors
var z1 = d3.scaleOrdinal()
    .range(["#3E85FD", "#f590e5"]);

// load the csv and create the chart
d3.csv("data/childpopulation.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys1 = data.columns.slice(1);

  data.sort(function(a, b) { return b.total - a.total; });
  x1.domain(data.map(function(d) { return d.state_name; }));
  y1.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z1.domain(keys1);

  g1.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys1)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z1(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x1(d.data.state_name); })
      .attr("y", function(d) { return y1(d[1]); })
      .attr("height", function(d) { return y1(d[0]) - y1(d[1]); })
      .attr("width", x1.bandwidth())
    .on("mouseover", function() { tooltip1.style("display", null); tooltip1.style("pointer-events", "none"); })
    .on("mouseout", function() { tooltip1.style("display", "none"); })
    .on("mousemove", function(d) {
   //   console.log(d);
      var xPosition = d3.mouse(this)[0] - 5;
      var yPosition = d3.mouse(this)[1] - 5;
      
if (isFirefox) {
      tooltip1.attr("transform", "translate(" + (d3.event.screenX -140 )+ "," + (d3.event.screenY  - 300) + ")");
    } else {

     tooltip1.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
   }



  /* if ((d[1]-d[0]) > 1700000) {

      tooltip1.select("text").text("High Population " + (d[1]-d[0]));
   }  else if((d[1]-d[0]) < 50000) {
      tooltip1.select("text").text("Low Population " + (d[1]-d[0]));

   } else {
      tooltip1.select("text").text(d[1]-d[0]);

   }*/

   tooltip1.select("text").html(d[1]-d[0]);
    });



// Add the X Axis
  g1.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(d3.axisBottom(x1).ticks(10))
      .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");



  g1.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y1).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y1(y1.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start");


  // text label for the x axis
  g1.append("text")             
      .attr("transform",
            "translate(" + (width2/2) + " ," + 
                           (height2 + margin2.top + 120) + ")")
      .attr("font-size", 9)
      .style("text-anchor", "middle")
      .text("State Name");


  // text label for the y axis

 g1.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin2.left)
      .attr("x",0 - (height2 / 2))
      .attr("dy", "1em")
      .attr("font-size", 9)
      .style("text-anchor", "middle")
      .text("Population (in Millions)"); 


 g1.append("text")
      .attr("transform",
            "translate(" + (width2/2-110) + " ," + 
                           (height2 + margin2.top - 350) + ")")
      .attr("y", 0 - margin2.left)
      .attr("x",0 - (height2 / 2))
      .attr("dy", "1em")
      .attr("class", "annotation")
      .style("text-anchor", "middle")
      .text("High populated state"); 
  

 g1.append("text")
      .attr("transform",
            "translate(" + (width2+80) + " ," + 
                           (height2 + margin2.top +20 ) + ")")
      .attr("y", 0 - margin2.left)
      .attr("x",0 - (height2 / 2))
      .attr("dy", "1em")
      .attr("class", "annotation")
      .style("text-anchor", "middle")
      .text("Low populated states"); 


  var legend1 = g1.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 14)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys1.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend1.append("rect")
      .attr("x", width2 - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z1);

  legend1.append("text")
      .attr("x", width2 - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) {
        console.log(d);
       return d=="population_female_0_6" ? "Female Child (0-6 Age) Population" : "Male Child (0-6 Age) Population"; });
});

  // Prep the tooltip bits, initial display is hidden
  var tooltip1 = svg1.append("g")
    .attr("class", "tooltip")
    .style("display", "none");
      
  tooltip1.append("rect")
    .attr("width", 60)
    .attr("height", 20)
    .attr("fill", "white");
    //.style("opacity", 0.5);

  tooltip1.append("text")
    .attr("x", 30)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
