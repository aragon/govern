/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "erc3k/contracts/ERC3000.sol";

import "./Eaglet.sol";
import "./lib/MiniACL.sol";

contract OptimisticQueue is ERC3000, MiniACL {
    uint256 public delay;

    mapping (bytes32 => uint256) public executionTime;
    uint256 public index;

    uint256 internal constant CANCELLED = uint256(-1);
    uint256 internal constant CHALLENGED = uint256(-2);
    uint256 internal constant EXECUTED = uint256(-3);

    constructor(address _aclRoot, uint256 _delay) MiniACL(_aclRoot) public {
        delay = _delay;
    }

    function schedule(uint256 _index, address _executor, Action[] memory _actions, bytes memory _proof)
        auth(this.schedule.selector)
        override public
        returns (bytes32 execHash)
    {   
        require(_index == index++, "queue: index");

        uint256 execTime = block.timestamp + delay;
        execHash = calcExecHash(_index, _executor, _actions);

        executionTime[execHash] = execTime;
        Collateral memory noCollateral; // TODO: collateral

        emit Scheduled(execHash, msg.sender, _executor, _actions, _proof, _index, execTime, noCollateral);
    }
    
    function execute(uint256 _index, address _executor, Action[] memory _actions)
        auth(this.execute.selector)
        override public
        returns (bytes[] memory execResults)
    {   
        bytes32 execHash = calcExecHash(_index, _executor, _actions);

        require(executionTime[execHash] <= block.timestamp, "queue: wait");
        executionTime[execHash] = EXECUTED;

        execResults = Eaglet(_executor).exec(_actions); // TODO: move interface to standard?
        
        emit Executed(execHash, msg.sender, _executor, execResults, _index);
    }
    

    function challenge(bytes32 _actionHash, bytes memory _reason) auth(this.challenge.selector) override public {
        executionTime[_actionHash] = CHALLENGED;
        Collateral memory noCollateral; // TODO: collateral

        emit Challenged(_actionHash, msg.sender, _reason, noCollateral);
    }

    function veto(bytes32 _actionHash, bytes memory _reason) auth(this.veto.selector) override public {
        executionTime[_actionHash] = CANCELLED;
        Collateral memory noCollateral; // TODO: collateral

        emit Vetoed(_actionHash, msg.sender, _reason, noCollateral);
    }

    function calcExecHash(uint256 _index, address _executor, Action[] memory _actions) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(address(this), _index, _executor, keccak256(abi.encode(_actions))));
    }
}

