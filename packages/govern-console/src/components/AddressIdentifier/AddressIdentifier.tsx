import React from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import MUIChip, { ChipProps } from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
// import { ReactComponent as AddressIcon } from '../../../src/images/svgs/DefaultImageAddress.svg';

export interface AddressIdentifierProps extends ChipProps {
  /**
   * Image Url String
   */
  imageUrl: string;
  /**
   * If Address or not
   */
  isAddress: boolean;
  /**
   * User Name or Address
   */
  displayText: string;
  /**
   * Image to be shown or not
   */
  isImageVisible: boolean;
  /**
   * Size of the component
   */
  componentSize: string;
  onClick?: () => void;
}

const StyledAddressIdentifier = styled(MUIChip)(({ theme }) => ({
  color: theme.custom.black,
  backgroundColor: theme.custom.white,
  width: 'fit-content',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '6px 8px',
  borderRadius: '40px',
}));

export const AddressIdentifier: React.FC<any> = ({
  imageUrl,
  isAddress,
  displayText,
  isImageVisible,
  componentSize,
  ...props
}) => {
  const theme = useTheme();
  const getImageUrl = () => {
    if (imageUrl) {
      return imageUrl;
    } else {
      return 'src/images/svgs/DefaultImageAddress.svg';
    }
  };
  const getDisplayText = () => {
    if (isAddress) {
      const formattedAddress =
        displayText.slice(0, 5) +
        '...' +
        displayText.slice(displayText.length - 5, displayText.length - 1);
      return formattedAddress;
    } else {
      let formattedName = displayText;
      if (displayText.length > 20) {
        formattedName = displayText.slice(0, 19);
      }
      return formattedName;
    }
  };

  const getAvatar = () => {
    if (imageUrl) {
      console.log('xyz');
      return <Avatar src={imageUrl} />;
    }
    console.log('abc');
    return <Avatar src="/src/images/svgs/DefaultImageAddress.svg" />;
  };

  return (
    <StyledAddressIdentifier
      size={componentSize}
      label={getDisplayText()}
      avatar={getAvatar()}
    ></StyledAddressIdentifier>
  );
};
