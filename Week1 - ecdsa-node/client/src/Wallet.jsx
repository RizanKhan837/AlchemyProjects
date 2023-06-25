import server from "./server";
import {secp256k1} from "ethereum-cryptography/secp256k1";
import {toHex} from "ethereum-cryptography/utils"
import {keccak256} from "ethereum-cryptography/keccak"
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { useEffect } from "react";


function generateKey() {
  return secp256k1.utils.randomPrivateKey();
}


function Wallet({ address, setAddress, balance, setBalance }) {

  //const [privateKey, setPrivateKey] = useState();
  //const privateKey = secp256k1.utils.randomPrivateKey();
  //setPrivateKey(privateKey);

  //const publicKey = secp256k1.getPublicKey(privateKey);

  function getAddress(publicKey) {
    let hash = keccak256(publicKey.slice(1));
    return hash.slice(-20);
  }



  // console.log("Here is actual Private Key : ", privateKey);

  //console.log("Here is actual Private Key : ", privateKey);

  //console.log("Here is actual Address : ", address);
  //const privateK = evt.target.value;
  //privateKey = utf8ToBytes(privateK);
  //const privateK = secp256k1.utils.randomPrivateKey();

  //console.log(privateKey);

  //const privateKeys = utf8ToBytes(toHex(privateK));
  //const publicKey = secp256k1.getPublicKey(privateKey);


  //const addr = getAddress(publicKey);
  //console.log("Here is generated Address : ", addr);

  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Address
        <input placeholder="Public Key" value={address} onChange={onChange}></input>
      </label>

      {/* <div className="address">Public Key: {address}</div> */}
      <div className="balance">Balance: {balance}</div>

    </div>
  );
}

export default Wallet;
