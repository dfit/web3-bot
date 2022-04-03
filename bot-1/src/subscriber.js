const vaultsContracts =require('../data/vaultContracts');
const configuration = require('../configuration');
const vaultManager = require('./vaultManager');
module.exports = {
  async subscribeSmartContractEvent() {
    return configuration.miMaticContract.events.Transfer(
      {
        filter: {to: configuration.vault.smartContractAddress, from: "0x0000000000000000000000000000000000000000"},
      },
      async (error, result) => {
        if (!error) {
          console.log(`Amount deposit : ${configuration.web3.utils.fromWei(result.returnValues.value)}`)
          await vaultManager.borrowToken();
        }
        if (error) {
          console.log(error)
          await this.retrySubscribe();
        }
      })
  },
  async subscribeSmartContractPastEvent() {
    await configuration.miMaticContract.getPastEvents('Transfer',
      {
        filter: {to: configuration.vault.smartContractAddress, from: "0x0000000000000000000000000000000000000000"},
        fromBlock: 25621580,
        toBlock: 26376993
      },
      async (error, result) => {
        if (!error) {
          console.log(`Amount deposit : ${configuration.web3.utils.fromWei(result[0].returnValues.value)}`)
          await vaultManager.borrowToken();
        }
        if (error) {
          console.log(error)
        }
      })
  },
  async retrySubscribe () {
    if (configuration.bcSubscription != null) {
      await configuration.bcSubscription.unsubscribe(async function (error, success) {
        if (success) {
          console.log('Re-subscribing!');
          configuration.bcSubscription.resubscribe()
        }
        if (error) {
          console.log('Fail to unsubscribe!');
          console.log(error);
          process.exit();
        }
      });
    }
  }
}
