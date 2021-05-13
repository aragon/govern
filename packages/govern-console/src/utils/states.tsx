/* eslint-disable */
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

export const isEligibleForExecution = (time: number) => {
  return Date.now() >= time * 1000;
};

export const getStateColor = (state: string, executionTime: number) => {
  if (state == PROPOSAL_STATES.SCHEDULED && isEligibleForExecution(executionTime)) {
    return PROPOSAL_STATES_COLORS[PROPOSAL_STATES.EXECUTABLE];
  }

  return PROPOSAL_STATES_COLORS[state];
};

export const getState = (state: string, executionTime: number) => {
  if (state == PROPOSAL_STATES.SCHEDULED && isEligibleForExecution(executionTime)) {
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
