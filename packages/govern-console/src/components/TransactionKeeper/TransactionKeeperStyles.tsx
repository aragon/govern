import { styled } from '@material-ui/core/styles';
import MUICard from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

//* Styled Components
export const TransactionKeeperWrapper = styled(MUICard)(({ theme }) => ({
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '100%',
  height: 'fit-content',
  backgroundColor: theme.custom.transactionKeeper.wrapper.background,
  boxShadow: '0px 13px 9px rgba(180, 193, 228, 0.35)',
  borderRadius: '16px',
  padding: '27px 24px 24px 24px',
}));

export const TransactionKeeperTitle = styled(Typography)(({ theme }) => ({
  ...theme.custom.transactionKeeper.title,
  width: '100%',
  height: 'fit-content',
  boxSizing: 'border-box',
  textAlign: 'center',
  marginBottom: '21px',
}));

export const TransactionResultImage = styled('img')({
  width: '88px',
  alignContent: 'center',
  display: 'flex',
  margin: '0 auto 20px auto',
});

export const TransactionSubtitle = styled('div')({
  width: '100%',
  height: 'fit-content',
  boxSizing: 'border-box',
  textAlign: 'center',
  marginBottom: '21px',
});

export const TransactionStatusWrapper = styled('div')({
  boxSizing: 'border-box',
  height: 'fit-content',
  width: '100%',
  marginBottom: '30px',
});
