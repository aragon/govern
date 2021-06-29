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
  text: string;
  endpoint: string;
  error: any;
};

// Action builder types
export type ContractId = 'queue' | 'minter' | 'executor' | 'external';
export type ActionBuilderCloseHandler = (actions?: any) => void;
export type ActionBuilderState =
  | 'deposit'
  | 'withdrawAssets'
  | 'mintTokens'
  | 'chooseContract'
  | 'chooseAction'
  | 'abiForm'
  | 'chooseFunctions';
