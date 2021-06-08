import React, { useState } from 'react';
import { CreateDaoSteps, accordionItems, stepsNames } from './Shared';
import { useCreateDao, ICreateDaoConfig } from './CreateDaoContextProvider';
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
  IconBlank,
  Info,
  Link,
  SPACING,
  IconArrowLeft,
  Split,
} from '@aragon/ui';
import { toUTF8String } from 'utils/lib';
import { toUtf8Bytes } from '@ethersproject/strings';

const CreateDaoConfig: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<CreateDaoSteps>>;
}> = ({ setActiveStep }) => {
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];
  const [resolverLock, setResolverLock] = useState(false);
  const { config, setConfig } = useCreateDao();
  const { executionDelay, isRuleFile, ruleText, resolver } = config;

  const updateConfig = (
    indexType: 'executionDelay' | 'isRuleFile' | 'ruleFile' | 'ruleText' | 'resolver',
    value: any,
  ) => {
    const newConfig: ICreateDaoConfig = { ...config };
    (newConfig[indexType] as any) = value;
    setConfig(newConfig);
  };

  return (
    <Grid layout={true}>
      <GridItem gridColumn={'1/13'} gridRow={'1/4'}>
        <Box>
          <Grid columns={'4'} columnWidth={'1fr'}>
            <GridItem gridColumn={'2/5'}>
              <Steps steps={stepsNames} activeIdx={1} showProgress={true} />
            </GridItem>
            <GridItem gridColumn={'1/2'} gridRow={'1'} alignVertical={'center'}>
              <StyledText name={'title2'}>Create DAO</StyledText>
            </GridItem>
          </Grid>

          <StyledText name={'title4'}>Execution delay</StyledText>
          <StyledText name={'body3'}>
            Amount of time any action in your DAO will be available to be challenged before bein
            executed
          </StyledText>
          <TextInput
            wide
            placeholder={'Amount'}
            value={executionDelay}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateConfig('executionDelay', e.target.value);
            }}
          />

          <StyledText name={'title4'} style={{ marginTop: spacing }}>
            Rules / Agreement
          </StyledText>
          <StyledText name={'body3'}>
            Your DAO have optimistic capabilities, meaning that actions can happen without voting,
            but should follow pre defined rules. Please provide the main agreement for your DAO (In
            text, or upload a file).
          </StyledText>
          <div style={{ marginTop: 8 }}>
            Text{' '}
            <Switch
              checked={isRuleFile}
              onChange={() => {
                updateConfig('isRuleFile', !isRuleFile);
              }}
            />{' '}
            File
          </div>
          {!isRuleFile ? (
            <div>
              <StyledText name={'title4'} style={{ marginTop: spacing }}>
                Text
              </StyledText>
              <StyledText name={'body3'}>Rules in text</StyledText>
              <TextInput.Multiline
                wide
                placeholder={'Enter Rules...'}
                value={toUTF8String(ruleText)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateConfig('ruleText', toUtf8Bytes(e.target.value));
                }}
              />
            </div>
          ) : (
            <div>
              <StyledText name={'title4'} style={{ marginTop: spacing }}>
                File
              </StyledText>
              <StyledText name={'body3'}>Upload file</StyledText>
              <input
                type={'file'}
                // value={ruleFile.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const files: FileList | null = e.target.files;
                  if (files) {
                    updateConfig('ruleFile', files[0]);
                  }
                }}
              />
            </div>
          )}
          <StyledText name={'title4'} style={{ marginTop: spacing }}>
            Resolver
          </StyledText>
          <StyledText name={'body3'}>
            The resolver is a smart contract that can handle disputes in your DAO and follows the
            ERC3k interface. By default your DAO will use Aragon Court as a resolver.{' '}
            <Link href="https://court.aragon.org/">Learn more</Link>
          </StyledText>
          <Box>
            <Grid>
              <GridItem gridColumn={'1/6'} gridRow={'1'}>
                <TextInput
                  wide
                  disabled={!resolverLock}
                  value={resolver}
                  placeholder={'Resolver address'}
                  adornment={<IconBlank />}
                  adornmentPosition="end"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateConfig('resolver', e.target.value);
                  }}
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
                    onChange={() => {
                      setResolverLock(!resolverLock);
                    }}
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
          <Split
            width={'100%'}
            primary={
              <Button
                style={{ marginTop: spacing }}
                size={'large'}
                mode={'secondary'}
                onClick={() => {
                  setActiveStep(CreateDaoSteps.BasicInfo);
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
                  setActiveStep(CreateDaoSteps.Collateral);
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

export default CreateDaoConfig;
