/* eslint-disable */
import LinearProgress, { LinearProgressProps } from '@material-ui/core/LinearProgress';
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
        backgroundColor: '#00B3EC',
    }
});
  
export const BlueProgressBar = (props: LinearProgressProps) => {
    const classes = useStyles();
    
    return (
        <LinearProgress
        variant={'determinate'}
        classes={{
            determinate: classes.determinate,
            barColorPrimary: classes.barColorPrimary
        }}
        {...props}
        />
    );
}