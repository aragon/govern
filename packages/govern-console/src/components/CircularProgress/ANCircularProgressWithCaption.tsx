import { ANCircularProgress } from './ANCircularProgress';
import { CircularProgressStatus } from 'utils/types';
import styled from 'styled-components';
import { GU, StyledText, useTheme } from '@aragon/ui';

export interface ANProgressCationPropos {
  /**
   * Text Message to be showen along side of the circular progress
   */
  caption?: string;

  /**
   * Status of the circular progress
   */
  state: CircularProgressStatus;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const Progress = styled.div`
  margin-top: ${GU}px;
`;

const Caption = styled.div`
  margin-top: ${GU / 2}px;
  margin-left: ${GU}px;
  word-break: break-word;
  color: ${(p) => p.color};
`;

export const ANCircularProgressWithCaption = (props: ANProgressCationPropos) => {
  const theme = useTheme();

  const getTextColor = (state: CircularProgressStatus) => {
    switch (state) {
      case CircularProgressStatus.Disabled:
        return theme.disabledContent;
      case CircularProgressStatus.Failed:
        return theme.red;
      default:
        return theme.primary;
    }
  };

  return (
    <Container>
      <Progress>
        <ANCircularProgress status={props.state} />
      </Progress>
      <Caption color={getTextColor(props.state)}>
        <StyledText name="title3">{props.caption}</StyledText>
      </Caption>
    </Container>
  );
};
