/* eslint-disable */
import { ANCircularProgress } from './ANCircularProgress';
import { CiruclarProgressStatus } from 'utils/types';

export interface ANProgressCationPropos {
  /**
   * Text Message to be showen along side of the circular progress
   */
  caption?: string;

  /**
   * Status of the circular progress
   */
  state: CiruclarProgressStatus;
}

export const ANCircularProgressWithCaption = (
  props: ANProgressCationPropos,
) => {
  const getTextColor = (state: CiruclarProgressStatus) => {
    switch (state) {
      case CiruclarProgressStatus.Disabled:
        return '#B4C1E4';
      case CiruclarProgressStatus.Failed:
        return '#FF6A60';
      default:
        return '#00C2FF';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        margin: '10px',
        verticalAlign: 'middle',
        lineHeight: '25px',
      }}
    >
      <ANCircularProgress status={props.state} />
      <div
        style={{
          marginLeft: '10px',
          fontFamily: 'Manrope',
          fontStyle: 'normal',
          fontWeight: 500,
          fontSize: 18,
          color: getTextColor(props.state),
          lineHeight: '20px',
        }}
      >
        {props.caption}
      </div>
    </div>
  );
};
