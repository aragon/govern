import { networkEnvironment } from 'environment';
import { toBigNum, ZERO_ADDRESS } from 'utils/lib';
const { datafeedAPI } = networkEnvironment;

class DataFeed {
  async fetchOrganization(executor: string) {
    try {
      const url = `${datafeedAPI}/organizations/${executor}`;
      const response = await fetch(url);
      console.log(response, ' rsponse');
      if (!response.ok) {
        throw new Error('Data Feed API Failed');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      // TODO: send error to logger
      return null;
    }
  }

  calculateTokens(balances: any, deposits: any, withdraws: any) {
    const finalBalances: any = {};
    balances.forEach((balance: any) => {
      if (!finalBalances[balance.asset.address]) {
        finalBalances[balance.asset.address] = toBigNum(0);
      }
      // if the address is 0x...00, it means it's ether transfer and it will anyways be caught in deposits.
      if (balance.asset.address != ZERO_ADDRESS) {
        finalBalances[balance.asset.address] = toBigNum(balance.amount).add(
          toBigNum(finalBalances[balance.asset.address]),
        );
      }
    });

    deposits.forEach((deposit: any) => {
      if (!finalBalances[deposit.token]) {
        finalBalances[deposit.token] = toBigNum(0);
      }
      finalBalances[deposit.token] = toBigNum(deposit.amount).add(
        toBigNum(finalBalances[deposit.token]),
      );
    });

    withdraws.forEach((withdraw: any) => {
      if (finalBalances[withdraw.token]) {
        finalBalances[withdraw.amount] = toBigNum(finalBalances[withdraw.amount]).sub(
          toBigNum(withdraw.amount),
        );
      }
    });
    return finalBalances;
  }
}

export default new DataFeed();
