import React, { memo, FormEvent } from 'react';
import { TextInput, Card, Box, ButtonIcon, IconUp, IconDown, IconCross } from '@aragon/ui';

export type ActionChangeType = 'remove' | 'move-up' | 'move-down';
export type ActionOperation =
  | {
      type: 'add';
      actions: any;
    }
  | { type: ActionChangeType; index: number };

type ActionListProps = {
  selectedActions?: any;
  onActionChange: (op: ActionOperation) => void;
  onAddInputToAction: any;
  actionsToSchedule: any;
};

type ActionHeaderProps = {
  contractAddress: string;
  dispatchChange: (type: ActionChangeType) => void;
};

const ActionHeader: React.FC<ActionHeaderProps> = memo(function ActionHeader({
  contractAddress,
  dispatchChange,
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ alignSelf: 'center' }}>Contract: {contractAddress}</div>
      <div>
        <ButtonIcon label="Up" onClick={() => dispatchChange('move-up')}>
          <IconUp css={``} />
        </ButtonIcon>
        <ButtonIcon label="Down" onClick={() => dispatchChange('move-down')}>
          <IconDown />
        </ButtonIcon>
        <ButtonIcon display="icon" label="Remove" onClick={() => dispatchChange('remove')}>
          <IconCross />
        </ButtonIcon>
      </div>
    </div>
  );
});

const ActionList: React.FC<ActionListProps> = ({
  selectedActions,
  onAddInputToAction,
  onActionChange,
}) => {
  if (selectedActions.length === 0) {
    return (
      <Card width="auto" height="120px">
        No action yet.
      </Card>
    );
  }

  return selectedActions.map((action: any, index: number) => {
    return (
      <Box
        key={`action-${index}`}
        heading={
          <ActionHeader
            contractAddress={action.contractAddress}
            dispatchChange={(type: ActionChangeType) => {
              onActionChange({ type, index });
            }}
          />
        }
      >
        <Box heading={action.name}>
          {action.item.inputs.map((input: any, num: number) => {
            const element = (
              <TextInput
                key={`input-${index}-${num}`}
                subtitle={input.type}
                type={input.type}
                onChange={(e: FormEvent<HTMLInputElement>) => {
                  onAddInputToAction(
                    e.currentTarget.value,
                    action.contractAddress,
                    action.abi,
                    index,
                    num,
                    action.name,
                  );
                }}
                wide
                placeholder={input.name}
              />
            );
            return element;
          })}
        </Box>
      </Box>
    );
  });
};

export default memo(ActionList);
