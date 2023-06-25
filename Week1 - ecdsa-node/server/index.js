const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {secp256k1} = require("ethereum-cryptography/secp256k1");
const {toHex, utf8ToBytes} = require('ethereum-cryptography/utils');
const {keccak256} = require('ethereum-cryptography/keccak');

app.use(cors());
app.use(express.json());

const balances = {
  "0x97bab98b0c76292b8f9c2c8c5689c6b79c1dedbf": 100, // Rizan
  "0xb5d8eabe562878f70095b56a766cd3aef54fee4b": 50, // Usman
  "0xd45cdb5b4e8455d30842db4aec4bcc71639dc4f5": 75, // Amir
};

function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  // hash the message using keccak256
  const hash = keccak256(bytes);

  return hash;
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, publicKey } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);
  const isSigned = secp256k1.verify(signature, hashMessage(recipient + ""), publicKey);
  if(isSigned) {
    console.log("Signature is valid!");
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
      console.log("Transaction successful!");
    }
  } else {
    res.status(400).send({ message: "Invalid Signature!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
