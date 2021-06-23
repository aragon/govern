import React, { memo } from 'react';
import {
  TextInput,
  Card,
  Box,
  useTheme,
  ButtonIcon,
  IconUp,
  IconDown,
  IconCross,
} from '@aragon/ui';
import { ActionItem } from 'utils/types';
import { Controller, useFormContext } from 'react-hook-form';

type ActionListProps = {
  actions: Array<ActionItem & { id: string }>;
  swap: (indexA: number, indexB: number) => void;
  remove: (index: number) => void;
};

type ActionHeaderProps = {
  contractAddress: string;
  index: number;
  count: number;
  swap: (indexA: number, indexB: number) => void;
  remove: (index: number) => void;
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
          <IconCross color={theme.red} />
        </ButtonIcon>
      </div>
    </div>
  );
});

const ActionList: React.FC<ActionListProps> = ({ actions, swap, remove }) => {
  const { control } = useFormContext();

  if (actions && actions.length === 0) {
    return (
      <Card width="auto" height="120px">
        No action yet.
      </Card>
    );
  }

  return (
    <>
      {actions.map((action, index: number) => (
        <Box
          key={action.id}
          heading={
            <ActionHeader
              contractAddress={action.contractAddress}
              index={index}
              count={actions.length}
              remove={remove}
              swap={swap}
            />
          }
        >
          <Box heading={action.name}>
            {action.inputs.map((input: any, num: number) => {
              const element = (
                <Controller
                  key={`actions.${index}.inputs.${num}.value`}
                  name={`actions.${index}.inputs.${num}.value` as const}
                  control={control}
                  defaultValue={input.value}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextInput
                      wide
                      value={value}
                      onChange={onChange}
                      subtitle={input.type}
                      placeholder={input.name}
                      status={error ? 'error' : 'normal'}
                      error={error ? error.message : null}
                    />
                  )}
                />
              );
              return element;
            })}
          </Box>
        </Box>
      ))}
    </>
  );
};

export default memo(ActionList);
