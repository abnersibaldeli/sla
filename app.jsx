import React, { useEffect, useRef, useState } from 'react';

const App = () => {
    const canvasRef = useRef(null);
    const [car, setCar] = useState({ x: 400, y: 300, angle: 0, speed: 0 });
    const [keys, setKeys] = useState({});

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const draw = () => {
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
        };

        const update = () => {
            let newCar = { ...car };
            if (keys.ArrowUp) newCar.speed += 0.1;
            if (keys.ArrowDown) newCar.speed -= 0.05;
            if (keys.ArrowLeft) newCar.angle -= 0.05;
            if (keys.ArrowRight) newCar.angle += 0.05;
            
            // Drift mechanics (simplified)
            if (keys.ArrowLeft || keys.ArrowRight) {
                newCar.speed *= 0.98; // Slow down during drift
            }
            
            newCar.x += Math.cos(newCar.angle) * newCar.speed;
            newCar.y += Math.sin(newCar.angle) * newCar.speed;
            newCar.speed *= 0.95; // Friction
            
            setCar(newCar);
        };

        const gameLoop = () => {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        };
        
        gameLoop();
    }, [car, keys]);

    useEffect(() => {
        const handleKeyDown = (e) => setKeys(prev => ({ ...prev, [e.key]: true }));
        const handleKeyUp = (e) => setKeys(prev => ({ ...prev, [e.key]: false }));
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (
        <div className="game-container">
            <h1>Drift Car Game</h1>
            <canvas ref={canvasRef} width={800} height={600}></canvas>
            <p>Use arrow keys to drive and drift!</p>
        </div>
    );
};

export default App;