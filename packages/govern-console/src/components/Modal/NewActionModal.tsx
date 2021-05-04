import React, { useState, useRef } from 'react';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import { ANButton } from 'components/Button/ANButton';
import { InputField } from 'components/InputFields/InputField';
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

export interface NewActionModalProps {
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
  onGenerate: (contractAddress: any, abi: any) => void;
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
    paddingBottom: '0px',
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    paddingTop: '24px',
    paddingLeft: '40px',
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

export const NewActionModal: React.FC<NewActionModalProps> = ({
  open,
  onCloseModal,
  onGenerate,
}) => {
  const theme = useTheme();
  const contractAddress = useRef();
  const abi = useRef(null);
  const isJsonString = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  const onInputABI = (val: string) => {
    if (isJsonString(val)) {
      abi.current = JSON.parse(val);
    } else return;
  };
  const onInputContractAddress = (val: any) => {
    contractAddress.current = val;
  };
  const onGenerateClick = () => {
    if (abi.current === null) return;
    if (contractAddress.current === null) return;

    console.log(abi.current, contractAddress.current);
    onGenerate(contractAddress.current, abi.current);
  };
  const InputLabelText = styled(Typography)({
    color: theme.custom.modal.labelColor,
    lineHeight: theme.custom.modal.labelLineHeight,
    fontSize: theme.custom.modal.labelFontSize,
    fontWeight: theme.custom.modal.labelFontWeight,
    fontFamily: theme.typography.fontFamily,
    fontStyle: 'normal',
    marginBottom: '12px',
  });
  return (
    <MuiDialog open={open}>
      <DialogTitle onClose={onCloseModal}> New Action </DialogTitle>
      <DialogContent>
        <InputLabelText>Input ABI</InputLabelText>
        <div style={{ marginBottom: '26px' }}>
          <InputField
            height={'46px'}
            width={'530px'}
            onInputChange={onInputABI}
            placeholder="ABI..."
            label=""
          ></InputField>
        </div>
        <InputLabelText>Input Contract Address</InputLabelText>
        <div style={{ marginBottom: '26px' }}>
          <InputField
            height={'46px'}
            width={'530px'}
            onInputChange={onInputContractAddress}
            placeholder="Contract Address"
            label=""
          ></InputField>
        </div>
      </DialogContent>
      <DialogActions>
        <ANButton
          buttonType="primary"
          width={'112px'}
          height={'45px'}
          label="Generate"
          onClick={() => onGenerateClick()}
        ></ANButton>
      </DialogActions>
    </MuiDialog>
  );
};
