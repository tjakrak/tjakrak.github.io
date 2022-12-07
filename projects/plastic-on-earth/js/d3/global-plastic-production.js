// Code Source: https://learning.oreilly.com/library/view/interactive-data-visualization/9781491921296/ch11.html#idm140093188423200
// Code Source: https://d3-graph0-gallery.com/graph0/line_basic.html
// Data Source: https://ourworldindata.org/plastic-pollution

function main() {

    d3.csv("data/global-plastics-production.csv").then(
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

    let isMobile = false; //initiate as false
    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
        isMobile = true;
    }

    // Setting up canvas width and height
    let width = $('#graph1').width();
    let height = isMobile? $('#graph1').height() * 1.7 : $('#graph1').height() * 3;

    // Define all the margins within canvas
    const marginLeft = width * 0.2;
    const marginRight = width * 0.1;
    const marginTop = height * 0.15;
    const marginBot = height * 0.2;

    let element = document.getElementsByTagName("h3");
    let style = window.getComputedStyle(element[0], null).getPropertyValue('font-size');
    let fontSize = parseFloat(style);

    let svg = d3.select("#svg1")
    svg.attr("width", width)
        .attr("height", height)

    let minMaxYear = d3.extent(data, function(d) { return d.Year; })
    // Scale and add X axis
    let xScale = d3.scaleTime()
        .domain([new Date(minMaxYear[0], 0, 1), new Date(minMaxYear[1], 0, 1)])
        .range([ 0, width - marginLeft - marginRight ]);
    let xAxis = svg.append("g")
        .attr("transform", `translate(${marginLeft}, ${height - marginBot})`)
        .call(d3.axisBottom(xScale)) // syntax: d3.axisLeft(scale) - construct an y-axis for the given scale
    
    // Scale and add Y axis
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.Amount; })]) // actual number on data
        .range([height - marginTop - marginBot, 0]); // available dimension on canvas
    let yAxis = svg.append("g")
        .attr("transform", `translate(${marginLeft}, ${marginTop})`)
        .call(d3.axisLeft(yScale)) // syntax: d3.axisLeft(scale) - construct an y-axis for the given scale

    function lineWrapper() {
        // Define line generator
        // The x and y accessors tell the line generator how to decide where to place each point on the line.
        let line = d3.line()
            .x(function(d) { return marginLeft + xScale(new Date(d.Year, 0, 1)); })
            .y(function(d) { return marginTop + yScale(Math.abs(d.Amount)); });

        return line;
    }

    svg.append("path")
        .attr("class", "line")
        .attr('fill', 'none')
        .attr('stroke', "red");


    function pathWrapper(data, line) {
        //Create line
        let path = svg.select(".line")
            .interrupt()
            //Instead of using data() to bind each value in our dataset array to a different element,
            // we use datum(), the method for binding a single data value to a single element.
            .datum(data)
            .attr("d", line);

        const pathLength = path.node().getTotalLength();
        // D3 provides lots of transition options, have a play around here:
        // https://github.com/d3/d3-transition
        const transitionPath = d3
            .transition()
            .ease(d3.easeSin)
            .duration(8000);

        path
            .attr("stroke-dashoffset", pathLength)
            .attr("stroke-dasharray", pathLength)
            .transition(transitionPath)
            .attr("stroke-dashoffset", 0);
    }

    let line = lineWrapper();
    pathWrapper(data, line);

    // Add X axis title
    let xTitle = svg.append("text")
        .text("Years")
        .attr("x", (marginLeft + (width - marginRight - marginLeft) / 2))
        .attr("y", height * 0.95)
        .attr("fill", "white")
        .style("text-anchor", "middle")

    // Add Y axis title
    let yTitle = svg.append("text")
        .text("Plastic Amount (Ton)")
        .attr("transform",
            `translate(${width * 0.03}, ${marginTop + (height - marginBot - marginTop) / 2}) 
            rotate(-90)`)
        .attr("fill", "white")
        .style("text-anchor", "middle")

    if (isMobile) {
        xAxis.selectAll("text") // select all the text element
        .attr("transform", "translate(-10,10)rotate(-45)") // rotate the text
        .attr("font-size", fontSize - 12);

        yAxis.selectAll("text") // select all the text element
        .attr("font-size", fontSize - 12);

        xTitle.selectAll("text")
        .attr("font-size", fontSize - 12);

        yTitle.selectAll("text")
        .attr("font-size", fontSize - 12);
    }

    // Update chart when button is clicked
    d3.select("#button1").on("click", () => {
        // Create new fake data
        let line = lineWrapper();
        pathWrapper(data, line);
    });
}

main();