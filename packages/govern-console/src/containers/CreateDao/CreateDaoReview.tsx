import React, { useMemo, useState } from 'react';
import cardMainImage from '../../images/pngs/review_create_dao@2x.png';
import addressIcon from '../../images/connected-user-icon.svg';
import {
  CreateDaoSteps,
  stepsNames,
  configArray,
  basicInfoArray,
  collateralArray,
} from './utils/Shared';
import { useCreateDaoContext } from './utils/CreateDaoContextProvider';
import {
  useLayout,
  Grid,
  GridItem,
  EmptyStateCard,
  Box,
  Button,
  ButtonText,
  StyledText,
  Steps,
  Info,
  DataView,
  Modal,
  AddressField,
} from '@aragon/ui';

const CreateDaoReview: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<CreateDaoSteps>>;
}> = ({ setActiveStep }) => {
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
        if (data.name === 'Excutors Addresses') {
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

  // address modal

  const cardText = (
    <div>
      <StyledText name={'title3'}>Please, take your time and review all the info!</StyledText>
      <StyledText name={'body3'}>
        This is an important step for your DAO, we need to take care every information is perfect
      </StyledText>
    </div>
  );
  const cardIamge = <img style={{ width: '150px' }} src={cardMainImage}></img>;

  return (
    <>
      <Modal visible={opened} onClose={() => setOpened(false)}>
        <StyledText name="title2">Schedule execution permission addresses</StyledText>
        {collaterals.executionAddressList.map((addr, i) => (
          <div key={`address-${i}`} style={{ marginTop: 10 }}>
            <AddressField
              address={addr}
              icon={<img width="30" height="30" src={addressIcon} alt="" />}
            />
          </div>
        ))}
      </Modal>
      <Grid layout={true}>
        <GridItem gridColumn={'1/13'} gridRow={layoutName === 'large' ? '1/4' : '2'}>
          <Box>
            <Grid columns={'4'} columnWidth={'1fr'}>
              <GridItem gridColumn={'2/5'}>
                <Steps steps={stepsNames} activeIdx={3} showProgress={true} />
              </GridItem>
              <GridItem gridColumn={'1/2'} gridRow={'1'} alignVertical={'center'}>
                <StyledText name={'title2'}>Create DAO</StyledText>
              </GridItem>
            </Grid>

            <Info
              mode={'warning'}
              title={''}
              style={{
                marginTop: '20px',
              }}
            >
              Check again all the information is correct. You can’t modify some of this information
              once the DAO is created
            </Info>

            <Grid columns={'2'} columnWidth={'1fr'} style={{ marginTop: 20 }}>
              <GridItem gridRow={'1'} alignHorizontal={'flex-start'}>
                <StyledText name={layoutName !== 'small' ? 'title3' : 'title4'}>
                  Basic Info
                </StyledText>
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
                <StyledText name={layoutName !== 'small' ? 'title3' : 'title4'}>
                  Collaterals
                </StyledText>
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

            <Button
              wide
              size={'large'}
              mode={'primary'}
              style={{ marginTop: 20 }}
              onClick={() => {
                setActiveStep(CreateDaoSteps.Progress);
              }}
            >
              Confirm and create a DAO
            </Button>
          </Box>
        </GridItem>
        <GridItem
          gridRow={'1'}
          gridColumn={layoutName === 'large' ? '13/17' : '1 / -1'}
          alignHorizontal={'center'}
        >
          <EmptyStateCard illustration={cardIamge} text={cardText} />
        </GridItem>
        <GridItem
          gridRow={layoutName === 'large' ? '2' : '3'}
          gridColumn={layoutName === 'large' ? '13/17' : '1 / -1'}
        >
          <Box style={{ background: '#8991FF', opacity: 0.5 }}>
            <h5 style={{ color: '#20232C' }}>Need Help?</h5>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
};

export default CreateDaoReview;
