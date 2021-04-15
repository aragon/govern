import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    noSelectText: {
      webkitTouchCallout: 'none' /* iOS Safari */,
      webkitUserSelect: 'none' /* Safari */,
      userSelect:
        'none' /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */,
    },
  }),
);

export default useStyles;
