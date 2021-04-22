/* eslint-disable */
import { makeStyles } from '@material-ui/core/styles';
import Paper, { PaperProps } from '@material-ui/core/Paper';

const useStyle = makeStyles({
    root: {
        width: 'min-content',
        background: '#FFFFFF',
        height: 'auto',
        padding: '50px',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        boxSizing: 'border-box',
        boxShadow: '0px 9px 6px rgba(180, 193, 228, 0.35)',
        borderRadius: '16px'
    }
    
  });

export const ANWrappedPaper = (props: PaperProps) => {
    const classes = useStyle();
    return (
        <Paper
        classes={{
            root: classes.root
        }}
        {...props}
        />
    );
};