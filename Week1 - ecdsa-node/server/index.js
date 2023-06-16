const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {secp256k1} = require("ethereum-cryptography/secp256k1");
const {toHex} = require('ethereum-cryptography/utils');
const {keccak256} = require('ethereum-cryptography/keccak');

app.use(cors());
app.use(express.json());

const balances = {
  "0xcfac26a9ab111c82f885b7db16bf962cfc105ca0": 100, // Rizan
  "0x2ec11285bf09a3fead856e382d2ca2151e645ccf": 50, // Usman
  "0x4205bde10d979a704abd4f23d4d2ebbf38741d9a": 75, // Amir
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

  if(secp256k1.verify(signature, hashMessage(amount), publicKey)) {
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
