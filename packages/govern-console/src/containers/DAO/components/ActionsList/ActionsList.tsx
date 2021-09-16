import { Grid, GridItem, useLayout } from '@aragon/ui';

import DaoActionCard from '../DaoActionCard/DaoActionCard';

const ActionsList: React.FC = () => {
  const { layoutName } = useLayout();

  return (
    <>
      <Grid columns={'4'}>
        <GridItem gridColumn={layoutName === 'medium' ? '1/-1' : '1/3'}>
          <DaoActionCard text={'0x7ad0...f5dd'} time={'Yesterday'} lable={'Challenged'} />
        </GridItem>
        <GridItem gridColumn={layoutName === 'medium' ? '1/-1' : '3/5'}>
          <DaoActionCard text={'0x7ad0...f5dd'} time={'Yesterday'} lable={'Challenged'} />
        </GridItem>
      </Grid>
      {/* <Button label="Load more" mode="strong" icon={<IconDown />} /> */}
    </>
  );
};

export default ActionsList;
