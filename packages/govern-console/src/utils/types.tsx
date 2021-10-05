export enum CustomTransactionStatus {
  Pending,
  InProgress,
  Successful,
  Failed,
}

export enum CircularProgressStatus {
  Disabled,
  InProgress,
  Done,
  Failed,
}

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

export type ParamType = {
  type: string;
  baseType: string;
  name?: string;
  value: any;
};

export type ActionItem = {
  signature: string;
  sighash: string;
  contractAddress: string;
  name: string;
  inputs: ParamType[];
  payable: boolean;
  payableAmount: string;
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

export type ipfsMetadata = {
  metadata: any;
  text: string | null;
  endpoint: string | null;
  error: any;
};

// Action builder types
export type ActionBuilderCloseHandler = (actions?: any) => void;
export type ActionBuilderState =
  | 'processTransaction'
  | 'deposit'
  | 'withdrawAssets'
  | 'mintTokens'
  | 'chooseContract'
  | 'chooseAction'
  | 'abiForm'
  | 'chooseFunctions';

export type Deposit = {
  id: string;
  type: 'Deposit';
  token: string;
  amount: string;
  sender: string;
  createdAt: string;
};

export type Withdraw = {
  id: string;
  to: string;
  from: string;
  type: 'Withdraw';
  token: string;
  amount: string;
  createdAt: string;
};

export type Finance = {
  id: string;
  deposits: Deposit[];
  withdraws: Withdraw[];
  __typename: string;
};

export type transctions = {
  createdAt: string;
  __typename: string;
  amount: string;
  token: string;
  symbol: string;
}[];

export type FinanceToken = {
  [key: string]: {
    symbol: string;
    amount: bigint;
    amountForHuman: string;
    price?: number | string;
    decimals: number;
  };
};

export type Balance = {
  [key: string]: {
    amount: bigint;
    symbol: string;
    decimals: number;
  };
};

export interface Interval {
  name: string;
  value: number;
  index: number;
}
