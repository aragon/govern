/* eslint-disable */

export enum CustomTransactionStatus {
  Successful,
  Failed,
  Pending,
  InProgress,
}

export enum CiruclarProgressStatus {
  Disabled,
  InProgress,
  Done,
  Failed,
}

// eslint-disable-next-line
export type CustomTransaction = {
  tx: any;
  message: string;
  status: CustomTransactionStatus;
  // transactionOrder: number;
};

export type Response = {
  error: string | undefined;
  transactions: CustomTransaction[];
};

export type abiItem = {
  inputs: [];
  name: string;
  type: string;
  stateMutability: string;
};

export type actionType = {
  item: abiItem;
  name: string;
  contractAddress: string;
  abi: any[];
  type: string;
};

export type ActionToSchedule = {
  contractAddress: string;
  name: string;
  params: [];
  abi: [];
  numberOfInputs: number;
};

export type Account = {
  signer: any | undefined;
  address: string | null;
};

export enum ChainId {
  MAINNET = 1,
  RINKEBY = 4,
}
