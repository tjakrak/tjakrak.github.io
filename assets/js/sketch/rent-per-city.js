// preload table data
function preload() {
    data = loadTable(
      'https://raw.githubusercontent.com/tjakrak/CS-560_dataset/main/avg_rent_per_city.csv',
      'csv',
      'header');
  }
  
  function setup() {
    var canvas = createCanvas(400, 400);
    canvas.parent('canvas');
    noLoop();
  }
  
  function draw() {
    background(220);
    fill(0);
    
    // Title of the chart
    push();
    textSize(20)
    textAlign(CENTER);
    text('Avg Rent per City', width * .5, height * .075,);
    pop();
    
    // Function to draw bar graph
    barGraph(data.getColumn(1), data.getColumn(2));
  }
  
  function barGraph(xData, yData) {
    // Determine left, right and top margin
    let lMargin = width * 0.25;
    let rMargin = width * 0.9;
    let bMargin = height * .75;
    let tMargin = height * .20;
    let padding = 5;
    let barWidth = ((rMargin - lMargin - padding * 
                     (xData.length + 1)) / xData.length);
    let angle = radians(270);
    
    // Get maximum numerical data and round it up
    let maxDataY = max(yData);
    let decimal = Math.pow(10, floor(Math.log10(maxDataY)));
    let maxAxisY = ceil(maxDataY / decimal) * decimal;
    
      // Draw horizontal and vertical line
    line(lMargin, bMargin, width * 0.9, bMargin);
    line(lMargin, bMargin, lMargin, tMargin);
    
    textAlign(RIGHT)
    
    if (xData.length > 0) {
      let ratio = maxAxisY / (tMargin - bMargin);
  
      push();
  
      for (let i = 0; i < xData.length; i++) {
        
        if (i == 0) {
          translate(padding, 0);
        } else {
          translate(barWidth + padding, 0);
        }
  
        // Draw bar graph
        rect(lMargin, bMargin, barWidth, (yData[i]/ratio));
  
        // Write text on the x axis
        push();
        translate(lMargin + (barWidth + padding) / 2, bMargin + 
                  padding);
        rotate(angle);
        if (xData[i].length > 9) {
          text(xData[i].substring(0, 7) + "..", 0, 0);
        } else {
          text(xData[i], 0, 0);          
        }
        pop();
      } 
  
      pop();
    }
    
  
    // Write numerical value on y axis
    let yNum = ceil(maxAxisY / 10);
    let yPadding = (bMargin - tMargin) / 10;
    for (let i = 0; i < 11; i++) {
      text(i * yNum, lMargin - padding, bMargin + 5 - (yPadding * i));
    }
  
    // Add x-axis variable
    textAlign(CENTER);
    textSize(17);
    text("Years", width * 0.5, height * 0.97);
    
    // Add y-axis variable
    translate(width * 0.05, height * 0.5);
    rotate(angle);
    text("Construction Type", 0, 0);
    
  }