// code source: https://d3-graph-gallery.com/graph/barplot_basic.html
// data source: https://ourworldindata.org/plastic-pollution
// data source: https://www.mckinsey.com/~/media/mckinsey/industries/chemicals/our%20insights/climate%20impact%20of%20plastics/climate-impact-of-plastics-v2.pdf

function main() {

    d3.csv("../data/plastic-production-by-sector.csv").then(
        // on resolved - can use "(data) =>" or "function(data)"
        (data) => {
            data.forEach(function(d) {
                d.Amount = +d["Primary plastic production (million tonnes)"];
            });
            barChart(data);
        },
        // on rejected
        () => {
            console.log("data is missing")
        }
    );
}

function barChart(data) {

    let dataX = data.map(d => d.Amount);
    let dataY = data.map(d => d.Entity);

    // Setting up canvas width and height
    let svg = d3.select("#svg2")
    let div = d3.select("#tooltip2")
        .style("opacity", 0);

    let canvasWidth = 600;
    let canvasHeight = 600;

    svg.attr("width", canvasWidth)
        .attr("height", canvasHeight);

    // Defining all the margins for the bar chart from the canvas
    const marginLeft = canvasWidth * 0.3;
    const marginRight = canvasWidth * 0.1;
    const marginTop = canvasHeight * 0.1;
    const marginBot = canvasHeight * 0.2;

    // Add X AXIS
    let maxDataX = d3.max(dataX)
    let x = d3.scaleLinear()
        .domain([0, maxDataX]) // max and min data on y axis
        .range([0, Math.abs(canvasHeight - marginTop - marginBot)]); // canvas size
    svg.append("g")
        .attr("transform", `translate(${marginLeft}, ${canvasHeight - marginBot})`)
        .call(d3.axisBottom(x)) // syntax: d3.axisBottom(scale) - construct an y-axis for the given scale and data
        .selectAll("text") // select all the text element
        .attr("transform", "translate(-10,0)rotate(-45)") // rotate the text
        .style("text-anchor", "end"); // modify text alignment

    // Add Y AXIS
    // Create the distance and padding from one bar to another in the y axis within the canvas size
    // scaleBand is really useful for ordinal data
    let y = d3.scaleBand()
        .domain(dataY)  // data array
        .range([0, Math.abs(canvasWidth - marginRight - marginLeft)]) // canvas size
        .padding(0.2);  // padding between each data
    svg.append("g")
        .attr("transform", `translate(${marginLeft}, ${marginBot})`)
        .call(d3.axisLeft(y)); // syntax: d3.axisLeft(scale) - construct an y-axis for the given scale

    // Function to show tooltip
    let showToolTip = function(event, d) {
        div.transition()
            .duration(200)
            .style("opacity", .9);

        div.html(`<p>${d.Amount}</p>`) // set the inner HTML on all the selected elements.
            .style("left", event.clientX + "px")
            .style("top", event.clientY + "px");
    };

    // Function to move the tooltip
    let moveTooltip = function(event, d) {
        div.style("left", (event.clientX+10) + "px")
            .style("top", (event.clientY+10) + "px")
    }

    // Function to hide the tooltip
    let hideToolTip = function(event, d) {
        div.transition()
            .duration(500)
            .style("opacity", 0);
    }

    svg.selectAll("bar")
        .data(data)
        .join("rect")
        .attr("x", d => marginLeft) // x coordinate of the rectangle
        .attr("y", d => marginBot + y(d.Entity)) // y coordinate of the rectangle
        .attr("width", function(d) { return marginLeft + x(d.Amount) }) // used to find the width of each band
        .attr("height", y.bandwidth())
        .on('mouseover', function(event, d) { // Add mouseover function
            svg.selectAll('rect')
                .attr('fill', function(g) {
                    // console.log(g); // Iterating from the map data
                    // console.log(d); // This is the current rectangle data where the mouse is hovering at
                    return (g.Entity === d.Entity) ? "red" : "black"
                })
            showToolTip(event, d)
        })
        .on("mousemove", moveTooltip)
        .on('mouseout', function(event, d) {
            svg.selectAll('rect').attr('fill', "black")
            hideToolTip(event, d);
        });

    // Add X axis title
    svg.append("text")
        .text("Amount (million tonnes)")
        .attr("x", (marginLeft + (canvasWidth - marginRight - marginLeft) / 2))
        .attr("y", canvasHeight * 0.95)
        .attr("font-size", "20")
        .style("text-anchor", "middle")

    // Add Y axis title
    svg.append("text")
        .text("Sector")
        .attr("font-size", "20")
        .attr("transform",
            `translate(${canvasWidth * 0.05}, ${marginTop + (canvasHeight - marginBot - marginTop) / 2}) 
            rotate(-90)`)
        .style("text-anchor", "middle")

}

main();