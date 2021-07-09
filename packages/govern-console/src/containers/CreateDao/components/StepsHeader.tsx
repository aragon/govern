import React from 'react';
import { Grid, GridItem, Steps, StyledText } from '@aragon/ui';
import { stepsNames } from '../utils/Shared';

const StepsHeader: React.FC<{ index: number }> = ({ index }) => {
  return (
    <Grid columns={'4'} columnWidth={'1fr'}>
      <GridItem gridColumn={'2/5'}>
        <Steps steps={stepsNames} activeIdx={index} showProgress={true} />
      </GridItem>
      <GridItem gridColumn={'1/2'} gridRow={'1'} alignVertical={'center'}>
        <StyledText name={'title1'}>Create DAO</StyledText>
      </GridItem>
    </Grid>
  );
};

export default StepsHeader;
