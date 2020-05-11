const order = 8;
let N;
let total;
let path = [];
let counter = 0;
let slider;


function setup() {
    createCanvas(512,512);
    // Play with this
    colorMode(HSB, 360, 255, 255);

    N = int(pow(2, order));
    total = N * N;
    let len = width / N;

    slider = createSlider(1, 50*order, 1, 1);
    slider.position(10, 512+10);
    slider.style('width', '512px');
    

    for(let i = 0; i < total; i++) {
        path[i] = hilbert(i); // get the hilbert index
        path[i].mult(len); // scale appropriately
        path[i].add(len / 2, len /2); // push into quadrant
    }
  
}

function draw() {
    background(0);
    stroke(255);
    strokeWeight(1);
    noFill();
    for(let i = 1; i < counter; i++) {
        // modulate hue according to path completion
        let h = map(i, 0, path.length, 0, 360);
        stroke(h, 255, 255);
        line(path[i].x, path[i].y, path[i-1].x, path[i-1].y);
    }

    counter += slider.value();
    if(counter >= path.length) { counter = 0; }
}

function hilbert(i) {
    const POINTS = [
        new p5.Vector(0, 0),
        new p5.Vector(0, 1),
        new p5.Vector(1, 1),
        new p5.Vector(1, 0)
    ];
    let index = i & 3; // bitwise isolation of LSB
    let v = POINTS[index];

    for(let j = 1; j < order; j++) {
        i = i >>> 2; // get the next layer
        index = i & 3;
        let len = pow(2, j);
        if(index == 0) {
            let temp = v.x;
            v.x = v.y;
            v.y = temp; // rotate aptly
        } else if(index == 1) {
            v.y += len; // push aptly
        } else if(index == 2) {
            v.x += len; 
            v.y += len; 
        } else if (index == 3) {
            let temp = len -1 - v.x;
            v.x = len - 1 - v.y;
            v.y = temp;
            v.x += len;
        }
    }
    return v;
}