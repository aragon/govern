import React from 'react';
import { BigNumber } from 'ethers';
import { CreateDaoSteps, accordionItems, stepsNames, BasicInfoIndexType } from './Shared';
import { useCreateDao, ICreateDaoBasicInfo } from './CreateDaoContextProvider';
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
  SPACING,
} from '@aragon/ui';

const CreateDaoBasicInfo: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<CreateDaoSteps>>;
}> = ({ setActiveStep }) => {
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];
  const { basicInfo, setBasicInfo } = useCreateDao();

  const {
    daoIdentifier,
    isExistingToken,
    tokenName,
    tokenSymbol,
    tokenAddress,
    tokenMintAmount,
    isProxy,
  } = basicInfo;

  const updateBasicInfo = (indexType: BasicInfoIndexType, value: any) => {
    const NewBasicInfo: ICreateDaoBasicInfo = { ...basicInfo };
    (NewBasicInfo[indexType] as any) = value;
    setBasicInfo(NewBasicInfo);
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
          <TextInput
            wide
            value={daoIdentifier}
            placeholder={'Enter DAO identifier'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateBasicInfo('daoIdentifier', e.target.value);
            }}
          />

          <StyledText name={'title4'} style={{ marginTop: spacing }}>
            Create token
          </StyledText>
          <StyledText name={'body3'}>Create and define a token for your DAO</StyledText>
          <div style={{ marginTop: 8 }}>
            New Token{' '}
            <Switch
              checked={isExistingToken}
              onChange={() => {
                updateBasicInfo('isExistingToken', !isExistingToken);
              }}
            />{' '}
            Existing Token
          </div>
          {!isExistingToken ? (
            <div>
              <Grid>
                <GridItem gridColumn={'1/2'}>
                  <StyledText name={'title4'} style={{ marginTop: spacing }}>
                    Token name
                  </StyledText>
                  <StyledText name={'body3'}>Enter your token name</StyledText>
                  <TextInput
                    wide
                    value={tokenName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateBasicInfo('tokenName', e.target.value);
                    }}
                    placeholder={'Enter your token name...'}
                  />
                </GridItem>
                <GridItem gridColumn={'2/3'}>
                  <StyledText name={'title4'} style={{ marginTop: spacing }}>
                    Token symbol
                  </StyledText>
                  <StyledText name={'body3'}>Enter your token symbol</StyledText>
                  <TextInput
                    wide
                    value={tokenSymbol}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateBasicInfo('tokenSymbol', e.target.value);
                    }}
                    placeholder={'Enter your token symbol'}
                  />
                </GridItem>
              </Grid>
              <StyledText name={'title4'} style={{ marginTop: spacing }}>
                Amount of tokens
              </StyledText>
              <StyledText name={'body3'}>
                Enter amount of tokens to be minted (they will be sent to your wallet address)...
              </StyledText>
              <TextInput
                wide
                type={'number'}
                value={tokenMintAmount?.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  // typeof e.target.value === 'number' &&
                  updateBasicInfo('tokenMintAmount', BigNumber.from(e.target.value));
                }}
                placeholder={'Enter amount'}
              />
            </div>
          ) : (
            <div>
              <StyledText name={'title4'} style={{ marginTop: spacing }}>
                Token Address
              </StyledText>
              <StyledText name={'body3'}>Enter your token address</StyledText>
              <TextInput
                wide
                value={tokenAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateBasicInfo('tokenAddress', e.target.value);
                }}
                placeholder={'Enter token address'}
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
              <Checkbox checked={isProxy} onChange={() => updateBasicInfo('isProxy', !isProxy)} />
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
            onClick={() => {
              setActiveStep(CreateDaoSteps.Config);
            }}
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
