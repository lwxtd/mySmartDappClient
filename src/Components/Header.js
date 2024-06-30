import axios from "axios";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { ContractFactory } from "ethers";
import { Connector, useConnect } from "wagmi";

function Header(props) {
  const { connectors, connect } = useConnect();
  const [state, setState] = useState({
    clientVersion: null,
    signer: null,
    provider: null,
    abi: null,
    bytecode: null,
    metaMaskConnected: false,
    metaMaskInstalled: false,
    error: null,
    errortype: null,
    account: null,
    connectreq: false,
  });

  return (
    <>
      <div className="p-4 md:space-x-2 xs:space-y-2 flex flex-col md:flex-row bg-primary-content justify-between">
        <div className="text-secondary flex flex-row">
          Status:
          <p
            className={
              "px-2 " +
              (props.parentState.account ? " text-success" : " text-error")
            }
          >
            {" "}
            {props.parentState.account ? "Connected" : "Disconnected"}
          </p>
        </div>

        {props.parentState.account ? (
          <div className="text-secondary flex flex-row">
            client version:
            <p
              className={
                "px-2 " +
                (props.parentState.clientVersion
                  ? " text-success"
                  : " text-error")
              }
            >
              {" "}
              {props.parentState.clientVersion
                ? props.parentState.clientVersion
                : ""}
            </p>
          </div>
        ) : null}
        {props.parentState.account ? (
          <div className="text-secondary flex flex-col md:flex-row">
            Account Address:
            <p
              className={
                "px-2 " +
                (props.parentState.account ? " text-success" : " text-error")
              }
            >
              {props.parentState.account
                ? props.parentState.account
                : "0x----------------------------------------"}
            </p>
          </div>
        ) : null}
      </div>
      <div className="flex-row-reverse w-full">
        {!props.parentState.account ? (
          <div className="flex flex-row space-x-4 p-4">
            {connectors.map((connector) => (
              <button
                className="btn bg-secondary glass"
                key={connector.uid}
                onClick={() => connect({ connector })}
              >
                {"Connect to " + connector.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Header;
