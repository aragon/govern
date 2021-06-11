import { ethereum } from '@graphprotocol/graph-ts'
import { ERC20 } from '../../generated/templates/GovernQueue/ERC20'
import { Address } from '@graphprotocol/graph-ts'

class ERCInfo {
    decimals: i32;
    name: string;
    symbol: string;
}

export function getERC20Info(
  address: Address
): ERCInfo {
  let token = ERC20.bind(address);
  
  let decimals = token.try_decimals();
  let name = token.try_name();
  let symbol = token.try_symbol();

  return {
      decimals: decimals.reverted ? null : decimals.value,
      name: name.reverted ? null : name.value,
      symbol: decimals.reverted ? null : symbol.value
  }
}
