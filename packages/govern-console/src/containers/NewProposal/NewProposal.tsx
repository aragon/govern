import React, { useState, useRef, memo, useCallback } from 'react';
import { ANButton } from '../../components/Button/ANButton';
import { useTheme, styled } from '@material-ui/core/styles';
import useStyles from '../../ReusableStyles';
import backButtonIcon from '../../images/back-btn.svg';
import Typography from '@material-ui/core/Typography';
import { HelpButton } from '../../components/HelpButton/HelpButton';
import TextArea from '../../components/TextArea/TextArea';
import Paper from '@material-ui/core/Paper';
// import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
export interface NewProposalProps {
  /**
   * All the details of DAO
   */
  daoDetails?: any;
  /**
   * callback for click on schedule
   */
  onSchedule?: any;
}

const NewProposal: React.FC<NewProposalProps> = ({
  daoDetails,
  onSchedule,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const textFieldRef = useRef();
  const [justification, updateJustification] = useState('');

  const [isAddingActions, updateIsAddingActions] = useState(false);

  const [selectedActions, updateSelectedOptions] = useState([]);

  // const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  // const onAddNewAction = () => {};
  // const onMoveSelectedAction = () => {};
  // const onRemoveSelectedAction = () => {};
  // const onScheduleAction = () => {};

  const WrapperDiv = styled(Paper)({
    width: '100%',
    background: theme.custom.white,
    height: 'auto',
    padding: '50px 273px 76px 273px',
    // display: 'block',
    boxSizing: 'border-box',
    boxShadow: 'none',
    // flexDirection: 'column',
  });
  const BackButton = styled('div')({
    height: 25,
    width: 62,
    cursor: 'pointer',
    position: 'relative',
    left: -6,
  });
  const Title = styled(Typography)({
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 28,
    lineHeight: '38px',
    color: '#20232C',
    marginTop: 17,
    height: 50,
    display: 'block',
  });
  const SubTitle = styled(Typography)({
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 18,
    lineHeight: '25px',
    color: '#7483AB',
    marginTop: 17,
    height: 31,
    display: 'inline-block',
  });
  const JustificationTextArea = styled(TextArea)({
    background: '#FFFFFF',
    border: '2px solid #EFF1F7',
    boxSizing: 'border-box',
    boxShadow: 'inset 0px 2px 3px 0px rgba(180, 193, 228, 0.35)',
    borderRadius: '8px',
    width: '100%',
    height: 104,
    padding: '11px 21px',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '25px',
    letterSpacing: '0em',
    // border: '0 !important',
    '& .MuiInputBase-root': {
      border: 0,
      width: '100%',
      input: {
        width: '100%',
      },
    },
    '& .MuiInput-underline:after': {
      border: 0,
    },
    '& .MuiInput-underline:before': {
      border: 0,
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      border: 0,
    },
  });
  const isProposalValid = () => {
    if (justification === '') return false;
    if (selectedActions.length === 0) return false;
    return true;
  };

  return (
    <>
      <WrapperDiv>
        <BackButton>
          <img src={backButtonIcon} />
        </BackButton>
        <Title>New Proposal</Title>
        <SubTitle style={{ marginTop: 22, marginBottom: 6 }}>
          Justification
        </SubTitle>{' '}
        {<HelpButton helpText="" />}
        <JustificationTextArea
          // ref={}
          value={justification}
          onChange={useCallback((event) => {
            updateJustification(event.target.value);
          }, [])}
          placeholder={'Enter Justification '}
        ></JustificationTextArea>
        <Title>Actions</Title>
        {selectedActions.length === 0 ? (
          <SubTitle>No actions defined Yet</SubTitle>
        ) : null}
        <br />
        <ANButton
          label="Add new action"
          // width={155}
          // height={45}
          type="secondary"
          color="#00C2FF"
          style={{ marginTop: 40 }}
          onClick={handleOpenModal}
        />
        <br />
        <ANButton
          label="Schedule/Submit"
          // width={178}
          // height={45}
          type="primary"
          // color="#00C2FF"
          style={{ marginTop: 16 }}
          disabled={!isProposalValid()}
        />
      </WrapperDiv>
    </>
  );
};

export default memo(NewProposal);
