import React, { useState } from 'react';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import { ANButton } from '../../components/Button/ANButton';
import { InputField } from '../../components/InputFields/InputField';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { styled, Theme, withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
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
  onAddActions: (action: any) => void;
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

const DialogContent = withStyles({
  root: {
    paddingTop: '33px',
    paddingLeft: '40px',
    paddingRight: '40px',
    paddingBottom: '0px',
    maxHeight: '424px',
  },
})(MuiDialogContent);

const DialogContentSearch = withStyles({
  root: {
    paddingTop: '20px',
    paddingLeft: '40px',
    paddingRight: '40px',
    paddingBottom: '20px',
    maxHeight: '424px',
  },
})(MuiDialogContent);

const DialogActions = withStyles({
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

const IncrementorDecrementorButtons: React.FC<any> = ({
  onIncrementAction,
  onDecrementAction,
  action,
}) => {
  const [counter, setCounter] = useState<number>(0);
  return (
    <ButtonGroup size="small" aria-label="small outlined button group">
      {counter > 0 && (
        <Button
          onClick={() => {
            setCounter(counter - 1);
            onDecrementAction(action);
          }}
        >
          -
        </Button>
      )}
      {counter > 0 && <Button disabled>{counter}</Button>}
      <Button
        onClick={() => {
          setCounter(counter + 1);
          onIncrementAction(action);
        }}
      >
        +
      </Button>
    </ButtonGroup>
  );
};

const ActionText = styled(Typography)(({ theme }) => ({
  color: theme.custom.black,
  lineHeight: theme.custom.modal.labelLineHeight,
  fontSize: theme.custom.modal.labelFontSize,
  fontWeight: theme.custom.modal.labelFontWeight,
  fontFamily: theme.typography.fontFamily,
  fontStyle: 'normal',
}));

export const AddActionsModal: React.FC<AddActionsModalProps> = ({
  open,
  onCloseModal,
  onAddActions,
  actions,
}) => {
  const [shownActions, setShownActions] = useState<any>(actions);
  const [selectedActions, setSelectedActions] = useState<any>([]);
  const actionStyle = {
    display: 'flex',
    paddingTop: '23px',
    paddingLeft: '21px',
    paddingRight: '21px',
    paddingBottom: '23px',
    justifyContent: 'space-between',
    borderBottom: '2px solid #E2ECF5',
  };

  const onIncrementAction = (action: any) => {
    const tempActions = [...selectedActions, action];
    setSelectedActions(tempActions);
  };

  const onDecrementAction = (action: any) => {
    const temp = [];
    let isNotDeleted = true;
    for (const actionItem of selectedActions) {
      const { name } = actionItem;
      if (name === action.name && isNotDeleted) {
        isNotDeleted = false;
      } else {
        temp.push(actionItem);
      }
    }
    setSelectedActions(temp);
  };

  const searchActions = (value: string) => {
    if (value === '') {
      setShownActions(actions);
      return;
    }
    const searchedActions = [];
    for (const action of shownActions) {
      const functionName = action.name.toLowerCase();
      if (functionName.includes(value)) {
        searchedActions.push(action);
      }
    }
    setShownActions(searchedActions);
  };

  return (
    <MuiDialog open={open}>
      <DialogTitle onClose={onCloseModal}> Actions </DialogTitle>
      <DialogContentSearch>
        <div style={{ marginBottom: '26px' }}>
          <InputField
            height={'46px'}
            width={'520px'}
            onInputChange={searchActions}
            placeholder="Search Actions"
            label=""
          ></InputField>
        </div>
      </DialogContentSearch>
      <DialogContent>
        {shownActions && shownActions.length > 0 && (
          <div
            style={{
              width: '100%',
              borderRadius: '10px',
              border: '2px solid #E2ECF5',
            }}
          >
            {shownActions.map((action: any) => (
              <div style={actionStyle} key={action.name}>
                <ActionText>{action.name}</ActionText>
                <IncrementorDecrementorButtons
                  action={action}
                  onIncrementAction={onIncrementAction}
                  onDecrementAction={onDecrementAction}
                ></IncrementorDecrementorButtons>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <ANButton
          buttonType="primary"
          width={'100%'}
          height={'45px'}
          onClick={() => onAddActions(selectedActions)}
          label="Add Action"
        ></ANButton>
      </DialogActions>
    </MuiDialog>
  );
};
