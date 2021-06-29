import React, { memo, ReactNode } from 'react';
import { Grid, GridItem, useLayout, Accordion, Box } from '@aragon/ui';
import { HelpText, PageName } from 'utils/HelpText';

type PageContentProps = {
  pageName: PageName;
  children: ReactNode;
};

const PageContent: React.FC<PageContentProps> = ({ pageName, children }) => {
  const { layoutName } = useLayout();

  return (
    <Grid layout={true}>
      <GridItem gridColumn={'1/13'} gridRow={'1/4'}>
        {children}
      </GridItem>
      <GridItem
        gridRow={layoutName === 'large' ? '1' : undefined}
        gridColumn={layoutName === 'large' ? '13/17' : '1 / -1'}
      >
        <Accordion items={HelpText[pageName]}></Accordion>
      </GridItem>
      <GridItem
        gridRow={layoutName === 'large' ? '2' : undefined}
        gridColumn={layoutName === 'large' ? '13/17' : '1 / -1'}
      >
        {/* TODO: To be moved to its own component*/}
        <Box style={{ background: '#8991FF', opacity: 0.5 }}>
          <h5 style={{ color: '#20232C' }}>Need Help?</h5>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default memo(PageContent);
