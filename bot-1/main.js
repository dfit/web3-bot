require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss.l');

const subscriber = require("./src/subscriber")
const wallet = require('./src/walletUtil');
const configuration = require('./configuration');
const vaultManager = require('./src/vaultManager')
const vaultsContracts = require('./data/vaultContracts');

async function setup() {
  configuration.privateKey = process.env.PRIVATE_KEY
  configuration.walletAddress = wallet.getWalletAddress()
  configuration.miMaticContract = new configuration.web3Wss.eth.Contract(vaultsContracts.miMaticContract.abi, vaultsContracts.miMaticContract.smartContractAddress);
  configuration.vaultContract = new configuration.web3.eth.Contract(configuration.vault.abi, configuration.vault.smartContractAddress);
  // TODO : add a vault id selector at start in case multiple
  configuration.vaultId =  await configuration.vaultContract.methods.tokenOfOwnerByIndex(configuration.walletAddress, "0").call();
  configuration.amountToBorrow = await vaultManager.getMaxBorrow();
  if (Number(configuration.amountToBorrow) > configuration.minToBorrow) {
    configuration.bcSubscription = await subscriber.subscribeSmartContractEvent();
  } else {
    console.log(`Nothing to do, max amount to borrow < ${configuration.minToBorrow} MAI`);
    process.exit();
  }
}

async function main() {
  await setup();
  while (true) {
    console.log("Waiting...")
    await new Promise(resolve => setTimeout(resolve, 60000));
  }
}
main()
