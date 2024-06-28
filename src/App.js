import "./App.css";
import axios from "axios";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { ContractFactory } from "ethers";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    abi: null,
    bytecode: null,
  });
  const [account, setAccount] = useState("Not Connected");

  const fetchAbi = (event) => {
    event.preventDefault();
    try {
      axios.post("/getcontractdata", {}).then((res) => {
        setState({
          ...state,
          abi: res.data?.abi,
          bytecode: res.data?.bytecode,
        });
      });
    } catch (error) {
      alert(error);
    }
  };
  const fetchcontract = (event) => {
    event.preventDefault();
    try {
      axios.post("/getallcontractdata", {}).then((res) => {
        setState({
          ...state,
          abi: res.data?.abi, // should define a new state
        });
      });
    } catch (error) {
      alert(error);
    }
  };

  const deploy = async (event) => {
    event.preventDefault();

    let deployArgs = [
      "0xe9F484F0669C3D467b026Da1f5562B01EeD8dC53",
      "20",
      "0x8189C2f5F44E1863079fE22180a2917d1f5cE504",
      "30",
      "0x6A5C7F4E7cAa494857cDdb65509613C29eA7982a",
      "50",
    ];
    const factory = ContractFactory.fromSolidity(state.abi, state.signer);
    //  const factory = new ContractFactory(
    //   state.abi,
    //   state.bytecode,
    //   state.signer
    // );
    // If your contract requires constructor args, you can specify them here
    const contract = (await factory.deploy(deployArgs))
      .on("error", (err) => {
        console.log("onError is", err);
      })
      .on("receipt", function (receipt) {
        console.log("onReceipt", receipt); // contains the new contract address
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log("onconfirmation", receipt, confirmationNumber);
      })
      .then(function (newContractInstance) {
        console.log("final steppp", newContractInstance); // instance with the new contract address
      });

    let g = await contract.deployTransaction;
    console.log("contract.deployTransaction", g);
    let gg = await contract.value;
    console.log("contract.value", gg);
    let add = await contract.address;
    console.log("contract.address", add);

    console.log(contract);
    let dep = await contract.deployed;
    console.log("Contract.deployed()", dep);
  };

  useEffect(() => {
    const template = async () => {
      // const contractAddress = "0xa525e9E9C9Df15DeEADa58Df4Ef034C0909Fa2Af";
      //  const contractABI = abi.abi;
      // Metamask part
      //1. in order to transactions on goerli testnet
      //2. metamask consists of infura api which actually help in connecting to the blockchain

      try {
        const { ethereum } = window;
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        setAccount(account);
        const provider = new ethers.BrowserProvider(ethereum); // read the blockchain
        const signer = await provider.getSigner(); // write the blockchain
        // const contract = new ethers.Contract(
        //   contractAddress,
        //   contractABI,
        //   signer
        // );

        // setState({ provider, signer, contract });
        setState({ provider, signer });
      } catch (error) {
        console.log(error);
      }
    };

    template();
  }, []);

  // const fet = () => {
  //   try {
  //     axios
  //       .post("/users", {
  //         firstName: "Fred",
  //         lastName: "Flintstone",
  //       })
  //       .then((res) => {
  //         console.log(res);
  //       });
  //   } catch (error) {
  //     alert(error);
  //   }
  // };

  return (
    <div className="App p-4 space-y-2 flex flex-col ">
      {/* {fet()} */}
      <div className="flex-row-reverse w-full">
        <button className="btn bg-secondary glass">connect</button>
      </div>
      <header className="text-3xl text-center font-bold underline text-primary">
        Hello my Smart Contract
      </header>
      <div className="flex flex-row space-x-2">
        <input
          type="text"
          placeholder="Address 1"
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="ratio 1"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <div className="flex flex-row space-x-2">
        <input
          type="text"
          placeholder="Address 2"
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="ratio 2"
          className="input input-bordered w-full max-w-xs"
        />
      </div>

      <div tabindex="0" class="collapse collapse-open bg-base-200 ">
        <div class="collapse-title text-xl font-medium">Connected account:</div>
        <div class="collapse-content">
          <p>{account}</p>
        </div>
      </div>

      <div className="flex flex-row space-x-2 justify-center">
        <button onClick={fetchcontract} className={"btn  glass bg-primary"}>
          get compiled contract from Server side{" "}
        </button>
      </div>

      <div className="flex flex-row space-x-2 justify-center">
        <button
          onClick={deploy}
          className={
            "btn  glass " + (state.abi ? "bg-primary" : "bg-secondary")
          }
        >
          deploy
        </button>
      </div>

      <ul className="steps steps-vertical lg:steps-horizontal pt-16">
        <li className="step step-primary">connect your account</li>
        <li className="step step-primary">
          insert contract data and conditions data
        </li>
        <li className="step">baking the contract</li>
        <li className="step">deploying contract on Linea Blockchain</li>
        <li className="step">enjoy</li>
      </ul>
    </div>
  );
}

export default App;
