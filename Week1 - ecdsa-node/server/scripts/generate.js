const {secp256k1} = require("ethereum-cryptography/secp256k1");
const {toHex} = require('ethereum-cryptography/utils');
const {keccak256} = require('ethereum-cryptography/keccak');

const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey);

function getAddress(publicKey) {
    let hash = keccak256(publicKey.slice(1));
    return hash.slice(-20);
 }

const address = '0x' + toHex(getAddress(publicKey));

console.log('Public Key: ' , toHex(publicKey));
console.log('Private Key: ' , toHex(privateKey));
console.log('Address:  ' , address);