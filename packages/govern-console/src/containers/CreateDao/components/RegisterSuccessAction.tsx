import { Button, SPACING, useLayout } from '@aragon/ui';
import { useHistory } from 'react-router';

const RegisterSuccessAction: React.FC<{ daoIdentifier: string }> = ({ daoIdentifier }) => {
  const { layoutName } = useLayout();
  const history = useHistory();

  const goToDaoPage = () => history.push('daos/' + daoIdentifier);
  return (
    <Button
      size={'large'}
      mode={'primary'}
      style={{ marginTop: 20, marginLeft: layoutName !== 'small' ? SPACING[layoutName] : '0px' }}
      onClick={goToDaoPage}
    >
      Amazing, all ready. Let’s start
    </Button>
  );
};

export default RegisterSuccessAction;
