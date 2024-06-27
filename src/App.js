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
      {/* {fet()} */}
      <header className="text-3xl font-bold underline text-orange-400">
        Hello my Smartt Contract
      </header>
      <div>connection to server is OKk</div>
      <button className="btn bg-primary">btn</button>
    </div>
  );
}

export default App;
