import React, { memo } from 'react';
import { Card, Box, useTheme, ButtonIcon, IconUp, IconDown, IconRemove } from '@aragon/ui';
import { ActionInputs } from './ActionInputs';
import { actionType } from 'utils/types';

export type ActionChangeType = 'remove' | 'move-up' | 'move-down';
export type ActionOperation =
  | {
      type: 'add';
      actions: any;
    }
  | { type: ActionChangeType; index: number };

type ActionListProps = {
  fields: Array<actionType & { id: string }>;
  swap: (indexA: number, indexB: number) => void;
  remove: (index?: number) => void;
  register: any;
  selectedActions?: any;
};

type ActionHeaderProps = {
  contractAddress: string;
  index: number;
  count: number;
  swap: (indexA: number, indexB: number) => void;
  remove: (index?: number) => void;
};

const ActionHeader: React.FC<ActionHeaderProps> = memo(function ActionHeader({
  contractAddress,
  index,
  count,
  swap,
  remove,
}) {
  const theme = useTheme();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ alignSelf: 'center' }}>Contract: {contractAddress}</div>
      <div>
        <ButtonIcon label="Up" onClick={index > 0 ? () => swap(index, index - 1) : undefined}>
          <IconUp color={theme.primary} />
        </ButtonIcon>
        <ButtonIcon
          label="Down"
          onClick={index < count - 1 ? () => swap(index, index + 1) : undefined}
        >
          <IconDown color={theme.primary} />
        </ButtonIcon>
        <ButtonIcon label="Remove" onClick={() => remove(index)}>
          <IconRemove color={theme.primary} />
        </ButtonIcon>
      </div>
    </div>
  );
});

const ActionList: React.FC<ActionListProps> = ({ fields, swap, remove, register }) => {
  if (fields && fields.length === 0) {
    return (
      <Card width="auto" height="120px">
        No action yet.
      </Card>
    );
  }

  return (
    <>
      {fields.map((action, index: number) => (
        <Box
          key={action.id}
          heading={
            <ActionHeader
              contractAddress={action.contractAddress}
              index={index}
              count={fields.length}
              remove={remove}
              swap={swap}
            />
          }
        >
          <Box heading={action.name}>
            <ActionInputs action={action} index={index} register={register}></ActionInputs>
          </Box>
        </Box>
      ))}
    </>
  );
};

export default memo(ActionList);
