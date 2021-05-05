/* eslint-disable */
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import checkedIcon from '../../images/svgs/check_box_checked.svg';
import unCheckedIcon from '../../images/svgs/check_box_unchecked.svg';

export const BlueCheckbox: React.FC<CheckboxProps> = ({ ...props }) => {
  // export const BlueCheckbox = ({...props}) => {
  return (
    <Checkbox
      disableRipple
      color="default"
      checkedIcon={<img src={checkedIcon} />}
      icon={<img src={unCheckedIcon} />}
      {...props}
    />
  );
};
