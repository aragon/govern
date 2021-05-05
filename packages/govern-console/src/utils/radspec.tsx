/* eslint-disable */
import actions from './actions';

export default {
    [actions.APPROVE]: ({ amount }: {amount: number}) => {
        return `Approves ${amount} ANT`
    },
    [actions.SCHEDULE]: () => {
        return `Schedules a new Proposal`
    },
    [actions.CHALLENGE]: () => {
        return `Challenges a new Proposal`
    },
    [actions.EXECUTE]: () => {
        return `Executes a new Proposal`
    },
    [actions.RESOLVE]: () => {
        return `Resolves a new Proposal`
    },
    [actions.VETO]: () => {
        return `Vetos a new Proposal`
    }
}
