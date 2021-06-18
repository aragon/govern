import { Button, StyledText, useTheme, SPACING, useLayout } from '@aragon/ui';
import { useHistory } from 'react-router';

const SuccessAction: React.FC<{
  isNewDaoTokenRegistered: boolean;
  daoTokenAddress: string;
  tokenRegister: () => void;
  daoIdentifier: string;
}> = ({ isNewDaoTokenRegistered, tokenRegister, daoIdentifier }) => {
  const { layoutName } = useLayout();
  const theme = useTheme();
  const history = useHistory();

  const goToDaoPage = () => history.push('daos/' + daoIdentifier);
  return (
    <div>
      <StyledText name={'body2'}>
        Your DAO is ready. Do you wanna register your token in Aragon Voice?
      </StyledText>
      <StyledText name={'body2'} style={{ color: theme.disabled }}>
        This allows you create governance proposals easy with 0 gass price
      </StyledText>
      {isNewDaoTokenRegistered ? (
        <div>
          <Button
            size={'large'}
            mode={'primary'}
            style={{
              marginTop: 20,
              marginLeft: layoutName !== 'small' ? SPACING[layoutName] : '0px',
            }}
            onClick={goToDaoPage}
          >
            Token already Registered, go to DAO page
          </Button>
        </div>
      ) : (
        <div>
          <Button size={'large'} mode={'secondary'} style={{ marginTop: 20 }} onClick={goToDaoPage}>
            Don't register token
          </Button>
          <Button
            size={'large'}
            mode={'primary'}
            style={{
              marginTop: 20,
              marginLeft: layoutName !== 'small' ? SPACING[layoutName] : '0px',
            }}
            onClick={() => tokenRegister()}
          >
            Yes, register token
          </Button>
        </div>
      )}
    </div>
  );
};

export default SuccessAction;
