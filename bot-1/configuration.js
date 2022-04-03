const Web3 = require('web3');
const providerHttp = process.argv[2]
const providerWSS = process.argv[3]
const vaultToInteractWith = process.argv[4]
let web3Wss = new Web3(providerWSS);
let web3 = new Web3(providerHttp);
const vault = require('./data/vaultContracts');

module.exports = {
  vault: vault[vaultToInteractWith],
  web3Wss: web3Wss,
  web3: web3,
  walletAddress: "",
  amountToBorrow: "",
  privateKey: "",
  bcSubscription: null,
  vaultId: "",
  vaultContract: null,
  miMaticContract: null,
  minToBorrow: 20
}
