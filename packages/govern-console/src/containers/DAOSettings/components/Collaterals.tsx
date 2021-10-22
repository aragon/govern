import styled from 'styled-components';
import { Controller } from 'react-hook-form';
import { TextInput, StyledText, useTheme } from '@aragon/ui';

import { getTokenInfo } from 'utils/token';
import { SetStateAction } from 'react';
import { validateAmountForDecimals, validateToken } from 'utils/validations';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: space-between;
`;

type Props = {
  control: any;
  provider: any;
  onTrigger: any;
  scheduleDecimals: number;
  challengeDecimals: number;
  onScheduleDepositChange: React.Dispatch<SetStateAction<number>>;
  onChallengeDecimalsChange: React.Dispatch<SetStateAction<number>>;
};

const Collaterals: React.FC<Props> = ({
  control,
  provider,
  onTrigger,
  scheduleDecimals,
  challengeDecimals,
  onScheduleDepositChange,
  onChallengeDecimalsChange,
}) => {
  const { disabledContent } = useTheme();

  return (
    <StyledDiv>
      <div>
        <StyledText name={'title3'}>Collaterals</StyledText>
        <StyledText name={'title4'} style={{ color: disabledContent }}>
          In order to schedule or challenge executions, any member must provide this amount of
          collateral, so they have stake in the game and act with the best interest of your DAO.
        </StyledText>
      </div>

      {/* Schedule Execution Collateral */}
      <Controller
        name="daoConfig.scheduleDeposit.token"
        control={control}
        defaultValue=""
        rules={{
          required: 'This is required.',
          validate: async (value) => {
            const v = await validateToken(value, provider);
            if (v !== true) {
              return v;
            }

            let { decimals } = await getTokenInfo(value, provider);
            decimals = decimals || 0;

            onScheduleDepositChange(decimals);
            await onTrigger('daoConfig.scheduleDeposit.amount');
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextInput
            title="Schedule execution collateral"
            onChange={onChange}
            value={value}
            wide
            placeholder={'0x'}
            status={!!error ? 'error' : 'normal'}
            error={error ? error.message : null}
          />
        )}
      />

      {/* Token Amount  */}
      <Controller
        name="daoConfig.scheduleDeposit.amount"
        control={control}
        defaultValue={''}
        rules={{
          required: 'This is required.',
          validate: (value) => validateAmountForDecimals(value, scheduleDecimals),
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextInput
            title={'Token amount'}
            type="number"
            onChange={onChange}
            value={value.toString()}
            wide
            placeholder={'10.0'}
            status={!!error ? 'error' : 'normal'}
            error={error ? error.message : null}
          />
        )}
      />

      {/* Challenge token contract address */}
      <Controller
        name="daoConfig.challengeDeposit.token"
        control={control}
        defaultValue=""
        rules={{
          required: 'This is required.',
          validate: async (value) => {
            const v = await validateToken(value, provider);
            if (v !== true) {
              return v;
            }

            let { decimals } = await getTokenInfo(value, provider);
            decimals = decimals || 0;

            onChallengeDecimalsChange(decimals);

            await onTrigger('daoConfig.challengeDeposit.amount');
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextInput
            title="Challenge collateral token contract address"
            onChange={onChange}
            value={value}
            wide
            placeholder={'0x'}
            status={!!error ? 'error' : 'normal'}
            error={error ? error.message : null}
          />
        )}
      />

      {/* Token Amount */}
      <Controller
        name="daoConfig.challengeDeposit.amount"
        control={control}
        defaultValue={''}
        rules={{
          required: 'This is required.',
          validate: (value) => validateAmountForDecimals(value, challengeDecimals),
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextInput
            type="number"
            title="Token amount"
            onChange={onChange}
            value={value.toString()}
            wide
            placeholder={'10.0'}
            status={!!error ? 'error' : 'normal'}
            error={error ? error.message : null}
          />
        )}
      />
    </StyledDiv>
  );
};

export default Collaterals;
