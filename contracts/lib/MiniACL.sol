/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

contract MiniACL {
    bytes4 internal constant ROOT_ROLE =
        this.grant.selector
        ^ this.revoke.selector
        ^ this.freeze.selector
    ;

    address internal constant FREEZE_ADDR = address(1);
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
        _grant(ROOT_ROLE, _initialRoot);
    }

    function grant(bytes4 _role, address _who) external auth(ROOT_ROLE) {
        _grant(_role, _who);
    }

    function _grant(bytes4 _role, address _who) internal {
        require(!isFrozen(_role), "acl: frozen");
        
        roles[_role][_who] = true;
        emit Granted(_role, msg.sender, _who);
    }

    function revoke(bytes4 _role, address _who) external auth(ROOT_ROLE) {
        require(!isFrozen(_role), "acl: frozen");

        roles[_role][_who] = false;
        emit Revoked(_role, msg.sender, _who);
    }

    function freeze(bytes4 _role) external auth(ROOT_ROLE) {
        require(!isFrozen(_role), "acl: frozen");

        roles[_role][FREEZE_ADDR] = true;

        emit Frozen(_role, msg.sender);
    }

    function isFrozen(bytes4 _role) public view returns (bool) {
        return roles[_role][FREEZE_ADDR];
    }
}