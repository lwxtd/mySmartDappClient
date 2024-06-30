import "./App.css";
import axios from "axios";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { ContractFactory } from "ethers";
import Header from "./Components/Header";
import { verifyTypedData } from "@wagmi/core";
import { Cover } from "./Components/Cover";

function App() {
  let [elmm, setElmm] = useState({ elmentss: [], key: 0 });

  const [state, setState] = useState({
    provider: null,
    signer: null,
    abi: null,
    bytecode: null,
    connected: false,
    installed: false,
    errortype: null,
    data: null,
    account: null,
    connectreq: false,
    metaMaskConnected: false,
    metaMaskInstalled: false,
    DeployedCode: null,
    deployStep: 0,
    deployArgs: [],
  });
  const [contract, setContract] = useState({
    address: null,
    deployment: null,
  });
  const [loading, setLoading] = useState({
    loading: false,
  });

  const sendContractDataToServer = (event) => {
    event.preventDefault();
    let x = state.deployArgs.length;
    let d = state.deployArgs;
    setLoading({ loading: true });
    let continuee = false;
    if (x > 3) {
      console.log("x is", x, d[3], typeof d[3]);
      switch (x) {
        case 4:
          if (
            parseInt(d[1]) + parseInt(d[3]) == 100 &&
            ethers.isAddress(d[0]) &&
            ethers.isAddress(d[2]) &&
            d[0] !== d[2]
          ) {
            continuee = true;
          }
          break;
        case 6:
          if (
            parseInt(d[1]) + parseInt(d[3]) + parseInt(d[5]) == 100 &&
            ethers.isAddress(d[0]) &&
            ethers.isAddress(d[2]) &&
            ethers.isAddress(d[4])
          ) {
            continuee = true;
          }
          break;
        case 8:
          if (
            parseInt(d[1]) + parseInt(d[3]) + parseInt(d[5]) + parseInt(d[7]) ==
              100 &&
            ethers.isAddress(d[0]) &&
            ethers.isAddress(d[2]) &&
            ethers.isAddress(d[4]) &&
            ethers.isAddress(d[6])
          ) {
            continuee = true;
          }
          break;
        case 10:
          if (
            parseInt(d[1]) +
              parseInt(d[3]) +
              parseInt(d[5]) +
              parseInt(d[7]) +
              parseInt(d[9]) ==
              100 &&
            ethers.isAddress(d[0]) &&
            ethers.isAddress(d[2]) &&
            ethers.isAddress(d[4]) &&
            ethers.isAddress(d[6]) &&
            ethers.isAddress(d[8])
          ) {
            continuee = true;
          }
          break;
      }
    }
    //check
    if (continuee) {
      try {
        axios
          .post("/api/v1/getContractinit", { cnt: state.deployArgs })
          .then((res) => {
            setState((prevState) => ({
              ...prevState,
              deployStep: 2,
              abi: res.data?.abi, // should define a new state
            }));
            setLoading({ loading: false });
            console.log("res", res);
          });
      } catch (error) {
        setLoading({ loading: false });
        alert(error);
      }
    } else {
      alert(" Check inputs");
    }
  };

  const deploy = async (event) => {
    setLoading({ loading: true });
    event.preventDefault();
    const factory = ContractFactory.fromSolidity(state.abi, state.signer);
    factory.connect(state.signer);
    const contract = await factory
      .deploy()
      .then((response) => {
        response.getAddress().then((address) => {
          setContract((prevContract) => ({
            ...prevContract,

            address: address, // should define a new state
          }));
        });

        response
          .waitForDeployment()
          .then((obj) => {
            response.getDeployedCode().then((res) => {
              setState((prevState) => ({
                ...prevState,
                DeployedCode: res,
                deployStep: 4,
              }));
              setLoading({ loading: false });
            });
          })
          .catch((err) => {
            setLoading({ loading: false });
            console.log("errrr", err);
          });
      })
      .catch((err) => {
        setLoading({ loading: false });
        console.log("err is", err);
        // setState({ ...state, error: err });
      });
  };
  useEffect(() => {
    let connected = false;
    let installed = false;

    async function isMetaMaskConnected() {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: "eth_accounts" });
      return accounts && accounts.length > 0;
    }
    async function initialise() {
      installed = window.ethereum && window.ethereum.isMetaMask;
      if (installed) {
        connected = isMetaMaskConnected();
      } else {
        connected = false;
      }

      setState((prevState) => ({
        ...prevState,
        metaMaskConnected: connected,
        metaMaskInstalled: installed,
      }));
    }
    initialise();

    const template = async () => {
      try {
        const metaApi = await window.ethereum.request({
          method: "web3_clientVersion",
          params: [],
        });
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        window.ethereum.on("connect", () => {
          window.location.reload();
        });
        window.ethereum.on("disconnect", () => {
          window.location.reload();
        });
        setState((prevState) => ({
          ...prevState,
          clientVersion: metaApi,
        }));
      } catch (error) {
        console.log(error);
      }
    };

    template();

    const template3 = async () => {
      try {
        const { ethereum } = window;
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });

        const provider = new ethers.BrowserProvider(ethereum); // read the blockchain
        console.log("read provider is", provider);
        const signer = await provider.getSigner(); // write the blockchain
        console.log("signer  is", signer);
        setState((prevState) => ({
          ...prevState,
          provider: provider,
          signer: signer,
          account: account,
        }));
        console.log("provider and signer state should be writen");
      } catch (error) {
        console.log("error  sssss");
        console.log(error);
      }
    };
    template3();
  }, []);
  function setTemplate(state) {
    console.log("state recieved from child is ", state);
    setState((prevState) => ({
      ...prevState,
      ...state,
    }));
  }

  function handleChange(e, index) {
    let arr = state.deployArgs;
    arr[index] = e.target.value;

    setState((prevState) => ({
      ...prevState,
      deployArgs: arr,
    }));
  }
  function remElm() {
    console.log("elmm", elmm.elmentss);
    let elm = elmm.elmentss;
    let x = elmm.elmentss.length;
    if (x > 0) {
      elm.pop();
    }
    let k = elmm.key;
    k--;
    setElmm({ elmentss: elm, key: k });
  }
  function addElm() {
    console.log("elmm", elmm.elmentss);
    let elm = elmm.elmentss;
    let x = elmm.elmentss.length;
    if (x < 3) {
      elm.push(
        <div key={x} className="flex flex-row space-x-2 my-2">
          <input
            onChange={(e) => {
              if (ethers.isAddress(e.target.value)) {
                e.target.classList.add("bg-success");
                e.target.classList.remove("bg-error");
                handleChange(e, 2 * x + 4);
              } else {
                e.target.classList.add("bg-error");
                e.target.classList.remove("bg-success");
              }
            }}
            type="text"
            placeholder={"Address " + (x + 3)}
            className="input input-bordered w-full"
          />
          <input
            type="text"
            onChange={(e) => {
              handleChange(e, 2 * x + 5);
            }}
            placeholder={"ratio " + (x + 3)}
            className="input input-bordered w-full max-w-xs"
          />
        </div>
      );
      let k = elmm.key;
      k++;

      setElmm({ elmentss: elm, key: k });
    }
  }
  return (
    <>
      <Header
        parentState={state}
        connectreq={state.connectreq}
        sendDataTemplate={setTemplate}
      ></Header>
      <div className="App  flex flex-col p-16 ">
        <Cover />
        <div className="divider"></div>
        <div className="text-primary text-right">
          Notice : the sum of all ratio must be 100
        </div>
        <div className="flex flex-row space-x-2 my-2">
          <input
            onChange={(e) => {
              if (ethers.isAddress(e.target.value)) {
                e.target.classList.add("bg-success");
                e.target.classList.remove("bg-error");
                handleChange(e, 0);
              } else {
                e.target.classList.add("bg-error");
                e.target.classList.remove("bg-success");
              }
            }}
            type="text"
            placeholder="Address 1 -  example 0x82f5f5cE504189F40a2917d79fE21C4E18630218"
            className="input input-bordered w-full"
          />

          <input
            type="number"
            onChange={(e) => {
              if (e.target.value > 99 || e.target.value < 1) {
                e.target.value = 0;
              } else {
                e.target.value = Math.floor(e.target.value);
                handleChange(e, 1);
              }
            }}
            placeholder="ratio 1 - example : 20 (of 100)"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="flex flex-row space-x-2 my-2">
          <input
            onChange={(e) => {
              if (ethers.isAddress(e.target.value)) {
                e.target.classList.add("bg-success");
                e.target.classList.remove("bg-error");
                handleChange(e, 2);
              } else {
                e.target.classList.add("bg-error");
                e.target.classList.remove("bg-success");
              }
            }}
            type="text"
            placeholder="Address 2 - example 0x8189C4E186302182f5F40a2917d79fE21f5cE504"
            className="input input-bordered w-full"
          />
          <input
            type="number"
            onChange={(e) => {
              if (e.target.value > 99 || e.target.value < 1) {
                e.target.value = 0;
              } else {
                e.target.value = Math.floor(e.target.value);
                handleChange(e, 3);
              }
            }}
            placeholder="ratio 1 - example : 80 (of 100)"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div key={elmm.key}>
          {elmm.elmentss.length > 0 ? elmm.elmentss : null}
        </div>

        <div className="w-full flex flex-row py-16">
          <button className="btn bg-error btn-circle" onClick={remElm}>
            -
          </button>
          <button className="btn bg-success btn-circle" onClick={addElm}>
            +
          </button>
        </div>

        {state.error ? (
          <div role="alert" className="alert alert-error">
            <svg
              onClick={() => {
                setState({ ...state, error: null });
              }}
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error! Task failed .</span>
          </div>
        ) : null}

        {/* <div className="flex flex-row space-x-2 justify-center">
          <button onClick={fetchcontract} className={"btn  glass bg-primary"}>
            get compiled contract from Server side{" "}
          </button>
        </div> */}

        <div className="flex flex-row w-full justify-center space-x-8 space-around">
          <div className="flex flex-row space-x-2 justify-center">
            <button
              onClick={sendContractDataToServer}
              className={
                "btn  glass " + (state.abi ? "btn-disabled" : "bg-primary")
              }
            >
              send data contract to Server side{" "}
            </button>
          </div>
          {/* {loading.loading ? (
            <span
              key={loading.loading ? "ff" : "dd"}
              className="loading loading-infinity loading-lg"
            ></span>
          ) : null} */}
          <div className="flex flex-row space-x-2 justify-center">
            <button
              onClick={(e) => {
                setContract((prevContract) => ({
                  ...prevContract,
                  deployStep: 3,
                }));
                deploy(e);
              }}
              className={
                "btn  glass " + (state.abi ? "bg-primary" : "btn-disabled")
              }
            >
              {state.abi ? "Click here to Deploy" : "deploy"}
            </button>
          </div>
        </div>

        {contract.address ? (
          <div
            tabindex="0"
            class={
              "collapse collapse-open bg-base-200 mt-8" +
              (state.DeployedCode ? " bg-success" : "")
            }
          >
            <div class="collapse-title text-xl font-medium">
              your Smart Contract Address is{" "}
              {state.DeployedCode ? " (Deployed) " : "(wait for confirmation)"}
            </div>
            <div class="collapse-content">
              <p>{contract.address}</p>
              <p>
                {contract.address ? "Please copy and save the address" : ""}
              </p>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="">
          <div className=" pt-16 pb-12 text-center text-3xl font-bold">
            create your own smart contract by following simple steps below
          </div>
          <ul className="steps steps-vertical lg:steps-horizontal pt-2">
            <li
              className={
                "step " + (state.deployStep >= 0 ? "step-primary" : "")
              }
            >
              connect your wallet
            </li>
            <li
              className={
                "step " + (state.deployStep >= 1 ? "step-primary" : "")
              }
            >
              insert contract data and conditions data
            </li>
            <li
              className={
                "step " + (state.deployStep >= 2 ? "step-primary" : "")
              }
            >
              baking the contract
            </li>
            <li
              className={
                "step " + (state.deployStep >= 3 ? "step-primary" : "")
              }
            >
              deploying contract on Linea Blockchain
            </li>
            <li
              className={
                "step " + (state.deployStep >= 4 ? "step-primary" : "")
              }
            >
              <figure>
                <img
                  src="/frog.gif"
                  alt="frog"
                  className="w-16"
                  desc=" based on https://www.freepik.com"
                />
              </figure>
              enjoy
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
