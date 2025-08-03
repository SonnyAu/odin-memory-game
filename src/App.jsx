import "./App.css";
import Card from "./components/Card.jsx";
import { supabase } from "./lib/supabaseClient.js";

import { useEffect, useState } from "react";

function App() {
  const [servantData, setServantData] = useState([]);
  const [clicked, setClicked] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showHighscore, setShowHighscore] = useState(false);
  const [username, setUsername] = useState("");
  const [currentScore, setCurrentScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  useEffect(() => {
    fetch("https://api.atlasacademy.io/export/NA/basic_servant.json")
      .then((response) => response.json())
      .then((data) => {
        setServantData(data.slice(0, 18));
      });
  }, []);
  useEffect(() => {
    const shuffleServants = () => {
      const copyData = [...servantData];

      for (let i = copyData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copyData[i], copyData[j]] = [copyData[j], copyData[i]];
      }

      setServantData(copyData);
    };

    shuffleServants();
  }, [clicked]);

  function clickServant(id) {
    if (!clicked.includes(id)) {
      setClicked((prev) => [...prev, id]);
      setScore((prev) => prev + 1);
    } else {
      setBestScore((prev) => Math.max(prev, score));
      setCurrentScore(score);
      handleHighscore();
      setScore(0);
      fetch("https://api.atlasacademy.io/export/NA/basic_servant.json")
        .then((response) => response.json())
        .then((data) => {
          setServantData(data.slice(0, 18));
        });
      setClicked([]);
    }
  }

  function renderCards() {
    return servantData.map((servant) => {
      return (
        <Card
          key={servant.id}
          img={servant.face}
          name={servant.name}
          onClick={() => clickServant(servant.id)}
        />
      );
    });
  }
  async function saveScore(score, username) {
    if (!score || !username.trim()) {
      alert("Please enter a username and make sure you have a score!");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("highscores")
        .insert([{ username: username.trim(), highscore: score }]);

      if (error) {
        console.error("Supabase error:", error);
        alert("Error saving score: " + error.message);
      } else {
        console.log("Score saved successfully:", data);
        alert("Score saved successfully!");
        setShowHighscore(false);
        setUsername("");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Unexpected error saving score");
    }
  }

  function handleHighscore() {
    setShowHighscore(true);
  }
  async function fetchLeaderboard() {
    try {
      const { data, error } = await supabase
        .from("highscores")
        .select("*")
        .order("highscore", { ascending: false });

      if (error) {
        console.error("Error fetching leaderboard:", error);
        alert("Error fetching leaderboard: " + error.message);
      } else {
        setLeaderboardData(data || []);
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      alert("Error fetching leaderboard: " + err.message);
    }
  }

  return (
    <>
      <div id="game-screen">
        <div id="game-header">
          <div id="scores">
            <div>Score: {score}</div>
            <div>Best Score: {bestScore}</div>
          </div>
          <div id="instructions">
            {`Get points by clicking on an image but don't click on any more than
                once!`}
          </div>
          <div id="leaderboard">
            <button
              className="open-leaderboard"
              onClick={() => {
                setShowLeaderboard(true);
                fetchLeaderboard();
              }}
            >
              Leaderboard
            </button>
          </div>
        </div>

        <div id="cards">{renderCards()}</div>
      </div>

      {showLeaderboard && (
        <div id="leaderboard-modal">
          <div className="modal-content">
            <h2>Leaderboard</h2>
            {leaderboardData.map((score) => (
              <div key={score.id}>
                {score.username}: {score.highscore}
              </div>
            ))}
            <button onClick={() => setShowLeaderboard(false)}>Close</button>
          </div>
        </div>
      )}

      {showHighscore && (
        <div className="highscore">
          <div>You scored {currentScore} points!</div>
          <input
            type="text"
            placeholder="Enter a username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={() => setShowHighscore(false)}>Close</button>
          <button onClick={() => saveScore(currentScore, username)}>
            Submit
          </button>
        </div>
      )}
    </>
  );
}

export default App;
