import { ReactNode } from 'react';
import { Box, StyledText } from '@aragon/ui';
import { Hint } from 'components/Hint/Hint';
import { ActionBuilderState } from 'utils/types';
import { useActionBuilderState } from '../ActionBuilderStateProvider';
import { utils, constants } from 'ethers';

type ActionOption = {
  title: ReactNode;
  subTitle: ReactNode;
  state: ActionBuilderState;
};

const actions: ActionOption[] = [
  {
    title: 'Withdraw assets',
    subTitle: 'helptext',
    state: 'withdrawAssets',
  },
  { title: 'Mint tokens', subTitle: 'helptext', state: 'mintTokens' },
  {
    title: 'External contract',
    subTitle: 'Interact with any contract on the blockchain and access any functionality',
    state: 'abiForm',
  },
];

const haveMinter = (dao: any): boolean => {
  let result = dao?.minter && utils.isAddress(dao.minter) && dao.minter !== constants.AddressZero;

  // temporary until we have dao.minter available in subgraph
  result = true;
  return result;
};

export const ActionSelector = () => {
  const { gotoState, dao } = useActionBuilderState();
  return (
    <>
      <StyledText name={'title1'}>Select Action</StyledText>
      {actions.map((action, i) => {
        if (action.state === 'mintTokens' && !haveMinter(dao)) {
          return null;
        }
        return (
          <Box key={i} shadow>
            <div style={{ cursor: 'pointer' }} onClick={() => gotoState(action.state)}>
              <StyledText name={'title2'}>{action.title}</StyledText>
              <Hint>{action.subTitle}</Hint>
            </div>
          </Box>
        );
      })}
    </>
  );
};
