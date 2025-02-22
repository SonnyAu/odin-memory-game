import "./App.css";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("https://api.atlasacademy.io/export/NA/basic_servant.json")
      .then((response) => response.json())
      .then((data) => console.log(data.slice(0, 10)));
  });

  return <></>;
}

export default App;
