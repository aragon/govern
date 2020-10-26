/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "../initializable/Initializable.sol";

library ACLData {
    enum BulkOp { Grant, Revoke, Freeze }

    struct BulkItem {
        BulkOp op;
        bytes4 role;
        address who;
    }
}

contract ACL is Initializable {
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
        require(
            roles[_role][msg.sender] ||  // sender authorized
            roles[_role][ANY_ADDR],      // or anyone allowed
            "acl: auth"
        );
        _;
    }
    
    constructor(address _initialRoot) public {
        _initializeACL(_initialRoot);
    }

    function _initializeACL(address _initialRoot) internal onlyInit("acl") {
        _grant(ROOT_ROLE, _initialRoot);
    }

    function grant(bytes4 _role, address _who) external auth(ROOT_ROLE) {
        _grant(_role, _who);
    }

    function revoke(bytes4 _role, address _who) external auth(ROOT_ROLE) {
        _revoke(_role, _who);
    }

    function freeze(bytes4 _role) external auth(ROOT_ROLE) {
        _freeze(_role);
    }

    function bulk(ACLData.BulkItem[] memory items) public auth(ROOT_ROLE) {
        for (uint256 i = 0; i < items.length; i++) {
            ACLData.BulkItem memory item = items[i];

            if (item.op == ACLData.BulkOp.Grant) _grant(item.role, item.who);
            else if (item.op == ACLData.BulkOp.Revoke) _revoke(item.role, item.who);
            else if (item.op == ACLData.BulkOp.Freeze) _freeze(item.role);
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