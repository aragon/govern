/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

library MiniACLData {
    // Note: Rename to op code
    enum BulkOp { Grant, Revoke, Freeze }

    // Note: Rename to ACL action, change, or instruction
    struct BulkItem {
        BulkOp op;
        bytes4 role;
        address who;
    }
}

// Note: what about using simply "ACL"? let's try to forget about previous implementations
contract MiniACL {
    bytes4 public constant ROOT_ROLE =
        this.grant.selector
        ^ this.revoke.selector
        ^ this.freeze.selector
        ^ this.bulk.selector
    ;

    address internal constant FREEZE_FLAG = address(1);
    address internal constant ANY_ADDR = address(-1);
    
    mapping (bytes4 => mapping (address => bool)) public roles;

    event Granted(bytes4 indexed role, address indexed actor, address indexed who);
    event Revoked(bytes4 indexed role, address indexed actor, address indexed who);
    event Frozen(bytes4 indexed role, address indexed actor);

    modifier auth(bytes4 _role) {
        // Note: We can figure out a minimal ACL oracle interface
        require(
            roles[_role][msg.sender] ||  // sender authorized
            roles[_role][ANY_ADDR],      // or anyone allowed
            "acl: auth"
        );
        _;
    }
    
    constructor(address _initialRoot) public {
        _grant(ROOT_ROLE, _initialRoot);
    }

    function grant(bytes4 _role, address _who) external auth(ROOT_ROLE) {
        _grant(_role, _who);
    }

    function revoke(bytes4 _role, address _who) external auth(ROOT_ROLE) {
        _revoke(_role, _who);
    }

    // Note: I'm a bit hesitant about this, if the root is trustless enough we should be able to get rid of this
    function freeze(bytes4 _role) external auth(ROOT_ROLE) {
        _freeze(_role);
    }

    function bulk(MiniACLData.BulkItem[] memory items) public auth(ROOT_ROLE) {
        for (uint256 i = 0; i < items.length; i++) {
            MiniACLData.BulkItem memory item = items[i];

            if (item.op == MiniACLData.BulkOp.Grant) _grant(item.role, item.who);
            else if (item.op == MiniACLData.BulkOp.Revoke) _revoke(item.role, item.who);
            else if (item.op == MiniACLData.BulkOp.Freeze) _freeze(item.role);
        }
    }

    function _grant(bytes4 _role, address _who) internal {
        require(!isFrozen(_role), "acl: frozen");
        require(_who != FREEZE_FLAG, "acl: bad freeze");
        
        roles[_role][_who] = true;
        emit Granted(_role, msg.sender, _who);
    }

    function _revoke(bytes4 _role, address _who) internal {
        require(!isFrozen(_role), "acl: frozen");

        roles[_role][_who] = false;
        emit Revoked(_role, msg.sender, _who);
    }

    function _freeze(bytes4 _role) internal {
        require(!isFrozen(_role), "acl: frozen");

        roles[_role][FREEZE_FLAG] = true;

        emit Frozen(_role, msg.sender);
    }

    function isFrozen(bytes4 _role) public view returns (bool) {
        return roles[_role][FREEZE_FLAG];
    }
}