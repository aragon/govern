import React, { ReactNode } from 'react';
import { Box, Grid, GridItem, StyledText, Info } from '@aragon/ui';
import { CircularProgressStatus } from 'utils/types';
import { ANCircularProgressWithCaption } from 'components/CircularProgress/ANCircularProgressWithCaption';

export interface ICreateDaoProgress {
  status: CircularProgressStatus;
  text: string;
}
export interface ICreateDaoProgressModal {
  image?: string;
  title?: string;
  subTitle?: string;
  info?: string;
  progressList?: ICreateDaoProgress[];
  action?: ReactNode | null;
}
const ProgressComponent: React.FC<ICreateDaoProgressModal> = ({
  image,
  title,
  subTitle,
  info,
  progressList,
  action,
}) => {
  return (
    <Box>
      <Grid columns={'3'} columnWidth={'1fr'}>
        <GridItem
          gridColumn={'1/2'}
          gridRow={'1/3'}
          alignHorizontal={'center'}
          alignVertical={'center'}
        >
          <img src={image}></img>
        </GridItem>
        <GridItem gridColumn={'2/4'} gridRow={'1'} alignHorizontal={'flex-start'}>
          {title && <StyledText name={'title1'}>{title}</StyledText>}
          {subTitle && <StyledText name={'body1'}>{subTitle}</StyledText>}
          {progressList &&
            progressList.map((item, index) => (
              <ANCircularProgressWithCaption
                key={`progress-${index}`}
                state={item.status}
                caption={item.text}
              />
            ))}
          {action}
        </GridItem>
        {info && (
          <GridItem gridColumn={'2/4'} gridRow={'3'} alignHorizontal={'flex-start'}>
            <Info mode={'info'}>{info}</Info>
          </GridItem>
        )}
      </Grid>
    </Box>
  );
};

export default ProgressComponent;
