import React, { useMemo, useState } from 'react';
import addressIcon from '../../images/connected-user-icon.svg';
import { CreateDaoSteps, configArray, basicInfoArray, collateralArray } from './utils/Shared';
import { useCreateDaoContext } from './utils/CreateDaoContextProvider';
import { useWallet } from 'providers/AugmentedWallet';
import { trackEvent, EventType } from 'services/analytics';

import {
  useLayout,
  Grid,
  GridItem,
  Box,
  Button,
  ButtonText,
  StyledText,
  Info,
  DataView,
  Modal,
  AddressField,
} from '@aragon/ui';
import StepsHeader from './components/StepsHeader';
import { networkEnvironment } from 'environment';

const CreateDaoReview: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<CreateDaoSteps>>;
}> = ({ setActiveStep }) => {
  const { networkName } = networkEnvironment;
  const context: any = useWallet();
  const { isConnected } = context;

  const { layoutName } = useLayout();
  const { basicInfo, config, collaterals } = useCreateDaoContext();
  const [opened, setOpened] = useState(false);
  // prepare data for the <DataView>
  const basicInfoData = useMemo(() => basicInfoArray(basicInfo), [basicInfo]);
  const configData = useMemo(() => configArray(config), [config]);
  const collateralData = useMemo(() => {
    const datas = collateralArray(collaterals);
    if (collaterals.executionAddressList.length > 0) {
      const dataModified = datas.map((data) => {
        if (typeof data.value !== 'string') {
          return {
            name: data.name,
            value: (
              <ButtonText onClick={() => setOpened(true)}>
                {collaterals.executionAddressList.length} addresses
              </ButtonText>
            ),
          };
        }
        return data;
      });
      return dataModified;
    }

    return datas;
  }, [collaterals]);

  return (
    <>
      <Modal visible={opened} onClose={() => setOpened(false)}>
        <StyledText name="title2">Schedule transaction whitelist addresses</StyledText>
        {collaterals.executionAddressList.map((addr, i) => (
          <div key={`address-${i}`} style={{ marginTop: 10 }}>
            <AddressField
              address={addr}
              icon={<img width="30" height="30" src={addressIcon} alt="" />}
            />
          </div>
        ))}
      </Modal>

      <Box>
        <StepsHeader index={3} />

        <Info
          mode={'warning'}
          title={''}
          style={{
            marginTop: '20px',
          }}
        >
          Check that your settings are correct. Some of these settings cannot be modified once the
          DAO has been created.
        </Info>

        <Grid columns={'2'} columnWidth={'1fr'} style={{ marginTop: 20 }}>
          <GridItem gridRow={'1'} alignHorizontal={'flex-start'}>
            <StyledText name={layoutName !== 'small' ? 'title3' : 'title4'}>Basic Info</StyledText>
          </GridItem>
          <GridItem gridRow={'1'} alignHorizontal={'flex-end'}>
            <ButtonText
              onClick={() => {
                setActiveStep(CreateDaoSteps.BasicInfo);
              }}
            >
              Edit Basic Info
            </ButtonText>
          </GridItem>
        </Grid>

        <DataView
          fields={['', '']}
          entries={basicInfoData}
          renderEntry={({ name, value }: { name: string; value: string }) => {
            return [
              <StyledText name={'body3'} key={'basicInfoData'}>
                {name}
              </StyledText>,
              <StyledText name={'body3'} key={'basicInfoDatab'}>
                {value}
              </StyledText>,
            ];
          }}
        />

        <Grid columns={'2'} columnWidth={'1fr'} style={{ marginTop: 20 }}>
          <GridItem gridRow={'1'} alignHorizontal={'flex-start'}>
            <StyledText name={layoutName !== 'small' ? 'title3' : 'title4'}>Config</StyledText>
          </GridItem>
          <GridItem gridRow={'1'} alignHorizontal={'flex-end'}>
            <ButtonText
              onClick={() => {
                setActiveStep(CreateDaoSteps.Config);
              }}
            >
              Edit Config
            </ButtonText>
          </GridItem>
        </Grid>

        <DataView
          fields={['', '']}
          entries={configData}
          renderEntry={({ name, value }: { name: string; value: string }) => {
            return [
              <StyledText name={'body3'} key={'configData'}>
                {name}
              </StyledText>,
              <StyledText name={'body3'} key={'configDatab'}>
                {value}
              </StyledText>,
            ];
          }}
        />

        <Grid columns={'2'} columnWidth={'1fr'} style={{ marginTop: 20 }}>
          <GridItem gridRow={'1'} alignHorizontal={'flex-start'}>
            <StyledText name={layoutName !== 'small' ? 'title3' : 'title4'}>Collaterals</StyledText>
          </GridItem>
          <GridItem gridRow={'1'} alignHorizontal={'flex-end'}>
            <ButtonText
              onClick={() => {
                setActiveStep(CreateDaoSteps.Collateral);
              }}
            >
              Edit Collaterals
            </ButtonText>
          </GridItem>
        </Grid>

        <DataView
          fields={['', '']}
          entries={collateralData}
          renderEntry={({ name, value }: { name: string; value: string }) => {
            return [
              <StyledText name={'body3'} key={'collateralData'}>
                {name}
              </StyledText>,
              <StyledText name={'body3'} key={'collateralDatab'}>
                {value}
              </StyledText>,
            ];
          }}
        />
        {/* <br /> */}
        {!isConnected && (
          <React.Fragment>
            <br />
            <Info mode={'warning'} title={''}>
              Connect your wallet to be able to create a dao.
            </Info>
          </React.Fragment>
        )}

        <Button
          wide
          disabled={!isConnected}
          size={'large'}
          mode={'primary'}
          style={{ marginTop: 20 }}
          onClick={() => {
            // analytics
            trackEvent(EventType.DAO_CREATEBTN_CLICKED, { network: networkName });

            setActiveStep(CreateDaoSteps.Progress);
          }}
        >
          Confirm and create your DAO
        </Button>
      </Box>
    </>
  );
};

export default CreateDaoReview;
