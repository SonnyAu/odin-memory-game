import "./App.css";
import Card from "./components/Card.jsx";
import { useEffect, useState } from "react";

function App() {
  const [servantData, setServantData] = useState([]);
  const [clicked, setClicked] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
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

  return (
    <>
      <div id="scores">
        <div>Score: {score}</div>
        <div>Best Score: {bestScore}</div>
      </div>

      <div id="cards">{renderCards()}</div>
    </>
  );
}

export default App;
