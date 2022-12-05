// Code Source: https://d3-graph-gallery.com/graph/choropleth_basic.html
// Data Source: https://worldpopulationreview.com/country-rankings/plastic-pollution-by-country

function main() {

    Promise.all([
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
        d3.csv("data/plastic_pollution_by_country.csv"),
    ]).then(function(files) {
        let data = new Map();
        // files[0] will contain file1.csv
        // files[1] will contain file2.csv
        files[1].forEach(function(d) {
            data.set(d.country, +d.mpw_oceans_2021)
        })

        let topology = files[0]

        geoMap(topology, data);
    });
}

function geoMap(topology, data) {

    // Setting up canvas width and height
    const width = 700;
    const height = 600;
    const marginTop = 110;
    const marginBot = 100;
    const marginRight = 100;

    let svg = d3.select("#svg3")
    let div = d3.select("#tooltip3")
        .style("opacity", 0);

    svg.attr("width", width)
        .attr("height", height);

    // Map and projection
    const path = d3.geoPath();
    const projection = d3.geoMercator()
        .scale(80)
        .center([0,20])
        .translate([width / 2, height / 2 - marginBot]);

    let dataArr = Array.from( data.values() );
    let minData = d3.min(dataArr);
    let maxData = d3.max(dataArr);
    // Log Scale
    const logScale = d3.scaleLog()
        .domain([1, maxData])
    const colorScale = d3.scaleSequential(
        (d) => d3.interpolate(d3.rgb(153,216,201), d3.rgb(44,162,95))(logScale(d))
    )

    // Function to show tooltip
    let showToolTip = function(event, d) {
        div.transition()
            .duration(200)
            .style("opacity", .9);

        d.total = data.get(d.properties.name) || 0;
        div.html(`<b><p>Country: ${ d.properties.name } </br> MPW: ${ d.total }</p></b>`) // set the inner HTML on all the selected elements.
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

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(topology.features)
        .join("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        //set the color of each country
        .attr("fill", function (d) {
            d.total = data.get(d.properties.name) || 0;
            if (d.total == 0) {
                return "gray"
            }
            return colorScale(d.total);
        })
        .on("mouseover", showToolTip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideToolTip)

    // Add legend
    svg.append("g")
    .attr("class", "legendQuant")
    .attr("transform", `translate(100, ${height-marginBot})`)
    .attr("fill", "white")
    .attr("stroke", "white");

    let legend = d3.legendColor()
        .cells(10)
        .title("Mismanaged Plastic Waste")
        .titleWidth(100)
        .orient("horizontal")
        .shapeWidth(50)
        .scale(colorScale);

    svg.select(".legendQuant")
        .call(legend);

}

main();