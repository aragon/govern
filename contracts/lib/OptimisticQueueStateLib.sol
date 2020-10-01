/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

library OptimisticQueueStateLib {
    enum State {
        None,
        Scheduled,
        Challenged,
        Approved,
        Cancelled,
        Executed
    }

    struct Item {
        State state;
        uint8 arbitratorRuling;
        address challenger;
    }

    event TransitionedState(State from, State to);

    function requireState(Item storage _item, State _requiredState) internal view {
        require(_item.state == _requiredState, "queue: bad state");
    }

    function setState(Item storage _item, State _state) internal {
        State from = _item.state;
        _item.state = _state;

        emit TransitionedState(from, _state);
    }

    function transitionState(Item storage _item, State _fromState, State _toState) internal {
        requireState(_item, _fromState);
        setState(_item, _toState);
    }
}