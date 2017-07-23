var svgHrBarChart = d3.select("#hrbarchart"),
    margin = {top: 80, right: 20, bottom: 30, left: 180},
    width = +svgHrBarChart.attr("width") - margin.left - margin.right,
    height = +svgHrBarChart.attr("height") - margin.top - margin.bottom;
  
var tooltipBarChart = d3.select("body").append("div").attr("class", "toolTipHrBarChart");
  
var xOfBarChart = d3.scaleLinear().range([0, width]);
var yOfBarChart = d3.scaleBand().range([height, 0]);

var gHrBarChart = svgHrBarChart.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
d3.json("data/data.json", function(error, data) {
  	if (error) throw error;
  
  	data.sort(function(a, b) { return a.noOfCities - b.noOfCities; });
  
  	xOfBarChart.domain([0, d3.max(data, function(d) { return d.noOfCities; })]);
    yOfBarChart.domain(data.map(function(d) { return d.state_name; })).padding(0.1);

    gHrBarChart.append("g")
        .attr("class", "x axis")
       	.attr("transform", "translate(0," + height + ")")
      	.call(d3.axisBottom(xOfBarChart).ticks(5).tickFormat(function(d) { return parseInt(d*10); }).tickSizeInner([-height]));


    gHrBarChart.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yOfBarChart));

gHrBarChart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - margin.left)
      .attr("y",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Value");
   var colors = d3.scaleOrdinal(d3.schemeCategory20);


    gHrBarChart.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("fill", function(d, i) { return colors(d.state_name) })
        .attr("x", 0)
        .attr("height", yOfBarChart.bandwidth())
        .attr("y", function(d) { return yOfBarChart(d.state_name); })
        .attr("width", function(d) { return xOfBarChart(d.noOfCities/10); })
        .on("mousemove", function(d){
            tooltipBarChart
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d.state_name) + " : " + (d.noOfCities));
        })
    		.on("mouseout", function(d){ tooltipBarChart.style("display", "none");});
});