import React, { useMemo } from 'react';
import cardMainImage from '../../images/pngs/review_create_dao@2x.png';
import { CreateDaoSteps, stepsNames, formatParamNames } from './Shared';
import { useCreateDao } from './CreateDaoContextProvider';
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
} from '@aragon/ui';
import { toUtf8String } from '@ethersproject/strings';

const CreateDaoReview: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<CreateDaoSteps>>;
}> = ({ setActiveStep }) => {
  const { layoutName } = useLayout();
  const { basicInfo, config, collaterals } = useCreateDao();

  const basicInfoArray = useMemo(() => {
    return Object.entries(basicInfo).map((entry) => {
      const obj: { name: string; value: string } = {
        name: (formatParamNames as any)[entry[0]?.toString()],
        value: entry[1]?.toString(),
      };
      return obj;
    });
  }, [basicInfo]);

  const configArray = useMemo(() => {
    const formatValue = (name: string, value: any) => {
      switch (name) {
        case 'ruleText':
          return toUtf8String(value);

        case 'ruleFile':
          return value.name;

        default:
          return value.toString();
      }
    };

    return Object.entries(config).map((entry) => {
      const obj: { name: string; value: string } = {
        name: (formatParamNames as any)[entry[0]?.toString()],
        value: formatValue(entry[0], entry[1]),
      };
      return obj;
    });
  }, [config]);

  const CollateralArray = useMemo(() => {
    return Object.entries(collaterals).map((entry) => {
      const obj: { name: string; value: string } = {
        name: (formatParamNames as any)[entry[0]?.toString()],
        value: entry[1]?.toString(),
      };
      return obj;
    });
  }, [collaterals]);

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
            entries={basicInfoArray}
            renderEntry={({ name, value }: { name: string; value: string }) => {
              return [
                <StyledText name={'body3'} key={'basicInfoArray'}>
                  {name}
                </StyledText>,
                <StyledText name={'body3'} key={'basicInfoArrayb'}>
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
            entries={configArray}
            renderEntry={({ name, value }: { name: string; value: string }) => {
              return [
                <StyledText name={'body3'} key={'configArray'}>
                  {name}
                </StyledText>,
                <StyledText name={'body3'} key={'configArrayb'}>
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
                  setActiveStep(CreateDaoSteps.Collateral);
                }}
              >
                Edit Collaterals
              </ButtonText>
            </GridItem>
          </Grid>

          <DataView
            fields={['', '']}
            entries={CollateralArray}
            renderEntry={({ name, value }: { name: string; value: string }) => {
              return [
                <StyledText name={'body3'} key={'CollateralArray'}>
                  {name}
                </StyledText>,
                <StyledText name={'body3'} key={'CollateralArrayb'}>
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
  );
};

export default CreateDaoReview;
