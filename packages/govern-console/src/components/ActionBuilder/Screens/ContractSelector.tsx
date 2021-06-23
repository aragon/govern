import { ReactNode } from 'react';
import { Box, StyledText } from '@aragon/ui';
import { Hint } from 'components/Hint/Hint';
import { ContractId } from 'utils/types';
import { useActionBuilderState } from '../ActionBuilderStateProvider';

type ContractOption = {
  title: ReactNode;
  subTitle: ReactNode;
  id: ContractId;
};

const contracts: ContractOption[] = [
  {
    title: 'Govern Queue',
    subTitle: 'This contract enables you to ...',
    id: 'queue',
  },
  { title: 'Govern Executor', subTitle: 'helptext', id: 'executor' },
  {
    title: 'Govern Minter',
    subTitle: 'Helptext',
    id: 'minter',
  },
  {
    title: 'External contract',
    subTitle: 'Helptext',
    id: 'external',
  },
];

export const ContractSelector = () => {
  const { gotoAbiForm } = useActionBuilderState();

  return (
    <>
      <StyledText name={'title1'}>Choose Contract</StyledText>
      {contracts.map((contract, i) => {
        return (
          <Box key={i} shadow>
            <div style={{ cursor: 'pointer' }} onClick={() => gotoAbiForm(contract.id)}>
              <StyledText name={'title2'}>{contract.title}</StyledText>
              <Hint>{contract.subTitle}</Hint>
            </div>
          </Box>
        );
      })}
    </>
  );
};
