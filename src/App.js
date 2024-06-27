import "./App.css";
import axios from "axios";

function App() {
  const fet = () => {
    try {
      axios
        .post("/users", {
          firstName: "Fred",
          lastName: "Flintstone",
        })
        .then((res) => {
          console.log(res);
        });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="App">
      {fet()}
      <header>Hello my Smartt Contract</header>
      <div>connection to server is OK</div>
    </div>
  );
}

export default App;
