import React, { useEffect } from 'react';
import { CreateDaoSteps, accordionItems, stepsNames } from './utils/Shared';
import { useCreateDaoContext, ICreateDaoBasicInfo } from './utils/CreateDaoContextProvider';
import { useForm, Controller } from 'react-hook-form';
import { validateToken, validateAmountForDecimals } from 'utils/validations';
import { useWallet } from 'AugmentedWallet';

import {
  useLayout,
  Grid,
  GridItem,
  Accordion,
  TextInput,
  Switch,
  Checkbox,
  Box,
  Button,
  StyledText,
  Steps,
  Info,
  SPACING,
} from '@aragon/ui';

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
  }, [isExistingToken]);

  const moveToNextStep = async () => {
    const validate = await trigger();

    if (!validate) return;

    const basicInfoUpdated = { ...basicInfo, ...getValues() };
    console.log(basicInfoUpdated, ' ararrr');
    setBasicInfo(basicInfoUpdated);
    setActiveStep(CreateDaoSteps.Config);
  };

  return (
    <Grid layout={true}>
      <GridItem gridColumn={'1/13'} gridRow={'1/4'}>
        <Box>
          <Grid columns={'4'} columnWidth={'1fr'}>
            <GridItem gridColumn={'2/5'}>
              <Steps steps={stepsNames} activeIdx={0} showProgress={true} />
            </GridItem>
            <GridItem gridColumn={'1/2'} gridRow={'1'} alignVertical={'center'}>
              <StyledText name={'title2'}>Create DAO</StyledText>
            </GridItem>
          </Grid>

          <StyledText name={'title4'}>DAO identifier</StyledText>
          <StyledText name={'body3'}>Enter the indentifier of your DAO</StyledText>
          <Controller
            name="daoIdentifier"
            control={control}
            defaultValue={daoIdentifier}
            rules={{ required: 'This is required.' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextInput
                wide
                value={value}
                placeholder={'Enter DAO identifier'}
                onChange={onChange}
                status={!!error ? 'error' : 'normal'}
                error={error ? error.message : null}
              />
            )}
          />

          <StyledText name={'title4'} style={{ marginTop: spacing }}>
            Create token
          </StyledText>
          <StyledText name={'body3'}>Create and define a token for your DAO</StyledText>
          <div style={{ marginTop: 8 }}>
            New Token{' '}
            <Controller
              name="isExistingToken"
              control={control}
              defaultValue={isExistingToken}
              render={({ field: { onChange, value } }) => (
                <Switch checked={value} onChange={onChange} />
              )}
            />
            Existing Token
          </div>
          {!watch('isExistingToken') ? (
            <div>
              <Grid>
                <GridItem gridColumn={'1/2'}>
                  <StyledText name={'title4'} style={{ marginTop: spacing }}>
                    Token name
                  </StyledText>
                  <StyledText name={'body3'}>Enter your token name</StyledText>
                  <Controller
                    name="tokenName"
                    control={control}
                    defaultValue={tokenName}
                    shouldUnregister={true}
                    rules={{ required: 'This is required.' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextInput
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
                  <StyledText name={'title4'} style={{ marginTop: spacing }}>
                    Token symbol
                  </StyledText>
                  <StyledText name={'body3'}>Enter your token symbol</StyledText>
                  <Controller
                    name="tokenSymbol"
                    control={control}
                    defaultValue={tokenSymbol}
                    shouldUnregister={true}
                    rules={{ required: 'This is required.' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextInput
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
              <StyledText name={'title4'} style={{ marginTop: spacing }}>
                Amount of tokens
              </StyledText>
              <StyledText name={'body3'}>
                Enter amount of tokens to be minted (they will be sent to your wallet address)...
              </StyledText>
              <Info
                mode={'warning'}
                title={''}
                style={{
                  marginTop: '20px',
                }}
              >
                The created token will use {tokenDecimals} decimals. For the amount, Don't append
                0's.
              </Info>

              <Controller
                name="tokenMintAmount"
                control={control}
                defaultValue={tokenMintAmount}
                shouldUnregister={true}
                rules={{
                  required: 'This is required.',
                  validate: async (value) => validateAmountForDecimals(value, tokenDecimals),
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextInput
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
            </div>
          ) : (
            <div>
              <StyledText name={'title4'} style={{ marginTop: spacing }}>
                Token Address
              </StyledText>
              <StyledText name={'body3'}>Enter your token address</StyledText>
              <Controller
                name="tokenAddress"
                control={control}
                defaultValue={tokenAddress}
                shouldUnregister={true}
                rules={{
                  required: 'This is required.',
                  validate: async (value) => validateToken(value, provider),
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextInput
                    wide
                    value={value}
                    placeholder={'Enter token address'}
                    onChange={onChange}
                    status={!!error ? 'error' : 'normal'}
                    error={error ? error.message : null}
                  />
                )}
              />
            </div>
          )}

          <Box shadow style={{ marginTop: spacing }}>
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
              Use Proxies for the deployment - This will enable your DAO to use the already deployed
              code of the Govern Executer and Queue, and heavily decrease gas costs for your DAO
              deployment.
            </div>
          </Box>
          <Button
            wide
            size={'large'}
            mode={'secondary'}
            onClick={moveToNextStep}
            style={{ marginTop: spacing }}
          >
            Next Step
          </Button>
        </Box>
      </GridItem>
      <GridItem
        gridRow={layoutName === 'large' ? '1' : undefined}
        gridColumn={layoutName === 'large' ? '13/17' : '1 / -1'}
      >
        <Accordion items={accordionItems}></Accordion>
      </GridItem>
      <GridItem
        gridRow={layoutName === 'large' ? '2' : undefined}
        gridColumn={layoutName === 'large' ? '13/17' : '1 / -1'}
      >
        {/* TODO: To be moved to its own component*/}
        <Box style={{ background: '#8991FF', opacity: 0.5 }}>
          <h5 style={{ color: '#20232C' }}>Need Help?</h5>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default CreateDaoBasicInfo;
