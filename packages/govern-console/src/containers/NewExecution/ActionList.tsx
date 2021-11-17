import React, { memo } from 'react';
import {
  TextInput,
  Card,
  Box,
  useTheme,
  useLayout,
  ButtonIcon,
  IconUp,
  IconDown,
  IconCross,
  GU,
  Grid,
  StyledText,
  Help,
  SPACING,
} from '@aragon/ui';
import { ActionItem } from 'utils/types';
import { Controller, useFormContext } from 'react-hook-form';
import { getTruncatedAccountAddress } from 'utils/account';
import ActionInputText from '../../components/ActionBuilder/ActionInputText';
import ActionInputContainer from 'components/ActionBuilder/ActionInputContainer';

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
  const { layoutName } = useLayout();

  return (
    <div
      style={{
        display: 'grid',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gridAutoFlow: `${layoutName === 'small' ? 'row' : 'column'}`,
        gridTemplateColumns: `${layoutName === 'small' ? '1fr' : 'auto 100px'}`,
      }}
    >
      <div>
        Contract:{' '}
        <span>
          {layoutName === 'small' ? getTruncatedAccountAddress(contractAddress) : contractAddress}
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          justifyContent: `${layoutName === 'small' ? 'space-between' : 'end'}`,
        }}
      >
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
        </div>
        <div>
          <ButtonIcon label="Remove" onClick={() => remove(index)}>
            <IconCross color={theme.red} />
          </ButtonIcon>
        </div>
      </div>
    </div>
  );
});

const ActionList: React.FC<ActionListProps> = ({ actions, swap, remove }) => {
  const { control } = useFormContext();
  const theme = useTheme();
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];

  if (actions && actions.length === 0) {
    return (
      <Card width="auto" height={`${15 * GU}px`}>
        No transaction yet.
      </Card>
    );
  }

  return (
    <div>
      {actions.map((action, index: number) => (
        <Box
          css={`
            & > h1 {
              height: auto !important;
            }
          `}
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
            <Grid>
              {action.inputs.map((input: any, num: number) => {
                if (action.name === 'veto' && input.name === '_container') {
                  return (
                    <ActionInputContainer
                      key={`actions.${index}.inputs.${num}`}
                      input={input}
                      inputNum={num}
                      actionIndex={index}
                      formControl={control}
                      queueId={action.contractAddress}
                    />
                  );
                }
                return (
                  <ActionInputText
                    key={`actions.${index}.inputs.${num}`}
                    input={input}
                    inputNum={num}
                    actionIndex={index}
                    formControl={control}
                  />
                );
              })}
              {action.payable && (
                <div>
                  <StyledText name="body2">
                    <div
                      style={{
                        display: 'flex',
                        columnGap: `${spacing}px`,
                        alignItems: 'center',
                        color: `${theme.disabledContent}`,
                      }}
                    >
                      <div>payable amount</div>
                      <div>
                        <Help hint="What is payable amount?">
                          The amount of ether to forward to the contract
                        </Help>
                      </div>
                    </div>
                  </StyledText>
                  <Controller
                    name={`actions.${index}.payableAmount` as const}
                    control={control}
                    defaultValue={action.payableAmount}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextInput
                        wide
                        value={value}
                        onChange={onChange}
                        placeholder="ether"
                        status={error ? 'error' : 'normal'}
                        error={error ? error.message : null}
                      />
                    )}
                  />
                </div>
              )}
            </Grid>
          </Box>
        </Box>
      ))}
    </div>
  );
};

export default memo(ActionList);
