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
 * The scalar field function.
 */
function f(x, y) {
  return Math.sqrt(x * x + y * y);
}

/**
 * Maps a coordinate value to pixel position.
 */
function mapCoord(val, axis) {
  if (axis === 'x') {
    return map(val, GRID_MIN, GRID_MAX, MARGIN, width - MARGIN);
  } else {
    return map(val, GRID_MIN, GRID_MAX, height - MARGIN, MARGIN);
  }
}

/**
 * Linear interpolation to find the exact crossing point on an edge.
 */
function lerpCoord(v1, v2, target, p1, p2) {
  if (Math.abs(v1 - v2) < 0.0001) return (p1 + p2) / 2;
  const t = (target - v1) / (v2 - v1);
  return p1 + t * (p2 - p1);
}

function drawGrid() {
  stroke(220);
  strokeWeight(1);
  textAlign(CENTER, CENTER);
  textSize(8);
  fill(150);

  for (let i = GRID_MIN; i <= GRID_MAX + 0.001; i += STEP) {
    const xPos = mapCoord(i, 'x');
    const yPos = mapCoord(i, 'y');

    line(xPos, MARGIN, xPos, height - MARGIN);
    line(MARGIN, yPos, width - MARGIN, yPos);

    const zeroX = mapCoord(0, 'x');
    const zeroY = mapCoord(0, 'y');

    noStroke();
    if (Math.abs(i) > 0.001) {
        text(i.toFixed(1), xPos, zeroY + 15);
        text(i.toFixed(1), zeroX - 20, yPos);
    }
    stroke(220);
  }
}

function drawContour(target) {
  stroke(255, 0, 0);
  strokeWeight(2);

  for (let x = GRID_MIN; x < GRID_MAX - 0.001; x += STEP) {
    for (let y = GRID_MIN; y < GRID_MAX - 0.001; y += STEP) {
      const x1 = x, x2 = x + STEP;
      const y1 = y, y2 = y + STEP;

      // Values at the four corners
      const v1 = f(x1, y1); // Top-left
      const v2 = f(x2, y1); // Top-right
      const v3 = f(x2, y2); // Bottom-right
      const v4 = f(x1, y2); // Bottom-left

      // Binary state (1 if >= target)
      let state = 0;
      if (v1 >= target) state += 8;
      if (v2 >= target) state += 4;
      if (v3 >= target) state += 2;
      if (v4 >= target) state += 1;

      // Calculate crossing points using lerp
      const top = { x: lerpCoord(v1, v2, target, x1, x2), y: y1 };
      const right = { x: x2, y: lerpCoord(v2, v3, target, y1, y2) };
      const bottom = { x: lerpCoord(v4, v3, target, x1, x2), y: y2 };
      const left = { x: x1, y: lerpCoord(v1, v4, target, y1, y2) };

      const drawLine = (p1, p2) => {
        line(mapCoord(p1.x, 'x'), mapCoord(p1.y, 'y'), mapCoord(p2.x, 'x'), mapCoord(p2.y, 'y'));
      };

      // Marching Squares Lookup Table
      switch (state) {
        case 1: case 14: drawLine(left, bottom); break;
        case 2: case 13: drawLine(bottom, right); break;
        case 3: case 12: drawLine(left, right); break;
        case 4: case 11: drawLine(top, right); break;
        case 5: drawLine(top, left); drawLine(bottom, right); break;
        case 6: case 9: drawLine(top, bottom); break;
        case 7: case 8: drawLine(top, left); break;
        case 10: drawLine(top, right); drawLine(bottom, left); break;
      }
    }
  }
}

function drawPoints() {
  noStroke();
  for (let x = GRID_MIN; x <= GRID_MAX + 0.001; x += STEP) {
    for (let y = GRID_MIN; y <= GRID_MAX + 0.001; y += STEP) {
      if (Math.abs(x) < 0.001 && Math.abs(y) < 0.001) continue;

      const xPos = mapCoord(x, 'x');
      const yPos = mapCoord(y, 'y');
      
      const val = f(x, y);
      
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

  line(MARGIN, zeroY, width - MARGIN, zeroY);
  line(zeroX, height - MARGIN, zeroX, MARGIN);
  
  line(width - MARGIN, zeroY, width - MARGIN - 10, zeroY - 5);
  line(width - MARGIN, zeroY, width - MARGIN - 10, zeroY + 5);
  
  line(zeroX, MARGIN, zeroX - 5, MARGIN + 10);
  line(zeroX, MARGIN, zeroX + 5, MARGIN + 10);

  noStroke();
  fill(0);
  text("0", zeroX - 10, zeroY + 10);
}

