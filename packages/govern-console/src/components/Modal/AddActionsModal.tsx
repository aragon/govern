import React, { useState, memo } from 'react';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import { ANButton } from '../../components/Button/ANButton';
import { InputField } from '../../components/InputFields/InputField';
import {
  styled,
  useTheme,
  Theme,
  withStyles,
  WithStyles,
  createStyles,
} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

export interface AddActionsModalProps {
  /**
   * Open Modal or not
   */
  open: boolean;
  /**
   * On close modal
   */
  onCloseModal: () => void;
  /**
   * What happens when clicked on generate
   */
  onAddAction: (action: any) => void;
  /**
   * What happens when clicked on generate
   */
  actions: [];
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      paddingTop: '30px',
      paddingLeft: '40px',
      paddingBottom: '0px',
      border: 'none',
      width: '620px',
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
      borderBottomLeftRadius: '0px',
      borderBottomRightRadius: '0px',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id?: string;
  children: string;
  onClose: () => void;
}

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    paddingTop: '33px',
    paddingLeft: '40px',
    paddingRight: '40px',
    paddingBottom: '0px',
    maxHeight: '424px',
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    paddingTop: '24px',
    paddingLeft: '40px',
    paddingRight: '40px',
    paddingBottom: '35px',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
  },
}))(MuiDialogActions);

export const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export const AddActionsModal: React.FC<AddActionsModalProps> = ({
  open,
  onCloseModal,
  onAddAction,
  actions,
}) => {
  const theme = useTheme();
  const actionStyle = {
    display: 'flex',
    paddingTop: '23px',
    paddingLeft: '21px',
    paddingRight: '21px',
    paddingBottom: '23px',
    justifyContent: 'space-between',
    borderBottom: '2px solid #E2ECF5',
  };

  const ActionText = styled(Typography)({
    color: theme.custom.black,
    lineHeight: theme.custom.modal.labelLineHeight,
    fontSize: theme.custom.modal.labelFontSize,
    fontWeight: theme.custom.modal.labelFontWeight,
    fontFamily: theme.typography.fontFamily,
    fontStyle: 'normal',
  });

  return (
    <MuiDialog open={open}>
      <DialogTitle onClose={onCloseModal}> Actions </DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: '26px' }}>
          <InputField
            height={'46px'}
            width={'604px'}
            onInputChange={() => console.log('xyz')}
            placeholder="Search Actions"
            label=""
          ></InputField>
        </div>
        {actions && actions.length > 0 && (
          <div
            style={{
              width: '100%',
              borderRadius: '10px',
              border: '2px solid #E2ECF5',
            }}
          >
            {actions.map((action: any) => (
              <div style={actionStyle} key={action.name}>
                <ActionText>{action.name}</ActionText>
                <ANButton
                  label="Add"
                  onClick={() => onAddAction(action)}
                  height={'30px'}
                  width="80px"
                ></ANButton>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        {/* <ANButton
          type="primary"
          width={'100%'}
          height={'45px'}
          label="Add Action"
        ></ANButton> */}
      </DialogActions>
    </MuiDialog>
  );
};
