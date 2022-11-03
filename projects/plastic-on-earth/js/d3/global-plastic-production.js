// Code Source: https://learning.oreilly.com/library/view/interactive-data-visualization/9781491921296/ch11.html#idm140093188423200
// Code Source: https://d3-graph-gallery.com/graph/line_basic.html
// Data Source: https://ourworldindata.org/plastic-pollution

function main() {

    d3.csv("../../data/global-plastics-production.csv").then(
        (data) => {
            data.forEach(function(d) {
                d.Amount = +d["Global plastics production"];
            });
            lineChart(data);
        },
        // on rejected
        () => {
            console.log("data is missing")
        }
    );
}

function lineChart(data) {

    // Setting up canvas width and height
    const canvasWidth = 700;
    const canvasHeight = 600;
    // Define all the margins within canvas
    const marginLeft = canvasWidth * 0.15;
    const marginRight = canvasWidth * 0.1;
    const marginTop = canvasHeight * 0.15;
    const marginBot = canvasHeight * 0.2;

    let svg = d3.select("svg")
    svg.attr("width", canvasWidth)
        .attr("height", canvasHeight);

    let minMaxYear = d3.extent(data, function(d) { return d.Year; })
    // Scale and add X axis
    let xScale = d3.scaleTime()
        .domain([new Date(minMaxYear[0], 0, 1), new Date(minMaxYear[1], 0, 1)])
        .range([ 0, canvasWidth - marginLeft - marginRight ]);
    svg.append("g")
        .attr("transform", `translate(${marginLeft}, ${canvasHeight - marginBot})`)
        .call(d3.axisBottom(xScale)) // syntax: d3.axisLeft(scale) - construct an y-axis for the given scale
        .selectAll("text") // select all the text element

    // Scale and add Y axis
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.Amount; })]) // actual number on data
        .range([canvasHeight - marginTop - marginBot, 0]); // available dimension on canvas
    svg.append("g")
        .attr("transform", `translate(${marginLeft}, ${marginTop})`)
        .call(d3.axisLeft(yScale)); // syntax: d3.axisLeft(scale) - construct an y-axis for the given scale


    // Define line generator
    // The x and y accessors tell the line generator how to decide where to place each point on the line.
    let line = d3.line()
        .x(function(d) { console.log(d.Year); return marginLeft + xScale(new Date(d.Year, 0, 1)); })
        .y(function(d) { console.log(d.Amount); return marginTop + yScale(Math.abs(d.Amount)); });

    //Create line
    svg.append("path")
        //Instead of using data() to bind each value in our dataset array to a different element,
        // we use datum(), the method for binding a single data value to a single element.
        .datum(data)
        .attr("class", "line")
        .attr('fill', 'none')
        .attr('stroke', "red")
        .attr("d", line);

    // Add main title
    svg.append("text")
        .text("Global Plastic Production")
        .attr("x", (marginLeft + (canvasWidth - marginRight - marginLeft) / 2))
        .attr("y", canvasHeight * 0.05)
        .attr("font-size", "25")
        .style("text-anchor", "middle")

    // Add X axis title
    svg.append("text")
        .text("Years")
        .attr("x", (marginLeft + (canvasWidth - marginRight - marginLeft) / 2))
        .attr("y", canvasHeight * 0.95)
        .attr("font-size", "20")
        .style("text-anchor", "middle")

    // Add Y axis title
    svg.append("text")
        .text("Plastic Amount (Ton)")
        .attr("font-size", "20")
        .attr("transform",
            `translate(${canvasWidth * 0.03}, ${marginTop + (canvasHeight - marginBot - marginTop) / 2}) 
            rotate(-90)`)
        .style("text-anchor", "middle")


}

main();