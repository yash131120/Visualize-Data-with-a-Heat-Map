(function () {
  "use strict";
  fetch(
    "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (temperatures) {
      var month = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      var data = temperatures.monthlyVariance;

      var minYear = data.reduce(function (p, c) {
        return c.year < p ? c.year : p;
      }, Number.MAX_SAFE_INTEGER);
      var maxYear = data.reduce(function (p, c) {
        return c.year > p ? c.year : p;
      }, 0);

      var minHeap = data.reduce(function (p, c) {
        return c.variance < p ? c.variance : p;
      }, Number.MAX_SAFE_INTEGER);
      var maxHeap = data.reduce(function (p, c) {
        return c.variance > p ? c.variance : p;
      }, 0);

      var margin = {
        top: 10,
        left: 46,
        bottom: 26,
        right: 0,
      };

      var colours = [
        "#5e4fa2",
        "#3288bd",
        "#66c2a5",
        "#abdda4",
        "#e6f598",
        "#ffffbf",
        "#fee08b",
        "#fdae61",
        "#f46d43",
        "#d53e4f",
        "#9e0142",
      ];

      var heatmapColour = d3.scale
        .linear()
        .domain(d3.range(minHeap, maxHeap))
        .range(colours);

      var width = 860 - margin.left - margin.right;
      var height = 540 - margin.top - margin.bottom;

      var yScale = d3.scale
        .ordinal()
        .domain(d3.range(0, 12))
        .rangeBands([0, height]);

      var xScale = d3.scale
        .ordinal()
        .domain(d3.range(data.length / 12))
        .rangeBands([0, width]);

      var xAxis = d3.svg
        .axis()
        .scale(
          d3.scale
            .linear()
            .domain([minYear, maxYear])
            .range([0, width + 10])
        )
        .orient("bottom")
        .tickFormat(function (o) {
          return o;
        })
        .ticks(14);

      var yAxis = d3.svg
        .axis()
        .scale(
          d3.scale
            .linear()
            .domain([0, 11])
            .range([0, height + 4])
        )
        .orient("left")
        .tickFormat(function (i) {
          return month[i];
        })
        .ticks(10);

      var toolTip = d3
        .select(".chart")
        .append("div")
        .attr("class", "tooltip")
        .attr("style", "visibility: hidden;");

      var bar = d3
        .select(".chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("style", "background: #fff");

      bar
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        //.style({'fill' : 'steelblue'})
        .attr("width", xScale.rangeBand())
        .attr("height", yScale.rangeBand())
        .style("fill", function (d) {
          return heatmapColour(d.variance);
        })
        .attr("x", function (d, i) {
          return (d.year - minYear) * xScale.rangeBand();
        })
        .attr("y", function (d) {
          return (d.month - 1) * yScale.rangeBand();
        })
        .on("mouseover", function (d) {
          var posX = d3.event.pageX;
          var posY = d3.event.pageY;
          toolTip
            .attr(
              "style",
              "left:" + posX + "px;top:" + posY + "px; visibility: visible;"
            )
            .html(
              "<strong>" +
                month[d.month - 1] +
                " " +
                d.year +
                "</strong><br /><span> Temp : " +
                Math.round(temperatures.baseTemperature + d.variance) +
                "<strong>C</strong></span>"
            );
        })
        .on("mouseout", function (d) {
          toolTip.attr("style", "visibility: hidden;");
        });

      bar
        .append("g")
        .attr(
          "transform",
          "translate(0" + (margin.left - 4) + ", " + margin.top + ")"
        )
        .call(yAxis)
        .selectAll("line")
        .style({ stroke: "#000", "stroke-width": "0.1" })
        .selectAll("text")
        .attr("style", "font-size: 12px;");

      bar
        .append("g")
        .attr(
          "transform",
          "translate(" +
            (margin.left - 4) +
            ", " +
            (height + margin.top + 4) +
            ")"
        )
        .call(xAxis)
        .selectAll("line")
        .style({ stroke: "#000", "stroke-width": "0.1" })
        .selectAll("text")
        .style("transform", "rotate(-90deg)")
        .attr("style", "font-size: 12px;");
    });
})();
