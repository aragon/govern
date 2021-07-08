import { makeStyles } from '@material-ui/core/styles';
import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';
import blueTickImage from '../../images/svgs/Blue_tick.svg';
import crossImage from '../../images/svgs/cross.svg';
import { CircularProgressStatus } from 'utils/types';

export interface ANCircularProgressProps extends CircularProgressProps {
  /**
   * Status of the Circular Progress
   */
  status?: CircularProgressStatus;
}

const useStyle = makeStyles({
  root: {
    width: '19px',
    height: '19px',
  },
  circle: {
    // TODO: linear gradient as svg is not correct
    stroke: 'url(#linearColors)',
  },
  inactiveCircle: {
    stroke: '#B4C1E4',
  },
});

export const ANCircularProgress = (props: ANCircularProgressProps) => {
  const classes = useStyle();

  const getCircularProgress = () => {
    return (
      <div>
        <svg style={{ width: 0, height: 0 }}>
          <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
            <stop offset="20%" stopColor="rgb(0, 194, 255)" />
            <stop offset="90%" stopColor="rgb(0, 194, 255, 0)" />
          </linearGradient>
        </svg>
        <CircularProgress
          variant={'indeterminate'}
          value={80}
          size={20}
          thickness={8}
          classes={{
            root: classes.root,
            circle: classes.circle,
          }}
          {...props}
        />
      </div>
    );
  };

  switch (props.status) {
    case CircularProgressStatus.Disabled:
      return (
        <CircularProgress
          variant={'determinate'}
          value={100}
          size={20}
          thickness={8}
          classes={{
            root: classes.root,
            circle: classes.inactiveCircle,
          }}
          {...props}
        />
      );
    case CircularProgressStatus.InProgress:
      return getCircularProgress();

    case CircularProgressStatus.Done:
      return <img src={blueTickImage} />;

    case CircularProgressStatus.Failed:
      return <img src={crossImage} style={{ width: 20, height: 20 }} />;

    default:
      return getCircularProgress();
  }
};
