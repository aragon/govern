import React from 'react';
import styled from 'styled-components';
import { Tag } from '@aragon/ui';
import { getStateName } from 'utils/states';

export interface StateLabelProps {
  state: string;
  executionTime: number;
}

const getClassName = (state: string, executionTime: number) => {
  return getStateName(state, executionTime).replaceAll(' ', '_').toLowerCase();
};

const StyledTag = styled(Tag)`
  border-radius: 4px;
  color: white;
  &.executable {
    background: #00c2ff;
  }
  &.scheduled {
    background: #ffbc5b;
  }
  &.challenged {
    background: linear-gradient(107.79deg, #ff7984 1.46%, #ffeb94 100%);
  }
  &.executed {
    background: #46c469;
  }
  &.ruled_negatively {
    background: #ff6a60;
  }
  &.rejected {
    background: #ff6a60;
  }
  &.executable {
    background: #00c2ff;
  }
`;

export const StateLabel: React.FC<StateLabelProps> = ({ state, executionTime }) => (
  <StyledTag className={getClassName(state, executionTime)}>
    {getStateName(state, executionTime)}
  </StyledTag>
);
