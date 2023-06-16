import server from "./server";
import {secp256k1} from "ethereum-cryptography/secp256k1";
import {toHex} from "ethereum-cryptography/utils"
import {keccak256} from "ethereum-cryptography/keccak"
import { utf8ToBytes } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {

  function getAddress(publicKey) {
    let hash = keccak256(publicKey.slice(1));
    return hash.slice(-20);
  }

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const publicKey = secp256k1.getPublicKey(privateKey);
    const address = '0x' + toHex(getAddress(publicKey));
    setAddress(address);
    console.log(address);
    console.log(privateKey);

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
        Private Key
        <input placeholder="Private Key" value={privateKey} onChange={onChange}></input>
      </label>

      <div className="address">Public Key: {address}</div>
      <div className="balance">Balance: {balance}</div>

    </div>
  );
}

export default Wallet;
