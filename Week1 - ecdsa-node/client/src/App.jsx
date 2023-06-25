import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState, useRef } from "react";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  //const [privateKey, setPrivateKey] = useState();
  //const privateKey = useRef();

  //const privateKeyRef = useRef();

  const privateKey = secp256k1.utils.randomPrivateKey();

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      {/* {console.log('In App Private Key', privateKey)} */}
      <Transfer setBalance={setBalance} address={address} privateKey={toHex(privateKey)}/>
    </div>
  );
}

export default App;
