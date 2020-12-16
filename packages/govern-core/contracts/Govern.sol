/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "erc3k/contracts/IERC3000Executor.sol";
import "erc3k/contracts/IERC3000.sol";

import "@aragon/govern-contract-utils/contracts/acl/ACL.sol";
import "@aragon/govern-contract-utils/contracts/adaptive-erc165/AdaptiveERC165.sol";
import "@aragon/govern-contract-utils/contracts/bitmaps/BitmapLib.sol";

import "./erc1271/ERC1271.sol";

contract Govern is IERC3000Executor, AdaptiveERC165, ERC1271, ACL {
    using BitmapLib for bytes32;

    bytes4 internal constant EXEC_ROLE = this.exec.selector;
    bytes4 internal constant REGISTER_STANDARD_ROLE = this.registerStandardAndCallback.selector;
    bytes4 internal constant SET_SIGNATURE_VALIDATOR_ROLE = this.setSignatureValidator.selector;
    uint256 internal constant MAX_ACTIONS = 256;

    ERC1271 signatureValidator;

    event ETHDeposited(address indexed sender, uint256 value);

    constructor(address _initialExecutor) ACL(address(this)) public {
        initialize(_initialExecutor);
    }

    function initialize(address _initialExecutor) public initACL(address(this)) onlyInit("govern") {
        _grant(EXEC_ROLE, address(_initialExecutor));
        _grant(REGISTER_STANDARD_ROLE, address(this));
        _grant(SET_SIGNATURE_VALIDATOR_ROLE, address(this));

        _registerStandard(ERC3000_EXEC_INTERFACE_ID);
        _registerStandard(type(ERC1271).interfaceId);
    }

    receive () external payable {
        emit ETHDeposited(msg.sender, msg.value);
    }

    fallback () external {
        _handleCallback(msg.sig, msg.data); // WARN: does a low-level return, any code below would be unreacheable
    }

    function exec(ERC3000Data.Action[] memory actions, bytes32 allowFailuresMap, bytes32 memo) override public auth(EXEC_ROLE) returns (bytes32, bytes[] memory) {
        require(actions.length <= MAX_ACTIONS, "govern: too many"); // need to limit since we use 256-bit bitmaps

        bytes[] memory execResults = new bytes[](actions.length);
        bytes32 failureMap = BitmapLib.empty; // start with an empty bitmap

        for (uint256 i = 0; i < actions.length; i++) {
            // TODO: optimize with assembly
            (bool ok, bytes memory ret) = actions[i].to.call{value: actions[i].value}(actions[i].data);
            require(ok || allowFailuresMap.get(uint8(i)), "govern: call");
            // if a call fails, flip that bit to signal failure
            failureMap = ok ? failureMap : failureMap.flip(uint8(i));
            execResults[i] = ret;
        }

        emit Executed(msg.sender, actions, memo, failureMap, execResults);

        return (failureMap, execResults);
    }

    function registerStandardAndCallback(bytes4 _interfaceId, bytes4 _callbackSig, bytes4 _magicNumber) external auth(REGISTER_STANDARD_ROLE) {
        _registerStandardAndCallback(_interfaceId, _callbackSig, _magicNumber);
    }

    function setSignatureValidator(ERC1271 _signatureValidator) external auth(SET_SIGNATURE_VALIDATOR_ROLE) {
        signatureValidator = _signatureValidator;
    }

    function isValidSignature(bytes32 _hash, bytes memory _signature) override public view returns (bytes4) {
        if (address(signatureValidator) == address(0)) return bytes4(0); // invalid magic number
        return signatureValidator.isValidSignature(_hash, _signature); // forward call to set validation contract
    }
}
