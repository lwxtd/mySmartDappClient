import "./App.css";
import axios from "axios";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { ContractFactory } from "ethers";
import Header from "./Components/Header";

import { Cover } from "./Components/Cover";
import { LoadingComponenet } from "./Components/LoadingComponenet";
import { toast } from "react-toastify";

function App() {
  function checkInput(arr) {
    if (arr.length > 3) {
      let percentagesOddIndex = arr.filter((v, index) => {
        return index % 2;
      });
      let addressEvenIndex = arr.filter((v, index) => {
        return !(index % 2);
      });
      let validity = true;
      addressEvenIndex?.forEach((element, index) => {
        if (!ethers.isAddress(element)) {
          validity = false;
          return;
        }
      });
      if (!validity) {
        toast.error("Addresses should be valid");
        return false;
      }

      let duplicate =
        new Set(addressEvenIndex).size !== addressEvenIndex.length;
      if (duplicate) {
        toast.error("Addresses shouldn't be the duplicate");
        return false;
      }

      if (
        percentagesOddIndex?.reduce(
          (partialSum, a) => partialSum + parseInt(a),
          0
        ) == 100
      ) {
      } else {
        toast.error("The sum of all percentages must be 100");
        return false;
      }
    } else {
      toast.error("please fill all inputs");
      return false;
    }
    return true;
  }

  function checkIfDuplicateExists(arr) {
    return new Set(arr).size !== arr.length;
  }

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
    deployable: false,
    deployStatus: 0,
  });
  const [contract, setContract] = useState({
    address: null,
    deployment: null,
  });
  const [loading, setLoading] = useState({
    loading: false,
    description: "",
  });

  const sendContractDataToServer = (event) => {
    event.preventDefault();
    let x = state.deployArgs.length;
    let d = state.deployArgs;

    setLoading({
      loading: true,
      description: " Compiling Contract",
    });
    if (checkInput(d)) {
      try {
        axios
          .post("/api/v1/getContractinit", { cnt: state.deployArgs })
          .then((res) => {
            setState((prevState) => ({
              ...prevState,
              deployStep: 2,
              abi: res.data?.abi, // should define a new state
              deployable: true,
            }));
            setLoading({ loading: false, description: "" });
            toast.success("Contract has been compiled successfully");
            toast.success("Now you can deploy it", { autoClose: 7000 });
          })
          .catch((err) => {
            toast.error("Server Error");
            setLoading({ loading: false, description: "" });
          });
      } catch (error) {
        toast.error("OOps! Something is wrong");
        loading = false;
        setLoading({ loading: false, description: "" });
      }
    } else {
      setLoading({ loading: false, description: "" });
    }
  };

  const deploy = async (event) => {
    setLoading({
      loading: true,
      description: "Deploying contract to blockchain wait for signing popup",
    });
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
          setLoading({ loading: false, description: "" });
          setState((prevState) => ({
            ...prevState,
            deployable: false,
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
                deployable: false,
              }));
              toast.success("your contract has been deployed successfully");
              setLoading({ loading: false, description: "" });
            });
          })
          .catch((err) => {
            setLoading({ loading: false, description: "" });
            toast.error("OoOps!, something went wrong , please try again");
            console.log("errrr", err);
          });
      })
      .catch((err) => {
        setLoading({ loading: false });
        console.log("err is", err);
        toast.error("OoOps!, something went wrong, please try again");
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
                handleChange(e, 2 * x + 4);
              }
            }}
            type="text"
            placeholder={"Address " + (x + 3)}
            className="input input-bordered w-full"
          />
          <input
            type="number"
            onChange={(e) => {
              if (e.target.value > 99 || e.target.value < 1) {
                e.target.value = 0;
              } else {
                e.target.value = Math.floor(e.target.value);
                handleChange(e, 2 * x + 5);
              }
            }}
            placeholder={"percentage " + (x + 3)}
            className="input input-bordered w-full max-w-xs"
          />
          <p className="self-center">/100</p>
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
      <LoadingComponenet
        loading={loading.loading}
        description={loading.description}
      ></LoadingComponenet>
      <div className="App  flex flex-col p-16 ">
        <Cover />
        <div className="divider"></div>
        <div className="text-primary text-right">
          Notice : the sum of all percentages must be 100
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
                handleChange(e, 0);
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
            placeholder="percentage 1 - example : 20 (of 100)"
            className="input input-bordered w-full max-w-xs"
          />
          <p className="self-center">/100</p>
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
                handleChange(e, 2);
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
            placeholder="percentage 2 - example : 80 (of 100)"
            className="input input-bordered w-full max-w-xs"
          />
          <p className="self-center">/100</p>
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
              key={state.deployStatus}
              onClick={sendContractDataToServer}
              className={
                "btn  glass " +
                (state.deployable ? "btn-disabled" : "bg-primary")
              }
            >
              1- compile contract
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
              key={state.deployStatus}
              onClick={(e) => {
                setContract((prevContract) => ({
                  ...prevContract,
                  deployStep: 3,
                }));
                deploy(e);
              }}
              className={
                "btn  glass " +
                (state.deployable ? "bg-primary" : "btn-disabled")
              }
            >
              {state.abi ? "2- Click here to Deploy" : "2 - deploy"}
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
              <div className="flex flex-row w-full">
                <p>{contract.address}</p>
                <img
                  src="/copy.svg"
                  className="w-8 cursor-pointer pl-4"
                  onClick={() => {
                    navigator.clipboard.writeText(contract.address).then(() => {
                      toast.success("Address has been Copied to clipboard");
                    });
                  }}
                  alt="copy"
                />
              </div>

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
              compiling the contract
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
        <p className="text-center text-secondary select-none pt-8">
          Version : 1.1.26
        </p>
      </div>
    </>
  );
}

export default App;
