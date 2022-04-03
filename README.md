## Web 3 bot for Qi Dao vaults

It is for me a good exercise to get more familiar with web3 dev environment and mechanics.

Any comment, remark or suggestions would be highly appreciated.

(More bot to come)

## BOT 1

The purpose of the bot is to snag MAI when a vault is refilled.

## Vaults supported

### Polygon

* Compounding Aave Market MATIC
* Compounding Aave Market AAVE
* Gotchi Vault GHST

## How it works ##

On start the bot calculate the max available MAI you can borrow depending on your current vault CDR ratio.
It use a 20% from the max CDR ratio to be safe.
It doesn't borrow if the max amount borrowable is < 20 MAI.

It watch for the MiMatic smart contract "Transfer" events  txn to the Vault smart contract address. 

Events trigger the start of the borrowing algorithm.
This is nearly instant, when MAI are available it can be snagged almost immediately.

It does the following actions : 
* Check the vault current debt ceiling
* If maxBorrowAmount > debtCeiling initiate the borrow
* If borrow unsuccessful retry on the next transfer event
* End the bot after desired amount is borrowed


## Prerequisites

* node
* [Alchemy](https://dashboard.alchemyapi.io/) account (free for this usage)
* (pm2 if wanted)


## IMPORTANT ##
Test the bot on a small vault deposit initially until you get a good feel for the way the bot runs.

First step is to create the vault on mai.finance + having already validated the transaction to borrow for the concerned vault.


## Steps to install

### 1. Clone the repo

```bash 
https://github.com/dfit/web3-bot.git
```

### 2. Install npm package

```bash 
npm install
```

### 3. Export private key (until I find something better ...)

```bash 
export PRIVATE_KEY=<enter-your-private-key>
```

### 4. How to run the bot
```bash
node main https://polygon-mainnet.g.alchemy.com/v2/<replace-with-your-cred> wss://polygon-mainnet.g.alchemy.com/v2/<replace-with-your-cred> <desired-vault>
```
`desired-vault` should be the name of the vault file without js from `bot-X/data` folder (ex: vaultvGhst)

### 5. How to run the bot (alternative)

Alternatively you can use the [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) command to run your bot on background and manging it a little bit better.

You can add the `--no-autorestart` to `pm2` command in order to only execute the bot once.

```bash
pm2 start main.js https://polygon-mainnet.g.alchemy.com/v2/<replace-with-your-cred> wss://polygon-mainnet.g.alchemy.com/v2/<replace-with-your-cred> <desired-vault>
```

### 6. Example of usage

#### 1. PM2
```bash
DAVID@unix bot-1 % pm2 start main.js -- https://polygon-mainnet.g.alchemy.com/v2/<replace-with-your-cred> wss://polygon-mainnet.g.alchemy.com/v2/<replace-with-your-cred> <desired-vault>
[PM2] Starting /Users/DAVID/IdeaProjects/web3-bot/bot-1/main.js in fork_mode (1 instance)
[PM2] Done.
┌─────┬─────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name    │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼─────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ main    │ default     │ 1.0.0   │ fork    │ 78052    │ 0s     │ 0    │ online    │ 0%       │ 9.7mb    │ DAVID    │ disabled │
└─────┴─────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
DAVID@unix bot-1 % pm2 logs main        
[TAILING] Tailing last 15 lines for [main] process (change the value with --lines option)
/Users/DAVID/.pm2/logs/main-error.log last 15 lines:
/Users/DAVID/.pm2/logs/main-out.log last 15 lines:
0|main     | [2022-04-03 17:10:31.986] [LOG]   Waiting...
0|main  | [2022-04-03 17:10:36.989] [LOG]   
0|main  | Waiting...
0|main  | [2022-04-03 17:10:41.995] [LOG]   
0|main  | Waiting...
^C
DAVID@unix bot-1 % pm2 delete main
[PM2] Applying action deleteProcessId on app [main](ids: [ 0 ])
[PM2] [main](0) ✓
┌─────┬───────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name      │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
└─────┴───────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
DAVID@unix bot-1 % 
```

#### 2. From IDE

```bash
[2022-04-03 17:53:38.560] [LOG]   /Users/DAVID/IdeaProjects/web3-bot/bot-1/main https://polygon-mainnet.g.alchemy.com/v2/XXXX wss://polygon-mainnet.g.alchemy.com/v2/XXXX vaultCamWMatic
[2022-04-03 17:53:38.563] [LOG]   
[2022-04-03 17:53:38.598] [LOG]   Public address : 0xa9575438851A7eFBa37bC35ebE2be558c4bA3055

...
[2022-04-03 17:53:39.903] [LOG]   Waiting...
[2022-04-03 17:53:40.350] [LOG]   txHash:  0x47059687c9d3773c9ba984beb7cf172f68e1ca3f6b2865e9608957b9e04e59db
[2022-04-03 17:53:44.907] [LOG]   Waiting...
[2022-04-03 17:53:47.181] [LOG]   receipt:  {
  blockHash: '0xd9c8bd2de57c12a785378f4f3083a4df001b47a617b31d25aac60d221a4ae541',
  blockNumber: 26701265,
  contractAddress: null,
  cumulativeGasUsed: 24628565,
  effectiveGasPrice: 30070000050,
  from: '0xa9575438851a7efba37bc35ebe2be558c4ba3055',
  gasUsed: 136558,
  logs: [
    {
      address: '0xa3Fa99A148fA48D14Ed51d610c367C61876997F1',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000000000000000002710',
      blockNumber: 26701265,
      transactionHash: '0x47059687c9d3773c9ba984beb7cf172f68e1ca3f6b2865e9608957b9e04e59db',
      transactionIndex: 164,
      blockHash: '0xd9c8bd2de57c12a785378f4f3083a4df001b47a617b31d25aac60d221a4ae541',
      logIndex: 720,
      removed: false,
      id: 'log_70cbd780'
    },
    {
      address: '0x88d84a85A87ED12B8f098e8953B322fF789fCD1a',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000000000000000000fca0000000000000000000000000000000000000000000000000000000000002710',
      blockNumber: 26701265,
      transactionHash: '0x47059687c9d3773c9ba984beb7cf172f68e1ca3f6b2865e9608957b9e04e59db',
      transactionIndex: 164,
      blockHash: '0xd9c8bd2de57c12a785378f4f3083a4df001b47a617b31d25aac60d221a4ae541',
      logIndex: 721,
      removed: false,
      id: 'log_152e6ef5'
    },
    {
      address: '0x0000000000000000000000000000000000001010',
      topics: [Array],
      data: '0x000000000000000000000000000000000000000000000000000e96a840b0d38e0000000000000000000000000000000000000000000000000c0cbe9454e33d890000000000000000000000000000000000000000000013c936e707f404241acd0000000000000000000000000000000000000000000000000bfe27ec143269fb0000000000000000000000000000000000000000000013c936f59e9c44d4ee5b',
      blockNumber: 26701265,
      transactionHash: '0x47059687c9d3773c9ba984beb7cf172f68e1ca3f6b2865e9608957b9e04e59db',
      transactionIndex: 164,
      blockHash: '0xd9c8bd2de57c12a785378f4f3083a4df001b47a617b31d25aac60d221a4ae541',
      logIndex: 722,
      removed: false,
      id: 'log_e3197364'
    }
  ],
  logsBloom: '0x00080000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000108000000000000000000002000000000000000000000010000008000000800000000000000000000100000000000000000000000008000000000000000000000000000000000080000010000000000000040000000000000000000000000000000000000000000000000000000000200010040000100000080000000000040000000000000000000000000000004000000002000000000001000080000000000000002000000002100000008000000000000000010200000000000000000000000000000000000000000000100000',
  status: true,
  to: '0x88d84a85a87ed12b8f098e8953b322ff789fcd1a',
  transactionHash: '0x47059687c9d3773c9ba984beb7cf172f68e1ca3f6b2865e9608957b9e04e59db',
  transactionIndex: 164,
  type: '0x0'
}

My job is done good bye :)
Process finished with exit code 0

```
