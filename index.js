const CANVAS_SIZE = 720;
const MARGIN = 50;
const GRID_MIN = -1;
const GRID_MAX = 1;
const STEP = 0.1;
const ISO_VALUE = 1;
const DRAW_CONTOUR = true;
const DRAW_DISTANCE = true;

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  noLoop(); 
}

function draw() {
  background(255);
  drawGrid();
  drawAxes();
  drawPoints();
  if (DRAW_CONTOUR) {
    drawContour(ISO_VALUE);
  }
}

/**
 * Maps a coordinate value (-5 to 5) to pixel position.
 */
function mapCoord(val, axis) {
  if (axis === 'x') {
    return map(val, GRID_MIN, GRID_MAX, MARGIN, width - MARGIN);
  } else {
    return map(val, GRID_MIN, GRID_MAX, height - MARGIN, MARGIN);
  }
}

function drawGrid() {
  stroke(220);
  strokeWeight(1);
  textAlign(CENTER, CENTER);
  textSize(8);
  fill(150);

  // Draw grid lines and labels using the STEP
  for (let i = GRID_MIN; i <= GRID_MAX + 0.001; i += STEP) {
    const xPos = mapCoord(i, 'x');
    const yPos = mapCoord(i, 'y');

    // Vertical lines
    line(xPos, MARGIN, xPos, height - MARGIN);
    // Horizontal lines
    line(MARGIN, yPos, width - MARGIN, yPos);

    const zeroX = mapCoord(0, 'x');
    const zeroY = mapCoord(0, 'y');

    noStroke();
    // Label every other point or if it's near an integer to reduce clutter
    if (Math.abs(i) > 0.001) {
        text(i.toFixed(1), xPos, zeroY + 15);
        text(i.toFixed(1), zeroX - 20, yPos);
    }
    stroke(220);
  }
}

function drawContour(target) {
  let points = [];
  const epsilon = 0.01; // For float comparison
  
  for (let x = GRID_MIN; x <= GRID_MAX + 0.001; x += STEP) {
    for (let y = GRID_MIN; y <= GRID_MAX + 0.001; y += STEP) {
      const val = Math.sqrt(x * x + y * y);
      if (Math.abs(val - target) < epsilon) {
        points.push({ x, y, angle: Math.atan2(y, x) });
      }
    }
  }

  points.sort((a, b) => a.angle - b.angle);

  if (points.length > 1) {
    stroke(255, 0, 0);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let p of points) {
      vertex(mapCoord(p.x, 'x'), mapCoord(p.y, 'y'));
    }
    endShape(CLOSE);
  }
}

function drawPoints() {
  noStroke();
  for (let x = GRID_MIN; x <= GRID_MAX + 0.001; x += STEP) {
    for (let y = GRID_MIN; y <= GRID_MAX + 0.001; y += STEP) {
      if (Math.abs(x) < 0.001 && Math.abs(y) < 0.001) continue;

      const xPos = mapCoord(x, 'x');
      const yPos = mapCoord(y, 'y');
      
      const val = Math.sqrt(x * x + y * y);
      
      fill(0);
      ellipse(xPos, yPos, 3, 3);

      if (DRAW_DISTANCE) {
        fill(100);
        textSize(7);
        textAlign(LEFT, BOTTOM);
        text(val.toFixed(1), xPos + 3, yPos - 3);
      }
    }
  }
}

function drawAxes() {
  stroke(0);
  strokeWeight(2);
  
  const zeroX = mapCoord(0, 'x');
  const zeroY = mapCoord(0, 'y');

  // X axis
  line(MARGIN, zeroY, width - MARGIN, zeroY);
  // Y axis
  line(zeroX, height - MARGIN, zeroX, MARGIN);
  
  // X Arrow
  line(width - MARGIN, zeroY, width - MARGIN - 10, zeroY - 5);
  line(width - MARGIN, zeroY, width - MARGIN - 10, zeroY + 5);
  
  // Y Arrow
  line(zeroX, MARGIN, zeroX - 5, MARGIN + 10);
  line(zeroX, MARGIN, zeroX + 5, MARGIN + 10);

  // Label Origin
  noStroke();
  fill(0);
  text("0", zeroX - 10, zeroY + 10);
}
