# Aptos-Snap Server

This repository contains the server-side code for creating API endpoints to be called by the frontend. The server code utilizes the Aptos protocol to perform various actions such as creating accounts, performing transactions, and managing funds.

## Directory Structure

The `server` directory structure is as follows:
<img width="134" alt="image" src="https://github.com/PS2609/JS-Clock/assets/128664678/db843604-6311-415f-8c84-52f8637c3713">


## How the Server is Built

### 1. CreateAccount.ts
The `CreateAccount.ts` file demonstrates how an account is created and funded on the APTOS protocol using the `aptos.fundAccount` method.

#### Explanation:
```typescript
import { AccountAddress, Aptos } from '@aptos-labs/ts-sdk';

type Request = {
  address: string;
  amt: number;
};

export async function createAccount(request: Request) {
  const aptos = new Aptos();
  const requestBody: Request = request;

  const txn = await aptos.fundAccount({
    accountAddress: requestBody.address,
    amount: requestBody.amt,
    options: {
      indexerVersionCheck: false,
    },
  });

  return txn;
}
```
### 2.  privateKeyTxn.ts and Transaction.ts
Two different methods of performing transactions are showcased:

privateKeyTxn.ts: Uses a private key to sign and submit a transaction.
Transaction.ts: Directly submits a transaction to the blockchain without involving a private key.

#### privateKeyTxn.ts Explanation:

```typescript
import { Account, Aptos, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';
import CryptoJS from 'crypto-js';

type Request = {
  pk: string;
  recipient: string;
  amount: number;
};

function decryptPhrase(encryptedPhrase: string, key: string): string {
  // Decryption logic
}

export async function privateKeyTxn(request: Request) {
  // Transaction creation and submission logic
}
```
#### Transaction.ts Explanation:
```typescript
import { Account, Aptos } from '@aptos-labs/ts-sdk';

type Request = {
  sender: Account;
  recipient: string;
  amount: number;
};

export async function doTransaction(request: Request) {
  // Transaction creation and submission logic
}
```

### 3. Faucet.ts (fundMe())
The `Faucet.ts` file contains a `fundMe()` method responsible for providing Test/Dev Faucets.
#### Faucet.ts Explaination:
```typescript
import { AccountAddress, Aptos } from '@aptos-labs/ts-sdk';

type Request = {
  address: string;
};

export async function fundMe(request: Request) {
  const aptos = new Aptos();
  const requestBody: Request = request;

  const txn = await aptos.fundAccount({
    accountAddress: requestBody.address,
    amount: 100000000,
    options: {
      indexerVersionCheck: false,
    },
  });

  return txn;
}
```

### Other Functionalities
`CheckBalance.ts`: Checks the balance of an account.
`gasPrice.ts`: Manages gas prices for transactions.
`GetTxn.ts`: Retrieves transaction details.

### index.ts
Here is how the index.ts looks like.
```typescript
 /* eslint-disable */
import cors from 'cors';
import express, { Request, Response } from 'express';
import checkBalance from './src/CheckBalance';
import { createAccount } from './src/CreateAccount';
import { doTransaction } from './src/Transaction';
import { privateKeyTxn } from './src/privateKeyTxn';
import { getTxn } from './src/GetTxn';
import { genTxn } from './src/GenTxn';
import { fundMe } from './src/Faucet';
import { getTransByHash } from './src/GetTransByHash';
import { getGasPriceEstimation } from './src/gasPrice';

import { AptosConfig, Network} from '@aptos-labs/ts-sdk';

const APTOS_NETWORK = Network.DEVNET;
const config = new AptosConfig({ network: APTOS_NETWORK });

const app = express();
const PORT = 5500;

app.use(express.json());
app.use(cors<Request>());

app.post('/createAccount', (req: Request, res: Response) => {
  createAccount(req.body).then((tx) => {
    console.log('this is tx one more time', tx);
    res.json({ tx });
  });
});

app.post('/doTransaction', (req: Request, res: Response) => {
  doTransaction(req.body).then((tx) => {
    console.log('this is tx one more time', tx);
    res.json({ tx });
  });
});

app.post('/getBalance', async (req: Request, res: Response) => {
  res.json(await checkBalance(req.body));
});

app.post('/transaction', async (req: Request, res: Response) => {
  privateKeyTxn(req.body).then((tx) => {
    res.json({ tx });
  });
});

app.post('/getTxn', async (req: Request, res: Response) => {
  res.json(await getTxn(req.body));
});

app.post('/genTxn', async (req: Request, res: Response) => {
  res.json(await genTxn(req.body));
});

app.post('/fundMe', async (req: Request, res: Response) => {
  fundMe(req.body).then((tx) => {
    res.json({ tx });
  });
});
app.get('/gasPriceEstimate', async (req: Request, res: Response) => {
  res.json(await getGasPriceEstimation({aptosConfig: config}));
});

app.post('/getTransByHash', async (req: Request, res: Response) => {
  res.json(await getTransByHash(req.body));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```
This code represents an Express.js server setup in TypeScript. It defines various endpoints to handle different actions related to Aptos protocol such as `creating accounts`, `performing transactions`, `getting balances`, interacting with the `faucet`, `gas price estimation`, and more.


