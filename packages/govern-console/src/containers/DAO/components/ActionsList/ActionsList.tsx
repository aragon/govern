import styled from 'styled-components';
import { Grid, GridItem, Button, IconDown } from '@aragon/ui';

import DaoActionCard from '../DaoActionCard/DaoActionCard';

const ActionsList: React.FC = () => {
  return (
    <>
      <Grid columns={'4'}>
        <GridItem gridColumn={'1/3'}>
          <DaoActionCard />
        </GridItem>
        <GridItem gridColumn={'3/5'}>
          <DaoActionCard />
        </GridItem>
      </Grid>
      {/* <Button label="Load more" mode="strong" icon={<IconDown />} /> */}
    </>
  );
};

export default ActionsList;
