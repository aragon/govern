import React, { useEffect } from 'react';
import { CreateDaoSteps } from './utils/Shared';
import { useCreateDaoContext, ICreateDaoBasicInfo } from './utils/CreateDaoContextProvider';
import { useForm, Controller } from 'react-hook-form';
import { validateToken, validateAmountForDecimals } from 'utils/validations';
import { useWallet } from 'AugmentedWallet';
import { PROXY_CONTRACT_URL } from '../../utils/constants';
import {
  useLayout,
  Grid,
  GridItem,
  TextInput,
  ContentSwitcher,
  Checkbox,
  Box,
  Button,
  Info,
  SPACING,
  Link,
} from '@aragon/ui';
import StepsHeader from './components/StepsHeader';

const CreateDaoBasicInfo: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<CreateDaoSteps>>;
}> = ({ setActiveStep }) => {
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];
  const { basicInfo, setBasicInfo } = useCreateDaoContext();

  const context: any = useWallet();
  const { provider } = context;

  const methods = useForm<ICreateDaoBasicInfo>();
  const { control, setValue, watch, getValues, trigger } = methods;

  const {
    daoIdentifier,
    isExistingToken,
    tokenName,
    tokenSymbol,
    tokenAddress,
    tokenDecimals,
    tokenMintAmount,
    isProxy,
  } = basicInfo;

  useEffect(() => {
    setValue('isExistingToken', isExistingToken);
  }, [isExistingToken, setValue]);

  const moveToNextStep = async () => {
    const validate = await trigger();

    if (!validate) return;

    const basicInfoUpdated = { ...basicInfo, ...getValues() };
    setBasicInfo(basicInfoUpdated);
    setActiveStep(CreateDaoSteps.Config);
  };

  return (
    <Box>
      <div style={{ display: 'grid', gridGap: spacing }}>
        <StepsHeader index={0} />

        <Controller
          name="daoIdentifier"
          control={control}
          defaultValue={daoIdentifier}
          rules={{ required: 'This is required.' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextInput
              title="DAO identifier"
              subtitle="Enter the indentifier of your DAO (Use only lower capital characters, without space)"
              wide
              value={value}
              placeholder={'Enter DAO identifier'}
              onChange={onChange}
              status={!!error ? 'error' : 'normal'}
              error={error ? error.message : null}
            />
          )}
        />
        <Controller
          name="isExistingToken"
          control={control}
          defaultValue={isExistingToken}
          render={({ field: { onChange, value } }) => (
            <ContentSwitcher
              title="Create token"
              subtitle="Create a new ERC-20 token for your DAO, or use an existing one"
              onChange={onChange}
              selected={value}
              items={['New Token', 'Existing Token']}
              paddingSettings={{
                horizontal: spacing * 2,
                vertical: spacing / 4,
              }}
            />
          )}
        />

        {!watch('isExistingToken') ? (
          <>
            <Grid>
              <GridItem gridColumn={'1/2'}>
                <Controller
                  name="tokenName"
                  control={control}
                  defaultValue={tokenName}
                  shouldUnregister={true}
                  rules={{ required: 'This is required.' }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextInput
                      title="Token name"
                      subtitle="Enter your token name"
                      wide
                      value={value}
                      placeholder={'Enter your token name...'}
                      onChange={onChange}
                      status={!!error ? 'error' : 'normal'}
                      error={error ? error.message : null}
                    />
                  )}
                />
              </GridItem>
              <GridItem gridColumn={'2/3'}>
                <Controller
                  name="tokenSymbol"
                  control={control}
                  defaultValue={tokenSymbol}
                  shouldUnregister={true}
                  rules={{ required: 'This is required.' }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextInput
                      title="Token symbol"
                      subtitle="Enter your token symbol"
                      wide
                      value={value}
                      placeholder={'Enter your token symbol...'}
                      onChange={onChange}
                      status={!!error ? 'error' : 'normal'}
                      error={error ? error.message : null}
                    />
                  )}
                />
              </GridItem>
            </Grid>
            <Info mode={'warning'} title={''}>
              The created token will use {tokenDecimals} decimals. For the amount, Don't append 0's.
            </Info>
            <Controller
              name="tokenMintAmount"
              control={control}
              defaultValue={tokenMintAmount}
              shouldUnregister={true}
              rules={{
                required: 'This is required.',
                validate: (value) => validateAmountForDecimals(value, tokenDecimals),
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextInput
                  title="Amount of tokens"
                  subtitle="Enter amount of tokens to be minted (they will be sent to your wallet address)..."
                  wide
                  type={'number'}
                  value={value}
                  onChange={onChange}
                  placeholder={'Enter amount'}
                  status={!!error ? 'error' : 'normal'}
                  error={error ? error.message : null}
                />
              )}
            />
          </>
        ) : (
          <Controller
            name="tokenAddress"
            control={control}
            defaultValue={tokenAddress}
            shouldUnregister={true}
            rules={{
              required: 'This is required.',
              validate: (value) => validateToken(value, provider),
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextInput
                title="Token Address"
                subtitle="Enter your token address"
                wide
                value={value}
                placeholder={'Enter token address'}
                onChange={onChange}
                status={!!error ? 'error' : 'normal'}
                error={error ? error.message : null}
              />
            )}
          />
        )}

        <Box shadow>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Controller
              name="isProxy"
              control={control}
              defaultValue={isProxy}
              render={({ field: { onChange, value } }) => (
                <Checkbox checked={value} onChange={onChange} />
              )}
            />
            <span style={{ marginLeft: '4px' }}>Use Aragon Proxies</span>
          </label>
          <div style={{ marginLeft: 32 }}>
            Use <Link href={PROXY_CONTRACT_URL}>Proxies</Link> for the deployment - This will enable
            your DAO to use the already deployed code of the Govern Executer and Queue, and heavily
            decrease gas costs for your DAO deployment.
          </div>
        </Box>
        <Button wide size={'large'} mode={'secondary'} onClick={moveToNextStep}>
          Next Step
        </Button>
      </div>
    </Box>
  );
};

export default CreateDaoBasicInfo;
