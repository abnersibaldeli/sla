import React, { useState } from "react";

const App = () => {
  const [numberToGuess, setNumberToGuess] = useState(Math.floor(Math.random() * 100) + 1);
  const [userGuess, setUserGuess] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleGuess = () => {
    setAttempts(attempts + 1);
    if (parseInt(userGuess) === numberToGuess) {
      setMessage(`Você acertou! O número era ${numberToGuess}.`);
      setGameOver(true);
    } else if (parseInt(userGuess) < numberToGuess) {
      setMessage("Tente um número maior.");
    } else {
      setMessage("Tente um número menor.");
    }
    setUserGuess("");
  };

  const handleRestart = () => {
    setNumberToGuess(Math.floor(Math.random() * 100) + 1);
    setUserGuess("");
    setMessage("");
    setAttempts(0);
    setGameOver(false);
  };

  return (
    <div className="container">
      <h1>Jogo de Adivinhação</h1>
      <p>Tente adivinhar um número entre 1 e 100!</p>

      <div className="input-group">
        <input
          type="number"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          disabled={gameOver}
          placeholder="Digite seu palpite"
        />
        <button onClick={handleGuess} disabled={gameOver}>
          Adivinhar
        </button>
      </div>

      {message && (
        <p className={gameOver ? "success" : "error"}>
          {message} {gameOver && `Você tentou ${attempts} vezes.`}
        </p>
      )}

      {gameOver && (
        <button className="restart-btn" onClick={handleRestart}>
          Reiniciar Jogo
        </button>
      )}
    </div>
  );
};

export default App;
