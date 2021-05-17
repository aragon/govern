import React, { useState } from 'react';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import { ANButton } from 'components/Button/ANButton';
import { InputField } from 'components/InputFields/InputField';
import { useWallet } from 'AugmentedWallet';
import { validateContract, validateAbi } from 'utils/validations';
import { Controller, useForm } from 'react-hook-form';
import { utils } from 'ethers';
import AbiHandler from 'utils/AbiHandler';
import { styled, Theme, withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
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

const InputLabelText = styled(Typography)(({ theme }: any) => ({
  color: theme.custom.modal.labelColor,
  lineHeight: theme.custom.modal.labelLineHeight,
  fontSize: theme.custom.modal.labelFontSize,
  fontWeight: theme.custom.modal.labelFontWeight,
  fontFamily: theme.typography.fontFamily,
  fontStyle: 'normal',
  marginBottom: '12px',
}));

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id?: string;
  children: string;
  onClose: () => void;
}

const DialogContent = withStyles({
  root: {
    paddingTop: '33px',
    paddingLeft: '40px',
    paddingBottom: '0px',
  },
})(MuiDialogContent);

const DialogActions = withStyles({
  root: {
    margin: 0,
    paddingTop: '24px',
    paddingLeft: '40px',
    paddingBottom: '35px',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
  },
})(MuiDialogActions);

export const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

interface FormInputs {
  contractAddress: string;
  abi: string;
}

export const NewActionModal: React.FC<NewActionModalProps> = ({
  open,
  onCloseModal,
  onGenerate,
}) => {
  const [fetchAbi, setFetchAbi] = useState(true);
  const { provider, networkName }: any = useWallet();

  const abiHandler = React.useMemo(() => {
    if (networkName) {
      return new AbiHandler(networkName);
    }
  }, [networkName]);

  const { control, handleSubmit } = useForm<FormInputs>();

  const callGenerateAbi = (formData: FormInputs) => {
    const { contractAddress, abi } = formData;
    onGenerate(contractAddress, JSON.parse(abi));
  };

  const callFetchAbi = async (formData: FormInputs) => {
    const { contractAddress } = formData;
    const address = utils.isAddress(contractAddress)
      ? contractAddress
      : await provider.resolveName(contractAddress);

    const abi = await abiHandler?.get(address);
    if (abi) {
      onGenerate(address, JSON.parse(abi));
    } else {
      // couldn't get abi from etherscan, get it from user
      setFetchAbi(false);
    }
  };

  return (
    <MuiDialog open={open}>
      <DialogTitle onClose={onCloseModal}> New Action </DialogTitle>
      <DialogContent>
        <InputLabelText>Input Contract Address</InputLabelText>
        <div style={{ marginBottom: '26px', height: '50px' }}>
          <Controller
            name="contractAddress"
            control={control}
            rules={{
              required: 'This is required.',
              validate: (value) => {
                return validateContract(value, provider);
              },
            }}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <InputField
                height={'46px'}
                width={'530px'}
                onInputChange={onChange}
                placeholder="Contract Address"
                label=""
                error={!!error}
                helperText={error ? error.message : null}
              ></InputField>
            )}
          />
        </div>
        {!fetchAbi && (
          <div>
            <InputLabelText>Input ABI</InputLabelText>
            <div style={{ marginBottom: '26px', height: '50px' }}>
              <Controller
                name="abi"
                control={control}
                rules={{
                  required: 'This is required.',
                  validate: (value) => validateAbi(value),
                }}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <InputField
                    height={'46px'}
                    width={'530px'}
                    onInputChange={onChange}
                    placeholder="ABI..."
                    label=""
                    error={!!error}
                    helperText={error ? error.message : null}
                  ></InputField>
                )}
              />
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        {fetchAbi && (
          <ANButton
            buttonType="primary"
            width={'112px'}
            height={'45px'}
            label="Fetch"
            onClick={handleSubmit(callFetchAbi)}
          ></ANButton>
        )}
        {!fetchAbi && (
          <ANButton
            buttonType="primary"
            width={'112px'}
            height={'45px'}
            label="Generate"
            onClick={handleSubmit(callGenerateAbi)}
          ></ANButton>
        )}
      </DialogActions>
    </MuiDialog>
  );
};
