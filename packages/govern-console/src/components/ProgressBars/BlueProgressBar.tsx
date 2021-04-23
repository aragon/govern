/* eslint-disable */
import LinearProgress, {
  LinearProgressProps,
} from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  determinate: {
    flexGrow: 1,
    width: '100%',
    height: '11px',
    borderRadius: '10px',
    backgroundColor: '#ECFAFF',
  },
  barColorPrimary: {
    width: '100%',
    height: '11px',
    borderRadius: '50px',
    background: 'linear-gradient(107.79deg, #01B9F2 1.46%, #01DBE9 100%)',
  },
});

export const BlueProgressBar = (props: LinearProgressProps) => {
  const classes = useStyles();

  return (
    <LinearProgress
      variant={'determinate'}
      classes={{
        determinate: classes.determinate,
        barColorPrimary: classes.barColorPrimary,
      }}
      {...props}
    />
  );
};
