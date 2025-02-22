import "./App.css";
import Card from "./components/Card.jsx";
import { useEffect, useState } from "react";

function App() {
  const [servantData, setServantData] = useState([]);
  let clicked = [];
  useEffect(() => {
    fetch("https://api.atlasacademy.io/export/NA/basic_servant.json")
      .then((response) => response.json())
      .then((data) => {
        setServantData(data.slice(0, 18));
      });
  }, []);
  function clickServant() {}
  function renderCards() {
    return servantData.map((servant) => {
      return (
        <Card
          key={servant.id}
          img={servant.face}
          name={servant.name}
          onClick={clickServant}
        />
      );
    });
  }

  return (
    <>
      <div id="cards">{renderCards()}</div>
    </>
  );
}

export default App;
