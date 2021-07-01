import { CustomTransaction, CustomTransactionStatus } from 'utils/types';
import { Contract, Signer, BigNumber, BigNumberish } from 'ethers';
import { Asset } from 'utils/Asset';

const EXECUTOR_ABI = [
  'function deposit(address token, uint256 amount, string calldata reference) external payable',
];
const TOKEN_ABI = [
  'function approve(address spender, uint256 amount)',
  'function allowance(address owner, address spender) public view returns (uint256 remaining)',
];

/**
 * The Govern Executor class with abstraction on deposit and withdrawal
 * transaction generation
 */
export class Executor {
  private readonly executor: Contract;

  constructor(executorAddress: string, signer: Signer) {
    this.executor = new Contract(executorAddress, EXECUTOR_ABI, signer);
  }

  /**
   * build a single custom transaction for the given amount
   * @param tokenContract  token contract address
   * @param amount transaction amount
   * @param displayAmount display amount for transaction message
   * @param symbol asset symbol
   * @returns a custom transaction
   */
  private buildApprovalForAmount(
    tokenContract: Contract,
    amount: BigNumberish,
    displayAmount: string,
    symbol: string,
  ): CustomTransaction {
    return {
      tx: () => tokenContract.approve(this.executor.address, amount),
      message: `Approve ${displayAmount} ${symbol} to be spent by ${this.executor.address}`,
      status: CustomTransactionStatus.Pending,
    };
  }

  /**
   * build approval transactions for executor as the spender
   * @param asset asset to build approval for
   * @returns CustomTransaction[]
   */
  private async buildApprovalTransactions(asset: Asset): Promise<CustomTransaction[]> {
    if (Asset.isEth(asset.symbol)) {
      return [];
    }

    const signer = this.executor.signer;
    const tokenContract = new Contract(asset.address, TOKEN_ABI, signer);
    const owner = await signer.getAddress();
    const allowance: BigNumber = await tokenContract.allowance(owner, this.executor.address);

    if (asset.amount.lte(allowance)) {
      return [];
    }

    const transactions: CustomTransaction[] = [];
    if (allowance.gt(0)) {
      transactions.push(this.buildApprovalForAmount(tokenContract, 0, '0', asset.symbol));
    }

    transactions.push(
      this.buildApprovalForAmount(tokenContract, asset.amount, asset.displayAmount, asset.symbol),
    );
    return transactions;
  }

  /**
   * build transactions needed to deposit asset
   * @param asset asset to be deposited
   * @param reference comment about the deposit
   * @returns CustomTransaction[] transactions for depositing the asset
   */
  public async deposit(asset: Asset, reference: string): Promise<CustomTransaction[]> {
    const value = Asset.isEth(asset.symbol) ? asset.amount : 0;

    // token allowance and approval
    const approvalTransactions = await this.buildApprovalTransactions(asset);

    // add the deposit transaction
    const depositTransaction: CustomTransaction = {
      tx: () => this.executor.deposit(asset.address, asset.amount, reference, { value }),
      message: `Deposit ${asset.displayAmount} ${asset.symbol}`,
      status: CustomTransactionStatus.Pending,
    };

    return approvalTransactions.concat(depositTransaction);
  }
}
