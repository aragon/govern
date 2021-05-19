import { formatDate } from './date';

export const PROPOSAL_STATES = {
  SCHEDULED: 'Scheduled',
  CHALLENGED: 'Challenged',
  EXECUTED: 'Executed',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  VETOED: 'Vetoed',
  EXECUTABLE: 'Executable',
};

export const PROPOSAL_STATES_COLORS = {
  [PROPOSAL_STATES.SCHEDULED]: 'grey',
  [PROPOSAL_STATES.CHALLENGED]: 'orange',
  [PROPOSAL_STATES.EXECUTED]: 'purple',
  [PROPOSAL_STATES.APPROVED]: 'green',
  [PROPOSAL_STATES.REJECTED]: 'red',
  [PROPOSAL_STATES.VETOED]: 'black',
  [PROPOSAL_STATES.EXECUTABLE]: 'lightBlue',
};

export const eligibleExecution = (time: number) => {
  // add 15 seconds latency due to ethereum's block.timestamp variance by 15 seconds.
  // needed so that user doesn't click the button immediatelly once it's eligible which
  // will cause the tx error due to  `wait more` from the contract.
  time = time + 15000;
  return {
    isEligible: Date.now() >= time,
    eligibleDate: formatDate(time),
  };
};

export const getStateColor = (state: string, executionTime: number) => {
  if (state == PROPOSAL_STATES.SCHEDULED && eligibleExecution(executionTime).isEligible) {
    return PROPOSAL_STATES_COLORS[PROPOSAL_STATES.EXECUTABLE];
  }

  return PROPOSAL_STATES_COLORS[state];
};

export const getState = (state: string, executionTime: number) => {
  if (state == PROPOSAL_STATES.SCHEDULED && eligibleExecution(executionTime).isEligible) {
    return 'Executable';
  }
  if (state == PROPOSAL_STATES.APPROVED) {
    return 'Ruled positively';
  }
  if (state == PROPOSAL_STATES.REJECTED) {
    return 'Ruled negatively';
  }

  return state;
};
