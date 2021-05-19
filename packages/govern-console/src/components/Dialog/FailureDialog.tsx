import React, { useState } from 'react';
import { styled } from '@material-ui/core/styles';
import { Collapse } from '@material-ui/core';
import Dialog from './Dialog';
import CrossImage from '../../images/svgs/cross.svg';

export interface FailureDialogProps {
  /**
   * Dialog sub title
   */
  subTitle?: string;

  /**
   * more details about the error
   */
  moreDetails?: string;

  /**
   * button click handler
   */
  onClick(): void;

  /**
   * render the dialog with paper style or plain dialog style
   */
  paperStyle?: boolean;
}

const defaultSubTitle =
  'An error has occurred during the signature process. Do not worry, you can try again without losing your information.';

const DetailsContainer = styled('div')({
  maxWidth: '400px',
  margin: '0 auto',
  textAlign: 'center',
  paddingTop: '5px',
});

const Details = styled('div')({
  fontSize: '12px',
  fontStyle: 'normal',
  lineHeight: '16px',
  letterSpacing: '0.02em',
  textAlign: 'left',
  marginTop: '19px',
  overflowY: 'scroll',
  maxHeight: '86px',
  color: '#7483AB',
  wordWrap: 'break-word',
});

const Link = styled('a')({
  textDecoration: 'none',
  color: '#00C2FF',
  fontSize: '18px',
  fontStyle: 'normal',
  cursor: 'pointer',
});

const FailureDialog: React.FC<FailureDialogProps> = ({
  subTitle,
  moreDetails,
  onClick,
  paperStyle,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleShow = () => {
    setShowDetails((prev) => !prev);
  };

  return (
    <Dialog
      image={CrossImage}
      title={'Something went wrong'}
      subTitle={subTitle || defaultSubTitle}
      button={{ label: 'Ok, let’s try again', onClick }}
      paperStyle={paperStyle}
    >
      {moreDetails && (
        <DetailsContainer>
          <Link onClick={toggleShow}>{'More details'}</Link>
          <Collapse in={showDetails}>
            <Details>{moreDetails}</Details>
          </Collapse>
        </DetailsContainer>
      )}
    </Dialog>
  );
};

export default FailureDialog;
