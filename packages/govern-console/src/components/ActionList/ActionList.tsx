import React, { memo, FormEvent } from 'react';
import { TextInput, Card, Box, Button, IconUp, IconDown, IconRemove, useTheme } from '@aragon/ui';

type ActionListProps = {
  selectedActions?: any;
  onAddInputToAction: any;
  actionsToSchedule: any;
};

type ActionHeaderProps = {
  contractAddress: string;
};

const ActionHeader: React.FC<ActionHeaderProps> = memo(function ActionHeader({ contractAddress }) {
  const theme = useTheme();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ alignSelf: 'center' }}>Contract: {contractAddress}</div>
      <div>
        <Button mode={'secondary'} display="icon" icon={<IconUp />} label="Up" />
        <Button mode={'secondary'} display="icon" icon={<IconDown />} label="Down" />
        <Button mode={'secondary'} display="icon" icon={<IconRemove />} label="Remove" />
      </div>
    </div>
  );
});

const ActionList: React.FC<ActionListProps> = ({ selectedActions, onAddInputToAction }) => {
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
        heading={<ActionHeader contractAddress={action.contractAddress} />}
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
