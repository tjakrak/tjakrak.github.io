// code source: https://d3-graph-gallery.com/graph/treemap_basic.html
// data source: https://stats.oecd.org/Index.aspx?DataSetCode=PLASTIC_GHG_2#
// data source: https://static-content.springer.com/esm/art%3A10.1038%2Fs41558-019-0459-z/MediaObjects/41558_2019_459_MOESM1_ESM.pdf

function main() {

    d3.csv("data/plastic_production_carbon.csv").then(
        // on resolved - can use "(data) =>" or "function(data)"
        (data) => {
            data.forEach(function(d) {
                d.Production = +d["Production"];
                d.Type = d["Plastic Type"];
            });
            treeMap(data);
        },
        // on rejected
        () => {
            console.log("data is missing");
        }
    );
}

function treeMap(data) {

    // Setting up canvas width and height
    let svg = d3.select("#svg4");
    let div = d3.select("#tooltip4")
        .style("opacity", 0);

    let canvasWidth = 800;
    let canvasHeight = 600;

    svg.attr("width", canvasWidth)
        .attr("height", canvasHeight)
        .attr("transform", "translate(75, 0)");

    // stratify the data: reformatting for d3.js
    const root = d3.stratify()
        .id(function(d) { return d.Type; })   // Name of the entity (column name is name in csv)
        .parentId(function(d) { return d.Category; })   // Name of the parent (column name is parent in csv)
        (data);
    console.log(root);
    root.sum(function(d) { return +d.Production })   // Compute the numeric value for each entity

    // Then d3.treemap computes the position of each element of the hierarchy
    // The coordinates are added to the root object above
    d3.treemap()
        .size([canvasWidth - 150, canvasHeight])
        .padding(4)
        (root)

    // Function to show tooltip
    let showToolTip = function(event, d) {
        div.transition()
            .duration(200)
            .style("opacity", .9);

        div.html(`<b><p>Amount: ${ d.data.Production }</p></b>`) // set the inner HTML on all the selected elements.
            .style("left", d3.pointer(event)[0] + "px")
            .style("top", d3.pointer(event)[1] + "px");
    };

    // Function to move the tooltip
    let moveTooltip = function(event, d) {
        div.style("left", (d3.pointer(event)[0]+30) + "px")
            .style("top", (d3.pointer(event)[1]+30) + "px")
    }

    // Function to hide the tooltip
    let hideToolTip = function(event, d) {
        div.transition()
            .duration(500)
            .style("opacity", 0);
    }

    // use this information to add rectangles:
    svg
        .selectAll("rect")
        .data(root.leaves())
        .join("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", "#69b3a2")
        .on("mouseover", showToolTip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideToolTip);

    // and to add the text labels
    svg
        .selectAll("text")
        .data(root.leaves())
        .join("text")
        .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
        .text(function(d){ return d.data.Type})
        .attr("font-size", "15px")
        .attr("fill", "white")


    // Add annotation
    const annotations = [
        {
          note: {
            label: "Most of the plastics are produced almost entirely using the byproducts of fossil fuel. This particular type of plastic produce 4900 kg CO2e/ ton polymer",
            title: "PUR"
          },
          connector: {
            end: "arrow" // 'dot' also available
          },
          x: 525,
          y: 150,
          dy: 75,
          dx: 190
        }
    ].map(function(d){ d.color = "green"; return d})

    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations)

    svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations)

}

main();