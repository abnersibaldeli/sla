const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let car = { x: 400, y: 300, angle: 0, speed: 0 };
let keys = {};
let smokeParticles = []; // Array to hold smoke particles

// Load car image (replace with your own image path)
const carImage = new Image();
carImage.src = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpt.pngtree.com%2Ffreepng%2Fa-red-sports-car-seen-from-above-parked-on-street_15908850.html&psig=AOvVaw3TOyySMBQM74cnwEw5R4X2&ust=1763059030081000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCPCfr-2g7ZADFQAAAAAdAAAAABAE'; // Placeholder: Use a top-down car PNG (e.g., 30x20 pixels or similar)

// Smoke particle class
class SmokeParticle {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.life = 1; // Starts at 1, fades to 0
        this.speed = Math.random() * 0.5 + 0.2; // Random speed
    }
    
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life -= 0.02; // Fade out
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.life; // Transparency based on life
        ctx.fillStyle = 'gray';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI); // Small circle for smoke
        ctx.fill();
        ctx.restore();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw track (simple circle for drifting)
    ctx.beginPath();
    ctx.arc(400, 300, 200, 0, 2 * Math.PI);
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 10;
    ctx.stroke();
    
    // Draw smoke particles
    smokeParticles.forEach(particle => particle.draw());
    
    // Draw car (using image)
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    ctx.drawImage(carImage, -15, -10, 30, 20); // Adjust size as needed
    ctx.restore();
}

function update() {
    if (keys.ArrowUp) car.speed += 0.1;
    if (keys.ArrowDown) car.speed -= 0.05;
    if (keys.ArrowLeft) car.angle -= 0.05;
    if (keys.ArrowRight) car.angle += 0.05;
    
    // Drift mechanics (simplified)
    if (keys.ArrowLeft || keys.ArrowRight) {
        car.speed *= 0.98; // Slow down during drift
        
        // Emit smoke from rear tires when drifting
        const tireOffset = 10; // Distance from car center to tires
        const leftTireX = car.x + Math.cos(car.angle - Math.PI/2) * tireOffset;
        const leftTireY = car.y + Math.sin(car.angle - Math.PI/2) * tireOffset;
        const rightTireX = car.x + Math.cos(car.angle + Math.PI/2) * tireOffset;
        const rightTireY = car.y + Math.sin(car.angle + Math.PI/2) * tireOffset;
        
        smokeParticles.push(new SmokeParticle(leftTireX, leftTireY, car.angle + Math.PI)); // Smoke backwards
        smokeParticles.push(new SmokeParticle(rightTireX, rightTireY, car.angle + Math.PI));
    }
    
    car.x += Math.cos(car.angle) * car.speed;
    car.y += Math.sin(car.angle) * car.speed;
    car.speed *= 0.95; // Friction
    
    // Update and remove dead smoke particles
    smokeParticles = smokeParticles.filter(particle => {
        particle.update();
        return particle.life > 0;
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

gameLoop();