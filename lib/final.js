    var w = 600;
    var h = 600;

var WIDTH = 1000, HEIGHT = 600; //originally 1600
var c = "#3fae07", COLOR_LAST = "#ff0404";
var COLOR_COUNTS = 10;
var SCALE = 0.5;
var active = d3.select(null);
var centered;

var stateMap = new Object();
var totalPopulation = 0;
var total_child_population = 0;
var literates_total = 0;
var graduate_total = 0;

d3.csv("data/india_census.csv", function(data) {
 data.forEach(function(d) {
 if (stateMap[d.state_name] !=null) {
  var state_data = stateMap[d.state_name] ;
  //console.log("state exist" + d.state_name + " " + state_data.population_total + " new " + d.population_total);
  totalPopulation = totalPopulation + parseInt(d.population_total);
  total_child_population = total_child_population + parseInt(d.population_total_0_6);
  state_data.population_male = parseInt(state_data.population_male) + parseInt(d.population_male);
  state_data.population_female = parseInt(state_data.population_female) + parseInt(d.population_female);
  state_data.population_total = parseInt(state_data.population_total) + parseInt(d.population_total);
  state_data.child_populationTotal = parseInt(state_data.child_populationTotal) + parseInt(d.population_total_0_6);
  state_data.literate_populationTotal = parseInt(state_data.literate_populationTotal) + parseInt(d.literates_total);
  literates_total = literates_total + parseInt(d.literates_total);

  state_data.graduate_populationTotal = parseInt(state_data.graduate_populationTotal) + parseInt(d.total_graduates);
  graduate_total = graduate_total + parseInt(d.total_graduates);


  stateMap[d.state_name] = state_data;
 // console.log("state populationTotal" + d.state_name  + state_data.population_total);
} else {
 var state_data={};
 state_data.state_name = d.state_name;
 state_data.population_total = parseInt(d.population_total);
 state_data.child_populationTotal = parseInt(d.population_total_0_6);
 state_data.literate_populationTotal = parseInt(d.literates_total);
 state_data.graduate_populationTotal = parseInt(d.total_graduates);


 state_data.population_male = parseInt(d.population_male);
 state_data.population_female = parseInt(d.population_female);
 stateMap[d.state_name] = state_data;
 totalPopulation = totalPopulation + parseInt(d.population_total);
 total_child_population = total_child_population + parseInt(d.population_total_0_6);
 literates_total = literates_total + parseInt(d.literates_total);
  graduate_total = graduate_total + parseInt(d.total_graduates);

 //console.log("state does not exist" + d.state_name + d.population_total);
}

   
  });
});


var RED = "#FF0000",
    YELLOW = "#FFA000" //"#FFCC00",
    GREEN = "#228B22";

 var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10,0])
              .html(function(d) {
                var stateName = d.id;
                var state_data = stateMap[d.id.toUpperCase()];
                if (state_data != null) {
                var population_total = state_data.population_total;
                return "<span class='details'>" +
                       stateName + "<br>" +
                       "Total Population <span class='details'>" +
                              inMillions(population_total) + "M";
                            }
                            else {
                               return "<span class='details'>" +
                       stateName + "<br>" +
                       "<strong>Doesn't  have any city in Top 500</strong>";
                            }

              });

 var quantize = d3.scaleQuantize()
          .domain([5,8,25])
          .range([GREEN,YELLOW,RED]);


           var scaleColor = d3.scaleLinear()
                    .domain([5,8,25])
                    .range([GREEN, YELLOW, RED])

    var proj = d3.geo.mercator() .translate([250, 150]) // translate to center of screen
          .scale([550]);
    var path = d3.geo.path().projection(proj);
    var t = proj.translate(); // the projection's default translation
    var s = proj.scale() // the projection's default scale

  var quantize = d3.scaleQuantize()
          .domain([5,20,25])
          .range([GREEN,YELLOW,RED]);

    var map = d3.select("#chart").append("svg:svg")
        .attr("width", w)
        .attr("height", h)
//        .call(d3.behavior.zoom().on("zoom", redraw))
         .call(initialize)
         .on("click", stopped, true);

  map.call(tip);

    var india = map.append("svg:g")
        .attr("id", "india");

    d3.json("data/states.json", function (json) {
      india.selectAll("path")
          .data(json.features)
        .enter().append("path")
          .style("fill", function(d) {
                   var stateName = d.id;

                   if (stateName == undefined || stateMap[d.id.toUpperCase()] == undefined) return;
                   //return scaleColor(poverty_data[stateName][3]);
                 //  console.log("value is " + Math.abs(Number(stateMap[d.id.toUpperCase()].population_total)) / 1.0e+6);
                   return quantize(Math.abs(Number(stateMap[d.id.toUpperCase()].population_total)) / 1.0e+6);
                })
               .on("mouseover", function(d,i) {
                 var stateName = "Punjab";
                 $(this).attr("fill-opacity", "0.8");

                 if (stateName == undefined) return;
                  //console.log(d,i);
                  d3.select(this).style("fill-opacity", 0.6);
                  tip.show(d);

               })
               .on("mouseout", function(d,i) {
                  //console.log(d,i);
                  d3.select(this).style("fill-opacity", 1.0);
                  tip.hide(d);
               })
               .on("click", function(d,i) {
                  var stateName = d.id;
                  console.log("You clicked on ", stateName);
                  makeBar(".chart1", stateName);

                  makeDonutChart(stateName);
                  d3.select("#title1")
     .html("Showing Population details of  <strong>" + stateName+"</strong> ");

               })
               .attr("d", path);
   
      var barChartLabels = ["< 8 M",
                 "8 - 15 M",
                 "> 15 M"];

   var barChartColors =  [GREEN,
                          YELLOW,
                          RED];

     var ordinal = d3.scaleOrdinal()
     .domain(barChartLabels)
     .range(barChartColors);

   map.append("g")
     .attr("class", "legendOrdinal")
     .attr("transform", "translate(20,20)");


    var legendOrdinal1 = d3.legendColor()
                          .shape("path", d3.symbol().type(d3.symbolSquare).size(500)())
                          .cells(4)
                          .shapeWidth(60)
                          .orient("vertical")
                          .scale(ordinal);

    map.select(".legendOrdinal")
     .call(legendOrdinal1);



    makeDonutChart("PUNJAB");
makeBar(".chart1", "PUNJAB");
d3.select("#title1")
     .html("Showing Population details of  <strong> Punjab</strong> ");
    });

   

    function initialize() {
      proj.scale(6700);
      proj.translate([-1240, 720]);
    }
// If the drag behavior prevents the default click,
      // also stop propagation so we don’t click-to-zoom.
      function stopped() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
      }

function inMillions (labelValue) {
    var number = Math.abs(Number(labelValue)) / 1.0e+6 ;
    return  number.toFixed(2);

}

  
function makeBar(svgId, stateName) {

   // Build the Bar chart

   var width = WIDTH,
      height = HEIGHT;
   var margin = {top: 20, right: 20, bottom: 30, left: 40};
var data;



   

   var barChartLabels = ["Population % ",
                 "0 - 6 Child Population % ",
                 "Literate Population % ",
                 "Effective Literacy Rate % "];

   var barChartColors =  ["#DD9692",
                          "#C6D445",
                          "#839BE6",
                          "#EF7087"];

   var state_data = stateMap[stateName.toUpperCase()];
                if (state_data != null) {
                var data = [Number(Math.abs(Number(stateMap[stateName.toUpperCase()].population_total))/totalPopulation*100).toFixed(2),
              Number(Math.abs(Number(stateMap[stateName.toUpperCase()].child_populationTotal))/total_child_population*100).toFixed(2),
              Number(Math.abs(Number(stateMap[stateName.toUpperCase()].literate_populationTotal))/literates_total*100).toFixed(2),
              Number(Math.abs(Number(stateMap[stateName.toUpperCase()].graduate_populationTotal))/graduate_total*100).toFixed(2)];

  
                } else {
var data = [0,0,0,0];
                }                       

 var y = d3.scaleBand().range([height,0]).padding(0.1);

   y.domain(data.map(function(d,i) {console.log(d,i,barChartLabels[i]); return barChartLabels[i]; }));

   var svgBar = d3.select(".svgBar");



   var ordinal = d3.scaleOrdinal()
     .domain(barChartLabels)
     .range(barChartColors);

//   console.log("Create a Poverty Bar chart for state for ", stateName);

   d3.select("#barTitle1")
     .html("Poverty Level in <strong>" + stateName + "</strong> for various age groups");



   d3.select(svgId)
   .selectAll("div")
     .data(data)
   .enter().append("div")
     .style("width", function(d) { 
          //  console.log("d is " + d + d<1? 20 : d * 20 );
           return d<1? 50 : d * 50  + "px";
       })
     .style("background-color", function(d,i) { return barChartColors[i];})
     .text(function(d,i) { return   d + "%"; })
   .exit().transition()
        .style("opacity", 0)
        .attr("transform", "translate(0," + (height + margin.top + margin.bottom) + ")")
        .remove();

   d3.select(".chart1")
        .selectAll("div").transition()
        .duration(600)
       .text(function(d,i) { return  d==0? "NA" :d + "%"; 
   d + "%"; })
       .style("width", function(d) { return d<=2? 50 +"px" : d * 25  + "px";  })

   svgBar.append("g")
     .attr("class", "legendOrdinal")
     .attr("transform", "translate(20,100)");


    var legendOrdinal = d3.legendColor()
                          .shape("path", d3.symbol().type(d3.symbolSquare).size(500)())
                          .cells(4)
                          .shapeWidth(60)
                          .orient("vertical")
                          .scale(ordinal);

    svgBar.select(".legendOrdinal")
     .call(legendOrdinal);

}


function makeDonutChart(stateName) {

var data;

   var state_data = stateMap[stateName.toUpperCase()];
        if (state_data != null) {

            var femalePopulation = Number(stateMap[stateName.toUpperCase()].population_female);
            var malePopulation = Number(stateMap[stateName.toUpperCase()].population_male);
            data  = [
              {label: "Female", value: (Number((femalePopulation*100)/(femalePopulation+malePopulation))).toFixed(2)},
              {label: "Male", value: (Number((malePopulation*100)/(femalePopulation+malePopulation))).toFixed(2)},
        
        ];} else {
           data = [

             {label: "Female", value: 0},//(Number((femalePopulation*100)/(femalePopulation+malePopulation))).toFixed(2)},
             {label: "Male", value: 0}//(Number((malePopulation*100)/(femalePopulation+malePopulation))).toFixed(2)},
        
        ];
        }


var svg = d3.select("#pieTotal")
   .append("g")

svg.append("g")
  .attr("class", "slices");



var width = 400,
    height = 300,
  radius = 110;

var pie = d3.pie()
  .sort(null)
  .value(function(d) {
    return d.value;
  });

var arc = d3.arc()
  .outerRadius(radius * .9)
  .innerRadius(radius * .6);

var outerArc = d3.arc()
  .innerRadius(radius * 0.1)
  .outerRadius(radius * 0.8);

var legendRectSize = (radius * 0.08);
var legendSpacing = radius * 0.03;


var div = d3.select("body").append("div").attr("class", "toolTipDonut");

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var color = d3.scaleOrdinal()
    .range(["#f590e5", "#3E85FD"]);


//change(datasetTotal);


d3.selectAll("input")
  .on("change", data);
  

      var path = svg.selectAll('path')
          .data(pie(data))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d, i) {
            return color(d.data.label);
          });



    path.enter()
        .insert("path")
        .style("fill", function(d) { return color(d.data.label); })
        .attr("class", "slice");

    path
        .transition().duration(1000)
        .attrTween("d", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                return arc(interpolate(t));
            };
        })
    path
        .on("mousemove", function(d){
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            div.html((d.data.label)+"<br>"+(d.data.value)+"%");
        });
    path
        .on("mouseout", function(d){
            div.style("display", "none");
        });

    path.exit()
        .remove();

    var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = -3 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d; });

    /* ------- TEXT LABELS -------*/

    var text = svg.select(".labelName").selectAll("text")
        .data(pie(data), function(d){ return d.data.label });

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            return (d.data.label+": "+d.value+"%");
        });

    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text
        .transition().duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        })
        .text(function(d) {
            return (d.data.label+": "+d.value+"%");
        });


    text.exit()
        .remove();
}
