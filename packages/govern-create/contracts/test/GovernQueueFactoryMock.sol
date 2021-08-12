/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "@aragon/govern-core/contracts/pipelines/GovernQueue.sol";
import "@aragon/govern-contract-utils/contracts/acl/ACL.sol";

contract GovernQueueFactoryMock  {
   
    event NewQueueCalledWith(address aclRoot, bytes32 salt);
    event BulkCalled(ACLData.BulkItem[] items);
    
    bytes4 public constant ROOT_ROLE = "0x";

    function schedule()  public pure  {}
    function execute()   public pure  {}
    function challenge() public pure  {}
    
    function configure(ERC3000Data.Config memory /*_config*/) public pure returns(bool)  {
        // TODO: emit events and catch it in the govern-base-factory-unit.test.ts
        return true;
    }

    // probably ACL inheritance can be used instead of implementing ACL functions again.

    function grant(bytes4 _role, address _who) public pure {
        // TODO: emit events and catch it in the govern-base-factory-unit.test.ts
    }

    function revoke(bytes4 _role, address _who) public pure {
        // TODO: emit events and catch it in the govern-base-factory-unit.test.ts
    }

    function bulk(ACLData.BulkItem[] memory items) public {
        emit BulkCalled(items);
    }

    function newQueue(address _aclRoot, ERC3000Data.Config memory /*_config*/, bytes32 _salt) public returns (GovernQueue queue) {
        /* 
            TODO:There seems to be a bug with waffle. After it's been fixed, emit the _config too and in the test,
            assert it. https://github.com/EthWorks/Waffle/issues/454
        */
        emit NewQueueCalledWith(_aclRoot, _salt);
        return GovernQueue(address(this));
    }
}
