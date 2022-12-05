// code source: https://d3-graph-gallery.com/graph/barplot_basic.html
// data source: https://ourworldindata.org/plastic-pollution
// data source: https://www.mckinsey.com/~/media/mckinsey/industries/chemicals/our%20insights/climate%20impact%20of%20plastics/climate-impact-of-plastics-v2.pdf

function main() {

    d3.csv("data/plastic-production-by-sector.csv").then(
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

    let isMobile = false; //initiate as false
    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
        isMobile = true;
    }

    let dataX = data.map(d => d.Amount);
    let dataY = data.map(d => d.Entity);

    // Setting up canvas width and height
    let svg = d3.select("#svg2")
    let div = d3.select("#tooltip2")
        .style("opacity", 0);

    let canvasWidth = 700;
    let canvasHeight = 600;

    svg.attr("width", canvasWidth)
        .attr("height", canvasHeight);

    // Defining all the margins for the bar chart from the canvas
    const marginLeft = canvasWidth * 0.3;
    const marginRight = canvasWidth * 0.1;
    const marginTop = canvasHeight * 0.2;
    const marginBot = canvasHeight * 0;

    // Add X AXIS
    let maxDataX = d3.max(dataX)
    let x = d3.scaleLinear()
        .domain([0, maxDataX]) // max and min data on y axis
        .range([0, Math.abs(canvasWidth - marginLeft - marginRight)]); // canvas size
    svg.append("g")
        .attr("transform", `translate(${marginLeft}, ${canvasHeight - marginTop})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("~s"))) // syntax: d3.axisBottom(scale) - construct an y-axis for the given scale and data
        .selectAll("text") // select all the text element
        .attr("transform", function(d) {
            if (isMobile) {
                return "translate(-10,0)rotate(-45)"
            } else {
                return
            }
        }) // rotate the text
        .style("text-anchor", function(d) {
            if (isMobile) {
                return "end"
            } else {
                return
            }
        }); // modify text alignment

    // Add Y AXIS
    // Create the distance and padding from one bar to another in the y axis within the canvas size
    // scaleBand is really useful for ordinal data
    let y = d3.scaleBand()
        .domain(dataY)  // data array
        .range([0, Math.abs(canvasHeight - marginTop - marginBot)]) // canvas size
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
        .attr("width", function(d) { return x(d.Amount) }) // used to find the width of each band
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
            `translate(${canvasWidth * 0.05}, ${(canvasHeight - marginBot - marginTop) / 2}) 
            rotate(-90)`)
        .style("text-anchor", "middle")

}

main();