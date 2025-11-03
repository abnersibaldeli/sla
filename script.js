const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let car = { x: 400, y: 300, angle: 0, speed: 0 };
let keys = {};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw track (simple circle for drifting)
    ctx.beginPath();
    ctx.arc(400, 300, 200, 0, 2 * Math.PI);
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 10;
    ctx.stroke();
    
    // Draw car
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    ctx.fillStyle = 'red';
    ctx.fillRect(-15, -10, 30, 20);
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
    }
    
    car.x += Math.cos(car.angle) * car.speed;
    car.y += Math.sin(car.angle) * car.speed;
    car.speed *= 0.95; // Friction
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

gameLoop();