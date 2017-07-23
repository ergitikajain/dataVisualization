'use strict';

function toCamelCase(str) {
    return str.toLowerCase().replace(/(?:(^.))/g, function(match) {
        return match.charAt(match.length-1).toUpperCase();
    });
}
const marginTreeMap = {top: 40, right: 10, bottom: 10, left: 10},
      widthTreeMap = 960 - marginTreeMap.left - marginTreeMap.right,
      heightTreeMap = 500 - marginTreeMap.top - marginTreeMap.bottom,
      colorTreeMap = d3.scaleOrdinal().range(d3.schemeCategory20c);

const treemap = d3.treemap().size([widthTreeMap, heightTreeMap]);




const div = d3.select("#treemap")
    .style("position", "relative")
    .style("width", (widthTreeMap + marginTreeMap.left + marginTreeMap.right) + "px")
    .style("height", (heightTreeMap + marginTreeMap.top + marginTreeMap.bottom) + "px")
    .style("left", marginTreeMap.left + "px")
    .style("top", marginTreeMap.top + "px");

var tool = d3.select("#tooltipTreeMap").append("div").attr("class", "toolTipTreeMap");

         d3.select(self.frameElement).style("height", heightTreeMap + 300 + "px");
        d3.select(self.frameElement).style("width", widthTreeMap+20 + "px");

d3.json("data/treemap.json", function(error, data) {
  if (error) throw error;

  const root = d3.hierarchy(data, (d) => d.children)
    .sum((d) => d.size);

  const tree = treemap(root);





  const node = div.datum(root).selectAll(".node")
      .data(tree.leaves())
    .enter().append("div")
      .attr("class", "node")
      .style("left", (d) => d.x0 + "px")
      .style("top", (d) => d.y0 + "px")
      .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
      .style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
      .style("background", (d) => colorTreeMap(d.parent.data.name))
      .text((d) => d.data.name)
       .on("mousemove", function (d) {
                    tool.style("left", d3.event.pageX + 10 + "px")
                    tool.style("top", d3.event.pageY - 20 + "px")
                    tool.style("display", "inline-block");
                    tool.html(d.children ? null : "City: " + d.data.name  + "<br> State: " + toCamelCase(d.parent.data.name) + "<br>" + " Population: " + d.data.size + ' ' );
                }).on("mouseout", function (d) {
                    tool.style("display", "none");
                });


function mouseover() {
  div.style("display", "inline");
}

function mousemove() {
  div
      .text(d3.event.pageX + ", " + d3.event.pageY)
      .style("left", (d3.event.pageX - 34) + "px")
      .style("top", (d3.event.pageY - 12) + "px");
}

function mouseout() {
  div.style("display", "none");
}

  d3.selectAll("input").on("change", function change() {
    const value = this.value === "count"
        ? (d) => { return d.size ? 1 : 0;}
        : (d) => { return d.size; };

    const newRoot = d3.hierarchy(data, (d) => d.children)
      .sum(value);

    node.data(treemap(newRoot).leaves())
      .transition()
        .duration(1500)
        .style("left", (d) => d.x0 + "px")
        .style("top", (d) => d.y0 + "px")
        .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
        .style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
  });
});
