import {
  Box,
  Grid,
  Link,
  Checkbox,
  GridItem,
  useTheme,
  IconBlank,
  TextCopy,
  TextInput,
  StyledText,
} from '@aragon/ui';
import styled from 'styled-components';
import { Controller } from 'react-hook-form';

import { validateContract } from 'utils/validations';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: space-between;
`;

type Props = {
  executorAddress: string;
  tokenAddress: string;
  queueAddress: string;
  control: any;
  provider: any;
  resolverLock: boolean;
  onResolverLockChange: (lock: boolean) => void;
};

const Resolver: React.FC<Props> = ({
  control,
  provider,
  tokenAddress,
  queueAddress,
  resolverLock,
  executorAddress,
  onResolverLockChange,
}) => {
  const { disabledContent } = useTheme();

  return (
    <div>
      <StyledDiv>
        <TextCopy title={'DAO Govern Executor Address'} value={executorAddress} />
        <TextCopy title={'DAO Token address'} value={tokenAddress} />
        <TextCopy title={'DAO Queue address'} value={queueAddress} />

        <div>
          <StyledText name={'title3'}>Resolver</StyledText>
          <StyledText name={'title4'} style={{ color: disabledContent }}>
            The resolver is a smart contract that can handle disputes in your DAO and follows the
            ERC3k interface. By default your DAO will use Aragon Court as a resolver.{' '}
            <Link href="https://court.aragon.org/">Learn more</Link>
          </StyledText>
        </div>
      </StyledDiv>

      <Box>
        <Grid>
          <GridItem gridColumn={'1/6'} gridRow={'1'}>
            <Controller
              name="daoConfig.resolver"
              control={control}
              defaultValue={''}
              rules={{
                required: 'This is required.',
                validate: (value) => {
                  return validateContract(value, provider);
                },
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextInput
                  wide
                  disabled={!resolverLock}
                  value={value}
                  placeholder={'Resolver address'}
                  adornment={<IconBlank />}
                  adornmentPosition="end"
                  onChange={onChange}
                  status={!!error ? 'error' : 'normal'}
                  error={error ? error.message : null}
                />
              )}
            />
          </GridItem>
          <GridItem
            gridColumn={'6/7'}
            gridRow={'1'}
            alignVertical={'center'}
            alignHorizontal={'center'}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Checkbox
                checked={resolverLock}
                onChange={() => onResolverLockChange(!resolverLock)}
              />
              <span
                style={{
                  marginLeft: '4px',
                }}
              >
                Override default resolver
              </span>
            </label>
          </GridItem>
        </Grid>
      </Box>
    </div>
  );
};

export default Resolver;
