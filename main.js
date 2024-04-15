const canvas = document.getElementById('canvas1');
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// globals
const mid = (innerWidth) / 2;
const moon = 'rgba(246, 241, 213, 1)';
const sun = 'rgba(255, 255, 0, 1)';
var isday = true;
// time is innerHeight - sun/moon ypos
var time = 0;
var factor = Math.sqrt(time / innerHeight);
const nightSky = [0, 0, 50, 0.918];
const daySky = [100, 150, 255, 0.8];
const midSky = [30, 45, 80, 0.85];

// visual vertical shift
const vvShift = 60;

var isPaused = false;

class Sky {
    draw(){
        let colour = [];
        factor = Math.sqrt(time / innerHeight);
        factor = Math.max(0, factor);
        if (isNaN(factor))
        {
            factor = 0;
        }
        
        if (isday) {
            colour = interpolateColors(midSky, daySky, factor);
        } 
        else {
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
        c.arc(this.x, this.y + vvShift, this.radius, 0, Math.PI * 2, false);
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
        this.x+=this.dx
        var root = Math.sqrt(mid**2 - (mid - this.x )**2);
        if ((this.y > innerHeight) || (isNaN(root))){
            this.x = 0;
            isday = !isday;
            this.y = innerHeight
        }
        else{
            this.y= innerHeight - root;
        }
    }
}
class MoonDetail {
    draw(moonposx, moonposy)
    {
        if(!isday){

            let circleRadius = [25, 10, 15]
            let offX = [-20, 15, 15]
            let offY = [7, -20, 15]
            let circleColors = ['rgba(128, 128, 128, 0.97)', 'rgba(128, 128, 128, 0.95)', 'rgba(128, 128, 128, 0.98)'];
    
            for (let i = 0; i < 3; i++) {
                const x = moonposx + offX[i]; // Adjust x coordinate based on the offset
                const y = moonposy + offY[i]; // Circles will be on the same y coordinate as the moon
                c.beginPath();
                c.arc(x, y + vvShift, circleRadius[i], 0, Math.PI * 2, false);
                c.fillStyle = circleColors[i];
                c.fill();
                c.closePath();
            }
        }
    }
}

class Stars {
    constructor(numStars){
        this.numStars = numStars;
        this.xposes = [];
        this.yposes = [];
        this.radiuses = [];
        this.colors = [];
        for (let i = 0; i < this.numStars; i++){
            let chance = Math.random();
            var size = 2;
            if (chance >= 0.8 && chance <= 0.9) {
                size = 4;
            } else if (chance > 0.99 && chance <= 1) {
                size = 6;
            }
            this.radiuses[i] = size;
            this.xposes[i] = 10+Math.random()*(innerWidth-20)
            this.yposes[i] = 5+Math.random()*(innerHeight-10)
        }
    }
    
    draw(){
        if (!isday){
            for (let i = 0; i < this.numStars; i++){
                c.beginPath();
                c.arc(this.xposes[i], this.yposes[i], this.radiuses[i], 0, Math.PI * 2, false);
                let a = ((this.radiuses[i]/2 +3) * 0.05 + 0.7) * factor;
                c.fillStyle = `rgba(255, 255, 255, ${a})`;
                c.strokeStyle = `rgba(255, 255, 255, ${a})`;
                c.fill();
                c.stroke();
            }
        }
    }
}

var sunMoon = new SunMoon(0, innerHeight, 50, 4);
var sky = new Sky();
var stars = new Stars(150);
var moonDetail = new MoonDetail();

// logic each frame here
function animate(){

    requestAnimationFrame(animate);

    // Clear the canvas on each frame
    c.clearRect(0, 0, innerWidth, innerHeight); 

    // all the shifting draws are controlled by sunMoon pos aka time
    if (!isPaused){
        // update the pos of the sun/moon
        sunMoon.update();
        time = innerHeight - sunMoon.y;
    }
    // all the shifting draws (ORDER MATTERS)
    sky.draw();
    stars.draw();
    sunMoon.draw();
    moonDetail.draw(sunMoon.x, sunMoon.y);
}

// event handling

window.addEventListener('keydown', function(p){
    if (p.key === 'p'){
        isPaused = !isPaused;
    }
});



animate(); // Start the animation loop