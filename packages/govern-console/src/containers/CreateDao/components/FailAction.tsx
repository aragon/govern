import { Button, StyledText, useTheme } from '@aragon/ui';
import { CreateDaoSteps } from '../utils/Shared';

const FailAction: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<CreateDaoSteps>>;
}> = ({ setActiveStep }) => {
  const theme = useTheme();
  return (
    <div>
      <StyledText name={'body2'}>Something went wrong</StyledText>
      <StyledText name={'body2'} style={{ color: theme.disabled }}>
        Please review your DAO inputs and try again.
      </StyledText>
      <Button
        size={'large'}
        mode={'secondary'}
        style={{ marginTop: 20 }}
        onClick={() => setActiveStep(CreateDaoSteps.Review)}
      >
        Go back
      </Button>
    </div>
  );
};

export default FailAction;
