const canvas = document.getElementById('canvas1');
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// globals
const mid = (innerWidth) / 2;
const moon = 'rgba(255, 255, 255, 0.8)';
const sun = 'rgba(255, 255, 0, 1)';
var isday = true;
// time is innerHeight - sun/moon ypos
var time = 0;

const nightSky = [0, 0, 50, 0.918];
const daySky = [100, 150, 255, 0.8];
const midSky = [30, 45, 80, 0.85];

class Sky {
    draw(){
        let colour = [];
        let factor = time / innerHeight;
        factor = Math.max(0, factor);
        
        if (isday) {
            colour = interpolateColors(midSky, daySky, factor);
        } 
        else {
            factor = Math.sqrt(factor);
            colour = interpolateColors(midSky, nightSky, factor);
        }
        
        c.fillStyle = `rgba(${colour.join(',')})`;
        c.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function interpolateColors(color1, color2, factor) {
    return color1.map((channel, index) => {
        return channel + (color2[index] - channel) * factor;
    });
}


class SunMoon {
    constructor(x, y, radius, dx) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
    }

    draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        if (!isday){
            c.strokeStyle = moon;
            c.fillStyle = moon;
        }
        else {
            c.strokeStyle = sun;
            c.fillStyle = sun;
        }
        c.fill();
        c.stroke();
    }
    // x^2 + y^2 = 1
    // y = (+-)sqrt 1 - x^2
    // in this case we want the positive arc
    update(){
        if (this.y + this.radius >= innerHeight) {
            this.x = 0;
        }
        this.x+=this.dx
        var root = Math.sqrt(mid**2 - (mid - this.x )**2);
        if (isNaN(root))
        {
            root = -innerHeight;
            isday = !isday;
        }
        this.y= innerHeight - root;
    }
}
var sunMoon = new SunMoon(0, innerHeight, 50, 4);
var sky = new Sky();

function animate(){

    requestAnimationFrame(animate);

    // Clear the canvas on each frame
    c.clearRect(0, 0, innerWidth, innerHeight); 
    // update the pos of the sun/moon
    sunMoon.update();
    time = innerHeight - sunMoon.y;
    // all draws in order
    sky.draw();
    sunMoon.draw();
}

animate(); // Start the animation loop