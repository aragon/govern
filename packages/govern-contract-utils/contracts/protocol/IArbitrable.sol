/*
 * SPDX-License-Identifier:    MIT
 */

// From https://github.com/aragon/protocol/blob/25dafb59229e720c6e31e51830788185e43ad15e/packages/evm/contracts/arbitration/IArbitrable.sol

pragma solidity ^0.6.8;

import "./IArbitrator.sol";

/**
* @dev The Arbitrable instances actually don't require to follow any specific interface.
*      Note that this is actually optional, although it does allow the Protocol to at least have a way to identify a specific set of instances.
*/
abstract contract IArbitrable {
    uint256 internal constant ALLOW_RULING = 4;

    /**
    * @dev Emitted when an IArbitrable instance's dispute is ruled by an IArbitrator
    * @param arbitrator IArbitrator instance ruling the dispute
    * @param disputeId Identification number of the dispute being ruled by the arbitrator
    * @param ruling Ruling given by the arbitrator
    */
    event Ruled(IArbitrator indexed arbitrator, uint256 indexed disputeId, uint256 ruling);
}
