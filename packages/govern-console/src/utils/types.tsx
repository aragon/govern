export type Collateral = {
  id: string;
  token: string;
  amount: number;
};
export type Config = {
  id: string;
  executionDelay: number;
  scheduleDeposit: Collateral;
  challengeDeposit: Collateral;
  resolver: string;
  rules: string;
  maxCalldataSize: number;
};

export type GovernQueue = {
  id: string;
  address: string;
  nonce: number;
  config: Config;
};
export type Govern = {
  id: string;
  address: string;
  balance: number;
};
export type daoDetails = {
  id: string;
  name: string;
  queue: GovernQueue;
  executor: Govern;
  token: string;
  registrant?: string;
};

// eslint-disable-next-line
export type CustomTransaction = {
  tx: any;
  msg?: string;
};

export type Response = {
  error: string | undefined;
  transactions: CustomTransaction[];
};
