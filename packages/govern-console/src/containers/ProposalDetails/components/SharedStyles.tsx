import Typography from '@material-ui/core/Typography';
import { styled, Theme } from '@material-ui/core/styles';
export const InfoWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  boxSizing: 'border-box',
});
export const Widget = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  minHeight: '118px',
  boxSizing: 'border-box',
  background: '#FFFFFF',
  border: '2px solid #ECF1F7',
  boxShadow: '0px 6px 6px rgba(180, 193, 228, 0.35)',
  borderRadius: '8px',
  marginBottom: '23px',
  padding: '26px 28px',
  '& button': {
    marginTop: '5px',
  },
});
export const WidgetRow = styled('div')(
  ({ theme, marginBottom }: { marginBottom?: string; theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 'fit-content',
    marginBottom: marginBottom || 0,
  }),
);
export const TitleText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: '18px',
  color: '#20232C',
  marginBottom: '20px',
}));
