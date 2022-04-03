const vaultsContracts =require('../data/vaultContracts');
const configuration = require('../configuration');

const SECURITY_LEVEL_RATIO = 20;

module.exports = {
  async borrowToken() {
    let debtCeilling = await configuration.vaultContract.methods.getDebtCeiling().call();
    if(Number(debtCeilling) > Number(configuration.amountToBorrow)) {
      console.log("vault id: " + configuration.vaultId);
      const transaction = configuration.vaultContract.methods.borrowToken(configuration.vaultId,
        configuration.web3.utils.toWei(configuration.amountToBorrow));
      await this.sendWithPrivateKey(transaction);
    } else {
      console.log("Debt ceiling still 0  ...");
    }
  },
  async sendWithPrivateKey(transaction) {
    const account = configuration.web3.eth.accounts.privateKeyToAccount(configuration.privateKey).address;
    const gasPrice = await configuration.web3.eth.getGasPrice();
    const options = {
      to: transaction._parent._address,
      data: transaction.encodeABI(),
      gas: await transaction.estimateGas({from: account}),
      gasPrice: gasPrice
    };
    const signed  = await configuration.web3.eth.accounts.signTransaction(options, configuration.privateKey);
    configuration.web3.eth.sendSignedTransaction(signed.rawTransaction)
    .on('transactionHash',(hash) => {
      console.log('txHash: ', hash)
    })
    .on('receipt',(receipt) => {
      console.log('receipt: ', receipt)
      console.log('My job is done good bye :)')
      process.exit();
    })
    .on('error', (error => {
      console.log('error: ', error)
    }));
  },
  async getDebtCeiling() {
    const debtCeiling = await configuration.vaultContract.methods.getDebtCeiling().call();
    console.log(`Debt ceiling amount :${debtCeiling}`);
    return configuration.web3.utils.fromWei(debtCeiling);
  },
  async getMaxBorrow() {
    const vaultContractMinimumCollateralPercentage = Number(await configuration.vaultContract.methods._minimumCollateralPercentage().call());
    const vaultCurrentCollateralPercentage = Number(await configuration.vaultContract.methods.checkCollateralPercentage(configuration.vaultId).call());
    const vaultFiatEqCurrentDebt = Number(configuration.web3.utils.fromWei(await configuration.vaultContract.methods.vaultDebt(configuration.vaultId).call()));
    const vaultTotalFiatEqCollateral = vaultFiatEqCurrentDebt * vaultCurrentCollateralPercentage/100;
    const maxBorrowPossible = vaultTotalFiatEqCollateral / ((vaultContractMinimumCollateralPercentage + SECURITY_LEVEL_RATIO) / 100)
    const amountToBorrow = maxBorrowPossible - vaultFiatEqCurrentDebt;
    console.log(`Amount to borrow = ${amountToBorrow}`)
    return amountToBorrow;
  },
}
