import React, { useState, useEffect, useRef } from 'react';
import './styles.css'; // Importando o arquivo de estilo

const PlatformGame = () => {
  // Estados do jogo
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 300 });
  const [playerVelocity, setPlayerVelocity] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Referências
  const gameRef = useRef(null);
  const animationRef = useRef(null);
  const platformsRef = useRef([
    { x: 0, y: 400, width: 400, height: 20 },
    { x: 450, y: 350, width: 150, height: 20 },
    { x: 650, y: 300, width: 150, height: 20 },
    { x: 850, y: 250, width: 150, height: 20 },
    { x: 1050, y: 200, width: 150, height: 20 }
  ]);

  // Constantes do jogo
  const GRAVITY = 0.5;
  const JUMP_FORCE = -12;
  const PLAYER_SIZE = 40;
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 500;

  // Detectar dispositivo
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Iniciar jogo
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setPlayerPosition({ x: 50, y: 300 });
    setPlayerVelocity({ x: 0, y: 0 });
    setIsJumping(false);
    
    // Iniciar loop do jogo
    animationRef.current = requestAnimationFrame(gameLoop);
  };

  // Controles de teclado
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isJumping) {
        jump();
      }
      if (e.code === 'ArrowRight') {
        setPlayerVelocity(prev => ({ ...prev, x: 5 }));
      }
      if (e.code === 'ArrowLeft') {
        setPlayerVelocity(prev => ({ ...prev, x: -5 }));
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
        setPlayerVelocity(prev => ({ ...prev, x: 0 }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver, isJumping]);

  // Pular
  const jump = () => {
    if (!isJumping) {
      setPlayerVelocity(prev => ({ ...prev, y: JUMP_FORCE }));
      setIsJumping(true);
    }
  };

  // Mover para direita
  const moveRight = () => {
    setPlayerVelocity(prev => ({ ...prev, x: 5 }));
  };

  // Mover para esquerda
  const moveLeft = () => {
    setPlayerVelocity(prev => ({ ...prev, x: -5 }));
  };

  // Parar movimento
  const stopMovement = () => {
    setPlayerVelocity(prev => ({ ...prev, x: 0 }));
  };

  // Loop principal do jogo
  const gameLoop = () => {
    if (!gameStarted || gameOver) return;

    // Atualizar posição
    setPlayerPosition(prev => ({
      x: Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, prev.x + playerVelocity.x)),
      y: prev.y + playerVelocity.y
    }));

    // Aplicar gravidade
    setPlayerVelocity(prev => ({ ...prev, y: prev.y + GRAVITY }));

    // Verificar colisão com plataformas
    const onPlatform = platformsRef.current.some(platform => {
      return (
        playerPosition.x + PLAYER_SIZE > platform.x &&
        playerPosition.x < platform.x + platform.width &&
        playerPosition.y + PLAYER_SIZE >= platform.y &&
        playerPosition.y + PLAYER_SIZE <= platform.y + 10 &&
        playerVelocity.y > 0
      );
    });

    if (onPlatform) {
      setPlayerVelocity(prev => ({ ...prev, y: 0 }));
      setPlayerPosition(prev => ({ ...prev, y: platformsRef.current.find(p => 
        prev.x + PLAYER_SIZE > p.x &&
        prev.x < p.x + p.width &&
        prev.y + PLAYER_SIZE >= p.y &&
        prev.y + PLAYER_SIZE <= p.y + 10
      )?.y! - PLAYER_SIZE || prev.y }));
      setIsJumping(false);
    }

    // Verificar se caiu
    if (playerPosition.y > GAME_HEIGHT) {
      setGameOver(true);
      cancelAnimationFrame(animationRef.current);
      return;
    }

    // Atualizar pontuação
    setScore(prev => prev + 1);

    // Continuar loop
    animationRef.current = requestAnimationFrame(gameLoop);
  };

  // Limpar animação ao desmontar
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="game-container">
      <h1 className="title">Jogo de Plataforma</h1>
      
      {/* Área do jogo */}
      <div 
        ref={gameRef}
        className="game-area"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Personagem */}
        {gameStarted && !gameOver && (
          <div 
            className="player"
            style={{
              width: PLAYER_SIZE,
              height: PLAYER_SIZE,
              left: playerPosition.x,
              top: playerPosition.y
            }}
          />
        )}

        {/* Plataformas */}
        {gameStarted && platformsRef.current.map((platform, index) => (
          <div
            key={index}
            className="platform"
            style={{
              left: platform.x,
              top: platform.y,
              width: platform.width,
              height: platform.height
            }}
          />
        ))}

        {/* Tela inicial */}
        {!gameStarted && (
          <div className="overlay">
            <div className="text-center">
              <h2 className="subtitle">Jogo de Plataforma</h2>
              <p className="instructions">Use as setas para mover e espaço para pular</p>
              <button 
                onClick={startGame}
                className="start-button"
              >
                Iniciar Jogo
              </button>
            </div>
          </div>
        )}

        {/* Game Over */}
        {gameOver && (
          <div className="overlay">
            <div className="text-center">
              <h2 className="game-over">Game Over!</h2>
              <p className="score">Pontuação: {score}</p>
              <button 
                onClick={startGame}
                className="start-button"
              >
                Jogar Novamente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controles mobile */}
      {isMobile && gameStarted && !gameOver && (
        <div className="mobile-controls">
          <div className="control-buttons">
            <button
              onTouchStart={moveLeft}
              onTouchEnd={stopMovement}
              className="control-button"
            >
              ←
            </button>
            <button
              onTouchStart={moveRight}
              onTouchEnd={stopMovement}
              className="control-button"
            >
              →
            </button>
          </div>
          <button
            onTouchStart={jump}
            className="jump-button"
          >
            PULAR
          </button>
        </div>
      )}

      {/* Pontuação */}
      {gameStarted && !gameOver && (
        <div className="score-display">
          <p className="score-text">Pontuação: {score}</p>
        </div>
      )}

      {/* Instruções */}
      {!isMobile && (
        <div className="controls-instructions">
          <p>Controles: ← → para mover, Espaço para pular
