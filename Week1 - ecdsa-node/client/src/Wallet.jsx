import server from "./server";
import * as secp256k1 from "ethereum-cryptography/secp256k1";
import {toHex} from "ethereum-cryptography/utils"
import {keccak256} from "ethereum-cryptography/keccak"

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const hash = keccak256(toHex(secp256k1.getPublicKey(privateKey)).slice(1));
    const address = toHex(hash.slice(-20));
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
        Private Key
        <input placeholder="Private Key" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Public Key: <span className="address">{address}</span>
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
