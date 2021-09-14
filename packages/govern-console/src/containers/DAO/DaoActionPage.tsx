import React from 'react';
import { textStyle, Button, GU, Grid, GridItem } from '@aragon/ui';

const DaoActionsPage: React.FC = () => {
  return (
    <>
      <Grid>
        <GridItem gridColumn={'4/17'} gridRow={'1/4'}>
          <div
            css={`
              display: flex;
              justify-content: space-between;
              width: 100%;
              margin-bottom: ${3 * GU}px;
            `}
          >
            <p
              css={`
                ${textStyle('title1')};
              `}
            >
              Actions
            </p>
            <Button label="New action" />
          </div>
        </GridItem>
      </Grid>
    </>
  );
};

export default DaoActionsPage;
