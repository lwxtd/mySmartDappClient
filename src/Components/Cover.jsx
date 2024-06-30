export function Cover(props) {
  return (
    <div className=" bg-base-100 w-full ">
      <div className="flex flex-row justify-around">
        <figure>
          <img src="/mysmart.gif" alt="frog" />
        </figure>
        {/* <figure>
          <img
            src="/frog.gif"
            alt="frog"
            className="w-16"
            desc=" based on https://www.freepik.com"
          />
        </figure> */}
        <div>
          <h2 className="text-3xl font-bold text-center pb-8">
            How my smart accountant works
          </h2>
          <ul class="steps steps-vertical">
            <li class="step step-primary">Connect your wallet</li>
            <li class="step step-primary">
              Input data (Addresses you want that your money auto distributed
              to)
            </li>
            <li class="step step-primary">
              We will create smart contract for you to handle the Job
            </li>
            <li class="step step-primary">
              You will receive your smart contract address after deploying your
              contract on Linea blockChain
            </li>
            <li class="step step-primary">
              Finish you can send money to your contract Address and it will
              send it to the address you entered
            </li>
          </ul>
        </div>
      </div>

      <div className="card-body"></div>
    </div>
  );
}
