import { useEffect, useRef, useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import {keccak256} from "ethereum-cryptography/keccak"
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey}) {
  const [sendAmount, setSendAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState("");
  //const [publicKey, setPublicKey] = useState([]);
  //const [recovery, setRecovery] = useState(0);
  // const publicKey = useRef();

  //console.log('In Transfer Private Key', privateKey);


  const publicKey = secp256k1.getPublicKey(privateKey);
  const key = toHex(publicKey);

  const amount = sendAmount.toString();

  const recp = recipient.toString();
    
  /* const setValue = () => {
    (evt) => setSendAmount(evt.target.value)
  }; */

  function hashMessage(message) {
    const bytes = utf8ToBytes(message);
    // hash the message using keccak256
    const hash = keccak256(bytes);
    return hash;  
  }

  async function signMessage(msg) {
    let messageHash = hashMessage(msg);
    return secp256k1.sign(messageHash, privateKey);
  }

  async function transfer(evt) {
    evt.preventDefault();

    //console.log("Here is the Send Amount : ", sendAmount);
    const sig = await signMessage(recipient + "");
    setSignature(sig);
    //setRecovery(recoveryBit);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: sendAmount,
        recipient: recipient,
        signature: signature,
        publicKey: key,
      });
      setBalance(balance);
    } catch (ex) {
        alert(ex.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={(e)=>{setSendAmount(e.target.value)}}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={(e)=>{setRecipient(e.target.value)}}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
