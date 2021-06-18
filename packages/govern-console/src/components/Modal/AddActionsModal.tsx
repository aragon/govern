import React, { useState } from 'react';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import { InputField } from '../../components/InputFields/InputField';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { styled, Theme, withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Button } from '@aragon/ui';
import { actionType } from 'utils/types';
import { useReducer } from 'react';
import { useCallback } from 'react';

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
  actions: actionType[];
}

const actionStyle = {
  display: 'flex',
  paddingTop: '23px',
  paddingLeft: '21px',
  paddingRight: '21px',
  paddingBottom: '23px',
  justifyContent: 'space-between',
  borderBottom: '2px solid #E2ECF5',
};

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

enum ActionType {
  ADD = 'add',
  DELETE = 'delete',
}

type CounterAction = {
  type: ActionType;
  index: number;
};

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

const IncrementorDecrementorButtons: React.FC<any> = ({ counter, decrement, increment }) => {
  const mode = 'secondary';
  return (
    <ButtonGroup size="small" aria-label="small outlined button group">
      <Button mode={mode} onClick={counter > 0 ? decrement : undefined}>
        -
      </Button>

      <Button mode={mode}>{counter.toString()}</Button>
      <Button mode={mode} onClick={increment}>
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

const counterReducer = (state: number[], action: CounterAction) => {
  switch (action.type) {
    case ActionType.ADD: {
      const newState = state.slice();
      newState[action.index]++;
      return newState;
    }
    case ActionType.DELETE: {
      const newState = state.slice();
      newState[action.index]--;
      return newState;
    }
    default:
      return state;
  }
};

export const AddActionsModal: React.FC<AddActionsModalProps> = ({
  open,
  onCloseModal,
  onAddActions,
  actions,
}) => {
  const [counters, dispatchCounterAction] = useReducer(counterReducer, [], () =>
    actions.map(() => 0),
  );
  const [shownActions, setShownActions] = useState<number[]>(actions.map((a, i) => i));

  const searchActions = (value: string) => {
    if (value === '') {
      setShownActions(actions.map((a, i) => i));
      return;
    }
    const searchedActions = actions.reduce((matched, action, index) => {
      const functionName = action.name.toLowerCase();
      return functionName.includes(value) ? [...matched, index] : matched;
    }, [] as number[]);
    setShownActions(searchedActions);
  };

  const submitSelectedActions = useCallback(() => {
    const selectedActions = counters
      .map((count, index) => {
        return count > 0 ? actions[index] : null;
      })
      .filter(Boolean);
    onAddActions(selectedActions);
  }, [actions, counters, onAddActions]);

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
            {shownActions.map((index: number) => (
              <div style={actionStyle} key={index}>
                <ActionText>{actions[index].name}</ActionText>
                <IncrementorDecrementorButtons
                  counter={counters[index]}
                  decrement={() => dispatchCounterAction({ type: ActionType.DELETE, index })}
                  increment={() => dispatchCounterAction({ type: ActionType.ADD, index })}
                ></IncrementorDecrementorButtons>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          mode="primary"
          size="large"
          wide
          onClick={submitSelectedActions}
          label="Add Action"
        ></Button>
      </DialogActions>
    </MuiDialog>
  );
};
