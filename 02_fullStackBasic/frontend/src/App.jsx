import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
function App() {
  const [jokes, setJokes] = useState([]);
  useEffect(() => {
    axios
      .get("/api/jokes")
      .then((response) => {
        setJokes(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <h1>aur bhai</h1>
      <p>jokes :{jokes.length}</p>
      <ul>
        {jokes.map((joke) => (
          <li key={joke.id}>{joke.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
