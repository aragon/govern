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
        Your DAO is ready.{' '}
        {!isNewDaoTokenRegistered && 'Next, register your token on Aragon Voice.'}
      </StyledText>

      {isNewDaoTokenRegistered ? (
        <div>
          <Button
            size={'large'}
            mode={'primary'}
            style={{
              marginTop: 20,
            }}
            label="DAO is ready, go to DAO page"
            onClick={goToDaoPage}
          />
        </div>
      ) : (
        <div>
          <StyledText name={'body2'} style={{ color: theme.disabledContent }}>
            Voice enables gasless (non-binding) governance proposals and votes.
          </StyledText>
          <Button
            size={'large'}
            mode={'primary'}
            style={{
              marginTop: 20,
            }}
            onClick={() => tokenRegister()}
          >
            Register token
          </Button>
          <Button
            size={'large'}
            mode={'secondary'}
            style={{
              marginTop: 20,
              marginLeft: SPACING[layoutName],
            }}
            label="Skip"
            onClick={goToDaoPage}
          />
        </div>
      )}
    </div>
  );
};

export default SuccessAction;
