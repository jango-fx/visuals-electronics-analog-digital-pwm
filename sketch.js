let sliderTime;
let sliderBits;

let checkDigi;
let checkPWM;

let analBuffer = [];
let digiBuffer = [];

function setup() {
  let params = getURLParams();
  console.log(params);

  let container = createDiv();

  sliderBits = createSlider(1, 100, 10, 1);
  sliderBits.parent(container);
  sliderBits.elt.name = "vertical";
  sliderBits.value(params.bits == undefined ? 4 : params.bits);

  let canvas = createCanvas(400, 400);
  canvas.parent(container);

  sliderTime = createSlider(1, 400, 55, 1);
  sliderTime.parent(container);
  sliderTime.elt.name = "horizontal";
  sliderTime.value(params.time == undefined ? 1 : params.time);

  checkDigi = createCheckbox(" digital Signal", false);
  checkDigi.changed(toggleDigi);
  checkDigi.parent(container);
  checkDigi.checked(params.digital == true ? true : false);

  checkPWM = createCheckbox(" PWM Signal", false);
  checkPWM.changed(togglePWM);
  checkPWM.parent(container);
  checkPWM.checked(params.pwm == true ? true : false);
}

function signal(x) {
  noiseDetail(2, 0.5);
  let n;

  if (mouseX > 0 && mouseY > 0 && mouseX < 400 && mouseY < 400) 
  n = noise((x + frameCount * 1.0) * 0.008 ) * 550 + (mouseY-200);
  else
  n = noise((x + frameCount * 1.0) * 0.008) * 550;


  return n;
}

function draw() {
  background(255);

  if (frameCount % 60 && false) {
    console.log(sliderBits.value());
    console.log(sliderTime.value());
  }

  if (checkDigi.checked()) drawDigital();
  if (checkPWM.checked()) pwmSignal();
  analogSignal();
}

// DRAW ANALOG SIGNAL
function analogSignal() {
  noFill();
  strokeWeight(2);
  stroke(255, 0, 255);
  beginShape();
  analBuffer = [];
  for (let x = 0; x < 400; x++) {
    var y = signal(x);
    analBuffer.push(y);
    curveVertex(x, y);
  }
  endShape();
}

function adc(y) {
  y = map(y, 0, 400, 0, sliderBits.value());
  y = round(y);
  y = map(y, 0, sliderBits.value(), 0, 400);
  return y;
}

function drawDigital() {
  noFill();
  strokeWeight(3);
  stroke(100, 200, 255);
  beginShape();
  let stepSize = 400 / sliderTime.value();
  console.log(sliderTime.value());
  console.log(stepSize);
  for (let x = 0; x < 400; x += sliderTime.value()) {
    let y = adc(analBuffer[x]);
    // fill('red');
    // circle(x, y, 5);
    vertex(x, y);
    vertex(x + sliderTime.value(), y);
  }

  endShape();
}

function drawBuffer() {
  noFill();
  strokeWeight(3);
  stroke(100, 200, 255);
  beginShape();
  for (let x = 0; x < digiBuffer.length; x++) {
    let stepSize = 400 / digiBuffer.length;
    vertex(x * stepSize, digiBuffer[x]);
    vertex(x * stepSize, digiBuffer[x]);
  }
  endShape();
}

// DRAW DIGITAL SIGNAL
function digitalSignal() {
  noFill();
  strokeWeight(3);
  stroke(100, 200, 255);
  beginShape();
  for (let x = 0; x < 400 + sliderTime.value(); x++) {
    var y = signal(x);
    y = map(y, 0, 400, 0, sliderBits.value());
    y = round(y);
    y = map(y, 0, sliderBits.value(), 0, 400);

    if (x % sliderTime.value() == 0) {
      vertex(x - sliderTime.value() * 0.5, y);
      vertex(x + sliderTime.value() * 0.5, y);
    }
  }
  endShape();
}

function pwmSignal() {
  noFill();
  strokeWeight(3);
  stroke(255, 200, 100);
  beginShape();
  for (let x = 0; x < 400 + sliderTime.value(); x++) {
    var y = signal(x);

    var n = map(y, 350, 0, 0, sliderBits.value());
    n = round(n);

    var step = sliderTime.value() / n;

    if (x % sliderTime.value() == 0) {
      vertex(x, 400);

      for (let i = 0; i < n; i++) {
        vertex(x + i * step + step * 0.5, 400);
        vertex(x + i * step + step * 0.5, 0);
        vertex(x + i * step + step * 1.0, 0);
        vertex(x + i * step + step * 1.0, 400);
      }
    }
  }
  endShape();
}

function toggleDigi() {
  if (this.checked()) {
    sliderTime.value(1);
    checkPWM.checked(false);
  }
}

function togglePWM() {
  if (this.checked()) {
    sliderTime.value(55);
    sliderBits.value(10);
    checkDigi.checked(false);
  }
}
