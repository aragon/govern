import React from 'react';
import { CreateDaoSteps, accordionItems, stepsNames, CollateralsIndexType } from './Shared';
import { useCreateDao, ICreateDaoCollaterals } from './CreateDaoContextProvider';
import {
  useLayout,
  Grid,
  GridItem,
  Accordion,
  TextInput,
  Switch,
  Box,
  Button,
  StyledText,
  Steps,
  Split,
  Info,
  IconMinus,
  IconPlus,
  IconArrowLeft,
  SPACING,
} from '@aragon/ui';

const CreateDaoCollateral: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<CreateDaoSteps>>;
}> = ({ setActiveStep }) => {
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];
  const { collaterals, setCollaterals } = useCreateDao();
  const {
    scheduellAddress,
    scheduellAmount,
    isScheduellNewDaoToken,
    challengeAddress,
    challengeAmount,
    isChallengeNewDaoToken,
    isAnyAddress,
    executionAddressList,
  } = collaterals;

  const updateCollaterals = (indexType: CollateralsIndexType, value: any) => {
    console.log('updateCollaterals', indexType, value);
    const newCollaterals: ICreateDaoCollaterals = { ...collaterals };
    (newCollaterals[indexType] as any) = value;
    setCollaterals(newCollaterals);
  };

  return (
    <Grid layout={true}>
      <GridItem gridColumn={'1/13'} gridRow={'1/4'}>
        <Box>
          <Grid columns={'4'} columnWidth={'1fr'}>
            <GridItem gridColumn={'2/5'}>
              <Steps steps={stepsNames} activeIdx={2} showProgress={true} />
            </GridItem>
            <GridItem gridColumn={'1/2'} gridRow={'1'} alignVertical={'center'}>
              <StyledText name={'title2'}>Create DAO</StyledText>
            </GridItem>
          </Grid>

          <StyledText name={'title4'}>Collaterals</StyledText>
          <StyledText name={'body3'}>
            In order to schedule or challenge executions, any member must provide this amount of
            collateral, so they have stake in the game and act with the best interest of your DAO.
            By{' '}
            <StyledText name={'body1'} style={{ display: 'inline' }}>
              default Aragon Console uses DAI
            </StyledText>{' '}
            as a collateral token. If you want to change this, provide another contract address in
            or use your newly created DAO Token.
          </StyledText>

          <Info
            mode={'warning'}
            title={''}
            style={{
              marginTop: '20px',
            }}
          >
            Hey, this is an important step, please check that all the information entered is
            correct.
          </Info>

          <StyledText name={'title4'} style={{ marginTop: spacing }}>
            Schedule execution collateral token
          </StyledText>
          <StyledText name={'body3'}>
            Which token do you want to use for schedule execution?
          </StyledText>
          <div style={{ marginTop: 8 }}>
            Custom Token{' '}
            <Switch
              checked={isScheduellNewDaoToken}
              onChange={() => {
                updateCollaterals('isScheduellNewDaoToken', !isScheduellNewDaoToken);
              }}
            />{' '}
            New DAO Token
          </div>
          {!isScheduellNewDaoToken ? (
            <div>
              <StyledText name={'body3'}>Token contract address</StyledText>
              <TextInput
                wide
                placeholder={'Contract address...'}
                value={scheduellAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateCollaterals('scheduellAddress', e.target.value);
                }}
              />
            </div>
          ) : (
            <div>
              <StyledText name={'body3'}>Token contract address</StyledText>
              <TextInput
                wide
                disabled={true}
                placeholder={'The contract address will be avaible after the creation process'}
                value={scheduellAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateCollaterals('scheduellAddress', e.target.value);
                }}
              />
            </div>
          )}
          <StyledText name={'body3'}>Token amount</StyledText>
          <TextInput
            wide
            placeholder={'Token amount...'}
            value={scheduellAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateCollaterals('scheduellAmount', e.target.value);
            }}
          />
          <StyledText name={'title4'} style={{ marginTop: spacing }}>
            Challenge collateral token
          </StyledText>
          <StyledText name={'body3'}>
            Which token do you want to use for challange collateral?
          </StyledText>
          <div style={{ marginTop: 8 }}>
            Custom Token{' '}
            <Switch
              checked={isChallengeNewDaoToken}
              onChange={() => {
                updateCollaterals('isChallengeNewDaoToken', !isChallengeNewDaoToken);
              }}
            />{' '}
            New DAO Token
          </div>
          <StyledText name={'body3'}>Token contract address</StyledText>
          {!isChallengeNewDaoToken ? (
            <div>
              <TextInput
                wide
                placeholder={'Contract address...'}
                value={challengeAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateCollaterals('challengeAddress', e.target.value);
                }}
              />
            </div>
          ) : (
            <TextInput
              wide
              disabled={true}
              placeholder={'The contract address will be avaible after the creation process'}
              value={scheduellAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateCollaterals('scheduellAddress', e.target.value);
              }}
            />
          )}
          <StyledText name={'body3'}>Token amount</StyledText>
          <TextInput
            wide
            placeholder={'Token amount...'}
            value={challengeAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateCollaterals('challengeAmount', e.target.value);
            }}
          />

          <StyledText name={'title4'} style={{ marginTop: spacing }}>
            Schedule execution permissions
          </StyledText>
          <StyledText name={'body3'}>
            If you want you can define the list of addresses that have permission to schedule
            executions in your DAO, so it is not open for anyone
          </StyledText>
          <div style={{ marginTop: 8 }}>
            Address List{' '}
            <Switch
              checked={isAnyAddress}
              onChange={() => {
                updateCollaterals('isAnyAddress', !isAnyAddress);
              }}
            />{' '}
            Any Address
          </div>
          {isAnyAddress ? (
            <Info
              mode={'warning'}
              title={''}
              style={{
                marginTop: '20px',
              }}
            >
              Please be aware that any address has permission to excute scheduels.
            </Info>
          ) : (
            <div>
              {executionAddressList.map((input, index) => (
                <Split
                  key={`exe${index}`}
                  primary={
                    <TextInput
                      wide
                      value={input}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newArr = [...executionAddressList];
                        newArr[index] = e.target.value;
                        updateCollaterals('executionAddressList', newArr);
                      }}
                    />
                  }
                  secondary={
                    <Button
                      mode={'secondary'}
                      size={'large'}
                      disabled={executionAddressList.length === 1}
                      icon={<IconMinus />}
                      onClick={() => {
                        executionAddressList.splice(index, 1);
                        updateCollaterals('executionAddressList', executionAddressList);
                      }}
                    />
                  }
                />
              ))}
              <Button
                mode={'secondary'}
                size={'large'}
                label={'Add new address'}
                icon={<IconPlus />}
                display={'all'}
                onClick={() =>
                  updateCollaterals('executionAddressList', [...executionAddressList, ''])
                }
              />
            </div>
          )}

          <Split
            width={'100%'}
            primary={
              <Button
                style={{ marginTop: spacing }}
                size={'large'}
                mode={'secondary'}
                onClick={() => {
                  setActiveStep(CreateDaoSteps.Config);
                }}
                icon={<IconArrowLeft />}
                label={'back'}
                display={'all'}
              />
            }
            secondary={
              <Button
                style={{ marginTop: spacing, width: '100%' }}
                size={'large'}
                mode={'secondary'}
                onClick={() => {
                  setActiveStep(CreateDaoSteps.Review);
                }}
              >
                Next Step
              </Button>
            }
          />
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
        <Box style={{ background: '#8991FF', opacity: 0.5 }}>
          <h5 style={{ color: '#20232C' }}>Need Help?</h5>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default CreateDaoCollateral;
